# Changelog

All notable changes to the **Muse Skills** suite are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [7.2.0] - 2026-10-03

### Added

- **GitHub Scaffolding, Instruction Migration & CLAUDE.md Shim (`updateagents` v2.3.0)** (#211): New `github-scaffold.ts` shared renderer for `CHANGELOG.md`, `.github/` community files (CONTRIBUTING, SECURITY, SUPPORT, CODE_OF_CONDUCT, GOVERNANCE, FAQ) and stack-detected workflow templates (Node/Bun, Python, Composer) that never emit passing placeholders and preserve user edits; `instruction-migration.ts` importing legacy agent instructions into `.agents/context/imported-agent-instructions.md` with recorded source scopes; `agents-template.ts` extracted AGENTS.md renderer; CLAUDE.md shim template containing only `@AGENTS.md`; `--github` / `--no-github` / `--confirm-remove-github-workflows` flags on `updateagents` and `new-project`; restored Two-Tier Identity & Context Resolution Cascade (with `vision.md`) in the AGENTS.md template.

### Fixed

- **CI Hermeticity for `new-project` Identity Gate** (#211): `agent-engine` tests now pass `--agent-name` explicitly instead of relying on the developer machine's `~/.agents/identity/assistant.md`; CI test job clones with `fetch-depth: 0` so `pr-convention-miner` analyzes real history instead of a single shallow merge ref; spawn assertions attach child `stderr` so CI failures surface the underlying error.
- **`docs/CHANGELOG.md` Mirror Resync** (#211): documentation changelog backfilled 3.2.0 → 7.1.0 from the canonical root changelog while retaining the docs-only 1.0.0 – 2.4.1 history (68 sections, zero duplicates).

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.1.0...v7.2.0

---

## [7.1.0] - 2026-10-01

### Added

- **Tri-Vector Autonomous Agency Coach (`coach`)** (#210): Structured daily standups, async scope checks, client digest automation, and founder vitality audits across Team, Client, and Founder vectors with five dedicated reference playbooks (`team.md`, `client.md`, `founder.md`, `audit.md`, `effort-rubric.md`) and executable CLI engine (`coach.ts`).
- **Toxic Loop Circuit Breaker (`dead-letter`)** (#206): Automatic circuit-trip on ≥2 identical failure signatures, Precondition Delta gate, Vibeguard zero-credential sanitization, and atomic POSIX rename writes for corrupted-state protection (`circuit-breaker.md`).
- **Receipt-or-Rejection Gate (`pua`)** (#207): Verbatim CLI receipt requirement, Ghost File Probe (`fs.existsSync`), Churn-to-Signal ratio guardrail (≤ 1.5; > 3.0 = halt), and banned sycophancy phrase scan with 3-line diagnosis format (`receipt-verification.md`).
- **Automated Purge Register & Founder Vitality ADE (`periodic-retreat` v1.1.0)** (#208): 4-phase strategic retreat facilitation — forensic retrospective with git churn heatmap, `bunx knip` dead-export purge register, Automate/Delegate/Eliminate vitality framework, and binary OKR contracts with Monday Launchpad Packet (`retreat-protocol.md`).
- **AST Code-Shield Pipeline & Cadence Burstiness (`humanize` v1.1.0)** (#209): 3-pass stash pipeline (fenced code, inline backticks, frontmatter, tables, URLs) preserving code blocks through humanization; cadence dispersion metric (σ ≥ 5.0); bullet density fence (≤ 40%); em-dash budget (≤ 1 per 500w); technical jargon whitelist (`ast-shield-and-cadence.md`).

### Fixed

- **Git Convention Miner Merge Commit Filter (`git`)**: Ignored topological merge commits (`--no-merges`) when mining repository commit message conventions in `pr-convention-miner.ts`.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.0.0...v7.1.0

---

## [7.0.0] - 2026-10-01

### Added

- **Autonomous Agent-to-Agent Negotiation & Concurrency Leases (`secretary` v1.8.0)** (#204): `acquireLease`, `releaseLease`, and `verifyHandoffPacket` primitives enabling zero-human multi-agent coordination with SHA-256 evidence approval gates and handoff verification receipts.
- **AEO 18-Token Quotability & AI Crawler Auditor (`seo` v1.3.0)** (#205): 18-token standalone quotability enforcement for AI-indexed headings, `robots.txt` crawler segregation auditor, and AEO content density gate.
- **Wave 2 Senior Auditor Engine (`code-review` v1.6.0)** (#202): Edge/SSR pitfall detection, React lifecycle dropper scanning, and `--audit-all` mode completing all 13 security controls.
- **PR Convention Miner & Guidelines Synthesizer (`git` v1.3.0)** (#203): Automated synthesis of repository PR conventions from git history into enforced commit guidelines (`pr-convention-miner.ts`).
- **Context Health Gauge & Task Stashing (`context-anchor` v1.4.0)** (#189): Task interruption stashing, real-time context budget metering, deadlock breaker engine, and observation masking.
- **Workerd Preview Containers (`devops` v1.2.0)** (#190): Cloudflare `workerd` isolated execution environment scaffolding for living deliverable review links.
- **Webhook Payload Byte-Size Limiter (`automation` v1.1.0)** (#194): Payload size validation and receiver guard for all webhook endpoints.
- **Canonical UTM Builder & PII Scrubber (`analytics` v1.1.0)** (#193): UTM parameter builder with case normalization and automatic PII redaction.
- **9:16 Aspect-Ratio Guard & Mobile Safe-Zone Calculator (`smm` v1.3.0)** (#192): Enforces mobile-first aspect ratios and UI safe-zone calculations for all social media assets.
- **Breadcrumb JSON-LD Generator & Trailing-Slash Normalizer (`seo` v1.2.0)** (#191): Structured data generation for breadcrumb navigation and canonical trailing-slash enforcement.
- **EDR & Runtime Safety Auditor (`code-review` v1.4.0)** (#188): SEC-11..13 controls — memory exhaustion guards, uncapped regex backtracking detection, dependency integrity verification.
- **Gitignore Wildcard Parent Trap & Tracked Index Cache Auditor (`git` v1.2.0)** (#187): Detects and patches gitignore entries accidentally ignoring parent directories; audits stale tracked-file index cache.
- **Frontmatter-Guard Build Crash Sanitizer (`content` v1.2.0)** (#186): Pre-commit YAML mapping protector preventing frontmatter-induced static-site build crashes.
- **Anti-FOUC Hydrator, Zero-CLS Font Metrics & Print Stylesheet (`webdev`)** (#184): Client-side hydration anti-FOUC patterns, Cumulative Layout Shift (CLS) elimination for custom fonts, and print-optimized stylesheet scaffolding.
- **Brand Immersion Tokens & Adaptive Favicon (`design`)** (#183): Dynamic favicon generation from brand tokens with aesthetic asset scaffolding.
- **CMS-Cohesion Linter & Verified Deploy Gate (`gauntlet-loop`)** (#178): Pre-deploy CMS cohesion audit and deterministic deploy gate with verified receipt.
- **Deposit-Before-Code & Deemed Acceptance Standard (`accounts`)** (#177): Enforces deposit receipts before code delivery and automatic deemed acceptance triggers.
- **Shared Credential Vaulting & Client Handover Package (`ops`)** (#176): Structured credential vaulting per client and standardized handover package generation.
- **Diplomatic Scope Shield & Pushback Matrix (`client-comms`)** (#175): Scope creep defense playbook with escalation-tier pushback response matrix.
- **Follow-the-Sun Twilight Handover (`secretary`)** (#174): Timezone-aware twilight handover engine with overlap window detection across 4 hemispheres.
- **Sliding Token Budget Governor (`accounts`)** (#173): Sliding-window AI compute token attribution and context budget enforcement per client project.

### Changed

- **`updatedocs` v2.6.0** (#197): Zero-runtime-env repository support with enhanced `findFiles` exclusion patterns for environments without local `.env` configuration.
- **`code-review` v1.5.0** (#196): Scanner hardening, test-file exclusions, and comment-block filtering reducing false-positive audit results.
- **`new-project`** (#200): Official Razorpay SDK client wired in place of mock order endpoint; `crypto.randomUUID()` for cryptographically secure order IDs (#195).
- **Cross-skill relative link harmonization** (#199): All nested `README.md` catalogs and cross-skill relative links normalized and verified.

### Fixed

- **Validate script path** (#198): Corrected `validate-memory-file.sh` invocation path; anchored `.gitignore` build directories; resolved Biome linter warnings.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v6.2.0...v7.0.0

---

## [6.1.1] - 2026-09-29

### Added

- **Autonomous Secretary Protocol Auto-Wiring (`updateagents`)**:
  - Enforced that `updateagents` automatically verifies and wires the canonical Secretary Protocol router (`secretary:dispatch`) into `AGENTS.md` across all runs: Day-0 scaffolding (`--scaffold`), Day-1 legacy retrofit, and Day-N context synchronization.
  - Guarantees that any agent session automatically triggers `secretary:dispatch` on first run to orchestrate tasks across all 46 canonical Muse departments under the designated Council Lead (**Sol**, **Jasper**, **Crew**, **Nexus**).
  - Updated master `updateagents/templates/AGENTS.md` with the Secretary router block.
  - Adjusted Asset 1 audit line ceiling in `updateagents/scripts/updateagents.ts` and `updateagents/references/twelve-asset-matrix.md` to `<85 lines` to comfortably accommodate the Operating Constitution, turn invariants, and Secretary router.
  - Synchronized internal project context files (`current.md`, `product.md`, `architecture.md`, `roadmap.md`) to full 46-skill parity.

## [6.1.0] - 2026-09-29

### Changed

- **Consolidated AI-Readiness & Context Synchronization Engine (`updateagents` #42)**: Merged `ai-ready` into `updateagents`, establishing a single universal agent context synchronization and AI-readiness engine:
  - Unified Day-0 scaffolding (`--scaffold`), Day-1 legacy retrofit, Day-N standards sync, and 13-asset AI-readiness auditing (`--audit`, `--fail-under`, `--json`) into `updateagents/scripts/updateagents.ts`.
  - Migrated master DOX templates (`.agents/`, `AGENTS.md`, `Client-Intake/`, `llms.txt`, `.github/`, etc.) into `updateagents/templates/` as the single source of truth for both `updateagents` and `new-project`.
  - Added synthetic ADE/IDE artifact sanitization mode (`--sanitize`) to unwrap proprietary wrappers (`ORCA_RICH_MD`, Cursor, Windsurf) across codebases.
  - Reconciled catalog from 47 to 46 universal skills across `skills.json`, `llms.txt`, `README.md`, `AGENTS.md`, and test suites.
  - Updated all downstream skill references (`new-project`, `git`, `updatedocs`, `audit`, `coupling-router`, `relay`, `secretary`) to route through `updateagents`.
  - Streamlined `scripts/install.sh` and `scripts/export-commands.ts` with interactive updateagents execution and clean harness detection.

## [6.0.0] - 2026-09-27

### Added

- **Unified Customer Relationship & Event-Driven Marketing Flow Engine (`crm` #47 & `flows` alias)**: Added the 47th canonical agency department (`crm/SKILL.md`) with 7 high-impact production modes (`onboard`, `abandon`, `nurture`, `winback`, `deliverability`, `sms`, `contacts`). Features:
  - Canonical 5-stage activation sequences (`references/onboard.md`) driving time-to-value under 15 minutes.
  - Multi-touch abandonment rescue state machines (`references/abandon.md`) for e-commerce cart/checkout and SaaS trial drop-offs.
  - Value-first customer nurture sequences (`references/nurture.md`) with segment-aware branch logic.
  - Reason-aware win-back playbooks (`references/winback.md`) recovering churned and dormant accounts.
  - Strict email authentication infrastructure (`references/deliverability.md`) enforcing SPF, DKIM, DMARC, RFC 8058 1-click unsubscribe headers, and progressive IP/domain warming schedules.
  - Compliant SMS automation (`references/sms.md`) implementing TCPA express written consent, CTIA rules, A2P 10DLC registration, and timezone quiet hours.
  - Unified contact data schemas and dynamic RFM segmentation (`references/contacts.md`) with GDPR/CCPA right-to-erasure and identity resolution rules.
- **3D Motion & Interactive Spatial Design Mode (`design:3d`)**: Added the 11th mode to `design` (`design/references/3d.md`), establishing Spline embeds, Three.js / React Three Fiber (R3F) declarative pipelines, Blender asset optimization, and strict mobile polygon/draw-call budgets with Draco geometry compression.
- **Agency Legal Architecture Mode (`ops:legal`)**: Added the 10th mode to `ops` (`ops/references/legal.md`), providing standardized contracts: Master Services Agreements (MSAs), Statements of Work (SOWs), subcontractor IP assignment agreements, two-way NDAs, and generative AI disclosure and confidentiality clauses.
- **Conversational Voice AI & Telephony Mode (`automation:voice`)**: Added the 7th mode to `automation` (`automation/references/voice.md`), codifying sub-600ms latency voice agents across Retell AI, Bland AI, Twilio Voice SIP media streams, ElevenLabs synthesis, and warm human transfer escalations.
- **Community Architecture & Engagement Loops Mode (`growth:community`)**: Added the 10th mode to `growth` (`growth/references/community.md`), detailing channel taxonomies, Day 1 to Day 30 onboarding rituals, weekly engagement calendars, 14d/30d inactivity winback loops, and AutoMod regex spam guardrails across Discord, Skool, Slack, and Circle.

### Changed

- **Agency Department Expansion**: Scaled catalog to 47 production-grade agency departments.
- **Universal Executive Secretary Sync**: Synchronized `secretary:dispatch` directory and 174 slash commands across all supported agent harnesses (OpenCode, Antigravity/Gemini CLI, Cursor, Windsurf, Claude Code, Hermes).
- **Catalog Byte-Parity Contract**: Reconciled skill definitions, argument hints, and mode counts across `SKILL.md`, `skills.json`, `llms.txt`, and `README.md`.
- **Test Suite Expansion**: Added comprehensive simulation tests covering all new department modes (142 tests passing with 3,157 assertions).

## [5.26.0] - 2026-09-24

### Added

- **Executive Secretary Controller & Universal Front Door (`secretary:dispatch` #30)**: Central triage router on session start across all 46 canonical departments. Maps user intent to the 4 Council Leads (**Sol**, **Jasper**, **Crew**, **Nexus**) with 5-step progressive disclosure protocol, Socratic 3-prong stress-testing, and single-use approval hash gates.
- **Multi-Harness Slash Command Exporter & CLI Runner (`scripts/export-commands.ts` #30)**: Automated export of 171 first-class slash commands into detected agent harnesses (`.opencode/commands/`, `.gemini/commands/`, `.cursor/commands/`, `.windsurf/workflows/`) and global `~/.local/bin/muse` executable CLI runner.
- **Continuous Auto-Sync Dispatch Engine (`scripts/sync-dispatch.ts` #31)**: Automated catalog scanner recompiling `secretary/references/dispatch.md` with zero drift against `skills.json` and mode references, wired into git hooks and CI test assertions.
- **Viral Carousel Growth Engine (`smm:carousel` #28)**: Autonomous 6-slide viral carousel generation mode with Playwright, Gemini vision prompts, and Upload-Post publishing.
- **JSON Canvas & PKM Vault Architecture (`ops:obsidian` #29 & #33)**: Full Obsidian Flavored Markdown (OFM) support, JSON Canvas 1.0 visual node specifications, and CLI automation.
- **Cloudflare & Modern Declarative Wrangler (`devops:cloudflare` #32)**: Declarative `wrangler.jsonc` bindings, Workers, Pages, Full (Strict) SSL, and Zero Trust tunnels.

### Changed

- **Documentation Synchronization with Copywriting Frameworks (`updatedocs` #32)**: Synchronized all project-level documentation with battle-tested copywriting formulas: AIDA + 4 Ps (`README.md`), QUEST (`CONTRIBUTING.md`), ACCA (`docs/DOGFOOD.md`), Danny Iny 6+1 (`docs/SKILL_SPECIFICATION.md`), PAS (`scripts/hooks/README.md`).
- **Catalog Reconciliation**: Restored `webdev` and eliminated legacy `handoff` entry in `README.md`; reconciled mode tables and counts across `webdev` (15 modes), `devops` (7 modes), `smm` (10 modes), `content` (9 modes), and `database` (6 modes).
- **Workspace Memory Synchronization**: Reconciled skill count to 46 and audit-mode tally to 20 in `AGENTS.md`.

## [5.25.1] - 2026-09-22

### Fixed

- **Type Definition Parity in `extract-skill`**: Updated `GateResult` interface in `scripts/extract-skill.ts` to include `"tdd"` in its `gate` union type, ensuring strict TypeScript check (`bun run type-check`) compiles with zero diagnostics.

## [5.25.0] - 2026-09-22

### Added

- **Full-Stack Funnel & Checkout Engineering Pipeline (`webdev:funnel`)**: Added the 15th execution mode to `webdev` (`webdev/references/funnel.md`). Codifies complete full-stack funnel architectures: multi-step form state machines with per-step Zod validation and endowed progress, frictionless Stripe checkout with order bump mechanics and idempotency headers, 1-click post-purchase upsell/downsell state machines via tokenized payment methods, dual-rail conversion tracking (Meta CAPI server endpoints with SHA-256 PII hashing and `event_id` deduplication), and asynchronous CRM webhook queues.

## [5.24.0] - 2026-09-22

### Added

- **TDD Skill Engineering Protocol & Gate 4 in `extract-skill` (`updateagents`)**: Codified the TDD Skill Engineering Protocol (`updateagents/references/skill-authoring.md`) derived from `writing-skills`. Establishes the Red-Green-Refactor loop for agent prompt instructions (RED: baseline adversarial pressure scenario, GREEN: minimal constraint, REFACTOR: loophole closure against LLM rationalizations). Upgraded `scripts/extract-skill.ts` with Gate 4 (`checkTddEngineeringGate`, `--tdd-scenario`, `--tdd`) and linked Step 13b in `updateagents/SKILL.md`.

## [5.23.0] - 2026-09-22

### Changed

- **Strict On-Demand Execution Policy (`code-review:simplify` & `refactor:sweep`)**: Enforced strict governance policies across `code-review` and `refactor` engines guaranteeing that `simplify` and `sweep` execution modes are strictly on-demand. Added explicit warnings and rules in `code-review/SKILL.md`, `code-review/references/simplify.md`, `refactor/SKILL.md`, and `refactor/references/sweep.md` ensuring autonomous agents never trigger behavioral simplifications or codebase-wide component rewiring unprompted.

## [5.22.0] - 2026-09-22

### Added

- **Developer Codebase Orientation & Execution Path Tracing (`webdev:onboard`)**: Consolidated `agency-codebase-onboarding-engineer` into `webdev` as its 14th execution mode (`webdev/references/onboard.md`, with `onboard` and `oinboard` triggers). Implements the 3-Tier Orientation Map (1-Line Summary, 5-Minute Overview, Deep Dive into Boundaries), end-to-end execution path tracing, and strict code-grounded heuristics without speculative inferences.

## [5.21.0] - 2026-09-22

### Added

- **Purposeful Whimsy & Delight Engine (`animate:delight`)**: Integrated `agency-whimsy-injector` into `animate` as its 7th execution mode (`animate/references/delight.md`). Adds brand personality spectrum matrices (Professional vs. Casual vs. Error vs. Success), spring-loaded micro-interactions, zero-dependency canvas confetti celebrations, Konami code discovery easter eggs, and charming empty/error states under strict WCAG `prefers-reduced-motion` compliance.

## [5.20.0] - 2026-09-22

### Added

- **Full-Funnel App Store Optimization Engine (`mobile:aso`)**: Deepened `mobile:aso` (`mobile/references/aso.md`) with comprehensive frameworks consolidated from `agency-app-store-optimizer`. Adds Apple Product Page Optimization (PPO) vs. Google Play Store Listing Experiments, 6-slide narrative screenshot storytelling psychology, in-app ratings prompt trigger heuristics (`SKStoreReviewController`/`ReviewManager`), review response customer-service templates, and tiered metadata localization matrices.

## [5.19.0] - 2026-09-22

### Added

- **Public Relations & Crisis Communications Engine (`growth:pr`)**: Consolidated `agency-pr-communications-manager` into `growth` as its 9th operational mode (`growth/references/pr.md`). Includes AP-style newswire release frameworks, 3-paragraph journalist pitching rules, 30-minute crisis communications holding statements (P1–P4 triage), and executive thought leadership byline templates.

## [5.18.0] - 2026-09-22

### Added

- **Comprehensive Historical Changelog Sync (v5.0.0 → v5.17.0)**: Fully backfilled and documented detailed changelog records for all 17 minor releases across the v5 milestone series, detailing atomic features, department consolidations, architectural improvements, and security verifications.

## [5.17.0] - 2026-09-22

### Added

- **High-Converting Developer Blueprint (`README.md`)**: Re-architected root documentation applying the Before-After-Bridge (BAB) + AIDCA developer copywriting framework.
- **1-Command Quick Start Above the Fold**: Placed `npx skills add harshsinghmp/muse-skills` prominently at the very top for zero-friction agent and developer installation.
- **Progressive Disclosure Toggles**: Incorporated `<details><summary>` interactive collapsibles for System Architecture (Mermaid workflows and runtime specs) and the complete 46-Skill Catalog table.
- **Historical Documentation Archive**: Preserved the complete v5.0.0 documentation as an archival reference at [`docs/README-v5.0.0.md`](docs/README-v5.0.0.md).
- **Branch Cleanliness**: Pruned 22 merged local feature branches, keeping the local workspace lean and strictly aligned with remote branches.

## [5.16.0] - 2026-09-22

### Added

- **Brand Lifecycle & Client Onboarding Engine (`brand`)**: Registered the 46th canonical agency department skill (`brand/SKILL.md`) equipped with 8 operational modes: `intake`, `research`, `pipeline`, `accounts-access`, `brief`, `ecommerce`, `offboard`, and `audit`.
- **Automated 50-Point Intake Audit Tool (`brand/scripts/intake-audit.ts`)**: Fast CLI utility scoring client intake briefs across clarity, completeness, and feasibility gates with instant clarification generation.
- **Zero-Leak Credential Delegation Protocol**: Enforces secure client credential exchange without storing secrets in plaintext across Google, Meta, AWS, Shopify, and Cloudflare in `brand:accounts-access`.
- **Executive Milestone Reports**: Shipped comprehensive interactive HTML milestone reports at [`.agents/reports/v5.16.0-2026-09-22.html`](.agents/reports/v5.16.0-2026-09-22.html) and [`.agents/reports/latest.html`](.agents/reports/latest.html).

## [5.15.0] - 2026-09-22

### Added

- **Universal Full-Stack Refactoring Engine (`refactor`)**: Promoted and expanded `refactor-ui` into a full-system refactoring department (`refactor/SKILL.md`) featuring 7 dedicated execution modes: `ui`, `code`, `architecture`, `perf`, `database`, `sweep`, and `polish`.
- **Architectural Decoupling & Cyclomatic Reduction**: Standardized procedural guidelines for reducing cyclomatic complexity, breaking circular module dependencies, and enforcing zero-downtime database migration patterns.

## [5.14.0] - 2026-09-22

### Added

- **WCAG 2.2 AA Accessibility Engine (`webdev:accessibility`)**: Added comprehensive accessibility operating playbooks (`webdev/references/accessibility.md`) featuring automated Playwright axe test scripts, modal focus trapping routines, semantic ARIA landmarks, and `:focus-visible` ring conventions.
- **Fullstack Security Architecture (`webdev:security-headers`)**: Consolidated Three-Perspective Security Architecture, security headers (CSP, HSTS, X-Frame-Options), and SSRF IP blocklists (`webdev/references/security-headers.md`, `webdev/references/backend.md`).
- **EARS Specification Miner (`webdev:spec`)**: Integrated Easy Approach to Requirements Syntax (EARS) template for extracting unambiguous requirements from client briefs (`webdev/templates/specification-template.md`).

## [5.13.0] - 2026-09-22

### Added

- **Design Department UI Kit Architecture (`design:uikit`)**: Consolidated starwind-ui, headless primitives, and Class Variance Authority (CVA) patterns in `design/references/uikit.md`.
- **Visual Storytelling & Narrative Arcs (`design:story`)**: Codified brand narrative frameworks, emotional arcs, and multi-frame video storyboards (`design/references/story.md`).
- **Presentation Decks & W3C Design Tokens**: Added 15 proven slide deck structures (`design/references/slides.md`) and a W3C-compliant design tokens starter template (`design/templates/design-tokens-starter.json`).

## [5.12.0] - 2026-09-22

### Added

- **Broadcast Podcast Audio Engineering (`content:podcast`)**: Codified industry-standard LUFS loudness targets (-16 LUFS stereo, -19 LUFS mono), dynamic range multi-band compression, and background de-noising procedures (`content/references/podcast.md`).
- **AI Video Editing & Short-Form Retention (`content:video`)**: Integrated HeyFrames AI workflows, 3-second visual hooks, pattern interrupts, and high-CTR thumbnail prompt syntax (`content/references/video.md`, `content/references/thumbnails.md`).
- **Copywriting Framework Selector (`content:copy`)**: Systematized PAS, AIDA, BAB, FAB, 4Ps, QUEST, and StoryBrand frameworks with automatic context recommendation matrices.

## [5.11.0] - 2026-09-22

### Added

- **Competitor Intelligence & Market Research (`research`)**: Added structured competitor messaging grids, feature parity matrices, and pricing tier analyses (`research/references/competitor-analysis.md`).
- **Due Diligence Dossiers**: Codified corporate research dossiers with source validation, market opportunity scoring, and citation verification.

## [5.10.0] - 2026-09-22

### Added

- **Client Communications Inbox Triage (`client-comms`)**: Implemented P0–P3 inbox triage rubrics and automated client nudge sequences (`client-comms/references/inbox-triage.md`).
- **Factual Git-Evidence Reporting**: Standardized progress updates grounded exclusively in verified Git commits, build artifacts, and test logs (`client-comms/references/factual-reporting.md`).

## [5.9.0] - 2026-09-22

### Added

- **Agency Legal & Contract Standards (`ops:contracts`)**: Added production-ready SOW, NDA, and MSA contract drafting standards with explicit scope boundaries and change-order clauses (`ops/references/contracts.md`).
- **4-Section Executive Meeting Capture (`ops:meeting-notes`)**: Codified standardized meeting capture templates with automated action item extraction, deadlines, and direct owner attribution (`ops/references/meeting-notes.md`).

## [5.8.0] - 2026-09-22

### Added

- **Git Credential Exposure Audit Protocol (`git:exposure-audit`)**: Codified emergency remediation workflows for token exposures, git history purging with git-filter-repo, and pre-commit secret scanning hooks (`git/references/exposure-audit.md`).

## [5.7.0] - 2026-09-22

### Added

- **SEO & AI Answer Engine Optimization (`seo:aeo`)**: Added answer-first content density under headers, 18-token standalone quotability rules, and Citation Share of Voice (SoV) benchmarks for Perplexity, ChatGPT Search, Gemini, and Claude (`seo/references/aeo.md`).
- **Structured Semantic Markup**: Implemented JSON-LD schema generation standards for technical documentation, software products, and FAQs.

## [5.6.0] - 2026-09-22

### Added

- **Paid Ads Google & Meta Playbooks (`paidads`)**: Added campaign architecture playbooks for Google Search/PMax and Meta Ads (`paidads/references/google.md`, `paidads/references/meta.md`), including conversion pixel tracking, retargeting funnels, and budget pacing algorithms.

## [5.5.0] - 2026-09-22

### Added

- **SMM Creator Vetting Scorecard (`smm:creator-vetting`)**: Added 25-point creator vetting scorecard, engagement authenticity verification, and red-flag audit matrices (`smm/references/creator-vetting.md`).
- **Social Search AEO**: Optimized caption keyword density, hashtag taxonomy, and semantic hooks for social search discovery across TikTok, Instagram, and LinkedIn.

## [5.4.0] - 2026-09-22

### Added

- **Affiliate Reward Models & Referral Loops (`growth:affiliates`)**: Added affiliate reward tier structures, referral loop tracking, and viral coefficient calculations ($K = i \times c$) in `growth/references/affiliates-referrals.md`.
- **Product Hunt Launch Engine (`growth:launch`)**: Integrated hour-by-hour launch day playbooks, community engagement strategies, and initial upvote activation sequences.

## [5.3.0] - 2026-09-22

### Added

- **DevOps Cloudflare Edge & Zero Trust Tunnels (`devops:cloudflare`)**: Added Cloudflare Workers, Pages, Full (Strict) SSL encryption, and Zero Trust tunnel deployment procedures (`devops/references/cloudflare.md`).
- **Quick Tunnels**: Added `try.cloudflare.com` quick tunnel support for instant ephemeral testing of local web servers without opening firewall ports.

## [5.2.0] - 2026-09-22

### Added

- **Database Memory Calibration & Query Optimization (`database`)**: Added memory calibration formulas (`shared_buffers`, `work_mem`, `effective_cache_size`) for PostgreSQL and MySQL in `database/references/tuning.md`.
- **Consolidated Query Optimizer**: Merged standalone database-optimizer into `database:optimize` mode (`database/references/optimize.md`).

## [5.1.0] - 2026-09-22

### Internal Activity & System Consolidation (Pain → Feature → Solution)

#### 1. Three.js Micro-Skill Proliferation & Prompt Overlap
- **Pain**: The workspace accumulated 16 disparate Three.js micro-skills, causing trigger overlap, inflated context loading, and inconsistent WebGL practices across agency design tasks.
- **Feature**: Consolidated all 16 micro-skills into the canonical `animate:threejs` mode (`animate/references/threejs.md`) and registered explicit shader, physics, and post-processing patterns under `animate/SKILL.md`.
- **Solution**: The team safely archived and purged all 16 standalone Three.js directories into compressed tarballs, channeling all 3D canvas and WebGL orchestration through a single deterministic entry point.

#### 2. Accessibility Deficits & Inconsistent Web Compliance
- **Pain**: Audits revealed accessibility was treated as an afterthought without unified WCAG AA standards, resulting in keyboard navigation barriers, invisible focus outlines, and unhandled modal focus traps.
- **Feature**: Codified a complete WCAG 2.2 AA operating playbook into `webdev:accessibility` (`webdev/references/accessibility.md`) featuring semantic landmark hierarchies, `:focus-visible` styling patterns, keyboard trapping routines, ARIA design tokens, and Playwright axe test scripts.
- **Solution**: Embedded compliance checks directly into the web development lifecycle, providing engineers and agents with clear verification recipes before shipping client interfaces.

#### 3. Restricted Scope of Interface Refactoring
- **Pain**: The legacy `refactor-ui` skill only addressed styling and Tailwind classes, leaving architectural drift, backend code smells, unoptimized database queries, and multi-page inconsistencies unmanaged by a dedicated engine.
- **Feature**: Evolved `refactor-ui` into the universal `refactor` department skill (`refactor/SKILL.md`) with 7 specialized execution modes: `ui`, `code`, `architecture`, `perf`, `database`, `sweep`, and `polish`.
- **Solution**: Standardized full-stack refactoring under one unified command suite equipped with automated contrast audits, cyclomatic complexity reduction criteria, and zero-downtime database migration rules.

#### 4. Fragmented Client Brand Onboarding & Delegation Security
- **Pain**: Brand onboarding lacked a standardized operational harness, leading to scattered client intake briefs, ad-hoc credential sharing, misaligned design directives, and loose access revocation upon project completion.
- **Feature**: Formalized `brand` (`brand/SKILL.md`) as the 46th canonical agency department, introducing 8 operational modes (`intake`, `research`, `pipeline`, `accounts-access`, `brief`, `ecommerce`, `offboard`, `audit`) and an automated 50-point intake audit script (`brand/scripts/intake-audit.ts`).
- **Solution**: Delivered an end-to-end client lifecycle mechanism enforcing zero-leak access delegation, cross-department brief generation (design, webdev, content, paidads), and a mandatory 48-hour access revocation protocol.

#### 5. Workspace Clutter & Redundant Cluster D Skills
- **Pain**: Over 1,000 legacy and third-party skills cluttered global and local trees, diluting discovery relevance and consuming unnecessary disk and memory footprint.
- **Feature**: Harvested high-signal frameworks, playbooks, and templates from 52 Cluster D skills into the agency's primary departments:
  - **`ops`**: SOW/NDA/MSA contract drafting standards (`ops/references/contracts.md`) and 4-section meeting capture formats (`ops/references/meeting-notes.md`).
  - **`client-comms`**: P0–P3 inbox triage rubrics and nudge sequences (`client-comms/references/inbox-triage.md`).
  - **`growth`**: Affiliate tier reward models and referral loops (`growth/references/affiliates-referrals.md`).
  - **`smm`**: 25-point creator vetting scorecard and red-flag audits (`smm/references/creator-vetting.md`).
  - **`brand`**: 7-element customer persona framework (`brand/references/persona.md`) and starter guidelines template (`brand/templates/brand-guidelines-starter.md`).
  - **`content`**: High-CTR thumbnail prompt syntax (`content/references/thumbnails.md`), 12 editorial voice archetypes (`content/references/voice-archetypes.md`), and broadcast podcast audio engineering (`content/references/podcast.md`).
  - **`research`**: Competitor messaging grids and pricing tier analyses (`research/references/competitor-analysis.md`).
  - **`database`**: PostgreSQL/MySQL memory calibration formulas and index optimization (`database/references/tuning.md`, `database/references/optimize.md`).
  - **`webdev`**: Security headers, rate limiting, and EARS requirements extraction template (`webdev/references/security-headers.md`, `webdev/templates/specification-template.md`).
  - **`design`**: 15 slide deck structures (`design/references/slides.md`), W3C design tokens starter (`design/templates/design-tokens-starter.json`), and component UI kit architecture (`design/references/uikit.md`).
  - **`devops`**: Cloudflare Workers, Pages, and Zero Trust tunnels (`devops/references/cloudflare.md`).
  - **`git`**: Secret exposure audit procedures (`git/references/exposure-audit.md`).
- **Solution**: Safely pruned 1,080 redundant skills across workspace environments into compressed tarballs, bringing the overlap matrix to 1,080 pruned, 83 preserved unique properties, and 0 replace-with-muse remaining.

#### 6. Catalog Integrity & Zero-Leak Quality Enforcement
- **Pain**: High-velocity multi-skill refactoring created risks of unmonitored test failures, secret leaks, or catalog drift between `SKILL.md`, `skills.json`, and `llms.txt`.
- **Feature**: Expanded the automated test suite with simulation workflows (`tests/simulation-workflows.test.ts`), added strict byte-parity validation across registry files, and executed automated TruffleHog secret scans via Vibeguard Protocol.
- **Solution**: Locked in 100% test pass rate across 116 tests in 7 files with zero credential leaks, validating all 46 canonical skills for production readiness.

## [5.0.0] - 2026-09-21

### Added

- **Native Agent Taste Engine (`scripts/taste-engine.ts`)**: Autonomous, zero-third-party SaaS preference learning and behavioral habit extraction engine. Classifies recurring user steering across 5 taxonomy classes (Style, Architecture, Quality, Workflow, Communication), tracks recurrence count ($N \ge 2$), enforces configurable active atom cap (scalable up to 40+), performs real-time conflict detection, and automatically prunes stale atoms (>365 days).
- **Task Observation Hook (`scripts/hooks/taste-observer.sh`)**: 15th shell hook for real-time passive learning from conversation corrections and feedback with Vibeguard zero-leak sanitization.
- **DOX Engine 17 Modular Standards**: Upgraded template canon in `ai-ready/templates/.agents/standards/` to 17 modular standards (adding `boundary-governance.md`, `fintech-gateways.md`, `client-reporting.md`, `motion-diagrams.md`), with Turn Invariant #13 (Atomic PR Protocol) in `AGENTS.md` and `git-workflow.md`.
- **OpenAccountants Fintech Clearing & ITC Recovery**: Built-in multi-gateway transaction reconciliation engine (`accounts/scripts/reconcile-gateways.ts`) for Stripe, Razorpay, Cashfree, PayU, and Paytm with 18% GST ITC recovery and universal multi-currency ledger interoperability (QuickBooks, Xero, NetSuite, Zoho, OpenAccountants, plain-text accounting).
- **Agency Council Capabilities Playbooks**:
  - **Jasper (Creative Technologist)**: Dashmotion zero-JS moving SVG technical architecture diagrams (`animate/references/technical-diagrams.md`) and Agent Reach zero-cost social listening (`smm/references/social-intel.md`).
  - **Sol (Product Architect)**: Optim-Agent semantic DB parameter optimization (`database/references/tuning.md`) and Browser Relay authenticated session bridge (`automation/references/browser-relay.md`).
  - **Nexus (Technical Director)**: Odai 5-checkpoint mission-focused boundary governance (`code-review/references/boundary-governance.md`).
  - **Crew (Delivery Specialist)**: Ribao commit-verified factual progress reporting (`client-comms/references/factual-reporting.md`).
  - **Council Overall**: Global Invariant Atom Table telemetry (`updateagents/references/global-atoms.md`).
- **New skill `accounts` (#45)**: Agency and client financial operations engine — 6 modes (`invoicing`, `bookkeeping`, `client-pnl`, `cashflow`, `tax-compliance`, `audit`), complete playbooks, and companion metadata.
- **New skill `muse-security` (#44)**: Single source of truth for external security workflows — 6 modes (`cve`, `remediate`, `cloud-waf`, `sast`, `runtime`, `audit`), complete playbooks, and companion metadata.
- **`smm` Postiz Mode (#28)**: Added `postiz` multi-channel scheduled dispatch mode across 28+ networks via Postiz API/CLI (`smm/references/postiz.md`), remote media upload pipeline, dynamic integration discovery, and TikTok `DIRECT_POST` flags.
- **Enterprise & Growth Invariants Enriched**:
  - `database`: Vector search recipes, Qdrant SQ/PQ/BQ quantization trade-offs, and zero-downtime alias swap model migration in `database/references/vector-search.md`.
  - `seo`: Citlyze $Citation\,SoV$ algorithm, 4-quadrant gap triage, 6-platform tracking, and bot log analysis in `seo/references/aeo.md`.
  - `automation`: n8n execution syntax, webhook body scoping, and `$input.all()` Code node contracts in `automation/references/workflow.md`.
  - `qa-launch`: Cypress `[data-cy]` selector hierarchy, `cy.intercept()` network aliasing, zero arbitrary `cy.wait()`, and session auth caching in `qa-launch/references/functional.md`.
  - `devops`: Keyless cloud auth (OIDC Workload Identity for GCP/AWS), GKE Autopilot golden path, and FinOps lifecycle tiers in `devops/references/hosting.md`.
  - `incident-response`: Non-destructive automated diagnostic gathering protocol (`sosreport`, system telemetry) in `incident-response/references/triage.md`.
  - `code-review`: Simple-man zero-fluff review standards and Poka-Yoke unrepresentable state checks in `code-review/references/simplify.md`.
  - `webdev`: In-dev security prevention rules (tenant ID isolation, SSRF IP blocklist, Zod schema boundaries) in `webdev/references/backend.md`.
- **Simulation Test Suite**: Added `tests/simulation-workflows.test.ts` verifying all 44 skills, `muse-security` 6 modes, `smm postiz` dispatch, `database` quantization, and `seo aeo` calculations (68/68 tests passing across suite).
- **Cognitive & Quality Low-Hanging Enrichments**:
  - `content`: Added Aaron 8 Pre-Flight Auditor Gates (`CORE-EEAT`, `CITE`, `STAR`, `ROAS`, `SEND`, `RAMP`, `ECHO`, `TALE`) with 18-token self-contained rule and quantified result metric mandate in `content/references/copy.md`.
  - `gtm`: Added Gooseworks 4-Tier Fit-Intent Matrix & real-world intent signal harvesters (job posting deltas, stack shifts, funding rounds) in `gtm/references/score.md`.
  - `growth`: Added Viral Loop formula ($K = i \times c$) and Cycle Time ($ct$) acceleration model in `growth/references/referral.md`.
  - `code-review`: Added Isolated Fresh-Eyes Review Protocol (`context: fork`) and strict dependency bump review rules (1 bump per commit, lockfile diff review) in `code-review/references/triage-matrix.md`.
  - `git`: Added Section 9 Pre-PR Adversarial Grilling Checklist (Inversion / Catastrophic Failure, Blast Radius & Shared State, Async Race Conditions) in `git/references/issue-to-pr-discipline.md`.
  - `new-project`: Added Poka-Yoke architectural scaffolding contracts (branded IDs, discriminated union states) and Milestone Exclusion List ("What We Are NOT Building") in `new-project/SKILL.md`.
  - `humanize`: Expanded structural de-AI detection patterns P51–P60 (Somatic Cliches, Narrative Moralizing, Artificial Causal Tidiness, Sycophantic Openers, Hedging Stacks, Nominalization Bloat, Reasoning Trace Leakage, Em-Dash Saturation, Pseudo-Profundity, Venue Mismatch) in `humanize/references/patterns.md`.

## [4.4.2] - 2026-09-18

### Added

- **new-project grill-mode rhythm alternate**: Stage 1 picker (one-at-a-time default vs frontier-rounds grill-mode) — frontier rounds, Q/A format, facts/decisions split, anti-passivity + prototype hatch, confirmation gate, ops rules. Default untouched.

## [4.4.1] - 2026-09-18

### Added

- **code-review story-level arch axes (row 9)**: component reuse, domain consistency, data privacy, service architecture, infra delivery — appended to design-soundness pass. Lane-A shortlist fully resolved (12/13 already landed + this enrich).

## [4.4.0] - 2026-09-18

### Added

- **New skill `retain` (#43)**: post-delivery retention loop — check-in, value-note, QBR, review-ask, referral/rebuy, churn-watch modes.
- **webdev new modes (8→12)**: spec, implement, LOGIC-prototype, deploy (one-command ship + static-upload fallback + object-storage contract).
- **design new mode**: UI-prototype (clickable mock, locked/iterate/kill verdict).
- **Step 3b addy enriches**: capability map (coupling-router), assumptions + spec template (relay), CONSTRAINTS contract (code-review), context hierarchy (context-anchor), stack preamble + testing bar + adversarial critic (gauntlet-loop), deprecation + Hyrum's Law (webdev), gate order + flags (devops), rollout thresholds + DoD bar (qa-launch).
- **Step 3c marketingskills enriches**: Seven Sweeps + panel gates (content), SEO/GEO/pSEO/IA/ASO deltas, social atomization (smm), CRO + lifecycle mechanics (growth/analytics), revops + prospecting + PR/events/directories (gtm/ops), ads playbooks (paidads), seam-3 shared context template (ops).
- **Step 3d 16-repo enriches**: show-me/narrow-props (refactor-ui), rigor ladder + lang refs (code-review), scorer + validator (humanize), agent-loop scaffold (devops), hallmark rotation/stamp/wrapper (design), paired-judge + ratchet (gauntlet), CN specs + motion-cards (design/smm, paraphrased), video-delivery lane (animate), audit-gate + doctor/JSON (devops).

## [4.3.0] - 2026-09-18

### Added

- **Cross-supplier enrichments (vercel-labs, obra/superpowers, wshobson, mattpocock, addyosmani)** folded as enrich-only upgrades, zero new skills: `webdev` (prefixed rule oracle, composition patterns, metrics-first audit, python uv/packaging/async/perf path, test-authoring), `code-review` (TDD iron-law gate, root-cause rule, noise gate + weighed verdict, decay lens, design-soundness pass, finding shape, STRIDE→attack-tree→requirements→mitigation chain, Fowler smell fallback), `gauntlet-loop` (triage ratchet, fresh-worker + 5-round cap, sweep ladder, tech-debt sprint, second-model gate), `relay` (approval gate, packet schema, wayfinder decision map), `animate` (declarative layer + reduced-motion gate), `refactor-ui` (oracle gap-fill), `seo` (prose rules), `updatedocs` (sample hygiene), `pua` (red-capable debug discipline), `coach` (TDD seam gate), `updateagents` (glossary sparring + ADR 3-gate), `secretary` (tracer tickets + expand-contract), `devops` (SAST/FP-tuning, pipeline troubleshooting, burn-rate alerts), `ai-ready` (onboarding tour + layering pass), `mobile` (a11y checklist), `git` (clean-PR micro-step), `gtm` (metrics loop), `new-project` (interview discipline), `coupling-router` (sizing + checkpoints)

## [4.2.0] - 2026-09-17

### Added

- **60 tool-independent upgrade mechanisms** folded from skills-hub research into `code-review` (delegate, intended-vs-implemented, multi-reviewer, security-process, simplify, skill-bundle-scan, fixing-findings, receiving-feedback, security-controls, themes), `gauntlet-loop`, `qa-launch` (functional.md), `relay`, and `ai-ready` (advanced-audit-passes) reference passes

### Fixed

- `scripts/evidence-graph-builder.mjs` lint cleanups
- `skills.json` formatter sync
- `.gitignore` ruff cache entry

## [4.1.0] - 2026-09-16

### Added

- **Audit Mode (13 skills)**: database, git, smm, ops, gtm, animate, analytics, seo, qa-launch, content, pua, growth, mobile — each with `references/audit.md` + modes-table row; 5 companion skills got audit routing sections
- **Automation Infrastructure**: 14 shell hooks (`scripts/hooks/`) — session-close report archive, secret-scan pre-commit, worktree-lease check, registry sync, stale-frontmatter check, pre-push test gate, session-resume probe, dead-letter sweep, cache-pressure check, gauntlet closeout, context-switch snapshot, evidence-decision sync, audit-quick check
- **Lint + Type-Check**: biome (JS/TS), ruff (Python), tsc (TypeScript) — wired into CI as separate jobs
- **CI/CD Pipeline**: release workflow (`.github/workflows/release.yml`) — tag push → bun test → GitHub release (npm publish removed; npx skills add fetches from GitHub)
- **Security**: command-injection fix in extract-skill.ts (removed `shell:true`, added allowlist validator); gitleaks secret scan in CI
- **Evidence Ledger**: `.agents/context/evidence-ledger.md` — persistent decision/commitment/claim tracking with 4-tier confidence taxonomy
- **Session Report Archive**: `.agents/archive/reports/` — auto-archived via `gen-repo-report-on-close.sh` or startup safety net

### Fixed

- Command injection in `scripts/extract-skill.ts` — `spawnSync(shell:true)` → `spawnSync(cmd, args)` + `ALLOWED_TEST_CMD_PREFIXES` validator
- Secret scan stderr suppression — `2>/dev/null` → surfaced as `[hooks] SCAN ERROR` (fail-closed)
- Hardcoded paths in `sync_registry.py` and `gen-repo-report.py` — `ROOT` now resolves from `__file__`
- `isNaN` → `Number.isNaN` in extract-skill.ts
- Unused variable in extract-skill.ts (`promise` → `_promise`)
- README: version badge 3.1.0 → 4.0.0, "forty-one" → "40", fixed duplicate telegram row + #38/#39 numbering

### Infrastructure

- `biome.json`, `ruff.toml`, `tsconfig.json` added for lint/type-check
- `package.json` scripts: `lint`, `type-check` added
- `bun-types` installed for TypeScript checking
- GitHub Actions: lint + type-check + test + secret-scan jobs

## [4.0.1] - 2026-09-14

### Fixed

- Invocation UX frontmatter (`argument-hint`, `user-invocable`) on all 36 skills
- Conventions checklist + test pins (modes tables, default-stack lines, byte-parity)
- Modern-tool primacy sweep (modern-first with `|| legacy` fallback)
- Git skill modes upgrade (4 new references: history, issue-to-pr, troubleshooting, report-template)
- Review fixes from spec/code/frontend/design audit passes

## [4.0.0] - 2026-09-13

### Added

- **Agency Delivery Layer (14 new skills)**: 12 department head skills — strategy, creative, and delivery leadership each with a mode router that switches between solo-operator and full-agency behavior — plus **`qa-launch`** (#35) and **`client-comms`** (#36). UI-corpus and digital-marketing-pro mechanisms distilled tool-independently: no hard vendor dependencies. **OSS default stacks** and **solo-operator lines** across the whole agency layer. Full suite now 36 skills across 6 categories (registry, README, and `llms.txt` synced).

### Changed

- **`handoff` renamed to `relay`** — **breaking**: update any triggers or scripts that reference the old skill name. The `handoff` tag is kept as a keyword so existing discovery still works.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v3.1.0...v4.0.0

## [3.1.0] - 2026-09-11

### Added

- **Atomic Payload Website Builder (`new-project` v2.6.0)**: `--cms=atomic-payload` and `--preset=atomic-payload` provision the official pro-laico Atomic Payload template (Payload 3 + Next.js 16 + Tailwind, every `@pro-laico/*` plugin, MongoDB + Vercel Blob, pnpm, admin at `localhost:42100/admin`) as a fully isolated official scaffold — engine governance only, every companion selection skipped with a printed notice (same contract as Aria Builder); the official published template is extracted untouched via npm-pack of `@pro-laico/create-atomic-payload`, `.env.example` copied to `.env` and the upstream gitignore merged per the official CLI's own steps, with a ponytail offline fallback keeping isolation tests green. Doc-sync CMS charset extended to hyphenated values. Verified against the live official CLI (v0.5.0) and the official quick-start; placed as a website builder — commerce is added later via the Payload E-Commerce plugin.

### Fixed

- **evidence-ledger Registry Metadata (skills.json)**: the v3.0.0 release bumped `evidence-ledger` SKILL.md to v2.0.0 but left the registry with the old v1.x metadata — backfilled 7 tags (project-tracking, decisions, commitments, agency-workflow, context-switch, evidence-dashboard, staleness-detection), 6 suggested_skills (context-anchor, handoff, dead-letter, updateagents, coach, periodic-retreat), 2 aliases (project-evidence, evidence-tracker), and the `list_dir` tool; also fixed two unicode-encoding glitches in the `handoff` and `designscope` descriptions. (PR #85)
- **v3.0.0 Changelog Stamp Drift**: the release stamp left the v3.0.0 detail entries stranded under `[Unreleased]` (duplicating `[3.0.0]`'s Major Changes/Changed summaries) and omitted the v3.0.0 compare link; the `docs/CHANGELOG.md` mirror was missing the `[3.0.0]` section entirely. All repaired: details folded into `[3.0.0]` under Changed/Fixed, compare links added (`v2.7.0...v3.0.0` and `v3.0.0...v3.1.0`), mirror backfilled.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v3.0.0...v3.1.0

## [3.0.0] - 2026-09-10

### Major Changes

- **Agent-Independence Upgrade**: All skills now use `.agents/` as the universal agent-agnostic folder. Replaced `.claude/` path references with `.agents/` across ai-ready, dead-letter, refactor-ui, and handoff. Added `agent_independent: true` metadata to ai-ready. The `.agents/` folder is now documented as the standard location any AI coding agent can use — not Claude-specific.
- **Suite Version Bump to 3.0.0**: Major version increment reflecting the agent-independence architecture shift.

### Added

- **Suite Hardening Pass (5 skills, cross-pollination from the code-review corpus)**: mechanisms distilled from the 63-source review corpus landed where they fit best. **`gauntlet-loop` v1.2.0** — the Automated Gate gains a **quality-bar regression check** (suppressions added, tests skipped/deleted, assertions weakened, or thresholds edited down in the round's diff → round score 0.0: a build that passes because the bar was lowered is a regression, not a pass) and a **fail-closed eval check** (the proof suite must contain a test that CAN fail on the defect class the round claims to fix — a green run no test could have caught proves nothing; write the capable test and watch it fail on the pre-fix state first); `ITERATION_LEDGER` now records new-vs-fixed finding counts per round, and divergence (new findings outnumber fixed two rounds running) stops the loop with an escalation instead of burning the remaining budget. **`dead-letter` v1.5.0** — modularized: record template → [references/record-schema.md](dead-letter/references/record-schema.md), status sweep → [references/sweep-protocol.md](dead-letter/references/sweep-protocol.md) (SKILL.md down to 144 lines; sweep loads only the sweep protocol, capture loads only the schema), and the sweep gains a **findings ledger** (`.agents/artifacts/dead-letter-ledger.md`) that deduplicates recurring sweep verdicts, measures convergence across sweeps, and links clusters → repro packs → outcomes. **`secretary` v1.4.0** — Delegation Control Gates gain **Feedback Reception**: review feedback returning from delegations is verified against the code before implementation, each item classified implement / rebut (with evidence, never deference) / ask (one specific question), with investigation-before-application for auth/payments/migration items — performative agreement fails the gate. **`pua` v1.1.0** — modularized: 8 corporate flavor packs + situational auto-selector → [references/flavor-packs.md](pua/references/flavor-packs.md) (SKILL.md 208 lines; core procedure starts without the persona layer). **`refactor-ui` v1.1.2** — audit/review/sweep report severity markers ship text + symbol with color as a redundant third channel, never color alone (applies to rendered HTML report artifacts too).
- **Modular Router & 3 New Modes (`code-review` v1.3.0)**: SKILL.md rebuilt as a token-minimal router — 7 modes now, each with an explicit load-map (references load only for their mode): `diff` (default, full 17-theme catalog), `hotfix` and `contract` (nothing extra), `audit` (+ conventions discovery: the project's own test runner/standards/error conventions define Axis A, then two-axis standards+spec side-by-side report), **`security`** (numbered SEC-01..10 control pass — injection, access control/IDOR, auth/session, crypto, SSRF, secrets, rate limiting, error disclosure, dependency/supply-chain — evidence-first findings with snippet + exploitability + remediation, and an explicit "no findings" statement per passed control), **`receive`** (feedback intake: verify before implementing, classify each item implement/rebut/ask, risk-gating for auth/payments/migrations, anti-sycophancy), **`fix`** (findings ledger → test-first fixes, one commit per finding, skip ledger for blind-risk items, re-review until convergence with bounded rounds). Theme catalog moved to [references/themes.md](code-review/references/themes.md) with two new corpus-grounded triggers: **13.4 Quality-Bar Regression** (suppressions added, tests skipped/deleted, assertions weakened, thresholds edited down — a build that passes because the bar was lowered is a regression, not a pass; Reject) and **16.5 Half-Applied Refactor Debris** (old+new coexist, orphaned helpers, debug scaffolding; Request Changes). Report gains "What's Good" and "Open Questions" sections; new pitfalls (generic-convention preaching, over-loading). Distilled from a 63-source agent-skill code-review corpus (fetched 2026-09-10, `.agents/artifacts/code-review-research/`); cross-pollination map recorded for the rest of the suite.
- **Test-Spec Immutability Theme (`code-review` v1.2.0)**: new **Theme 17 under Level 5 (Verification Integrity)** — 4 triggers pinning the spec–test relationship in review: test weakened to match broken behavior (Reject), spec edit hidden inside a fix commit (Reject), unexplained test modification (Request Changes), snapshot regenerated blind (Request Changes). The principle is stated in the skill: the test defines correct behavior — fix the implementation to match the spec, never the reverse; a genuinely wrong spec is changed as a deliberate, separately-reviewable spec decision, not a hunk inside a bug fix. Frontmatter gains trigger `(6)` (diffs touching tests/specs/snapshots), `test-spec-immutability` tag, and new openclaw triggers (`review test changes`, `tests weakened to pass`); review-output checklist and verification list gain test-spec integrity items; new Pitfall (spec-weakening tolerance); worked finding added to the sample review. Also fixed two latent drift bugs in the same pass: mode table and Step 2 heading still said "15-theme" after Theme 16 existed (now 17), and the Step 2 intro said "three levels of triggers" with four levels present (now five). Sources: agent-skill-eval `fix-failing-tests` ("test files define the correct behavior... never the other way around") and flightplanner `fp-fix` ("NEVER modifies spec files — the spec is the source of truth") from the 248-source corpus; closes the review-time loop with dead-letter's repro-pack spec note (v1.3.0). Registry surfaces synced (skills.json, llms.txt, README #4, per-skill README).
- **Cluster Triage Sweep (`dead-letter` v1.4.0)**: `dead-letter status` upgraded from a flat listing to a three-pass root-cause triage — **inventory** (open records, retry counts, ages; a 2+-retry open record is itself flagged as a process defect), **clustering** by root cause with four cluster keys in priority order (same root cause, same dependency/producer, same precondition, same surface), and **one verdict per cluster**: systemic (one fix covers all members; they resume at Recovery Sequence step 4 after it lands — never per-record retries), coincidental (split; own Recovery Decisions), cascade (fix the producer first, members hold as `BLOCKED-CASCADE-<code>`), or escalate-cluster (one escalation with the cluster as evidence for clusters ≥3 or any member with ≥2 retries). Clustering is explicitly on root cause, not error-string similarity — identical stack traces can hide different causes (new pitfalls: string-match clustering, retry storm on systemic clusters). Report is inline ≤40 lines and closes with a sweep action line (fixes / retries authorized / escalations); a sweep that authorizes retries for a systemic cluster has failed its purpose. Source: dic-skills nightly triage from the 248-source corpus; pairs with the coupling-router's DAG skip policy (wave dependents route here as `SKIP`, and a systemic cluster explains them in one verdict).
- **Repro Test Pack Generator (`dead-letter` v1.3.0)**: at close-out (Recovery Sequence step 6), deterministic failures (`FAILED-LOGIC`, `FAILED-TOOL`, stable-trigger `BLOCKED-*`) convert into a repro pack at `.agents/artifacts/repro-<slug>-<timestamp>/` — exact numbered reproduction steps, preconditions (data/env/config/versions), expected-vs-actual assertion pair, and a minimal failing test observed red against the un-fixed code (unseen red is a claim, not evidence). Explicit skip cases (transient/environment-dependent failures, fix already shipped, no test runner or external-system dependency), a spec-immutability note (if behavior is actually correct, fix the spec — never weaken the test to match broken behavior), and a worked example ([sample-repro-pack.md](dead-letter/examples/sample-repro-pack.md)) plus an updated sample record that shows a correctly-skipped pack. The capture that documents a failure becomes the regression test that prevents its recurrence; on recurrence, the pack is the parent record's evidence attachment. Registry surfaces synced (skills.json, llms.txt, README #15, per-skill README with full current record format).
- **Plan Hardening Pass (research-driven, 3 skills)**: upgrades distilled from a 248-source corpus of failure-handling, orchestration, and plan-evaluation agent skills (fetched and deduplicated in `.agents/artifacts/sde-research/`). **`coupling-router` v1.4.0** — the Plan-Evaluation Gate (v1.3.0) gains a **multi-perspective review** requirement for plans with ≥5 tasks: three review lenses in sequence (spec/devil's-advocate, coupling, failure — with per-wave recovery owner, dead-letter route, and dependent-skip policy); findings recorded against the plan, unresolved findings reject it, single-lens review only below 5 tasks. **`secretary` v1.3.0** — Delegation Control Gates gain **Wave Dispatch (DAG)**: same-wave independent tasks dispatch in parallel, a wave completes and validates before the next launches, and dependents on a failed parent are marked `SKIP` and routed to `dead-letter` (never dangling); new **Task Ledger** section (`.agents/secretary-tasks.json`, idempotent `next`/`set-status`/`verify` operations, verification receipts before `DONE`, state reconstructed from files + git history after context resets); new **Handoff Harvest** protocol with three tiers (standard post-phase, incremental delta-only, consolidation at session end — read ALL pending handoffs before saving any, deduplicate across them, then write once); Step 6 session handover now runs the consolidation harvest first; verification checklist extended (ledger receipts, no wave launched on an unresolved parent failure).
- **Recovery Hardening Pass (`dead-letter` v1.2.0)**: the Recovery Decision flow (v1.1.0) gains two mechanisms from the same corpus research — a **Recovery Sequence**: the ordered checklist (classify → decide → precondition → fix → verify-against-baseline → close) embedded in the record and marked step-by-step, making the record the single resume point for any retry (never an arbitrary step); and a **Baseline Reference**: path/commit/receipt of the last-known-good state, with the verification loop comparing retried output against it — a regression fails the round even when the exit code is clean. New pitfalls (improvised recovery order, clean-exit regression) and extended verification checks. Also fixed duplicated Verification-section lines left by v1.1.0.
- **Selection System (`skills.json` + `scripts/select-skills.ts`)**: the registry now carries three selection primitives — per-skill `scope` (`global`: agent-level, install once, works in any workspace — session continuity, orchestration, personal workflow, machine maintenance; `local`: per-project — docs, git lifecycle, review, design, audits), five top-level `categories[]` (core-engine, context-orchestration, quality-review, design-interface, reflection-maintenance), and named `selections{}` (`global`, `local`, `core`, `context`, `quality`, `design`, `reflect`, `minimal` — the smallest useful set: updatedocs, handoff, dead-letter, secretary). A zero-dependency Bun resolver (`bun scripts/select-skills.ts <selection> [--format names|install|json]`) turns a selection into the concrete skill list or copy-pasteable `npx skills add` commands; `list` prints the menu, unknown selections exit 2, and category ids, `all`, and individual skill names also resolve. Pinned by a hardening test (scope partition covers all 22 skills with no overlap, category selections are subsets, minimal resolves, unknown fails).

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
- **`periodic-retreat` Skill**: Quarterly strategic retreat facilitator. Operates across 4 scales to audit project vitality, systematically purge architectural debt, align with sovereign TELOS, and formulate next-quarter OKRs. Outputs `quarterly-retreat.md`.
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
