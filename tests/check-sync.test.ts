/**
 * Sync Gate — check-sync.ts
 *
 * Verifies the pre-merge freshness gate against real temporary Git repositories:
 * a branch that contains the latest integration branch passes, and a branch
 * that falls behind it fails with remediation.
 */
import { afterEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = join(import.meta.dir, "..", "scripts", "check-sync.ts");
const roots: string[] = [];

function run(cmd: string, args: string[], cwd: string) {
  const result = spawnSync(cmd, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} failed:\n${result.stdout}${result.stderr}`);
  }
  return result;
}

function git(cwd: string, ...args: string[]) {
  return run("git", args, cwd);
}

function commit(cwd: string, file: string, body: string) {
  writeFileSync(join(cwd, file), body);
  git(cwd, "add", file);
  git(cwd, "commit", "-m", `update ${file}`);
}

function setup() {
  const root = mkdtempSync(join(tmpdir(), "muse-check-sync-"));
  roots.push(root);
  const remote = join(root, "remote.git");
  const work = join(root, "work");

  git(root, "init", "--bare", remote);
  git(root, "init", "-b", "dev", work);
  git(work, "config", "user.email", "test@example.com");
  git(work, "config", "user.name", "Sync Test");
  git(work, "config", "commit.gpgsign", "false");
  git(work, "remote", "add", "origin", remote);
  commit(work, "README.md", "one\n");
  git(work, "push", "-u", "origin", "dev");

  return { root, remote, work };
}

function addRemoteCommit(remote: string, root: string, body: string) {
  const other = join(root, `other-${Date.now()}`);
  git(root, "clone", "-b", "dev", remote, other);
  git(other, "config", "user.email", "test@example.com");
  git(other, "config", "user.name", "Sync Test");
  git(other, "config", "commit.gpgsign", "false");
  commit(other, "remote.txt", body);
  git(other, "push", "origin", "dev");
}

function check(cwd: string, ...args: string[]) {
  const result = spawnSync("bun", [SCRIPT, ...args], { cwd, encoding: "utf8" });
  return { code: result.status ?? 1, out: `${result.stdout}${result.stderr}` };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("check-sync", () => {
  it("passes when the branch contains the latest integration branch", () => {
    const { work } = setup();
    git(work, "switch", "-c", "feat/synced");
    commit(work, "feature.txt", "feature\n");

    const result = check(work);
    expect(result.code).toBe(0);
    expect(result.out).toContain("SYNCED");
  });

  it("fails when the integration branch advances after the branch was cut", () => {
    const { root, remote, work } = setup();
    git(work, "switch", "-c", "feat/stale");
    commit(work, "feature.txt", "feature\n");
    addRemoteCommit(remote, root, "remote moved\n");

    const result = check(work);
    expect(result.code).toBe(1);
    expect(result.out).toContain("NOT SYNCED");
    expect(result.out).toContain("git rebase origin/dev");
  });

  it("can skip the local integration-branch check in CI", () => {
    const { root, remote, work } = setup();
    addRemoteCommit(remote, root, "remote moved\n");
    git(work, "fetch", "origin", "dev");
    git(work, "switch", "-c", "feat/from-remote", "origin/dev");

    expect(check(work).code).toBe(1);
    expect(check(work, "--no-local-base").code).toBe(0);
  });
});
