# Coupling Router (`coupling-router`)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Type: Agent Skill](https://img.shields.io/badge/Type-Agent%20Skill-blue.svg?style=for-the-badge)](#)
[![Triggers: /router](https://img.shields.io/badge/Triggers-%2Frouter%20%7C%20%2Fcoupling-purple.svg?style=for-the-badge)](#)

Coupling-aware architectural delegation and skill-stack compatibility router for multi-agent workflows. Analyzes task dependency graphs, shared mutable state, type definitions, and active skill interactions to deterministically route tasks to sequential builders or parallel fan-out workers, while auditing installed skills to suppress redundant instructions, resolve prompt contradictions, and eliminate token bloat.

---

## 🧭 What is this?

When an orchestrator agent breaks a project into subtasks or loads multiple skills, two major failure modes occur:
1. **Concurrency Failures**: Parallelizing coupled tasks creates diverging interfaces, broken imports, and merge hell. Serializing independent tasks wastes latency and agent compute.
2. **Skill Stack & Token Failures**: Loading multiple skills simultaneously causes prompt instruction collisions (e.g. speculative refactoring vs surgical diffs) and blows token budgets before writing code.

`coupling-router` audits both the **task graph's shared state** and the **active skill stack** to output a mathematically sound execution DAG and a Minimal Viable Skill Set (MVSS).

---

## ⚡ Installation

```bash
npx skills add harshsinghmp/muse-skills --skill coupling-router
```

---

## 🚀 Usage & Triggers

```bash
# Slash commands
/router
/coupling

# Natural language
"Audit active skills and analyze this task breakdown for coupling"
"Resolve skill stack conflicts and determine whether to run in parallel or sequentially"
```

---

## 🛡️ Skill Compatibility & Conflict Matrix

`coupling-router` resolves pairwise interactions across installed skills:

| Active Skill | Co-Active Skill | Interaction | Conflict Resolution |
| :--- | :--- | :--- | :--- |
| **`ai-ready`** | `new-project` | Redundant | Suppress `new-project` Stage 0; `ai-ready` dominates. |
| **`code-review`** | Generic Refactors | Conflicting | Enforce Linus/Karpathy surgical diffs; silence broad refactor rules. |
| **`git`** | Ad-Hoc VCS | Conflicting | Enforce strict dev-staging & Conventional Commits; suppress ad-hoc commits. |
| **`refactor-ui`** | Generic CSS | Conflicting / Redundant | Enforce 11 UI heuristics & 5-state anti-slop; suppress decorative border clutter. |

---

## 📄 Artifacts Generated

1. `ROUTING_PLAN.md` — Active Minimal Viable Skill Set (MVSS), suppressed redundant skills, execution strategy (`SEQUENTIAL` / `STAGED_PIPELINE` / `PARALLEL_FAN_OUT`), Mermaid task DAG, and file isolation boundaries.
