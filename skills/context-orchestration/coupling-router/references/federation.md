# federation — Multi-Tenant Worktree Federation, Fleet Discovery, and Concurrent Subagent Arbitration

Enterprise-grade git worktree fleet management, multi-client workspace federation, lease arbitration, and automated lifecycle sweeps for concurrent AI subagent pipelines. Enforces strict zero-branch collision invariants, isolated filesystem environments, and safe pruning of abandoned worktrees.

---

## Scope

- **Multi-Tenant Fleet Discovery**: Scans agency project domains (`~/Projects/clients/*`, `~/Projects/products/*`) discovering active and dangling worktrees via porcelain parsing.
- **Federated Worktree Registry (`WORKTREE-FEDERATION.json`)**: Tracks active branches, holding agent sessions, heartbeats, commit heads, and disk footprint across the agency federation.
- **Zero-Branch Collision Guarantee**: Guarantees that no two subagents attempt to check out the same git branch in parallel worktrees, eliminating fatal git lock errors.
- **Environment Isolation & Symlink Fencing**: Ensures spawned worktrees receive necessary build dependencies without sharing mutable `.env` state or leaking credentials.
- **Automated Worktree Sweeper**: Prunes clean, inactive worktrees older than 7 days while safely isolating uncommitted WIP.

---

## 🏛️ Worktree Federation Architecture

```
                  ┌─────────────────────────────────────┐
                  │    Coupling Router Federation Engine│
                  │       (worktree-federation.ts)      │
                  └──────────────────┬──────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
   [Client Workspace A]      [Client Workspace B]       [Agency Product]
 ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
 │ main repo (bare/dev)│   │ main repo (bare/dev)│   │ main repo (dev)     │
 │ ├── wt-feat-auth    │   │ ├── wt-feat-checkout│   │ ├── wt-refactor-api │
 │ └── wt-feat-billing │   │ └── wt-bugfix-cart  │   │ └── wt-docs-update  │
 └─────────────────────┘   └─────────────────────┘   └─────────────────────┘
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     │
                                     ▼
                    [WORKTREE-FEDERATION.json]
                 (Unified State & Lease Registry)
```

---

## 🔒 The 4 Federation Invariants

### 1. The Zero-Branch Collision Invariant (FED-001)
Git strictly forbids checking out the same local branch in two worktrees simultaneously (`fatal: '<branch>' is already checked out at '<path>'`). The Federation Engine verifies branch availability across all registered worktrees before spawning a worker. If a branch is already leased, it either attaches the session to the existing worktree or creates a namespaced topic branch (`<branch>-worker-<id>`).

### 2. Hermetic Environment Fencing (FED-002)
Worktrees must never copy or symlink unvetted credentials:
- Shared dependencies (`node_modules`) may be symlinked or shared via package manager stores (e.g. Bun/pnpm global store).
- `.env` files are never copied automatically; only `.env.example` is scaffolded, requiring explicit token injection via `context-anchor` or vault secrets.

### 3. Worktree Heartbeat & Lease Binding (FED-003)
Every active worktree maintains a registered lease in `.agents/artifacts/WORKTREE-LEASE.md` or the federation registry. Subagents update the heartbeat timestamp upon every milestone. Unclaimed worktrees with heartbeats > 30 minutes are marked `TAKEOVER_ELIGIBLE`.

### 4. Safe Pruning Invariant (FED-004)
The sweeper command will **never** delete a worktree that contains uncommitted changes, untracked source files, or unpushed commits:
- Clean + merged branches → Auto-prunable (`git worktree remove`).
- Dirty or unpushed worktrees → Marked `DIRTY_LOCKED` and preserved in the quarantine ledger.

---

## 🛠️ Federation CLI Engine (`worktree-federation.ts`)

The accompanying CLI tool manages worktree fleets across multiple client repositories:

```bash
# 1. Discover all active worktrees across client workspaces
bun skills/context-orchestration/coupling-router/scripts/worktree-federation.ts list

# 2. Spawn an isolated worktree for a specific client branch
bun skills/context-orchestration/coupling-router/scripts/worktree-federation.ts spawn \
  --repo ~/Projects/clients/acme-corp \
  --branch feat/payment-v2 \
  --base dev

# 3. Check health and active lease status across all federated worktrees
bun skills/context-orchestration/coupling-router/scripts/worktree-federation.ts status

# 4. Safely sweep and prune stale, clean worktrees older than 7 days
bun skills/context-orchestration/coupling-router/scripts/worktree-federation.ts sweep --prune
```

---

## 📊 Worktree Federation Registry Schema

```json
{
  "federationVersion": "1.0.0",
  "lastSwept": "2026-10-26T21:30:00Z",
  "worktrees": [
    {
      "path": "/home/user/Projects/clients/acme-corp/.worktrees/feat-checkout",
      "repo": "/home/user/Projects/clients/acme-corp",
      "branch": "feat/checkout",
      "headCommit": "e83f2a1",
      "status": "ACTIVE",
      "owner": "subagent-sol-8291",
      "heartbeat": "2026-10-26T21:34:00Z",
      "isClean": true,
      "ageDays": 2
    }
  ]
}
```

---

## Quality Gate

- [ ] Branch checked against all registered worktrees before spawning (FED-001).
- [ ] No `.env` credentials copied directly into secondary worktrees (FED-002).
- [ ] Worktree lease registered with active owner and valid heartbeat timestamp (FED-003).
- [ ] Prune commands verify `isClean === true` and zero unpushed commits before deletion (FED-004).
- [ ] Federation registry updated deterministically on every lifecycle transition.

---

## Routing

- Single-repository lease locking and collision checks → `coupling-router:worktree-lease-protocol`.
- Pruning stale local worktrees in the current repo → `cleanup-git-worktrees`.
- Multi-client workspace directory partitioning → `ops:vault`.
- Multi-agent task graph routing → `coupling-router:coupling-matrix`.
