#!/usr/bin/env bun
/**
 * arbitrate-labels — find fixture labels that the router and a blind agent
 * disagree about, so a human (or two more agents) can settle them.
 *
 * Two independent audits of six misses found three wrong labels. Past that
 * point, measurement moves less than label noise does, so arbitration has to be
 * a step in the loop rather than a favour someone does later.
 *
 *   bun run arbitrate:labels --routes /tmp/agent-routes.json
 *
 * Protocol (three independent readings, no router output shared):
 *   1. Agent A and Agent B each read the request and the directory, and answer
 *      department:mode independently. Neither sees the recorded label.
 *   2. If A == B, that is the label. Disagreement with the fixture is a defect.
 *   3. If A != B, the recorded label stands but is marked `contested` — a
 *      contested label may not be used to judge a router change.
 *
 * Output: disagreements only, grouped by kind (department vs mode), with both
 * sides named. Exit 0 when nothing is contested.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const args = Bun.argv.slice(2);
const routesIndex = args.indexOf("--routes");
const routesPath = routesIndex === -1 ? "" : path.resolve(args[routesIndex + 1]);

if (!routesPath || !fs.existsSync(routesPath)) {
  console.error("usage: bun run arbitrate:labels --routes <path to {id,route}[] json>");
  process.exit(1);
}

const routes = new Map(
  (JSON.parse(fs.readFileSync(routesPath, "utf8")) as Array<{ id: string; route: string }>).map((row) => [
    row.id,
    row.route,
  ]),
);

const fixtures = path.join(ROOT, "tests/fixtures/routing-eval");
const departmentMisses: string[] = [];
const modeMisses: string[] = [];
let compared = 0;

for (const file of fs.readdirSync(fixtures).filter((name) => name.endsWith(".json"))) {
  const items = JSON.parse(fs.readFileSync(path.join(fixtures, file), "utf8")) as Array<{
    id: string;
    prompt: string;
    expect: string;
  }>;
  for (const item of items) {
    const got = routes.get(item.id);
    if (!got) continue;
    compared += 1;
    if (got === item.expect) continue;
    const line = `${item.id}  recorded ${item.expect.padEnd(38)} agent ${got.padEnd(38)} | ${item.prompt.slice(0, 70)}`;
    if (got.split(":")[0] === item.expect.split(":")[0]) modeMisses.push(line);
    else departmentMisses.push(line);
  }
}

console.log(
  `${compared} prompts compared · ${departmentMisses.length} department disagreements · ${modeMisses.length} mode disagreements\n`,
);
if (departmentMisses.length > 0) {
  console.log("DEPARTMENT — arbitrate first, these cap everything else");
  for (const line of departmentMisses) console.log(`  ${line}`);
  console.log("");
}
if (modeMisses.length > 0) {
  console.log("MODE — right department, wrong mode");
  for (const line of modeMisses) console.log(`  ${line}`);
}
process.exit(departmentMisses.length + modeMisses.length === 0 ? 0 : 1);
