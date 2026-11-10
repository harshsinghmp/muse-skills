#!/usr/bin/env bun
/**
 * check-install-matrix — proves the distribution surface actually installs.
 *
 * Every other install assertion in this repo is a string match on the
 * installer source. This runs the real code paths in an offline sandbox and
 * checks what landed on disk:
 *
 *   - scripts/hooks/install-hooks.sh installs hooks into every harness
 *     directory declared in scripts/hooks/agent-dirs.conf (and never creates a
 *     directory that did not already exist);
 *   - scripts/export-commands.ts --setup writes the full command surface into
 *     each implemented harness destination and installs the skills;
 *   - both are idempotent (a second run changes nothing byte-wise).
 *
 * No network, and `crontab` is stubbed so a dev machine's cron is never
 * touched. Usage: bun scripts/check-install-matrix.ts [--json]
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { commandSurfaceCounts, getSkills } from "./export-commands";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const HOOKS_DIR = path.join(REPO_ROOT, "scripts", "hooks");
const HOOKS_INSTALLER = path.join(HOOKS_DIR, "install-hooks.sh");
const EXPORTER = path.join(REPO_ROOT, "scripts", "export-commands.ts");
const AGENT_DIRS_CONF = path.join(HOOKS_DIR, "agent-dirs.conf");

export interface MatrixCheck {
  id: string;
  ok: boolean;
  detail: string;
}

export interface MatrixReport {
  ok: boolean;
  harnesses: string[];
  hookScripts: number;
  commandSurface: number;
  skillCount: number;
  destinations: Array<{ label: string; dir: string; extension: string; files: number; expected: number }>;
  checks: MatrixCheck[];
}

/** Harness directories declared for hook installation (`.git` handled separately). */
export function readHarnessDirs(): string[] {
  return fs
    .readFileSync(AGENT_DIRS_CONF, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#"))
    .map((line) => line.split(":")[0]?.trim() ?? "")
    .filter((name) => name !== "" && name !== ".git");
}

function hashTree(root: string): Map<string, string> {
  const hashes = new Map<string, string>();
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, entry.name);
      // Skill mirrors are symlinks to the canonical tree; hashing them twice
      // adds nothing and readFileSync cannot read a directory link.
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (entry.name === ".git") continue;
        walk(full);
        continue;
      }
      const digest = createHash("sha256").update(fs.readFileSync(full)).digest("hex");
      hashes.set(path.relative(root, full), digest);
    }
  };
  walk(root);
  return hashes;
}

function sameTree(a: Map<string, string>, b: Map<string, string>): boolean {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) if (b.get(key) !== value) return false;
  return true;
}

function writeCrontabStub(binDir: string): void {
  fs.mkdirSync(binDir, { recursive: true });
  const stub = path.join(binDir, "crontab");
  fs.writeFileSync(stub, "#!/bin/sh\n# install-matrix stub: never touch the real crontab\nexit 0\n");
  fs.chmodSync(stub, 0o755);
}

function run(command: string, args: string[], options: { cwd: string; env: NodeJS.ProcessEnv }) {
  return spawnSync(command, args, { ...options, encoding: "utf8" });
}

