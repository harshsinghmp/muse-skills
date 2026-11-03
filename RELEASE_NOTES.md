# 🏛️ Muse Skills v8.1.2 — Audit & Boundary Hardening

> **The updateagents follow-up release: honest 14-asset scoring, a boundary fence across every write mode, and a clean 14/14 audit on this repository.** 386 automated tests. 14,267 assertions. 46 production-grade skills. Zero test failures. Zero tracked agent artifacts. Zero credential leaks.

---

## 🛠️ What Changed in v8.1.2

- **Honest audit scorecard**: the denominator is derived from the actual checks (14), so the engine can no longer report a false `13/13 AI-Ready` while an asset is failing. The root `AGENTS.md` router is back under the 90-line budget, and the matrix documents the Workspace Terrain Maps asset.
- **Boundary fence across every write mode**: `--sanitize`, `--promote`, and `--hygiene --consolidate/--purge` now refuse an umbrella workspace that merely contains repositories. Sanitization and audit skip nested VCS roots and `.stversions/` backups; a `--promote` target outside the workspace or inside a nested clone is refused unless `--follow-nested-repos` is set.
- **Audit classification**: compiled IDE artifacts (`.github/copilot-instructions.md`, `.cursor/rules/*.mdc`), generated `.opencode/commands/`, and `.stversions/` backups are treated as destinations, not legacy debts. This repository now audits **14/14**.
- **Instruction-source matching locked**: regression tests pin `agents/` personas, lowercase legacy names, and bare extensions as non-sources while preserving known names, `*.instructions.md`, rules/convention names, and harness rule directories.
- **Sanitize fixture hardening**: the boundary test assembles its synthetic marker at runtime so a release sanitization pass never rewrites the fixture.

## 📊 Verification

| Metric | v8.1.1 | v8.1.2 |
|:---|:---|:---|
| Automated Tests | 375 | **386** |
| Test Assertions | 14,226 | **14,267** |
| Skills Count | 46 | **46** |
| Repository Audit | 13/14 | **14/14** |
| Test Failures | 0 | **0** |
| Tracked Agent Artifacts | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Quick Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.1.1...v8.1.2

---

# 🏛️ Muse Skills v8.1.1 — updateagents Workspace Boundary Hotfix

> **Patch release for the 2026-11-03 cross-repository data-loss incident.** 375 automated tests. 14,226 assertions. 46 production-grade skills. Zero test failures. Zero tracked agent artifacts. Zero credential leaks.

---

## 🛠️ What Changed in v8.1.1

- **Nested-repository boundary fence**: instruction discovery stops at every nested VCS root (`.git` directory or file, `.hg`, `.svn`). An umbrella directory that is not itself a repository refuses to adapt anything and exits non-zero with the discovered paths. `--follow-nested-repos` (default `false`) is the only opt-in.
- **`agents/` is product content**: persona and subagent-definition trees are never classified as runtime instructions or rewritten into adapters.
- **Pre-write plan and confirmation**: `--dry-run` prints every source path and its replacement adapter and writes nothing. Multi-file or non-root adaptation requires `--yes` or an interactive prompt; non-interactive runs abort with zero writes.
- **Archive-before-adapt**: exact originals are snapshotted under `.agents/archive/agent-instructions/` with SHA-256 provenance before any rewrite.
- **Preserved behavior**: root `AGENTS.md` is never regenerated, `CLAUDE.md` stays exactly `@AGENTS.md`, existing snapshots work, and `.memory/**` remains untouched.

## 📊 Verification

| Metric | v8.1.0 | v8.1.1 |
|:---|:---|:---|
| Automated Tests | 371 | **375** |
| Test Assertions | 14,193 | **14,226** |
| Skills Count | 46 | **46** |
| Test Failures | 0 | **0** |
| Tracked Agent Artifacts | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Quick Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.1.0...v8.1.1

---

# 🏛️ Muse Skills v8.1.0 — Session-Proof Docs & Clean Agent Roots

> **Documentation that remembers, agent context that catches up, and project roots that stay clean across every harness.** 371 automated tests. 14,193 assertions. 46 production-grade skills. 458 slash commands per harness. Zero test failures. Zero tracked agent artifacts. Zero credential leaks.

---

## 🌟 What's New in v8.1.0

- **Documentation Point Ledger (`updatedocs` v2.8.0)** (#331): Every change that owes docs is now a sequential `DP-####` point in `.docs-ledger.json` with developer, user, and agent coverage, phrase-based evidence, a documented watermark, and shipped state. `--ledger` catches up forgotten sessions, `--checkpoint` advances only when complete, `--check-points` gates CI, `--whats-new` projects audience-specific notes, `--write-changelog` / `--write-client-changelog` publish managed blocks, and `--install-hook` captures every commit. Full reference: `updatedocs/references/DOCS-LEDGER.md`.

- **Agent Docs Backlog (`updateagents` v2.6.0)** (#331): `--docs-backlog` folds completed agent-facing points into `.agents/context/current.md`, stops at the first point still owing agent docs, and advances an independent agent watermark. The default sync consumes ready points automatically. Full reference: `updateagents/references/docs-backlog.md`.

- **Harness Hygiene & Clean Roots (`updateagents` v2.6.0)** (#331): `--hygiene` detects IDE/ADE/CLI artifacts at the root; `--hygiene --consolidate` archives and moves non-active artifacts under `.agents/`; `--hygiene --purge --yes` handles disposable caches. The running harness is detected and always skipped, managed adapters are preserved, and every archive writes a SHA-256 manifest. `--install-excludes` keeps agent state in local-only `.git/info/exclude`, while the public `gitignore.template` stays free of harness names and the new `gitignore.private.template` holds internal rules. Session, pre-commit, and pre-push hooks plus `check:hygiene` gate the workflow. Full reference: `updateagents/references/harness-hygiene.md`.

- **Client Onboarding Engine (`new-project` v2.8.0)** (#331): A five-section onboarding interview (identity, business, offerings/scope, engagement terms, technical access) with 30+ granular flags and JSON/Markdown `--intake` support. The engine renders the complete `Client-Intake/` suite and a client-aware `start-here.md` from real answers, then compiles `.agents/brand/` and `.agents/context/`. The decision tree now spans twelve archetypes with granular framework, CMS, commerce, database, auth, palette, and deployment choices. Full reference: `new-project/references/client-onboarding.md`.

- **Public-Safe Gitignore Split** (#331): Agent and harness paths are no longer advertised in the committed `.gitignore` template. Local excludes are installed through `updateagents --install-excludes`; `new-project` and `updateagents --scaffold` do this automatically when the target is a git repository. This repository dogfoods the model: the public `.gitignore` keeps a pointer, and the internal patterns live in `.git/info/exclude`.

- **Capability Sweep Fix** (#331): Scaffolding templates under `templates/` are no longer misreported as invisible skill reference files. The live capability sweep is back to 100% with zero undocumented capabilities.

---

## 📊 Suite Verification & Stats

| Metric | v8.0.1 | v8.1.0 |
|:---|:---|:---|
| Automated Tests | 366 | **371** |
| Test Assertions | 14,131 | **14,193** |
| Skills Count | 46 | **46** |
| Command Surface | 457 | **458** |
| Test Failures | 0 | **0** |
| Tracked Agent Artifacts | 0 | **0** |
| Secret Leaks | 0 | **0** |

---

## 🚀 Quick Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.0.1...v8.1.0
