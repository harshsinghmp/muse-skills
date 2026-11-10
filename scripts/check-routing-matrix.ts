#!/usr/bin/env bun
/**
 * check-routing-matrix — every distribution must hold, not just the tuned set.
 *
 * A routing change that improves one set and quietly costs another is how the
 * router spent several rounds regressing while looking better. This runs every
 * fixture set and fails when ANY distribution drops below the committed
 * baseline, so "it moved the blind set" is a rebase-blocking question.
 *
 *   bun scripts/check-routing-matrix.ts            # gate
 *   bun scripts/check-routing-matrix.ts --update   # accept the current numbers
 *   bun scripts/check-routing-matrix.ts --json
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const BASELINE_PATH = path.join(REPO_ROOT, "routing-baseline.json");
const FIXTURES = path.join(REPO_ROOT, "tests", "fixtures", "routing-eval");

/** Distribution name → fixture. Training is the tuned set; the rest are unseen. */
const DISTRIBUTIONS: Array<{ name: string; fixture: string; kind: "training" | "held-out" }> = [
  { name: "training", fixture: "prompts.json", kind: "training" },
  { name: "v5-agency", fixture: "heldout-v5.json", kind: "held-out" },
  { name: "v6-engineering", fixture: "heldout-v6.json", kind: "held-out" },
  { name: "v7-blind", fixture: "heldout-v7.json", kind: "held-out" },
  { name: "v8-blind", fixture: "heldout-v8.json", kind: "held-out" },
];

export interface DistributionResult {
  name: string;
  kind: "training" | "held-out";
  total: number;
  exact: number;
  department: number;
  exactRate: number;
  departmentRate: number;
  invalidPredictions: number;
}

export interface RoutingBaseline {
  generatedAt: string;
  note: string;
  distributions: Record<string, { exact: number; department: number; total: number }>;
}

export interface MatrixRegression {
  name: string;
  metric: "exact" | "department";
  baseline: number;
  current: number;
}

function evaluate(fixture: string): { exact: number; department: number; total: number; invalid: number } {
  const result = spawnSync(
    "bun",
    [
      "scripts/eval-routing.ts",
      "--fixtures",
      path.join(FIXTURES, fixture),
      "--min-exact",
      "0",
      "--min-skill",
      "0",
      "--json",
    ],
    { cwd: REPO_ROOT, encoding: "utf8" },
  );
  if (!result.stdout.trim()) {
    throw new Error(`eval-routing produced no output for ${fixture}: ${result.stderr.trim()}`);
  }
  const report = JSON.parse(result.stdout) as {
    exact: number;
    departmentMatches: number;
    total: number;
    invalidPredictions: unknown[];
  };
  return {
    exact: report.exact,
    department: report.departmentMatches,
    total: report.total,
    invalid: report.invalidPredictions.length,
  };
}

export function runMatrix(): DistributionResult[] {
  return DISTRIBUTIONS.map((distribution) => {
    const result = evaluate(distribution.fixture);
    return {
      name: distribution.name,
      kind: distribution.kind,
      total: result.total,
      exact: result.exact,
      department: result.department,
      exactRate: result.total === 0 ? 0 : result.exact / result.total,
      departmentRate: result.total === 0 ? 0 : result.department / result.total,
      invalidPredictions: result.invalid,
    };
  });
}

export function compareToBaseline(results: DistributionResult[], baseline: RoutingBaseline): MatrixRegression[] {
  const regressions: MatrixRegression[] = [];
  for (const result of results) {
    const recorded = baseline.distributions[result.name];
    if (!recorded) continue; // a new distribution has nothing to regress against
    if (result.exact < recorded.exact) {
      regressions.push({ name: result.name, metric: "exact", baseline: recorded.exact, current: result.exact });
    }
    if (result.department < recorded.department) {
      regressions.push({
        name: result.name,
        metric: "department",
        baseline: recorded.department,
        current: result.department,
      });
    }
  }
  return regressions;
}

export function buildBaseline(results: DistributionResult[]): RoutingBaseline {
  return {
    generatedAt: new Date().toISOString().slice(0, 10),
    note: "Per-distribution routing results. A change may not lower any of these; run --update deliberately and explain it in the PR.",
    distributions: Object.fromEntries(
      results.map((result) => [
        result.name,
        { exact: result.exact, department: result.department, total: result.total },
      ]),
    ),
  };
}

function main(): void {
  const args = Bun.argv.slice(2);
  const json = args.includes("--json");
  const results = runMatrix();
  const invalid = results.filter((result) => result.invalidPredictions > 0);

  if (args.includes("--update")) {
    fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(buildBaseline(results), null, 2)}\n`, "utf8");
    console.log(`✅ routing baseline updated (${results.length} distributions)`);
    process.exit(0);
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")) as RoutingBaseline;
  const regressions = compareToBaseline(results, baseline);

  if (json) {
    console.log(JSON.stringify({ results, regressions, invalidPredictions: invalid.length }, null, 2));
  } else {
    console.log(`🎯 Routing matrix — baseline ${baseline.generatedAt}\n`);
    for (const result of results) {
      const recorded = baseline.distributions[result.name];
      const delta = recorded ? result.exact - recorded.exact : 0;
      const mark = delta < 0 ? "❌" : delta > 0 ? "📈" : "✅";
      console.log(
        `   ${mark} ${result.name.padEnd(16)} ${String(result.exact).padStart(3)}/${result.total} exact · ${result.department} dept ${recorded ? `(baseline ${recorded.exact})` : "(new)"}`,
      );
    }
    if (regressions.length > 0) {
      console.error("\n❌ Routing regressions against the baseline:");
      for (const regression of regressions) {
        console.error(`   - ${regression.name}: ${regression.metric} ${regression.baseline} → ${regression.current}`);
      }
      console.error("   Improve the change, or run --update and justify lowering the baseline in the PR.");
    }
    if (invalid.length > 0) {
      console.error(`\n❌ ${invalid.length} distribution(s) emitted non-routable routes.`);
    }
  }

  process.exit(regressions.length === 0 && invalid.length === 0 ? 0 : 1);
}

if (import.meta.main) main();
