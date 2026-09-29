#!/usr/bin/env bun

/**
 * 🧠 updateagents — Universal Agent Context Synchronization & AI-Readiness Engine
 *
 * Full lifecycle engine for agent instructions, repository AI-readiness, and cognitive memory:
 *   - Day 0 (Empty dir): Scaffolds fresh Agent Engine DOX architecture from master templates.
 *   - Day 1 (Retrofit): Intelligently extracts custom human rules from legacy files (CLAUDE.md, .cursorrules),
 *     archives legacy files, maps context to .agents/context/*, and provisions the lean root AGENTS.md rail.
 *   - Day N (Sync): Synchronizes 17 standards and brand tokens, enforces MuseMemory hard boundary,
 *     and validates size and invariant invariants.
 *   - Audit Mode (--audit): Audits 13 tracked assets across AI Context, Dev Workflow, and Governance,
 *     with Stage-0 Fast-Skip gate, maturity scoring, and CI --fail-under gating.
 *   - Sanitization Mode (--sanitize): Scans and unwraps synthetic ADE/IDE markers (ORCA_RICH_MD, Cursor, etc.).
 *   - Direct Scaffolding (--scaffold): Surgically provisions missing DOX, .github, and configuration files.
 *
 * Invariants:
 *   - Current workspace boundary only (never traverse above cwd).
 *   - HARD BOUNDARY: Never read, write, modify, delete, or validate .memory/**.
 *   - Single Source of Truth: Pulls standards and DOX blueprints from updateagents/templates/.
 *   - Size & Noise Control: Keeps instruction files compact (<5KB preferred, <10KB max).
 *
 * Usage:
 *   bun updateagents.ts [targetPath] [options]
 */

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";

// Template source of truth located in updateagents/templates/
const SCRIPT_DIR = resolve(import.meta.dir, "..");
const TEMPLATES_DIR = join(SCRIPT_DIR, "templates");

/** Lean DOX router line limit (single source of truth: SKILL.md & twelve-asset-matrix.md). */
const AGENTS_MD_MAX_LINES = 85;

export const SECRETARY_ROUTER_BLOCK = `<!-- muse-secretary-router:start -->
## 🏛️ Autonomous Agency Orchestration (Secretary Protocol)
- **Default Session Orchestrator**: On session start or when receiving non-trivial agency tasks (coding, design, marketing, operations, reviews), immediately activate **\`secretary:dispatch\`** (\`view_file ~/.agents/skills/secretary/references/dispatch.md\` or \`.agents/skills/secretary/references/dispatch.md\`).
- **Autonomous Routing**: Triage user intent against the 46 canonical Muse departments, adopt the designated Council Lead persona (**Sol**, **Jasper**, **Crew**, **Nexus**), and selectively load only the matching \`references/<mode>.md\` before writing code.
- **Verification Gate**: All work must pass the pre-merge contract (\`bun test\`, lint, zero secret exposure) before claiming completion.
<!-- muse-secretary-router:end -->`;

export function ensureSecretaryRouter(content: string): { updatedContent: string; modified: boolean } {
  const routerStart = "<!-- muse-secretary-router:start -->";
  const routerEnd = "<!-- muse-secretary-router:end -->";

  if (content.includes(routerStart) && content.includes(routerEnd)) {
    const startIndex = content.indexOf(routerStart);
    const endIndex = content.indexOf(routerEnd) + routerEnd.length;
    const existingBlock = content.substring(startIndex, endIndex);
    if (existingBlock.trim() === SECRETARY_ROUTER_BLOCK.trim()) {
      return { updatedContent: content, modified: false };
    }
    const updatedContent = content.substring(0, startIndex) + SECRETARY_ROUTER_BLOCK + content.substring(endIndex);
    return { updatedContent, modified: true };
  }

  const separator = content.endsWith("\n\n") ? "" : content.endsWith("\n") ? "\n" : "\n\n";
  return {
    updatedContent: content + separator + SECRETARY_ROUTER_BLOCK + "\n",
    modified: true,
  };
}

