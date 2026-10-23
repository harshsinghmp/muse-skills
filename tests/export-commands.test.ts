import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  exportAntigravityCommands,
  exportCursorCommands,
  exportOpenCodeCommands,
  exportSkills,
  exportWindsurfWorkflows,
  getSkills,
  resolveSkillSourceDir,
  SUBMODE_ALIASES,
  wireSecretaryIntoAgentsMd,
} from "../scripts/export-commands";

const REPO_ROOT = path.resolve(import.meta.dir, "..");

/** 46 per-skill commands + 10 flat mode aliases, per harness. */
const EXPECTED_SKILL_COMMANDS = 46;
const EXPECTED_ALIAS_COMMANDS = 10;
const EXPECTED_TOTAL_COMMANDS = EXPECTED_SKILL_COMMANDS + EXPECTED_ALIAS_COMMANDS;

const COMMAND_EXPORTERS: Array<[string, (dest: string, skills: ReturnType<typeof getSkills>) => number]> = [
  ["OpenCode", exportOpenCodeCommands],
  ["Antigravity/Gemini", exportAntigravityCommands],
  ["Cursor", exportCursorCommands],
];

let sandbox = "";

beforeEach(() => {
  sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "export-commands-test-"));
});

afterEach(() => {
  fs.rmSync(sandbox, { recursive: true, force: true });
});

