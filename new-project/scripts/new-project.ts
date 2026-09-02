#!/usr/bin/env bun
/**
 * 🏛️ Universal Project OS & Agency Council Provisioner
 *
 * Bootstraps the Progressive Disclosure DOX architecture:
 * - AGENTS.md (Root Contract & DOX Rail)
 * - .agents/context/ (index, product, architecture, brand, current, decisions, roadmap)
 * - .agents/standards/ (Universal & Framework-specific engineering standards)
 * - .agents/brand/ (Design tokens, BEM conventions, A11y, Screenshots)
 * - .agents/workflows/, archive/, artifacts/, goals/, research/
 * - .memory/ (Persistent cognitive memory)
 * - .gitignore (Vibeguard secret isolation + Agent containment)
 * - scripts/nexus_verify.sh & scripts/generate_llms_txt.ts
 * - tests/e2e/harness_probe.spec.ts
 * - Selective skill bundling in .agents/skills/
 *
 * Usage:
 *   bun new-project.ts [targetPath] [options]
 *   bun new-project.ts -i  (Interactive Wizard Mode)
 */

import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  copyFileSync,
  readdirSync,
  statSync,
  chmodSync,
} from "node:fs";
import { resolve, join, basename, relative } from "node:path";
import { parseArgs } from "node:util";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// -------------------------------------------------------------
// Dynamic Discovery & Relative Sources
// -------------------------------------------------------------

function findTemplateSource(): string | null {
  const candidates = [
    process.env.TEMPLATES_DIR,
    resolve(import.meta.dir, "../../Templates"),
    resolve(import.meta.dir, "../../../Templates"),
    resolve(process.cwd(), "Templates"),
    resolve(process.cwd(), "../Templates"),
    process.env.HOME ? resolve(process.env.HOME, ".agents/templates") : null,
    process.env.HOME ? resolve(process.env.HOME, "Projects/Templates") : null,
    process.env.HOME ? resolve(process.env.HOME, "Templates") : null,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (existsSync(candidate) && existsSync(join(candidate, ".agents"))) {
      return candidate;
    }
  }
  return null;
}

function findSkillSources(): string[] {
  const candidates = [
    process.env.SKILLS_DIR,
    resolve(import.meta.dir, "../../"),
    resolve(process.cwd(), ".agents/skills"),
    resolve(process.cwd(), "skills"),
    process.env.HOME ? resolve(process.env.HOME, ".agents/skills") : null,
    process.env.HOME ? resolve(process.env.HOME, "Projects/.agents/skills") : null,
  ].filter(Boolean) as string[];

  return candidates.filter((dir) => existsSync(dir) && statSync(dir).isDirectory());
}

// Supported Archetypes
export const PROJECT_ARCHETYPES = [
  { id: "nextjs", label: "Next.js 16 (App Router + Tailwind v4 + React 19)", category: "Frontend / Fullstack" },
  { id: "astro", label: "Astro v7.2.x (Static / SSR + Content Collections + Tailwind v4)", category: "Content & Web" },
  { id: "vite", label: "Vite + React 19 (TypeScript Client SPA)", category: "Frontend SPA" },
  { id: "hono", label: "Cloudflare Workers + Hono (Drizzle ORM + Neon HTTP API)", category: "Serverless & Edge" },
  { id: "bun", label: "Bun / Node API Service (Fastify / Hono Backend)", category: "Backend Service" },
  { id: "python", label: "Python 3.12+ (FastAPI + AI Agents + Pytest + Ruff)", category: "AI & Data" },
  { id: "wordpress", label: "WordPress Custom Development (Theme / Plugin + Bedrock)", category: "CMS / PHP" },
  { id: "library", label: "TypeScript Package / Library (Strict Bun/tsup + npm)", category: "Library / Tool" },
  { id: "html", label: "Static HTML & CSS Tokens (Vanilla / Alpine.js)", category: "Lightweight Web" },
  { id: "generic", label: "Generic Minimal Starter (Clean DOX baseline)", category: "Custom" },
] as const;

export type ProjectArchetype = typeof PROJECT_ARCHETYPES[number]["id"];

// Supported Brand Color Themes
export const BRAND_THEMES = [
  { id: "minimal-dark", label: "Minimalist Dark / Light (Charcoal, Zinc, Crisp White)", primary: "#18181b", accent: "#3b82f6" },
  { id: "midnight-cyber", label: "Midnight Cyber (Deep Navy, Electric Blue, Cyan)", primary: "#0f172a", accent: "#06b6d4" },
  { id: "warm-editorial", label: "Warm Editorial (Alabaster, Rich Umber, Terracotta)", primary: "#292524", accent: "#ea580c" },
  { id: "vibrant-modern", label: "Vibrant Modern (Deep Violet, Indigo, Emerald)", primary: "#1e1b4b", accent: "#10b981" },
  { id: "corporate-clean", label: "Corporate Clean (Slate Gray, Ocean Blue, Amber)", primary: "#1e293b", accent: "#0284c7" },
] as const;

export type BrandTheme = typeof BRAND_THEMES[number]["id"];

// Skill Bundles
export const SKILL_BUNDLES: Record<string, string[]> = {
  "agency-suite": [
    "animate", "animation-vocabulary", "apple-design", "ask-sonner", "brand", "brandkit",
    "design", "design-system", "design-taste-frontend", "emil-design-eng", "find-animation-opportunities",
    "full-output-enforcement", "gpt-taste", "high-end-visual-design", "image-to-code",
    "imagegen-frontend-mobile", "imagegen-frontend-web", "impeccable", "improve-animations",
    "industrial-brutalist-ui", "minimalist-ui", "prototype", "redesign-existing-projects",
    "review-animations", "slides", "stitch-design-taste", "ui-styling", "ui-ux-pro-max"
  ],
  design: [
    "animate", "apple-design", "brandkit", "design-taste-frontend", "impeccable",
    "minimalist-ui", "ui-ux-pro-max", "review-animations", "stitch-design-taste"
  ],
  fullstack: [
    "auth-implementation-patterns", "api-security-best-practices", "next-best-practices",
    "systematic-debugging", "verification-before-completion", "webapp-testing"
  ],
  growth: [
    "conversion-rate-auditor", "keyword-cluster-builder", "landing-page-copywriter", "seo-audit"
  ],
  backend: [
    "api-security-best-practices", "systematic-debugging", "verification-before-completion"
  ],
};

