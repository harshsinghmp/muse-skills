#!/usr/bin/env bun
/**
 * check-release-ready — fail before a release tag can be created wrongly.
 *
 * The v8.6.0 tag was briefly created against a stale `origin/main`. Runtime
 * verification in `release.yml` cannot catch that: by then the tag exists and
 * is public. This gate runs BEFORE `git tag`, and refuses when:
 *   - HEAD is not the commit `origin/main` points at (the tag would ship a
 *     commit that is not on production);
 *   - the tag already exists locally or on the remote;
 *   - `package.json`, the CHANGELOG heading, the release notes, and the docs
 *     ledger do not agree on the version.
 *
 *   bun scripts/check-release-ready.ts           # tag inferred from package.json
 *   bun scripts/check-release-ready.ts --tag v9.0.0
 */

import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dir, "..");

export interface ReleaseFacts {
  tag: string;
  head: string;
  main: string;
  localTagExists: boolean;
  remoteTagExists: boolean;
  packageVersion: string;
  changelogHeading: boolean;
  notesHeading: boolean;
  notesCompareLink: boolean;
  ledgerTag: string | null;
}

export function checkReleaseReady(facts: ReleaseFacts): string[] {
  const issues: string[] = [];
  const version = facts.tag.replace(/^v/, "");

  if (!/^v\d+\.\d+\.\d+$/.test(facts.tag)) {
    issues.push(`tag '${facts.tag}' is not vMAJOR.MINOR.PATCH`);
  }
  if (!facts.head || !facts.main) {
    issues.push("cannot resolve HEAD or origin/main — run `git fetch origin main` first");
  } else if (facts.head !== facts.main) {
    issues.push(
      `HEAD (${facts.head.slice(0, 12)}) is not origin/main (${facts.main.slice(0, 12)}) — fetch and merge first`,
    );
  }
  if (facts.localTagExists) issues.push(`tag ${facts.tag} already exists locally`);
  if (facts.remoteTagExists) issues.push(`tag ${facts.tag} already exists on the remote`);
  if (facts.packageVersion !== version) {
    issues.push(`package.json is ${facts.packageVersion}, tag says ${version}`);
  }
  if (!facts.changelogHeading) issues.push(`CHANGELOG.md has no '## [${version}]' heading`);
  if (!facts.notesHeading) issues.push(`RELEASE_NOTES.md has no 'Muse Skills ${facts.tag}' heading`);
  if (!facts.notesCompareLink) issues.push(`RELEASE_NOTES.md is missing the ...${facts.tag} compare link`);
  if (facts.ledgerTag !== facts.tag) {
    issues.push(`docs ledger is stamped ${facts.ledgerTag ?? "not at all"}, expected ${facts.tag}`);
  }
  return issues;
}

/** Reads the repo state into facts; the only place this script touches the disk. */
export function collectFacts(tagOverride = ""): ReleaseFacts {
  const run = (cmd: string, args: string[]): string => {
    const result = Bun.spawnSync([cmd, ...args], { cwd: REPO_ROOT, stdout: "pipe", stderr: "pipe" });
    return result.success ? result.stdout.toString().trim() : "";
  };

  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8")) as { version: string };
  const tag = tagOverride || `v${pkg.version}`;
  const version = tag.replace(/^v/, "");
  const changelog = fs.readFileSync(path.join(REPO_ROOT, "CHANGELOG.md"), "utf8");
  const notes = fs.readFileSync(path.join(REPO_ROOT, "RELEASE_NOTES.md"), "utf8");
  const ledgerPath = path.join(REPO_ROOT, ".docs-ledger.json");
  const ledger = fs.existsSync(ledgerPath)
    ? (JSON.parse(fs.readFileSync(ledgerPath, "utf8")) as { watermark?: { releaseTag?: string } })
    : null;

  return {
    tag,
    head: run("git", ["rev-parse", "HEAD"]),
    main: run("git", ["rev-parse", "origin/main"]),
    localTagExists: run("git", ["tag", "-l", tag]) === tag,
    remoteTagExists: run("git", ["ls-remote", "--tags", "origin", `refs/tags/${tag}`]).includes(`refs/tags/${tag}`),
    packageVersion: pkg.version,
    changelogHeading: changelog.includes(`## [${version}]`),
    notesHeading: notes.includes(`Muse Skills ${tag}`),
    notesCompareLink: notes.includes(`...${tag}`),
    ledgerTag: ledger?.watermark?.releaseTag ?? null,
  };
}

if (import.meta.main) {
  const tagIndex = process.argv.indexOf("--tag");
  const tagOverride = tagIndex === -1 ? "" : (process.argv[tagIndex + 1] ?? "");
  const facts = collectFacts(tagOverride);
  const issues = checkReleaseReady(facts);

  if (issues.length > 0) {
    console.error(`❌ release ${facts.tag} is not ready:`);
    for (const issue of issues) console.error(`   - ${issue}`);
    process.exit(1);
  }
  console.log(
    `✅ release ${facts.tag} is ready: HEAD == origin/main (${facts.head.slice(0, 12)}), tag free, docs agree.`,
  );
}