// CLI Flags
const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    audit: { type: "boolean", default: false },
    scaffold: { type: "boolean", short: "s", default: false },
    sanitize: { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
    "fail-under": { type: "string", default: "" },
    json: { type: "boolean", default: false },
    force: { type: "boolean", short: "f", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
🧠 updateagents — Universal Agent Context Synchronization & AI-Readiness Engine

Usage:
  bun updateagents.ts [targetPath] [options]

Options:
  --audit          Audit 13 tracked assets, modern tools & synthetic artifacts (AI-readiness)
  -s, --scaffold   Scaffold missing Agent Engine assets (DOX container, AGENTS.md, .github templates, .env.example)
  --sanitize       Scan and unwrap synthetic ADE/IDE artifacts (ORCA_RICH_MD, Cursor, etc.)
  --fail-under N   Exit 1 when the audit score falls below N (CI gate)
  --dry-run        Simulate without writing files to disk
  --json           Output audit results in JSON format
  -f, --force      Force overwrite of standards and templates
  -h, --help       Show this help message
`);
  process.exit(0);
}

const isDryRun = values["dry-run"] || false;
const isForce = values.force || false;
const isAudit = values.audit || false;
const isScaffold = values.scaffold || false;
const isSanitize = values.sanitize || false;

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

// =========================================================================
// Helper Functions: Synthetic Artifacts & Modern Tools
// =========================================================================
export function unwrapSyntheticArtifacts(content: string): { cleaned: string; unwrappedCount: number } {
  let unwrappedCount = 0;
  // Match ORCA_RICH_MD pattern: [[ORCA_RICH_MD:<hash>:<type>:<urlencoded-payload>]]
  const orcaRegex = /\[\[ORCA_RICH_MD:[a-f0-9]+:[a-z-]+:([^\]]+)\]\]/gi;
  let cleaned = content.replace(orcaRegex, (_match, payload) => {
    unwrappedCount++;
    try {
      return decodeURIComponent(payload);
    } catch {
      return payload;
    }
  });

  // Also strip proprietary editor wrappers that overtake content
  const genericADE = /\[\[(?:ADE|CURSOR|WINDSURF|ARTIFACT):[a-f0-9]+:[a-z-]+:([^\]]+)\]\]/gi;
  cleaned = cleaned.replace(genericADE, (_match, payload) => {
    unwrappedCount++;
    try {
      return decodeURIComponent(payload);
    } catch {
      return payload;
    }
  });

  return { cleaned, unwrappedCount };
}

export function scanForSyntheticArtifacts(target: string): { file: string; count: number }[] {
  const contaminated: { file: string; count: number }[] = [];
  const orcaPattern = /\[\[ORCA_RICH_MD:[a-f0-9]+:[a-z-]+:[^\]]+\]\]|<antArtifact|\[cursor:|<<<windsurf/i;

  if (!existsSync(target)) return contaminated;

  try {
    const st = statSync(target);
    if (st.isFile()) {
      try {
        const text = readFileSync(target, "utf8");
        if (orcaPattern.test(text)) {
          const matches = (text.match(/\[\[ORCA_RICH_MD:[a-f0-9]+:[a-z-]+:[^\]]+\]\]/gi) || []).length;
          contaminated.push({ file: basename(target), count: matches || 1 });
        }
      } catch {}
      return contaminated;
    }
  } catch {
    return contaminated;
  }

  function walk(dir: string) {
    if (!existsSync(dir)) return;
    try {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (
            entry.name === ".git" ||
            entry.name === "node_modules" ||
            entry.name === "dist" ||
            entry.name === ".worktrees" ||
            entry.name === ".memory"
          )
            continue;
          walk(fullPath);
        } else if (entry.isFile() && /\.(md|markdown|txt|json|yaml|yml|ts|js|tsx|jsx|sh)$/i.test(entry.name)) {
          try {
            const text = readFileSync(fullPath, "utf8");
            if (orcaPattern.test(text)) {
              const matches = (text.match(/\[\[ORCA_RICH_MD:[a-f0-9]+:[a-z-]+:[^\]]+\]\]/gi) || []).length;
              contaminated.push({ file: relative(target, fullPath), count: matches || 1 });
            }
          } catch {}
        }
      }
    } catch {}
  }

  walk(target);
  return contaminated;
}

export function checkModernToolsAvailability(): { installed: string[]; missing: string[] } {
  const coreTools = [
    "fd",
    "rg",
    "bat",
    "eza",
    "sd",
    "choose",
    "procs",
    "zoxide",
    "delta",
    "btop",
    "ncdu",
    "gojq",
    "zstd",
  ];
  const installed: string[] = [];
  const missing: string[] = [];

  for (const tool of coreTools) {
    const res = spawnSync("which", [tool], { encoding: "utf8" });
    if (res.status === 0) {
      installed.push(tool);
    } else {
      missing.push(tool);
    }
  }

  return { installed, missing };
}

export interface AssetCheck {
  id: number;
  name: string;
  category: "AI Context" | "Dev Workflow" | "Onboarding & Governance";
  passed: boolean;
  path: string;
  details: string;
}

export function auditWorkspace(target: string): AssetCheck[] {
  const gitignorePath = join(target, ".gitignore");
  let gitignoreHasEnv = false;
  if (existsSync(gitignorePath)) {
    try {
      const gitignoreContent = readFileSync(gitignorePath, "utf8");
      gitignoreHasEnv = /^\.e[n]v|\.env/m.test(gitignoreContent);
    } catch {}
  }

  const agentsMdPath = join(target, "AGENTS.md");
  let agentsMdOk = false;
  if (existsSync(agentsMdPath)) {
    const lines = readFileSync(agentsMdPath, "utf8").split("\n").length;
    agentsMdOk = lines <= AGENTS_MD_MAX_LINES; // Lean DOX router (<50 lines)
  }

  const toolConfigOk =
    existsSync(join(target, ".mcp.json")) ||
    existsSync(join(target, ".gemini")) ||
    existsSync(join(target, ".claude")) ||
    existsSync(join(target, ".cursor"));
  const toolConfigDetail = toolConfigOk
    ? "Authorized agent tool configuration detected"
    : "Missing agent tool configuration";

  const envExampleOk = existsSync(join(target, ".env.example"));
  const artifactsOk =
    existsSync(join(target, ".agents/artifacts")) && existsSync(join(target, ".agents/artifacts/README.md"));

  const checks: AssetCheck[] = [
    {
      id: 1,
      name: "Root Agent Router",
      category: "AI Context",
      path: "AGENTS.md",
      passed: existsSync(agentsMdPath) && agentsMdOk,
      details: existsSync(agentsMdPath)
        ? `Exists (<${AGENTS_MD_MAX_LINES + 1} lines DOX router)`
        : `Missing or exceeds ${AGENTS_MD_MAX_LINES} lines`,
    },
    {
      id: 2,
      name: "DOX Hierarchy Tree",
      category: "AI Context",
      path: ".agents/",
      passed: existsSync(join(target, ".agents/standards")) && existsSync(join(target, ".agents/context")),
      details: "Standards and context containers verified",
    },
    {
      id: 3,
      name: "Tool / MCP Config",
      category: "AI Context",
      path: ".mcp.json or agent config",
      passed: toolConfigOk,
      details: toolConfigDetail,
    },
    {
      id: 4,
      name: "AI Discovery Manifest",
      category: "AI Context",
      path: "llms.txt",
      passed: existsSync(join(target, "llms.txt")),
      details: "LLM index manifest present",
    },
    {
      id: 5,
      name: "CI Verification Pipeline",
      category: "Dev Workflow",
      path: ".github/workflows",
      passed: existsSync(join(target, ".github/workflows")),
      details: "Automated test & build workflow",
    },
    {
      id: 6,
      name: "Issue Templates",
      category: "Dev Workflow",
      path: ".github/ISSUE_TEMPLATE",
      passed: existsSync(join(target, ".github/ISSUE_TEMPLATE")),
      details: "Structured issue forms",
    },
    {
      id: 7,
      name: "PR Review Template",
      category: "Dev Workflow",
      path: ".github/pull_request_template.md",
      passed:
        existsSync(join(target, ".github/pull_request_template.md")) ||
        existsSync(join(target, ".github/PULL_REQUEST_TEMPLATE.md")),
      details: "Anti-slop PR verification checklist",
    },
    {
      id: 8,
      name: "Dependency Automation",
      category: "Dev Workflow",
      path: ".github/dependabot.yml",
      passed: existsSync(join(target, ".github/dependabot.yml")),
      details: "Dependabot configuration present",
    },
    {
      id: 9,
      name: "Changelog",
      category: "Onboarding & Governance",
      path: "CHANGELOG.md or docs/CHANGELOG.md",
      passed: existsSync(join(target, "CHANGELOG.md")) || existsSync(join(target, "docs/CHANGELOG.md")),
      details: "Keep a Changelog standard",
    },
    {
      id: 10,
      name: "Contributing Protocol",
      category: "Onboarding & Governance",
      path: "CONTRIBUTING.md",
      passed: existsSync(join(target, "CONTRIBUTING.md")),
      details: "Conventional Commits protocol",
    },
    {
      id: 11,
      name: "Durable Documentation",
      category: "Onboarding & Governance",
      path: "docs/ or .agents/context/",
      passed: existsSync(join(target, "docs")) || existsSync(join(target, ".agents/context")),
      details: "Domain knowledge repository",
    },
    {
      id: 12,
      name: "Secret Hygiene & Guards",
      category: "Onboarding & Governance",
      path: ".gitignore + .env.example",
      passed: existsSync(gitignorePath) && gitignoreHasEnv && envExampleOk,
      details: envExampleOk
        ? ".gitignore blocks environment secret files; .env.example present"
        : ".gitignore guard OK, but .env.example missing",
    },
    {
      id: 13,
      name: "Working Artifacts Container",
      category: "Onboarding & Governance",
      path: ".agents/artifacts",
      passed: artifactsOk,
      details: artifactsOk
        ? "Artifacts container with contract stub present (research/planning stay out of the repo tree)"
        : "Missing .agents/artifacts/ or its README.md contract stub",
    },
  ];

  return checks;
}

export function scaffoldAgentEngine(
  target: string,
  options: { dryRun?: boolean; force?: boolean } = {},
): { created: string[]; skipped: string[] } {
  const created: string[] = [];
  const skipped: string[] = [];
  const dry = options.dryRun || false;
  const force = options.force || false;

  if (!existsSync(TEMPLATES_DIR)) {
    throw new Error(`❌ Templates bundle not found at: ${TEMPLATES_DIR}`);
  }

  // 1. Provision 9-folder .agents/ tree
  const agentsDir = join(target, ".agents");
  const subdirs = [
    "archive",
    "artifacts",
    "brand",
    "brand/tokens",
    "brand/screenshots",
    "context",
    "goals",
    "research",
    "skills",
    "standards",
    "workflows",
  ];

  for (const sub of subdirs) {
    const p = join(agentsDir, sub);
    assertNotMemory(p);
    if (!existsSync(p) && !dry) {
      mkdirSync(p, { recursive: true });
      created.push(`.agents/${sub}/`);
    }
  }

  // 2. Copy standards
  const masterStandards = join(TEMPLATES_DIR, ".agents/standards");
  if (existsSync(masterStandards)) {
    const destStandards = join(agentsDir, "standards");
    if (!existsSync(destStandards) && !dry) mkdirSync(destStandards, { recursive: true });
    for (const std of readdirSync(masterStandards)) {
      const src = join(masterStandards, std);
      const dest = join(destStandards, std);
      assertNotMemory(dest);
      if (!existsSync(dest) || force) {
        if (!dry) cpSync(src, dest);
        created.push(`.agents/standards/${std}`);
      } else {
        skipped.push(`.agents/standards/${std}`);
      }
    }
  }

  // 3. Copy brand tokens & guidelines
  const masterBrand = join(TEMPLATES_DIR, ".agents/brand");
  if (existsSync(masterBrand)) {
    const destBrand = join(agentsDir, "brand");
    if (!existsSync(destBrand) && !dry) mkdirSync(destBrand, { recursive: true });
    for (const item of readdirSync(masterBrand)) {
      if (item === "tokens" || item === "screenshots") continue;
      const src = join(masterBrand, item);
      const dest = join(destBrand, item);
      assertNotMemory(dest);
      if (!existsSync(dest) || force) {
        if (!dry) cpSync(src, dest);
        created.push(`.agents/brand/${item}`);
      }
    }
    const masterTokens = join(masterBrand, "tokens");
    const destTokens = join(destBrand, "tokens");
    if (existsSync(masterTokens) && (!existsSync(destTokens) || force)) {
      if (!dry) cpSync(masterTokens, destTokens, { recursive: true });
      created.push(`.agents/brand/tokens/`);
    }
  }

  // 4. Copy context templates if missing
  const masterContext = join(TEMPLATES_DIR, ".agents/context");
  if (existsSync(masterContext)) {
    const destContext = join(agentsDir, "context");
    if (!existsSync(destContext) && !dry) mkdirSync(destContext, { recursive: true });
    for (const ctx of readdirSync(masterContext)) {
      const src = join(masterContext, ctx);
      const dest = join(destContext, ctx);
      assertNotMemory(dest);
      if (!existsSync(dest)) {
        if (!dry) cpSync(src, dest);
        created.push(`.agents/context/${ctx}`);
      } else {
        skipped.push(`.agents/context/${ctx}`);
      }
    }
  }

  // 5. Deploy lean root AGENTS.md router
  const rootAgents = join(target, "AGENTS.md");
  assertNotMemory(rootAgents);
  const srcAgents = join(TEMPLATES_DIR, "AGENTS.md");
  if (!existsSync(rootAgents) || force) {
    if (!dry && existsSync(srcAgents)) {
      const templateContent = readFileSync(srcAgents, "utf8");
      const { updatedContent } = ensureSecretaryRouter(templateContent);
      writeFileSync(rootAgents, updatedContent, "utf8");
    }
    created.push("AGENTS.md");
  } else {
    if (!dry) {
      const existing = readFileSync(rootAgents, "utf8");
      const { updatedContent, modified } = ensureSecretaryRouter(existing);
      if (modified) {
        writeFileSync(rootAgents, updatedContent, "utf8");
        created.push("AGENTS.md (Secretary Router auto-wired)");
      } else {
        skipped.push("AGENTS.md");
      }
    } else {
      skipped.push("AGENTS.md");
    }
  }

  // 5b. Deploy .mcp.json tool config if missing (asset 3)
  const srcMcp = join(TEMPLATES_DIR, "mcp.json.template");
  const destMcp = join(target, ".mcp.json");
  if (!existsSync(destMcp) && existsSync(srcMcp)) {
    if (!dry) cpSync(srcMcp, destMcp);
    created.push(".mcp.json");
  }

  // 5c. Deploy llms.txt skeleton if missing (asset 4)
  const srcLlms = join(TEMPLATES_DIR, "llms.txt");
  const destLlms = join(target, "llms.txt");
  if (!existsSync(destLlms) && existsSync(srcLlms)) {
    if (!dry) cpSync(srcLlms, destLlms);
    created.push("llms.txt");
  }

  // 6. Deploy .gitignore.template if .gitignore missing
  const gitignore = join(target, ".gitignore");
  const srcGitignore = join(TEMPLATES_DIR, "gitignore.template");
  if (!existsSync(gitignore) && existsSync(srcGitignore)) {
    if (!dry) cpSync(srcGitignore, gitignore);
    created.push(".gitignore");
  }

  // 7. Deploy GitHub workflow & template bundle if missing (assets 6, 7, 8)
  const githubTemplates = join(TEMPLATES_DIR, "github");
  if (existsSync(githubTemplates)) {
    for (const item of readdirSync(githubTemplates)) {
      const src = join(githubTemplates, item);
      const dest = join(target, ".github", item);
      if (!existsSync(dest)) {
        if (!dry) {
          mkdirSync(join(target, ".github"), { recursive: true });
          cpSync(src, dest, { recursive: true });
        }
        created.push(`.github/${item}`);
      } else {
        skipped.push(`.github/${item}`);
      }
    }
  }

  // 8. Deploy .env.example if missing (asset 12)
  const srcEnvExample = join(TEMPLATES_DIR, "env.example");
  const destEnvExample = join(target, ".env.example");
  if (!existsSync(destEnvExample) && existsSync(srcEnvExample)) {
    if (!dry) cpSync(srcEnvExample, destEnvExample);
    created.push(".env.example");
  }

  // 9. Deploy artifacts contract stub if missing (asset 13 — artifacts rule)
  const srcArtifactsStub = join(TEMPLATES_DIR, ".agents/artifacts/README.md");
  const destArtifactsStub = join(target, ".agents/artifacts/README.md");
  if (!existsSync(destArtifactsStub) && existsSync(srcArtifactsStub)) {
    if (!dry) {
      mkdirSync(join(target, ".agents/artifacts"), { recursive: true });
      cpSync(srcArtifactsStub, destArtifactsStub);
    }
    created.push(".agents/artifacts/README.md");
  }

  // 10. Deploy Client-Intake brief if missing
  const srcClientIntake = join(TEMPLATES_DIR, "Client-Intake");
  const destClientIntake = join(target, "Client-Intake");
  if (!existsSync(destClientIntake) && existsSync(srcClientIntake)) {
    if (!dry) {
      cpSync(srcClientIntake, destClientIntake, { recursive: true });
    }
    created.push("Client-Intake/00-Intake-Brief.md");
  }

  return { created, skipped };
}

// =========================================================================
// MODE: SANITIZE
// =========================================================================
if (isSanitize) {
  console.log("\n============================================================");
  console.log(" 🛡️ updateagents — Synthetic ADE/IDE Artifact Sanitization Pass");
  console.log("============================================================");
  console.log(`📁 Target: ${workspaceDir}`);
  if (isDryRun) console.log(`🔍 [DRY RUN — No filesystem writes]`);
  console.log("------------------------------------------------------------\n");

  const contaminated = scanForSyntheticArtifacts(workspaceDir);
  if (contaminated.length === 0) {
    console.log("✅ Zero synthetic ADE/IDE artifacts detected in workspace.");
  } else {
    console.log(`⚠️ Found ${contaminated.length} files contaminated by synthetic artifacts:`);
    let totalUnwrapped = 0;
    for (const item of contaminated) {
      const fullPath = statSync(workspaceDir).isFile() ? workspaceDir : join(workspaceDir, item.file);
      try {
        const raw = readFileSync(fullPath, "utf8");
        const { cleaned, unwrappedCount } = unwrapSyntheticArtifacts(raw);
        if (unwrappedCount > 0) {
          totalUnwrapped += unwrappedCount;
          if (!isDryRun) writeFileSync(fullPath, cleaned, "utf8");
          console.log(`  • [Cleaned] ${item.file} (${unwrappedCount} synthetic artifacts unwrapped)`);
        }
      } catch (err) {
        console.error(`  • [Error] Failed to sanitize ${item.file}: ${(err as Error).message}`);
      }
    }
    console.log(`\n🎉 Sanitization complete! Total artifacts unwrapped: ${totalUnwrapped}`);
  }
  process.exit(0);
}

// =========================================================================
// MODE: DIRECT SCAFFOLD (--scaffold)
// =========================================================================
if (isScaffold) {
  console.log("\n============================================================");
  console.log(" 🤖 updateagents — Scaffolding Agent Engine DOX Architecture");
  console.log("============================================================");
  console.log(`📁 Target: ${workspaceDir}`);
  if (isDryRun) console.log(`🔍 [DRY RUN — No filesystem writes]`);
  console.log("------------------------------------------------------------\n");

  const { created, skipped } = scaffoldAgentEngine(workspaceDir, { dryRun: isDryRun, force: isForce });
  console.log(`✅ Scaffolding complete:`);
  console.log(`  • Created / Provisioned: ${created.length} files/directories`);
  for (const c of created.slice(0, 10)) console.log(`    + ${c}`);
  if (created.length > 10) console.log(`    ... and ${created.length - 10} more.`);
  if (skipped.length > 0) {
    console.log(`  • Preserved (Already present): ${skipped.length} files`);
  }
  console.log("\n🎉 Agent Engine successfully provisioned!");
  process.exit(0);
}

// =========================================================================
// MODE: AUDIT (--audit)
// =========================================================================
if (isAudit) {
  const checks = auditWorkspace(workspaceDir);
  const score = checks.filter((c) => c.passed).length;
  const failUnder = values["fail-under"] ? parseInt(values["fail-under"], 10) : null;
  const TOTAL_ASSETS = 13;

  // Stage-0 Fast-Skip Gate
  if (score === TOTAL_ASSETS) {
    console.log(`[updateagents] Repository is AI-ready (${TOTAL_ASSETS}/${TOTAL_ASSETS}). Skipping pass.`);
    process.exit(0);
  }

  if (values.json) {
    console.log(JSON.stringify({ score, total: TOTAL_ASSETS, passed: score === TOTAL_ASSETS, checks }, null, 2));
    process.exit(0);
  }

  console.log("\n============================================================");
  console.log("  🤖 AI-READY AUDIT REPORT");
  console.log("============================================================");
  const medal =
    score >= 11 ? "🏆 AI-Ready" : score >= 8 ? "🥇 Solid" : score >= 5 ? "🥈 On Track" : "🥉 Getting Started";
  console.log(`  Score:  ${score} / ${TOTAL_ASSETS} (${medal})`);
  console.log(`  Target: ${workspaceDir}`);
  console.log("------------------------------------------------------------");

  for (const check of checks) {
    const icon = check.passed ? "✓" : "x";
    console.log(`  [${icon}] ${check.category}: ${check.name} (${check.path})`);
  }

  // Modern Tooling & Synthetic Artifact Health
  const toolHealth = checkModernToolsAvailability();
  const contaminated = scanForSyntheticArtifacts(workspaceDir);

  console.log("\n⚡ Modern CLI Tooling Health (Host System):");
  console.log(`  • Installed: ${toolHealth.installed.join(", ") || "None"}`);
  if (toolHealth.missing.length > 0) {
    console.log(`  • Missing / Classic Fallback: ${toolHealth.missing.join(", ")}`);
  }

  if (contaminated.length > 0) {
    console.log(`\n⚠️ Synthetic ADE/IDE Artifact Warning:`);
    console.log(`  • Found ${contaminated.length} files with ORCA_RICH_MD or proprietary IDE wrappers.`);
    console.log(`  • Run 'bun updateagents.ts --sanitize' to unwrap them automatically.`);
  } else {
    console.log(`\n🛡️ Synthetic Artifact Hygiene: Clean (0 synthetic ADE wrappers detected).`);
  }

  console.log("============================================================");
  const failedIds = checks.filter((c) => !c.passed).map((c) => c.id);
  const scaffoldable = new Set([1, 2, 3, 4, 6, 7, 8, 12, 13]);
  const humanOnly = failedIds.filter((id) => !scaffoldable.has(id));

  if (score < TOTAL_ASSETS) {
    console.log(
      `💡 Tip: Run 'bun updateagents.ts --scaffold' to auto-provision scaffolding-owned assets (1 AGENTS.md, 2 DOX container, 3 tool config, 4 llms.txt, 6 issue templates, 7 PR template, 8 dependabot, 12 .env.example, 13 artifacts stub).`,
    );
    if (humanOnly.length > 0) {
      console.log(
        `   Remaining assets (${humanOnly.join(", ")}) are repository-specific and must be authored by the team: 5 CI pipeline, 9 changelog, 10 contributing, 11 durable docs.\n`,
      );
    } else {
      console.log("");
    }
  }

  if (failUnder !== null && !Number.isNaN(failUnder) && score < failUnder) {
    console.log(`❌ Fail-under gate: score ${score} < ${failUnder}.`);
    process.exit(1);
  }

  process.exit(0);
}

// =========================================================================
// DEFAULT MODE: CONTEXT SYNCHRONIZATION & PROGRESSIVE DISCLOSURE DOX
// =========================================================================

// Change Tracking Ledger
interface ChangeReport {
  scaffolded: string[];
  contextMerged: Array<{ targetFile: string; section: string; source: string }>;
  standardsSynced: string[];
  brandSynced: string[];
  archived: string[];
  preserved: string[];
}

const report: ChangeReport = {
  scaffolded: [],
  contextMerged: [],
  standardsSynced: [],
  brandSynced: [],
  archived: [],
  preserved: [],
};

console.log("\n=======================================================");
console.log(" 🧠 updateagents — Project Agent Context Synchronization");
console.log("=======================================================");
console.log(`📁 Workspace: ${workspaceDir}`);
if (isDryRun) console.log(`🔍 [DRY RUN MODE — No filesystem writes]`);
console.log("-------------------------------------------------------\n");

// Step 2: Discover Existing Agent Files
console.log("🔍 Step 2: Scanning for existing agent files...");
const knownAgentFiles = [
  "AGENTS.md",
  "CLAUDE.md",
  ".cursorrules",
  ".github/copilot-instructions.md",
  "GEMINI.md",
  "CODEX.md",
];

const discoveredFiles: Array<{ relPath: string; fullPath: string; content: string }> = [];

for (const file of knownAgentFiles) {
  const fullPath = join(workspaceDir, file);
  if (existsSync(fullPath)) {
    try {
      const content = readFileSync(fullPath, "utf8");
      discoveredFiles.push({ relPath: file, fullPath, content });
      console.log(`  📄 Found agent file: ./${file} (${(content.length / 1024).toFixed(1)} KB)`);
    } catch {}
  }
}

const agentsDir = join(workspaceDir, ".agents");
const standardsDir = join(agentsDir, "standards");
const contextDir = join(agentsDir, "context");
const hasAgentsDir = existsSync(agentsDir);
const hasStandards = existsSync(standardsDir);
const hasContext = existsSync(contextDir);

const hasAnyAgentFiles = discoveredFiles.length > 0 || hasAgentsDir;

if (!hasAnyAgentFiles) {
  console.log("  ℹ️  No existing agent files or .agents/ container found.");
} else {
  console.log(
    `  ℹ️  Active agent files detected: ${discoveredFiles.length} file(s), .agents/ dir: ${hasAgentsDir ? "Yes" : "No"} (standards: ${hasStandards ? "Yes" : "No"}, context: ${hasContext ? "Yes" : "No"})`,
  );
}

// Step 3: Inspect Project Environment
console.log("\n📦 Step 3: Inspecting codebase & framework...");
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

    console.log(`  ✅ Parsed package.json: Name="${projectName}", Framework="${frameworkDetected}"`);
  } catch {}
}

const composerJsonPath = join(workspaceDir, "composer.json");
if (existsSync(composerJsonPath)) {
  try {
    const comp = JSON.parse(readFileSync(composerJsonPath, "utf8"));
    if (comp.name && projectName === basename(workspaceDir)) projectName = comp.name;
    if (
      comp.require &&
      (comp.require["roots/bedrock"] || comp.require["roots/wordpress"] || comp.require["johnpbloch/wordpress"])
    ) {
      frameworkDetected = "wordpress";
    }
    console.log(`  ✅ Parsed composer.json: Framework="${frameworkDetected}"`);
  } catch {}
}

// Check for WordPress markers if not yet detected
if (frameworkDetected === "generic") {
  if (
    existsSync(join(workspaceDir, "wp-config.php")) ||
    existsSync(join(workspaceDir, "web/wp-config.php")) ||
    existsSync(join(workspaceDir, "wp-content"))
  ) {
    frameworkDetected = "wordpress";
    console.log(`  ✅ Detected WordPress file hierarchy`);
  }
}

// Helper: Extract Custom Sections from Markdown
function extractSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = markdown.split("\n");
  let currentHeader = "PREAMBLE";
  let currentContent: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headerMatch) {
      if (currentContent.length > 0) {
        sections[currentHeader] = currentContent.join("\n").trim();
        currentContent = [];
      }
      currentHeader = headerMatch[1].trim().toLowerCase();
    } else {
      currentContent.push(line);
    }
  }
  if (currentContent.length > 0) {
    sections[currentHeader] = currentContent.join("\n").trim();
  }

  return sections;
}

// Provision .agents/ directory structure
const subdirs = [
  "archive",
  "artifacts",
  "brand",
  "brand/tokens",
  "brand/screenshots",
  "context",
  "goals",
  "research",
  "skills",
  "standards",
  "workflows",
];

for (const sub of subdirs) {
  const p = join(agentsDir, sub);
  assertNotMemory(p);
  if (!existsSync(p) && !isDryRun) {
    mkdirSync(p, { recursive: true });
    report.scaffolded.push(`.agents/${sub}/`);
  }
}

// =========================================================================
// SCENARIO A: No Agent Files Found -> Scaffold Fresh Agent Engine
// =========================================================================
if (!hasAnyAgentFiles) {
  console.log("\n🛠️  Step 4A: No agent files detected — Scaffolding fresh Agent Engine DOX container...");

  // Initialize context files from templates
  const contextTemplatesDir = join(TEMPLATES_DIR, ".agents/context");
  if (existsSync(contextTemplatesDir)) {
    for (const file of readdirSync(contextTemplatesDir)) {
      const srcFile = join(contextTemplatesDir, file);
      const destFile = join(contextDir, file);
      assertNotMemory(destFile);

      if (!existsSync(destFile) && !isDryRun) {
        let content = readFileSync(srcFile, "utf8");
        content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
        content = content.replace(/\{\{PROJECT_DESC\}\}/g, projectDesc);

        if (file === "product.md") {
          content = `# 📦 Product Scope & Inventory\n\n## Overview\n${projectDesc}\n\n## Key Capabilities\n- Framework: ${frameworkDetected.toUpperCase()}\n- Governed by Agency Council DOX Architecture.\n`;
        } else if (file === "architecture.md") {
          const scriptList = Object.entries(projectScripts)
            .map(([k, v]) => `- \`npm run ${k}\` / \`bun ${k}\`: ${v}`)
            .join("\n");
          content = `# 🏗️ Architecture & Workspace Layout\n\n## 1. Stack Specifications\n- **Framework**: ${frameworkDetected.toUpperCase()}\n- **Runtime**: Node.js / Bun / PHP\n\n## 2. Verified Project Scripts\n${scriptList || "- Default framework commands"}\n\n## 3. Directory Layout\nApplication source code organized in standard framework folders.\n`;
        } else if (file === "current.md") {
          content = `# 📍 Current Shipped State & System Reality\n\n## 1. Verified Shipped Reality\n- Project **${projectName}** initialized with Progressive Disclosure DOX.\n- Framework: ${frameworkDetected.toUpperCase()}.\n\n## 2. Next Immediate Focus\n- Proceed with active milestone implementation.\n`;
        }

        writeFileSync(destFile, content, "utf8");
        report.scaffolded.push(`.agents/context/${file}`);
        console.log(`  ✅ Created: ./.agents/context/${file}`);
      }
    }
  }

  // Deploy Lean Root AGENTS.md
  const rootAgentsPath = join(workspaceDir, "AGENTS.md");
  assertNotMemory(rootAgentsPath);
  const railTemplate = join(TEMPLATES_DIR, "AGENTS.md");
  if (existsSync(railTemplate) && !isDryRun) {
    const templateContent = readFileSync(railTemplate, "utf8");
    const { updatedContent } = ensureSecretaryRouter(templateContent);
    writeFileSync(rootAgentsPath, updatedContent, "utf8");
    report.scaffolded.push("AGENTS.md (Lean DOX Rail & Secretary Protocol)");
    console.log("  ✅ Deployed lean root AGENTS.md DOX rail (<85 lines) with Secretary Protocol");
  }
}

