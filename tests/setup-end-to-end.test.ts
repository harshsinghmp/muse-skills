/**
 * End-to-end wiring regression suite for the real `bun scripts/export-commands.ts --setup` CLI.
 *
 * The defect this locks down: `--setup` printed a green, complete-looking summary and
 * emitted a full set of harness command files while the skills installer silently
 * installed 0 of 46 skills — so every command pointed at `~/.agents/skills/<name>/SKILL.md`
 * files that were never written. Exporter-level unit tests stayed green throughout, because
 * nothing exercised the real CLI, its harness auto-detection, or the artefacts it leaves on
 * disk. This suite spawns the actual CLI as a subprocess against a throwaway HOME +
 * workspace and asserts on what landed on disk.
 *
 * Containment: the fake HOME and workspace live under a fresh /tmp directory, and the real
 * repository tree must be byte-identical before and after the run.
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { getSkillModeCommands, getSkills, SUBMODE_ALIASES } from "../scripts/export-commands";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const EXPORTER_CLI = path.join(REPO_ROOT, "scripts/export-commands.ts");
const REPO_AGENTS_MD = path.join(REPO_ROOT, "AGENTS.md");

/** Documented contract: 46 canonical skills + every generated <skill>-<mode> command + 10 aliases, per harness. */
const EXPECTED_SKILLS = 46;
const EXPECTED_ALIASES = 10;
const SKILL_MODE_COMMANDS = getSkillModeCommands(getSkills());
const EXPECTED_COMMANDS_PER_HARNESS = EXPECTED_SKILLS + SKILL_MODE_COMMANDS.length + EXPECTED_ALIASES;

const SECRETARY_START = "[//]: # (muse-secretary-router:start)";
const SECRETARY_END = "[//]: # (muse-secretary-router:end)";

/** Directories that are machine-local caches, not repo artefacts. */
interface RegistrySkill {
  name: string;
  path: string;
}

interface HarnessTarget {
  label: string;
  dir: string;
  /** File suffix the harness requires (".md", ".toml", ".prompt", ".prompt.md"). */
  extension: string;
  /** Noun the CLI uses in its per-harness summary line. */
  noun: "commands" | "workflows";
}

function readRegistry(): RegistrySkill[] {
  const raw = fs.readFileSync(path.join(REPO_ROOT, "skills.json"), "utf8");
  return (JSON.parse(raw) as { skills: RegistrySkill[] }).skills;
}

/** The harness destinations `runSetup` writes into, given the dirs that exist. */
function harnessTargets(home: string, workspace: string): HarnessTarget[] {
  return [
    {
      label: "opencode (global)",
      dir: path.join(home, ".config", "opencode", "commands"),
      extension: ".md",
      noun: "commands",
    },
    {
      label: "opencode (workspace)",
      dir: path.join(workspace, ".opencode", "commands"),
      extension: ".md",
      noun: "commands",
    },
    { label: "claude-code (global)", dir: path.join(home, ".claude", "commands"), extension: ".md", noun: "commands" },
    {
      label: "claude-code (workspace)",
      dir: path.join(workspace, ".claude", "commands"),
      extension: ".md",
      noun: "commands",
    },
    {
      label: "gemini/antigravity (global)",
      dir: path.join(home, ".gemini", "commands"),
      extension: ".toml",
      noun: "commands",
    },
    {
      label: "gemini/antigravity (workspace)",
      dir: path.join(workspace, ".gemini", "commands"),
      extension: ".toml",
      noun: "commands",
    },
    {
      label: "windsurf (workspace)",
      dir: path.join(workspace, ".windsurf", "workflows"),
      extension: ".md",
      noun: "workflows",
    },
    {
      label: "cursor (workspace)",
      dir: path.join(workspace, ".cursor", "commands"),
      extension: ".md",
      noun: "commands",
    },
    { label: "roo (global)", dir: path.join(home, ".roo", "commands"), extension: ".md", noun: "commands" },
    { label: "roo (workspace)", dir: path.join(workspace, ".roo", "commands"), extension: ".md", noun: "commands" },
    {
      label: "copilot (workspace)",
      dir: path.join(workspace, ".github", "prompts"),
      extension: ".prompt.md",
      noun: "commands",
    },
    {
      label: "continue (global)",
      dir: path.join(home, ".continue", "prompts"),
      extension: ".prompt",
      noun: "commands",
    },
    {
      label: "continue (workspace)",
      dir: path.join(workspace, ".continue", "prompts"),
      extension: ".prompt",
      noun: "commands",
    },
    { label: "qwen (global)", dir: path.join(home, ".qwen", "commands"), extension: ".md", noun: "commands" },
    { label: "qwen (workspace)", dir: path.join(workspace, ".qwen", "commands"), extension: ".md", noun: "commands" },
  ];
}

