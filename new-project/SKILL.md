---
name: new-project
aliases: ["Agent Engine","DOX Engine","agent-engine","dox-engine"]
description: "Intent-First interactive project creator, companion configurator, DOX Engine, and Agent Engine provisioner. Bootstraps the Agents-First architecture (AGENTS.md, 9-folder .agents/ container, 13 modular standards, brand tokens, and cognitive memory) before interactively composing project intent, framework (Next.js 16, Astro v7, Instatic HTML, Roots Bedrock, Expo), styling (Hybrid UnoCSS Wind 4 + BEM), animations (CSS presets, Motion.dev, GSAP), state management (NanoStores cross-island store), mobile conversion (Ionic Capacitor for Astro/Next.js to iOS/APK, Expo for React), CMS (Aria Builder, Payload + Puck, StudioCMS, Git-based CMS), e-commerce (Payload, Medusa v2, Fastrr, Razorpay), and database (Neon, Supabase, Postgres, SQLite). Trigger whenever the user asks for 'new-project', 'Agent Engine', 'DOX Engine', 'scaffold Project OS', or to initialize an agent-governed workspace."
version: 2.2.0
author: DOX Engine Provisioner
license: MIT
platforms: [macos, linux, windows]
category: core-engine
metadata:
  category: core-engine
  priority: 5
  aliases: ["Agent Engine","DOX Engine","agent-engine","dox-engine"]
  suggested_skills: ["ai-ready","updateagents","updatedocs","git"]
  hermes:
    tags: [scaffolding, governance, project-os, architecture, nextjs, astro, instatic, expo, capacitor, nanostores, wordpress, dox, agent-engine, dox-engine]
    related_skills: [ai-ready, updateagents, updatedocs, git]
    suggested_skills: [ai-ready, updateagents, updatedocs, git]
    requires_tools: [bash, view_file, write_to_file]
  openclaw:
    category: core-engine
    suggested_skills: [ai-ready, updateagents, updatedocs, git]
    primary_triggers: ["new-project","Agent Engine","DOX Engine","scaffold Project OS","initialize agent workspace"]
    requires_tools: [bash, view_file, write_to_file]
  compatibility: [hermes, openclaw, claude-code, codex, cursor, gemini-cli, opencode]
---

# 🚀 new-project — Intent-First Project OS & DOX Scaffolder

> **Aliases**: `Agent Engine` | `DOX Engine` | `agent-engine` | `dox-engine`

Interactive project creator and Project Operating System provisioner. Implements the **"Agents First, Then Intent-Driven Companions"** architecture with a zero-token **Stage-0 Fast-Skip Gate**:
0. **Stage 0: AI-Ready Pre-Flight Gate**: Checks if root `AGENTS.md` and `.agents/` container already exist and pass `ai-ready` audit. If healthy, skips scaffolding immediately.
1. **Stage 1: Governance Container**: Directly copies the complete Agent Engine from `ai-ready/templates/` (lean root `AGENTS.md` [<50 lines], `.gitignore`, 9-folder `.agents/` container, 13 modular standards, and brand tokens), and initializes cognitive memory.
2. **Stage 2: Intent-First Framework & Companion Injection**: Interactively cascades choices based on user intent (Brochure, Content, E-Commerce, Web App, Mobile App) to scaffold frameworks (`@latest`), inject styling engines (Hybrid UnoCSS Wind 4 + BEM), high-fps animation presets, NanoStores state sharing, Ionic Capacitor / Expo mobile packaging, headless/git CMS, e-commerce checkouts, databases, and authentication.
3. **Stage 3: Closeout DOX Pass**: Synchronizes `.agents/context/current.md` and `architecture.md` with verified live deliverables.

---

## When to Use

- User invokes or references *"Agent Engine"*, *"DOX Engine"*, *"new-project"*, *"scaffold a workspace"*, or *"initialize Project OS"*.
- Setting up a new client application, agency showcase, microservice, or prototype with the DOX Engine.
- Equipping an existing unorganized repository with the Agent Engine / Progressive Disclosure DOX architecture.
- Scaffolding a full-stack Next.js, Astro, Instatic, WordPress, or Expo project with companion integrations.
- Converting an Astro or Next.js web application to native iOS and Android APK via Ionic Capacitor.
- Running `ai-ready` pre-flight to verify existing workspace health before framework execution.

