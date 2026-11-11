import { describe, expect, test } from "bun:test";
import { triagePrompt } from "../skills/context-orchestration/secretary/scripts/secretary";

/**
 * The vector blend engages only when the lexical router is already unsure AND
 * the vector space is decisive. These prompts contain no curated vocabulary for
 * the meaning they express — the router missed all three before the blend.
 */
describe("vector-space second opinion", () => {
  test("semantic prompts land on the department the words cannot reach", () => {
    const cases: Array<[string, string]> = [
      [
        "forty minutes of the agent editing the same file, and its own error output is now the biggest thing in the window — roll the workspace back to the last green commit and reset the conversation",
        "context-anchor",
      ],
      [
        "before this goes to the client i want the automated half of the gate: response headers checked and every breakpoint screenshotted for overflow, not another round of opinions",
        "gauntlet-loop",
      ],
      [
        "architecture page needs the request journey as moving svg — packets travelling between services, dashes flowing along the pipes, and no javascript bundle attached",
        "animate",
      ],
    ];
    for (const [prompt, expected] of cases) {
      expect(triagePrompt(prompt).department).toBe(expected);
    }
  });

  test("a fast-path verdict never consults the vector space", () => {
    const fast = triagePrompt("review this pr");
    expect(fast.fastPath).toBe(true);
    expect(fast.department).toBe("code-review");
  });
});
