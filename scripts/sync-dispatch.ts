#!/usr/bin/env bun
/**
 * sync-dispatch.ts — Automatic Secretary Directory & Multi-Harness Sync Engine
 *
 * Ensures that whenever any skill, mode, or feature is updated in muse-skills:
 * 1. The 46-Department Agency Directory in secretary/references/dispatch.md is auto-updated.
 * 2. All exported slash commands across harnesses (.opencode, .gemini, etc.) are refreshed.
 * 3. The --check flag enforces zero-drift in CI and test suites.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  exportGeminiCommands,
  exportOpenCodeCommands,
  getSkills,
  isModeRefFile,
  resolveSkillSourceDir,
} from "./export-commands";

const REPO_ROOT = path.resolve(__dirname, "..");
const DISPATCH_MD_PATH = path.join(
  REPO_ROOT,
  "skills",
  "context-orchestration",
  "secretary",
  "references",
  "dispatch.md",
);
const ROUTING_DEFAULTS_PATH = path.join(
  REPO_ROOT,
  "skills",
  "context-orchestration",
  "secretary",
  "scripts",
  "routing-defaults.ts",
);
const MODE_SIGNALS_PATH = path.join(
  REPO_ROOT,
  "skills",
  "context-orchestration",
  "secretary",
  "references",
  "mode-signals.json",
);

export function getModesForSkill(skillName: string): string[] {
  const skills = getSkills();
  const found = skills.find((s) => s.name === skillName);
  const refDir = found
    ? path.join(REPO_ROOT, path.dirname(found.path), "references")
    : path.join(REPO_ROOT, skillName, "references");
  if (!fs.existsSync(refDir)) return [];
  // Same convention as the command exporter: only lowercase kebab-case
  // reference files are routable modes; uppercase files are governance docs.
  return fs
    .readdirSync(refDir)
    .filter((f) => isModeRefFile(f))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

/** Divisions are rendered with one uniform 5-column table so every department
 *  advertises its routable modes — a department without a mode list cannot be
 *  dispatched to a specific reference file. */
const DIVISIONS: Array<{ category: string; heading: string; fallbackLead: string }> = [
  {
    category: "agency-delivery",
    heading: "1. Agency Delivery Division (Client Deliverables & Revenue Engines)",
    fallbackLead: "Nexus",
  },
  { category: "context-orchestration", heading: "2. Context Orchestration & Memory Division", fallbackLead: "Nexus" },
  { category: "core-engine", heading: "3. Core Engine & Scaffolding Division", fallbackLead: "Sol" },
  {
    category: "quality-review",
    heading: "4. Quality Review & Hardening Division (The Nexus Gate)",
    fallbackLead: "Nexus",
  },
  { category: "design-interface", heading: "5. Interface & Visual Engineering Division", fallbackLead: "Jasper" },
  {
    category: "reflection-maintenance",
    heading: "6. Reflection & Systems Maintenance Division",
    fallbackLead: "Crew",
  },
];

export function buildDirectoryMarkdown(): string {
  const skills = getSkills();
  const byCategory: Record<string, typeof skills> = {};

  for (const s of skills) {
    if (!byCategory[s.category]) byCategory[s.category] = [];
    byCategory[s.category].push(s);
  }

  let md = `## 📋 Canonical 46-Department Agency Directory\n\n`;
  md += `When triaging incoming prompts, match the user's objective to the canonical department and select the exact operating mode. Load **only** that mode's reference file into context.\n`;

  for (const division of DIVISIONS) {
    md += `\n---\n\n### ${division.heading}\n\n`;
    md += `| Department | Canonical Modes | Council Lead | Primary Intent & Trigger Keywords | Reference Path |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    for (const s of byCategory[division.category] || []) {
      const modes = getModesForSkill(s.name);
      const modeList = modes.length > 0 ? modes.map((m) => `\`${m}\``).join(", ") : "—";
      const lead = s.councilLead ?? division.fallbackLead;
      const shortDesc = s.description.split(".")[0].replace(/\|/g, "-");
      md += `| **\`${s.name}\`** | ${modeList} | **${lead}** | ${shortDesc}. | \`${s.name}/references/<mode>.md\` |\n`;
    }
  }

  return md;
}

