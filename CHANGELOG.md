# Changelog

All notable changes to this project are documented in this file.

## [7.9.0] - 2026-10-26

### Added

- **Nexus Technical Director & Sol Product Architect: AI Agent Evaluation Engine & Synthetic Edge Tester (`qa-launch:evals`)**:
  - **Agent Evaluation Playbook (`evals.md`)**: Enforces Synthetic Edge Test Battery generation across Boundary, Unicode/RTL, Concurrency/Idempotency, and Adversarial Injections (EVL-001); Dual-Model Blind Evaluator-Optimizer Loop with Consensus Scoring >= 8.5/10 and inter-judge delta <= 1.5 (EVL-002); Minimal Failing Repro Pack Scaffolder generating isolated fixtures and test scripts (EVL-003); and Golden Baseline Regression Scorecards enforcing >= 95% pass rate and zero golden regressions (EVL-004).
  - **Eval Runner CLI (`eval-runner.ts`)**: Built standalone CLI in `skills/agency-delivery/qa-launch/scripts/eval-runner.ts` supporting `--generate-edge`, `--evaluate-sample`, `--scaffold-repro`, `--regression-audit`, and `--json`.
  - **QA-Launch Mode Expansion**: Expanded `qa-launch` to 9 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 442 slash commands per harness.

- **Nexus Technical Director & Sol Product Architect: Dynamic MCP Server Governance & Tool Poisoning Defense (`muse-security:mcp-guard`)**:
  - **MCP Security Playbook (`mcp-guard.md`)**: Enforces OWASP MCP03 Tool Poisoning & Schema Injection scanning on all tool descriptions and parameter schemas (MCP-001); Transport Isolation & Network Perimeter Gate mandating stdio/IPC over unsafe wildcard or unauthenticated TCP listeners (MCP-002); Dynamic JIT Tool Hydration & Lazy Loading achieving 70%+ prompt token savings (MCP-003); and Ephemeral Token Fencing with automated credential exfiltration tripwires (MCP-004).
  - **MCP Sanitizer CLI (`mcp-sanitizer.ts`)**: Built standalone CLI in `skills/quality-review/muse-security/scripts/mcp-sanitizer.ts` supporting `--scan-manifest`, `--audit-config`, `--hydrate-tools`, `--audit-payload`, and `--json`.
  - **Muse-Security Mode Expansion**: Expanded `muse-security` to 8 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 441 slash commands per harness.

- **Crew Operations & Nexus Quality Review: Client Health Telemetry & Churn Early Warning Radar (`retain:health`)**:
  - **Health Playbook (`health.md`)**: Enforces Tri-Vector Health Scoring mathematically triangulating Product & Deliverable Telemetry (40%), Relationship & CSAT Sentiment (30%), and Financial & Payment Velocity (30%) (HLT-001); Churn Early Warning Radar categorizing accounts into Green (>=75, expansion ready), Amber (50-74, proactive pulse), and Red (<50, critical alert) (HLT-002); 48-Hour Stop-the-Clock Intervention Protocol freezing billing and SLA penalties while executing executive alignment and corrective action plans (HLT-003); and Executive Health Scorecard & Net Retention Rate (NRR) Modeling benchmarking against >=115% expansion targets (HLT-004).
  - **Health Telemetry CLI (`client-health-telemetry.ts`)**: Built standalone CLI in `skills/agency-delivery/retain/scripts/client-health-telemetry.ts` supporting `--calc-health`, `--audit-account`, `--scorecard`, `--scaffold-cap`, `--calc-nrr`, and `--json`.
  - **Retain Mode Expansion**: Expanded `retain` to 10 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 440 slash commands per harness.

- **Jasper Creative Division: Direct-Response UGC Video Scripting & Creator Brief Engine (`content:ugc`)**:
  - **UGC Playbook (`ugc.md`)**: Enforces 4-Hook Matrix for algorithmic split-testing across Negative Curiosity, Direct Problem, Unpopular Opinion, and Before/After payoffs (UGC-001); Jasper 5-Beat Narrative Storyboard Spine spanning 0-3s Hook, 3-8s Agitated Problem, 8-15s Discovery Pivot, 15-25s Proof & Demo, and 25-30s Frictionless CTA (UGC-002); Retention Pacing and 9:16 Vertical Safe Zones with 130-160 WPM delivery, 2.0-3.5s visual cut cadence, and platform icon boundary fences (UGC-003); and Production-Ready Creator Brief Export with rigid technical specs, DOs/DON'Ts, shot lists, and native caption copy (UGC-004).
  - **UGC Generator CLI (`ugc-generator.ts`)**: Built standalone CLI in `skills/agency-delivery/content/scripts/ugc-generator.ts` supporting `--scaffold-ugc`, `--score-pacing`, `--export-brief`, `--audit-script`, and `--json`.
  - **Content Mode Expansion**: Expanded `content` to 12 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 439 slash commands per harness.

- **Automation & Real-Time Telephony: High-Concurrency Voice Agent Bridge (`automation:voice`)**:
  - **Voice Bridge CLI (`voice-bridge.ts`)**: Built standalone CLI in `skills/agency-delivery/automation/scripts/voice-bridge.ts` enforcing sub-600ms latency budgets with TTFT backchanneling (VOC-001), mandatory two-party consent notice and TCPA/E.164 compliance (VOC-002), hot telephony provider failover in <1200ms (VOC-003), and live sentiment scoring with automated human warm transfer (VOC-004).

- **Coupling Router: Federated Worktree Lease Arbitration & Safe Quarantine (`coupling-router:federation`)**:
  - **Federation CLI (`worktree-federation.ts`)**: Enhanced worktree federation with advisory lock acquisition, 300s TTL pulse daemon, dirty WIP safe quarantine (`refs/quarantine/*`), and auto-namespacing (`--namespaced`).

- **Core Engine & DOX Scaffolding: Universal GitHub Templates & Intelligent Archetype Pruning (`updateagents` & `new-project`)**:
  - **Universal GitHub Templates**: Provisioned starter templates including `FUNDING.yml` (multi-platform sponsor configs), `codeql.yml` (CodeQL static analysis), `trivy.yml` (container and dependency vulnerability scanning), `docs-sync.yml` (POSIX documentation link integrity), and `ai-slop.yml` (automated PR scan for synthetic placeholders and LLM residue).
  - **Intelligent Archetype Pruning Protocol**: Added `auditProjectArchetypePruning` to `github-scaffold.ts` dynamically auditing and recommending file pruning based on project archetypes (`agency-client`, `oss-library`, `internal-tool`).

- **Sol Product Architect: Production Telegram Webhook Ingress & Idempotent Event Receiver (`telegram:webhook`)**:
  - **Webhook Playbook (`webhook.md`)**: Enforces Pure-Runtime Webhook Listener with `/webhook` receiver, `/healthz` and `/ready` probes, zero external framework dependencies, and graceful shutdown handling (WBK-001); Constant-Time Secret Token Header Gate verifying `X-Telegram-Bot-Api-Secret-Token` via `crypto.timingSafeEqual` with minimum 32-character high-entropy secret token requirements and mandatory HTTPS ingress (WBK-002); Replay Attack & Timestamp Drift Mitigation with sliding time-window verification (`max_drift_seconds: 300`) and LRU deduplication cache for Telegram `update_id`s (WBK-003); and Idempotent Event Ingestion & Fast HTTP 200 OK Acknowledgement (< 200ms) with asynchronous decoupling of update dispatching to memory/Redis/Kafka streams (WBK-004).
  - **Webhook Receiver CLI (`webhook-receiver.ts`)**: Built standalone CLI in `skills/agency-delivery/telegram/scripts/webhook-receiver.ts` supporting `--listen-webhook`, `--verify-secret`, `--register-webhook`, `--audit-config`, `--scaffold-receiver`, `--generate-secret`, and `--json`.
  - **Telegram Mode Expansion**: Expanded `telegram` to 7 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 438 slash commands per harness.

- **Sol Product Architect: Universal Mobile App & Expo SDK 52 Architecture (`mobile:expo`)**:
  - **Expo Universal Playbook (`expo.md`)**: Enforces Modern Expo SDK 52 Universal Architecture with file-based routing via `expo-router` v4, Hermes engine, `newArchEnabled: true`, edge-to-edge Android 15 support, and iOS 15.1+ minimum deployment target (EXP-001); NativeWind v4 & OKLCH Theme Integration with CSS compiled to React Native StyleSheets and safe area insets fencing via `useSafeAreaInsets` (EXP-002); Deep Linking & Universal Links / App Links Architecture with custom app schemes, iOS `applinks:<domain>`, Android `assetlinks.json`, and auth/payment callback routes (EXP-003); and Native Hardware Access & Ephemeral Mocking Fences for Camera, SecureStore, Haptics, and LocalAuthentication with simulator fallbacks (EXP-004).
  - **Expo Scaffold CLI (`expo-scaffold.ts`)**: Built standalone CLI in `skills/agency-delivery/mobile/scripts/expo-scaffold.ts` supporting `--scaffold-app`, `--audit-app`, `--verify-deep-links`, and `--json`.
  - **Mobile Mode Expansion**: Expanded `mobile` to 7 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 437 slash commands per harness.

- **Agency Operations & Media Buying: Omnichannel Blended CAC & ROAS Attribution Triangulation (`paidads:roas`)**:
  - **ROAS Architecture Playbook (`roas.md`)**: Enforces Omnichannel Blended CAC and Marketing Efficiency Ratio (MER) Triangulation with an absolute MER floor $\ge 3.0\times$ (target $\ge 4.5\times$) and Blended CAC payback $\le 90\text{ days}$ (ROAS-001); In-Platform ROAS Haircut Discounts (Meta $-25\%$, Google PMax/Brand $-35\%$, TikTok $-30\%$) and Contribution Margin protection ($> 20\%$) (ROAS-002); 4-Tier Ad Spend Pacing & Scaling Gates (max $+20\%$ per 48h, emergency circuit breaker throttling spend 50% if MER $< 2.0\times$) (ROAS-003); and Post-iOS 14 Server-Side Tracking & First-Party Data Hygiene (CAPI) with EMQ $\ge 7.5/10$ (ROAS-004).
  - **ROAS Calculator CLI (`roas-calculator.ts`)**: Built standalone CLI in `skills/agency-delivery/paidads/scripts/roas-calculator.ts` supporting `--calc-mer`, `--triangulate-roas`, `--audit-spend`, `--scaffold-pacing`, and `--json`.
  - **PaidAds Mode Expansion**: Expanded `paidads` to 12 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 436 slash commands per harness.

- **Jasper Creative Division: Viral Loop Coefficient & Referral Mechanics Engine (`growth:viral`)**:
  - **Viral Loop Playbook (`viral.md`)**: Enforces Mathematical $K$-Factor Triangulation ($K = i \times c$) modeling exponential virality ($K \ge 1.0$) and organic amplification multipliers ($\frac{1}{1 - K}$) with a $K \ge 0.15$ viability floor (VIR-001); Viral Cycle Time ($ct$) compression fences mandating $ct \le 72\text{h}$ with frictionless invitee landings (VIR-002); Asymmetric Double-Sided Incentive Architecture with instant invitee gratification and milestone/activation-gated inviter rewards plus anti-sybil fraud defense (VIR-003); and Contextual "Aha!" Trigger Placement banning cold asks at signup and anchoring referral prompts to dopamine peak moments (VIR-004).
  - **Viral Engine CLI (`viral-engine.ts`)**: Built standalone CLI in `skills/agency-delivery/growth/scripts/viral-engine.ts` supporting `--calc-k`, `--simulate-loop`, `--audit-referral`, `--scaffold-incentives`, and `--json`.
  - **Growth Mode Expansion**: Expanded `growth` to 12 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 435 slash commands per harness.

- **Nexus Technical Director: Core Web Vitals Auditor & Production Gate (`qa-launch:vitals`)**:
  - **Core Web Vitals Playbook (`vitals.md`)**: Enforces Sub-200ms INP Gate with main-thread long task decomposition and mandatory passive/throttled event listeners (VIT-001); Zero-CLS Layout Shift Fences with explicit image/media dimensions, CSS `aspect-ratio`, and pre-reserved dynamic slot containers (VIT-002); Sub-2.5s LCP Boundary prioritizing hero assets with `fetchpriority="high"`, `loading="eager"`, and zero render-blocking script waterfalls (VIT-003); and Web Font FOUC/FOIT Elimination with `font-display: swap/optional`, WOFF2-only payloads, and 100KB budget certification (VIT-004).
  - **Vitals Guard CLI (`vitals-guard.ts`)**: Built standalone CLI in `skills/agency-delivery/qa-launch/scripts/vitals-guard.ts` supporting `--audit-vitals`, `--check-cls`, `--check-inp`, `--check-lcp`, `--check-fonts`, and `--json`.
  - **QA-Launch Mode Expansion**: Expanded `qa-launch` to 8 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 434 slash commands per harness.

