import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const UPDATEAGENTS = join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");
const SANDBOX = join(tmpdir(), `harness-hygiene-test-${Date.now()}`);

function run(target: string, args: string[], env: Record<string, string> = {}) {
  return spawnSync("bun", [UPDATEAGENTS, target, ...args], {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env: { ...process.env, ...env },
  });
}

function git(target: string, args: string[]) {
  return spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.com", ...args], {
    cwd: target,
    encoding: "utf8",
  });
}

function write(target: string, rel: string, content: string) {
  const full = join(target, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
}

function bootstrap(target: string) {
  mkdirSync(target, { recursive: true });
  git(target, ["init", "-q"]);
  write(target, "package.json", JSON.stringify({ name: "hygiene-fixture", version: "1.0.0" }, null, 2));
  write(target, "README.md", "# Hygiene Fixture\n\nBaseline.\n");
  write(target, ".gitignore", "# Public-safe only\nnode_modules/\n");
  write(target, ".agents/context/current.md", "# Current\n\n## 1. Verified Shipped Reality\n- baseline\n");
  write(target, ".claude/settings.json", '{"hooks":{}}\n');
  write(target, "GEMINI.md", "# Rules\n\n- Always run tests before committing.\n");
  write(target, "transcripts/session.jsonl", '{"message":"hello"}\n');
  write(target, ".vscode/settings.json", '{"editor":"vscode"}\n');
  write(target, ".playwright/cache.txt", "cache\n");
  git(target, ["add", "-A"]);
  git(target, ["commit", "-qm", "chore: baseline"]);
}

describe("updateagents harness hygiene", () => {
  beforeEach(() => {
    rmSync(SANDBOX, { recursive: true, force: true });
    mkdirSync(SANDBOX, { recursive: true });
  });

  afterEach(() => {
    rmSync(SANDBOX, { recursive: true, force: true });
  });

  it("detects artifacts, skips the active harness, and reports proposed actions", () => {
    const target = join(SANDBOX, "scan");
    bootstrap(target);
    const res = run(target, ["--hygiene", "--json"], { CLAUDECODE: "1" });
    expect(res.status, res.stderr).toBe(0);
    const data = JSON.parse(res.stdout);
    expect(data.active.path).toBe(".claude");
    const actions = Object.fromEntries(data.findings.map((f: { path: string; action: string }) => [f.path, f.action]));
    expect(actions[".claude"]).toBe("SKIPPED_ACTIVE");
    expect(actions["GEMINI.md"]).toBe("PROMOTE");
    expect(actions.transcripts).toBe("ARCHIVE");
    expect(actions[".vscode"]).toBe("IGNORE_ONLY");
    expect(actions[".playwright"]).toBe("PURGE");
  }, 30_000);

  it("consolidates non-active artifacts, preserves the active harness, and writes a manifest", () => {
    const target = join(SANDBOX, "consolidate");
    bootstrap(target);
    const res = run(target, ["--hygiene", "--consolidate", "--json"], { CLAUDECODE: "1" });
    expect(res.status, res.stderr).toBe(0);
    const data = JSON.parse(res.stdout);
    expect(data.promoted).toContain("GEMINI.md");
    expect(data.archived).toContain("transcripts");
    expect(existsSync(join(target, "GEMINI.md"))).toBe(false);
    expect(existsSync(join(target, "transcripts"))).toBe(false);
    expect(existsSync(join(target, ".claude/settings.json"))).toBe(true);
    expect(existsSync(join(target, ".vscode/settings.json"))).toBe(true);
    expect(existsSync(join(target, ".playwright/cache.txt"))).toBe(true);
    expect(data.manifestPath).toBeTruthy();
    expect(readFileSync(data.manifestPath, "utf8")).toContain("transcripts");
  }, 30_000);

  it("installs local-only excludes without touching the committed .gitignore", () => {
    const target = join(SANDBOX, "excludes");
    bootstrap(target);
    const gitignoreBefore = readFileSync(join(target, ".gitignore"), "utf8");
    const first = run(target, ["--install-excludes", "--json"]);
    expect(first.status, first.stderr).toBe(0);
    const data = JSON.parse(first.stdout);
    expect(data.ok).toBe(true);
    expect(data.path).toBe(join(target, ".git/info/exclude"));
    expect(data.patterns).toBeGreaterThan(20);
    const exclude = readFileSync(join(target, ".git/info/exclude"), "utf8");
    expect(exclude).toContain("muse agent hygiene");
    expect(exclude).toContain(".agents/");
    expect(exclude).toContain(".memory/");
    expect(readFileSync(join(target, ".gitignore"), "utf8")).toBe(gitignoreBefore);

    run(target, ["--install-excludes", "--json"]);
    expect((readFileSync(join(target, ".git/info/exclude"), "utf8").match(/muse agent hygiene/g) ?? []).length).toBe(2);
  }, 30_000);

  it("fails the public-surface gate when internal paths are tracked", () => {
    const target = join(SANDBOX, "public");
    bootstrap(target);
    const bad = run(target, ["--hygiene", "--check-public", "--json"]);
    expect(bad.status).toBe(1);
    const data = JSON.parse(bad.stdout);
    expect(data.ok).toBe(false);
    expect(data.tracked).toContain(".agents/context/current.md");
    expect(data.historyWarnings.length).toBeGreaterThan(0);

    git(target, ["rm", "-r", "--cached", "-q", ".agents", ".claude", ".playwright", "transcripts", ".vscode"]);
    git(target, ["commit", "-qm", "chore: untrack internal agent state"]);
    const good = run(target, ["--hygiene", "--check-public", "--json"]);
    expect(good.status, good.stderr).toBe(0);
    expect(JSON.parse(good.stdout).tracked).toEqual([]);
  }, 30_000);

  it("requires --yes for purge and never purges the active harness", () => {
    const target = join(SANDBOX, "purge");
    bootstrap(target);
    const blocked = run(target, ["--hygiene", "--purge", "--json"], { CLAUDECODE: "1" });
    expect(blocked.status).toBe(1);
    expect(JSON.parse(blocked.stdout).reason).toContain("--yes");
    expect(existsSync(join(target, ".playwright/cache.txt"))).toBe(true);

    const purged = run(target, ["--hygiene", "--purge", "--yes", "--json"], { CLAUDECODE: "1" });
    expect(purged.status, purged.stderr).toBe(0);
    expect(existsSync(join(target, ".playwright"))).toBe(false);
    expect(existsSync(join(target, ".claude/settings.json"))).toBe(true);
  }, 30_000);
});