/** A compact signal line for a mode: its heading plus the opening of its body. */
function modeSignal(skillDir: string, mode: string): string {
  const file = path.join(skillDir, "references", `${mode}.md`);
  if (!fs.existsSync(file)) return "";
  const text = fs.readFileSync(file, "utf8");
  const heading =
    text
      .split("\n")
      .find((line) => line.startsWith("# "))
      ?.replace(/^#\s+/, "")
      .replace(/^[^\w]+/, "")
      .trim() ?? "";
  // Keep the first section's prose and bullets: a mode's opening is its intent
  // statement, and the bullets carry the vocabulary prompts actually use.
  const body = text
    .split("\n")
    .slice(1)
    .filter((line) => !line.startsWith("## "))
    .join(" ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `${heading}. ${body}`.slice(0, 420);
}

/**
 * Mode descriptions for the router. The installed secretary script cannot read
 * other skills' references (different directories once installed), so the
 * signals are generated here and shipped beside dispatch.md.
 */
export function buildModeSignals(): string {
  const skills = getSkills();
  const payload: Record<string, Record<string, string>> = {};
  for (const skill of skills) {
    const modes = getModesForSkill(skill.name);
    if (modes.length === 0) continue;
    const skillDir = resolveSkillSourceDir(skill);
    payload[skill.name] = Object.fromEntries(modes.map((mode) => [mode, modeSignal(skillDir, mode)]));
  }
  return `${JSON.stringify(payload, null, 2)}\n`;
}

/**
 * The router needs both tables at import time, so they are generated as a
 * TypeScript module (not JSON) from skills.json — the one curated source.
 */
export function buildRoutingDefaults(): string {
  const skills = getSkills();
  const leads: Record<string, string> = {};
  const defaults: Record<string, string> = {};
  for (const skill of skills) {
    if (!skill.councilLead) throw new Error(`skills.json: ${skill.name} has no councilLead`);
    if (!skill.defaultMode) throw new Error(`skills.json: ${skill.name} has no defaultMode`);
    leads[skill.name] = skill.councilLead;
    defaults[skill.name] = skill.defaultMode;
  }
  const entries = (value: Record<string, string>) =>
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, lead]) => `  ${JSON.stringify(key)}: ${JSON.stringify(lead)},`)
      .join("\n");

  return `// @generated by scripts/sync-dispatch.ts — do not edit.
// Source of truth: skills.json (councilLead, defaultMode).
export const COUNCIL_LEADS: Record<string, string> = {
${entries(leads)}
};

export const DEFAULT_MODE: Record<string, string> = {
${entries(defaults)}
};
`;
}

export function syncRoutingDefaults(dryRun: boolean = false): boolean {
  const next = buildRoutingDefaults();
  const current = fs.existsSync(ROUTING_DEFAULTS_PATH) ? fs.readFileSync(ROUTING_DEFAULTS_PATH, "utf8") : "";
  if (current === next) return false;
  if (!dryRun) fs.writeFileSync(ROUTING_DEFAULTS_PATH, next);
  return true;
}

export function syncModeSignals(dryRun: boolean = false): boolean {
  const next = buildModeSignals();
  const current = fs.existsSync(MODE_SIGNALS_PATH) ? fs.readFileSync(MODE_SIGNALS_PATH, "utf8") : "";
  if (current === next) return false;
  if (!dryRun) fs.writeFileSync(MODE_SIGNALS_PATH, next);
  return true;
}

export function syncDispatchMarkdown(dryRun: boolean = false): boolean {
  if (!fs.existsSync(DISPATCH_MD_PATH)) {
    throw new Error(`dispatch.md not found at ${DISPATCH_MD_PATH}`);
  }

  const content = fs.readFileSync(DISPATCH_MD_PATH, "utf8");
  const startMarker = "<!-- agency-directory:start -->";
  const endMarker = "<!-- agency-directory:end -->";

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Directory markers not found in ${DISPATCH_MD_PATH}`);
  }

  const generatedDir = buildDirectoryMarkdown();
  const newContent = `${content.slice(0, startIndex + startMarker.length)}\n${generatedDir}${content.slice(endIndex)}`;

  if (content === newContent) {
    return false; // Zero drift
  }

  if (!dryRun) {
    fs.writeFileSync(DISPATCH_MD_PATH, newContent);
  }

  return true; // Drift updated or detected
}

export function syncAll(): void {
  console.log("🔄 [Muse Engine] Syncing Secretary Dispatch Directory & Multi-Harness Commands...\n");

  const drifted = syncDispatchMarkdown(false);
  if (drifted) {
    console.log(`✅ Updated Agency Directory in ${DISPATCH_MD_PATH}`);
  } else {
    console.log(`✨ Agency Directory is already up-to-date in ${DISPATCH_MD_PATH}`);
  }
  if (syncRoutingDefaults(false)) {
    console.log(`✅ Updated router defaults in ${ROUTING_DEFAULTS_PATH}`);
  } else {
    console.log(`✨ Router defaults are up-to-date in ${ROUTING_DEFAULTS_PATH}`);
  }
  if (syncModeSignals(false)) {
    console.log(`✅ Updated router mode signals in ${MODE_SIGNALS_PATH}`);
  } else {
    console.log(`✨ Router mode signals are up-to-date in ${MODE_SIGNALS_PATH}`);
  }

  // Refresh commands across active harnesses
  const skills = getSkills();
  const userHome = process.env.HOME || os.homedir();

  const opencodeGlobal = path.join(userHome, ".config", "opencode", "commands");
  if (fs.existsSync(path.dirname(opencodeGlobal))) {
    exportOpenCodeCommands(opencodeGlobal, skills);
  }

  const geminiGlobal = path.join(userHome, ".gemini", "commands");
  if (fs.existsSync(path.dirname(geminiGlobal))) {
    exportGeminiCommands(geminiGlobal, skills);
  }

  console.log("🎉 Secretary Dispatcher & Multi-Harness Commands are fully synchronized!");
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  if (args.includes("--check")) {
    const hasDrift = syncDispatchMarkdown(true) || syncModeSignals(true) || syncRoutingDefaults(true);
    if (hasDrift) {
      console.error(
        "❌ Drift detected in secretary/references/dispatch.md, mode-signals.json, or routing-defaults.ts! Run 'bun scripts/sync-dispatch.ts' to synchronize.",
      );
      process.exit(1);
    } else {
      console.log("✅ secretary/references/dispatch.md is in perfect sync with skills.json and reference directories.");
      process.exit(0);
    }
  }

  syncAll();
}
