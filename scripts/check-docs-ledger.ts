#!/usr/bin/env bun
/**
 * check-docs-ledger — release-time gate for .docs-ledger.json.
 *
 * Fails when a tracked change still owes audience docs, or when the ledger's
 * release tag does not match package.json. Stamp a release with:
 *   bun skills/core-engine/updatedocs/scripts/updatedocs.ts . --release vX.Y.Z
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const pkg = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8")) as { version: string };

const check = spawnSync(
  "bun",
  [join(REPO_ROOT, "skills/core-engine/updatedocs/scripts/updatedocs.ts"), ".", "--check-points"],
  { cwd: REPO_ROOT, encoding: "utf8" },
);
if (check.status !== 0) {
  console.error(check.stdout || check.stderr);
  console.error("❌ docs ledger has pending documentation debt; run --ledger, document, and --checkpoint.");
  process.exit(1);
}

let ledger: { watermark?: { releaseTag?: string; point?: number } };
try {
  ledger = JSON.parse(readFileSync(join(REPO_ROOT, ".docs-ledger.json"), "utf8"));
} catch (error) {
  console.error(`❌ docs ledger is unreadable: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const expected = `v${pkg.version}`;
const actual = ledger.watermark?.releaseTag;
if (actual !== expected) {
  console.error(`❌ docs ledger releaseTag is ${actual ?? "<none>"}; expected ${expected}.`);
  console.error(`   Run: bun skills/core-engine/updatedocs/scripts/updatedocs.ts . --release ${expected}`);
  process.exit(1);
}

console.log(`✅ docs ledger current and stamped ${expected} (watermark DP-${ledger.watermark?.point}).`);
