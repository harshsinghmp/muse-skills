# Secretary Controller (`secretary-controller`)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Type: Agent Skill](https://img.shields.io/badge/Type-Agent%20Skill-blue.svg?style=for-the-badge)](#)
[![Triggers: /secretary](https://img.shields.io/badge/Triggers-%2Fsecretary%20%7C%20%2Fmemo-purple.svg?style=for-the-badge)](#)

Evidence-grounded staff-work controller and approval gate for high-stakes decisions, executive briefs, memos, and outbound actions. Enforces judgment over authority, explicit dissent preservation, frozen evidence snapshots, and single-use hash approvals before any filesystem or external mutation.

---

## 🧭 What is this?

Autonomous agents often suffer from **authority leakage** (executing unreviewed mutations) and **consensus smoothing** (erasing uncertainties, edge cases, and contradictions to provide a neat answer).

`secretary-controller` provides the formal doctrine of Completed Staff Work:
- The agent analyzes, investigates, and presents a fully formed action packet with explicit dissenting facts and unknowns.
- The agent halts at `NEEDS_APPROVAL` with a cryptographic SHA-256 fingerprint of the proposed payload.
- Zero mutations occur without explicit human confirmation.

---

## ⚡ Installation

```bash
npx skills add harshsinghmp/muse-skills --skill secretary-controller
```

---

## 🚀 Usage & Triggers

```bash
# Slash commands
/secretary
/memo

# Natural language
"Prepare a staff decision memo for migrating the database cluster"
"Generate an approval packet with SHA-256 token for this release"
```

---

## 📄 Artifacts Generated

1. `DECISION_MEMO.md` — Completed staff work packet with recommendation, trade-offs, and preserved dissent.
2. `APPROVAL_PACKET.md` — Cryptographic hash payload with single-use confirmation token.