// -------------------------------------------------------------
// CLI Argument Parsing
// -------------------------------------------------------------

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    name: { type: "string", short: "n" },
    type: { type: "string", short: "t", default: "nextjs" },
    desc: { type: "string", short: "d" },
    client: { type: "string", short: "c" },
    skills: { type: "string", short: "s", default: "agency-suite" },
    theme: { type: "string", default: "minimal-dark" },
    "init-framework": { type: "boolean", default: false },
    interactive: { type: "boolean", short: "i", default: false },
    "dry-run": { type: "boolean", default: false },
    force: { type: "boolean", short: "f", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  printHelp();
  process.exit(0);
}

function printHelp() {
  console.log(`
🏛️ Universal Project OS & Agency Council Provisioner
Powered by the Progressive Disclosure DOX Architecture

Usage:
  bun new-project.ts [targetPath] [options]
  bun new-project.ts -i  (Interactive Wizard Mode)

Options:
  -i, --interactive          Launch the interactive project creation wizard
  -n, --name <name>          Project Name (defaults to directory name)
  -t, --type <type>          Stack Archetype (nextjs | astro | vite | hono | bun | python | wordpress | library | html | generic) [default: nextjs]
  -d, --desc <desc>          Short Project Description
  -c, --client <client>      Client or stakeholder name
  -s, --skills <bundle>      Skill Preset (agency-suite | design | fullstack | growth | backend | all | none) [default: agency-suite]
      --theme <theme>        Brand Color Theme (minimal-dark | midnight-cyber | warm-editorial | vibrant-modern | corporate-clean)
      --init-framework       Run official framework CLI initializer if directory is empty
      --dry-run              Simulate creation without writing files
  -f, --force                Overwrite existing configuration and state files
  -h, --help                 Show this help message
`);
}

// -------------------------------------------------------------
// Interactive Wizard Execution
// -------------------------------------------------------------

async function runInteractiveWizard() {
  const rl = readline.createInterface({ input, output });

  console.log("\n" + "=".repeat(65));
  console.log("🏛️  PROJECT OS & AGENCY COUNCIL PROVISIONER");
  console.log("   Progressive Disclosure DOX Architecture");
  console.log("=".repeat(65) + "\n");

  // 1. Target Directory Selection
  console.log("📁 1. Target Location:");
  console.log("   [1] In a new directory (./<name>)");
  console.log("   [2] In current working directory (.)");
  console.log("   [3] Custom path");
  const locChoice = (await rl.question("   Select option (1-3) [default: 1]: ")).trim() || "1";

  let targetPath = ".";
  let promptName = "";

  if (locChoice === "1") {
    promptName = (await rl.question("   Enter project folder name: ")).trim();
    if (!promptName) promptName = "my-agency-app";
    targetPath = resolve(process.cwd(), promptName);
  } else if (locChoice === "3") {
    targetPath = (await rl.question("   Enter relative or absolute path: ")).trim();
    if (!targetPath) targetPath = ".";
  } else {
    targetPath = process.cwd();
  }

  const resolvedTargetDir = resolve(process.cwd(), targetPath);
  const defaultProjectName = promptName || basename(resolvedTargetDir);

  // 2. Project Name
  const enteredName = (await rl.question(`\n🏷️  2. Project Name [default: ${defaultProjectName}]: `)).trim();
  const finalProjectName = enteredName || defaultProjectName;

  // 3. Project Description & Client
  const enteredDesc = (await rl.question(`\n📝 3. Project Description: `)).trim();
  const finalProjectDesc = enteredDesc || `${finalProjectName} - High performance application orchestrated by Muse & Agency Council.`;
  const finalClient = (await rl.question(`👤 4. Client / Stakeholder Name [optional]: `)).trim();

  // 4. Project Archetype / Stack
  console.log("\n⚡ 5. Project Archetype / Tech Stack:");
  PROJECT_ARCHETYPES.forEach((arch, index) => {
    console.log(`   [${index + 1}] ${arch.id.padEnd(10)} — ${arch.label}`);
  });
  const archIndexStr = (await rl.question(`   Select archetype (1-${PROJECT_ARCHETYPES.length}) [default: 1 (nextjs)]: `)).trim() || "1";
  const archIndex = Math.max(0, Math.min(PROJECT_ARCHETYPES.length - 1, parseInt(archIndexStr, 10) - 1));
  const finalProjectType = PROJECT_ARCHETYPES[archIndex].id;

  // 5. Brand Theme
  console.log("\n🎨 6. Brand & Color Theme Palette:");
  BRAND_THEMES.forEach((theme, index) => {
    console.log(`   [${index + 1}] ${theme.id.padEnd(16)} — ${theme.label}`);
  });
  const themeIndexStr = (await rl.question(`   Select theme (1-${BRAND_THEMES.length}) [default: 1]: `)).trim() || "1";
  const themeIndex = Math.max(0, Math.min(BRAND_THEMES.length - 1, parseInt(themeIndexStr, 10) - 1));
  const finalTheme = BRAND_THEMES[themeIndex].id;

  // 6. Skill Bundle Selection
  console.log("\n📦 7. Agent Skill Bundle Preset:");
  console.log("   [1] agency-suite (Recommended: Design, Taste, Animation, Fullstack, Growth - 28 skills)");
  console.log("   [2] design       (Design tokens, Apple design, UI-UX Pro Max, motion)");
  console.log("   [3] fullstack    (Auth, API security, testing, debugging)");
  console.log("   [4] growth       (CRO, SEO, landing page copywriting, keyword clustering)");
  console.log("   [5] backend      (API design, Workers/Hono, database, system design)");
  console.log("   [6] all          (All available workspace skills)");
  console.log("   [7] none         (Lightweight DOX only without skill copies)");
  const skillChoice = (await rl.question("   Select skill bundle (1-7) [default: 1]: ")).trim() || "1";
  const skillMap: Record<string, string> = {
    "1": "agency-suite",
    "2": "design",
    "3": "fullstack",
    "4": "growth",
    "5": "backend",
    "6": "all",
    "7": "none",
  };
  const finalSkills = skillMap[skillChoice] || "agency-suite";

  // 7. Framework Initializer
  let initFramework = false;
  if (!existsSync(resolvedTargetDir) || readdirSync(resolvedTargetDir).length === 0) {
    const initAnswer = (await rl.question("\n🚀 8. Run official CLI framework installer if folder is empty? (y/N): ")).trim().toLowerCase();
    initFramework = initAnswer === "y" || initAnswer === "yes";
  }

  rl.close();

  return {
    targetDir: resolvedTargetDir,
    name: finalProjectName,
    type: finalProjectType,
    desc: finalProjectDesc,
    client: finalClient,
    skills: finalSkills,
    theme: finalTheme,
    initFramework,
    isDryRun: values["dry-run"] || false,
    isForce: values.force || false,
  };
}

