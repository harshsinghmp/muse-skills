#!/usr/bin/env bun
/**
 * release-smoke — verify a published release is installable and reproducible.
 *
 * Checks: tag exists, tag commit matches the release checksum asset, the
 * installer default ref matches the package version, and the release is public.
 *
 * Usage:
 *   bun scripts/release-smoke.ts [tag]
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const pkg = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8")) as { version: string };
const tag = process.argv[2] ?? `v${pkg.version}`;

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { cwd: REPO_ROOT, encoding: "utf8" });
  return { code: result.status ?? 1, out: `${result.stdout ?? ""}`, err: `${result.stderr ?? ""}` };
}

function fail(message: string): never {
  console.error(`❌ release smoke failed: ${message}`);
  process.exit(1);
}

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
if (!installer.includes(`MUSE_SKILLS_REF="\${MUSE_SKILLS_REF:-${tag}}"`)) {
  fail(`install.sh default ref does not match ${tag}`);
}
if (!installer.includes(`releases/download/\${MUSE_SKILLS_REF}/checksums.txt`)) {
  fail("install.sh does not verify the release checksum asset");
}

console.log(
  [
    `✅ release smoke passed`,
    `   tag:      ${tag} (${commit.slice(0, 12)})`,
    `   release:  ${releaseData.url}`,
    `   asset:    checksums.txt (source-commit verified)`,
    `   installer default ref: ${tag}`,
  ].join("\n"),
);