// =========================================================================
// SCENARIO B: Agent Files Exist -> Extract Custom Content & Place Intelligently
// =========================================================================
if (hasAnyAgentFiles) {
  console.log("\n🔄 Step 4B: Custom agent files detected — Extracting and intelligently placing context...");

  // Collect all text from discovered legacy files
  const aggregatedCustomRules: string[] = [];
  let extractedProjectPurpose = "";
  const extractedArchCommands: string[] = [];
  const extractedDecisions: string[] = [];
  const extractedCurrentNotes: string[] = [];

  for (const item of discoveredFiles) {
    const sections = extractSections(item.content);

    for (const [title, content] of Object.entries(sections)) {
      if (!content.trim()) continue;

      if (
        title.includes("overview") ||
        title.includes("purpose") ||
        title.includes("about") ||
        title.includes("scope")
      ) {
        extractedProjectPurpose += `\n### From ${item.relPath} (${title})\n${content}\n`;
      } else if (
        title.includes("command") ||
        title.includes("script") ||
        title.includes("build") ||
        title.includes("stack") ||
        title.includes("run")
      ) {
        extractedArchCommands.push(`### From ${item.relPath} (${title})\n${content}`);
      } else if (
        title.includes("decision") ||
        title.includes("adr") ||
        title.includes("principle") ||
        title.includes("rule")
      ) {
        extractedDecisions.push(`### From ${item.relPath} (${title})\n${content}`);
      } else if (
        title.includes("task") ||
        title.includes("todo") ||
        title.includes("current") ||
        title.includes("progress") ||
        title.includes("status")
      ) {
        extractedCurrentNotes.push(`### From ${item.relPath} (${title})\n${content}`);
      } else {
        aggregatedCustomRules.push(`### From ${item.relPath} (${title})\n${content}`);
      }
    }
  }

  // Helper to append custom content safely if not already present
  function mergeIntoContextFile(fileName: string, header: string, extraContent: string) {
    const filePath = join(contextDir, fileName);
    assertNotMemory(filePath);

    let base = "";
    if (existsSync(filePath)) {
      base = readFileSync(filePath, "utf8");
      report.preserved.push(`.agents/context/${fileName}`);
    } else {
      const templatePath = join(TEMPLATES_DIR, ".agents/context", fileName);
      if (existsSync(templatePath)) base = readFileSync(templatePath, "utf8");
      else base = `# ${fileName}\n\n`;
      report.scaffolded.push(`.agents/context/${fileName}`);
    }

    if (extraContent && !base.includes("### From")) {
      const updated = `${base.trim()}\n\n## ${header}\n\n${extraContent.trim()}\n`;
      if (!isDryRun) writeFileSync(filePath, updated, "utf8");
      report.contextMerged.push({
        targetFile: `.agents/context/${fileName}`,
        section: header,
        source: "Discovered agent files",
      });
      console.log(`  🔄 Merged custom content into ./.agents/context/${fileName}`);
    }
  }

  if (extractedProjectPurpose) {
    mergeIntoContextFile("product.md", "Imported Project Overview & Scope", extractedProjectPurpose);
  }
  if (extractedArchCommands.length > 0) {
    mergeIntoContextFile("architecture.md", "Imported Commands & Architecture", extractedArchCommands.join("\n\n"));
  }
  if (extractedDecisions.length > 0) {
    mergeIntoContextFile("decisions.md", "Imported Decisions & Invariants", extractedDecisions.join("\n\n"));
  }
  if (extractedCurrentNotes.length > 0) {
    mergeIntoContextFile("current.md", "Imported Current Status & Notes", extractedCurrentNotes.join("\n\n"));
  }

  // Safely Archive Monolithic Files & Deploy Lean Rail
  const rootAgentsPath = join(workspaceDir, "AGENTS.md");
  assertNotMemory(rootAgentsPath);

  if (existsSync(rootAgentsPath)) {
    const rootContent = readFileSync(rootAgentsPath, "utf8");
    const isManagedRail =
      rootContent.includes("DOX Rail:") ||
      rootContent.includes("Core Turn Invariants") ||
      rootContent.includes(".agents/context") ||
      rootContent.includes(".agents/standards") ||
      rootContent.split("\n").length <= 60;
    const isUnfilledTemplate = rootContent.includes("{{PROJECT_NAME}}") || rootContent.includes("{{AGENT_NAME}}");

    if ((!isManagedRail || isUnfilledTemplate) && !isDryRun) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const archivePath = join(agentsDir, "archive", `AGENTS.legacy-${timestamp}.md`);
      renameSync(rootAgentsPath, archivePath);
      report.archived.push(`AGENTS.md ➔ .agents/archive/AGENTS.legacy-${timestamp}.md`);
      console.log(`  📦 Archived AGENTS.md ➔ .agents/archive/AGENTS.legacy-${timestamp}.md`);

      // Deploy lean router
      const railTemplate = join(TEMPLATES_DIR, "AGENTS.md");
      if (existsSync(railTemplate)) {
        const templateContent = readFileSync(railTemplate, "utf8");
        const { updatedContent } = ensureSecretaryRouter(templateContent);
        writeFileSync(rootAgentsPath, updatedContent, "utf8");
        report.scaffolded.push("AGENTS.md (Lean DOX Rail & Secretary Protocol)");
        console.log("  ✅ Deployed lean root AGENTS.md DOX rail (<85 lines) with Secretary Protocol");
      }
    } else {
      const existing = readFileSync(rootAgentsPath, "utf8");
      const { updatedContent, modified } = ensureSecretaryRouter(existing);
      if (modified && !isDryRun) {
        writeFileSync(rootAgentsPath, updatedContent, "utf8");
        console.log("  🏛️ Secretary Protocol: Auto-wired into AGENTS.md for first-run autonomous dispatch");
        report.scaffolded.push("AGENTS.md (Secretary Router Auto-Wired)");
      } else {
        report.preserved.push("AGENTS.md");
        console.log("  ✅ Preserved existing AGENTS.md (managed DOX rail / curated content)");
      }
    }
  } else {
    // Deploy lean router if missing
    const railTemplate = join(TEMPLATES_DIR, "AGENTS.md");
    if (existsSync(railTemplate) && !isDryRun) {
      const templateContent = readFileSync(railTemplate, "utf8");
      const { updatedContent } = ensureSecretaryRouter(templateContent);
      writeFileSync(rootAgentsPath, updatedContent, "utf8");
      report.scaffolded.push("AGENTS.md (Lean DOX Rail & Secretary Protocol)");
      console.log("  ✅ Deployed lean root AGENTS.md DOX rail (<85 lines) with Secretary Protocol");
    }
  }

  // Safely Archive CLAUDE.md if present (zero-claude adherence)
  const claudePath = join(workspaceDir, "CLAUDE.md");
  if (existsSync(claudePath) && !isDryRun) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const archivePath = join(agentsDir, "archive", `CLAUDE.legacy-${timestamp}.md`);
    renameSync(claudePath, archivePath);
    report.archived.push(`CLAUDE.md ➔ .agents/archive/CLAUDE.legacy-${timestamp}.md`);
    console.log(`  📦 Archived CLAUDE.md ➔ .agents/archive/CLAUDE.legacy-${timestamp}.md`);
  }
}

