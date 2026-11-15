# Skill & Mode Change Playbook

> **One page that answers: I changed a skill — what else has to change with it?**
>
> Everything here is ordered by dependency: each step reads the output of the one above it. Running them out of order produces "successful" runs that silently ship stale artifacts. The executable form is `bun run change:skill --type <type>`; this document is the reasoning behind that order.

---

## Why order matters

A skill is not a file. It is a set of artifacts derived from `skills/<division>/<skill>/`:

```
skills/<division>/<skill>/
├── SKILL.md                 source of truth: frontmatter, modes table, description
├── references/<mode>.md     source: the mode playbook
├── README.md                generated  ← sync:surface
└── agents/openai.yaml       generated  ← sync:surface

skills.json                  generated (version/description) ← sync_registry
llms.txt                     generated  ← sync:surface
README.md                    mixed: catalog rows generated, counts partly manual
skills/context-orchestration/secretary/references/dispatch.md      generated ← sync-dispatch
skills/context-orchestration/secretary/references/mode-signals.json generated ← sync-dispatch
skills/context-orchestration/secretary/scripts/routing-defaults.ts  generated ← sync-dispatch
routing-signals.json         generated ← sync:routing:signals
routing-coverage.json        generated ← sync:routing:coverage
routing-baseline.json        measured  ← sync:routing:baseline
README routing table         generated ← sync:routing:docs
```

If you edit a generator's *input* after running the generator, the repo is stale until you run it again — which is exactly what `verify` catches, usually 20 minutes later.

---

## The order of work

### 0. Decide the change type

| You are… | Type | Command |
| :--- | :--- | :--- |
| adding a playbook to an existing skill | `new-mode` | `bun run change:skill --type new-mode` |
| creating a new skill | `new-skill` | `bun run change:skill --type new-skill` |
| editing a mode reference's content | `edit-mode` | `bun run change:skill --type edit-mode` |
| editing a `SKILL.md` (frontmatter, modes, body) | `edit-skill` | `bun run change:skill --type edit-skill` |
| renaming or deleting a mode | `rename-mode` | `bun run change:skill --type rename-mode` |

### 1. Write the source, by hand

- `new-mode` → create `references/<mode>.md` with the house structure: title, purpose line, `When to Use`, `Procedure`, `Verification`, `Anti-Patterns`.
- `new-skill` → create the directory, `SKILL.md` with valid frontmatter (`name`, trigger-rich `description`, `argument-hint`, `user-invocable`), and at least one `references/<mode>.md`.
- `rename-mode` → rename the file **and** remove the old one. A stale file keeps exporting a command nobody can run.

**Do not hand-edit generated files.** If you catch yourself editing `dispatch.md`, `llms.txt`, a skill README, or `routing-signals.json`, stop: you are about to lose that edit on the next sync.

### 2. Run the cascade

```bash
bun run change:skill --type new-mode
```

It runs, in this order, stopping at the first failure:

| # | Step | What it regenerates | Why it must come here |
| :-- | :--- | :--- | :--- |
| 1 | `bun run sync` | `skills.json` version/description, `dispatch.md`, `mode-signals.json`, `routing-defaults.ts` | everything downstream reads these |
| 2 | `bun run sync:surface` | `SKILL.md` mode tables, per-skill README, `llms.txt`, `agents/openai.yaml` | reads the mode list from step 1 |
| 3 | `bun run sync:routing:signals` | `routing-signals.json` | mirrors the router's curated tables |
| 4 | `bun run sync:routing:coverage` | `routing-coverage.json` | a new mode lands as **name-only** until curated |
| 5 | `bun run sync:routing:baseline` | `routing-baseline.json` | re-measures; catches a mode that broke routing |
| 6 | `bun run sync:routing:docs` | README accuracy + coverage table | reads step 5's numbers |
| 7 | `bun run verify` | — | 15 gates in one pass |

### 3. Finish the parts a generator cannot infer

| Artifact | Why it is manual | When |
| :--- | :--- | :--- |
| README `across N modes` per skill | the count lives in prose the generator does not own | any mode added or removed |
| `CHANGELOG.md` under `[Unreleased]` | judgement: what changed and why | always |
| `skills.json` `councilLead` / `defaultMode` | a curation decision, not derivable | new skill only |
| Routing concepts | a new mode is reachable by name only until a curated signal names it | when the mode should win on unseen wording |
| `docs/` and `CONTRIBUTING.md` | only if the change alters how contributors work | occasionally |

### 4. Prove it end to end

```bash
bun run verify          # everything offline
bun run check:install   # every harness destination, 467 commands each
bun run route:log --stats   # only if you are collecting real routing data
```

For a mode that changes routing, also run the freshness check:

```bash
bun run check:routing:v10   # the blind set written after the last router change
```

---

## Which skill to use for which step

This repository ships the skills that do its own work. Use them in this order rather than hand-rolling the same steps:

| Step | Skill | Mode |
| :--- | :--- | :--- |
| Decide what the change even is | `secretary` | `dispatch` — read the directory, not a keyword |
| Write or rewrite the mode playbook | `updateagents` | `skill-authoring` |
| Sync docs and the ledger after behaviour changes | `updatedocs` | `audit`, `ledger` |
| Branch, gate, PR, release | `git` | `branch`, `pr`, `release` |
| Review the diff before merging | `code-review` | `diff` |
| Check a change did not weaken tests | `code-review` | `triage-matrix` |
| Ship a release | `git` | `release` (or `bun run release:cut`) |

---

## What fails, and what it means

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `check:surface` — "15 file(s) drift" | generator ran before its input changed | run `bun run sync` then `bun run sync:surface`, in that order |
| `check:routing:coverage` — stale | a mode was added/removed | `bun run sync:routing:coverage` |
| `check:routing:docs` — README table | baseline moved | `bun run sync:routing:baseline` then `sync:routing:docs` |
| `check:ledger` — points owing docs | commits without doc coverage | `updatedocs --ledger`, then `--mark` or write the docs |
| capability sweep — "documented nowhere" | a new script/asset has no README mention | name the file path in README, not just the command |
| `check:install` — destination mismatch | a harness gained/lost a surface | `bun run sync:harness`, or fix `harness.json` |
| routing matrix — a distribution dropped | the change altered scoring | improve it, or justify the baseline move in the PR diff |

---

## Anti-patterns

- **Running `sync` last.** It regenerates `dispatch.md` from the mode list; run it after adding the mode, never before.
- **Editing `dispatch.md` by hand.** It is generated between markers; hand edits vanish on the next run.
- **Adding a mode without curating a signal.** It will export and load, and the router will never choose it on unseen wording — visible as a new name-only entry in `routing-coverage.json`.
- **Lowering a routing baseline to make a change pass.** The baseline is the measurement; moving it is a decision to state out loud in the PR, not a fix.
- **Skipping `verify` because "it is only docs".** The strictest gates here are docs gates.
