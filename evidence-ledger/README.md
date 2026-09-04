# Evidence Ledger (`evidence-ledger`)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Type: Agent Skill](https://img.shields.io/badge/Type-Agent%20Skill-blue.svg?style=for-the-badge)](#)
[![Triggers: /evidence](https://img.shields.io/badge/Triggers-%2Fevidence%20%7C%20%2Fclaim-purple.svg?style=for-the-badge)](#)

Source-cited claim verification gate, academic citation synthesizer, and research ledger. Enforces the strict doctrine: *"No source, no claim. No verification path, no release."* Audits technical claims, benchmark statistics, architecture assertions, and documentation against a 4-tier confidence taxonomy (`[RAW]`, `[FETCH]`, `[SEARCH]`, `[INFER]`), primary DOI receipts, and strict empirical vs. speculative demarcation.

---

## 🧭 What is this?

AI agents frequently introduce ungrounded claims, hallucinated benchmarks, and speculative assertions disguised as facts into documentation, technical whitepapers, and proposals.

`evidence-ledger` provides an uncompromising verification gate:
- **Academic & Primary Documentation Citations**: Requires peer-reviewed DOI links (`https://doi.org/...`) or canonical specification URLs for technical claims.
- **Empirical vs. Speculative Demarcation**: Disentangles measured benchmark observations (`[EMPIRICAL]`) from theoretical extrapolations (`[SPECULATIVE]`).
- **Statistical Audit & Missing Receipts Flagger**: Automatically detects ungrounded percentages, multipliers, and latency numbers, generating a `MISSING_RECEIPTS_REPORT.md` before release.
- **4-Tier Provenance Taxonomy**: Classifies claims under `[RAW]`, `[FETCH]`, `[SEARCH]`, and `[INFER]`.

---

## ⚡ Installation

```bash
npx skills add harshsinghmp/muse-skills --skill evidence-ledger
```

---

## 🚀 Usage & Triggers

```bash
# Slash commands
/evidence
/claim

# Natural language
"Audit all technical claims and academic citations in this whitepaper"
"Verify the statistical benchmark claims in this proposal and flag missing receipts"
```

---

## 📄 Artifacts Generated

1. `claim-ledger.md` — Complete inventory of claims, epistemological classes, confidence tiers, and verification receipts.
2. `MISSING_RECEIPTS_REPORT.md` — Quarantined statistical assertions lacking reproducible benchmarks or DOI links.
