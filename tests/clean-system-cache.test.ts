import { describe, expect, test } from "bun:test";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SH_PATH = path.join(REPO_ROOT, "skills/reflection-maintenance/clean-system-cache/scripts/clean-cache.sh");
const CMD_PATH = path.join(REPO_ROOT, "skills/reflection-maintenance/clean-system-cache/scripts/clean-cache.cmd");
const SKILL_MD_PATH = path.join(REPO_ROOT, "skills/reflection-maintenance/clean-system-cache/SKILL.md");
const README_PATH = path.join(REPO_ROOT, "skills/reflection-maintenance/clean-system-cache/README.md");

describe("clean-system-cache — Agent Capabilities & Three-Tier Safety Engine", () => {
  test("clean-cache.sh exists and is executable", () => {
    expect(fs.existsSync(SH_PATH)).toBe(true);
    const stat = fs.statSync(SH_PATH);
    expect(stat.mode & 0o111).not.toBe(0);
  });

  test("clean-cache.cmd exists and is non-empty", () => {
    expect(fs.existsSync(CMD_PATH)).toBe(true);
    const content = fs.readFileSync(CMD_PATH, "utf8");
    expect(content.length).toBeGreaterThan(1000);
  });

  test("clean-cache.sh --help exposes --include-coupled, --all-caches, and agent runtimes", () => {
    const output = execSync(`bash "${SH_PATH}" --help`, { encoding: "utf8" });
    expect(output).toContain("--include-coupled");
    expect(output).toContain("--all-caches");
    expect(output).toContain("Agent Runtimes");
    expect(output).toContain("agents");
  });

  test("clean-cache.cmd defines /include-coupled, /all-caches, and agents tools", () => {
    const cmdContent = fs.readFileSync(CMD_PATH, "utf8");
    expect(cmdContent).toContain("/include-coupled");
    expect(cmdContent).toContain("--include-coupled");
    expect(cmdContent).toContain("/all-caches");
    expect(cmdContent).toContain("Agent Runtimes");
    expect(cmdContent).toContain("REHYDRATION MANIFEST");
    expect(cmdContent).toContain("CAP_BEFORE");
    expect(cmdContent).toContain("CAP_AFTER");
  });

  test("clean-cache.sh dry-run preserves live agent capability caches by default", () => {
    const output = execSync(`bash "${SH_PATH}" --dry-run`, { encoding: "utf8" });
    expect(output).toContain("Capability Inventory    : PASS");
    expect(output).toContain("[T2]");
    expect(output).toContain("preserved");
  });

  test("T2 capability-coupled cache isolation: preserved by default in execution mode", () => {
    const tmpDir = fs.mkdtempSync("/tmp/clean-test-safe-");
    const testContinueCache = path.join(tmpDir, ".continue/cache");
    fs.mkdirSync(testContinueCache, { recursive: true });
    fs.writeFileSync(path.join(testContinueCache, "index.db"), "sample-db-index");

    try {
      const output = execSync(`HOME="${tmpDir}" bash "${SH_PATH}" --tool continue`, { encoding: "utf8" });
      expect(output).toContain("continue (cache) [T2]");
      expect(output).toContain("preserved");
      expect(output).toContain("Capability Inventory    : PASS");
      // Verify file was NOT removed
      expect(fs.existsSync(path.join(testContinueCache, "index.db"))).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("T2 capability-coupled cache opt-in: --include-coupled purges and emits Rehydration Manifest", () => {
    const tmpDir = fs.mkdtempSync("/tmp/clean-test-coupled-");
    const testContinueCache = path.join(tmpDir, ".continue/cache");
    fs.mkdirSync(testContinueCache, { recursive: true });
    fs.writeFileSync(path.join(testContinueCache, "index.db"), "sample-db-index");

    try {
      const output = execSync(`HOME="${tmpDir}" bash "${SH_PATH}" --include-coupled --tool continue`, {
        encoding: "utf8",
      });
      expect(output).toContain("continue (cache) [T2]");
      expect(output).toContain("cleaned");
      expect(output).toContain("REHYDRATION MANIFEST");
      expect(output).toContain("Restore Command   : Reload Continue in IDE");
      // Verify file was removed under explicit opt-in
      expect(fs.existsSync(path.join(testContinueCache, "index.db"))).toBe(false);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("SKILL.md encodes 12-point matrix, three-tier classification, and safety contracts", () => {
    const skillContent = fs.readFileSync(SKILL_MD_PATH, "utf8");
    expect(skillContent).toContain("12-Point Cache Architecture Matrix");
    expect(skillContent).toContain("Three-Tier Cache Classification");
    expect(skillContent).toContain("T1");
    expect(skillContent).toContain("T2");
    expect(skillContent).toContain("T3");
    expect(skillContent).toContain("Active Agent Runtime Sessions");
    expect(skillContent).toContain("The 2026-10-08 OpenCode Capability Loss Incident");
    expect(skillContent).toContain("Capability Inventory Snapshot & Diff Contract");
    expect(skillContent).toContain("--include-coupled");
  });

  test("README.md encodes capability classification and usage flags", () => {
    const readmeContent = fs.readFileSync(README_PATH, "utf8");
    expect(readmeContent).toContain("Three-Tier Capability Classification");
    expect(readmeContent).toContain("--include-coupled");
    expect(readmeContent).toContain("/include-coupled");
    expect(readmeContent).toContain("Agent toolchain caches");
  });
});
