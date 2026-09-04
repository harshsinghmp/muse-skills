#!/usr/bin/env bun
/**
 * ⚡ Autonomous Skill Extraction Helper for Recurring Patterns
 * 
 * Packages verified problem-solving patterns into a standard, RFC-compliant Agent Skill.
 * Inspired by self-learning-skills and the Self-Improvement extraction workflow.
 * 
 * The 3 Extraction Gates:
 *   1. Recurrence Gate: Pattern observed across >=3 tasks/occurrences.
 *   2. Verification Gate: Solution verified by passing tests/code.
 *   3. Generalization Gate: Portable across codebases (no hardcoded environment paths or secrets).
 * 
 * Usage:
 *   bun scripts/extract-skill.ts --name <skill-name> --desc "<description>" [options]
 * 
 * Options:
 *   -n, --name <name>          Skill name in kebab-case (required)
 *   -d, --desc <desc>          Trigger-rich description (required)
 *   -o, --occurrences <count>  Observed recurrence count (must be >= 3)
 *   -e, --evidence <file|num>  Evidence log file path or recurrence count
 *   -t, --test-cmd <cmd>       Verification test command to validate solution
 *       --verified             Flag confirming solution is already tested and verified
 *   -p, --dest <path>          Target destination directory (auto-detected if omitted)
 *       --tags <tags>          Comma-separated tags (default: automation,workflow)
 *       --tools <tools>        Comma-separated tools (default: bash,view_file,write_to_file,run_command)
 *       --author <author>      Skill author (default: Agency Council)
 *   -r, --register             Auto-register in skills.json, llms.txt, and README.md
 *       --dry-run              Preview generated files and registration without writing
 *   -f, --force                Bypass gate checks or overwrite existing skill
 *       --non-interactive      Non-interactive mode
 *   -h, --help                 Show help message
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join, relative, basename } from "node:path";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";

// Fail fast on unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

export interface ExtractionOptions {
  name: string;
  desc: string;
  occurrences?: number;
  evidence?: string;
  testCmd?: string;
  verified?: boolean;
  dest?: string;
  tags?: string[];
  tools?: string[];
  author?: string;
  category?: string;
  priority?: number;
  register?: boolean;
  dryRun?: boolean;
  force?: boolean;
  cwd?: string;
}

export interface GateResult {
  ok: boolean;
  gate: "recurrence" | "verification" | "generalization";
  message: string;
}

/**
 * Gate 1: Check pattern recurrence (must be observed >= 3 times).
 */
