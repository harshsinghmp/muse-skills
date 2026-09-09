# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added

- **Persistent Evidence Tracking (`evidence-ledger` v2.0.0)**: reworked from a one-shot claim auditor into a persistent per-project evidence system for multi-client agency workflows — an append-only `evidence-ledger.md` per project in `.agents/context/` tracking four entry categories (DECISION with options considered and evidence trail, COMMITMENT with deadline and delivery proof, CLAIM with verification receipts, STATUS with blocker tracking), a nine-state status lifecycle (`ACTIVE`/`VERIFIED`/`FULFILLED`/`PROMISED`/`OVERDUE`/`STALE`/`SUPERSEDED`/`QUARANTINED`/`REDACTED`), and six `/evidence` commands: `onboard` (mines `.agents/context/` files into a starter ledger with `[IMPORTED]` provenance), `status` (regenerated dashboard, health score, staleness sweep), `decide` (decision records with secretary gating on high-stakes), `commit` (client promises auto-flagged `OVERDUE`), `audit` (the original v1.x claim verification gate, now feeding the ledger and triaging quarantine via `dead-letter`), and `brief` (context-switch briefing with `context-anchor` parking and `handoff` dispatch). Ships a canonical entry schema ([evidence-entry-schema.md](evidence-ledger/references/evidence-entry-schema.md)), automatic staleness rules ([staleness-rules.md](evidence-ledger/references/staleness-rules.md)), a full skill-orchestration map ([skill-orchestration.md](evidence-ledger/references/skill-orchestration.md)), and worked ledger + brief examples.
- **Artifacts Rule Codified in the DOX Engine (ai-ready v1.3.0, updatedocs v2.2.0, new-project v2.5.0)**: research corpora, planning docs, and working notes now have a declared home — `.agents/artifacts/<topic>/` — enforced across all four DOX layers instead of relying on convention inference. The scaffold deploys a contract stub (`ai-ready/templates/.agents/artifacts/README.md`: subfolder-per-topic, dated report files, method headers on research receipts, promotion path artifact → distilled finding → `decisions.md`/`.agents/context/`, local-only and disposable at project close); both AGENTS.md routers state the rule (repo router gains an artifacts line; the 50-line template amends Invariant 8 without breaching the rail); `ai-ready` audits it as **asset 13** (artifacts are contained + zero research litter in the tracked tree), lifting the suite to 13/13; and `updatedocs` classifies `.agents/artifacts/**` as **`DO NOT TOUCH`** — session-owned working state, mirroring the `.memory/` no-touch boundary.
- **Mode-Router UI Engine (`refactor-ui` v1.1.0)**: six quick-reference modes — `review` (default; verdict + severity table, no edits), `audit` (scripted anti-pattern + WCAG 2.2 AA scan, scored Block/Approve report artifact), `improve` (the 5-step refactor), `sweep` (multi-page consistency matrix with batched fixes), `tokens` (extract-and-centralize; pixels don't move), and `polish` (launch-readiness drift triage) — each a scoped contract in the new [modes.md](refactor-ui/references/modes.md) so agents load only what the running mode needs.
- **Modern-Techniques Layer (`refactor-ui` v1.1.0)**: [modern-techniques.md](refactor-ui/references/modern-techniques.md) distills a 127-source agent-skill corpus (deduplicated, boilerplate-stripped, deep-read) into rules composing with the baseline heuristics — concentric radius law (`inner = outer − padding`), 2× grouping ratio (space before surfaces before lines), container-query doctrine (components adapt to their container; logical properties; safe areas; 200% zoom), modern typography mechanics (60–75ch measure, line-height by role, size-specific tracking, tabular-nums, 16px mobile inputs, weight floors), named z-scale tokens, dark-mode surface ladder, light/dark theme parity, and the static-cue rule that routes all motion choreography to the `animate` skill.
- **Proof-Gated Findings & Honest Verification (`refactor-ui` v1.1.0)**: a finding requires Contract (binding rule) + Runtime (reaches the rendered surface) + Correction (one deterministic change); report format is a severity table (Severity/Location/Before/After/Why, one row per root cause across every location), verdict is **Block** when any HIGH or WCAG 2.2 AA text failure remains, and every check not actually run is declared `Not verified`.
- **Zero-Dependency Bun Tooling (`refactor-ui` v1.1.0)**: ported the Python scripts to TypeScript — [audit-ui.ts](refactor-ui/scripts/audit-ui.ts) (anti-pattern scanner, now also catching raw z-index values and `outline-none` without focus alternatives, with JSX-style `boxShadow`/`outline` handling and CI-ready exit codes) and [check-contrast.ts](refactor-ui/scripts/check-contrast.ts) (WCAG contrast with AA/AAA and large-text/UI thresholds); both verified against positive and negative fixtures; [public README](refactor-ui/README.md) rewritten for first-contact users (install → mode table → scripts → workflow → companion skills), plus a worked audit-mode report example.
- **Workstream Parking & Layering (`context-anchor` v1.1.0)**: anchors gain agency-scale operations — named client-workstream anchors (`.agents/anchors/<slug>.md`) with park / switch / list operations (`/park`, `/switch-task`), a consume protocol on resume (≤3-line re-entry block plus a branch+timestamp freshness gate), `workstream:`/`branch:`/`Client:`-codename headers with `resume by:` clauses, and a client-confidentiality guard (codenames under NDA, zero secrets, archive-or-wipe at project close). Includes the normative [layering protocol](context-anchor/references/layering-protocol.md) with `handoff` v2.1.0: anchors are the intra-session focus layer and fold into `HANDOFF.md` at session close; workspace entry reads `HANDOFF.md`, never a stale anchor — resolving the two-state-file overlap between the skills.
- **CI Gate & Complete Scaffold (`ai-ready` v1.2.0)**: `--fail-under N` exits `1` when the verified score falls below `N` for use as a merge gate; `--scaffold` now fills the gaps it always claimed to close — `.mcp.json` (least-privilege template), an `llms.txt` discovery skeleton, the `.github/` bundle (`dependabot.yml`, bug/feature issue templates, anti-slop PR template), and `.env.example` — never overwriting existing files, with an asset-aware tip distinguishing scaffolding-owned assets from team-authored ones (CI pipeline, changelog, contributing, durable docs).
- **GitHub Template Bundle (`ai-ready` v1.2.0)**: new `templates/github/` (dependabot, issue forms, PR template) plus `templates/env.example`, `templates/mcp.json.template`, and `templates/llms.txt` powering the expanded scaffold.
- **Self-Application (`ai-ready` v1.2.0 dogfood)**: ran the new scaffold on muse-skills itself — deployed `.mcp.json`, `.env.example`, and the `.github/` bundle (21 existing files preserved, zero clobber), and authored the repository's first CI pipeline (`.github/workflows/ci.yml` running `bun test` on PRs and pushes to `dev`/`main`); trimmed `AGENTS.md` from 102 to 41 lines as a lean DOX rail, relocating the full Git workflow & SemVer release lifecycle to `CONTRIBUTING.md`; the repository now passes its own Stage-0 Fast-Skip gate at 12/12.
- **Ambient Continuity (`handoff` v2.1.0)**: a third operating mode that makes continuation the default — a ≤30-line `.agents/artifacts/HANDOFF.md` live-state file (fixed name, overwritten on every real state change) written passively at checkpoints, decisions, incomplete turn-ends, and ending signals, and probed on every workspace entry so any new conversation or agent resumes prior work with no explicit handoff request.
- **State-Source Ladder (`handoff` v2.1.0)**: cold-start resolution order for prior state — live file → memory recall → `.agents/context/` project context → git forensics (with a mandatory write-back of HANDOFF.md after reconstruction) → honest cold-start declaration — plus hard token budgets (one-command entry probe, ≤5-line resumption block, on-demand detail).
- **Memory Hooks (`handoff` v2.1.0)**: durable decisions pushed through the runtime's memory-write tool API on dispatch/full flush and recall filtered to directory boundaries on entry; `.memory/**` remains untouched by hand (owned by `musememory`), with `updateagents` as the durable-truth fallback.
- **Ambient Contract References (`handoff` v2.1.0)**: new [Ambient Continuity & Live Handoff File Contract](handoff/references/ambient-handoff.md) (file schema, freshness rules, write triggers, memory protocol), a git-forensics recipe in the [resumption protocol](handoff/references/resumption-protocol.md), and a [sample live HANDOFF file](handoff/examples/sample-HANDOFF.md) example.

### Fixed

- **Asset Threshold Parity (`ai-ready` v1.2.0)**: the `AGENTS.md` router limit is now a single source of truth (`<50` lines) across the engine (`ai-ready.ts`), SKILL.md, and the Fast-Skip protocol — previously the script tested `≤60` while docs said `<50`; Stage-0 gate bash also dropped deprecated `[ x -o y ]` syntax and added the `.env.example` check.
- **Asset Detection Breadth (`ai-ready` v1.2.0)**: Asset 3 (Tool / MCP Config) now accepts `.claude/` and `.cursor/` alongside `.mcp.json` and `.gemini/` in the engine, the Stage-0 gate, and the 12-asset matrix, instead of scoring modern agent setups as absent.
- **Secret-Hygiene Check Completeness (`ai-ready` v1.2.0)**: Asset 12 now actually verifies `.env.example` exists (as the matrix always required) instead of checking only the `.gitignore` guard.
- **Handoff Version & Artifact Parity**: `skills.json` tracked `handoff` at 1.0.0 while SKILL.md was at 2.x; synced to 2.1.0, and the sample packet's dead-letter path moved from a `.claude/` route to the suite-standard `.agents/artifacts/` convention. Root README structure tree for `handoff/` now lists its `references/` and `examples/` files.

### Changed

- **Remediation Loop & Skill Routing (`audit` v1.1.0)**: upgraded the knowledge-hygiene audit from a findings-only scan to a closed loop — a 7-step pipeline with operating modes (Quick / Standard / Deep), a per-step progress reporting protocol, severity-routed remediation action classes (`AUTO-REPAIR` / `PROPOSE-DIFF` / `REPORT-ONLY` / `DEFER-ROUTE`), a re-verification delta table with explicit certification, and a companion-skill routing table (`updatedocs`, `updateagents`, `evidence-ledger`, `dead-letter`, `ai-ready`, `coach`, `periodic-retreat`) with fallbacks for absent companions.
- **Remediation Boundaries (`audit` v1.1.0)**: secret findings are now `PROPOSE-DIFF` plus a rotation recommendation instead of silent auto-masking; governance and historical documents receive findings, not edits; added the [Remediation Matrix & Routing Boundaries](audit/references/remediation-matrix.md) reference and four remediation boundary rules in [Knowledge Hygiene Rules](audit/references/hygiene-rules.md).
- **Artifact Standardization (`audit` v1.1.0)**: renamed the report artifact to `brain-audit-report.md` everywhere (the name the skill description always promised), added a persistent Deep-mode progress log in `.agents/artifacts/`, and rewrote the worked [sample report](audit/examples/sample-audit-report.md) with step ledger, delta table, and condensed Quick-mode form.

## [2.6.0] - 2026-09-08

### Added

- **Mode-Gated Pipeline (`updatedocs`)**: the 20-step synchronization pipeline is now gated by operating mode (Quick / Change / Release / Sprint / Full) selected at Step 1, with evidence-based mid-run escalation (Quick → Change) when a change touches a public contract and no silent de-escalation.
- **Mode-Scaled Reporting (`updatedocs`)**: Quick mode now emits a condensed single-document report while Change / Release / Sprint / Full emit the full governance report; worked examples for both formats live in `updatedocs/examples/sample-sync-report.md`.
- **Permission Levels (`updatedocs`)**: added `GOVERNED` (agent-context documents owned by `updateagents` — analyze and report only) and `HISTORICAL` (immutable released records) permission levels, plus an explicit ownership-class → permission-level mapping.

### Changed

- **Step-20 Audit Scoping (`updatedocs`)**: the 14-point pre-ship audit now runs per modified document; Quick mode audits only the documents actually edited.
- **Forge-Neutral Changelog URLs (`updatedocs`)**: PR attribution links and Full Changelog compare URLs now derive from the repository's canonical `origin` remote instead of a hardcoded host, with omit-rather-than-fabricate guidance for forges without native compare URLs.
- **Conditional Session Logs (`updatedocs`)**: the SESSION LOG document class now appends verified entries only when a project explicitly maintains a change ledger; otherwise it is left untouched.
- **Companion Handoff Fallbacks (`updatedocs`)**: `updateagents` and `musememory` handoffs now state the fallback when the companion is absent — `musememory` is a runtime system, not a suite skill, so durable findings are reported in the output instead of written to `.memory/`.
- **Branding Neutralization (`updatedocs`)**: removed the "Vibeguard" name from the secret-scan protocol and audit checklist entries.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.5.1...v2.6.0

## [2.5.1] - 2026-09-08

### Changed

- **Official CMS Setup References (`new-project`)**: rewrote the post-scaffold setup references to follow each vendor's official quick start (Tina via `create-tina-app`, Keystatic via `npm create @keystatic@latest`, Emdash setup wizard with passkey registration, Decap, Keystone, Sanity, Strapi, Medusa `create-medusa-app`, Vendure, Payload, Neon, and Supabase), removed the never-implemented `sitepins` preset and `pagescms` CMS from docs and the flag contract, and corrected the stale `--preset=edge` composition (Emdash, not SitePins).

### Fixed

- **Puck Package Migration (`new-project`)**: renamed the visual builder dependency and all generated imports from `@measured/puck` to the official `@puckeditor/core` scope (`^0.23.0`), and the provisioner now prints the official setup procedure for `tina`/`decap`/`keystone`/`sanity`/`strapi` selections instead of silently no-op.
- **Client-Intake Parity (`new-project`)**: README no longer claims `Intake/`/`Onboarding/` mirrors or an engine-generated `start-here.md` — the engine writes one canonical `Client-Intake/00-Intake-Brief.md` and the AI agent produces the docs after intake.
- **DOX Governance Container**: repo `.agents/` container retrofitted to the 9-folder Progressive Disclosure DOX architecture with the 13 modular standards synced from the `ai-ready` template canon; `AGENTS.md` converted to the lean DOX rail with project identity restored.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.5.0...v2.5.1

## [2.5.0] - 2026-09-07

### Added

- **Client-Intake Suite (`new-project`)** ([#61](https://github.com/harshsinghmp/muse-skills/pull/61)): 4-pillar brand and client intake suite (`01-Brand`, `02-Business`, `03-Offerings`, `04-Technical-Intake`) generated into every new project, with an empathetic `start-here.md` developer handbook.
- **No-Cache Upstream Sync** ([#60](https://github.com/harshsinghmp/muse-skills/pull/60)): `--no-cache` fetch mode for the brand guardian onboarding flow.
- **Aria Builder Engine Platform** ([#58](https://github.com/harshsinghmp/muse-skills/pull/58)): complete Vue visual block studio provisioning with server actions and `/admin` routing.

### Changed

- **Client-Intake Folder Naming** ([#65](https://github.com/harshsinghmp/muse-skills/pull/65)): The intake gate now writes to `Client-Intake/` as the canonical primary folder and mirrors the full suite to `Intake/` and `Onboarding/` for backward compatibility. Legacy `03-Menu` duplicate dropped; `03-Offerings` is canonical.
- **Fluid Token Architecture** ([#65](https://github.com/harshsinghmp/muse-skills/pull/65)): spacing and sizing tokens resolve through semantic `--space-*` clamp() sources instead of duplicated values, keeping generated CSS free of `px` in all fluid contexts (viewport ranges expressed in `rem`).
- **37 OKLCH Palettes & Simplified Setup** ([#64](https://github.com/harshsinghmp/muse-skills/pull/64)): progressive 5-step decision pipeline, 37 official OKLCH palettes from oklch.fyi, project-scoped `oklch-skill` provisioning, and simplified Astro/HTML/Next.js variant selection.

### Fixed

- **Emdash Astro Integration** ([#63](https://github.com/harshsinghmp/muse-skills/pull/63)): configured the official Emdash Astro integration in the edge CMS provisioning path.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.4.1...v2.5.0
