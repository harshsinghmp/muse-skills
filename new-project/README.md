# 🚀 `new-project` Skill

> Intent-First Autonomous Project Operating System & Progressive Disclosure DOX Scaffolder.  
> **Aliases**: `Agent Engine` | `DOX Engine`

`new-project` (also known as the **Agent Engine** or **DOX Engine**) transforms any new or existing workspace into a fully governed **AI-Native Operating Environment** following the **"Agents First, Then Intent-Driven Companions"** architecture.

---

## ⚡ Key Architectural Features

- **🛡️ Agents First (Governance Container)**: Provisions the lean root `AGENTS.md` (<50 lines) and the complete `.agents/` container *before* framework creation, establishing security boundaries and gitignore early.
- **📁 Complete 9-Folder `.agents/` Containment**:
  - `archive/` — Retired plans & completed scratchpads (`[title]-[timestamp].md`)
  - `artifacts/` — Active walkthroughs, specifications & diffs
  - `brand/` — Design tokens (Kameli OKLCH palette, typography, motion, radii) + BEM conventions + A11y checklist
  - `context/` — 7 durable context files (`index`, `product`, `architecture`, `brand`, `current`, `decisions`, `roadmap`)
  - `goals/` — Session goals & sprint verification checklists
  - `research/` — Deep research briefs & benchmark logs
  - `skills/` — Clean, isolated container for project-specific skills
  - `standards/` — 13 modular rulebooks read on-demand (Next.js, Astro, WordPress, testing, security, etc.)
  - `workflows/` — Custom project workflows & protocols
- **🎯 Intent-First Architecture**: User selects project intent (Brochure, Content, E-Commerce, Web App, Mobile App) to receive a tailored, pruned menu of compatible companions.
- **🎨 Hybrid Styling Engine**: Combines `@unocss/preset-wind4` for utility speed with Custom Semantic BEM (`tokens.css`, `semantic.css`, `reset.css`) and OKLCH color variables.
- **🎭 High-Performance Animations**: Hardware-accelerated CSS presets (`.fade-in`, `.slide-up`, `.stagger-group`, `.reveal-on-scroll`, `.hover-lift`) alongside Motion.dev and GSAP ScrollTrigger.
- **📦 Sovereign Open-Source CMS & Commerce**: Priority support for Payload CMS (+ Puck Visual Builder), Medusa v2, Aria Builder (`ariabuilder.io`), StudioCMS, and Git-based CMS (SitePins, Tina, Keystatic).
- **🗄️ Database & Auth**: Native Drizzle ORM configuration for Neon, Supabase, Self-Hosted Postgres, and SQLite, paired with Better Auth.
- **⚡ Strict `@latest` Resolution**: All scaffolders and dependencies resolve to the latest stable release.

---

## 💻 Usage

Run via Bun:

```bash
# Interactive Mode (Prompts for Intent -> Framework -> Companions)
bun new-project/scripts/new-project.ts

# 1-Click Agency Preset
bun new-project/scripts/new-project.ts <targetPath> --preset=powerhouse

# Granular Non-Interactive Mode
bun new-project/scripts/new-project.ts <targetPath> \
  --intent=ecommerce \
  --type=nextjs \
  --styling=hybrid \
  --animation=motion \
  --cms=payload \
  --puck \
  --ecommerce=medusa \
  --db=postgres \
  --auth=better-auth
```

### ⚡ 1-Click Agency Presets

| Preset | Intent | Full Stack Composition |
| :--- | :--- | :--- |
| `--preset=powerhouse` | E-Commerce / Full-Stack | Next.js 16 (`@latest`) + Hybrid UnoCSS + Motion.dev + Payload CMS + Puck + Payload E-Commerce + Neon DB + Better Auth |
| `--preset=publisher` | Content / Publication | Astro v7 (`@latest`) + Hybrid UnoCSS + Motion.dev + StudioCMS (LibSQL/Turso) |
| `--preset=visual` | Visual Marketing Site | Astro v7 + Hybrid UnoCSS + Hardware CSS Animations + Aria Builder (`ariabuilder.io`) + Fastrr 1-click checkout |
| `--preset=edge` | Static Edge Site | Astro v7 + Hybrid UnoCSS + Hardware CSS Animations + SitePins Git CMS |
| `--preset=instatic` | Pure HTML Site | Instatic SSG + Semantic BEM CSS + Hardware CSS Animations (Zero JS runtime) |
| `--preset=mobile` | Mobile Application | React Native (Expo `@latest`) + NativeWind + Supabase |

### CLI Flags

| Flag | Type | Description |
|:---|:---|:---|
| `-n, --name <name>` | String | Project name (default: directory basename) |
| `-p, --path <path>` | String | Target directory path |
| `-i, --intent <intent>` | String | `brochure` \| `content` \| `ecommerce` \| `app` \| `mobile` \| `governance` |
| `--preset <preset>` | String | `powerhouse` \| `publisher` \| `edge` \| `visual` \| `instatic` \| `mobile` |
| `-t, --type <framework>` | String | `nextjs` \| `astro` \| `instatic` \| `wordpress` \| `expo` \| `custom` \| `none` |
| `-s, --styling <styling>` | String | `hybrid` (UnoCSS Wind 4 + BEM) \| `unocss` \| `bem` \| `tailwind` \| `custom` \| `none` |
| `-a, --animation <anim>` | String | `css` (Hardware presets) \| `motion` \| `gsap` \| `webgl` \| `custom` \| `none` |
| `-c, --cms <cms>` | String | `ariabuilder` \| `studiocms` \| `sitepins` \| `tina` \| `keystatic` \| `pagescms` \| `emdash` \| `payload` \| `decap` \| `keystone` \| `sanity` \| `strapi` \| `custom` \| `none` |
| `--puck` | Boolean | Inject Puck Visual Builder configuration |
| `-e, --ecommerce <ecom>` | String | `payload` \| `medusa` \| `vendure` \| `fastrr` \| `razorpay` \| `stripe` \| `custom` \| `none` |
| `--db <db>` | String | `neon` \| `supabase` \| `postgres` \| `sqlite` \| `custom` \| `none` |
| `--auth <auth>` | String | `better-auth` \| `supabase` \| `authjs` \| `custom` \| `none` |
| `--deploy <deploy>` | String | `cloudflare` \| `docker` \| `vercel` \| `custom` \| `none` |
| `--dry-run` | Boolean | Simulate scaffolding without writing files |
| `--non-interactive` | Boolean | Run without interactive prompts |
| `-f, --force` | Boolean | Overwrite existing files |
| `-h, --help` | Boolean | Display help message |

---

## ⚡ Continuous Self-Improvement (Skill Extraction)

When an agent repeatedly solves recurring problems across multiple tasks ($\ge 3$ occurrences), package the pattern directly into a new RFC-compliant skill:

```bash
bun scripts/extract-skill.ts \
  --name "custom-pattern" \
  --desc "Extract and execute deterministic pattern solution" \
  --occurrences 3 \
  --verified
```

See [`references/skill-extraction.md`](references/skill-extraction.md) for the complete 3-gate lifecycle specification (Recurrence, Verification, Generalization).

