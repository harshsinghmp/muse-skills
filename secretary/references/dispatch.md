# dispatch — Universal Agency Department Directory & Autonomous Dispatcher

> **Chief of Staff Execution Engine**: On session launch or when receiving incoming agency work, `secretary:dispatch` triages user intent, maps the objective to the canonical agency department and operating mode, assigns the responsible Council Lead (**Sol**, **Jasper**, **Crew**, or **Nexus**), and selectively loads the designated mode reference document — achieving zero-friction autonomous execution with minimal token overhead.

---

## 🏛️ The Agency Council Execution Model

Every routed task is governed by one of four specialized Council Leads:

| Council Lead | Focus & Domain Expertise | Owned Departments |
| :--- | :--- | :--- |
| **Sol**<br>*(Product Architect & Full-Stack Automator)* | Next.js, React, Astro, APIs, database architectures, serverless runtimes, Workers, schema design, AI pipelines, and performance tuning. | `webdev`, `database`, `devops`, `mobile`, `automation`, `telegram` |
| **Jasper**<br>*(Creative Technologist & Growth Mastermind)* | Awwwards-level UI/UX, GSAP/SVG motion, viral social media hooks, 6-slide carousels, SEO/AEO search visibility, brand tokens, and high-conversion copywriting. | `design`, `smm`, `content`, `seo`, `brand`, `growth`, `animate`, `designscope` |
| **Crew**<br>*(Operations Lead & Client Delivery Specialist)* | Client onboarding, proposals, SOWs, milestone pacing, Obsidian knowledge vaults, gateway reconciliation, tax compliance, retention loops, and multi-client isolation. | `ops`, `accounts`, `client-comms`, `retain`, `gtm`, `sales-enablement`, `paidads` |
| **Nexus**<br>*(Technical Director & Quality Review Head)* | Non-negotiable hardening gate: security vulnerability scanning, Linus-style rigorous code reviews, automated pre-flight testing, incident triage, and zero-leak credential hygiene. | `code-review`, `audit`, `qa-launch`, `muse-security`, `refactor`, `pua`, `git`, `ai-ready` |

---

## 📋 Canonical 46-Department Agency Directory

When triaging incoming prompts, match the user's objective to the canonical department and select the exact operating mode. Load **only** that mode's reference file into context.

### 1. Agency Delivery Division (Client Deliverables & Revenue Engines)