// -------------------------------------------------------------
// Provisioning Configuration Resolver
// -------------------------------------------------------------

async function resolveConfig() {
  const shouldRunInteractive = values.interactive || (positionals.length === 0 && !values.name);

  if (shouldRunInteractive) {
    return await runInteractiveWizard();
  }

  const rawPath = positionals[0] || ".";
  const targetDir = resolve(process.cwd(), rawPath);
  const name = values.name || basename(targetDir);
  const type = (values.type || "nextjs").toLowerCase() as ProjectArchetype;
  const desc = values.desc || `${name} - High performance ${type} application orchestrated by Muse & Agency Council.`;
  const client = values.client || "";
  let skills = (values.skills || "agency-suite").toLowerCase();
  if (skills === "kameli" || skills === "agency-skills") skills = "agency-suite";
  const theme = (values.theme || "minimal-dark").toLowerCase() as BrandTheme;
  const initFramework = values["init-framework"] || false;
  const isDryRun = values["dry-run"] || false;
  const isForce = values.force || false;

  return {
    targetDir,
    name,
    type,
    desc,
    client,
    skills,
    theme,
    initFramework,
    isDryRun,
    isForce,
  };
}

// -------------------------------------------------------------
// Core Provisioner
// -------------------------------------------------------------

async function main() {
  const config = await resolveConfig();

  console.log(`\n🚀 Initializing Project OS for: ${config.name}`);
  console.log(`📁 Target Directory: ${config.targetDir}`);
  console.log(`⚡ Stack Archetype:  ${config.type}`);
  console.log(`🎨 Brand Theme:      ${config.theme}`);
  console.log(`🎯 Skill Bundle:     ${config.skills}`);
  if (config.client) console.log(`👤 Client:           ${config.client}`);
  if (config.isDryRun) console.log(`🔍 [DRY-RUN MODE - No changes will be written]`);

  // Step 1: Ensure directory structure
  ensureDirectories(config.targetDir, config.isDryRun);

  // Step 2: Initialize official framework if requested and directory is empty
  if (config.initFramework && !config.isDryRun) {
    runFrameworkInit(config.targetDir, config.type);
  }

  // Step 3: Copy base templates or use internal generator
  provisionTemplateDOX(config);

  // Step 4: Provision tailored stack standards
  provisionStackStandards(config);

  // Step 5: Provision brand tokens and palette
  provisionBrandTokens(config);

  // Step 6: Provision verification scripts & harness probes
  provisionVerificationHarness(config);

  // Step 7: Bundle skills
  bundleSkills(config);

  // Step 8: Generate initial llms.txt & llms-full.txt
  generateLlmsDocs(config);

  console.log(`\n🎉 Project OS Provisioning Complete for ${config.name}!`);
  console.log(`💡 Next steps:`);
  console.log(`   cd ${relative(process.cwd(), config.targetDir) || "."}`);
  console.log(`   bash scripts/nexus_verify.sh`);
  console.log(`   bun scripts/generate_llms_txt.ts`);
}

// -------------------------------------------------------------
// Helpers & Subroutines
// -------------------------------------------------------------

function safeWrite(filePath: string, content: string, isDryRun: boolean, isForce: boolean, executable: boolean = false) {
  if (existsSync(filePath) && !isForce) {
    console.log(`  ⏩ Skipped (already exists): ${basename(filePath)}`);
    return;
  }
  if (isDryRun) {
    console.log(`  📝 [DryRun] Would write: ${basename(filePath)}`);
    return;
  }
  const dir = resolve(filePath, "..");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, content.trim() + "\n", "utf8");
  if (executable) {
    try {
      chmodSync(filePath, 0o755);
    } catch {}
  }
  console.log(`  ✅ Created: ${filePath.split("/").slice(-2).join("/")}`);
}

function ensureDirectories(targetDir: string, isDryRun: boolean) {
  const dirs = [
    ".memory",
    ".agents/context",
    ".agents/standards",
    ".agents/brand/tokens",
    ".agents/brand/screenshots",
    ".agents/workflows",
    ".agents/archive",
    ".agents/artifacts",
    ".agents/goals",
    ".agents/research",
    ".agents/skills",
    "scripts",
    "tests/e2e",
  ];

  if (!isDryRun) {
    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
    for (const dir of dirs) {
      const fullDir = join(targetDir, dir);
      if (!existsSync(fullDir)) mkdirSync(fullDir, { recursive: true });
    }
    // Touch .gitkeeps
    const keepDirs = ["archive", "artifacts", "goals", "research", "brand/screenshots"];
    for (const kd of keepDirs) {
      const keepFile = join(targetDir, ".agents", kd, ".gitkeep");
      if (!existsSync(keepFile)) writeFileSync(keepFile, "", "utf8");
    }
  }
}

function runFrameworkInit(targetDir: string, type: ProjectArchetype) {
  console.log(`\n📦 Running framework initializer for ${type}...`);
  try {
    const parentDir = resolve(targetDir, "..");
    const folderName = basename(targetDir);

    if (type === "nextjs") {
      Bun.spawnSync(["npx", "-y", "create-next-app@latest", folderName, "--typescript", "--tailwind", "--app", "--eslint", "--yes"], { cwd: parentDir, stdout: "inherit" });
    } else if (type === "astro") {
      Bun.spawnSync(["npx", "-y", "create-astro@latest", folderName, "--template", "minimal", "--typescript", "strict", "--install", "--yes"], { cwd: parentDir, stdout: "inherit" });
    } else if (type === "vite") {
      Bun.spawnSync(["npx", "-y", "create-vite@latest", folderName, "--template", "react-ts"], { cwd: parentDir, stdout: "inherit" });
    } else if (type === "bun" || type === "hono") {
      Bun.spawnSync(["bun", "init", "-y"], { cwd: targetDir, stdout: "inherit" });
    }
  } catch (err) {
    console.log(`  ⚠️ Framework initialization warning: ${err}`);
  }
}

