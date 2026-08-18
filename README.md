# Muse Skills

Custom agent skills for enhanced workspace productivity, memory management, and project governance within the LifeOS ecosystem.

## Installation

Install individual skills using the `npx skills` command:

```bash
# Install new-project skill
npx skills add https://github.com/harshsinghmp/muse-skills/tree/main/new-project

# Install updateagents skill
npx skills add https://github.com/harshsinghmp/muse-skills/tree/main/updateagents
```

Or install all skills at once:

```bash
npx skills add https://github.com/harshsinghmp/muse-skills
```

---

## Available Skills

### 🚀 `new-project`

Interactive project creator and Project OS provisioner. Bootstraps the 10 Canonical `/docs/` Project Brain, 8-Stage Reality Machine (`STATE.md`), Council Governance (`AGENTS.md`), dynamic `llms.txt`, `.gitignore`, and selective skill bundles into any repository.

**Features:**
- Interactive questionnaire with path auto-suggestions from existing workspaces
- 10 Canonical Documentation sources (`01_OVERVIEW.md` through `10_UNRESOLVED.md`)
- 8-Stage Reality State Machine (`PROPOSED` → `APPROVED` → `LOCAL_DEV` → `STAGING_VERIFIED` → `PROD_VERIFIED`)
- Codified **Muse Council** hierarchy (Muse, Sol, Jasper, Crew, Nexus)
- Nexus adversarial verification suite with Playwright probes
- Dynamic `llms.txt` and `llms-full.txt` bundler
- Selective skill bundle installation (`agency-suite`, `design`, `fullstack`, `growth`)
- Supports Next.js 16 (App Router + Tailwind v4 + React 19), Astro, Vite, and API backends

**Usage:**
```
"run /new-project"
"create a new Astro project"
"scaffold Next.js 16 app with agency-suite skills"
```

[Learn more →](new-project/README.md)

---

### 🧠 `updateagents`

Automatically discovers, reads, and updates agent memory files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, etc.) in the current working directory.

**Features:**
- Auto-discovers existing memory files
- Workspace-scoped only (never touches parent directories)
- Integrates with cavemem, codegraph, rtk, memoryagent, ponytail
- Incremental updates (preserves existing content)
- Priority system for multiple memory files
- Size management (warns at 5KB, errors at 10KB)

**Usage:**
```
"update agents.md"
"refresh clauade.md"
"sync memory files"
"create agent guide for this workspace"
```

[Learn more →](updateagents/README.md)

---

## Adding New Skills

To add a new skill to this repository:

1. Create a new directory under the root: `mkdir my-new-skill`
2. Add required files:
   - `SKILL.md` - Main skill definition
   - `agents/openai.yaml` - Agent configuration
   - `README.md` - User documentation (optional but recommended)
3. Update `skills.json` with the new skill metadata
4. Test locally before committing

## Skill Structure

```
my-skill/
├── SKILL.md              # Main skill definition (required)
├── README.md             # User-facing documentation (recommended)
├── agents/
│   └── openai.yaml       # Agent configuration (required)
├── references/           # Reference documentation (optional)
│   └── *.md
├── scripts/              # Helper scripts (optional)
│   └── *.sh / *.ts
└── examples/             # Usage examples (optional)
    └── *.md
```

---

## Development & Publishing

1. Commit changes: `git add . && git commit -m "feat: add my-new-skill"`
2. Push to GitHub: `git push origin main`
3. Skills are immediately available via `npx skills add`

## License

MIT
