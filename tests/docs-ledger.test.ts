import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const UPDATEDOCS = join(REPO_ROOT, "skills/core-engine/updatedocs/scripts/updatedocs.ts");
const UPDATEAGENTS = join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");
const SANDBOX = join(tmpdir(), `docs-ledger-test-${Date.now()}`);

function runUpdatedocs(target: string, args: string[]) {
  return spawnSync("bun", [UPDATEDOCS, target, ...args], { encoding: "utf8", cwd: REPO_ROOT });
}

function runUpdateagents(target: string, args: string[]) {
  return spawnSync("bun", [UPDATEAGENTS, target, ...args], { encoding: "utf8", cwd: REPO_ROOT });
}

function git(target: string, args: string[]) {
  return spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.com", ...args], {
    cwd: target,
    encoding: "utf8",
  });
}

function write(target: string, rel: string, content: string) {
  const full = join(target, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
}

function commit(target: string, message: string) {
  git(target, ["add", "-A"]);
  const res = git(target, ["commit", "-qm", message]);
  expect(res.status, res.stderr).toBe(0);
}

function readLedger(target: string) {
  return JSON.parse(readFileSync(join(target, ".docs-ledger.json"), "utf8"));
}

function bootstrap(target: string) {
  mkdirSync(target, { recursive: true });
  git(target, ["init", "-q"]);
  write(target, "package.json", JSON.stringify({ name: "ledger-fixture", version: "1.0.0" }, null, 2));
  write(target, "README.md", "# Ledger Fixture\n\nBaseline documentation.\n");
  write(target, "CHANGELOG.md", "# Changelog\n\n## [Unreleased]\n\n## [1.0.0]\n- Baseline\n");
  write(target, "src/index.ts", "export const baseline = 1;\n");
  commit(target, "chore: baseline");
  git(target, ["tag", "v1.0.0"]);
}

describe("updatedocs documentation point ledger", () => {
  beforeEach(() => {
    rmSync(SANDBOX, { recursive: true, force: true });
    mkdirSync(SANDBOX, { recursive: true });
  });

  afterEach(() => {
    rmSync(SANDBOX, { recursive: true, force: true });
  });

  it("tracks points per audience, advances only when complete, and marks shipped", () => {
    const target = join(SANDBOX, "lifecycle");
    bootstrap(target);

    write(target, "src/auth.ts", "export const sso = 1;\n");
    commit(target, "feat(auth): add SSO login flow");

    // 1. Ledger creates a pending point with all three audiences required.
    const first = runUpdatedocs(target, ["--ledger", "--json"]);
    expect(first.status, first.stderr).toBe(0);
    const firstReport = JSON.parse(first.stdout);
    expect(firstReport.totalPoints).toBe(1);
    expect(firstReport.pendingPoints).toBe(1);
    const point = readLedger(target).points[0];
    expect(point.id).toBe("DP-0001");
    expect(point.audiences.developer.required).toBe(true);
    expect(point.audiences.user.required).toBe(true);
    expect(point.audiences.agent.required).toBe(true);

    // 2. A checkpoint is blocked while docs are missing.
    const blocked = runUpdatedocs(target, ["--checkpoint"]);
    expect(blocked.status).toBe(1);
    expect(blocked.stderr).toContain("Checkpoint blocked");
    expect(readLedger(target).watermark.point).toBe(0);

    // 3. Real docs satisfy coverage by phrase, not a generic word.
    write(
      target,
      "README.md",
      "# Ledger Fixture\n\nBaseline documentation.\n\n## Authentication\n\nSSO login is supported for enterprise accounts.\n",
    );
    write(
      target,
      "CHANGELOG.md",
      "# Changelog\n\n## [Unreleased]\n\n### Added\n- SSO login flow.\n\n## [1.0.0]\n- Baseline\n",
    );
    write(target, "AGENTS.md", "# Agents\n\n- SSO login flow is documented in the README.\n");

    const covered = runUpdatedocs(target, ["--ledger", "--json"]);
    expect(covered.status, covered.stderr).toBe(0);
    expect(JSON.parse(covered.stdout).pendingPoints).toBe(0);

    const checkpoint = runUpdatedocs(target, ["--checkpoint", "--json"]);
    expect(checkpoint.status, checkpoint.stderr).toBe(0);
    const ledgerAfter = readLedger(target);
    expect(ledgerAfter.watermark.point).toBe(1);
    expect(ledgerAfter.watermark.commit).toBe(git(target, ["rev-parse", "HEAD"]).stdout.trim());

    const checkPoints = runUpdatedocs(target, ["--check-points"]);
    expect(checkPoints.status).toBe(0);

    // A docs-only commit after the watermark does not reopen the gate.
    write(target, "README.md", `${readFileSync(join(target, "README.md"), "utf8")}\nTypo fixed.\n`);
    commit(target, "docs: fix a typo");
    const docsOnly = runUpdatedocs(target, ["--check-points"]);
    expect(docsOnly.status, docsOnly.stdout).toBe(0);

    // 4. New undocumented change blocks the CI gate; --mark resolves it.
    write(target, "src/saml.ts", "export const saml = 1;\n");
    commit(target, "feat(auth): add SAML metadata endpoint");

    const pending = runUpdatedocs(target, ["--check-points"]);
    expect(pending.status).toBe(1);
    expect(pending.stdout).toContain("DP-0002");

    // The normal CI gate also fails, even without an armed .docs.hash.
    const checkGate = runUpdatedocs(target, ["--check"]);
    expect(checkGate.status).toBe(1);
    expect(checkGate.stdout).toContain("Documentation Point Ledger gate failed");

    for (const audience of ["developer", "user", "agent"]) {
      const marked = runUpdatedocs(target, ["--mark", "DP-0002", "--audience", audience, "--docs", "README.md"]);
      expect(marked.status, marked.stderr).toBe(0);
    }
    const afterMark = runUpdatedocs(target, ["--checkpoint", "--json"]);
    expect(afterMark.status, afterMark.stderr).toBe(0);
    expect(readLedger(target).watermark.point).toBe(2);

    // 5. Release marks complete points shipped and what's-new is audience-aware.
    const release = runUpdatedocs(target, ["--release", "v1.1.0"]);
    expect(release.status, release.stderr).toBe(0);
    expect(readLedger(target).points.every((p: { shipped: boolean }) => p.shipped)).toBe(true);

    const whatsNew = runUpdatedocs(target, ["--whats-new", "--audience", "user"]);
    expect(whatsNew.status, whatsNew.stderr).toBe(0);
    expect(whatsNew.stdout).toContain("What's New (user)");
    expect(whatsNew.stdout).toContain("New: add SSO login flow");
    expect(whatsNew.stdout).toContain("shipped v1.1.0");

    // 6. Managed blocks are written idempotently.
    const written = runUpdatedocs(target, ["--write-changelog", "--write-client-changelog"]);
    expect(written.status, written.stderr).toBe(0);
    const changelog = readFileSync(join(target, "CHANGELOG.md"), "utf8");
    const clientLog = readFileSync(join(target, "CLIENT_CHANGELOG.md"), "utf8");
    expect(changelog).toContain("<!-- docs-ledger:start -->");
    expect(changelog).toContain("DP-0001");
    expect(clientLog).toContain("New: add SSO login flow");
    runUpdatedocs(target, ["--write-changelog", "--write-client-changelog"]);
    expect((changelog.match(/docs-ledger:start/g) ?? []).length).toBe(1);

    // 7. Memory hints are emitted but never written to .memory/.
    const hints = runUpdatedocs(target, ["--ledger", "--memory-hint"]);
    expect(hints.status, hints.stderr).toBe(0);
    expect(hints.stdout).toContain("Optional memory hints");
    expect(existsSync(join(target, ".memory"))).toBe(false);

    // 8. The post-commit capture hook is idempotent.
    const hook = runUpdatedocs(target, ["--install-hook"]);
    expect(hook.status, hook.stderr).toBe(0);
    runUpdatedocs(target, ["--install-hook"]);
    const hookPath = join(target, ".git/hooks/post-commit");
    expect(existsSync(hookPath)).toBe(true);
    const hookContent = readFileSync(hookPath, "utf8");
    expect(hookContent.match(/updatedocs ledger/g)?.length).toBe(2);
  }, 60_000);

  it("updateagents consumes only agent-ready points and never skips a pending one", () => {
    const target = join(SANDBOX, "backlog");
    bootstrap(target);
    mkdirSync(join(target, ".agents/context"), { recursive: true });
    write(target, ".agents/context/current.md", "# Current\n\n## 1. Verified Shipped Reality\n- baseline\n");

    write(target, "src/auth.ts", "export const sso = 1;\n");
    commit(target, "feat(auth): add SSO login flow");
    runUpdatedocs(target, ["--ledger"]);

    // Agent coverage pending → backlog refuses to advance.
    const blocked = runUpdateagents(target, ["--docs-backlog", "--json"]);
    expect(blocked.status).toBe(0);
    const blockedData = JSON.parse(blocked.stdout);
    expect(blockedData.appended).toBe(0);
    expect(blockedData.reason).toContain("still owes agent documentation");

    // Document the agent surface, then the backlog consumes the point.
    write(target, "AGENTS.md", "# Agents\n\n- SSO login flow is documented.\n");
    runUpdatedocs(target, ["--ledger"]);
    const consumed = runUpdateagents(target, ["--docs-backlog", "--json"]);
    expect(consumed.status, consumed.stderr).toBe(0);
    const consumedData = JSON.parse(consumed.stdout);
    expect(consumedData.appended).toBe(1);
    expect(consumedData.from).toBe("DP-0001");

    const current = readFileSync(join(target, ".agents/context/current.md"), "utf8");
    expect(current).toContain("<!-- docs-backlog:start -->");
    expect(current).toContain("DP-0001");
    expect(readLedger(target).agentWatermark.point).toBe(1);

    // Re-running is a no-op.
    const again = runUpdateagents(target, ["--docs-backlog", "--json"]);
    expect(JSON.parse(again.stdout).appended).toBe(0);
  }, 60_000);

  it("documents the ledger flags in help output", () => {
    const help = runUpdatedocs(SANDBOX, ["--help"]);
    expect(help.status).toBe(0);
    for (const flag of [
      "--ledger",
      "--catch-up",
      "--checkpoint",
      "--check-points",
      "--whats-new",
      "--mark",
      "--release",
    ]) {
      expect(help.stdout).toContain(flag);
    }

    const agentHelp = runUpdateagents(SANDBOX, ["--help"]);
    expect(agentHelp.status).toBe(0);
    expect(agentHelp.stdout).toContain("--docs-backlog");
  });
});
