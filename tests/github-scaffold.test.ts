import { afterEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  parseGitHubRemote,
  renderGitHubTemplate,
  scaffoldGitHubAssets,
  selectGitHubWorkflowTemplates,
} from "../skills/core-engine/updateagents/scripts/github-scaffold";

const tempDirs: string[] = [];
function fixture(): string {
  const path = mkdtempSync(join(tmpdir(), "muse-github-scaffold-"));
  tempDirs.push(path);
  return path;
}

afterEach(() => {
  for (const path of tempDirs.splice(0)) rmSync(path, { recursive: true, force: true });
});

describe("GitHub scaffold adaptation", () => {
  it("extracts repository identity without retaining remote credentials", () => {
    const repository = parseGitHubRemote("https://user:private-token@github.com/acme/example-app.git");

    expect(repository).toEqual({
      owner: "acme",
      name: "example-app",
      url: "https://github.com/acme/example-app",
    });
    expect(JSON.stringify(repository)).not.toContain("private-token");
  });

  it("does not treat non-GitHub remotes as GitHub repositories", () => {
    expect(parseGitHubRemote("git@gitlab.com:acme/example-app.git")).toBeUndefined();
  });

  it("supports SSH URI remotes and strips credentials", () => {
    expect(parseGitHubRemote("ssh://git@github.com/acme/example-app.git")).toEqual({
      owner: "acme",
      name: "example-app",
      url: "https://github.com/acme/example-app",
    });
  });

  it("defers GitHub assets when the project host cannot be determined", () => {
    const target = fixture();
    const result = scaffoldGitHubAssets(target);
    expect(result.hostUnknown).toBe(true);
    expect(result.created).toEqual([]);
  });

  it("selects checks from the project type and only verified scripts", () => {
    const workflows = selectGitHubWorkflowTemplates({
      intent: "app",
      framework: "nextjs",
      packageManager: "pnpm",
      packageScripts: { test: "vitest run", build: "next build" },
    });

    expect(workflows).toContain("ci-node.yml");
    expect(workflows).not.toContain("ci-python.yml");
    expect(workflows).not.toContain("cli-release.yml");
    expect(selectGitHubWorkflowTemplates({ packageScripts: { dev: "vite" } })).toEqual([]);
  });

  it("selects a Python workflow only when Python project files are detected", () => {
    expect(selectGitHubWorkflowTemplates({ intent: "custom", framework: "generic", hasPythonProject: true })).toContain(
      "ci-python.yml",
    );
    expect(
      selectGitHubWorkflowTemplates({ intent: "custom", framework: "generic", hasPythonProject: false }),
    ).not.toContain("ci-python.yml");
  });

  it("selects and renders Composer CI for PHP projects using the configured test script", () => {
    const target = fixture();
    writeFileSync(
      join(target, "composer.json"),
      JSON.stringify({ name: "acme/example", scripts: { test: "phpunit" }, require: { php: "^8.2" } }),
    );
    const result = scaffoldGitHubAssets(target, { githubProject: true });
    expect(result.created).toContain(".github/workflows/ci-php.yml");
    const workflow = readFileSync(join(target, ".github/workflows/ci-php.yml"), "utf8");
    expect(workflow).toContain("composer validate --strict");
    expect(workflow).toContain("composer test");
    expect(workflow).not.toContain("{{");
  });

  it("renders only target-project identities and replaces absent optional identities safely", () => {
    const output = renderGitHubTemplate("# {{PROJECT_NAME}}\nRepo: {{REPOSITORY_URL}}\n{{CONTRIBUTORS}}", {
      projectName: "Example App",
      repositoryUrl: "https://github.com/acme/example-app",
      contributors: ["A. Owner", "Configured Agent"],
    });

    expect(output).toContain("# Example App");
    expect(output).toContain("https://github.com/acme/example-app");
    expect(output).toContain("A. Owner");
    expect(output).toContain("Configured Agent");
    expect(output).not.toContain("{{");
  });

  it("creates adapted community files and a workflow only for configured project scripts", () => {
    const target = fixture();
    writeFileSync(
      join(target, "package.json"),
      JSON.stringify({
        name: "example-app",
        description: "Example project",
        author: "Project Owner <private@example.com>",
        packageManager: "npm@10.8.0",
        scripts: { test: "vitest run" },
        repository: "https://github.com/acme/example-app.git",
      }),
    );
    writeFileSync(join(target, "package-lock.json"), "{}\n");

    const result = scaffoldGitHubAssets(target);

    expect(result.created).toContain("CHANGELOG.md");
    expect(result.created).toContain(".github/CONTRIBUTING.md");
    expect(result.created).toContain(".github/SECURITY.md");
    expect(result.created).toContain(".github/workflows/ci.yml");
    const dependabot = readFileSync(join(target, ".github/dependabot.yml"), "utf8");
    expect(dependabot).toContain('package-ecosystem: "npm"');
    expect(dependabot).toContain('package-ecosystem: "github-actions"');
    expect(dependabot).not.toContain("{{");
    expect(readFileSync(join(target, ".github/CONTRIBUTING.md"), "utf8")).toContain("Project Owner");
    expect(readFileSync(join(target, ".github/CONTRIBUTING.md"), "utf8")).not.toContain("private@example.com");
    const workflow = readFileSync(join(target, ".github/workflows/ci.yml"), "utf8");
    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("npm run test");
    expect(workflow).not.toContain("bun test || true");
  });

  it("trusts an explicit GitHub origin over stale package repository metadata", () => {
    const target = fixture();
    spawnSync("git", ["init", "-q"], { cwd: target });
    spawnSync("git", ["remote", "add", "origin", "git@github.com:acme/example-app.git"], { cwd: target });
    writeFileSync(join(target, "package.json"), JSON.stringify({ repository: "git@gitlab.com:old/example-app.git" }));
    const workflows = join(target, ".github/workflows");
    mkdirSync(workflows, { recursive: true });
    writeFileSync(join(workflows, "user.yml"), "name: user workflow\n");

    const result = scaffoldGitHubAssets(target, { packageScripts: { test: "test" } });
    expect(result.confirmationRequired).toBe(false);
    expect(result.removed).toEqual([]);
    expect(readFileSync(join(workflows, "user.yml"), "utf8")).toContain("user workflow");
  });

  it("normalizes unsupported package-manager metadata before emitting shell commands", () => {
    const target = fixture();
    writeFileSync(
      join(target, "package.json"),
      JSON.stringify({ packageManager: "npm; echo unsafe", scripts: { test: "vitest run" } }),
    );
    const result = scaffoldGitHubAssets(target, { githubProject: true });
    expect(result.created).toContain(".github/workflows/ci.yml");
    const workflow = readFileSync(join(target, ".github/workflows/ci.yml"), "utf8");
    expect(workflow).toContain("npm install");
    expect(workflow).not.toContain("echo unsafe");
  });

  it("preserves non-GitHub workflows until explicit confirmation", () => {
    const target = fixture();
    spawnSync("git", ["init", "-q"], { cwd: target });
    spawnSync("git", ["remote", "add", "origin", "git@gitlab.com:acme/example-app.git"], { cwd: target });
    const workflows = join(target, ".github/workflows");
    mkdirSync(workflows, { recursive: true });
    writeFileSync(join(workflows, "existing.yml"), "name: preserve until confirmed\n");

    const pending = scaffoldGitHubAssets(target);
    expect(pending.confirmationRequired).toBe(true);
    expect(readFileSync(join(workflows, "existing.yml"), "utf8")).toContain("preserve");

    const confirmed = scaffoldGitHubAssets(target, { removeWorkflowsConfirmed: true });
    expect(confirmed.confirmationRequired).toBe(false);
    expect(confirmed.removed).toContain(".github/workflows/existing.yml");
  });
});
