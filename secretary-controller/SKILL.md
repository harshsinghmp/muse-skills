---
name: secretary-controller
description: "Evidence-grounded staff-work controller and approval gate for high-stakes decisions, executive briefs, memos, and outbound actions. Enforces judgment over authority, Socratic adversarial stress-testing (3-prong devil's advocate challenge), explicit dissent preservation, frozen evidence snapshots, and single-use SHA-256 hash approvals before any filesystem or external mutation."
version: 1.1.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [staff-work, executive-brief, approval-gate, governance, decision-memo, evidence, hash-approval, socratic-lens, adversarial-review, dissent-preservation]
    related_skills: [evidence-ledger, agent-handoff, dead-letter, gauntlet-loop]
    requires_tools: [bash, view_file, write_to_file, replace_file_content]
---

# 📑 Secretary Controller — Evidence-Grounded Staff-Work Controller

> Controls high-stakes staff work (executive briefs, decision memos, architecture governance, outbound comms). Enforces the iron doctrine of *Judgment, not authority*: agents synthesize evidence, stress-test proposals through a mandatory Socratic adversarial challenge (3-prong devil's advocate), preserve contradictions and uncertainties, and halt at an unyielding cryptographic single-use SHA-256 hash approval gate before committing any real-world changes.

---

## When to Use

### Trigger Conditions
Execute this skill when:
1. **Preparing High-Stakes Staff Work**: Drafting executive summaries, investment/architecture decision memos, RFCs, or principal briefs.
2. **Conducting Socratic Adversarial Review**: Subjecting architectural or operational decisions to an uncompromising devil's advocate stress test.
3. **Mandatory Approval Gates**: Any operation involving irreversible filesystem writes, production deployments, database migrations, or outbound communications.
4. **Preserving Critical Dissent**: Complex problem spaces where contradictory data, uncertainty, or "no data" gaps must be preserved rather than smoothed over.
5. **Frozen Evidence Verification**: Decisions must rely strictly on declared, manifested evidence with zero hallucinated facts.

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
│ 1. Judgment, Not Power  │     │ 2. Socratic Dissent     │
│ Recommends with rigor;  │     │ 3-prong devil's advocate│
│ halts at approval gate  │     │ challenges all premises │
└─────────────────────────┘     └─────────────────────────┘
             │                               │
             ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│ 3. Frozen Evidence      │     │ 4. Single-Use Hash Gate │
│ Zero extrapolation;     │     │ SHA-256 confirmation    │
│ cited primary sources   │     │ required for execution  │
└─────────────────────────┘     └─────────────────────────┘
```

### The Socratic Adversarial Triad

Every proposal must withstand 3 mandatory challenge angles before hashing:

| Angle | Probing Question | Focus Area |
| :--- | :--- | :--- |
| **1. Architectural Fragility** | *"Under what realistic load, edge case, or corruption does this design break?"* | SPOFs, concurrency, distributed state |
| **2. Rollback Burden** | *"If execution aborts at 50%, how catastrophic and manual is recovery?"* | Irreversible writes, missing dry-runs |
| **3. Hidden Assumptions** | *"What unverified optimistic claims is this plan treating as fact?"* | Unbenchmarked claims, API limits |

### Approval State Machine

| State | Meaning | Allowed Actions |
| :--- | :--- | :--- |
| `DRAFTING` | Compiling facts and surfacing uncertainties | Read-only tools, evidence collection |
| `ADVERSARIAL_CHALLENGE` | Formulating 3 counter-arguments & Socratic inquiry | Stress-test proposal; query principal on ambiguities |
| `NEEDS_APPROVAL` | Recommendation frozen with payload SHA-256 | Output `APPROVAL_PACKET.md`, wait for user hash confirmation |
| `APPROVED` | User matches exact SHA-256 hash token | Execute proposed mutation |
| `REJECTED` | User rejects or requests modifications | Record feedback, return to `DRAFTING` |

---

## Procedure

### Step 1 — Evidence Ingestion & Snapshot Freezing
1. Declare all factual sources (file paths, test logs, URL citations).
2. Construct the **Evidence Register**—every claim in the memo must link to a specific line range or test receipt.
3. Mark any unknown, missing, or contradictory data points as `[NO-DATA]` or `[CONTRADICTION]`.

### Step 2 — Socratic Adversarial Challenge & Devil's Advocate Gate
Prior to generating mutations or computing hashes, conduct the adversarial review (see `references/socratic-adversarial-gate.md`):
1. **Formulate 3 Counter-Arguments**:
   - Challenge Architectural Fragility (SPOFs, edge case failures).
   - Challenge Operational & Rollback Burden (recovery complexity).
   - Expose Hidden Assumptions (unverified claims).
2. **Socratic Inquiry**:
   - If critical assumptions lack grounding, ask clarifying questions before continuing.
3. **Record Dissent**:
   - Document all counter-arguments, mitigations, and accepted risks in the **Preserved Dissent Ledger**.

### Step 3 — Construct the Completed Staff Work Packet
Synthesize the decision artifact (`DECISION_MEMO.md`) containing:
- **Core Recommendation**: Unambiguous 1-sentence action proposal.
- **Context & Strategic Trade-offs**: Why this approach beats alternatives.
- **Preserved Dissent & Adversarial Ledger**: 3 counter-arguments with mitigations or accepted risks.
- **Payload Manifest**: Exact files to be created/modified or shell commands to run.

### Step 4 — Compute Payload Hash & Emit Approval Gate
1. Calculate the SHA-256 checksum of the proposed diff or execution payload:
   ```bash
   echo "<payload_content>" | sha256sum | cut -d' ' -f1
   ```
2. Generate `APPROVAL_PACKET.md` with:
   - State: `NEEDS_APPROVAL`
   - Payload SHA-256: `SHA256:<hash>`
   - Prompt: *"To execute, approve with token `APPROVE:<hash>`."*
3. **HALT**. Do NOT execute payload without matching user confirmation.

### Step 5 — Verification & Single-Use Execution
Upon receiving user approval:
1. Validate token matches computed SHA-256 hash.
2. Execute the approved mutations.
3. Stamp the artifact as `EXECUTED` with execution timestamp.

---

## Pitfalls

- **Confirmation Bias & Rubber-Stamping**: Accepting user premises uncritically without running the 3-prong devil's advocate challenge.
- **Hallucinating Authority**: Executing mutations or external sends under the assumption that "the user would want this". Always stop at `NEEDS_APPROVAL`.
- **Smoothing Over Dissent**: Hiding trade-offs, risks, or negative benchmark findings to make a memo appear neat.
- **Floating Approvals**: Re-running execution on a modified payload without computing a fresh SHA-256 hash.
- **Unverified Assumptions**: Estimating metrics instead of writing `[NO DATA AVAILABLE]`.

---

## Verification

Before issuing an approval packet, verify:
1. [ ] Every factual claim links to verified evidence in the register.
2. [ ] Socratic Adversarial Gate completed with at least 3 formulated counter-arguments.
3. [ ] Dissent, alternative approaches, and failure modes are explicitly documented in the ledger.
4. [ ] Proposed diff/payload has a valid SHA-256 checksum computed.
5. [ ] Execution stops completely until explicit cryptographic or user approval is received.
