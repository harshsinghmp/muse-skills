# Gauntlet Loop (`gauntlet-loop`)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Type: Agent Skill](https://img.shields.io/badge/Type-Agent%20Skill-blue.svg?style=for-the-badge)](#)
[![Triggers: /gauntlet](https://img.shields.io/badge/Triggers-%2Fgauntlet%20%7C%20%2Fgauntlet--loop-purple.svg?style=for-the-badge)](#)

Bounded multi-agent quality improvement loop that eliminates infinite token burns, self-grading delusions, and regression churn. Deploys an unyielding, 4-role protocol (Freeze → Build → Fresh Critic → Automated Gate → Integrator) with hard mathematically enforced termination boundaries.

---

## 🧭 What is this?

Autonomous agents frequently fail during iterative refinement in two catastrophic ways:
1. **Self-grading delusion**: The agent evaluating code is the same agent that wrote it, consistently overlooking its own blind spots.
2. **Infinite regression churn**: Changes in round 3 break fixes made in round 1, oscillating infinitely without converging on quality.

`gauntlet-loop` enforces a strict 4-role workflow with isolated Fresh Critic auditing, automated gate validation, single-fix integration, and mathematical stop conditions (score plateau, regression, or proof of passing).

---

## ⚡ Installation

```bash
npx skills add harshsinghmp/muse-skills --skill gauntlet-loop
```

---

## 🚀 Usage & Triggers

Trigger using slash commands or natural language:

```bash
# Slash commands
/gauntlet
/gauntlet-loop

# Natural language
"Run a 3-round gauntlet loop on the authentication refactor"
"Execute gauntlet quality gate before merging this PR"
```

---

## 📄 Artifacts Generated

1. `GAUNTLET_JOB_CONTRACT.md` — Frozen acceptance criteria, automated proof commands, and round budget.
2. `ITERATION_LEDGER.md` — Complete chronological score trajectory, critic findings, and delta metrics.
3. `ACCEPTANCE_PACKET.md` — Final proof of passing with verbatim command receipts and verified diff.
