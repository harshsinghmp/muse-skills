#!/usr/bin/env bun
/**
 * eval-routing.ts — routing-quality gate for `secretary:dispatch`.
 *
 * The command surface (46 skills × modes) was always measurable; the router
 * behind it was not. The gate is a regression baseline over realistic prompts,
 * not a claim of generalisation — a miss means either the router or the
 * fixture's intent needs an explicit decision. This evaluates `triagePrompt` against a fixture set of
 * realistic prompts and fails CI when:
 *   - a fixture expects a route that does not exist (a phantom label),
 *   - the router emits a route that does not exist (a phantom prediction),
 *   - exact skill:mode accuracy or department accuracy drops below the MEASURED floor
 *     (64% / 68% as of 2026-11-10, 247 prompts). The gate is a regression floor, not a quality target.
 *
 * Usage:
 *   bun scripts/eval-routing.ts [--json] [--verbose] [--min-exact 0.72] [--min-skill 0.75]
 *   bun scripts/eval-routing.ts --fixtures tests/fixtures/routing-eval/heldout.json  # honest set, validity only
 */

import { readFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { explainRouting, triagePrompt } from "../skills/context-orchestration/secretary/scripts/secretary";
import { getSkillModeCommands, getSkills } from "./export-commands";

const REPO_ROOT = join(import.meta.dir, "..");
const FIXTURE_PATH = join(REPO_ROOT, "tests", "fixtures", "routing-eval", "prompts.json");

function pathJoin(target: string): string {
  return isAbsolute(target) ? target : resolve(REPO_ROOT, target);
}

export interface RoutingFixture {
  id: string;
  prompt: string;
  expect: string;
  note?: string;
}

export interface RoutingFailure {
  id: string;
  prompt: string;
  expected: string;
  actual: string;
  reason: "mode" | "department" | "invalid-prediction";
}

export interface RoutingReport {
  total: number;
  exact: number;
  departmentMatches: number;
  exactRate: number;
  departmentRate: number;
  fastPath: number;
  invalidExpectations: string[];
  invalidPredictions: RoutingFailure[];
  failures: RoutingFailure[];
  thresholds: { minExact: number; minSkill: number };
  passed: boolean;
}

function parseThreshold(raw: string | undefined, fallback: number): number {
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`--min-exact/--min-skill must be a number between 0 and 1 (received "${raw}").`);
  }
  return value;
}

export function evaluateRouting(
  fixtures: RoutingFixture[],
  routes: Set<string>,
  thresholds: { minExact: number; minSkill: number },
): RoutingReport {
  const invalidExpectations: string[] = [];
  const invalidPredictions: RoutingFailure[] = [];
  const failures: RoutingFailure[] = [];
  let exact = 0;
  let departmentMatches = 0;
  let fastPath = 0;

  for (const fixture of fixtures) {
    if (!/^[a-z0-9-]+:[a-z0-9-]+$/.test(fixture.expect)) {
      invalidExpectations.push(`${fixture.id}: malformed expectation "${fixture.expect}"`);
      continue;
    }
    if (!routes.has(fixture.expect)) {
      invalidExpectations.push(`${fixture.id}: "${fixture.expect}" is not a routable skill:mode`);
      continue;
    }
    const expectedDepartment = fixture.expect.split(":")[0];
    const result = triagePrompt(fixture.prompt);
    const actual = `${result.department}:${result.mode}`;
    if (result.fastPath) fastPath += 1;

    if (!routes.has(actual)) {
      invalidPredictions.push({
        id: fixture.id,
        prompt: fixture.prompt,
        expected: fixture.expect,
        actual,
        reason: "invalid-prediction",
      });
      continue;
    }
    if (result.department === expectedDepartment) departmentMatches += 1;
    if (actual === fixture.expect) {
      exact += 1;
    } else {
      failures.push({
        id: fixture.id,
        prompt: fixture.prompt,
        expected: fixture.expect,
        actual,
        reason: result.department === expectedDepartment ? "mode" : "department",
      });
    }
  }

  const scored = fixtures.length - invalidExpectations.length;
  const exactRate = scored === 0 ? 0 : exact / scored;
  const departmentRate = scored === 0 ? 0 : departmentMatches / scored;
  return {
    total: fixtures.length,
    exact,
    departmentMatches,
    exactRate,
    departmentRate,
    fastPath,
    invalidExpectations,
    invalidPredictions,
    failures,
    thresholds,
    passed:
      scored > 0 &&
      invalidExpectations.length === 0 &&
      invalidPredictions.length === 0 &&
      exactRate >= thresholds.minExact &&
      departmentRate >= thresholds.minSkill,
  };
}

