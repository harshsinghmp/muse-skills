import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { evaluateRouting, type RoutingFixture } from "../scripts/eval-routing";
import { getSkillModeCommands, getSkills } from "../scripts/export-commands";

const REPO_ROOT = join(import.meta.dir, "..");
const HELDOUT = JSON.parse(
  readFileSync(join(REPO_ROOT, "tests/fixtures/routing-eval/heldout-v5.json"), "utf8"),
) as RoutingFixture[];
/**
 * A second held-out set written by a separate agent that deliberately chose
 * meta/engineering departments (git, code-review, evidence-ledger, relay) and
 * obscure modes. It measures a different distribution, not a harder version of
 * the same one — keep the two numbers separate.
 */
const ENGINEERING = JSON.parse(
  readFileSync(join(REPO_ROOT, "tests/fixtures/routing-eval/heldout-v6.json"), "utf8"),
) as RoutingFixture[];
/**
 * v7 was written blind AFTER the engineering vocabulary was added, to test
 * whether that vocabulary transfers. It does not: 2.5% exact / 20% department.
 * The floor here only catches further collapse — it is a known-weak
 * distribution, not a standard to defend.
 */
const CROSS_DOMAIN = JSON.parse(
  readFileSync(join(REPO_ROOT, "tests/fixtures/routing-eval/heldout-v7.json"), "utf8"),
) as RoutingFixture[];
/** v8: written blind after the anchors work; the standing check for new changes. */
const BLIND_V8 = JSON.parse(
  readFileSync(join(REPO_ROOT, "tests/fixtures/routing-eval/heldout-v8.json"), "utf8"),
) as RoutingFixture[];

const routes = new Set(getSkillModeCommands(getSkills()).map((entry) => `${entry.skill}:${entry.mode}`));

/**
 * Held-out routing set: written before it was ever scored, and deliberately
 * NOT used to tune the router. It measures generalisation, where the tuned
 * 87-prompt set measures regressions. Reported, not gated at the tuned level.
 */
describe("routing generalisation (held-out)", () => {
  test("every held-out expectation is a routable skill:mode", () => {
    const invalid = HELDOUT.filter((fixture) => !routes.has(fixture.expect)).map(
      (fixture) => `${fixture.id}: ${fixture.expect}`,
    );
    expect(invalid).toEqual([]);
    expect(HELDOUT.length).toBeGreaterThanOrEqual(40);
  });

  test("the router never emits a non-routable route on unseen prompts", () => {
    // Validity is hard-gated: a phantom target is a bug, not a quality miss.
    const report = evaluateRouting(HELDOUT, routes, { minExact: 0, minSkill: 0 });
    expect(report.invalidPredictions).toEqual([]);
    expect(report.total).toBe(HELDOUT.length);
  });

  test("engineering/meta held-out is measured separately (weak cover accepted)", () => {
    const report = evaluateRouting(ENGINEERING, routes, { minExact: 0, minSkill: 0 });
    expect(report.invalidPredictions).toEqual([]);
    // Baseline 2026-11-10: 12.5% exact / 30% department. The router's concept
    // vocabulary covers agency delivery; meta/engineering departments are the
    // long-tail gap this set exists to expose.
    console.log(
      `[routing] engineering held-out: exact ${(report.exactRate * 100).toFixed(0)}% · department ${(report.departmentRate * 100).toFixed(0)}% (${report.exact}/${report.total})`,
    );
    expect(report.exactRate).toBeGreaterThanOrEqual(0.1);
    expect(report.departmentRate).toBeGreaterThanOrEqual(0.25);
  });

  test("cross-domain held-out exposes the overfit (weak cover accepted)", () => {
    const report = evaluateRouting(CROSS_DOMAIN, routes, { minExact: 0, minSkill: 0 });
    expect(report.invalidPredictions).toEqual([]);
    console.log(
      `[routing] cross-domain held-out: exact ${(report.exactRate * 100).toFixed(0)}% · department ${(report.departmentRate * 100).toFixed(0)}% (${report.exact}/${report.total})`,
    );
    expect(report.exactRate).toBeGreaterThanOrEqual(0.02);
    expect(report.departmentRate).toBeGreaterThanOrEqual(0.18);
  });

  test("v8 blind set is the standing check for routing changes (weak cover accepted)", () => {
    const report = evaluateRouting(BLIND_V8, routes, { minExact: 0, minSkill: 0 });
    expect(report.invalidPredictions).toEqual([]);
    console.log(
      `[routing] v8 blind: exact ${(report.exactRate * 100).toFixed(0)}% · department ${(report.departmentRate * 100).toFixed(0)}% (${report.exact}/${report.total})`,
    );
    expect(report.exactRate).toBeGreaterThanOrEqual(0.03);
    expect(report.departmentRate).toBeGreaterThanOrEqual(0.18);
  });

  test("held-out accuracy is measured and does not silently collapse", () => {
    const report = evaluateRouting(HELDOUT, routes, { minExact: 0, minSkill: 0 });
    // v5 baseline measured 2026-11-10, after concept modes could outrank a bare
    // mode-name match: 55% exact / 70% department (was 50% / 70%). Floors sit
    // below the measurement so a regression trips them; they are not targets.
    console.log(
      `[routing] held-out baseline: exact ${(report.exactRate * 100).toFixed(0)}% · department ${(report.departmentRate * 100).toFixed(0)}% (${report.exact}/${report.total})`,
    );
    expect(report.exactRate).toBeGreaterThanOrEqual(0.52);
    expect(report.departmentRate).toBeGreaterThanOrEqual(0.66);
  });
});
