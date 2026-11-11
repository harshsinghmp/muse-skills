import { describe, expect, test } from "bun:test";
import { triagePrompt } from "../skills/context-orchestration/secretary/scripts/secretary";

describe("fast-path rules match intent, not vocabulary", () => {
  test("naming Expo routes to the Expo mode, not the generic cross-platform one", () => {
    const result = triagePrompt(
      "expo sdk 49, still on old architecture, and the warehouse pilot needs barcode scanning plus push working in three weeks",
    );
    expect(result.fastPath).toBe(true);
    expect(result.department).toBe("mobile");
    expect(result.mode).toBe("expo");
  });

  test("react native still routes to the cross-platform mode", () => {
    const result = triagePrompt("react native app crashing on android launch");
    expect(result.fastPath).toBe(true);
    expect(result.mode).toBe("cross");
  });

  test("a review verb aimed at a diff still short-circuits", () => {
    for (const prompt of ["review this pr", "review the diff", "check the patch"]) {
      const result = triagePrompt(prompt);
      expect(result.fastPath).toBe(true);
      expect(result.department).toBe("code-review");
      expect(result.mode).toBe("pr-context");
    }
  });

  test("merely mentioning a pull request does not short-circuit the router", () => {
    // This is pr-review-mining work: mine years of review comments into rules.
    const result = triagePrompt(
      "three years of pull request threads and the same reviewer keeps writing 'wrap this write in a transaction' — turn the repeated corrections into standing rules",
    );
    expect(result.fastPath).toBe(false);
  });
});
