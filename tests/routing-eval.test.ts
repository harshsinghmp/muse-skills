import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { evaluateRouting, type RoutingFixture } from "../scripts/eval-routing";
import { getSkillModeCommands, getSkills } from "../scripts/export-commands";
import {
  DEFAULT_MODE,
  explainRouting,
  FAST_PATH_RULES,
  loadAgencyDirectory,
  triagePrompt,
} from "../skills/context-orchestration/secretary/scripts/secretary";

const REPO_ROOT = join(import.meta.dir, "..");
const FIXTURES = JSON.parse(
  readFileSync(join(REPO_ROOT, "tests/fixtures/routing-eval/prompts.json"), "utf8"),
) as RoutingFixture[];

const routes = new Set(getSkillModeCommands(getSkills()).map((entry) => `${entry.skill}:${entry.mode}`));

describe("secretary routing surface", () => {
  test("the generated agency directory exposes modes for every department", () => {
    const directory = loadAgencyDirectory();
    expect(directory.length).toBe(46);
    const withoutModes = directory.filter((entry) => entry.modes.length === 0).map((entry) => entry.skill);
    expect(withoutModes).toEqual([]);
  });

  test("every fast-path target is a real skill:mode", () => {
    const phantoms = FAST_PATH_RULES.filter((rule) => !routes.has(`${rule.department}:${rule.mode}`)).map(
      (rule) => `${rule.department}:${rule.mode}`,
    );
    expect(phantoms).toEqual([]);
  });

  test("the two former phantom routes are gone", () => {
    // #before: code-review:audit and updateagents:sync had no references/<mode>.md
    expect(routes.has("code-review:audit")).toBe(false);
    expect(routes.has("updateagents:sync")).toBe(false);
    expect(triagePrompt("run lint and fix type-check errors")).toMatchObject({
      department: "code-review",
      mode: "triage-matrix",
    });
    expect(triagePrompt("sync context and update memory")).toMatchObject({
      department: "updateagents",
      mode: "memory-file-priorities",
    });
  });

  test("every default mode is a real route", () => {
    const skills = new Set(getSkills().map((skill) => skill.name));
    const broken = Object.entries(DEFAULT_MODE)
      .filter(([skill, mode]) => !skills.has(skill) || !routes.has(`${skill}:${mode}`))
      .map(([skill, mode]) => `${skill}:${mode}`);
    expect(broken).toEqual([]);
  });

  test("every fixture expectation is a routable skill:mode", () => {
    const invalid = FIXTURES.filter((fixture) => !routes.has(fixture.expect)).map(
      (fixture) => `${fixture.id}: ${fixture.expect}`,
    );
    expect(invalid).toEqual([]);
  });
});

describe("routing quality gate", () => {
  test("the fixture set is large, unique, and spans the departments", () => {
    expect(FIXTURES.length).toBeGreaterThanOrEqual(50);
    const ids = new Set(FIXTURES.map((fixture) => fixture.id));
    expect(ids.size).toBe(FIXTURES.length);
    const departments = new Set(FIXTURES.map((fixture) => fixture.expect.split(":")[0]));
    expect(departments.size).toBeGreaterThanOrEqual(30);
  });

  test("every fixture routes to a real skill:mode within the measured gate", () => {
    const report = evaluateRouting(FIXTURES, routes, { minExact: 0.72, minSkill: 0.75 });
    if (!report.passed) {
      const detail = [
        ...report.invalidExpectations,
        ...report.invalidPredictions.map((f) => `${f.id}: emitted ${f.actual}`),
        ...report.failures.map((f) => `${f.id}: expected ${f.expected}, got ${f.actual}`),
      ].join("\n");
      throw new Error(`routing gate failed (exact ${report.exactRate.toFixed(3)}):\n${detail}`);
    }
    expect(report.passed).toBe(true);
    expect(report.invalidPredictions).toEqual([]);
  });

  test("unseen prompts never emit a non-routable target", () => {
    // Held-out prompts are not tuned for: the assertion is validity, not accuracy.
    const heldOut = [
      "our login is broken on safari, can you look",
      "draft the quarterly board update",
      "set up a webhook receiver for stripe events",
      "make the onboarding emails sound less robotic",
      "our sitemap has duplicate canonical tags",
      "build an internal admin panel for support",
      "the mobile checkout button is cut off on iphone",
      "plan a two week content sprint for the newsletter",
      "estimate the infrastructure cost at 50k monthly users",
      "write the release notes for next month",
    ];
    for (const prompt of heldOut) {
      const result = triagePrompt(prompt);
      expect(routes.has(`${result.department}:${result.mode}`)).toBe(true);
    }
  });

  test("explainRouting reports the candidate modes for a routed prompt", () => {
    const explanation = explainRouting("generate a logo and brand identity");
    expect(explanation.department).toBe("design");
    expect(explanation.modes[0].mode).toBe("logo");
    expect(explanation.departmentScore).toBeGreaterThan(0);
  });
});
