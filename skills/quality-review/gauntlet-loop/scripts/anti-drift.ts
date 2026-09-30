#!/usr/bin/env bun
/**
 * anti-drift.ts: Duplicate utility scanner and refactor scope guard for gauntlet quality loops.
 *
 * Usage:
 *   bun anti-drift.ts --scan-duplicates [dir] [--json]
 *   bun anti-drift.ts --check-scope [since-git-ref]
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export interface DuplicateUtility {
  functionName: string;
  declarations: { file: string; line: number }[];
}

export interface AntiDriftReport {
  targetDir: string;
  isPassing: boolean;
  duplicateCount: number;
  duplicates: DuplicateUtility[];
}

const COMMON_UTILS = ["cn", "formatDate", "slugify", "truncate", "debounce", "throttle", "classNames", "fetcher"];

export function scanDuplicateUtilities(targetDir = process.cwd()): AntiDriftReport {
  const funcMap = new Map<string, { file: string; line: number }[]>();
  const textExts = [".ts", ".tsx", ".js", ".jsx", ".astro"];

  for (const u of COMMON_UTILS) {
    funcMap.set(u, []);
  }

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === "node_modules" || e.name === ".git" || e.name === "dist" || e.name === ".next") continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        scan(full);
      } else if (e.isFile() && textExts.some((ext) => e.name.endsWith(ext))) {
        try {
          const content = fs.readFileSync(full, "utf8");
          const lines = content.split("\n");
          lines.forEach((lineText, idx) => {
            for (const util of COMMON_UTILS) {
              const regex = new RegExp(
                `(?:export\\s+)?(?:function\\s+${util}\\b|const\\s+${util}\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>))`,
              );
              if (regex.test(lineText)) {
                funcMap.get(util)?.push({ file: path.relative(targetDir, full), line: idx + 1 });
              }
            }
          });
        } catch {
          // Ignore
        }
      }
    }
  }

  if (fs.existsSync(targetDir)) {
    if (fs.statSync(targetDir).isFile()) {
      // scan single file
    } else {
      scan(targetDir);
    }
  }

  const duplicates: DuplicateUtility[] = [];
  for (const [funcName, decls] of funcMap.entries()) {
    if (decls.length > 1) {
      duplicates.push({ functionName: funcName, declarations: decls });
    }
  }

  return {
    targetDir,
    isPassing: duplicates.length === 0,
    duplicateCount: duplicates.length,
    duplicates,
  };
}

export function checkRefactorScope(sinceRef = "HEAD~1"): { fileCount: number; files: string[]; exceedsLimit: boolean } {
  let files: string[] = [];
  try {
    const out = execSync(`git diff --name-only ${sinceRef}`, { encoding: "utf8" });
    files = out
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
  } catch {
    files = [];
  }

  const fileCount = files.length;
  const exceedsLimit = fileCount > 3;

  return { fileCount, files, exceedsLimit };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  if (args.includes("--scan-duplicates")) {
    const idx = args.indexOf("--scan-duplicates");
    const target = args[idx + 1] && !args[idx + 1].startsWith("-") ? args[idx + 1] : process.cwd();
    const isJson = args.includes("--json");
    const report = scanDuplicateUtilities(target);

    if (isJson) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`\n🏛️ Anti-Drift Duplicate Utility Scan: ${target}`);
      console.log(
        `  Verdict: ${report.isPassing ? "✅ CLEAN (Zero Duplicate Utilities)" : "❌ FAILED (Duplicates Detected)"}`,
      );
      console.log(`  Duplicate Utilities Found: ${report.duplicateCount}`);
      for (const d of report.duplicates) {
        console.log(`\n  Function "${d.functionName}" duplicated in ${d.declarations.length} places:`);
        for (const loc of d.declarations) {
          console.log(`    - ${loc.file}:${loc.line}`);
        }
      }
    }
  } else if (args.includes("--check-scope")) {
    const idx = args.indexOf("--check-scope");
    const ref = args[idx + 1] || "HEAD~1";
    const res = checkRefactorScope(ref);
    console.log(`\n📐 Refactor Scope Check (${ref}):`);
    console.log(`  Files Modified: ${res.fileCount}`);
    console.log(
      `  Limit Exceeded (>3 files): ${res.exceedsLimit ? "⚠️ YES (Escalate to Nexus)" : "✅ NO (Within Scope)"}`,
    );
  } else {
    console.log("Usage: bun anti-drift.ts --scan-duplicates [dir] | --check-scope [since-ref]");
  }
}
