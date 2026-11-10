#!/usr/bin/env bun
/**
 * export-commands.ts — Universal Multi-Harness Command Exporter & Onboarding Engine
 *
 * Scans all 46 canonical Muse skills from skills.json and exports first-class
 * native slash commands into the harnesses this engine actually implements —
 * OpenCode, Gemini/Antigravity, Windsurf and Cursor (every destination is
 * existence-gated). The surface is three layers: one command per skill, one
 * generated `<skill>-<mode>` command per references/<mode>.md (unique by
 * default, so no mode — including every skill's `audit` mode — is shadowed by
 * another skill's), and 10 curated flat aliases on top.
 *
 * Usage:
 *   bun scripts/export-commands.ts --setup           # Auto-detect harnesses, install skills & export commands
 *   bun scripts/export-commands.ts --skills-only     # Install skills only
 *   bun scripts/export-commands.ts --commands-only   # Export slash commands only
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { commandDestinations, type HarnessFormat, loadHarnessRegistry } from "./harness-registry";

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_JSON_PATH = path.join(REPO_ROOT, "skills.json");

interface SkillItem {
  name: string;
  description: string;
  path: string;
  version: string;
  category: string;
  priority: number;
  aliases?: string[];
  /** Curated council lead (Sol / Jasper / Crew / Nexus, or a pair). */
  councilLead?: string;
  /** Mode used when routing cannot infer one. */
  defaultMode?: string;
}

interface SkillsRegistry {
  skills: SkillItem[];
}

// ─── Council Lead Assignment Mapping ──────────────────────────────────────────
/** Presentation-only annotations for a canonical lead from skills.json. */
const LEAD_ROLES: Record<string, string> = {
  Sol: "Sol (Product Architect & Full-Stack Automator)",
  Jasper: "Jasper (Creative Technologist & Growth Mastermind)",
  Crew: "Crew (Operations Lead & Client Delivery Specialist)",
  Nexus: "Nexus (Technical Director & Review Head)",
  "Sol & Jasper": "Sol & Jasper (Architecture & Growth)",
  "Jasper & Crew": "Jasper & Crew (Creative & Operations)",
  "Crew & Jasper": "Crew & Jasper (Operations & Creative)",
  "Sol & Crew": "Sol & Crew (Architecture & Operations)",
  "Nexus & Sol": "Nexus & Sol (Governance & Architecture)",
  "Sol & Nexus": "Sol & Nexus (Architecture & Governance)",
  "Crew & Nexus": "Crew & Nexus (Operations & Governance)",
};

/** Rendered lead for a skill: annotation when known, canonical value otherwise. */
function renderLead(skill: SkillItem): string {
  const lead = skill.councilLead ?? "Nexus";
  return LEAD_ROLES[lead] ?? `${lead} (Technical Director)`;
}

// ─── High-Leverage Sub-Mode Aliases ──────────────────────────────────────────
export const SUBMODE_ALIASES: Array<{ command: string; skill: string; mode: string; desc: string }> = [
  {
    command: "carousel",
    skill: "smm",
    mode: "carousel",
    desc: "Autonomous 6-slide viral TikTok/Instagram carousel generator",
  },
  { command: "funnel", skill: "webdev", mode: "funnel", desc: "High-converting sales funnel and checkout engineering" },
  {
    command: "obsidian",
    skill: "ops",
    mode: "obsidian",
    desc: "Obsidian PKM vault notes, OFM syntax, and JSON Canvas builder",
  },
  {
    command: "wrangler",
    skill: "devops",
    mode: "cloudflare",
    desc: "Cloudflare Workers, Pages, and declarative wrangler.jsonc bindings",
  },
  {
    command: "pr",
    skill: "growth",
    mode: "pr",
    desc: "Media outreach, press release distribution, and crisis communications",
  },
  {
    command: "aso",
    skill: "mobile",
    mode: "aso",
    desc: "App Store Optimization, keyword clustering, and screenshot conversion",
  },
  {
    command: "delight",
    skill: "animate",
    mode: "delight",
    desc: "Micro-delight physics, canvas confetti, and Easter eggs",
  },
  {
    command: "podcast",
    skill: "content",
    mode: "podcast",
    desc: "Broadcast podcast audio engineering and voice-first scripts",
  },
  {
    command: "aeo",
    skill: "seo",
    mode: "aeo",
    desc: "AI Engine Optimization for Perplexity, ChatGPT, and Gemini Overviews",
  },
  {
    command: "dispatch",
    skill: "secretary",
    mode: "dispatch",
    desc: "Universal Agency Department Directory & Autonomous Dispatcher",
  },
];

