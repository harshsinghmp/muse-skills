---
name: new-project
aliases: ["Agent Engine","DOX Engine","agent-engine","dox-engine"]
description: "Purpose-First interactive project creator, companion configurator, DOX Engine, and Agent Engine provisioner. Implements a 6-stage sequential execution pipeline: Stage 1 (Purpose-First Root Prompt), Stage 2 (Hierarchical Decision Tree with Tradeoff Engine), Stage 3 (Official Package Installation & Full End-to-End Companion Wiring), Stage 4 (Modern OKLCH Tokens & Fluid BEM System), Stage 5 (Client Intake Brief with post-scaffold agent onboarding), and Stage 6 (Closeout). Bootstraps the Agents-First architecture (AGENTS.md, 9-folder .agents/ container, 13 modular standards, brand tokens, and cognitive memory) before interactively composing project intent, framework (Next.js 16, Astro v7, Instatic HTML, Roots Bedrock, Expo), styling (Hybrid UnoCSS Wind 4 + BEM), animations (CSS presets, Motion.dev, GSAP), state management (NanoStores cross-island store), mobile conversion (Ionic Capacitor for Astro/Next.js to iOS/APK, Expo for React), CMS (Payload 3.0 + Puck, Keystatic, StudioCMS, Git-based CMS), e-commerce (Medusa v2 sovereign backend, Payload E-Commerce, Stripe, Razorpay, Vendure), and database (Drizzle ORM with typed schema, Neon, Supabase, Postgres Docker, SQLite). Trigger whenever the user asks for 'new-project', 'Agent Engine', 'DOX Engine', 'scaffold Project OS', or to initialize an agent-governed workspace."
version: 2.4.1
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
[ 📖 Stage 5: Client Intake Brief ] ──► [ ✅ Stage 6: Closeout ]
```

0. **Stage 0: AI-Ready Pre-Flight Gate**: Audits if root `AGENTS.md` and `.agents/` container already exist and pass `ai-ready` audit.
1. **Stage 1: Purpose-First Root Prompt & Project Identity**: Initiates interactively by querying the foundational domain purpose before prompting for identity, mission, and scope.
2. **Stage 2: Hierarchical Decision Tree**: Prunes irrelevant questions based on selected purpose across 6 branches (Static, Content, Ecommerce, WebApp, Mobile, Custom).
3. **Stage 3: Official Package Installation & Config Auto-Wiring**: Automatically wires framework configs (`astro.config.mjs`, `uno.config.ts`, `postcss.config.mjs`, `src/lib/medusa.ts`, `db.ts`, `auth.ts`, `capacitor.config.ts`, `.env.example`) and synchronizes official dependencies in `package.json` with self-verification.
4. **Stage 4: Modern Tokens & BEM Architecture Injection**: Injects wide-gamut OKLCH tokens, fluid `clamp()` typography & spacing scales (`src/styles/tokens.css`), and reusable semantic BEM classes (`.c-card`, `.c-button`, `.c-product-grid`, `.c-cart-drawer`).
5. **Stage 5: Client Intake Brief**: Writes `Client-Intake/00-Intake-Brief.md` (employee checklist pre-filled from scaffold answers + agent instructions). Intake docs and `start-here.md` are written by the AI agent AFTER scaffolding, from real employee answers.
6. **Stage 6: Closeout**: Synchronizes `.agents/context/` (decisions ADRs, product, current, architecture) and runs the health check.

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
| `--preset=powerhouse` / `next-commerce` | E-Commerce / Full-Stack | Next.js 16 (`@latest`) + Hybrid UnoCSS Wind 4 + Motion.dev + NanoStores + Payload CMS + Puck Visual Builder + Payload E-Commerce + Neon DB + Better Auth |
| `--preset=astro-commerce` | E-Commerce / High-Performance | Astro v7 (`@latest`) + Hybrid UnoCSS + NanoStores + Aria Builder (`ariabuilder.io`) + Medusa 2.0 Sovereign Backend (Postgres/Redis Docker) |
| `--preset=publisher` / `astro-blog` | Content / Publication | Astro v7 (`@latest`, zero-JS baseline) + Hybrid UnoCSS + Motion.dev + NanoStores + StudioCMS (LibSQL/Turso native) |
| `--preset=edge` / `astro-emdash` | Static Edge Publication | Astro v7 + Hybrid UnoCSS + Hardware CSS Animations + NanoStores + Emdash CMS (Cloudflare D1/R2) |
| `--preset=plain-astro` / `astro-plain` | Pure Content Baseline | Astro v7 (Zero-JS, zero React) + Hybrid UnoCSS Wind 4 + Hardware CSS Animations |
| `--preset=git-cms` / `astro-git` | Git-backed Content Site | Astro v7 + Native Content Collections + Markdown/MDX + RSS Feed + Hybrid UnoCSS |
| `--preset=sitepins` / `astro-sitepins` | Edge Headless Publishing | Astro v7 + Sitepins Git-backed CMS + Content Collections + Hybrid UnoCSS |
| `--preset=visual` | Brochure & Visual Sites | Astro v7 + Hybrid UnoCSS + Hardware CSS Animations + NanoStores + Aria Builder (`ariabuilder.io`) + Fastrr 1-click checkout |
| `--preset=astro-visual` | Visual Marketing Site | Astro v7 + Hybrid UnoCSS + Hardware CSS Animations + NanoStores + Aria Builder (`ariabuilder.io`) |
| `--preset=instatic` | Pure HTML Sites | Instatic SSG + Semantic BEM CSS + Hardware CSS Animations (Zero Node/JS runtime) |
| `--preset=pure-html` | Standalone Static Site | Pure HTML5 + Semantic BEM CSS + Fluid OKLCH Tokens (Zero build step, instant load) |
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

### Stage 2: Hierarchical Decision Tree & Interactive Tradeoff Engine
Each selection prunes irrelevant downstream choices while explicitly surfacing architectural tradeoffs (Lightweight vs. Full-Stack, Serverless vs. Local Container, Git-based vs. Embedded DB) so the user is in full control without opaque defaults or mystery breaks:
- **Branch A (Static Website / Landing Page)**: Pure HTML/CSS (Zero build step, semantic BEM, OKLCH fluid design tokens) vs Instatic SSG vs Astro v7 (with optional Aria Builder visual editor) vs Next.js SSG ➔ Hybrid UnoCSS Wind 4 vs Semantic BEM ➔ Hardware CSS animations vs Motion.dev.
- **Branch B (Dynamic Content Website)**:
  - *Astro v7 (Zero-JS baseline, islands)*:
    - **StudioCMS** (Astro DB / Turso native persistence) — Recommended for content blogs.
    - **Emdash CMS** (Cloudflare Workers, D1 database, and R2 storage) — Recommended for edge publications.
    - **Aria Builder** (`ariabuilder.io`) — Visual drag-and-drop page builder for marketing sites.
    - **Keystatic / SitePins** — Zero DB overhead, Git-committed Markdown/MDX collections.
  - *Next.js 16 (React 19 App Router)*:
    - **Payload CMS 3.0 + Puck Visual Builder** — Full-stack database collections with interactive visual block editing.
    - **Payload CMS 3.0 Standard** — Lexical rich text editor and typed collections.
    - **Keystatic** — Flat-file Git collections.
  - *Roots Bedrock*: Modern 12-factor WordPress with Composer and Gutenberg blocks.
- **Branch C (Ecommerce Storefront)**: E-Commerce Tradeoff Questionnaire:
  - **Astro + Aria Builder + MedusaJS**: High-performance zero-JS storefront with Aria visual builder & Medusa v2 Sovereign Engine (Recommended for Speed & Visual Editing).
  - **Next.js + Payload CMS + Puck + Payload E-Commerce**: All-in-one unified Next.js App Router application with Puck visual builder and native Product/Order/Customer/Stripe collections (Recommended for Fullstack All-in-One).
  - **Next.js + Medusa v2 Sovereign Engine**: Next.js App Router frontend with Medusa sovereign backend.
  - **Stripe Direct Checkout**: Lightweight zero-backend payments with hosted checkout and webhook routes.
  - **Fastrr 1-Click / Razorpay**: Accelerated mobile checkout for D2C brands.
  - **Vendure**: Scalable enterprise TypeScript GraphQL backend.
- **Branch D (Full-Stack Web App)**: Next.js 16 App Router vs Astro SSR ➔ Database & Auth Tradeoffs:
  - *Database*: Neon Serverless Postgres (zero local infrastructure) vs Supabase (managed BaaS) vs Local Docker Postgres 16 (isolated local dev container) vs SQLite/Turso.
  - *Authentication*: Better Auth (Drizzle ORM adapter, full local control, typed client SDK) vs Supabase Auth (managed BaaS) vs NextAuth/Auth.js.
  - *State Management*: NanoStores (sub-1KB cross-framework reactive store) vs Zustand (React-only).
- **Branch E (Mobile Application)**: React Native with Expo vs Astro + Ionic Capacitor (web-to-APK) vs Next.js + Capacitor.
- **Branch F (Custom / Infrastructure)**: Custom architecture or governance-only workspace.

### Stage 3: Official Package Installation & Full End-to-End Companion Wiring
The provisioner enforces **Zero Half-Baked Stubs**. Every selected technology is provisioned with its complete working ecosystem—schemas, route handlers, client SDKs, admin UIs, and Docker container services:
- **Pure HTML/CSS Framework Option (`--type=html` / `pure-html`)**:
  - Standalone `index.html` with semantic BEM classes, linking wide-gamut OKLCH design tokens, reset, and hardware-accelerated animations with zero build step.
  - Pinned `package.json` scripts (`bun x serve .`, `bun test`, `biome check src`).
- **Database & Drizzle ORM**:
  - `src/lib/schema.ts`: Fully-typed starter schema defining relational `users` and `posts` tables.
  - `src/lib/db.ts`: Connection pool client exporting both `db` and re-exporting `* from './schema'`.
  - `drizzle.config.ts`: Configured pointing to `./src/lib/schema.ts` with output to `./drizzle`.
  - `docker-compose.yml`: For containerized Postgres (`--db=postgres`), provisions a local PostgreSQL 16 container with healthchecks and persistent volumes.
- **Authentication (Better Auth & Supabase)**:
  - `src/lib/auth.ts`: Server-side Better Auth initialization configured with the Drizzle ORM adapter and database schema.
  - `src/lib/auth-client.ts`: Client-side React SDK (`createAuthClient`) exporting `signIn`, `signUp`, `signOut`, and `useSession` for immediate UI consumption.
  - Route Handlers: `src/app/api/auth/[...all]/route.ts` (Next.js App Router) or `src/pages/api/auth/[...all].ts` (Astro) wrapping `auth.handler`.
  - `src/lib/supabase-server.ts`: Server-side Supabase client with cookie storage adapters for SSR.
- **Aria Builder & Visual Page Building**:
  - `aria/`: Full sovereign engine containing the Vue 3 visual studio canvas (`pages/admin.astro`, `pages/setup.astro`), Astro integration (`aria/integration.ts`), auth & session manager, actions, and storage drivers (Node/SQLite or Cloudflare workerd D1/KV/R2).
  - `astro.config.ts`: Pre-wired with `@astrojs/node`, `@unocss/astro`, and `aria()` engine integration.
  - `aria.config.mjs`: Visual component registry and preview configuration.
  - `src/components/AriaHero.astro`: Accessible visual hero banner with custom OKLCH styling.
  - `src/components/AriaMedusaProductGrid.astro`: Live Medusa product grid query with client cart actions.
  - `src/components/AriaCartDrawer.astro`: Slide-out shopping cart drawer with checkout trigger.
  - `/admin`: Interactive visual drag-and-drop page builder studio (auto-redirects to `/admin/setup` on first launch for zero-friction administrator provisioning).
- **Content Management Systems (CMS)**:
  - *Payload CMS 3.0 & E-Commerce Module*: `payload.config.ts`, strongly-typed collections (`Users.ts`, `Media.ts`, `Pages.ts`, `Products.ts`, `Orders.ts`, `Customers.ts`), Next.js App Router admin UI (`src/app/(payload)/admin/page.tsx`), REST API route handler (`src/app/(payload)/api/[...slug]/route.ts`), Stripe checkout endpoint (`src/app/api/payload-checkout/route.ts`), and `importMap.js`.
  - *StudioCMS*: `studiocms.config.mjs`, Astro DB integration, and `astro.config.mjs` integration wiring (`studioCMS()`).
  - *Emdash CMS*: `emdash.config.ts`, Cloudflare D1/R2 routing, starter markdown article in `src/content/blog/welcome.md`, and blog listing at `src/pages/blog/index.astro`.
  - *Keystatic*: `keystatic.config.ts`, initial post in `src/content/posts/welcome.mdoc`, Next.js App Router and Astro admin pages (`/keystatic`) and API route handlers (`/api/keystatic`).
  - *Puck Visual Builder*: Strongly-typed component schema in `src/lib/puck.config.tsx` and Next.js App Router editor (`src/app/puck/[...puckPath]/client.tsx` and `page.tsx`).
- **E-Commerce Engines**:
  - *Medusa 2.0 Sovereign Backend*: Fully scaffolded `backend/` directory with `medusa-config.ts`, `docker-compose.yml` (PostgreSQL 16 + Redis 7), `package.json`, `tsconfig.json`, `.env.example`, and custom route `/src/api/store/custom/route.ts`, alongside the frontend client SDK in `src/lib/medusa.ts`.
  - *Stripe*: Server client in `src/lib/stripe.ts`, Checkout session creation route handler in `src/app/api/checkout/route.ts`, and webhook signature verification route in `src/app/api/webhooks/stripe/route.ts`.
  - *Razorpay*: Server client and order creation endpoint in `src/lib/razorpay.ts`.
  - *Vendure*: Typed GraphQL client for catalog queries and mutations in `src/lib/vendure.ts`.
- **Mobile & Styling Integrations**:
  - `capacitor.config.ts`: Cross-platform mobile configuration for Ionic Capacitor (`@capacitor/cli`, `@capacitor/core`).
  - `uno.config.ts` & `postcss.config.mjs`: UnoCSS Wind 4 presets, icon collections, and fluid typography tokens.
  - `src/stores/app.ts`: NanoStores sub-1KB reactive store for cross-framework state.
- **Day-1 Proof-of-Life Starter Dashboard UI**:
  - `src/app/page.tsx` & `src/app/layout.tsx` (Next.js), `src/pages/index.astro` (Astro), or `index.html` (Pure HTML): Generates an interactive live dashboard that immediately exercises the selected stack upon startup.
  - `src/app/page.tsx` & `src/app/layout.tsx` (Next.js) or `src/pages/index.astro` (Astro): Generates an interactive live dashboard that immediately exercises the selected stack upon `bun run dev` (Drizzle DB status, Better Auth client SDK status, Stripe checkout trigger, and quick-launch links to `/admin`, `/keystatic`, or `/puck`).
- **Production Deployment Artifacts & CI/CD**:
  - `.github/workflows/ci.yml`: Automated CI pipeline running dependencies installation, TypeScript checking, test runner, and Vibeguard secret audits.
  - `Dockerfile` & `.dockerignore`: Multi-stage production container for Node/Bun with unprivileged non-root user (`--deploy=docker`).
  - `wrangler.toml`: Cloudflare Workers / Pages configuration with node compatibility and binding placeholders (`--deploy=cloudflare`).
  - `vercel.json`: Production headers, function rules, and security policies (`--deploy=vercel`).
- **Automated Quality Gates & Test Suite**:
  - `tests/health.test.ts`: Out-of-the-box health check asserting environment configuration, AI governance container, and design tokens baseline.
  - `biome.json`: High-speed zero-config linter and formatter.
- **Day-1 Secret Defense (Vibeguard Pre-Commit Hook)**:
  - `scripts/pre-commit.sh` & `.git/hooks/pre-commit`: Executable pre-commit hook that automatically blocks commits containing staged `.env` files or high-entropy credentials.
- **Package Scripts & Secrets Injection**:
  - Injects `setup` (one-command bootstrap handling dependencies, Docker container startup, and Drizzle migrations), `test` (`bun test`), `lint` (`biome check src`), `format` (`biome format --write src`), and `precommit` (`bash scripts/pre-commit.sh`).
  - Automatically provisions `db:generate`, `db:push`, `docker:up`, `docker:down`, `payload`, `dev:backend`, and `backend:migrate` into `package.json`.
  - Automatically populates all required connection strings, database URLs, and API secret keys into `.env.example`.
  - Synchronizes official dependencies in `package.json` with self-verification gate.

### Stage 4: Modern Tokens & BEM Architecture Injection
- `src/styles/tokens.css`: Wide-gamut OKLCH colors (choice of 37 official palettes from `oklch.fyi`: 16 Radix scales + 21 curated designer themes like `sunset-vibes`, `deep-sea`, `forest`, `neon-nights`, etc.), fluid typography scale via `clamp()`, fluid spacing scale via `clamp()`, and 12-step numeric scales (`--color-scale-1` through `12`).
- `.agents/skills/oklch-skill/`: Automatically provisions project-scoped `oklch-skill` (strictly project-only, zero global pollution) with full color conversion, APCA/WCAG contrast guidelines, gamut clamping, and UnoCSS Wind 4 `@theme` mappings.
- `src/styles/semantic.css`: Reusable semantic BEM classes (`.c-card`, `.c-button`, `.c-product-grid`, `.c-product-card`, `.c-cart-drawer`).
- `src/styles/animations.css`: Hardware-accelerated GPU animations with `prefers-reduced-motion` compliance.

### Stage 5: Client Intake Brief (Instructions, Not Documents)
The engine writes ONE file: `Client-Intake/00-Intake-Brief.md` — pre-filled with scaffold-time answers (name, purpose, audience, palette, etc.) plus an employee checklist and agent instructions. It does NOT pre-generate the intake documents; those are produced by the AI agent AFTER scaffolding, grounded in real employee answers:

**Post-scaffold onboarding flow (agent-driven)**:
1. Read `./Client-Intake/00-Intake-Brief.md` with the employee and collect answers to the checklist (brand corrections, business context, offerings, technical access, scope boundaries).
2. Write `01-Brand/`, `02-Business/`, `03-Offerings/`, and `04-Technical-Intake/` documents from those answers — real content only, no invented filler.
3. Write `./start-here.md`: a short developer orientation derived from the actual scaffolded stack (install/run commands from `package.json`, token locations, verification steps).
4. Sync answers into `.agents/context/product.md` and `.memory/CURRENT.md`.

**Durable DOX Closeout (engine-run at scaffold)**:
- Populates `.agents/context/decisions.md` with dynamic Architectural Decision Records (ADR-001 through ADR-006).
- Populates `.agents/context/product.md` with dynamic project vision, target audience, problem statement, and catalog offerings.
- Records initial shipped state in `.agents/context/current.md` and `.agents/context/architecture.md`.

---

## CLI Usage & Flags Reference

```bash
# Interactive Mode (Prompts for Purpose -> Hierarchical Tree -> Stack)
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

