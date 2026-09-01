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

const EXPECTED_NEW_SKILLS = [
  "gauntlet-loop",
  "secretary-controller",
  "coupling-router",
  "evidence-ledger",
  "daily-standup-coach",
  "periodic-retreat",
  "brain-audit",
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

  test("skills.json preserves flagship skill ordering", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    expect(skills[0].name).toBe("new-project");
    expect(skills[1].name).toBe("updateagents");
  });

  test("skills.json contains all 16 total skills (9 baseline + 7 evolution skills)", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    expect(skills.length).toBe(16);

    const skillNames = skills.map((s: { name: string }) => s.name);
    for (const newSkill of EXPECTED_NEW_SKILLS) {
      expect(skillNames).toContain(newSkill);
    }
  });

  test("every skill defined in skills.json exists and conforms to the RFC specification", () => {
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

  test("llms.txt registers all skills", () => {
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