- **Jasper Creative Division: Omnichannel 30-Day Content Matrix & Editorial Engine (`smm:calendar`)**:
  - **Editorial Architecture Playbook (`calendar.md`)**: Enforces 30-day Omnichannel Matrix Architecture balancing the 40/30/20/10 content pillar ratio across LinkedIn, X, Instagram, and YouTube (CAL-001); CORE-EEAT & 18-token standalone quotability gate for AI Engine Optimization and social shares (CAL-002); 1-to-5 Pillar Asset Repurposing Multiplier generating native platform cuts from technical case studies (CAL-003); and Anti-Fatigue Cadence with weekly reactive slack buffers and 7-day draft lead times (CAL-004).
  - **Calendar Matrix CLI (`calendar-matrix.ts`)**: Built standalone CLI in `skills/agency-delivery/smm/scripts/calendar-matrix.ts` supporting `--scaffold-matrix`, `--audit-schedule`, `--repurpose-cascade`, and `--json`.

- **Agency Financial Operations: Value-Based Pricing Architecture & Profitability Calculator (`accounts:pricing`)**:
  - **Pricing Architecture Playbook (`pricing.md`)**: Enforces Value-Based Pricing Triangulation with min 5.0x client ROI requirement and 10–20% economic value capture (PRC-001); Delivery Model Architecture Matrix comparing Fixed-Scope Milestones (50% deposit, 20% contingency buffer, 48h Stop-the-Clock) vs Dedicated Weekly Sprint Retainers vs Performance Hybrid (PRC-002); Guaranteed Gross Margin Floor (>= 55%) and minimum Effective Hourly Rate ($125/hr floor) (PRC-003); and standardized 3-Tier Proposal Pricing Schedule generation (PRC-004).
  - **Pricing Calculator CLI (`pricing-calculator.ts`)**: Built standalone CLI in `skills/agency-delivery/accounts/scripts/pricing-calculator.ts` supporting `--calc-model`, `--audit-quote`, `--scaffold-pricing-schedule`, and `--json`.
  - **Accounts Mode Expansion**: Expanded `accounts` to 8 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 433 slash commands per harness.

- **Full-Stack Web Engineering: Progressive Web App & Offline Architecture (`webdev:offline`)**:
  - **PWA Architecture Playbook (`offline.md`)**: Enforces Two-Tier Caching Architecture with `CacheFirst` for static immutable hashed assets and `NetworkFirst` with 3s timeout for dynamic documents and APIs (PWA-001); Offline Form Mutation Queue with IndexedDB persistence, UUID idempotency tokens, and optimistic UI state badging (PWA-002); Background Sync & Auto-Reconnection Lifecycle with full jitter backoff (PWA-003); and Manifest & Installation Compliance with standalone display, maskable icons, and OKLCH token sync (PWA-004).
  - **Service Worker Generator CLI (`sw-generator.ts`)**: Built standalone CLI in `skills/agency-delivery/webdev/scripts/sw-generator.ts` supporting `--generate-sw`, `--generate-manifest`, `--audit-pwa`, and `--json`.
  - **WebDev Mode Expansion**: Expanded `webdev` to 21 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 432 slash commands per harness.

- **Quality Assurance & Pre-Launch: Playwright Synthetic User Journey & Headless Smoke Runner (`qa-launch:e2e`)**:
  - **E2E Architecture Playbook (`e2e.md`)**: Enforces Semantic & Accessible Locators First (`getByRole`, `getByLabel`, `getByText`, explicit `data-testid` fallback, banning brittle CSS hierarchy, Tailwind classes, and XPath) with zero arbitrary sleeps (E2E-001); Critical Journey Smoke Matrix covering guest-to-auth, shopping-to-checkout, onboarding funnel, password reset, and account deletion/compliance (E2E-002); State Isolation & Ephemeral Seeding with dynamic run tokens, storage state reuse, and deterministic teardown (E2E-003); and Visual & Network Artifacts with trace on first retry, failure screenshots, and console/5xx error guards (E2E-004).
  - **E2E Runner CLI (`e2e-runner.ts`)**: Built standalone CLI in `skills/agency-delivery/qa-launch/scripts/e2e-runner.ts` supporting `--audit-selectors`, `--scaffold-journey`, `--smoke-check`, and `--json`.
  - **QA-Launch Mode Expansion**: Expanded `qa-launch` to 7 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 431 slash commands per harness.

- **Retainer Contract Renewal & Scope Expansion Engine (`retain:renewal`)**:
  - **Renewal Architecture Playbook (`renewal.md`)**: Enforces proactive 60-day calendar sequence (T-60 audit, T-45 champion alignment, T-30 proposal, T-14 lock) (RNW-001); cumulative economic impact & verified ROI receipts ledger with >= 3.0x return requirement (RNW-002); three-tier expansion proposal architecture (Baseline, Velocity +25%, and Dedicated Pod +75%) (RNW-003); and scope creep retro recalibrating EHR and pricing floors to guarantee >= 55% gross margin (RNW-004).
  - **Renewal Engine CLI (`renewal-engine.ts`)**: Built standalone CLI in `skills/agency-delivery/retain/scripts/renewal-engine.ts` supporting `--scaffold-renewal`, `--audit-contract`, and `--roi-ledger`.
  - **Retain Mode Expansion**: Expanded `retain` to 9 active modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 430 slash commands per harness.

- **Jasper Creative Division: Video Sales Letter Script & Storyboard Engine (`content:vsl`)**:
  - **VSL Architecture Playbook (`vsl.md`)**: Enforces the 3-second tri-layer retention hook (VSL-001); Jasper's 6-beat narrative spine (Pattern Interrupt, Villain, Paradigm Shift, Unique Mechanism, Proof Stacking, and Dual CTA) (VSL-002); mandatory Two-Column Audio/Visual storyboard production tables with visual cues and verbatim dialogue (VSL-003); and conversational WPM pacing gates (130–145 WPM) with strict anti-slop buzzword bans (VSL-004).
  - **VSL Generator CLI (`vsl-generator.ts`)**: Built standalone CLI in `skills/agency-delivery/content/scripts/vsl-generator.ts` supporting `--scaffold-vsl`, `--audit-script`, and `--timing`.
  - **Content Mode Expansion**: Expanded `content` to 11 active modes (13 dispatch references), updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 429 slash commands per harness.

- **Server-Side Event Ingestion & Privacy Scrubber (`analytics:events`)**:
  - **Event Ingestion Playbook (`events.md`)**: Enforces edge PII scrubbing for emails, phone numbers, auth secrets, and credit cards (EVT-001); strict JSON schema validation, Object-Action snake_case naming, and deterministic SHA-256 idempotency deduplication (EVT-002); dual-rail transport with browser sendBeacon and non-blocking edge queue ingestion under 15ms (EVT-003); and deterministic multi-touch attribution preserving UTM parameters and referring campaigns (EVT-004).
  - **Event Collector CLI (`event-collector.ts`)**: Built standalone CLI in `skills/agency-delivery/analytics/scripts/event-collector.ts` supporting `--validate`, `--scrub`, `--fingerprint`, and `--generate-payload`.
  - **Analytics Mode Expansion**: Expanded `analytics` to 7 modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 428 slash commands per harness.

- **Wave 23 Workspace Terrain Engine & Absolute Sovereignty**:
  - **Zero-LifeOS Policy**: Completely purged all legacy `@LIFEOS` imports, paths, and tool calls across all skills, templates, and root `AGENTS.md`.
  - **Standalone Vibeguard Secret Scanner (`secret-scan.ts`)**: Autonomous pre-ship secret scanner in `skills/quality-review/muse-security/scripts/secret-scan.ts` and `scripts/secret-scan.ts` (`bun run secret-scan .`), detecting tokens (`sk-*`, `ghp_*`), private keys, and database connection strings using native regex with zero external dependencies.
  - **Workspace Terrain Maps**: Six canonical workspace terrain templates added in `skills/core-engine/updateagents/templates/.agents/terrain/`: `stack.md`, `habits.md`, `ownership.md`, `packages.md`, `repo.md`, and `logs.md`. Scaffolding wired into `new-project` Stage 1 and Stage 5/6.
  - **Terrain Audit Engine (`terrain-audit.ts`)**: Added Asset 14 to `updateagents` (`skills/core-engine/updateagents/scripts/terrain-audit.ts`) auditing terrain maps for missing files, credential leaks, and hardcoded machine paths.
  - **Commitment & Milestone Tracking (`commitment-sweep.ts`)**: Absorbed into `evidence-ledger` (`skills/context-orchestration/evidence-ledger/scripts/commitment-sweep.ts` via `/evidence sweep`) to detect client milestones, deliverables, 48h clock-stop triggers, and overdue warnings.
  - **Wisdom Compounding Engine (`wisdom-updater.ts`)**: Absorbed into `coach` and `periodic-retreat` (`skills/reflection-maintenance/coach/scripts/wisdom-updater.ts` and `skills/reflection-maintenance/periodic-retreat/scripts/wisdom-updater.ts`) for weekly retrospective compounding into Muse Memory.
  - **Host Vitals Inspector (`host-vitals.ts`)**: Absorbed ATLAS machine inventory into `clean-system-cache` (`skills/reflection-maintenance/clean-system-cache/scripts/host-vitals.ts`) deterministically inspecting CPU, GPU, kernel, display resolution, and memory.
  - **Dual-Scope Memory Architecture**: Documented strict contract prohibiting direct YAML edits across `evidence-ledger`, `context-anchor`, `secretary`, and `relay`.
