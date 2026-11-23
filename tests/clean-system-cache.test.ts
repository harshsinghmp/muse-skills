import { describe, expect, test } from "bun:test";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SH_PATH = path.join(REPO_ROOT, "skills/reflection-maintenance/clean-system-cache/scripts/clean-cache.sh");
const CMD_PATH = path.join(REPO_ROOT, "skills/reflection-maintenance/clean-system-cache/scripts/clean-cache.cmd");
const SKILL_MD_PATH = path.join(REPO_ROOT, "skills/reflection-maintenance/clean-system-cache/SKILL.md");
const README_PATH = path.join(REPO_ROOT, "skills/reflection-maintenance/clean-system-cache/README.md");

function walkTree(dir: string, fn: (p: string, stat: fs.Stats) => void) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.lstatSync(full);
    fn(full, stat);
    if (stat.isDirectory() && !stat.isSymbolicLink()) walkTree(full, fn);
  }
  fn(dir, fs.lstatSync(dir));
}

function ageTree(dir: string, days: number) {
  const when = new Date(Date.now() - days * 86400_000);
  walkTree(dir, (entry, stat) => {
    if (!stat.isSymbolicLink()) fs.utimesSync(entry, when, when);
  });
}

function writeSized(file: string, bytes = 4096) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.alloc(bytes, "x"));
}

function discoverJson(home: string, projects: string, extra = "") {
  return JSON.parse(
    execSync(`HOME="${home}" bash "${SH_PATH}" --discover --json --projects "${projects}" --min-size 0 ${extra}`, {
      encoding: "utf8",
    }),
  ) as Array<{
    key: string;
    path: string;
    tier: string;
    size_kb: number;
    age_days: number | null;
    risk: string;
    note: string;
  }>;
}

