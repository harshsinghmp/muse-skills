import { afterEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  adaptAgentInstructionSources,
  discoverAgentInstructionSources,
  migrateAgentInstructions,
} from "../skills/core-engine/updateagents/scripts/instruction-migration";

const ROOT = join("/tmp", `updateagents-instructions-${Date.now()}`);
const UPDATEAGENTS_SCRIPT = join(import.meta.dir, "../skills/core-engine/updateagents/scripts/updateagents.ts");

afterEach(() => {
  rmSync(ROOT, { recursive: true, force: true });
});

describe("updateagents instruction migration", () => {
  it("discovers supported runtime rules recursively but skips generated and dependency trees", () => {
    mkdirSync(join(ROOT, ".cursor/rules"), { recursive: true });
    mkdirSync(join(ROOT, ".github/instructions"), { recursive: true });
    mkdirSync(join(ROOT, ".amazonq/rules"), { recursive: true });
    mkdirSync(join(ROOT, "node_modules/fixture"), { recursive: true });
    mkdirSync(join(ROOT, ".agents/context"), { recursive: true });
    mkdirSync(join(ROOT, ".memory"), { recursive: true });
    writeFileSync(join(ROOT, "CLAUDE.md"), "Claude rules\n");
    writeFileSync(join(ROOT, ".cursorrules"), "Cursor rules\n");
    writeFileSync(
      join(ROOT, ".cursor/rules/design.mdc"),
      "---\ndescription: design\nglobs: '**/*.tsx'\n---\nUse tokens.\n",
    );
    writeFileSync(join(ROOT, ".github/instructions/api.instructions.md"), "API rules\n");
    writeFileSync(join(ROOT, ".amazonq/rules/review.md"), "Review rules\n");
    writeFileSync(join(ROOT, "node_modules/fixture/AGENTS.md"), "Ignore this\n");
    writeFileSync(join(ROOT, ".agents/context/AGENTS.md"), "Ignore generated data\n");
    writeFileSync(join(ROOT, ".memory/AGENTS.md"), "Never read MuseMemory\n");

    expect(discoverAgentInstructionSources(ROOT).map((source) => source.relativePath)).toEqual([
      ".amazonq/rules/review.md",
      ".cursor/rules/design.mdc",
      ".cursorrules",
      ".github/instructions/api.instructions.md",
      "CLAUDE.md",
    ]);
  });

  it("imports full source content, archives exact bytes, adapts runtimes, and stays idempotent", () => {
    mkdirSync(join(ROOT, ".cursor/rules"), { recursive: true });
    const claudeRules = "# Claude\r\nNever publish raw refs.\r\n";
    const cursorRules = "---\ndescription: design\nglobs: '**/*.tsx'\n---\nUse the existing tokens.\n";
    writeFileSync(join(ROOT, "CLAUDE.md"), claudeRules);
    writeFileSync(join(ROOT, ".cursor/rules/design.mdc"), cursorRules);

    const migration = migrateAgentInstructions(ROOT);
    const canonical = readFileSync(join(ROOT, ".agents/context/imported-agent-instructions.md"), "utf8");
    expect(canonical).toContain("Never publish raw refs.");
    expect(canonical).toContain("Use the existing tokens.");
    expect(canonical).toContain(".cursor/rules/design.mdc");
    expect(migration.archivePaths).toHaveLength(2);
    expect(migration.archivePaths.map((path) => readFileSync(join(ROOT, path), "utf8"))).toEqual([
      cursorRules,
      claudeRules,
    ]);

    expect(adaptAgentInstructionSources(migration.sources)).toEqual([".cursor/rules/design.mdc", "CLAUDE.md"]);
    expect(readFileSync(join(ROOT, "CLAUDE.md"), "utf8").trim()).toBe("@AGENTS.md");
    const cursorAdapter = readFileSync(join(ROOT, ".cursor/rules/design.mdc"), "utf8");
    expect(cursorAdapter).toContain("globs: '**/*.tsx'");
    expect(cursorAdapter).toContain("<!-- updateagents:adapter -->");

    const secondPass = migrateAgentInstructions(ROOT);
    expect(secondPass.imported).toEqual([]);
    expect(discoverAgentInstructionSources(ROOT)).toEqual([]);
    expect(existsSync(join(ROOT, ".agents/archive/agent-instructions/manifest.json"))).toBe(true);
  });

  it("scaffolds a shared engine and maps mixed runtime rules during a normal sync", () => {
    mkdirSync(join(ROOT, ".windsurf/rules"), { recursive: true });
    writeFileSync(join(ROOT, "CLAUDE.md"), "# Claude\nKeep releases tagged.\n");
    writeFileSync(join(ROOT, "GEMINI.md"), "# Gemini\nDo not change public APIs without approval.\n");
    writeFileSync(join(ROOT, ".windsurf/rules/security.md"), "# Security\nNever log credentials.\n");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, ROOT], { encoding: "utf8" });
    if (run.status !== 0) throw new Error(`${run.stdout}\n${run.stderr}`);
    expect(existsSync(join(ROOT, "AGENTS.md"))).toBe(true);
    expect(existsSync(join(ROOT, ".agents/context/index.md"))).toBe(true);
    expect(readFileSync(join(ROOT, "CLAUDE.md"), "utf8").trim()).toBe("@AGENTS.md");
    expect(readFileSync(join(ROOT, "GEMINI.md"), "utf8")).toContain("updateagents:adapter");
    expect(readFileSync(join(ROOT, ".windsurf/rules/security.md"), "utf8")).toContain("updateagents:adapter");
    const imported = readFileSync(join(ROOT, ".agents/context/imported-agent-instructions.md"), "utf8");
    expect(imported).toContain("Keep releases tagged.");
    expect(imported).toContain("Do not change public APIs without approval.");
    expect(imported).toContain("Never log credentials.");
    expect(readFileSync(join(ROOT, "AGENTS.md"), "utf8")).toContain("imported-agent-instructions.md");
    expect(run.stdout).toContain(".agents/archive/agent-instructions/");

    const secondRun = spawnSync("bun", [UPDATEAGENTS_SCRIPT, ROOT], { encoding: "utf8" });
    expect(secondRun.status).toBe(0);
    expect(secondRun.stdout).toContain("Fast-path exit: Zero drift detected");
  });

  it("direct --scaffold preserves and adapts pre-existing agent rules before provisioning", () => {
    mkdirSync(join(ROOT, ".roo/rules-code"), { recursive: true });
    writeFileSync(join(ROOT, ".roo/rules-code/review.md"), "Review all changed files before approval.\n");
    writeFileSync(join(ROOT, ".windsurfrules"), "Keep layouts mobile-first.\n");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, ROOT, "--scaffold"], { encoding: "utf8" });
    if (run.status !== 0) throw new Error(`${run.stdout}\n${run.stderr}`);
    expect(readFileSync(join(ROOT, ".windsurfrules"), "utf8")).toContain("updateagents:adapter");
    expect(readFileSync(join(ROOT, ".roo/rules-code/review.md"), "utf8")).toContain("updateagents:adapter");
    expect(readFileSync(join(ROOT, ".agents/context/imported-agent-instructions.md"), "utf8")).toContain(
      "Review all changed files before approval.",
    );
    expect(readFileSync(join(ROOT, "AGENTS.md"), "utf8")).toContain("imported-agent-instructions.md");
  });

  it("rejects unsafe archive paths from a modified migration manifest", () => {
    mkdirSync(join(ROOT, ".agents/archive/agent-instructions"), { recursive: true });
    writeFileSync(
      join(ROOT, ".agents/archive/agent-instructions/manifest.json"),
      JSON.stringify({
        sources: [
          {
            sourcePath: "AGENTS.md",
            archivePath: ".agents/archive/agent-instructions/../../../../.memory/secret.md",
            sha256: "x",
          },
        ],
      }),
    );
    expect(() => migrateAgentInstructions(ROOT)).toThrow("Unsafe instruction archive path");
  });
});
