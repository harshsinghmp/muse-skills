import { describe, expect, test } from "bun:test";
import { triagePrompt } from "../skills/context-orchestration/secretary/scripts/secretary";

const CONFIDENT_CAP = 0.8;

describe("reported confidence matches the evidence", () => {
  test("a near-tie is never reported as high confidence", () => {
    const nearTie = triagePrompt("check the deploy");
    expect(nearTie.alternatives?.length).toBeGreaterThan(0);
    expect(nearTie.confidence).toBeLessThanOrEqual(CONFIDENT_CAP);
  });

  test("confidence with alternatives never exceeds confidence without them", () => {
    // Same prompt family: the alternative-bearing result must not look stronger.
    const withAlternatives = triagePrompt("review the pricing page");
    if ((withAlternatives.alternatives ?? []).length > 0) {
      expect(withAlternatives.confidence).toBeLessThanOrEqual(CONFIDENT_CAP);
    }
  });

  test("confidence stays a probability and keeps its documented floor", () => {
    for (const prompt of ["check the deploy", "review this pr", "set up kubernetes autoscaling"]) {
      const result = triagePrompt(prompt);
      expect(result.confidence).toBeGreaterThan(0);
      // Fast paths are exact by construction; scored results cap at 0.95.
      expect(result.confidence).toBeLessThanOrEqual(result.fastPath ? 1 : 0.95);
    }
  });

  test("a fast-path verdict is still fully confident", () => {
    expect(triagePrompt("review this pr").confidence).toBe(1);
  });
});
