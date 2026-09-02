---
name: new-project
description: "Interactive project creator and Project OS provisioner powered by the Progressive Disclosure DOX template. Bootstraps AGENTS.md root contract, .agents/ (context, standards, brand, workflows, archive, artifacts, goals, research), .memory/, .gitignore, dynamic llms.txt, and selective skill bundles into any repository."
version: 2.0.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [scaffolding, governance, project-os, architecture, progressive-disclosure, dox, nextjs, astro, vite, hono, python, wordpress]
    related_skills: [updateagents, agent-handoff, context-anchor]
    requires_tools: [bash, view_file, write_to_file, edit_file]
---

# 🚀 new-project — Autonomous Project OS & Agency Council Provisioner

Interactive project creator and Project Operating System provisioner. Bootstraps the **Progressive Disclosure DOX architecture**:
- **`AGENTS.md`**: Lean root contract & progressive DOX routing rail.
- **`.agents/context/`**: Durable project truth (`product.md`, `architecture.md`, `brand.md`, `current.md`, `decisions.md`, `roadmap.md`, `index.md`).
- **`.agents/standards/`**: Deep engineering standards (`execution-kernel`, `security-vibeguard`, `system-design`, `workflows`, `git-workflow`, `council-roles`, `dox-hierarchy`, `tech-stacks`, + stack-specific standards).
- **`.agents/brand/`**: Visual design tokens (`colors.json`, `motion.json`, `typography.json`, `base.css`), BEM conventions, A11y baseline, and UI screenshots.
- **`.agents/workflows/`, `archive/`, `artifacts/`, `goals/`, `research/`**: Organized agent containment tree.
- **`.memory/`**: Persistent cognitive session memory.
- **`scripts/nexus_verify.sh` & `tests/e2e/harness_probe.spec.ts`**: Stack-tailored adversarial quality gate.
- **`scripts/generate_llms_txt.ts`**: Dynamic `llms.txt` & `llms-full.txt` documentation indexer.
- **Selective Skill Bundling**: Curated skills in `.agents/skills/` with `skills-lock.json`.

---

## When to Use

- User asks to *"create a new project"*, *"scaffold a workspace"*, or *"initialize Project OS"*.
- Setting up a new client application, microservice, library, or prototype.
- Upgrading an existing unorganized repository to the Agency Council DOX architecture.
- Bootstrapping AI governance (`.agentrules`, `AGENTS.md`, `.gitignore`, `.memory/`).

---

## Quick Reference — Supported Archetypes

| Archetype ID | Framework / Stack Target | Category | Key Standards Module |
|:---|:---|:---|:---|
| **`nextjs`** | Next.js 16 (App Router + Tailwind v4 + React 19) | Fullstack / Web | `frontend-nextjs.md` |
| **`astro`** | Astro v7.2.x (Static / SSR + Collections + Tailwind v4) | Content & Web | `frontend-astro.md` |
| **`vite`** | Vite + React 19 (TypeScript Client SPA) | Frontend SPA | `frontend-nextjs.md` / `design.md` |
| **`hono`** | Cloudflare Workers + Hono (Drizzle ORM + Neon HTTP) | Edge & Serverless | `backend-workers-hono.md` |
| **`bun`** | Bun / Node API Service (Fastify / Hono backend) | Backend API | `tech-stacks.md` |
| **`python`** | Python 3.12+ (FastAPI + AI Agents + Pytest + Ruff) | AI & Data | `python-ai.md` |
| **`wordpress`** | WordPress 6.x Theme / Plugin Development (Bedrock/PHP) | CMS / PHP | `wordpress-cms.md` |
| **`library`** | TypeScript Package / Library (Strict Bun/tsup + npm) | Library / Tool | `library-package.md` |
| **`html`** | Static HTML5 & CSS Tokens (Vanilla / Alpine.js) | Lightweight Web | `static-html.md` |
| **`generic`** | Minimal Base Starter (Clean DOX baseline) | Custom | `tech-stacks.md` |

---

## Interactive Options & Questionnaire

When running interactively or through conversational delegation, guide the user through these options:

### 1. Location & Directory
- **New Subfolder**: Inside `./<projectName>` or `projects/<projectName>` (Recommended for new projects).
- **Current Directory**: Inside `.` (Recommended for existing repositories).
- **Custom Path**: Absolute or relative directory path.

### 2. Project Identity & Metadata
- **Project Name**: Clean kebab-case or PascalCase name.
- **Description**: 1-sentence value proposition and core purpose.
- **Client / Stakeholder**: Name of client or internal division (optional).

### 3. Stack Archetype
Select from the 10 supported archetypes above (`nextjs`, `astro`, `vite`, `hono`, `bun`, `python`, `wordpress`, `library`, `html`, `generic`).

