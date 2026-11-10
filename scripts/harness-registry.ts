#!/usr/bin/env bun
/**
 * harness-registry — the single source of truth for where muse-skills installs.
 *
 * `harness.json` is read by the exporter, the install matrix, `muse doctor`,
 * and the README generator (via `sync-harness-docs.ts`). Keeping the map in one
 * place is what stops a retired harness (Gemini CLI, Codex prompts) from being
 * advertised, tested, and written long after the vendor removed the surface.
 */

import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const REGISTRY_PATH = path.join(REPO_ROOT, "harness.json");

/** active: vendor reads our files today. legacy: retired upstream, kept for migration. skills-only: no command files, reads SKILL.md. */
export type HarnessStatus = "active" | "legacy" | "skills-only";

export type HarnessFormat = "markdown" | "toml" | "copilot" | "continue" | "workflow";

export interface HarnessCommands {
  format: HarnessFormat;
  extension: string;
  global?: string;
  project?: string;
}

export interface Harness {
  id: string;
  label: string;
  status: HarnessStatus;
  invocation: string;
  commands: HarnessCommands | null;
  skills: string[];
  docs: string;
  note?: string;
  /** Paths we used to write that the vendor no longer reads. */
  retiredPaths?: string[];
}

export interface HarnessRegistry {
  version: number;
  updated: string;
  skillRoots: { canonical: string; project: string; mirrors: string[]; note?: string };
  harnesses: Harness[];
}

const FORMAT_EXTENSIONS: Record<HarnessFormat, string> = {
  markdown: ".md",
  toml: ".toml",
  copilot: ".prompt.md",
  continue: ".prompt",
  workflow: ".md",
};

export function loadHarnessRegistry(file = REGISTRY_PATH): HarnessRegistry {
  return JSON.parse(fs.readFileSync(file, "utf8")) as HarnessRegistry;
}

export function validateHarnessRegistry(registry: HarnessRegistry): string[] {
  const problems: string[] = [];
  if (!Number.isInteger(registry.version) || registry.version < 1) problems.push("version must be a positive integer");
  const ids = new Set<string>();
  for (const harness of registry.harnesses ?? []) {
    if (!/^[a-z0-9-]+$/.test(harness.id ?? "")) problems.push(`harness id "${harness.id}" must be kebab-case`);
    if (ids.has(harness.id)) problems.push(`duplicate harness id "${harness.id}"`);
    ids.add(harness.id);
    if (!["active", "legacy", "skills-only"].includes(harness.status)) {
      problems.push(`${harness.id}: status must be active, legacy, or skills-only`);
    }
    if (!harness.docs?.startsWith("https://")) problems.push(`${harness.id}: docs must be an https URL`);
    if (harness.skills.length === 0) problems.push(`${harness.id}: must declare at least one skill root`);
    if (harness.status === "skills-only" && harness.commands !== null) {
      problems.push(`${harness.id}: skills-only harnesses must not declare command destinations`);
    }
    if (harness.status !== "skills-only") {
      if (!harness.commands) {
        problems.push(`${harness.id}: ${harness.status} harnesses must declare command destinations`);
        continue;
      }
      const expected = FORMAT_EXTENSIONS[harness.commands.format];
      if (!expected) problems.push(`${harness.id}: unknown format "${harness.commands.format}"`);
      else if (harness.commands.extension !== expected) {
        problems.push(`${harness.id}: format "${harness.commands.format}" requires extension "${expected}"`);
      }
      if (!harness.commands.global && !harness.commands.project) {
        problems.push(`${harness.id}: needs at least one of commands.global / commands.project`);
      }
    }
  }
  if (registry.harnesses.some((harness) => harness.id === "gemini") === false) {
    // Not required, but the legacy path is documented; keep the registry honest.
    problems.push("gemini (legacy) entry is missing — remove this check if support was dropped");
  }
  return problems;
}

export interface PathContext {
  home: string;
  workspace: string;
}

/** Expands `~` and the `<project>` placeholder used in harness.json. */
export function expandHarnessPath(template: string, context: PathContext): string {
  const expanded = template.replace(/^~/, context.home).replace(/^<project>/, context.workspace);
  return path.isAbsolute(expanded) ? expanded : path.join(context.workspace, expanded);
}

export interface CommandDestination {
  harness: Harness;
  scope: "global" | "project";
  format: HarnessFormat;
  extension: string;
  /** Directory the command files are written to. */
  dir: string;
  /** Directory that must already exist for this harness to be considered installed. */
  gate: string;
}

/** Every command destination the exporter, matrix, and doctor must agree on. */
export function commandDestinations(registry: HarnessRegistry, context: PathContext): CommandDestination[] {
  const destinations: CommandDestination[] = [];
  for (const harness of registry.harnesses) {
    const commands = harness.commands;
    if (!commands) continue;
    for (const scope of ["global", "project"] as const) {
      const template = scope === "global" ? commands.global : commands.project;
      if (!template) continue;
      const dir = expandHarnessPath(template, context);
      destinations.push({
        harness,
        scope,
        format: commands.format,
        extension: commands.extension,
        dir,
        // The harness's own directory is the gate: `~/.claude/commands` is
        // gated on `~/.claude`, `.qwen/commands` on `.qwen`.
        gate: path.dirname(dir),
      });
    }
  }
  return destinations;
}

/** Harnesses we expect to be advertised as live (README, doctor). */
export function harnessesByStatus(registry: HarnessRegistry, status: HarnessStatus): Harness[] {
  return registry.harnesses.filter((harness) => harness.status === status);
}
