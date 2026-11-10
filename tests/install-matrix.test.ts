import { describe, expect, test } from "bun:test";
import { type MatrixReport, readHarnessDirs, runInstallMatrix } from "../scripts/check-install-matrix";
import { commandSurfaceCounts, getSkills } from "../scripts/export-commands";

const EXPECTED_HARNESSES = [".claude", ".codex", ".cursor", ".gemini", ".opencode", ".windsurf", ".antigravity"];

// The sandbox run costs a few seconds; evaluate it once per process.
let cached: MatrixReport | undefined;
const matrix = (): MatrixReport => (cached ??= runInstallMatrix());

describe("install matrix", () => {
  test("hooks, commands, and skills install into every harness from a clean sandbox", () => {
    const report = matrix();
    const failed = report.checks.filter((check) => !check.ok).map((check) => `${check.id}: ${check.detail}`);
    expect(failed).toEqual([]);
    expect(report.ok).toBe(true);

    // Every harness declared for hooks actually received them — including the
    // last line of agent-dirs.conf (a missing trailing newline used to drop it).
    for (const harness of EXPECTED_HARNESSES) {
      expect(report.harnesses).toContain(harness);
    }
    expect(report.checks.find((check) => check.id === "hooks-installed")?.ok).toBe(true);
    expect(report.checks.find((check) => check.id === "hooks-no-new-harness-dirs")?.ok).toBe(true);
  }, 120_000);

  test("every implemented command destination carries the full surface", () => {
    const report = matrix();
    const surface = commandSurfaceCounts(getSkills()).total;
    expect(report.commandSurface).toBe(surface);
    expect(report.destinations.length).toBeGreaterThanOrEqual(6);
    for (const destination of report.destinations) {
      expect(destination.files).toBe(surface);
    }
    expect(report.skillCount).toBe(getSkills().length);
    expect(report.checks.find((check) => check.id === "skills-installed")?.ok).toBe(true);
    expect(report.checks.find((check) => check.id === "export-idempotent")?.ok).toBe(true);
  }, 120_000);

  test("the harness list is read from agent-dirs.conf, not hardcoded", () => {
    const harnesses = readHarnessDirs();
    expect(harnesses.length).toBeGreaterThanOrEqual(13);
    expect(harnesses).not.toContain(".git");
    expect(new Set(harnesses).size).toBe(harnesses.length);
  });
});