- **Database Zero-Downtime Migration & Locking Guard (`database:migrations`)**:
  - **DDL Lock Simulation & Guard Engine (`migration-guard.ts`)**: Added CLI and engine in `skills/agency-delivery/database/scripts/migration-guard.ts` simulating Postgres/MySQL/SQLite DDL lock levels (Levels 1–8), blocking table rewrites, enforcing `lock_timeout`, requiring `CONCURRENTLY` for index operations, non-blocking foreign key addition with `NOT VALID` / `VALIDATE CONSTRAINT`, and scanning unindexed foreign keys on child tables to prevent catastrophic SHARE locks.
  - **Migration Playbook (`references/migrations.md`)**: Full zero-downtime database migration doctrine covering the 5-phase Expand/Contract deployment pattern, lock matrix, safe column/table operations, and batch backfilling.
  - **Database Mode Expansion**: Expanded `database` to 11 modes with `database:migrations` routing and synchronized `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 412 slash commands per harness.
- **Subagent Tenant Boundary & Worktree Isolation Auditor (`muse-security:boundary`)**:
  - **Boundary Audit Engine (`boundary-audit.ts`)**: Added CLI and engine in `skills/quality-review/muse-security/scripts/boundary-audit.ts` auditing 5 core isolation invariants: symlink workspace escapes (BND-001), shared git worktree lease collisions and stale heartbeats (BND-002), file permission fences for keys and environment configs (BND-003, BND-004), process argv credential scrubbing (BND-005), and cross-client directory traversal (BND-006).
  - **Boundary Mode Playbook (`references/boundary.md`)**: Complete subagent sandboxing reference documenting POSIX permission fences, lease arbitration, and multi-tenant isolation.
  - **Security Mode Expansion**: Expanded `muse-security` to 7 modes, updating `skills.json`, `llms.txt`, and `secretary/references/dispatch.md`. Command surface increased to 413 slash commands per harness.
- **Jasper Creative Division: GSAP Animation Mode (`animate:gsap`)**:
  - **GSAP 3 Choreography Engine**: Promoted `animate:gsap` to a primary routed mode in `animate` (`skills/design-interface/animate/references/gsap.md`).
  - **ScrollTrigger & FLIP Layouts**: Documented layout pinning with `anticipatePin: 1` anti-jump, `fastScrollEnd`, `gsap/Flip` morphing, and `useGSAP()` automatic lifecycle cleanup.
  - **Reduced-Motion Invariants**: Enforced strict `prefers-reduced-motion: reduce` gates with `gsap.matchMedia()` falling back to instant/static reveals.
- **Client Proposal & Pitch Generator (`client-comms:proposal`)**:
  - **High-Converting Proposal Architecture (`proposal.md`)**: Added B2B proposal and pitch deck generator in `skills/agency-delivery/client-comms/references/proposal.md` supporting Jasper's PAS, AIDA, and QUEST copywriting frameworks, answer-first executive summaries, and Core-EEAT/AEO structure.
  - **Stop-the-Clock Terms**: Contractual 48-hour Stop-the-Clock protocol holding target delivery dates day-for-day upon pending client dependencies.
  - **Milestone Definition of Done Receipts**: Explicit milestone delivery proof gates (Figma signoff, staging URL, clean test run, Lighthouse >= 90).
  - **Proposal Scaffolder CLI**: Added `--proposal` and `--scaffold-proposal` flag to `client-comms.ts` supporting `--client`, `--project`, and `--framework` with JSON/Markdown output.
  - **Command Surface & Dispatch**: Expanded `client-comms` to 8 modes, incrementing command surface to 414 slash commands per harness.
- **Conversion-Rate Optimizer (`growth:cro`)**:
  - **Landing Page CRO Engine (`cro.md`)**: Added autonomous conversion-rate optimization playbook in `skills/agency-delivery/growth/references/cro.md` covering the 5-Second hero test, above-the-fold visual hierarchy (1440px desktop & 390px mobile), and 18-token standalone quotability rule.
  - **5-State Anti-Slop Copy Gate**: Enforced rigorous transformation standards eliminating corporate buzzwords ("game-changing", "supercharge", "all-in-one") in favor of quantified user superpower metrics.
  - **CTA Contrast & Mobile Thumb-Zone**: Enforced WCAG AAA (>= 7:1) / AA (>= 4.5:1) text-to-button contrast, 48px touch targets, and sticky bottom thumb-zone bars on mobile.
  - **Form Friction Reduction & Trust Halos**: Enforced <= 4 inputs for lead capture, progressive multi-step disclosure, inline validation on blur, and CTA trust halos within 24px.
  - **Quantitative CRO Scorecard**: Added 100-point heuristic evaluation rubric across Hero Value Density, Anti-Slop Copy, CTA Physics, Form Friction, and Trust Proof.
  - **Command Surface & Dispatch**: Expanded `growth` to 12 modes, incrementing command surface to 415 slash commands per harness.
- **Full-Stack Edge & Rate Limiting Architecture (`webdev:edge` & `webdev:rate-limit`)**:
  - **Edge Runtime Architecture (`edge.md`)**: Added serverless edge computing reference implementing Hono v4 type-safe routers, Cloudflare D1 parameterized SQL queries (`db.prepare().bind().all()`), SWR edge KV caching, and sub-10ms cold start invariants.
  - **Edge Rate Limiting & Abuse Defense (`rate-limit.md`)**: Implemented sliding-window counter algorithm protecting against boundary-burst exploits, IETF RateLimit headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `Retry-After`), tiered route limits (`auth`: 5/min, `ai`: 20/min, `api`: 120/min), and honeypot bot tarpit defenses.
  - **Command Surface & Dispatch**: Expanded `webdev` to 20 modes, incrementing command surface to 417 slash commands per harness.
- **Realtime Event Streaming & SSE Architecture (`automation:realtime`)**:
  - **Realtime Streaming Playbook (`realtime.md`)**: Added comprehensive streaming architecture reference covering bidirectional WebSockets (`ws://`/`wss://`) and lightweight Server-Sent Events (`text/event-stream`), SSE heartbeat frames (`: ping\n\n`), connection lifecycle states, and tenant-isolated channel authorization.
  - **Resilient Reconnection Engine**: Implemented exponential backoff with full jitter algorithm (`min(maxBackoff, baseBackoff * 2^attempt) * random()`) preventing reconnect storms and thundering herd failures.
  - **Command Surface & Dispatch**: Expanded `automation` to 10 modes, incrementing command surface to 418 slash commands per harness.
- **Agency Financial Hardening & Automated Dunning (`accounts:dunning`)**:
  - **Delinquency Escalation Playbook (`dunning.md`)**: Added multi-tier automated debt recovery ladder (Day 1 courtesy reminder, Day 7 formal notice with 1.5% late interest terms, Day 14 pause-on-delinquency trigger, Day 30 formal demand letter and legal escalation).
  - **Payment Gateway Smart Retries**: Integrated machine learning retry configuration and webhook pipelines (`invoice.payment_failed`, `charge.failed`, `customer.subscription.deleted`) for automated recovery and self-serve billing portal generation.
  - **Pause-on-Delinquency Infrastructure**: Enforced Cloudflare Worker HTTP 402 staging preview interception, GitHub Action PR merge blocking on client workstreams, and sprint stop-the-clock freezes.
  - **Statutory Tax Credit & Bad Debt Write-Off**: Standardized GST/VAT statutory Credit Note generation (`CN-YYYY-XXXX`) to reclaim remitted sales tax alongside GAAP/IFRS bad debt write-off journal entries.
  - **Command Surface & Dispatch**: Expanded `accounts` to 7 modes, bumping version to 1.4.0 and incrementing command surface to 419 slash commands per harness.
- **Multi-Client Context Vault & Asset Fencing (`ops:vault`)**:
  - **Context Vault Architecture (`vault.md`)**: Added enterprise multi-client context vault playbook enforcing airtight directory segregation (`~/Projects/clients/<brand>/`), brand asset isolation, worktree lease arbitration, and multi-tenant credential masking.
  - **The 5 Vault Invariants (VLT-001–VLT-005)**: Formalized absolute directory fences, canonical brand asset naming (`<brand>-<category>-<desc>.<ext>`), shared worktree lease heartbeats, tenant-scoped token redaction (`[REDACTED:<CLIENT_SLUG>:<SERVICE>]`), and 4-step context switch flush.
  - **Command Surface & Dispatch**: Expanded `ops` to 15 modes, bumping version to 1.7.0 and incrementing command surface to 420 slash commands per harness.
- **Client Retainer SLAs & Warranty Governance (`retain:sla`)**:
  - **Retainer SLA Playbook (`sla.md`)**: Added comprehensive post-launch warranty and ongoing retainer governance covering 30-day bug warranty boundaries, Tiered Retainer SLAs (P1 < 1h, P2 < 4h, P3 < 24h, P4 < 48h), and client redirection scripts.
  - **The Bug vs Enhancement Triage Gate**: Enforced deterministic 3-part defect invariant (verifiable non-conformance, deterministic reproducibility, zero environmental modification) versus billable enhancement scope.
  - **Capacity Burn-Down & Roll-Over Governance**: Established pacing alerts at 50%, 80%, and 100% capacity burn, alongside strict 20% roll-over ceiling with 60-day expiration rules.
  - **Command Surface & Dispatch**: Expanded `retain` to 8 modes, bumping version to 1.1.0 and incrementing command surface to 421 slash commands per harness.
- **Multi-Tenant Worktree Federation & Fleet Manager (`coupling-router:federation`)**:
  - **Federation Engine (`worktree-federation.ts`)**: Built autonomous multi-client worktree discovery, spawning, lease binding, and safe lifecycle sweeping CLI.
  - **The 4 Federation Invariants (FED-001–FED-004)**: Enforced Zero-Branch Collision prevention across concurrent subagents, hermetic environment fencing without `.env` secret leakage, worktree heartbeat leasing, and safe pruning preserving dirty WIP.
  - **Federation Playbook (`federation.md`)**: Complete operating doctrine covering multi-tenant fleet discovery, lifecycle states (`ACTIVE`, `IDLE`, `DIRTY_LOCKED`, `STALE`), and schema specification.
  - **Command Surface & Dispatch**: Bumped `coupling-router` to 1.5.0 and incrementing command surface to 422 slash commands per harness.
- **Programmatic SEO Engine & Schema Automation (`seo:programmatic`)**:
  - **Programmatic Landing Page Architecture (`programmatic.md`)**: Added dataset-driven landing page scaling playbook covering directory archetypes, SaaS comparison matrices, and integration hubs.
  - **The 4 Anti-Thin Content Invariants (PSE-001–PSE-004)**: Enforced 30% unique non-templated data density threshold, search intent deduplication, dynamic contextual FAQ generation, and above-the-fold answer-first hierarchy.
  - **Dynamic Schema.org & Sitemap Partitioning**: Implemented automated JSON-LD structured data (`BreadcrumbList`, `FAQPage`, `SoftwareApplication`) and segmented `<sitemapindex>` partitioning (≤ 10k URLs per file) with phased cohort indexation pacing.
  - **Command Surface & Dispatch**: Expanded `seo` to 8 modes, bumping version to 1.4.0 and incrementing command surface to 423 slash commands per harness.
- **Client Onboarding Questionnaire Ingestion & Vault Scaffolding (`client-comms:intake`)**:
  - **Client Intake Pipeline (`intake.md`)**: Added automated questionnaire ingestion, normalizing conversational client inputs into structured technical briefs, SLA tiers, and bilateral scope partitions.
  - **The 4 Intake Invariants (INT-001–INT-004)**: Enforced Zero-Jargon normalization, Bilateral Scope Fencing (`inScope` vs `outOfScope` Anti-Scope Fence), Client Vault Auto-Scaffolding (`profile.json`, `boundary.json`, `brief.md`, `dependencies.md`), and the 48-Hour Stop-The-Clock protocol.
  - **Intake & Vault Scaffolding CLI**: Added `--intake` CLI flag to `client-comms.ts` supporting `--client-id`, `--scaffold-dir`, and `--json`.
  - **Command Surface & Dispatch**: Expanded `client-comms` to 9 modes, bumping version to 1.5.0 and incrementing command surface to 424 slash commands per harness.
- **Real-Time Multi-Channel Notification & Alert Router (`automation:alerts`)**:
  - **Multi-Channel Alert Router (`alerts.md`)**: Added real-time notification engine dispatching structured alerts across Discord, Slack, and Telegram with 4-tier priority escalation (P1–P4).
  - **The 4 Alert Routing Invariants (ALT-001–ALT-004)**: Enforced Zero-Spam Sliding-Window Deduplication (fingerprinting with occurrence aggregation `[x8 in 5m]`), 4-Tier Priority Matrix (P1 Catastrophic, P2 High, P3 Warning, P4 Info), Native Multi-Platform Payload Formatting (Discord rich embeds with tier colors, Slack Block Kit, Telegram semantic HTML), and Failure-Safe Circuit Breaker with dead-letter queue fallback.
  - **Alert Router CLI (`alert-router.ts`)**: Built autonomous CLI engine in `skills/agency-delivery/automation/scripts/alert-router.ts` supporting `--dispatch`, `--format`, `--dedup-check`, and JSON output.
  - **Command Surface & Dispatch**: Expanded `automation` to 11 modes, bumping version to 1.3.0 and incrementing command surface to 425 slash commands per harness.
- **Living Deliverable Edge Previews & Client Portals (`devops:preview`)**:
  - **Living Deliverable Playbook (`preview.md`)**: Added ephemeral edge preview container workflow running local `workerd` / Miniflare instances coupled with Cloudflare Quick Tunnels.
  - **The 4 Living Deliverable Invariants (PRV-001–PRV-004)**: Enforced Zero Cloud Overhead & local edge execution, Cryptographic Token-Gated Ingress (HTTP 401 Unauthorized rejection on missing/invalid review tokens), Deterministic 48-Hour TTL Expiration (terminating with HTTP 410 Gone post-TTL), and Non-Destructive Review Overlay with responsive viewport frame switcher (Mobile 390px, Tablet 820px, Desktop 100%) and client feedback ingestion.
  - **Living Deliverable CLI**: Wire `--scaffold` and `--check-expiry` in `devops/scripts/living-deliverable.ts`.
  - **Command Surface & Dispatch**: Expanded `devops` to 9 modes, bumping version to 1.3.0 and incrementing command surface to 426 slash commands per harness.
