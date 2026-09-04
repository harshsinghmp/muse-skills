---
name: gauntlet-loop
description: "Bounded multi-agent quality improvement loop that prevents infinite iterations, self-grading delusions, and regression churn. Orchestrates Builder, Fresh Critic, Automated Gate (with web application security headers and visual breakpoint audit), and Integrator roles with strict stop conditions (proof of passing, 2-round score plateau, regression, or max iteration budget). Generates GAUNTLET_JOB_CONTRACT.md, ITERATION_LEDGER.md, and ACCEPTANCE_PACKET.md."
version: 1.1.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [gauntlet, quality-loop, multi-agent, verification, benchmarking, orchestration, governance, security-headers, visual-regression, owasp, responsive-testing]
    related_skills: [pua, agent-handoff, dead-letter, coupling-router, evidence-ledger]
    requires_tools: [bash, view_file, write_to_file, replace_file_content, run_command]
---

# 🛡️ Gauntlet Loop — Bounded Multi-Agent Quality Improvement Loop

> A deterministic, bounded quality improvement loop that eliminates infinite token burns, self-grading delusions, and regression churn. Deploys an unyielding, 4-role protocol (Freeze → Build → Fresh Critic → Automated Gate → Integrator) with hard mathematically enforced termination boundaries, OWASP security header verification, and multi-viewport visual regression gates.

---

## When to Use

### Trigger Conditions
Execute this skill when:
1. **Multi-Round Code/Doc Refinement**: A complex task requires iterative quality improvement across multiple passes.
2. **Preventing Self-Grading Delusion**: The builder agent must NOT evaluate its own output; an isolated *Fresh Critic* must score the work against frozen criteria.
3. **Web Application Hardening Gate**: Iterating on web apps, frontend templates, or API servers requiring strict security headers (CSP, HSTS) and responsive viewport checks (375px, 768px, 1280px).
4. **Hard Stop Boundaries Required**: Guarding against runaway agent loops where changes oscillate or degrade previous passes.
5. **Mission-Critical Delivery**: High-stakes deliverables requiring an ironclad `ACCEPTANCE_PACKET.md`.

### Anti-Triggers
Do NOT use this skill when:
- The task is a trivial one-liner fix or typo correction (use direct editing).
- The task is exploratory research without a concrete deliverable (use research subagent).
- Task dependencies are heavily coupled and unsplit (run [`coupling-router`](../coupling-router/SKILL.md) first).

---

## Quick Reference

### The 4 Gauntlet Roles

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────────────────┐       ┌─────────────────┐
│     BUILDER     │ ────▶ │  FRESH CRITIC   │ ────▶ │       AUTOMATED GATE        │ ────▶ │   INTEGRATOR    │
│ Minimal, clean  │       │ Blind audit vs  │       │ Tests, types, secret scans, │       │ Merges ONLY the │
│ diff candidate  │       │ frozen rubric   │       │ security headers & viewports│       │ #1 largest fix  │
└─────────────────┘       └─────────────────┘       └─────────────────────────────┘       └─────────────────┘
```

### Stop Conditions Matrix

| Condition | Trigger Rule | Action |
| :--- | :--- | :--- |
| **✅ Proof of Passing** | All automated tests green + Critic score $\ge 9.0/10$ + zero blockers + security/visual gates pass | **TERMINATE (SUCCESS)** → Output `ACCEPTANCE_PACKET.md` |
| **🛑 Score Plateau** | 2 consecutive rounds without net score improvement ($\Delta \le 0$) | **TERMINATE (PLATEAU)** → Emit Dead-Letter escalation |
| **📉 Score Regression** | Round score drops by $> 1.0$ point or automated tests break | **REVERT** to previous round baseline & halt |
| **⏳ Budget Exhaustion** | Reaches `max_iterations` (default: 3 rounds, hard max: 5) | **TERMINATE (BUDGET)** → Deliver current best checkpoint |
| **👤 Human Override** | Explicit user halt or steering directive | **HALT** immediately |

### Web Application Automated Gate Checklist

When evaluating web endpoints or frontend components:
- **Security Headers (OWASP)**: CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Responsive Viewports**: Tested at `375px` (mobile), `768px` (tablet), `1280px` (desktop) for zero horizontal scrollbar overflow (`scrollWidth === innerWidth`).

---

## Procedure

### Step 1 — Freeze the Job Contract (`GAUNTLET_JOB_CONTRACT.md`)
Before executing any generation or editing, lock the contract in workspace root:
1. **Goal**: Precise, measurable objective statement.
2. **Acceptance Criteria**: 3–5 binary checkboxes (must be objectively verifiable). Include web security headers and responsive viewport criteria if delivering web applications.
3. **Automated Proof Commands**: Pinned commands (e.g., `bun test`, `tsc --noEmit`, `SecretScan.ts`, curl header audits).
4. **Iteration Budget**: Max rounds (default 3).

### Step 2 — Round Execution Loop

```
Round N (N = 1..max_rounds):
  1. BUILD: Builder produces candidate patch based strictly on previous round critic feedback.
  2. AUDIT: Spawn isolated Fresh Critic subagent with NO memory of builder reasoning. Critic scores 0.0–10.0 across 4 axes:
     - Correctness & Invariants (40%)
     - Minimal Diff Discipline (25%)
     - Edge-Case Coverage (20%)
     - Architectural Cleanliness (15%)
  3. GATE: Run automated proof suite AND Web App Security & Visual Gate (see references/web-security-visual-gate.md):
     - Check 5 mandatory security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
     - Check 3 responsive viewports (375px, 768px, 1280px) for zero horizontal overflow.
     - Any test failure, missing critical security header, or visual overflow zeroes the round score (0.0).
  4. RECORD: Append round metrics, header receipts, and viewport outcomes to ITERATION_LEDGER.md.
  5. DECIDE: Evaluate Stop Conditions Matrix.
```

### Step 3 — Integrator Gate
The Integrator agent NEVER merges bulk diffs. It isolates and applies **only the single highest-impact delta** that directly improved the score, preserving all previously verified baselines.

### Step 4 — Acceptance Packet Synthesis (`ACCEPTANCE_PACKET.md`)
Upon reaching success termination, compile the final artifact:
- Summary of rounds executed and score trajectory ($R_1 \rightarrow R_N$).
- Verbatim execution receipts of automated proof commands, security headers, and viewport checks.
- Verified diff summary and signature.

---

## Pitfalls

- **Self-Grading Bias**: Never allow the builder subagent to evaluate its own work. The critic MUST run in an isolated conversation context.
- **Overlooking Security Headers**: Shipping web apps or APIs with missing CSP or HSTS headers.
- **Horizontal Scroll Blowout**: Failing to audit the 375px mobile viewport for layout blowouts.
- **Diff Bloat Across Iterations**: Reject candidates that expand the diff surface by $>30\%$ without a proportional score increase.
- **Ignoring Score Plateau**: If round 2 scores 7.5 and round 3 scores 7.4, STOP immediately. Do not attempt round 4.

---

## Verification

Before declaring gauntlet completion:
1. [ ] `GAUNTLET_JOB_CONTRACT.md` exists with frozen acceptance criteria.
2. [ ] `ITERATION_LEDGER.md` logs every round with objective critic score breakdown.
3. [ ] All automated proof commands exit with return code `0`.
4. [ ] Web applications pass security header audit (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
5. [ ] Multi-viewport visual check passes at 375px, 768px, and 1280px with zero horizontal overflow.
6. [ ] `ACCEPTANCE_PACKET.md` is generated with final verification receipts.
