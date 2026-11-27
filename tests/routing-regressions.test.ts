import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { evaluateRouting, type RoutingFixture } from "../scripts/eval-routing";
import { getSkillModeCommands, getSkills } from "../scripts/export-commands";
import { triagePrompt } from "../skills/context-orchestration/secretary/scripts/secretary";

const REPO_ROOT = join(import.meta.dir, "..");
const REGRESSIONS = JSON.parse(
  readFileSync(join(REPO_ROOT, "tests/fixtures/routing-eval/regressions-v1.json"), "utf8"),
) as RoutingFixture[];
const routes = new Set(getSkillModeCommands(getSkills()).map((entry) => `${entry.skill}:${entry.mode}`));

describe("routing regressions from the P1 baseline", () => {
  test("every regression target is routable", () => {
    const invalid = REGRESSIONS.filter((fixture) => !routes.has(fixture.expect)).map(
      (fixture) => `${fixture.id}: ${fixture.expect}`,
    );
    expect(invalid).toEqual([]);
  });

  test("every mode-pair regression routes exactly", () => {
    const report = evaluateRouting(REGRESSIONS, routes, { minExact: 0, minSkill: 0 });
    expect(report.invalidPredictions).toEqual([]);
    expect(report.failures).toEqual([]);
    expect(report.exact).toBe(REGRESSIONS.length);
  });

  test("a press release mentioned, not requested, does not fire the growth fast path", () => {
    const prompt = "reads like a press release from a company that doesn't exist yet";
    const result = triagePrompt(prompt);
    expect(result.fastPath).toBe(false);
    expect(`${result.department}:${result.mode}`).toBe("humanize:audit");
  });
});
