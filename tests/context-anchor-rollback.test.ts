import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const ANCHOR = path.join(REPO_ROOT, "skills/context-orchestration/context-anchor/scripts/anchor.ts");

function git(cwd: string, args: string[]) {
  return spawnSync("git", args, { cwd, encoding: "utf8" });
}

function makeRepo(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "anchor-rollback-"));
  git(dir, ["init", "-q"]);
  git(dir, ["config", "user.email", "audit@example.com"]);
  git(dir, ["config", "user.name", "Audit"]);
  fs.writeFileSync(path.join(dir, "a.txt"), "one\n", "utf8");
  fs.writeFileSync(path.join(dir, "b.txt"), "two\n", "utf8");
  git(dir, ["add", "."]);
  git(dir, ["commit", "-q", "-m", "init"]);
  return dir;
}

function anchor(dir: string, ...args: string[]) {
  return spawnSync("bun", [ANCHOR, dir, ...args], { encoding: "utf8" });
}

function withRepo(fn: (dir: string) => void) {
  const dir = makeRepo();
  try {
    fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe("context-anchor rollback safety", () => {
  test("refuses to roll back without --yes and leaves the worktree untouched", () => {
    withRepo((dir) => {
      fs.writeFileSync(path.join(dir, "a.txt"), "local edit\n", "utf8");

      const res = anchor(dir, "--rollback", "--json");
      expect(res.status).toBe(1);
      const payload = JSON.parse(res.stdout) as { success: boolean; rolledBack: boolean };
      expect(payload.success).toBe(false);
      expect(payload.rolledBack).toBe(false);
      expect(fs.readFileSync(path.join(dir, "a.txt"), "utf8")).toBe("local edit\n");
      expect(fs.existsSync(path.join(dir, ".agents/artifacts/rollbacks"))).toBe(false);
    });
  });

  test("snapshots the diff, reverts tracked files, and preserves untracked files", () => {
    withRepo((dir) => {
      fs.writeFileSync(path.join(dir, "a.txt"), "local edit\n", "utf8");
      fs.writeFileSync(path.join(dir, "b.txt"), "second edit\n", "utf8");
      fs.writeFileSync(path.join(dir, "untracked.txt"), "keep me\n", "utf8");

      const res = anchor(dir, "--rollback", "--yes", "--json");
      expect(res.status, res.stderr).toBe(0);
      const payload = JSON.parse(res.stdout) as {
        success: boolean;
        rolledBack: boolean;
        snapshotPath: string;
      };

      expect(payload.success).toBe(true);
      expect(payload.rolledBack).toBe(true);
      expect(fs.existsSync(payload.snapshotPath)).toBe(true);

      const snapshot = fs.readFileSync(payload.snapshotPath, "utf8");
      expect(snapshot).toContain("a.txt");
      expect(snapshot).toContain("b.txt");

      expect(fs.readFileSync(path.join(dir, "a.txt"), "utf8")).toBe("one\n");
      expect(fs.readFileSync(path.join(dir, "b.txt"), "utf8")).toBe("two\n");
      expect(fs.readFileSync(path.join(dir, "untracked.txt"), "utf8")).toBe("keep me\n");
    });
  });

  test("--scope limits the revert to the named paths", () => {
    withRepo((dir) => {
      fs.writeFileSync(path.join(dir, "a.txt"), "a changed\n", "utf8");
      fs.writeFileSync(path.join(dir, "b.txt"), "b changed\n", "utf8");

      const res = anchor(dir, "--rollback", "--yes", "--scope", "a.txt", "--json");
      expect(res.status, res.stderr).toBe(0);

      expect(fs.readFileSync(path.join(dir, "a.txt"), "utf8")).toBe("one\n");
      expect(fs.readFileSync(path.join(dir, "b.txt"), "utf8")).toBe("b changed\n");
    });
  });

  test("reports a no-op when there are no tracked changes", () => {
    withRepo((dir) => {
      const res = anchor(dir, "--rollback", "--yes", "--json");
      expect(res.status, res.stderr).toBe(0);
      const payload = JSON.parse(res.stdout) as { rolledBack: boolean; message: string };
      expect(payload.rolledBack).toBe(false);
      expect(payload.message).toContain("No tracked changes");
    });
  });
});

describe("context-anchor drop requires real state", () => {
  test("refuses --drop without --state or --next", () => {
    withRepo((dir) => {
      const res = anchor(dir, "--drop");
      expect(res.status).toBe(2);
      expect(res.stderr).toContain("requires --state <text> or --next <action>");
      expect(fs.existsSync(path.join(dir, ".agents/anchor.md"))).toBe(false);
    });
  });

  test("writes a real anchor when state is supplied", () => {
    withRepo((dir) => {
      const res = anchor(dir, "--drop", "--state", "Implemented JWT refresh", "--next", "src/auth.ts:42 — add tests");
      expect(res.status, res.stderr).toBe(0);

      const content = fs.readFileSync(path.join(dir, ".agents/anchor.md"), "utf8");
      expect(content).toContain("Implemented JWT refresh");
      expect(content).toContain("src/auth.ts:42");
      expect(content).not.toContain("Architectural decisions aligned with project specifications.");
      expect(content).not.toContain("src/index.ts:1");
    });
  });
});
