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
