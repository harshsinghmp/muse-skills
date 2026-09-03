# Evidence Ledger (`evidence-ledger`)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Type: Agent Skill](https://img.shields.io/badge/Type-Agent%20Skill-blue.svg?style=for-the-badge)](#)
[![Triggers: /evidence](https://img.shields.io/badge/Triggers-%2Fevidence%20%7C%20%2Fclaim-purple.svg?style=for-the-badge)](#)

Source-cited claim verification gate and research ledger. Enforces the strict doctrine: *"No source, no claim. No verification path, no release."* Audits technical claims, benchmark statistics, architecture assertions, and documentation against a 4-tier confidence taxonomy (`[RAW]`, `[FETCH]`, `[SEARCH]`, `[INFER]`).

---

## 🧭 What is this?

AI agents frequently introduce ungrounded claims, hallucinated benchmarks, and speculative numbers into documentation and proposals.

`evidence-ledger` provides an uncompromising audit gate:
- Extracts every factual assertion.
- Classifies the claim under a strict 4-tier provenance taxonomy.
- Replaces vague assertions with reproducible local receipts (`[RAW]`) or primary URL citations (`[FETCH]`).

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
"Audit all technical claims in this README and generate a claim-ledger"
"Verify the benchmarks in this proposal against raw test runs"
```

---

## 📄 Artifacts Generated

1. `claim-ledger.md` — Inventory of all claims, confidence tiers, and verification receipts.
