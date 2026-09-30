#!/usr/bin/env bun
/**
 * token_fence.ts: Linter and snapping engine for arbitrary Tailwind bracket hallucinations.
 *
 * Usage:
 *   bun token_fence.ts --scan [file|dir] [--json]
 */

import fs from "node:fs";
import path from "node:path";

export interface BracketViolation {
  file: string;
  line: number;
  rawClass: string;
  category: "color" | "dimension" | "radius" | "font-size";
  recommendedToken: string;
}

export function snapPixelToTailwind(px: number, prefix: string): string {
  // Standard 4pt scale (1rem = 16px, 1 unit = 4px)
  const units = Math.round(px / 4);
  if (prefix.startsWith("rounded")) {
    if (px <= 2) return "rounded-sm";
    if (px <= 6) return "rounded";
    if (px <= 8) return "rounded-md";
    if (px <= 12) return "rounded-lg";
    if (px <= 16) return "rounded-xl";
    return "rounded-2xl";
  }
  if (prefix.startsWith("text")) {
    if (px <= 12) return "text-xs";
    if (px <= 14) return "text-sm";
    if (px <= 16) return "text-base";
    if (px <= 18) return "text-lg";
    if (px <= 20) return "text-xl";
    if (px <= 24) return "text-2xl";
    return "text-3xl";
  }
  return `${prefix}-${units}`;
}

export function scanFileForBrackets(filePath: string): BracketViolation[] {
  const violations: BracketViolation[] = [];
  if (!fs.existsSync(filePath)) return violations;

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  const colorRegex = /((?:bg|text|border|ring|fill|stroke)-\[#[a-fA-F0-9]{3,8}\])/g;
  const pixelRegex =
    /((?:w|h|min-w|max-w|min-h|max-h|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|top|bottom|left|right|rounded|text)-\[(\d+)px\])/g;

  lines.forEach((lineText, idx) => {
    // 1. Color matches
    let colorMatch = colorRegex.exec(lineText);
    while (colorMatch !== null) {
      const raw = colorMatch[1];
      const prefix = raw.split("-[")[0];
      violations.push({
        file: filePath,
        line: idx + 1,
        rawClass: raw,
        category: "color",
        recommendedToken: `${prefix}-foreground or ${prefix}-muted (use theme token)`,
      });
      colorMatch = colorRegex.exec(lineText);
    }

    // 2. Pixel matches
    let pixelMatch = pixelRegex.exec(lineText);
    while (pixelMatch !== null) {
      const raw = pixelMatch[1];
      const prefix = raw.split("-[")[0];
      const px = parseInt(pixelMatch[2], 10);
      let cat: "dimension" | "radius" | "font-size" = "dimension";
      if (prefix.startsWith("rounded")) cat = "radius";
      else if (prefix.startsWith("text")) cat = "font-size";

      violations.push({
        file: filePath,
        line: idx + 1,
        rawClass: raw,
        category: cat,
        recommendedToken: snapPixelToTailwind(px, prefix),
      });
      pixelMatch = pixelRegex.exec(lineText);
    }
  });

  return violations;
}

export function scanDirectory(
  dir: string,
  exts = [".tsx", ".jsx", ".astro", ".html", ".vue", ".svelte", ".css"],
): BracketViolation[] {
  let results: BracketViolation[] = [];
  if (!fs.existsSync(dir)) return results;

  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    return scanFileForBrackets(dir);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist" || entry.name === ".next")
      continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDirectory(full, exts));
    } else if (entry.isFile() && exts.some((ext) => entry.name.endsWith(ext))) {
      results = results.concat(scanFileForBrackets(full));
    }
  }
  return results;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const scanIdx = args.indexOf("--scan");
  const target =
    scanIdx !== -1 && args[scanIdx + 1] && !args[scanIdx + 1].startsWith("-") ? args[scanIdx + 1] : process.cwd();
  const isJson = args.includes("--json");

  const violations = scanDirectory(target);

  if (isJson) {
    console.log(JSON.stringify({ target, totalViolations: violations.length, violations }, null, 2));
  } else {
    console.log(`\n🛡️ Design Token Fence Scan: ${target}`);
    console.log(`  Total Arbitrary Bracket Hallucinations: ${violations.length}`);
    if (violations.length === 0) {
      console.log(`  ✅ Clean! Zero arbitrary Tailwind bracket classes detected.`);
    } else {
      console.log(`\n  Violations:`);
      for (const v of violations.slice(0, 20)) {
        console.log(`    - ${v.file}:${v.line} -> ${v.rawClass} (Recommended: ${v.recommendedToken})`);
      }
      if (violations.length > 20) {
        console.log(`    ... and ${violations.length - 20} more.`);
      }
    }
  }
}
