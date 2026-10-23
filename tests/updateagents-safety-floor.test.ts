import { afterEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Safety-floor regression suite for the `updateagents` engine. Each test locks
 * down one defect that previously let a routine sync damage an established
 * repository. They are intentionally destructive-looking (overwriting canon,
 * deleting managed files) because that is exactly the shape of the bug: a plain
 * `sync` must never clobber curated content, re-provision governance files, or
 * import the file it itself owns.
 */

const REPO_ROOT = join(import.meta.dir, "..");
const UPDATEAGENTS_SCRIPT = join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");
const TEST_SANDBOX = join("/tmp", `ua-safety-${Date.now()}`);

function sha256(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

function filesBelow(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) out.push(...filesBelow(path));
    else if (entry.isFile()) out.push(path);
  }
  return out;
}

describe("🛡️ updateagents Safety Floor: managed-root self-import, community re-provisioning & canon injection", () => {
  afterEach(() => {
    rmSync(TEST_SANDBOX, { recursive: true, force: true });
  });

  // -------------------------------------------------------------------------
  // Defect 1: the managed root AGENTS.md is the canonical destination, never a
  // foreign source. Sync (and especially --force) must not import it into its
  // own archive, which produced self-referential duplicates masquerading as
  // user-authored rules.
  // -------------------------------------------------------------------------
  it("never self-imports the managed root AGENTS.md (plain sync AND --force)", () => {
    const target = join(TEST_SANDBOX, "self-import");
    mkdirSync(target, { recursive: true });

    const scaffold = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target, "--scaffold"], { encoding: "utf8" });
    if (scaffold.status !== 0) throw new Error(`${scaffold.stdout}\n${scaffold.stderr}`);
    const scaffoldedRoot = readFileSync(join(target, "AGENTS.md"), "utf8");
    expect(scaffoldedRoot).toContain("[//]: # (muse-secretary-router:start)");
    expect(scaffoldedRoot).toContain("[//]: # (updateagents:managed)");

    // A legacy instruction file guarantees a full run instead of the fast-path exit.
    writeFileSync(join(target, ".cursorrules"), "Cursor rules: keep commits atomic.\n", "utf8");

    const archiveDir = join(target, ".agents/archive/agent-instructions");

    for (const extraArgs of [[], ["--force"]] as string[][]) {
      const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target, ...extraArgs], { encoding: "utf8" });
      if (run.status !== 0) throw new Error(`${run.stdout}\n${run.stderr}`);

      const rootContent = readFileSync(join(target, "AGENTS.md"), "utf8");
      // The sync itself installs this router, so a managed root is also
      // detectable by the imported-instructions-router sentinel.
      expect(rootContent).toContain("[//]: # (updateagents:imported-instructions-router:start)");

      // 1a. No archived snapshot may be a byte-for-byte copy of the managed root.
      const offendingSnapshots = filesBelow(archiveDir).filter((file) => readFileSync(file, "utf8") === rootContent);
      expect(offendingSnapshots).toEqual([]);

      // 1b. The manifest may not claim the managed root as an imported source.
      const manifestPath = join(archiveDir, "manifest.json");
      if (existsSync(manifestPath)) {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
          sources: Array<{ sourcePath: string; sha256: string }>;
        };
        const rootHash = sha256(rootContent);
        const selfEntry = manifest.sources.find(
          (source) => source.sourcePath === "AGENTS.md" && source.sha256 === rootHash,
        );
        expect(selfEntry).toBeUndefined();
        expect(manifest.sources.some((source) => source.sourcePath === "AGENTS.md")).toBe(false);
      }
    }
  });

  it("still imports a HAND-WRITTEN root AGENTS.md with no managed markers (non-regression)", () => {
    const target = join(TEST_SANDBOX, "hand-written-root");
    mkdirSync(target, { recursive: true });

    const scaffold = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target, "--scaffold"], { encoding: "utf8" });
    if (scaffold.status !== 0) throw new Error(`${scaffold.stdout}\n${scaffold.stderr}`);

    // Overwrite the scaffolded managed root with a genuine hand-authored rulebook.
    writeFileSync(join(target, "AGENTS.md"), "# My Custom Rules\n- Rule 1: Always test\n", "utf8");

    const run = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target], { encoding: "utf8" });
    if (run.status !== 0) throw new Error(`${run.stdout}\n${run.stderr}`);

    expect(readFileSync(join(target, ".agents/context/imported-agent-instructions.md"), "utf8")).toContain(
      "Rule 1: Always test",
    );
    expect(readFileSync(join(target, "AGENTS.md"), "utf8")).toContain("imported-agent-instructions.md");
  });

  // -------------------------------------------------------------------------
  // Defect 2: community/governance assets (CODE_OF_CONDUCT, CONTRIBUTING,
  // SECURITY, issue/PR templates, dependabot, CHANGELOG) are a Day-0 scaffold
  // concern. Once an established project deletes one, a plain sync must not
  // resurrect it.
  // -------------------------------------------------------------------------
  it("does not re-provision community assets or CHANGELOG.md on a plain sync of an established project", () => {
    const target = join(TEST_SANDBOX, "community");
    mkdirSync(target, { recursive: true });
    spawnSync("git", ["init", "-q"], { cwd: target });
    spawnSync("git", ["remote", "add", "origin", "git@github.com:example/community.git"], { cwd: target });

    // Fresh project (empty dir + GitHub remote) → full provisioning.
    const first = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target], { encoding: "utf8" });
    if (first.status !== 0) throw new Error(`${first.stdout}\n${first.stderr}`);
    expect(existsSync(join(target, ".github/SECURITY.md"))).toBe(true);
    expect(existsSync(join(target, "CHANGELOG.md"))).toBe(true);

    // Operator prunes the governance files it does not want.
    rmSync(join(target, ".github/SECURITY.md"), { force: true });
    rmSync(join(target, "CHANGELOG.md"), { force: true });

    // Force a full run so the fast-path exit cannot mask the behaviour.
    writeFileSync(join(target, ".cursorrules"), "Cursor rules: prefer rg over grep.\n", "utf8");

    const second = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target], { encoding: "utf8" });
    if (second.status !== 0) throw new Error(`${second.stdout}\n${second.stderr}`);
    expect(second.stdout).not.toContain("Fast-path exit");

    // Established repo: pruned governance files stay pruned.
    expect(existsSync(join(target, ".github/SECURITY.md"))).toBe(false);
    expect(existsSync(join(target, "CHANGELOG.md"))).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Defect 3: `.agents/standards/` is the project's curated rulebook. A sync
  // must not overwrite diverged canon or inject unrelated canon files
  // (backend-wordpress.md, fintech-gateways.md, …) into an established project.
  // Only --scaffold materialises the full canon and only --force overwrites.
  // -------------------------------------------------------------------------
  it("preserves curated standards on plain sync and only restores canon with --force", () => {
    const target = join(TEST_SANDBOX, "canon");
    mkdirSync(target, { recursive: true });

    const scaffold = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target, "--scaffold"], { encoding: "utf8" });
    if (scaffold.status !== 0) throw new Error(`${scaffold.stdout}\n${scaffold.stderr}`);

    const techStacks = join(target, ".agents/standards/tech-stacks.md");
    const vibeguard = join(target, ".agents/standards/security-vibeguard.md");
    expect(existsSync(techStacks)).toBe(true);
    expect(existsSync(vibeguard)).toBe(true);

    // Curate one canon file and remove another, then force a full run.
    writeFileSync(techStacks, "# my curated canon\nv2\n", "utf8");
    rmSync(vibeguard, { force: true });
    writeFileSync(join(target, ".cursorrules"), "Cursor rules: mobile-first layouts.\n", "utf8");

    // (a) Plain sync: curated content wins; the orphan canon file is not re-added.
    const sync = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target], { encoding: "utf8" });
    if (sync.status !== 0) throw new Error(`${sync.stdout}\n${sync.stderr}`);
    expect(sync.stdout).toContain("Curated standards preserved");
    expect(sync.stdout).toContain("tech-stacks.md");
    expect(sync.stdout).toContain("Canon standards not applicable here");
    expect(sync.stdout).toContain("security-vibeguard.md");
    expect(readFileSync(techStacks, "utf8")).toBe("# my curated canon\nv2\n");
    expect(existsSync(vibeguard)).toBe(false);

    // (b) --force: canon clobbers the curated divergence.
    const force = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target, "--force"], { encoding: "utf8" });
    if (force.status !== 0) throw new Error(`${force.stdout}\n${force.stderr}`);
    expect(readFileSync(techStacks, "utf8")).not.toContain("my curated canon");
  });
});
