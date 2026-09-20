# AGENTS.md - muse-skills

Curated suite of forty-four universal AI agent skills. MIT. Install via
`npx skills add harshsinghmp/muse-skills`.

## Read before working

Durable project truth lives in `.agents/context/` (local, untracked).
Working artifacts (research corpora, planning docs, reports) belong in
`.agents/artifacts/<topic>/` — never the repo tree, never `.memory/`
(musememory owns it); durable findings are promoted to `.agents/context/`
via `updateagents`.
Start at `.agents/context/index.md`, then read only the files your task
needs: `product.md`, `architecture.md`, `brand.md`, `current.md`,
`decisions.md`, `roadmap.md`. Code and skill frontmatter are canonical
when docs drift.

## Working rules

- Skills are the product. Read the exact `SKILL.md` before editing one.
- Keep YAML frontmatter valid (`name` + trigger-rich `description`); it
  is the discovery surface for all runtimes.
- Adding/removing a skill requires updating in the same change: README
  badges + tables + structure tree, `skills.json`, `llms.txt`.
- Commits follow `CONTRIBUTING.md` (Meaningful Git Commit Protocol).
- Branch and release lifecycle lives in `CONTRIBUTING.md` as well:
  never commit to `main`; cut `feat/*` from `dev`.
- No secrets or personal environment values in any shipped file.
- Canonical aliases: "Agent Engine" and "DOX Engine" = `new-project`
  Progressive Disclosure DOX scaffolding engine.
- Modern Tool Primacy: call installed modern CLI tools explicitly by binary name, modern-first with `|| legacy` fallback (`rg` > `grep`, `fd` > `find`, `bat` > `cat` for display, `eza` > `ls`, `sd` > `sed`, `zoxide` > `cd`, `delta` > `diff` for display); agent subshells have no `.bashrc` aliases. Never mandate tools outside the installed set.
- Synthetic ADE/IDE Artifact Sanitization: never accept or commit
  synthetic placeholders (`ORCA_RICH_MD`, Cursor, Windsurf, Claude
  artifacts); unwrap to raw content, backtick template variables
  (`<issue-id>`).
- Clean Package Syntax: in `<owner>/<repo>#<ref>` specs, never append
  raw commit hashes; keep install commands clean (`npx skills add
  <owner>/<repo>`).
- Test gate: `bun test` must pass before any merge.

## Verification

The Bun test suite (`bun test`) is the pre-merge contract.

### Lint + type-check (local runs)
- `bun run lint` → `biome check .` + `ruff check scripts/`
- `bun run type-check` → `tsc --noEmit`
- CI runs lint, type-check, test, and secret-scan as separate jobs

## Infrastructure

- **Hooks** (14 shell hooks): `bash scripts/hooks/install-hooks.sh` — detects agent runtimes, installs into existing dirs only
- **CI/CD**: push/PR → `bun test` + lint + secret-scan; tag push → GitHub release (npx skills add fetches from GitHub — no npm publish)
- **Audit modes**: 13 skills have dedicated `audit` mode with `references/audit.md`; canonical spec at `skills/references/audit-mode-guidance.md`
- **Evidence ledger**: `.agents/context/evidence-ledger.md` — persistent decision/commitment/claim tracking
- **Session reports**: `.agents/archive/reports/` — auto-archived via `gen-repo-report-on-close.sh` or startup safety net

## Skill Conventions Checklist (enforced by bun test)
- Valid frontmatter (name + trigger-rich description + argument-hint + user-invocable)
- Description/version byte-parity across SKILL.md/skills.json/llms.txt
- One SKILL.md per dir + README.md + agents/openai.yaml
- Agency-delivery heads carry a Modes table with one references/<mode>.md per mode; load only the resolved mode
- Modern-tool primacy (installed set only, never mandate outside it)
- Tool-independent mechanisms with Default-stack lines where a stack was chosen
- No secrets or personal values in shipped files
