import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const HOOKS = path.join(REPO_ROOT, "scripts", "hooks");

function bashSyntax(file: string) {
  return spawnSync("bash", ["-n", file], { encoding: "utf8" });
}

function git(repo: string, args: string[]) {
  return spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.com", ...args], {
    cwd: repo,
    encoding: "utf8",
  });
}

describe("shell hook hardening", () => {
  test("hook scripts parse", () => {
    for (const name of [
      "worktree-lease-check.sh",
      "secret-scan-pre-commit.sh",
      "install-hooks.sh",
      "dead-letter-nightly.sh",
    ]) {
      const result = bashSyntax(path.join(HOOKS, name));
      expect(result.status, `${name}: ${result.stderr}`).toBe(0);
    }
  });

  test("worktree lease hook fails closed and points at the real probe", () => {
    const hook = fs.readFileSync(path.join(HOOKS, "worktree-lease-check.sh"), "utf8");
    expect(hook).toContain("skills/context-orchestration/coupling-router/scripts/worktree-lease.ts");
    expect(hook).toContain("probe --owner");
    expect(hook).not.toContain("|| true");
    expect(hook).toContain("exit 1");
  });

  test("installer rejects '..' before the prefix containment check", () => {
    const installer = fs.readFileSync(path.join(REPO_ROOT, "scripts", "install.sh"), "utf8");
    expect(installer).toContain('*"/../"*');
    expect(installer).toContain("must not contain '..' path segments");
  });

  test("crontab registration rejects shell metacharacters and does not clobber a failed read", () => {
    const hooks = fs.readFileSync(path.join(HOOKS, "install-hooks.sh"), "utf8");
    expect(hooks).toContain("*'$'*");
    expect(hooks).toContain("*'`'*");
    expect(hooks).toContain("failed for a reason other than an empty table");
    expect(hooks).not.toContain("(crontab -l 2>/dev/null; echo");
  });

  test("dead-letter nightly tolerates a missing fd and a non-numeric count", () => {
    const script = fs.readFileSync(path.join(HOOKS, "dead-letter-nightly.sh"), "utf8");
    expect(script).toContain("command -v fd");
    expect(script).toContain("*[!0-9]*) OPEN=0");
    expect(script).not.toContain("wc -l || echo");
  });

  test("pre-commit secret scan redacts the match and fails closed by default", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hook-secret-"));
    try {
      git(dir, ["init", "-q"]);
      const secret = `sk-${"a".repeat(40)}`;
      fs.writeFileSync(path.join(dir, "leak.ts"), `const KEY = "${secret}";\n`, "utf8");
      git(dir, ["add", "leak.ts"]);
      const outputPath = path.join(dir, "findings.json");
      const result = spawnSync(
        "bash",
        [path.join(HOOKS, "secret-scan-pre-commit.sh"), "--format", "json", "--output", outputPath],
        { cwd: dir, encoding: "utf8" },
      );
      expect(result.status).toBe(1);
      const payload = fs.readFileSync(outputPath, "utf8");
      expect(payload).toContain("[REDACTED]");
      expect(payload).not.toContain(secret);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
