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

export interface SilentCatchViolation {
  file: string;
  line: number;
  snippet: string;
  recommendation: string;
}

export interface SilentCatchReport {
  scannedFiles: number;
  violations: SilentCatchViolation[];
}

export function scanSilentCatches(targetDir = process.cwd()): SilentCatchReport {
  let scannedFiles = 0;
  const violations: SilentCatchViolation[] = [];

  function walk(current: string) {
    if (!fs.existsSync(current)) return;
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      if (
        current.includes("node_modules") ||
        current.includes(".git") ||
        current.includes("dist") ||
        current.includes(".next")
      )
        return;
      const files = fs.readdirSync(current);
      for (const f of files) walk(path.join(current, f));
    } else if (/\.(ts|tsx|js|jsx)$/.test(current)) {
      scannedFiles++;
      const content = fs.readFileSync(current, "utf8");

      // Regex to find catch blocks
      const catchRegex = /catch\s*(?:\([^)]*\))?\s*\{([^}]*)\}/gs;
      let match = catchRegex.exec(content);
      while (match !== null) {
        const body = match[1]
          .replace(/\/\/[^\n]*/g, "")
          .replace(/\/\*.*?\*\//gs, "")
          .trim();
        const hasLog = /console\.(?:error|warn|info)|logger\.|reportError|captureException/i.test(match[1]);
        const hasThrow = /\bthrow\b/.test(body);
        const hasReturn = /\breturn\b/.test(body);

        if (body.length === 0 || (!hasLog && !hasThrow && !hasReturn)) {
          // Calculate line number
          const prefix = content.slice(0, match.index);
          const lineNum = prefix.split("\n").length;
          violations.push({
            file: path.relative(process.cwd(), current),
            line: lineNum,
            snippet: match[0].slice(0, 60).replace(/\n/g, " "),
            recommendation: "Log error to console/telemetry, rethrow, or return an explicit fallback.",
          });
        }
        match = catchRegex.exec(content);
      }
    }
  }

  walk(targetDir);
  return { scannedFiles, violations };
}

export interface FlakyTestViolation {
  file: string;
  line: number;
  pattern: string;
  recommendation: string;
}

export interface FlakyTestReport {
  scannedTestFiles: number;
  violations: FlakyTestViolation[];
}

export function scanFlakyTestSleeps(targetDir = process.cwd()): FlakyTestReport {
  let scannedTestFiles = 0;
  const violations: FlakyTestViolation[] = [];

  function walk(current: string) {
    if (!fs.existsSync(current)) return;
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      if (current.includes("node_modules") || current.includes(".git") || current.includes("dist")) return;
      const files = fs.readdirSync(current);
      for (const f of files) walk(path.join(current, f));
    } else if (
      /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(current) ||
      current.includes("/tests/") ||
      current.includes("/test/")
    ) {
      if (/\.(ts|tsx|js|jsx)$/.test(current)) {
        scannedTestFiles++;
        const content = fs.readFileSync(current, "utf8");
        const lines = content.split("\n");

        lines.forEach((lineText, idx) => {
          if (/waitForTimeout\s*\(/.test(lineText)) {
            violations.push({
              file: path.relative(process.cwd(), current),
              line: idx + 1,
              pattern: "page.waitForTimeout()",
              recommendation: "Replace arbitrary timer wait with page.waitForSelector() or expect.poll().",
            });
          }
          if (/\b(?:await\s+)?sleep\s*\(\d+\)/.test(lineText)) {
            violations.push({
              file: path.relative(process.cwd(), current),
              line: idx + 1,
              pattern: "sleep(N)",
              recommendation: "Replace arbitrary timer sleep with deterministic polling or assertion timeout.",
            });
          }
        });
      }
    }
  }

  walk(targetDir);
  return { scannedTestFiles, violations };
}

export interface DependencyViolation {
  package: string;
  reason: string;
  replacement: string;
}

export interface DependencyDietReport {
  packageJsonPath: string;
  violations: DependencyViolation[];
}