---

## Quick Reference & Presets

### ⚡ 1-Click Agency Golden Presets

| Preset Flag | Target Intent | Core Stack & Companions |
| :--- | :--- | :--- |
| `--preset=powerhouse` | E-Commerce / Full-Stack | Next.js 16 (`@latest`) + Hybrid UnoCSS Wind 4 + Motion.dev + NanoStores + Payload CMS + Puck Visual Builder + Payload E-Commerce + Neon DB + Better Auth |
| `--preset=publisher` | Content / Publication | Astro v7 (`@latest`, zero-JS baseline) + Hybrid UnoCSS + Motion.dev + NanoStores + StudioCMS (LibSQL/Turso) |
| `--preset=visual` | Brochure & Visual Sites | Astro v7 + Hybrid UnoCSS + Hardware CSS Animations + NanoStores + Aria Builder (`ariabuilder.io`) + Fastrr 1-click checkout |
| `--preset=edge` | Static Edge Sites | Astro v7 + Hybrid UnoCSS + Hardware CSS Animations + NanoStores + SitePins Git-based CMS |
| `--preset=instatic` | Pure HTML Sites | Instatic SSG + Semantic BEM CSS + Hardware CSS Animations (Zero Node/JS runtime) |
| `--preset=mobile` | Cross-Platform App | React Native (Expo `@latest`) + NativeWind + Supabase Backend |
| `--preset=astro-mobile` | Web-to-APK / Mobile App | Astro v7 + Hybrid UnoCSS + Hardware CSS Animations + NanoStores + Aria Builder + **Ionic Capacitor** (iOS/APK) |

---

## Supported Framework Archetypes (`@latest`)

| Framework | Mental Model & Directives | Scaffolder |
| :--- | :--- | :--- |
| **Next.js 16** | React 19 + App Router + Server Actions | `bun create next-app@latest .` |
| **Astro v7** | Static-first (0kB JS baseline). React strictly for dynamic islands | `bun create astro@latest .` |
| **Instatic HTML** | Pure HTML brochure, zero compute overhead | Instatic SSG starter |
| **Roots Bedrock** | Modern WordPress 6.x (12-factor, Composer, dotenv, Gutenberg) | `composer create-project roots/bedrock .` |
| **React Native (Expo)** | Cross-platform iOS/Android mobile apps | `bun create expo-app@latest .` |
| **None / Existing** | Governance container only (DOX baseline on existing repo) | Agents First only |

---

## Procedure

### Step 1: Launch Provisioner
Execute the universal scaffolder script via Bun:

```bash
# Interactive Mode (Prompts for Intent -> Framework -> Companions)
bun new-project/scripts/new-project.ts

# 1-Click Agency Preset
bun new-project/scripts/new-project.ts <targetPath> --preset=powerhouse

# Convert Astro Web App to Native iOS/APK
bun new-project/scripts/new-project.ts <targetPath> --preset=astro-mobile

# Granular Non-Interactive Mode
bun new-project/scripts/new-project.ts <targetPath> \
  --intent=ecommerce \
  --type=nextjs \
  --styling=hybrid \
  --animation=motion \
  --state=nanostores \
  --mobile=capacitor \
  --cms=payload \
  --puck \
  --ecommerce=medusa \
  --db=postgres \
  --auth=better-auth
```

### CLI Flags Reference

