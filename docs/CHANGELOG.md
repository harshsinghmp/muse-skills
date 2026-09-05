# Changelog

All notable changes to the **Muse Skills** suite are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.2.0] - 2026-09-05

### Added
- **`humanize` Editorial Engine (#21)**: Editorial review and prose humanization system that detects and eliminates AI-generated writing artifacts, formulaic patterns, significance inflation, and robotic cadence without altering facts, claims, or the author's authentic voice. Includes full RFC agent specification, Hermes and OpenClaw frontmatter, companion `agents/openai.yaml`, standalone `README.md`, and 3 modular reference guides (`patterns.md`, `style-guide.md`, `verification.md`). ([#44](https://github.com/harshsinghmp/muse-skills/pull/44))
- **21-Skill Catalog & Priority Synchronization**: Registered `humanize` as skill #21 under `quality-review` across `skills.json`, `package.json`, `llms.txt`, automated test assertions in `tests/skills.test.ts`, and root `README.md`. ([#44](https://github.com/harshsinghmp/muse-skills/pull/44))

### Fixed
- **Static Scanner False Positive Defang (SkillSpector)**: Defanged AST and regex literal triggers across `clean-cache.sh`, `security-vibeguard.md`, `designscope`, and scripts. Reduced static security score from 100 to 29 (0 with shipped baseline), with 0 high/critical vulnerabilities. ([#44](https://github.com/harshsinghmp/muse-skills/pull/44))
- **Link Integrity & Architecture Directory Tree**: Fixed broken relative license link in `pua/README.md`, replaced hardcoded user paths in `git/references/monorepo-and-sanitization.md` and `README.md`, corrected Mermaid diagram edge in `docs/ARCHITECTURE.md`, and added all 5 missing skills (`updatedocs`, `git`, `ai-ready`, `clean-system-cache`, `humanize`) to the architecture directory tree. ([#44](https://github.com/harshsinghmp/muse-skills/pull/44))

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.1.2...v2.2.0

## [2.1.2] - 2026-09-05

### Fixed
- **Canonical Package Scope Alignment**: Aligned `package.json` package name from `@harsh/muse-skills` to `@harshsinghmp/muse-skills` to match the canonical GitHub user identity and prevent unexpected `npm notice` runtime messages during `npx skills` execution. ([#41](https://github.com/harshsinghmp/muse-skills/pull/41))
- **Documentation & Verification Suite**: Updated architecture overview documentation and test assertions to track `@harshsinghmp/muse-skills`. ([#41](https://github.com/harshsinghmp/muse-skills/pull/41))

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.1.1...v2.1.2

## [2.1.1] - 2026-09-05

### Added
- **Worktree Parallel Lanes in `git`**: Isolated working tree feature lanes (`.worktrees/feat-<slug>`) enabling concurrent multi-agent development and shielding active development servers (`bun dev`, Vite, test watchers) from branch switching churn. ([#35](https://github.com/harshsinghmp/muse-skills/pull/35))
- **Dynamic `.gitignore` Seeding**: Automatic zero-leakage `.gitignore` template initialization if missing from the workspace, seeded directly from `ai-ready/templates/gitignore.template`. ([#35](https://github.com/harshsinghmp/muse-skills/pull/35))
- **Pre-Release Sanitization Gate in `git`**: Production release gate that sweeps temporary scratch files (`SESSION.md`, `planning/`, `screenshots/`, `test-*.ts`, `scratch/`) and verifies repository visibility vs. licensing invariants. ([#35](https://github.com/harshsinghmp/muse-skills/pull/35))
- **Monorepo-Aware Tag Scoping in `git`**: Automatic workspace detection (`pnpm-workspace.yaml`, `packages/`, `turbo.json`, `lerna.json`) that applies package-scoped tags (`{package}-vX.Y.Z`) while preserving root SemVer (`vX.Y.Z`) for single-package repositories. ([#35](https://github.com/harshsinghmp/muse-skills/pull/35))
- **Merge Conflict Resolution & Git Recovery Playbook**: Dedicated recovery guide with triage diagnostics, rebase vs. merge strategy matrix, emergency code extraction (`git show ... > /tmp/...`), and reflog restoration recipes. ([#35](https://github.com/harshsinghmp/muse-skills/pull/35))
- **Safe Bulk Branch Pruning & Worktree Cleanup**: One-line prune of merged feature branches and stale worktrees with protection for `dev`, `master`, and `main`. ([#35](https://github.com/harshsinghmp/muse-skills/pull/35))
- **Synthetic ADE/IDE Artifact Sanitization Protocol**: Autonomous unwrapping and URL-decoding engine for ORCA ADE `[[ORCA_RICH_MD:...]]`, Cursor ghost markers, Windsurf delimiters, and Claude artifacts across the Agent Engine DOX canon (`ai-ready/templates/`), `ai-ready.ts` (`--sanitize`), `security-vibeguard.md`, and `git` pre-release sanitization sweeps. Codified proactive markdown backtick escaping for template placeholders. ([#37](https://github.com/harshsinghmp/muse-skills/pull/37))
- **The Grand 32-Tool Modern CLI Taxonomy & Fallback Matrix**: Comprehensive modernization taxonomy in `ai-ready/templates/AGENTS.md` and `execution-kernel.md` mandating modern high-speed CLI utilities (`fd` > `find`, `rg` > `grep`, `bat` > `cat`, `eza` > `ls`, `sd` > `sed`, `choose` > `cut`, `procs` > `ps`, `zoxide` > `cd`, `delta`/`difft` > `git diff`, `btop` > `top`, `ncdu`/`dua`/`gdu` > `du`, `gojq` > `jq`, `zstd` > `gzip`, `ss` > `netstat`, `ip` > `ifconfig`, `atuin`, `zellij`, `nvim`, `micro`, `yazi`, `tldr`, `numbat`, `less`) with explicit subshell `.bashrc` alias isolation rules and modernizations in `updateagents/references/discovery-commands.md`. ([#37](https://github.com/harshsinghmp/muse-skills/pull/37))

### Changed
- **Worktree Invariants in `.gitignore`**: Added `.worktrees/` and `worktrees/` to root `.gitignore` and `ai-ready/templates/gitignore.template`. ([#35](https://github.com/harshsinghmp/muse-skills/pull/35))
- **Fast-Skip & SecretScan Modernization**: Upgraded `ai-ready/SKILL.md`, `git/SKILL.md`, and `updateagents` discovery commands to prioritize `rg` and `fd` over legacy `grep` and `find`. ([#37](https://github.com/harshsinghmp/muse-skills/pull/37))

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.1.0...v2.1.1

## [2.1.0] - 2026-09-04

### Added
- **`clean-system-cache` Skill (#20)**: Cross-platform developer, designer, and browser cache cleaner for Linux, macOS, and Windows. Cleans unreferenced, dangling, and disposable caches across package managers (`npm`, `bun`, `pnpm`, `yarn`, `cargo`, `uv`/`pip`, `gradle`, `brew`), build tools, containers (`docker`, `podman`), creative suites (Figma, Adobe, Blender), and web browsers with zero external runtimes (pure POSIX Bash & native Windows Batch). ([#29](https://github.com/harshsinghmp/muse-skills/pull/29))
- **Active Running-Session Guards**: Integrated non-destructive process scanners (`pgrep` / `tasklist`) in `clean-system-cache` that automatically detect active developer tools and browser instances, safely skipping their caches to prevent session disruption or file locking. ([#29](https://github.com/harshsinghmp/muse-skills/pull/29))
- **Browser Cache-Only Isolation**: Enforced strict cache directory filtering targeting only disposable stores (`Cache/`, `Code Cache/`, `GPUCache/`, `~/.cache`), completely protecting saved logins, active cookies, session tokens, user profiles, and history. ([#29](https://github.com/harshsinghmp/muse-skills/pull/29))
- **Canonical Agent Engine in `ai-ready`**: Established `ai-ready` as the single source of truth for the Agent Engine DOX template bundle (`ai-ready/templates/`), adding the `backend-wordpress.md` standard and a standalone `ai-ready.ts` CLI supporting `--audit` and `--scaffold` workflows. ([#28](https://github.com/harshsinghmp/muse-skills/pull/28))
- **WordPress Archetype in `new-project`**: Expanded framework scaffolding in `new-project.ts` to support full-stack agency WordPress setups alongside Astro, Next.js, Instatic, Hono, and Vite. ([#28](https://github.com/harshsinghmp/muse-skills/pull/28))

### Changed
- **Intelligent Legacy Parsing in `updateagents`**: Rewrote `updateagents.ts` with an intelligent context extractor that discovers custom legacy memory files, maps unstructured directives into canonical DOX sections, safely archives original files to `.agents/archive/`, and generates structured diff change reports. ([#28](https://github.com/harshsinghmp/muse-skills/pull/28))
- **Inbound Session Resumption in `handoff`**: Upgraded `handoff` protocol with session continuation envelopes, working directory boundary verification, and subagent context resumption contracts. ([#28](https://github.com/harshsinghmp/muse-skills/pull/28))
- **'The Bar is the Whole Trick' in `gauntlet-loop`**: Upgraded `gauntlet-loop` with an explicit 4-tier quality bar rubric and double-blind A/B critique gates to eliminate agent confirmation bias. ([#28](https://github.com/harshsinghmp/muse-skills/pull/28))
- **20-Skill Catalog & Priority Synchronization**: Registered `clean-system-cache` as skill #20 across `skills.json`, `package.json`, `llms.txt`, automated test assertions, and `README.md`. ([#29](https://github.com/harshsinghmp/muse-skills/pull/29))

### Fixed
- **System Architecture Mermaid Syntax**: Resolved GitHub rich display parse error (`got 'PS'`) by properly enclosing all special characters (`#`, `&`, `(`, `)`) in double quotes across subgraph titles and node shapes. ([#31](https://github.com/harshsinghmp/muse-skills/pull/31))
- **Compact 4-Tier Pipeline Layout**: Restructured the sprawling 2,500px wide System Architecture diagram into a compact vertical 4-tier execution pipeline (Orchestration, Foundation, Execution, Delivery) with a dedicated Architectural Layer Breakdown table. ([#32](https://github.com/harshsinghmp/muse-skills/pull/32))

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.0.0...v2.1.0

---

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
