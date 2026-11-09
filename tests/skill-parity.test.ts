import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const registry = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "skills.json"), "utf8")) as {
  skills: { name: string; path: string }[];
};

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .replace(/\\\|/g, "__ESCAPED_PIPE__")
    .split("|")
    .map((cell) => cell.replace(/__ESCAPED_PIPE__/g, "\\|"));
}

function tables(content: string): { header: string[]; rows: string[][] }[] {
  const lines = content.split("\n");
  const found: { header: string[]; rows: string[][] }[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    if (!lines[i].trim().startsWith("|") || !/^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) continue;
    const header = cells(lines[i]);
    const rows: string[][] = [];
    for (let j = i + 2; j < lines.length && lines[j].trim().startsWith("|"); j++) {
      rows.push(cells(lines[j]));
    }
    found.push({ header, rows });
    i += rows.length + 1;
  }
  return found;
}

describe("skill discovery-surface parity", () => {
  test("references/*.md, SKILL table, argument-hint, README, and openai.yaml agree", () => {
    const result = spawnSync("bun", ["scripts/sync-skill-surface.ts", "--check"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    expect(result.stdout + result.stderr).not.toContain("❌");
    expect(result.status).toBe(0);
  });

  test("every markdown table is well formed (separator + uniform cells)", () => {
    const offenders: string[] = [];
    for (const skill of registry.skills) {
      const dir = path.dirname(path.join(REPO_ROOT, skill.path));
      for (const file of ["SKILL.md", "README.md"]) {
        const full = path.join(dir, file);
        if (!fs.existsSync(full)) continue;
        for (const table of tables(fs.readFileSync(full, "utf8"))) {
          for (const row of table.rows) {
            if (row.length !== table.header.length) {
              offenders.push(`${path.relative(REPO_ROOT, full)}: ${row.length} cells vs ${table.header.length}`);
            }
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
