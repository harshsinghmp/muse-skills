import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { evaluateRouting, type RoutingFixture } from "../scripts/eval-routing";
import { getSkillModeCommands, getSkills } from "../scripts/export-commands";

const REPO_ROOT = join(import.meta.dir, "..");
const HELDOUT = JSON.parse(
  readFileSync(join(REPO_ROOT, "tests/fixtures/routing-eval/heldout-v2.json"), "utf8"),
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

  test("held-out accuracy is measured and does not silently collapse", () => {
    const report = evaluateRouting(HELDOUT, routes, { minExact: 0, minSkill: 0 });
    // Baseline measured 2026-11-10, after intent signals: 50% exact / 57.5%
    // department (was 32.5% / 42.5% before). Floors sit below the measurement so
    // a real regression trips them; they are not quality targets.
    console.log(
      `[routing] held-out baseline: exact ${(report.exactRate * 100).toFixed(0)}% · department ${(report.departmentRate * 100).toFixed(0)}% (${report.exact}/${report.total})`,
    );
    expect(report.exactRate).toBeGreaterThanOrEqual(0.45);
    expect(report.departmentRate).toBeGreaterThanOrEqual(0.5);
  });
});
