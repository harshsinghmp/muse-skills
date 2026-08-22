# Changelog

All notable changes to the **Muse Skills** suite are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-08-22

### Added
- **`pua` Skill**: Put your AI on a Performance Improvement Plan. Features 4-tier pressure escalation, universal 5-step methodology, mandatory 7-point checklist, anti-rationalization table, and 8 big-tech corporate flavor packs (Amazon, Google, Meta, Netflix, Musk, Jobs, Stripe, Horse Race).
- **Hermes Extended Frontmatter**: Upgraded all 6 skills (`new-project`, `updateagents`, `pua`, `agent-handoff`, `dead-letter`, `context-anchor`) with Hermes-compatible YAML metadata (`version`, `author`, `license`, `platforms`, `metadata.hermes`).
- **Canonical Architecture Documentation**: Added `docs/ARCHITECTURE.md` and `docs/SKILL_SPECIFICATION.md`.
- **Machine-Readable LLM Index**: Added dynamic `llms.txt` for automatic agent ingestion.
- **MIT License**: Added official `LICENSE` file.

### Changed
- Streamlined `pua-en` naming to `pua` across all tools, references, and documentation.
- Standardized all `SKILL.md` documents to the 5-section RFC standard (`When to Use`, `Quick Reference`, `Procedure`, `Pitfalls`, `Verification`).
- Redesigned `README.md` using `readme-wizard` standards with centered hero header, verified badges, and Mermaid system architecture diagram.
- Re-enforced flagship priority ensuring `new-project` and `updateagents` remain at index 0 and 1 across catalog registries.

---

## [1.2.0] - 2026-08-22

### Added
- **`agent-handoff` Skill**: Generates structured subagent context packets (`.claude/handoff-<timestamp>.md`) with explicit ruled-out dead ends and negative boundaries.
- **`dead-letter` Skill**: 9-mode failure classification taxonomy (`BLOCKED-CRED`, `BLOCKED-PERM`, `BLOCKED-DATA`, `BLOCKED-AMBIG`, `BLOCKED-RATE`, `FAILED-LOGIC`, `FAILED-TOOL`, `FAILED-SCOPE`, `PARTIAL`) with automatic retry and escalation generators.
- **`context-anchor` Skill**: Working reference snapshot generator (`.claude/anchor.md`) preventing cascading context drift.

### Changed
- Expanded default `.gitignore` template to cover modern ADE/agent state directories (`.codex/`, `.agents/`, `.codegraph/`, `.crush/`, `.omo/`, `.playwright/`, `.slim/`).

---

## [1.1.0] - 2026-08-19

### Added
- **`new-project` Skill**: Interactive Project OS provisioner bootstrapping 10 Canonical `/docs/`, 8-stage reality state machine (`STATE.md`), Council governance (`AGENTS.md`), dynamic `llms.txt`, and skill bundles.
- **`CONTRIBUTING.md`**: Enforces Meaningful Git Commit Protocol.

---

## [1.0.0] - 2026-08-16

### Initial Release
- **`updateagents` Skill**: Automatic workspace-scoped agent memory synchronization (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) with cavemem, codegraph, rtk, memoryagent, and ponytail integration.
- Standard skill registry `skills.json` and package baseline.
