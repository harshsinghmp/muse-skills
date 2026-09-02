---
name: updatedocs
description: "Documentation synchronization, impact analysis, and drift audit skill. Traces codebase and configuration changes to all affected documentation (README, changelogs, architecture, APIs, contributing, agent context), audits discrepancies, and applies minimal, verified updates across Markdown documentation."
version: 1.0.0
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [documentation, sync, impact-analysis, changelog, architecture, audit, git, verification]
    related_skills: [updateagents, agent-handoff, new-project]
    requires_tools: [bash, view_file, edit_file, grep_search, find_by_name]
---

# 📚 updatedocs — Documentation Synchronization & Impact-Analysis Engine

`updatedocs` is a change-driven documentation synchronization, impact-analysis, and drift-audit skill. It traces code, configuration, and architectural changes across the repository to identify and update all affected documentation without causing unnecessary documentation churn or rewriting project history.

Core operational loop:
```
DISCOVER ➔ CLASSIFY CHANGE ➔ MAP IMPACT ➔ AUDIT ➔ UPDATE ➔ CROSS-CHECK ➔ VERIFY ➔ REPORT
```

---

## When to Use

### Primary Triggers:
- User asks to *"update docs"*, *"sync documentation"*, *"refresh README"*, *"update changelog"*, or *"reconcile documentation with code"*.
- After completing a new feature, API endpoint, database migration, or configuration change.
- Before merging a branch or cutting a versioned release (`update docs before merge/release`).
- User asks *"what documentation does this change affect?"* or *"does this change require doc updates?"*.
- Periodic documentation health, link integrity, or drift audits.

### Negative Triggers (Do NOT activate for):
- **Formatting-only changes**: Whitespace, lint fixes, or code formatting that changes no behavior.
- **Pure test additions**: Adding internal unit test cases with no changes to user-facing or documented behavior.
- **Internal refactors**: Internal implementation cleanup where public interfaces, CLI flags, and configurations remain unchanged.
- **Standalone writing**: Blog posts, marketing copy, sales letters, or legal policy drafting.
- **License modifications**: Do not modify `LICENSE` unless explicitly requested by the user.

---

## Core Principles

1. **Minimal Documentation Churn**: Never rewrite correct documentation merely because it exists. Apply targeted, surgical diffs.
2. **Change-Driven Synchronization**: Start from the actual Git/working-tree diff and trace its documentation consequences.
3. **Source-of-Truth Awareness**: Determine the appropriate source of truth for each fact (e.g. schemas for APIs, manifests for commands, code for exports).
4. **Historical Preservation**: Never rewrite past changelog releases, accepted ADRs, or historical session decisions.
5. **No Fabricated Facts**: Never invent version numbers, release dates, API parameters, or architectural justifications. If repository evidence is insufficient, report the ambiguity.
6. **Documentation Ownership**: Maintain one canonical location per fact; other documents link rather than duplicate large sections.
7. **Proportionality**: Large code changes do not always require large doc updates, while small configuration changes can have repo-wide documentation impact.

---

## Operating Modes (Internal)

Execute under one of five internal scopes based on task context:

| Mode | Context & Trigger | Operational Focus |
|:---|:---|:---|
| **Quick** | Small targeted fix or single CLI flag change | Inspect targeted diff; update only directly affected document section. |
| **Change** | Feature, API, or configuration change | Full impact analysis, dependency propagation, targeted sync, and verification. |
| **Release** | Preparing a release / tag | Synchronize `CHANGELOG.md`, `README.md`, version matrices, migration guides, and release notes. |
| **Sprint** | End-of-sprint / multi-commit review | Audit accumulated changes since baseline; reconcile drift and documentation debt. |
| **Full** | Explicit full documentation audit | Full repository audit: link integrity, code example validity, diagram freshness, and consistency. |

---

## Procedure

### Step 1: Establish Repository Boundary
1. Determine project root and confirm you remain strictly within the workspace.
2. Exclude build/cache directories from inspection:
   `node_modules/`, `dist/`, `build/`, `.next/`, `.venv/`, `__pycache__/`, `target/`, `.git/`, `coverage/`, `tmp/`.
3. Never read secret-bearing files (`.env`, private keys) merely because they exist.

### Step 2: Establish Current Project Reality
Inspect package manifests and configurations to understand the active stack without making assumptions:
- Package manifests: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `composer.json`
- Task runners & configs: `Makefile`, `tsconfig.json`, `docker-compose.yml`, CI workflows in `.github/workflows/`

### Step 3: Determine Change Boundary
Inspect Git state and working tree to establish exact modifications:
```bash
git status --short
git diff --stat
git diff HEAD
```
Classify the change: `feature` | `breaking change` | `bug fix` | `dependency update` | `configuration/env` | `API change` | `architecture shift` | `contributor workflow`.

