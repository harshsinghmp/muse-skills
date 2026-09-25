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
import { exportAntigravityCommands, exportOpenCodeCommands, getSkills } from "./export-commands";

const REPO_ROOT = path.resolve(__dirname, "..");
const DISPATCH_MD_PATH = path.join(REPO_ROOT, "secretary", "references", "dispatch.md");

const COUNCIL_LEADS: Record<string, string> = {
  webdev: "Sol",
  database: "Sol",
  devops: "Sol",
  mobile: "Sol",
  automation: "Sol",
  telegram: "Sol",
  relay: "Sol",
  pua: "Sol",
  "new-project": "Sol",
  updatedocs: "Sol",
  "clean-system-cache": "Sol",

  design: "Jasper",
  smm: "Jasper",
  content: "Jasper",
  seo: "Jasper",
  brand: "Crew & Jasper",
  growth: "Jasper & Crew",
  animate: "Jasper",
  designscope: "Jasper",
  humanize: "Jasper",

  ops: "Crew",
  accounts: "Crew",
  "client-comms": "Crew",
  retain: "Crew",
  gtm: "Crew",
  "sales-enablement": "Crew",
  paidads: "Crew & Jasper",
  coach: "Crew",
  "periodic-retreat": "Sol & Crew",

  secretary: "Nexus & Sol",
  "code-review": "Nexus",
  audit: "Nexus",
  "qa-launch": "Nexus",
  "muse-security": "Nexus",
  refactor: "Nexus & Sol",
  git: "Nexus",
  "ai-ready": "Nexus",
  "gauntlet-loop": "Nexus",
  "dead-letter": "Nexus",
  "coupling-router": "Sol & Nexus",
  "context-anchor": "Sol",
  "evidence-ledger": "Crew & Nexus",
  updateagents: "Nexus",
  research: "Sol & Jasper",
};

export function getModesForSkill(skillName: string): string[] {
  const refDir = path.join(REPO_ROOT, skillName, "references");
  if (!fs.existsSync(refDir)) return [];
  return fs
    .readdirSync(refDir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("."))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

export function buildDirectoryMarkdown(): string {
  const skills = getSkills();
  const byCategory: Record<string, typeof skills> = {};

  for (const s of skills) {
    if (!byCategory[s.category]) byCategory[s.category] = [];
    byCategory[s.category].push(s);
  }

  let md = `## 📋 Canonical 46-Department Agency Directory\n\n`;
  md += `When triaging incoming prompts, match the user's objective to the canonical department and select the exact operating mode. Load **only** that mode's reference file into context.\n\n`;

  // 1. Agency Delivery Division
  md += `### 1. Agency Delivery Division (Client Deliverables & Revenue Engines)\n\n`;
  md += `| Department | Canonical Modes | Council Lead | Primary Intent & Trigger Keywords | Reference Path |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;

  for (const s of byCategory["agency-delivery"] || []) {
    const modes = getModesForSkill(s.name);
    const modeList = modes.length > 0 ? modes.map((m) => `\`${m}\``).join(", ") : "`default`";
    const lead = COUNCIL_LEADS[s.name] || "Nexus";
    const shortDesc = s.description.split(".")[0].replace(/\|/g, "-");
    md += `| **\`${s.name}\`** | ${modeList} | **${lead}** | ${shortDesc}. | \`${s.name}/references/<mode>.md\` |\n`;
  }

  // 2. Context Orchestration & Memory Division
  md += `\n---\n\n### 2. Context Orchestration & Memory Division\n\n`;
  md += `| Department | Purpose & Invariant | Council Lead |\n`;
  md += `| :--- | :--- | :--- |\n`;
  for (const s of byCategory["context-orchestration"] || []) {
    const lead = COUNCIL_LEADS[s.name] || "Nexus";
    const shortDesc = s.description.split(".")[0].replace(/\|/g, "-");
    md += `| **\`${s.name}\`** | ${shortDesc}. | **${lead}** |\n`;
  }

  // 3. Core Engine & Scaffolding Division
  md += `\n---\n\n### 3. Core Engine & Scaffolding Division\n\n`;
  md += `| Department | Purpose & Invariant | Council Lead |\n`;
  md += `| :--- | :--- | :--- |\n`;
  for (const s of byCategory["core-engine"] || []) {
    const lead = COUNCIL_LEADS[s.name] || "Sol";
    const shortDesc = s.description.split(".")[0].replace(/\|/g, "-");
    md += `| **\`${s.name}\`** | ${shortDesc}. | **${lead}** |\n`;
  }

  // 4. Quality Review & Hardening Division (The Nexus Gate)
  md += `\n---\n\n### 4. Quality Review & Hardening Division (The Nexus Gate)\n\n`;
  md += `| Department | Purpose & Invariant | Council Lead |\n`;
  md += `| :--- | :--- | :--- |\n`;
  for (const s of byCategory["quality-review"] || []) {
    const lead = COUNCIL_LEADS[s.name] || "Nexus";
    const shortDesc = s.description.split(".")[0].replace(/\|/g, "-");
    md += `| **\`${s.name}\`** | ${shortDesc}. | **${lead}** |\n`;
  }

  // 5. Interface & Visual Engineering Division
  md += `\n---\n\n### 5. Interface & Visual Engineering Division\n\n`;
  md += `| Department | Purpose & Invariant | Council Lead |\n`;
  md += `| :--- | :--- | :--- |\n`;
  for (const s of byCategory["design-interface"] || []) {
    const lead = COUNCIL_LEADS[s.name] || "Jasper";
    const shortDesc = s.description.split(".")[0].replace(/\|/g, "-");
    md += `| **\`${s.name}\`** | ${shortDesc}. | **${lead}** |\n`;
  }

  // 6. Reflection & Systems Maintenance Division
  md += `\n---\n\n### 6. Reflection & Systems Maintenance Division\n\n`;
  md += `| Department | Purpose & Invariant | Council Lead |\n`;
  md += `| :--- | :--- | :--- |\n`;
  for (const s of byCategory["reflection-maintenance"] || []) {
    const lead = COUNCIL_LEADS[s.name] || "Crew";
    const shortDesc = s.description.split(".")[0].replace(/\|/g, "-");
    md += `| **\`${s.name}\`** | ${shortDesc}. | **${lead}** |\n`;
  }

  return md;
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
  const newContent = content.slice(0, startIndex + startMarker.length) + "\n" + generatedDir + content.slice(endIndex);

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

  // Refresh commands across active harnesses
  const skills = getSkills();
  const userHome = process.env.HOME || os.homedir();

  const opencodeGlobal = path.join(userHome, ".config", "opencode", "commands");
  if (fs.existsSync(path.dirname(opencodeGlobal))) {
    exportOpenCodeCommands(opencodeGlobal, skills);
  }

  const geminiGlobal = path.join(userHome, ".gemini", "commands");
  if (fs.existsSync(path.dirname(geminiGlobal))) {
    exportAntigravityCommands(geminiGlobal, skills);
  }

  console.log("🎉 Secretary Dispatcher & Multi-Harness Commands are fully synchronized!");
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  if (args.includes("--check")) {
    const hasDrift = syncDispatchMarkdown(true);
    if (hasDrift) {
      console.error(
        "❌ Drift detected in secretary/references/dispatch.md! Run 'bun scripts/sync-dispatch.ts' to synchronize.",
      );
      process.exit(1);
    } else {
      console.log("✅ secretary/references/dispatch.md is in perfect sync with skills.json and reference directories.");
      process.exit(0);
    }
  }

  syncAll();
}