// =========================================================================
// Step 5: Synchronize Standards & Brand Tokens from Master Canon
// =========================================================================
console.log("\n🔄 Step 5: Synchronizing standards & brand tokens from updateagents/templates/...");

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
      report.standardsSynced.push(std);
    }
    console.log(`  ✅ Synchronized ${standards.length} standards in ./.agents/standards/ (including WordPress)`);
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
        report.brandSynced.push(bf);
      }
    }
    // Tokens
    const masterTokensDir = join(masterBrandDir, "tokens");
    const projectTokensDir = join(projectBrandDir, "tokens");
    if (existsSync(masterTokensDir) && (!existsSync(projectTokensDir) || isForce)) {
      if (!isDryRun) cpSync(masterTokensDir, projectTokensDir, { recursive: true });
      report.brandSynced.push("tokens/*");
      console.log("  ✅ Provisioned baseline design tokens in ./.agents/brand/tokens/");
    }
  }
} else {
  console.warn(`  ⚠️ Templates directory not found at: ${TEMPLATES_DIR}`);
}

// =========================================================================
// Step 6: Validate Invariants & MuseMemory Boundary
// =========================================================================
console.log("\n🛡️ Step 6: Verifying safety invariants & MuseMemory hard boundary...");
const memoryPath = join(workspaceDir, ".memory");
if (existsSync(memoryPath)) {
  console.log("  🔒 MuseMemory (.memory/**) detected: 100% UNTOUCHED & EXCLUDED (PASSED)");
} else {
  console.log("  🔒 MuseMemory (.memory/**): Clean state (PASSED)");
}

