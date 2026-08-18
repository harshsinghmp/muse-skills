---
name: new-project
description: Interactive project creator and Project OS provisioner. Bootstraps canonical /docs/, 8-stage reality machine (STATE.md), .agentrules, AGENTS.md (Muse Council), dynamic llms.txt, .gitignore, and selective skill bundles into any repository or directory.
---

# 🚀 `/new-project` Skill

Use this skill whenever the user asks to create a new project, scaffold a workspace, or initialize a Project Operating System for a client or application.

---

## 📋 Interactive Questionnaire Protocol

When triggered, the agent must guide the user through this quick, frictionless questionnaire:

### Step 1: Location & Folder Selection
- **Auto-Suggested Paths**:
  1. Scan `/home/harsh/Projects/` for existing project directories and present them as immediate selectable options.
  2. Provide option to create a **New Subfolder** (e.g. `/home/harsh/Projects/<name>`).
  3. Provide option to scaffold in the **Current Working Directory** (`.`).

### Step 2: Tech Stack Archetype (Always Latest)
- **Selection**:
  - `Next.js (App Router + Tailwind CSS v4 + React 19)` — *Runs `npx -y create-next-app@latest`*
  - `Astro (Static/SSR + Tailwind v4 + TS)` — *Runs `npx -y create-astro@latest`*
  - `Vite + React (TypeScript)` — *Runs `npx -y create-vite@latest`*
  - `Node / Bun API Backend`
  - `WordPress / PHP`
  - `Generic / Vanilla TS`
- **Project Name & Description**: Extracted from folder name or provided by user.

### Step 3: Skill Preset Selection
- **Presets**:
  - `[agency-suite]` *(Recommended / Default)*: The complete Agency Design, Animation, Taste, and UI/UX Suite (28 skills copied directly into the project).
  - `[design]`: Core Design Tokens, Animation, and Impeccable UI skills.
  - `[fullstack]`: Auth, API Security, Next.js best practices, E2E testing, systematic debugging.
  - `[growth]`: CRO, SEO Audit, Keyword Cluster Builder, Landing Page Copywriter.
  - `[all]`: Complete workspace skill library.
  - `[none]`: Lightweight baseline without skill copies.

### Step 4: AI Dotfiles & Governance Confirmation
- Confirm default generation of:
  1. `.agentrules` (Vibeguard zero secret leakage + Evidence-before-claims + 3-round autonomous loop)
  2. `AGENTS.md` (Muse as Chief Orchestrator, Sol, Jasper, Crew, Nexus)
  3. `CLAUDE.md` (Operational commands)
  4. `.gitignore` (Hardened default ignore list)
  5. `llms.txt` & `llms-full.txt` + `scripts/generate_llms_txt.ts`
  6. `docs/01_OVERVIEW.md` through `docs/10_UNRESOLVED.md`
  7. `STATE.md` (8-Stage Reality Machine) & `SUMMARY.md` (Change Ledger)
  8. `scripts/nexus_verify.sh` & `tests/e2e/harness_probe.spec.ts`

---

## ⚡ Execution Command

Once parameters are confirmed, run the scaffolder tool:

```bash
bun ~/.claude/LIFEOS/TOOLS/NewProject.ts "<targetPath>" --name="<projectName>" --type="<type>" --desc="<description>" --skills="agency-suite"
```

### Post-Scaffold Verification Checklist:
1. Verify files exist: `ls -la <targetPath>/docs <targetPath>/.agents/skills`
2. Test LLM documentation generator: `cd <targetPath> && bun scripts/generate_llms_txt.ts`
3. Run Vibeguard Secret Scan: `bun ~/.claude/LIFEOS/TOOLS/SecretScan.ts <targetPath>`
4. Present the created Project OS summary to the user with immediate next actions.
