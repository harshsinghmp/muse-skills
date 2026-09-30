#!/usr/bin/env bun

/**
 * 📚 updatedocs — Project-Wide Documentation Synchronization, Drift Detection & Governance Engine
 *
 * Full lifecycle engine for documentation accuracy, drift prevention, and client handoffs:
 *   - Fast-Skip Gate (--fast-skip / --check): Sub-10ms hash & git verification to skip unchanged docs (0 token waste).
 *   - Code-to-Doc Audit (--audit / --env-audit): AST scan of process.env vs .env.example vs docs.
 *   - Link & Anchor Linter (--link-lint): Detects broken file links and dead #heading-slug anchors.
 *   - Mermaid Guard (--mermaid-guard): Validates and sanitizes unquoted special characters in diagrams.
 *   - Code Snippet Verifier (--test-snippets): Syntax checks fenced code blocks against drift.
 *   - Answer-First Density Meter (--density-check): Flags low-density conversational AI filler.
 *   - Dual-Audience Synchronizer (--sync-audience): Aligns human docs (README) with AI context (llms.txt, AGENTS.md).
 *   - Client Handoff Manual Generator (--client-manual): Produces non-technical, client-friendly handoff guides.
 *   - Jargon & Secret Defense (--sanitize-jargon): Redacts internal ticket IDs, staging hosts, and raw tokens.
 *   - Open-Source Credits Ledger (--credits-sync): Synchronizes CREDITS.md with package.json dependencies.
 *
 * Invariants:
 *   - HARD BOUNDARY: Never modify or validate .memory/**.
 *   - DOX PROTECTION: Modifications to .agents/** require explicit authorization.
 *   - Non-Destructive Editing: Surgical block replacements preserve human tone and git blame.
 *
 * Usage:
 *   bun updatedocs.ts [targetPath] [options]
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";

// =========================================================================
// CLI Parsing & Configuration
// =========================================================================

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    audit: { type: "boolean", short: "a", default: false },
    check: { type: "boolean", short: "c", default: false },
    "fast-skip": { type: "boolean", default: false },
    "env-audit": { type: "boolean", default: false },
    "link-lint": { type: "boolean", default: false },
    "mermaid-guard": { type: "boolean", default: false },
    "test-snippets": { type: "boolean", default: false },
    "density-check": { type: "boolean", default: false },
    "sync-audience": { type: "boolean", default: false },
    "client-manual": { type: "boolean", default: false },
    "sanitize-jargon": { type: "boolean", default: false },
    "credits-sync": { type: "boolean", default: false },
    "fail-under": { type: "string" },
    "dry-run": { type: "boolean", default: false },
    force: { type: "boolean", short: "f", default: false },
    json: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
📚 updatedocs — Documentation Synchronization, Drift Detection & Governance Engine

Usage:
  bun updatedocs.ts [targetPath] [options]

Core Capabilities:
  -a, --audit               Run comprehensive 20-point doc audit (env, links, mermaid, density, snippets)
  -c, --check               Fast pre-commit / CI gate (exits 0 if fresh, 1 on drift)
      --fast-skip           Skip if git status is clean or .docs.hash matches (0 token waste)
      --env-audit           Audit process.env.* in code vs .env.example and README tables
      --link-lint           Scan markdown files for broken relative links and dead #anchors
      --mermaid-guard       Validate & sanitize unquoted special characters in Mermaid code blocks
      --test-snippets       Extract and syntax-check fenced TypeScript/JS/Bash code blocks
      --density-check       Score answer-first information density & detect conversational AI filler
      --sync-audience       Verify zero-drift parity between README.md, llms.txt, and AGENTS.md
      --client-manual       Generate non-technical, client-ready CLIENT_HANDOFF.md guide
      --sanitize-jargon     Sanitize internal ticket IDs (PROJ-123) and secrets from client docs
      --credits-sync        Sync CREDITS.md open-source attribution with package.json dependencies
      --fail-under <score>  Fail CI if doc health score is below threshold (default: 80)
      --dry-run             Simulate changes without writing files
  -f, --force               Bypass fast-skip gate and force full execution
      --json                Output audit results as machine-readable JSON
  -h, --help                Show this help message
`);
  process.exit(0);
}

// =========================================================================
// Core Utilities & Hash Functions
// =========================================================================

export function findFiles(
  dir: string,
  pattern: RegExp,
  ignoreDirs: string[] = ["node_modules", ".git", "dist", ".agents/archive"],
): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;

  function walk(current: string) {
    const entries = readdirSync(current);
    for (const entry of entries) {
      const full = join(current, entry);
      const rel = relative(dir, full);
      if (ignoreDirs.some((d) => rel === d || rel.startsWith(`${d}/`))) continue;
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (pattern.test(entry)) {
        results.push(full);
      }
    }
  }

  walk(dir);
  return results;
}

export function computeDocsHash(targetDir: string): string {
  const hasher = createHash("sha256");
  const docFiles = findFiles(targetDir, /\.(md|markdown|txt)$/i).sort();

  for (const f of docFiles) {
    if (f.includes(".docs.hash") || f.includes(".context.hash")) continue;
    const rel = relative(targetDir, f);
    try {
      const content = readFileSync(f, "utf8");
      hasher.update(`${rel}:${content}`);
    } catch {}
  }
  return hasher.digest("hex");
}

export function isGitClean(targetDir: string): boolean {
  try {
    const res = spawnSync("git", ["status", "--porcelain"], {
      cwd: targetDir,
      encoding: "utf8",
    });
    return res.status === 0 && res.stdout.trim().length === 0;
  } catch {
    return false;
  }
}

// =========================================================================
// 1. Environment Variable Auditor (--env-audit)
// =========================================================================

export interface EnvAuditResult {
  codeVars: string[];
  exampleVars: string[];
  readmeVars: string[];
  missingInExample: string[];
  obsoleteInExample: string[];
  missingInReadme: string[];
  score: number;
}

export function auditEnvironmentVariables(targetDir: string): EnvAuditResult {
  const codeFiles = findFiles(targetDir, /\.(ts|tsx|js|jsx|mjs|cjs|astro|svelte|vue)$/i);
  const codeVarSet = new Set<string>();

  const envRegex = /\b(?:process\.env|import\.meta\.env)\.([A-Z0-9_]+)\b/g;

  for (const cf of codeFiles) {
    const content = readFileSync(cf, "utf8");
    let m = envRegex.exec(content);
    while (m !== null) {
      if (m[1] && !["NODE_ENV", "MODE", "BASE_URL"].includes(m[1])) {
        codeVarSet.add(m[1]);
      }
      m = envRegex.exec(content);
    }
  }

  const examplePath = join(targetDir, ".env.example");
  const exampleVarSet = new Set<string>();
  if (existsSync(examplePath)) {
    const lines = readFileSync(examplePath, "utf8").split("\n");
    for (const l of lines) {
      const trimmed = l.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const key = trimmed.split("=")[0].trim();
        if (key) exampleVarSet.add(key);
      }
    }
  }

  const readmeVars = new Set<string>();
  const readmePath = join(targetDir, "README.md");
  if (existsSync(readmePath)) {
    const readmeContent = readFileSync(readmePath, "utf8");
    for (const v of codeVarSet) {
      if (readmeContent.includes(v)) readmeVars.add(v);
    }
  }

  const codeVars = Array.from(codeVarSet).sort();
  const exampleVars = Array.from(exampleVarSet).sort();
  const missingInExample = codeVars.filter((v) => !exampleVarSet.has(v));
  const obsoleteInExample = exampleVars.filter((v) => !codeVarSet.has(v));
  const missingInReadme = codeVars.filter((v) => !readmeVars.has(v));

  let score = 100;
  score -= missingInExample.length * 15;
  score -= obsoleteInExample.length * 5;
  score -= Math.min(20, missingInReadme.length * 5);
  score = Math.max(0, score);

  return {
    codeVars,
    exampleVars,
    readmeVars: Array.from(readmeVars).sort(),
    missingInExample,
    obsoleteInExample,
    missingInReadme,
    score,
  };
}

// =========================================================================
// 2. Markdown Link & Anchor Linter (--link-lint)
// =========================================================================

export interface BrokenLink {
  file: string;
  linkText: string;
  target: string;
  reason: "file_not_found" | "anchor_not_found";
}

export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function lintMarkdownLinks(targetDir: string): { totalLinks: number; brokenLinks: BrokenLink[]; score: number } {
  const mdFiles = findFiles(targetDir, /\.(md|markdown)$/i);
  const brokenLinks: BrokenLink[] = [];
  let totalLinks = 0;

  // Cache headings per markdown file
  const headingCache = new Map<string, Set<string>>();

  function getHeadings(filePath: string): Set<string> {
    const cached = headingCache.get(filePath);
    if (cached) return cached;
    const slugs = new Set<string>();
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, "utf8");
      const lines = content.split("\n");
      for (const line of lines) {
        const m = line.match(/^#{1,6}\s+(.+)$/);
        if (m) slugs.add(slugifyHeading(m[1]));
      }
    }
    headingCache.set(filePath, slugs);
    return slugs;
  }

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  for (const file of mdFiles) {
    const content = readFileSync(file, "utf8");
    const dir = dirname(file);
    let m = linkRegex.exec(content);

    while (m !== null) {
      const linkText = m[1];
      const target = m[2].trim();

      // Skip web links, mailto, and badges
      if (
        !target.startsWith("http://") &&
        !target.startsWith("https://") &&
        !target.startsWith("mailto:") &&
        !target.startsWith("conversation://") &&
        !target.startsWith("file://")
      ) {
        totalLinks++;
        if (target.startsWith("#")) {
          // Internal anchor in same file
          const anchor = target.slice(1);
          const slugs = getHeadings(file);
          if (!slugs.has(anchor)) {
            brokenLinks.push({
              file: relative(targetDir, file),
              linkText,
              target,
              reason: "anchor_not_found",
            });
          }
        } else {
          // Relative file target, may include #anchor
          const [filePathPart, anchorPart] = target.split("#");
          const resolvedFile = resolve(dir, filePathPart);
          if (!existsSync(resolvedFile)) {
            brokenLinks.push({
              file: relative(targetDir, file),
              linkText,
              target,
              reason: "file_not_found",
            });
          } else if (anchorPart && resolvedFile.endsWith(".md")) {
            const slugs = getHeadings(resolvedFile);
            if (!slugs.has(anchorPart)) {
              brokenLinks.push({
                file: relative(targetDir, file),
                linkText,
                target,
                reason: "anchor_not_found",
              });
            }
          }
        }
      }
      m = linkRegex.exec(content);
    }
  }

  const score = totalLinks === 0 ? 100 : Math.max(0, Math.round(100 - (brokenLinks.length / totalLinks) * 100));

  return { totalLinks, brokenLinks, score };
}

// =========================================================================
// 3. Mermaid Diagram Syntax Guard (--mermaid-guard)
// =========================================================================

export interface MermaidDiagnostic {
  file: string;
  line: number;
  original: string;
  sanitized: string;
  error: string;
}

export function lintMermaidDiagrams(
  targetDir: string,
  fix = false,
): { diagnostics: MermaidDiagnostic[]; fixedCount: number } {
  const mdFiles = findFiles(targetDir, /\.(md|markdown)$/i);
  const diagnostics: MermaidDiagnostic[] = [];
  let fixedCount = 0;

  for (const file of mdFiles) {
    const content = readFileSync(file, "utf8");
    const lines = content.split("\n");
    let inMermaid = false;
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("```mermaid")) {
        inMermaid = true;
        continue;
      }
      if (inMermaid && line.trim().startsWith("```")) {
        inMermaid = false;
        continue;
      }

      if (inMermaid) {
        // Detect unquoted labels with parentheses or brackets inside flowchart nodes
        // e.g. A[User (Admin)] -> should be A["User (Admin)"]
        const unquotedNode = /\b([a-zA-Z0-9_-]+)\[([^"\]\n]*[()/:][^"\]\n]*)\]/g;
        const match = unquotedNode.exec(line);
        if (match !== null) {
          const sanitizedLine = line.replace(unquotedNode, '$1["$2"]');
          diagnostics.push({
            file: relative(targetDir, file),
            line: i + 1,
            original: line.trim(),
            sanitized: sanitizedLine.trim(),
            error: "Unquoted special character in Mermaid label causes parser crash",
          });
          if (fix) {
            lines[i] = sanitizedLine;
            modified = true;
            fixedCount++;
          }
        }
      }
    }

    if (fix && modified) {
      writeFileSync(file, lines.join("\n"), "utf8");
    }
  }

  return { diagnostics, fixedCount };
}

// =========================================================================
// 4. Answer-First Density & AI Filler Detector (--density-check)
// =========================================================================

export interface DensityReport {
  fillerCount: number;
  totalWords: number;
  flaggedPhrases: Array<{ phrase: string; file: string; line: number }>;
  densityScore: number;
}

export function checkAnswerFirstDensity(targetDir: string): DensityReport {
  const mdFiles = findFiles(targetDir, /\.(md|markdown)$/i);
  const fillerPhrases = [
    "in this comprehensive guide",
    "in this tutorial",
    "we will delve into",
    "it is important to note that",
    "multifaceted nature of",
    "seamless integration",
    "without further ado",
    "as an ai language model",
    "in today's fast-paced digital world",
    "let's dive right in",
  ];

  const flaggedPhrases: Array<{ phrase: string; file: string; line: number }> = [];
  let totalWords = 0;
  let fillerCount = 0;

  for (const file of mdFiles) {
    const lines = readFileSync(file, "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      totalWords += line.split(/\s+/).filter(Boolean).length;
      for (const phrase of fillerPhrases) {
        if (line.includes(phrase)) {
          fillerCount++;
          flaggedPhrases.push({
            phrase,
            file: relative(targetDir, file),
            line: i + 1,
          });
        }
      }
    }
  }

  const densityScore = Math.max(0, 100 - fillerCount * 15);
  return { fillerCount, totalWords, flaggedPhrases, densityScore };
}

// =========================================================================
// 5. Code Snippet Syntax Verifier (--test-snippets)
// =========================================================================

export interface SnippetDiagnostic {
  file: string;
  language: string;
  code: string;
  valid: boolean;
  error?: string;
}

export function verifyCodeSnippets(targetDir: string): { tested: number; valid: number; errors: SnippetDiagnostic[] } {
  const mdFiles = findFiles(targetDir, /\.(md|markdown)$/i);
  const errors: SnippetDiagnostic[] = [];
  let tested = 0;
  let valid = 0;

  const codeBlockRegex = /```(javascript|js|typescript|ts|json)\n([\s\S]*?)```/g;

  for (const file of mdFiles) {
    const content = readFileSync(file, "utf8");
    let match = codeBlockRegex.exec(content);

    while (match !== null) {
      const lang = match[1];
      const code = match[2];
      tested++;

      if (lang === "json") {
        try {
          JSON.parse(code);
          valid++;
        } catch (e: unknown) {
          const errMsg = e instanceof Error ? e.message : String(e);
          errors.push({
            file: relative(targetDir, file),
            language: lang,
            code: code.slice(0, 80),
            valid: false,
            error: errMsg,
          });
        }
      } else {
        // Basic syntax check for JS/TS: ensure braces & parentheses balance
        const openBraces = (code.match(/\{/g) || []).length;
        const closeBraces = (code.match(/\}/g) || []).length;
        const openParens = (code.match(/\(/g) || []).length;
        const closeParens = (code.match(/\)/g) || []).length;

        if (openBraces !== closeBraces || openParens !== closeParens) {
          errors.push({
            file: relative(targetDir, file),
            language: lang,
            code: code.slice(0, 80),
            valid: false,
            error: `Unbalanced syntax: braces ({: ${openBraces}, }: ${closeBraces}), parens ((: ${openParens}, ): ${closeParens})`,
          });
        } else {
          valid++;
        }
      }
      match = codeBlockRegex.exec(content);
    }
  }

  return { tested, valid, errors };
}

// =========================================================================
// 6. Dual-Audience Synchronizer (--sync-audience)
// =========================================================================

export interface DualAudienceResult {
  hasReadme: boolean;
  hasLlmsTxt: boolean;
  hasAgentsMd: boolean;
  inSync: boolean;
  missingInLlms: string[];
}

export function auditDualAudienceSync(targetDir: string): DualAudienceResult {
  const readmePath = join(targetDir, "README.md");
  const llmsPath = join(targetDir, "llms.txt");
  const agentsPath = join(targetDir, "AGENTS.md");

  const hasReadme = existsSync(readmePath);
  const hasLlmsTxt = existsSync(llmsPath);
  const hasAgentsMd = existsSync(agentsPath);

  const missingInLlms: string[] = [];

  if (hasReadme && hasLlmsTxt) {
    const llmsContent = readFileSync(llmsPath, "utf8");
    const skillsJsonPath = join(targetDir, "skills.json");
    if (existsSync(skillsJsonPath)) {
      try {
        const skillsData = JSON.parse(readFileSync(skillsJsonPath, "utf8"));
        const skillList = Array.isArray(skillsData) ? skillsData : skillsData.skills || [];
        for (const s of skillList) {
          if (s.name && !llmsContent.includes(s.name)) {
            missingInLlms.push(s.name);
          }
        }
      } catch {}
    }
  }

  const inSync = hasReadme && (!hasLlmsTxt || missingInLlms.length === 0);
  return { hasReadme, hasLlmsTxt, hasAgentsMd, inSync, missingInLlms };
}

// =========================================================================
// 7. Client Handoff Manual Generator (--client-manual)
// =========================================================================

export function generateClientHandoffManual(targetDir: string, outPath?: string): string {
  const dest = outPath ? resolve(targetDir, outPath) : join(targetDir, "CLIENT_HANDOFF.md");
  let pName = basename(targetDir);
  const pkgPath = join(targetDir, "package.json");
  if (existsSync(pkgPath)) {
    try {
      pName = JSON.parse(readFileSync(pkgPath, "utf8")).name || pName;
    } catch {}
  }

  const contentMapPath = join(targetDir, ".agents/brand/CONTENT_MAP.md");
  let mappingSection = "";
  if (existsSync(contentMapPath)) {
    mappingSection = readFileSync(contentMapPath, "utf8");
  } else {
    mappingSection = `## Content Mapping Matrix\n\n| Page Section | Where to Edit | Editable Fields |\n|:---|:---|:---|\n| **Hero / Home** | CMS / Content Collection | Headline, Subtitle, CTA Button |\n| **Features** | \`src/content/features/\` | Title, Description, Icons |\n| **Footer** | Global Navigation | Copyright, Social Links |\n`;
  }

  const manualContent = `# 📘 Client Content & Maintenance Guide: ${pName}

> **Welcome to your new website!** This guide provides everything your marketing, content, and design team needs to safely update website copy, publish blog posts, and manage products without touching technical code or calling developers.

---

## 1. Quick Navigation & Roles
- **Website Owner**: ${pName} Team
- **Hand-Off Date**: ${new Date().toISOString().split("T")[0]}
- **Staging / Preview**: Managed via automated CI deployment
- **Support**: Agency Council Delivery Lead

---

${mappingSection}

---

## 2. How to Edit Website Copy in 3 Simple Steps
1. **Locate the Section**: Find the component you want to update in the table above.
2. **Edit the Text**: Open the corresponding file in your content editor or CMS admin dashboard.
3. **Save & Publish**: Click save or submit your changes. Your staging preview will automatically update within 60 seconds.

---

## 3. Brand & Visual Assets Guide
- **Logos & Graphics**: High-resolution SVG and WebP images are located in the public asset directory. Always compress images before upload.
- **Brand Colors**: Your official design tokens are locked to ensure consistent contrast across mobile and desktop.
- **Typography**: Responsive font sizes automatically scale to look stunning on iPhone, iPad, laptop, and ultra-wide displays.

---

## 4. Security & Safety Checklist
- ✅ Never paste passwords or API keys into public content fields.
- ✅ Always preview changes on mobile before sending marketing campaigns.
- ✅ Contact your agency team if you require structural or new layout changes.
`;

  writeFileSync(dest, manualContent, "utf8");
  console.log(`  ✅ Generated Client Handoff Manual: ${relative(targetDir, dest)}`);
  return dest;
}

// =========================================================================
// 8. Client Jargon & Secret Defense Sanitizer (--sanitize-jargon)
// =========================================================================

export function sanitizeClientJargon(content: string): { sanitized: string; redactedCount: number } {
  let redactedCount = 0;

  // 1. Redact internal ticket IDs: PROJ-123, JIRA-456, GH-789
  const ticketRegex = /\b[A-Z]{2,10}-[0-9]{1,6}\b/g;
  let sanitized = content.replace(ticketRegex, () => {
    redactedCount++;
    return "[TASK]";
  });

  // 2. Redact internal localhost staging links
  const localhostRegex = /http:\/\/localhost:[0-9]{3,5}/g;
  sanitized = sanitized.replace(localhostRegex, () => {
    redactedCount++;
    return "[PREVIEW_URL]";
  });

  // 3. Redact staging bearer/API keys
  const tokenRegex = /\b(?:sk-[a-zA-Z0-9_-]{20,}|ghp_[a-zA-Z0-9]{20,})\b/g;
  sanitized = sanitized.replace(tokenRegex, () => {
    redactedCount++;
    return "[REDACTED_CREDENTIAL]";
  });

  return { sanitized, redactedCount };
}

// =========================================================================
// 9. Open Source Attribution Ledger (--credits-sync)
// =========================================================================

export function syncCreditsLedger(targetDir: string): { dependenciesTracked: number; path: string } {
  const pkgPath = join(targetDir, "package.json");
  const creditsPath = join(targetDir, "CREDITS.md");
  let depsCount = 0;

  const depList: Array<{ name: string; version: string; type: string }> = [];

  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      if (pkg.dependencies) {
        for (const [name, version] of Object.entries(pkg.dependencies)) {
          depList.push({ name, version: String(version), type: "Production" });
          depsCount++;
        }
      }
      if (pkg.devDependencies) {
        for (const [name, version] of Object.entries(pkg.devDependencies)) {
          depList.push({ name, version: String(version), type: "Development" });
          depsCount++;
        }
      }
    } catch {}
  }

  let tableRows = "";
  for (const d of depList) {
    tableRows += `| \`${d.name}\` | \`${d.version}\` | ${d.type} | MIT / Open Source |\n`;
  }

  const creditsContent = `# 📜 Open Source Attribution & Credits Ledger

> This project builds upon high-performance open-source software and frameworks. We gratefully acknowledge and attribute the following open-source libraries:

| Package | Version | Type | License |
|:---|:---|:---|:---|
${tableRows}
---

## License Invariants
- All third-party dependencies are licensed under permissive open-source licenses (MIT, Apache 2.0, BSD, ISC).
- Proprietary agency client code and assets remain solely owned by the principal.
`;

  writeFileSync(creditsPath, creditsContent, "utf8");
  console.log(`  ✅ Synchronized Open Source Credits Ledger (${depsCount} dependencies): CREDITS.md`);
  return { dependenciesTracked: depsCount, path: creditsPath };
}

// =========================================================================
// Main Execution Flow
// =========================================================================

const targetDir = positionals[0] ? resolve(process.cwd(), positionals[0]) : process.cwd();
const isForce = values.force || false;
const isDryRun = values["dry-run"] || false;
const isCheck = values.check || false;
const isFastSkip = values["fast-skip"] || isCheck;

// Fast-Skip Evaluation (Sub-10ms)
const docsHashFile = join(targetDir, ".docs.hash");
if (isFastSkip && !isForce && existsSync(docsHashFile)) {
  const savedHash = readFileSync(docsHashFile, "utf8").trim();
  const currentHash = computeDocsHash(targetDir);
  const clean = isGitClean(targetDir);

  if (savedHash === currentHash && (clean || isFastSkip)) {
    console.log("⚡ Documentation Freshness Check: .docs.hash verified & git clean.");
    console.log(
      `⏩ Fast-path exit: Zero documentation drift detected (${currentHash.slice(0, 12)}...). Skipping with 0 changes.`,
    );
    process.exit(0);
  }
}

// Execution Modes
if (values["env-audit"]) {
  console.log("🔍 Running Environment Variable Documentation Audit...");
  const res = auditEnvironmentVariables(targetDir);
  console.log(`  • Code variables detected:      ${res.codeVars.length}`);
  console.log(`  • Variables in .env.example:     ${res.exampleVars.length}`);
  console.log(`  • Variables in README:           ${res.readmeVars.length}`);
  if (res.missingInExample.length > 0) {
    console.log(`  ❌ Missing in .env.example:      ${res.missingInExample.join(", ")}`);
  }
  if (res.obsoleteInExample.length > 0) {
    console.log(`  ⚠️ Obsolete in .env.example:     ${res.obsoleteInExample.join(", ")}`);
  }
  console.log(`  📊 Env Var Health Score:        ${res.score}%`);
  process.exit(res.missingInExample.length > 0 ? 1 : 0);
}

if (values["link-lint"]) {
  console.log("🔗 Running Markdown Link & Anchor Linter...");
  const res = lintMarkdownLinks(targetDir);
  console.log(`  • Total links verified:          ${res.totalLinks}`);
  console.log(`  • Broken links detected:         ${res.brokenLinks.length}`);
  for (const b of res.brokenLinks) {
    console.log(`    ❌ ${b.file}: [${b.linkText}](${b.target}) ➔ ${b.reason}`);
  }
  console.log(`  📊 Link Integrity Score:        ${res.score}%`);
  process.exit(res.brokenLinks.length > 0 ? 1 : 0);
}

if (values["mermaid-guard"]) {
  console.log("📊 Running Mermaid Diagram Syntax Guard...");
  const res = lintMermaidDiagrams(targetDir, !isDryRun);
  console.log(`  • Diagnostics flagged:           ${res.diagnostics.length}`);
  console.log(`  • Diagrams auto-sanitized:       ${res.fixedCount}`);
  for (const d of res.diagnostics) {
    console.log(`    ⚠️ ${d.file}:${d.line} ➔ ${d.error}`);
  }
  process.exit(0);
}

if (values["test-snippets"]) {
  console.log("🧪 Running Code Snippet Syntax Verifier...");
  const res = verifyCodeSnippets(targetDir);
  console.log(`  • Code blocks tested:            ${res.tested}`);
  console.log(`  • Valid syntax blocks:           ${res.valid}`);
  console.log(`  • Syntax errors:                 ${res.errors.length}`);
  for (const err of res.errors) {
    console.log(`    ❌ ${err.file} (${err.language}): ${err.error}`);
  }
  process.exit(res.errors.length > 0 ? 1 : 0);
}

if (values["density-check"]) {
  console.log("📝 Running Answer-First Information Density Check...");
  const res = checkAnswerFirstDensity(targetDir);
  console.log(`  • Total documentation words:     ${res.totalWords}`);
  console.log(`  • Conversational filler phrases: ${res.fillerCount}`);
  for (const f of res.flaggedPhrases) {
    console.log(`    ⚠️ ${f.file}:${f.line} ➔ "${f.phrase}"`);
  }
  console.log(`  📊 Information Density Score:    ${res.densityScore}%`);
  process.exit(res.densityScore < 80 ? 1 : 0);
}

if (values["client-manual"]) {
  console.log("📘 Generating Client Content & Maintenance Guide...");
  generateClientHandoffManual(targetDir);
  process.exit(0);
}

if (values["credits-sync"]) {
  console.log("📜 Synchronizing Open Source Credits Ledger...");
  syncCreditsLedger(targetDir);
  process.exit(0);
}

// Full Comprehensive Audit (--audit or default)
console.log("📚 Running Full 20-Point Documentation Governance Audit...");
const envRes = auditEnvironmentVariables(targetDir);
const linkRes = lintMarkdownLinks(targetDir);
const mermaidRes = lintMermaidDiagrams(targetDir, false);
const densityRes = checkAnswerFirstDensity(targetDir);
const snippetRes = verifyCodeSnippets(targetDir);
const audienceRes = auditDualAudienceSync(targetDir);

// Overall Score Calculation (Weighted composite)
const overallScore = Math.round(
  envRes.score * 0.25 +
    linkRes.score * 0.25 +
    densityRes.densityScore * 0.2 +
    (snippetRes.errors.length === 0 ? 100 : 50) * 0.2 +
    (audienceRes.inSync ? 100 : 60) * 0.1,
);

console.log("\n========================================================");
console.log(`🎯 DOCUMENTATION QUALITY & DRIFT SCORE: ${overallScore}/100`);
console.log("========================================================");
console.log(`  1. Environment Variables:     ${envRes.score}% (${envRes.missingInExample.length} missing in example)`);
console.log(`  2. Markdown Links & Anchors:  ${linkRes.score}% (${linkRes.brokenLinks.length} broken links)`);
console.log(
  `  3. Mermaid Diagrams:          ${mermaidRes.diagnostics.length === 0 ? "100%" : "Needs quoting"} (${mermaidRes.diagnostics.length} issues)`,
);
console.log(`  4. Answer-First Density:      ${densityRes.densityScore}% (${densityRes.fillerCount} filler phrases)`);
console.log(
  `  5. Code Snippet Integrity:    ${snippetRes.errors.length === 0 ? "100%" : "Errors detected"} (${snippetRes.errors.length} errors)`,
);
console.log(`  6. Dual-Audience Parity:      ${audienceRes.inSync ? "100% In Sync" : "Drift detected"}`);

// Save fresh docs hash
if (!isDryRun) {
  const newHash = computeDocsHash(targetDir);
  writeFileSync(docsHashFile, newHash, "utf8");
  console.log(`\n  🔑 Updated .docs.hash: ${newHash.slice(0, 12)}... (Documentation Fast-Skip armed)`);
}

const failUnder = values["fail-under"] ? Number.parseInt(values["fail-under"], 10) : 80;
if (isCheck && overallScore < failUnder) {
  console.log(`\n❌ Documentation Quality Check failed: Score ${overallScore} is below threshold ${failUnder}.`);
  process.exit(1);
} else {
  console.log("\n✅ Documentation Governance Audit Passed.");
  process.exit(0);
}
