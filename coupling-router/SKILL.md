---
name: coupling-router
description: "Coupling-aware architectural delegation and skill-stack compatibility router for multi-agent workflows. Analyzes task dependency graphs, shared mutable state, type definitions, and active skill interactions to deterministically route tasks to sequential builders or parallel fan-out workers, while auditing installed skills to suppress redundant instructions, resolve prompt contradictions, and eliminate token bloat."
version: 1.1.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [coupling, task-routing, subagents, orchestration, multi-agent, architecture, concurrency, skill-compatibility, token-optimization]
    related_skills: [agent-handoff, gauntlet-loop, dead-letter, new-project, ai-ready, git, code-review-linus-torvalds-style]
    requires_tools: [bash, view_file, grep, glob]
---

# 🔀 Coupling Router — Architectural Delegation, Skill-Stack & Concurrency Router

> Evaluates the topological coupling of a task breakdown and audits active skill stacks before dispatching subagents. Deterministically routes tightly coupled tasks (shared types, schema migrations, rendering pipelines) to a single sequential builder, dispatches truly orthogonal tasks (isolated test suites, independent docs, separate microservices) to parallel fan-out subagents, and audits installed skills to enforce a Minimal Viable Skill Set (MVSS) that eliminates prompt contradictions and token bloat.

---

## When to Use

### Trigger Conditions
Execute this skill when:
1. **Planning Multi-Agent Delegation**: You have a task list or project plan with 2 or more subtasks.
2. **Auditing Skill-Stack Compatibility**: Multiple agent skills are installed or active, risking prompt contradictions, overlapping triggers, or token budget exhaustion.
3. **Enforcing Minimal Viable Skill Set (MVSS)**: Trimming secondary/redundant skills when a primary dominant skill (e.g., `ai-ready`, `git`, `refactor-ui`, `code-review-linus-torvalds-style`) already covers the execution scope.
4. **Preventing Merge Collisions**: Multiple files or modules share mutable state, type contracts, or lifecycle flows.
5. **Deciding Concurrency Strategy**: Resolving whether to spawn subagents concurrently in parallel or pipeline them sequentially.
6. **Complex Refactors**: Multi-layer changes spanning database schemas, API controllers, and frontend clients.

### Anti-Triggers
Do NOT use this skill when:
- Executing a single atomic task in the current conversation without subagents.
- Running simple batch queries or file searches across unrelated directories where only one skill is needed.

---

## Quick Reference

### Coupling Decision Matrix

```
                        ┌───────────────────────────────┐
                        │   Task Graph Dependency &     │
                        │    Skill Stack Pre-Flight     │
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

### Skill Compatibility & Conflict Matrix

| Active Skill Candidate | Co-Active Candidate | Interaction | Conflict / Overlap Description | Deterministic Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **`ai-ready`** | `new-project` | Redundant | Both attempt repository scaffolding and root context creation. | **Suppress `new-project` Stage 0**: `ai-ready` takes precedence as the single source of repository audit and readiness. |
| **`ai-ready`** | `updateagents` | Synergistic | `ai-ready` verifies baseline readiness; `updateagents` synchronizes ongoing cognitive memory. | **Sequential**: Run `ai-ready` audit first; invoke `updateagents` only if memory drift is detected. |
| **`code-review-linus-torvalds-style`** | Generic Refactor Skills | Conflicting | Generic refactor prompts encourage speculative code reorganization, whereas Linus/Karpathy demands surgical, minimal diffs. | **Override with Linus**: Linus/Karpathy surgical diff rule dominates. Disallow broad refactoring outside stated task scope. |
| **`git`** | Ad-Hoc VCS Prompts | Conflicting | Ad-hoc git prompts may attempt direct commits to `master` or unstructured messages. `git` enforces strict dev-branch staging and Conventional Commits. | **Suppress Ad-Hoc**: Route all VCS actions strictly through `git` lifecycle. Silence conflicting direct-commit instructions. |
| **`refactor-ui`** | Generic CSS / Styling Skills | Conflicting / Redundant | Generic UI prompts introduce decorative border clutter and arbitrary hex colors, violating Refactoring UI heuristics. | **Suppress Generic UI**: Enforce `refactor-ui` 11 heuristics and 5-state anti-slop coverage. |
| **`gauntlet-loop`** | Single-Shot Test Prompts | Synergistic | Single-shot tests provide early unit signals; `gauntlet-loop` provides bounded regression cycling. | **Pipeline**: Run fast unit checks locally; invoke `gauntlet-loop` at milestone hardening gate. |
| **`secretary-controller`** | Autonomous Execution Skills | Synergistic / Supervisory | Autonomous skills move fast; `secretary-controller` holds SHA-256 evidence approvals and dissent preservation. | **Supervisor Role**: `secretary-controller` acts as quality gatekeeper. Tasks pass through secretary approval before merging. |

### Skill Precedence Hierarchy

```
Tier 1: Governance & Verification (secretary-controller, evidence-ledger, gauntlet-loop)
   └── Tier 2: Review & Correctness Doctrine (code-review-linus-torvalds-style / Karpathy)
         └── Tier 3: Architecture & Context Engines (coupling-router, ai-ready, agent-engine)
               └── Tier 4: Domain Implementation Specialists (refactor-ui, designscope, updatedocs, git)
                     └── Tier 5: Ad-Hoc / Generic Prompts (Suppressed when higher tiers active)
