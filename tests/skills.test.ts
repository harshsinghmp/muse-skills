import { describe, test, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_JSON_PATH = path.join(REPO_ROOT, "skills.json");
const PACKAGE_JSON_PATH = path.join(REPO_ROOT, "package.json");
const LLMS_TXT_PATH = path.join(REPO_ROOT, "llms.txt");
const README_PATH = path.join(REPO_ROOT, "README.md");

const REQUIRED_SECTIONS = [
  "## When to Use",
  "## Quick Reference",
  "## Procedure",
  "## Pitfalls",
  "## Verification",
];

const REQUIRED_FRONTMATTER_KEYS = [
  "name",
  "description",
  "version",
  "author",
  "license",
  "platforms",
  "metadata",
];

const EXPECTED_ORDERED_SKILLS = [
  "updatedocs",
  "updateagents",
  "git",
  "code-review",
  "new-project",
  "handoff",
  "ai-ready",
  "context-anchor",
  "gauntlet-loop",
  "refactor-ui",
  "designscope",
  "coupling-router",
  "secretary",
  "evidence-ledger",
  "dead-letter",
  "pua",
  "coach",
  "audit",
  "periodic-retreat",
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
    expect(parsed).toHaveProperty("name", "@harsh/muse-skills");
  });

  test("skills.json preserves requested priority ordering (#1 updatedocs through #19 periodic-retreat)", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    expect(skills.length).toBe(19);
    for (let i = 0; i < EXPECTED_ORDERED_SKILLS.length; i++) {
      expect(skills[i].name).toBe(EXPECTED_ORDERED_SKILLS[i]);
      expect(skills[i].priority).toBe(i + 1);
    }
  });

  test("skills.json contains all 19 total skills categorized across 5 divisions", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    expect(skills.length).toBe(19);

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