- **Brand Asset Fencing, Font License Isolation & Contrast Certification (`brand:assets`)**:
  - **Brand Asset Architecture (`assets.md`)**: Added brand asset governance and quality assurance playbook covering vector sanitization, font packaging, and accessibility compliance.
  - **The 4 Brand Asset Invariants (BAS-001–BAS-004)**: Enforced Brand Asset Isolation & Fencing (`.agents/brand/<client-slug>/` with `<client>-<category>-<desc>.<ext>` naming), Modern Webfont & License Packaging Gate (`.woff2` requirement, desktop conversion alerts, font-display swap), Vector SVG Sanitization & ViewBox Integrity (strips stored XSS, script tags, event handlers, and embedded base64 raster bloat), and Color Palette & OKLCH Contrast Certification (WCAG 2.2 AA/AAA 4.5:1/7.0:1 gates).
  - **Asset Auditor CLI (`asset-auditor.ts`)**: Built autonomous CLI engine in `skills/agency-delivery/brand/scripts/asset-auditor.ts` supporting `--audit-dir`, `--sanitize-svg`, `--contrast`, `--check-font`, and JSON output.
  - **Command Surface & Dispatch**: Expanded `brand` to 10 modes, bumping version to 1.1.0 and incrementing command surface to 427 slash commands per harness.

## [7.8.0] - 2026-10-25

### Added

