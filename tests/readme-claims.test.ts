/**
 * README Claims — structural enforcement for the exported command surface
 *
 * The README advertises a per-harness slash-command total, a catalog row per
 * skill, and a set of mode aliases. Every one of those claims is checked
 * against the real registry (`skills.json`) and the real exporter
 * (`scripts/export-commands.ts`) instead of a hand-copied number, so the claims
 * cannot rot as skills, modes, or aliases are added.
 *
 * Asserted structure:
 *   1. The advertised total equals `skills.length + resolvable alias count`.
 *   2. Every skill in `skills.json` has a catalog row whose link resolves to an
 *      on-disk companion README.
 *   3. No colon-form `/<skill>:<mode>` command is documented anywhere in the
 *      README — the exporter writes flat `<command>.md` filenames, so colon
 *      forms cannot exist.
 *   4. Every alias that resolves (parent skill + `references/<mode>.md`) is
 *      advertised, and no unresolvable alias is advertised.
 *
 * An alias is "resolvable" only when its mode reference file exists. That keeps
 * this file green both before and after the exporter change that deletes the
 * `/saas` alias, which pointed at a `design/references/saas.md` that was never
 * shipped.
 */
import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import * as exporter from "../scripts/export-commands";

const REPO_ROOT = path.resolve(__dirname, "..");
const README_PATH = path.join(REPO_ROOT, "README.md");
const SKILLS_JSON_PATH = path.join(REPO_ROOT, "skills.json");
const EXPORTER_PATH = path.join(REPO_ROOT, "scripts", "export-commands.ts");

interface SkillItem {
  name: string;
  path: string;
}

interface SubModeAlias {
  command: string;
  skill: string;
  mode: string;
}

const readme = fs.readFileSync(README_PATH, "utf8");
const registry: { skills: SkillItem[] } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));

/**
 * Alias registry: prefer the exporter's exported `SUBMODE_ALIASES`; fall back to
 * a source-level read of the same array so the assertion works whether or not
 * the exporter has been refactored to export it.
 */
function readSubModeAliases(): SubModeAlias[] {
  const exported = (exporter as unknown as Record<string, unknown>).SUBMODE_ALIASES;
  if (Array.isArray(exported) && exported.length > 0) return exported as SubModeAlias[];

  const source = fs.readFileSync(EXPORTER_PATH, "utf8");
  const block = source.match(/const SUBMODE_ALIASES[\s\S]*?=\s*\[([\s\S]*?)\n\];/);
  if (!block) throw new Error("SUBMODE_ALIASES not found in scripts/export-commands.ts");

  const aliases: SubModeAlias[] = [];
  const entry = /command:\s*"([^"]+)"\s*,\s*skill:\s*"([^"]+)"\s*,\s*mode:\s*"([^"]+)"/g;
  for (const match of block[1].matchAll(entry)) {
    aliases.push({ command: match[1], skill: match[2], mode: match[3] });
  }
  return aliases;
}

function referencePath(alias: SubModeAlias): string | null {
  const skill = registry.skills.find((s) => s.name === alias.skill);
  if (!skill) return null;
  return path.join(path.dirname(path.join(REPO_ROOT, skill.path)), "references", `${alias.mode}.md`);
}

function isResolvable(alias: SubModeAlias): boolean {
  const refPath = referencePath(alias);
  return refPath !== null && fs.existsSync(refPath);
}

/** Matches an advertised slash command, ignoring path segments and longer words. */
function mentionsCommand(text: string, command: string): boolean {
  return new RegExp(`(?<![\\w-])/${command}(?![\\w-])`).test(text);
}

const aliases = readSubModeAliases();
const resolvableAliases = aliases.filter(isResolvable);

describe("README command-surface claims", () => {
  test("advertised per-harness command total matches the exporter surface", () => {
    const match = readme.match(/(\d+)\s+Skills\s*\+\s*(\d+)\s+Slash Commands Per Harness/i);
    if (!match) {
      throw new Error("README does not advertise a '<N> Skills + <N> Slash Commands Per Harness' total");
    }

    expect(resolvableAliases.length).toBeGreaterThan(0);
    expect(Number(match[1])).toBe(registry.skills.length);
    expect(Number(match[2])).toBe(registry.skills.length + resolvableAliases.length);
  });

  test("every registered skill has a catalog row linking to its companion README", () => {
    expect(registry.skills.length).toBeGreaterThan(0);

    const unresolved: string[] = [];
    for (const skill of registry.skills) {
      const row = readme.match(new RegExp(`^\\|\\s*\\[\`${skill.name}\`\\]\\(([^)]+)\\)`, "m"));
      if (!row) {
        unresolved.push(`${skill.name}: no catalog row`);
        continue;
      }
      if (!fs.existsSync(path.join(REPO_ROOT, row[1]))) {
        unresolved.push(`${skill.name}: dead link ${row[1]}`);
      }
    }

    expect(unresolved).toEqual([]);
  });

  test("README documents no colon-form slash command", () => {
    const withoutUrls = readme.replace(/https?:\/\/\S+/g, "");
    const colonForms = withoutUrls.match(/(?<![\w-])\/[a-z][a-z0-9-]*:[a-z][a-z0-9-]*/g) ?? [];
    expect(colonForms).toEqual([]);
  });

  test("advertised mode aliases resolve to real mode references", () => {
    const notAdvertised = resolvableAliases
      .filter((alias) => !mentionsCommand(readme, alias.command))
      .map((alias) => `/${alias.command}`);
    expect(notAdvertised).toEqual([]);

    const phantom = aliases
      .filter((alias) => !isResolvable(alias) && mentionsCommand(readme, alias.command))
      .map((alias) => `/${alias.command} -> ${referencePath(alias) ?? "unknown skill"}`);
    expect(phantom).toEqual([]);
  });
});