### 4. Brand & Color Theme
- **`minimal-dark`**: Charcoal, Zinc, Crisp White (Modern dark mode)
- **`midnight-cyber`**: Deep Navy, Electric Blue, Cyan
- **`warm-editorial`**: Warm Alabaster, Rich Umber, Terracotta
- **`vibrant-modern`**: Deep Violet, Indigo, Emerald
- **`corporate-clean`**: Slate Gray, Ocean Blue, Amber

### 5. Skill Preset Bundle
- **`agency-suite`** *(Recommended / Default - 28 skills)*: Full agency suite (Design, Taste, Animation, Fullstack, Growth).
- **`design`**: Design tokens, Apple design, UI-UX Pro Max, motion, animations.
- **`fullstack`**: Auth patterns, API security, Next.js best practices, E2E testing, debugging.
- **`growth`**: CRO audit, SEO audit, keyword clustering, landing page copywriting.
- **`backend`**: API design, Workers/Hono, database design, system architecture.
- **`all`**: Complete workspace skill library.
- **`none`**: Lightweight baseline without skill copies.

### 6. Official Framework Initializer
If target directory is empty, option to run official CLI scaffolders (`create-next-app@latest`, `create-astro@latest`, `create-vite@latest`, `bun init`, etc.).

---

## Execution Command

Run the universal provisioner script:

```bash
# Interactive Mode
bun new-project/scripts/new-project.ts -i

# Non-Interactive CLI Mode
bun new-project/scripts/new-project.ts "./my-app" \
  --name="my-app" \
  --type="nextjs" \
  --desc="<description>" \
  --client="<clientName>" \
  --theme="minimal-dark" \
  --skills="agency-suite"
```

---

## Generated Architecture

```
<project-root>/
├── AGENTS.md                                # Root contract & DOX rail (~50 lines)
├── .agentrules                              # Vibeguard secret isolation & commit rules
├── .gitignore                               # Hardened ignore rules (Vibeguard + agents)
├── .memory/                                 # Persistent cognitive session memory
├── .agents/
│   ├── context/                             # Durable project truth
│   │   ├── index.md                         # Context routing map
│   │   ├── product.md                       # Scope & capability inventory
│   │   ├── architecture.md                  # System layout & component boundaries
│   │   ├── brand.md                         # Voice, presentation, & copy tone
│   │   ├── current.md                       # Shipped state & known gaps
│   │   ├── decisions.md                     # Locked architectural decisions (ADRs)
│   │   └── roadmap.md                       # SOW board & sprint backlog
│   ├── standards/                           # Progressive disclosure rule modules
│   │   ├── execution-kernel.md              # 6 Laws, Confidence Gate, Fowler Refactoring
│   │   ├── security-vibeguard.md            # Secret isolation, Destructive Command Gate
│   │   ├── system-design.md                 # Evans DDD, Nygard Release It!, Schemas
│   │   ├── workflows.md                     # Scaled tiers & 5-phase pipeline
│   │   ├── git-workflow.md                  # Branch hierarchy, commit format, SemVer
│   │   ├── dox-hierarchy.md                 # Subtree contracts & reading order
│   │   ├── council-roles.md                 # Council divisions & subagent routing
│   │   ├── memory-context.md                # Context hygiene, .memory lifecycle
│   │   └── [stack-specific].md              # e.g. frontend-nextjs, frontend-astro, etc.
│   ├── brand/                               # Dedicated Brand & Visual Identity System
│   │   ├── design.md                        # Visual language & component states
│   │   ├── bem-conventions.md               # Semantic BEM CSS class architecture
│   │   ├── a11y.md                          # WCAG 2.2 AA non-negotiable mandates
│   │   ├── tokens/                          # Design tokens (colors, typography, etc.)
│   │   └── screenshots/                     # Reference screenshots and UI mockups
│   ├── workflows/                           # Phase-based workflow protocols
│   ├── archive/                             # Timestamped retired plans & scratchpads
│   ├── research/                            # Deep research briefs
│   ├── artifacts/                           # Agent-generated plans & walkthroughs
│   ├── goals/                               # Sprint milestones & checklist tracking
│   └── skills/                              # Bundled agency skills + skills-lock.json
├── scripts/
│   ├── nexus_verify.sh                      # Pre-ship quality gate (typecheck, build, test)
│   └── generate_llms_txt.ts                 # Dynamic llms.txt & llms-full.txt generator
└── tests/
    └── e2e/
        └── harness_probe.spec.ts            # Playwright baseline probe
```

---

## Pitfalls & Verification

- **Never Commit Secrets**: Ensure `.env` is listed in `.gitignore` and `.env.example` exists.
- **Evidence Before Claims**: Work is only complete after running `scripts/nexus_verify.sh`.
- **Progressive Disclosure**: Keep `AGENTS.md` lean; put specific domain rules in `.agents/standards/`.
