#!/usr/bin/env bun
/**
 * worktree-federation.ts — Multi-Tenant Worktree Federation & Fleet Manager.
 *
 * Discovers, tracks, leases, and prunes git worktrees across client workspaces.
 * Enforces Zero-Branch Collisions (FED-001) and Safe Pruning (FED-004).
 *
 * Usage:
 *   bun worktree-federation.ts list [--json]
 *   bun worktree-federation.ts spawn --repo <dir> --branch <name> [--base <base>] [--owner <id>]
 *   bun worktree-federation.ts status [--json]
 *   bun worktree-federation.ts sweep [--prune] [--max-age <days>]
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export interface FederatedWorktree {
  path: string;
  repo: string;
  branch: string;
  headCommit: string;
  isBare: boolean;
  isClean: boolean;
  status: "ACTIVE" | "IDLE" | "DIRTY_LOCKED" | "STALE";
  owner?: string;
  heartbeat?: string;
  ageDays: number;
}

export interface SweepReport {
  sweptAt: string;
  totalFound: number;
  prunedCount: number;
  preservedDirtyCount: number;
  prunedPaths: string[];
  preservedPaths: string[];
}

function execGit(repo: string, args: string[]): string {
  try {
    return execFileSync("git", args, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

export function parsePorcelainWorktrees(porcelainText: string, repoRoot: string): FederatedWorktree[] {
  const worktrees: FederatedWorktree[] = [];
  const blocks = porcelainText
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block.split("\n");
    let wtPath = "";
    let head = "";
    let branch = "detached";
    let isBare = false;

    for (const line of lines) {
      if (line.startsWith("worktree ")) wtPath = line.substring(9).trim();
      else if (line.startsWith("HEAD ")) head = line.substring(5).trim();
      else if (line.startsWith("branch refs/heads/")) branch = line.substring(18).trim();
      else if (line === "bare") isBare = true;
    }

    if (!wtPath) continue;

    let isClean = true;
    let ageDays = 0;

    if (!isBare && existsSync(wtPath)) {
      const statusOut = execGit(wtPath, ["status", "--porcelain"]);
      isClean = statusOut.length === 0;

      try {
        const stats = statSync(wtPath);
        ageDays = Math.floor((Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24));
      } catch {
        ageDays = 0;
      }
    }

    // Read local lease if present
    const leasePath = join(wtPath, ".agents", "artifacts", "WORKTREE-LEASE.md");
    let owner: string | undefined;
    let heartbeat: string | undefined;

    if (existsSync(leasePath)) {
      try {
        const raw = readFileSync(leasePath, "utf8");
        const oMatch = raw.match(/^owner:\s*(.+)$/m);
        const hMatch = raw.match(/^heartbeat:\s*(.+)$/m);
        if (oMatch) owner = oMatch[1].trim();
        if (hMatch) heartbeat = hMatch[1].trim();
      } catch {
        // ignore
      }
    }

    let status: FederatedWorktree["status"] = "IDLE";
    if (!isClean) {
      status = "DIRTY_LOCKED";
    } else if (owner && heartbeat) {
      const hbTime = new Date(heartbeat).getTime();
      if (!Number.isNaN(hbTime) && Date.now() - hbTime < 30 * 60 * 1000) {
        status = "ACTIVE";
      } else {
        status = "STALE";
      }
    } else if (ageDays >= 7) {
      status = "STALE";
    }

    worktrees.push({
      path: wtPath,
      repo: repoRoot,
      branch,
      headCommit: head.substring(0, 7),
      isBare,
      isClean,
      status,
      owner,
      heartbeat,
      ageDays,
    });
  }

  return worktrees;
}

export function discoverWorktreesForRepo(repoPath: string): FederatedWorktree[] {
  if (!existsSync(join(repoPath, ".git"))) return [];
  const raw = execGit(repoPath, ["worktree", "list", "--porcelain"]);
  return parsePorcelainWorktrees(raw, repoPath);
}

export function discoverFederation(targetDirs?: string[]): FederatedWorktree[] {
  const roots = targetDirs && targetDirs.length > 0 ? targetDirs : [process.cwd()];
  const all: FederatedWorktree[] = [];

  for (const root of roots) {
    if (!existsSync(root)) continue;
    if (existsSync(join(root, ".git"))) {
      all.push(...discoverWorktreesForRepo(root));
    } else {
      // Scan child directories for repos
      try {
        const entries = readdirSync(root, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory() && existsSync(join(root, entry.name, ".git"))) {
            all.push(...discoverWorktreesForRepo(join(root, entry.name)));
          }
        }
      } catch {
        // ignore
      }
    }
  }

  return all;
}

export function spawnFederatedWorktree(opts: { repo: string; branch: string; base?: string; owner?: string }): {
  success: boolean;
  path: string;
  message: string;
} {
  const repo = resolve(opts.repo);
  if (!existsSync(join(repo, ".git"))) {
    return { success: false, path: "", message: `Directory is not a git repository: ${repo}` };
  }

  // 1. Invariant FED-001: Check for branch collision
  const existing = discoverWorktreesForRepo(repo);
  const collision = existing.find((w) => w.branch === opts.branch);
  if (collision) {
    return {
      success: false,
      path: collision.path,
      message: `Branch collision (FED-001): Branch '${opts.branch}' is already checked out at '${collision.path}'.`,
    };
  }

  // 2. Prepare target worktree folder
  const slug = opts.branch.replace(/[^a-zA-Z0-9_-]/g, "-");
  const targetPath = join(repo, ".worktrees", slug);

  if (existsSync(targetPath)) {
    return {
      success: false,
      path: targetPath,
      message: `Target path already exists: ${targetPath}. Run sweep or clean first.`,
    };
  }

  mkdirSync(dirname(targetPath), { recursive: true });

  // 3. Create worktree via git
  const baseBranch = opts.base || "dev";
  const branchExists = execGit(repo, ["rev-parse", "--verify", `refs/heads/${opts.branch}`]).length > 0;

  const gitArgs = branchExists
    ? ["worktree", "add", targetPath, opts.branch]
    : ["worktree", "add", "-b", opts.branch, targetPath, baseBranch];

  execGit(repo, gitArgs);

  // 4. Invariant FED-003: Register lease
  const leaseDir = join(targetPath, ".agents", "artifacts");
  mkdirSync(leaseDir, { recursive: true });
  const now = new Date().toISOString();
  const leaseBody = [
    "# WORKTREE LEASE",
    `owner: ${opts.owner || "federated-subagent"}`,
    `branch: ${opts.branch}`,
    `acquired: ${now}`,
    `heartbeat: ${now}`,
    "scope: federated-task",
    `notes: spawned via worktree-federation.ts`,
    "",
  ].join("\n");
  writeFileSync(join(leaseDir, "WORKTREE-LEASE.md"), leaseBody);

  return {
    success: true,
    path: targetPath,
    message: `Spawned worktree at ${targetPath} for branch '${opts.branch}'.`,
  };
}

export function sweepFederatedWorktrees(
  worktrees: FederatedWorktree[],
  opts: { prune?: boolean; maxAgeDays?: number } = {},
): SweepReport {
  const maxAge = opts.maxAgeDays ?? 7;
  const prunedPaths: string[] = [];
  const preservedPaths: string[] = [];

  for (const wt of worktrees) {
    if (wt.isBare) continue;
    // Don't prune main working tree
    if (resolve(wt.path) === resolve(wt.repo)) continue;

    if (!wt.isClean) {
      preservedPaths.push(`${wt.path} (DIRTY_LOCKED: uncommitted changes)`);
      continue;
    }

    if (wt.status === "ACTIVE") {
      preservedPaths.push(`${wt.path} (ACTIVE_LEASE: lease held by ${wt.owner})`);
      continue;
    }

    if (wt.ageDays >= maxAge || wt.status === "STALE") {
      if (opts.prune) {
        execGit(wt.repo, ["worktree", "remove", "--force", wt.path]);
        prunedPaths.push(wt.path);
      } else {
        prunedPaths.push(`${wt.path} (DRY_RUN: eligible for prune)`);
      }
    } else {
      preservedPaths.push(`${wt.path} (FRESH: age ${wt.ageDays}d < ${maxAge}d)`);
    }
  }

  return {
    sweptAt: new Date().toISOString(),
    totalFound: worktrees.length,
    prunedCount: prunedPaths.length,
    preservedDirtyCount: preservedPaths.filter((p) => p.includes("DIRTY_LOCKED")).length,
    prunedPaths,
    preservedPaths,
  };
}

// CLI Execution
if (import.meta.main) {
  const args = process.argv.slice(2);
  const isJson = args.includes("--json");

  if (args.includes("list")) {
    const wts = discoverFederation();
    if (isJson) {
      console.log(JSON.stringify(wts, null, 2));
    } else {
      console.log(`\n🌐 Federated Worktree Fleet (${wts.length} discovered):`);
      for (const w of wts) {
        const flag = w.isBare ? "[BARE]" : w.isClean ? "[CLEAN]" : "[DIRTY]";
        console.log(`  • ${w.branch.padEnd(20)} ${w.status.padEnd(12)} ${flag} ${w.path}`);
      }
    }
  } else if (args.includes("status")) {
    const wts = discoverFederation();
    const active = wts.filter((w) => w.status === "ACTIVE").length;
    const dirty = wts.filter((w) => w.status === "DIRTY_LOCKED").length;
    const stale = wts.filter((w) => w.status === "STALE").length;
    const idle = wts.filter((w) => w.status === "IDLE").length;

    if (isJson) {
      console.log(JSON.stringify({ total: wts.length, active, dirty, stale, idle, worktrees: wts }, null, 2));
    } else {
      console.log("\n📊 Multi-Tenant Worktree Federation Status:");
      console.log(`  Total Worktrees: ${wts.length}`);
      console.log(`  Active Leases:   ${active}`);
      console.log(`  Dirty Locked:    ${dirty}`);
      console.log(`  Stale (>7d):     ${stale}`);
      console.log(`  Idle Clean:      ${idle}`);
    }
  } else if (args.includes("spawn")) {
    const repoIdx = args.indexOf("--repo");
    const branchIdx = args.indexOf("--branch");
    const baseIdx = args.indexOf("--base");
    const ownerIdx = args.indexOf("--owner");

    if (repoIdx === -1 || branchIdx === -1) {
      console.error("Error: --repo and --branch are required for spawn.");
      process.exit(1);
    }

    const res = spawnFederatedWorktree({
      repo: args[repoIdx + 1],
      branch: args[branchIdx + 1],
      base: baseIdx !== -1 ? args[baseIdx + 1] : undefined,
      owner: ownerIdx !== -1 ? args[ownerIdx + 1] : undefined,
    });

    if (!res.success) {
      console.error(`❌ ${res.message}`);
      process.exit(1);
    }
    console.log(`✅ ${res.message}`);
  } else if (args.includes("sweep")) {
    const doPrune = args.includes("--prune");
    const ageIdx = args.indexOf("--max-age");
    const maxAge = ageIdx !== -1 ? Number.parseInt(args[ageIdx + 1], 10) : 7;

    const wts = discoverFederation();
    const rep = sweepFederatedWorktrees(wts, { prune: doPrune, maxAgeDays: maxAge });

    if (isJson) {
      console.log(JSON.stringify(rep, null, 2));
    } else {
      console.log(`\n🧹 Worktree Federation Sweep (${doPrune ? "PRUNE" : "DRY RUN"}):`);
      console.log(`  Total Scanned:      ${rep.totalFound}`);
      console.log(`  Eligible / Pruned:  ${rep.prunedCount}`);
      console.log(`  Dirty Preserved:    ${rep.preservedDirtyCount}`);
      for (const p of rep.prunedPaths) console.log(`    - 🗑️  ${p}`);
      for (const p of rep.preservedPaths) console.log(`    - 🛡️  ${p}`);
    }
  } else {
    console.log("Usage: bun worktree-federation.ts [list|status|spawn|sweep] [--json] [--prune]");
  }
}