| Flag | Type | Description |
| :--- | :--- | :--- |
| `-n, --name <name>` | String | Project name (default: directory basename) |
| `-p, --path <path>` | String | Target directory path |
| `--author <name>` | String | Project author or organization name |
| `--tagline <desc>` | String | Project mission or summary |
| `--audience <aud>` | String | Target audience or user persona |
| `--problem <prob>` | String | Core problem solved by the project |
| `--features <list>` | String | Comma-separated core features |
| `--tone <tone>` | String | Brand voice / design aesthetic (e.g. Minimalist, High-Tech, Warm) |
| `--palette <color>` | String | Brand theme: `slate` \| `indigo` \| `emerald` \| `amber` \| `violet` |
| `--first-milestone <m>` | String | Immediate next task / initial milestone |
| `--planned-milestones <list>`| String | Comma-separated planned milestones |
| `--agent-name <name>` | String | Lead autonomous agent persona name (default: `Orchestrator`) |
| `--agent-role <role>` | String | Lead agent functional role description |
| `--constraint <text>` | String | Primary operational constraint or invariant |
| `-i, --intent <intent>` | String | `brochure` \| `content` \| `ecommerce` \| `app` \| `mobile` \| `governance` |
| `--preset <preset>` | String | `powerhouse` \| `publisher` \| `edge` \| `visual` \| `instatic` \| `mobile` \| `astro-mobile` |
| `-t, --type <framework>` | String | `nextjs` \| `astro` \| `instatic` \| `wordpress` \| `expo` \| `custom` \| `none` |
| `-s, --styling <styling>` | String | `hybrid` (UnoCSS Wind 4 + BEM) \| `unocss` \| `bem` \| `tailwind` \| `custom` \| `none` |
| `-a, --animation <anim>` | String | `css` (Hardware presets) \| `motion` \| `gsap` \| `webgl` \| `custom` \| `none` |
| `--state <engine>` | String | `nanostores` (Sub-1KB cross-island store) \| `custom` \| `none` |
| `-m, --mobile <target>` | String | `capacitor` (Ionic Capacitor iOS/APK wrapper) \| `expo` (React Native) \| `custom` \| `none` |
| `-c, --cms <cms>` | String | `ariabuilder` \| `studiocms` \| `sitepins` \| `tina` \| `keystatic` \| `pagescms` \| `emdash` \| `payload` \| `decap` \| `keystone` \| `sanity` \| `strapi` \| `custom` \| `none` |
| `--puck` | Boolean | Enable Puck Visual Builder (for Payload CMS) |
| `-e, --ecommerce <ecom>` | String | `payload` \| `medusa` \| `vendure` \| `fastrr` \| `razorpay` \| `stripe` \| `custom` \| `none` |
| `--db <db>` | String | `neon` \| `supabase` \| `postgres` \| `sqlite` \| `custom` \| `none` |
| `--auth <auth>` | String | `better-auth` \| `supabase` \| `authjs` \| `custom` \| `none` |
| `--deploy <deploy>` | String | `cloudflare` \| `docker` \| `vercel` \| `custom` \| `none` |
| `--dry-run` | Boolean | Simulate without writing files |
| `--non-interactive` | Boolean | Run without interactive prompts |
| `-f, --force` | Boolean | Overwrite existing files |

---

## 🎙️ Interactive Onboarding Interview Protocol

When invoking this skill interactively (or when an AI agent is tasked with onboarding a new project for a user), the agent MUST conduct a structured 5-phase onboarding interview or invoke `new-project` in interactive mode. The gathered answers are dynamically synthesized into all onboarding documents without generic placeholders:

### Phase 1: Identity & Scope
1. **Project Name & Slug**: Clear name and package slug.
2. **Author / Organization**: Individual or team identity owning the codebase.
3. **Core Mission & Tagline**: One-sentence purpose.
4. **Target Audience**: Who this project serves.
5. **Problem Statement**: The exact friction or pain point addressed.

### Phase 2: Core Capabilities & Deliverables
1. **Core Features**: The 3–5 foundational capabilities of the system.
2. **First Milestone**: The immediate first task to be verified after scaffolding.
3. **Planned Roadmap**: Upcoming milestones for sprint planning.

### Phase 3: Brand & Aesthetic System
1. **Brand Voice**: Adjectives defining product tone (e.g. *Precision, High-Performance, Minimalist*).
2. **Design Palette**: Primary color theme (`slate`, `indigo`, `emerald`, `amber`, `violet`), dynamically injected into DTCG OKLCH tokens (`colors.json` & `base.css`).

### Phase 4: Technical Stack & Companions
1. **Project Intent**: Brochure, Content, E-Commerce, Web App, Mobile App, or Governance.
2. **Framework & Companions**: Selected framework archetype (`nextjs`, `astro`, `instatic`, `wordpress`, `expo`) and companion stack (styling, animation, state, mobile packaging, CMS, DB, auth).

