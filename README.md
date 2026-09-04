<div align="center">

# 🏛️ Muse Skills

**A curated suite of nineteen portable agent skills for building durable projects, preserving context, coordinating reliable work, documentation synchronization & drift detection, extracting design systems, Refactoring UI design heuristics, Linus Torvalds code review, bounded gauntlet loops, staff work governance, coupling-aware routing, claim verification, reflective audits, autonomous Git release lifecycles, and repository AI-readiness auditing.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.8.0-blue.svg?style=for-the-badge)](https://github.com/harshsinghmp/muse-skills/releases)
[![Skills Count](https://img.shields.io/badge/Skills-19%20Available-purple.svg?style=for-the-badge)](#-available-skills)
[![Ecosystem](https://img.shields.io/badge/Ecosystem-LifeOS%20%7C%20Muse-emerald.svg?style=for-the-badge)](https://github.com/harshsinghmp)
[![Compatibility](https://img.shields.io/badge/Compatible%20With-Claude%20%7C%20Hermes%20%7C%20Codex%20%7C%20Cursor%20%7C%20Gemini%20%7C%20OpenCode-orange.svg?style=for-the-badge)](#-runtime-compatibility)

</div>

---

## 🧭 Overview

Muse Skills is a public, MIT-licensed collection of agent workflows for the **LifeOS** ecosystem and compatible Markdown-based agent runtimes. Install one skill when you have a specific need, or install the complete nineteen-skill suite with `npx skills`.

Each skill is a self-contained `SKILL.md` with structured YAML frontmatter and a repeatable workflow: when to use it, what to do, what to avoid, and how to verify the result. The suite helps agents produce work that is easier to resume, review, and hand off.

### What problem does this solve?

Agent work often loses momentum in predictable ways: a project starts without durable operating context, instructions become stale, a subagent repeats work already ruled out, or a blocked task disappears with the session. Muse Skills addresses those failure modes with small, composable workflows rather than a hosted service or a framework.

### At a glance

| You need to… | Use | Outcome |
| :--- | :--- | :--- |
| Start a project with durable operating context | [`new-project`](new-project/README.md) | A Project OS foundation, governance files, and documentation structure |
| Refresh repository instructions | [`updateagents`](updateagents/README.md) | A workspace-scoped update to agent memory files |
| Push through a difficult implementation or debugging stall | [`pua`](pua/README.md) | A structured escalation and investigation workflow |
| Delegate work without losing context | [`agent-handoff`](agent-handoff/README.md) | A context packet with constraints and verification criteria |
| Preserve a failed or blocked task | [`dead-letter`](dead-letter/README.md) | A retry or escalation packet that captures what was learned |
| Resume focused work after an interruption | [`context-anchor`](context-anchor/README.md) | A compact snapshot of the current state and next action |
| Extract a design system & layout tree from a visual source | [`designscope`](designscope/README.md) | A `design.md` brief with CSS Grid/Flexbox layout tree, DTCG token JSON, and WCAG report |
| Review code (Linus Torvalds Style) | [`code-review-linus-torvalds-style`](code-review-linus-torvalds-style/README.md) | A calibrated review verdict, root-cause fixes, and special-case elimination |
| Refactor UI components & layout hierarchy | [`refactor-ui`](refactor-ui/README.md) | Clean visual hierarchy, typography scales, 4px/8px spacing, and accessible contrast |
| Run bounded multi-round quality improvement loops | [`gauntlet-loop`](gauntlet-loop/README.md) | Bounded Builder/Critic loop with plateau stop conditions and acceptance packets |
| Control staff work with Socratic adversarial gates | [`secretary-controller`](secretary-controller/README.md) | Socratic devil's advocate challenges, preserved dissent, and single-use SHA-256 hash gates |
| Route task DAGs & audit skill-stack conflicts | [`coupling-router`](coupling-router/README.md) | Architectural delegation routing & minimal viable skill set (MVSS) conflict auditor |
| Verify factual claims & academic citations | [`evidence-ledger`](evidence-ledger/README.md) | Academic DOI citations, 4-tier confidence taxonomy, and missing receipt audits |
| Score daily controllable effort & focus | [`daily-standup-coach`](daily-standup-coach/README.md) | 5-pillar input scorecard and daily reflection log |
| Facilitate quarterly reviews & debt purges | [`periodic-retreat`](periodic-retreat/README.md) | Multi-scale strategic review, architecture purge, and next-Q OKRs |
| Audit link integrity & knowledge hygiene | [`brain-audit`](brain-audit/README.md) | 100% relative link validation, dead-reference detection, and secret sweeps |
| Automate Git release lifecycle & anti-slop triage | [`git`](git/README.md) | 9-tier issue triage, strict 4-phase branching, doc sync, and SemVer release cuts |
| Audit repository AI-readiness & zero-token fast-skip | [`ai-ready`](ai-ready/README.md) | 12-asset audit scorecard, PR review mining, and Stage-0 Fast-Skip gate |

### Explore the repository

- [Install a skill](#-quick-start)
- [Compare all skills](#-available-skills)
- [Understand the workflow](#-how-muse-skills-work)
- [Check runtime compatibility](#-runtime-compatibility)
- [Read contribution guidance](#-contributing)

---

## ⚡ Quick Start

### 1. Choose a starting point

If you are setting up a new repository, start with `new-project`. If the repository already exists and its instructions need attention, start with `updateagents`. Install a reliability skill when you are handing off work, recovering from a blocked task, or resuming after an interruption.

### 2. Install one skill

Install the skill that matches the task:

```bash
# Project foundation and workspace memory
npx skills add harshsinghmp/muse-skills --skill new-project
npx skills add harshsinghmp/muse-skills --skill updateagents

# Investigation and task recovery
npx skills add harshsinghmp/muse-skills --skill pua
npx skills add harshsinghmp/muse-skills --skill dead-letter

# Delegation and session continuity
npx skills add harshsinghmp/muse-skills --skill agent-handoff
npx skills add harshsinghmp/muse-skills --skill context-anchor

# Design extraction & UI refactoring
npx skills add harshsinghmp/muse-skills --skill designscope
npx skills add harshsinghmp/muse-skills --skill refactor-ui

# Code review & quality enforcement
npx skills add harshsinghmp/muse-skills --skill code-review-linus-torvalds-style
npx skills add harshsinghmp/muse-skills --skill gauntlet-loop

# Governance & architectural routing
npx skills add harshsinghmp/muse-skills --skill secretary-controller
npx skills add harshsinghmp/muse-skills --skill coupling-router
npx skills add harshsinghmp/muse-skills --skill evidence-ledger

# Reflection & knowledge hygiene
npx skills add harshsinghmp/muse-skills --skill daily-standup-coach
npx skills add harshsinghmp/muse-skills --skill periodic-retreat
npx skills add harshsinghmp/muse-skills --skill brain-audit

# Autonomous Git & GitHub release lifecycle
npx skills add harshsinghmp/muse-skills --skill git
```

### 3. Ask your agent to use it

After installation, describe the task in plain language. The skill's frontmatter supplies the trigger language that compatible runtimes use for discovery.

```text
Before delegating this feature, use agent-handoff to create a context packet
with the task boundaries, facts already established, and verification criteria.
```

```text
Run a 3-round gauntlet-loop on the cache refactor to verify edge cases and prevent regressions.
```

The skill writes or updates the artifact described in its documentation. Review that artifact as part of your normal project workflow.

### Install the complete suite

Install all eighteen skills when you want the full Project OS, context, recovery, orchestration, design-extraction, UI refactoring, code-review, governance, and audit toolkit:

```bash
npx skills add harshsinghmp/muse-skills
```

> **Tip:** You can also install a skill from its GitHub tree URL: `npx skills add https://github.com/harshsinghmp/muse-skills/tree/main/<skill-name>`.

---

## 🔁 How Muse Skills work

```mermaid
flowchart LR
    A[Choose a task] --> B[Install one or more skills]
    B --> C[Describe the task to your agent]
    C --> D[Agent follows the SKILL.md workflow]
    D --> E[Review the project artifact and verification evidence]
```

1. **Choose the failure mode or workflow you need to improve.** Each skill has a narrow job, so the suite stays easy to adopt incrementally.
2. **Install the skill.** `npx skills` adds the workflow to the workspace where your agent can discover it.
3. **Give the agent a concrete task.** The skill guides the process; it does not replace your project-specific requirements.
4. **Review the output.** Skills produce or update durable project artifacts such as an `AGENTS.md` file, a context packet, an anchor, or a dead-letter record.

---

## 📐 System Architecture

```mermaid
graph TD
    User([User / Principal]) --> Muse[👑 Muse Agency Orchestrator]
    
    subgraph Flagship Suite [🚀 Flagship Foundation]
        Muse --> NP[🚀 new-project<br/>Project OS & 8-Stage State Machine]
        Muse --> UA[🧠 updateagents<br/>Workspace Memory & Context Sync]
    end

    subgraph Reliability Suite [🛡️ Performance & Resilience]
        Muse --> PUA[🛡️ pua<br/>PIP Performance Plan & 7-Pt Checklist]
        Muse --> DL[📮 dead-letter<br/>9-Mode Failure Triage & Escalation]
    end

    subgraph Multi-Agent Suite [🤝 Orchestration & Concurrency]
        Muse --> AH[🤝 agent-handoff<br/>Structured Subagent Context Packets]
        Muse --> CA[⚓ context-anchor<br/>Working Reference Drift Prevention]
        Muse --> CR[🔀 coupling-router<br/>Coupling-Aware Task Routing]
    end

    subgraph Quality Suite [🎨 Design & Code Rigor]
        Muse --> DS[🎨 designscope<br/>Design System Extraction & DTCG Tokens]
        Muse --> RU[🪄 refactor-ui<br/>Atomic UI Design & Refactoring Heuristics]
        Muse --> LT[🐧 code-review-linus-torvalds-style<br/>Code Review - Linus Torvalds Style]
        Muse --> GL[🛡️ gauntlet-loop<br/>Bounded Multi-Agent Quality Loops]
    end

    subgraph Governance Suite [📑 Staff Work & Knowledge Hygiene]
        Muse --> SC[📑 secretary-controller<br/>Staff Work & SHA-256 Approval Gate]
        Muse --> EL[📜 evidence-ledger<br/>Source-Cited Claim Verification Gate]
        Muse --> BA[🧠 brain-audit<br/>Knowledge Hygiene & Link Integrity]
        Muse --> GIT[🐙 git<br/>Autonomous Release & GitHub Lifecycle]
    end

    subgraph Reflection Suite [🏔️ Habits & Strategy]
        Muse --> DSC[☀️ daily-standup-coach<br/>Controllable Input Effort Scorecard]
        Muse --> PR[🏔️ periodic-retreat<br/>Quarterly Strategic Review & Debt Purge]
    end
```

---

## 📋 Available Skills

| Skill | Category | Primary Triggers | Description |
| :--- | :--- | :--- | :--- |
| [**`new-project`**](new-project/README.md) | **Flagship** | `/new-project`, `Agent Engine`, `DOX Engine`, `scaffold app` | Progressive Disclosure DOX provisioner (AGENTS.md, 9-folder container, 12 modular standards, brand tokens, and cognitive memory). |
| [**`updateagents`**](updateagents/README.md) | **Flagship** | `update agents.md`, `sync memory` | Auto-discover, scan, and sync agent memory files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) in workspace root. |
| [**`updatedocs`**](updatedocs/README.md) | **Governance** | `update docs`, `sync documentation`, `audit docs` | Project-wide documentation synchronization, drift detection, and governance engine with strict `.memory/` and `.agents/` boundaries. |
| [**`pua`**](pua/README.md) | **Reliability** | `PIP`, `/pua`, `try harder`, `figure it out` | Put your AI on a Performance Improvement Plan. Forces exhaustive problem-solving with big-tech perf rhetoric. |
| [**`agent-handoff`**](agent-handoff/README.md) | **Multi-Agent** | `/handoff`, `/agent-handoff` | Generate structured context packets before dispatching subagents. Prevents context drift and ruled-out repeats. |
| [**`dead-letter`**](dead-letter/README.md) | **Reliability** | `/dead-letter`, `/dl` | Capture failed/blocked agent tasks into structured failure records with actionable retry or escalation packets. |
| [**`context-anchor`**](context-anchor/README.md) | **Multi-Agent** | `/anchor`, `/context-anchor` | Preserve a lightweight working-state snapshot to prevent cascading context drift. |
| [**`designscope`**](designscope/README.md) | **Design** | `extract the design system`, `deconstruct this layout`, `recreate this website design` | Analyze images, websites, or Figma files into a `design.md` brief with responsive layout tree, DTCG tokens, and WCAG report. |
| [**`refactor-ui`**](refactor-ui/README.md) | **Design** | `refactor this UI`, `improve visual hierarchy`, `fix UI spacing` | Audit, polish, and refactor user interfaces using the 10 atomic design heuristics from Refactoring UI (typography scale, spacing grid, button tiers, clutter reduction, natural shadows, and WCAG contrast). |
| [**`code-review-linus-torvalds-style`**](code-review-linus-torvalds-style/README.md)<br/>*(Code Review - Linus Torvalds Style)* | **Quality Gate** | `/torvalds`, `/linus-review`, `review PR` | Language-agnostic code review method derived from Linus Torvalds' corpus. Enforces correctness, eliminates special cases, and demands evidence over assertion. |
| [**`gauntlet-loop`**](gauntlet-loop/README.md) | **Quality Gate** | `/gauntlet`, `/gauntlet-loop` | Bounded multi-agent quality improvement loop with Builder, Fresh Critic, Automated Gate, and Integrator roles with plateau stop conditions. |
| [**`secretary-controller`**](secretary-controller/README.md) | **Governance** | `/secretary`, `/memo` | Evidence-grounded staff controller with Socratic adversarial challenge, preserved dissent, and SHA-256 hash gate. |
| [**`coupling-router`**](coupling-router/README.md) | **Multi-Agent** | `/router`, `/coupling` | Coupling-aware architectural router & skill-stack auditor; resolves prompt conflicts, enforces MVSS, and routes DAGs. |
| [**`evidence-ledger`**](evidence-ledger/README.md) | **Governance** | `/evidence`, `/claim` | Source-cited claim verification gate with academic DOI citations, empirical vs speculative audit, and missing receipt flagger. |
| [**`daily-standup-coach`**](daily-standup-coach/README.md) | **Reflection** | `/standup`, `/daily` | Daily reflective check-in and 5-pillar controllable input effort scorecard (TDD, minimal diffs, hygiene, focus, triage). |
| [**`periodic-retreat`**](periodic-retreat/README.md) | **Reflection** | `/retreat`, `/quarterly` | Quarterly personal and project strategic retreat facilitator for architecture debt purges, TELOS alignment, and next-Q OKRs. |
| [**`brain-audit`**](brain-audit/README.md) | **Governance** | `/audit-brain`, `/hygiene` | Knowledge hygiene and referential integrity auditor for link integrity, dead references, frontmatter validity, and secret sweeps. |
| [**`git`**](git/README.md) | **Release & DevOps** | `/git`, `manage git workflow`, `cut release`, `triage issues` | Autonomous end-to-end Git & GitHub release engine: 9-tier anti-slop issue triage, strict 4-phase branching, automated doc sync, GitHub SEO tuning, and SemVer release cuts. |
| [**`ai-ready`**](ai-ready/README.md) | **Governance** | `ai-ready`, `audit repo`, `check ai readiness` | Comprehensive 12-asset AI-readiness audit, Stage-0 zero-token Fast-Skip Gate, and PR review convention mining. |

---

## 🔍 Detailed Skill Breakdown

### 🚀 `new-project` (Flagship #1 — Agent Engine / DOX Engine)

Interactive project creator, DOX Engine, and Agent Engine provisioner. Implements the **"Agents First, Then Project Type"** two-stage architecture: provisions the lean root `AGENTS.md`, `.gitignore`, complete 9-folder `.agents/` container (12 modular standards, brand tokens, and cognitive memory) before launching interactive framework creators (Astro, Next.js, Instatic, Hono, Vite).

```bash
npx skills add harshsinghmp/muse-skills --skill new-project
```

- **Path Auto-Discovery**: Scans `/home/harsh/Projects/` and suggests immediate target locations.
- **Framework Archetypes**: Next.js 16 (App Router + Tailwind v4 + React 19), Astro (Static/SSR), Vite + React, Node/Bun API, WordPress/PHP.
- **Project OS Assets**: Generates `.agentrules`, `AGENTS.md` (Muse Council hierarchy), `CLAUDE.md`, `STATE.md` (8-stage reality machine), `llms.txt` bundler, and hardened `.gitignore`.
- **Pre-configured Presets**: `agency-suite` (28 design & taste skills), `design`, `fullstack`, `growth`, `all`, `none`.

[Read full documentation →](new-project/README.md)

---

### 🧠 `updateagents` (Flagship #2)

Automatically discovers, reads, and updates agent memory files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, etc.) in the current working directory.

```bash
npx skills add harshsinghmp/muse-skills --skill updateagents
```

- **Workspace-Scoped Discovery**: Scans current repository root only; never traverses parent paths.
- **Ecosystem Integration**: Reads output from `cavemem`, `codegraph`, `rtk`, `memoryagent`, and `ponytail`.
- **Intelligent Synthesis**: Extracts essential build/test commands, architecture flows, conventions, and non-obvious gotchas.
- **Safe Incremental Updates**: Preserves user-written rules and architectural decisions while refreshing stale documentation.

[Read full documentation →](updateagents/README.md)

---

### 🛡️ `pua` (PIP Performance Improvement Plan)

Put your AI on a Performance Improvement Plan. Forces exhaustive problem-solving with Western big-tech performance culture rhetoric and structured debugging.

```bash
npx skills add harshsinghmp/muse-skills --skill pua
```

- **Three Non-Negotiables**: Exhaust all options (*Bias for Action*), Act before asking (*Dive Deep*), and Take the initiative (*Ownership*).
- **4-Tier Pressure Escalation**: L1 Verbal Warning ➔ L2 Written Feedback ➔ L3 Formal PIP ➔ L4 Final Review.
- **Universal 5-Step Methodology**: Pattern Recognition ➔ Elevate ➔ Self-Review ➔ Execute ➔ Retrospective.
- **Mandatory 7-Point Checklist**: Word-by-word error analysis, proactive search, 50-line raw context, inverted assumptions, and minimal reproductions.
- **8 Big-Tech Flavor Packs**: Amazon Leadership Principles, Google Calibration, Meta Move Fast, Netflix Keeper Test, Musk Hardcore, Jobs A-Player, Stripe Craft, and Competitive Horse Race.

[Read full documentation →](pua/README.md)

---

### 🤝 `agent-handoff`

Generate a structured context packet before dispatching any subagent. Prevents context drift, hallucinated constraints, and re-exploring dead ends.

```bash
npx skills add harshsinghmp/muse-skills --skill agent-handoff
```

- **Explicit Working Model**: Externalizes orchestrator facts, ruled-out failed paths, and exact line ranges.
- **Hard Negative Boundaries**: Codifies `MUST NOT` constraints that propagate cleanly to subagent prompts.
- **Deterministic Verification**: Establishes unambiguous success criteria before work begins.
- **Persistence**: Writes a timestamped handoff record to the configured agent-context location (the current default is `.claude/handoff-<timestamp>.md`).

[Read full documentation →](agent-handoff/README.md)

---

### 📮 `dead-letter`

Capture failed or blocked tasks before context clears. Categorizes failure modes into a 9-part taxonomy, extracts what was learned, and generates either a mechanical retry prompt or an escalation decision point.

```bash
npx skills add harshsinghmp/muse-skills --skill dead-letter
```

- **9-Code Failure Taxonomy**: `BLOCKED-CRED`, `BLOCKED-PERM`, `BLOCKED-DATA`, `BLOCKED-AMBIG`, `BLOCKED-RATE`, `FAILED-LOGIC`, `FAILED-TOOL`, `FAILED-SCOPE`, and `PARTIAL`.
- **Preserves Partial Output**: Guarantees partial file writes and intermediate states are not lost.
- **Actionable Escalations**: Generates specific decision questions routed to Council agents (`NEXUS`, `SOL`, `JASPER`, `CREW`).

[Read full documentation →](dead-letter/README.md)

---

### ⚓ `context-anchor`

Drop a compact working reference snapshot in the project’s configured agent-context location (the current default is `<project-root>/.agents/anchor.md`) to prevent cascading context drift across long sessions, breaks, or task switches.

```bash
npx skills add harshsinghmp/muse-skills --skill context-anchor
```

- **Zero-Filler State**: Captures active state, key architectural decisions with "why" rationale, and ruled-out paths in under 15 lines.
- **Atomic Next Step**: Defines the single concrete next action with exact file and line references.
- **Drift Elimination**: Prevents models from hallucinating against stale context after long conversations.

[Read full documentation →](context-anchor/README.md)

---

### 🎨 `designscope`

Point at any visual source — a screenshot, a live website, or a Figma file — and extract its structured design system and responsive component layout tree into artifacts another AI (or human) can build from.

```bash
npx skills add harshsinghmp/muse-skills --skill designscope
```

- **Three Source Flows**: local images (direct vision), website URLs (web fetch + CSS variable extraction + native browser screenshots), and Figma links (Figma MCP tools).
- **Two Modes**: full analysis (`design.md` + DTCG `design-tokens.json` + optional WCAG report) and element mode (one component → rebuild spec or token-grounded image prompt).
- **Layout Tree Extraction**: deconstructs visual UI screenshots into container blocks (Header, Hero, Feature Grid, Bento Cards, Footer), generating responsive CSS Grid and Flexbox component hierarchies.
- **Six-Layer Analysis**: identity, system tokens, components, layout & layout trees, reconstruction notes, and brand Do's/Don'ts — plus a non-negotiable Art Direction QA pass.
- **Honesty Contract**: confidence markers on every inference, real hex codes only, mandatory Open Questions section.
- **Lint Gate**: every deliverable passes `scripts/lint_design_md.py` before handoff; all scripts are Python stdlib-only.

[Read full documentation →](designscope/README.md)

---

### 🪄 `refactor-ui`

Systematically evaluate, refine, and refactor user interface components, layouts, and design systems using the 10 atomic heuristics established by Adam Wathan and Steve Schoger (*Refactoring UI*).

```bash
npx skills add harshsinghmp/muse-skills --skill refactor-ui
```

- **10 Core Heuristics**: Visual hierarchy, typography scales, functional color palettes, 4px/8px spacing grid, button hierarchy, visual clutter elimination, high-value empty states, natural shadows/elevation, WCAG 2.1 AA/AAA contrast, and spatial grouping.
- **Monochrome-First Workflow**: Solidify layout, optical weights, and spacing in grayscale before introducing accent colors.
- **De-emphasis Strategy**: Softens surrounding borders, background tones, and metadata instead of making primary elements oversized.
- **Zero-Dependency Tooling**: Ships with `check_contrast.py` (WCAG 2.1 ratio calculator) and `audit_ui.py` (static anti-pattern linter for JSX/HTML/CSS).

[Read full documentation →](refactor-ui/README.md)

---

### 🐧 `code-review-linus-torvalds-style` — Code Review - Linus Torvalds Style

A language-agnostic code review method derived from Linus Torvalds' 30+ year review corpus. Enforces absolute correctness, eliminates special cases through clean data structures, and demands empirical evidence over assertion.

```bash
npx skills add harshsinghmp/muse-skills --skill code-review-linus-torvalds-style
```

- **Data Structures First**: Identifies and fixes bad data models where conditional logic and special cases proliferate.
- **15-Theme Trigger Catalog**: Audits Level 1 Global Invariants (API stability, memory safety, concurrency, security check placement), Level 2 Structural Patterns, and Level 3 Tactical Guidelines.
- **Precedence Chain**: Strictly enforces $\text{Correctness} > \text{Performance} > \text{Complexity} > \text{Style}$.
- **Severity Calibration**: Calibrated against a 38,303 public decision baseline ($42.2\%$ Request Changes, $23.8\%$ Reject).
- **[REASON] $\rightarrow$ [ACT] Protocol**: Eliminates false positives by verifying surrounding context, articulating the underlying design invariant, and providing concrete replacement diffs.

[Read full documentation →](code-review-linus-torvalds-style/README.md)

---

### 🛡️ `gauntlet-loop`

Bounded multi-agent quality improvement loop that eliminates infinite token burns, self-grading delusions, and regression churn. Deploys an unyielding, 4-role protocol (Freeze → Build → Fresh Critic → Automated Gate → Integrator).

```bash
npx skills add harshsinghmp/muse-skills --skill gauntlet-loop
```

- **4-Role Isolation**: Builder proposes diffs; isolated Fresh Critic scores 0–10; Automated Gate runs tests; Integrator merges only the #1 highest-impact fix.
- **Mathematical Stop Conditions**: Terminates on Proof of Passing ($\ge 9.0/10$), Score Plateau (2 rounds without gain), Regression ($>1.0$ drop), or Budget exhaustion.
- **Artifact Trail**: Outputs `GAUNTLET_JOB_CONTRACT.md`, `ITERATION_LEDGER.md`, and `ACCEPTANCE_PACKET.md`.

[Read full documentation →](gauntlet-loop/README.md)

---

### 📑 `secretary-controller`

Evidence-grounded staff-work controller and approval gate for high-stakes decisions, executive briefs, memos, and outbound actions.

```bash
npx skills add harshsinghmp/muse-skills --skill secretary-controller
```

- **Socratic Adversarial Gate**: Enforces a 3-prong devil's advocate stress-test (Architectural Fragility, Rollback Burden, Hidden Assumptions) before computing payload hashes.
- **Judgment, Not Authority**: Recommends with rigor; stops dead at `NEEDS_APPROVAL` for any filesystem write or external mutation.
- **Dissent Preservation**: Explicitly highlights contradictions, uncertainties, and `[NO-DATA]` gaps in the formal Dissent Ledger.
- **Single-Use Hash Gate**: Computes SHA-256 fingerprint of proposed payload; requires exact user confirmation token before execution.

[Read full documentation →](secretary-controller/README.md)

---

### 🔀 `coupling-router`

Coupling-aware architectural delegation and skill-stack compatibility router. Analyzes task dependency graphs, shared mutable state, type definitions, and active skill interactions to deterministically route tasks.

```bash
npx skills add harshsinghmp/muse-skills --skill coupling-router
```

- **Skill-Stack & Token Conflict Auditor**: Audits active skills against the Skill Compatibility Matrix, silences conflicting instructions, and enforces the Minimal Viable Skill Set (MVSS $\le$ 6,000 tokens).
- **High Coupling Routing**: Routes interdependent tasks (shared types, database schemas, rendering pipeline) to a single sequential builder.
- **Low Coupling Fan-Out**: Dispatches truly orthogonal tasks (isolated test suites, independent docs, separate microservices) to parallel subagents.
- **DAG & Allocation Generation**: Outputs `ROUTING_PLAN.md` with active MVSS, suppressed skills, Mermaid dependency graph, and file isolation boundaries.

[Read full documentation →](coupling-router/README.md)

---

### 📜 `evidence-ledger`

Source-cited claim verification gate, academic citation synthesizer, and research ledger. Enforces the strict doctrine: *"No source, no claim. No verification path, no release."*

```bash
npx skills add harshsinghmp/muse-skills --skill evidence-ledger
```

- **Academic & Primary Citations**: Requires peer-reviewed DOI links (`https://doi.org/...`) or canonical specification URLs for all technical assertions.
- **Empirical vs Speculative Demarcation**: Enforces strict boundaries between measured empirical benchmark facts (`[EMPIRICAL]`) and theoretical extrapolations (`[SPECULATIVE]`).
- **Statistical Audit & Missing Receipts Flagger**: Scans statistical statements (percentages, multipliers, latency numbers) and emits `MISSING_RECEIPTS_REPORT.md` for unbacked assertions.
- **4-Tier Confidence Taxonomy**: `[RAW]` (local test output), `[FETCH]` (primary URL / DOI), `[SEARCH]` (corroborated search), `[INFER]` (declared logical deduction).
- **Structured Audit**: Outputs `claim-ledger.md` documenting verification paths, timestamps, and exact command receipts.

[Read full documentation →](evidence-ledger/README.md)

---

### ☀️ `daily-standup-coach`

Daily reflective check-in and effort scorecard for developers and AI agents. Evaluates controllable inputs rather than fluctuating external outcomes.

```bash
npx skills add harshsinghmp/muse-skills --skill daily-standup-coach
```

- **5 Controllable Input Pillars**: TDD compliance, minimal diff discipline, security/secret hygiene, deep work focus, and blocked-task triage.
- **Stoic Effort Rubric**: Generates an honest 1–10 effort score evaluating execution rigor.
- **MIT Planning**: Establishes exactly one Most Important Task and up to 2 secondary goals for the next work cycle.

[Read full documentation →](daily-standup-coach/README.md)

---

### 🏔️ `periodic-retreat`

Quarterly personal and project strategic retreat facilitator. Conducts multi-scale deep audits of project health, architecture debt, deprecated system purges, and next-quarter OKRs.

```bash
npx skills add harshsinghmp/muse-skills --skill periodic-retreat
```

- **4-Phase Framework**: Retrospective Audit ➔ Architecture Debt Purge ➔ TELOS Alignment ➔ Next-Quarter OKR Formulation.
- **Debt Purge Register**: Systematically sunsetting zombie repos, dead configs, unmaintained dependencies, and outdated documentation.
- **High-Leverage OKRs**: Formulates 3 core objectives with binary, measurable Key Results.

[Read full documentation →](periodic-retreat/README.md)

---

### 🧠 `brain-audit`

Knowledge hygiene and referential integrity auditor for AI agent memory banks, documentation trees, and knowledge bases.

```bash
npx skills add harshsinghmp/muse-skills --skill brain-audit
```

- **100% Relative Link Integrity**: Detects dead markdown links, broken symbol anchors, and moved file paths.
- **Secret Sweeps**: Audits markdown documentation to guarantee zero leaked tokens (`sk-*`, `ghp_*`, private keys).
- **Referential Hygiene**: Flags orphaned memory files and stale contradictory documentation before agents hallucinate.

[Read full documentation →](brain-audit/README.md)

---

### 🐙 `git`

Autonomous end-to-end Git and GitHub release lifecycle engine with 9-tier anti-slop issue triage, strict 4-phase branching, automated doc sync, GitHub SEO tuning, and SemVer release cuts.

```bash
npx skills add harshsinghmp/muse-skills --skill git
```

- **9-Tier Anti-Slop Triage**: Categorizes issues before writing code to prevent hallucinated changes and low-signal churn.
- **Strict Branch Governance**: Never commits directly to `master`; routes work from `dev` through `release/vX.Y.Z` cuts and back-merges.
- **GitHub SEO & Presentation Pass**: Automatically synchronizes repository topics, description, and Open Graph previews.
- **Automated Doc & Changelog Sync**: Invokes `updatedocs` and stamps `CHANGELOG.md` unreleased entries prior to opening PRs.

[Read full documentation →](git/README.md)

---

### 🤖 `ai-ready`

Comprehensive repository AI-readiness auditor and scaffolding engine. Audits 12 tracked assets across AI Context, Dev Workflow, and Onboarding with a 4-tier grading matrix (Getting Started to AI-Ready), zero-token Stage-0 Fast-Skip Gate, and merged PR review convention mining.

```bash
npx skills add harshsinghmp/muse-skills --skill ai-ready
```

- **12-Asset AI Audit**: Tracks essential AI context, developer workflows, and onboarding hygiene without boilerplate fluff.
- **Stage-0 Fast-Skip Gate**: Exits immediately in `<100ms` with zero token burn when the repository is already verified compliant.
- **PR Review Mining**: Mines recent merged PR reviews via GitHub CLI to turn recurring reviewer feedback into explicit agent instructions.
- **Targeted Surgical Remediation**: Scaffolds only missing assets without clobbering existing developer configurations.

[Read full documentation →](ai-ready/README.md)

---

## 🌐 Runtime compatibility

Muse Skills uses portable Markdown workflows with YAML frontmatter. Compatibility depends on each runtime’s skill-discovery and installation model; the table below describes the intended integration path rather than a claim that every runtime behaves identically.

| Agent Platform | Compatibility | Ingestion Mechanism |
|:---|:---:|:---|
| **`npx skills` CLI** | Native | Installs skills and resolves their repository structure |
| **Claude Code & Desktop** | Markdown workflow | Reads structured Markdown and YAML frontmatter |
| **Hermes** | Metadata-aware | Reads `metadata.hermes`, tool dependencies, and platform constraints |
| **OpenAI Codex & Cursor** | Markdown workflow | Uses agent prompt schemas and workspace instruction files |
| **Gemini CLI & Antigravity** | Markdown workflow | Uses agent tools, system prompts, and subagent dispatch conventions |
| **OpenCode & Pi** | Markdown workflow | Reads portable Markdown skill instructions |

For the authoring contract that keeps these workflows portable, see the [Skill Authoring Specification](docs/SKILL_SPECIFICATION.md).

---

## 📁 Repository Structure

```text
muse-skills/
├── new-project/                    # Project OS & governance scaffolder (Flagship #1)
│   ├── agents/
│   │   └── openai.yaml             # Agent tool definition
│   ├── references/
│   │   └── project-os-architecture.md
│   ├── scripts/
│   │   └── new-project.ts          # Scaffolder engine
│   ├── README.md
│   └── SKILL.md
│
├── updateagents/                   # Memory & context synchronization (Flagship #2)
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── before-after.md
│   ├── references/
│   │   ├── discovery-commands.md
│   │   └── memory-file-priorities.md
│   ├── scripts/
│   │   └── validate-memory-file.sh # Memory file validator
│   ├── README.md
│   └── SKILL.md
│
├── updatedocs/                     # Documentation synchronization & drift detection
│   ├── agents/
│   │   └── openai.yaml
│   ├── references/                 # 8 policy & matrix reference guides
│   ├── README.md
│   └── SKILL.md
│
├── pua/                            # PIP performance & structured debugging
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-pip-report.md
│   ├── README.md
│   └── SKILL.md
│
├── agent-handoff/                  # Structured subagent context packet generator
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-handoff.md
│   ├── README.md
│   └── SKILL.md
│
├── context-anchor/                 # Working reference snapshot generator
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-anchor.md
│   ├── README.md
│   └── SKILL.md
│
├── dead-letter/                    # Failed/blocked task triage & capture
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-dead-letter.md
│   ├── README.md
│   └── SKILL.md
│
├── designscope/                    # Design system & component layout tree extraction
│   ├── agents/
│   │   └── openai.yaml
│   ├── references/                 # Capture flows, analysis framework, layout tree, token extraction, templates
│   ├── scripts/                    # Stdlib-only Python helpers (CSS vars, contrast, lint, verify)
│   ├── LICENSE                     # MIT (upstream-attribution copy)
│   ├── README.md
│   └── SKILL.md
│
├── refactor-ui/                    # Atomic UI design & interface refactoring engine
│   ├── agents/
│   │   └── openai.yaml             # Agent tool definition
│   ├── references/                 # 10 Heuristic reference guides
│   ├── scripts/                    # WCAG contrast calculator & static UI auditor
│   ├── LICENSE                     # MIT (with Refactoring UI attribution)
│   ├── README.md
│   └── SKILL.md
│
├── code-review-linus-torvalds-style/ # Code Review - Linus Torvalds Style
│   ├── agents/
│   │   └── openai.yaml             # Agent tool definition
│   ├── examples/
│   │   └── sample-review.md        # Concrete review verdict example
│   ├── README.md
│   └── SKILL.md
│
├── gauntlet-loop/                  # Bounded multi-agent quality improvement loop
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-gauntlet-run.md
│   ├── references/
│   │   └── gauntlet-protocol.md
│   ├── README.md
│   └── SKILL.md
│
├── secretary-controller/           # Evidence-grounded staff controller & Socratic gate
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-approval-packet.md
│   ├── references/
│   │   ├── socratic-adversarial-gate.md
│   │   └── staff-work-doctrine.md
│   ├── README.md
│   └── SKILL.md
│
├── coupling-router/                # Coupling-aware architectural delegation & skill-stack router
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-routing-decision.md
│   ├── references/
│   │   ├── coupling-matrix.md
│   │   └── skill-compatibility-matrix.md
│   ├── README.md
│   └── SKILL.md
│
├── evidence-ledger/                # Source-cited claim verification & academic receipt gate
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-claim-ledger.md
│   ├── references/
│   │   ├── academic-citation-protocol.md
│   │   └── claim-verification-taxonomy.md
│   ├── README.md
│   └── SKILL.md
│
├── daily-standup-coach/            # Daily reflective check-in & effort scorecard
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-standup-log.md
│   ├── references/
│   │   └── effort-rubric.md
│   ├── README.md
│   └── SKILL.md
│
├── periodic-retreat/               # Quarterly strategic retreat facilitator
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-quarterly-review.md
│   ├── references/
│   │   └── retreat-framework.md
│   ├── README.md
│   └── SKILL.md
│
├── brain-audit/                    # Knowledge hygiene & referential integrity auditor
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── sample-audit-report.md
│   ├── references/
│   │   └── hygiene-rules.md
│   ├── README.md
│   └── SKILL.md
│
├── git/                            # Autonomous release & GitHub lifecycle engine
│   ├── agents/
│   │   └── openai.yaml
│   ├── references/
│   │   ├── anti-slop-triage.md
│   │   ├── branching-and-release-matrix.md
│   │   └── github-seo-and-presentation.md
│   ├── README.md
│   └── SKILL.md
│
├── ai-ready/                       # Repository AI-readiness auditor & scaffolding engine
│   ├── agents/
│   │   └── openai.yaml
│   ├── references/
│   │   ├── fast-skip-protocol.md
│   │   ├── pr-review-mining.md
│   │   └── twelve-asset-matrix.md
│   ├── README.md
│   └── SKILL.md
│
├── .agents/
│   └── context/                     # Durable agent context pack (index, product, architecture, ...)
│
├── AGENTS.md                        # Agent working rules & context routing
├── CONTRIBUTING.md                  # Contribution guidelines
├── docs/                             # Architecture, changelog, and skill-authoring specification
├── SECURITY.md                      # Private vulnerability reporting
├── LICENSE                         # MIT License
├── llms.txt                         # LLM-facing repository index
├── package.json                    # Package metadata & keywords
├── README.md                       # Comprehensive repository documentation
├── skills.json                     # Skill registry catalog
└── tests/                          # Automated TDD test suite
    └── skills.test.ts
```

---

## 📚 Documentation and support

- [Skill Authoring Specification](docs/SKILL_SPECIFICATION.md) explains the required shape of a skill and its frontmatter.
- [Architecture](docs/ARCHITECTURE.md) describes the repository’s design and packaging model.
- [Changelog](docs/CHANGELOG.md) records released changes.
- [Contributing](CONTRIBUTING.md) explains how to propose improvements.
- [Security policy](SECURITY.md) explains how to report vulnerabilities privately.

Muse Skills is static documentation plus small, optional helper scripts—there is no hosted account, service, or daemon to configure.

---

## 📜 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Report vulnerabilities privately through [SECURITY.md](SECURITY.md), not a public issue.

---

## 📄 License

[MIT](LICENSE) © [Harsh](https://github.com/harshsinghmp)

---

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=harshsinghmp/muse-skills&type=Date)](https://star-history.com/#harshsinghmp/muse-skills&Date)

</div>