### Step 4: Inventory Existing Documentation
Discover documentation files present in the repository:
- Root docs: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE`, `ROADMAP.md`
- Documentation folders: `docs/`, `documentation/`, `guides/`, `docs/adr/`, `adr/`
- AI Agent Context: `AGENTS.md`, `CLAUDE.md`, `.agentrules`, `.cursor/rules/`, `.github/copilot-instructions.md`
- Project State: `.memory/`, `CURRENT.md`, `.agents/context/current.md`

### Step 5: Build a Change Impact Map
Map every code change to its documentation consequence:
```
[Changed Code / Config File]
       │
       ├──► Changed Behavior / Contract
       ├──► Affected Audience (User, Developer, Operator, AI Agent)
       ├──► Target Document & Section
       └──► Action: [UPDATE | ADD | REMOVE | DEPRECATE | LINK | REVIEW | NO CHANGE]
```
*(Consult [references/DOCUMENT-MATRIX.md](./references/DOCUMENT-MATRIX.md) for complete dependency propagation rules).*

### Step 6: Audit Before Editing
Read the affected documentation before modifying it to identify:
- What is already accurate and should be preserved.
- What is stale, broken, or contradictory.
- What links or examples need updating.

### Step 7: Synchronize Documentation
Apply minimal, surgical edits:
- **README**: Update prerequisites, quickstart, or CLI examples if commands changed ([references/DOCUMENT-POLICIES.md](./references/DOCUMENT-POLICIES.md)).
- **CHANGELOG**: Add entries under `## [Unreleased]` in proper Keep a Changelog categories ([references/CHANGELOG-POLICY.md](./references/CHANGELOG-POLICY.md)).
- **ARCHITECTURE & ADR**: Update module boundaries or create ADRs for major architectural shifts ([references/ARCHITECTURE-POLICY.md](./references/ARCHITECTURE-POLICY.md)).
- **CONTRIBUTING**: Update test/build/lint instructions if toolchain changed.
- **AI Agent Context**: Keep `AGENTS.md` lean; update essential commands or invariants ([references/AGENT-CONTEXT-POLICY.md](./references/AGENT-CONTEXT-POLICY.md)).
- **Memory / State**: Record durable constraints into `.memory/` or `current.md` ([references/MEMORY-POLICY.md](./references/MEMORY-POLICY.md)).

### Step 8: Cross-Check & Verify
Execute the 14-point audit checklist ([references/AUDIT-CHECKLIST.md](./references/AUDIT-CHECKLIST.md)):
1. Confirm all internal relative Markdown links resolve.
2. Confirm commands and code examples match real manifests.
3. Confirm no secrets or private credentials were leaked ([references/SECURITY.md](./references/SECURITY.md)).
4. Confirm cross-document consistency (e.g. README and CONTRIBUTING agree on package manager).

---

## Output Format

Present a concise, terminal-friendly report summarizing actions and verification:

```markdown
## 📚 Documentation Synchronization Report

### 📝 Updated
- `path/to/file.md`: [Reason for update & sections modified]

### 🔍 Reviewed — No Change Required
- `path/to/file.md`: [Why current content remains accurate]

### ⚠️ Missing / Drift Found
- `path/to/file.md`: [Discrepancy identified & how it was reconciled]

### ✅ Verification
- **Git Scope**: [e.g. Inspected 4 changed files across working tree]
- **Internal Links**: [e.g. All relative Markdown links verified]
- **Commands & Examples**: [e.g. Verified against package.json scripts]
- **Cross-Document Consistency**: [e.g. Verified across README, CHANGELOG, and AGENTS.md]
- **Security / Secrets**: [e.g. Zero credentials or .env values exposed]

### ❓ Unverified / Ambiguous
*(Include only if repository evidence was insufficient to confirm a fact)*
- `topic`: [What remains uncertain pending user confirmation]

### 🤝 Recommended Companion Handoffs
*(Include only when a concrete follow-up task exists)*
- Agent context refactoring ➔ `updateagents`
- Subagent task delegation ➔ `agent-handoff`
```

---

## References (Progressive Disclosure)

Load these standalone reference modules when relevant:
- 📑 [Document Matrix & Dependency Propagation](./references/DOCUMENT-MATRIX.md)
- 📜 [Document Class Operational Policies](./references/DOCUMENT-POLICIES.md)
- ✅ [14-Point Audit & Verification Checklist](./references/AUDIT-CHECKLIST.md)
- 📜 [Changelog & Versioning Policy](./references/CHANGELOG-POLICY.md)
- 📐 [Architecture & ADR Policy](./references/ARCHITECTURE-POLICY.md)
- 🤖 [Agent Context & Instruction Policy](./references/AGENT-CONTEXT-POLICY.md)
- 🧠 [Memory & Project State Policy](./references/MEMORY-POLICY.md)
- 🛡️ [Security, Privacy & Secret Isolation](./references/SECURITY.md)
