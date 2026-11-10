import { afterAll, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  evaluateRouting,
  explainFailure,
  formatFailureExplanation,
  type RoutingFailure,
  type RoutingFixture,
} from "../scripts/eval-routing";
import { getSkillModeCommands, getSkills } from "../scripts/export-commands";
import { triagePrompt } from "../skills/context-orchestration/secretary/scripts/secretary";

const REPO_ROOT = join(import.meta.dir, "..");
const routes = new Set(getSkillModeCommands(getSkills()).map((entry) => `${entry.skill}:${entry.mode}`));

/** The report keys `evaluateRouting` has always returned — `--json` must not change these. */
const REPORT_KEYS = [
  "departmentMatches",
  "departmentRate",
  "exact",
  "exactRate",
  "failures",
  "fastPath",
  "invalidExpectations",
  "invalidPredictions",
  "passed",
  "thresholds",
  "total",
].sort();

const TMP_DIR = mkdtempSync(join(tmpdir(), "routing-eval-explain-"));
afterAll(() => rmSync(TMP_DIR, { recursive: true, force: true }));

// Deliberately wrong expectations: one lexical miss (wrong skill) and one that
// a FAST_PATH_RULES regex short-circuits. Both targets are routable, so they
// surface as `failures` rather than as invalid predictions.
const MISS_PROMPT = "generate a logo and brand identity";
const MISS_EXPECT = "database:query";
const FAST_PATH_PROMPT = "run the tests for the checkout flow";
const FAST_PATH_EXPECT = "webdev:backend";

const routeOf = (prompt: string): string => {
  const result = triagePrompt(prompt);
  return `${result.department}:${result.mode}`;
};

const FIXTURES: RoutingFixture[] = [
  { id: "deliberate-skill-miss", prompt: MISS_PROMPT, expect: MISS_EXPECT },
  { id: "deliberate-fast-path-miss", prompt: FAST_PATH_PROMPT, expect: FAST_PATH_EXPECT },
];

function writeFixture(): string {
  const path = join(TMP_DIR, "wrong-expectations.json");
  writeFileSync(path, `${JSON.stringify(FIXTURES, null, 2)}\n`, "utf8");
  return path;
}

function failureById(id: string): RoutingFailure {
  const report = evaluateRouting(FIXTURES, routes, { minExact: 0, minSkill: 0 });
  const found = report.failures.find((failure) => failure.id === id);
  if (!found) throw new Error(`expected ${id} to be a reported failure`);
  return found;
}

function runEval(args: string[]): { status: number | null; output: string } {
  const result = spawnSync("bun", ["scripts/eval-routing.ts", ...args], { cwd: REPO_ROOT, encoding: "utf8" });
  return { status: result.status, output: `${result.stdout ?? ""}${result.stderr ?? ""}` };
}

