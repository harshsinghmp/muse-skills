---
name: new-project
aliases: ["Agent Engine","DOX Engine","agent-engine","dox-engine"]
description: "Purpose-First interactive project creator, companion configurator, DOX Engine, and Agent Engine provisioner. Implements a 6-stage sequential execution pipeline: Stage 1 (Purpose-First Root Prompt), Stage 2 (Hierarchical Decision Tree), Stage 3 (Official Package Installation & Config Auto-Wiring), Stage 4 (Modern OKLCH Tokens & Fluid BEM System), Stage 5 (Empathetic 7-Section start-here.md Guide), and Stage 6 (Interactive Brand Onboarding Gate). Bootstraps the Agents-First architecture (AGENTS.md, 9-folder .agents/ container, 13 modular standards, brand tokens, and cognitive memory) before interactively composing project intent, framework (Next.js 16, Astro v7, Instatic HTML, Roots Bedrock, Expo), styling (Hybrid UnoCSS Wind 4 + BEM), animations (CSS presets, Motion.dev, GSAP), state management (NanoStores cross-island store), mobile conversion (Ionic Capacitor for Astro/Next.js to iOS/APK, Expo for React), CMS (Aria Builder, Payload + Puck, StudioCMS, Git-based CMS), e-commerce (Payload, Medusa v2, Fastrr, Razorpay, Stripe), and database (Neon, Supabase, Postgres, SQLite). Trigger whenever the user asks for 'new-project', 'Agent Engine', 'DOX Engine', 'scaffold Project OS', or to initialize an agent-governed workspace."
version: 2.3.0
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

# 🚀 new-project — Purpose-First Project OS & DOX Scaffolder

> **Aliases**: `Agent Engine` | `DOX Engine` | `agent-engine` | `dox-engine`

Interactive project creator and Project Operating System provisioner. Implements the **Purpose-First Hierarchical Decision Engine** across **6 Sequential Execution Stages**:

```
[ 🎯 Stage 1: Purpose-First Prompt ] ──► [ ⚡ Stage 2: Hierarchical Decision Tree ]
                                                      │
[ 🎨 Stage 4: Modern OKLCH / BEM ]   ◄── [ 🔌 Stage 3: Official Package Wiring ]
         │
         ▼
[ 📖 Stage 5: Empathetic start-here.md ] ──► [ 📋 Stage 6: Brand Onboarding Gate ]
```

0. **Stage 0: AI-Ready Pre-Flight Gate**: Audits if root `AGENTS.md` and `.agents/` container already exist and pass `ai-ready` audit.
1. **Stage 1: Purpose-First Root Prompt & Project Identity**: Initiates interactively by querying the foundational domain purpose before prompting for identity, mission, and scope.
2. **Stage 2: Hierarchical Decision Tree**: Prunes irrelevant questions based on selected purpose across 6 branches (Static, Content, Ecommerce, WebApp, Mobile, Custom).
3. **Stage 3: Official Package Installation & Config Auto-Wiring**: Automatically wires framework configs (`astro.config.mjs`, `uno.config.ts`, `postcss.config.mjs`, `src/lib/medusa.ts`, `db.ts`, `auth.ts`, `capacitor.config.ts`, `.env.example`) and synchronizes official dependencies in `package.json` with self-verification.
4. **Stage 4: Modern Tokens & BEM Architecture Injection**: Injects wide-gamut OKLCH tokens, fluid `clamp()` typography & spacing scales (`src/styles/tokens.css`), and reusable semantic BEM classes (`.c-card`, `.c-button`, `.c-product-grid`, `.c-cart-drawer`).
5. **Stage 5: Beginner-Friendly `start-here.md` Guide**: Generates an empathetic 7-section developer handbook covering architecture, quick start, directory tour, styling, AI agent collaboration, recipes, and verification.
6. **Stage 6: Interactive Brand Onboarding Gate**: Generates structured brand, business, and offerings documentation (`Onboarding/01-Brand/`, `02-Business/`, `03-Menu/`), synchronizing DTCG tokens and context files.

---

## When to Use

- User invokes or references *"Agent Engine"*, *"DOX Engine"*, *"new-project"*, *"scaffold a workspace"*, or *"initialize Project OS"*.
- Provisioning a new client web application, headless storefront, digital publication, SaaS, or mobile app.
- Equipping an existing repository with the Agent Engine / Progressive Disclosure DOX architecture.
- Scaffolding a full-stack Next.js, Astro, Instatic, WordPress, or Expo project with companion integrations.
- Converting an Astro or Next.js web application to native iOS and Android APK via Ionic Capacitor.

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

