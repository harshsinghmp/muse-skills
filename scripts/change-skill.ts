#!/usr/bin/env bun
/**
 * change-skill — run, in order, everything that must move when a skill changes.
 *
 * Adding a mode touches eleven generated artifacts across six directories, and
 * forgetting one is silent: the skill still loads, the command still exports,
 * and only a gate fails much later. This runs the cascade in dependency order
 * and stops at the first failure, so the fix lands where the break is.
 *
 *   bun run change:skill --type new-mode
 *   bun run change:skill --type new-skill --dry-run
 *
 * Types (what the change is, not what to run):
 *   new-mode      a references/<mode>.md added
 *   new-skill     a new skills/<division>/<skill>/SKILL.md
 *   edit-mode     a mode reference edited
 *   edit-skill    SKILL.md frontmatter or body edited
 *   rename-mode   a mode file or name changed
 *
 * The full playbook — including the steps this script cannot do for you —
 * is `docs/SKILL-CHANGE-PLAYBOOK.md`.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const args = Bun.argv.slice(2);
const typeIndex = args.indexOf("--type");
const type = typeIndex === -1 ? "" : (args[typeIndex + 1] ?? "");
const dryRun = args.includes("--dry-run");

const TYPES = new Set(["new-mode", "new-skill", "edit-mode", "edit-skill", "rename-mode"]);

interface Step {
  name: string;
  command: string[];
  /** Why this step exists, printed before it runs. */
  why: string;
}

const REGENERATE: Step[] = [
  {
    name: "registry + dispatcher",
    command: ["bun", "run", "sync"],
    why: "skills.json versions/descriptions, dispatch.md directory, mode-signals, routing-defaults",
  },
  {
    name: "discovery surfaces",
    command: ["bun", "run", "sync:surface"],
    why: "SKILL.md mode tables, per-skill README, llms.txt, skills.json, agents/openai.yaml",
  },
  {
    name: "routing signals",
    command: ["bun", "run", "sync:routing:signals"],
    why: "the reviewable mirror of fast paths, intents, concepts, defaults, leads",
  },
  {
    name: "routing coverage",
    command: ["bun", "run", "sync:routing:coverage"],
    why: "curated vs name-only modes; a new mode lands as name-only until curated",
  },
  {
    name: "routing baseline",
    command: ["bun", "run", "sync:routing:baseline"],
    why: "re-measure all distributions; a new mode can shift scores, never lower them silently",
  },
  {
    name: "routing docs",
    command: ["bun", "run", "sync:routing:docs"],
    why: "the README accuracy table and coverage line",
  },
];

const VERIFY: Step[] = [
  {
    name: "gates",
    command: ["bun", "run", "verify"],
    why: "lint, types, tests, surfaces, install matrix, ledger, routing — all of it",
  },
];

function run(step: Step): boolean {
  console.log(`\n▶︎  ${step.name}\n    ${step.why}\n    $ ${step.command.join(" ")}`);
  if (dryRun) return true;
  const result = spawnSync(step.command[0], step.command.slice(1), { cwd: ROOT, stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`\n❌ ${step.name} failed — fix this before continuing; later steps read its output.`);
    return false;
  }
  return true;
}

if (!TYPES.has(type)) {
  console.error(`usage: bun run change:skill --type <${[...TYPES].join("|")}> [--dry-run]`);
  console.error("see docs/SKILL-CHANGE-PLAYBOOK.md for the full order of work");
  process.exit(1);
}

const needsSkillRename = type === "rename-mode" || type === "new-skill";
console.log(`change:skill — ${type}${dryRun ? " (dry run)" : ""}`);

if (needsSkillRename) {
  console.log(`
⚠︎  ${type} changes a command name or adds a skill. Before the cascade:
    • update every mode list in the affected SKILL.md by hand — the generator
      adds rows but never renames or removes them
    • delete the old \`references/<mode>.md\` (a stale file keeps exporting)
    • check \`skills.json\` for a \`defaultMode\` pointing at a removed mode`);
}

for (const step of REGENERATE) {
  if (!run(step)) process.exit(1);
}

console.log(`
Manual steps the generator cannot infer (see the playbook):
  • README per-skill "across N modes" counts when a mode was added
  • CHANGELOG entry under [Unreleased]
  • \`skills.json\` councilLead/defaultMode for a new skill
  • routing concepts: a new mode is name-only until a curated signal names it`);

for (const step of VERIFY) {
  if (!run(step)) process.exit(1);
}

console.log(`\n✅ ${type}: cascade complete and every gate green.`);