/** Every `~/.agents/skills/<relative>` path a generated command tells the agent to load. */
function extractInstalledRefs(markdown: string): string[] {
  return [...markdown.matchAll(/~\/\.agents\/skills\/([^\s`)]+)/g)].map((m) => m[1]);
}

describe("📦 export-commands: installed tree is the source of truth", () => {
  it("exportSkills installs all 46 skills, each with a SKILL.md, into the target dir", () => {
    const skills = getSkills();
    expect(skills.length).toBe(EXPECTED_SKILL_COMMANDS);

    const dest = path.join(sandbox, "agents-skills");
    const count = exportSkills(dest, skills);

    // Pre-fix this was 0: skills live at skills/<category>/<name>/, never REPO_ROOT/<name>.
    expect(count).toBe(EXPECTED_SKILL_COMMANDS);

    const installedDirs = fs.readdirSync(dest).filter((entry) => fs.statSync(path.join(dest, entry)).isDirectory());
    expect(installedDirs.length).toBe(EXPECTED_SKILL_COMMANDS);

    for (const skill of skills) {
      expect(fs.existsSync(path.join(dest, skill.name, "SKILL.md"))).toBe(true);
    }
  });

  it("resolves skill sources from the registry path, not the bare skill name", () => {
    for (const skill of getSkills()) {
      const srcDir = resolveSkillSourceDir(skill);
      expect(fs.existsSync(path.join(srcDir, "SKILL.md"))).toBe(true);
      // The pre-fix guess (REPO_ROOT/<name>) must not be where the source lives.
      expect(srcDir).not.toBe(path.join(REPO_ROOT, skill.name));
    }
  });

  it("surfaces a missing skill source instead of silently installing fewer skills", () => {
    const skills = getSkills();
    const broken = [{ ...skills[0], name: "ghost-department", path: "skills/nowhere/ghost-department/SKILL.md" }];
    expect(() => exportSkills(path.join(sandbox, "broken"), broken)).toThrow(/missing/);
  });

  it("exports 46 skills + 10 aliases for every implemented harness", () => {
    const skills = getSkills();

    for (const [harness, exporter] of COMMAND_EXPORTERS) {
      const dest = path.join(sandbox, harness.replace(/\W+/g, "-"));
      expect(exporter(dest, skills)).toBe(EXPECTED_TOTAL_COMMANDS);
      const files = fs.readdirSync(dest).filter((f) => f.endsWith(".md"));
      expect(files.length).toBe(EXPECTED_TOTAL_COMMANDS);
    }

    const windsurfDest = path.join(sandbox, "windsurf");
    expect(exportWindsurfWorkflows(windsurfDest, skills)).toBe(EXPECTED_TOTAL_COMMANDS);
    expect(fs.readdirSync(windsurfDest).filter((f) => f.endsWith(".md")).length).toBe(EXPECTED_TOTAL_COMMANDS);
  });

  it("round-trips: every path an exported command references exists after exportSkills", () => {
    const skills = getSkills();
    const installedRoot = path.join(sandbox, "agents-skills");
    exportSkills(installedRoot, skills);

    let checkedRefs = 0;
    for (const [harness, exporter] of COMMAND_EXPORTERS) {
      const dest = path.join(sandbox, `round-trip-${harness.replace(/\W+/g, "-")}`);
      exporter(dest, skills);

      for (const file of fs.readdirSync(dest).filter((f) => f.endsWith(".md"))) {
        const body = fs.readFileSync(path.join(dest, file), "utf8");
        const refs = extractInstalledRefs(body);
        expect(refs.length).toBeGreaterThan(0);
        for (const ref of refs) {
          checkedRefs++;
          expect(fs.existsSync(path.join(installedRoot, ref))).toBe(true);
        }
      }
    }
    expect(checkedRefs).toBe(EXPECTED_TOTAL_COMMANDS * COMMAND_EXPORTERS.length);
  });

  it("windsurf alias workflows point at a real references/<mode>.md in the installed tree", () => {
    const skills = getSkills();
    const installedRoot = path.join(sandbox, "agents-skills");
    const windsurfDest = path.join(sandbox, "windsurf-round-trip");
    exportSkills(installedRoot, skills);
    exportWindsurfWorkflows(windsurfDest, skills);

    for (const sub of SUBMODE_ALIASES) {
      const body = fs.readFileSync(path.join(windsurfDest, `${sub.command}.md`), "utf8");
      expect(body).toContain(`references/${sub.mode}.md`);
      expect(fs.existsSync(path.join(installedRoot, sub.skill, "references", `${sub.mode}.md`))).toBe(true);
    }
  });
});

describe("🔗 SUBMODE_ALIASES: no command may ship without a real mode reference", () => {
  it("every alias resolves to an existing references/<mode>.md in its skill directory", () => {
    const skills = getSkills();

    for (const sub of SUBMODE_ALIASES) {
      const parent = skills.find((s) => s.name === sub.skill);
      if (!parent) throw new Error(`alias /${sub.command} points at unknown skill '${sub.skill}'`);

      const refPath = path.join(path.dirname(path.resolve(REPO_ROOT, parent.path)), "references", `${sub.mode}.md`);
      expect(fs.existsSync(refPath)).toBe(true);
    }
  });

  it("ships exactly 10 aliases and no fictional /saas command", () => {
    expect(SUBMODE_ALIASES.length).toBe(EXPECTED_ALIAS_COMMANDS);
    expect(SUBMODE_ALIASES.map((a) => a.command)).toEqual([
      "carousel",
      "funnel",
      "obsidian",
      "wrangler",
      "pr",
      "aso",
      "delight",
      "podcast",
      "aeo",
      "dispatch",
    ]);
    expect(SUBMODE_ALIASES.some((a) => a.command === "saas")).toBe(false);
    expect(SUBMODE_ALIASES.some((a) => a.skill === "design" && a.mode === "saas")).toBe(false);
  });
});

describe("🏛️ wireSecretaryIntoAgentsMd: one router, markdown dialect", () => {
  const CANONICAL = `# AGENTS.md\n\n[//]: # (muse-secretary-router:start)\n## Secretary Protocol\n\nActivate \\\`secretary:dispatch\\\` on every task.\n[//]: # (muse-secretary-router:end)\n`;

  it("returns false and leaves a markdown-dialect AGENTS.md byte-identical (no duplicate router)", () => {
    const target = path.join(sandbox, "AGENTS.md");
    fs.writeFileSync(target, CANONICAL, "utf8");
    const before = fs.readFileSync(target);

    expect(wireSecretaryIntoAgentsMd(target)).toBe(false);
    expect(Buffer.compare(fs.readFileSync(target), before)).toBe(0);
  });

  it("also dedupes against the legacy HTML-comment dialect", () => {
    const target = path.join(sandbox, "AGENTS-legacy.md");
    const legacy = `# AGENTS.md\n\n<!-- muse-secretary-router:start -->\nold block\n<!-- muse-secretary-router:end -->\n`;
    fs.writeFileSync(target, legacy, "utf8");
    const before = fs.readFileSync(target);

    expect(wireSecretaryIntoAgentsMd(target)).toBe(false);
    expect(Buffer.compare(fs.readFileSync(target), before)).toBe(0);
  });

  it("writes the markdown sentinel dialect, emits no HTML comment, and is idempotent", () => {
    const target = path.join(sandbox, "fresh", "AGENTS.md");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "# AGENTS.md\n\nSome rule.\n", "utf8");

    expect(wireSecretaryIntoAgentsMd(target)).toBe(true);
    const wired = fs.readFileSync(target, "utf8");

    expect(wired).toContain("[//]: # (muse-secretary-router:start)");
    expect(wired).toContain("[//]: # (muse-secretary-router:end)");
    expect(wired).toContain("secretary:dispatch");
    expect(wired).not.toContain("<!--");
    expect(wired.startsWith("# AGENTS.md\n\nSome rule.\n")).toBe(true);

    // Second run must be a no-op, not a second router.
    expect(wireSecretaryIntoAgentsMd(target)).toBe(false);
    expect(fs.readFileSync(target, "utf8")).toBe(wired);
  });
});
