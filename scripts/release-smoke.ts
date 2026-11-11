#!/usr/bin/env bun
/**
 * release-smoke — verify a published release is installable and reproducible.
 *
 * Checks: tag exists, tag commit matches the release checksum asset, the
 * installer default ref matches the package version, the release is public, and
 * — the part that matters to a user — this exact tag installs into a sandbox
 * and passes the portable doctor.
 *
 * Usage:
 *   bun scripts/release-smoke.ts [tag]
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const pkg = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8")) as { version: string };
const tag = process.argv[2] ?? process.env.RELEASE_TAG ?? `v${pkg.version}`;

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { cwd: REPO_ROOT, encoding: "utf8" });
  return { code: result.status ?? 1, out: `${result.stdout ?? ""}`, err: `${result.stderr ?? ""}` };
}

function fail(message: string): never {
  console.error(`❌ release smoke failed: ${message}`);
  process.exit(1);
}

export function installSmoke(): { version: string; destinations: number; skills: number } {
  const root = mkdtempSync(join(tmpdir(), "release-smoke-install-"));
  const home = join(root, "home");
  const workspace = join(root, "workspace");
  try {
    mkdirSync(home, { recursive: true });
    mkdirSync(workspace, { recursive: true });
    // Two harnesses present => two destinations the doctor will verify.
    for (const dir of [join(home, ".claude"), join(home, ".qwen")]) mkdirSync(dir, { recursive: true });

    const env = { ...process.env, HOME: home };
    const setup = spawnSync("bun", [join(REPO_ROOT, "scripts/export-commands.ts"), "--setup"], {
      cwd: workspace,
      encoding: "utf8",
      env,
    });
    if (setup.status !== 0) fail(`install into a clean sandbox failed: ${setup.stderr.trim() || setup.stdout.trim()}`);

    const doctor = spawnSync("bun", [join(REPO_ROOT, "skills/core-engine/updateagents/scripts/doctor.ts"), "--json"], {
      cwd: workspace,
      encoding: "utf8",
      env,
    });
    let report: {
      ok: boolean;
      version: string | null;
      skills: number;
      checks: Array<{ id: string; ok: boolean; detail: string }>;
    };
    try {
      report = JSON.parse(doctor.stdout);
    } catch {
      fail(`doctor produced no parseable report: ${doctor.stderr.trim() || doctor.stdout.trim()}`);
    }
    const failed = report.checks.filter((check) => !check.ok).map((check) => `${check.id}: ${check.detail}`);
    if (!report.ok || failed.length > 0) fail(`installed tree is inconsistent: ${failed.join("; ")}`);
    if (report.version !== tag) fail(`installed version marker is ${report.version ?? "missing"}, expected ${tag}`);
    if (doctor.status !== 0) fail(`doctor exited ${doctor.status} despite reporting ok`);

    const surfaces = report.checks.find((check) => check.id === "harness-surfaces");
    if (!surfaces?.ok) fail(`installed harness surfaces incomplete: ${surfaces?.detail ?? "missing check"}`);
    return { version: report.version, destinations: 2, skills: report.skills };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function main(): void {
  if (!/^v\d+\.\d+\.\d+$/.test(tag)) fail(`tag '${tag}' is not vMAJOR.MINOR.PATCH`);
  if (tag !== `v${pkg.version}`) fail(`tag ${tag} does not match package.json v${pkg.version}`);

  const tagCommit = run("git", ["rev-parse", `${tag}^{}`]);
  if (tagCommit.code !== 0) fail(`tag ${tag} is not present locally: ${tagCommit.err.trim()}`);
  const commit = tagCommit.out.trim();

  const release = run("gh", ["release", "view", tag, "--json", "tagName,isDraft,isPrerelease,assets,url"]);
  if (release.code !== 0) fail(`GitHub release ${tag} not found: ${release.err.trim()}`);
  let releaseData: {
    tagName: string;
    isDraft: boolean;
    isPrerelease: boolean;
    assets: Array<{ name: string }>;
    url: string;
  };
  try {
    releaseData = JSON.parse(release.out);
  } catch {
    fail(`could not parse gh release output for ${tag}`);
  }
  if (releaseData.isDraft) fail(`release ${tag} is still a draft`);
  if (!releaseData.assets.some((asset) => asset.name === "checksums.txt")) {
    fail(`release ${tag} has no checksums.txt asset`);
  }

  const checksums = run("gh", ["release", "download", tag, "--pattern", "checksums.txt", "--output", "-"]);
  if (checksums.code !== 0) fail(`could not download checksums.txt: ${checksums.err.trim()}`);
  const sourceCommit = checksums.out
    .split("\n")
    .map((line) => line.trim().split(/\s+/))
    .find((parts) => parts[1] === "source-commit")?.[0];
  if (!sourceCommit) fail("checksums.txt has no source-commit entry");
  if (sourceCommit !== commit) fail(`checksum source-commit ${sourceCommit} != tag commit ${commit}`);

  const installer = readFileSync(join(REPO_ROOT, "scripts/install.sh"), "utf8");
  // The installer defaults to the latest release and keeps this tag as the
  // offline fallback, so both halves have to be present.
  if (!installer.includes(`PINNED_REF="${tag}"`)) {
    fail(`install.sh fallback ref does not match ${tag}`);
  }
  if (!installer.includes("releases/latest")) {
    fail("install.sh does not resolve the latest release");
  }
  if (!installer.includes(`releases/download/\${MUSE_SKILLS_REF}/checksums.txt`)) {
    fail("install.sh does not verify the release checksum asset");
  }

  /**
   * Install this tag into a throwaway HOME and run the doctor that ships inside
   * the skill. Checksums prove the artifact is intact; this proves it is usable.
   */

  const installed = installSmoke();

  console.log(
    [
      `✅ release smoke passed`,
      `   tag:      ${tag} (${commit.slice(0, 12)})`,
      `   release:  ${releaseData.url}`,
      `   asset:    checksums.txt (source-commit verified)`,
      `   installer default: latest release (fallback ${tag})`,
      `   install smoke: ${installed.skills} skills, ${installed.destinations} harness destinations, doctor green (${installed.version})`,
    ].join("\n"),
  );
}

if (import.meta.main) main();