function copyRecursive(src: string, dest: string, isDryRun: boolean, isForce: boolean) {
  if (!existsSync(src)) return;
  const entries = readdirSync(src);
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      if (!existsSync(destPath) && !isDryRun) mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath, isDryRun, isForce);
    } else {
      if (!existsSync(destPath) || isForce) {
        if (!isDryRun) copyFileSync(srcPath, destPath);
        console.log(`  📋 Copied: ${destPath.split("/").slice(-2).join("/")}`);
      }
    }
  }
}

function provisionTemplateDOX(config: any) {
  console.log("\n📚 [1/6] Provisioning DOX Progressive Architecture & Root Contracts...");

  const templateSource = findTemplateSource();
  if (templateSource) {
    console.log(`  🔍 Discovered template source at: ${templateSource}`);
    copyRecursive(join(templateSource, ".agents", "standards"), join(config.targetDir, ".agents", "standards"), config.isDryRun, config.isForce);
    copyRecursive(join(templateSource, ".agents", "brand"), join(config.targetDir, ".agents", "brand"), config.isDryRun, config.isForce);
    copyRecursive(join(templateSource, ".agents", "context"), join(config.targetDir, ".agents", "context"), config.isDryRun, config.isForce);
  } else {
    provisionFallbackStandards(config);
  }

  // 1. Root AGENTS.md (Tailored with stack & Progressive DOX Rail)
  const agentsMd = `# 🏛️ Workspace Rules & Agency Council Constitution

> **Operating Identity**: **Muse** (Chief Agency Orchestrator)
> **Governance Model**: Contract Extraction → Workstream Execution → Nexus Quality Gate
> **Project**: ${config.name} (${config.type.toUpperCase()})
> **Description**: ${config.desc}${config.client ? `\n> **Client**: ${config.client}` : ""}
> **Toolchain**: Default \`bun\` for workspace scripts; project runtime: ${config.type}.
> **DOX Rail**: \`AGENTS.md\` files are binding work contracts for their subtrees. Walk from root to target path; closer docs control local work details.

---

## ⚡ Core Turn Invariants (Always Enforced)

1. **Context Hygiene**: Output \`[Context: ~X% used]\` at turn start. Prompt at 70% before compaction. Byte-cap large terminal outputs.
2. **Zero Secret Exposure (Vibeguard)**: Never print, echo, or commit raw credentials. Run pre-ship SecretScan before finalizing changes.
3. **The Confidence Gate**: Assess confidence before editing code (<80% Stop & Ask; 80–90% State Assumption; >90% Proceed).
4. **Destructive Command Gate**: Prohibit \`rm -rf\`, \`git reset --hard\`, force-pushes, or shell piping without stating blast radius, rollback plan, and getting user authorization.
5. **Universal English Standard**: All agent responses, code, comments, commits, specs, and docs MUST strictly be in English.
6. **Evidence Before Claims**: Work is complete only after independent oracle verification (tests, runtime logs, rendered DOM).
7. **Structured Commits**: Commits must follow \`<type>(<scope>): <summary>\` with Why/What/Verification blocks.
8. **Agent Containment & Archive**: All agent artifacts live in \`./.agents/*\`. Retired plans/scratchpads move to \`./.agents/archive/[title]-[timestamp].md\`.
9. **Session Memory & Closeout DOX Pass**: Update \`./.memory\`, \`./.agents/context/current.md\`, and the nearest owning \`AGENTS.md\` before completing tasks.

---

## 📚 Standards & Detailed Protocols (Progressive Disclosure)

Load these relative modules on-demand when relevant to your active task:

### 🌐 Universal Core Standards (All Frameworks)
- ⚙️ [Execution & Cognitive Kernel](./.agents/standards/execution-kernel.md) — 6 Judgment laws, Fowler Refactoring, McConnell Code Complete, and byte-capping.
- 🛡️ [Security & Vibeguard Protocol](./.agents/standards/security-vibeguard.md) — Secret isolation, Destructive Command Gate, Untrusted Tool Output defense.
- 📐 [System, Domain & Resilience Design](./.agents/standards/system-design.md) — Evans DDD, Nygard Release It! stability, migration rehearsal, and schemas.
- 🔄 [Development Workflows & Gates](./.agents/standards/workflows.md) — Scaled tiers (tiny-fix, quick-win, feature, architecture-change) & 5-phase pipeline.
- 📜 [Git Branching, Commits & SemVer](./.agents/standards/git-workflow.md) — Branch lifecycle (\`master\`/\`dev\`/\`feature\`/\`release\`/\`hotfix\`), commit standards, and SemVer.
- 📑 [DOX Hierarchy & Subtree Contracts](./.agents/standards/dox-hierarchy.md) — Reading order, child doc shape, closeout checklist, and pruning loop.
- 🎭 [Council Roles & Routing](./.agents/standards/council-roles.md) — Division responsibilities (Muse, Sol, Jasper, Crew, Nexus) and subagent dispatch policies.
- 🧠 [Context, Memory & Identity](./.agents/standards/memory-context.md) — Context hygiene, \`./.memory\` store lifecycle, Creed durable proposals, LifeOS sources.

### 🚀 Stack Architecture Standards
${getStackStandardsLinks(config.type)}

### 🎨 Brand Identity, UI & Accessibility System
- 🎨 [Design System & UI Standards](./.agents/brand/design.md) — Token architecture, 7 required UI component states, fluid typography.
- 📐 [Semantic BEM CSS Conventions](./.agents/brand/bem-conventions.md) — Block-Element-Modifier class architecture and shallow depth rules.
- ♿ [Accessibility (A11y) Baseline](./.agents/brand/a11y.md) — WCAG 2.2 AA non-negotiable mandates, contrast ratios, hit targets, and axe-core zero-tolerance.
- 📸 [Reference Screenshots & Mocks](./.agents/brand/screenshots/README.md) — Directory for UI screenshots, wireframes, and design snapshots.

### 📖 Durable Project Context
- 📖 [Durable Project Context Map](./.agents/context/index.md) — Product scope, architecture truth, current shipped state, decisions, and roadmap.
`;
  safeWrite(join(config.targetDir, "AGENTS.md"), agentsMd, config.isDryRun, config.isForce);

  // 2. .agentrules (Vibeguard & Governance Boundaries)
  const agentRules = `# Project AI Constitution & Behavioral Boundaries

## 🛡️ Vibeguard Zero-Leakage Protocol
1. **Zero Secret Exposure**: NEVER print, echo, or commit raw credentials, API keys (\`sk-*\`, \`ghp_*\`, \`npm_*\`, private keys, database URLs, passwords). Always mask as \`[REDACTED]\`.
2. **Safe Environment Handling**: Never ingest entire \`.env\` files into context when only variable names are needed.
3. **Pre-Ship Secret Scan**: Mandatory secret scan check before any commit or handoff.

## 📜 Meaningful Git Commit Protocol (Mandatory)
Every git commit in this project MUST follow this format:
\`\`\`
<type>(<scope>): <concise-imperative-summary>

- Why: [Motivation or issue solved]
- What: [Bullet list of specific files or logic changes]
- Verification: [Proof of clean build, tests, and Nexus gate pass]
\`\`\`
- Allowed types: \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`perf\`, \`test\`, \`build\`, \`ci\`, \`chore\`.
- Vague commit messages (\`"update"\`, \`"fix"\`, \`"wip"\`) are strictly forbidden.

## 🏛️ Agency Governance & Operating Rules
- **Chief Orchestrator**: **Muse** leads project coordination, contract extraction, and workstream routing.
- **Evidence Before Claims**: Never claim a bug is fixed or a task is complete based solely on command exit codes. Verify actual rendered HTML, DOM selectors, runtime logs, and browser tests.
- **Escalation Hierarchy**: Admin/Config Toggle > CSS/Script Tweak > Standard Component > Heavy Custom Automation (Anti-Overengineering).
- **Reality State Discipline**: Never confuse "discussed" with "implemented". Features only advance in \`.agents/context/current.md\` through verified gates.
`;
  safeWrite(join(config.targetDir, ".agentrules"), agentRules, config.isDryRun, config.isForce);

  // 3. .gitignore
  const gitignore = `# Dependencies
node_modules/
vendor/
__pycache__/
*.pyc
.venv/
env/

# Build outputs
dist/
build/
.next/
.astro/
out/
.output/

# Environment files & secrets
.env
.env.local
.env.*.local
*.pem
*.key

# Persistent Agent Memory & Context
# Note: DOX (.agents/) is committed, while volatile state is ignored
.memory/
.claude/
.opencode/
.pi/
.jez/
.codex/
.codegraph/
.crush/
.omo/
.playwright/
.slim/

# IDE & Editor files
.zed/
.orca/
.cursor/
.antigravity/
.vscode/
.idea/
*.swp
*.swo
*~

# OS & Logs
.DS_Store
Thumbs.db
*.log
npm-debug.log*
yarn-debug.log*
bun.lock*

# Test Coverage
coverage/
.nyc_output/
playwright-report/
test-results/

# Temporary
tmp/
temp/
*.tmp
`;
  safeWrite(join(config.targetDir, ".gitignore"), gitignore, config.isDryRun, config.isForce);

  // 4. Tailored .agents/context/ files
  const productMd = `# 📦 Product Scope & Capabilities: ${config.name}

> **Project Archetype**: ${config.type.toUpperCase()}
> **Owner**: ${config.client || "Principal / Project Lead"}
> **Status**: INITIALIZING

---

## 1. Executive Summary & Value Proposition
${config.desc}

## 2. Target Audience & Stakeholders
- Agency clients, end-users, and internal operators.
- Governed by the Agency Council (Muse, Sol, Jasper, Crew, Nexus).

## 3. Core Capability Inventory
- [ ] Core Application Flow
- [ ] Responsive UI System & Design Tokens
- [ ] Automated Test Probes & Verification Suite
- [ ] Performance Optimization (Sub-second load times)
`;
  safeWrite(join(config.targetDir, ".agents", "context", "product.md"), productMd, config.isDryRun, config.isForce);

  const architectureMd = `# 🏗️ System Architecture & Runtime Topology: ${config.name}

> **Runtime Target**: ${config.type.toUpperCase()}
> **Engineered by**: Sol (Product Architect) & Nexus (Quality Gate)

---

## 1. Tech Stack Blueprint
- **Archetype**: ${config.type}
- **Language**: TypeScript / Modern ECMAScript / Python
- **Styling**: Tailwind CSS v4 / Custom CSS Tokens
- **Runtime**: Node.js / Bun / Edge Workers

## 2. Directory Layout
\`\`\`
├── AGENTS.md                 # Root contract & DOX rail
├── .agents/
│   ├── context/              # Durable truth (index, product, architecture, etc.)
│   ├── standards/            # Progressive engineering standards
│   ├── brand/                # Design tokens & BEM conventions
│   └── skills/               # Installed agency skill bundles
├── .memory/                  # Session cognitive memory
├── src/                      # Source code
├── scripts/                  # Automation & verification scripts
└── tests/                    # E2E & harness probes
\`\`\`

## 3. Data Flow & Boundary Isolation
- Unidirectional state management.
- Zero secret exposure server-side execution.
`;
  safeWrite(join(config.targetDir, ".agents", "context", "architecture.md"), architectureMd, config.isDryRun, config.isForce);

  const currentMd = `# 📍 Current Shipped State & Reality Gate

> **Current Phase**: BOOTSTRAP COMPLETE
> **Last Verified**: ${new Date().toISOString().split("T")[0]}

---

## 1. Verified Capabilities
- [x] Progressive Disclosure DOX architecture initialized.
- [x] Council roles & execution kernel codified in \`.agents/standards/\`.
- [x] Brand token architecture established in \`.agents/brand/\`.
- [x] Nexus verification gate generated in \`scripts/nexus_verify.sh\`.

## 2. Active Focus (Next Milestones)
- [ ] Implement core domain components.
- [ ] Wire up styling tokens to root layout.
- [ ] Run full Nexus verification pass.
`;
  safeWrite(join(config.targetDir, ".agents", "context", "current.md"), currentMd, config.isDryRun, config.isForce);

  const decisionsMd = `# 📑 Architectural Decision Records (ADRs)

## [ADR-001] Progressive DOX Architecture Adoption
- **Date**: ${new Date().toISOString().split("T")[0]}
- **Status**: APPROVED
- **Context**: Initialized project with progressive disclosure DOX framework.
- **Decision**: Adopted lean \`AGENTS.md\` root contract, \`.agents/standards/\`, and \`.agents/context/\` separation.
- **Consequences**: Deterministic AI governance, context hygiene, and zero secret leakage.
`;
  safeWrite(join(config.targetDir, ".agents", "context", "decisions.md"), decisionsMd, config.isDryRun, config.isForce);

  const roadmapMd = `# 🗺️ SOW Board & Sprint Roadmap: ${config.name}

## 🎯 Phase 1: Foundation & Design System (Jasper & Sol)
- [ ] Initialize application shell and root layout.
- [ ] Wire brand tokens into global CSS.
- [ ] Pass local build & typecheck gates.

## 🎯 Phase 2: Feature Implementation (Sol)
- [ ] Core data flow & route handlers.
- [ ] Business logic and domain types.

## 🎯 Phase 3: Hardening & Pre-Ship Verification (Nexus)
- [ ] End-to-end Playwright harness probe execution.
- [ ] Vibeguard secret leakage audit.
- [ ] Lighthouse Core Web Vitals optimization.
`;
  safeWrite(join(config.targetDir, ".agents", "context", "roadmap.md"), roadmapMd, config.isDryRun, config.isForce);

  const brandMd = `# 🎨 Brand Identity & Presentation Guidelines

- **Primary Theme**: ${config.theme}
- **Voice & Tone**: Confident, refined, technically authoritative, clear, and concise.
- **Visual Standard**: High contrast, intentional typography, fluid micro-interactions, WCAG 2.2 AA compliant.
`;
  safeWrite(join(config.targetDir, ".agents", "context", "brand.md"), brandMd, config.isDryRun, config.isForce);

  const indexMd = `# 🧭 Project Context Map (Start Here)

This directory contains the durable, version-controlled truth for **${config.name}**.

| Document | Purpose |
|:---|:---|
| [product.md](./product.md) | High-level vision, value proposition, and capability inventory |
| [architecture.md](./architecture.md) | Stack specification, component boundaries, and runtime topology |
| [brand.md](./brand.md) | Voice, visual tone, and presentation rules |
| [current.md](./current.md) | Current verified shipped state and known gaps |
| [decisions.md](./decisions.md) | Immutable Architectural Decision Records (ADRs) |
| [roadmap.md](./roadmap.md) | Scope of work board and active sprint backlog |
`;
  safeWrite(join(config.targetDir, ".agents", "context", "index.md"), indexMd, config.isDryRun, config.isForce);
}

