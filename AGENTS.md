# AGENTS.md - muse-skills

Curated suite of eight universal AI agent skills (project provisioning,
design system extraction, memory sync, performance enforcement,
Code Review - Linus Torvalds Style, subagent reliability). MIT. Install via
`npx skills add harshsinghmp/muse-skills`.

## Read before working

Durable project truth lives in [`.agents/context/`](.agents/context/).
Start at [`index.md`](.agents/context/index.md), then read only the files
your task needs:

- Product scope and skill inventory: [`product.md`](.agents/context/product.md)
- Repo layout, skill anatomy, registry, verification: [`architecture.md`](.agents/context/architecture.md)
- Voice, naming, doc presentation rules: [`brand.md`](.agents/context/brand.md)
- Current shipped state and known gaps: [`current.md`](.agents/context/current.md)
- Durable decisions (do not reopen casually): [`decisions.md`](.agents/context/decisions.md)
- Parked future work: [`roadmap.md`](.agents/context/roadmap.md)

## Working rules

- Skills are the product. Read the exact `SKILL.md` before editing one.
- Keep YAML frontmatter valid (`name` + trigger-rich `description`) on every
  SKILL.md; it is the discovery surface for all runtimes.
- Adding/removing a skill requires updating in the same change: README
  badges + tables + structure tree, `skills.json`, `llms.txt`.
- Commits follow [CONTRIBUTING.md](CONTRIBUTING.md) (Meaningful Git Commit
  Protocol: `<type>(<scope>): summary` with Why / What / Verification).
- No secrets or personal environment values in any shipped file.
