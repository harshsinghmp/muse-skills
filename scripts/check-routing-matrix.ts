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

/**
 * Discovered from the directory, not a hardcoded list: a new blind set is picked
 * up automatically, and an unregistered one fails the gate until the baseline is
 * refreshed deliberately.
 */
function discoverDistributions(): Array<{ name: string; fixture: string; kind: "training" | "held-out" }> {
  const fixtures = fs.readdirSync(FIXTURES).filter((file) => file.endsWith(".json"));
  return fixtures
    .map((fixture) => {
      if (fixture === "prompts.json") return { name: "training", fixture, kind: "training" as const };
      const name = fixture.replace(/^heldout-/, "").replace(/\.json$/, "");
      return { name, fixture, kind: "held-out" as const };
    })
    .sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "training" ? -1 : 1));
}

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
  metric: "exact" | "department" | "unregistered";
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

export async function runMatrix(): Promise<DistributionResult[]> {
  const distributions = discoverDistributions();
  const evaluated = await Promise.all(distributions.map((distribution) => evaluate(distribution.fixture)));
  return distributions.map((distribution, index) => {
    const result = evaluated[index];
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
    if (!recorded) {
      // A fixture the baseline has never seen must be registered deliberately,
      // otherwise a new blind set could be added and silently ignored.
      regressions.push({ name: result.name, metric: "unregistered", baseline: 0, current: result.exact });
      continue;
    }
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

async function main(): Promise<void> {
  const args = Bun.argv.slice(2);
  const json = args.includes("--json");
  const results = await runMatrix();
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
        if (regression.metric === "unregistered") {
          console.error(
            `   - ${regression.name}: fixture not in the baseline — run sync:routing:baseline and explain it`,
          );
          continue;
        }
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

if (import.meta.main) await main();