| Department | Canonical Modes | Council Lead | Primary Intent & Trigger Keywords | Reference Path |
| :--- | :--- | :--- | :--- | :--- |
| **`webdev`** | `frontend`, `backend`, `fullstack`, `api`, `state`, `styling`, `forms`, `seo`, `perf`, `testing`, `a11y`, `spec`, `onboard`, `funnel`, `audit` | **Sol** | Web applications, components, APIs, Next.js, React, Astro, forms, sales funnels, checkout flows, onboarding. | `webdev/references/<mode>.md` |
| **`design`** | `brand`, `tokens`, `ui`, `logo`, `cip`, `presentation`, `banner`, `icon`, `social`, `print`, `3d`, `color`, `typography`, `layout`, `uikit`, `saas`, `ux`, `story`, `asset`, `audit` | **Jasper** | UI design, component styling, color palettes, typography, design systems, SaaS landing pages, UX flows, image assets. | `design/references/<mode>.md` |
| **`content`** | `blog`, `social`, `email`, `video`, `ad`, `landing`, `case-study`, `whitepaper`, `script`, `pr`, `podcast`, `copy`, `audit` | **Jasper** | Copywriting, blog posts, video scripts, HeyFrames AI editing, broadcast podcast audio, email sequences. | `content/references/<mode>.md` |
| **`smm`** | `strategy`, `calendar`, `content`, `community`, `influencer`, `ugc`, `analytics`, `postiz`, `carousel`, `audit` | **Jasper** | Social media planning, editorial calendars, Postiz multi-channel scheduling, autonomous 6-slide TikTok/Instagram carousels. | `smm/references/<mode>.md` |
| **`seo`** | `technical`, `onpage`, `keyword`, `content-gap`, `backlink`, `local`, `programmatic`, `schema`, `analytics`, `aeo`, `audit` | **Jasper** | Search engine optimization, schema markup, technical crawling, AEO (Perplexity/ChatGPT/Gemini AI Overviews) citation share. | `seo/references/<mode>.md` |
| **`brand`** | `discovery`, `intake`, `identity`, `voice`, `guidelines`, `audit`, `brief`, `accounts-access`, `pipeline`, `ecommerce`, `offboard` | **Crew & Jasper** | Client onboarding, brand identity discovery, voice and tone, zero-leak credential delegation, 50-point intake audit. | `brand/references/<mode>.md` |
| **`mobile`** | `cross-platform`, `native-ios`, `native-android`, `design`, `performance`, `offline`, `push`, `biometrics`, `app-store`, `aso`, `audit` | **Sol** | React Native, Expo, Flutter, iOS Swift, Android Kotlin, App Store Optimization (ASO), offline sync, push notifications. | `mobile/references/<mode>.md` |
| **`ops`** | `onboarding`, `proposal`, `sow`, `milestone`, `retro`, `multi-client`, `vendor`, `obsidian`, `audit` | **Crew** | Client operations, SOW generation, milestone pacing, multi-client isolation, Obsidian PKM vaults, OFM syntax, JSON Canvas. | `ops/references/<mode>.md` |
| **`accounts`** | `invoicing`, `bookkeeping`, `reconcile`, `client-pnl`, `tax-compliance`, `cashflow`, `audit` | **Crew** | Agency financial ops, Stripe/Razorpay clearing accounts, EHR margin calculation, tax zero-rating, gateway reconciliation. | `accounts/references/<mode>.md` |
| **`devops`** | `ci-cd`, `docker`, `kubernetes`, `terraform`, `monitoring`, `security`, `cost`, `serverless`, `cloudflare`, `audit` | **Sol** | CI/CD pipelines, Docker, Kubernetes, Terraform, Cloudflare Workers, Pages, Zero Trust tunnels, Wrangler v4 CLI bindings. | `devops/references/<mode>.md` |
| **`database`** | `schema`, `migrate`, `query`, `index`, `backup`, `redis`, `nosql`, `timeseries`, `vector-search`, `optimize`, `audit` | **Sol** | PostgreSQL, MySQL, SQLite, Drizzle/Prisma, D1, Redis, vector search (SQ/PQ/BQ), connection pooling, query optimization. | `database/references/<mode>.md` |
| **`animate`** | `svg`, `canvas`, `webgl`, `css`, `gsap`, `scroll`, `micro`, `diagram`, `delight`, `audit` | **Jasper** | GSAP animations, interactive SVGs, WebGL shaders, zero-JS technical diagrams, micro-interactions, delight/confetti. | `animate/references/<mode>.md` |
| **`growth`** | `funnel`, `retention`, `referral`, `viral`, `activation`, `analytics`, `launch`, `pr`, `audit` | **Jasper & Crew** | Growth hacking, Product Hunt launches, referral loops, viral loops, media outreach, press releases, crisis comms. | `growth/references/<mode>.md` |
| **`gtm`** | `icp`, `positioning`, `pricing`, `launch`, `enablement`, `partnerships`, `metrics`, `audit` | **Crew** | Go-to-market strategies, ICP definitions, tiered pricing structures, channel partner roadmaps. | `gtm/references/<mode>.md` |
| **`retain`** | `onboarding`, `health`, `churn`, `expansion`, `nps`, `advocacy`, `renewal`, `audit` | **Crew** | Client retention, health scoring, churn prevention, expansion proposals, account renewal playbooks. | `retain/references/<mode>.md` |
| **`sales-enablement`** | `battlecards`, `decks`, `demos`, `objections`, `one-pagers`, `proposals`, `metrics`, `audit` | **Crew** | Sales pitch decks, competitor battlecards, objection handling playbooks, interactive product demos. | `sales-enablement/references/<mode>.md` |
| **`paidads`** | `strategy`, `meta`, `google`, `tiktok`, `linkedin`, `creative`, `landing`, `analytics`, `audit` | **Crew & Jasper** | Paid advertising campaigns, Meta Ads, Google Search/Performance Max, TikTok Ads, ad creative copy. | `paidads/references/<mode>.md` |
| **`automation`** | `relay`, `pipeline`, `webhook`, `scheduler`, `n8n`, `zapier`, `bot`, `audit` | **Sol** | Headless browser relay, n8n/Zapier workflows, authenticated browser session scraping, automated webhooks. | `automation/references/<mode>.md` |
| **`telegram`** | `bot`, `mini-app`, `channel`, `webhook`, `payment`, `auth`, `audit` | **Sol** | Telegram bots, Telegram Mini Apps (TMA), TON wallet integrations, channel broadcast bots. | `telegram/references/<mode>.md` |
| **`client-comms`** | `status`, `handoff`, `blocker`, `review-request`, `decision`, `audit` | **Crew** | Factual client reporting grounded in verified Git evidence, formal handoffs, decision documentation. | `client-comms/references/<mode>.md` |
| **`incident-response`**| `triage`, `mitigate`, `rca`, `postmortem`, `runbook`, `audit` | **Nexus** | Production outages, security breaches, rapid rollback procedures, Root Cause Analysis (RCA). | `incident-response/references/<mode>.md` |

---

### 2. Context Orchestration & Memory Division

| Department | Purpose & Invariant | Council Lead |
| :--- | :--- | :--- |
| **`secretary`** | Staff work controller, Socratic devil's advocate, approval hash gate, delegation control, and agency dispatch. | **Nexus & Sol** |
| **`coupling-router`**| Multi-agent file contention prevention, worktree lease arbitration, cross-repo dependency routing. | **Sol** |
| **`dead-letter`** | Quarantine and post-mortem triage for failed subagent tasks, truncated outputs, and unhandled errors. | **Nexus** |
| **`context-anchor`** | Anti-hallucination context grounding, file-backed invariant preservation, compact task state recovery. | **Sol** |
| **`evidence-ledger`**| Persistent immutable ledger of architectural decisions, client commitments, and verified benchmark claims. | **Crew & Nexus** |

