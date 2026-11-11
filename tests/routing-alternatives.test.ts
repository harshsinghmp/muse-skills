import { describe, expect, test } from "bun:test";
import { triagePrompt } from "../skills/context-orchestration/secretary/scripts/secretary";

describe("close-call alternatives", () => {
  test("an ambiguous prompt names the near-tie instead of hiding it", () => {
    const result = triagePrompt("check the deploy");
    expect(result.alternatives?.length).toBeGreaterThan(0);
    for (const alternative of result.alternatives ?? []) {
      expect(alternative.department).not.toBe(result.department);
      expect(alternative.department.length).toBeGreaterThan(0);
    }
  });

  test("alternatives never change the answer", () => {
    const prompt = "review the pricing page";
    const withAlternatives = triagePrompt(prompt);
    // The route itself is still a single department and mode.
    expect(typeof withAlternatives.department).toBe("string");
    expect(typeof withAlternatives.mode).toBe("string");
    expect(withAlternatives.department).toBe("code-review");
  });

  test("alternatives are strictly weaker than the winner, and capped at two", () => {
    const result = triagePrompt("review the pricing page");
    const alternatives = result.alternatives ?? [];
    expect(alternatives.length).toBeLessThanOrEqual(2);
    for (const alternative of alternatives) expect(alternative.score).toBeGreaterThan(0);
    const sorted = [...alternatives].sort((a, b) => b.score - a.score);
    expect(alternatives).toEqual(sorted);
  });

  test("a fast-path verdict skips scoring entirely, so it has no alternatives", () => {
    const result = triagePrompt("review this pr");
    expect(result.fastPath).toBe(true);
    expect(result.alternatives).toBeUndefined();
  });
});
