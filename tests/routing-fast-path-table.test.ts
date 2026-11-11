import { describe, expect, test } from "bun:test";
import { FAST_PATH_RULES, triagePrompt } from "../skills/context-orchestration/secretary/scripts/secretary";

/**
 * Every strong rule needs a positive probe (the action it exists for) and a
 * negative probe (a sentence that mentions the vocabulary without asking for the
 * action). The two misfires found on the blind sets were both "the words were
 * present" — this table is what catches that class without waiting for a fixture.
 */
const PROBES: Record<string, { fires: string; quiet: string }> = {
  "qa-launch:gate": { fires: "run the tests", quiet: "our test coverage numbers look good" },
  "code-review:pr-context": { fires: "review this pr", quiet: "we have 300 pull requests open" },
  "ops:sow": { fires: "draft a statement of work", quiet: "the scope changed after kickoff" },
  "growth:pr": { fires: "write a press release", quiet: "the newsroom page needs updating" },
  "accounts:client-pnl": { fires: "build the p&l for the client", quiet: "margins are thin this quarter" },
  "code-review:triage-matrix": { fires: "run lint on the branch", quiet: "our lint rules disagree" },
  "updateagents:audit": { fires: "what is our ai readiness score", quiet: "the readme is out of date" },
  "webdev:funnel": { fires: "checkout page conversion dropped", quiet: "the stripe invoice failed" },
  "mobile:expo": { fires: "expo sdk 49 upgrade", quiet: "we exported the dataset" },
  "mobile:cross": { fires: "flutter app crashes on launch", quiet: "the banner flutters" },
  "research:competitor-analysis": { fires: "competitor analysis for the quarter", quiet: "we compete on price" },
  "ops:retro": { fires: "run the retrospective", quiet: "retrofit the old bathroom" },
  "clean-system-cache:audit": { fires: "free disk space on the laptop", quiet: "the cache invalidation bug" },
  "brand:persona": { fires: "buyer persona for the icp", quiet: "the persona feels off" },
  "audit:hygiene-rules": { fires: "find broken links in the docs", quiet: "link the doc please" },
  "coupling-router:mesh": { fires: "swarm mesh task claim", quiet: "the task was claimed twice" },
  "coupling-router:swarm": { fires: "agent swarm for the backlog", quiet: "one agent is running" },
  "devops:cicd": { fires: "the deploy pipeline is red", quiet: "the deployment failed" },
  "refactor:code": { fires: "refactor the parser", quiet: "a refactor would help here" },
  "smm:carousel": { fires: "carousel for linkedin", quiet: "the viral loop did nothing" },
  "secretary:onboard": { fires: "run the onboarding interview", quiet: "new hire onboarding starts monday" },
  "secretary:orchestration": { fires: "give me the morning briefing", quiet: "the briefing document is long" },
  "coach:team": { fires: "daily standup notes", quiet: "the team is small" },
  "coach:client": { fires: "scope creep on the account", quiet: "the scope of work changed" },
  "coach:founder": { fires: "founder bottleneck on sales", quiet: "the founder is on holiday" },
};

describe("every strong fast-path rule is probe-tested", () => {
  const strong = FAST_PATH_RULES.filter((rule) => (rule.confidence ?? "strong") === "strong");

  test("each strong rule has a positive and a negative probe", () => {
    const missing = strong.map((rule) => `${rule.department}:${rule.mode}`).filter((key) => !PROBES[key]);
    expect(missing).toEqual([]);
  });

  for (const rule of strong) {
    const key = `${rule.department}:${rule.mode}`;

    test(`${key} fires on the action it exists for`, () => {
      const probe = PROBES[key];
      if (!probe) return; // covered by the completeness test above
      const result = triagePrompt(probe.fires);
      expect(result.fastPath).toBe(true);
      expect(`${result.department}:${result.mode}`).toBe(key);
    });

    test(`${key} does not fire on vocabulary alone`, () => {
      const probe = PROBES[key];
      if (!probe) return;
      expect(triagePrompt(probe.quiet).fastPath).toBe(false);
    });
  }
});