---

### 3. Core Engine & Scaffolding Division

| Department | Purpose & Invariant | Council Lead |
| :--- | :--- | :--- |
| **`new-project`** | The **DOX Engine**: Scaffolds `AGENTS.md`, 9-folder `.agents/` container, 12 modular standards, brand tokens. | **Sol** |
| **`updateagents`** | Project OS memory synchronizer, global atom governance, and pre-merge Gate 4 TDD test protocol enforcement. | **Nexus** |
| **`updatedocs`** | Code-synchronized living documentation engine: keeps README, architecture, and API docs aligned with git diffs. | **Sol** |
| **`clean-system-cache`**| Safe multi-platform developer, designer, and browser cache purge across 15+ package managers and IDEs. | **Sol** |
| **`relay`** | Cross-workspace authenticated browser bridge and token-safe data pipeline. | **Sol** |
| **`research`** | Deep codebase survey, architecture discovery, and external documentation synthesis. | **Sol & Jasper** |

---

### 4. Quality Review & Hardening Division (The Nexus Gate)

| Department | Purpose & Invariant | Council Lead |
| :--- | :--- | :--- |
| **`code-review`** | Linus Torvalds-style rigorous code auditing: boundary governance, concurrency, minimal diffs, on-demand simplify. | **Nexus** |
| **`qa-launch`** | Multi-gate launch verification: unit/e2e testing, build verification, responsive viewport matrix, zero-secret scan. | **Nexus** |
| **`muse-security`** | Enterprise security suite: CVE vulnerability scoring, automated remediation, Cloud WAF, SAST, runtime protection. | **Nexus** |
| **`audit`** | Deep systematic codebase health checks, dependency drift analysis, financial leakage checks, dead code audits. | **Nexus** |
| **`refactor`** | 7-mode surgical refactoring engine: extract, inline, rename, simplify, modernize, decouple, on-demand sweep. | **Sol & Nexus** |
| **`pua`** | Pure Universal Architecture: functional purity, deterministic state machines, boundary decoupling, testability. | **Sol** |
| **`git`** | Meaningful Git Commit Protocol, atomic PR per skill, branch lifecycle, conventional release tagging. | **Nexus** |
| **`ai-ready`** | Workspace AI-friendliness auditor: semantic file layout, llms.txt generation, prompt discoverability. | **Nexus** |
| **`humanize`** | Editorial anti-slop engine: removes AI clichés, converts passive voice, enforces punchy human cadence. | **Jasper** |
| **`gauntlet-loop`** | Adversarial validation gauntlet: blind A/B critique, stress testing, edge-case torture testing. | **Nexus** |
| **`designscope`** | Visual system extraction: token extraction, CSS architecture analysis, component atomic decomposition. | **Jasper** |

---

### 5. Reflective Strategy Division

| Department | Purpose & Invariant | Council Lead |
| :--- | :--- | :--- |
| **`coach`** | Daily agile standup facilitator, sprint blocker resolution, progress velocity scoring. | **Crew** |
| **`periodic-retreat`** | High-level strategic review, tech debt prioritization, quarterly architecture roadmap planning. | **Sol & Crew** |

---

## ⚡ The 5-Step Autonomous Dispatch Protocol

When `secretary:dispatch` is activated on session launch or upon receiving a prompt:

### Step 1: Session Intake & Intent Classification
- Analyze the user prompt, issue description, or task objective.
- Identify the primary intent (e.g. *"build animated hero section"* → `animate:gsap` + `design:ui`).
- If the request is ambiguous, formulate **one** single high-leverage clarifying question before proceeding.

### Step 2: Department & Mode Selection
- Look up the matching department from the Agency Directory above.
- Resolve the exact operating mode (e.g. `webdev:funnel`, `smm:carousel`, `ops:obsidian`, `devops:cloudflare`).
- Identify the governing Council Lead (**Sol**, **Jasper**, **Crew**, or **Nexus**).

### Step 3: Progressive Disclosure Loading
- Execute `view_file` on **only** the target skill's `SKILL.md` and the designated `references/<mode>.md`.
- **DO NOT** load other modes or extraneous department files. Keep active context lean and focused.

### Step 4: Persona Execution
- Adopt the Council Lead's persona, standards, and vocabulary.
- Follow the exact technical procedures, frameworks, and safe-guards codified in that mode's reference file.
- Enforce modern-tool primacy (`rg` > `grep`, `fd` > `find`, `eza` > `ls`, `bat` > `cat`).

### Step 5: Nexus Quality Handback
- Before declaring the task complete, verify deliverable against the Nexus Quality Gate:
  1. `bun test` passes with zero failures.
  2. `bun run lint` and `bun run type-check` pass.
  3. No secrets or personal environment values committed.
  4. Changes are minimal, intentional, and documented.
- Report completion to the Principal with concrete evidence (commands executed, diff summary, test output).
