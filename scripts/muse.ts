#!/usr/bin/env bun
/**
 * muse — one command to verify or refresh an installed muse-skills surface.
 *
 *   bun scripts/muse.ts doctor   [--json] [--fix]   # is this device consistent?
 *   bun scripts/muse.ts update  [--check] [--ref vX.Y.Z] [--project]
 *   bun scripts/muse.ts version
 *
 * `doctor` inspects what is actually installed (~/.agents/skills or
 * ./.agents/skills, every detected harness command surface, hooks, and the
 * installed dispatch directory) instead of trusting a green setup log.
 *
 * `update` resolves the latest release tag, re-runs the pinned, checksum-
 * verified installer for it, then runs `doctor` so "updated" is proven.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { commandSurfaceCounts, getSkills, MUSE_VERSION_MARKER } from "./export-commands";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const OWNER_REPO = "harshsinghmp/muse-skills";
const VERSION_MARKER = MUSE_VERSION_MARKER;

export interface DoctorCheck {
  id: string;
  ok: boolean;
  detail: string;
  fixable?: boolean;
}

export interface DoctorReport {
  ok: boolean;
  skillsRoot: string;
  installedVersion: string | null;
  expectedCommands: number;
  harnesses: Array<{ label: string; dir: string; files: number; expected: number; extension: string; ok: boolean }>;
  checks: DoctorCheck[];
}

/** harness dir → command subdir + extension (mirrors export-commands' surfaces). */
const HARNESS_SURFACES: Array<{ label: string; home: string; workspace: string; subdir: string; extension: string }> = [
  {
    label: "opencode",
    home: ".config/opencode/commands",
    workspace: ".opencode/commands",
    subdir: ".config/opencode",
    extension: ".md",
  },
  {
    label: "claude-code",
    home: ".claude/commands",
    workspace: ".claude/commands",
    subdir: ".claude",
    extension: ".md",
  },
  { label: "codex", home: ".codex/prompts", workspace: "", subdir: ".codex", extension: ".md" },
  { label: "cursor", home: "", workspace: ".cursor/commands", subdir: ".cursor", extension: ".md" },
  { label: "roo", home: ".roo/commands", workspace: ".roo/commands", subdir: ".roo", extension: ".md" },
  { label: "gemini", home: ".gemini/commands", workspace: ".gemini/commands", subdir: ".gemini", extension: ".toml" },
  { label: "copilot", home: "", workspace: ".github/prompts", subdir: ".github", extension: ".prompt.md" },
  {
    label: "continue",
    home: ".continue/prompts",
    workspace: ".continue/prompts",
    subdir: ".continue",
    extension: ".prompt",
  },
  { label: "windsurf", home: "", workspace: ".windsurf/workflows", subdir: ".windsurf", extension: ".md" },
];

function resolveSkillsRoot(home: string, workspace: string): string {
  const project = path.join(workspace, ".agents", "skills");
  if (fs.existsSync(project)) return project;
  return path.join(home, ".agents", "skills");
}

function readInstalledVersion(skillsRoot: string): string | null {
  const marker = path.join(skillsRoot, VERSION_MARKER);
  if (!fs.existsSync(marker)) return null;
  const value = fs.readFileSync(marker, "utf8").trim();
  return value === "" ? null : value;
}

/**
 * Every mode the installed dispatch directory advertises must exist as
 * `references/<mode>.md` in the installed skill. This is the check that
 * catches a stale dispatch.md shipped next to newer (or older) skills.
 */
function checkDispatchResolves(skillsRoot: string): { ok: boolean; detail: string } {
  const dispatch = path.join(skillsRoot, "secretary", "references", "dispatch.md");
  if (!fs.existsSync(dispatch)) return { ok: false, detail: "secretary/references/dispatch.md is not installed" };
  const text = fs.readFileSync(dispatch, "utf8");
  const start = text.indexOf("<!-- agency-directory:start -->");
  const end = text.indexOf("<!-- agency-directory:end -->");
  if (start === -1 || end <= start) return { ok: false, detail: "dispatch directory markers are missing" };
  const unresolved: string[] = [];
  let modes = 0;
  for (const line of text.slice(start, end).split("\n")) {
    const skill = line.match(/^\|\s*\*\*`([a-z0-9-]+)`\*\*\s*\|/)?.[1];
    if (!skill) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    for (const match of (cells[1] ?? "").matchAll(/`([a-z0-9-]+)`/g)) {
      modes += 1;
      if (!fs.existsSync(path.join(skillsRoot, skill, "references", `${match[1]}.md`))) {
        unresolved.push(`${skill}:${match[1]}`);
      }
    }
  }
  if (modes === 0) return { ok: false, detail: "dispatch directory advertises no modes" };
  return {
    ok: unresolved.length === 0,
    detail:
      unresolved.length === 0
        ? `${modes} advertised modes resolve to installed references`
        : `${unresolved.length} advertised mode(s) missing: ${unresolved.slice(0, 5).join(", ")}`,
  };
}

