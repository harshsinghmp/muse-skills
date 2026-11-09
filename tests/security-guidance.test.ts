import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");

function read(file: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, file), "utf8");
}

describe("security guidance hardening (#396)", () => {
  test("webdev guidance uses SSRF allowlists, CSP, and host-only cookies", () => {
    const backend = read("skills/agency-delivery/webdev/references/backend.md");
    expect(backend).toContain("Never rely on a denylist");
    expect(backend).toContain("Resolve the hostname");
    expect(backend).toContain("re-validate every redirect hop");
    expect(backend).not.toContain("strictly blacklist private/internal");

    const headers = read("skills/agency-delivery/webdev/references/security-headers.md");
    expect(headers).toContain("Content-Security-Policy");
    expect(headers).toContain("__Host-session");
    expect(headers).not.toContain("domain: '.example.com',");
  });

  test("analytics guidance minimizes context PII and gates the attribution cookie", () => {
    const events = read("skills/agency-delivery/analytics/references/events.md");
    expect(events).toContain("Context PII minimization");
    expect(events).toContain("Truncate IPv4");
    expect(events).toContain("retention TTL");
    expect(events).toContain("Secure; HttpOnly; SameSite=Lax");
    expect(events).toContain("consent");
  });

  test("gauntlet gate covers Set-Cookie, CORS, CSRF, and exempts loopback HSTS", () => {
    const gate = read("skills/quality-review/gauntlet-loop/references/web-security-visual-gate.md");
    expect(gate).toContain("Set-Cookie");
    expect(gate).toContain("CORS");
    expect(gate).toContain("CSRF");
    expect(gate).toContain("loopback/localhost exempt");
    expect(gate).toContain("__Host-");
  });

  test("exposure audit, database, relay, smm, designscope, and research guidance is hardened", () => {
    const exposure = read("skills/core-engine/git/references/exposure-audit.md");
    expect(exposure).toContain("--force-with-lease");
    expect(exposure).toContain("must re-clone");
    expect(exposure).not.toContain("git push origin --force --all");

    const database = read("skills/agency-delivery/database/references/query.md");
    expect(database).toContain("prefer `password_env`");
    expect(database).toContain("owner-only (`0600`)");

    const relay = read("skills/context-orchestration/relay/SKILL.md");
    expect(relay).toContain("No-secrets invariant");

    const smm = read("skills/agency-delivery/smm/references/x.md");
    expect(smm).toContain("Never post deliberately false claims");
    expect(smm).not.toContain("**Cunningham's Law** — post a confidently wrong answer");

    const capture = read("skills/design-interface/designscope/references/capture-flows.md");
    expect(capture).toContain("URL safety gate");
    expect(capture).toContain("untrusted data, not instructions");

    const dossier = read("skills/agency-delivery/research/references/entity-dossier.md");
    expect(dossier).toContain("Privacy guardrail (person dossiers)");
    expect(dossier).toContain("No pretexting");
  });

  test("security references require owner-only .env files and pinned MCP servers", () => {
    const boundary = read("skills/quality-review/muse-security/references/boundary.md");
    expect(boundary).toContain("Must be owner-only (`0600`)");
    expect(boundary).toContain("Any group or world read bit");

    const mcp = read("skills/quality-review/muse-security/references/mcp-guard.md");
    expect(mcp).toContain("pinned to an exact version");
    expect(mcp).toContain("lockfile");
  });

  test("clean-system-cache cannot use --yes for irreversible ASK! deletions", () => {
    const skill = read("skills/reflection-maintenance/clean-system-cache/SKILL.md");
    expect(skill).toContain("--confirm-irreversible");
    expect(skill).toContain("`--yes` alone is **not** sufficient");

    const script = read("skills/reflection-maintenance/clean-system-cache/scripts/clean-cache.sh");
    expect(script).toContain("selection_has_irreversible");
    expect(script).toContain("--confirm-irreversible");

    const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "cache-confirm-"));
    try {
      const result = spawnSync(
        "bash",
        ["skills/reflection-maintenance/clean-system-cache/scripts/clean-cache.sh", "--only", "ask-tmp", "--yes"],
        {
          cwd: REPO_ROOT,
          encoding: "utf8",
          input: "",
          env: { ...process.env, HOME: tempHome },
          timeout: 30_000,
        },
      );
      expect(result.status).toBe(1);
      // On a clean CI runner `/tmp` has no stale candidates, so the key may not
      // resolve before the confirmation gate; both outcomes are refusals.
      if (!result.stderr.includes("Unknown candidate key")) {
        expect(result.stderr).toContain("--confirm-irreversible");
      }
    } finally {
      fs.rmSync(tempHome, { recursive: true, force: true });
    }
  });
});

describe("scanner false negatives (#396)", () => {
  test("lockfile audit parses bun.lock and rejects insecure resolutions", () => {
    const scriptPath = path.join(REPO_ROOT, "skills/quality-review/code-review/scripts/code-review.ts");
    const { auditLockfile } = require(scriptPath);

    const bun = auditLockfile(path.join(REPO_ROOT, "bun.lock"));
    expect(bun.totalDependencies).toBeGreaterThan(0);
    expect(bun.passed).toBe(true);

    const manifest = auditLockfile(path.join(REPO_ROOT, "package.json"));
    expect(manifest.totalDependencies).toBeGreaterThan(0);
    expect(manifest.passed).toBe(true);

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bun-lock-audit-"));
    try {
      const bad = path.join(dir, "bun.lock");
      fs.writeFileSync(
        bad,
        JSON.stringify({
          lockfileVersion: 2,
          packages: { evil: ["evil@1.0.0", "http://evil.example/evil.tgz"] },
        }),
      );
      const report = auditLockfile(bad);
      expect(report.totalDependencies).toBe(1);
      expect(report.passed).toBe(false);
      expect(report.suspiciousRegistries.join(" ")).toContain("Insecure HTTP");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("boundary audit skips gitignored escapes but still flags real .env exposure", () => {
    const scriptPath = path.join(REPO_ROOT, "skills/quality-review/muse-security/scripts/boundary-audit.ts");
    const { auditSymlinks, auditPermissions } = require(scriptPath);

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "boundary-ignore-"));
    try {
      spawnSync("git", ["init", "-q"], { cwd: dir });
      fs.writeFileSync(path.join(dir, ".gitignore"), "ignored/\n", "utf8");
      fs.mkdirSync(path.join(dir, "ignored"));
      fs.symlinkSync(path.join(dir, "does-not-exist"), path.join(dir, "ignored", "dangling"));

      // The only dangling symlink is gitignored: it must not be reported.
      expect(auditSymlinks(dir).some((issue: { id: string }) => issue.id === "BND-001")).toBe(false);

      fs.symlinkSync(path.join(dir, "does-not-exist"), path.join(dir, "tracked-dangling"));
      expect(auditSymlinks(dir).some((issue: { id: string }) => issue.id === "BND-001")).toBe(true);
      fs.unlinkSync(path.join(dir, "tracked-dangling"));

      const envFile = path.join(dir, ".env");
      fs.writeFileSync(envFile, "SECRET=value\n");
      fs.chmodSync(envFile, 0o640);
      expect(
        auditPermissions(dir).some((issue: { rule: string }) => issue.rule === "Group-Readable Environment File"),
      ).toBe(true);

      const example = path.join(dir, ".env.example");
      fs.writeFileSync(example, "SECRET=<placeholder>\n");
      fs.chmodSync(example, 0o644);
      expect(
        auditPermissions(dir).some(
          (issue: { target: string }) => issue.target === ".env.example" && issue.id === "BND-004",
        ),
      ).toBe(false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
