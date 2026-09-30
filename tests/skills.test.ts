import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_JSON_PATH = path.join(REPO_ROOT, "skills.json");
const PACKAGE_JSON_PATH = path.join(REPO_ROOT, "package.json");
const LLMS_TXT_PATH = path.join(REPO_ROOT, "llms.txt");
const README_PATH = path.join(REPO_ROOT, "README.md");

const REQUIRED_SECTIONS = ["## When to Use", "## Quick Reference", "## Procedure", "## Pitfalls", "## Verification"];

const REQUIRED_FRONTMATTER_KEYS = ["name", "description", "version", "author", "license", "platforms", "metadata"];

const EXPECTED_ORDERED_SKILLS = [
  "updatedocs",
  "updateagents",
  "git",
  "code-review",
  "new-project",
  "relay",
  "context-anchor",
  "gauntlet-loop",
  "refactor",
  "designscope",
  "coupling-router",
  "secretary",
  "evidence-ledger",
  "dead-letter",
  "pua",
  "coach",
  "audit",
  "periodic-retreat",
  "clean-system-cache",
  "humanize",
  "animate",
  "design",
  "paidads",
  "seo",
  "webdev",
  "mobile",
  "smm",
  "content",
  "analytics",
  "automation",
  "devops",
  "ops",
  "growth",
  "qa-launch",
  "client-comms",
  "gtm",
  "incident-response",
  "database",
  "telegram",
  "research",
  "sales-enablement",
  "retain",
  "muse-security",
  "accounts",
  "brand",
  "crm",
];

describe("Muse Skills Registry & Catalog Integrity (TDD)", () => {
  test("skills.json exists and is valid JSON", () => {
    expect(fs.existsSync(SKILLS_JSON_PATH)).toBe(true);
    const content = fs.readFileSync(SKILLS_JSON_PATH, "utf8");
    const parsed = JSON.parse(content);
    expect(parsed).toHaveProperty("skills");
    expect(Array.isArray(parsed.skills)).toBe(true);
  });

  test("package.json exists and is valid JSON", () => {
    expect(fs.existsSync(PACKAGE_JSON_PATH)).toBe(true);
    const content = fs.readFileSync(PACKAGE_JSON_PATH, "utf8");
    const parsed = JSON.parse(content);
    expect(parsed).toHaveProperty("name", "@harshsinghmp/muse-skills");
  });

  test("skills.json preserves canonical ordering (updatedocs through crm)", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    expect(skills.length).toBe(46);
    for (let i = 0; i < EXPECTED_ORDERED_SKILLS.length; i++) {
      expect(skills[i].name).toBe(EXPECTED_ORDERED_SKILLS[i]);
    }
  });

  test("skills.json contains all 46 total skills categorized across 6 divisions", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    expect(skills.length).toBe(46);

    const skillNames = skills.map((s: { name: string }) => s.name);
    for (const skill of EXPECTED_ORDERED_SKILLS) {
      expect(skillNames).toContain(skill);
    }

    const categories = new Set(skills.map((s: { category: string }) => s.category));
    expect(categories.has("core-engine")).toBe(true);
    expect(categories.has("quality-review")).toBe(true);
    expect(categories.has("context-orchestration")).toBe(true);
    expect(categories.has("design-interface")).toBe(true);
    expect(categories.has("reflection-maintenance")).toBe(true);
    expect(categories.has("agency-delivery")).toBe(true);
  });

  test("every skill defined in skills.json exists and conforms to Hermes, OpenClaw, and RFC agent specifications", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));

    for (const skill of skills) {
      const skillPath = path.join(REPO_ROOT, skill.path);
      expect(fs.existsSync(skillPath)).toBe(true);

      const content = fs.readFileSync(skillPath, "utf8");
      expect(content.startsWith("---")).toBe(true);

      const parts = content.split("---");
      expect(parts.length).toBeGreaterThanOrEqual(3);

      const frontmatter = parts[1];
      for (const key of REQUIRED_FRONTMATTER_KEYS) {
        expect(frontmatter).toContain(`${key}:`);
      }

      // Check Hermes & OpenClaw metadata standards
      expect(frontmatter).toContain("category:");
      expect(frontmatter).toContain("priority:");
      expect(frontmatter).toContain("suggested_skills:");
      expect(frontmatter).toContain("hermes:");
      expect(frontmatter).toContain("openclaw:");

      // Check required markdown sections
      for (const section of REQUIRED_SECTIONS) {
        expect(content).toContain(section);
      }

      // Check companion files: README.md and agents/openai.yaml
      const skillDir = path.dirname(skillPath);
      const skillReadme = path.join(skillDir, "README.md");
      const skillOpenAiYaml = path.join(skillDir, "agents", "openai.yaml");

      expect(fs.existsSync(skillReadme)).toBe(true);
      expect(fs.existsSync(skillOpenAiYaml)).toBe(true);

      const openAiYamlContent = fs.readFileSync(skillOpenAiYaml, "utf8");
      expect(openAiYamlContent).toContain(`name: ${skill.name}`);
      expect(openAiYamlContent).toContain("tools:");
      expect(openAiYamlContent).toContain("instructions:");
    }
  });

  test("llms.txt registers all skills in priority order", () => {
    expect(fs.existsSync(LLMS_TXT_PATH)).toBe(true);
    const llmsContent = fs.readFileSync(LLMS_TXT_PATH, "utf8");
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));

    for (const skill of skills) {
      expect(llmsContent).toContain(`- [${skill.name}](${skill.path})`);
    }
  });

  test("README.md registers all skills in tables and tree", () => {
    expect(fs.existsSync(README_PATH)).toBe(true);
    const readmeContent = fs.readFileSync(README_PATH, "utf8");
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));

    for (const skill of skills) {
      expect(readmeContent).toContain(skill.name);
    }
  });
});