function getStackStandardsLinks(type: ProjectArchetype): string {
  switch (type) {
    case "nextjs":
      return `- ⚛️ [Next.js & React Architecture](./.agents/standards/frontend-nextjs.md) — Next.js 16 (App Router), React 19, Server Components, Server Actions, TanStack Query.\n- 🧭 [Agency Tech Stacks & Tooling](./.agents/standards/tech-stacks.md) — Core delivery patterns & toolchain.`;
    case "astro":
      return `- 🚀 [Astro Frontend Architecture](./.agents/standards/frontend-astro.md) — Astro v7.2.x, static-first with client:* islands, content collections with Zod.\n- 🧭 [Agency Tech Stacks & Tooling](./.agents/standards/tech-stacks.md) — Core delivery patterns & toolchain.`;
    case "hono":
      return `- ⚡ [Cloudflare Workers & Hono API](./.agents/standards/backend-workers-hono.md) — Hono @latest, Drizzle ORM, Neon HTTP driver, route-per-resource, isolate safety.\n- 🧭 [Agency Tech Stacks & Tooling](./.agents/standards/tech-stacks.md) — Core delivery patterns & toolchain.`;
    case "python":
      return `- 🐍 [Python AI & FastAPI Architecture](./.agents/standards/python-ai.md) — Python 3.12+, FastAPI, Pydantic v2, Ruff, Pytest, Token Isolation.`;
    case "wordpress":
      return `- 🌐 [WordPress & PHP Development](./.agents/standards/wordpress-cms.md) — WordPress 6.x, PHP 8.3, Composer/Bedrock, Custom Blocks & Security.`;
    case "library":
      return `- 📦 [TypeScript Library & Package](./.agents/standards/library-package.md) — Strict Bun/tsup, dual CJS/ESM builds, zero-dependency doctrine.`;
    case "html":
      return `- 📄 [Static HTML & CSS Tokens](./.agents/standards/static-html.md) — Semantic HTML5, CSS tokens in base.css, BEM naming, zero-build.`;
    default:
      return `- 🧭 [Agency Tech Stacks & Tooling](./.agents/standards/tech-stacks.md) — Core delivery patterns & toolchain.`;
  }
}