### 🎯 6 Sequential Execution Stages

### Stage 1: Purpose-First Root Prompt & Project Identity
The provisioner never guesses the project domain from ambient files. It prompts:
```text
🎯 What is the primary purpose of this project?
  [1] Static Website          (Brochure, portfolio, landing page, minimal or zero compute)
  [2] Dynamic Content Website (Blog, publication, documentation, agency editorial)
  [3] Ecommerce Storefront    (Catalog, shopping cart, checkout, payments, inventory)
  [4] Full-Stack Web App      (SaaS, dashboard, auth, multi-tenant DB, background jobs)
  [5] Mobile Application      (Native iOS/Android, Expo React Native, or web-to-APK)
  [6] Custom / Infrastructure (Library, monorepo package, agent workspace, custom stack)
```
Gathers project name, tagline, author/organization, target audience, core problem, features, industry vertical, and catalog offerings.

### Stage 2: Hierarchical Decision Tree (Pruned Branches)
Each selection prunes irrelevant downstream choices:
- **Branch A (Static Website)**: Astro v7 (Zero-JS SSG) vs Instatic vs Next.js SSG ➔ Hybrid UnoCSS Wind 4 vs Semantic BEM ➔ Hardware CSS animations vs Motion.dev.
- **Branch B (Dynamic Content)**: Astro v7 vs Next.js 16 vs Roots Bedrock ➔ CMS (StudioCMS, Emdash, SitePins, Keystatic, Tina CMS, Pages CMS, Payload CMS) ➔ Puck Visual Builder opt-in.
- **Branch C (Ecommerce Storefront)**: Medusa v2 vs Payload E-Commerce vs Stripe Direct vs Vendure vs Fastrr ➔ Headless Astro SDK vs Next.js Storefront vs Monorepo ➔ Stripe Hosted Checkout vs Embedded Elements ➔ NanoStores reactive cart store.
- **Branch D (Full-Stack Web App)**: Next.js 16 App Router vs Astro SSR ➔ Neon Serverless Postgres + Drizzle vs Supabase vs Local Docker Postgres vs SQLite/Turso ➔ Better Auth vs Supabase Auth ➔ NanoStores vs Zustand.
- **Branch E (Mobile Application)**: React Native with Expo vs Astro + Ionic Capacitor (web-to-APK) vs Next.js + Capacitor.
- **Branch F (Custom / Infrastructure)**: Custom architecture or governance-only workspace.

### Stage 3: Official Package Installation & Config Auto-Wiring
- Auto-wires configuration files:
  - `uno.config.ts` (`@unocss/preset-wind4`, `@unocss/preset-icons`, theme tokens)
  - `postcss.config.mjs` (`@unocss/postcss`)
  - `astro.config.mjs` (UnoCSS integration)
  - `src/lib/medusa.ts` (`@medusajs/js-sdk` client adapter)
  - `backend/` (Full Medusa 2.0 sovereign backend application with `medusa-config.ts`, `docker-compose.yml` for PostgreSQL 16 & Redis 7, `package.json`, `tsconfig.json`, `.env.example`, and custom API endpoints)
  - `src/lib/db.ts` & `drizzle.config.ts` (Neon / Supabase / Postgres / SQLite)
  - `src/lib/auth.ts` (`better-auth`)
  - `src/lib/puck.config.tsx` (`@measured/puck`)
  - `src/stores/app.ts` (`nanostores`)
  - `capacitor.config.ts` (`@capacitor/cli`, `@capacitor/core`)
  - `.env.example` with exact companion placeholders
- Synchronizes official package dependencies in `package.json` with self-verification gate.
- Injects backend orchestration scripts (`dev:backend`, `backend:migrate`, `docker:up`, `docker:down`) when sovereign e-commerce engines are provisioned.

### Stage 4: Modern Tokens & BEM Architecture Injection
- `src/styles/tokens.css`: Wide-gamut OKLCH colors, fluid typography scale via `clamp()`, fluid spacing scale via `clamp()`, radii, transitions.
- `src/styles/semantic.css`: Reusable semantic BEM classes (`.c-card`, `.c-button`, `.c-product-grid`, `.c-product-card`, `.c-cart-drawer`).
- `src/styles/animations.css`: Hardware-accelerated GPU animations with `prefers-reduced-motion` compliance.

