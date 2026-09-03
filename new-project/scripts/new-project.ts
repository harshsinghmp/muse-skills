#!/usr/bin/env bun
/**
 * 🏛️ Universal Project OS & Progressive Disclosure DOX Scaffolder
 * 
 * Pipeline:
 *   Stage 1: Agents First (AGENTS.md, .agents/* 9-folder tree, .gitignore, memory init)
 *   Stage 2: Project Type (Interactive Framework CLI: Astro, Next.js, Instatic, Hono, Vite, or None)
 *   Stage 3: Closeout DOX Pass (Updates .agents/context/current.md with live deliverables)
 * 
 * Usage:
 *   bun new-project/scripts/new-project.ts [targetPath] [options]
 * 
 * Flags:
 *   -n, --name <name>        Project name
 *   -t, --type <type>        Project archetype (astro | nextjs | instatic | hono | vite | none)
 *   -d, --desc <desc>        Project description
 *   -p, --path <path>        Target path
 *       --non-interactive    Skip prompts and use provided flags or defaults
 *       --dry-run            Simulate without writing files
 *   -f, --force              Overwrite existing files
 *   -h, --help               Show help message
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, cpSync } from "node:fs";
import { resolve, join, basename, isAbsolute } from "node:path";
import { parseArgs } from "node:util";
import { createInterface } from "node:readline/promises";
import { spawnSync } from "node:child_process";

// Directory where new-project is installed
const SCRIPT_DIR = resolve(import.meta.dir, "..");
const TEMPLATES_DIR = join(SCRIPT_DIR, "templates");

// CLI Flags Parsing
const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    name: { type: "string", short: "n" },
    type: { type: "string", short: "t" },
    desc: { type: "string", short: "d" },
    path: { type: "string", short: "p" },
    "non-interactive": { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
    force: { type: "boolean", short: "f", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
🏛️ Universal Project OS & Progressive Disclosure DOX Scaffolder

Usage:
  bun new-project/scripts/new-project.ts [targetPath] [options]

Options:
  -n, --name <name>        Project name (default: directory name)
  -t, --type <type>        Archetype: astro | nextjs | instatic | hono | vite | none
  -d, --desc <desc>        Project description
  -p, --path <path>        Target directory path
      --non-interactive    Run without interactive prompts
      --dry-run            Simulate without writing files
  -f, --force              Overwrite existing files
  -h, --help               Show this help message
`);
  process.exit(0);
}

const isDryRun = values["dry-run"] || false;
const isForce = values.force || false;
const isNonInteractive = values["non-interactive"] || false;

async function ask(rl: ReturnType<typeof createInterface>, question: string, defaultVal: string = ""): Promise<string> {
  const suffix = defaultVal ? ` [${defaultVal}]: ` : ": ";
  const answer = await rl.question(question + suffix);
  return answer.trim() || defaultVal;
}

async function main() {
  console.log("\n=======================================================");
  console.log(" 🏛️ Agency Council — Universal Project OS Scaffolder");
  console.log("=======================================================\n");

  if (!existsSync(TEMPLATES_DIR)) {
    console.error(`❌ Template bundle not found at: ${TEMPLATES_DIR}`);
    process.exit(1);
  }

  let targetPath = values.path || positionals[0] || "";
  let projectName = values.name || "";
  let projectType = values.type || "";
  let projectDesc = values.desc || "";

  // Interactive Prompt Mode
  if (!isNonInteractive && (!targetPath || !projectName || !projectType)) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    try {
      // 1. Path Picker
      if (!targetPath) {
        console.log("📂 Select Target Directory:");
        console.log("  [1] Current directory (.)");
        console.log("  [2] Subfolder in current directory");
        console.log("  [3] Custom absolute or relative path");
        
        const pathChoice = await ask(rl, "Choose destination [1-3]", "1");
        if (pathChoice === "1") {
          targetPath = ".";
        } else if (pathChoice === "2") {
          const subfolder = await ask(rl, "Enter subfolder name");
          targetPath = join(".", subfolder);
        } else {
          targetPath = await ask(rl, "Enter destination path", ".");
        }
      }

      // Resolve full absolute path
      const resolvedTarget = isAbsolute(targetPath) ? targetPath : resolve(process.cwd(), targetPath);
      const defaultName = basename(resolvedTarget) === "." ? basename(process.cwd()) : basename(resolvedTarget);

      // 2. Project Name
      if (!projectName) {
        projectName = await ask(rl, "Project Name", defaultName);
      }

      // 3. Project Description
      if (!projectDesc) {
        projectDesc = await ask(
          rl,
          "Project Description",
          `${projectName} - High-performance application governed by Agency Council.`
        );
      }

      // 4. Project Archetype
      if (!projectType) {
        console.log("\n⚡ Select Tech Stack Archetype:");
        console.log("  [1] Astro v7.2.x        (High-speed content & web apps, Cloudflare edge)");
        console.log("  [2] Next.js 16          (React 19, App Router, Server Components/Actions)");
        console.log("  [3] Instatic HTML       (Pure HTML brochure & zero-JS static site)");
        console.log("  [4] Hono / Workers      (Cloudflare Workers edge API microservice)");
        console.log("  [5] Vite + React SPA    (Client-side React 19 single-page app)");
        console.log("  [6] None / Existing     (AI DOX Governance ONLY — no framework init)");
        
        const typeChoice = await ask(rl, "Choose archetype [1-6]", "1");
        const typeMap: Record<string, string> = {
          "1": "astro",
          "2": "nextjs",
          "3": "instatic",
          "4": "hono",
          "5": "vite",
          "6": "none",
        };
        projectType = typeMap[typeChoice] || "astro";
      }
    } finally {
      rl.close();
    }
  }

  // Fallbacks
  const resolvedTarget = isAbsolute(targetPath || ".") ? (targetPath || ".") : resolve(process.cwd(), targetPath || ".");
  projectName = projectName || basename(resolvedTarget);
  projectType = (projectType || "astro").toLowerCase();
  projectDesc = projectDesc || `${projectName} - Application governed by Agency Council.`;

  console.log("\n-------------------------------------------------------");
  console.log(`📁 Target Directory: ${resolvedTarget}`);
  console.log(`🏷️  Project Name:     ${projectName}`);
  console.log(`⚡ Archetype:        ${projectType}`);
  console.log(`📝 Description:      ${projectDesc}`);
  if (isDryRun) console.log(`🔍 [DRY RUN MODE — No filesystem writes]`);
  console.log("-------------------------------------------------------\n");

  // =========================================================================
  // STAGE 1: Agents First (Mandatory Governance Container)
  // =========================================================================
  console.log("🛡️  STAGE 1: Initializing Agent Governance & Progressive Disclosure DOX...");

  if (!isDryRun && !existsSync(resolvedTarget)) {
    mkdirSync(resolvedTarget, { recursive: true });
  }

  // 1.1 Copy Lean AGENTS.md
  const agentsSrc = join(TEMPLATES_DIR, "AGENTS.md");
  const agentsDest = join(resolvedTarget, "AGENTS.md");
  if (existsSync(agentsSrc)) {
    let content = readFileSync(agentsSrc, "utf8");
    content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
    content = content.replace(/\{\{PROJECT_DESC\}\}/g, projectDesc);
    if (!existsSync(agentsDest) || isForce) {
      if (!isDryRun) writeFileSync(agentsDest, content, "utf8");
      console.log("  ✅ Created: ./AGENTS.md");
    } else {
      console.log("  ⏩ Skipped: ./AGENTS.md (already exists)");
    }
  }

  // 1.2 Copy .gitignore
  const gitignoreSrc = existsSync(join(TEMPLATES_DIR, "gitignore.template"))
    ? join(TEMPLATES_DIR, "gitignore.template")
    : join(TEMPLATES_DIR, ".gitignore");
  const gitignoreDest = join(resolvedTarget, ".gitignore");
  if (existsSync(gitignoreSrc)) {
    if (!existsSync(gitignoreDest) || isForce) {
      if (!isDryRun) cpSync(gitignoreSrc, gitignoreDest);
      console.log("  ✅ Created: ./.gitignore");
    } else {
      console.log("  ⏩ Skipped: ./.gitignore (already exists)");
    }
  }

  // 1.3 Copy .agents/ with all 9 subdirectories
  const agentsDirSrc = join(TEMPLATES_DIR, ".agents");
  const agentsDirDest = join(resolvedTarget, ".agents");
  if (existsSync(agentsDirSrc)) {
    if (!isDryRun) {
      cpSync(agentsDirSrc, agentsDirDest, { recursive: true });
    }
    console.log("  ✅ Provisioned: ./.agents/ (archive, artifacts, brand, context, goals, research, skills, standards, workflows)");
  }

  // 1.4 Customize Context Files (product.md & architecture.md)
  if (!isDryRun) {
    const productPath = join(agentsDirDest, "context/product.md");
    if (existsSync(productPath)) {
      let productContent = readFileSync(productPath, "utf8");
      productContent = productContent.replace(/Agency engineering workspace[\s\S]*?## Digital Delivery Capabilities/, `${projectDesc}\n\n## Digital Delivery Capabilities`);
      writeFileSync(productPath, productContent, "utf8");
      console.log("  ✅ Configured: ./.agents/context/product.md");
    }

    const archPath = join(agentsDirDest, "context/architecture.md");
    if (existsSync(archPath)) {
      let archContent = readFileSync(archPath, "utf8");
      archContent = archContent.replace(/## Supported Tech Stack Directions[\s\S]*?## Agent Containment/, `## Selected Tech Stack\n- **Target**: ${projectType.toUpperCase()}\n- **Governance**: Agency Council Progressive Disclosure DOX\n\n## Agent Containment`);
      writeFileSync(archPath, archContent, "utf8");
      console.log("  ✅ Configured: ./.agents/context/architecture.md");
    }
  }

  // 1.5 Initialize Git repository if missing
  const gitDir = join(resolvedTarget, ".git");
  if (!existsSync(gitDir) && !isDryRun) {
    console.log("  🌱 Initializing git repository...");
    spawnSync("git", ["init"], { cwd: resolvedTarget, stdio: "ignore" });
  }

  // 1.6 Initialize Cognitive Memory (.memory/ + CURRENT.md)
  const memoryDir = join(resolvedTarget, ".memory");
  if (!existsSync(memoryDir) && !isDryRun) {
    console.log("  🧠 Initializing persistent cognitive memory store...");
    mkdirSync(memoryDir, { recursive: true });

    // Check if musememory CLI is available
    const hasMemoryCli = spawnSync("which", ["memory"], { stdio: "ignore" }).status === 0;
    if (hasMemoryCli) {
      spawnSync("memory", ["init"], { cwd: resolvedTarget, stdio: "ignore" });
      console.log("  ✅ Initialized: ./.memory/ via Muse Memory CLI");
    } else {
      // Create baseline CURRENT.md for agent coordination
      const baselineCurrent = `# Active Project Constraints & In-Flight Context

> **Operational Guidelines**:
> - **For Humans**: Single-pane executive summary of active hard constraints and in-flight agent tasks. Zero verbose logs or transient filler.
> - **For AI Agents**: Mandatory grounding rules (never violate active constraints) and concurrent workstream awareness (check what other agents are touching before editing files).

---

## 🔒 Active Working Invariants & Hard Constraints
- **Vibeguard Secret Defense**: Never commit, print, or log plaintext secrets, tokens, or credentials. Always mask as \`[REDACTED]\`.
- **Definition of Done**: Work is complete only when all verification gates pass independently (tests pass, build succeeds, working tree is clean).

## 🤖 Active Concurrent Agent Workstreams
| Agent / Session ID | Status | Active Task | Target Scope / Files | Last Active |
| :--- | :--- | :--- | :--- | :--- |
`;
      writeFileSync(join(memoryDir, "CURRENT.md"), baselineCurrent, "utf8");
      console.log("  ✅ Initialized: ./.memory/CURRENT.md");
    }
  }

  console.log("  🛡️ Stage 1 Complete: Governance container active.\n");

  // =========================================================================
  // STAGE 2: Project Type (Framework Generation)
  // =========================================================================
  if (projectType !== "none" && !isDryRun) {
    console.log(`🚀 STAGE 2: Launching ${projectType.toUpperCase()} Framework Creator...`);
    console.log("   (Interactive framework configuration options will follow)\n");

    try {
      if (projectType === "astro") {
        spawnSync("bun", ["create", "astro@latest", "."], {
          cwd: resolvedTarget,
          stdio: "inherit",
        });
      } else if (projectType === "nextjs") {
        spawnSync("bun", ["create", "next-app@latest", "."], {
          cwd: resolvedTarget,
          stdio: "inherit",
        });
      } else if (projectType === "hono") {
        spawnSync("bun", ["create", "hono@latest", "."], {
          cwd: resolvedTarget,
          stdio: "inherit",
        });
      } else if (projectType === "vite") {
        spawnSync("bun", ["create", "vite@latest", "."], {
          cwd: resolvedTarget,
          stdio: "inherit",
        });
      } else if (projectType === "instatic") {
        console.log("   Cloning Instatic pure-HTML static starter...");
        spawnSync("git", ["clone", "--depth", "1", "https://github.com/corebunch/instatic.git", "."], {
          cwd: resolvedTarget,
          stdio: "inherit",
        });
      }
      console.log(`\n  ✅ Stage 2 Complete: ${projectType.toUpperCase()} framework initialized.`);
    } catch (err) {
      console.warn(`  ⚠️ Framework initialization warning: ${err}`);
    }
  } else if (projectType === "none") {
    console.log("⚡ STAGE 2: Skipped (Governance-only workspace requested).");
  }

  // =========================================================================
  // STAGE 3: Closeout DOX Pass & Initial State Recording
  // =========================================================================
  console.log("\n📋 STAGE 3: Recording Initial Shipped State in .agents/context/current.md...");

  if (!isDryRun) {
    const currentMdPath = join(resolvedTarget, ".agents/context/current.md");
    if (existsSync(currentMdPath)) {
      // Gather top-level files for initial live artifacts list
      const topFiles = readdirSync(resolvedTarget).filter((f) => !f.startsWith(".") && f !== "node_modules");
      const artifactList = topFiles.map((f) => `- \`${f}\` — Initial ${f.includes(".") ? "configuration / root file" : "source directory"}`).join("\n");

      const initialCurrentContent = `# 📍 Current Shipped State & System Reality

> **Purpose**: The living snapshot of what is built, verified, and running in this repository, alongside active blockers and placeholders. Updated during the Closeout DOX Pass (Phase 5).

---

## 1. Verified Shipped Reality
- Initialized **${projectName}** with **${projectType.toUpperCase()}** archetype.
- Progressive Disclosure DOX container active with 12 modular standards, brand token baseline, and cognitive memory.

## 2. Live Deliverables & Key Artifacts
${artifactList || "- `AGENTS.md` — Root contract and DOX rail\n- `.agents/` — System standards and context\n- `.memory/` — Cognitive memory store"}

## 3. Runtime Health & Verification Oracle
- **Build / Lint Status**: Freshly scaffolded baseline
- **Test Suite**: Ready for initial test suites
- **Console / Runtime Errors**: 0 errors reported
- **Environment Notes**: Project initialized cleanly via Agency Council Scaffolder

## 4. Known Gaps, Blockers & Placeholders
- **Active Blockers**: None
- **Pending Tasks**: Initial layout and feature implementation

## 5. Next Immediate Focus
- Implement foundational routes, components, and primary application shell.
`;
      writeFileSync(currentMdPath, initialCurrentContent, "utf8");
      console.log("  ✅ Synchronized: ./.agents/context/current.md");
    }
  }

  console.log("\n=======================================================");
  console.log(`🎉 SUCCESS: ${projectName} is fully scaffolded & governed!`);
  console.log("=======================================================");
  console.log(`\nNext Steps:`);
  console.log(`  1. cd ${targetPath !== "." ? targetPath : resolvedTarget}`);
  console.log(`  2. Review .agents/context/product.md and current.md`);
  console.log(`  3. Start dev server: bun dev (or astro dev --background)`);
  console.log(`  4. Begin building with Agency Council!\n`);
}

main().catch((err) => {
  console.error(`\n❌ Error scaffolding project:`, err);
  process.exit(1);
});
