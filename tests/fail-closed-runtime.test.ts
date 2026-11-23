import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  checkDeliverableExpiry,
  scaffoldLivingDeliverable,
} from "../skills/agency-delivery/devops/scripts/living-deliverable";
import {
  spawnFederatedWorktree,
  sweepFederatedWorktrees,
} from "../skills/context-orchestration/coupling-router/scripts/worktree-federation";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const LEASE_SCRIPT = path.join(REPO_ROOT, "skills/context-orchestration/coupling-router/scripts/worktree-lease.ts");

function git(repo: string, args: string[]) {
  return spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.com", ...args], {
    cwd: repo,
    encoding: "utf8",
  });
}

describe("fail-closed runtime", () => {
  test("a failed git worktree add is not reported as success", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wt-fail-"));
    try {
      git(dir, ["init", "-q"]);
      fs.writeFileSync(path.join(dir, "README.md"), "init\n");
      git(dir, ["add", "README.md"]);
      git(dir, ["commit", "-qm", "init"]);
      git(dir, ["branch", "-M", "main"]);

      const result = spawnFederatedWorktree({
        repo: dir,
        branch: "feat/x",
        base: "missing-base-branch",
      });
      expect(result.success).toBe(false);
      expect(result.message).toContain("git worktree add failed");
      expect(fs.existsSync(path.join(dir, ".worktrees", "feat-x"))).toBe(false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("a dry-run sweep counts zero removals", () => {
    const report = sweepFederatedWorktrees(
      [
        {
          path: "/tmp/not-removed",
          repo: "/tmp/repo",
          branch: "feat/x",
          headCommit: "abc1234",
          isBare: false,
          isClean: true,
          status: "STALE",
          ageDays: 8,
        },
      ],
      { prune: true, maxAgeDays: 7 },
    );
    expect(report.prunedCount).toBe(0);
    expect(report.prunedPaths[0]).toContain("DRY_RUN");
  });

  test("an unparsable expiry fails closed", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "expiry-"));
    try {
      const deliverable = path.join(dir, ".agents", "deliverables", "client-preview");
      fs.mkdirSync(deliverable, { recursive: true });
      fs.writeFileSync(
        path.join(deliverable, "metadata.json"),
        JSON.stringify({
          slug: "client-preview",
          client: "ACME",
          expiresAt: "not-a-date",
          token: "x".repeat(32),
          expired: false,
        }),
      );
      const result = checkDeliverableExpiry(dir, "client-preview");
      expect(result.expired).toBe(true);
      expect(result.hoursRemaining).toBe(0);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("the review token is not written into wrangler vars", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "deliverable-"));
    try {
      const result = scaffoldLivingDeliverable(dir, { slug: "client-preview", client: "ACME" });
      expect(result.success).toBe(true);
      const wrangler = fs.readFileSync(path.join(result.deliverableDir, "wrangler.jsonc"), "utf8");
      expect(wrangler).not.toContain("REVIEW_TOKEN");
      const worker = fs.readFileSync(path.join(result.deliverableDir, "worker.ts"), "utf8");
      expect(worker).toContain("REVIEW_TOKEN");
      expect(worker).toContain("Number.isFinite(expiryTime)");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("a lease release requires the holder (or --force)", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lease-"));
    try {
      const leaseDir = path.join(dir, ".agents", "artifacts");
      fs.mkdirSync(leaseDir, { recursive: true });
      const leasePath = path.join(leaseDir, "WORKTREE-LEASE.md");
      fs.writeFileSync(
        leasePath,
        "# WORKTREE LEASE\nowner: holder-a\nbranch: feat/x\nheartbeat: 2026-01-01T00:00:00Z\n",
      );

      const refused = spawnSync("bun", [LEASE_SCRIPT, "release", "--owner", "holder-b"], {
        cwd: dir,
        encoding: "utf8",
      });
      expect(refused.status).toBe(2);
      expect(refused.stderr).toContain("held by holder-a");
      expect(fs.existsSync(leasePath)).toBe(true);

      const forced = spawnSync("bun", [LEASE_SCRIPT, "release", "--owner", "holder-b", "--force"], {
        cwd: dir,
        encoding: "utf8",
      });
      expect(forced.status).toBe(0);
      expect(fs.existsSync(leasePath)).toBe(false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
