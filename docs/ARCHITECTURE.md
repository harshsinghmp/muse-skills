# Architecture & System Design

## Overview

**Muse Skills** (`@harsh/muse-skills`) is an enterprise-grade agent skill repository and governance toolkit within the **LifeOS** ecosystem. It provides autonomous AI agents with structured operational capabilities for Project Operating System provisioning, workspace memory synchronization, PIP performance enforcement, subagent coordination, error triage, and context anchoring.

All skills follow a dual-layer architecture:
1. **Universal Metadata Layer**: Extended YAML frontmatter (with Hermes metadata, tools, and platform requirements) parsed natively by `npx skills`, Claude Code, Cursor, and Hermes.
2. **Deterministic Markdown Execution Engine**: Standard RFC sections (`When to Use`, `Quick Reference`, `Procedure`, `Pitfalls`, `Verification`) ensuring zero-hallucination execution across all LLM models.

---

## Technical Stack

| Layer | Technology | Specification / Standard |
| :--- | :--- | :--- |
| **Package Runtime** | Node.js / Bun | ECMAScript Modules (`"type": "module"`) |
| **Skill Protocol** | RFC Agent Skills Standard | YAML Frontmatter + Markdown Body |
| **Metadata Engine** | Hermes Metadata Schema | `metadata.hermes` namespace with tags, dependencies, and tools |
| **CLI & Registry** | `npx skills` / `skills.sh` | Global repository discovery & tree installation |
| **Scaffolding Tooling** | TypeScript / Bun | Strict-mode project OS generation (`NewProject.ts`) |
| **Validation Suite** | Bash & Node.js | Memory file assertion & JSON schema validation |
| **Version Control** | Git + Meaningful Commit Protocol | Semantic versioning (`v1.3.0`) with structured changelog |

---

## Directory Structure

```
muse-skills/
├── docs/                           # Canonical technical documentation
│   ├── ARCHITECTURE.md             # System architecture & data flow
│   ├── CHANGELOG.md                # Semantic version release log
│   └── SKILL_SPECIFICATION.md      # RFC skill authoring standard
│
├── new-project/                    # Project OS & governance scaffolder (Flagship #1)
│   ├── agents/openai.yaml          # Agent tool definition
│   ├── references/                 # Architecture reference docs
│   ├── scripts/new-project.ts      # Scaffolding engine
│   ├── README.md                   # Child documentation
│   └── SKILL.md                    # Core operational procedure
│
├── updateagents/                   # Workspace memory synchronization (Flagship #2)
│   ├── agents/openai.yaml          # Agent tool definition
│   ├── examples/before-after.md    # Synthesis examples
│   ├── references/                 # Priority tables & discovery commands
│   ├── scripts/validate-memory-file.sh # Memory file validator
│   ├── README.md                   # Child documentation
│   └── SKILL.md                    # Core operational procedure
│
├── pua/                            # PIP performance & structured debugging
│   ├── agents/openai.yaml          # Agent tool definition
│   ├── examples/sample-pip-report.md # Real-world diagnostic report
│   ├── README.md                   # Child documentation
│   └── SKILL.md                    # Core operational procedure
│
├── agent-handoff/                  # Structured subagent context packet generator
│   ├── agents/openai.yaml          # Agent tool definition
│   ├── examples/sample-handoff.md  # Packet example
│   ├── README.md                   # Child documentation
│   └── SKILL.md                    # Core operational procedure
│
├── context-anchor/                 # Working reference snapshot generator
│   ├── agents/openai.yaml          # Agent tool definition
│   ├── examples/sample-anchor.md   # Anchor example
│   ├── README.md                   # Child documentation
│   └── SKILL.md                    # Core operational procedure
│
├── dead-letter/                    # Failed/blocked task triage & capture
│   ├── agents/openai.yaml          # Agent tool definition
│   ├── examples/sample-dead-letter.md # Dead letter example
│   ├── README.md                   # Child documentation
│   └── SKILL.md                    # Core operational procedure
│
├── CONTRIBUTING.md                 # Meaningful Git Commit Protocol
├── LICENSE                         # MIT License
├── llms.txt                        # Machine-readable LLM documentation index
├── package.json                    # Package metadata & keywords
├── README.md                       # Main repository overview
└── skills.json                     # Skill catalog registry
```

---

## Core Execution Flows

### Flow 1: Skill Discovery & Universal Ingestion

```mermaid
sequenceDiagram
    participant User as Developer / Agent
    participant CLI as npx skills CLI
    participant Registry as skills.json
    participant Target as Local Workspace (.agents/skills)

    User->>CLI: npx skills add harshsinghmp/muse-skills --skill <name>
    CLI->>Registry: Fetch skills.json catalog
    Registry-->>CLI: Return skill path & tool dependencies
    CLI->>Target: Copy skill bundle (<name>/SKILL.md, README.md, agents/)
    Target-->>User: Skill ready for Claude / Hermes / Codex / Cursor
```

### Flow 2: Project OS Provisioning (`new-project`)

```mermaid
graph TD
    Trigger([User triggers /new-project]) --> Scaffolder[bun NewProject.ts]
    Scaffolder --> DocGen[Generate Canonical /docs/]
    Scaffolder --> StateMachine[Bootstrap 8-Stage STATE.md]
    Scaffolder --> Governance[Write .agentrules & AGENTS.md]
    Scaffolder --> Gitignore[Seed Hardened .gitignore]
    Scaffolder --> LLMs[Generate dynamic llms.txt]
    Scaffolder --> Verification[Run initial nexus_verify.sh]
    Verification --> Ready([Project OS Initialized])
```

### Flow 3: Subagent Handoff & Failure Recovery (`agent-handoff` ➔ `dead-letter` ➔ `pua`)

```mermaid
graph LR
    Orchestrator[👑 Muse Orchestrator] -->|1. Generate Handoff Packet| AH[🤝 agent-handoff]
    AH -->|2. Dispatch Context| Worker[⚡ Subagent Worker]
    Worker -->|3a. Task Succeeds| Done([✅ Verifiable Receipt])
    Worker -->|3b. Task Fails / Blocks| DL[📮 dead-letter]
    DL -->|4a. Mechanical Fix| Retry([🔄 Retry Packet])
    DL -->|4b. Judgment Escalation| Escalate([🚨 Council Escalation])
    DL -->|4c. Complex Stall / Deflection| PUA[🛡️ pua PIP Enforcement]
    PUA -->|5. 7-Pt Checklist & PoC| Solved([🎯 Deep Resolution])
```

---

## Configuration & Governance

1. **`skills.json`**: Primary catalog registry consumed by skill discovery engines. Requires `name`, `description`, `path`, `version`, `tools`, and `tags`.
2. **`package.json`**: Defines package metadata, validation scripts (`npm run validate`), and keyword tags.
3. **`CONTRIBUTING.md`**: Enforces the **Meaningful Git Commit Protocol** across all changes.
4. **Vibeguard Protocol**: Zero-credential exposure invariant applied across all scripts, documentation, and transcripts.
