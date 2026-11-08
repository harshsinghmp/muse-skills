#!/usr/bin/env bun
// check-sync: Pre-merge freshness gate.
// Fails when the current branch does not contain the latest integration branch,
// or when the local integration branch is behind its remote.
import { spawnSync } from "node:child_process";

function run(cmd: string, args: string[]): { code: number; out: string } {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  return { code: r.status ?? 1, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

function git(args: string[]) {
  return run("git", args);
}

const flags = new Map<string, string>();
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) flags.set(match[1], match[2]);
  else if (arg.startsWith("--")) flags.set(arg.slice(2), "true");
}

const base = flags.get("base") ?? process.env.INTEGRATION_BRANCH ?? "dev";
const remote = flags.get("remote") ?? "origin";
const head = flags.get("head") ?? "HEAD";
const checkLocalBase = !flags.has("no-local-base");
const shouldFetch = !flags.has("no-fetch");
const remoteRef = `${remote}/${base}`;

function fail(message: string): never {
  console.error(`\n✗ Sync gate failed: ${message}`);
  process.exit(1);
}

if (shouldFetch) {
  const fetched = git(["fetch", "--prune", remote, base]);
  if (fetched.code !== 0) {
    fail(`could not fetch ${remoteRef}.\n${fetched.out.trim()}`);
  }
}

for (const ref of [remoteRef, head]) {
  if (git(["rev-parse", "--verify", "--quiet", ref]).code !== 0) {
    fail(`unknown ref: ${ref}`);
  }
}

const behind = git(["rev-list", "--count", `${head}..${remoteRef}`]);
const ahead = git(["rev-list", "--count", `${remoteRef}..${head}`]);
const containsBase = git(["merge-base", "--is-ancestor", remoteRef, head]).code === 0;

let localBaseBehind: string | null = null;
if (checkLocalBase && git(["show-ref", "--verify", "--quiet", `refs/heads/${base}`]).code === 0) {
  const count = git(["rev-list", "--count", `${base}..${remoteRef}`]);
  localBaseBehind = count.code === 0 ? count.out.trim() : "?";
}

const behindCount = behind.code === 0 ? behind.out.trim() : "?";
const aheadCount = ahead.code === 0 ? ahead.out.trim() : "?";
const localBaseOk = localBaseBehind === null || localBaseBehind === "0";
const synced = containsBase && localBaseOk;

const shortHead = git(["rev-parse", "--short", head]).out.trim();
const shortRemote = git(["rev-parse", "--short", remoteRef]).out.trim();

console.log(`\n🔁 Sync check — ${head} vs ${remoteRef}`);
console.log(`   refs:       ${head} @ ${shortHead} · ${remoteRef} @ ${shortRemote}`);
console.log(`   divergence: ${behindCount} behind · ${aheadCount} ahead`);
if (localBaseBehind !== null) {
  console.log(`   local ${base}: ${localBaseBehind} behind ${remoteRef}`);
}
console.log(`   result:     ${synced ? "✅ SYNCED" : "✗ NOT SYNCED"}`);

if (!synced) {
  console.error("\nRemediation:");
  if (!containsBase) {
    console.error(`  git rebase ${remoteRef}    # or: git merge ${remoteRef}`);
    console.error("  Resolve conflicts, re-run tests, push, and wait for the sync-gate check.");
  }
  if (!localBaseOk) {
    console.error(`  git switch ${base} && git pull --ff-only`);
  }
  process.exit(1);
}