describe("eval-routing --verbose explanations", () => {
  const fixturePath = writeFixture();

  test("the wrong expectations really are failures with routable targets", () => {
    const report = evaluateRouting(FIXTURES, routes, { minExact: 0, minSkill: 0 });
    expect(report.invalidExpectations).toEqual([]);
    expect(report.invalidPredictions).toEqual([]);
    expect(report.failures.map((failure) => failure.id)).toEqual([
      "deliberate-skill-miss",
      "deliberate-fast-path-miss",
    ]);
    // Guards the fixture choice: if the router starts agreeing, the test is stale.
    expect(routeOf(MISS_PROMPT)).not.toBe(MISS_EXPECT);
    expect(routeOf(FAST_PATH_PROMPT)).not.toBe(FAST_PATH_EXPECT);
  });

  test("--verbose prints an explanation block per failure with expected and actual routes", () => {
    const { status, output } = runEval([
      "--verbose",
      "--fixtures",
      fixturePath,
      "--min-exact",
      "0",
      "--min-skill",
      "0",
    ]);
    expect(status).toBe(0);

    for (const failure of [
      { id: "deliberate-skill-miss", prompt: MISS_PROMPT, expected: MISS_EXPECT },
      { id: "deliberate-fast-path-miss", prompt: FAST_PATH_PROMPT, expected: FAST_PATH_EXPECT },
    ]) {
      const actual = routeOf(failure.prompt);
      expect(output).toContain(`- ${failure.id} `);
      expect(output).toContain(`prompt   : "${failure.prompt}"`);
      expect(output).toContain(`route    : expected ${failure.expected} → actual ${actual}`);
      expect(output).toContain(`winner   : ${actual.split(":")[0]} (`);
      expect(output).toContain("runner-up: ");
      expect(output).toMatch(/top modes: \S+=[\d.]+(, \S+=[\d.]+){0,2}/);
      expect(output).toMatch(/hint {5}: (department miss|mode miss|fast path fired) — /);
    }
  });

  test("--verbose names the cause: wrong skill, wrong mode, or fast path", () => {
    const { output } = runEval(["--verbose", "--fixtures", fixturePath, "--min-exact", "0", "--min-skill", "0"]);
    expect(output).toContain("hint     : department miss — wrong skill");
    expect(output).toContain("hint     : fast path fired —");
    expect(output).not.toContain("hint     : mode miss");
  });

  test("--verbose explains every miss on the real fixture set", () => {
    const { output } = runEval(["--verbose"]);
    const failureLines = (output.match(/^ {3}- \S+ \[/gm) ?? []).length;
    const hints = (output.match(/hint {5}: /g) ?? []).length;
    // Every reported miss carries exactly one hint — and a clean run is not a failure.
    expect(hints).toBe(failureLines);
    if (failureLines === 0) expect(output).toContain("Routing quality gate passed");
  });
});

describe("eval-routing explanation records", () => {
  test("explainFailure carries the winner, runner-up, top 3 modes and a hint", () => {
    const mismatch = failureById("deliberate-skill-miss");
    const explanation = explainFailure(mismatch);
    expect(explanation.expected).toBe(MISS_EXPECT);
    expect(explanation.actual).toBe(routeOf(MISS_PROMPT));
    expect(explanation.expectedDepartment).toBe("database");
    expect(explanation.actualDepartment).toBe("design");
    expect(explanation.hint).toBe("department miss");
    expect(explanation.fastPath).toBe(false);
    expect(explanation.winner.department).toBe("design");
    expect(explanation.winner.score).toBeGreaterThan(0);
    expect(explanation.modes.length).toBeGreaterThan(0);
    expect(explanation.modes.length).toBeLessThanOrEqual(3);

    const rendered = formatFailureExplanation(explanation).join("\n");
    expect(rendered).toContain(`expected ${MISS_EXPECT} → actual ${explanation.actual}`);
    expect(rendered).toContain(explanation.runnerUp ? explanation.runnerUp.department : "runner-up: none");
  });

  test("a fast-path miss says so and reports no runner-up", () => {
    const fastPathMiss = failureById("deliberate-fast-path-miss");
    const explanation = explainFailure(fastPathMiss);
    expect(explanation.fastPath).toBe(true);
    expect(explanation.hint).toBe("fast path fired");
    expect(explanation.runnerUp).toBeNull();
    const rendered = formatFailureExplanation(explanation).join("\n");
    expect(rendered).toContain("runner-up: none");
    expect(rendered).toContain("hint     : fast path fired");
  });

  test("a same-department miss is classified as a mode miss", () => {
    const explanation = explainFailure({
      id: "synthetic-mode-miss",
      prompt: MISS_PROMPT,
      expected: "design:ui",
      actual: routeOf(MISS_PROMPT),
      reason: "mode",
    });
    expect(explanation.hint).toBe("mode miss");
    expect(explanation.hintDetail).toContain("right skill (design)");
  });
});

describe("eval-routing --json shape", () => {
  const fixturePath = writeFixture();

  test("--json keeps the existing report keys and adds nothing else", () => {
    const { status, output } = runEval(["--json", "--fixtures", fixturePath, "--min-exact", "0", "--min-skill", "0"]);
    expect(status).toBe(0);
    const report = JSON.parse(output) as Record<string, unknown>;
    expect(Object.keys(report).sort()).toEqual(REPORT_KEYS);
    expect(report.explanations).toBeUndefined();
    expect(report.total).toBe(FIXTURES.length);
    expect(report.failures as unknown[]).toHaveLength(2);
    expect(report.invalidPredictions).toEqual([]);
    expect(report.invalidExpectations).toEqual([]);
    expect(report.thresholds).toEqual({ minExact: 0, minSkill: 0 });
    expect(typeof report.exactRate).toBe("number");
    expect(typeof report.fastPath).toBe("number");
    expect(typeof report.passed).toBe("boolean");
  });

  test("--json --verbose adds only the new `explanations` key", () => {
    const { output } = runEval([
      "--json",
      "--verbose",
      "--fixtures",
      fixturePath,
      "--min-exact",
      "0",
      "--min-skill",
      "0",
    ]);
    const report = JSON.parse(output) as Record<string, unknown>;
    expect(Object.keys(report).sort()).toEqual([...REPORT_KEYS, "explanations"].sort());
    const explanations = report.explanations as Array<Record<string, unknown>>;
    expect(explanations).toHaveLength(2);
    for (const explanation of explanations) {
      expect(Object.keys(explanation).sort()).toEqual(
        [
          "actual",
          "actualDepartment",
          "expected",
          "expectedDepartment",
          "fastPath",
          "hint",
          "hintDetail",
          "id",
          "modes",
          "prompt",
          "runnerUp",
          "winner",
        ].sort(),
      );
      expect((explanation.modes as unknown[]).length).toBeLessThanOrEqual(3);
    }
    // Adding a key must not disturb the keys the gate already reported.
    const withoutNewKey = { ...report };
    delete withoutNewKey.explanations;
    expect(Object.keys(withoutNewKey).sort()).toEqual(REPORT_KEYS);
  });

  test("default --json (real fixture set) still parses with the documented shape", () => {
    const { output } = runEval(["--json"]);
    const report = JSON.parse(output) as Record<string, unknown>;
    expect(Object.keys(report).sort()).toEqual(REPORT_KEYS);
  });
});

describe("a failing gate explains itself without --verbose", () => {
  test("explanations print when the gate fails, and JSON stays opt-in", () => {
    const fixture = join(TMP_DIR, "failing.json");
    writeFileSync(
      fixture,
      JSON.stringify([{ id: "force-fail", prompt: "generate a logo and brand identity", expect: "webdev:backend" }]),
    );

    // Thresholds that cannot pass, no --verbose flag.
    const human = spawnSync(
      "bun",
      ["scripts/eval-routing.ts", "--fixtures", fixture, "--min-exact", "1", "--min-skill", "1"],
      { cwd: REPO_ROOT, encoding: "utf8" },
    );
    expect(human.status).toBe(1);
    expect(human.stderr).toContain("winner");
    expect(human.stderr).toContain("hint");
    expect(human.stderr).toContain("department miss");

    // JSON without --verbose keeps the original shape even on failure.
    const json = spawnSync(
      "bun",
      ["scripts/eval-routing.ts", "--fixtures", fixture, "--min-exact", "1", "--min-skill", "1", "--json"],
      { cwd: REPO_ROOT, encoding: "utf8" },
    );
    expect(json.status).toBe(1);
    const parsed = JSON.parse(json.stdout) as Record<string, unknown>;
    expect(Object.keys(parsed).sort()).toEqual(REPORT_KEYS);
    expect(parsed.explanations).toBeUndefined();
  });
});

describe("fast-path confidence", () => {
  test("a hint-level rule informs scoring instead of short-circuiting it", async () => {
    const { FAST_PATH_RULES, triagePrompt } = await import(
      "../skills/context-orchestration/secretary/scripts/secretary"
    );
    const hint = FAST_PATH_RULES.find((rule) => rule.confidence === "hint");
    const strong = FAST_PATH_RULES.find((rule) => (rule.confidence ?? "strong") === "strong");
    expect(hint).toBeDefined();
    expect(strong).toBeDefined();

    // A hint rule must produce a scored result, never a fast-path verdict.
    const probe = "nurture email sequence for new signups";
    const hintRule = FAST_PATH_RULES.find((rule) => rule.confidence === "hint" && rule.regex.test(probe));
    if (hintRule) {
      const result = triagePrompt(probe);
      expect(result.fastPath).toBe(false);
    }
    // A strong rule still short-circuits.
    expect(triagePrompt("pull request 42 changed the auth flow").fastPath).toBe(true);
  });
});
