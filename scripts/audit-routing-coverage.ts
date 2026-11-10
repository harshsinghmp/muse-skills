#!/usr/bin/env bun
/**
 * audit-routing-coverage — publishes which modes the router can actually reach.
 *
 * Three different things get called "coverage", so keep them apart:
 *   - anchors:   every mode has reviewable anchor phrases (mode-signals.json);
 *   - curated:   a concept / fast path / intent / default names the mode, so it
 *                can win on unseen vocabulary;
 *   - name-only: the rest — reachable only by matching name or description.
 *
 * The name-only set is where blind routing fails, so its size is a number worth
 * gating: it may not grow silently.
 *
 *   bun scripts/audit-routing-coverage.ts --write
 *   bun scripts/audit-routing-coverage.ts --check
 */

import fs from "node:fs";
import path from "node:path";
import {
  CONCEPTS,
  DEFAULT_MODE,
  FAST_PATH_RULES,
  INTENT_SIGNALS,
} from "../skills/context-orchestration/secretary/scripts/secretary";
import { getSkillModeCommands, getSkills } from "./export-commands";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const OUT_PATH = path.join(REPO_ROOT, "routing-coverage.json");

export interface Coverage {
  generatedAt: string;
  total: number;
  curated: number;
  nameOnly: string[];
}

export function buildCoverage(now = new Date().toISOString().slice(0, 10)): Coverage {
  const routes = getSkillModeCommands(getSkills()).map((entry) => `${entry.skill}:${entry.mode}`);
  const curated = new Set<string>();

  for (const concept of CONCEPTS) if (concept.mode) curated.add(`${concept.department}:${concept.mode}`);
  for (const fastPath of FAST_PATH_RULES) curated.add(`${fastPath.department}:${fastPath.mode}`);
  for (const intent of INTENT_SIGNALS) if (intent.mode) curated.add(`${intent.department}:${intent.mode}`);
  for (const [skill, mode] of Object.entries(DEFAULT_MODE)) curated.add(`${skill}:${mode}`);

  const nameOnly = [...new Set(routes)].filter((route) => !curated.has(route)).sort();
  return { generatedAt: now, total: new Set(routes).size, curated: new Set(routes).size - nameOnly.length, nameOnly };
}

function serialise(coverage: Coverage): string {
  return `${JSON.stringify(coverage, null, 2)}\n`;
}

/** Stable across runs: the timestamp is not part of the comparison. */
export function sameCoverage(a: Coverage, b: Coverage): boolean {
  return (
    a.total === b.total &&
    a.curated === b.curated &&
    a.nameOnly.length === b.nameOnly.length &&
    a.nameOnly.every((route, index) => route === b.nameOnly[index])
  );
}

if (import.meta.main) {
  const write = process.argv.includes("--write");
  const coverage = buildCoverage();

  if (!write) {
    const current = JSON.parse(fs.readFileSync(OUT_PATH, "utf8")) as Coverage;
    if (!sameCoverage(current, { ...coverage, generatedAt: current.generatedAt })) {
      console.error(
        `❌ routing-coverage.json is stale (${current.nameOnly.length} name-only → ${coverage.nameOnly.length}).`,
      );
      console.error("   Run `bun scripts/audit-routing-coverage.ts --write` and review the diff.");
      process.exit(1);
    }
    console.log(
      `✅ routing coverage current: ${coverage.curated}/${coverage.total} curated, ${coverage.nameOnly.length} name-only.`,
    );
    process.exit(0);
  }

  fs.writeFileSync(OUT_PATH, serialise(coverage), "utf8");
  console.log(
    `✅ routing coverage written: ${coverage.curated}/${coverage.total} curated, ${coverage.nameOnly.length} name-only.`,
  );
}