### Phase 5: Autonomous Governance & Hard Constraints
1. **Lead Agent Persona**: Dedicated agent handle and functional role.
2. **Primary Operational Constraint**: Project invariant (e.g., zero client-side auth tokens, pure SSR, sub-100ms latency).

---

### Step 2: Stage 1 — Agents First (Governance Baseline & Dynamic Onboarding Docs)
Copies lean `AGENTS.md` (<50 lines) and `.gitignore`, creates `.agents/` 9-folder containment tree with 13 modular standards, and dynamically populates:
- `AGENTS.md`: Parameterized with project name, mission, and lead agent role.
- `.agents/context/product.md`: Dynamically filled with target audience, problem solved, value proposition, core features, and key deliverables.
- `.agents/context/brand.md`: Dynamically filled with brand voice, tone, and chosen color palette tokens.
- `.agents/context/roadmap.md`: Dynamically initialized with first milestone, planned milestones, and requested backlog.
- `.agents/context/architecture.md`: Dynamically initialized with chosen framework, styling, state, and mobile packaging.
- `.agents/context/decisions.md`: Seeded with initial ADRs reflecting the intent, framework, and styling decisions.
- `.agents/brand/tokens/colors.json` & `base.css`: Primary, secondary, and accent colors updated with the chosen OKLCH palette.
- `.memory/CURRENT.md`: Seeded with active constraints, selected framework standards, and the in-flight first milestone.

### Step 3: Stage 2 — Companion Injection
Generates configured companions:
- `uno.config.ts` with `@unocss/preset-wind4`
- `src/styles/tokens.css`, `semantic.css`, `reset.css` (OKLCH BEM system)
- `src/styles/animations.css` (`.fade-in`, `.slide-up`, `.stagger-group`, `.reveal-on-scroll`, `.hover-lift`)
- `src/stores/app.ts` (NanoStores reactive state engine across Astro islands and React)
- `capacitor.config.ts` (Ionic Capacitor iOS & Android APK configuration bridge with dynamic app ID)
- `src/lib/puck.config.tsx` (Puck Visual Builder configuration)
- `src/lib/db.ts` & `drizzle.config.ts` (Database connection and Drizzle schema)
- `src/lib/medusa.ts`, `src/lib/fastrr.ts`, `src/lib/razorpay.ts` (E-Commerce helpers)
- `.env.example` with exact companion placeholders
- `package.json` updated with companion packages and mobile build scripts (`cap:build`, `cap:sync`, `cap:ios`, `cap:android`)

### Step 4: Stage 3 — Closeout DOX Pass
Updates `.agents/context/current.md` and `.agents/context/architecture.md` with verified live deliverables and records the initial milestone under immediate focus.

### Step 5: Pattern Promotion & Skill Extraction (Continuous Self-Improvement)
When recurring patterns emerge across tasks (≥3 occurrences) and are verified by tests:
1. Review the 3 extraction gates in [`references/skill-extraction.md`](references/skill-extraction.md).
2. Execute `bun scripts/extract-skill.ts --name <skill-name> --desc "<desc>" --occurrences 3 --verified`.
3. Scaffolds an RFC-compliant skill container with `SKILL.md`, `README.md`, and `agents/openai.yaml` under `.agents/skills/<skill-name>/` or project root.

---

## Pitfalls

- **Skipping Agents First**: Never run framework generation before AI governance is initialized, or framework defaults may overwrite or conflict with agent boundaries.
- **Cross-Project Bleed**: Never copy client-specific skills, assets, or memory files from sibling projects. Every project starts with a clean isolated container.
- **Committing Secrets**: Ensure `.env` is listed in `.gitignore` and `.env.example` exists.
- **Monolithic Memory Dumps**: Keep `.memory/CURRENT.md` for machine real-time invariants and `.agents/context/current.md` for durable shipped reality.

---

## Verification

After scaffolding, verify the installation:
1. **Container Check**: Run `ls -la <targetPath>/.agents/` to ensure all 9 folders exist.
2. **DOX Check**: Verify `.agents/context/current.md` lists the initial deliverables under Section 2.
3. **Secret Scan**: Run pre-ship secret check on the new project directory.
