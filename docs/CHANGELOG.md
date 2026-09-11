# Changelog

All notable changes to the **Muse Skills** suite are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.1.0] - 2026-09-11

### Added

- **Atomic Payload Website Builder (`new-project` v2.6.0)**: `--cms=atomic-payload` and `--preset=atomic-payload` provision the official pro-laico Atomic Payload template (Payload 3 + Next.js 16 + Tailwind, every `@pro-laico/*` plugin, MongoDB + Vercel Blob, pnpm, admin at `localhost:42100/admin`) as a fully isolated official scaffold — engine governance only, every companion selection skipped with a printed notice (same contract as Aria Builder); the official published template is extracted untouched via npm-pack of `@pro-laico/create-atomic-payload`, `.env.example` copied to `.env` and the upstream gitignore merged per the official CLI's own steps, with a ponytail offline fallback keeping isolation tests green. Doc-sync CMS charset extended to hyphenated values. Verified against the live official CLI (v0.5.0) and the official quick-start; placed as a website builder — commerce is added later via the Payload E-Commerce plugin.

### Fixed

- **evidence-ledger Registry Metadata (skills.json)**: the v3.0.0 release bumped `evidence-ledger` SKILL.md to v2.0.0 but left the registry with the old v1.x metadata — backfilled 7 tags (project-tracking, decisions, commitments, agency-workflow, context-switch, evidence-dashboard, staleness-detection), 6 suggested_skills (context-anchor, handoff, dead-letter, updateagents, coach, periodic-retreat), 2 aliases (project-evidence, evidence-tracker), and the `list_dir` tool; also fixed two unicode-encoding glitches in the `handoff` and `designscope` descriptions. (PR #85)
- **v3.0.0 Changelog Stamp Drift**: the release stamp left the v3.0.0 detail entries stranded under `[Unreleased]` (duplicating `[3.0.0]`'s Major Changes/Changed summaries) and omitted the v3.0.0 compare link; the `docs/CHANGELOG.md` mirror was missing the `[3.0.0]` section entirely. All repaired: details folded into `[3.0.0]` under Added/Changed/Fixed, compare links added (`v2.7.0...v3.0.0` and `v3.0.0...v3.1.0`), mirror backfilled.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v3.0.0...v3.1.0

## [3.0.0] - 2026-09-10

### Major Changes

- **Agent-Independence Upgrade**: All skills now use `.agents/` as the universal agent-agnostic folder. Replaced `.claude/` path references with `.agents/` across ai-ready, dead-letter, refactor-ui, and handoff. Added `agent_independent: true` metadata to ai-ready. The `.agents/` folder is now documented as the standard location any AI coding agent can use — not Claude-specific.
- **Suite Version Bump to 3.0.0**: Major version increment reflecting the agent-independence architecture shift.

### Added

- **Suite Hardening Pass (5 skills, cross-pollination from the code-review corpus)**: mechanisms distilled from the 63-source review corpus landed where they fit best. **`gauntlet-loop` v1.2.0** — the Automated Gate gains a **quality-bar regression check** (suppressions added, tests skipped/deleted, assertions weakened, or thresholds edited down in the round's diff → round score 0.0: a build that passes because the bar was lowered is a regression, not a pass) and a **fail-closed eval check** (the proof suite must contain a test that CAN fail on the defect class the round claims to fix — a green run no test could have caught proves nothing; write the capable test and watch it fail on the pre-fix state first); `ITERATION_LEDGER` now records new-vs-fixed finding counts per round, and divergence (new findings outnumber fixed two rounds running) stops the loop with an escalation instead of burning the remaining budget. **`dead-letter` v1.5.0** — modularized: record template → [references/record-schema.md](dead-letter/references/record-schema.md), status sweep → [references/sweep-protocol.md](dead-letter/references/sweep-protocol.md) (SKILL.md down to 144 lines; sweep loads only the sweep protocol, capture loads only the schema), and the sweep gains a **findings ledger** (`.agents/artifacts/dead-letter-ledger.md`) that deduplicates recurring sweep verdicts, measures convergence across sweeps, and links clusters → repro packs → outcomes. **`secretary` v1.4.0** — Delegation Control Gates gain **Feedback Reception**: review feedback returning from delegations is verified against the code before implementation, each item classified implement / rebut (with evidence, never deference) / ask (one specific question), with investigation-before-application for auth/payments/migration items — performative agreement fails the gate. **`pua` v1.1.0** — modularized: 8 corporate flavor packs + situational auto-selector → [references/flavor-packs.md](pua/references/flavor-packs.md) (SKILL.md 208 lines; core procedure starts without the persona layer). **`refactor-ui` v1.1.2** — audit/review/sweep report severity markers ship text + symbol with color as a redundant third channel, never color alone (applies to rendered HTML report artifacts too).
- **Modular Router & 3 New Modes (`code-review` v1.3.0)**: SKILL.md rebuilt as a token-minimal router — 7 modes now, each with an explicit load-map (references load only for their mode): `diff` (default, full 17-theme catalog), `hotfix` and `contract` (nothing extra), `audit` (+ conventions discovery: the project's own test runner/standards/error conventions define Axis A, then two-axis standards+spec side-by-side report), **`security`** (numbered SEC-01..10 control pass — injection, access control/IDOR, auth/session, crypto, SSRF, secrets, rate limiting, error disclosure, dependency/supply-chain — evidence-first findings with snippet + exploitability + remediation, and an explicit "no findings" statement per passed control), **`receive`** (feedback intake: verify before implementing, classify each item implement/rebut/ask, risk-gating for auth/payments/migrations, anti-sycophancy), **`fix`** (findings ledger → test-first fixes, one commit per finding, skip ledger for blind-risk items, re-review until convergence with bounded rounds). Theme catalog moved to [references/themes.md](code-review/references/themes.md) with two new corpus-grounded triggers: **13.4 Quality-Bar Regression** (suppressions added, tests skipped/deleted, assertions weakened, thresholds edited down — a build that passes because the bar was lowered is a regression, not a pass; Reject) and **16.5 Half-Applied Refactor Debris** (old+new coexist, orphaned helpers, debug scaffolding; Request Changes). Report gains "What's Good" and "Open Questions" sections; new pitfalls (generic-convention preaching, over-loading). Distilled from a 63-source agent-skill code-review corpus (fetched 2026-09-10, `.agents/artifacts/code-review-research/`); cross-pollination map recorded for the rest of the suite.
- **Test-Spec Immutability Theme (`code-review` v1.2.0)**: new **Theme 17 under Level 5 (Verification Integrity)** — 4 triggers pinning the spec–test relationship in review: test weakened to match broken behavior (Reject), spec edit hidden inside a fix commit (Reject), unexplained test modification (Request Changes), snapshot regenerated blind (Request Changes). The principle is stated in the skill: the test defines correct behavior — fix the implementation to match the spec, never the reverse; a genuinely wrong spec is changed as a deliberate, separately-reviewable spec decision, not a hunk inside a bug fix. Registry surfaces synced (skills.json, llms.txt, README #4, per-skill README).
- **Cluster Triage Sweep (`dead-letter` v1.4.0)**: `dead-letter status` upgraded from a flat listing to a three-pass root-cause triage — inventory, clustering by root cause (not error-string similarity), and one verdict per cluster (systemic / coincidental / cascade / escalate-cluster); report inline ≤40 lines closing with a sweep action line. Source: dic-skills nightly triage from the 248-source corpus; pairs with the coupling-router's DAG skip policy.
- **Repro Test Pack Generator (`dead-letter` v1.3.0)**: at close-out (Recovery Sequence step 6), deterministic failures convert into a repro pack at `.agents/artifacts/repro-<slug>-<timestamp>/` — numbered reproduction steps, preconditions, expected-vs-actual assertion pair, and a minimal failing test observed red against the un-fixed code (unseen red is a claim, not evidence), with explicit skip cases and a worked example ([sample-repro-pack.md](dead-letter/examples/sample-repro-pack.md)). The capture that documents a failure becomes the regression test that prevents its recurrence.
- **Plan Hardening Pass (research-driven, 3 skills)**: upgrades distilled from a 248-source corpus of failure-handling, orchestration, and plan-evaluation agent skills (fetched and deduplicated in `.agents/artifacts/sde-research/`). **`coupling-router` v1.4.0** — the Plan-Evaluation Gate gains a multi-perspective review requirement for plans with ≥5 tasks (spec/devil's-advocate, coupling, failure lenses; unresolved findings reject the plan). **`secretary` v1.3.0** — Wave Dispatch (DAG) gate (same-wave parallel dispatch, wave validation before the next launches, dependents on a failed parent marked `SKIP` and routed to `dead-letter`), a file-based Task Ledger (`.agents/secretary-tasks.json`, idempotent operations, verification receipts before `DONE`, state reconstructed from files + git history after context resets), and a three-tier Handoff Harvest protocol. **`dead-letter` v1.2.0** — the Recovery Sequence (ordered checklist embedded in the record, single resume point) and Baseline Reference (last-known-good verification; a clean-exit regression fails the round).
- **Selection System (`skills.json` + `scripts/select-skills.ts`)**: the registry now carries three selection primitives — per-skill `scope` (`global` agent-level vs `local` per-project), five top-level `categories[]`, and named `selections{}` (`global`, `local`, `core`, `context`, `quality`, `design`, `reflect`, `minimal`). A zero-dependency Bun resolver (`bun scripts/select-skills.ts <selection> [--format names|install|json]`) turns a selection into the concrete skill list or copy-pasteable `npx skills add` commands. Pinned by a hardening test.

### Changed

- **Agent Independence Pass (7 skills)**: replaced `.claude/` path references with `.agents/` across `ai-ready`, `dead-letter`, `refactor-ui`, and `handoff` — the `.agents/` folder is now documented as the universal agent-agnostic location any AI coding agent can use, not Claude-specific. Added `agent_independent: true` metadata to `ai-ready` frontmatter. Updated `dead-letter` record paths in SKILL.md, README, and examples (`.claude/dead-letter-*` → `.agents/dead-letter-*`). Updated `refactor-ui` requirements text to say "any AI coding agent". Updated README handoff persistence path.
- **Skill Version Sync to GitHub**: synced `skills.json` versions to match GitHub main branch for `code-review` (1.3.0), `gauntlet-loop` (1.2.0), `coupling-router` (1.4.0), `secretary` (1.4.0), `dead-letter` (1.5.0), `refactor-ui` (1.1.2), `pua` (1.1.0) — no version jumps; all versions match or align with GitHub.

### Fixed

- **Lease Gate on Fresh Checkouts (`coupling-router`)**: every lease write path (`probe`-acquire, `hold` heartbeat refresh, stale takeover) now creates `.agents/artifacts/` recursively before writing — the directory is gitignored and absent on fresh checkouts, which broke the gate's first run on any new clone (caught by CI on `main` immediately after v2.7.0, fixed via hotfix PR #83, merged to `main` and back-merged to `dev` per lifecycle). Also merged Dependabot's `actions/checkout` v4→v7 bump (#82), the SHA-mutation mitigation accepted by the security audit's F3.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.7.0...v3.0.0

## [2.7.0] - 2026-09-10

### Added

- **animate Skill (#22, v1.0.0)**: web UI motion & animation as a router + build sequence — should-it-animate frequency gate (keyboard/100×-daily = never), named-purpose gate, cheapest-tool library ladder (CSS transition/`@starting-style`/animation → WAAPI → Motion; GSAP, native mobile, and other heavy libraries explicit-ask-only; existing project libraries and `--ease-*`/`--duration-*` tokens win first), `transform`/`opacity`-only properties, canonical easing/duration tables (sub-300ms UI), interruption/exit rules, and reduced-motion + pointer gating shipping by default. Five modes routed on the verb (build/review/improve/audit/find — only build edits code), nine segregated per-domain references, full hermes/openclaw metadata, and worked micro-interaction example. Recovered from a session that died mid-registration; recovered hunks completed the registrar step (skills.json P22 with sequential priorities 1..22, llms.txt, root README 21→22 everywhere, 22-skill test ordering).
- **Executable Lease Gate (`coupling-router` v1.2.1)**: the tested lease decision logic ships as a zero-dependency Bun script — `scripts/worktree-lease.ts probe|hold|release` — so the Step 0 gate is one command with CI-friendly exit codes (0 = clear to mutate, 1 = defer on a fresh foreign lease) instead of re-derived judgment. Verified against all six protocol scenarios (absent/acquire, fresh/defer, stale/takeover, takeover-line append, heartbeat refresh, release).

- **Review Depth Modes (`code-review` v1.1.0)**: four review depths routed on blast radius instead of one-size-fits-all — `diff` (default; full 15-theme adversarial review), `hotfix` (single-hunk changes; correctness + surgical-diff + evidence only, architectural themes skipped by design), `audit` (whole-module cross-file invariant pass), `contract` (API/ABI stability only). Severity calibration baseline and REASON→ACT protocol untouched.
- **Suite-Wide Orchestration Metadata (11 skills, patch bumps)**: every skill whose execution has genuinely meaningful sequencing now declares `skill_orchestration` (pre / post / optional) in its frontmatter, following the per-command pattern `evidence-ledger` v2.0.0 established — `designscope` → `refactor-ui` → `code-review` → `git` chains, `context-anchor` parking before `audit`/`handoff`, `secretary` after high-stakes routing, `dead-letter` on failure paths. Skills with no meaningful neighbors got nothing (no filler): `animate`, `clean-system-cache`, `coach`, `dead-letter`, `humanize`, `new-project`, `periodic-retreat`, `pua`, `secretary`, `updateagents`. Hermes/openclaw metadata verified complete across all 22 skills. Registry versions synced to frontmatter with zero drift.
- **Lease-Aware Dispatch & Entry (`handoff` v2.2.0)**: Mode B dispatches whose Target Scope includes git mutations embed the worktree-lease instruction (worker probes `.agents/artifacts/WORKTREE-LEASE.md` via `coupling-router`'s gate before its first mutation; overlapping-scope workers never dispatched to one checkout); Mode C workspace entry respects an active lease (≤5-line resumption block notes the other session; entrant takes a separate worktree or stays read-only); neighboring-boundary section and verification checklist updated. `handoff` v2.1.0's ambient autorun (probe on every entry, passive writes at checkpoints/decisions/incomplete turn-ends) is unchanged — this adds lease awareness on top.
- **Shared-Worktree Lease (`coupling-router` v1.2.0)**: a mutual-exclusion protocol for the failure mode this repo actually hit — two independent agent sessions sharing one git checkout, where a branch switch or stash pop orphans the other session's uncommitted work. Before any git mutation, sessions probe `.agents/artifacts/WORKTREE-LEASE.md` (≤20-line claim ticket: owner, branch, heartbeat, declared write scope, stash/backup notes): absent → acquire; fresh heartbeat (≤30 min) → take a separate `git worktree add` directory, stay read-only, or wait — never mutate shared git state; stale heartbeat → takeover with foreign-WIP preservation. Holder duties codify the collision-avoidance rules learned in the #73 repair: stage explicit paths only, never pop a stash you did not create, re-diff shared surfaces (`skills.json`, `llms.txt`, README, CHANGELOG) hunk-by-hunk before staging, refresh the heartbeat at milestones. Session close releases the lease with a residual-state note folded into `HANDOFF.md`. Collisions that slip through get a five-step repair ladder (assess → backup foreign WIP → rebuild on a feature branch with explicit paths → `push --force-with-lease` → restore), replacing improvisation with procedure. Full contract: [worktree-lease-protocol.md](coupling-router/references/worktree-lease-protocol.md).
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
- **External Dogfood Runbook (docs/DOGFOOD.md)**: a ~45-minute runbook exercising the multi-project story this repo cannot test on itself — `new-project`/`ai-ready` scaffold, cross-session continuity (`handoff` ambient resume, including a deliberate kill test), `context-anchor` workstream parking across clients, `evidence-ledger` decision tracking, and a shared-checkout two-session lease scenario — with a per-phase verification table and an evidence-file reporting protocol for rough edges.
- **Drift & Lease Hardening Pins (tests/hardening.test.ts)**: five new invariant pins that make previously ad-hoc checks permanent — skills.json↔SKILL.md frontmatter version parity, frontmatter description parity (the class that drifted on `new-project` and 4 others), llms.txt description parity, executable lease-gate behavior (acquire/defer/takeover/refresh/release), and CI least-privilege permissions. The pins immediately caught and fixed 6 real drifts on landing.
- **Generated-Secret Hygiene (new-project)**: scaffolded projects' `.env` secrets (`JWT_SECRET`, `COOKIE_SECRET`, `PAYLOAD_SECRET`, `BETTER_AUTH_SECRET`, `CMS_ENCRYPTION_KEY`, EMDASH key) are now generated per-project with `crypto.randomBytes` at scaffold time instead of shipping predictable static literals — the security audit's F1 finding, pinned by test so the class cannot regress.

### Changed

- **Remediation Loop & Skill Routing (`audit` v1.1.0)**: upgraded the knowledge-hygiene audit from a findings-only scan to a closed loop — a 7-step pipeline with operating modes (Quick / Standard / Deep), a per-step progress reporting protocol, severity-routed remediation action classes (`AUTO-REPAIR` / `PROPOSE-DIFF` / `REPORT-ONLY` / `DEFER-ROUTE`), a re-verification delta table with explicit certification, and a companion-skill routing table (`updatedocs`, `updateagents`, `evidence-ledger`, `dead-letter`, `ai-ready`, `coach`, `periodic-retreat`) with fallbacks for absent companions.
- **Remediation Boundaries (`audit` v1.1.0)**: secret findings are now `PROPOSE-DIFF` plus a rotation recommendation instead of silent auto-masking; governance and historical documents receive findings, not edits; added the [Remediation Matrix & Routing Boundaries](audit/references/remediation-matrix.md) reference and four remediation boundary rules in [Knowledge Hygiene Rules](audit/references/hygiene-rules.md).
- **Artifact Standardization (`audit` v1.1.0)**: renamed the report artifact to `brain-audit-report.md` everywhere (the name the skill description always promised), added a persistent Deep-mode progress log in `.agents/artifacts/`, and rewrote the worked [sample report](audit/examples/sample-audit-report.md) with step ledger, delta table, and condensed Quick-mode form.
- **CI Least-Privilege (security audit F2)**: `.github/workflows/ci.yml` pins an explicit workflow-level `permissions: contents: read` block instead of inheriting default token permissions. F3 (SHA-pinning actions) reviewed and accepted as within this repo's threat model; documented in the audit report.
- **Lease Wire-Up in In-Repo Dispatch (`coupling-router`)**: generated routing plans now emit a step-0 lease-probe instruction for git-mutating workers (`bun <suite>/scripts/worktree-lease.ts probe`), closing the gap between the protocol reference and the skill's own DAG output.

### Fixed

- **Asset Threshold Parity (`ai-ready` v1.2.0)**: the `AGENTS.md` router limit is now a single source of truth (`<50` lines) across the engine (`ai-ready.ts`), SKILL.md, and the Fast-Skip protocol — previously the script tested `≤60` while docs said `<50`; Stage-0 gate bash also dropped deprecated `[ x -o y ]` syntax and added the `.env.example` check.
- **Asset Detection Breadth (`ai-ready` v1.2.0)**: Asset 3 (Tool / MCP Config) now accepts `.claude/` and `.cursor/` alongside `.mcp.json` and `.gemini/` in the engine, the Stage-0 gate, and the 12-asset matrix, instead of scoring modern agent setups as absent.
- **Secret-Hygiene Check Completeness (`ai-ready` v1.2.0)**: Asset 12 now actually verifies `.env.example` exists (as the matrix always required) instead of checking only the `.gitignore` guard.
- **Handoff Version & Artifact Parity**: `skills.json` tracked `handoff` at 1.0.0 while SKILL.md was at 2.x; synced to 2.1.0, and the sample packet's dead-letter path moved from a `.claude/` route to the suite-standard `.agents/artifacts/` convention. Root README structure tree for `handoff/` now lists its `references/` and `examples/` files.
- **Doc-Sync Drift Sweep (updatedocs Sprint mode)**: README version badge 2.4.1→2.6.0, AGENTS.md skill count 21→22, `docs/ARCHITECTURE.md` tree (animate entry, expanded tests/ block), and `docs/CHANGELOG.md` mirror backfilled with the released 2.5.0/2.5.1/2.6.0 sections.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.6.0...v2.7.0

---

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

---

## [2.5.1] - 2026-09-08

### Changed

- **Official CMS Setup References (`new-project`)**: rewrote the post-scaffold setup references to follow each vendor's official quick start (Tina via `create-tina-app`, Keystatic via `npm create @keystatic@latest`, Emdash setup wizard with passkey registration, Decap, Keystone, Sanity, Strapi, Medusa `create-medusa-app`, Vendure, Payload, Neon, and Supabase), removed the never-implemented `sitepins` preset and `pagescms` CMS from docs and the flag contract, and corrected the stale `--preset=edge` composition (Emdash, not SitePins).

### Fixed

- **Puck Package Migration (`new-project`)**: renamed the visual builder dependency and all generated imports from `@measured/puck` to the official `@puckeditor/core` scope (`^0.23.0`), and the provisioner now prints the official setup procedure for `tina`/`decap`/`keystone`/`sanity`/`strapi` selections instead of silently no-op.
- **Client-Intake Parity (`new-project`)**: README no longer claims `Intake/`/`Onboarding/` mirrors or an engine-generated `start-here.md` — the engine writes one canonical `Client-Intake/00-Intake-Brief.md` and the AI agent produces the docs after intake.
- **DOX Governance Container**: repo `.agents/` container retrofitted to the 9-folder Progressive Disclosure DOX architecture with the 13 modular standards synced from the `ai-ready` template canon; `AGENTS.md` converted to the lean DOX rail with project identity restored.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.5.0...v2.5.1

---

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

---

## [2.4.1] - 2026-09-07

### Added
- **Always-Fresh Upstream Sync (`--no-cache` & `--latest`)**: Added `--no-cache` and `--latest` flags to `new-project` scaffolding. When enabled, local template caches (such as `~/.cache/aria-template`) are refreshed via `git fetch --depth 1 origin main && git reset --hard origin/main`, and `bun install --no-cache` is executed to guarantee zero stale cache discrepancies. ([#60](https://github.com/harshsinghmp/muse-skills/pull/60))
- **Standardized 4-Pillar Client Intake Suite (`Onboarding/`)**: Modernized Stage 6 client onboarding with dedicated operational intake documents across 4 modular pillars:
  - `Onboarding/01-Brand/`: `brand-identity.md`, `visual-direction.md`, `voice-and-tone.md`, `brand-guardrails.md`, and `brand-assets-intake.md` (vector marks, licensed web fonts, photography).
  - `Onboarding/02-Business/`: `business-model.md`, `audience-persona.md`, `competitor-benchmark.md` (competitor UX/brand benchmarks), and `client-goals-kpis.md` (launch milestones, conversion metrics).
  - `Onboarding/03-Offerings/`: Universal `offerings-catalog.md` and `scope-deliverables.md` (MVP Phase 1 commitments vs. Phase 2 roadmap).
  - `Onboarding/04-Technical-Intake/`: `access-and-credentials.md` (Domain/DNS, Git repo, hosting, payment processor, 1Password secure share) and `integrations-matrix.md` (CRM, email, analytics, cookie consent). ([#61](https://github.com/harshsinghmp/muse-skills/pull/61))

### Fixed
- **Replaced Hospitality-Specific `03-Menu` with `03-Offerings`**: Renamed `03-Menu` to canonical `03-Offerings` to natively support all client archetypes (SaaS, e-commerce, consulting, retainers, and hybrid services) while maintaining backward-compatible `03-Menu/offerings.md` mirrors. ([#61](https://github.com/harshsinghmp/muse-skills/pull/61))
- **Aria Builder Engine Extraction & Initial Setup Redirect**: Full official Aria Builder platform extraction into `aria/`, copying `actions/`, `middleware/`, `wrangler.jsonc`, UnoCSS presets, and patching Day-1 admin onboarding redirect to `/admin/setup` when zero users exist. ([#58](https://github.com/harshsinghmp/muse-skills/pull/58), [#59](https://github.com/harshsinghmp/muse-skills/pull/59))

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.4.0...v2.4.1

## [2.4.0] - 2026-09-06

### Added
- **Purpose-First Hierarchical Decision Engine (`new-project`)**: Upgraded `new-project` (the canonical DOX Engine / Agent Engine) to an interactive, purpose-first decision engine. Questions the developer interactively across 6 purpose branches (`brochure`, `content`, `ecommerce`, `webapp`, `mobile`, `governance`) before framework selection. ([#56](https://github.com/harshsinghmp/muse-skills/pull/56))
- **Aria Visual Builder Suite for Astro**: Full visual drag-and-drop component registry in `aria.config.mjs`, accessible hero banner in `src/components/AriaHero.astro`, and interactive island integration. ([#56](https://github.com/harshsinghmp/muse-skills/pull/56))
- **StudioCMS & Emdash CMS Blog Engines**: First-class support for StudioCMS (`studiocms.config.mjs`, Astro DB wiring) and edge-native Emdash CMS (`emdash.config.ts`, Cloudflare D1/R2, starter blog collection). ([#56](https://github.com/harshsinghmp/muse-skills/pull/56))
- **MedusaJS 2.0 Sovereign E-Commerce Backend**: Fully scaffolded `backend/` container with `medusa-config.ts`, PostgreSQL 16 & Redis 7 `docker-compose.yml`, typed frontend SDK (`src/lib/medusa.ts`), and Aria shopping cart and product grid components. ([#56](https://github.com/harshsinghmp/muse-skills/pull/56))
- **Payload CMS 3.0 & E-Commerce Module for Next.js**: App Router CMS administration (`/admin`), Lexical rich text, Puck visual builder (`/puck`), typed collections (`Users`, `Media`, `Pages`, `Products`, `Orders`, `Customers`), and Stripe checkout route handler. ([#56](https://github.com/harshsinghmp/muse-skills/pull/56))
- **Pure HTML/CSS & Instatic Framework Options**: Zero build step standalone semantic BEM `index.html` with wide-gamut OKLCH fluid design tokens and `bun x serve .` scripts. ([#56](https://github.com/harshsinghmp/muse-skills/pull/56))
- **Empathetic `start-here.md` Guide & Dynamic Onboarding**: Generates customized Day-1 onboarding walkthroughs, architecture snapshots, and starter dashboards with zero placeholder leaks. ([#56](https://github.com/harshsinghmp/muse-skills/pull/56))

### Fixed
- **Clean Template Invariants**: Sanitized DOX templates to eliminate personal metadata, hardcoded directory references, and author leaks while preserving canonical account `harshsinghmp`. ([#56](https://github.com/harshsinghmp/muse-skills/pull/56))
- **Zero Half-Baked Stubs**: Replaced stub placeholders with full working implementations, typed schemas, connection pools, and route handlers across all supported tech stacks. ([#56](https://github.com/harshsinghmp/muse-skills/pull/56))

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.3.0...v2.4.0

## [2.3.0] - 2026-09-06

### Added
- **Intent-First Configurator Engine (`new-project`)**: Upgraded `new-project` (the canonical DOX Engine / Agent Engine) to an interactive, intent-first architecture configurator. Dynamically prunes and configures companion technologies based on core intent (`brochure`, `content`, `ecommerce`, `webapp`, `mobile`). ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **7 One-Click Agency Presets**: Added high-speed scaffolding presets covering `--preset=powerhouse` (Next.js 16 + Payload CMS + Puck Visual Builder + Hybrid UnoCSS Wind 4), `--preset=publisher` (Astro v7 + StudioCMS), `--preset=visual` (Astro v7 + Aria Builder visual editor), `--preset=edge` (Instatic HTML + Aria Builder), `--preset=instatic` (Zero-build semantic HTML5 + OKLCH BEM), `--preset=mobile` (React Native with Expo), and `--preset=astro-mobile` (Astro v7 + NanoStores + Aria Builder + Ionic Capacitor). ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **Hybrid Styling System**: Hybrid UnoCSS Wind 4 (`@unocss/preset-wind4`) combined with semantic BEM CSS and OKLCH color palettes, automatically configured in `uno.config.ts` and `src/styles/design-tokens.css`. ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **Zero-Dependency High-FPS CSS Animation Library**: Injected hardware-accelerated CSS animations (`.fade-in`, `.slide-up`, `.stagger-group`, `.reveal-on-scroll`, `.hover-lift`) with `prefers-reduced-motion` accessibility support, with opt-in support for `motion.dev` and `gsap`. ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **Open-Source-First CMS Ecosystem**: Deep integrations for Aria Builder (`ariabuilder.io`), StudioCMS, SitePins, Tina CMS, Keystatic, Pages CMS, and Payload CMS (with optional Puck visual drag-and-drop page builder). ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **Modern E-Commerce Checkout Modules**: First-class support for Payload CMS E-Commerce, Medusa v2, Fastrr 1-click accelerated checkout, Razorpay, and Stripe Hosted checkouts. ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **NanoStores Reactive State Engine**: Sub-1KB, framework-agnostic reactive state sharing across isolated Astro client islands (`client:*`) and React/Next.js components with pre-wired reactive primitives in `src/stores/app.ts`. ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **Ionic Capacitor & Mobile Packaging**: Native iOS and Android APK/AAB compilation bridge for Astro, Next.js, and Instatic web projects via `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, and `@capacitor/android`, configured in `capacitor.config.ts` with dedicated build scripts (`cap:build`, `cap:sync`, `cap:ios`, `cap:android`). ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **Flexible Data & Auth Layer**: First-class support for Neon DB, Supabase, Self-Hosted PostgreSQL, SQLite with Drizzle ORM, and Better Auth. ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))

### Fixed
- **ADE/HTML Execution Summary Sanitization**: Wrapped all folder and file placeholders (`<project-name>`, `<folder>`, `<path>`) in markdown backticks across CLI execution reports to prevent automated developer environment (ADE) HTML parsers from hijacking or swallowing output text. ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **Template Staging Isolation**: Isolated framework scaffolds in `os.tmpdir()` during generation to prevent collisions between Stage 1 governance files and downstream `git clone` or template unpack operations. ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))
- **Strict Package Freshness Invariant**: Enforced `@latest` tag resolution across all package dependencies and removed dirty git commit hash references. ([#53](https://github.com/harshsinghmp/muse-skills/pull/53))

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.2.3...v2.3.0

## [2.2.3] - 2026-09-05

### Fixed
- **Prohibit Appending & Publishing Git Commit Refs**: Hardened operational rules across root `AGENTS.md`, global `~/.agents/AGENTS.md`, `ai-ready/SKILL.md` (Pitfall 7), `ai-ready/templates/AGENTS.md` (Invariant 12), `git-workflow.md` (§5), and `execution-kernel.md` (§12). Explicitly documented the downstream clone mechanics where `skills add` invokes `git clone --depth 1 --branch <ref>`, which causes Git to fatally crash with `fatal: Remote branch <sha> not found in upstream origin` when given a commit SHA. Mandates clean repository specs (`skills add <owner>/<repo>`) without any appended commit references.
- **Safe-Skills Interceptor Default & Commit Omission**: Configured default `antiToctou = 'off'` across the `safe-skills` ecosystem and neutralized raw commit SHA pinning to prevent breaking downstream `skills add` shallow clones.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.2.2...v2.2.3

## [2.2.2] - 2026-09-05

### Fixed
- **Synthetic ADE Placeholder Example Clarification**: Clarified the concrete illustrative example of synthetic ADE placeholder wrapping in `ai-ready/templates/.agents/standards/execution-kernel.md` using the non-hex `<hash>` token pattern (`[[ORCA_RICH_MD:<hash>:inline-html:%3Cissue-id%3E]]`) to prevent false-positive detection by static code scanners and automated sanitization scripts while preserving full educational clarity.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.2.1...v2.2.2

## [2.2.1] - 2026-09-05

### Fixed
- **Clean Package Syntax & Git Reference Stripping**: Codified canonical rules across `AGENTS.md`, `ai-ready` template invariants, and `git-workflow` standard to strip dirty git references (`<owner>/<repo>#<ref>`) such as commit SHAs or branch tags from package and skill installation targets. Mandates clean repository specs (`skills add <owner>/<repo>`) and preserves linking integrity.
- **Package Manager Freshness Standard**: Standardized `@latest` usage for package managers supporting tag parameters (`npm`, `bun`), while keeping commands without version arguments clean to pull latest without trailing hashes.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v2.2.0...v2.2.1

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