### Stage 5: Beginner-Friendly `start-here.md` Guide
Empathetic 7-section handbook generated at project root:
1. **Welcome & Architecture Snapshot**: Purpose, mental model, and stack matrix.
2. **Prerequisites & Quick Start**: Step-by-step setup commands.
3. **Project Structure Tour**: Annotated visual tree map of all directories.
4. **How Styling & Tokens Work**: OKLCH color space, fluid clamp scales, and BEM conventions.
5. **Working with AI Agents**: DOX Engine orientation, cognitive memory, and effective prompting.
6. **Common Tasks & Recipes**: Adding routes, creating BEM components, env vars, Drizzle migrations.
7. **Verification & Definition of Done**: Verification commands, Vibeguard secret defense, and DoD checklist.

### Stage 6: Interactive Brand Onboarding Gate
Generates structured onboarding documents:
- `Onboarding/01-Brand/`: `brand-identity.md`, `visual-direction.md`
- `Onboarding/02-Business/`: `business-model.md`, `audience-persona.md`
- `Onboarding/03-Menu/`: `offerings.md`
- Dynamically injects chosen OKLCH palette into `.agents/brand/tokens/colors.json` and `base.css`.
- Records initial shipped state in `.agents/context/current.md` and `.agents/context/product.md`.

---

## CLI Usage & Flags Reference

```bash
# Interactive Mode (Prompts for Purpose -> Hierarchical Tree -> Onboarding)
bun new-project/scripts/new-project.ts

# 1-Click Agency Golden Presets
bun new-project/scripts/new-project.ts <targetPath> --preset=powerhouse
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
  --auth=better-auth \
  --non-interactive
```

| Flag | Type | Description |
| :--- | :--- | :--- |
| `-n, --name <name>` | String | Project name (default: directory basename) |
| `-p, --path <path>` | String | Target directory path |
| `--author <name>` | String | Project author or organization name |
| `--tagline <desc>` | String | Project mission or summary |
| `--audience <aud>` | String | Target audience or user persona |
| `--problem <prob>` | String | Core problem solved by the project |
| `--features <list>` | String | Comma-separated core features |
| `--industry <niche>`| String | Industry or vertical |
| `--offerings <items>`| String | Core catalog items or services |
| `--tone <tone>` | String | Brand voice / design aesthetic |
| `--palette <color>` | String | Brand theme: `slate` \| `indigo` \| `emerald` \| `amber` \| `violet` |
| `--first-milestone <m>` | String | Immediate next task / initial milestone |
| `--planned-milestones <l>`| String | Comma-separated planned milestones |
| `--agent-name <name>` | String | Lead autonomous agent persona (default: `Orchestrator`) |
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
| `--skip-install` | Boolean | Skip running bun install |
| `--dry-run` | Boolean | Simulate without writing files |
| `--non-interactive` | Boolean | Run without interactive prompts |
| `-f, --force` | Boolean | Overwrite existing files |

---

## Pitfalls

- **Skipping Agents First**: Never run framework generation before AI governance is initialized, or framework defaults may overwrite or conflict with agent boundaries.
- **Cross-Project Bleed**: Never copy client-specific skills, assets, or memory files from sibling projects. Every project starts with a clean isolated container.
- **Committing Secrets**: Ensure `.env` is listed in `.gitignore` and `.env.example` exists. Follow the Vibeguard protocol.
- **Monolithic Memory Dumps**: Keep `.memory/CURRENT.md` for machine real-time invariants and `.agents/context/current.md` for durable shipped reality.

---

## Verification

After scaffolding, verify the project:
1. **Developer Guide**: Check that `./start-here.md` exists and contains all 7 sections.
2. **Onboarding Gate**: Check `./Onboarding/01-Brand/`, `02-Business/`, and `03-Menu/`.
3. **Design Tokens**: Check wide-gamut OKLCH tokens and fluid clamp scales in `./src/styles/tokens.css` and `.c-*` classes in `semantic.css`.
4. **Governance Container**: Check `./.agents/` 9-folder tree and `./AGENTS.md`.
5. **Backend Engine**: If Medusa is provisioned, check `./backend/medusa-config.ts`, `./backend/docker-compose.yml`, and `./backend/package.json`.
6. **Secret Defense**: Verify no secrets or credentials appear in `.env` or git status.
