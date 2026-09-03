---
name: coupling-router
description: "Coupling-aware architectural delegation router for multi-agent workflows. Analyzes task dependency graphs, shared mutable state, type definitions, and schema boundaries to deterministically route tasks to single sequential builders or parallel fan-out workers, preventing merge collisions and hallucinated interface drift."
version: 1.0.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [coupling, task-routing, subagents, orchestration, multi-agent, architecture, concurrency]
    related_skills: [agent-handoff, gauntlet-loop, dead-letter, new-project]
    requires_tools: [bash, view_file, grep, glob]
---

# 🔀 Coupling Router — Architectural Delegation & Concurrency Router

> Evaluates the topological coupling of a task breakdown before dispatching subagents. Deterministically routes tightly coupled tasks (shared types, schema migrations, rendering pipelines) to a single sequential builder, while dispatching truly orthogonal tasks (isolated test suites, independent docs, separate microservices) to parallel fan-out subagents.

---

## When to Use

### Trigger Conditions
Execute this skill when:
1. **Planning Multi-Agent Delegation**: You have a task list or project plan with 2 or more subtasks.
2. **Preventing Merge Collisions**: Multiple files or modules share mutable state, type contracts, or lifecycle flows.
3. **Deciding Concurrency Strategy**: Resolving whether to spawn subagents concurrently in parallel or pipeline them sequentially.
4. **Complex Refactors**: Multi-layer changes spanning database schemas, API controllers, and frontend clients.

### Anti-Triggers
Do NOT use this skill when:
- Executing a single atomic task in the current conversation.
- Running simple batch queries or file searches across unrelated directories.

---

## Quick Reference

### Coupling Decision Matrix

```
                        ┌───────────────────────────────┐
                        │   Task Graph Dependency       │
                        │        Coupling Audit         │
                        └──────────────┬────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
     ┌──────────────────────┐                      ┌──────────────────────┐
     │    HIGH COUPLING     │                      │     LOW COUPLING     │
     │ - Shared type defs   │                      │ - Independent files  │
     │ - DB schema updates  │                      │ - Separate docs/libs │
     │ - Pipeline state     │                      │ - Isolated unit tests│
     └──────────┬───────────┘                      └──────────┬───────────┘
                │                                             │
                ▼                                             ▼
     ┌──────────────────────┐                      ┌──────────────────────┐
     │ SEQUENTIAL PIPELINE  │                      │   PARALLEL FAN-OUT   │
     │ Single builder agent │                      │ Concurrent subagents │
     │ with linear commits  │                      │ with disjoint scopes │
     └──────────────────────┘                      └──────────────────────┘
```

### Coupling Classification Rubric

| Level | Characteristics | Recommended Execution Strategy |
| :--- | :--- | :--- |
| **High Coupling ($C \ge 0.6$)** | Tasks touch the same files, share database models, or depend on intermediate outputs | **Strict Sequential**: Single agent runs steps linearly |
| **Medium Coupling ($0.3 \le C < 0.6$)** | Tasks share read-only interfaces but write to separate modules | **Staged Pipelining**: Step 1 locks interfaces $\rightarrow$ Steps 2a/2b fan out |
| **Low Coupling ($C < 0.3$)** | Zero overlapping write paths, separate namespaces, zero shared mutable state | **Parallel Fan-Out**: Spawn independent concurrent subagents |

---

## Procedure

### Step 1 — Dependency & Artifact Overlap Audit
1. List all planned subtasks: $T_1, T_2, \dots, T_n$.
2. For each task, list intended **Input Dependencies** and **Target Write Files**.
3. Calculate the Write-Overlap Matrix:
   - If two tasks write to the same file or package interface $\rightarrow$ **HIGH COUPLING**.
   - If Task $B$ reads the output of Task $A$ before starting $\rightarrow$ **SEQUENTIAL DEPENDENCY**.

### Step 2 — Interface Invariant Check
Audit whether shared types, API schemas, or configuration contracts are already established and locked:
- **Unlocked Interfaces**: Must be assigned to a single precursor task before any downstream work begins.
- **Locked Interfaces**: Downstream implementations can safely parallelize.

### Step 3 — Emit Routing Decision (`ROUTING_PLAN.md`)
Output structured routing instructions:
- **Strategy**: `SEQUENTIAL` | `STAGED_PIPELINE` | `PARALLEL_FAN_OUT`.
- **Task Ordering Graph**: Mermaid DAG showing execution phases and barriers.
- **Context Allocation**: Explicit scope boundaries for each assigned agent.

---

## Pitfalls

- **False Parallelism**: Spawning 3 parallel agents to write client, server, and shared types simultaneously guarantees merge conflicts and divergent interfaces.
- **Premature Concurrency**: Parallelizing tasks before the database schema or shared interfaces are committed and tested.
- **Over-Serialization**: Forcing documentation, standalone unit tests, and independent CSS styling into sequential bottlenecks when they share zero files.

---

## Verification

Before executing subagent delegation:
1. [ ] No two parallel tasks have overlapping target write file paths.
2. [ ] Shared types and database schemas are fully committed before fan-out begins.
3. [ ] Every task in the DAG has explicit inputs, outputs, and isolation boundaries.
