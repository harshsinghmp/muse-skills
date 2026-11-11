import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const REGISTRY = join(REPO_ROOT, "skills.json");

describe("registry sync is idempotent", () => {
  test("a sync on a clean tree leaves skills.json byte-identical", () => {
    const before = readFileSync(REGISTRY, "utf8");
    const run = spawnSync("python3", ["scripts/sync_registry.py"], { cwd: REPO_ROOT, encoding: "utf8" });
    const after = readFileSync(REGISTRY, "utf8");
    // Restore before asserting so a regression cannot dirty the working tree.
    if (before !== after) writeFileSync(REGISTRY, before, "utf8");

    expect(run.status).toBe(0);
    expect(after).toBe(before);
  }, 120_000);
});
