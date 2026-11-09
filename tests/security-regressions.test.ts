import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { recordTokenUsage } from "../skills/agency-delivery/accounts/scripts/token-ledger";
import { quarantineWorktree } from "../skills/context-orchestration/coupling-router/scripts/worktree-federation";

const REPO_ROOT = path.resolve(__dirname, "..");
const SECRET_SCAN = path.join(REPO_ROOT, "skills/quality-review/muse-security/scripts/secret-scan.ts");
const PRE_COMMIT = path.join(REPO_ROOT, "scripts/hooks/secret-scan-pre-commit.sh");
const PRE_PUSH = path.join(REPO_ROOT, "scripts/hooks/harness-hygiene-pre-push.sh");
const HYGIENE_PRE_COMMIT = path.join(REPO_ROOT, "scripts/hooks/harness-hygiene-pre-commit.sh");

function git(cwd: string, args: string[]) {
  return spawnSync("git", args, { cwd, encoding: "utf8" });
}

function makeRepo(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "security-regress-"));
  git(dir, ["init", "-q"]);
  git(dir, ["config", "user.email", "audit@example.com"]);
  git(dir, ["config", "user.name", "Audit"]);
  fs.writeFileSync(path.join(dir, "tracked.txt"), "clean\n", "utf8");
  git(dir, ["add", "."]);
  git(dir, ["commit", "-q", "-m", "init"]);
  return dir;
}

