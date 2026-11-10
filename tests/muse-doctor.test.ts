import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { commandSurfaceCounts, getSkills } from "../scripts/export-commands";
import { runDoctor } from "../scripts/muse";

const REPO_ROOT = join(import.meta.dir, "..");
const SETUP = join(REPO_ROOT, "scripts", "export-commands.ts");

const EXPECTED = commandSurfaceCounts(getSkills()).total;

function sandbox(): { home: string; workspace: string } {
  const root = mkdtempSync(join(tmpdir(), "muse-doctor-"));
  const home = join(root, "home");
  const workspace = join(root, "workspace");
  mkdirSync(home, { recursive: true });
  mkdirSync(workspace, { recursive: true });
  return { home, workspace };
}

describe("muse doctor", () => {
  test("reports a consistent install once skills, surfaces, and dispatch are present", () => {
    const { home, workspace } = sandbox();
    try {
      // A device with Claude Code and Gemini installed.
      mkdirSync(join(home, ".claude"), { recursive: true });
      mkdirSync(join(home, ".gemini"), { recursive: true });
      const setup = spawnSync("bun", [SETUP, "--setup"], {
        cwd: workspace,
        encoding: "utf8",
        env: { ...process.env, HOME: home },
      });
      expect(setup.status).toBe(0);

      const report = runDoctor({ home, workspace });
      const failed = report.checks.filter((check) => !check.ok).map((check) => `${check.id}: ${check.detail}`);
      expect(failed).toEqual([]);
      expect(report.ok).toBe(true);
      expect(report.installedVersion).toMatch(/^v\d+\.\d+\.\d+$/);
      expect(report.harnesses.length).toBeGreaterThanOrEqual(2);
      expect(report.harnesses.every((harness) => harness.files === EXPECTED)).toBe(true);
      expect(report.expectedCommands).toBe(EXPECTED);
    } finally {
      rmSync(join(home, ".."), { recursive: true, force: true });
    }
  }, 120_000);

  test("detects a drifted harness surface and repairs it with --fix", () => {
    const { home, workspace } = sandbox();
    try {
      mkdirSync(join(home, ".claude"), { recursive: true });
      spawnSync("bun", [SETUP, "--setup"], { cwd: workspace, encoding: "utf8", env: { ...process.env, HOME: home } });

      const commandsDir = join(home, ".claude", "commands");
      const victims = readdirSync(commandsDir).slice(0, 3);
      for (const victim of victims) rmSync(join(commandsDir, victim), { force: true });

      const drifted = runDoctor({ home, workspace });
      expect(drifted.ok).toBe(false);
      const surfaceCheck = drifted.checks.find((check) => check.id === "command-surfaces");
      expect(surfaceCheck?.ok).toBe(false);
      expect(surfaceCheck?.detail).toContain(`${EXPECTED - victims.length}/${EXPECTED}`);

      const repaired = runDoctor({ home, workspace, fix: true });
      expect(repaired.checks.find((check) => check.id === "fix-applied")?.ok).toBe(true);
      expect(repaired.ok).toBe(true);
      expect(readdirSync(commandsDir).filter((file) => file.endsWith(".md")).length).toBe(EXPECTED);
    } finally {
      rmSync(join(home, ".."), { recursive: true, force: true });
    }
  }, 120_000);

  test("flags a dispatch directory that advertises a mode the installed skill lacks", () => {
    const { home, workspace } = sandbox();
    try {
      mkdirSync(join(home, ".claude"), { recursive: true });
      spawnSync("bun", [SETUP, "--setup"], { cwd: workspace, encoding: "utf8", env: { ...process.env, HOME: home } });

      const skillsRoot = join(home, ".agents", "skills");
      const victim = join(skillsRoot, "webdev", "references", "audit.md");
      expect(existsSync(victim)).toBe(true);
      rmSync(victim, { force: true });

      const report = runDoctor({ home, workspace });
      const dispatch = report.checks.find((check) => check.id === "dispatch-resolves");
      expect(dispatch?.ok).toBe(false);
      expect(dispatch?.detail).toContain("webdev:audit");
      expect(report.ok).toBe(false);
    } finally {
      rmSync(join(home, ".."), { recursive: true, force: true });
    }
  }, 120_000);

  test("reports an unversioned install as a warning, not a failure", () => {
    const { home, workspace } = sandbox();
    try {
      mkdirSync(join(home, ".agents", "skills"), { recursive: true });
      cpSync(join(REPO_ROOT, "skills"), join(home, ".agents", "skills"), { recursive: true });
      const report = runDoctor({ home, workspace });
      const marker = report.checks.find((check) => check.id === "version-marker");
      expect(marker?.ok).toBe(false);
      expect(report.installedVersion).toBeNull();
    } finally {
      rmSync(join(home, ".."), { recursive: true, force: true });
    }
  }, 120_000);
});
