#!/usr/bin/env bun
/**
 * sync-routing-docs — renders the router's measured quality into the README.
 *
 * The tuned set and the blind sets tell different stories; only one of them is
 * flattering. Publishing both, generated from `routing-baseline.json`, keeps the
 * tuned number from being mistaken for reality.
 *
 *   bun scripts/sync-routing-docs.ts --write
 *   bun scripts/sync-routing-docs.ts --check
 */

import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const README_PATH = path.join(REPO_ROOT, "README.md");
const BASELINE_PATH = path.join(REPO_ROOT, "routing-baseline.json");
const START = "<!-- routing-matrix:start -->";
const END = "<!-- routing-matrix:end -->";

interface Baseline {
  generatedAt: string;
  distributions: Record<string, { exact: number; department: number; total: number }>;
}

function pct(value: number, total: number): string {
  return total === 0 ? "0%" : `${((value / total) * 100).toFixed(1)}%`;
}

export function renderRoutingTable(): string {
  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")) as Baseline;
  const rows = Object.entries(baseline.distributions)
    .sort(([a], [b]) => (a === "training" ? -1 : b === "training" ? 1 : a.localeCompare(b)))
    .map(([name, result]) => {
      const kind = name === "training" ? "tuned" : "unseen";
      const label = name === "training" ? "training (tuned)" : name;
      return `| \`${label}\` | ${kind} | ${result.total} | ${result.exact} (${pct(result.exact, result.total)}) | ${result.department} (${pct(result.department, result.total)}) |`;
    });

  return [
    "| Distribution | Kind | Prompts | Exact `skill:mode` | Department |",
    "| :--- | :--- | ---: | ---: | ---: |",
    ...rows,
    "",
    `Measured ${baseline.generatedAt}. The **tuned** set is where the router's vocabulary exists; the **unseen** sets are prompts written blind by independent agents, never used for tuning. Read the unseen rows as the honest state of the routing long tail — \`bun run check:routing:matrix\` fails if any row drops, and \`bun run sync:routing:baseline\` is the only way to accept a lower number.`,
  ].join("\n");
}

function sync(write: boolean): boolean {
  const readme = fs.readFileSync(README_PATH, "utf8");
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start === -1 || end === -1 || end < start) throw new Error(`README is missing ${START} / ${END} markers.`);
  const next = `${readme.slice(0, start + START.length)}\n${renderRoutingTable()}\n${readme.slice(end)}`;
  if (next === readme) return false;
  if (write) fs.writeFileSync(README_PATH, next, "utf8");
  return true;
}

if (import.meta.main) {
  const args = Bun.argv.slice(2);
  if (args.includes("--check")) {
    if (sync(false)) {
      console.error(
        "❌ README routing table is out of sync with routing-baseline.json. Run `bun scripts/sync-routing-docs.ts --write`.",
      );
      process.exit(1);
    }
    console.log("✅ README routing table matches routing-baseline.json.");
    process.exit(0);
  }
  sync(true);
  console.log("✅ README routing table regenerated from routing-baseline.json.");
}
