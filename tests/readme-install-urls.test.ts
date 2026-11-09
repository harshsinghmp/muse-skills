import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_ROOT = path.join(REPO_ROOT, "skills");

function readmes(dir: string): string[] {
  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...readmes(full));
    else if (entry.name === "README.md") found.push(full);
  }
  return found;
}

describe("skill README install commands and repository URLs", () => {
  test("every tree/blob URL resolves inside the repository", () => {
    const broken: string[] = [];
    for (const readme of readmes(SKILLS_ROOT)) {
      const content = fs.readFileSync(readme, "utf8");
      for (const match of content.matchAll(
        /https:\/\/github\.com\/harshsinghmp\/muse-skills\/(?:tree|blob)\/[^/\s]+\/([^\s)`'"]+)/g,
      )) {
        const target = decodeURIComponent(match[1].replace(/[#?].*$/, "").replace(/[),.]+$/, ""));
        if (!fs.existsSync(path.join(REPO_ROOT, target))) {
          broken.push(`${path.relative(REPO_ROOT, readme)} -> ${target}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  test("README install blocks use the canonical --skill form with the directory name", () => {
    const offenders: string[] = [];
    for (const readme of readmes(SKILLS_ROOT)) {
      if (readme.includes(`${path.sep}templates${path.sep}`)) continue;
      const content = fs.readFileSync(readme, "utf8");
      if (content.includes("npx skills run")) offenders.push(`${path.relative(REPO_ROOT, readme)}: npx skills run`);
      const commands = [...content.matchAll(/npx skills add harshsinghmp\/muse-skills --skill ([a-z0-9-]+)/g)].map(
        (match) => match[1],
      );
      if (commands.length > 1) offenders.push(`${path.relative(REPO_ROOT, readme)}: multiple install blocks`);
      const skillName = path.basename(path.dirname(readme));
      if (commands.length === 1 && commands[0] !== skillName) {
        offenders.push(`${path.relative(REPO_ROOT, readme)}: --skill ${commands[0]} != ${skillName}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test("relay README uses the registered name", () => {
    const relay = fs.readFileSync(path.join(SKILLS_ROOT, "context-orchestration/relay/README.md"), "utf8");
    expect(relay.startsWith("# relay Skill")).toBe(true);
    expect(relay).toContain("/relay");
    expect(relay).not.toContain("/handoff");
  });
});
