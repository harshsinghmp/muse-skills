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
 *     (63% / 69% as of 2026-11-10, 247 prompts). The gate is a regression floor, not a quality target.
 *
 * Usage:
 *   bun scripts/eval-routing.ts [--json] [--verbose] [--min-exact 0.72] [--min-skill 0.75]
 *   bun scripts/eval-routing.ts --fixtures tests/fixtures/routing-eval/heldout.json  # honest set, validity only
 *
 * `--verbose` explains every miss instead of only labelling it: the prompt, the
 * expected and actual route, the winning department and its score, the runner-up
 * (or "none"), the top three modes of the winning department, and a one-line hint
 * naming the cause — `department miss` (wrong skill), `mode miss` (right skill,
 * wrong mode) or `fast path fired` (a regex rule short-circuited scoring).
 * With `--verbose --json` the same explanations ride along under a new
 * `explanations` key; the rest of the report keeps its existing keys and types.
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

/**
 * Why a fixture missed, in one of three buckets:
 *   - `department miss`  — the router picked the wrong skill (mode is moot),
 *   - `mode miss`        — right skill, wrong mode: a mode-ranking problem,
 *   - `fast path fired`  — a FAST_PATH_RULES regex short-circuited scoring, so
 *                          the miss is a rule problem, not a scoring problem.
 */
export type FailureHint = "department miss" | "mode miss" | "fast path fired";

export interface FailureExplanation {
  id: string;
  prompt: string;
  expected: string;
  actual: string;
  expectedDepartment: string;
  actualDepartment: string;
  /** The department `explainRouting` says won, with its lexical score (∞ on fast path). */
  winner: { department: string; score: number };
  runnerUp: { department: string; score: number } | null;
  /** Top 3 modes of the winning department, highest score first. */
  modes: Array<{ mode: string; score: number }>;
  fastPath: boolean;
  hint: FailureHint;
  hintDetail: string;
}

/** Score formatter: fast-path scores are +∞, which would print as "Infinity". */
function formatScore(score: number): string {
  return Number.isFinite(score) ? score.toFixed(1) : "∞";
}

export function explainFailure(failure: RoutingFailure): FailureExplanation {
  const why = explainRouting(failure.prompt);
  const expectedDepartment = failure.expected.split(":")[0];
  const actualDepartment = failure.actual.split(":")[0];
  const hint: FailureHint = why.fastPath
    ? "fast path fired"
    : expectedDepartment === actualDepartment
      ? "mode miss"
      : "department miss";
  const hintDetail =
    hint === "fast path fired"
      ? `a fast-path rule routed to ${failure.actual} before any lexical scoring (score ∞); fix the rule, not the weights`
      : hint === "mode miss"
        ? `right skill (${actualDepartment}), wrong mode: expected ${failure.expected.split(":")[1]}, got ${failure.actual.split(":")[1]}`
        : `wrong skill: expected ${expectedDepartment} (${failure.expected}), got ${actualDepartment} (${failure.actual})`;
  return {
    id: failure.id,
    prompt: failure.prompt,
    expected: failure.expected,
    actual: failure.actual,
    expectedDepartment,
    actualDepartment,
    winner: { department: why.department, score: why.departmentScore },
    runnerUp: why.runnerUp,
    modes: why.modes.slice(0, 3),
    fastPath: why.fastPath,
    hint,
    hintDetail,
  };
}

/** The verbose per-failure block: five labelled lines under the existing miss line. */
export function formatFailureExplanation(explanation: FailureExplanation): string[] {
  const runnerUp = explanation.runnerUp
    ? `${explanation.runnerUp.department} (${formatScore(explanation.runnerUp.score)})`
    : "none";
  const modes =
    explanation.modes.map((mode) => `${mode.mode}=${formatScore(mode.score)}`).join(", ") ||
    "none (no modes on this department)";
  return [
    `       prompt   : "${explanation.prompt}"`,
    `       route    : expected ${explanation.expected} → actual ${explanation.actual}`,
    `       winner   : ${explanation.winner.department} (${formatScore(explanation.winner.score)}) · runner-up: ${runnerUp}`,
    `       top modes: ${modes}`,
    `       hint     : ${explanation.hint} — ${explanation.hintDetail}`,
  ];
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
    minExact: parseThreshold(argValue("--min-exact"), 0.63),
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

  // Explanations are opt-in: the report shape above stays untouched, so `--json`
  // consumers that never pass `--verbose` see byte-identical output.
  // A failing gate explains itself: the top causes print without being asked.
  const explain = verbose || !report.passed;
  const explanations = explain ? [...report.invalidPredictions, ...report.failures].map(explainFailure) : [];
  const explanationById = new Map(explanations.map((explanation) => [explanation.id, explanation]));
  const printExplanation = (id: string): void => {
    if (!explain) return;
    const explanation = explanationById.get(id);
    if (explanation) for (const line of formatFailureExplanation(explanation)) console.error(line);
  };

  if (json) {
    // JSON shape stays opt-in: only --verbose adds the key, so consumers and
    // tests written against the old shape keep working on a failing gate.
    const payload = verbose ? { ...report, explanations } : report;
    console.log(JSON.stringify(payload, null, 2));
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
      printExplanation(failure.id);
    }
  }
  if (report.failures.length > 0 && (verbose || !report.passed)) {
    console.error("\n⚠️  Misroutes:");
    for (const failure of report.failures) {
      console.error(`   - ${failure.id} [${failure.reason}] expected ${failure.expected}, got ${failure.actual}`);
      printExplanation(failure.id);
    }
  }
  console.log(report.passed ? "\n✅ Routing quality gate passed." : "\n❌ Routing quality gate failed.");
  process.exit(report.passed ? 0 : 1);
}

if (import.meta.main) main();
