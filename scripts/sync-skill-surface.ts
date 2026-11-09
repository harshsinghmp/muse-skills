#!/usr/bin/env bun
/**
 * sync-skill-surface — keep every discovery surface aligned with references/*.md.
 *
 * Canonical source of truth: the mode reference files on disk.
 * Derived surfaces: SKILL.md Modes table, frontmatter argument-hint,
 * per-skill README mode claims/table, and agents/openai.yaml mode claims.
 *
 * Usage:
 *   bun scripts/sync-skill-surface.ts --check   # exit 1 when drift exists
 *   bun scripts/sync-skill-surface.ts --write   # rewrite the derived surfaces
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");

interface SkillEntry {
  name: string;
  path: string;
}

interface TableInfo {
  headerLine: number;
  separatorLine: number;
  endLine: number;
  columns: number;
  modes: string[];
}

const NUMBER_WORDS: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
  20: "twenty",
  21: "twenty-one",
  22: "twenty-two",
  23: "twenty-three",
  24: "twenty-four",
  25: "twenty-five",
  26: "twenty-six",
  27: "twenty-seven",
  28: "twenty-eight",
  29: "twenty-nine",
  30: "thirty",
};

const WORD_TO_NUMBER = new Map(Object.entries(NUMBER_WORDS).map(([number, word]) => [word, Number(number)]));
const MODE_CLAIM = new RegExp(
  `\\b(${[...WORD_TO_NUMBER.keys()].sort((a, b) => b.length - a.length).join("|")})\\b(\\s+(?:routed|execution|operating|specialized|analysis)\\b)?(\\s+modes?\\b)`,
  "gi",
);

const isModeRefFile = (file: string) => file.endsWith(".md") && /^[a-z0-9-]+\.md$/.test(file);

function skills(): SkillEntry[] {
  const registry = JSON.parse(readFileSync(join(REPO_ROOT, "skills.json"), "utf8")) as {
    skills: SkillEntry[];
  };
  return registry.skills;
}

function referenceModes(skillDir: string): string[] {
  const refs = join(skillDir, "references");
  if (!existsSync(refs)) return [];
  return readdirSync(refs)
    .filter(isModeRefFile)
    .map((file) => file.replace(/\.md$/, ""))
    .sort();
}

function referenceDescription(skillDir: string, mode: string): string {
  const file = join(skillDir, "references", `${mode}.md`);
  try {
    const first = readFileSync(file, "utf8")
      .split("\n")
      .find((line) => line.startsWith("# "));
    if (!first) return `The ${mode} mode.`;
    let text = first.replace(/^#\s+/, "").trim();
    const dash = text.indexOf(" — ");
    if (dash !== -1) text = text.slice(dash + 3).trim();
    else {
      const colon = text.indexOf(":");
      if (colon !== -1) text = text.slice(colon + 1).trim();
    }
    return text.replace(/\|/g, "\\|").slice(0, 180);
  } catch {
    return `The ${mode} mode.`;
  }
}

function parseFrontmatter(content: string): { end: number } {
  const lines = content.split("\n");
  if (lines[0]?.trim() !== "---") return { end: -1 };
  const end = lines.indexOf("---", 1);
  return { end };
}

function findModesTable(lines: string[]): TableInfo | undefined {
  const headerLine = lines.findIndex((line) => /^\|\s*Mode\s*\|/.test(line));
  if (headerLine === -1) return undefined;
  const columns = (lines[headerLine].match(/\|/g)?.length ?? 1) - 1;
  const separatorLine = headerLine + 1;
  let endLine = separatorLine + 1;
  const modes: string[] = [];
  while (endLine < lines.length && lines[endLine].startsWith("|")) {
    const cells = lines[endLine].split("|").slice(1, -1);
    const raw = cells[0]?.replace(/[*`]/g, "").trim() ?? "";
    if (raw) modes.push(raw);
    endLine++;
  }
  return { headerLine, separatorLine, endLine, columns, modes };
}

function rowFor(mode: string, description: string, columns: number): string {
  const link = `[references/${mode}.md](references/${mode}.md)`;
  if (columns >= 4) return `| **${mode}** | "${mode}" | ${description} | ${link} |`;
  if (columns === 3) return `| **${mode}** | ${description} | ${link} |`;
  return `| **${mode}** | ${link} |`;
}

function alignTable(lines: string[], modes: string[], skillDir: string): { lines: string[]; changed: boolean } {
  const table = findModesTable(lines);
  if (!table) return { lines, changed: false };
  let changed = false;
  const output = [...lines];

  if (!/^\|[\s:|-]+\|$/.test(output[table.separatorLine] ?? "")) {
    const separator = `|${":---|".repeat(table.columns)}`;
    output.splice(table.separatorLine, 0, separator);
    changed = true;
    return alignTable(output, modes, skillDir);
  }

  const present = new Set(table.modes);
  const missing = modes.filter((mode) => !present.has(mode));
  if (missing.length > 0) {
    const rows = missing.map((mode) => rowFor(mode, referenceDescription(skillDir, mode), table.columns));
    output.splice(table.endLine, 0, ...rows);
    changed = true;
  }
  return { lines: output, changed };
}

function replaceModeCount(text: string, count: number): string {
  return text.replace(MODE_CLAIM, (match, word: string, qualifier = "", modeWord: string) => {
    const existing = WORD_TO_NUMBER.get(word.toLowerCase());
    if (existing === undefined) return match;
    return `${NUMBER_WORDS[count] ?? String(count)}${qualifier}${modeWord}`;
  });
}

function updateDescriptionLine(line: string, count: number): string {
  if (!/^\s*description:\s*["']/.test(line)) return line;
  const prefix = line.slice(0, line.indexOf("description:") + "description:".length);
  const body = line.slice(prefix.length);
  const quote = body.trimStart()[0];
  const inner = body.trimStart().slice(1, body.trimStart().lastIndexOf(quote));
  return `${prefix} ${quote}${replaceModeCount(inner, count)}${quote}`;
}

function updateArgumentHint(line: string, modes: string[]): string {
  const match = line.match(/^(\s*argument-hint:\s*)(["'])(\[[^\]]*\])(["'])\s*$/);
  if (!match) return line;
  const entries = match[3]
    .slice(1, -1)
    .split("|")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const canonical = new Set(modes);
  const matches = entries.filter((entry) => canonical.has(entry)).length;
  if (entries.length === 0 || matches / entries.length < 0.5) return line;
  return `${match[1]}${match[2]}[${modes.join("|")}]${match[4]}`;
}

function syncSkillMd(content: string, modes: string[], skillDir: string): string {
  let lines = content.split("\n");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter.end !== -1) {
    for (let i = 1; i < frontmatter.end; i++) {
      if (lines[i].startsWith("description:")) lines[i] = updateDescriptionLine(lines[i], modes.length);
      if (lines[i].startsWith("argument-hint:")) lines[i] = updateArgumentHint(lines[i], modes);
    }
  }
  lines = alignTable(lines, modes, skillDir).lines;
  return lines.join("\n");
}

function syncReadme(content: string, modes: string[], skillDir: string): string {
  let lines = replaceModeCount(content, modes.length).split("\n");
  const canonical = new Set(modes);
  lines = lines.map((line) => {
    // "one skill, N modes — a, b, c" / "N modes: a, b, c" inline lists.
    const match = line.match(/^(.*?[—-]\s*)([a-z0-9-]+(?:\s*,\s*[a-z0-9-]+)+)(.*)$/);
    if (!match || !/modes?\b/i.test(match[1])) return line;
    const listed = match[2].split(",").map((entry) => entry.trim());
    if (listed.filter((entry) => canonical.has(entry)).length / listed.length < 0.5) return line;
    return `${match[1]}${modes.join(", ")}${match[3]}`;
  });
  const table = findModesTable(lines);
  if (table) {
    const missing = modes.filter((mode) => !new Set(table.modes).has(mode));
    if (missing.length > 0) {
      lines.splice(
        table.endLine,
        0,
        ...missing.map((mode) => rowFor(mode, referenceDescription(skillDir, mode), table.columns)),
      );
    }
    if (!/^\|[\s:|-]+\|$/.test(lines[table.separatorLine] ?? "")) {
      lines.splice(table.separatorLine, 0, `|${":---|".repeat(table.columns)}`);
    }
  }
  return lines.join("\n");
}

function syncOpenai(content: string, modes: string[], skillDir: string): string {
  const lines = content.split("\n").map((line) => {
    if (/^\s*description:\s*["']/.test(line)) return updateDescriptionLine(line, modes.length);
    return line;
  });

  const listStart = lines.findIndex((line) => /MODES\s*\(pick exactly one/i.test(line));
  if (listStart !== -1) {
    let end = listStart + 1;
    const existing = new Set<string>();
    let indent = "      ";
    while (end < lines.length && /^\s*-\s+/.test(lines[end])) {
      indent = lines[end].match(/^\s*/)?.[0] ?? indent;
      const name = lines[end]
        .replace(/^\s*-\s+/, "")
        .split(":")[0]
        .trim()
        .toLowerCase();
      existing.add(name);
      end++;
    }
    const missing = modes.filter((mode) => !existing.has(mode));
    if (missing.length > 0) {
      lines.splice(end, 0, ...missing.map((mode) => `${indent}- ${mode}: ${referenceDescription(skillDir, mode)}`));
    }
  }
  return lines.join("\n");
}