```

---

## Procedure

### Step 1 — Skill-Stack Compatibility & Conflict Audit
1. **Inventory Candidate Skills**: Identify all installed or triggered skills requested for the workflow.
2. **Pairwise Conflict Check**: Consult `references/skill-compatibility-matrix.md` to evaluate interactions between candidate skills.
3. **Resolve Contradictory Directives**:
   - If an instruction contradiction exists (e.g. broad speculative refactoring vs surgical diff discipline), enforce the higher precedence tier and silence the subordinate rule.
4. **Select Minimal Viable Skill Set (MVSS)**:
   - Suppress redundant secondary skills (e.g., suppress `new-project` Stage 0 if `ai-ready` is active; suppress generic styling if `refactor-ui` is active).
5. **Enforce Token Budget Gate**:
   - Ensure the total active skill prompt footprint remains $\le 6,000$ tokens ($\le 3$ active skills per subagent context).
   - Prune auxiliary skills into staged sequential handoffs if the token budget is exceeded.

### Step 2 — Dependency & Artifact Overlap Audit
1. List all planned subtasks: $T_1, T_2, \dots, T_n$.
2. For each task, list intended **Input Dependencies** and **Target Write Files**.
3. Calculate the Write-Overlap Matrix:
   - If two tasks write to the same file or package interface $\rightarrow$ **HIGH COUPLING ($C \ge 0.6$)**.
   - If Task $B$ reads the output of Task $A$ before starting $\rightarrow$ **SEQUENTIAL DEPENDENCY**.

### Step 3 — Interface Invariant Check
Audit whether shared types, API schemas, or configuration contracts are already established and locked:
- **Unlocked Interfaces**: Must be assigned to a single precursor task before any downstream work begins.
- **Locked Interfaces**: Downstream implementations can safely parallelize.

### Step 4 — Emit Routing Plan (`ROUTING_PLAN.md`)
Output structured routing instructions:
- **Skill Stack Allocation**: Active Minimal Viable Skill Set (MVSS) and explicitly suppressed skills.
- **Execution Strategy**: `SEQUENTIAL` | `STAGED_PIPELINE` | `PARALLEL_FAN_OUT`.
- **Task Ordering Graph**: Mermaid DAG showing execution phases, barriers, and subagent assignments.
- **Context Allocation**: Explicit scope and file boundaries for each assigned agent.

---

## Pitfalls

- **Skill Token Bloat**: Loading 5+ skills simultaneously, exhausting 30–50% of the context window with redundant instructions before reading user code.
- **Contradictory Mandates**: Running un-audited skills where one demands "speculative architectural refactoring" and another demands "surgical, minimal diffs".
- **False Parallelism**: Spawning 3 parallel agents to write client, server, and shared types simultaneously guarantees merge conflicts and divergent interfaces.
- **Premature Concurrency**: Parallelizing tasks before the database schema or shared interfaces are committed and tested.
- **Over-Serialization**: Forcing documentation, standalone unit tests, and independent CSS styling into sequential bottlenecks when they share zero files.

---

## Verification

Before executing subagent delegation:
1. [ ] Active skills audited for trigger collisions and contradictory instructions against the Precedence Hierarchy.
2. [ ] Minimal Viable Skill Set (MVSS) selected; redundant secondary skills marked as `SUPPRESSED`.
3. [ ] Combined skill instruction token footprint verified within budget ($\le 6,000$ tokens).
4. [ ] No two parallel tasks have overlapping target write file paths.
5. [ ] Shared types and database schemas are fully committed before fan-out begins.
6. [ ] Output `ROUTING_PLAN.md` provides unambiguous subagent assignments, skill stacks, and isolation boundaries.
