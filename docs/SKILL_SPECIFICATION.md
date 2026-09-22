# Skill Authoring Specification (RFC Standard)

> **The Danny Iny 6+1 Standard for Autonomous Agent Extensibility**: Context, Attention, Desire, The Gap, Solution, Call to Action + Credibility.

This specification establishes the official technical standard for authoring, structuring, and verifying portable skills within the `muse-skills` ecosystem.

---

## 🌐 1. Context (The Fragmented Agent Landscape)

Over the past two years, the AI developer landscape has fractured across dozens of competing agent harnesses—Claude Code, OpenCode, Antigravity/Gemini CLI, Cursor, Windsurf, Hermes, Aider, and Cline. Each harness attempts to solve agent capabilities through proprietary configuration formats, ad-hoc system prompts, or complex SDK wrappers.

When developers build agent capabilities as ad-hoc markdown files or custom python plugins, those capabilities are permanently trapped inside a single runtime.

---

## ⚡ 2. Attention (One Universal Skill Contract)

The `muse-skills` RFC establishes a **pure, vendor-neutral skill standard**.

Every capability in this repository is packaged as an independent, deterministic folder containing human-readable Markdown instructions, standardized YAML frontmatter, machine-readable tool schemas, and executable verification scripts.

By adhering to this standard, your skill operates natively across **80+ agent harnesses** with zero translation layers, zero API lock-in, and zero external dependencies.

---

## 🎯 3. Desire (The Autonomous Ideal State)

Imagine authoring a complex engineering workflow—such as Cloudflare edge deployment, 6-slide viral carousel generation, or Linus Torvalds-style code auditing—**exactly once**.

Once authored:
- Any AI agent instantly discovers it via natural language triggers.
- Multi-harness exporters automatically compile it into native slash commands (`/<skill>`, `/<skill>:<mode>`).
- Central dispatchers (`secretary:dispatch`) automatically route tasks to it without user prompt gymnastics.
- Verification gates enforce that the agent cannot claim completion until real tests pass.

---

## ⚠️ 4. The Gap (Why Raw Prompts Fail)

Vanilla system prompts and unstructured markdown fail in production due to four structural flaws:

| Flaw | How It Breaks in Production | The Muse RFC Remedy |
|:---|:---|:---|
| **Context Pollution** | Monolithic prompt files consume 20k+ tokens on load, causing prompt cache eviction. | **Progressive Disclosure**: SKILL.md acts as a lean contract; deep reference playbooks load only on-demand per mode. |
| **Silent Drift** | Prompts describe tools or options that no longer exist in code. | **Tri-File Byte Parity**: Automated tests enforce byte parity across `SKILL.md`, `skills.json`, and `llms.txt`. |
| **Premature Success** | Agents hallucinate that tasks worked without executing proof commands. | **Mandatory `## Verification` Gate**: Tasks require executable terminal receipts before sign-off. |
| **Tool Lock-in** | Prompts depend on harness-specific API calls. | **Modern-Tool Primacy**: Standard shell utilities (`rg`, `fd`, `bat`, `eza`, `bun`) with POSIX fallbacks. |

---

## 🏗️ 5. Solution (The 6-Part Architectural Anatomy)

Every skill must reside in a dedicated root directory conforming to this exact anatomy:

```text
<skill-name>/
├── agents/
│   └── openai.yaml         # Tool parameter schema for OpenAI, Codex, and Cursor
├── examples/               # (Recommended) Concrete input/output working papers
│   └── sample-<name>.md
├── references/             # Mode playbooks and deep architectural guides
│   ├── <mode-1>.md
│   └── <mode-2>.md
├── scripts/                # (Optional) Executable TypeScript / Bash verification scripts
│   └── <utility>.ts
├── README.md               # User-facing manual, modes table & installation guide
└── SKILL.md                # The definitive agent operational prompt
```

### A. Frontmatter Standard (Hermes Extended Schema)

Every `SKILL.md` must begin with YAML frontmatter matching this schema:

```yaml
---
name: <skill-name>
description: "<Trigger-rich summary covering when to invoke, what is delivered, and boundaries>"
argument-hint: "[mode] [flags]"
user-invocable: true
metadata:
  hermes:
    tags: [tag1, tag2, tag3]
    related_skills: [skill-a, skill-b]
    requires_tools: [bash, view_file, write_to_file]
---
```

### B. Standard Markdown Body Structure

The body of `SKILL.md` must adhere to these 6 mandatory sections:

1. **`# <Icon> <skill-name> — <Concise Subtitle>`**: Overview defining the purpose and operational scope.
2. **`## When to Use`**: Explicit trigger keywords, natural language patterns, and anti-triggers (when *not* to use).
3. **`## Quick Reference`**: Scannable markdown table summarizing modes, deliverable artifacts, and flags.
4. **`## Procedure`**: Chronological, numbered steps with concrete command examples and deterministic targets.
5. **`## Pitfalls`**: Catalog of known failure modes, negative boundaries, and anti-rationalizations.
6. **`## Verification`**: Executable commands and assertions the agent must satisfy before declaring completion.

---

## 🚀 6. Call to Action (Authoring & Verification Workflow)

Follow these steps to scaffold and validate a new skill:

```bash
# 1. Initialize skill directory from template
mkdir -p my-skill/{agents,references,examples,scripts}

# 2. Populate canonical assets (SKILL.md, README.md, agents/openai.yaml)
# Ensure SKILL.md has valid frontmatter and required sections

# 3. Register skill in skills.json and synchronize manifests
bun run sync-dispatch

# 4. Verify compliance against repository test contracts
bun test tests/skills.test.ts
```

---

## 🛡️ +1. Credibility (Automated Verification Contracts)

This specification is not mere documentation; it is an **executable contract**.

Every pull request is automatically verified by `tests/skills.test.ts` against the following assertions:
- **Byte-Parity Assertion**: The `description` in `SKILL.md`, `skills.json`, and `llms.txt` must match byte-for-byte.
- **Section Integrity**: Every `SKILL.md` must contain `## When to Use`, `## Quick Reference`, and `## Verification`.
- **Mode Resolution**: Every mode listed in a skill's Quick Reference table must have a corresponding file in `references/<mode>.md`.
- **Zero-Drift Dispatch**: `secretary/references/dispatch.md` must remain in exact synchronization with the catalog.
