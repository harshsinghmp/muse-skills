# Muse Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.2.0-blue.svg?style=for-the-badge)](#)
[![Skills Count](https://img.shields.io/badge/Skills-5%20Available-purple.svg?style=for-the-badge)](#)
[![Ecosystem](https://img.shields.io/badge/Ecosystem-LifeOS%20%7C%20Muse-emerald.svg?style=for-the-badge)](#)

Custom agent skills for workspace productivity, context preservation, subagent coordination, error triage, and project governance across the LifeOS ecosystem.

---

## ⚡ Quick Start & Installation

### 1. Install Specific Skills (Shorthand)

Install individual skills using the concise GitHub shorthand:

```bash
# Subagent orchestration & context skills
npx skills add harshsinghmp/muse-skills --skill agent-handoff
npx skills add harshsinghmp/muse-skills --skill dead-letter
npx skills add harshsinghmp/muse-skills --skill context-anchor

# Project OS & memory skills
npx skills add harshsinghmp/muse-skills --skill new-project
npx skills add harshsinghmp/muse-skills --skill updateagents
```

### 2. Install All Skills at Once

Install the entire skill collection into your workspace:

```bash
npx skills add harshsinghmp/muse-skills
```

*(Direct URL syntax `npx skills add https://github.com/harshsinghmp/muse-skills/tree/main/<skillname>` is also supported).*

---

## 🧭 Available Skills

| Skill | Triggers | Description |
| :--- | :--- | :--- |
| [**`agent-handoff`**](agent-handoff/README.md) | `/handoff`, `/agent-handoff` | Generate structured context packets before dispatching subagents. Prevents context drift and ruled-out repeats. |
| [**`dead-letter`**](dead-letter/README.md) | `/dead-letter`, `/dl` | Capture failed/blocked agent tasks into structured failure records with actionable retry or escalation packets. |
| [**`context-anchor`**](context-anchor/README.md) | `/anchor`, `/context-anchor` | Drop lightweight working reference snapshots (`.claude/anchor.md`) to prevent cascading context drift. |
| [**`new-project`**](new-project/README.md) | `/new-project` | Provision canonical `/docs/`, 8-stage reality machine (`STATE.md`), Council governance, and skill presets. |
| [**`updateagents`**](updateagents/README.md) | `update agents.md`, `sync memory` | Auto-discover, scan, and sync agent memory files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) in workspace root. |

---

### 🤝 `agent-handoff`

Generate a structured context packet before dispatching any subagent. Subagents fail when they receive a vague goal without operational constraints, ruled-out dead ends, or exact file boundaries. This skill makes implicit orchestrator context explicit in `.claude/handoff-<timestamp>.md`.

**Installation:**
```bash
npx skills add harshsinghmp/muse-skills --skill agent-handoff
```

**Key Capabilities:**
- Extracts single actionable objective, architectural facts, and file scope
- Codifies ruled-out approaches with specific failure rationale
- Sets strict negative constraints (`MUST NOT` boundaries)
- Enforces deterministic, verifiable success criteria
- Defines load-bearing fallback actions when subagents hit blockers

**Usage:**
```
"/handoff"
"/agent-handoff"
"prepare a handoff packet for backend auth refactor"
```

[Learn more →](agent-handoff/README.md)

---

### 📮 `dead-letter`

Capture failed or blocked tasks before context clears. Categorizes failure modes into a 9-part taxonomy, extracts what was learned, and generates either a mechanical retry prompt or an escalation decision point.

**Installation:**
```bash
npx skills add harshsinghmp/muse-skills --skill dead-letter
```

**Key Capabilities:**
- 9-code failure taxonomy (`BLOCKED-CRED`, `BLOCKED-PERM`, `BLOCKED-DATA`, `BLOCKED-AMBIG`, `BLOCKED-RATE`, `FAILED-LOGIC`, `FAILED-TOOL`, `FAILED-SCOPE`, `PARTIAL`)
- Preserves partial file writes so downstream agents do not discard valid work
- Generates mechanical retry prompts when root causes can be fixed
- Formulates decision questions and agent routing (`NEXUS`, `SOL`, `JASPER`, `CREW`) when escalation is required
- Captures records to `.claude/dead-letter-<timestamp>.md`

**Usage:**
```
"/dead-letter"
"/dl"
"triage failed subagent task"
```

[Learn more →](dead-letter/README.md)

---

### ⚓ `context-anchor`

Drop a compact working reference snapshot in `<project-root>/.claude/anchor.md` to prevent cascading context drift across long sessions, breaks, or task switches.

**Installation:**
```bash
npx skills add harshsinghmp/muse-skills --skill context-anchor
```

**Key Capabilities:**
- Captures 1-sentence state of active work and architectural decisions with "why" rationale
- Records ruled-out approaches to prevent token waste
- Defines the single next concrete action (file and line number)
- Compact, zero-filler structure that keeps agent reasoning sharp

**Usage:**
```
"/anchor"
"/context-anchor"
"anchor current state before switching tasks"
```

[Learn more →](context-anchor/README.md)

---

### 🚀 `new-project`

Interactive project creator and Project OS provisioner. Bootstraps the 10 Canonical `/docs/` Project Brain, 8-Stage Reality Machine (`STATE.md`), Council Governance (`AGENTS.md`), dynamic `llms.txt`, `.gitignore`, and selective skill bundles into any repository.

**Installation:**
```bash
npx skills add harshsinghmp/muse-skills --skill new-project
```

**Key Capabilities:**
- Interactive questionnaire with path auto-suggestions from existing workspaces
- 10 Canonical Documentation sources (`01_OVERVIEW.md` through `10_UNRESOLVED.md`)
- 8-Stage Reality State Machine (`PROPOSED` → `LOCAL_DEV` → `STAGING_VERIFIED` → `PROD_VERIFIED`)
- Codified **Muse Council** hierarchy (Muse, Sol, Jasper, Crew, Nexus)
- Enforces the Meaningful Git Commit Protocol
- Dynamic `llms.txt` and `llms-full.txt` documentation bundler
- Supports Next.js 16 (App Router + Tailwind v4 + React 19), Astro, Vite, and API backends

**Usage:**
```
"run /new-project"
"create a new Astro project"
"scaffold Next.js 16 app with agency-suite skills"
```

[Learn more →](new-project/README.md)

---

### 🧠 `updateagents`

Automatically discovers, reads, and updates agent memory files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, etc.) in the current working directory.

**Installation:**
```bash
npx skills add harshsinghmp/muse-skills --skill updateagents
```

**Key Capabilities:**
- Auto-discovers existing memory files in workspace root (never traverses parent paths)
- Integrates with cavemem, codegraph, rtk, memoryagent, ponytail
- Incremental updates (preserves existing conventions, adds fresh findings)
- Priority system for multiple memory files
- Size management (warns at 5KB, errors at 10KB)

**Usage:**
```
"update agents.md"
"refresh clauade.md"
"sync memory files"
"create agent guide for this workspace"
```

[Learn more →](updateagents/README.md)

---

## 📁 Repository Structure

```
muse-skills/
├── agent-handoff/                  # Structured subagent context packet generator
│   ├── agents/
│   │   └── openai.yaml             # Agent tool definition
│   ├── examples/
│   │   └── sample-handoff.md       # Real-world packet example
│   ├── README.md                   # Skill documentation
│   └── SKILL.md                    # Core prompt & operational instructions
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
├── new-project/                    # Project OS & governance scaffolder
│   ├── agents/
│   │   └── openai.yaml
│   ├── references/
│   │   └── project-os-architecture.md
│   ├── scripts/
│   │   └── new-project.ts
│   ├── README.md
│   └── SKILL.md
│
├── updateagents/                   # Memory & context synchronization
│   ├── agents/
│   │   └── openai.yaml
│   ├── examples/
│   │   └── before-after.md
│   ├── references/
│   │   ├── discovery-commands.md
│   │   └── memory-file-priorities.md
│   ├── scripts/
│   │   └── validate-memory-file.sh
│   ├── README.md
│   └── SKILL.md
│
├── CONTRIBUTING.md                 # Meaningful Git Commit Protocol
├── package.json                    # Package metadata & keywords
├── README.md                       # Repository overview & index
└── skills.json                     # Skill registry catalog
```

---

## 📜 Contributing & Commit Protocol

All commits and contributions must strictly adhere to our **[Meaningful Git Commit Protocol](CONTRIBUTING.md)**:

```
<type>(<scope>): <concise-imperative-summary>

- Why: [Explain motivation or issue solved]
- What: [Bullet list of specific files or mechanisms changed]
- Verification: [Proof of clean build and test receipts]
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 📄 License

[MIT](LICENSE) © [Harsh](https://github.com/harshsinghmp)
