# AGENTS.md - muse-skills

Curated suite of sixteen universal AI agent skills (project provisioning,
design system extraction, Refactoring UI heuristics, memory sync, performance enforcement,
Linus Torvalds code review, bounded gauntlet loops, staff work governance, coupling routing,
claim verification, and reflective audits). MIT. Install via
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
- Canonical aliases: "Agent Engine" and "DOX Engine" explicitly refer to the `new-project` Progressive Disclosure DOX scaffolding engine.



# Git Workflow

Follow this Git workflow strictly.

## Branches

- `master` → Production. **Never commit directly to** `master`**.**
- `dev` → Staging/integration branch.
- `feature/*` → Created from `dev` for individual features/tasks.
- `release/*` → Created from `dev` when changes are ready for production; merge into `master`, then back into `dev`.
- `hotfix/*` → Created from `master` for urgent production fixes; merge into both `master` and `dev`.

## Rules

- Feature branches must be created from `dev`.
- Use descriptive branch names.
- Every merge into `dev` or `master` requires a Pull Request and code review.
- Do not rewrite or force-push `master` or `dev` history.
- Prefer `rebase` within feature branches when integrating changes and keeping history linear.
- For production bugs, use `hotfix/*` rather than merging unfinished work from `dev`.
- Prefer a new revert commit over rewriting shared history.

## Commit Message Standard

- **Subject (≤50 chars)**: Capitalized imperative Conventional Commit (e.g., `Skill: Added New - Designs Scope`, never `Added designscope` or `Fix stuff`).
- **Body (≤72 chars/line)**: Focus on *why* and non-obvious rationale instead of restating the diff; avoid pronouns (`I`, `we`) and meta-phrasing (`This commit/PR`).
- **Issue References**: Link issues at the bottom (e.g., `Closes #123`, `Resolves #456`).

## Scope of Work &amp; Sprint Lifecycle

All development moves across 4 deterministic lifecycle phases:

```
[ 📋 Requested ] ──► [ 📅 Planned ] ──► [ ⚡ In Progress ] ──► [ ✅ Done ]
 (Issues / PRs)     (Sprint Backlog)    (Active PR / Milestone)  (Shipped to Main)
```

1. **📋 Requested**: Community proposals, PR suggestions, and ecosystem requests pending sprint triage.
2. **📅 Planned**: Scoped SOW items selected for the upcoming sprint.
3. **⚡ In Progress**:
  - Feature branch created from `dev` (`feat/*`).
  - Dedicated GitHub milestone created and draft PR opened against `dev`.
  - Item moved to `In Progress` on the README roadmap board.
4. **✅ Done**:
  - Tests and static typing pass cleanly (`bun test`, `tsc --noEmit`).
  - PR merged into `dev`, fast-forwarded to `main`, and milestone closed.
  - Item moved to `Done` on the README roadmap board.

## Releases &amp; Semantic Versioning (`vX.Y.Z`)

All releases and git tags must follow strict `vX.Y.Z` semantic versioning:

- `X` **(Major)**: Breaking architectural changes, core schema shifts, or protocol overhauls (`vX.0.0`).
- `Y` **(Feature)**: Substantive new agent capabilities, MCP tools, or CLI subcommands (`vX.Y.0`).
- `Z` **(Minor / Hotfix / Critical Fix)**: Bug fixes, security patches, performance, and urgent hotfixes (`vX.Y.Z`).

### Invariants:

- Sync `package.json` `"version"` with the `vX.Y.Z` tag in the release commit.
- Stage on `release/vX.Y.Z` from `dev` → merge to `master` → back-merge to `dev`.
- CI publishes on `v*` tag push (`git tag -a vX.Y.Z -m "release: vX.Y.Z"`). Never `npm publish` manually.

