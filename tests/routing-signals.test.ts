import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getSkillModeCommands, getSkills } from "../scripts/export-commands";

const REPO_ROOT = join(import.meta.dir, "..");
const SIGNALS = JSON.parse(
  readFileSync(join(REPO_ROOT, "skills/context-orchestration/secretary/references/routing-signals.json"), "utf8"),
) as {
  councilLeads: Record<string, string>;
  defaultModes: Record<string, string>;
  fastPaths: Array<{ pattern: string; flags: string; department: string; mode: string }>;
  intents: Array<{ pattern: string; flags: string; department: string; mode?: string }>;
  verbHints: Array<{ pattern: string; flags: string; departments: string[] }>;
  concepts: Array<{ department: string; mode?: string; boost: number; tokens: string[] }>;
};

const routes = new Set(getSkillModeCommands(getSkills()).map((entry) => `${entry.skill}:${entry.mode}`));
const skills = new Set(getSkills().map((skill) => skill.name));

describe("routing signals artifact", () => {
  test("the generated mirror is in sync with the router tables", () => {
    const result = spawnSync("bun", ["scripts/sync-routing-signals.ts", "--check"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    expect(result.stdout + result.stderr).toContain("matches the router tables");
    expect(result.status).toBe(0);
  });

  test("every routing target is a real skill:mode", () => {
    const bad: string[] = [];
    for (const path of SIGNALS.fastPaths) {
      if (!routes.has(`${path.department}:${path.mode}`)) bad.push(`fastPath ${path.department}:${path.mode}`);
      expect(() => new RegExp(path.pattern, path.flags)).not.toThrow();
    }
    for (const intent of SIGNALS.intents) {
      if (intent.mode && !routes.has(`${intent.department}:${intent.mode}`)) {
        bad.push(`intent ${intent.department}:${intent.mode}`);
      }
    }
    for (const concept of SIGNALS.concepts) {
      if (concept.mode && !routes.has(`${concept.department}:${concept.mode}`)) {
        bad.push(`concept ${concept.department}:${concept.mode}`);
      }
      expect(concept.tokens.length).toBeGreaterThan(0);
    }
    expect(bad).toEqual([]);
  });

  test("every skill has a council lead and a default mode", () => {
    const missingLeads = [...skills].filter((skill) => !SIGNALS.councilLeads[skill]);
    const missingDefaults = [...skills].filter((skill) => !SIGNALS.defaultModes[skill]);
    expect(missingLeads).toEqual([]);
    expect(missingDefaults).toEqual([]);
    for (const [skill, mode] of Object.entries(SIGNALS.defaultModes)) {
      expect(routes.has(`${skill}:${mode}`)).toBe(true);
    }
  });
});
