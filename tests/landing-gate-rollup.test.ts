import { describe, expect, test } from "bun:test";
import { evaluateRollup, type RollupCheck } from "../scripts/check-landed";

function check(name: string, conclusion: string | null, completedAt = "2026-11-10T10:00:00Z"): RollupCheck {
  return { name, conclusion, completedAt };
}

describe("landing gate rollup evaluation", () => {
  test("the gate's own earlier failure cannot poison the commit", () => {
    // The failure the gate is about to fix is itself in the rollup it reads.
    const rollup = [check("bun test", "SUCCESS"), check("lint", "SUCCESS"), check("landing-gate", "FAILURE")];
    expect(evaluateRollup(rollup)).toMatchObject({ green: true, counted: 2 });
  });

  test("a superseded cancelled run is replaced by the later successful one", () => {
    const rollup: RollupCheck[] = [
      check("bun test", "CANCELLED", "2026-11-10T09:00:00Z"),
      check("bun test", "SUCCESS", "2026-11-10T09:30:00Z"),
      check("lint", "SUCCESS", "2026-11-10T09:30:00Z"),
    ];
    expect(evaluateRollup(rollup)).toMatchObject({ green: true, counted: 2 });
  });

  test("a latest failure still fails, and the reason names it", () => {
    const rollup: RollupCheck[] = [
      check("bun test", "SUCCESS", "2026-11-10T09:00:00Z"),
      check("bun test", "FAILURE", "2026-11-10T09:30:00Z"),
      check("lint", "SUCCESS"),
    ];
    const verdict = evaluateRollup(rollup);
    expect(verdict.green).toBe(false);
    expect(verdict.reason).toContain("bun test:FAILURE");
  });

  test("in-progress checks are not a verdict, and no checks is not green", () => {
    expect(evaluateRollup([check("bun test", null), check("landing-gate", null)])).toMatchObject({
      green: false,
      counted: 0,
    });
    expect(evaluateRollup([])).toMatchObject({ green: false, counted: 0 });
  });

  test("neutral and skipped count as green", () => {
    expect(evaluateRollup([check("a", "NEUTRAL"), check("b", "SKIPPED"), check("c", "SUCCESS")]).green).toBe(true);
  });
});