export function runDoctor(options: { home?: string; workspace?: string; fix?: boolean } = {}): DoctorReport {
  const home = options.home ?? process.env.HOME ?? os.homedir();
  const workspace = options.workspace ?? process.cwd();
  const skills = getSkills();
  const skillsRoot = resolveSkillsRoot(home, workspace);
  const expected = commandSurfaceCounts(skills).total;
  const checks: DoctorCheck[] = [];

  // Repair first, then inspect: the report must describe the post-fix state.
  let fixResult: { ok: boolean; detail: string } | undefined;
  if (options.fix) {
    const setup = spawnSync("bun", [path.join(REPO_ROOT, "scripts", "export-commands.ts"), "--setup"], {
      cwd: workspace,
      encoding: "utf8",
      env: { ...process.env, HOME: home },
    });
    fixResult = {
      ok: setup.status === 0,
      detail:
        setup.status === 0
          ? "re-exported the command surface into detected harnesses"
          : `--fix failed: ${setup.stderr.trim()}`,
    };
  }

  const missingSkills = skills.filter((skill) => !fs.existsSync(path.join(skillsRoot, skill.name, "SKILL.md")));
  checks.push({
    id: "skills-installed",
    ok: missingSkills.length === 0,
    detail:
      missingSkills.length === 0
        ? `${skills.length} skills present in ${skillsRoot}`
        : `${missingSkills.length} missing (e.g. ${missingSkills
            .slice(0, 3)
            .map((s) => s.name)
            .join(", ")})`,
  });

  const version = readInstalledVersion(skillsRoot);
  checks.push({
    id: "version-marker",
    ok: version !== null,
    detail: version
      ? `${VERSION_MARKER} = ${version}`
      : `no ${VERSION_MARKER} in ${skillsRoot} (reinstall to stamp it)`,
  });

  const dispatch = checkDispatchResolves(skillsRoot);
  checks.push({ id: "dispatch-resolves", ...dispatch });

  const harnesses: DoctorReport["harnesses"] = [];
  for (const surface of HARNESS_SURFACES) {
    const candidates = [
      surface.home ? { root: home, rel: surface.home, global: true } : undefined,
      surface.workspace ? { root: workspace, rel: surface.workspace, global: false } : undefined,
    ].filter((entry): entry is { root: string; rel: string; global: boolean } => Boolean(entry));

    for (const candidate of candidates) {
      const parent = path.join(candidate.root, path.dirname(candidate.rel));
      const dir = path.join(candidate.root, candidate.rel);
      if (!fs.existsSync(parent)) continue; // harness not installed on this device
      const files = fs.existsSync(dir)
        ? fs.readdirSync(dir).filter((file) => file.endsWith(surface.extension)).length
        : 0;
      harnesses.push({
        label: `${surface.label} (${candidate.global ? "global" : "workspace"})`,
        dir,
        files,
        expected,
        extension: surface.extension,
        ok: files === expected,
      });
    }
  }
  const staleSurfaces = harnesses.filter((harness) => !harness.ok);
  checks.push({
    id: "command-surfaces",
    ok: staleSurfaces.length === 0,
    detail:
      harnesses.length === 0
        ? "no harness command directory detected"
        : staleSurfaces.length === 0
          ? `${harnesses.length} destination(s) current at ${expected} commands`
          : staleSurfaces.map((h) => `${h.label}: ${h.files}/${h.expected}`).join("; "),
    fixable: staleSurfaces.length > 0,
  });

  const hookTargets = harnesses
    .map((harness) => path.dirname(path.dirname(harness.dir)))
    .filter((root) => fs.existsSync(path.join(root, "scripts", "hooks", "install-hooks.sh")));
  const missingHooks = hookTargets.filter(
    (root) => fs.existsSync(path.join(root, ".git")) && !fs.existsSync(path.join(root, ".git", "hooks", "pre-commit")),
  );
  checks.push({
    id: "hooks",
    ok: missingHooks.length === 0,
    detail:
      hookTargets.length === 0
        ? "no project with scripts/hooks detected (hooks are per-repo)"
        : missingHooks.length === 0
          ? `${hookTargets.length} project(s) carry git boundary hooks`
          : `${missingHooks.length} project(s) missing hooks: ${missingHooks.join(", ")}`,
  });

  if (fixResult) checks.push({ id: "fix-applied", ...fixResult });

  return {
    ok: checks.every((check) => check.ok || check.id === "version-marker"),
    skillsRoot,
    installedVersion: version,
    expectedCommands: expected,
    harnesses,
    checks,
  };
}