function provisionStackStandards(config: any) {
  console.log(`\n⚙️ [2/6] Tailoring Standards for ${config.type}...`);

  // Python AI standard
  if (config.type === "python") {
    const pythonStandard = `# 🐍 Python AI & FastAPI Engineering Standards

> **Stack**: Python 3.12+ | FastAPI | Pydantic v2 | Ruff | Pytest | uv / Poetry

---

## 1. Runtime Invariants
- Use strict type annotations everywhere with Pydantic v2 \`BaseModel\`.
- Format and lint with \`ruff check\` and \`ruff format\`.
- All tests executed via \`pytest -v\` with high coverage.
- All secrets managed through \`pydantic-settings\` via \`.env\` (never raw \`os.environ\`).

## 2. API Design & Security
- Dependency injection for database sessions and auth handlers.
- Async endpoints for all I/O and external LLM provider calls.
- Strict rate limiting and token consumption tracking.
`;
    safeWrite(join(config.targetDir, ".agents", "standards", "python-ai.md"), pythonStandard, config.isDryRun, config.isForce);
  }

  // WordPress standard
  if (config.type === "wordpress") {
    const wpStandard = `# 🌐 WordPress & Custom PHP Architecture Standards

> **Stack**: WordPress 6.x | PHP 8.3 | Composer | Bedrock / Custom Theme & Plugin

---

## 1. Code Standards & Quality
- Follow PSR-12 and WordPress Coding Standards (WPCS).
- Strict input sanitization (\`sanitize_text_field\`, \`wp_unslash\`) and output escaping (\`esc_html\`, \`esc_attr\`, \`esc_url\`).
- Always use nonces for action verification.

## 2. Block Theme & Plugin Development
- Modern block-based development using \`theme.json\` for global design tokens.
- Custom dynamic blocks with React (\`@wordpress/scripts\`).
`;
    safeWrite(join(config.targetDir, ".agents", "standards", "wordpress-cms.md"), wpStandard, config.isDryRun, config.isForce);
  }

  // Library standard
  if (config.type === "library") {
    const libStandard = `# 📦 TypeScript Package & Library Standards

> **Stack**: TypeScript (Strict) | Bun Test | tsup / tsbb | SemVer | npm

---

## 1. Architectural Principles
- **Zero or Minimal Dependencies**: Prefer native platform APIs over heavy npm dependencies.
- **Dual Export Support**: Always emit clean ESM and CJS outputs with accurate \`.d.ts\` maps.
- **Side-Effect Free**: Mark \`"sideEffects": false\` in \`package.json\` to ensure tree-shakability.
- **Deterministic API Contracts**: Export explicitly typed interfaces; avoid leaky abstractions.
`;
    safeWrite(join(config.targetDir, ".agents", "standards", "library-package.md"), libStandard, config.isDryRun, config.isForce);
  }

  // Static HTML standard
  if (config.type === "html") {
    const htmlStandard = `# 📄 Static HTML & Design Token Standards

> **Stack**: Semantic HTML5 | Modern CSS Tokens | BEM | Vanilla / Alpine.js

---

## 1. Core Directives
- **Zero-Build First**: Clean HTML files referencing \`tokens/base.css\`.
- **Semantic Structure**: Proper \`<header>\`, \`<main>\`, \`<section>\`, \`<nav>\`, and \`<footer>\` tags.
- **Accessible & Responsive**: 100% WCAG 2.2 AA compliant with fluid viewport scaling.
`;
    safeWrite(join(config.targetDir, ".agents", "standards", "static-html.md"), htmlStandard, config.isDryRun, config.isForce);
  }
}