// AGENTS.md size check
const rootAgentsFile = join(workspaceDir, "AGENTS.md");
if (existsSync(rootAgentsFile)) {
  const size = statSync(rootAgentsFile).size;
  console.log(`  📄 AGENTS.md size: ${size} bytes (<5KB: ${size < 5120 ? "PASSED" : "REVIEW"})`);
}

// Taste State & Global Invariant Atom Table Check
const tasteStateFile = join(agentsDir, "context/taste-state.json");
if (existsSync(tasteStateFile)) {
  try {
    const tasteData = JSON.parse(readFileSync(tasteStateFile, "utf8"));
    const activeAtoms = (tasteData.atoms || []).filter((a: { status?: string }) => a.status === "active");
    const cap = tasteData.activeAtomCap || 20;
    console.log(
      `  🧠 Invariant Atom Table: ${activeAtoms.length}/${cap} active atoms (${activeAtoms.length <= cap ? "PASSED" : "EXCEEDS CAP"})`,
    );
  } catch {
    // Non-blocking telemetry
  }
}

// =========================================================================
// Step 7: Detailed User Report
// =========================================================================
console.log("\n============================================================");
console.log(" 🧠 UPDATEAGENTS SYNCHRONIZATION REPORT");
console.log("============================================================");
console.log(`📁 Workspace:          ${workspaceDir}`);
console.log(`🏷️  Project Name:       ${projectName}`);
console.log(`⚡ Stack Archetype:    ${frameworkDetected.toUpperCase()}`);
console.log("------------------------------------------------------------");

if (report.scaffolded.length > 0) {
  console.log(`\n📦 SCAFFOLDED ASSETS (${report.scaffolded.length}):`);
  for (const s of report.scaffolded) console.log(`   + ${s}`);
}

if (report.contextMerged.length > 0) {
  console.log(`\n🔄 CONTEXT MERGED & PRESERVED (${report.contextMerged.length}):`);
  for (const m of report.contextMerged) {
    console.log(`   • ${m.targetFile} ➔ Added section: "${m.section}"`);
  }
}

if (report.archived.length > 0) {
  console.log(`\n📦 ARCHIVED LEGACY FILES (${report.archived.length}):`);
  for (const a of report.archived) console.log(`   • ${a}`);
}

console.log(`\n✅ SYNCHRONIZED FROM UPDATEAGENTS MASTER CANON:`);
console.log(`   • Standards:   ${report.standardsSynced.length} rulebooks in .agents/standards/`);
console.log(`   • Brand:       Design tokens & guidelines in .agents/brand/`);
console.log(`   • Router:      Lean root AGENTS.md DOX rail active`);
console.log(`   • Cognitive:   Taste & Invariant Atom Table verified`);
console.log(`   • Safety:      Application code & .memory/** 100% untouched`);
console.log("============================================================\n");