export function runInstallMatrix(): MatrixReport {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "install-matrix-"));
  const home = path.join(root, "home");
  const workspace = path.join(root, "workspace");
  const emptyWorkspace = path.join(root, "empty-workspace");
  const binDir = path.join(root, "bin");
  const checks: MatrixCheck[] = [];
  const add = (id: string, ok: boolean, detail: string) => checks.push({ id, ok, detail });

  try {
    fs.mkdirSync(home, { recursive: true });
    fs.mkdirSync(workspace, { recursive: true });
    fs.mkdirSync(emptyWorkspace, { recursive: true });
    writeCrontabStub(binDir);
    // A real project that uses these hooks carries them in scripts/hooks; the
    // installer resolves HOOKS_DIR from the repo root it is told to target.
    for (const target of [workspace, emptyWorkspace]) {
      spawnSync("git", ["init", "-q"], { cwd: target });
      fs.cpSync(HOOKS_DIR, path.join(target, "scripts", "hooks"), { recursive: true });
    }

    const harnesses = readHarnessDirs();
    add("harness-config", harnesses.length >= 13, `agent-dirs.conf declares ${harnesses.length} harness dirs`);

    // Harnesses present in the workspace, plus the dirs the exporter writes into.
    for (const dir of [
      ...harnesses,
      ".opencode",
      ".gemini",
      ".cursor",
      ".windsurf",
      ".roo",
      ".github",
      ".continue",
      ".qwen",
    ]) {
      fs.mkdirSync(path.join(workspace, dir), { recursive: true });
    }
    for (const dir of [".config/opencode", ".gemini", ".claude", ".codex", ".roo", ".continue", ".qwen"]) {
      fs.mkdirSync(path.join(home, dir), { recursive: true });
    }

    const env: NodeJS.ProcessEnv = { ...process.env, HOME: home, PATH: `${binDir}:${process.env.PATH ?? ""}` };

    // ── Hooks: install twice, compare ────────────────────────────────────────
    const hookScripts = fs.readdirSync(HOOKS_DIR).filter((file) => file.endsWith(".sh")).length;
    const first = run("bash", [HOOKS_INSTALLER, "--repo-root", workspace], { cwd: workspace, env });
    add("hooks-exit", first.status === 0, `install-hooks.sh exited ${first.status}`);

    const hookFiles = fs.readdirSync(HOOKS_DIR).filter((file) => file.endsWith(".sh") || file === "agent-dirs.conf");
    const missingHooks: string[] = [];
    for (const harness of harnesses) {
      const dest = path.join(workspace, harness, "hooks");
      for (const file of hookFiles) {
        if (!fs.existsSync(path.join(dest, file))) missingHooks.push(`${harness}/hooks/${file}`);
      }
    }
    add(
      "hooks-installed",
      missingHooks.length === 0,
      missingHooks.length === 0
        ? `${hookFiles.length} hook files × ${harnesses.length} harnesses`
        : `missing: ${missingHooks.slice(0, 5).join(", ")}${missingHooks.length > 5 ? "…" : ""}`,
    );

    const gitHooks = ["pre-commit", "pre-push"].map((hook) => {
      const file = path.join(workspace, ".git", "hooks", hook);
      return fs.existsSync(file) && fs.readFileSync(file, "utf8").includes("muse harness hygiene");
    });
    add("git-wrappers", gitHooks.every(Boolean), `pre-commit/pre-push wrappers = ${gitHooks.join(" / ")}`);

    const hooksTreeBefore = hashTree(workspace);
    const second = run("bash", [HOOKS_INSTALLER, "--repo-root", workspace], { cwd: workspace, env });
    const hooksTreeAfter = hashTree(workspace);
    add(
      "hooks-idempotent",
      second.status === 0 && sameTree(hooksTreeBefore, hooksTreeAfter),
      second.status === 0 ? "second run changed nothing" : `second run exited ${second.status}`,
    );

    // Negative: no harness directories -> the installer must create none.
    const emptyBefore = new Set(fs.readdirSync(emptyWorkspace));
    run("bash", [HOOKS_INSTALLER, "--repo-root", emptyWorkspace], { cwd: emptyWorkspace, env });
    const created = fs.readdirSync(emptyWorkspace).filter((entry) => !emptyBefore.has(entry));
    const createdHarnessDirs = created.filter((entry) => entry !== ".git");
    add(
      "hooks-no-new-harness-dirs",
      createdHarnessDirs.length === 0,
      createdHarnessDirs.length === 0 ? "no harness dirs invented" : `created: ${createdHarnessDirs.join(", ")}`,
    );

    // ── Commands + skills: export twice, compare ────────────────────────────
    const skills = getSkills();
    const surface = commandSurfaceCounts(skills).total;
    const setupFirst = run("bun", [EXPORTER, "--setup"], { cwd: workspace, env });
    add("export-exit", setupFirst.status === 0, `export-commands --setup exited ${setupFirst.status}`);

    const destinations = [
      { label: "opencode (global)", dir: path.join(home, ".config", "opencode", "commands"), extension: ".md" },
      { label: "opencode (workspace)", dir: path.join(workspace, ".opencode", "commands"), extension: ".md" },
      { label: "claude (global)", dir: path.join(home, ".claude", "commands"), extension: ".md" },
      { label: "claude (workspace)", dir: path.join(workspace, ".claude", "commands"), extension: ".md" },
      { label: "codex (prompts)", dir: path.join(home, ".codex", "prompts"), extension: ".md" },
      { label: "gemini (global, toml)", dir: path.join(home, ".gemini", "commands"), extension: ".toml" },
      { label: "gemini (workspace, toml)", dir: path.join(workspace, ".gemini", "commands"), extension: ".toml" },
      { label: "cursor (workspace)", dir: path.join(workspace, ".cursor", "commands"), extension: ".md" },
      { label: "windsurf (workspace)", dir: path.join(workspace, ".windsurf", "workflows"), extension: ".md" },
      { label: "roo (global)", dir: path.join(home, ".roo", "commands"), extension: ".md" },
      { label: "roo (workspace)", dir: path.join(workspace, ".roo", "commands"), extension: ".md" },
      { label: "copilot (workspace)", dir: path.join(workspace, ".github", "prompts"), extension: ".prompt.md" },
      { label: "continue (global)", dir: path.join(home, ".continue", "prompts"), extension: ".prompt" },
      { label: "continue (workspace)", dir: path.join(workspace, ".continue", "prompts"), extension: ".prompt" },
      { label: "qwen (global)", dir: path.join(home, ".qwen", "commands"), extension: ".md" },
      { label: "qwen (workspace)", dir: path.join(workspace, ".qwen", "commands"), extension: ".md" },
    ].map((destination) => {
      const files = fs.existsSync(destination.dir)
        ? fs.readdirSync(destination.dir).filter((file) => file.endsWith(destination.extension)).length
        : 0;
      const stray = fs.existsSync(destination.dir)
        ? fs.readdirSync(destination.dir).filter((file) => !file.endsWith(destination.extension)).length
        : 0;
      return { ...destination, files, stray, expected: surface };
    });
    const wrong = destinations.filter((destination) => destination.files !== destination.expected);
    add(
      "commands-exported",
      wrong.length === 0,
      wrong.length === 0
        ? `${surface} commands in ${destinations.length} destinations`
        : wrong.map((d) => `${d.label}: ${d.files}/${d.expected}`).join("; "),
    );

    // A format mismatch is invisible-but-fatal: markdown in .gemini/commands is
    // never discovered, so every file in a destination must carry its suffix.
    const strayFiles = destinations.filter((destination) => destination.stray > 0);
    add(
      "command-formats",
      strayFiles.length === 0,
      strayFiles.length === 0
        ? "every destination contains only its required file format"
        : strayFiles.map((d) => `${d.label}: ${d.stray} file(s) with the wrong extension`).join("; "),
    );

    const skillsDest = path.join(home, ".agents", "skills");

    // Claude Code reads its own skill root; Amp falls back to it as well. The
    // mirror must resolve to the canonical tree, not be a stale copy.
    const mirrored = fs.existsSync(path.join(home, ".claude", "skills", "webdev", "SKILL.md"));
    const resolves = (() => {
      try {
        return (
          fs.realpathSync(path.join(home, ".claude", "skills", "webdev")) ===
          fs.realpathSync(path.join(skillsDest, "webdev"))
        );
      } catch {
        return false;
      }
    })();
    add(
      "skill-mirrors",
      mirrored && resolves,
      mirrored
        ? resolves
          ? "~/.claude/skills/webdev resolves to the canonical tree"
          : "mirror is a copy, not a link"
        : "~/.claude/skills/webdev is missing",
    );
    // .muse-version lives beside the skill directories; only dirs are skills.
    const installed = fs.existsSync(skillsDest)
      ? fs.readdirSync(skillsDest).filter((entry) => fs.statSync(path.join(skillsDest, entry)).isDirectory())
      : [];
    const missingSkill = skills.filter((skill) => !fs.existsSync(path.join(skillsDest, skill.name, "SKILL.md")));
    add(
      "skills-installed",
      missingSkill.length === 0 && installed.length === skills.length,
      `${installed.length}/${skills.length} skills with SKILL.md`,
    );

    const exportTreeBefore = hashTree(workspace);
    const skillsTreeBefore = hashTree(skillsDest);
    const setupSecond = run("bun", [EXPORTER, "--setup"], { cwd: workspace, env });
    const exportTreeAfter = hashTree(workspace);
    const skillsTreeAfter = hashTree(skillsDest);
    add(
      "export-idempotent",
      setupSecond.status === 0 &&
        sameTree(exportTreeBefore, exportTreeAfter) &&
        sameTree(skillsTreeBefore, skillsTreeAfter),
      setupSecond.status === 0 ? "second run changed nothing" : `second run exited ${setupSecond.status}`,
    );

    // ── Installer copy: documented commands point at real skills ────────────
    const readme = fs.readFileSync(path.join(REPO_ROOT, "README.md"), "utf8");
    add(
      "installer-copy",
      readme.includes("npx skills add harshsinghmp/muse-skills"),
      "README carries the canonical install command",
    );
    const skillNames = new Set(skills.map((skill) => skill.name));
    const advertised = [...readme.matchAll(/npx skills add harshsinghmp\/muse-skills --skill ([a-z0-9-]+)/g)].map(
      (match) => match[1],
    );
    const unknown = advertised.filter((name) => !skillNames.has(name));
    add(
      "installer-skill-names",
      unknown.length === 0,
      advertised.length === 0
        ? "no per-skill install examples advertised"
        : `${advertised.length} advertised skill names resolve`,
    );

    const report: MatrixReport = {
      ok: checks.every((check) => check.ok),
      harnesses,
      hookScripts,
      commandSurface: surface,
      skillCount: skills.length,
      destinations,
      checks,
    };
    return report;
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function main(): void {
  const json = Bun.argv.slice(2).includes("--json");
  const report = runInstallMatrix();
  if (json) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.ok ? 0 : 1);
  }
  console.log("📦 Install matrix — offline sandbox, real installers\n");
  console.log(
    `   harnesses: ${report.harnesses.length} · hook scripts: ${report.hookScripts} · skills: ${report.skillCount}`,
  );
  console.log(`   command surface: ${report.commandSurface} per destination\n`);
  for (const destination of report.destinations) {
    const status = destination.files === destination.expected ? "✅" : "❌";
    console.log(`   ${status} ${destination.label.padEnd(22)} ${destination.files}/${destination.expected} ${"files"}`);
  }
  console.log("");
  for (const check of report.checks) {
    console.log(`   ${check.ok ? "✅" : "❌"} ${check.id.padEnd(28)} ${check.detail}`);
  }
  console.log(report.ok ? "\n✅ Install matrix passed." : "\n❌ Install matrix failed.");
  process.exit(report.ok ? 0 : 1);
}

if (import.meta.main) main();
