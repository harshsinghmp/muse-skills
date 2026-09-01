---
name: evidence-ledger
description: "Source-cited claim verification gate and research ledger. Enforces the strict doctrine: 'No source, no claim. No verification path, no release.' Audits technical claims, benchmark statistics, architecture assertions, and documentation against a 4-tier confidence taxonomy ([RAW], [FETCH], [SEARCH], [INFER]). Generates claim-ledger.md."
version: 1.0.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [evidence, verification, citation, fact-checking, claims, research-gate, provenance]
    related_skills: [secretary-controller, gauntlet-loop, brain-audit, dead-letter]
    requires_tools: [bash, view_file, grep, write_to_file, replace_file_content]
---

# 📜 Evidence Ledger — Source-Cited Claim Verification Gate

> Enforces the non-negotiable verification doctrine: *"No source, no claim. No verification path, no release."* Audits all technical documentation, benchmark numbers, architectural claims, and research summaries against a rigorous 4-tier confidence taxonomy, eliminating ungrounded assertions and hallucinated facts.

---

## When to Use

### Trigger Conditions
Execute this skill when:
1. **Auditing Technical Claims**: Verifying documentation, marketing copy, or release notes making performance, security, or capability claims.
2. **Research & Architecture Synthesis**: Generating technical whitepapers, evaluation reports, or dependency audit briefs.
3. **Pre-Release Factual Gate**: Final check before publishing external or client-facing deliverables to ensure every number has a verifiable receipt.
4. **Flagging Speculative Assertions**: Detecting statements disguised as facts that are actually inferred deductions.

### Anti-Triggers
Do NOT use this skill when:
- Writing pure fictional or creative narrative copy.
- Executing internal mechanical code refactors where automated test suites provide binary feedback.

---

## Quick Reference

### The 4-Tier Confidence Taxonomy

```
┌───────────────┬─────────────────────────────────────────────────────────────┐
│ Tier Tag      │ Definition & Verification Requirement                       │
├───────────────┼─────────────────────────────────────────────────────────────┤
│ [RAW]         │ Verbatim output from local executed command or local file   │
│ [FETCH]       │ Direct quote from authoritative primary URL or official doc │
│ [SEARCH]      │ Corroborated fact supported by 2+ independent search hits   │
│ [INFER]       │ Agent logical deduction; MUST state premises explicitly     │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

### Claim Gate Matrix

| Claim Type | Minimum Required Tier | Action if Unmet |
| :--- | :--- | :--- |
| **Performance / Latency Metric** | `[RAW]` (Reproducible benchmark run) | **REDACT CLAIM** or downgrade to estimated range |
| **Security / Compliance Statement** | `[RAW]` or `[FETCH]` (Official audit/spec) | **BLOCK RELEASE** until verified |
| **External API / Library Behavior** | `[FETCH]` (Official documentation URL) | **TEST LOCALLY** to upgrade to `[RAW]` |
| **Design Rationale / Trade-off** | `[INFER]` (Explicit premises listed) | Acceptable with declared reasoning |

---

## Procedure

### Step 1 — Claim Extraction & Inventory
Scan the target artifact (markdown, doc, proposal) and extract every discrete factual statement, numeric metric, or capability claim into an enumerated list.

### Step 2 — Provenance Tagging
Assign exactly one taxonomy tag (`[RAW]`, `[FETCH]`, `[SEARCH]`, `[INFER]`) to each claim:
- If `[RAW]`: Record execution command, timestamp, and stdout snippet.
- If `[FETCH]`: Record canonical URL, access date, and quoted text.
- If `[SEARCH]`: Record query string and corroborating domains.
- If `[INFER]`: Explicitly document: *"Premise A + Premise B $\implies$ Conclusion"*.

### Step 3 — Ledger Compilation (`claim-ledger.md`)
Generate the structured ledger containing:
- **Claim ID & Statement**
- **Assigned Confidence Tier**
- **Verification Path & Exact Receipt**
- **Status**: `VERIFIED` | `UNGROUNDED` | `REDACTED`

### Step 4 — Artifact Remediation
Rewrite or annotate the target document:
- Replace ungrounded claims with verified data or remove them entirely.
- Ensure all metrics link directly to entries in `claim-ledger.md`.

---

## Pitfalls

- **Disguising Inferences as Raw Facts**: Stating *"System throughput increased by 40%"* without a raw benchmark log is a critical violation. Must be marked `[INFER]` or proven with `[RAW]`.
- **Vague Citations**: Citing *"industry benchmarks"* or *"standard research"* without specific URLs or test runs is rejected.
- **Outdated Fetched Data**: Using cached or memory-based assumptions about external library APIs without fetching current docs.

---

## Verification

Before certifying an artifact:
1. [ ] `claim-ledger.md` accounts for 100% of numeric and architectural claims.
2. [ ] Zero ungrounded or uncited assertions remain in public deliverables.
3. [ ] All `[RAW]` claims contain reproducible command receipts.
4. [ ] All `[INFER]` statements explicitly declare their foundational premises.