// ─── Generated Skill-Mode Command Surface ────────────────────────────────────
export interface SkillModeCommand {
  command: string;
  skill: string;
  mode: string;
  desc: string;
}

/** First markdown heading of a reference file, cleaned into a command description. */
function referenceHeadline(refFile: string): string | null {
  if (!fs.existsSync(refFile)) return null;
  for (const line of fs.readFileSync(refFile, "utf8").split("\n")) {
    const heading = /^#{1,3}\s+(.*)$/.exec(line);
    if (!heading) continue;
    const cleaned = heading[1]
      .replace(/^[^\w]+/, "") // leading emoji/decorations
      .replace(/[*`_]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned || null;
  }
  return null;
}

/**
 * Mode-reference naming convention: a routable mode reference is lowercase
 * kebab-case (`<mode>.md`). Uppercase files in references/ (POLICY, SECURITY,
 * CHECKLIST, ...) are governance/support documents, not routable modes — they
 * are deliberately excluded from the command surface, dispatch.md, and mode
 * counts so all three agree on one definition.
 */
export function isModeRefFile(fileName: string): boolean {
  return /^[a-z0-9-]+\.md$/.test(fileName);
}

/**
 * The full generated skill-mode surface: one `<skill>-<mode>` command per
 * routable references/<mode>.md. This is the same source dispatch.md is
 * drift-gated against (getModesForSkill), so the command surface and the
 * routing surface can never disagree. Names are prefixed with the skill so
 * modes that repeat across departments (every skill ships an `audit` mode)
 * stay unique and self-describing instead of shadowing each other.
 */
export function getSkillModeCommands(skills: SkillItem[]): SkillModeCommand[] {
  const reserved = new Set<string>([...skills.map((s) => s.name), ...SUBMODE_ALIASES.map((a) => a.command)]);
  const entries: SkillModeCommand[] = [];
  const seen = new Set<string>();

  for (const skill of skills) {
    const refDir = path.join(resolveSkillSourceDir(skill), "references");
    if (!fs.existsSync(refDir)) continue;
    for (const file of fs.readdirSync(refDir).filter(isModeRefFile).sort()) {
      const mode = file.replace(/\.md$/, "");
      const command = `${skill.name}-${mode}`;
      if (seen.has(command)) {
        throw new Error(`getSkillModeCommands: duplicate skill-mode command '${command}'`);
      }
      if (reserved.has(command)) {
        throw new Error(`getSkillModeCommands: '${command}' collides with an existing per-skill or alias command`);
      }
      seen.add(command);
      const desc = referenceHeadline(path.join(refDir, file)) ?? `${skill.name} — ${mode} mode`;
      entries.push({ command, skill: skill.name, mode, desc });
    }
  }

  return entries;
}

/** Command-surface breakdown per harness: per-skill + generated skill-mode + curated aliases. */
export function commandSurfaceCounts(skills: SkillItem[]): {
  perSkill: number;
  skillModes: number;
  aliases: number;
  total: number;
} {
  const skillModes = getSkillModeCommands(skills).length;
  return {
    perSkill: skills.length,
    skillModes,
    aliases: SUBMODE_ALIASES.length,
    total: skills.length + skillModes + SUBMODE_ALIASES.length,
  };
}

/** Write the generated `<skill>-<mode>` layer into a harness destination. */
function writeSkillModeCommands(
  destDir: string,
  skills: SkillItem[],
  generate: (skill: SkillItem, mode: string, desc: string) => string,
  extension = ".md",
): number {
  let count = 0;
  for (const entry of getSkillModeCommands(skills)) {
    const parent = skills.find((s) => s.name === entry.skill);
    if (!parent) continue; // unreachable: entries are derived from `skills`
    fs.writeFileSync(path.join(destDir, `${entry.command}${extension}`), generate(parent, entry.mode, entry.desc));
    count++;
  }
  return count;
}

export function getSkills(): SkillItem[] {
  if (!fs.existsSync(SKILLS_JSON_PATH)) {
    throw new Error(`skills.json not found at ${SKILLS_JSON_PATH}`);
  }
  const registry: SkillsRegistry = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
  return registry.skills;
}

/** Markdown body shared by every harness that stores a prompt as markdown. */
export function generateCommandBody(skill: SkillItem, mode?: string, customDesc?: string): string {
  const lead = renderLead(skill);
  const modeText = mode ? ` in \`${mode}\` mode` : "";
  const desc = customDesc || skill.description;
  const refPath = mode ? `references/${mode}.md` : "SKILL.md";

  return `# Autonomous Agency Execution: \`${skill.name}\`${modeText}

${desc}

You are executing the canonical Muse Department **\`${skill.name}\`**${modeText} governed by **${lead}**.

## Mandatory Operating Protocol:
1. **Load Exact Guidance**: Execute \`view_file\` on \`~/.agents/skills/${skill.name}/${refPath}\` immediately before modifying code.
2. **Adopt Council Persona**: Embody ${lead}'s standards, terminology, and engineering discipline.
3. **Execute Incrementally**: Keep diffs minimal, test locally with modern tools (\`rg\`, \`fd\`, \`bun test\`).
4. **Verification Gate**: Deliver work only when verified against the pre-merge contract.
`;
}

function frontmatterDescription(desc: string): string {
  return desc.replace(/"/g, '\\"').replace(/\n/g, " ").slice(0, 200);
}

/** OpenCode, Claude Code, Codex, Cursor and Roo all read markdown commands. */
export function generateMarkdownCommand(skill: SkillItem, mode?: string, customDesc?: string): string {
  const desc = customDesc || skill.description;
  return `---
description: "${frontmatterDescription(desc)}"
argument-hint: "[task or objective]"
---

${generateCommandBody(skill, mode, customDesc)}`;
}

/** Continue prompts carry name/description/invokable frontmatter and a .prompt extension. */
export function generateContinuePrompt(skill: SkillItem, mode?: string, customDesc?: string): string {
  const desc = customDesc || skill.description;
  return `---
name: ${mode ? `${skill.name}-${mode}` : skill.name}
description: "${frontmatterDescription(desc)}"
invokable: true
---

${generateCommandBody(skill, mode, customDesc)}`;
}

/** GitHub Copilot prompt files use the .prompt.md extension. */
export function generateCopilotPrompt(skill: SkillItem, mode?: string, customDesc?: string): string {
  const desc = customDesc || skill.description;
  return `---
description: "${frontmatterDescription(desc)}"
---

${generateCommandBody(skill, mode, customDesc)}`;
}

/**
 * Gemini CLI (and Antigravity) require TOML: only `prompt` (required) and
 * `description` (optional) are read. Markdown placed in .gemini/commands is
 * never discovered, so this is the only valid format for that harness.
 */
export function generateGeminiToml(skill: SkillItem, mode?: string, customDesc?: string): string {
  const desc = customDesc || skill.description;
  const body = generateCommandBody(skill, mode, customDesc).replace(/"""/g, '\\"\\"\\"');
  return `description = "${frontmatterDescription(desc)}"
prompt = """
${body}"""
`;
}

/** Kept for the Windsurf workflow body (its files read as workflows, not commands). */
export function generateWorkflowMarkdown(skill: SkillItem, mode?: string, customDesc?: string): string {
  const lead = renderLead(skill);
  const modeText = mode ? ` - Mode: ${mode}` : "";
  const desc = customDesc || skill.description;

  return `# Workflow: ${skill.name}${modeText}
${desc}

## Steps:
1. Inspect \`~/.agents/skills/${skill.name}/SKILL.md\`${mode ? ` and \`references/${mode}.md\`` : ""}.
2. Adopt persona: ${lead}.
3. Execute user request strictly adhering to the department's verification checklist.
4. Run \`bun test\` and audit changes before concluding.
`;
}

export interface HarnessSurface {
  /** Full suffix for the command file, including the dot (".md", ".toml", ".prompt"). */
  extension: string;
  generate: (skill: SkillItem, mode?: string, customDesc?: string) => string;
}

/** One writer for every harness: 46 skills + 10 aliases + one command per routable mode. */
export function writeHarnessCommands(destDir: string, skills: SkillItem[], surface: HarnessSurface): number {
  fs.mkdirSync(destDir, { recursive: true });
  const { extension, generate } = surface;
  let count = 0;

  for (const skill of skills) {
    fs.writeFileSync(path.join(destDir, `${skill.name}${extension}`), generate(skill));
    count++;
  }

  for (const sub of SUBMODE_ALIASES) {
    const parentSkill = skills.find((s) => s.name === sub.skill);
    if (!parentSkill) continue;
    fs.writeFileSync(path.join(destDir, `${sub.command}${extension}`), generate(parentSkill, sub.mode, sub.desc));
    count++;
  }

  count += writeSkillModeCommands(destDir, skills, (skill, mode, desc) => generate(skill, mode, desc), extension);

  return count;
}

const MARKDOWN_SURFACE: HarnessSurface = { extension: ".md", generate: generateMarkdownCommand };

/** OpenCode: ~/.config/opencode/commands (global) or .opencode/commands (project). */
export function exportOpenCodeCommands(destDir: string, skills: SkillItem[]): number {
  return writeHarnessCommands(destDir, skills, MARKDOWN_SURFACE);
}

/** Claude Code: ~/.claude/commands (user) or .claude/commands (project). */
export function exportClaudeCommands(destDir: string, skills: SkillItem[]): number {
  return writeHarnessCommands(destDir, skills, MARKDOWN_SURFACE);
}

/** Cursor: .cursor/commands (project). */
export function exportCursorCommands(destDir: string, skills: SkillItem[]): number {
  return writeHarnessCommands(destDir, skills, MARKDOWN_SURFACE);
}

/** Roo Code: .roo/commands (project) or ~/.roo/commands (global). */
export function exportRooCommands(destDir: string, skills: SkillItem[]): number {
  return writeHarnessCommands(destDir, skills, MARKDOWN_SURFACE);
}

/**
 * Older versions wrote markdown into .gemini/commands, which Gemini CLI never
 * discovers. Remove only OUR named leftovers — never an unrelated user file.
 */
function pruneSupersededMarkdown(destDir: string, skills: SkillItem[]): number {
  if (!fs.existsSync(destDir)) return 0;
  const known = new Set([
    ...skills.map((skill) => skill.name),
    ...SUBMODE_ALIASES.map((alias) => alias.command),
    ...getSkillModeCommands(skills).map((entry) => entry.command),
  ]);
  let removed = 0;
  for (const file of fs.readdirSync(destDir)) {
    if (!file.endsWith(".md")) continue;
    const command = file.slice(0, -".md".length);
    if (!known.has(command)) continue;
    fs.rmSync(path.join(destDir, file), { force: true });
    removed++;
  }
  return removed;
}

/** Qwen Code: .qwen/commands (markdown with optional frontmatter; TOML is deprecated there). */
export function exportQwenCommands(destDir: string, skills: SkillItem[]): number {
  return writeHarnessCommands(destDir, skills, MARKDOWN_SURFACE);
}

/**
 * Gemini CLI was retired on 2026-06-18 in favour of Antigravity CLI, which
 * reads `.agents/skills` directly. TOML commands remain here because Gemini CLI
 * paid/enterprise users still exist and Antigravity's migration imports them.
 */
/** Gemini CLI (legacy) / Antigravity: .gemini/commands — TOML only. */
export function exportGeminiCommands(destDir: string, skills: SkillItem[]): number {
  const count = writeHarnessCommands(destDir, skills, { extension: ".toml", generate: generateGeminiToml });
  pruneSupersededMarkdown(destDir, skills);
  return count;
}

/** GitHub Copilot: .github/prompts/*.prompt.md (project). */
export function exportCopilotPrompts(destDir: string, skills: SkillItem[]): number {
  return writeHarnessCommands(destDir, skills, { extension: ".prompt.md", generate: generateCopilotPrompt });
}

/** Continue: .continue/prompts (project) or ~/.continue/prompts (global). */
export function exportContinuePrompts(destDir: string, skills: SkillItem[]): number {
  return writeHarnessCommands(destDir, skills, { extension: ".prompt", generate: generateContinuePrompt });
}

/** Windsurf: .windsurf/workflows (project). */
export function exportWindsurfWorkflows(destDir: string, skills: SkillItem[]): number {
  return writeHarnessCommands(destDir, skills, { extension: ".md", generate: generateWorkflowMarkdown });
}

/**
 * Resolve a skill's on-disk source directory from its skills.json `path`
 * (e.g. "skills/core-engine/updatedocs/SKILL.md" → "skills/core-engine/updatedocs").
 * Skills never live at REPO_ROOT/<name>; resolving by bare name installs nothing.
 */
export function resolveSkillSourceDir(skill: SkillItem): string {
  const raw = typeof skill.path === "string" && skill.path.trim() !== "" ? skill.path.trim() : skill.name;
  const resolved = path.resolve(REPO_ROOT, raw);
  const rel = path.relative(REPO_ROOT, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Skill path '${raw}' escapes the repository.`);
  }
  return path.basename(resolved) === "SKILL.md" ? path.dirname(resolved) : resolved;
}

export const MUSE_VERSION_MARKER = ".muse-version";

/**
 * Mirror an installed skills tree into another harness's skill root as
 * symlinks, so an update to the canonical root is immediately visible there
 * (Amp and Claude Code both read their own roots; copying would go stale).
 * Falls back to a copy where symlinks are unavailable (e.g. Windows without
 * developer mode).
 */
export function exportSkillMirror(root: string, skills: SkillItem[], sourceRoot: string): number {
  fs.mkdirSync(root, { recursive: true });
  let count = 0;
  for (const skill of skills) {
    const source = path.resolve(sourceRoot, skill.name);
    if (!fs.existsSync(source)) continue;
    const dest = path.join(root, skill.name);
    fs.rmSync(dest, { recursive: true, force: true });
    try {
      fs.symlinkSync(source, dest, "dir");
    } catch {
      fs.cpSync(source, dest, { recursive: true });
    }
    count++;
  }
  return count;
}

export function exportSkills(targetDir: string, skills: SkillItem[]): number {
  fs.mkdirSync(targetDir, { recursive: true });
  let count = 0;
  const missing: string[] = [];

  for (const skill of skills) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(skill.name)) {
      throw new Error(`Invalid skill name '${skill.name}': refusing to write outside the target directory.`);
    }
    const srcDir = resolveSkillSourceDir(skill);
    const destDir = path.join(targetDir, skill.name);
    if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
      missing.push(`${skill.name} → ${srcDir}`);
      continue;
    }
    const staging = `${destDir}.staging-${process.pid}`;
    fs.rmSync(staging, { recursive: true, force: true });
    fs.cpSync(srcDir, staging, { recursive: true });
    fs.rmSync(destDir, { recursive: true, force: true });
    fs.renameSync(staging, destDir);
    count++;
  }

  // Stamp the installed version so `muse doctor` / `muse update` can tell
  // whether this device is current without guessing from skill versions.
  let version = "unknown";
  try {
    version = (JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8")) as { version: string })
      .version;
  } catch {
    // keep "unknown": doctor reports an unversioned install rather than failing
  }
  fs.writeFileSync(path.join(targetDir, MUSE_VERSION_MARKER), `v${version}\n`, "utf8");

  // Ship the harness map with the install so the portable doctor (which lives
  // inside a skill) can verify destinations without the repository.
  const registrySource = path.join(REPO_ROOT, "harness.json");
  if (fs.existsSync(registrySource)) {
    fs.mkdirSync(path.join(targetDir, ".muse"), { recursive: true });
    fs.copyFileSync(registrySource, path.join(targetDir, ".muse", "harness.json"));
  }

  // Never swallow a missing source: a silent skip is exactly how the exporter
  // ended up shipping commands that pointed at never-installed skills.
  if (missing.length > 0) {
    throw new Error(
      `exportSkills: ${missing.length} skill source directory(ies) missing — refusing to ship commands for uninstalled skills:\n  ${missing.join("\n  ")}`,
    );
  }

  return count;
}

export const SECRETARY_ROUTER_START = "[//]: # (muse-secretary-router:start)";
export const SECRETARY_ROUTER_END = "[//]: # (muse-secretary-router:end)";
/** Sentinel dialect written by older versions of this exporter (updateagents never shipped it). */
export const LEGACY_SECRETARY_ROUTER_START = "<!-- muse-secretary-router:start -->";

export function wireSecretaryIntoAgentsMd(targetAgentsMdPath: string): boolean {
  if (!fs.existsSync(targetAgentsMdPath)) return false;

  const content = fs.readFileSync(targetAgentsMdPath, "utf8");
  // Dedupe across BOTH dialects: updateagents writes the markdown reference-comment
  // sentinel, so an HTML-comment-only check re-injected a second router block.
  if (content.includes(SECRETARY_ROUTER_START) || content.includes(LEGACY_SECRETARY_ROUTER_START)) {
    return false; // Already wired
  }

  const hookBlock = `
${SECRETARY_ROUTER_START}
## 🏛️ Autonomous Agency Orchestration (Secretary Protocol)
- **Default Session Orchestrator**: On session start or when receiving non-trivial agency tasks (coding, design, marketing, operations, reviews), immediately activate **\`secretary:dispatch\`** (\`view_file ~/.agents/skills/secretary/references/dispatch.md\`).
- **Autonomous Routing**: Triage user intent against the 46 canonical Muse departments, adopt the designated Council Lead persona (**Sol**, **Jasper**, **Crew**, **Nexus**), and selectively load only the matching \`references/<mode>.md\` before writing code.
- **Verification Gate**: All work must pass the pre-merge contract (\`bun test\`, lint, zero secret exposure) before claiming completion.
${SECRETARY_ROUTER_END}
`;

  fs.writeFileSync(targetAgentsMdPath, content + hookBlock);
  return true;
}

export interface SetupOptions {
  workspaceRoot?: string;
  installSkills?: boolean;
  skillsDest?: string;
  exportCommands?: boolean;
  wireAgentsMd?: boolean;
}

export function runSetup(options: SetupOptions = {}): void {
  const workspaceRoot = options.workspaceRoot || process.cwd();
  const userHome = process.env.HOME || os.homedir();
  const skills = getSkills();

  console.log("🚀 [Muse Engine] Initializing Multi-Harness Command Exporter & Onboarding...\n");
  console.log(`📦 Loaded ${skills.length} canonical Muse skills from skills.json`);

  const doSkills = options.installSkills !== false;
  const doCommands = options.exportCommands !== false;
  // Opt-in only: never append to a global/local AGENTS.md unless the caller
  // explicitly requests it (--wire-agents).
  const doWire = options.wireAgentsMd === true;

  // 1. Install Skills
  const canonicalSkillsRoot = options.skillsDest || path.join(userHome, ".agents", "skills");
  if (doSkills) {
    const count = exportSkills(canonicalSkillsRoot, skills);
    console.log(`✅ Skills: Installed ${count} canonical departments → ${canonicalSkillsRoot}`);

    // Amp reads ~/.agents/skills already; Claude Code reads its own root, and
    // Amp also falls back to it. Mirror by symlink so refreshes propagate.
    for (const mirror of [path.join(userHome, ".claude", "skills"), path.join(workspaceRoot, ".claude", "skills")]) {
      if (!fs.existsSync(path.dirname(mirror))) continue;
      const mirrored = exportSkillMirror(mirror, skills, canonicalSkillsRoot);
      console.log(`✅ Skills (Claude Code / Amp): ${mirrored} linked → ${mirror}`);
    }
  }

  // 2. Export Slash Commands
  // Destinations come from harness.json — the same registry the install matrix,
  // `muse doctor`, and the README table read — so a retired surface (Codex
  // prompts, Gemini commands beyond migration) is never written silently.
  let totalCommands = 0;
  if (doCommands) {
    const registry = loadHarnessRegistry();
    const generators: Record<HarnessFormat, (skill: SkillItem, mode?: string, desc?: string) => string> = {
      markdown: generateMarkdownCommand,
      toml: generateGeminiToml,
      copilot: generateCopilotPrompt,
      continue: generateContinuePrompt,
      workflow: generateWorkflowMarkdown,
    };

    for (const destination of commandDestinations(registry, { home: userHome, workspace: workspaceRoot })) {
      if (!fs.existsSync(destination.gate)) continue;
      // Gemini's writer also prunes markdown left by the pre-TOML releases.
      const count =
        destination.format === "toml"
          ? exportGeminiCommands(destination.dir, skills)
          : writeHarnessCommands(destination.dir, skills, {
              extension: destination.extension,
              generate: generators[destination.format],
            });
      const scope = destination.scope === "global" ? "Global" : "Local";
      const label =
        destination.harness.status === "legacy" ? `${destination.harness.label} (legacy)` : destination.harness.label;
      const noun = destination.format === "workflow" ? "workflows" : "commands";
      console.log(`✅ ${label} (${scope}): Exported ${count} ${noun} → ${destination.dir}`);
      totalCommands += count;
    }
  }

  // 3. Wire Secretary into AGENTS.md
  if (doWire) {
    const globalAgentsMd = path.join(userHome, ".agents", "AGENTS.md");
    const localAgentsMd = path.join(workspaceRoot, "AGENTS.md");

    if (wireSecretaryIntoAgentsMd(globalAgentsMd)) {
      console.log(`✅ Injected Secretary Dispatch Protocol into Global AGENTS.md (${globalAgentsMd})`);
    }
    if (wireSecretaryIntoAgentsMd(localAgentsMd)) {
      console.log(`✅ Injected Secretary Dispatch Protocol into Local AGENTS.md (${localAgentsMd})`);
    }
  }

  console.log(
    `\n🎉 Setup Complete: Active across all detected harnesses!${totalCommands > 0 ? ` (${totalCommands} slash commands exported)` : ""}`,
  );
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const opts: SetupOptions = {
    installSkills: true,
    exportCommands: true,
    wireAgentsMd: false,
  };

  if (args.includes("--wire-agents")) {
    opts.wireAgentsMd = true;
  }

  if (args.includes("--skills-only")) {
    opts.exportCommands = false;
    opts.wireAgentsMd = false;
  } else if (args.includes("--commands-only")) {
    opts.installSkills = false;
    opts.wireAgentsMd = false;
  }

  const destIdx = args.indexOf("--skills-dest");
  if (destIdx !== -1 && args[destIdx + 1]) {
    opts.skillsDest = path.resolve(args[destIdx + 1]);
  }

  runSetup(opts);

  if (args.includes("--onboard") || args.includes("--interview")) {
    const isGlobal = !args.includes("--project");
    const updateagentsScript = path.join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");
    spawnSync("bun", [updateagentsScript, "--onboard", isGlobal ? "--global" : ""].filter(Boolean), {
      stdio: "inherit",
    });
  }
}