- **Audit modes for the deferred batch where they genuinely help — 39 of 46 skills now ship one**: `humanize:audit` (prose audit graded on **structural signals** — the durable signal per the SlopShape study, where word-level detection is brittle under rewording — with a false-positive guard, since human readers score near chance; grounded in Wikipedia's *Signs of AI writing* field guide, SlopShape, Reinhart et al. PNAS 2025, RAID); `new-project:audit` (post-provision certification of a project's agent infrastructure on the readiness-level lens — L1 Baseline → L4 Optimized, evidence per check, skipped-checks-excluded and contiguous-level rules from the Larridin/Kodus/agent-readiness frameworks); `relay:audit` (handoff trustworthiness: verify handoff claims against live state per the state-source ladder — "the audit matters more than the plan" — five-section completeness, executable-by-a-stranger test, spot check; grounded in Eon's DR-audit doctrine and Tallyfy's verification mechanics). Judgment-driven exclusions stand: `dead-letter` (its `sweep-protocol` mode *is* the audit) and `coupling-router` (its `coupling-matrix` mode is) — 7 of 46 skills documented audit-free. Command surface: 46 skills + 355 `<skill>-<mode>` commands + 10 aliases = **411 per harness**.
- **`skill:mode` rows promoted to routed Modes tables (#256)**: `content:thumbnails`, `ops:contracts`, `smm:creator-vetting`, `client-comms:inbox-triage`, and `updateagents:onboard` gained routed quick-commands rows (they counted as routable modes in dispatch and the README but were invisible on each skill's own surface); `updatedocs:audit`'s row now references its actual `references/audit.md` instead of prose.

### Changed

- **Dogfood adoption (#255)**: this repo's sync run provisioned its own `.github/workflows/landing-gate.yml` (now committed — the repo runs the exact gate every scaffolded project gets), and the repo's local `git-workflow.md` standard hand-adopted the derived-artifact invariant with real branch names; `worktree-lease.ts` exec hardened to argv-array signature. **Engine finding recorded**: the sync engine treats existing standards as curated and never refreshes their content — adoption of canon changes into already-provisioned standards is a hand-merge (the changelog promise in #247 was incomplete; the local adoption is done, the engine-side improvement is a future task).
- **Setup-python pin refreshed**: `actions/setup-python` re-pinned to the current `v6` tag head (the tag advanced after the original pin — pins verified against the live API before this release).

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.7.1...v7.8.0

## [7.7.1] - 2026-10-25

### Added

- **updatedocs 2.7.0 — `--capability-sweep` (the sync half mechanized)**: the docs engine could score 100/100 on an audit while capabilities shipped in recent PRs/issues/commits were documented nowhere (clean scores conceal absence, not presence — surfaced by the 2026-10-25 capability-sync pass). The new sweep enumerates every asset added since the last release tag (skill reference files, skills, scripts, workflows) plus `feat:` commits, and fails CI listing each capability documented nowhere (`reference-file-invisible-in-skill`, `undocumented-skill`, `undocumented-workflow`, `undocumented-asset`, `feat-commit-undocumented`) with suggested doc targets. The audited repo now carries a live CI daemon test pinning capability-doc sync. The sweep detects; the agent authors the missing sections with surgical diffs per updatedocs' no-blind-regeneration doctrine.

### Changed

- **Capability-sync docs pass (#252)**: the README (`What's New`, Verification, command surface), CONTRIBUTING (Landing Gate step), and `llms.txt` (Operational Standards section) now document the capabilities shipped in v7.6.0–v7.7.0 that the docs audit could not see were missing; updatedocs' Step 7 gained the capability-absence sweep doctrine ("a 100/100 audit score is not evidence of sync").

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.7.0...v7.7.1

## [7.7.0] - 2026-10-25

### Added

- **git skill 1.3.1**: four release-proven lessons wired into the git skill — annotated tag and back-merge commits carry the tagger/committer identity (GitHub email-privacy rejects the push otherwise), verify the current branch before any write/amend/tag/push (checkout can silently fall through), `gh pr merge --delete-branch` requires the branch not be checked out locally, and process-spawning tests need explicit timeout headroom (a clean-tree timeout is slowness, not a regression).

### Changed

- **DOX Engine template: derived-artifact sync + branch placeholders**: the scaffolded git-workflow standard's Release Invariants gain a generalized derived-artifact rule — any version bump regenerates declared derived artifacts **in the same commit**, each artifact declared with (a) its regenerate command and (b) the `--check` gate that fails CI on drift (rule provenance: the musememory v3.1.0 release, where bumping `package.json` to 3.1.0 red-flagged `claims:check` until `claims.json` was regenerated in the same commit). Template branch names (`master`/`dev`) become `{{integration_branch}}` / `{{production_branch}}` placeholders across the git-workflow, landing-gate, agent-reference, and execution-kernel standards. Existing projects adopt on their next `updateagents` update pass.
- **GitHub Actions pinned to commit SHAs (repo + template workflows)**: all 21 `uses:` lines across `.github/workflows/` and the updateagents template's `github/workflows/*` are pinned to full 40-hex commit SHAs with version comments — mutable tags were the vector of a real 2025 supply-chain compromise (CVE-2025-30066, `tj-actions/changed-files`, 23,000+ repos) and SHA-pinning is GitHub's own standing recommendation; scaffolded projects now inherit hardened workflows.
- **muse-security 1.0.0 → 1.0.1**: its audit mode now integrates the OWASP LLM Top 10 **2026 edition** (published 2026-08-03 — eight entries re-ranked, "System Prompt Leakage" renamed and widened to **Hidden Context Exposure**) and the OWASP **Top 10 for Agentic Applications (2026)**; its SAST step adds CI supply-chain checks (SHA pinning, least-privilege permissions, no `pull_request_target`) and the runtime-vs-build-time control-attribution doctrine for agent-era targets. The `automation` skill's audit checklist is renumbered to the 2026 taxonomy with the same sources.

### Fixed

- **Fresh Critic (gauntlet-loop) findings, rounds 1–3**: deleted the stale `refactor/references/modes.md` router (v1.1.0, wrong mode set, wrong version stamp) so the SKILL.md Modes table is the single router, and restored `audit` to refactor's `argument-hint`; corrected README's totals to the regenerated surface (409→408 commands per harness, 353→352 `<skill>-<mode>` commands, refactor "7-mode"→20-mode) and widened `tests/readme-claims.test.ts` to gate the hyphenated "N-mode" grammar so that phrasing can no longer escape CI; resolved the duplicate `audit` mode row in `updateagents` (CI-gating row renamed `scorecard`) and its "sync 19 standards" copy (→21); made 56 previously invisible routable reference files across 20 skills visible via an idempotent `### Support references (load on topic)` subsection inside each `## Modes`; corrected 21 stale mode counts in frontmatter descriptions with byte-parity across `skills.json` and `llms.txt`; added the untrusted-content boundary note to the three web-scraping references (brand/research, smm/creator-vetting, research/competitor-analysis); replaced three string-built/interactive shell-execution paths with arg-array or nameref equivalents (`scripts/install.sh` eval → `printf -v`, `gauntlet-loop/scripts/anti-drift.ts` and `client-comms/scripts/client-comms.ts` interpolated `execSync` → arg-array `execFileSync`; template `landing-gate.yml` pre-review gate moved to the env-var pattern); normalized 24 corrupted `^||`-prefixed table rows in the git, telegram, and database SKILL.md files; fixed the README's dead link to git-ignored report state.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.6.0...v7.7.0

## [7.6.0] - 2026-10-24

### Added

- **Landing Gate — Delivery Is Not Commitment (#240, #242)**: a new core invariant and standard (`.agents/standards/landing-gate.md`) making "the work is done" and "the work is delivered" mechanically distinct. Work is LANDED only when reachable from the integration branch on the remote; until then it is LOCAL. Verdicts are `LANDED`/`LOCAL` and `REVIEWABLE`/`NOT REVIEWABLE` (never "NOT LANDED"). A `bun run check:landed` gate (post-merge and pre-review modes) is shipped in `scripts/check-landed.ts` and wired into `.github/workflows/ci.yml` (pre-review on `pull_request` against `github.head_ref`, post-merge on `push` to the integration branch against `github.ref_name`), with `fetch-depth: 0` and `GH_TOKEN` as required. The PR template gains a checklist line. The gate is scaffolded into every project via `selectGitHubWorkflowTemplates` (now always includes `landing-gate.yml`).
- **Test-Failure Audit Standard (#243)**: `.agents/standards/test-failure-audit.md` — when the same test/failure fails on two or more consecutive runs, the agent must stop editing, self-audit its own outputs (did the edit land, is the test exercising it, pre-existing on clean tree, flaky/env), triage the root cause, then apply a targeted fix and re-run the full suite. Verdicts: `SELF-AUDIT COMPLETE` / `SELF-AUDIT PENDING`.
- **Session Report Protocol (#238, #239)**: every completed task now ends with two reports — the technical report, then a Layman Report appendix (plain language, one bullet per file/skill/task, what changed + why). The Layman Report is suppressed in agent-to-agent communication, subagent results, and internal tool flows; when unsure, the agent asks once before appending.
- **sync-engine-safety as a Project Skill**: the scaffolder/sync-engine safety procedure now ships in the template's `.agents/skills/` so it is available in every scaffolded project (then reverted to project-only on request — kept in this repo's `.agents/skills/` only).

### Changed

- **Standards Count 19 → 21**: `landing-gate.md` and `test-failure-audit.md` added to the template's `.agents/standards/`; `agent-engine.test.ts` updated to 21.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.5.0...v7.6.0

## [7.5.0] - 2026-10-24

### Added

- **Generated `<skill>-<mode>` Command Surface (#231)**: the exporter now emits one slash command per routable mode reference — `/<skill>-<mode>` — on top of the 46 per-skill commands and 10 curated aliases: **409 commands per harness** across OpenCode, Antigravity/Gemini, Cursor, and Windsurf. The skill prefix makes every name unique and self-describing, so modes that repeat across departments can no longer shadow each other: previously only ONE `audit` command could exist, leaving every other department's audit mode unreachable as a slash command. A new naming convention (`isModeRefFile`) defines a routable mode as a lowercase kebab-case `references/<mode>.md` — uppercase files (`POLICY`, `SECURITY`, `TROUBLESHOOTING`) are governance documents, not modes — and both the command exporter and the dispatch generator now share that definition, so the command surface and the routing surface cannot disagree. The generator throws on duplicate or colliding command names instead of shipping a shadowed file.
- **Audit Modes for 15 More Departments (#233, #235)**: `updatedocs`, `updateagents`, `evidence-ledger`, `refactor`, `designscope`, `clean-system-cache`, `design`, `incident-response`, `retain`, `client-comms`, `automation`, `devops`, `crm`, `telegram`, and `periodic-retreat` each ship a domain-specific `audit` mode — **36 of 46 skills now do** — every one reachable as `/<skill>-audit`. Each is grounded in named external standards and cites them in a `## Sources` section: OWASP Top 10 for LLM Applications and the AI Agent Security Cheat Sheet (`automation`), OWASP Top 10 CI/CD Security Risks CICD-SEC-1…10 (`devops`), NIST SP 800-61r3 / CSF 2.0 with CISA playbooks (`incident-response`), WCAG 2.2 plus design-QA checklists (`design`, `designscope`), churn-audit rubrics with 90-day leading indicators and a predictability bar (`retain`), deliverability authentication thresholds — SPF ≤10 lookups, DKIM ≥2048-bit, DMARC past `p=none` (`crm`), and bidirectional SOW SLAs (`client-comms`).

### Fixed

- **Per-Skill Mode Counts Reconciled — Twice (#229, #230)**: the README catalog understated 7 skills by omitting each one's shipped `audit` mode, and the injected router prose claimed "47 canonical Muse departments" against a 46-skill registry. Both corrected; then the deeper fix: per-skill counts are hand-written claims that rot, so they are now **CI-pinned to the generated surface** — a test asserts every catalog claim equals `getModesForSkill(skill).length`, the exact function `dispatch.md` is generated from. 12 rows corrected to the generated truth.
- **Uniform `## Modes` Contract Across All 46 Skills (#232)**: four incompatible heading variants (`## Modes — quick commands`, `### Modes Quick-Commands`, `### Operating Modes`, and 7 skills with no modes documentation at all) normalized to one exact H2 heading; 7 skills received a generated canonical section; `humanize`'s incomplete metadata block completed. A contract test now requires the heading, resolvable reference links, and the full metadata key set from every future skill.
- **Audit-Mode Substance Contract + 27 Dead Paths (#235)**: every shipped `audit.md` is test-enforced for substance (scope/when section, procedure-or-checklist body, output/severity/routing, Sources — two legitimate document shapes accepted). Sources blocks added corpus-wide, derived from each file's own referenced authorities. 14 fabricated `references/references/` doubled paths and 13 pre-existing `../skills/` dead paths repaired — both defect classes found by a gauntlet-loop Fresh-Critic sweep and now covered by backticked-path checking, which markdown-link-only validation cannot see.
- **`paidads` extra-platforms Reference Restored (#236)**: the mode shipped as a single newline-stripped 2,896-character line — complete content, unusable rendering. Restored to 51 structured lines with real Sources.

### Changed

- **CI Runner Headroom (#234)**: the two process-spawning tests that transiently failed the v7.4.1 release workflow (`clean-system-cache` dry-run at 15015ms vs its 15000ms cap; `agent-engine` Part E provisioning on the default 5s) now carry explicit headroom. Assertions unchanged.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.4.1...v7.5.0

---

## [7.4.1] - 2026-10-23

### Added

- **Companion & Community Skills Section**: the README now carries a `🔗 Companion & Community Skills` table listing the suite itself (with per-department install) and independently maintained skills that live outside it. The first companion is [`sparkbtcbot`](https://github.com/echennells/sparkbtcbot) (MIT) — a self-custodial Bitcoin wallet skill for agents on the Spark L2, covering zero-fee Spark and BTKN/LRC20 transfers, Lightning invoices, L402 paywall payment, L1 deposits and cooperative withdrawals, message signing, and merchant purchases (gift cards, eSIMs, VPNs) under a shared payment policy — invoice-vs-quote verification, amount ceilings, confirm-before-buy. Nothing is vendored and the 46-skill registry (`skills.json`, `llms.txt`, `secretary:dispatch`) is untouched, so the zero-dependency portability rule and registry parity both hold. The upstream real-Bitcoin custody guardrail is quoted alongside the entry.
- **Brand Banner (`assets/banner.svg`)**: a generated brand hero — deep-space canvas, violet→cyan accent gradient, and a 46-node constellation with one node per shipped department. `scripts/gen-banner.ts` is the source of truth; `assets/banner.png` is the rasterised copy for surfaces that do not accept SVG (GitHub's social-preview upload). The banner is rendered in the README hero.

### Fixed

- **`export-commands --setup` Installed Nothing**: the installer resolved each skill's source as `<repo>/<skill-name>`, but skills live at `skills/<category>/<name>/`, so its `existsSync` guard skipped **every** skill: it installed 0 of 46 while still writing 56 command files per harness that pointed at files that were never installed. Every test in the suite stayed green throughout — nothing exercised the CLI end to end. Sources now resolve from the registry `path`, and a missing source is reported instead of silently skipped (the swallow is why the defect survived). Alongside it: the fictional `/saas` alias is removed (it pointed at a `design/references/saas.md` that never existed — `saas` is a design *template*, not one of the skill's eleven modes), leaving exactly 10 flat aliases; the module docstring no longer advertises Claude Code/Aider/Hermes exports that were never implemented (four harnesses are); and `wireSecretaryIntoAgentsMd` writes the markdown sentinel dialect and dedupes against **both** dialects, so `--setup` no longer appends a second secretary router to a repository the `updateagents` engine already wired — in an HTML-comment dialect this repo's own gate forbids. 11 regression tests in `tests/export-commands.test.ts`, including the round-trip property that every path an exported command references exists after install.
- **Command-Surface Documentation Corrected**: the README documented colon-form commands (`/crm:onboard`, `/design:uikit`, `/smm:carousel`) that the exporter cannot emit — command filenames are flat (`<name>.md`), never namespaced — and advertised 57 commands per harness. It now shows the real surface: 46 per-skill commands, argument routing for modes without an alias (`/design uikit`), and the 10 flat aliases, i.e. 56 per harness. Two wrong per-skill mode counts were corrected, and the hand-written test counts (which had already drifted to "124 tests" in a file that simultaneously claimed 233, with nothing enforcing either) were replaced by the CI-verified gate instead of a fresh number that would rot again. 4 tests in `tests/readme-claims.test.ts` assert the advertised total equals `skills.length + resolvable aliases` and that no colon-form command is documented.
- **`updateagents` Re-Run Safety Floor**: three defects that only surface on the *second* run of the sync engine are fixed. (1) The managed root `AGENTS.md` was re-imported into `.agents/context/imported-agent-instructions.md` and archived as a byte-identical snapshot of itself: the root is the engine's canonical destination, never a legacy source. The classifier now recognizes the router sentinel the engine itself installs (a hand-edited root keeps that sentinel but loses the explicit marker, so checking only the marker re-imported it on every sync), and the `--force`/`includeManagedRoot` escape hatch that reclassified the root is deleted rather than defaulted off. Hand-written roots with no engine marker are genuine legacy sources and still migrate. (2) Community and governance files (`CODE_OF_CONDUCT`, `CONTRIBUTING`, `SECURITY`, issue/PR templates, `dependabot.yml`, `CHANGELOG.md`) were re-provisioned into established repositories by a plain sync — so a re-run recreated files the user had deliberately deleted. They are now gated on `--scaffold || fresh container`: a brand-new project is still fully provisioned, an established one is not touched. (3) Step 5 of the sync copied every canon rulebook into `.agents/standards/`, silently overwriting curated standards and injecting unrelated ones (WordPress/fintech guidance into projects using neither). An existing container is now reported rather than rewritten — `🔒 Curated standards preserved` / `⏭️ Canon standards not applicable here`, with distinct curated/not-applicable/written counters — and `--force` is the only overwrite path, with an explicit modification log. Freshness is keyed off pre-run state because the sync creates an empty `.agents/standards/` container earlier in the same run, which made a fresh project look established. Four regression tests in `tests/updateagents-safety-floor.test.ts` pin all three behaviours plus the hand-written-root migration that must keep working.
- **42 Broken Changelog Links Repaired**: released-section links pointed at the pre-v6 flat skill layout (`dead-letter/references/record-schema.md`, `refactor-ui/scripts/audit-ui.ts`, `handoff/references/ambient-handoff.md`, `audit/references/hygiene-rules.md`, …) after the skills moved under `skills/<category>/<name>/`. Every target was resolved against the live tree and rewritten to its current path in both `CHANGELOG.md` and its `docs/` mirror — link text and narrative untouched. Two links to `.agents/reports/*.html` were de-linked (those are local, gitignored DOX artifacts that can never resolve for a reader) and the `refactor-ui` → `refactor` rename was corrected. Link integrity is now 100% (482 links, 0 broken).
- **Changelog Compare Links Completed**: the `7.3.0`, `7.3.1` and `7.3.2` sections in `CHANGELOG.md` and `docs/CHANGELOG.md` were missing their compare-diff URL and release divider, which the changelog policy requires of every tagged release section. Both files now follow the established format uniformly from `7.3.0` onward.
- **`updateagents` DOX Scaffold Sync**: the sync path copied only three brand documents (`design.md`, `bem-conventions.md`, `a11y.md`) while the generated context index links to six more (`voice.md`, `personas.md`, `positioning.md`, `messaging.md`, `visual-identity.md`, `social-hooks.md`), so `--lint-context` failed with 12 dangling links on every synced project. The sync now mirrors the scaffold's full brand set, matching what the context index advertises.
- **Optional Global Identity Links Are No Longer Broken Links**: `--lint-context` failed whenever `~/.agents/identity/*` was absent — but that overlay is per-user and optional by design (the tool prints a notice and points at `--onboard --global`). Global `~` links are now collected separately and reported as informational, so they no longer fail the lint.
- **Taste Atom Invariant Test**: the simulation suite asserted one frozen atom id (`atom-communication-mub4copy02`) that the generator mints per run (`atom-<category>-<base36 timestamp>`) and that only exists after an atom is *learned* from an observed signal — a value no other machine can reproduce. The assertion now encodes the rule that generalizes: every non-retired atom in the taste state must be projected into `decisions.md` and `current.md`, and every id must match the generator's documented shape.
- **Historical Snapshots Excluded From the Link Linter**: `docs/README-v5.0.0.md` is a frozen v5.0.0 snapshot whose relative links were correct against the tree as it stood at capture time — the pre-v6 flat skill layout (`updatedocs/README.md`, `refactor-ui/README.md`, `handoff/...`). Link-lint treated it as live documentation and reported 83 false positives, masking the real breakage in the live changelogs. The archive is now classified HISTORICAL under the updatedocs ownership model: audited, never rewritten.
- **`bun run lint` Now Runs a Real Linter**: neither binary in the lint script was resolvable. `biome` was never a dependency, and `ruff` resolved to the unrelated npm package `coderaiser/ruff` (an environment-variable manager), so `bun run lint` died with "command not found" on both halves. In CI the failure was *silent* — `bunx biome` resolves the package literally named `biome` (0.3.3, the env-var tool) rather than `@biomejs/biome`, so the lint job exited 0 without linting a single file. `@biomejs/biome@2.6.2` and `typescript` are now pinned devDependencies, `scripts/ruff-check.sh` runs Astral's ruff with modern-first resolution (`uvx` → `ruff` → `pipx`, propagating the exit code verbatim), and CI runs `bun run lint` so the local and CI gates are the same command. The Biome config is migrated to the 2.6 schema (`preset: "recommended"`), with Markdown and YAML excluded from the formatter — Markdown formatting would rewrite every skill document, and the workflow templates carry GitHub Actions expressions the YAML parser cannot read.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.4.0...v7.4.1

---

### Added

- **Companion & Community Skills Section**: the README now carries a `🔗 Companion & Community Skills` table listing the suite itself (with per-department install) and independently maintained skills that live outside it. The first companion is [`sparkbtcbot`](https://github.com/echennells/sparkbtcbot) (MIT) — a self-custodial Bitcoin wallet skill for agents on the Spark L2, covering zero-fee Spark and BTKN/LRC20 transfers, Lightning invoices, L402 paywall payment, L1 deposits and cooperative withdrawals, message signing, and merchant purchases (gift cards, eSIMs, VPNs) under a shared payment policy — invoice-vs-quote verification, amount ceilings, confirm-before-buy. Nothing is vendored and the 46-skill registry (`skills.json`, `llms.txt`, `secretary:dispatch`) is untouched, so the zero-dependency portability rule and registry parity both hold. The upstream real-Bitcoin custody guardrail is quoted alongside the entry.
- **Brand Banner (`assets/banner.svg`)**: a generated brand hero — deep-space canvas, violet→cyan accent gradient, and a 46-node constellation with one node per shipped department. `scripts/gen-banner.ts` is the source of truth; `assets/banner.png` is the rasterised copy for surfaces that do not accept SVG (GitHub's social-preview upload). The banner is rendered in the README hero.

### Fixed

- **`export-commands --setup` Installed Nothing**: the installer resolved each skill's source as `<repo>/<skill-name>`, but skills live at `skills/<category>/<name>/`, so its `existsSync` guard skipped **every** skill: it installed 0 of 46 while still writing 56 command files per harness that pointed at files that were never installed. Every test in the suite stayed green throughout — nothing exercised the CLI end to end. Sources now resolve from the registry `path`, and a missing source is reported instead of silently skipped (the swallow is why the defect survived). Alongside it: the fictional `/saas` alias is removed (it pointed at a `design/references/saas.md` that never existed — `saas` is a design *template*, not one of the skill's eleven modes), leaving exactly 10 flat aliases; the module docstring no longer advertises Claude Code/Aider/Hermes exports that were never implemented (four harnesses are); and `wireSecretaryIntoAgentsMd` writes the markdown sentinel dialect and dedupes against **both** dialects, so `--setup` no longer appends a second secretary router to a repository the `updateagents` engine already wired — in an HTML-comment dialect this repo's own gate forbids. 11 regression tests in `tests/export-commands.test.ts`, including the round-trip property that every path an exported command references exists after install.
- **Command-Surface Documentation Corrected**: the README documented colon-form commands (`/crm:onboard`, `/design:uikit`, `/smm:carousel`) that the exporter cannot emit — command filenames are flat (`<name>.md`), never namespaced — and advertised 57 commands per harness. It now shows the real surface: 46 per-skill commands, argument routing for modes without an alias (`/design uikit`), and the 10 flat aliases, i.e. 56 per harness. Two wrong per-skill mode counts were corrected, and the hand-written test counts (which had already drifted to "124 tests" in a file that simultaneously claimed 233, with nothing enforcing either) were replaced by the CI-verified gate instead of a fresh number that would rot again. 4 tests in `tests/readme-claims.test.ts` assert the advertised total equals `skills.length + resolvable aliases` and that no colon-form command is documented.
- **`updateagents` Re-Run Safety Floor**: three defects that only surface on the *second* run of the sync engine are fixed. (1) The managed root `AGENTS.md` was re-imported into `.agents/context/imported-agent-instructions.md` and archived as a byte-identical snapshot of itself: the root is the engine's canonical destination, never a legacy source. The classifier now recognizes the router sentinel the engine itself installs (a hand-edited root keeps that sentinel but loses the explicit marker, so checking only the marker re-imported it on every sync), and the `--force`/`includeManagedRoot` escape hatch that reclassified the root is deleted rather than defaulted off. Hand-written roots with no engine marker are genuine legacy sources and still migrate. (2) Community and governance files (`CODE_OF_CONDUCT`, `CONTRIBUTING`, `SECURITY`, issue/PR templates, `dependabot.yml`, `CHANGELOG.md`) were re-provisioned into established repositories by a plain sync — so a re-run recreated files the user had deliberately deleted. They are now gated on `--scaffold || fresh container`: a brand-new project is still fully provisioned, an established one is not touched. (3) Step 5 of the sync copied every canon rulebook into `.agents/standards/`, silently overwriting curated standards and injecting unrelated ones (WordPress/fintech guidance into projects using neither). An existing container is now reported rather than rewritten — `🔒 Curated standards preserved` / `⏭️ Canon standards not applicable here`, with distinct curated/not-applicable/written counters — and `--force` is the only overwrite path, with an explicit modification log. Freshness is keyed off pre-run state because the sync creates an empty `.agents/standards/` container earlier in the same run, which made a fresh project look established. Four regression tests in `tests/updateagents-safety-floor.test.ts` pin all three behaviours plus the hand-written-root migration that must keep working.
- **42 Broken Changelog Links Repaired**: released-section links pointed at the pre-v6 flat skill layout (`dead-letter/references/record-schema.md`, `refactor-ui/scripts/audit-ui.ts`, `handoff/references/ambient-handoff.md`, `audit/references/hygiene-rules.md`, …) after the skills moved under `skills/<category>/<name>/`. Every target was resolved against the live tree and rewritten to its current path in both `CHANGELOG.md` and its `docs/` mirror — link text and narrative untouched. Two links to `.agents/reports/*.html` were de-linked (those are local, gitignored DOX artifacts that can never resolve for a reader) and the `refactor-ui` → `refactor` rename was corrected. Link integrity is now 100% (482 links, 0 broken).
- **Changelog Compare Links Completed**: the `7.3.0`, `7.3.1` and `7.3.2` sections in `CHANGELOG.md` and `docs/CHANGELOG.md` were missing their compare-diff URL and release divider, which the changelog policy requires of every tagged release section. Both files now follow the established format uniformly from `7.3.0` onward.
- **`updateagents` DOX Scaffold Sync**: the sync path copied only three brand documents (`design.md`, `bem-conventions.md`, `a11y.md`) while the generated context index links to six more (`voice.md`, `personas.md`, `positioning.md`, `messaging.md`, `visual-identity.md`, `social-hooks.md`), so `--lint-context` failed with 12 dangling links on every synced project. The sync now mirrors the scaffold's full brand set, matching what the context index advertises.
- **Optional Global Identity Links Are No Longer Broken Links**: `--lint-context` failed whenever `~/.agents/identity/*` was absent — but that overlay is per-user and optional by design (the tool prints a notice and points at `--onboard --global`). Global `~` links are now collected separately and reported as informational, so they no longer fail the lint.
- **Taste Atom Invariant Test**: the simulation suite asserted one frozen atom id (`atom-communication-mub4copy02`) that the generator mints per run (`atom-<category>-<base36 timestamp>`) and that only exists after an atom is *learned* from an observed signal — a value no other machine can reproduce. The assertion now encodes the rule that generalizes: every non-retired atom in the taste state must be projected into `decisions.md` and `current.md`, and every id must match the generator's documented shape.
- **Historical Snapshots Excluded From the Link Linter**: `docs/README-v5.0.0.md` is a frozen v5.0.0 snapshot whose relative links were correct against the tree as it stood at capture time — the pre-v6 flat skill layout (`updatedocs/README.md`, `refactor-ui/README.md`, `handoff/...`). Link-lint treated it as live documentation and reported 83 false positives, masking the real breakage in the live changelogs. The archive is now classified HISTORICAL under the updatedocs ownership model: audited, never rewritten.
- **`bun run lint` Now Runs a Real Linter**: neither binary in the lint script was resolvable. `biome` was never a dependency, and `ruff` resolved to the unrelated npm package `coderaiser/ruff` (an environment-variable manager), so `bun run lint` died with "command not found" on both halves. In CI the failure was *silent* — `bunx biome` resolves the package literally named `biome` (0.3.3, the env-var tool) rather than `@biomejs/biome`, so the lint job exited 0 without linting a single file. `@biomejs/biome@2.6.2` and `typescript` are now pinned devDependencies, `scripts/ruff-check.sh` runs Astral's ruff with modern-first resolution (`uvx` → `ruff` → `pipx`, propagating the exit code verbatim), and CI runs `bun run lint` so the local and CI gates are the same command. The Biome config is migrated to the 2.6 schema (`preset: "recommended"`), with Markdown and YAML excluded from the formatter — Markdown formatting would rewrite every skill document, and the workflow templates carry GitHub Actions expressions the YAML parser cannot read.

## [7.4.0] - 2026-10-22

### Added

- **Front-End Performance Checklist mode (`qa-launch:performance`, #216)**: Sixth `qa-launch` mode (`skills/agency-delivery/qa-launch/references/performance.md`) incorporating the community Front-End Performance Checklist (`thedaviddias/Front-End-Performance-Checklist`, MIT) as a routed launch-QA gate. Grades a release candidate across the six payload categories — HTML, CSS, Fonts, Images, JavaScript, Server — with each item's high/medium/low priority mapped to gate severity ([H]=Block, [M]=ship-with-ticket, [L]=note), the checklist's headline budgets (page <1500 KB / ideally <500 KB, load <3 s, TTFB <1.3 s) anchored to Core Web Vitals where field data exists, a tooling list, and a 2026 modern-framing note (HTTP/2+ concatenation, WebP/AVIF, bundler-driven minification). The mode feeds the `gate` Block-or-Ship verdict and the `audit` perf-budget line. `qa-launch` bumps to 1.2.0 with description/version/mode parity across SKILL.md, README, skills.json, llms.txt, agents/openai.yaml, the root README structure tree, and the regenerated `secretary/references/dispatch.md`; also corrects a prior drift where SKILL.md listed five modes but README/openai.yaml advertised four, and the skill README Modes table now lists all six modes including `audit`.

- **Community & Companion Skills Catalog (#214)**: The README now carries a `🔗 Community & Companion Skills` section for independently maintained skills that live outside the suite. Nothing is vendored and the 46-skill registry (`skills.json`, `llms.txt`, `secretary:dispatch`) is untouched, so the zero-dependency portability rule and registry parity both hold. First entry: [`sparkbtcbot`](https://github.com/echennells/sparkbtcbot) (MIT) — a self-custodial Bitcoin wallet skill for agents on the Spark L2, covering zero-fee Spark and BTKN/LRC20 transfers, Lightning invoices, L402 paywall payment, L1 deposits and cooperative withdrawals, message signing, and merchant purchases (gift cards, eSIMs, VPNs) under a shared payment policy — invoice-vs-quote verification, amount ceilings, confirm-before-buy; install with `npx skills add echennells/sparkbtcbot`, confirmed discoverable by the `skills` CLI.

### Fixed

- **README Claims Resynced With the Shipped Suite**: the version badge had drifted to 7.1.0 against a 7.3.2 package, the root catalog advertised `ops` across 10 modes (the skill ships 11 since `ops:shape`), the test badge and the "What's New" line still claimed 206 tests against a 233-test suite, and the install line advertised "174 Native Slash Commands" — a figure with no source in the exporter, which emits 46 skill commands plus 11 sub-mode aliases (57) per detected harness. The version badge now tracks `package.json`.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.3.2...v7.4.0

---

## [7.3.2] - 2026-10-20

### Changed

- **`updateagents` v2.4.0 — preserve, never regenerate**: an existing root `AGENTS.md` is no longer rebuilt from the template. Its content is preserved verbatim and only the shared routers are merged in; the template now applies only when the file is absent. Previously a run on an established project replaced a curated `AGENTS.md` with the template while reporting "100% in sync with zero drift".
- **Reference playbooks are content, not instructions**: files under `references/` or `templates/` are excluded from instruction-file discovery, so rules ported into a reference file and linked from `AGENTS.md` stay in that file. A run previously flattened five real playbooks into one-paragraph adapters (−290 lines).

### Fixed

- **HTML-comment sentinels removed from emitted instruction files**: harness scanners read HTML comments around instructions as prompt injection and refuse the whole file, so a repository's `AGENTS.md` never reached the agent. Sentinels now use Markdown link-definition comments (`[//]: # (...)`), which render as nothing and are not HTML; legacy HTML sentinels are still recognised on read, so existing projects keep working.
- **Canonical-file self-import**: the "is this my own generated file" check matched the old marker only, so a second run re-imported `.agents/context/imported-agent-instructions.md` into itself. The check is now format-agnostic.
- **Import link rebasing**: links copied into `.agents/context/imported-agent-instructions.md` are rebased one level (`./.agents/x` → `../x`), so `--lint-context` no longer fails on the tool's own output.
- **`sync-skill-versions.py` no longer reformats the registry**: it re-serialised `skills.json` (883+/158−) and biome rejects the result; drift is now applied as targeted in-place string edits (1 line per bumped skill). The duplicated write call is gone.
- **`export-commands.ts` dead count**: `totalCommands` was accumulated six times and never read; it is now reported in the completion line.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.3.1...v7.3.2

---

## [7.3.1] - 2026-10-20

### Fixed

- **CI Hermeticity for `clean-system-cache`**: the dry-run capability test asserted `[T2]`/`preserved` from the runner's real `HOME`; a bare GitHub Actions runner has no installed harness caches, so it failed in CI while passing on a developer machine (red since `9a7b111`). The test now provisions a fixture `HOME` with one T2 cache, matching the sibling test's pattern, and additionally asserts the dry-run does not delete the cache it classified. Assertions unchanged.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.3.0...v7.3.1

---

## [7.3.0] - 2026-10-20

### Added

- **Shape Up Delivery Methodology (`ops:shape`, #215)**: Eleventh `ops` mode (`skills/agency-delivery/ops/references/shape.md`) distilling Basecamp/37signals' *Shape Up* into agency language — grab-bag triage ("redesign X" is not a project until one problem is named), narrow-the-problem rewrite, appetite bands (small batch vs big batch as a fixed time budget), the right level of abstraction, the pitch's five ingredients (problem, appetite, solution, rabbit holes, no-gos), patch/fence/cut de-risking, honour-the-bet, circuit breaker, and the baseline ship test. The doctrine is also folded in as additive routing lines across `ops:proposal` (shape-before-price gate), `ops:sow` (appetite as time budget), `ops:milestone` (fixed time / variable scope), `ops:multi-client` (one band ahead + reserve band), `coach:client` (scope-hammer questions + ship test), `coach:team` (status as unknown-vs-solved), and `client-comms:change` (interception vs recorded change order). `ops` bumps to 1.6.0, `coach` to 1.2.0, and `client-comms` to 1.3.0, with description/mode-table/argument-hint parity across SKILL.md, README, skills.json, llms.txt, agents/openai.yaml, and the regenerated `secretary/references/dispatch.md`.

- **`CLAUDE.md` Shim**: Root `CLAUDE.md` forwards every Claude-family runtime to `AGENTS.md` and `.agents/context/imported-agent-instructions.md`, so the curated workspace contract has one source instead of a per-harness copy.

### Fixed

- **`ops` Mode-Count & Registry Drift**: `agents/openai.yaml` advertised "nine modes" (missing `legal`) and `README.md` carried a 9-row mode table — both realigned to the eleven-mode description that is now byte-identical across SKILL.md, skills.json, llms.txt, and agents/openai.yaml.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.2.1...v7.3.0

---

## [7.2.1] - 2026-10-15

### Added

- **Live Agent Capability Cache Engine (`clean-system-cache`)**: Three-tier cache classification matrix (T1 Regenerable, T2 Capability-coupled, T3 Irreplaceable) across `clean-cache.sh` and `clean-cache.cmd`. Preserves live agent capability trees by default (installed plugin payloads, language servers, MCP caches, and remote skill payloads across OpenCode, Claude Code, Cursor, Codex, Gemini CLI, Continue, and VS Code-family tools) to prevent mid-session agent capability dropoffs. Introduces explicit `--include-coupled` / `/include-coupled` opt-in flag and automated rehydration manifest emission.
- **Legacy Instruction Promotion (`updateagents --promote`)**: Live interception for foreign-harness instruction write attempts (`.claude/`, `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.aider.conf.yml`, `.github/copilot-instructions.md`), classifying content into `.agents/standards/` (imperatives/rules) or `.agents/context/` (facts/decisions) with recorded provenance, deduplication, and router synchronization.
- **X (Twitter) Account Growth Mode (`smm:x`)**: Eleventh `smm` mode (`skills/agency-delivery/smm/references/x.md`) adapted from the 14-skill kangarooking/X-growth-skills corpus (MIT, translated to English, de-sinicized) — four-step-saves philosophy + three translations, For You algorithm mechanics (dual-source recall, multi-action weighted scoring, out-of-network dominance), profile storefront audit, positioning impossible-triangle, content archetypes + Hook-Body-CTA + five-piece completeness gate, cold-start 0→1k playbook, engagement patterns, benchmark research, monetization pyramid, weekly 80/20 loop, seven account-killer pitfalls. `smm` bumps to 1.4.0 with description/argument-hint/mode-table parity across SKILL.md, README, skills.json, llms.txt, and agents/openai.yaml.
- **Stale-Lane Enrichment Transplant** (#212): Harvested the genuine unshipped residue of 13 stale `feat/*` branches (verified 88–100% already shipped line-by-line) — message-market-fit trio + `[Verb]+[Get]+[Qualifier]` CTA shape (`content:copy` Part 10), production-pipeline selection + edit anatomy + production-family checklist (`content:video` Procedure #5), maturity-tier listing scorecard (`mobile:aso` Procedure #6), and Temporal design-twin orchestration rules (`webdev:fullstack` #4).
- **GitHub Community & Governance Scaffolding**: Added repository community health files (`CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `FAQ.md`, `GOVERNANCE.md`, `SECURITY.md`, `SUPPORT.md`, and issue configuration/showcase submission templates).

### Fixed

- **Scoped Memory Closeout Invariant (`dox-engine` / `updateagents`)**: Scoped generated session closeout so agents record session state exclusively through the project's memory tooling or CLI, never by hand-editing runtime store files (`.memory/`, `.agentmemory/`), and skip when absent; enforced dual-file distinction between store files and narrative context in `memory-context.md`, `architecture.md`, `decisions.md` (ADR-004), and `new-project` baseline context.
- **Workflow Fallback to `.memory` (`workflows.md`)**: Added explicit fallback in standard workflows (Phase 1 constraint loading & Phase 5 closeout) to load from and record to `./.memory` via tooling/CLI when present.
- **Harness-Independence & DOX Engine Adoption**: Enforced global-standard layout hierarchy (`.agents/` project container first, `~/.agents/` home fallback); opt-in harnesses that follow `.agents` and `AGENTS.md` do not generate parallel vendor files and adopt the DOX engine directly.

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.2.0...v7.2.1

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
- **Executive Milestone Reports**: Shipped comprehensive interactive HTML milestone reports at `.agents/reports/v5.16.0-2026-09-22.html` and `.agents/reports/latest.html` (local `.agents/` artifacts, not published in this repository).

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

- **Suite Hardening Pass (5 skills, cross-pollination from the code-review corpus)**: mechanisms distilled from the 63-source review corpus landed where they fit best. **`gauntlet-loop` v1.2.0** — the Automated Gate gains a **quality-bar regression check** (suppressions added, tests skipped/deleted, assertions weakened, or thresholds edited down in the round's diff → round score 0.0: a build that passes because the bar was lowered is a regression, not a pass) and a **fail-closed eval check** (the proof suite must contain a test that CAN fail on the defect class the round claims to fix — a green run no test could have caught proves nothing; write the capable test and watch it fail on the pre-fix state first); `ITERATION_LEDGER` now records new-vs-fixed finding counts per round, and divergence (new findings outnumber fixed two rounds running) stops the loop with an escalation instead of burning the remaining budget. **`dead-letter` v1.5.0** — modularized: record template → [references/record-schema.md](skills/quality-review/dead-letter/references/record-schema.md), status sweep → [references/sweep-protocol.md](skills/quality-review/dead-letter/references/sweep-protocol.md) (SKILL.md down to 144 lines; sweep loads only the sweep protocol, capture loads only the schema), and the sweep gains a **findings ledger** (`.agents/artifacts/dead-letter-ledger.md`) that deduplicates recurring sweep verdicts, measures convergence across sweeps, and links clusters → repro packs → outcomes. **`secretary` v1.4.0** — Delegation Control Gates gain **Feedback Reception**: review feedback returning from delegations is verified against the code before implementation, each item classified implement / rebut (with evidence, never deference) / ask (one specific question), with investigation-before-application for auth/payments/migration items — performative agreement fails the gate. **`pua` v1.1.0** — modularized: 8 corporate flavor packs + situational auto-selector → [references/flavor-packs.md](skills/quality-review/pua/references/flavor-packs.md) (SKILL.md 208 lines; core procedure starts without the persona layer). **`refactor-ui` v1.1.2** — audit/review/sweep report severity markers ship text + symbol with color as a redundant third channel, never color alone (applies to rendered HTML report artifacts too).
- **Modular Router & 3 New Modes (`code-review` v1.3.0)**: SKILL.md rebuilt as a token-minimal router — 7 modes now, each with an explicit load-map (references load only for their mode): `diff` (default, full 17-theme catalog), `hotfix` and `contract` (nothing extra), `audit` (+ conventions discovery: the project's own test runner/standards/error conventions define Axis A, then two-axis standards+spec side-by-side report), **`security`** (numbered SEC-01..10 control pass — injection, access control/IDOR, auth/session, crypto, SSRF, secrets, rate limiting, error disclosure, dependency/supply-chain — evidence-first findings with snippet + exploitability + remediation, and an explicit "no findings" statement per passed control), **`receive`** (feedback intake: verify before implementing, classify each item implement/rebut/ask, risk-gating for auth/payments/migrations, anti-sycophancy), **`fix`** (findings ledger → test-first fixes, one commit per finding, skip ledger for blind-risk items, re-review until convergence with bounded rounds). Theme catalog moved to [references/themes.md](skills/quality-review/code-review/references/themes.md) with two new corpus-grounded triggers: **13.4 Quality-Bar Regression** (suppressions added, tests skipped/deleted, assertions weakened, thresholds edited down — a build that passes because the bar was lowered is a regression, not a pass; Reject) and **16.5 Half-Applied Refactor Debris** (old+new coexist, orphaned helpers, debug scaffolding; Request Changes). Report gains "What's Good" and "Open Questions" sections; new pitfalls (generic-convention preaching, over-loading). Distilled from a 63-source agent-skill code-review corpus (fetched 2026-09-10, `.agents/artifacts/code-review-research/`); cross-pollination map recorded for the rest of the suite.
- **Test-Spec Immutability Theme (`code-review` v1.2.0)**: new **Theme 17 under Level 5 (Verification Integrity)** — 4 triggers pinning the spec–test relationship in review: test weakened to match broken behavior (Reject), spec edit hidden inside a fix commit (Reject), unexplained test modification (Request Changes), snapshot regenerated blind (Request Changes). The principle is stated in the skill: the test defines correct behavior — fix the implementation to match the spec, never the reverse; a genuinely wrong spec is changed as a deliberate, separately-reviewable spec decision, not a hunk inside a bug fix. Frontmatter gains trigger `(6)` (diffs touching tests/specs/snapshots), `test-spec-immutability` tag, and new openclaw triggers (`review test changes`, `tests weakened to pass`); review-output checklist and verification list gain test-spec integrity items; new Pitfall (spec-weakening tolerance); worked finding added to the sample review. Also fixed two latent drift bugs in the same pass: mode table and Step 2 heading still said "15-theme" after Theme 16 existed (now 17), and the Step 2 intro said "three levels of triggers" with four levels present (now five). Sources: agent-skill-eval `fix-failing-tests` ("test files define the correct behavior... never the other way around") and flightplanner `fp-fix` ("NEVER modifies spec files — the spec is the source of truth") from the 248-source corpus; closes the review-time loop with dead-letter's repro-pack spec note (v1.3.0). Registry surfaces synced (skills.json, llms.txt, README #4, per-skill README).
- **Cluster Triage Sweep (`dead-letter` v1.4.0)**: `dead-letter status` upgraded from a flat listing to a three-pass root-cause triage — **inventory** (open records, retry counts, ages; a 2+-retry open record is itself flagged as a process defect), **clustering** by root cause with four cluster keys in priority order (same root cause, same dependency/producer, same precondition, same surface), and **one verdict per cluster**: systemic (one fix covers all members; they resume at Recovery Sequence step 4 after it lands — never per-record retries), coincidental (split; own Recovery Decisions), cascade (fix the producer first, members hold as `BLOCKED-CASCADE-<code>`), or escalate-cluster (one escalation with the cluster as evidence for clusters ≥3 or any member with ≥2 retries). Clustering is explicitly on root cause, not error-string similarity — identical stack traces can hide different causes (new pitfalls: string-match clustering, retry storm on systemic clusters). Report is inline ≤40 lines and closes with a sweep action line (fixes / retries authorized / escalations); a sweep that authorizes retries for a systemic cluster has failed its purpose. Source: dic-skills nightly triage from the 248-source corpus; pairs with the coupling-router's DAG skip policy (wave dependents route here as `SKIP`, and a systemic cluster explains them in one verdict).
- **Repro Test Pack Generator (`dead-letter` v1.3.0)**: at close-out (Recovery Sequence step 6), deterministic failures (`FAILED-LOGIC`, `FAILED-TOOL`, stable-trigger `BLOCKED-*`) convert into a repro pack at `.agents/artifacts/repro-<slug>-<timestamp>/` — exact numbered reproduction steps, preconditions (data/env/config/versions), expected-vs-actual assertion pair, and a minimal failing test observed red against the un-fixed code (unseen red is a claim, not evidence). Explicit skip cases (transient/environment-dependent failures, fix already shipped, no test runner or external-system dependency), a spec-immutability note (if behavior is actually correct, fix the spec — never weaken the test to match broken behavior), and a worked example ([sample-repro-pack.md](skills/quality-review/dead-letter/examples/sample-repro-pack.md)) plus an updated sample record that shows a correctly-skipped pack. The capture that documents a failure becomes the regression test that prevents its recurrence; on recurrence, the pack is the parent record's evidence attachment. Registry surfaces synced (skills.json, llms.txt, README #15, per-skill README with full current record format).
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
- **Shared-Worktree Lease (`coupling-router` v1.2.0)**: a mutual-exclusion protocol for the failure mode this repo actually hit — two independent agent sessions sharing one git checkout, where a branch switch or stash pop orphans the other session's uncommitted work. Before any git mutation, sessions probe `.agents/artifacts/WORKTREE-LEASE.md` (≤20-line claim ticket: owner, branch, heartbeat, declared write scope, stash/backup notes): absent → acquire; fresh heartbeat (≤30 min) → take a separate `git worktree add` directory, stay read-only, or wait — never mutate shared git state; stale heartbeat → takeover with foreign-WIP preservation. Holder duties codify the collision-avoidance rules learned in the #73 repair: stage explicit paths only, never pop a stash you did not create, re-diff shared surfaces (`skills.json`, `llms.txt`, README, CHANGELOG) hunk-by-hunk before staging, refresh the heartbeat at milestones. Session close releases the lease with a residual-state note folded into `HANDOFF.md`. Collisions that slip through get a five-step repair ladder (assess → backup foreign WIP → rebuild on a feature branch with explicit paths → `push --force-with-lease` → restore), replacing improvisation with procedure. Full contract: [worktree-lease-protocol.md](skills/context-orchestration/coupling-router/references/worktree-lease-protocol.md).
- **Persistent Evidence Tracking (`evidence-ledger` v2.0.0)**: reworked from a one-shot claim auditor into a persistent per-project evidence system for multi-client agency workflows — an append-only `evidence-ledger.md` per project in `.agents/context/` tracking four entry categories (DECISION with options considered and evidence trail, COMMITMENT with deadline and delivery proof, CLAIM with verification receipts, STATUS with blocker tracking), a nine-state status lifecycle (`ACTIVE`/`VERIFIED`/`FULFILLED`/`PROMISED`/`OVERDUE`/`STALE`/`SUPERSEDED`/`QUARANTINED`/`REDACTED`), and six `/evidence` commands: `onboard` (mines `.agents/context/` files into a starter ledger with `[IMPORTED]` provenance), `status` (regenerated dashboard, health score, staleness sweep), `decide` (decision records with secretary gating on high-stakes), `commit` (client promises auto-flagged `OVERDUE`), `audit` (the original v1.x claim verification gate, now feeding the ledger and triaging quarantine via `dead-letter`), and `brief` (context-switch briefing with `context-anchor` parking and `handoff` dispatch). Ships a canonical entry schema ([evidence-entry-schema.md](skills/context-orchestration/evidence-ledger/references/evidence-entry-schema.md)), automatic staleness rules ([staleness-rules.md](skills/context-orchestration/evidence-ledger/references/staleness-rules.md)), a full skill-orchestration map ([skill-orchestration.md](skills/context-orchestration/evidence-ledger/references/skill-orchestration.md)), and worked ledger + brief examples.
- **Artifacts Rule Codified in the DOX Engine (ai-ready v1.3.0, updatedocs v2.2.0, new-project v2.5.0)**: research corpora, planning docs, and working notes now have a declared home — `.agents/artifacts/<topic>/` — enforced across all four DOX layers instead of relying on convention inference. The scaffold deploys a contract stub (`ai-ready/templates/.agents/artifacts/README.md`: subfolder-per-topic, dated report files, method headers on research receipts, promotion path artifact → distilled finding → `decisions.md`/`.agents/context/`, local-only and disposable at project close); both AGENTS.md routers state the rule (repo router gains an artifacts line; the 50-line template amends Invariant 8 without breaching the rail); `ai-ready` audits it as **asset 13** (artifacts are contained + zero research litter in the tracked tree), lifting the suite to 13/13; and `updatedocs` classifies `.agents/artifacts/**` as **`DO NOT TOUCH`** — session-owned working state, mirroring the `.memory/` no-touch boundary.
- **Mode-Router UI Engine (`refactor-ui` v1.1.0)**: six quick-reference modes — `review` (default; verdict + severity table, no edits), `audit` (scripted anti-pattern + WCAG 2.2 AA scan, scored Block/Approve report artifact), `improve` (the 5-step refactor), `sweep` (multi-page consistency matrix with batched fixes), `tokens` (extract-and-centralize; pixels don't move), and `polish` (launch-readiness drift triage) — each a scoped contract in the new [modes.md](skills/design-interface/refactor/references/modes.md) so agents load only what the running mode needs.
- **Modern-Techniques Layer (`refactor-ui` v1.1.0)**: [modern-techniques.md](skills/design-interface/refactor/references/modern-techniques.md) distills a 127-source agent-skill corpus (deduplicated, boilerplate-stripped, deep-read) into rules composing with the baseline heuristics — concentric radius law (`inner = outer − padding`), 2× grouping ratio (space before surfaces before lines), container-query doctrine (components adapt to their container; logical properties; safe areas; 200% zoom), modern typography mechanics (60–75ch measure, line-height by role, size-specific tracking, tabular-nums, 16px mobile inputs, weight floors), named z-scale tokens, dark-mode surface ladder, light/dark theme parity, and the static-cue rule that routes all motion choreography to the `animate` skill.
- **Proof-Gated Findings & Honest Verification (`refactor-ui` v1.1.0)**: a finding requires Contract (binding rule) + Runtime (reaches the rendered surface) + Correction (one deterministic change); report format is a severity table (Severity/Location/Before/After/Why, one row per root cause across every location), verdict is **Block** when any HIGH or WCAG 2.2 AA text failure remains, and every check not actually run is declared `Not verified`.
- **Zero-Dependency Bun Tooling (`refactor-ui` v1.1.0)**: ported the Python scripts to TypeScript — [audit-ui.ts](skills/design-interface/refactor/scripts/audit-ui.ts) (anti-pattern scanner, now also catching raw z-index values and `outline-none` without focus alternatives, with JSX-style `boxShadow`/`outline` handling and CI-ready exit codes) and [check-contrast.ts](skills/design-interface/refactor/scripts/check-contrast.ts) (WCAG contrast with AA/AAA and large-text/UI thresholds); both verified against positive and negative fixtures; [public README](skills/design-interface/refactor/README.md) rewritten for first-contact users (install → mode table → scripts → workflow → companion skills), plus a worked audit-mode report example.
- **Workstream Parking & Layering (`context-anchor` v1.1.0)**: anchors gain agency-scale operations — named client-workstream anchors (`.agents/anchors/<slug>.md`) with park / switch / list operations (`/park`, `/switch-task`), a consume protocol on resume (≤3-line re-entry block plus a branch+timestamp freshness gate), `workstream:`/`branch:`/`Client:`-codename headers with `resume by:` clauses, and a client-confidentiality guard (codenames under NDA, zero secrets, archive-or-wipe at project close). Includes the normative [layering protocol](skills/context-orchestration/context-anchor/references/layering-protocol.md) with `handoff` v2.1.0: anchors are the intra-session focus layer and fold into `HANDOFF.md` at session close; workspace entry reads `HANDOFF.md`, never a stale anchor — resolving the two-state-file overlap between the skills.
- **CI Gate & Complete Scaffold (`ai-ready` v1.2.0)**: `--fail-under N` exits `1` when the verified score falls below `N` for use as a merge gate; `--scaffold` now fills the gaps it always claimed to close — `.mcp.json` (least-privilege template), an `llms.txt` discovery skeleton, the `.github/` bundle (`dependabot.yml`, bug/feature issue templates, anti-slop PR template), and `.env.example` — never overwriting existing files, with an asset-aware tip distinguishing scaffolding-owned assets from team-authored ones (CI pipeline, changelog, contributing, durable docs).
- **GitHub Template Bundle (`ai-ready` v1.2.0)**: new `templates/github/` (dependabot, issue forms, PR template) plus `templates/env.example`, `templates/mcp.json.template`, and `templates/llms.txt` powering the expanded scaffold.
- **Self-Application (`ai-ready` v1.2.0 dogfood)**: ran the new scaffold on muse-skills itself — deployed `.mcp.json`, `.env.example`, and the `.github/` bundle (21 existing files preserved, zero clobber), and authored the repository's first CI pipeline (`.github/workflows/ci.yml` running `bun test` on PRs and pushes to `dev`/`main`); trimmed `AGENTS.md` from 102 to 41 lines as a lean DOX rail, relocating the full Git workflow & SemVer release lifecycle to `CONTRIBUTING.md`; the repository now passes its own Stage-0 Fast-Skip gate at 12/12.
- **Ambient Continuity (`handoff` v2.1.0)**: a third operating mode that makes continuation the default — a ≤30-line `.agents/artifacts/HANDOFF.md` live-state file (fixed name, overwritten on every real state change) written passively at checkpoints, decisions, incomplete turn-ends, and ending signals, and probed on every workspace entry so any new conversation or agent resumes prior work with no explicit handoff request.
- **State-Source Ladder (`handoff` v2.1.0)**: cold-start resolution order for prior state — live file → memory recall → `.agents/context/` project context → git forensics (with a mandatory write-back of HANDOFF.md after reconstruction) → honest cold-start declaration — plus hard token budgets (one-command entry probe, ≤5-line resumption block, on-demand detail).
- **Memory Hooks (`handoff` v2.1.0)**: durable decisions pushed through the runtime's memory-write tool API on dispatch/full flush and recall filtered to directory boundaries on entry; `.memory/**` remains untouched by hand (owned by `musememory`), with `updateagents` as the durable-truth fallback.
- **Ambient Contract References (`handoff` v2.1.0)**: new [Ambient Continuity & Live Handoff File Contract](skills/context-orchestration/relay/references/ambient-handoff.md) (file schema, freshness rules, write triggers, memory protocol), a git-forensics recipe in the [resumption protocol](skills/context-orchestration/relay/references/resumption-protocol.md), and a [sample live HANDOFF file](skills/context-orchestration/relay/examples/sample-HANDOFF.md) example.
- **External Dogfood Runbook (docs/DOGFOOD.md)**: a ~45-minute runbook exercising the multi-project story this repo cannot test on itself — `new-project`/`ai-ready` scaffold, cross-session continuity (`handoff` ambient resume, including a deliberate kill test), `context-anchor` workstream parking across clients, `evidence-ledger` decision tracking, and a shared-checkout two-session lease scenario — with a per-phase verification table and an evidence-file reporting protocol for rough edges.
- **Drift & Lease Hardening Pins (tests/hardening.test.ts)**: five new invariant pins that make previously ad-hoc checks permanent — skills.json↔SKILL.md frontmatter version parity, frontmatter description parity (the class that drifted on `new-project` and 4 others), llms.txt description parity, executable lease-gate behavior (acquire/defer/takeover/refresh/release), and CI least-privilege permissions. The pins immediately caught and fixed 6 real drifts on landing.
- **Generated-Secret Hygiene (new-project)**: scaffolded projects' `.env` secrets (`JWT_SECRET`, `COOKIE_SECRET`, `PAYLOAD_SECRET`, `BETTER_AUTH_SECRET`, `CMS_ENCRYPTION_KEY`, EMDASH key) are now generated per-project with `crypto.randomBytes` at scaffold time instead of shipping predictable static literals — the security audit's F1 finding, pinned by test so the class cannot regress.

### Changed

- **Remediation Loop & Skill Routing (`audit` v1.1.0)**: upgraded the knowledge-hygiene audit from a findings-only scan to a closed loop — a 7-step pipeline with operating modes (Quick / Standard / Deep), a per-step progress reporting protocol, severity-routed remediation action classes (`AUTO-REPAIR` / `PROPOSE-DIFF` / `REPORT-ONLY` / `DEFER-ROUTE`), a re-verification delta table with explicit certification, and a companion-skill routing table (`updatedocs`, `updateagents`, `evidence-ledger`, `dead-letter`, `ai-ready`, `coach`, `periodic-retreat`) with fallbacks for absent companions.
- **Remediation Boundaries (`audit` v1.1.0)**: secret findings are now `PROPOSE-DIFF` plus a rotation recommendation instead of silent auto-masking; governance and historical documents receive findings, not edits; added the [Remediation Matrix & Routing Boundaries](skills/quality-review/audit/references/remediation-matrix.md) reference and four remediation boundary rules in [Knowledge Hygiene Rules](skills/quality-review/audit/references/hygiene-rules.md).
- **Artifact Standardization (`audit` v1.1.0)**: renamed the report artifact to `brain-audit-report.md` everywhere (the name the skill description always promised), added a persistent Deep-mode progress log in `.agents/artifacts/`, and rewrote the worked [sample report](skills/quality-review/audit/examples/sample-audit-report.md) with step ledger, delta table, and condensed Quick-mode form.
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