## Official Stack Setup References (Post-Scaffold Agent Procedures)

When the intake brief or a stack change requires provisioning a companion manually, follow these official procedures. Always use `@latest` resolution (`bun add <pkg>` / `npm i <pkg>`), never pinned versions.

### Payload CMS 3.0 (Next.js App Router)
1. Install: `payload`, `@payloadcms/next`, `@payloadcms/db-sqlite` (or `@payloadcms/db-postgres`), `@payloadcms/richtext-lexical`, `@payloadcms/translations`, `sharp`.
2. Copy the `(payload)` route group into `src/app/(payload)/` from `node_modules/@payloadcms/templates` (or generate `payload.config.ts` with collections, Lexical editor, `secret: process.env.PAYLOAD_SECRET`, and the chosen `db` adapter).
3. Wire `next.config.mjs` with `withPayload` and add `"@payload-config": ["./src/payload.config.ts"]` to `tsconfig.json` paths.
4. Add `PAYLOAD_SECRET` to `.env`, then `npm run dev` and open `/admin` to create the first user.

### Aria Builder (Vue visual block studio)
1. `git clone https://github.com/ariabuilder/aria` into the project workspace, then `npm install`.
2. `npm run dev` to launch the development server, then open `/admin` and run the Setup Wizard to configure the database.
3. `db/data/app.db` is the SQLite data store (git-ignored; local file storage by default).
4. Point S3/R2 env vars at MinIO or any S3-compatible endpoint for media storage.

