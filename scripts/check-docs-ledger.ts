#!/usr/bin/env bun
/**
 * check-docs-ledger — release-time gate for .docs-ledger.json.
 *
 * Fails when a tracked change still owes audience docs, or when the ledger's
 * release tag does not match package.json. Stamp a release with:
 *   bun skills/core-engine/updatedocs/scripts/updatedocs.ts . --release vX.Y.Z
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const pkg = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8")) as { version: string };

interface AudienceCoverage {
  required?: boolean;
  status?: string;
}
interface LedgerPoint {
  id: string;
  audiences?: Record<string, AudienceCoverage>;
}
let ledger: { watermark?: { releaseTag?: string; point?: number }; points?: LedgerPoint[] };
try {
  ledger = JSON.parse(readFileSync(join(REPO_ROOT, ".docs-ledger.json"), "utf8"));
} catch (error) {
  console.error(`❌ docs ledger is unreadable: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const ready = new Set(["documented", "verified", "not-needed"]);
const pending = (ledger.points ?? []).filter((point) =>
  Object.values(point.audiences ?? {}).some((coverage) => coverage.required && !ready.has(coverage.status ?? "")),
);
if (pending.length > 0) {
  console.error(
    `❌ docs ledger has ${pending.length} point(s) owing audience docs: ${pending.map((point) => point.id).join(", ")}`,
  );
  console.error("   Run --ledger, document, and --checkpoint before releasing.");
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
