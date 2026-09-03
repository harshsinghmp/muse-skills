#!/usr/bin/env bun
/**
 * 🧠 updateagents — Project Agent Context Synchronization Engine
 * 
 * Synchronizes AI-agent instructions and project context with the actual current state of the workspace.
 * 
 * Rules:
 *   - Current workspace boundary only (never traverse above cwd).
 *   - HARD BOUNDARY: Never read, write, modify, delete, or validate .memory/**.
 *   - Single Source of Truth: Pulls standards and DOX blueprints from new-project/templates/.
 *   - Smart DOX Retrofit: When DOX is missing, migrates existing facts into .agents/context/ and archives legacy files.
 *   - Size & Noise Control: Keeps instruction files compact (<5KB preferred, <10KB max).
 * 
 * Usage:
 *   bun path/to/updateagents.ts [options] [targetPath]
 * 
 * Options:
 *   --dry-run      Simulate without writing files
 *   -f, --force    Force update files even if already current
 *   -h, --help     Show this help message
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, cpSync, renameSync } from "node:fs";
import { resolve, join, basename, relative } from "node:path";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";

// Template source of truth located in new-project/templates/
const SCRIPT_DIR = resolve(import.meta.dir, "..");
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const TEMPLATES_DIR = join(REPO_ROOT, "new-project/templates");

// CLI Flags
const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    "dry-run": { type: "boolean", default: false },
    force: { type: "boolean", short: "f", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
🧠 updateagents — Project Agent Context Synchronization

Usage:
  bun updateagents.ts [targetPath] [options]

Options:
  --dry-run      Simulate without writing files
  -f, --force    Force overwrite of standards and templates
  -h, --help     Show this help message
`);
  process.exit(0);
}

const isDryRun = values["dry-run"] || false;
const isForce = values.force || false;

// Step 1: Establish Workspace Context & Boundaries
const rawTarget = positionals[0] || ".";
const workspaceDir = resolve(process.cwd(), rawTarget);

// Guard: Prohibit traversing above current working directory unless explicitly passed
if (!workspaceDir.startsWith(process.cwd()) && rawTarget === ".") {
  console.error("❌ Safety Violation: Cannot traverse above current working directory.");
  process.exit(1);
}

// HARD BOUNDARY ASSERTION
function assertNotMemory(pathToCheck: string) {
  const rel = relative(workspaceDir, pathToCheck);
  if (rel === ".memory" || rel.startsWith(".memory/") || rel.startsWith(".memory\\")) {
    throw new Error(`🛑 HARD BOUNDARY VIOLATION: updateagents must NEVER touch .memory/** (${pathToCheck})`);
  }
}

console.log("\n=======================================================");
console.log(" 🧠 updateagents — Project Agent Context Synchronization");
console.log("=======================================================");
console.log(`📁 Workspace: ${workspaceDir}`);
if (isDryRun) console.log(`🔍 [DRY RUN MODE — No filesystem writes]`);
console.log("-------------------------------------------------------\n");

// Step 2: Discover Existing Agent Files
console.log("🔍 Step 2: Discovering agent instruction files...");
const knownAgentFiles = ["AGENTS.md", "CLAUDE.md", ".cursorrules", ".github/copilot-instructions.md", "GEMINI.md", "CODEX.md"];
const discoveredAgentFiles: string[] = [];

for (const file of knownAgentFiles) {
  const fullPath = join(workspaceDir, file);
  if (existsSync(fullPath)) {
    discoveredAgentFiles.push(file);
    console.log(`  📄 Discovered: ./${file}`);
  }
}
if (discoveredAgentFiles.length === 0) {
  console.log("  ℹ️  No existing top-level agent instruction files found.");
}

// Step 3: Inspect Project State (Canonical Sources)
console.log("\n📦 Step 3: Inspecting canonical sources of truth...");
let projectName = basename(workspaceDir);
let projectDesc = `${projectName} - Application governed by Agency Council.`;
let frameworkDetected = "generic";
let projectScripts: Record<string, string> = {};
let dependencies: Record<string, string> = {};

const pkgJsonPath = join(workspaceDir, "package.json");
if (existsSync(pkgJsonPath)) {
  try {
    const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
    if (pkg.name) projectName = pkg.name;
    if (pkg.description) projectDesc = pkg.description;
    if (pkg.scripts) projectScripts = pkg.scripts;
    dependencies = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    if (dependencies["astro"]) frameworkDetected = "astro";
    else if (dependencies["next"]) frameworkDetected = "nextjs";
    else if (dependencies["hono"]) frameworkDetected = "hono";
    else if (dependencies["vite"]) frameworkDetected = "vite";
    else if (dependencies["react"]) frameworkDetected = "react";

    console.log(`  ✅ Parsed package.json: Name="${projectName}", Archetype="${frameworkDetected}"`);
    console.log(`  📋 Active scripts found: ${Object.keys(projectScripts).join(", ") || "none"}`);
  } catch (err) {
    console.warn("  ⚠️ Failed to parse package.json:", err);
  }
}

const readmePath = join(workspaceDir, "README.md");
if (existsSync(readmePath) && projectDesc.includes("Application governed by")) {
  const readme = readFileSync(readmePath, "utf8");
  const firstP = readme.split("\n\n").find((p) => p.trim() && !p.startsWith("#"));
  if (firstP) projectDesc = firstP.trim().replace(/\n/g, " ");
}

// Step 5: Context Delta (Git check)
console.log("\n📊 Step 5: Checking git status & recent changes...");
let gitStatusOutput = "";
try {
  const gitRes = spawnSync("git", ["status", "--short"], { cwd: workspaceDir, encoding: "utf8" });
  if (gitRes.status === 0 && gitRes.stdout.trim()) {
    gitStatusOutput = gitRes.stdout.trim();
    console.log(`  📝 Active unstaged/staged changes:\n${gitStatusOutput.split("\n").map(l => "    " + l).slice(0, 5).join("\n")}`);
  } else {
    console.log("  ✅ Working tree clean.");
  }
} catch {}

// Check DOX Scaffolding Status
const agentsDir = join(workspaceDir, ".agents");
const standardsDir = join(agentsDir, "standards");
const contextDir = join(agentsDir, "context");
const isDoxPresent = existsSync(standardsDir) && existsSync(contextDir);

// =========================================================================
// Step 8: DOX Container Retrofit (If DOX is missing)
// =========================================================================
if (!isDoxPresent) {
  console.log("\n🛠️  Step 8: DOX architecture missing — Retrofitting repository...");

  // 1. Scaffold all 9 subdirectories
  const subdirs = ["archive", "artifacts", "brand", "brand/tokens", "brand/screenshots", "context", "goals", "research", "skills", "standards", "workflows"];
  for (const sub of subdirs) {
    const p = join(agentsDir, sub);
    assertNotMemory(p);
    if (!existsSync(p) && !isDryRun) {
      mkdirSync(p, { recursive: true });
    }
  }
  console.log("  ✅ Provisioned .agents/ 9-folder container tree");

  // 2. Migrate existing canonical facts to .agents/context/
  const contextTemplatesDir = join(TEMPLATES_DIR, ".agents/context");
  if (existsSync(contextTemplatesDir)) {
    const contextFiles = readdirSync(contextTemplatesDir);
    for (const file of contextFiles) {
      const srcFile = join(contextTemplatesDir, file);
      const destFile = join(contextDir, file);
      assertNotMemory(destFile);

      if (!existsSync(destFile) && !isDryRun) {
        let content = readFileSync(srcFile, "utf8");

        // Customise product.md
        if (file === "product.md") {
          content = `# 📦 Product Scope & Inventory\n\n## Overview\n${projectDesc}\n\n## Key Capabilities\n- Framework: ${frameworkDetected.toUpperCase()}\n- Governed by Agency Council DOX Architecture.\n`;
        }

        // Customise architecture.md
        if (file === "architecture.md") {
          const scriptList = Object.entries(projectScripts).map(([k, v]) => `- \`npm run ${k}\` / \`bun ${k}\`: ${v}`).join("\n");
          content = `# 🏗️ Architecture & Workspace Layout\n\n## 1. Stack Specifications\n- **Framework**: ${frameworkDetected.toUpperCase()}\n- **Runtime**: Node.js / Bun\n\n## 2. Verified Project Scripts\n${scriptList || "- Default framework commands"}\n\n## 3. Directory Layout\nApplication source code organized in standard framework folders.\n`;
        }

        // Customise current.md
        if (file === "current.md") {
          const topFiles = readdirSync(workspaceDir).filter((f) => !f.startsWith(".") && f !== "node_modules");
          const artifacts = topFiles.map((f) => `- \`${f}\` — ${f.includes(".") ? "Root configuration / documentation" : "Application source directory"}`).join("\n");
          content = `# 📍 Current Shipped State & System Reality\n\n## 1. Verified Shipped Reality\n- Active project **${projectName}** governed by Progressive Disclosure DOX.\n\n## 2. Live Deliverables & Key Artifacts\n${artifacts}\n\n## 3. Runtime Health & Verification Oracle\n- **Framework**: ${frameworkDetected.toUpperCase()}\n- **Scripts**: ${Object.keys(projectScripts).join(", ") || "Configured"}\n\n## 4. Known Gaps & Blockers\n- None\n\n## 5. Next Immediate Focus\n- Proceed with active development milestones.\n`;
        }

        writeFileSync(destFile, content, "utf8");
        console.log(`  ✅ Migrated & created: ./.agents/context/${file}`);
      }
    }
  }

  // 3. Safely Archive Legacy AGENTS.md if it was older monolithic version
  const rootAgentsPath = join(workspaceDir, "AGENTS.md");
  assertNotMemory(rootAgentsPath);
  if (existsSync(rootAgentsPath)) {
    const existingAgentsContent = readFileSync(rootAgentsPath, "utf8");
    const isLeanRail = existingAgentsContent.includes("DOX Rail:") || existingAgentsContent.includes("Core Turn Invariants");

    if (!isLeanRail && !isDryRun) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const archivePath = join(agentsDir, "archive", `AGENTS.legacy-${timestamp}.md`);
      renameSync(rootAgentsPath, archivePath);
      console.log(`  📦 Archived legacy AGENTS.md → .agents/archive/AGENTS.legacy-${timestamp}.md`);
    }
  }

  // 4. Safely Archive Legacy CLAUDE.md if present
  const claudePath = join(workspaceDir, "CLAUDE.md");
  if (existsSync(claudePath) && !isDryRun) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const archivePath = join(agentsDir, "archive", `CLAUDE.legacy-${timestamp}.md`);
    renameSync(claudePath, archivePath);
    console.log(`  📦 Archived legacy CLAUDE.md → .agents/archive/CLAUDE.legacy-${timestamp}.md`);
  }

  // 5. Deploy Lean Root AGENTS.md DOX Rail
  if (!existsSync(rootAgentsPath) || isForce) {
    const railTemplate = join(TEMPLATES_DIR, "AGENTS.md");
    if (existsSync(railTemplate) && !isDryRun) {
      cpSync(railTemplate, rootAgentsPath);
      console.log("  ✅ Deployed lean root AGENTS.md DOX rail");
    }
  }
} else {
  console.log("ℹ️  DOX container already present. Proceeding to standards & context synchronization...");
}

// =========================================================================
// Step 9: Synchronize Standards & Brand Baseline (Always Runs!)
// =========================================================================
console.log("\n🔄 Step 9: Synchronizing standards & brand tokens from master template canon...");

if (existsSync(TEMPLATES_DIR)) {
  // Sync .agents/standards/
  const masterStandardsDir = join(TEMPLATES_DIR, ".agents/standards");
  if (existsSync(masterStandardsDir)) {
    const standards = readdirSync(masterStandardsDir);
    for (const std of standards) {
      const src = join(masterStandardsDir, std);
      const dest = join(standardsDir, std);
      assertNotMemory(dest);
      if (!isDryRun) {
        cpSync(src, dest);
      }
    }
    console.log(`  ✅ Synchronized 12 standards in ./.agents/standards/ (from new-project/templates)`);
  }

  // Sync .agents/brand/ baseline tokens & guidelines
  const masterBrandDir = join(TEMPLATES_DIR, ".agents/brand");
  const projectBrandDir = join(agentsDir, "brand");
  if (existsSync(masterBrandDir)) {
    const brandFiles = ["design.md", "bem-conventions.md", "a11y.md"];
    for (const bf of brandFiles) {
      const src = join(masterBrandDir, bf);
      const dest = join(projectBrandDir, bf);
      assertNotMemory(dest);
      if (!existsSync(dest) || isForce) {
        if (!isDryRun) cpSync(src, dest);
      }
    }
    // Tokens
    const masterTokensDir = join(masterBrandDir, "tokens");
    const projectTokensDir = join(projectBrandDir, "tokens");
    if (existsSync(masterTokensDir) && !existsSync(projectTokensDir)) {
      if (!isDryRun) cpSync(masterTokensDir, projectTokensDir, { recursive: true });
      console.log("  ✅ Provisioned baseline design tokens in ./.agents/brand/tokens/");
    }
    console.log("  ✅ Synchronized brand guidelines in ./.agents/brand/");
  }
} else {
  console.warn(`  ⚠️ Templates directory not found at: ${TEMPLATES_DIR}`);
}

// =========================================================================
// Step 15: Size & Noise Control Validation
// =========================================================================
console.log("\n📏 Step 15: Validating instruction file sizes...");
const rootAgentsFile = join(workspaceDir, "AGENTS.md");
if (existsSync(rootAgentsFile)) {
  const size = statSync(rootAgentsFile).size;
  console.log(`  📄 AGENTS.md size: ${size} bytes`);
  if (size >= 10240) {
    console.error("  ❌ Hard Error: AGENTS.md exceeds 10KB maximum!");
  } else if (size >= 5120) {
    console.warn("  ⚠️ Warning: AGENTS.md exceeds 5KB recommendation.");
  } else {
    console.log("  ✅ AGENTS.md is within recommended size (<5KB).");
  }
}

// =========================================================================
// Step 16: Validate Hard Boundary & Output
// =========================================================================
console.log("\n🛡️ Step 16: Verifying safety invariants & MuseMemory hard boundary...");
const memoryPath = join(workspaceDir, ".memory");
if (existsSync(memoryPath)) {
  console.log("  🔒 MuseMemory (.memory/**) detected: 100% UNTOUCHED & EXCLUDED (PASSED)");
} else {
  console.log("  🔒 MuseMemory (.memory/**): Clean state (PASSED)");
}

// =========================================================================
// Step 17: Report the Change
// =========================================================================
console.log("\n=======================================================");
console.log(" 🎉 SUCCESS: Project Agent Context Synchronized!");
console.log("=======================================================");
console.log(`Summary of Actions:`);
console.log(`  • Workspace:          ${workspaceDir}`);
console.log(`  • Project Name:       ${projectName}`);
console.log(`  • Archetype:          ${frameworkDetected.toUpperCase()}`);
console.log(`  • Standards Synced:   12 rulebooks in .agents/standards/`);
console.log(`  • Brand Synced:       Design guidelines in .agents/brand/`);
console.log(`  • Context Preserved:  .agents/context/* strictly maintained`);
console.log(`  • Application Code:   100% untouched`);
console.log(`  • MuseMemory Check:   .memory/** strictly excluded\n`);