/** Latest published tag, from gh when available, else the GitHub API. */
export function resolveLatestVersion(): string | null {
  const gh = spawnSync("gh", ["api", `repos/${OWNER_REPO}/releases/latest`, "--jq", ".tag_name"], {
    encoding: "utf8",
  });
  if (gh.status === 0 && gh.stdout.trim()) return gh.stdout.trim();

  const curl = spawnSync(
    "curl",
    [
      "-fsSL",
      "-H",
      "Accept: application/vnd.github+json",
      `https://api.github.com/repos/${OWNER_REPO}/releases/latest`,
    ],
    { encoding: "utf8" },
  );
  if (curl.status === 0) {
    try {
      const tag = (JSON.parse(curl.stdout) as { tag_name?: string }).tag_name;
      if (tag) return tag;
    } catch {
      return null;
    }
  }
  return null;
}

function report(reportValue: DoctorReport): void {
  console.log(`\n🩺 muse doctor — ${reportValue.skillsRoot}`);
  console.log(
    `   installed: ${reportValue.installedVersion ?? "unversioned"} · expected surface: ${reportValue.expectedCommands} commands\n`,
  );
  for (const harness of reportValue.harnesses) {
    console.log(
      `   ${harness.ok ? "✅" : "❌"} ${harness.label.padEnd(24)} ${harness.files}/${harness.expected} ${harness.extension}`,
    );
  }
  if (reportValue.harnesses.length > 0) console.log("");
  for (const check of reportValue.checks) {
    console.log(
      `   ${check.ok ? "✅" : check.id === "version-marker" ? "⚠️ " : "❌"} ${check.id.padEnd(20)} ${check.detail}`,
    );
  }
  console.log(
    reportValue.ok
      ? "\n✅ Device is consistent."
      : "\n❌ Device needs attention (run `bun scripts/muse.ts doctor --fix`).",
  );
}

function main(): void {
  const args = Bun.argv.slice(2);
  const command = args[0] ?? "doctor";
  const json = args.includes("--json");
  const argValue = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    return index === -1 ? undefined : args[index + 1];
  };

  if (command === "doctor") {
    const reportValue = runDoctor({
      fix: args.includes("--fix"),
      home: argValue("--home"),
      workspace: argValue("--workspace"),
    });
    if (json) console.log(JSON.stringify(reportValue, null, 2));
    else report(reportValue);
    process.exit(reportValue.ok ? 0 : 1);
  }

  if (command === "version") {
    const skillsRoot = resolveSkillsRoot(process.env.HOME ?? os.homedir(), process.cwd());
    const installed = readInstalledVersion(skillsRoot);
    const latest = resolveLatestVersion();
    console.log(`installed: ${installed ?? "unversioned"}${latest ? ` · latest: ${latest}` : ""}`);
    process.exit(0);
  }

  if (command === "update") {
    const check = args.includes("--check");
    const skillsRoot = resolveSkillsRoot(process.env.HOME ?? os.homedir(), process.cwd());
    const installed = readInstalledVersion(skillsRoot);
    const latest = resolveLatestVersion();
    if (!latest) {
      console.error("❌ Could not resolve the latest release (network or gh unavailable).");
      process.exit(1);
    }
    const upToDate = installed === latest;
    console.log(`installed: ${installed ?? "unversioned"} · latest: ${latest}`);
    if (check) process.exit(upToDate ? 0 : 1);
    if (upToDate && !args.includes("--force")) {
      console.log("✅ Already current.");
      const reportValue = runDoctor({});
      process.exit(reportValue.ok ? 0 : 1);
    }

    const target = args.includes("--project") ? "--project" : "--global";
    const ref = argValue("--ref") ?? latest;
    console.log(`\n⬆️  Installing ${ref} (${target}) with the pinned, checksum-verified installer…`);
    const install = spawnSync(
      "bash",
      [path.join(REPO_ROOT, "scripts", "install.sh"), "--non-interactive", "--all", target],
      {
        stdio: "inherit",
        env: { ...process.env, MUSE_SKILLS_REF: ref },
      },
    );
    if (install.status !== 0) {
      console.error("❌ Update failed; the previous installation is untouched.");
      process.exit(install.status ?? 1);
    }
    const reportValue = runDoctor({});
    if (!json) report(reportValue);
    process.exit(reportValue.ok ? 0 : 1);
  }

  console.error(
    "Usage: bun scripts/muse.ts <doctor|update|version> [--json] [--fix] [--check] [--ref vX.Y.Z] [--project]",
  );
  process.exit(2);
}

if (import.meta.main) main();
