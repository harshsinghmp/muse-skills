# 🏗️ Architecture & Workspace Layout

## Directory Structure

```
./
├── AGENTS.md                                # Root agent contract & entry point
├── .memory/                                 # Persistent cognitive memory store
├── .agents/
│   ├── context/                             # Durable project truth files
│   ├── standards/                           # Progressive disclosure rule modules
│   ├── workflows/                           # Phase-based workflow protocols
│   ├── archive/                             # Timestamped retired plans & artifacts
│   ├── research/                            # Deep research briefs, deepwork & scans
│   ├── artifacts/                           # Agent-generated plans & walkthroughs
│   ├── goals/                               # Session goals & sprint milestones
│   └── skills/                              # Installed agent skills
├── docs/                                    # Documentation, specs & blueprints
└── [subprojects]/                           # Isolated client and internal projects
```

## Supported Tech Stack Directions
1. **Modern Web & Astro**: Astro v7.2.x, UnoCSS v66.x, Vitest, Motion.dev, `@astrojs/cloudflare`, Aria Builder `@latest`, Cloudflare Free Tier / GitHub Pages.
2. **Instatic**: Pure HTML brochure and static websites ([Instatic SSG](https://github.com/corebunch/instatic)).
3. **Headless E-Commerce**: Payload CMS + E-Commerce Module, Next.js App Router, UnoCSS, Vitest, Motion.dev, Zod, Neon/Supabase DB, Cloudflare Free/Low-Cost Tier.

## Agent Containment & Archival Rule
- All active agent artifacts, temporary outputs, plans, research briefs, and deepwork logs belong strictly inside `./.agents/*`.
- Retired or completed artifacts must be moved to `./.agents/archive/` using the `[title]-[YYYYMMDD-HHMMSS].md` format.
- Never create scattered dot-folders (`.jez`, `.crush`, `.omo`, etc.) at the project root.

## Verification Workflow
- Tests: Executed per project directory using project-specific test runners (`bun test`, `vitest`, `npm test`).
- Security: Pre-ship secret audit via environment secret scanner (e.g. SecretScan, TruffleHog, or GitLeaks).
