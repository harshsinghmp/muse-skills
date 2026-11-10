import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import {
  buildBaseline,
  compareToBaseline,
  type DistributionResult,
  type RoutingBaseline,
} from "../scripts/check-routing-matrix";

const REPO_ROOT = join(import.meta.dir, "..");

function result(name: string, exact: number, department: number): DistributionResult {
  return {
    name,
    kind: "held-out",
    total: 40,
    exact,
    department,
    exactRate: exact / 40,
    departmentRate: department / 40,
    invalidPredictions: 0,
  };
}

describe("routing matrix", () => {
  test("any per-distribution drop is a regression, even when another improves", () => {
    const baseline: RoutingBaseline = {
      generatedAt: "2026-11-01",
      note: "",
      distributions: { a: { exact: 20, department: 25, total: 40 }, b: { exact: 10, department: 12, total: 40 } },
    };
    // a improves, b slips: the slip must still be reported.
    const regressions = compareToBaseline([result("a", 22, 26), result("b", 9, 12)], baseline);
    expect(regressions).toEqual([{ name: "b", metric: "exact", baseline: 10, current: 9 }]);
    expect(compareToBaseline([result("a", 20, 25), result("b", 10, 12)], baseline)).toEqual([]);
  });

  test("an unregistered distribution must be registered deliberately", () => {
    const baseline: RoutingBaseline = { generatedAt: "2026-11-01", note: "", distributions: {} };
    // Not "no regression": an unknown fixture is itself a defect, so a new blind
    // set cannot be added and silently ignored.
    expect(compareToBaseline([result("new", 3, 5)], baseline)).toEqual([
      { name: "new", metric: "unregistered", baseline: 0, current: 3 },
    ]);
    const built = buildBaseline([result("new", 3, 5)]);
    expect(built.distributions.new).toEqual({ exact: 3, department: 5, total: 40 });
  });

  test("the committed baseline holds for the current router", () => {
    // One run: --json already reports every distribution and the comparison.
    const gate = spawnSync("bun", ["scripts/check-routing-matrix.ts", "--json"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    expect(gate.status).toBe(0);
    const report = JSON.parse(gate.stdout) as {
      results: DistributionResult[];
      regressions: unknown[];
      invalidPredictions: number;
    };
    expect(report.results.length).toBeGreaterThanOrEqual(5);
    expect(report.results.map((entry) => entry.name)).toContain("v8");
    expect(report.results.every((entry) => entry.invalidPredictions === 0)).toBe(true);
    expect(report.regressions).toEqual([]);
    expect(report.invalidPredictions).toBe(0);
  }, 120_000);
});
