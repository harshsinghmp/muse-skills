import { describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  detectCommitmentsFromText,
  evaluateCommitmentBucket,
  parseDate,
} from "../skills/context-orchestration/evidence-ledger/scripts/commitment-sweep";
import { auditTerrain, CANONICAL_TERRAIN_MAPS } from "../skills/core-engine/updateagents/scripts/terrain-audit";
import { isPlaceholderCredential, nativeRegexScan } from "../skills/quality-review/muse-security/scripts/secret-scan";
import {
  formatHostVitalsMarkdown,
  getHostVitals,
} from "../skills/reflection-maintenance/clean-system-cache/scripts/host-vitals";
import {
  synthesizeWeeklyWisdom,
  updateWisdomFrame,
} from "../skills/reflection-maintenance/coach/scripts/wisdom-updater";

const REPO_ROOT = process.cwd();
const UPDATEAGENTS_SCRIPT = join(REPO_ROOT, "skills", "core-engine", "updateagents", "scripts", "updateagents.ts");
const TEST_SANDBOX = join(REPO_ROOT, ".agents", "artifacts", "scratch", "wave23-test-sandbox");

describe("🛡️ Wave 23 Terrain Engine & Absolute Sovereignty Test Suite", () => {
  describe("Part 1: Absolute Sovereignty (Zero-LifeOS Policy)", () => {
    it("confirms zero remaining 'lifeos' references across skills/ and root AGENTS.md", () => {
      const skillsGrep = spawnSync("git", ["grep", "-i", "lifeos", "skills/"], {
        cwd: REPO_ROOT,
        encoding: "utf8",
      });
      expect(skillsGrep.stdout.trim()).toBe("");
      expect(skillsGrep.status).toBe(1); // exit 1 means no matches

      const agentsGrep = spawnSync("git", ["grep", "-i", "lifeos", "AGENTS.md"], {
        cwd: REPO_ROOT,
        encoding: "utf8",
      });
      expect(agentsGrep.stdout.trim()).toBe("");
      expect(agentsGrep.status).toBe(1);
    });

    it("standalone Vibeguard secret scanner accurately catches tokens, keys and database URLs", () => {
      const testDir = join(TEST_SANDBOX, "secret-test");
      if (existsSync(testDir)) rmSync(testDir, { recursive: true, force: true });
      mkdirSync(testDir, { recursive: true });

      // 1. sk-* OpenAI token
      writeFileSync(
        join(testDir, "leaked-sk.ts"),
        `export const OPENAI_KEY = "${["sk", "proj", "abc123456789012345678901234567890XYZ"].join("-")}";\n`,
        "utf8",
      );

      // 2. ghp_* GitHub token
      writeFileSync(
        join(testDir, "leaked-ghp.ts"),
        `export const GITHUB_TOKEN = "${["ghp", "123456789012345678901234567890123456"].join("_")}";\n`,
        "utf8",
      );

      // 3. Private Key
      writeFileSync(
        join(testDir, "leaked-key.pem"),
        `-----BEGIN ${"PRIVATE"} KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3\n-----END ${"PRIVATE"} KEY-----\n`,
        "utf8",
      );

      // 4. Database Connection String with credentials
      writeFileSync(
        join(testDir, "leaked-db.env"),
        `DATABASE_URL=${"postgres:"}//appadmin:TopSecretP@ssword99@db.prod.internal:5432/production\n`,
        "utf8",
      );

      // 5. Harmless placeholder (must NOT trigger)
      writeFileSync(
        join(testDir, "clean-placeholder.env"),
        "DATABASE_URL=postgres://user:password@localhost:5432/dbname\nAUTH_KEY=sk-REPLACE_WITH_REAL_KEY\n",
        "utf8",
      );

      const result = nativeRegexScan(testDir);
      expect(result.clean).toBe(false);
      expect(result.findings.length).toBe(4);

      const types = result.findings.map((f) => f.type);
      expect(types.some((t) => t.includes("sk-*"))).toBe(true);
      expect(types.some((t) => t.includes("ghp_*"))).toBe(true);
      expect(types.some((t) => t.includes("Private Key"))).toBe(true);
      expect(types.some((t) => t.includes("Database Connection String"))).toBe(true);

      // Verify redaction
      for (const finding of result.findings) {
        expect(finding.redacted).toContain("[REDACTED]");
      }

      rmSync(testDir, { recursive: true, force: true });
    });

    it("isPlaceholderCredential correctly classifies mock template placeholders", () => {
      expect(isPlaceholderCredential("postgres://postgres:postgres@localhost:5432/mydb")).toBe(true);
      expect(isPlaceholderCredential("postgres://user:password@localhost:5432/test")).toBe(true);
      expect(isPlaceholderCredential("sk-REPLACE_WITH_KEY")).toBe(true);
      expect(isPlaceholderCredential("sk-proj-YOUR_ACTUAL_API_KEY")).toBe(true);
      expect(isPlaceholderCredential(`postgres://${"prod_admin"}:RealP@ssword123@10.0.0.5:5432/app`)).toBe(false);
      expect(isPlaceholderCredential(["sk", "proj", "abc123456789012345678901234567890"].join("-"))).toBe(false);
    });
  });

  describe("Part 2: Wave 23 Workspace Terrain Scaffolding & Audits", () => {
    it("updateagents --scaffold provisions all 6 canonical terrain maps in .agents/terrain/", () => {
      const sandbox = join(TEST_SANDBOX, "terrain-scaffold-test");
      if (existsSync(sandbox)) rmSync(sandbox, { recursive: true, force: true });
      mkdirSync(sandbox, { recursive: true });

      const res = spawnSync("bun", [UPDATEAGENTS_SCRIPT, sandbox, "--scaffold"], { encoding: "utf8" });
      expect(res.status).toBe(0);
      expect(existsSync(join(sandbox, ".agents", "terrain"))).toBe(true);

      for (const mapFile of CANONICAL_TERRAIN_MAPS) {
        const filePath = join(sandbox, ".agents", "terrain", mapFile);
        expect(existsSync(filePath)).toBe(true);
        const content = readFileSync(filePath, "utf8");
        expect(content.length).toBeGreaterThan(50);
      }

      // Verify auditTerrain on the freshly scaffolded directory passes
      const audit = auditTerrain(sandbox);
      expect(audit.valid).toBe(true);
      expect(audit.missingFiles.length).toBe(0);
      expect(audit.credentialLeaks.length).toBe(0);
      expect(audit.hardcodedPaths.length).toBe(0);

      rmSync(sandbox, { recursive: true, force: true });
    });

    it("auditTerrain catches missing files, credential leaks, and hardcoded machine paths", () => {
      const sandbox = join(TEST_SANDBOX, "terrain-audit-fail-test");
      if (existsSync(sandbox)) rmSync(sandbox, { recursive: true, force: true });
      const terrainDir = join(sandbox, ".agents", "terrain");
      mkdirSync(terrainDir, { recursive: true });

      // Only create 2 of 6 files
      writeFileSync(join(terrainDir, "stack.md"), "# Stack\nHardcoded user path: /home/harsh/Projects/test\n", "utf8");
      writeFileSync(
        join(terrainDir, "habits.md"),
        `# Habits\nLeaked token: ${["sk", "proj", "999999999999999999999999999999"].join("-")}\n`,
        "utf8",
      );

      const audit = auditTerrain(sandbox);
      expect(audit.valid).toBe(false);
      expect(audit.missingFiles.length).toBe(4);
      expect(audit.missingFiles).toContain("ownership.md");
      expect(audit.missingFiles).toContain("packages.md");
      expect(audit.missingFiles).toContain("repo.md");
      expect(audit.missingFiles).toContain("logs.md");

      expect(audit.hardcodedPaths.length).toBe(1);
      expect(audit.hardcodedPaths[0].path).toBe("/home/harsh");

      expect(audit.credentialLeaks.length).toBe(1);

      rmSync(sandbox, { recursive: true, force: true });
    });

    it("new-project provisions tailored terrain maps during execution", () => {
      const targetDir = join(TEST_SANDBOX, "new-project-terrain");
      if (existsSync(targetDir)) rmSync(targetDir, { recursive: true, force: true });

      const newProjScript = join(REPO_ROOT, "skills", "core-engine", "new-project", "scripts", "new-project.ts");
      const res = spawnSync(
        "bun",
        [
          newProjScript,
          targetDir,
          "--non-interactive",
          "--preset=powerhouse",
          "--agent-name=Test Agent",
          "--skip-install",
        ],
        { encoding: "utf8" },
      );

      expect(res.status).toBe(0);
      expect(existsSync(join(targetDir, ".agents", "terrain"))).toBe(true);

      for (const mapFile of CANONICAL_TERRAIN_MAPS) {
        const filePath = join(targetDir, ".agents", "terrain", mapFile);
        expect(existsSync(filePath)).toBe(true);
      }

      const stackMd = readFileSync(join(targetDir, ".agents", "terrain", "stack.md"), "utf8");
      expect(stackMd).toContain("NEXTJS");
      expect(stackMd).toContain("bun run dev");

      rmSync(targetDir, { recursive: true, force: true });
    });
  });

  describe("Part 3: Commitment & Deadline Tracking Sweep", () => {
    it("detects commitments, computes days until due, and stamps overdue warnings", () => {
      const refDate = new Date("2026-10-25T12:00:00Z");

      const text = `
# Project Status
- We promised Acme Corp to deliver MVP dashboard by 2026-10-20.
- deliverable to Beta Team we will ship auth integration by 2026-10-25.
- commitment-due: 2026-10-30; deliver landing page redesign to Marketing.
- Note: 48h clock stop trigger initiated due to pending client feedback.
      `;

      const commitments = detectCommitmentsFromText(text, "test-doc.md", refDate);
      expect(commitments.length).toBeGreaterThanOrEqual(4);

      // Check overdue item (due 2026-10-20 vs refDate 2026-10-25 => 5 days overdue)
      const overdue = commitments.find((c) => c.due === "2026-10-20");
      expect(overdue).toBeDefined();
      expect(overdue?.bucket).toBe("overdue");
      expect(overdue?.daysUntilDue).toBe(-5);
      expect(overdue?.warningStamp).toContain("⚠️ OVERDUE");

      // Check due today (due 2026-10-25)
      const dueToday = commitments.find((c) => c.due === "2026-10-25");
      expect(dueToday).toBeDefined();
      expect(dueToday?.bucket).toBe("due_today");
      expect(dueToday?.warningStamp).toBe("🔔 DUE TODAY");

      // Check future item (due 2026-10-30 => 5 days future)
      const future = commitments.find((c) => c.due === "2026-10-30");
      expect(future).toBeDefined();
      expect(future?.bucket).toBe("due_this_week");
      expect(future?.warningStamp).toContain("⏳ DUE THIS WEEK");

      // Check 48h clock-stop trigger
      const clockStop = commitments.find((c) => c.clockStopTrigger);
      expect(clockStop).toBeDefined();
      expect(clockStop?.clockStopStamp).toContain("🛑 48H CLOCK STOP");
    });

    it("evaluates commitment buckets and dates correctly", () => {
      const ref = new Date("2026-10-25T12:00:00Z");
      expect(parseDate("2026-10-28", ref)).toBe("2026-10-28");
      expect(parseDate("tomorrow", ref)).toBe("2026-10-26");
      expect(parseDate("in 48h", ref)).toBe("2026-10-27");

      const overdueBucket = evaluateCommitmentBucket(-3);
      expect(overdueBucket.bucket).toBe("overdue");
      expect(overdueBucket.status).toBe("OVERDUE");

      const todayBucket = evaluateCommitmentBucket(0);
      expect(todayBucket.bucket).toBe("due_today");

      const weekBucket = evaluateCommitmentBucket(4);
      expect(weekBucket.bucket).toBe("due_this_week");
    });
  });

  describe("Part 4: Wisdom Compounding & Retrospective Synthesis", () => {
    it("compounds observations into domain frames and formats retrospective summaries", () => {
      const result = updateWisdomFrame(
        "development",
        "Never commit secrets to git repositories without pre-ship scans",
        "principle",
        { dryRun: true },
      );
      expect(result.success).toBe(true);
      expect(result.domain).toBe("development");
      expect(result.type).toBe("principle");

      const retro = synthesizeWeeklyWisdom({ dryRun: true });
      expect(retro.summary).toContain("Weekly Wisdom Retrospective Synthesis");
      expect(retro.summary).toContain("Muse Memory Wisdom Compounding Engine");
    });
  });

  describe("Part 5: Host Vitals & Atlas Machine Inspection", () => {
    it("reports host vitals deterministically with CPU, GPU, kernel and resolution", () => {
      const vitals = getHostVitals();
      expect(vitals.cpu.cores).toBeGreaterThanOrEqual(1);
      expect(vitals.cpu.model.length).toBeGreaterThan(0);
      expect(vitals.kernelVersion.length).toBeGreaterThan(0);
      expect(vitals.memory.totalGb).toBeGreaterThan(0);
      expect(vitals.gpu.devices.length).toBeGreaterThanOrEqual(1);
      expect(vitals.display.resolution).toMatch(/\d+x\d+/);

      const md = formatHostVitalsMarkdown(vitals);
      expect(md).toContain("Host Machine Vitals & Atlas Hardware Inventory");
      expect(md).toContain("Compute & Processing (CPU)");
      expect(md).toContain("Graphics & Display Pipeline (GPU)");
      expect(md).toContain("Memory & System Capacity");
    });
  });

  describe("Part 6: Memory Dual-Scope Architecture Interop", () => {
    it("confirms memory-aware skills document the dual-scope contract and zero YAML edits", () => {
      const memorySkills = [
        "skills/context-orchestration/evidence-ledger/SKILL.md",
        "skills/context-orchestration/context-anchor/SKILL.md",
        "skills/context-orchestration/secretary/SKILL.md",
        "skills/context-orchestration/relay/SKILL.md",
      ];

      for (const skillFile of memorySkills) {
        const content = readFileSync(join(REPO_ROOT, skillFile), "utf8");
        expect(content).toContain("~/.memory/USER.md");
        expect(content).toContain("get_context");
        expect(content).toContain("./.memory/");
        expect(content).toContain("CURRENT.md");
        expect(content).toContain("YAML");
      }
    });
  });
});
