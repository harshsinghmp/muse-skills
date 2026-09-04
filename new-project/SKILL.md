---
name: new-project
aliases: ["Agent Engine", "DOX Engine", "agent-engine", "dox-engine"]
description: "Interactive project creator, DOX Engine, and Agent Engine provisioner. Bootstraps the 2-stage Agents-First architecture (AGENTS.md, 9-folder .agents/ container, 12 modular standards, brand tokens, and cognitive memory) before launching interactive framework creators (Astro, Next.js, Instatic, Hono, Vite). Trigger whenever the user asks for 'new-project', 'Agent Engine', 'DOX Engine', 'scaffold Project OS', or to initialize an agent-governed workspace."
version: 2.0.0
author: Agency Council
license: MIT
platforms: [macos, linux, windows]
metadata:
  aliases: ["Agent Engine", "DOX Engine", "agent-engine", "dox-engine"]
  hermes:
    tags: [scaffolding, governance, project-os, architecture, nextjs, astro, vite, dox, agent-engine, dox-engine]
    related_skills: [updateagents, agent-handoff, context-anchor]
    requires_tools: [bash, view_file, write_to_file]
---

# 🚀 new-project — Autonomous Project OS & DOX Scaffolder

> **Aliases**: `Agent Engine` | `DOX Engine` | `agent-engine` | `dox-engine`

Interactive project creator and Project Operating System provisioner. Implements the **"Agents First, Then Project Type"** architecture with a zero-token **Stage-0 Fast-Skip Gate**:
0. **Stage 0: AI-Ready Pre-Flight Gate**: Checks if root `AGENTS.md` and `.agents/` container already exist and pass `ai-ready` audit. If healthy, skips scaffolding immediately.
1. **Stage 1: Governance Container**: Drops the lean root `AGENTS.md` (<50 lines), `.gitignore`, 9-folder `.agents/` tree (standards, brand, context, archive, artifacts, goals, research, skills, workflows), and initializes cognitive memory.
2. **Stage 2: Project Type**: Interactively launches the chosen framework creator (Astro v7.2.x, Next.js 16, Instatic HTML, Hono/Workers, or Vite).
3. **Stage 3: Closeout DOX Pass**: Synchronizes `.agents/context/current.md` with verified live deliverables.

---

## When to Use

- User invokes or references *"Agent Engine"*, *"DOX Engine"*, *"new-project"*, *"scaffold a workspace"*, or *"initialize Project OS"*.
- Setting up a new client application, agency showcase, microservice, or prototype with the DOX Engine.
- Equipping an existing unorganized repository with the Agent Engine / Progressive Disclosure DOX architecture.
- Running `ai-ready` pre-flight to verify existing workspace health before framework execution.
- Initializing a project with strict context isolation (zero cross-project bleed).

---

## Quick Reference

| Archetype Target | Framework & Runtime | Command / Generator |
|:---|:---|:---|
| **Astro v7.2.x** *(Recommended)* | Static / SSR + Islands + Cloudflare | `bun create astro@latest .` |
| **Next.js 16** | React 19 + App Router + Server Actions | `bun create next-app@latest .` |
| **Instatic HTML** | Pure HTML brochure / zero-JS landing | Instatic SSG starter |
| **Hono / Workers** | Cloudflare Workers edge API microservice | `bun create hono@latest .` |
| **Vite + React** | Client SPA + TypeScript | `bun create vite@latest .` |
| **None / Existing** | Governance container only (DOX baseline) | Agents First only |

---

## Procedure

### Step 1: Launch Provisioner
Execute the universal scaffolder script via Bun:

```bash
# Interactive Mode (Prompts for destination, name, and framework archetype)
bun path/to/new-project/scripts/new-project.ts

# Non-Interactive Mode (Direct flags)
bun path/to/new-project/scripts/new-project.ts <targetPath> --name="<projectName>" --type="<astro|nextjs|instatic|hono|vite|none>" --desc="<description>"
```

### Step 1b: Stage 0 — AI-Ready Pre-Flight Gate
Before scaffolding, inspect the target directory:
1. If `AGENTS.md` and `.agents/` container already exist and are intact:
   ```text
   [ai-ready] Repository container healthy. Skipping scaffolding pass.
   ```
2. Skip Stage 1 entirely and proceed directly to Stage 2 (Project Type) or closeout DOX pass, saving context tokens.

### Step 2: Stage 1 — Agents First (Governance Baseline)
If Stage 0 detects missing or incomplete governance:
1. Resolves target directory.
2. Copies `templates/AGENTS.md` (<50 lines) and `.gitignore`.
3. Provisions the complete 9-folder `.agents/` containment tree (`archive`, `artifacts`, `brand`, `context`, `goals`, `research`, `skills`, `standards`, `workflows`).
4. Customizes `.agents/context/product.md` and `architecture.md`.
5. Initializes `.memory/` and real-time `.memory/CURRENT.md`.

### Step 3: Stage 2 — Project Type (Framework Execution)
If an archetype is selected (e.g. Astro or Next.js):
1. Runs official framework creator interactively in target directory.
2. Preserves the AI governance container while generating framework boilerplates.

### Step 4: Stage 3 — Closeout DOX Pass
1. Scans generated project files.
2. Records verified initial deliverables in `.agents/context/current.md`.

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