function main(): void {
  const args = Bun.argv.slice(2);
  const json = args.includes("--json");
  const verbose = args.includes("--verbose");
  const argValue = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    return index === -1 ? undefined : args[index + 1];
  };
  const thresholds = {
    minExact: parseThreshold(argValue("--min-exact"), 0.64),
    minSkill: parseThreshold(argValue("--min-skill"), 0.7),
  };

  const fixturePath = argValue("--fixtures") ? pathJoin(argValue("--fixtures") as string) : FIXTURE_PATH;
  const fixtures = JSON.parse(readFileSync(fixturePath, "utf8")) as RoutingFixture[];
  const ids = new Set<string>();
  const duplicates: string[] = [];
  for (const fixture of fixtures) {
    if (ids.has(fixture.id)) duplicates.push(fixture.id);
    ids.add(fixture.id);
  }

  const routes = new Set(getSkillModeCommands(getSkills()).map((entry) => `${entry.skill}:${entry.mode}`));
  const report = evaluateRouting(fixtures, routes, thresholds);
  if (duplicates.length > 0) {
    report.invalidExpectations.push(`duplicate fixture ids: ${duplicates.join(", ")}`);
    report.passed = false;
  }

  if (json) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.passed ? 0 : 1);
  }

  const pct = (value: number) => `${(value * 100).toFixed(1)}%`;
  console.log(
    `🎯 Routing eval — ${fixturePath.replace(`${REPO_ROOT}/`, "")} · ${report.total} prompt(s), ${routes.size} routable modes`,
  );
  console.log(
    `   • exact skill:mode : ${report.exact}/${report.total - report.invalidExpectations.length} (${pct(report.exactRate)}) · gate ${pct(thresholds.minExact)}`,
  );
  console.log(
    `   • department only  : ${report.departmentMatches}/${report.total - report.invalidExpectations.length} (${pct(report.departmentRate)}) · gate ${pct(thresholds.minSkill)}`,
  );
  console.log(`   • fast-path hits   : ${report.fastPath}`);

  if (report.invalidExpectations.length > 0) {
    console.error("\n❌ Invalid fixture expectations:");
    for (const problem of report.invalidExpectations) console.error(`   - ${problem}`);
  }
  if (report.invalidPredictions.length > 0) {
    console.error("\n❌ Router emitted non-routable targets:");
    for (const failure of report.invalidPredictions) {
      console.error(`   - ${failure.id}: ${failure.actual} (prompt: "${failure.prompt}")`);
    }
  }
  if (report.failures.length > 0 && (verbose || !report.passed)) {
    console.error("\n⚠️  Misroutes:");
    for (const failure of report.failures) {
      console.error(`   - ${failure.id} [${failure.reason}] expected ${failure.expected}, got ${failure.actual}`);
      if (verbose) {
        const why = explainRouting(failure.prompt);
        const runnerUp = why.runnerUp
          ? `; runner-up ${why.runnerUp.department} (${why.runnerUp.score.toFixed(1)})`
          : "";
        console.error(
          `       "${failure.prompt}" — ${failure.actual} scored ${why.departmentScore.toFixed(1)}${runnerUp}`,
        );
        console.error(
          `       modes: ${why.modes.map((mode) => `${mode.mode}=${mode.score.toFixed(1)}`).join(", ") || "none"}`,
        );
      }
    }
  }
  console.log(report.passed ? "\n✅ Routing quality gate passed." : "\n❌ Routing quality gate failed.");
  process.exit(report.passed ? 0 : 1);
}

if (import.meta.main) main();
