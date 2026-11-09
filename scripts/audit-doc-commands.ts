#!/usr/bin/env bun

/**
 * audit-doc-commands.ts — verify that script paths in shipped docs resolve.
 *
 * Scans SKILL.md, README.md, references/**, docs/**, and the root docs for
 * `bun|python|bash <path>/scripts/<file>` commands, then resolves each target
 * against the repository root, the document's directory, and the owning skill
 * root. `--fix` rewrites known `bun <skill>/scripts/...` prefixes to the real
 * registry path.
 */

import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

const ROOT = path.resolve(import.meta.dir, "..");
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  ".agents",
  ".worktrees",
  "dist",
  "build",
  "coverage",
  "templates",
  "examples",
]);
const COMMAND_RE = /\b(?:bunx?|python3?|bash|sh)\s+([^\s`"'|;]+\.(?:ts|tsx|py|sh))/g;

export interface DocCommandFinding {
  file: string;
  line: number;
  command: string;
  target: string;
}

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

export function docFiles(base = ROOT): string[] {
  const roots = [
    path.join(base, "README.md"),
    path.join(base, "CONTRIBUTING.md"),
    path.join(base, "docs"),
    path.join(base, "skills"),
  ];
  const files: string[] = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const stat = fs.statSync(root);
    if (stat.isFile()) files.push(root);
    else walk(root, files);
  }
  return [...new Set(files)];
}

function owningSkillRoot(file: string, base: string): string | null {
  let current = path.dirname(file);
  while (current.startsWith(base) && current !== base) {
    if (fs.existsSync(path.join(current, "SKILL.md"))) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function resolves(target: string, file: string, base: string): boolean {
  if (target.startsWith("<") || target.includes("path/to/") || target.startsWith("$")) return true;
  const candidates = [
    path.resolve(base, target),
    path.resolve(path.dirname(file), target),
    owningSkillRoot(file, base) ? path.resolve(owningSkillRoot(file, base) as string, target) : "",
  ].filter(Boolean);
  return candidates.some((candidate) => fs.existsSync(candidate));
}

export function auditDocCommands(base = ROOT): DocCommandFinding[] {
  const findings: DocCommandFinding[] = [];
  for (const file of docFiles(base)) {
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      COMMAND_RE.lastIndex = 0;
      let match = COMMAND_RE.exec(line);
      while (match) {
        const target = match[1];
        // Only script paths; bare tool mentions and flags are out of scope.
        if (!target.includes("/scripts/") && !target.startsWith("scripts/")) {
          match = COMMAND_RE.exec(line);
          continue;
        }
        if (!resolves(target, file, base)) {
          findings.push({
            file: path.relative(base, file),
            line: index + 1,
            command: line.trim(),
            target,
          });
        }
        match = COMMAND_RE.exec(line);
      }
    });
  }
  return findings;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Rewrite `<skill>/scripts/...` prefixes to the registry path. */
export function fixDocCommands(base = ROOT): number {
  const registry = JSON.parse(fs.readFileSync(path.join(base, "skills.json"), "utf8")) as {
    skills: Array<{ name: string; path: string }>;
  };
  const pairs = registry.skills
    .map((skill) => ({ name: skill.name, dir: path.dirname(skill.path) }))
    .sort((a, b) => b.name.length - a.name.length);

  let changed = 0;
  for (const file of docFiles(base)) {
    const before = fs.readFileSync(file, "utf8");
    let text = before.replace(
      /path\/to\/updateagents\/scripts\/updateagents\.ts/g,
      "skills/core-engine/updateagents/scripts/updateagents.ts",
    );
    for (const { name, dir } of pairs) {
      const pattern = new RegExp(`\\b(bunx?|python3?|bash|sh)(\\s+)${escapeRegExp(name)}/scripts/`, "g");
      text = text.replace(pattern, `$1$2${dir}/scripts/`);
    }
    if (text !== before) {
      fs.writeFileSync(file, text, "utf8");
      changed += 1;
    }
  }
  return changed;
}

if (import.meta.main) {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      json: { type: "boolean", default: false },
      fix: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`audit-doc-commands.ts — verify documented script paths resolve

Usage:
  bun scripts/audit-doc-commands.ts [--json]
  bun scripts/audit-doc-commands.ts --fix [--json]

  --fix   Rewrite known '<skill>/scripts/...' prefixes to the registry path
  --json  Machine-readable findings
`);
    process.exit(0);
  }

  if (values.fix) {
    const changed = fixDocCommands();
    console.log(`Updated ${changed} file(s).`);
  }

  const findings = auditDocCommands();
  if (values.json) {
    console.log(JSON.stringify(findings, null, 2));
  } else if (findings.length === 0) {
    console.log("All documented script paths resolve.");
  } else {
    for (const finding of findings) {
      console.log(`${finding.file}:${finding.line}  ${finding.target}`);
    }
    console.log(`\n${findings.length} unresolved script path(s).`);
  }
  process.exit(findings.length > 0 ? 1 : 0);
}
