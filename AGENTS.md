# AGENTS.md - muse-skills

Curated suite of twenty-one universal AI agent skills. MIT. Install via
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
- Modern Tool Primacy: call modern CLI tools explicitly by binary name
  (`fd`, `rg`, `bat`, `eza`, `sd`, `choose`, `procs`, `zoxide`, `delta`);
  agent subshells have no `.bashrc` aliases.
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
