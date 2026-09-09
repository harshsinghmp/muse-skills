# Dogfooding the Suite — External Test Runbook

The suite passes its own tests, but its real contract is behavior on **foreign
projects**. This runbook exercises the multi-project story this repo cannot
test on itself: cross-session continuity, workstream parking, evidence
tracking, and shared-checkout safety. Run it on any real client/work repo
(git-tracked, not a fork of muse-skills).

**Budget**: ~45 minutes. **Prerequisite**: suite installed (`npx skills add
harshsinghmp/muse-skills`) and the target repo has a clean working tree.

---

## Why external dogfooding

This repo's own dogfooding validates single-project behavior, but three
capabilities only fire on real multi-project usage:

| Capability | Needs |
|:---|:---|
| `/evidence brief` context-switching | 2+ projects with separate factual state |
| `context-anchor` workstream parking | Interruptions between unrelated client tasks |
| Shared-checkout lease | A second session/agent entering the same clone |

---

## The 8-step run

Run these in order on the target repo. Record pass/fail per step — a step
"passes" when the artifact exists, is within its stated budget, and required
no manual fixing.

### 1. Baseline audit (`ai-ready`) — ~3 min

```bash
bun <skills-dir>/ai-ready/scripts/ai-ready.ts --audit
```

- **Expect**: an honest score (likely <13/13 on a client repo) + a tip listing
  scaffolding-owned gaps.
- **Pass**: score output is accurate when spot-checked (e.g. it claims
  `llms.txt` missing ⟷ it really is missing).
- **Then**: `--scaffold` and re-audit. Expect the scaffolding-owned assets to
  flip to present with zero clobber of existing files (`git status` shows only
  additions).

### 2. Instruction sync (`updateagents`) — ~5 min

Ask your agent: *"run updateagents"*. Expect a lean root `AGENTS.md` (<50
lines), a `.agents/context/` pack, and a change report. Verify `bun test` (or
the repo's suite) still passes and `git diff` shows no source-code changes.

### 3. Evidence onboarding (`/evidence onboard`) — ~5 min

Expect `.agents/context/evidence-ledger.md` with `[IMPORTED]` entries mined
from existing context + an audit pass. **Check**: no invented facts — every
imported entry must trace to a real file in the repo.

### 4. Record reality (`/evidence decide`, `/evidence commit`) — ~5 min

Record one real decision ("we chose X because Y") and one real commitment.
**Check**: the DECISION entry lists ≥2 options; the COMMITMENT has an ISO
deadline; the dashboard regenerates with a plausible health score.

### 5. Park & switch (`context-anchor` `/park`, `/switch-task`) — ~5 min

Park the current workstream under a slug, switch to a second task (even a
trivial one), then switch back. **Check**: resume emits the ≤3-line re-entry
block; `workstream:`/`branch:` headers present; nothing from the parked
workstream leaked into the second task.

### 6. Ambient continuity (session death) — ~5 min

**Kill the agent session mid-task** (close the terminal — really do it).
Open a brand-new conversation in the same directory and say nothing. **Check**:
the fresh agent probes `HANDOFF.md`, emits the ≤5-line resumption block, and
continues the interrupted task. This is the run's signature test.

### 7. Shared-checkout lease (two sessions) — ~10 min

With session A holding a task, open session B in the same clone and start a
git-mutating task. **Check**: B probes `.agents/artifacts/WORKTREE-LEASE.md`
and **defers** (separate worktree / read-only / wait) instead of switching
branches. Then kill A, wait out the 30-min heartbeat (or hand-edit the
heartbeat to be stale), and confirm B **takes over** and preserves A's WIP.

### 8. The bulk-edit gate (`updatedocs` Step 21) — ~5 min

Ask the agent to run a scripted multi-file doc sweep (e.g. "rename `fooBar`
to `foo_bar` across all docs"). **Check**: the agent runs a diff audit +
mechanical re-check *before* committing, and reverts/redoes on damage rather
than patching.

---

## Scoring & follow-up

- **8/8 pass**: the suite is externally validated — log the run in the target
  repo's `.agents/artifacts/` and move on.
- **Any fail**: capture the step, the expected-vs-actual behavior, and the
  repo shape (monorepo? nested git? unusual runtime?). File it against the
  owning skill — the failure is a skill bug, not a runbook problem.
- **Re-run cadence**: after any skill version bump, re-run steps 6 and 7 only
  (the continuity pair) — they are the most behavior-sensitive.

## Known limitations to watch for

- Runtimes without a memory tool: `handoff` must fall back to
  `.agents/context/` (ladder rung 3) gracefully.
- Non-Bun environments: `worktree-lease.ts` needs Bun; the lease protocol
  itself is manual-runnable from its reference.
- Windows: scripts are untested on CMD; report any path-separator issues.
