#!/usr/bin/env bun
/**
 * log-route — opt-in capture of real routing decisions.
 *
 * The 447 evaluation prompts were written by agents, so they measure our
 * imagination. Real requests are the only data that can say whether routing
 * works for actual users — and they are the dataset a fine-tune needs.
 *
 * Logging is off unless MUSE_ROUTE_LOG points at a file, and each line records
 * no more than the prompt, the route taken, and a timestamp. Nothing leaves the
 * machine.
 *
 *   MUSE_ROUTE_LOG=~/.cache/muse/routes.jsonl bun run route:log --prompt "…" --route audit:hygiene-rules
 *   bun run route:log --stats        # what has been collected so far
 */

import fs from "node:fs";
import path from "node:path";

const LOG_PATH = process.env.MUSE_ROUTE_LOG ? path.resolve(process.env.MUSE_ROUTE_LOG) : "";

const args = Bun.argv.slice(2);
const value = (flag: string): string => {
  const index = args.indexOf(flag);
  return index === -1 ? "" : (args[index + 1] ?? "");
};

if (args.includes("--stats")) {
  if (!LOG_PATH || !fs.existsSync(LOG_PATH)) {
    console.log("no captures yet — set MUSE_ROUTE_LOG=<path> and log a route");
    process.exit(0);
  }
  const rows = fs
    .readFileSync(LOG_PATH, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const byDepartment = new Map<string, number>();
  for (const row of rows)
    byDepartment.set(row.route.split(":")[0], (byDepartment.get(row.route.split(":")[0]) ?? 0) + 1);
  console.log(`${rows.length} captured routes`);
  for (const [department, count] of [...byDepartment.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${department.padEnd(20)} ${count}`);
  }
  process.exit(0);
}

const prompt = value("--prompt");
const route = value("--route");
if (!prompt || !route) {
  console.error("usage: --prompt <text> --route <department:mode>   (requires MUSE_ROUTE_LOG)");
  process.exit(1);
}
if (!LOG_PATH) {
  console.error("MUSE_ROUTE_LOG is not set — logging is opt-in and stays local. Nothing was written.");
  process.exit(1);
}
if (!/^[a-z0-9-]+:[a-z0-9-]+$/.test(route)) {
  console.error(`'${route}' is not department:mode`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
fs.appendFileSync(
  LOG_PATH,
  `${JSON.stringify({ at: new Date().toISOString(), prompt: prompt.slice(0, 500), route })}\n`,
  "utf8",
);
console.log(`logged → ${LOG_PATH}`);