/** Every `~/.agents/skills/<relative>` path a generated command tells the agent to load. */
function extractInstalledRefs(markdown: string): string[] {
  return [...markdown.matchAll(/~\/\.agents\/skills\/([^\s`)]+)/g)].map((match) => match[1]);
}

/** Bare `references/<mode>.md` mentions (the Windsurf workflow dialect omits the `~` prefix). */
function extractModeRefs(markdown: string): string[] {
  return [...markdown.matchAll(/references\/([A-Za-z0-9_.-]+\.md)/g)].map((match) => match[1]);
}

function repoStatus(): string {
  return (
    spawnSync("git", ["status", "--porcelain", "--untracked-files=no"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    }).stdout ?? ""
  ).trim();
}

function sha256File(file: string): string {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function commandFiles(dir: string, extension: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(extension))
    .sort();
}

let sandbox = "";
let fakeHome = "";
let fakeWorkspace = "";
let installedSkillsRoot = "";
let seededAgentsMd = "";
let repoStatusBefore = "";
let repoAgentsMdHashBefore = "";
let run: { status: number | null; stdout: string; stderr: string };

beforeEach(() => {
  sandbox = fs.mkdtempSync("/tmp/muse-setup-e2e-");
  fakeHome = path.join(sandbox, "home");
  fakeWorkspace = path.join(sandbox, "workspace");
  installedSkillsRoot = path.join(fakeHome, ".agents", "skills");

  // Global harnesses the CLI detects by directory existence.
  for (const dir of [".config/opencode", ".gemini", ".claude", ".codex", ".roo", ".continue", ".qwen"]) {
    fs.mkdirSync(path.join(fakeHome, dir), { recursive: true });
  }
  // Workspace harnesses.
  for (const dir of [
    ".opencode",
    ".gemini",
    ".claude",
    ".cursor",
    ".windsurf",
    ".roo",
    ".github",
    ".continue",
    ".qwen",
  ]) {
    fs.mkdirSync(path.join(fakeWorkspace, dir), { recursive: true });
  }

  // A workspace already wired with the markdown sentinel dialect: re-running --setup
  // must not append a second router block.
  seededAgentsMd = `# Workspace Rules\n\n${SECRETARY_START}\n## Secretary Protocol\n\nActivate \`secretary:dispatch\` at the start of every task.\n${SECRETARY_END}\n`;
  fs.writeFileSync(path.join(fakeWorkspace, "AGENTS.md"), seededAgentsMd, "utf8");

  repoAgentsMdHashBefore = sha256File(REPO_AGENTS_MD);
  repoStatusBefore = repoStatus();

  run = spawnSync("bun", [EXPORTER_CLI, "--setup"], {
    encoding: "utf8",
    cwd: fakeWorkspace,
    env: { ...process.env, HOME: fakeHome },
  });
});

afterEach(() => {
  fs.rmSync(sandbox, { recursive: true, force: true });
});

/** The CLI must exit cleanly; every later assertion reads its stdout / on-disk artefacts. */
function cleanRun(): string {
  if (run.status !== 0) throw new Error(run.stdout + run.stderr);
  return run.stdout;
}

describe("🚀 export-commands --setup: real CLI wiring end-to-end", () => {
  it("exits 0 and reports a detected-harness summary", () => {
    const stdout = cleanRun();
    const skills = readRegistry();

    expect(stdout).toContain(`Loaded ${skills.length} canonical Muse skills`);
    expect(stdout).toContain("Setup Complete");
  });

  it("installs 46 skills, each with a SKILL.md, under the HOME the CLI actually uses", () => {
    const stdout = cleanRun();
    const skills = readRegistry();
    expect(skills.length).toBe(EXPECTED_SKILLS);

    // Pre-fix this line reported 0: skills live at skills/<category>/<name>/, never
    // at REPO_ROOT/<name>, and a silent skip installed nothing.
    expect(stdout).toContain(`Installed ${skills.length} canonical departments → ${installedSkillsRoot}`);

    // .muse/ (the shipped harness registry) and .muse-version live beside the
    // skills; a skill directory is one that contains SKILL.md.
    const installedDirs = fs
      .readdirSync(installedSkillsRoot)
      .filter((entry) => fs.existsSync(path.join(installedSkillsRoot, entry, "SKILL.md")))
      .sort();

    expect(installedDirs).toEqual(skills.map((skill) => skill.name).sort());
    expect(installedDirs.length).toBe(skills.length);

    for (const skill of skills) {
      expect(fs.existsSync(path.join(installedSkillsRoot, skill.name, "SKILL.md"))).toBe(true);
    }
  });

  it("writes the full command surface per detected harness (46 skills + every skill-mode + 10 aliases), derived not hardcoded", () => {
    const stdout = cleanRun();
    const skills = readRegistry();
    const harnesses = harnessTargets(fakeHome, fakeWorkspace);

    expect(SUBMODE_ALIASES.length).toBe(EXPECTED_ALIASES);

    let exported = 0;
    for (const harness of harnesses) {
      const expectedFiles = [
        ...skills.map((skill) => `${skill.name}${harness.extension}`),
        ...SKILL_MODE_COMMANDS.map((entry) => `${entry.command}${harness.extension}`),
        ...SUBMODE_ALIASES.map((alias) => `${alias.command}${harness.extension}`),
      ].sort();
      expect(expectedFiles.length).toBe(EXPECTED_COMMANDS_PER_HARNESS);

      expect(fs.existsSync(harness.dir)).toBe(true);
      const files = commandFiles(harness.dir, harness.extension);
      expect(files.length).toBe(EXPECTED_COMMANDS_PER_HARNESS);
      expect(files).toEqual(expectedFiles);
      expect(stdout).toContain(`${EXPECTED_COMMANDS_PER_HARNESS} ${harness.noun} → ${harness.dir}`);
      exported += files.length;
    }

    expect(stdout).toContain(`(${exported} slash commands exported)`);
  });

  it("resolution property: every path a command tells the agent to load exists in the installed tree", () => {
    cleanRun();
    const harnesses = harnessTargets(fakeHome, fakeWorkspace);
    const missing: string[] = [];
    let fileRefs = 0;
    let modeRefs = 0;

    for (const harness of harnesses) {
      for (const file of commandFiles(harness.dir, harness.extension)) {
        const body = fs.readFileSync(path.join(harness.dir, file), "utf8");
        const refs = extractInstalledRefs(body);

        // Every command names the exact skill/mode file it must load before acting.
        expect(refs.length).toBeGreaterThan(0);
        for (const ref of refs) {
          fileRefs++;
          if (!fs.existsSync(path.join(installedSkillsRoot, ref))) {
            missing.push(`${harness.label}/${file} → ~/.agents/skills/${ref}`);
          }
        }

        // Windsurf workflows reference `references/<mode>.md` relative to the skill
        // named in the same file; resolve it against that skill's installed directory.
        const owningSkills = [...new Set(refs.map((ref) => ref.split("/")[0]))];
        for (const mode of extractModeRefs(body)) {
          modeRefs++;
          const resolved = owningSkills.some((skill) =>
            fs.existsSync(path.join(installedSkillsRoot, skill, "references", mode)),
          );
          if (!resolved) missing.push(`${harness.label}/${file} → references/${mode}`);
        }
      }
    }

    expect(missing).toEqual([]);
    expect(fileRefs).toBe(EXPECTED_COMMANDS_PER_HARNESS * harnesses.length);
    // Every mode-command and alias names its references/<mode>.md; per-skill
    // commands reference SKILL.md only, so they contribute no mode refs.
    expect(modeRefs).toBe((EXPECTED_ALIASES + SKILL_MODE_COMMANDS.length) * harnesses.length);
  });

  it("mirrors skills into the Claude Code root so Amp and Claude both see them", () => {
    cleanRun();
    const skills = readRegistry();
    for (const root of [path.join(fakeHome, ".claude", "skills"), path.join(fakeWorkspace, ".claude", "skills")]) {
      for (const skill of skills) {
        expect(fs.existsSync(path.join(root, skill.name, "SKILL.md"))).toBe(true);
      }
      // A link, not a copy: refreshing the canonical tree refreshes this root.
      expect(fs.realpathSync(path.join(root, skills[0].name))).toBe(
        fs.realpathSync(path.join(installedSkillsRoot, skills[0].name)),
      );
    }
  });

  it("does not append a duplicate secretary router to a workspace AGENTS.md", () => {
    cleanRun();
    const agentsMd = fs.readFileSync(path.join(fakeWorkspace, "AGENTS.md"), "utf8");

    expect(agentsMd.match(/muse-secretary-router:start/g)?.length ?? 0).toBe(1);
    expect(agentsMd.match(/muse-secretary-router:end/g)?.length ?? 0).toBe(1);
    expect(agentsMd).not.toContain("<!--");
    // Already wired → the file must be left byte-identical, not rewritten.
    expect(agentsMd).toBe(seededAgentsMd);
    // No global AGENTS.md existed, so none may be conjured into the fake HOME.
    expect(fs.existsSync(path.join(fakeHome, ".agents", "AGENTS.md"))).toBe(false);
  });

  it("stays contained: the real repository is byte-identical and gains no files", () => {
    cleanRun();

    expect(sha256File(REPO_AGENTS_MD)).toBe(repoAgentsMdHashBefore);
    expect(repoStatus()).toBe(repoStatusBefore);
    // The run's artefacts must live inside the throwaway sandbox, not the repo.
    expect(fs.existsSync(path.join(fakeWorkspace, "AGENTS.md"))).toBe(true);
    expect(path.dirname(path.dirname(installedSkillsRoot))).toBe(fakeHome);
  });
});
