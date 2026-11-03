import { afterEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The instruction-adapter path was fenced at nested repository boundaries in
 * v8.1.1. The other write-capable modes (`--sanitize`, `--promote`,
 * `--hygiene --consolidate`) still traversed or wrote into nested clones.
 * These tests lock the same boundary across every write path.
 */

const REPO_ROOT = join(import.meta.dir, "..");
const UPDATEAGENTS_SCRIPT = join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");
const TEST_SANDBOX = join("/tmp", `ua-allmodes-${Date.now()}`);
const SYNTHETIC = "[[ORCA_RICH_MD:abc123:md:hello%20world]]";

function initGitRepo(dir: string): void {
  mkdirSync(dir, { recursive: true });
  const init = spawnSync("git", ["init", "-q"], { cwd: dir });
  if (init.status !== 0) throw new Error(`git init failed in ${dir}`);
}

function outputOf(run: ReturnType<typeof spawnSync>): string {
  return `${run.stdout ?? ""}\n${run.stderr ?? ""}`;
}

describe("🛡️ updateagents write-mode boundary fence", () => {
  afterEach(() => {
    rmSync(TEST_SANDBOX, { recursive: true, force: true });
  });

  it("refuses --sanitize from an umbrella directory and leaves nested clones byte-identical", () => {
    const parent = join(TEST_SANDBOX, "sanitize-umbrella");
    const repos = [join(parent, "repoA"), join(parent, "repoB")];
    for (const repo of repos) {
      initGitRepo(repo);
      mkdirSync(join(repo, "docs"), { recursive: true });
      writeFileSync(join(repo, "AGENTS.md"), "# Rules\n- keep\n", "utf8");
      writeFileSync(join(repo, "docs/note.md"), `${SYNTHETIC}\n`, "utf8");
    }

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, "--sanitize"], { cwd: parent, encoding: "utf8" });

    expect(run.status).not.toBe(0);
    expect(outputOf(run)).toContain("nested repositories");
    for (const repo of repos) {
      expect(readFileSync(join(repo, "docs/note.md"), "utf8")).toContain("ORCA_RICH_MD");
      expect(existsSync(join(repo, ".agents"))).toBe(false);
    }
    expect(existsSync(join(parent, ".agents"))).toBe(false);
  });

  it("refuses --promote from an umbrella directory without writing into the child repo", () => {
    const parent = join(TEST_SANDBOX, "promote-umbrella");
    const repo = join(parent, "repoA");
    initGitRepo(repo);
    writeFileSync(join(repo, "AGENTS.md"), "# Rules\n- keep\n", "utf8");
    writeFileSync(join(repo, "CLAUDE.md"), "# Claude Rules\n- Always run the test suite.\n", "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, "--promote", join(repo, "CLAUDE.md")], {
      cwd: parent,
      encoding: "utf8",
    });

    expect(run.status).not.toBe(0);
    expect(outputOf(run)).toContain("nested repositories");
    expect(readFileSync(join(repo, "CLAUDE.md"), "utf8")).toContain("Always run the test suite.");
    expect(existsSync(join(repo, ".agents"))).toBe(false);
  });

  it("refuses --hygiene --consolidate from an umbrella directory", () => {
    const parent = join(TEST_SANDBOX, "hygiene-umbrella");
    const repo = join(parent, "repoA");
    initGitRepo(repo);
    writeFileSync(join(repo, "AGENTS.md"), "# Rules\n- keep\n", "utf8");
    mkdirSync(join(parent, ".claude"), { recursive: true });
    writeFileSync(join(parent, ".claude/harness.md"), "# harness state\n", "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, "--hygiene", "--consolidate"], {
      cwd: parent,
      encoding: "utf8",
    });

    expect(run.status).not.toBe(0);
    expect(outputOf(run)).toContain("nested repositories");
    expect(existsSync(join(parent, ".claude/harness.md"))).toBe(true);
    expect(existsSync(join(parent, ".agents"))).toBe(false);
  });

  it("sanitizes the current repo but never descends into a nested clone", () => {
    const repo = join(TEST_SANDBOX, "sanitize-nested");
    initGitRepo(repo);
    mkdirSync(join(repo, "docs"), { recursive: true });
    writeFileSync(join(repo, "docs/root.md"), `${SYNTHETIC}\n`, "utf8");

    const nested = join(repo, "vendorclone");
    initGitRepo(nested);
    writeFileSync(join(nested, "README.md"), `${SYNTHETIC}\n`, "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, "--sanitize"], { cwd: repo, encoding: "utf8" });

    expect(run.status).toBe(0);
    expect(readFileSync(join(repo, "docs/root.md"), "utf8")).not.toContain("ORCA_RICH_MD");
    expect(readFileSync(join(nested, "README.md"), "utf8")).toContain("ORCA_RICH_MD");
  });

  it("refuses a --promote target that lives inside a nested clone", () => {
    const repo = join(TEST_SANDBOX, "promote-nested");
    initGitRepo(repo);
    writeFileSync(join(repo, "AGENTS.md"), "# Rules\n- keep\n", "utf8");

    const nested = join(repo, "vendorclone");
    initGitRepo(nested);
    writeFileSync(join(nested, "CLAUDE.md"), "# Nested Rules\n- Always run tests.\n", "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, "--promote", join(nested, "CLAUDE.md")], {
      cwd: repo,
      encoding: "utf8",
    });

    expect(run.status).not.toBe(0);
    expect(outputOf(run)).toContain("nested repository");
    expect(readFileSync(join(nested, "CLAUDE.md"), "utf8")).toContain("Always run tests.");
    expect(existsSync(join(nested, ".agents"))).toBe(false);
  });

  it("refuses a --promote target outside the workspace", () => {
    const repo = join(TEST_SANDBOX, "promote-outside");
    initGitRepo(repo);
    writeFileSync(join(repo, "AGENTS.md"), "# Rules\n- keep\n", "utf8");

    const outside = join(TEST_SANDBOX, "outside");
    mkdirSync(outside, { recursive: true });
    writeFileSync(join(outside, "CLAUDE.md"), "# Outside Rules\n- Always run tests.\n", "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, "--promote", join(outside, "CLAUDE.md")], {
      cwd: repo,
      encoding: "utf8",
    });

    expect(run.status).not.toBe(0);
    expect(outputOf(run)).toContain("outside the workspace");
    expect(readFileSync(join(outside, "CLAUDE.md"), "utf8")).toContain("Always run tests.");
    expect(existsSync(join(outside, ".agents"))).toBe(false);
  });
});