describe("Invocation UX & conventions", () => {
  test("every skills.json skill's SKILL.md frontmatter contains argument-hint and user-invocable: true", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));

    for (const skill of skills) {
      const skillPath = path.join(REPO_ROOT, skill.path);
      const content = fs.readFileSync(skillPath, "utf8");
      const frontmatter = content.split("---")[1];
      expect(frontmatter).toContain("argument-hint:");
      expect(frontmatter).toContain("user-invocable: true");
    }
  });

  test("every agency-delivery skill body carries a Modes table", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    const agencySkills = skills.filter((s: { category: string }) => s.category === "agency-delivery");
    expect(agencySkills.length).toBeGreaterThan(0);

    for (const skill of agencySkills) {
      const skillPath = path.join(REPO_ROOT, skill.path);
      const content = fs.readFileSync(skillPath, "utf8");
      const body = content.split("---").slice(2).join("---");
      expect(body).toMatch(/\| Mode \|/);
    }
  });

  test("secretary/references/dispatch.md stays in zero-drift synchronization with skills.json and reference modes", () => {
    const res = spawnSync("bun", ["scripts/sync-dispatch.ts", "--check"], { encoding: "utf8", cwd: REPO_ROOT });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("perfect sync");
  });
});

describe("Two-Tier Identity Onboarding, Strategic Vision (vision.md) Convention & CREDITS.md Integrity (TDD)", () => {
  test("root CREDITS.md exists and contains open-source attributions", () => {
    const creditsPath = path.join(REPO_ROOT, "CREDITS.md");
    expect(fs.existsSync(creditsPath)).toBe(true);
    const content = fs.readFileSync(creditsPath, "utf8");
    expect(content).toContain("Daniel Miessler");
    expect(content).toContain("Refactoring UI");
    expect(content).toContain("Linus Torvalds");
    expect(content).toContain("Astro");
    expect(content).toContain("UnoCSS");
    expect(content).toContain("Bun");
    expect(content).toContain("Biome");
  });

  test("updateagents AGENTS.md template encodes Two-Tier Identity Cascade and vision.md", () => {
    const templatePath = path.join(REPO_ROOT, "skills/core-engine/updateagents/templates/AGENTS.md");
    const content = fs.readFileSync(templatePath, "utf8");
    expect(content).toContain("Two-Tier Identity & Context Resolution Cascade");
    expect(content).toContain("~/.agents/identity/");
    expect(content).toContain("vision.md");
  });

  test("updateagents and secretary onboard references exist", () => {
    const updateagentsOnboard = path.join(REPO_ROOT, "skills/core-engine/updateagents/references/onboard.md");
    const secretaryOnboard = path.join(REPO_ROOT, "skills/context-orchestration/secretary/references/onboard.md");
    expect(fs.existsSync(updateagentsOnboard)).toBe(true);
    expect(fs.existsSync(secretaryOnboard)).toBe(true);
  });

  test("updateagents CLI supports --onboard and --global flags", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("--onboard");
    expect(res.stdout).toContain("--global");
  });

  test("stack.md Golden Stack Fence template exists with allowlist, blacklist, and Council Lead", () => {
    const stackTemplatePath = path.join(
      REPO_ROOT,
      "skills/core-engine/updateagents/templates/.agents/context/stack.md",
    );
    expect(fs.existsSync(stackTemplatePath)).toBe(true);
    const content = fs.readFileSync(stackTemplatePath, "utf8");
    expect(content).toContain("Approved Tech Stack & Package Allowlist");
    expect(content).toContain("Primary Council Lead");
    expect(content).toContain("Approved Libraries (Allowlist)");
    expect(content).toContain("Forbidden Dependencies (Blacklist)");
    expect(content).toContain("Zero-Drift Dependency Invariant");
  });

  test("context index.md template references stack.md and global identity baseline", () => {
    const indexTemplatePath = path.join(
      REPO_ROOT,
      "skills/core-engine/updateagents/templates/.agents/context/index.md",
    );
    const content = fs.readFileSync(indexTemplatePath, "utf8");
    expect(content).toContain("stack.md");
    expect(content).toContain("Global Identity Baseline");
    expect(content).toContain("~/.agents/identity/");
  });

  test("updateagents CLI supports --stack-guard, --closeout, and --check flags", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("--stack-guard");
    expect(res.stdout).toContain("--closeout");
    expect(res.stdout).toContain("--check");
  });

  test("checkStackDrift passes on clean repository", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--stack-guard"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Stack Drift Guard Passed");
  });

  test("anti-patterns.md and visual-inspection.md standards templates exist with required invariants", () => {
    const standardsDir = path.join(REPO_ROOT, "skills/core-engine/updateagents/templates/.agents/standards");
    const antiPatternsPath = path.join(standardsDir, "anti-patterns.md");
    const visualInspectionPath = path.join(standardsDir, "visual-inspection.md");

    expect(fs.existsSync(antiPatternsPath)).toBe(true);
    expect(fs.existsSync(visualInspectionPath)).toBe(true);

    const antiPatterns = fs.readFileSync(antiPatternsPath, "utf8");
    expect(antiPatterns).toContain("Negative Constraints & Architectural Anti-Patterns");
    expect(antiPatterns).toContain("Universal Agent Anti-Patterns");
    expect(antiPatterns).toContain("Verification Gate Before Commit");

    const visual = fs.readFileSync(visualInspectionPath, "utf8");
    expect(visual).toContain("Visual Context & Multimodal UI Verification");
    expect(visual).toContain("Screenshot Storage Invariant");
    expect(visual).toContain("./.agents/brand/screenshots/");
  });

  test("updateagents CLI supports --budget, --install-hook, --subapp, and --lint-context flags", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("--budget");
    expect(res.stdout).toContain("--install-hook");
    expect(res.stdout).toContain("--subapp");
    expect(res.stdout).toContain("--lint-context");
    expect(res.stdout).toContain("--sync-ide");
    expect(res.stdout).toContain("--lint-rules");
    expect(res.stdout).toContain("--archive-sprints");
  });

  test("anti-patterns.md contains code-fenced Anti-Deltas", () => {
    const antiPatternsPath = path.join(
      REPO_ROOT,
      "skills/core-engine/updateagents/templates/.agents/standards/anti-patterns.md",
    );
    const content = fs.readFileSync(antiPatternsPath, "utf8");
    expect(content).toContain("Anti-Delta: Client-Side Data Fetching vs Server Component");
    expect(content).toContain("Anti-Delta: Unsized Image vs Layout-Stable Media");
    expect(content).toContain("Anti-Delta: Unvalidated Payload vs Structured Zod Envelope");
    expect(content).toContain("Anti-Delta: SQL Injection vs Parameterized Queries");
    expect(content).toContain("// ❌ DON'T:");
    expect(content).toContain("// ✅ DO:");
  });

  test("lintContextLinks and lintRulesAgainstDependencies pass on repository context", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--lint-context"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Context Lint Passed");

    const rulesRes = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--lint-rules"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(rulesRes.status).toBe(0);
    expect(rulesRes.stdout).toContain("Rule-to-Dependency Lint Passed");
  });

  test("auditContextBudget, installGitPreCommitHook, and sliceSubAppContext work in sandbox", () => {
    const tempDir = fs.mkdtempSync(path.join(REPO_ROOT, "tmp-test-suite-"));
    try {
      fs.mkdirSync(path.join(tempDir, "apps/web-portal"), { recursive: true });

      // 1. Test sliceSubAppContext
      const sliceRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", tempDir, "--subapp", "web-portal"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(sliceRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, "apps/web-portal/.agents/context/index.md"))).toBe(true);

      // 2. Test auditContextBudget on subapp
      const budgetRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", path.join(tempDir, "apps/web-portal"), "--budget"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(budgetRes.status).toBe(0);
      expect(budgetRes.stdout).toContain("HEALTHY");

      // 3. Test installGitPreCommitHook
      fs.mkdirSync(path.join(tempDir, ".git"), { recursive: true });
      const hookRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", tempDir, "--install-hook"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(hookRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, ".git/hooks/pre-commit"))).toBe(true);

      // 4. Test syncIdeAdapters
      const ideRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", tempDir, "--sync-ide"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(ideRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, ".cursor/rules/frontend-nextjs.mdc"))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, ".github/copilot-instructions.md"))).toBe(true);

      // 5. Test archiveHistoricalSprints
      fs.mkdirSync(path.join(tempDir, ".agents/context"), { recursive: true });
      fs.writeFileSync(
        path.join(tempDir, ".agents/context/current.md"),
        "## 1. Live Reality\n- Task\n\n## 2. Verified Shipped Reality\n1. **Aged Item** (2025-01-01):\n   - Old work\n",
        "utf8",
      );
      const archiveRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", tempDir, "--archive-sprints"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(archiveRes.status).toBe(0);
      expect(archiveRes.stdout).toContain("Archived 1 milestone");
      expect(fs.existsSync(path.join(tempDir, ".agents/archive/milestones"))).toBe(true);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
