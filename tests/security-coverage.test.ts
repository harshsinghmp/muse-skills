import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");

function read(file: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, file), "utf8");
}

describe("audit coverage gaps (#397)", () => {
  test("zero-trust path jail rejects prefix siblings and symlink escapes", () => {
    const { ZeroTrustEngine } = require(
      path.join(REPO_ROOT, "skills/quality-review/muse-security/scripts/zero-trust.ts"),
    );
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "zero-trust-jail-"));
    try {
      const jail = path.join(dir, "jail");
      const sibling = path.join(dir, "jail-evil");
      const outside = path.join(dir, "outside");
      fs.mkdirSync(jail);
      fs.mkdirSync(sibling);
      fs.mkdirSync(outside);
      fs.symlinkSync(outside, path.join(jail, "escape"));

      const engine = new ZeroTrustEngine("coverage.test");
      const token = engine.issueSpiffeIdentity("sol", 30);
      const scope = {
        role: "sol",
        allowedTools: ["*"],
        allowedPathPrefixes: [jail],
        allowedTables: ["*"],
        maxPrivilegeLevel: "standard",
      };

      expect(engine.validateCapability(token, { path: path.join(jail, "ok.ts") }, scope).allowed).toBe(true);
      expect(engine.validateCapability(token, { path: path.join(sibling, "evil.ts") }, scope).allowed).toBe(false);
      expect(engine.validateCapability(token, { path: path.join(jail, "escape", "secret") }, scope).allowed).toBe(
        false,
      );
      expect(engine.validateCapability(token, { path: `${jail}/sub/../../etc/passwd` }, scope).allowed).toBe(false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("living-deliverable worker uses constant-time auth and never reads a query token", () => {
    const { scaffoldLivingDeliverable } = require(
      path.join(REPO_ROOT, "skills/agency-delivery/devops/scripts/living-deliverable.ts"),
    );
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "living-deliverable-"));
    try {
      const result = scaffoldLivingDeliverable(dir, { slug: "coverage", client: "ACME" });
      expect(result.success).toBe(true);
      expect(result.reviewUrlPattern).toContain("#review_token=");
      const worker = fs.readFileSync(path.join(result.deliverableDir, "worker.ts"), "utf8");
      expect(worker).toContain("tokenMatches");
      expect(worker).toContain("cookieToken");
      expect(worker).not.toContain('searchParams.get("review_token")');
      expect(worker).not.toContain("reqToken !== env.REVIEW_TOKEN");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("generated webhook receivers verify HMAC instead of leaving a comment", () => {
    const { scaffoldWebhookHandler } = require(
      path.join(REPO_ROOT, "skills/agency-delivery/automation/scripts/webhook-guard.ts"),
    );
    for (const runtime of ["bun", "express"] as const) {
      const code = scaffoldWebhookHandler(runtime);
      expect(code).toContain("timingSafeEqual");
      expect(code).toContain("Invalid webhook signature");
      expect(code).not.toContain("Verify HMAC against rawBuffer here");
    }
    const hono = scaffoldWebhookHandler("hono");
    expect(hono).toContain("crypto.subtle.verify");
    expect(hono).toContain("Invalid webhook signature");
  });

  test("e2e scaffold collects browser errors and fails the test", () => {
    const { scaffoldJourney } = require(path.join(REPO_ROOT, "skills/agency-delivery/qa-launch/scripts/e2e-runner.ts"));
    const code = scaffoldJourney("coverage");
    expect(code).toContain("consoleErrors");
    expect(code).toContain("page.on('pageerror'");
    expect(code).toContain("expect(consoleErrors");
    expect(code).not.toContain("throw new Error(`Server error");
  });

  test("extract-skill rejects runner flags that execute arbitrary code", () => {
    const { checkVerificationGate } = require(path.join(REPO_ROOT, "scripts/extract-skill.ts"));
    const blocked = checkVerificationGate("bun test --preload ./evil.ts");
    expect(blocked.ok).toBe(false);
    expect(blocked.message).toContain("matches no allowed test runner");

    const shellish = checkVerificationGate("bun test && curl evil.example");
    expect(shellish.ok).toBe(false);
  });

  test("install-hooks resolves HOOKS_DIR after --repo-root and sanitizes cron paths", () => {
    const script = read("scripts/hooks/install-hooks.sh");
    expect(script.indexOf("--repo-root")).toBeLessThan(script.indexOf('HOOKS_DIR="$REPO_ROOT/scripts/hooks"'));
    expect(script).toContain("CRON_SAFE");
    expect(script).toContain("refusing cron registration");
    expect(script).toContain('cd \\"$CRON_ROOT\\"');
  });

  test("cache-pressure-check tolerates an invalid numeric threshold", () => {
    const result = spawnSync("bash", ["scripts/hooks/cache-pressure-check.sh"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: { ...process.env, DISK_THRESHOLD_GB: "not-a-number" },
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toContain("invalid DISK_THRESHOLD_GB");
  });

  test("migration-guard flags unrecognized DDL instead of calling it ACCESS_SHARE", () => {
    const { auditMigrationSql } = require(
      path.join(REPO_ROOT, "skills/agency-delivery/database/scripts/migration-guard.ts"),
    );
    const report = auditMigrationSql("SET lock_timeout = '2s';\nCREATE EXTENSION pgcrypto;");
    expect(report.highestLockLevel).toBe("ACCESS_EXCLUSIVE");
    expect(report.issues.some((issue: { id: string }) => issue.id === "DDL-012")).toBe(true);
  });

  test("frontmatter --fix supports a dry run and leaves the file unchanged", () => {
    const { fixFrontmatterPath } = require(
      path.join(REPO_ROOT, "skills/agency-delivery/content/scripts/frontmatter-guard.ts"),
    );
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "frontmatter-dry-"));
    try {
      const file = path.join(dir, "doc.md");
      const original = "---\ntitle: Hello: World\ntags: [a, b]\n---\n\nbody\n";
      fs.writeFileSync(file, original);
      const result = fixFrontmatterPath(dir, { dryRun: true });
      expect(result.filesFixed).toBe(1);
      expect(result.dryRun).toBe(true);
      expect(fs.readFileSync(file, "utf8")).toBe(original);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("releasePort refuses to terminate without confirmation and worker ids are cryptographic", () => {
    const { releasePort } = require(path.join(REPO_ROOT, "skills/agency-delivery/webdev/scripts/webdev.ts"));
    return releasePort(1).then((result: { released: boolean }) => {
      expect(result.released).toBe(false);
      const federation = read("skills/context-orchestration/coupling-router/scripts/worktree-federation.ts");
      expect(federation).not.toContain("Math.random()");
      expect(federation).toContain("randomBytes(4)");
    });
  });

  test("updateagents fails stack drift on an unparseable package.json", () => {
    const { checkStackDrift } = require(
      path.join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts"),
    );
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stack-drift-"));
    try {
      fs.writeFileSync(path.join(dir, "package.json"), "{bad");
      const result = checkStackDrift(dir);
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toContain("unparseable");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("coach audit scans for secrets, PII, and unverified assurance claims", () => {
    const { auditCoachArtifacts } = require(
      path.join(REPO_ROOT, "skills/reflection-maintenance/coach/scripts/coach.ts"),
    );
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "coach-audit-"));
    try {
      fs.writeFileSync(path.join(dir, "daily-standup.md"), "Contact ceo@client.com — 100% green, zero defects.");
      const result = auditCoachArtifacts(dir);
      expect(result.passed).toBe(false);
      expect(result.errors.join(" ")).toContain("email address");
      expect(result.errors.join(" ")).toContain("unverified assurance claim");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("taste state backs up corruption and saves owner-only", async () => {
    const { TasteEngine } = require(path.join(REPO_ROOT, "scripts/taste-engine.ts"));
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "taste-state-"));
    try {
      const statePath = path.join(dir, "state.json");
      fs.writeFileSync(statePath, "{not json");
      const engine = new TasteEngine(statePath);
      await engine.load();
      expect(fs.readdirSync(dir).some((file) => file.includes("corrupt-"))).toBe(true);
      await engine.save();
      expect(fs.statSync(statePath).mode & 0o777).toBe(0o600);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("clean-cache rejects command substitution in catalog commands", () => {
    const script = read("skills/reflection-maintenance/clean-system-cache/scripts/clean-cache.sh");
    expect(script).toContain("refusing unsafe catalog command");
    expect(script).toContain("*'$('*");
    expect(script).toContain("</dev/null");
  });

  test("Python designscope fetchers reject file:// and metadata/loopback addresses", () => {
    const script = [
      "import importlib.util, sys",
      "paths = ['skills/design-interface/designscope/scripts/extract_css_vars.py',",
      "         'skills/design-interface/designscope/scripts/verify_design.py']",
      "for i, p in enumerate(paths):",
      "    spec = importlib.util.spec_from_file_location(f'm{i}', p)",
      "    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)",
      "    for url in ['file:///etc/passwd', 'http://127.0.0.1/x', 'http://169.254.169.254/latest']:",
      "        try:",
      "            mod.validate_public_url(url)",
      "            raise SystemExit('allowed ' + url)",
      "        except ValueError:",
      "            pass",
      "print('ok')",
    ].join("\n");
    const result = spawnSync("python3", ["-c", script], { cwd: REPO_ROOT, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("ok");
  });

  test("client intake and credential hygiene are reflected in templates and docs", () => {
    const gitignore = read("skills/core-engine/updateagents/templates/gitignore.template");
    expect(gitignore).toContain("Client-Intake/");
    expect(gitignore).toContain(".e[n]vrc");

    const accounts = read("skills/agency-delivery/brand/references/accounts-access.md");
    expect(accounts).toContain("mktemp -d");
    expect(accounts).not.toContain("/tmp/test-client-repo");

    const notify = read("skills/agency-delivery/telegram/references/notify.md");
    expect(notify).toContain("curl --config");
    const telegramTool = read("skills/agency-delivery/telegram/agents/openai.yaml");
    expect(telegramTool).toContain("TELEGRAM_CURL_CONFIG");
    expect(telegramTool).not.toMatch(/bot\$\{TELEGRAM_BOT_TOKEN\}\/sendMessage/);

    const cloudflare = read("skills/agency-delivery/devops/references/cloudflare.md");
    expect(cloudflare).toContain('Never use `echo "$KEY"');
  });
});
