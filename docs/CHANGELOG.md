# Changelog

All notable changes to the **Muse Skills** suite are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **`clean-system-cache` Skill (#20)**: Cross-platform development, design, and browser cache cleanup engine for Linux, macOS, and Windows (`scripts/clean-cache.sh` and `scripts/clean-cache.cmd`). Cleans package managers (npm, bun, yarn, pnpm, cargo, pip/uv, gradle), build tools, design applications (Figma, Adobe, Blender), and browser caches with active running-session protection, credential preservation, and targeted dry-run auditing.
- **Agent Engine Architecture in `ai-ready`**: Relocated template bundle from `new-project` to `ai-ready` as canonical source, added `backend-wordpress.md` standard and WordPress archetype to `new-project`, and added `ai-ready/scripts/ai-ready.ts` CLI supporting `--audit` and `--scaffold`.
- **Intelligent Context Extraction in `updateagents`**: Scaffolding on empty workspaces, intelligent legacy context mapping and merging from custom agent instruction files, and structured diff change reporting.
- **Session Resumption in `handoff`**: Inbound session continuation protocol with directory boundary verification.
- **'The Bar is the Whole Trick' in `gauntlet-loop`**: Blind A/B critique and adversarial quality gate integration.

## [2.0.0] - 2026-09-04

### Added
- **`git` Skill (Flagship #3)**: Autonomous end-to-end Git & GitHub release engine with 9-tier anti-slop issue triage, strict 4-phase branching (`master` production, `dev` staging, `release/*` cuts, `feat/*` working lanes), automated doc sync, SemVer release cutting, and GitHub SEO / Open Graph metadata optimization.
- **`ai-ready` Skill (Flagship #7)**: Autonomous repository AI-readiness auditor and Agent Engine DOX scaffolding engine with a 12-asset audit scorecard, PR review convention mining, and sub-100ms Stage-0 Fast-Skip gate.
- **Automatic Skill Extraction Helper**: CLI utility `scripts/extract-skill.ts` (`bun run extract-skill`) with 3-gate validation (Recurrence Gate $\ge 3$, Verification Gate, Generalization Gate) and automated catalog registration.
- **5-State Anti-Slop UI Gate**: Upgraded `refactor-ui` with comprehensive UI state coverage auditing (loading, empty, error, partial, ideal).
- **Karpathy Simplicity Doctrine**: Upgraded `code-review` with the Karpathy minimal-diff doctrine, cognitive burden reduction heuristics, and complexity pushback.
- **Skill Compatibility & Conflict Matrix**: Upgraded `coupling-router` to audit pairwise skill compatibility, detect antagonistic pairings, and enforce Minimum Viable Skill Sets (MVSS).
- **Responsive Layout Tree Extraction**: Upgraded `designscope` to extract structured CSS Grid/Flexbox component hierarchy trees and tokenized breakpoints.
- **Socratic Adversarial Challenge Lens**: Upgraded `secretary` with a 3-prong devil's advocate stress-testing lens, dissent ledger, and cryptographic approval gate.
- **Academic Citation Receipts**: Upgraded `evidence-ledger` with peer-reviewed DOI citation validation, research receipts, and empirical vs speculative demarcation.
- **Web Security & Visual Regression Gates**: Upgraded `gauntlet-loop` with CSP/HSTS header audits and multi-viewport visual regression gates.

### Changed
- **Skill Name Shortening**:
  - `agent-handoff` ➔ `handoff`
  - `code-review-linus-torvalds-style` ➔ `code-review`
  - `daily-standup-coach` ➔ `coach`
  - `secretary-controller` ➔ `secretary`
  - `brain-audit` ➔ `audit`
  (Preserved previous names as aliases in YAML frontmatters for backward compatibility).
- **Universal Multi-Agent Metadata Standard**: Upgraded all 19 skills with Hermes, OpenClaw, Codex, Cursor, and Gemini metadata standards, adding structured `category`, `priority`, `aliases`, `suggested_skills` mesh, `hermes`, and `openclaw` trigger blocks.
- **Priority Reordering Overhaul**: Reordered the entire suite in exact priority order (#1 `updatedocs` through #19 `periodic-retreat`), synchronizing `skills.json`, `llms.txt`, `README.md`, and test suite.
- **Context Anchor Neutrality**: Standardized anchor location to vendor-neutral `.agents/context.md`.

---

## [1.8.0] - 2026-09-04

### Added
- **`updatedocs` Skill (v2.0.0)**: Project-wide documentation synchronization, drift detection, and governance engine with a 20-step pipeline.
- **Strict Governance Boundaries**: Enforced `.memory/` no-touch boundary (`OWNER = musememory`) and `.agents/` protected DOX architecture gate (explicit user permission required).
- **8 Reference Policy Guides**: Added comprehensive reference guides covering document taxonomy, ownership frameworks, audit checklists, changelog boundaries, and architecture protections.
- **Agent Engine & DOX Engine Aliases**: Added canonical triggers to `new-project` for seamless activation.
- **Catalog Expansion**: Expanded suite from 16 to 17 skills across `package.json`, `skills.json`, `llms.txt`, `README.md`, and automated TDD test suite.

---

## [1.7.0] - 2026-09-04

### Added
- **Progressive Disclosure DOX Architecture**: Upgraded `new-project` with 2-stage Agents-First scaffolder and `.agents/` container template bundle (9 folders, 12 modular standards, brand tokens).
- **Interactive DOX Wizard**: Interactive CLI wizard with archetype selections (Astro, Next.js, Instatic, Hono, Vite) and dynamic path resolvers.
- **`updateagents` Modernization**: Rewritten with 17-step context sync, DOX container retrofit, and strict `.memory/**` isolation.

---

## [1.6.0] - 2026-09-01

### Added
- **`gauntlet-loop` Skill**: Bounded multi-agent quality improvement loop deploying a 4-role protocol (Freeze → Build → Fresh Critic → Automated Gate → Integrator) with hard stop boundaries (passing score $\ge 9.0/10$, 2-round score plateau, regression, or max iteration budget). Generates `GAUNTLET_JOB_CONTRACT.md`, `ITERATION_LEDGER.md`, and `ACCEPTANCE_PACKET.md`.
- **`secretary-controller` Skill**: Evidence-grounded staff-work controller and approval gate. Enforces *Judgment, not authority*, explicit dissent preservation, declared evidence registries, and single-use SHA-256 hash approval tokens before any filesystem write or external mutation. Generates `DECISION_MEMO.md` and `APPROVAL_PACKET.md`.
- **`coupling-router` Skill**: Coupling-aware architectural delegation router for task DAGs. Computes topological coupling metrics ($C \ge 0.6$ routes sequentially, $C < 0.3$ fans out in parallel) to prevent merge conflicts and hallucinated interface drift. Generates `ROUTING_PLAN.md`.
- **`evidence-ledger` Skill**: Source-cited claim verification gate enforcing *"No source, no claim. No verification path, no release."* Audits claims under a 4-tier confidence taxonomy (`[RAW]`, `[FETCH]`, `[SEARCH]`, `[INFER]`) and outputs `claim-ledger.md`.
- **`daily-standup-coach` Skill**: Daily reflective check-in and 5-pillar controllable effort scorecard (TDD rigor, minimal diff discipline, security hygiene, deep work focus, blocker triage) on a 1–10 scale. Outputs `daily-standup.md`.
- **`periodic-retreat` Skill**: Quarterly strategic retreat facilitator. Operates across 4 scales to audit project vitality, systematically purge architectural debt, align with LifeOS TELOS, and formulate next-quarter OKRs. Outputs `quarterly-retreat.md`.
- **`brain-audit` Skill**: Knowledge hygiene and referential integrity auditor for markdown docs, memory banks, and knowledge trees. Validates 100% relative link resolution, checks for broken anchors, and sweeps for leaked secrets. Outputs `brain-audit-report.md`.
- **Automated TDD Test Suite**: Added `tests/skills.test.ts` powered by native `bun test`, validating catalog JSON integrity, flagship skill ordering, RFC 5-section compliance, companion file existence (`README.md`, `agents/openai.yaml`), and documentation synchronization across `llms.txt` and `README.md`.

### Changed
- Suite count expanded nine → sixteen skills across `README.md`, `package.json`, `skills.json`, `llms.txt`, `AGENTS.md`, and `docs/ARCHITECTURE.md`.
- Standardized `package.json` `"test"` script to `bun test`.
- Bumped package version to `1.6.0`.

---

## [1.5.0] - 2026-08-31

### Added
- **`refactor-ui` Skill**: Atomic UI design and interface refactoring engine based on the design methodology of *Refactoring UI* by Adam Wathan and Steve Schoger (© Tailwind Labs Inc.). Packages 10 atomic heuristics (visual hierarchy, typography scales, functional color palettes, 4px/8px spacing rhythm, button hierarchy, visual clutter reduction, high-value empty states, natural shadows/elevation, WCAG 2.1 AA/AAA contrast, and spatial grouping). Includes 10 progressive-disclosure reference guides, stdlib contrast calculator (`check_contrast.py`), and a static anti-pattern auditor (`audit_ui.py`).
- **Attribution & Licensing**: Explicit credit to Adam Wathan & Steve Schoger for foundational design principles and acknowledgment to George Nurijanian (`gnurio/refactoring-ui-plugin`) for skill packaging inspiration.

### Changed
- Suite count eight → nine across `README.md`, `package.json`, `skills.json`, `llms.txt`, and `docs/ARCHITECTURE.md`.
- Bumped package version to `1.5.0`.

---

## [1.4.0] - 2026-08-24

### Added
- **`designscope` Skill**: Design system extraction from any visual source — images, website URLs, and Figma files analyzed into a `design.md` brief (7-section spec with confidence-marked inferences), W3C DTCG `design-tokens.json`, and an optional WCAG 2.1 contrast report. Element mode captures single components as rebuild specs or token-grounded generative image prompts (`code` / `asset` / `hybrid`). Ships 5 progressive-disclosure references and 4 stdlib-only CLI scripts (`extract_css_vars.py`, `check_contrast.py`, `lint_design_md.py`, `verify_design.py`) — zero pip dependencies.
- **Repository Discoverability**: GitHub description and 11 topics (`ai-agents`, `ai-skills`, `agent-skills`, `design-system`, `design-tokens`, `dtcg`, `figma`, `wcag`, `accessibility`, `ui-design`, `developer-tools`).

### Changed
- Suite count six → seven across `README.md` (badge, tables, structure tree), `AGENTS.md`, and `docs/ARCHITECTURE.md`.
- Registry entries for `designscope` added to `skills.json` and `llms.txt`.

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