describe("clean-system-cache — artifact matchers, dormancy, and revalidation", () => {
  test("project discovery uses corroborating matchers, not bare directory names", () => {
    const home = fs.mkdtempSync("/tmp/clean-test-matchers-");
    const projects = path.join(home, "projects");
    try {
      writeSized(path.join(projects, "app/target/debug/app"));
      fs.writeFileSync(path.join(projects, "app/Cargo.toml"), "[package]\n");

      writeSized(path.join(projects, "maven/target/classes/A.class"));

      writeSized(path.join(projects, "pyok/.venv/lib/a"));
      fs.writeFileSync(path.join(projects, "pyok/.venv/pyvenv.cfg"), "home=/x\n");
      writeSized(path.join(projects, "pyno/.venv/lib/a"));

      writeSized(path.join(projects, "real/target/a"));
      fs.writeFileSync(path.join(projects, "real/Cargo.toml"), "[package]\n");
      fs.symlinkSync(path.join(projects, "real/target"), path.join(projects, "linktarget"));

      ageTree(projects, 40);
      const items = discoverJson(home, projects);
      const paths = items.map((item) => item.path);

      expect(paths).toContain(path.join(projects, "app/target"));
      expect(paths).toContain(path.join(projects, "pyok/.venv"));
      expect(paths).toContain(path.join(projects, "real/target"));

      expect(paths).not.toContain(path.join(projects, "maven/target"));
      expect(paths).not.toContain(path.join(projects, "pyno/.venv"));
      expect(paths).not.toContain(path.join(projects, "linktarget"));

      for (const item of items) {
        expect(item.tier).toBe("ASK");
        expect(item.size_kb).toBeGreaterThan(0);
        expect(item.age_days).not.toBeNull();
        expect(item.age_days as number).toBeGreaterThanOrEqual(39);
        expect(item.risk).toBe("");
      }
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  }, 30000);

  test("dormancy comes from the newest file, not the directory mtime", () => {
    const home = fs.mkdtempSync("/tmp/clean-test-dormancy-");
    const projects = path.join(home, "projects");
    const freshFile = path.join(projects, "fresh/target/debug/new");
    try {
      writeSized(freshFile);
      fs.writeFileSync(path.join(projects, "fresh/Cargo.toml"), "[package]\n");
      ageTree(projects, 40);
      // The directory and everything else look 40 days old; this file is new.
      fs.utimesSync(freshFile, new Date(), new Date());

      const items = discoverJson(home, projects);
      expect(items.map((item) => item.path)).not.toContain(path.join(projects, "fresh/target"));
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  }, 30000);

  test("risky locations stay report-only even after a learned allow", () => {
    const home = fs.mkdtempSync("/tmp/clean-test-risk-");
    const root = path.join(home, ".config/ws");
    const target = path.join(root, "proj/target");
    try {
      writeSized(path.join(target, "debug/a"));
      fs.writeFileSync(path.join(root, "proj/Cargo.toml"), "[package]\n");
      ageTree(root, 40);

      const items = discoverJson(home, root);
      const item = items.find((entry) => entry.path === target);
      expect(item).toBeTruthy();
      expect(item?.risk).toContain("user configuration");

      execSync(`HOME="${home}" bash "${SH_PATH}" --learn allow "proj:${target}"`, { encoding: "utf8" });
      const output = execSync(
        `HOME="${home}" bash "${SH_PATH}" --discover --clean-safe --projects "${root}" --min-size 0 -v`,
        { encoding: "utf8" },
      );
      expect(output).toContain("risky path");
      expect(fs.existsSync(target)).toBe(true);
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  }, 30000);

  test("--only removes the artifact directory itself and keeps the project", () => {
    const home = fs.mkdtempSync("/tmp/clean-test-only-");
    const projects = path.join(home, "projects");
    const target = path.join(projects, "app/target");
    try {
      writeSized(path.join(target, "debug/app"));
      fs.writeFileSync(path.join(projects, "app/Cargo.toml"), "[package]\n");
      ageTree(projects, 40);

      const output = execSync(
        `HOME="${home}" bash "${SH_PATH}" --only "proj:${target}" --yes --projects "${projects}" --min-size 0`,
        { encoding: "utf8" },
      );
      expect(output).toContain("cleaned");
      expect(fs.existsSync(target)).toBe(false);
      expect(fs.existsSync(path.join(projects, "app/Cargo.toml"))).toBe(true);
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  }, 30000);

  test("catalog JSON carries age_days and risk fields", () => {
    const home = fs.mkdtempSync("/tmp/clean-test-json-");
    try {
      writeSized(path.join(home, ".cache/uv/archive"));
      const items = JSON.parse(
        execSync(`HOME="${home}" bash "${SH_PATH}" --list --json`, { encoding: "utf8" }),
      ) as Array<Record<string, unknown>>;
      expect(items.length).toBeGreaterThan(0);
      expect(items[0]).toHaveProperty("age_days", null);
      expect(items[0]).toHaveProperty("risk", "");
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  }, 30000);

  test("matcher, revalidation, risk, and Windows parity hooks are wired", () => {
    const sh = fs.readFileSync(SH_PATH, "utf8");
    for (const hook of [
      "artifact_match()",
      "path_newest_epoch()",
      "artifact_size_map()",
      "path_risk()",
      "disc_revalidate()",
      "path changed since discovery",
    ]) {
      expect(sh).toContain(hook);
    }
    expect(sh).toContain("${CAND_ID[$i]}");
    expect(sh).not.toContain("CAND_KEY");
    expect(sh).not.toContain("sort -rn | head -1");

    const cmd = fs.readFileSync(CMD_PATH, "utf8");
    expect(cmd).toContain("discover-projects.ps1");
    expect(cmd).toContain("-Claim");
    expect(cmd).toContain("DEL_OK");
    expect(cmd).toContain('if /i "!M!"=="purge"');
    expect(cmd).toContain("failed -^>");

    const ps1 = fs.readFileSync(path.join(path.dirname(SH_PATH), "discover-projects.ps1"), "utf8");
    expect(ps1).toContain("Test-Artifact");
    expect(ps1).toContain("Get-Risk");
    expect(ps1).toContain("CACHEDIR.TAG");
    expect(ps1).toContain("pyvenv.cfg");

    const skill = fs.readFileSync(SKILL_MD_PATH, "utf8");
    expect(skill).toContain("Artifact matchers");
    expect(skill).toContain("newest file");
    expect(skill).toContain("RE-VALIDATED AT DELETE");
  });
});

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

  test("loud irreversible hazard banner surrounds ASK! selections and never appears for T1", () => {
    const tmpDir = fs.mkdtempSync("/tmp/clean-test-hazard-");
    const trashDir = path.join(tmpDir, ".local/share/Trash/files");
    const safeCache = path.join(tmpDir, ".cache/uv");
    fs.mkdirSync(trashDir, { recursive: true });
    fs.writeFileSync(path.join(trashDir, "old.txt"), "junk");
    fs.mkdirSync(safeCache, { recursive: true });
    fs.writeFileSync(path.join(safeCache, "archive"), "cache");

    try {
      const danger = execSync(`HOME="${tmpDir}" bash "${SH_PATH}" --only ask-trash --dry-run`, {
        encoding: "utf8",
      });
      expect(danger).toContain("WARNING: IRREVERSIBLE DATA LOSS");
      expect(danger).toContain("Deleting them CANNOT be undone");
      expect(danger).toContain(" - Trash");

      const safe = execSync(`HOME="${tmpDir}" bash "${SH_PATH}" --dry-run`, { encoding: "utf8" });
      expect(safe).not.toContain("IRREVERSIBLE DATA LOSS");
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30000);

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

  test("SKILL.md encodes 16-point matrix, three-tier classification, and safety contracts", () => {
    const skillContent = fs.readFileSync(SKILL_MD_PATH, "utf8");
    expect(skillContent).toContain("16-Point Cache Architecture Matrix");
    expect(skillContent).toContain("Three-Tier Cache Classification");
    expect(skillContent).toContain("T1");
    expect(skillContent).toContain("T2");
    expect(skillContent).toContain("T3");
    expect(skillContent).toContain("Active Agent Runtime Sessions");
    expect(skillContent).toContain("Capability-Cache Purge Loses Installed Payloads");
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
