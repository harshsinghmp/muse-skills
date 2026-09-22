# Dogfooding the Suite — External Repository Test Runbook

> **The ACCA Standard for Real-World Validation**: Awareness, Comprehension, Conviction, and Action.

The `muse-skills` suite passes 124 internal tests, but its ultimate contract is deterministic performance on **foreign production repositories**. This runbook exercises the multi-project invariants that cannot be tested inside this repository itself: cross-session continuity, workstream parking, evidence isolation, and shared-checkout branch safety.

Run this protocol on any real-world client or agency codebase (git-tracked, not a fork of `muse-skills`).

- **Total Time Budget**: ~45 minutes.
- **Prerequisite**: Suite installed (`npx skills add harshsinghmp/muse-skills`) and target repo has a clean working tree (`git status` clean).

---

## 👁️ 1. Awareness (The Reality Gap)

Why is external dogfooding mandatory before claiming production readiness?

Internal unit tests (`bun test`) validate syntax, schemas, and mock executions within a controlled environment. However, real-world development introduces chaos that unit tests cannot simulate:
- Sudden terminal kills and dropped context windows mid-refactor.
- Unrelated emergency client tasks interrupting active development branches.
- Two distinct AI agents or human developers operating simultaneously in the same local git checkout.
- Legacy client codebases lacking modern documentation or strict typing.

A skill that only works in its own repo is an experiment. A skill that survives foreign codebases is a production tool.

---

## 🧠 2. Comprehension (The Three Multi-Project Invariants)

External dogfooding specifically exercises three cross-boundary capabilities:

| Capability | What It Exercises | Why Foreign Repositories Are Required |
|:---|:---|:---|
| **`/evidence brief` Context Switching** | Project-specific facts, decisions, and constraints | Requires 2+ distinct repositories with conflicting client states. |
| **`context-anchor` Workstream Parking** | Clean context isolation during sudden interruptions | Simulates switching between unrelated client tasks without cross-polluting memory. |
| **`coupling-router` Shared Lease** | File-lock arbitration across concurrent agent sessions | Requires multiple agent instances entering the same git working directory. |

---

## 🎯 3. Conviction (The 8-Step Validation Gauntlet)

Execute these 8 chronological steps on the target repository. A step **passes** only when the output artifact exists, complies with stated line/token budgets, and required zero manual correction.

### Step 1: Baseline AI-Readiness Audit (`ai-ready`) — ~3 min

```bash
bun <skills-dir>/ai-ready/scripts/ai-ready.ts --audit
```

- **Expect**: An objective compliance score (typically <13/13 on foreign client repos) and a gap analysis.
- **Pass Criteria**: Output accurately identifies missing assets (e.g., confirms missing `llms.txt` or `.mcp.json`).
- **Follow-up**: Run `--scaffold` and re-audit. Verify assets are provisioned with **zero clobber** of existing client code.

### Step 2: Instruction Synchronization (`updateagents`) — ~5 min

Ask your agent: *"run updateagents"*.
- **Expect**: A concise root `AGENTS.md` (<50 lines), an isolated `.agents/context/` pack, and a change summary.
- **Pass Criteria**: Existing test suite passes, and `git diff` shows zero application code alterations.

### Step 3: Evidence Onboarding (`/evidence onboard`) — ~5 min

Run `/evidence onboard` or invoke the `evidence-ledger` skill.
- **Expect**: `.agents/context/evidence-ledger.md` generated with `[IMPORTED]` entries mined from repository truth.
- **Pass Criteria**: Zero invented claims; every imported entry maps to a verified file or commit in the target repository.

### Step 4: Record Decisions & Commitments (`/evidence decide`, `/evidence commit`) — ~5 min

Record one real technical decision ("Selected Drizzle over Prisma due to cold start overhead") and one concrete milestone commitment.
- **Pass Criteria**: Decision entry documents ≥2 alternatives considered; commitment carries an ISO deadline; evidence dashboard calculates health.

### Step 5: Park & Switch Workstreams (`context-anchor`) — ~5 min

Park the active task under a slug (`/park auth-migration`), switch to a second trivial task, then resume (`/switch-task auth-migration`).
- **Pass Criteria**: Resumption emits a ≤3-line re-entry summary; `workstream:` headers match; zero leakage from task B into task A.

### Step 6: Ambient Session Continuity (`relay`) — ~5 min (Signature Test)

**Kill the agent session mid-task** (force-close terminal or terminate process). Open a fresh terminal and launch an agent with zero prompt input.
- **Expect**: The fresh agent automatically probes `HANDOFF.md`, parses live state, and emits a ≤5-line resumption block.
- **Pass Criteria**: Agent resumes the exact interrupted task without asking the user what it was working on.

### Step 7: Shared-Checkout Lease Protection (`coupling-router`) — ~10 min

While Session A is executing a task, open Session B in the same directory and initiate a git-mutating operation.
- **Pass Criteria**: Session B detects active `WORKTREE-LEASE.md` and **defers** (proposing a temporary worktree or waiting) rather than switching branches underneath Session A. When Session A terminates, Session B cleanly claims lease.

### Step 8: Bulk-Edit Verification Gate (`updatedocs`) — ~5 min

Instruct the agent to perform a multi-file documentation sweep (e.g., updating a renamed configuration key across all guides).
- **Pass Criteria**: Agent executes a pre-commit diff audit and mechanical check before staging, refusing to commit corrupted markup.

---

## ⚡ 4. Action (Scoring & Diagnostic Triage)

### Final Evaluation Scorecard

- **8 / 8 Pass**: **Certified Production-Ready**. Log the test run in the target repository's `.agents/artifacts/dogfood-report.md`.
- **Any Failure**: Immediate escalation. Capture the exact terminal output, expected-vs-actual delta, and host repository shape (e.g., monorepo, nested submodules). File an issue targeting the specific skill.

### Diagnostic Matrix & Known Edges

| Symptom | Probable Root Cause | Immediate Remediation |
|:---|:---|:---|
| Session fails to resume in Step 6 | Missing or unwritten `HANDOFF.md` | Verify `relay` has file write permissions in target repository. |
| Session B clobbers Session A in Step 7 | Non-Bun environment or missing lease check | Confirm `worktree-lease-check.sh` hook is installed in `.git/hooks/`. |
| Audit reports inaccurate gaps in Step 1 | Non-standard directory structure | Provide explicit root path via `--root <path>`. |
