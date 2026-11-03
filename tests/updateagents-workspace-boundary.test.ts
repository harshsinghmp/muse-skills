import { afterEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Regression suite for the 2026-11-03 cross-repository data-loss incident.
 *
 * The engine was launched from a parent directory holding three separate git
 * clones. `discoverAgentInstructionSources()` walked into every clone and
 * `adaptAgentInstructionSources()` rewrote their AGENTS.md / persona files into
 * three-line adapters. These tests lock down the workspace boundary, the
 * content-vs-instruction classification, archive-before-write, and the
 * preview/confirmation contract.
 */

const REPO_ROOT = join(import.meta.dir, "..");
const UPDATEAGENTS_SCRIPT = join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");
const TEST_SANDBOX = join("/tmp", `ua-boundary-${Date.now()}`);

function initGitRepo(dir: string): void {
  mkdirSync(dir, { recursive: true });
  const init = spawnSync("git", ["init", "-q"], { cwd: dir });
  if (init.status !== 0) throw new Error(`git init failed in ${dir}`);
}

function filesBelow(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) out.push(...filesBelow(path));
    else if (entry.isFile()) out.push(path);
  }
  return out;
}

describe("🛡️ updateagents workspace boundary: nested repositories are separate scopes", () => {
  afterEach(() => {
    rmSync(TEST_SANDBOX, { recursive: true, force: true });
  });

  it("refuses to adapt nested clones when the workspace root is not a repository", () => {
    const parent = join(TEST_SANDBOX, "multi-clone");
    const repos = [join(parent, "repoA"), join(parent, "repoB")];
    for (const repo of repos) {
      initGitRepo(repo);
      mkdirSync(join(repo, "agents"), { recursive: true });
      writeFileSync(join(repo, "AGENTS.md"), `# ${repo} rules\n${"- durable rule\n".repeat(40)}`, "utf8");
      writeFileSync(
        join(repo, "agents/persona.md"),
        `# Persona\n${"You are a careful reviewer.\n".repeat(10)}`,
        "utf8",
      );
    }

    const before = repos.map((repo) => ({
      agents: readFileSync(join(repo, "AGENTS.md"), "utf8"),
      persona: readFileSync(join(repo, "agents/persona.md"), "utf8"),
    }));

    // Both the normal run and the dry-run preview must refuse before writing.
    for (const extraArgs of [[], ["--dry-run"]] as string[][]) {
      const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, ...extraArgs], { cwd: parent, encoding: "utf8" });
      const output = `${run.stdout}\n${run.stderr}`;

      expect(run.status).not.toBe(0);
      expect(output).toContain("nested repositories");
      expect(output).toContain("is not a repository");

      repos.forEach((repo, index) => {
        expect(readFileSync(join(repo, "AGENTS.md"), "utf8")).toBe(before[index].agents);
        expect(readFileSync(join(repo, "agents/persona.md"), "utf8")).toBe(before[index].persona);
        expect(existsSync(join(repo, ".agents"))).toBe(false);
      });
      expect(existsSync(join(parent, ".agents"))).toBe(false);
    }
  });

  it("treats agents/<persona>.md as content, not as a runtime instruction", () => {
    const repo = join(TEST_SANDBOX, "persona-repo");
    initGitRepo(repo);
    mkdirSync(join(repo, "agents/dev"), { recursive: true });
    writeFileSync(join(repo, "AGENTS.md"), "# Project Rules\n\n- Always run the full test suite.\n", "utf8");
    const persona =
      "# Reviewer persona\n\nYou are a senior reviewer. Read the diff before commenting.\n\n- Prefer evidence over speculation.\n";
    writeFileSync(join(repo, "agents/dev/reviewer.md"), persona, "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT], { cwd: repo, encoding: "utf8" });
    if (run.status !== 0) throw new Error(`${run.stdout}\n${run.stderr}`);

    // The persona is product content and must survive byte-for-byte.
    expect(readFileSync(join(repo, "agents/dev/reviewer.md"), "utf8")).toBe(persona);

    // The hand-written root AGENTS.md is still imported and preserved per spec.
    expect(readFileSync(join(repo, "AGENTS.md"), "utf8")).toContain("Always run the full test suite.");
    expect(readFileSync(join(repo, ".agents/context/imported-agent-instructions.md"), "utf8")).toContain(
      "Always run the full test suite.",
    );
  });

  it("archives a legitimate CLAUDE.md before replacing it with exactly @AGENTS.md", () => {
    const repo = join(TEST_SANDBOX, "claude-repo");
    initGitRepo(repo);
    const original = "# Claude Rules\n\n- Always run the full test suite before proposing a release.\n";
    writeFileSync(join(repo, "CLAUDE.md"), original, "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT], { cwd: repo, encoding: "utf8" });
    if (run.status !== 0) throw new Error(`${run.stdout}\n${run.stderr}`);

    expect(readFileSync(join(repo, "CLAUDE.md"), "utf8").trim()).toBe("@AGENTS.md");

    const archiveDir = join(repo, ".agents/archive/agent-instructions");
    const snapshots = filesBelow(archiveDir).filter((file) => !file.endsWith("manifest.json"));
    expect(snapshots.some((file) => readFileSync(file, "utf8") === original)).toBe(true);
  });

  it("--dry-run previews every planned adapter and writes nothing", () => {
    const repo = join(TEST_SANDBOX, "dry-run-repo");
    initGitRepo(repo);
    const claude = "# Claude Rules\n\n- Never publish raw refs.\n";
    const cursor = "# Cursor Rules\n\n- Keep layouts mobile-first.\n";
    writeFileSync(join(repo, "CLAUDE.md"), claude, "utf8");
    writeFileSync(join(repo, ".cursorrules"), cursor, "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, "--dry-run"], { cwd: repo, encoding: "utf8" });
    if (run.status !== 0) throw new Error(`${run.stdout}\n${run.stderr}`);

    expect(run.stdout).toContain("Instruction adaptation plan");
    expect(run.stdout).toContain("CLAUDE.md");
    expect(run.stdout).toContain("@AGENTS.md");
    expect(run.stdout).toContain(".cursorrules");
    expect(run.stdout).toContain("[//]: # (updateagents:adapter)");

    expect(readFileSync(join(repo, "CLAUDE.md"), "utf8")).toBe(claude);
    expect(readFileSync(join(repo, ".cursorrules"), "utf8")).toBe(cursor);
    expect(existsSync(join(repo, ".agents/context/imported-agent-instructions.md"))).toBe(false);
  });
});
