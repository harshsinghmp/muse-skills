# Skill Authoring Specification (RFC)

This document establishes the official standard for authoring, structuring, and maintaining skills in the **`muse-skills`** repository.

---

## 1. Directory Anatomy

Every skill must reside in its own dedicated directory at the repository root:

```
<skill-name>/
├── agents/
│   └── openai.yaml         # Tool parameter schema for OpenAI/Codex/Cursor
├── examples/               # (Optional but recommended) Concrete input/output artifacts
│   └── sample-<name>.md
├── references/             # (Optional) Supporting deep architectural references
│   └── reference-doc.md
├── scripts/                # (Optional) Executable validation or generation scripts
│   └── helper-script.sh
├── README.md               # User-facing summary & installation guide
└── SKILL.md                # The definitive agent operational prompt
```

---

## 2. Frontmatter Standard (Hermes Extended Schema)

Every `SKILL.md` must begin with YAML frontmatter conforming to this schema:

```yaml
---
name: <skill-name>
description: "<Brief 1-2 sentence trigger and capability summary shown in search results>"
version: 1.0.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [tag1, tag2, tag3]
    related_skills: [skill-a, skill-b]
    requires_tools: [bash, view_file, write_to_file]
---
```

### Field Definitions:
- **`name`** *(string, required)*: Kebab-case unique identifier matching directory name.
- **`description`** *(string, required)*: Clear trigger condition and action summary.
- **`version`** *(string, required)*: Semantic version (`1.0.0`).
- **`author`** *(string, required)*: Skill author (`Harsh Singh`).
- **`license`** *(string, required)*: License (`MIT`).
- **`platforms`** *(array of strings, optional)*: Supported OS platforms (`[macos, linux, windows]`).
- **`metadata.hermes`** *(object, optional)*: Hermes-specific metadata namespace.
  - `tags`: Classification tags.
  - `related_skills`: Companion skills in the catalog.
  - `requires_tools`: Specific tool capabilities required by the skill.

---

## 3. Required Markdown Sections

The body of `SKILL.md` must adhere to these 5 standard sections:

### `# <Icon> <skill-name> — <Concise Subtitle>`
Introductory overview defining the purpose and operational scope of the skill.

### `## When to Use`
Explicit trigger conditions and anti-triggers (when *not* to use).

### `## Quick Reference`
Scannable markdown table summarizing modes, taxonomy, parameter combinations, or command cheat-sheets.

### `## Procedure`
Numbered, step-by-step instructions the agent follows during execution. Must include concrete command examples, file targets, and deterministic steps.

### `## Pitfalls`
Catalog of known failure modes, anti-rationalizations, and constraints (e.g., negative boundaries, forbidden paths, anti-patterns).

### `## Verification`
Explicit assertions, validation commands, or checklists the agent must execute and satisfy before declaring the task complete.

---

## 4. Flagship Skill Ordering Invariant

`new-project` and `updateagents` are the foundational flagship skills of the `muse-skills` catalog.
- In `skills.json`, `new-project` must always be index `0`, and `updateagents` must be index `1`.
- In `README.md`, `new-project` and `updateagents` must always appear first in the Quick Start, Available Skills Table, and Detailed Breakdown.
