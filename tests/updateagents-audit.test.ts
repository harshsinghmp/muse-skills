import { afterEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Regression suite for the AI-readiness scorecard. The audit used to hardcode
 * 13 assets while `auditWorkspace()` returned 14 checks, so a repository could
 * be reported "13/13 AI-Ready" while Asset 1 was visibly failing.
 */

const REPO_ROOT = join(import.meta.dir, "..");
const UPDATEAGENTS_SCRIPT = join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");
const TEST_SANDBOX = join("/tmp", `ua-audit-${Date.now()}`);

describe("updateagents audit scorecard", () => {
  afterEach(() => {
    rmSync(TEST_SANDBOX, { recursive: true, force: true });
  });

  it("reports a total equal to the number of checks and fails an oversized root AGENTS.md", () => {
    const target = join(TEST_SANDBOX, "oversized-root");
    mkdirSync(target, { recursive: true });
    writeFileSync(join(target, "AGENTS.md"), `# Rules\n${"- durable rule\n".repeat(99)}`, "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target, "--audit", "--json", "--force"], {
      encoding: "utf8",
    });
    expect(run.status).toBe(0);
    const body = JSON.parse(run.stdout) as {
      score: number;
      total: number;
      passed: boolean;
      checks: Array<{ id: number; name: string; passed: boolean }>;
    };

    expect(body.checks.length).toBe(14);
    expect(body.total).toBe(body.checks.length);
    expect(body.passed).toBe(false);

    const assetOne = body.checks.find((check) => check.id === 1);
    expect(assetOne).toBeDefined();
    expect(assetOne?.passed).toBe(false);
  });
});
