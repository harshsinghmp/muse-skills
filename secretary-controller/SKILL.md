---
name: secretary-controller
description: "Evidence-grounded staff-work controller and approval gate for high-stakes decisions, executive briefs, memos, and outbound actions. Enforces judgment over authority, explicit dissent preservation, frozen evidence snapshots, and single-use hash approvals before any filesystem or external mutation."
version: 1.0.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [staff-work, executive-brief, approval-gate, governance, decision-memo, evidence, hash-approval]
    related_skills: [evidence-ledger, agent-handoff, dead-letter, gauntlet-loop]
    requires_tools: [bash, view_file, write_to_file, replace_file_content]
---

# 📑 Secretary Controller — Evidence-Grounded Staff-Work Controller

> Controls high-stakes staff work (executive briefs, decision memos, architecture governance, outbound comms). Enforces the iron doctrine of *Judgment, not authority*: agents synthesize evidence, explicitly preserve contradictions and uncertainties, and halt at an unyielding cryptographic single-use hash approval gate before committing any real-world changes.

---

## When to Use

### Trigger Conditions
Execute this skill when:
1. **Preparing High-Stakes Staff Work**: Drafting executive summaries, investment/architecture decision memos, RFCs, or principal briefs.
2. **Mandatory Approval Gates**: Any operation involving irreversible filesystem writes, production deployments, database migrations, or outbound communications.
3. **Preserving Critical Dissent**: Complex problem spaces where contradictory data, uncertainty, or "no data" gaps must be preserved rather than papered over.
4. **Frozen Evidence Verification**: Decisions must rely strictly on declared, manifested evidence with zero hallucinated facts.

### Anti-Triggers
Do NOT use this skill when:
- Performing routine code refactoring covered by automated test suites.
- Executing minor documentation typo fixes.
- Running sandbox experiments where fast autonomous exploration is desired.

---

## Quick Reference

### The 4 Core Doctrines of Staff Work

```
┌─────────────────────────┐     ┌─────────────────────────┐
│ 1. Judgment, Not Power  │     │ 2. Dissent Preservation │
│ Recommends with rigor;  │     │ Surfaces contradictions │
│ halts at approval gate  │     │ and data gaps openly    │
└─────────────────────────┘     └─────────────────────────┘
             │                               │
             ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│ 3. Frozen Evidence      │     │ 4. Single-Use Hash Gate │
│ Zero extrapolation;     │     │ SHA-256 confirmation    │
│ cited primary sources   │     │ required for execution  │
└─────────────────────────┘     └─────────────────────────┘
```

### Approval State Machine

| State | Meaning | Allowed Actions |
| :--- | :--- | :--- |
| `DRAFTING` | Compiling facts and surfacing uncertainties | Read-only tools, evidence collection |
| `NEEDS_APPROVAL` | Recommendation frozen with payload SHA-256 | Output `APPROVAL_PACKET.md`, wait for user hash confirmation |
| `APPROVED` | User matches exact SHA-256 hash token | Execute proposed mutation |
| `REJECTED` | User rejects or requests modifications | Record feedback, return to `DRAFTING` |

---

## Procedure

### Step 1 — Evidence Ingestion & Snapshot Freezing
1. Declare all factual sources (file paths, test logs, URL citations).
2. Construct the **Evidence Register**—every claim in the memo must link to a specific line range or test receipt.
3. Mark any unknown, missing, or contradictory data points as `[NO-DATA]` or `[CONTRADICTION]`.

### Step 2 — Construct the Completed Staff Work Packet
Synthesize the decision artifact containing:
- **Core Recommendation**: Unambiguous 1-sentence action proposal.
- **Context & Strategic Trade-offs**: Why this approach beats alternatives.
- **Preserved Dissent & Risks**: Explicit failure modes and counter-arguments.
- **Payload Manifest**: Exact files to be created/modified or shell commands to run.

### Step 3 — Compute Payload Hash & Emit Approval Gate
1. Calculate the SHA-256 checksum of the proposed diff or execution payload:
   ```bash
   echo "<payload_content>" | sha256sum | cut -d' ' -f1
   ```
2. Generate `APPROVAL_PACKET.md` with:
   - State: `NEEDS_APPROVAL`
   - Payload SHA-256: `SHA256:<hash>`
   - Prompt: *"To execute, approve with token `APPROVE:<hash>`."*
3. **HALT**. Do NOT execute payload without matching user confirmation.

### Step 4 — Verification & Single-Use Execution
Upon receiving user approval:
1. Validate token matches computed SHA-256 hash.
2. Execute the approved mutations.
3. Stamp the artifact as `EXECUTED` with execution timestamp.

---

## Pitfalls

- **Hallucinating Authority**: Never execute mutations or external sends under the assumption that "the user would want this". Stop at `NEEDS_APPROVAL`.
- **Smoothing Over Dissent**: Do not hide trade-offs or negative benchmark findings to make a memo look cleaner.
- **Floating Approvals**: Re-running execution on a modified payload without computing a fresh SHA-256 hash is strictly prohibited.
- **Unverified Assumptions**: If a metric is unknown, write `[NO DATA AVAILABLE]` instead of estimating.

---

## Verification

Before issuing an approval packet, verify:
1. [ ] Every factual claim links to verified evidence in the register.
2. [ ] Dissent, alternative approaches, and failure modes are explicitly documented.
3. [ ] Proposed diff/payload has a valid SHA-256 checksum computed.
4. [ ] Execution stops completely until explicit cryptographic or user approval is received.
