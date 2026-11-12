import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runPortableDoctor } from "../skills/core-engine/updateagents/scripts/doctor";

function workspaceWithHook(contents: string): string {
  const root = mkdtempSync(join(tmpdir(), "muse-doctor-"));
  mkdirSync(join(root, ".git", "hooks"), { recursive: true });
  writeFileSync(join(root, ".git", "hooks", "pre-commit"), contents, "utf8");
  return root;
}

const checkFor = (root: string) =>
  runPortableDoctor({ home: join(root, "home"), workspace: root }).checks.find((check) => check.id === "branch-guard");

describe("doctor reports the repository safety net", () => {
  test("flags a clone whose pre-commit hook has no branch guard", () => {
    const root = workspaceWithHook("#!/bin/sh\nmemory harvest-auto\n");
    const check = checkFor(root);
    expect(check?.ok).toBe(false);
    expect(check?.detail).toContain("install-hooks.sh");
  });

  test("passes when the guard is installed", () => {
    const root = workspaceWithHook("#!/bin/sh\nbash scripts/hooks/branch-guard-pre-commit.sh || exit 1\n");
    expect(checkFor(root)?.ok).toBe(true);
  });

  test("is advisory — a missing guard does not make the device broken", () => {
    const root = workspaceWithHook("#!/bin/sh\n");
    const report = runPortableDoctor({ home: join(root, "home"), workspace: root });
    expect(report.checks.find((check) => check.id === "branch-guard")?.ok).toBe(false);
    // Report health is decided by the blocking checks, not this one.
    expect(report.ok).toBe(
      report.checks.every((check) => check.ok || ["version-marker", "branch-guard"].includes(check.id)),
    );
  });

  test("non-git directories are not flagged", () => {
    const root = mkdtempSync(join(tmpdir(), "muse-nogit-"));
    expect(checkFor(root)).toBeUndefined();
  });
});

describe("doctor --fix installs the guard", () => {
  test("runs the workspace installer when one exists", () => {
    const root = workspaceWithHook("#!/bin/sh\n");
    mkdirSync(join(root, "scripts", "hooks"), { recursive: true });
    writeFileSync(
      join(root, "scripts", "hooks", "install-hooks.sh"),
      '#!/bin/sh\nprintf "%s\\n" "bash scripts/hooks/branch-guard-pre-commit.sh" >> .git/hooks/pre-commit\n',
      "utf8",
    );
    const check = runPortableDoctor({ home: join(root, "home"), workspace: root, fix: true }).checks.find(
      (entry) => entry.id === "branch-guard",
    );
    expect(check?.ok).toBe(true);
    expect(check?.detail).toContain("installed by --fix");
  });

  test("leaves an installed device alone — no scripts tree, no attempt", () => {
    const root = workspaceWithHook("#!/bin/sh\n");
    const check = runPortableDoctor({ home: join(root, "home"), workspace: root, fix: true }).checks.find(
      (entry) => entry.id === "branch-guard",
    );
    expect(check?.ok).toBe(false);
    expect(check?.detail).toContain("install-hooks.sh");
  });
});