### Emdash CMS (Astro edge CMS)
1. Install `@emdash/cms`; configure the Astro integration, then `npx emdash key` to generate `EMDASH_ENCRYPTION_KEY` and the auth key in `.env`.
2. Local dev uses SQLite + file storage out of the box (`npm run dev` -> `/admin` with `npx emdash dev-bypass --user <name>` for local auth bypass).
3. Content lives as `_emdash` live collections; edit via `/admin`, consume via `getLiveCollection`/`getLiveEntry`.
4. For production on Cloudflare Workers, provision D1/R2 bindings (this is what the engine's `preset=edge` path generates with `wrangler.jsonc` and `src/worker.ts`).

### Puck Visual Editor
1. Install `@measured/puck` (pairs with Payload CMS for data).
2. Create `puck.config.ts` with field and component definitions, generate static params from the CMS page collection, and render pages with `<Puck>` (edit route) / `<Render>` (public route).

### Instatic (zero-runtime SSG)
1. `npx create-instatic@latest` (or wire `instatic` into an existing Astro/HTML project) to generate `instatic.json`, content collections, and layout templates.
2. Author Markdown/MDX under the configured content directory; the compiler emits fully static pages at build time with zero client runtime.

---

## Pitfalls

- **Skipping Agents First**: Never run framework generation before AI governance is initialized, or framework defaults may overwrite or conflict with agent boundaries.
- **Cross-Project Bleed**: Never copy client-specific skills, assets, or memory files from sibling projects. Every project starts with a clean isolated container.
- **Committing Secrets**: Ensure `.env` is listed in `.gitignore` and `.env.example` exists. Follow the Vibeguard protocol.
- **Monolithic Memory Dumps**: Keep `.memory/CURRENT.md` for machine real-time invariants and `.agents/context/current.md` for durable shipped reality.
- **Never Ship Half-Baked Companion Stubs**: Never provision an SDK or integration flag without the accompanying route handlers, client SDKs, schemas, admin UIs, or container configs needed to actually run it. Every technology must be immediately runnable from a clean checkout.

---

## Verification

After scaffolding, verify the project:
1. **Intake Brief**: Check that `./Client-Intake/00-Intake-Brief.md` exists with pre-filled scaffold answers.
2. **Post-Scaffold Onboarding**: Walk the employee through the brief with your agent, then write the intake docs and `./start-here.md` it prescribes.
3. **Design Tokens**: Check wide-gamut OKLCH tokens and fluid clamp scales in `./src/styles/tokens.css` and `.c-*` classes in `semantic.css`.
4. **Governance Container**: Check `./.agents/` 9-folder tree and `./AGENTS.md`.
5. **Database & Auth Completeness**: If database or auth is provisioned, verify `src/lib/schema.ts`, `src/lib/db.ts`, `src/lib/auth-client.ts`, and API route handlers (`/api/auth/[...all]`) exist and compile cleanly.
6. **CMS & Visual Builder Completeness**: If Payload, Keystatic, or Puck is enabled, verify config files (`payload.config.ts`, `keystatic.config.ts`), collection schemas, and admin UI pages exist.
7. **Backend Engine**: If Medusa is provisioned, check `./backend/medusa-config.ts`, `./backend/docker-compose.yml`, and `./backend/package.json`. If PostgreSQL container is requested, check `./docker-compose.yml`.
8. **Day-1 Starter Dashboard**: Check that `src/app/page.tsx` (Next.js) or `src/pages/index.astro` (Astro) is provisioned with live stack badges and quick links.
9. **Deployment & CI/CD**: Verify `.github/workflows/ci.yml` is present, alongside `Dockerfile` / `wrangler.toml` / `vercel.json` matching `--deploy`.
10. **Quality Gates & Test Suite**: Run `bun test` inside the scaffolded workspace to confirm `tests/health.test.ts` passes cleanly.
11. **Day-1 Secret Defense**: Verify `scripts/pre-commit.sh` exists and is executable.
12. **Dynamic ADRs & Product DOX**: Check that `.agents/context/decisions.md` contains ADR-001 through ADR-006, and `.agents/context/product.md` reflects the interview scope.
13. **Secret Defense**: Verify no secrets or credentials appear in `.env` or git status. Run `bun ~/.config/LIFEOS/runtime/TOOLS/SecretScan.ts .` to ensure compliance with the Vibeguard protocol.
