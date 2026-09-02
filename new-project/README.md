# `new-project` Skill

> Autonomous Project Operating System Provisioner & Agency Council Scaffolder powered by the Progressive Disclosure DOX Template.

`new-project` transforms any new or existing workspace into a fully governed **AI-Native Operating Environment** with tailored engineering standards, brand tokens, and automated quality gates.

---

## ⚡ Installation

Install via `npx skills` shorthand:

```bash
# Recommended shorthand
npx skills add harshsinghmp/muse-skills --skill new-project
```

*(Full URL syntax `npx skills add https://github.com/harshsinghmp/muse-skills/tree/main/new-project` is also supported).*

---

## 🚀 Key Features

- **🏛️ Progressive Disclosure DOX Architecture**: Lean `AGENTS.md` root contract with deep modular standards in `.agents/standards/` and durable state in `.agents/context/`.
- **⚡ 10 Stack Archetypes**: Next.js 16, Astro v7.2.x, Vite + React, Cloudflare Workers + Hono, Bun Backend, Python AI/FastAPI, WordPress/PHP, TypeScript Library, Static HTML, and Generic.
- **🎨 Brand Identity & Design Tokens**: Auto-configured color themes (`minimal-dark`, `midnight-cyber`, `warm-editorial`, `vibrant-modern`, `corporate-clean`) in `.agents/brand/tokens/`.
- **🧠 Persistent Cognitive Memory**: Initializes `.memory/` directory for cross-session knowledge retention.
- **🛡️ Nexus Adversarial Verification Suite**: Generates `scripts/nexus_verify.sh` and Playwright probes for deterministic pre-ship audits.
- **📄 Dynamic `llms.txt` & `llms-full.txt` Generator**: Auto-indexes documentation and standards for instant LLM ingestion.
- **📦 Curated Skill Bundling**: Copies selected agency skills directly into `<project>/.agents/skills` with `skills-lock.json`.

---

## 💻 Usage

### 1. Interactive CLI Wizard
```bash
bun new-project/scripts/new-project.ts -i
```

### 2. Conversational Delegation
Ask your AI assistant:
```
"create a new project"
"scaffold an Astro agency showcase in ~/Projects/agency-site"
"initialize Project OS in this directory with minimal-dark theme and Python FastAPI"
```

### 3. CLI Command Options
```bash
bun new-project/scripts/new-project.ts /path/to/project \
  --name="MyApp" \
  --type="nextjs" \
  --theme="minimal-dark" \
  --skills="agency-suite"
```

---

## 📋 Archetypes Supported

| ID | Stack | Description |
|---|---|---|
| `nextjs` | Next.js 16 + React 19 + Tailwind v4 | Fullstack React with App Router & Server Actions |
| `astro` | Astro v7.2.x + Tailwind v4 + Collections | Content-first, static-first with client:* islands |
| `vite` | Vite + React 19 + TypeScript | Fast client-side Single Page Application |
| `hono` | Cloudflare Workers + Hono + Drizzle | Lightweight edge API service |
| `bun` | Bun / Node API Backend | High-speed backend service |
| `python` | Python 3.12+ + FastAPI + Pytest + Ruff | Modern Python AI & API microservice |
| `wordpress` | WordPress 6.x + PHP 8.3 + Bedrock | Custom Block theme & plugin environment |
| `library` | TypeScript + Bun Test + tsup | Reusable npm package starter |
| `html` | Semantic HTML5 + CSS Tokens | Zero-build lightweight web project |
| `generic` | Minimal DOX starter | Custom architecture baseline |
