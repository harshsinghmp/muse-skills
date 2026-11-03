import { afterEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { discoverAgentInstructionSources } from "../skills/core-engine/updateagents/scripts/instruction-migration";

/**
 * Asset 1 counted generated destinations and Syncthing backups as unpromoted
 * legacy sources, so a repository could never reach a clean 14/14 even when it
 * had no genuine foreign-harness rules. Compiled IDE artifacts are destinations,
 * `.opencode/commands/` is generated, and `.stversions/` is a backup store.
 */

const REPO_ROOT = join(import.meta.dir, "..");
const UPDATEAGENTS_SCRIPT = join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");
const TEST_SANDBOX = join("/tmp", `ua-classify-${Date.now()}`);

function auditAssetOne(target: string): { passed: boolean; details: string } {
  const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target, "--audit", "--json", "--force"], {
    encoding: "utf8",
  });
  expect(run.status).toBe(0);
  const body = JSON.parse(run.stdout) as {
    checks: Array<{ id: number; passed: boolean; details: string }>;
  };
  const asset = body.checks.find((check) => check.id === 1);
  if (!asset) throw new Error("Asset 1 missing from audit output");
  return { passed: asset.passed, details: asset.details };
}

describe("updateagents audit classification", () => {
  afterEach(() => {
    rmSync(TEST_SANDBOX, { recursive: true, force: true });
  });

  it("does not discover .stversions backups or generated .opencode/commands", () => {
    const target = join(TEST_SANDBOX, "discovery");
    mkdirSync(join(target, ".stversions"), { recursive: true });
    mkdirSync(join(target, ".opencode/commands"), { recursive: true });
    writeFileSync(join(target, ".stversions/CLAUDE.md"), "# backup\n", "utf8");
    writeFileSync(join(target, ".opencode/commands/audit.md"), "# generated command\n", "utf8");

    expect(discoverAgentInstructionSources(target)).toEqual([]);
  });

  it("passes Asset 1 when only compiled artifacts and backups remain", () => {
    const target = join(TEST_SANDBOX, "clean-root");
    mkdirSync(join(target, ".github"), { recursive: true });
    mkdirSync(join(target, ".cursor/rules"), { recursive: true });
    mkdirSync(join(target, ".stversions"), { recursive: true });
    mkdirSync(join(target, ".opencode/commands"), { recursive: true });
    writeFileSync(join(target, "AGENTS.md"), "# Rules\n- keep it lean\n", "utf8");
    writeFileSync(join(target, ".github/copilot-instructions.md"), "# generated copilot rules\n", "utf8");
    writeFileSync(join(target, ".cursor/rules/design.mdc"), "# generated cursor rule\n", "utf8");
    writeFileSync(join(target, ".stversions/CLAUDE.md"), "# backup\n", "utf8");
    writeFileSync(join(target, ".opencode/commands/audit.md"), "# generated command\n", "utf8");

    const assetOne = auditAssetOne(target);
    expect(assetOne.passed).toBe(true);
  });

  it("still fails Asset 1 for a genuine unpromoted foreign-harness rule", () => {
    const target = join(TEST_SANDBOX, "real-legacy");
    mkdirSync(join(target, ".github"), { recursive: true });
    mkdirSync(join(target, ".opencode/commands"), { recursive: true });
    writeFileSync(join(target, "AGENTS.md"), "# Rules\n- keep it lean\n", "utf8");
    writeFileSync(join(target, ".cursorrules"), "# real legacy rules\n- Always run tests.\n", "utf8");
    writeFileSync(join(target, ".github/copilot-instructions.md"), "# generated copilot rules\n", "utf8");
    writeFileSync(join(target, ".opencode/commands/audit.md"), "# generated command\n", "utf8");

    const assetOne = auditAssetOne(target);
    expect(assetOne.passed).toBe(false);
    expect(assetOne.details).toContain(".cursorrules");
    expect(assetOne.details).not.toContain("copilot-instructions.md");
    expect(assetOne.details).not.toContain(".opencode/commands");
  });
});
