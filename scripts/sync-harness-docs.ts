#!/usr/bin/env bun
/**
 * sync-harness-docs — renders the README harness table from harness.json.
 *
 * One registry, one rendered table. `--check` fails when the README drifted,
 * so a harness cannot be added, retired, or have its format changed without the
 * public documentation following.
 *
 * Usage:
 *   bun scripts/sync-harness-docs.ts --write
 *   bun scripts/sync-harness-docs.ts --check
 */

import fs from "node:fs";
import path from "node:path";
import { type Harness, loadHarnessRegistry } from "./harness-registry";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const README_PATH = path.join(REPO_ROOT, "README.md");
const START = "<!-- harness-matrix:start -->";
const END = "<!-- harness-matrix:end -->";

function statusCell(harness: Harness): string {
  if (harness.status === "active") return "✅ active";
  if (harness.status === "legacy") return "⚠️ legacy";
  return "🧩 skills-only";
}

function location(template: string | undefined, kind: "project" | "global"): string {
  if (!template) return "—";
  const trimmed = template.replace(/^~/, "").replace(/^<project>/, "");
  const rendered = kind === "global" ? `\`~${trimmed}\`` : `\`${trimmed.replace(/^\//, "")}\``;
  return rendered;
}

export function renderHarnessTable(): string {
  const registry = loadHarnessRegistry();
  const rows = registry.harnesses.map((harness) => {
    const format = harness.commands
      ? `\`${harness.commands.extension}\` (${harness.commands.format})`
      : "`SKILL.md` only";
    return `| ${harness.label} | ${statusCell(harness)} | ${location(harness.commands?.project, "project")} | ${location(
      harness.commands?.global,
      "global",
    )} | ${format} |`;
  });

  const active = registry.harnesses.filter((harness) => harness.status === "active").length;
  const skillsOnly = registry.harnesses.filter((harness) => harness.status === "skills-only").length;
  const legacy = registry.harnesses.filter((harness) => harness.status === "legacy").length;
  const skillRoots = registry.harnesses
    .flatMap((harness) => harness.skills)
    .filter((root, index, all) => all.indexOf(root) === index)
    .map((root) => `\`${root}\``)
    .join(", ");

  return [
    "| Harness | Status | Project commands | Global commands | Format |",
    "| :--- | :--- | :--- | :--- | :--- |",
    ...rows,
    "",
    `**${active} active · ${skillsOnly} skills-only · ${legacy} legacy.** Skill roots read directly by these harnesses: ${skillRoots}.`,
  ].join("\n");
}

function sync(write: boolean): boolean {
  const readme = fs.readFileSync(README_PATH, "utf8");
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`README is missing the ${START} / ${END} markers.`);
  }
  const next = `${readme.slice(0, start + START.length)}\n${renderHarnessTable()}\n${readme.slice(end)}`;
  if (next === readme) return false;
  if (write) fs.writeFileSync(README_PATH, next, "utf8");
  return true;
}

if (import.meta.main) {
  const args = Bun.argv.slice(2);
  if (args.includes("--check")) {
    const drifted = sync(false);
    if (drifted) {
      console.error(
        "❌ README harness table is out of sync with harness.json. Run `bun scripts/sync-harness-docs.ts --write`.",
      );
      process.exit(1);
    }
    console.log("✅ README harness table matches harness.json.");
    process.exit(0);
  }
  sync(true);
  console.log("✅ README harness table regenerated from harness.json.");
}
