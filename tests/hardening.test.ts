/**
 * Hardening pins — invariants that previously drifted silently:
 *   1. skills.json version ↔ SKILL.md frontmatter version (the new-project 2.0.0-vs-2.4.1 class)
 *   2. skills.json description ↔ SKILL.md frontmatter description (discovery surface parity)
 *   3. llms.txt line ↔ skills.json description (LLM index parity)
 *   4. worktree-lease.ts gate behavior (protocol decision logic can't regress)
 */
import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const SKILLS_JSON_PATH = path.join(ROOT, "skills.json");
const LLMS_TXT_PATH = path.join(ROOT, "llms.txt");
const LEASE_SCRIPT = path.join(ROOT, "coupling-router", "scripts", "worktree-lease.ts");
const LEASE_PATH = path.join(ROOT, ".agents", "artifacts", "WORKTREE-LEASE.md");

interface Skill {
  name: string;
  description: string;
  path: string;
  version: string;
}

function frontmatterOf(skillPath: string): Record<string, string> {
  const raw = fs.readFileSync(path.join(ROOT, skillPath), "utf8");
  const m = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  if (!m) throw new Error(`No frontmatter in ${skillPath}`);
  const fm: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = /^(name|version|description):\s*"?(.*?)"?\s*$/.exec(line);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
}

describe("Hardening pins (drift that previously shipped silently)", () => {
  const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8")) as { skills: Skill[] };

  test("every skills.json version matches its SKILL.md frontmatter version", () => {
    const drift: string[] = [];
    for (const s of skills) {
      const fm = frontmatterOf(s.path);
      if (fm.version !== s.version) drift.push(`${s.name}: frontmatter ${fm.version} vs registry ${s.version}`);
    }
    expect(drift).toEqual([]);
  });

  test("every skills.json description matches its SKILL.md frontmatter description", () => {
    const drift: string[] = [];
    for (const s of skills) {
      const fm = frontmatterOf(s.path);
      if (fm.description !== s.description) {
        drift.push(`${s.name}: frontmatter vs registry description differ`);
      }
    }
    expect(drift).toEqual([]);
  });

  test("every llms.txt line description matches skills.json exactly", () => {
    const llms = fs.readFileSync(LLMS_TXT_PATH, "utf8");
    const drift: string[] = [];
    for (const s of skills) {
      const line = llms.split("\n").find((l) => l.startsWith(`- [${s.name}](${s.path}): `));
      if (!line) {
        drift.push(`${s.name}: missing from llms.txt`);
        continue;
      }
      const desc = line.slice(`- [${s.name}](${s.path}): `.length);
      if (desc !== s.description) drift.push(`${s.name}: llms.txt description != registry`);
    }
    expect(drift).toEqual([]);
  });
});

describe("Worktree lease gate (coupling-router/scripts/worktree-lease.ts)", () => {
  function runLease(args: string[]) {
    return Bun.spawnSync(["bun", LEASE_SCRIPT, ...args], { cwd: ROOT, stdout: "pipe", stderr: "pipe" });
  }

  function leaseHeartbeat(): string | null {
    if (!fs.existsSync(LEASE_PATH)) return null;
    const m = /^heartbeat:\s*(.+)$/m.exec(fs.readFileSync(LEASE_PATH, "utf8"));
    return m ? m[1].trim() : null;
  }

  function setHeartbeat(iso: string): void {
    const raw = fs.readFileSync(LEASE_PATH, "utf8");
    fs.writeFileSync(LEASE_PATH, raw.replace(/^heartbeat:.*$/m, `heartbeat: ${iso}`));
  }

  function cleanup(): void {
    if (fs.existsSync(LEASE_PATH)) fs.unlinkSync(LEASE_PATH);
  }

  test("probe on absent lease acquires and exits 0", () => {
    cleanup();
    const r = runLease(["probe", "--owner", "test-runner", "--scope", "tests/"]);
    expect(r.exitCode).toBe(0);
    expect(fs.existsSync(LEASE_PATH)).toBe(true);
    expect(fs.readFileSync(LEASE_PATH, "utf8")).toContain("owner: test-runner");
  });

  test("probe on fresh foreign lease defers with exit 1 and does not take over", () => {
    const r = runLease(["probe", "--owner", "second-session"]);
    expect(r.exitCode).toBe(1);
    expect(fs.readFileSync(LEASE_PATH, "utf8")).toContain("owner: test-runner");
    expect(fs.readFileSync(LEASE_PATH, "utf8")).not.toContain("second-session");
  });

  test("probe on stale heartbeat (31+ min) takes over with exit 0", () => {
    const stale = new Date(Date.now() - 31 * 60_000).toISOString().replace(/\.\d{3}Z$/, "Z");
    setHeartbeat(stale);
    const r = runLease(["probe", "--owner", "third-session"]);
    expect(r.exitCode).toBe(0);
    const raw = fs.readFileSync(LEASE_PATH, "utf8");
    expect(raw).toContain("owner: third-session");
    expect(raw).toContain("took over from test-runner");
  });

  test("CI workflow pins least-privilege permissions (audit F2)", () => {
    const ci = fs.readFileSync(".github/workflows/ci.yml", "utf8");
    expect(ci).toContain("permissions:");
    expect(ci).toContain("contents: read");
  });

  test("new-project generator writes no static placeholder secrets (audit F1)", () => {
    const src = fs.readFileSync("new-project/scripts/new-project.ts", "utf8");
    expect(src).not.toMatch(/supersecret/);
  });

  test("hold refreshes heartbeat; release removes the lease", () => {
    // Pin a deterministic aged heartbeat so the refresh is observable
    // (a real run can complete within the same second, making before/after equal).
    setHeartbeat("2020-01-01T00:00:00Z");
    const rHold = runLease(["hold"]);
    expect(rHold.exitCode).toBe(0);
    const after = leaseHeartbeat();
    expect(after).not.toBe("2020-01-01T00:00:00Z");
    expect(after).not.toBeNull();

    const rRelease = runLease(["release"]);
    expect(rRelease.exitCode).toBe(0);
    expect(fs.existsSync(LEASE_PATH)).toBe(false);
  });
});
