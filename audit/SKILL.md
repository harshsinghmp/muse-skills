---
name: audit
aliases: ["brain-audit","memory-audit","knowledge-audit"]
description: "Knowledge hygiene and referential integrity auditor for AI agent memory banks, documentation trees, and knowledge bases. Audits memory stores, .memory/wiki/, and project documentation for dead links, broken symbol references, orphaned notes, leaked credentials, and stale contradictions. Generates brain-audit-report.md."
version: 1.0.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
category: reflection-maintenance
metadata:
  category: reflection-maintenance
  priority: 18
  aliases: ["brain-audit","memory-audit","knowledge-audit"]
  suggested_skills: ["updatedocs","evidence-ledger","coach","periodic-retreat"]
  hermes:
    tags: [knowledge-audit, memory-hygiene, link-integrity, docs-validation, dead-links, secret-scan, ref-integrity]
    related_skills: [updatedocs, evidence-ledger, coach, periodic-retreat]
    suggested_skills: [updatedocs, evidence-ledger, coach, periodic-retreat]
    requires_tools: [bash, view_file, grep, glob, write_to_file, replace_file_content]
  openclaw:
    category: reflection-maintenance
    suggested_skills: [updatedocs, evidence-ledger, coach, periodic-retreat]
    primary_triggers: ["audit knowledge base","check markdown dead links","audit memory hygiene","brain audit"]
    requires_tools: [bash, view_file, grep, glob, write_to_file, replace_file_content]
  compatibility: [hermes, openclaw, claude-code, codex, cursor, gemini-cli, opencode]
---

# 🧠 Brain Audit — Knowledge Hygiene & Referential Integrity Auditor

> Systematically audits agent memory banks, `.agents/context/`, `.memory/wiki/`, and documentation trees. Detects dead markdown links, broken symbol references, orphaned memory notes, leaked credentials, and stale contradictory statements to maintain an uncompromisingly hygienic cognitive repository.

---

## When to Use

### Trigger Conditions
Execute this skill when:
1. **Pre-Release Documentation Audit**: Verifying that all markdown links, table-of-contents anchors, and file references resolve to real files.
2. **Memory Bank Hygiene**: Cleaning up `.memory/wiki/`, `.agents/context/`, or project memory files after extensive multi-agent refactoring.
3. **Preventing Agent Hallucinations**: Stale or broken documentation causes future agents to hallucinate non-existent files or obsolete APIs.
4. **Credential & Secret Sweeps**: Auditing knowledge docs to guarantee zero accidentally pasted API keys or tokens.

### Anti-Triggers
Do NOT use this skill when:
- Writing initial scratch documentation.
- Reviewing pure source code logic without markdown documentation.

---

## Quick Reference

### The 5 Knowledge Audit Checkpoints

```
┌─────────────────────────┬────────────────────────────────────────────────────────┐
│ Checkpoint              │ Failure Mode Detected                                  │
├─────────────────────────┼────────────────────────────────────────────────────────┤
│ 1. Link Integrity       │ 404 dead links, broken local file paths, missing files │
│ 2. Orphaned Notes       │ Files in knowledge tree with zero incoming links       │
│ 3. Stale Contradictions │ Outdated version numbers, renamed skills, obsolete APIs│
│ 4. Secret Leakage       │ Hardcoded `sk-*`, `ghp_*`, or private keys in markdown │
│ 5. Frontmatter Health   │ Invalid YAML delimiters, missing required keys         │
└─────────────────────────┴────────────────────────────────────────────────────────┘
```

### Audit Severity Classification

| Severity | Defect Type | Required Action |
| :--- | :--- | :--- |
| **🚨 Critical Blocker** | Leaked secrets / credentials or broken core navigation | **IMMEDIATE REPAIR** before release |
| **⚠️ Warning** | Dead relative links or mismatched version strings | Fix target path or update version metadata |
| **🔍 Notice** | Orphaned markdown file with no incoming references | Add link to index or archive file |

---

## Procedure

### Step 1 — Target Scope Discovery
Identify all markdown, knowledge, and memory files in workspace:
- `.agents/context/*.md`
- `docs/*.md`
- `README.md`, `llms.txt`, `AGENTS.md`
- `.memory/wiki/**/*.md`

### Step 2 — Automated Link & File Reference Extraction
1. Extract all markdown links: `[Label](target/path.md)`.
2. Extract all HTML anchor tags and code blocks mentioning file paths.
3. Resolve each path relative to its source file location.
4. Test file existence using filesystem probes.

### Step 3 — Secret & Credential Scan
Scan all knowledge files for exposed credentials:
- API token patterns (`sk-[a-zA-Z0-9]{20,}`, `ghp_[a-zA-Z0-9]{20,}`, private keys).
- Mask any found credentials immediately with `[REDACTED]`.

### Step 4 — Frontmatter & Version Consistency Check
Verify that all skills and docs declare identical version strings and valid YAML frontmatter blocks (`---`).

### Step 5 — Emit Audit Report (`audit-report.md`)
Generate the structured report cataloging broken paths, secret scan status, and remediations.

---

## Pitfalls

- **Silent Link Rot**: Assuming that because a link worked last month, it still resolves after a folder reorganization.
- **Ignoring Code Block Filepaths**: Documentation examples often reference renamed scripts (e.g. `scripts/old-name.ts`) that fail when users copy-paste them.
- **Superficial Audits**: Checking only `README.md` while ignoring subfolder references.

---

## Verification

Before certifying knowledge hygiene:
1. [ ] 100% of relative markdown links resolve to existing files on disk.
2. [ ] Zero plaintext secrets or sensitive tokens exist in documentation.
3. [ ] All skill versions in docs match `package.json` `"version"`.
4. [ ] `audit-report.md` reports zero critical blockers.
