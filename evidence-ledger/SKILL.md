---
name: evidence-ledger
description: "Source-cited claim verification gate, academic citation synthesizer, and research ledger. Enforces the strict doctrine: 'No source, no claim. No verification path, no release.' Audits technical claims, benchmark statistics, architecture assertions, and documentation against a 4-tier confidence taxonomy ([RAW], [FETCH], [SEARCH], [INFER]), academic DOI receipts, and empirical vs speculative classification. Generates claim-ledger.md and MISSING_RECEIPTS_REPORT.md."
version: 1.1.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [evidence, verification, citation, fact-checking, claims, research-gate, provenance, academic-research, citation-synthesis, receipt-audit, doi, empirical-verification]
    related_skills: [secretary-controller, gauntlet-loop, brain-audit, dead-letter]
    requires_tools: [bash, view_file, grep, write_to_file, replace_file_content]
---

# 📜 Evidence Ledger — Source-Cited Claim Verification Gate & Research Ledger

> Enforces the non-negotiable verification doctrine: *"No source, no claim. No verification path, no release."* Audits all technical documentation, benchmark statistics, architectural whitepapers, and academic research summaries against a 4-tier confidence taxonomy, primary DOI/URL citation receipts, and strict empirical vs. speculative demarcation.

---

## When to Use

### Trigger Conditions
Execute this skill when:
1. **Auditing Technical & Statistical Claims**: Verifying documentation, marketing copy, or release notes making performance, latency, or throughput assertions.
2. **Academic & Literature Synthesis**: Generating technical whitepapers, research briefs, or architecture proposals requiring peer-reviewed DOI/URL citations.
3. **Empirical vs Speculative Auditing**: Disentangling measured empirical benchmark observations from theoretical extrapolations.
4. **Pre-Release Factual Gate**: Final check before publishing external or client-facing deliverables to ensure zero ungrounded assertions survive.
5. **Missing Receipt Detection**: Automatically identifying unbacked statistics and generating remediation reports.

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
│ [FETCH]       │ Direct quote from authoritative primary URL, RFC, or DOI    │
│ [SEARCH]      │ Corroborated fact supported by 2+ independent search hits   │
│ [INFER]       │ Agent logical deduction; MUST state premises explicitly     │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

### Academic Receipt Standards

| Reference Type | Required Receipt Format | Quality Check |
| :--- | :--- | :--- |
| **Peer-Reviewed Paper** | DOI link (`https://doi.org/...`) or `arXiv:ID` | Primary paper verified; no vague attributions |
| **Standard / RFC** | Canonical specification URL (e.g. `rfc-editor.org`) | Exact section or anchor cited |
| **Benchmark Metric** | `[RAW]` Command receipt with timestamp & stdout | Reproducible execution script provided |
| **External Library** | Official docs URL (`[FETCH]`) or local test (`[RAW]`) | Versioned API link |

### Empirical vs. Speculative Demarcation

- **`[EMPIRICAL]`**: Grounded in reproducible measurement (`[RAW]`) or primary literature (`[FETCH]`). Stated as factual observation.
- **`[SPECULATIVE]`**: Grounded in deduction, extrapolation, or forward projections (`[INFER]`). Must explicitly state hypotheses and premises.

---

## Procedure

### Step 1 — Claim Extraction & Statistical Scanning
Scan the target artifact (markdown, doc, proposal) and extract every discrete factual statement, numeric metric, or statistical claim (percentages, multipliers, latency bounds) into an enumerated inventory.

### Step 2 — Provenance Tagging & Academic Receipt Verification
Assign exactly one taxonomy tag (`[RAW]`, `[FETCH]`, `[SEARCH]`, `[INFER]`) to each claim:
- If `[RAW]`: Record execution command, timestamp, and stdout snippet.
- If `[FETCH]`: Verify canonical DOI link or specification URL, access date, and quoted excerpt (see `references/academic-citation-protocol.md`).
- If `[SEARCH]`: Record query string and at least 2 independent corroborating domains.
- If `[INFER]`: Explicitly document the deduction logic: *"Premise A + Premise B $\implies$ Conclusion"*.

### Step 3 — Empirical vs. Speculative Classification
Classify each claim as either `[EMPIRICAL]` or `[SPECULATIVE]`:
- Flag any speculative statement masquerading as an empirical fact.
- Force speculative claims to declare their underlying assumptions and risk factors.

### Step 4 — Missing Receipt Audit & Flagger
Scan all statistical claims (e.g., *"3x faster"*, *"40% less memory"*):
- If a statistical statement lacks a reproducible `[RAW]` log or verified `[FETCH]` DOI/URL, automatically flag it in `MISSING_RECEIPTS_REPORT.md`.
- Unbacked claims must either be proven via benchmark or downgraded/redacted.

### Step 5 — Ledger Compilation (`claim-ledger.md`)
Generate the structured ledger containing:
- **Claim ID & Statement**
- **Epistemological Class**: `[EMPIRICAL]` | `[SPECULATIVE]`
- **Confidence Tier**: `[RAW]` | `[FETCH]` | `[SEARCH]` | `[INFER]`
- **Verification Path & Exact Receipt**: DOI / URL / command receipt
- **Status**: `VERIFIED` | `QUARANTINED` | `REDACTED`

### Step 6 — Artifact Remediation
Update the target document:
- Replace ungrounded statements with verified receipts or remove them entirely.
- Ensure all statistics link directly to entries in `claim-ledger.md`.

---

## Pitfalls

- **Unbacked Statistical Fluff**: Writing *"increases efficiency by 50%"* without raw benchmark logs or DOI citations.
- **Pseudo-Citations**: Name-dropping authors or papers (e.g. *"As Smith et al. showed..."*) without providing the exact DOI or paper link.
- **Disguising Inferences as Raw Facts**: Stating architectural hypotheses as proven truths without empirical validation.
- **Vague Citations**: Citing *"industry standards"* or *"standard benchmarks"* without canonical URLs.

---

## Verification

Before certifying an artifact:
1. [ ] `claim-ledger.md` accounts for 100% of numeric, statistical, and architectural claims.
2. [ ] All academic and research citations include valid DOI or canonical specification URLs.
3. [ ] Empirical findings are strictly separated from speculative extrapolations.
4. [ ] Zero ungrounded statistical claims remain; `MISSING_RECEIPTS_REPORT.md` is empty or fully resolved.
5. [ ] All `[RAW]` claims contain reproducible command receipts.