describe("security regressions: data loss", () => {
  test("a corrupt token ledger is backed up and never overwritten", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "token-ledger-"));
    try {
      const ledger = path.join(dir, "ledger.json");
      fs.writeFileSync(ledger, "{not-json", "utf8");

      expect(() => recordTokenUsage(ledger, "client", "gpt-4o", 10, 10)).toThrow(/corrupt token ledger/i);

      const backups = fs.readdirSync(dir).filter((name) => name.startsWith("ledger.json.corrupt-"));
      expect(backups).toHaveLength(1);
      expect(fs.readFileSync(path.join(dir, backups[0]), "utf8")).toBe("{not-json");
      expect(fs.existsSync(ledger)).toBe(false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("quarantine captures the actual WIP tree before cleaning the worktree", () => {
    const dir = makeRepo();
    try {
      fs.writeFileSync(path.join(dir, "tracked.txt"), "uncommitted work\n", "utf8");
      fs.writeFileSync(path.join(dir, "new-file.txt"), "untracked work\n", "utf8");

      const result = quarantineWorktree(dir, "regression test");
      expect(result.success, result.message).toBe(true);
      expect(result.quarantineRef).toStartWith("refs/quarantine/");

      const tree = spawnSync("git", ["ls-tree", "-r", result.quarantineRef], { cwd: dir, encoding: "utf8" });
      expect(tree.stdout).toContain("tracked.txt");
      expect(tree.stdout).toContain("new-file.txt");

      const shown = spawnSync("git", ["show", `${result.quarantineRef}:tracked.txt`], { cwd: dir, encoding: "utf8" });
      expect(shown.stdout).toContain("uncommitted work");

      expect(fs.readFileSync(path.join(dir, "tracked.txt"), "utf8")).toBe("clean\n");
      expect(fs.existsSync(path.join(dir, "new-file.txt"))).toBe(false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("secret-scan inspects secret-bearing dotfiles and skips symlinks", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "secret-scan-"));
    try {
      const token = `ghp_${"A".repeat(30)}`;
      fs.writeFileSync(path.join(dir, ".env.production"), `GITHUB_TOKEN=${token}\n`, "utf8");

      const found = spawnSync("bun", [SECRET_SCAN, dir, "--json"], { encoding: "utf8" });
      expect(found.status).toBe(1);
      expect(found.stdout).toContain(".env.production");

      const clean = fs.mkdtempSync(path.join(os.tmpdir(), "secret-scan-clean-"));
      try {
        fs.writeFileSync(path.join(clean, "notes.md"), "no credentials here\n", "utf8");
        try {
          fs.symlinkSync(path.join(dir, ".env.production"), path.join(clean, "link.env"));
        } catch {
          // Symlinks may be unavailable on Windows; the dotfile assertion still covers the regression.
        }
        const skipped = spawnSync("bun", [SECRET_SCAN, clean, "--json"], { encoding: "utf8" });
        expect(skipped.status).toBe(0);
      } finally {
        fs.rmSync(clean, { recursive: true, force: true });
      }
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("the pre-commit secret gate blocks by default", () => {
    const dir = makeRepo();
    try {
      fs.writeFileSync(path.join(dir, "config.ts"), `API_KEY=sk-${"B".repeat(24)}\n`, "utf8");
      git(dir, ["add", "config.ts"]);

      const blocked = spawnSync("bash", [PRE_COMMIT], { cwd: dir, encoding: "utf8" });
      expect(blocked.status).toBe(1);

      const advisory = spawnSync("bash", [PRE_COMMIT, "--advisory"], { cwd: dir, encoding: "utf8" });
      expect(advisory.status).toBe(0);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("hygiene hooks fail closed when the checker is unavailable", () => {
    const dir = makeRepo();
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "home-"));
    try {
      for (const hook of [PRE_PUSH, HYGIENE_PRE_COMMIT]) {
        const res = spawnSync("bash", [hook], {
          cwd: dir,
          encoding: "utf8",
          env: { ...process.env, HOME: home },
        });
        expect(res.status, `${path.basename(hook)}: ${res.stderr}`).toBe(1);
      }

      const override = spawnSync("bash", [PRE_PUSH], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, HOME: home, MUSE_HYGIENE_SKIP: "1" },
      });
      expect(override.status).toBe(0);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(home, { recursive: true, force: true });
    }
  });

  test("refusing to snapshot leaves the worktree untouched", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "quarantine-nogit-"));
    try {
      fs.writeFileSync(path.join(dir, "file.txt"), "work\n", "utf8");
      const result = quarantineWorktree(dir, "no repo");
      expect(result.success).toBe(false);
      expect(fs.readFileSync(path.join(dir, "file.txt"), "utf8")).toBe("work\n");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("security regressions: fail-closed gates and path containment", () => {
  const ANCHOR = path.join(REPO_ROOT, "skills/context-orchestration/context-anchor/scripts/anchor.ts");
  const SWARM = path.join(REPO_ROOT, "skills/context-orchestration/coupling-router/scripts/swarm-dispatcher.ts");
  const WISDOM = path.join(REPO_ROOT, "skills/reflection-maintenance/coach/scripts/wisdom-updater.ts");

  test("anchor refuses to pin a file outside the workspace", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "anchor-escape-"));
    try {
      const res = spawnSync("bun", [ANCHOR, "--pin", "../../etc/passwd:root", "--json"], {
        cwd: dir,
        encoding: "utf8",
      });
      expect(res.status).toBe(1);
      expect(res.stdout).toContain("resolves outside the workspace");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("updateagents rejects sub-app names that traverse directories", async () => {
    const { sliceSubAppContext } = await import("../skills/core-engine/updateagents/scripts/updateagents");
    expect(() => sliceSubAppContext("/tmp/workspace", "../../escape")).toThrow(/Invalid sub-app name/);
  });

  test("wisdom updater rejects a traversal domain", () => {
    const res = spawnSync("bun", [WISDOM, "--domain", "../../escape", "--observation", "x"], {
      encoding: "utf8",
    });
    expect(res.status).toBe(1);
    expect(res.stderr).toContain("Invalid wisdom domain");
  });

  test("living-deliverable rejects a traversal slug", async () => {
    const { checkDeliverableExpiry } = await import("../skills/agency-delivery/devops/scripts/living-deliverable");
    expect(() => checkDeliverableExpiry("/tmp/workspace", "../../etc")).toThrow(/Invalid deliverable slug/);
  });

  test("swarm dispatcher rejects non-numeric budgets instead of running with NaN", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "swarm-"));
    try {
      const plan = path.join(dir, "plan.json");
      fs.writeFileSync(plan, "{}", "utf8");
      const res = spawnSync("bun", [SWARM, "--plan", plan, "--max-tokens", "abc"], {
        encoding: "utf8",
      });
      expect(res.status).toBe(2);
      expect(res.stderr).toContain("--max-tokens must be a positive integer");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("MCP audit does not treat a localhost-prefixed hostname as loopback", async () => {
    const { auditServerConfig } = await import("../skills/quality-review/muse-security/scripts/mcp-sanitizer");
    type Config = Parameters<typeof auditServerConfig>[0];
    const config = {
      mcpServers: { evil: { transport: "http", url: "http://localhost.evil.com:8080/mcp" } },
    } as unknown as Config;
    const result = auditServerConfig(config);
    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.target === "server:evil.url")).toBe(true);
  });

  test("MCP payload audit returns redacted arguments", async () => {
    const { auditToolPayload } = await import("../skills/quality-review/muse-security/scripts/mcp-sanitizer");
    const result = auditToolPayload("tool", {
      apiKey: `sk-${"a".repeat(40)}`,
      nested: { header: "Bearer abcdefghijklmnopqrstuvwxyz" },
    });
    const serialized = JSON.stringify(result.sanitizedArgs);
    expect(serialized).not.toContain("aaaaaaaa");
    expect(serialized).toContain("[REDACTED]");
  });

  test("lockfile audit fails closed when the lockfile is missing", async () => {
    const { auditLockfile } = await import("../skills/quality-review/code-review/scripts/code-review");
    const result = auditLockfile(path.join(os.tmpdir(), "does-not-exist-lock.json"));
    expect(result.passed).toBe(false);
    expect(result.suspiciousRegistries.join(" ")).toContain("missing");
  });

  test("telegram payload escapes HTML in alert text", async () => {
    const { formatTelegramPayload } = await import("../skills/agency-delivery/automation/scripts/alert-router");
    const payload = formatTelegramPayload({
      tier: "P1",
      title: "<script>alert(1)</script>",
      message: "<b>pwn</b>",
      service: "api",
    });
    expect(payload.text).toContain("&lt;script&gt;");
    expect(payload.text).not.toContain("<script>");
  });

  test("export-commands refuses registry paths that escape the repository", async () => {
    const { resolveSkillSourceDir } = await import("../scripts/export-commands");
    type Skill = Parameters<typeof resolveSkillSourceDir>[0];
    expect(() => resolveSkillSourceDir({ name: "escape", path: "../../etc/passwd" } as Skill)).toThrow(
      /escapes the repository/,
    );
  });

  test("worktree lease strips CR/LF from owner and scope", () => {
    const dir = makeRepo();
    try {
      const lease = path.join(REPO_ROOT, "skills/context-orchestration/coupling-router/scripts/worktree-lease.ts");
      const res = spawnSync(
        "bun",
        [lease, "probe", "--owner", "evil\nheartbeat: forged", "--scope", "a\nnotes: forged"],
        { cwd: dir, encoding: "utf8" },
      );
      expect(res.status).toBe(0);
      const leaseFile = path.join(dir, ".agents", "artifacts", "WORKTREE-LEASE.md");
      const text = fs.readFileSync(leaseFile, "utf8");
      expect(text).not.toContain("\nheartbeat: forged");
      expect(text).not.toContain("\nnotes: forged");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
