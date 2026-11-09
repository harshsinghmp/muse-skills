import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  detectAgentTemplateProfile,
  renderAgentsTemplate,
} from "../skills/core-engine/updateagents/scripts/agents-template";

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(REPO_ROOT, "skills/core-engine/updateagents/templates/AGENTS.md");
const UPDATEAGENTS_SCRIPT = path.join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");

function withTempDir<T>(fn: (dir: string) => T): T {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "updateagents-next3-"));
  try {
    return fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe("updateagents template: Next 3 follow-ups", () => {
  test("renders the rule and protocol without unresolved placeholders", () => {
    withTempDir((dir) => {
      const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
      const rendered = renderAgentsTemplate(template, detectAgentTemplateProfile(dir));

      expect(rendered).toContain("**Next 3** block after the Layman Report");
      expect(rendered).toContain("**Next 3 (after the Layman Report, highly technical work only)**");
      expect(rendered).toMatch(/highly technical/i);
      expect(rendered).toContain("most important first");
      expect(rendered).toContain("Never replaces, truncates, or reorders the technical report");
      expect(rendered).not.toMatch(/\{\{[A-Z_]+\}\}/);
    });
  });

  test("scaffolding a fresh project writes AGENTS.md with the Next 3 rule", () => {
    withTempDir((dir) => {
      const res = spawnSync("bun", [UPDATEAGENTS_SCRIPT, dir], { encoding: "utf8" });
      expect(res.status, res.stderr).toBe(0);

      const agentsPath = path.join(dir, "AGENTS.md");
      expect(fs.existsSync(agentsPath)).toBe(true);
      const content = fs.readFileSync(agentsPath, "utf8");

      expect(content).toContain("**Next 3** block after the Layman Report");
      expect(content).toContain("**Next 3 (after the Layman Report, highly technical work only)**");
      expect(content).toContain("Layman Report");
      expect(content).not.toMatch(/\{\{[A-Z_]+\}\}/);
    }, 30000);
  });
});
