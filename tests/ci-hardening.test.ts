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

  test("CI runs the security audit and a post-release smoke workflow", () => {
    const ci = read(".github/workflows/ci.yml");
    expect(ci).toContain("security-audit:");
    expect(ci).toContain("boundary-audit.ts -p .");
    expect(ci).toContain("--audit-lockfile .");
    expect(ci).toContain("needs: [lint, type-check, test, routing-matrix, secret-scan, security-audit]");

    const smoke = read(".github/workflows/release-smoke.yml");
    expect(smoke).toContain("release:");
    expect(smoke).toContain("release:smoke");
    expect(read(".github/workflows/release.yml")).toContain("bun run release:smoke");
    expect(JSON.parse(read("package.json")).scripts["release:smoke"]).toBe("bun scripts/release-smoke.ts");
    expect(ci).toContain("bun run check:deps");
    expect(read(".github/workflows/release.yml")).toContain("bun run check:ledger");

    // The routing matrix is a first-class check, not a test-suite side effect.
    expect(ci).toContain("name: routing-matrix");
    expect(ci).toContain("bun run check:routing:matrix");
    expect(read(".github/workflows/landing-gate.yml")).toContain('"routing-matrix"');

    // Checksums prove the artifact is intact; the install smoke proves it is usable.
    const smokeScript = read("scripts/release-smoke.ts");
    expect(smokeScript).toContain("installSmoke");
    expect(smokeScript).toContain("updateagents/scripts/doctor.ts");
  });

  test("the release smoke installs the tag and runs the shipped doctor", async () => {
    const { installSmoke } = await import("../scripts/release-smoke");
    const result = installSmoke();
    const { version } = JSON.parse(read("package.json")) as { version: string };
    expect(result.version).toBe(`v${version}`);
    expect(result.destinations).toBeGreaterThanOrEqual(2);
    expect(result.skills).toBeGreaterThanOrEqual(46);
  }, 120_000);

  test("harness baseline refresh cannot auto-accept a removed signal", () => {
    const health = read(".github/workflows/harness-health.yml");
    // Growth opens a PR; shrinkage fails the scan and never reaches --update-baseline.
    expect(health).toContain("Refresh the baseline when the docs grow");
    expect(health).toContain("if: steps.scan.outputs.status == 'success'");
    expect(health).toContain("--update-baseline");
    expect(health).toContain("contents: write");
    expect(read("scripts/check-harness-health.ts")).toContain("regressed");
  });

  test("weekly dependency refresh is tracked in an issue", () => {
    const refresh = read(".github/workflows/dependency-refresh.yml");
    expect(refresh).toContain("schedule:");
    expect(refresh).toContain("bun run check:deps");
    expect(refresh).toContain("--label dependencies");
    expect(refresh).toContain("gh issue comment");
  });

  test("CI parallelizes tests, caches package tarballs, and cancels superseded runs", () => {
    const ci = read(".github/workflows/ci.yml");
    expect(ci).toContain("bun test --parallel");
    expect(ci).toContain("~/.bun/install/cache");
    expect(ci).toContain("cancel-in-progress: true");
    expect((ci.match(/name: Install dependencies/g) ?? []).length).toBe(3);
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
    expect(landing).toContain('REQUIRED_CHECKS=("lint" "type-check" "bun test" "routing-matrix" "secret-scan")');
    expect(landing).toMatch(/for name in "\$\{REQUIRED_CHECKS\[@\]\}"/);
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
    // The invariant is an exact pin, not a specific version: hard-coding the
    // number here made every upstream release break an unrelated PR's lint job.
    expect(pkg.dependencies.musememory).toMatch(/^\d+\.\d+\.\d+$/);
    expect(pkg.dependencies.musememory).not.toMatch(/^[\^~]/);
  });

  test("dependabot update PRs target dev instead of main", () => {
    const dependabot = read(".github/dependabot.yml");
    const ecosystems = dependabot.split(/- package-ecosystem:/).slice(1);
    expect(ecosystems.length).toBeGreaterThan(0);
    for (const block of ecosystems) {
      expect(block.slice(0, block.indexOf("schedule:"))).toContain('target-branch: "dev"');
    }
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