export function checkRecurrenceGate(
  evidence?: string,
  occurrences?: number,
  force = false
): GateResult {
  if (force) {
    return { ok: true, gate: "recurrence", message: "Recurrence gate bypassed via --force." };
  }

  let count = occurrences ?? 0;

  if (evidence) {
    const num = parseInt(evidence, 10);
    if (!isNaN(num)) {
      count = Math.max(count, num);
    } else if (existsSync(evidence)) {
      try {
        const content = readFileSync(evidence, "utf8");
        // Count markdown checklist items, log entries, or occurrences
        const matches = content.match(/(- \[[ xX]\]|### Occurrence|\bseen\b|\bobserved\b|\bpattern\b)/gi);
        count = Math.max(count, matches ? matches.length : 1);
      } catch {
        // file read issue
      }
    }
  }

  if (count < 3) {
    return {
      ok: false,
      gate: "recurrence",
      message: `Pattern recurrence count (${count}) < 3. Only extract skills for proven patterns observed across at least 3 distinct tasks/sessions. Use --occurrences 3 or --force to override.`,
    };
  }

  return { ok: true, gate: "recurrence", message: `Recurrence verified (${count} occurrences).` };
}

/**
 * Gate 2: Check solution verification (must be verified via test command or explicit confirmation).
 */
export function checkVerificationGate(
  testCmd?: string,
  verified = false,
  force = false,
  cwd?: string
): GateResult {
  if (force) {
    return { ok: true, gate: "verification", message: "Verification gate bypassed via --force." };
  }

  if (testCmd) {
    const res = spawnSync(testCmd, {
      shell: true,
      cwd: cwd || process.cwd(),
      stdio: "pipe",
      encoding: "utf8",
    });

    if (res.status !== 0) {
      const errDetail = res.stderr?.trim() || res.stdout?.trim() || "Non-zero exit code";
      return {
        ok: false,
        gate: "verification",
        message: `Verification command failed: "${testCmd}". Exit code ${res.status}: ${errDetail.slice(0, 150)}`,
      };
    }
    return { ok: true, gate: "verification", message: `Test command passed cleanly: "${testCmd}".` };
  }

  if (!verified) {
    return {
      ok: false,
      gate: "verification",
      message: "Solution is not verified. Provide --test-cmd '<command>' or pass --verified to confirm working code/tests.",
    };
  }

  return { ok: true, gate: "verification", message: "Solution verified." };
}

/**
 * Gate 3: Check generalization (no hardcoded user paths, environment-specific tokens, or secrets).
 */
export function checkGeneralizationGate(
  texts: string[],
  force = false
): GateResult {
  if (force) {
    return { ok: true, gate: "generalization", message: "Generalization gate bypassed via --force." };
  }

  const combined = texts.join(" ");

  const checks: { pattern: RegExp; issue: string }[] = [
    { pattern: /\/home\/[a-zA-Z0-9_-]+/i, issue: "Hardcoded Linux home directory detected" },
    { pattern: /\/Users\/[a-zA-Z0-9_-]+/i, issue: "Hardcoded macOS home directory detected" },
    { pattern: /[A-Z]:\\[a-zA-Z0-9_\\-]+/i, issue: "Hardcoded Windows path detected" },
    { pattern: /(sk|ghp|npm|gho|glpat)-[a-zA-Z0-9_-]{10,}/i, issue: "Potential credential/secret detected" },
  ];

  for (const check of checks) {
    if (check.pattern.test(combined)) {
      return {
        ok: false,
        gate: "generalization",
        message: `Generalization check failed: ${check.issue}. Agent skills must be portable across all environments.`,
      };
    }
  }

  return { ok: true, gate: "generalization", message: "Generalization passed (no environmental bleed)." };
}

/**
 * Validate skill name format (kebab-case).
 */
export function validateSkillName(name: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

/**
 * Generate RFC-compliant SKILL.md content.
 */
export function generateSkillMd(opts: {
  name: string;
  description: string;
  version?: string;
  author?: string;
  category?: string;
  priority?: number;
  tags?: string[];
  tools?: string[];
  testCmd?: string;
}): string {
  const version = opts.version || "1.0.0";
  const author = opts.author || "Agency Council";
  const category = opts.category || "core-engine";
  const priority = opts.priority || 20;
  const tags = opts.tags && opts.tags.length > 0 ? opts.tags : ["automation", "workflow", "self-learning"];
  const tools = opts.tools && opts.tools.length > 0 ? opts.tools : ["bash", "view_file", "write_to_file", "run_command"];
  const title = opts.name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return `---
name: ${opts.name}
aliases: ["${opts.name}"]
description: "${opts.description.replace(/"/g, '\\"')}"
version: ${version}
author: ${author}
license: MIT
platforms: [macos, linux, windows]
category: ${category}
metadata:
  category: ${category}
  priority: ${priority}
  aliases: ["${opts.name}"]
  suggested_skills: ["updatedocs", "updateagents", "git"]
  hermes:
    tags: [${tags.join(", ")}]
    related_skills: [updatedocs, updateagents, git]
    suggested_skills: [updatedocs, updateagents, git]
    requires_tools: [${tools.join(", ")}]
  openclaw:
    category: ${category}
    suggested_skills: ["updatedocs", "updateagents", "git"]
    primary_triggers: ["execute ${opts.name}", "run ${opts.name}"]
    requires_tools: [${tools.join(", ")}]
  compatibility: [hermes, openclaw, claude-code, codex, cursor, gemini-cli, opencode]
---

# ⚡ ${opts.name} — ${title}

> **Core Mandate**: ${opts.description}

---

## When to Use

- User asks to execute, automate, or resolve issues matching \`${opts.name}\`.
- Repeated occurrences of the target pattern appear during development or operational sessions.
- Triggered when standard automated workflows require deterministic remediation without manual intervention.

---

## Quick Reference

| Action / Phase | Execution | Expected Outcome |
|:---|:---|:---|
| **Inspection** | Scan current workspace for pattern symptoms | Pinpoint targeted files and dependencies |
| **Execution** | Apply standardized solution logic | Eliminate root cause cleanly |
| **Verification** | Run verification tests and lint gates | 100% passing tests with zero regression |

---

## Procedure

\`\`\`mermaid
flowchart TD
    A["Step 1: Discover & Validate Context"] --> B["Step 2: Apply Deterministic Fix"]
    B --> C["Step 3: Verify & Document Evidence"]
\`\`\`

### Step 1: Discover & Validate Context
1. Locate target files and capture initial diagnostic state.
2. Confirm the failure mode matches the established trigger criteria.

### Step 2: Apply Deterministic Fix
1. Execute surgical modifications to resolve the recurring issue.
2. Preserve existing invariants and project conventions.

### Step 3: Verify & Document Evidence
1. Execute the verification suite:
   \`\`\`bash
   ${opts.testCmd || "bun test"}
   \`\`\`
2. Verify exit code is 0 and all checks pass without error.
3. Record execution receipt and confirm deliverable status.

---

## Pitfalls

- **Over-Generalization**: Never trigger this skill on unrelated failure modes.
- **Bypassing Verification**: Always run deterministic tests before declaring completion.
- **Environmental Drift**: Keep solutions isolated; never hardcode local paths or credentials.

---

## Verification

1. Run the test suite:
   \`\`\`bash
   ${opts.testCmd || "bun test"}
   \`\`\`
2. Verify all assertions pass cleanly.
3. Confirm companion documentation remains synchronized.
`;
}

/**
 * Generate companion README.md content.
 */
export function generateReadmeMd(opts: { name: string; description: string; tags?: string[] }): string {
  const title = opts.name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return `# ${opts.name}

> ${opts.description}

## Overview

\`${opts.name}\` is an RFC-compliant AI agent skill extracted from verified recurring problem-solving patterns.

## Installation

\`\`\`bash
npx skills add harshsinghmp/muse-skills --skill ${opts.name}
\`\`\`

## Architecture & Sections

- \`SKILL.md\`: Core agent execution contract (RFC sections: When to Use, Quick Reference, Procedure, Pitfalls, Verification).
- \`agents/openai.yaml\`: Tool definition for OpenAI/Codex agent runtimes.
- \`README.md\`: Human-facing documentation.

## Verification

\`\`\`bash
bun test
\`\`\`
`;
}

/**
 * Generate companion agents/openai.yaml content.
 */
export function generateOpenAiYaml(opts: { name: string; description: string; tools?: string[] }): string {
  const tools = opts.tools && opts.tools.length > 0 ? opts.tools : ["bash", "view_file", "write_to_file", "run_command"];
  const toolList = tools.map((t) => `  - type: function\n    function:\n      name: ${t}`).join("\n");

  return `name: ${opts.name}
description: "${opts.description.replace(/"/g, '\\"')}"
tools:
${toolList}
instructions: |
  You are the ${opts.name} agent specialist.
  Follow the deterministic procedure defined in SKILL.md.
  Always verify work with executable tests before completing the task.
`;
}

/**
 * Scaffolds the skill and optionally registers it in the catalog.
 */
export function extractSkill(options: ExtractionOptions): {
  success: boolean;
  skillDir: string;
  filesCreated: string[];
  registered: { skillsJson: boolean; llmsTxt: boolean; readme: boolean };
  error?: string;
} {
  const cwd = options.cwd || process.cwd();

  // Validate skill name
  if (!validateSkillName(options.name)) {
    return {
      success: false,
      skillDir: "",
      filesCreated: [],
      registered: { skillsJson: false, llmsTxt: false, readme: false },
      error: `Invalid skill name "${options.name}". Name must be kebab-case (e.g. "my-extracted-skill").`,
    };
  }

  // Gate 1: Recurrence
  const recurrence = checkRecurrenceGate(options.evidence, options.occurrences, options.force);
  if (!recurrence.ok) {
    return {
      success: false,
      skillDir: "",
      filesCreated: [],
      registered: { skillsJson: false, llmsTxt: false, readme: false },
      error: recurrence.message,
    };
  }

  // Gate 2: Verification
  const verification = checkVerificationGate(options.testCmd, options.verified, options.force, cwd);
  if (!verification.ok) {
    return {
      success: false,
      skillDir: "",
      filesCreated: [],
      registered: { skillsJson: false, llmsTxt: false, readme: false },
      error: verification.message,
    };
  }

  // Gate 3: Generalization
  const generalization = checkGeneralizationGate(
    [options.name, options.desc, options.evidence || "", options.testCmd || ""],
    options.force
  );
  if (!generalization.ok) {
    return {
      success: false,
      skillDir: "",
      filesCreated: [],
      registered: { skillsJson: false, llmsTxt: false, readme: false },
      error: generalization.message,
    };
  }

  // Resolve target directory
  let skillDir = "";
  if (options.dest) {
    skillDir = resolve(cwd, options.dest);
    if (basename(skillDir) !== options.name) {
      skillDir = join(skillDir, options.name);
    }
  } else {
    // Check if skills.json exists and uses top-level dirs
    const skillsJsonPath = join(cwd, "skills.json");
    if (existsSync(skillsJsonPath)) {
      try {
        const data = JSON.parse(readFileSync(skillsJsonPath, "utf8"));
        const isTopLevel = data.skills?.some((s: any) => s.path && !s.path.startsWith(".agents/"));
        if (isTopLevel) {
          skillDir = join(cwd, options.name);
        }
      } catch {
        // fallback
      }
    }

    if (!skillDir) {
      if (existsSync(join(cwd, ".agents", "skills"))) {
        skillDir = join(cwd, ".agents", "skills", options.name);
      } else if (existsSync(join(cwd, "skills"))) {
        skillDir = join(cwd, "skills", options.name);
      } else {
        skillDir = join(cwd, options.name);
      }
    }
  }

  if (existsSync(skillDir) && !options.force && !options.dryRun) {
    return {
      success: false,
      skillDir,
      filesCreated: [],
      registered: { skillsJson: false, llmsTxt: false, readme: false },
      error: `Skill directory "${skillDir}" already exists. Use --force to overwrite.`,
    };
  }

  const skillMdContent = generateSkillMd({
    name: options.name,
    description: options.desc,
    tags: options.tags,
    tools: options.tools,
    author: options.author,
    category: options.category,
    priority: options.priority,
    testCmd: options.testCmd,
  });

  const readmeContent = generateReadmeMd({
    name: options.name,
    description: options.desc,
    tags: options.tags,
  });

  const openAiYamlContent = generateOpenAiYaml({
    name: options.name,
    description: options.desc,
    tools: options.tools,
  });

  const filesCreated: string[] = [];

  if (!options.dryRun) {
    mkdirSync(join(skillDir, "agents"), { recursive: true });
    mkdirSync(join(skillDir, "references"), { recursive: true });

    writeFileSync(join(skillDir, "SKILL.md"), skillMdContent, "utf8");
    filesCreated.push(join(skillDir, "SKILL.md"));

    writeFileSync(join(skillDir, "README.md"), readmeContent, "utf8");
    filesCreated.push(join(skillDir, "README.md"));

    writeFileSync(join(skillDir, "agents", "openai.yaml"), openAiYamlContent, "utf8");
    filesCreated.push(join(skillDir, "agents", "openai.yaml"));
  } else {
    filesCreated.push(join(skillDir, "SKILL.md (simulated)"));
    filesCreated.push(join(skillDir, "README.md (simulated)"));
    filesCreated.push(join(skillDir, "agents", "openai.yaml (simulated)"));
  }

  // Registry updates if --register requested
  const registered = { skillsJson: false, llmsTxt: false, readme: false };

  if (options.register) {
    const relSkillPath = relative(cwd, join(skillDir, "SKILL.md")).replace(/\\/g, "/");

    // 1. skills.json
    const skillsJsonPath = join(cwd, "skills.json");
    if (existsSync(skillsJsonPath)) {
      try {
        const content = readFileSync(skillsJsonPath, "utf8");
        const json = JSON.parse(content);
        if (Array.isArray(json.skills)) {
          const exists = json.skills.some((s: any) => s.name === options.name);
          if (!exists) {
            json.skills.push({
              name: options.name,
              description: options.desc,
              path: relSkillPath,
              version: "1.0.0",
              tools: options.tools || ["bash", "view", "write", "edit", "glob", "grep", "ls"],
              tags: options.tags || ["automation", "workflow", "self-learning"],
            });
            if (!options.dryRun) {
              writeFileSync(skillsJsonPath, JSON.stringify(json, null, 2) + "\n", "utf8");
            }
            registered.skillsJson = true;
          }
        }
      } catch (e) {
        console.error("Warning: Failed to update skills.json:", e);
      }
    }

    // 2. llms.txt
    const llmsTxtPath = join(cwd, "llms.txt");
    if (existsSync(llmsTxtPath)) {
      try {
        let llmsContent = readFileSync(llmsTxtPath, "utf8");
        if (!llmsContent.includes(`- [${options.name}]`)) {
          llmsContent = llmsContent.trimEnd() + `\n- [${options.name}](${relSkillPath}): ${options.desc}\n`;
          if (!options.dryRun) {
            writeFileSync(llmsTxtPath, llmsContent, "utf8");
          }
          registered.llmsTxt = true;
        }
      } catch (e) {
        console.error("Warning: Failed to update llms.txt:", e);
      }
    }

    // 3. README.md
    const readmePath = join(cwd, "README.md");
    if (existsSync(readmePath)) {
      try {
        let readmeText = readFileSync(readmePath, "utf8");
        if (!readmeText.includes(`\`${options.name}\``) && !readmeText.includes(`[${options.name}]`)) {
          // Check if there is a skills table
          const tableMatch = readmeText.indexOf("| Skill | Description |");
          if (tableMatch !== -1) {
            const row = `| [\`${options.name}\`](${relSkillPath}) | ${options.desc} |\n`;
            const headerEnd = readmeText.indexOf("\n", readmeText.indexOf("|:---|", tableMatch));
            if (headerEnd !== -1) {
              readmeText = readmeText.slice(0, headerEnd + 1) + row + readmeText.slice(headerEnd + 1);
              if (!options.dryRun) {
                writeFileSync(readmePath, readmeText, "utf8");
              }
              registered.readme = true;
            }
          }
        }
      } catch (e) {
        console.error("Warning: Failed to update README.md:", e);
      }
    }
  }

  return {
    success: true,
    skillDir,
    filesCreated,
    registered,
  };
}

// CLI Execution Entrypoint
if (import.meta.main) {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      name: { type: "string", short: "n" },
      desc: { type: "string", short: "d" },
      occurrences: { type: "string", short: "o" },
      evidence: { type: "string", short: "e" },
      "test-cmd": { type: "string", short: "t" },
      verified: { type: "boolean", default: false },
      dest: { type: "string", short: "p" },
      tags: { type: "string" },
      tools: { type: "string" },
      author: { type: "string" },
      register: { type: "boolean", short: "r", default: false },
      "dry-run": { type: "boolean", default: false },
      force: { type: "boolean", short: "f", default: false },
      "non-interactive": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`
⚡ Autonomous Skill Extraction Helper

Extracts verified, recurring problem-solving patterns into standard RFC-compliant Agent Skills.

Usage:
  bun scripts/extract-skill.ts --name <skill-name> --desc "<description>" [options]

Required Options:
  -n, --name <name>          Skill name in kebab-case
  -d, --desc <desc>          Trigger-rich description naming user intents

Gate Validation Options:
  -o, --occurrences <count>  Observed recurrence count (must be >= 3)
  -e, --evidence <file|num>  Evidence log file path or recurrence count
  -t, --test-cmd <cmd>       Verification command to test solution
      --verified             Flag asserting solution is verified by existing tests
  -f, --force                Bypass gate checks or overwrite existing skill

Scaffolding & Catalog Options:
  -p, --dest <path>          Target directory for new skill
      --tags <tag1,tag2>     Comma-separated tags
      --tools <tool1,tool2>  Comma-separated tools
      --author <author>      Skill author (default: Agency Council)
  -r, --register             Auto-register in skills.json, llms.txt, and README.md
      --dry-run              Simulate extraction without writing files
  -h, --help                 Show this help message
`);
    process.exit(0);
  }

  const name = values.name || positionals[0];
  const desc = values.desc || positionals[1];

  if (!name || !desc) {
    console.error("Error: --name and --desc are required.");
    console.error("Run with --help for full usage information.");
    process.exit(1);
  }

  const occurrences = values.occurrences ? parseInt(values.occurrences, 10) : undefined;
  const tags = values.tags ? values.tags.split(",").map((s) => s.trim()) : undefined;
  const tools = values.tools ? values.tools.split(",").map((s) => s.trim()) : undefined;

  console.log(`\n🔍 Evaluating Skill Extraction Gates for "${name}"...`);

  const result = extractSkill({
    name,
    desc,
    occurrences,
    evidence: values.evidence,
    testCmd: values["test-cmd"],
    verified: values.verified,
    dest: values.dest,
    tags,
    tools,
    author: values.author,
    register: values.register,
    dryRun: values["dry-run"],
    force: values.force,
  });

  if (!result.success) {
    console.error(`\n❌ Extraction Gate Failure:\n${result.error}\n`);
    process.exit(1);
  }

  console.log(`\n✅ Skill Extraction Successful!`);
  console.log(`📁 Destination: ${result.skillDir}`);
  console.log(`📄 Files generated:`);
  for (const f of result.filesCreated) {
    console.log(`   + ${f}`);
  }

  if (values.register) {
    console.log(`\n📋 Catalog Registration:`);
    console.log(`   - skills.json: ${result.registered.skillsJson ? "Updated" : "Unchanged/Skipped"}`);
    console.log(`   - llms.txt:    ${result.registered.llmsTxt ? "Updated" : "Unchanged/Skipped"}`);
    console.log(`   - README.md:   ${result.registered.readme ? "Updated" : "Unchanged/Skipped"}`);
  }

  if (values["dry-run"]) {
    console.log(`\nℹ️ Dry-run completed. No files were written.`);
  }
}
