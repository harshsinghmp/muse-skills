import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildCoverage, type Coverage, sameCoverage } from "../scripts/audit-routing-coverage";

const REPO_ROOT = join(import.meta.dir, "..");

describe("routing mode coverage", () => {
  test("the committed coverage file matches the router's actual signals", () => {
    const current = JSON.parse(readFileSync(join(REPO_ROOT, "routing-coverage.json"), "utf8")) as Coverage;
    expect(sameCoverage(current, buildCoverage())).toBe(true);

    const check = spawnSync("bun", ["scripts/audit-routing-coverage.ts"], { cwd: REPO_ROOT, encoding: "utf8" });
    expect(check.status).toBe(0);
    expect(check.stdout).toContain("curated");
  });

  test("coverage is a partition: curated + name-only equals the routable surface", () => {
    const coverage = buildCoverage();
    expect(coverage.curated + coverage.nameOnly.length).toBe(coverage.total);
    expect(new Set(coverage.nameOnly).size).toBe(coverage.nameOnly.length);
    expect(coverage.total).toBeGreaterThan(400);
    // Every name-only entry is a real route, never a bare skill.
    for (const route of coverage.nameOnly) expect(route).toMatch(/^[a-z0-9-]+:[a-z0-9-]+$/);
  });

  test("the name-only set may not grow silently", () => {
    const committed = JSON.parse(readFileSync(join(REPO_ROOT, "routing-coverage.json"), "utf8")) as Coverage;
    // New modes land as name-only unless someone curates them; the baseline is
    // the honest record. Growing it requires an explicit `sync:routing:coverage`.
    expect(buildCoverage().nameOnly.length).toBe(committed.nameOnly.length);
  });

  test("the README publishes the split", () => {
    const readme = readFileSync(join(REPO_ROOT, "README.md"), "utf8");
    const committed = JSON.parse(readFileSync(join(REPO_ROOT, "routing-coverage.json"), "utf8")) as Coverage;
    expect(readme).toContain(`${committed.curated} of ${committed.total} routable modes`);
  });
});