function frontmatterDescription(content: string): string | undefined {
  const end = parseFrontmatter(content).end;
  if (end === -1) return undefined;
  const line = content
    .split("\n")
    .slice(1, end)
    .find((entry) => entry.startsWith("description:"));
  if (!line) return undefined;
  const match = line.match(/^description:\s*(["'])(.*)\1\s*$/);
  return match?.[2];
}

function sync(): { file: string; before: string; after: string }[] {
  const changes: { file: string; before: string; after: string }[] = [];
  const descriptions = new Map<string, string>();
  for (const skill of skills()) {
    const skillDir = dirname(join(REPO_ROOT, skill.path));
    const modes = referenceModes(skillDir);
    if (modes.length === 0) continue;
    const skillMd = join(skillDir, "SKILL.md");
    const tableModes = existsSync(skillMd)
      ? (findModesTable(readFileSync(skillMd, "utf8").split("\n"))?.modes ?? [])
      : [];
    // Preserve the authored table order; append newly discovered refs sorted.
    const orderedModes = [
      ...tableModes.filter((mode) => modes.includes(mode)),
      ...modes.filter((mode) => !tableModes.includes(mode)),
    ];

    for (const [name, transform] of [
      ["SKILL.md", (content: string) => syncSkillMd(content, orderedModes, skillDir)],
      ["README.md", (content: string) => syncReadme(content, orderedModes, skillDir)],
      ["agents/openai.yaml", (content: string) => syncOpenai(content, orderedModes, skillDir)],
    ] as const) {
      const file = join(skillDir, name);
      if (!existsSync(file)) continue;
      const before = readFileSync(file, "utf8");
      const after = transform(before);
      if (name === "SKILL.md") {
        const description = frontmatterDescription(after);
        if (description) descriptions.set(skill.name, description);
      }
      if (after !== before) changes.push({ file, before, after });
    }
  }

  const registryFile = join(REPO_ROOT, "skills.json");
  const registryBefore = readFileSync(registryFile, "utf8");
  const registry = JSON.parse(registryBefore) as { skills: Array<{ name: string; description: string }> };
  let registryChanged = false;
  for (const entry of registry.skills) {
    const description = descriptions.get(entry.name);
    if (description && entry.description !== description) {
      entry.description = description;
      registryChanged = true;
    }
  }
  if (registryChanged) {
    changes.push({
      file: registryFile,
      before: registryBefore,
      after: `${JSON.stringify(registry, null, 2)}\n`,
    });
  }

  const llmsFile = join(REPO_ROOT, "llms.txt");
  const llmsBefore = readFileSync(llmsFile, "utf8");
  let llmsAfter = llmsBefore;
  for (const [name, description] of descriptions) {
    const pattern = new RegExp(`^(- \\[${name}\\]\\([^)]*\\): ).*$`, "m");
    llmsAfter = llmsAfter.replace(pattern, (_match, prefix: string) => `${prefix}${description}`);
  }
  if (llmsAfter !== llmsBefore) changes.push({ file: llmsFile, before: llmsBefore, after: llmsAfter });

  return changes;
}

const write = process.argv.includes("--write");
const changes = sync();
if (changes.length === 0) {
  console.log("✅ Skill discovery surfaces are in sync.");
  process.exit(0);
}

for (const change of changes) {
  const rel = change.file.replace(`${REPO_ROOT}/`, "");
  if (write) {
    writeFileSync(change.file, change.after, "utf8");
    console.log(`✏️  ${rel}`);
  } else {
    console.log(`❌ ${rel}`);
  }
}

if (write) {
  console.log(`\nUpdated ${changes.length} file(s).`);
  process.exit(0);
}
console.log(`\n${changes.length} file(s) drift from references/*.md. Run with --write.`);
process.exit(1);
