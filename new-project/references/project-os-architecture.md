# Project Operating System Architecture Reference

> Progressive Disclosure DOX Architecture & Agency Council Governance.

---

## The 5 Core Pillars

### 1. Progressive Disclosure DOX Rail (`AGENTS.md` + `.agents/`)
Rather than single monolithic prompt files or flat 10-doc dumps, the DOX hierarchy separates root turn contracts from deep domain rules:
- **`AGENTS.md`**: Root binding contract (~50 lines) establishing turn invariants, context hygiene, confidence gates, and DOX links.
- **`.agents/standards/`**: Deep progressive disclosure rule modules loaded on-demand:
  - `execution-kernel.md`: 6 Universal Judgment Laws, Martin Fowler Refactoring, Steve McConnell Code Complete.
  - `security-vibeguard.md`: Zero secret exposure, Destructive Command Gate, untrusted tool output defense.
  - `system-design.md`: Evans DDD, Nygard *Release It!* stability patterns, schema evolution.
  - `workflows.md`: Scaled workflow tiers (tiny-fix, quick-win, feature, architecture-change) & 5-phase pipeline.
  - `git-workflow.md`: Branching hierarchy, meaningful commit format, SemVer.
  - `council-roles.md`: Division responsibilities and subagent routing policies.
  - `tech-stacks.md` + stack-specific guides (`frontend-nextjs.md`, `frontend-astro.md`, `backend-workers-hono.md`, `python-ai.md`, etc.).

---

### 2. Durable Project Context Map (`.agents/context/`)
Authoritative single source of truth for the project:
1. `index.md`: Context routing map.
2. `product.md`: Executive summary, value proposition, and capability inventory.
3. `architecture.md`: Stack blueprint, component boundaries, and runtime topology.
4. `brand.md`: Voice, visual tone, and presentation rules.
5. `current.md`: Verified shipped state and known gaps (Reality Gate).
6. `decisions.md`: Immutable Architectural Decision Records (ADRs).
7. `roadmap.md`: SOW board and active sprint backlog.

---

### 3. Dedicated Brand & Visual Identity System (`.agents/brand/`)
- `tokens/`: Design tokens (`colors.json`, `motion.json`, `radii.json`, `shadows.json`, `spacing.json`, `typography.json`, `base.css`).
- `design.md`: Visual language, OKLCH palette, 7 required UI component states.
- `bem-conventions.md`: Semantic BEM CSS class architecture.
- `a11y.md`: WCAG 2.2 AA non-negotiable mandates & checklist.
- `screenshots/`: Storage for wireframes, screenshots, and visual references.

---

### 4. Agent Containment & Memory
- `.memory/`: Local persistent cognitive memory store.
- `.agents/workflows/`: Phase-based workflow protocols.
- `.agents/archive/`: Timestamped retired plans & scratchpads `[title]-[timestamp].md`.
- `.agents/artifacts/`: Agent-generated plans & walkthroughs.
- `.agents/goals/`: Sprint milestones & checklist tracking.
- `.agents/research/`: Deep research briefs & logs.

---

### 5. Nexus Adversarial Quality Gate
- **Deterministic Check**: 0 TypeScript/lint errors + clean production build.
- **Visual & Runtime Probes**: Playwright headless browser runs against local/staging checking HTTP status and DOM selectors.
- **Vibeguard Protocol**: Zero secret leakage scan prior to shipping.
- **Dynamic Documentation**: `scripts/generate_llms_txt.ts` bundles all context and standards into `llms.txt` and `llms-full.txt`.
