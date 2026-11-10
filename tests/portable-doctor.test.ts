import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { exportSkills, getSkills, SUBMODE_ALIASES } from "../scripts/export-commands";

const REPO_ROOT = join(import.meta.dir, "..");
const DOCTOR = join(REPO_ROOT, "skills/core-engine/updateagents/scripts/doctor.ts");

/** Install a believable device: canonical skills + one harness command dir. */
function device() {
  const root = mkdtempSync(join(tmpdir(), "portable-doctor-"));
  const home = join(root, "home");
  const workspace = join(root, "workspace");
  mkdirSync(home, { recursive: true });
  mkdirSync(workspace, { recursive: true });
  const skillsRoot = join(home, ".agents", "skills");
  exportSkills(skillsRoot, getSkills());
  mkdirSync(join(home, ".claude", "commands"), { recursive: true });
  return { root, home, workspace, skillsRoot };
}

function run(home: string, workspace: string, ...args: string[]) {
  return spawnSync("bun", [DOCTOR, ...args], {
    encoding: "utf8",
    cwd: workspace,
    env: { ...process.env, HOME: home },
  });
}

describe("portable doctor (installed skill, no repo)", () => {
  test("runs from the installed tree and knows its own destinations", () => {
    const { root, home, workspace, skillsRoot } = device();
    try {
      // The doctor ships the registry with the install, so it needs no clone.
      expect(existsSync(join(skillsRoot, ".muse", "harness.json"))).toBe(true);
      expect(existsSync(join(skillsRoot, ".muse-version"))).toBe(true);

      const result = run(home, workspace, "--json");
      const report = JSON.parse(result.stdout);
      expect(report.skills).toBeGreaterThanOrEqual(46);
      expect(report.modes).toBeGreaterThan(400);

      // .claude exists but is empty -> the mirror check must fail, not pass.
      const mirror = report.checks.find((check: { id: string }) => check.id === "skill-mirror");
      expect(mirror.ok).toBe(false);
      expect(result.status).toBe(1);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  test("--fix relinks the Claude/Amp mirror and the device becomes consistent", () => {
    const { root, home, workspace } = device();
    try {
      const fixed = run(home, workspace, "--fix", "--json");
      const report = JSON.parse(fixed.stdout);
      const mirror = report.checks.find((check: { id: string }) => check.id === "skill-mirror");
      expect(mirror.ok).toBe(true);
      // No harness command destination exists beyond .claude/commands, which we
      // create empty, so surfaces are legitimately incomplete.
      const surfaces = report.checks.find((check: { id: string }) => check.id === "harness-surfaces");
      expect(surfaces.ok).toBe(false);
      expect(surfaces.detail).toContain("missing file");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  test("detects a mixed-version install where dispatch advertises a missing mode", () => {
    const { root, home, workspace, skillsRoot } = device();
    try {
      rmSync(join(skillsRoot, "webdev", "references", "audit.md"), { force: true });
      const result = run(home, workspace, "--json");
      const report = JSON.parse(result.stdout);
      const dispatch = report.checks.find((check: { id: string }) => check.id === "dispatch-resolves");
      expect(dispatch.ok).toBe(false);
      expect(dispatch.detail).toContain("webdev:audit");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  test("stays consistent once command files and mirror are complete", () => {
    const { root, home, workspace, skillsRoot } = device();
    try {
      // Complete the one detected destination exactly as the exporter would.
      const commands = join(home, ".claude", "commands");
      const skills = getSkills();
      for (const skill of skills) writeFileSync(join(commands, `${skill.name}.md`), "# command\n");
      for (const alias of SUBMODE_ALIASES) writeFileSync(join(commands, `${alias.command}.md`), "# alias\n");
      for (const skill of skills) {
        const refs = join(skillsRoot, skill.name, "references");
        if (!existsSync(refs)) continue;
        for (const file of readdirSync(refs)) {
          if (!/^[a-z0-9-]+\.md$/.test(file)) continue;
          writeFileSync(join(commands, `${skill.name}-${file.replace(/\.md$/, "")}.md`), "# mode\n");
        }
      }
      run(home, workspace, "--fix");
      const result = run(home, workspace, "--json");
      const report = JSON.parse(result.stdout);
      const failed = report.checks.filter(
        (check: { ok: boolean; id: string }) => !check.ok && check.id !== "version-marker",
      );
      expect(failed).toEqual([]);
      expect(result.status).toBe(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 180_000);
});