const REDUNDANT_DEPS: Record<string, { reason: string; replacement: string }> = {
  "is-odd": { reason: "Trivial micro-package", replacement: "Native (n % 2 !== 0)" },
  "is-even": { reason: "Trivial micro-package", replacement: "Native (n % 2 === 0)" },
  "left-pad": { reason: "Trivial micro-package", replacement: "Native String.prototype.padStart()" },
  "is-number": { reason: "Trivial micro-package", replacement: "Native typeof n === 'number'" },
  axios: { reason: "Redundant HTTP client", replacement: "Standard native fetch() in Node 18+ and Bun" },
  "node-fetch": { reason: "Redundant fetch polyfill", replacement: "Standard native fetch() in Node 18+ and Bun" },
  moment: { reason: "Heavyweight legacy datetime library", replacement: "Native Intl API or lightweight date-fns" },
  querystring: { reason: "Deprecated legacy Node module", replacement: "Standard URLSearchParams" },
  rimraf: {
    reason: "Legacy filesystem helper",
    replacement: "Native fs.rmSync(path, { recursive: true, force: true })",
  },
  mkdirp: { reason: "Legacy directory helper", replacement: "Native fs.mkdirSync(path, { recursive: true })" },
};

export function auditRedundantDependencies(pkgPath: string): DependencyDietReport {
  const violations: DependencyViolation[] = [];
  if (!fs.existsSync(pkgPath)) return { packageJsonPath: pkgPath, violations };

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    for (const [name, meta] of Object.entries(REDUNDANT_DEPS)) {
      if (allDeps[name]) {
        violations.push({
          package: name,
          reason: meta.reason,
          replacement: meta.replacement,
        });
      }
    }
  } catch {
    // Ignore invalid JSON
  }

  return { packageJsonPath: pkgPath, violations };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const isJson = args.includes("--json");

  if (args.includes("--scan-duplicates")) {
    const idx = args.indexOf("--scan-duplicates");
    const target = args[idx + 1] && !args[idx + 1].startsWith("-") ? args[idx + 1] : process.cwd();
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
  } else if (args.includes("--scan-silent-catches")) {
    const idx = args.indexOf("--scan-silent-catches");
    const target = args[idx + 1] && !args[idx + 1].startsWith("-") ? args[idx + 1] : process.cwd();
    const report = scanSilentCatches(target);
    if (isJson) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`\n📢 Loud Failure & Silent Catch Audit: ${target}`);
      console.log(`  Scanned Files: ${report.scannedFiles}`);
      console.log(`  Silent Catches: ${report.violations.length}`);
      if (report.violations.length === 0) {
        console.log(`  ✅ Clean! Zero silent error-swallowing catch blocks.`);
      } else {
        for (const v of report.violations) {
          console.log(`    - ❌ ${v.file}:${v.line} -> ${v.snippet} (Fix: ${v.recommendation})`);
        }
      }
    }
  } else if (args.includes("--scan-flaky-tests")) {
    const idx = args.indexOf("--scan-flaky-tests");
    const target = args[idx + 1] && !args[idx + 1].startsWith("-") ? args[idx + 1] : process.cwd();
    const report = scanFlakyTestSleeps(target);
    if (isJson) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`\n⏱️ Deterministic Test Sleep Audit: ${target}`);
      console.log(`  Scanned Test Files: ${report.scannedTestFiles}`);
      console.log(`  Flaky Sleeps: ${report.violations.length}`);
      if (report.violations.length === 0) {
        console.log(`  ✅ Clean! Zero arbitrary sleeps detected in test files.`);
      } else {
        for (const v of report.violations) {
          console.log(`    - ⚠️  ${v.file}:${v.line} -> ${v.pattern} (Fix: ${v.recommendation})`);
        }
      }
    }
  } else if (args.includes("--audit-deps")) {
    const idx = args.indexOf("--audit-deps");
    const target =
      args[idx + 1] && !args[idx + 1].startsWith("-") ? args[idx + 1] : path.join(process.cwd(), "package.json");
    const report = auditRedundantDependencies(target);
    if (isJson) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`\n📦 Dependency Diet Audit: ${target}`);
      console.log(`  Redundant Packages: ${report.violations.length}`);
      if (report.violations.length === 0) {
        console.log(`  ✅ Clean! Zero redundant platform-duplicating dependencies detected.`);
      } else {
        for (const v of report.violations) {
          console.log(`    - ⚠️  Package '${v.package}': ${v.reason} (Replace with: ${v.replacement})`);
        }
      }
    }
  } else {
    console.log(
      "Usage: bun anti-drift.ts [--scan-duplicates [dir]] [--check-scope [since-ref]] [--scan-silent-catches [dir]] [--scan-flaky-tests [dir]] [--audit-deps [package.json]]",
    );
  }
}
