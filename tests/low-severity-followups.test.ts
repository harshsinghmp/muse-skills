import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  dispatchSwarmPlan,
  type SwarmPlan,
} from "../skills/context-orchestration/coupling-router/scripts/swarm-dispatcher";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const NEW_PROJECT = path.join(REPO_ROOT, "skills/core-engine/new-project/scripts/new-project.ts");
const INSTALLER = path.join(REPO_ROOT, "scripts/install.sh");

describe("low-severity follow-ups (#505)", () => {
  test("framework staging directories are unique, not timestamp-predictable", () => {
    const source = fs.readFileSync(NEW_PROJECT, "utf8");
    for (const prefix of ["instatic-scaffold-", "aria-upstream-", "atomic-payload-pack-"]) {
      expect(source).toContain(`mkdtempSync(join(os.tmpdir(), "${prefix}"))`);
    }
    expect(source).not.toMatch(/`(instatic-scaffold|aria-upstream|atomic-payload-pack)-\$\{Date\.now\(\)\}/);
  });

  test("the installer resolves symlinks before the new-project containment check", () => {
    if (process.platform === "win32") return;
    const installer = fs.readFileSync(INSTALLER, "utf8");
    expect(installer).toContain("pwd -P");
    expect(installer).toContain('RESOLVED_PROJECT_DIR="$(physical_path');
    const helper = installer.match(/physical_path\(\) \{[\s\S]*?\n\}/)?.[0];
    expect(helper).toBeTruthy();

    const root = fs.mkdtempSync(path.join(os.tmpdir(), "install-contain-"));
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "install-outside-"));
    try {
      fs.symlinkSync(outside, path.join(root, "link"), "dir");
      const target = path.join(root, "link", "new-project");
      const result = spawnSync("bash", ["-c", `${helper}\nphysical_path "$1"`, "bash", target], {
        encoding: "utf8",
      });
      expect(result.status).toBe(0);
      expect(result.stdout.trim()).toBe(path.join(fs.realpathSync(outside), "new-project"));
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  test("an invalid swarm plan reports zero executed tasks and names the defect", () => {
    const invalid: SwarmPlan = {
      planId: "invalid-plan",
      tasks: [
        { id: "a", name: "Task A" },
        { id: "a", name: "Duplicate A" },
      ],
    };
    const ledger = dispatchSwarmPlan(invalid);
    expect(ledger.totalTasks).toBe(2);
    expect(ledger.completedTasks).toBe(0);
    expect(ledger.failedTasks).toBe(0);
    expect(ledger.skippedTasks).toBe(0);
    expect(ledger.results).toEqual([]);
    expect(ledger.summary).toContain("no task ran");
    expect(ledger.summary).toContain("Duplicate task id: 'a'");
  });
});
