#!/usr/bin/env bun
/**
 * sync-routing-signals — one reviewable artifact for the hand-authored router tables.
 *
 * The routing data (fast paths, intent signals, concepts, verb priors, defaults,
 * council leads) lives in `secretary.ts` because it is executable. That makes it
 * hard to review as data. This mirrors it into
 * `secretary/references/routing-signals.json` and fails when the two drift, so
 * any change to routing behaviour is visible in one diff.
 *
 *   bun scripts/sync-routing-signals.ts --write
 *   bun scripts/sync-routing-signals.ts --check
 */
import fs from "node:fs";
import path from "node:path";
import {
  CONCEPTS,
  COUNCIL_LEADS,
  DEFAULT_MODE,
  FAST_PATH_RULES,
  INTENT_SIGNALS,
  VERB_HINTS,
} from "../skills/context-orchestration/secretary/scripts/secretary";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const OUTPUT = path.join(
  REPO_ROOT,
  "skills",
  "context-orchestration",
  "secretary",
  "references",
  "routing-signals.json",
);

export function buildRoutingSignals(): string {
  const payload = {
    version: 1,
    generatedFrom: "skills/context-orchestration/secretary/scripts/secretary.ts",
    note: "Generated mirror. Edit the TypeScript tables; this file is the reviewable view.",
    councilLeads: COUNCIL_LEADS,
    defaultModes: DEFAULT_MODE,
    fastPaths: FAST_PATH_RULES.map((rule) => ({
      pattern: rule.regex.source,
      flags: rule.regex.flags,
      department: rule.department,
      mode: rule.mode,
      reason: rule.reason,
    })),
    intents: INTENT_SIGNALS.map((signal) => ({
      pattern: signal.regex.source,
      flags: signal.regex.flags,
      department: signal.department,
      mode: signal.mode,
      boost: signal.boost,
    })),
    verbHints: VERB_HINTS.map((hint) => ({
      pattern: hint.regex.source,
      flags: hint.regex.flags,
      departments: hint.departments,
    })),
    concepts: CONCEPTS.map((concept) => ({
      department: concept.department,
      mode: concept.mode,
      boost: concept.boost,
      tokens: concept.tokens,
    })),
  };
  return `${JSON.stringify(payload, null, 2)}\n`;
}

function main(): void {
  const args = Bun.argv.slice(2);
  const next = buildRoutingSignals();
  const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, "utf8") : "";
  const drifted = current !== next;
  if (args.includes("--check")) {
    if (drifted) {
      console.error(
        "❌ routing-signals.json is out of sync with secretary.ts. Run `bun scripts/sync-routing-signals.ts --write`.",
      );
      process.exit(1);
    }
    console.log("✅ routing-signals.json matches the router tables.");
    process.exit(0);
  }
  if (!drifted) {
    console.log("✨ routing-signals.json already current.");
    return;
  }
  fs.writeFileSync(OUTPUT, next, "utf8");
  console.log(`✅ wrote ${path.relative(REPO_ROOT, OUTPUT)}`);
}

if (import.meta.main) main();
