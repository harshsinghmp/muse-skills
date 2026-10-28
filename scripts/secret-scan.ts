#!/usr/bin/env bun
/**
 * 🛡️ secret-scan.ts — Root Secret Scanning Entrypoint for Muse Agency OS
 *
 * Delegates directly to the autonomous Vibeguard secret scanning engine
 * in skills/quality-review/muse-security/scripts/secret-scan.ts.
 *
 * Usage:
 *   bun run secret-scan [path]
 *   bun scripts/secret-scan.ts [path]
 */

import { main } from "../skills/quality-review/muse-security/scripts/secret-scan";

main().catch((err) => {
  console.error("SecretScan error:", err);
  process.exit(1);
});
