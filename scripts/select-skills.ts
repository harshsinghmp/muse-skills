#!/usr/bin/env bun
/**
 * select-skills.ts — resolve a named selection into a concrete skill list.
 *
 * skills.json carries three selection primitives:
 *   - per-skill `scope`: "global" (agent-level, install once, works in any
 *     workspace: continuity, orchestration, personal workflow, maintenance)
 *     or "local" (per-project: docs, git lifecycle, review, design, audits)
 *   - top-level `categories[]`: the five divisions
 *   - top-level `selections{}`: named bundles resolving to scope:/category:/names:
 *
 * Usage:
 *   bun scripts/select-skills.ts list                      # all named selections
 *   bun scripts/select-skills.ts <selection> [--format names|install|json]
 *
 * Formats:
 *   names    one skill name per line (default)
 *   install  copy-pasteable `npx skills add` commands
 *   json     JSON array
 *
 * Exit codes: 0 ok, 2 usage/unknown selection.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const REG_PATH = join(ROOT, "skills.json");

function load(): any {
  if (!existsSync(REG_PATH)) fail(`registry not found: ${REG_PATH}`);
  return JSON.parse(readFileSync(REG_PATH, "utf8"));
}

function fail(msg: string): never {
  console.error(`[select-skills] ${msg}`);
  process.exit(2);
}

function resolveSelection(reg: any, sel: string): string[] {
  const skills: any[] = reg.skills ?? [];
  const named = reg.selections?.[sel];
  if (named) {
    const rule: string = named.resolve ?? "";
    const [kind, arg] = [rule.slice(0, rule.indexOf(":")), rule.slice(rule.indexOf(":") + 1)];
    if (kind === "scope") return skills.filter((s) => s.scope === arg).map((s) => s.name);
    if (kind === "category") return skills.filter((s) => s.category === arg).map((s) => s.name);
    if (kind === "names") return arg.split(",").map((n) => n.trim()).filter(Boolean);
    fail(`selection "${sel}" has unknown resolve rule: ${rule}`);
  }
  if (sel === "all") return skills.map((s) => s.name);
  if (sel === "categories" || sel === "categories list") {
    return (reg.categories ?? []).map((c: any) => c.id);
  }
  const cat = (reg.categories ?? []).find((c: any) => c.id === sel);
  if (cat) return skills.filter((s) => s.category === cat.id).map((s) => s.name);
  const single = skills.find((s) => s.name === sel);
  if (single) return [single.name];
  fail(`unknown selection "${sel}". Run: bun scripts/select-skills.ts list`);
}

function main(): void {
  const argv = process.argv.slice(2);
  const formatIdx = argv.indexOf("--format");
  const format = formatIdx >= 0 && argv[formatIdx + 1] ? argv[formatIdx + 1] : "names";
  const positional = argv.filter((a, i) => a !== "--format" && !(formatIdx >= 0 && i === formatIdx + 1));
  const reg = load();
  const sel = positional[0] ?? "all";

  if (sel === "list") {
    console.log("Named selections:");
    for (const [k, v] of Object.entries<any>(reg.selections ?? {})) console.log(`  ${k.padEnd(10)} ${v.description}`);
    console.log("\nCategories (usable as selections):");
    for (const c of reg.categories ?? []) console.log(`  ${c.id.padEnd(10)} ${c.label}`);
    console.log("  all        Every skill in the suite");
    return;
  }

  const names = resolveSelection(reg, sel);
  if (!names.length) fail(`selection "${sel}" resolved to zero skills`);

  if (format === "json") {
    console.log(JSON.stringify(names, null, 2));
  } else if (format === "install") {
    console.log(`# ${sel} → ${names.length} skill(s)`);
    for (const n of names) console.log(`npx skills add harshsinghmp/muse-skills --skill ${n}`);
  } else {
    for (const n of names) console.log(n);
  }
}

main();