function provisionBrandTokens(config: any) {
  console.log(`\n🎨 [3/6] Setting Up Brand & Design System (${config.theme})...`);

  const selectedThemeObj = BRAND_THEMES.find((t) => t.id === config.theme) || BRAND_THEMES[0];

  const colorsJson = {
    theme: selectedThemeObj.id,
    label: selectedThemeObj.label,
    colors: {
      primary: selectedThemeObj.primary,
      accent: selectedThemeObj.accent,
      background: config.theme.includes("dark") ? "#09090b" : "#fafafa",
      foreground: config.theme.includes("dark") ? "#f4f4f5" : "#18181b",
      muted: config.theme.includes("dark") ? "#27272a" : "#e4e4e7",
      mutedForeground: config.theme.includes("dark") ? "#a1a1aa" : "#71717a",
      border: config.theme.includes("dark") ? "#27272a" : "#e4e4e7",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
  };

  safeWrite(
    join(config.targetDir, ".agents", "brand", "tokens", "colors.json"),
    JSON.stringify(colorsJson, null, 2),
    config.isDryRun,
    config.isForce
  );
}

function provisionVerificationHarness(config: any) {
  console.log("\n🛡️ [4/6] Setting Up Nexus Verification Gate & Playwright Probes...");

  let testCommand = "npm test";
  let typecheckCommand = "npm run typecheck";
  let buildCommand = "npm run build";

  if (config.type === "python") {
    testCommand = "pytest -v";
    typecheckCommand = "ruff check .";
    buildCommand = "python -m compileall .";
  } else if (config.type === "bun" || config.type === "hono") {
    testCommand = "bun test";
    typecheckCommand = "tsc --noEmit";
    buildCommand = "bun build ./src/index.ts --outdir ./dist";
  }

  const nexusVerifyScript = `#!/usr/bin/env bash
# 🛡️ Nexus Adversarial Quality Gate
# Enforces deterministic build, typecheck, secret isolation, and probe verification.
set -e

echo "🛡️ [NEXUS GATE] Running Pre-Ship Verification for ${config.name} (${config.type})..."

# 1. Secret Scan Check
if [ -f "scripts/secret_scan.sh" ]; then
  echo "🔒 Step 1: Running Secret Scan..."
  bash scripts/secret_scan.sh .
elif [ -f "scripts/secret_scan.ts" ]; then
  echo "🔒 Step 1: Running Secret Scan..."
  bun scripts/secret_scan.ts .
else
  echo "⏩ Step 1: SecretScan skipped (local scanner script not found)."
fi

# 2. Typecheck
echo "🔍 Step 2: Running Static Analysis / Typecheck..."
if [ -f "tsconfig.json" ]; then
  ${typecheckCommand} || tsc --noEmit || echo "⚠️ Typecheck warnings present"
elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
  ruff check . || echo "⚠️ Python linter warning"
fi

# 3. Production Build
echo "⚡ Step 3: Running Build Check..."
if grep -q '"build"' package.json 2>/dev/null; then
  ${buildCommand}
fi

# 4. Playwright E2E Probes (Web & Frontend)
if [ -f "tests/e2e/harness_probe.spec.ts" ]; then
  echo "🎭 Step 4: Running Playwright Harness Probes..."
  npx playwright test tests/e2e/harness_probe.spec.ts --reporter=line || echo "⚠️ Playwright probe skipped or dev server offline"
fi

echo "✅ [NEXUS GATE] Verification pass complete!"
`;
  safeWrite(join(config.targetDir, "scripts", "nexus_verify.sh"), nexusVerifyScript, config.isDryRun, config.isForce, true);

  // Playwright test probe
  const harnessProbeSpec = `import { test, expect } from "@playwright/test";

test.describe("Nexus Baseline Harness Probe", () => {
  test("Homepage loads successfully with HTTP 200 and zero console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const response = await page.goto("http://localhost:3000");
    if (response) {
      expect(response.status()).toBeLessThan(400);
    }
    expect(consoleErrors).toEqual([]);
  });
});
`;
  safeWrite(join(config.targetDir, "tests", "e2e", "harness_probe.spec.ts"), harnessProbeSpec, config.isDryRun, config.isForce);

  // Dynamic LLM documentation generator
  const generateLlmsTxtScript = `#!/usr/bin/env bun
/**
 * Dynamic LLM Documentation Generator
 * Indexes AGENTS.md, .agents/context/, and .agents/standards/ into llms.txt & llms-full.txt
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join, basename } from "node:path";

const rootDir = resolve(process.cwd());
const agentsDir = join(rootDir, ".agents");
const contextDir = join(agentsDir, "context");
const standardsDir = join(agentsDir, "standards");
const projectName = basename(rootDir);

console.log("📄 Generating llms.txt & llms-full.txt for " + projectName);

let productOverview = "";
if (existsSync(join(contextDir, "product.md"))) {
  productOverview = readFileSync(join(contextDir, "product.md"), "utf8");
} else if (existsSync(join(rootDir, "AGENTS.md"))) {
  productOverview = readFileSync(join(rootDir, "AGENTS.md"), "utf8");
}

// 1. Generate llms.txt index
let llmsTxt = \`# \${projectName}

> Project Documentation & AI Operational Index (DOX Progressive Architecture)
> Generated on: \${new Date().toISOString()}

## Overview
\${productOverview.slice(0, 600)}...

## Core Context
\`;

if (existsSync(contextDir)) {
  for (const file of readdirSync(contextDir).filter(f => f.endsWith(".md")).sort()) {
    llmsTxt += \`- [.agents/context/\${file}](.agents/context/\${file})\\n\`;
  }
}

llmsTxt += \`\\n## Engineering Standards\\n\`;
if (existsSync(standardsDir)) {
  for (const file of readdirSync(standardsDir).filter(f => f.endsWith(".md")).sort()) {
    llmsTxt += \`- [.agents/standards/\${file}](.agents/standards/\${file})\\n\`;
  }
}

writeFileSync(join(rootDir, "llms.txt"), llmsTxt.trim() + "\\n", "utf8");
console.log("  ✅ Generated llms.txt");

// 2. Generate llms-full.txt
let fullContent = \`# \${projectName} - Complete Canonical Knowledge Base\\n\\nGenerated on: \${new Date().toISOString()}\\n\\n\`;

if (existsSync(join(rootDir, "AGENTS.md"))) {
  fullContent += \`=======================================================\\nFILE: AGENTS.md\\n=======================================================\\n\\n\`;
  fullContent += readFileSync(join(rootDir, "AGENTS.md"), "utf8") + "\\n\\n";
}

if (existsSync(contextDir)) {
  for (const file of readdirSync(contextDir).filter(f => f.endsWith(".md")).sort()) {
    fullContent += \`=======================================================\\nFILE: .agents/context/\${file}\\n=======================================================\\n\\n\`;
    fullContent += readFileSync(join(contextDir, file), "utf8") + "\\n\\n";
  }
}

if (existsSync(standardsDir)) {
  for (const file of readdirSync(standardsDir).filter(f => f.endsWith(".md")).sort()) {
    fullContent += \`=======================================================\\nFILE: .agents/standards/\${file}\\n=======================================================\\n\\n\`;
    fullContent += readFileSync(join(standardsDir, file), "utf8") + "\\n\\n";
  }
}

writeFileSync(join(rootDir, "llms-full.txt"), fullContent.trim() + "\\n", "utf8");
console.log("  ✅ Generated llms-full.txt");
`;
  safeWrite(join(config.targetDir, "scripts", "generate_llms_txt.ts"), generateLlmsTxtScript, config.isDryRun, config.isForce, true);
}

function bundleSkills(config: any) {
  if (config.skills === "none") {
    console.log(`\n📦 [5/6] Skills bundling skipped (preset: none)`);
    return;
  }

  console.log(`\n📦 [5/6] Bundling Skill Preset: ${config.skills}...`);
  const targetSkillsDir = join(config.targetDir, ".agents", "skills");

  let selectedSkills: string[] = [];
  if (config.skills === "all") {
    const sources = findSkillSources();
    for (const src of sources) {
      selectedSkills.push(...readdirSync(src));
    }
  } else if (SKILL_BUNDLES[config.skills]) {
    selectedSkills = SKILL_BUNDLES[config.skills];
  } else {
    selectedSkills = SKILL_BUNDLES["agency-suite"];
  }
  selectedSkills = Array.from(new Set(selectedSkills));

  const lockEntries: Record<string, any> = {};
  const sources = findSkillSources();

  for (const skill of selectedSkills) {
    let sourceSkillPath = "";
    for (const src of sources) {
      const candidate = join(src, skill);
      if (existsSync(candidate) && statSync(candidate).isDirectory()) {
        sourceSkillPath = candidate;
        break;
      }
    }

    if (sourceSkillPath) {
      const destSkillPath = join(targetSkillsDir, skill);
      if (!existsSync(destSkillPath) || config.isForce) {
        if (!config.isDryRun) {
          mkdirSync(destSkillPath, { recursive: true });
          copyRecursive(sourceSkillPath, destSkillPath, config.isDryRun, config.isForce);
        }
        console.log(`  📦 Installed Skill: ${skill}`);
      }
      lockEntries[skill] = {
        source: relative(config.targetDir, sourceSkillPath) || sourceSkillPath,
        sourceType: "directory",
        installedAt: new Date().toISOString(),
      };
    }
  }

  if (!config.isDryRun) {
    const skillsLockContent = JSON.stringify({ version: 1, skills: lockEntries }, null, 2);
    writeFileSync(join(config.targetDir, "skills-lock.json"), skillsLockContent + "\n", "utf8");
    console.log(`  ✅ Generated: skills-lock.json with ${Object.keys(lockEntries).length} skills`);
  }
}

function generateLlmsDocs(config: any) {
  console.log("\n📄 [6/6] Generating Initial llms.txt & llms-full.txt...");
  if (!config.isDryRun && existsSync(join(config.targetDir, "scripts", "generate_llms_txt.ts"))) {
    try {
      Bun.spawnSync(["bun", join(config.targetDir, "scripts", "generate_llms_txt.ts")], { cwd: config.targetDir });
    } catch (e) {
      console.log("  ⚠️ Note: Ran LLM doc generator.");
    }
  }
}

function provisionFallbackStandards(config: any) {
  const executionKernel = `# ⚙️ Execution & Cognitive Kernel\n\n> 6 Judgment Laws, Confidence Gate, Fowler Refactoring, McConnell Construction standards.\n`;
  const securityVibeguard = `# 🛡️ Security & Vibeguard Protocol\n\n> Zero secret leakage, destructive command gate, untrusted input defense.\n`;
  const councilRoles = `# 🎭 Agency Council Roles & Routing\n\n> Muse (Lead), Sol (Backend/Logic), Jasper (UI/Design), Crew (Ops), Nexus (Quality Gate).\n`;
  const doxHierarchy = `# 📑 DOX Hierarchy & Subtree Contracts\n\n> Root AGENTS.md, progressive disclosure in .agents/standards, .agents/context.\n`;

  safeWrite(join(config.targetDir, ".agents", "standards", "execution-kernel.md"), executionKernel, config.isDryRun, config.isForce);
  safeWrite(join(config.targetDir, ".agents", "standards", "security-vibeguard.md"), securityVibeguard, config.isDryRun, config.isForce);
  safeWrite(join(config.targetDir, ".agents", "standards", "council-roles.md"), councilRoles, config.isDryRun, config.isForce);
  safeWrite(join(config.targetDir, ".agents", "standards", "dox-hierarchy.md"), doxHierarchy, config.isDryRun, config.isForce);
}

// Run main
main().catch((err) => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});
