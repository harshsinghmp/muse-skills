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
    // Hermetic: assert against a fixture HOME with one T2 cache, never the developer/CI
    // runner's real harness dirs (a bare CI runner has none, so [T2] never appears there).
    const tmpDir = fs.mkdtempSync("/tmp/clean-test-dryrun-");
    const fixtureCache = path.join(tmpDir, ".continue/cache");
    fs.mkdirSync(fixtureCache, { recursive: true });
    fs.writeFileSync(path.join(fixtureCache, "index.db"), "sample-db-index");

    try {
      const output = execSync(`HOME="${tmpDir}" bash "${SH_PATH}" --dry-run`, { encoding: "utf8" });
      expect(output).toContain("Capability Inventory    : PASS");
      expect(output).toContain("[T2]");
      expect(output).toContain("preserved");
      // dry-run must not delete the capability cache it classified
      expect(fs.existsSync(path.join(fixtureCache, "index.db"))).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30000);

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

  test("clean-cache.sh --help exposes --interactive, risk tiers, and learned.conf", () => {
    const output = execSync(`bash "${SH_PATH}" --help`, { encoding: "utf8" });
    expect(output).toContain("--interactive");
    expect(output).toContain("-i");
    expect(output).toContain("--scan-builds");
    expect(output).toContain("--learned-conf");
    expect(output).toContain("Class A: Regenerable System & Tool Caches");
    expect(output).toContain("Class B: HIGH-RISK / Non-Regenerative User Data");
    expect(output).toContain("CRITICAL: IRREVERSIBLE DATA LOSS");
  });

  test("clean-cache.cmd defines /interactive, risk tiers, and learned.conf", () => {
    const cmdContent = fs.readFileSync(CMD_PATH, "utf8");
    expect(cmdContent).toContain("/interactive");
    expect(cmdContent).toContain("/i");
    expect(cmdContent).toContain("/scan-builds");
    expect(cmdContent).toContain("/learned-conf");
    expect(cmdContent).toContain("Class A: Regenerable System ^& Tool Caches");
    expect(cmdContent).toContain("Class B: HIGH-RISK / Non-Regenerative User Data");
    expect(cmdContent).toContain("CRITICAL: IRREVERSIBLE DATA LOSS");
    expect(cmdContent).toContain("learned.conf");
  });

  test("clean-cache.sh preserves Class B non-regenerative data by default in execution mode", () => {
    const tmpDir = fs.mkdtempSync("/tmp/clean-test-class-b-safe-");
    const downloadsDir = path.join(tmpDir, "Downloads");
    const assistantSessionsDir = path.join(tmpDir, ".local/share/token-optimizer/sessions");
    const trashDir = path.join(tmpDir, ".local/share/Trash");
    const backupDir = path.join(tmpDir, ".config/profile-backup");

    fs.mkdirSync(downloadsDir, { recursive: true });
    fs.mkdirSync(assistantSessionsDir, { recursive: true });
    fs.mkdirSync(trashDir, { recursive: true });
    fs.mkdirSync(backupDir, { recursive: true });

    fs.writeFileSync(path.join(downloadsDir, "tax-invoice.pdf"), "sensitive-doc");
    fs.writeFileSync(path.join(assistantSessionsDir, "session-123.json"), "chat-transcript");
    fs.writeFileSync(path.join(trashDir, "deleted.txt"), "recoverable-file");
    fs.writeFileSync(path.join(backupDir, "backup-state.json"), "config-snapshot");

    try {
      const output = execSync(`HOME="${tmpDir}" bash "${SH_PATH}" --tool downloads,sessions,trash,backups`, {
        encoding: "utf8",
      });
      expect(output).toContain("User Downloads [Class B]");
      expect(output).toContain("preserved");

      // Verify all Class B non-regenerative items are 100% intact
      expect(fs.existsSync(path.join(downloadsDir, "tax-invoice.pdf"))).toBe(true);
      expect(fs.existsSync(path.join(assistantSessionsDir, "session-123.json"))).toBe(true);
      expect(fs.existsSync(path.join(trashDir, "deleted.txt"))).toBe(true);
      expect(fs.existsSync(path.join(backupDir, "backup-state.json"))).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30000);

  test("clean-cache.sh interactive mode presents risk tiers and mandatory hazard alert for Class B", () => {
    const tmpDir = fs.mkdtempSync("/tmp/clean-test-interactive-b-");
    const downloadsDir = path.join(tmpDir, "Downloads");
    fs.mkdirSync(downloadsDir, { recursive: true });
    fs.writeFileSync(path.join(downloadsDir, "important.zip"), "user-archive");

    try {
      // Feed "S\n" (Skip) to interactive mode
      const output = execSync(`printf "S\\n" | HOME="${tmpDir}" bash "${SH_PATH}" --tool downloads --interactive`, {
        encoding: "utf8",
      });
      expect(output).toContain("[CLASS B: HIGH-RISK / NON-REGENERATIVE USER DATA (CRITICAL DANGER)]");
      expect(output).toContain("CRITICAL: IRREVERSIBLE DATA LOSS");
      expect(output).toContain("This path contains non-regenerative user data. Deleting it will");
      expect(output).toContain("permanently destroy your files/transcripts with no recovery mechanism.");
      expect(output).toContain("[Y]es / [N]o / [S]kip / [B]rowse");
      expect(fs.existsSync(path.join(downloadsDir, "important.zip"))).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30000);

  test("clean-cache.sh interactive mode confirms Class A, stores in learned.conf, and respects on next run", () => {
    const tmpDir = fs.mkdtempSync("/tmp/clean-test-interactive-a-");
    const projectDir = path.join(tmpDir, "my-project");
    const nextBuildDir = path.join(projectDir, ".next");
    const confFile = path.join(tmpDir, "learned.conf");

    fs.mkdirSync(nextBuildDir, { recursive: true });
    fs.writeFileSync(path.join(nextBuildDir, "build-manifest.json"), "build-cache");

    try {
      // First run: Pass "Y\n" to allow Class A deletion
      const output1 = execSync(
        `printf "Y\\n" | HOME="${tmpDir}" bash "${SH_PATH}" --tool builds --interactive --scan-builds "${projectDir}" --learned-conf "${confFile}"`,
        { encoding: "utf8" },
      );
      expect(output1).toContain("[CLASS A: REGENERABLE SYSTEM & TOOL CACHE (Moderate Risk)]");
      expect(output1).toContain("Saved preference 'allow'");
      expect(fs.existsSync(confFile)).toBe(true);
      const confContent = fs.readFileSync(confFile, "utf8");
      expect(confContent).toContain(`${nextBuildDir}=allow`);

      // File was cleaned
      expect(fs.existsSync(path.join(nextBuildDir, "build-manifest.json"))).toBe(false);

      // Re-create build cache
      fs.writeFileSync(path.join(nextBuildDir, "build-manifest.json"), "re-created-cache");

      // Second run: Without interactive, learned.conf automatically allows Class A
      const output2 = execSync(
        `HOME="${tmpDir}" bash "${SH_PATH}" --tool builds --scan-builds "${projectDir}" --learned-conf "${confFile}"`,
        { encoding: "utf8" },
      );
      expect(output2).toContain("Allowed via learned.conf");
      expect(fs.existsSync(path.join(nextBuildDir, "build-manifest.json"))).toBe(false);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30000);

  test("clean-cache.sh learned.conf strictly excludes Class B items", () => {
    const tmpDir = fs.mkdtempSync("/tmp/clean-test-learned-class-b-");
    const downloadsDir = path.join(tmpDir, "Downloads");
    const confFile = path.join(tmpDir, "learned.conf");
    fs.mkdirSync(downloadsDir, { recursive: true });
    fs.writeFileSync(path.join(downloadsDir, "item.txt"), "user-file");

    try {
      // Confirm deletion of Class B item with Y
      execSync(
        `printf "Y\\n" | HOME="${tmpDir}" bash "${SH_PATH}" --tool downloads --interactive --learned-conf "${confFile}"`,
        {
          encoding: "utf8",
        },
      );

      // Verify learned.conf was NOT populated with Class B path
      if (fs.existsSync(confFile)) {
        const conf = fs.readFileSync(confFile, "utf8");
        expect(conf).not.toContain(downloadsDir);
      }
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30000);

  test("clean-cache.sh interactive Browse [B] option displays contents and re-prompts", () => {
    const tmpDir = fs.mkdtempSync("/tmp/clean-test-browse-");
    const downloadsDir = path.join(tmpDir, "Downloads");
    fs.mkdirSync(downloadsDir, { recursive: true });
    fs.writeFileSync(path.join(downloadsDir, "secret-report.pdf"), "sensitive-data");

    try {
      // First send 'B' to browse, then 'S' to skip
      const output = execSync(`printf "B\\nS\\n" | HOME="${tmpDir}" bash "${SH_PATH}" --tool downloads --interactive`, {
        encoding: "utf8",
      });
      expect(output).toContain("Browsing contents of:");
      expect(output).toContain("secret-report.pdf");
      expect(output).toContain("Skipped by user (default)");
      expect(fs.existsSync(path.join(downloadsDir, "secret-report.pdf"))).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30000);

  test("SKILL.md encodes confirmation gating, Class A/B risk classes, mandatory hazard warning, and agent invariants", () => {
    const skillContent = fs.readFileSync(SKILL_MD_PATH, "utf8");
    expect(skillContent).toContain("Class A: Regenerable System & Tool Caches");
    expect(skillContent).toContain("Class B: HIGH-RISK / Non-Regenerative User Data");
    expect(skillContent).toContain("CRITICAL: IRREVERSIBLE DATA LOSS");
    expect(skillContent).toContain(
      "This path contains non-regenerative user data. Deleting it will permanently destroy your files/transcripts with no recovery mechanism.",
    );
    expect(skillContent).toContain('Default to "KEEP" for all Class B');
    expect(skillContent).toContain("learned.conf");
    expect(skillContent).toContain("[Y]es / [N]o / [S]kip / [B]rowse");
  });

  test("README.md encodes interactive confirmation and Class A/B risk categories", () => {
    const readmeContent = fs.readFileSync(README_PATH, "utf8");
    expect(readmeContent).toContain("--interactive");
    expect(readmeContent).toContain("/interactive");
    expect(readmeContent).toContain("Class A (Moderate Risk)");
    expect(readmeContent).toContain("Class B (CRITICAL DANGER)");
    expect(readmeContent).toContain("CRITICAL: IRREVERSIBLE DATA LOSS");
  });
});
