import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const registry = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "skills.json"), "utf8")) as {
  skills: Array<{ name: string; path: string }>;
};
const REQUIRED_SECTIONS = ["When to Use", "Quick Reference", "Procedure", "Pitfalls", "Verification"];

describe("Agent Skills specification", () => {
  for (const skill of registry.skills) {
    const file = path.join(REPO_ROOT, skill.path);
    const text = fs.readFileSync(file, "utf8");
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
    const fm = frontmatter?.[1] ?? "";
    const body = text.slice(frontmatter?.[0].length ?? 0);

    describe(skill.name, () => {
      test("frontmatter name matches the spec and the directory", () => {
        expect(frontmatter).not.toBeNull();
        const name = fm.match(/^name:\s*"?([^"\n]+)"?/m)?.[1]?.trim();
        expect(name).toBe(skill.name);
        expect(skill.name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        expect(skill.name.length).toBeLessThanOrEqual(64);
        expect(path.basename(path.dirname(file))).toBe(skill.name);
      });

      test("description is specific and within the 1,024-character limit", () => {
        const description = fm.match(/^description:\s*"([\s\S]*?)"\s*$/m)?.[1];
        expect(description).toBeTruthy();
        expect(description?.length ?? 0).toBeGreaterThan(40);
        expect(description?.length ?? 0).toBeLessThanOrEqual(1024);
        expect(description).toMatch(/\b(use when|trigger|when asked|when the user)\b/i);
      });

      test("required sections and anti-triggers are present", () => {
        for (const section of REQUIRED_SECTIONS) {
          expect(body, `missing section: ${section}`).toMatch(new RegExp(`^#{1,3}\\s+${section}`, "m"));
        }
        expect(body).toMatch(/Anti-Triggers|When NOT to Use/i);
      });

      test("reference links resolve from the skill directory", () => {
        for (const link of body.matchAll(/\]\((references\/[^)\s]+)\)/g)) {
          expect(fs.existsSync(path.join(path.dirname(file), link[1])), `missing ${link[1]}`).toBe(true);
        }
      });
    });
  }
});
