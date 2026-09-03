# Coupling Router (`coupling-router`)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Type: Agent Skill](https://img.shields.io/badge/Type-Agent%20Skill-blue.svg?style=for-the-badge)](#)
[![Triggers: /router](https://img.shields.io/badge/Triggers-%2Frouter%20%7C%20%2Fcoupling-purple.svg?style=for-the-badge)](#)

Coupling-aware architectural delegation router for multi-agent workflows. Analyzes task dependency graphs, shared mutable state, type definitions, and schema boundaries to deterministically route tasks to single sequential builders or parallel fan-out workers, preventing merge collisions and hallucinated interface drift.

---

## 🧭 What is this?

When an orchestrator agent breaks a project into subtasks, choosing between **parallel subagents** and a **sequential pipeline** is critical:
- Parallelizing coupled tasks creates diverging interfaces, broken imports, and merge hell.
- Serializing independent tasks wastes latency and agent compute.

`coupling-router` audits the task graph's shared state and write targets to output a mathematically sound execution DAG.

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
"Analyze this task breakdown for subagent coupling and routing"
"Determine whether to run these 4 features in parallel or sequentially"
```

---

## 📄 Artifacts Generated

1. `ROUTING_PLAN.md` — Execution strategy (`SEQUENTIAL` / `STAGED_PIPELINE` / `PARALLEL_FAN_OUT`), Mermaid task DAG, and file isolation boundaries.
