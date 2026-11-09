# 🏛️ Muse Skills v8.4.1 — Audit Follow-ups & Release Smoke

> **Patch release: closes the four post-audit follow-ups, refreshes dependencies and the docs ledger, and adds an automatic checksum-pinned smoke check for every published release.** 698 automated tests. 47 test files. 46 production-grade skills. 460 slash commands per harness. Zero failures. Zero credential leaks.

---

## 🛠️ What Changed in v8.4.1

- **Lockfile audit accepts directories**: `code-review --audit-lockfile <dir>` resolves `bun.lock`/`package-lock.json`/`pnpm-lock.yaml`/`yarn.lock` instead of failing with EISDIR.
- **CI security job**: a dedicated `security-audit` job runs boundary/tenant checks, EDR heuristic checks, and the lockfile supply-chain audit; the landing gate depends on it.
- **Release smoke**: `.github/workflows/release-smoke.yml` and `bun run release:smoke` verify the published tag commit against the release `checksums.txt` asset and the installer default ref.
- **Triage and threat model**: issue type/priority/area labels, blocked-by convention, and the installer→clone→scaffold→generated-CI threat model are documented.
- **Dependency and docs refresh**: `musememory` 3.3.0, Biome 2.6.6, `bun-types` 1.4.4; `docs/CHANGELOG.md` is marked historical; `.docs-ledger.json` is current; `twelve-asset-matrix` is now `fourteen-asset-matrix`.

## 📊 Verification

| Metric | v8.4.0 | v8.4.1 |
|:---|:---|:---|
| Automated Tests | 697 | **698** |
| Test Files | 47 | **47** |
| Failures | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.4.0...v8.4.1

---

# 🏛️ Muse Skills v8.4.0 — Security Wave 3, Skill-Quality Gates & Faster CI

> **Minor release: the 2026-11-09 security audit's remaining waves land — honest client outputs, fail-closed gates, supply-chain pinning, path containment, and constant-time review auth — alongside the complete skill-quality program (one canonical discovery surface, import-safe scripts, repaired install URLs, reconciled docs) and a CI suite that runs in about half the time.** 697 automated tests. 16,400+ assertions. 46 production-grade skills. 460 slash commands per harness. Zero test failures. Zero tracked agent artifacts. Zero credential leaks.

---

## 🛠️ What Changed in v8.4.0

- **Honest outputs (#394)**: generated client artifacts carry a verified receipt or say "not run"; money math uses integer minor units; metering uses producer event IDs with a persisted dedupe set and clamps invoices to the spend ceiling; PII is reported by key only.
- **Fail-closed CI and supply chain (#395)**: the secret scan prints locations only and emits real SARIF; sync/landing gates run from the base ref and read check runs; release requires `vX.Y.Z`, `main` ancestry, and a protected environment; actions are SHA-pinned; `install.sh` verifies the tagged commit against a release checksum asset; `.mcp.json` has an allowlist gate.
- **Guidance and scanner truth (#396)**: SSRF allowlists, CSP/`__Host-` cookies, analytics retention and consent, Set-Cookie/CORS/CSRF gates, owner-only `.env`, pinned MCP servers, `--confirm-irreversible`, and `bun.lock` parsing.
- **Coverage gaps (#397)**: canonical path jail, constant-time review tokens, HMAC-before-parse webhook scaffolds, runner-flag rejection, cron-safe hooks, unknown-DDL flagging, Playwright error assertions, frontmatter dry-run/backups, confirmed port release, and SSRF-safe Python fetchers.
- **Skill-quality program (#373/#377–#380)**: one generated discovery surface (`bun run check:surface`) keeps SKILL tables, `argument-hint`, READMEs, `skills.json`, `llms.txt`, and `agents/openai.yaml` aligned; `updatedocs`/`new-project` are under the router cap; four scripts are import-safe; install URLs and relay branding are repaired; the `#380` contradictions are reconciled.
- **Production optimization**: `bun test --parallel` cuts the suite from ≈89s to ≈48s; CI caches package tarballs, drops two needless installs, and cancels superseded runs.
- **Release safety**: a new `tests/version-consistency.test.ts` pins `package.json` ⇄ README badge/install URL ⇄ installer default ⇄ release notes ⇄ checksum asset.

## 📊 Verification

| Metric | v8.3.0 | v8.4.0 |
|:---|:---|:---|
| Automated Tests | 408 | **697** |
| Test Files | 28 | **47** |
| Skills | 46 | **46** |
| Slash Commands / Harness | 460 | **460** |
| Test Failures | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.3.0...v8.4.0

---

# 🏛️ Muse Skills v8.3.0 — Entry-Point Guard, Next 3 Follow-ups & Full-Coverage Simulations

> **Minor release: `updateagents` is entry-point gated so importing it never runs a sync, generated `AGENTS.md` files end highly technical work with a prioritized Next 3 follow-up block, the three-scenario agency simulation covers all 46 skills and gates releases, and CI caches and pins Bun to end release-asset 504 failures.** 408 automated tests. 14,729 assertions. 46 production-grade skills. 460 slash commands per harness. Zero test failures. Zero tracked agent artifacts. Zero credential leaks.

---

## 🛠️ What Changed in v8.3.0

- **Entry-point guard**: `updateagents.ts` gates its CLI program and argv parsing on `import.meta.main` (with a `process.argv[1]` fallback). Importing the module for helpers no longer runs a default sync or rewrites curated standards. Covered by `tests/updateagents-import-guard.test.ts`.
- **Next 3 follow-ups**: the generated `AGENTS.md` now requires user-facing highly technical work (code, debugging, architecture, security, infrastructure, dependencies, releases) to end with a prioritized **Next 3** block after the Layman Report. Mirrored in the root router and `updatedocs`.
- **Template render test**: `tests/updateagents-next-3-template.test.ts` proves the rule reaches rendered and freshly scaffolded `AGENTS.md` files with no unresolved placeholders.
- **Full-coverage simulations**: the three client scenarios (e-commerce, B2B SaaS, productized agency) now span every skill in `skills.json`, and the harness fails if the union drifts.
- **Release checklist**: `CONTRIBUTING.md` documents the per-release gate, including the 46/46 simulation coverage requirement.
- **CI Bun runtime**: workflows restore `~/.bun/bin/bun` from the Actions cache and pin `bun-version` to `1.4.4`, so `setup-bun` reuses the existing binary and avoids downloading each release asset on a warm cache instead of hitting the `504` failures.

## 📊 Verification

| Metric | v8.2.0 | v8.3.0 |
|:---|:---|:---|
| Automated Tests | 391 | **408** |
| Test Assertions | 14,335 | **14,729** |
| Test Files | 25 | **28** |
| Skills Count | 46 | **46** |
| Slash Commands / Harness | 460 | **460** |
| Test Failures | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Quick Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.2.0...v8.3.0

---

# 🏛️ Muse Skills v8.2.0 — Universal Sync Gate & Language Enforcement

> **Minor release: every scaffolded project receives a self-contained pre-merge sync gate, `updateagents` can refresh existing workflow templates, the English-only policy now binds narration between tool calls, and URL intake rules are in the root router.** 391 automated tests. 14,335 assertions. 46 production-grade skills. 460 slash commands per harness. Zero test failures. Zero tracked agent artifacts. Zero credential leaks.

---

## 🛠️ What Changed in v8.2.0

- **Universal pre-merge sync gate**: `templates/github/workflows/sync-gate.yml` is provisioned by `new-project` and `updateagents`, is selected for every project type, and uses only Git (`git fetch` + `git merge-base --is-ancestor`). It blocks a pull request whose head does not contain the latest base without requiring a language runtime or project script.
- **Refresh path for established projects**: a plain `updateagents` run creates the workflow when missing; `updateagents --refresh-workflows` overwrites existing workflow templates while the default preserves user edits. The `git-workflow` standard records the pre-merge sync rule.
- **Repository sync gate**: `scripts/check-sync.ts` and the required `sync-gate` CI job fail stale branches, and branch protection on `dev` and `main` now requires the check alongside `bun test`, `lint`, `type-check`, `secret-scan`, and `landing-gate`.
- **Language policy**: rule 6 and the language-policy standard state that narration between tool calls is output, add a required `Known limit` section for what the file guard cannot see, add mid-turn recovery guidance, and add contract self-check assertions.
- **URL intake**: the root `AGENTS.md` router now directs every dropped URL through classify -> fetch -> dump -> owning-department routing.

## 📊 Verification

| Metric | v8.1.5 | v8.2.0 |
|:---|:---|:---|
| Automated Tests | 387 | **391** |
| Test Assertions | 14,313 | **14,335** |
| Skills Count | 46 | **46** |
| Slash Commands / Harness | 460 | **460** |
| Test Failures | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Quick Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.1.5...v8.2.0

---

# 🏛️ Muse Skills v8.1.5 — Irreversible Data Hazard Banner & English Language Policy

> **Patch release: clean-system-cache gains a loud boxed irreversible-data hazard banner for ASK! selections, updateagents enforces a universal English-only working language policy across canon standards, @biomejs/biome moves to 2.6.5, and CI Bun setup absorbs release-asset CDN 504s.** 387 automated tests. 14,313 assertions. 46 production-grade skills. 460 slash commands per harness. Zero test failures. Zero tracked agent artifacts. Zero credential leaks.

---

## 🛠️ What Changed in v8.1.5

- **`clean-system-cache`: loud irreversible-data hazard banner**: before any `ASK!` confirmation prompt the CLI now prints a boxed `WARNING: IRREVERSIBLE DATA LOSS` naming each selected target and warning that deleted contents cannot be recovered. The Windows CLI prints the same box, listing every `ASK!` candidate in the catalog. `T1`/`T2`-only selections never print it, preserving warning salience.
- **`updateagents` universal English language policy**: `templates/.agents/standards/language-policy.md` becomes the 22nd canon standard and is registered in `ALWAYS_STANDARDS` plus generated `AGENTS.md`, ensuring all agent work stays strictly in English regardless of prompt language, with translated client-facing site copy as the explicit carve-out.
- **Dependencies**: `@biomejs/biome` bumped from 2.6.2 to 2.6.5 with a regenerated `bun.lock`.
- **CI resilience**: Bun setup in `ci.yml` and `release.yml` now absorbs transient `504 Gateway Timeout` errors from GitHub release asset CDNs with a guarded retry.

## 📊 Verification

| Metric | v8.1.4 | v8.1.5 |
|:---|:---|:---|
| Automated Tests | 386 | **387** |
| Test Assertions | 14,303 | **14,313** |
| Skills Count | 46 | **46** |
| Slash Commands / Harness | 460 | **460** |
| Test Failures | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Quick Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.1.4...v8.1.5

---

# 🏛️ Muse Skills v8.1.4 — Cache Engine & Scaffold Fix

> **Patch release: the clean-system-cache engine grows to a 16-point architecture matrix with a candidate catalog, and `new-project` stops crashing when the emdash preset meets a missing `src/`.** 386 automated tests. 14,303 assertions. 46 production-grade skills. 460 slash commands per harness. Zero test failures. Zero tracked agent artifacts. Zero credential leaks.

---

## 🛠️ What Changed in v8.1.4

- **clean-system-cache: 16-point cache architecture matrix**: four new suite groups (AUR helpers, desktop indexes and runtimes, confirmation-gated candidates, discovery and learning) extend the previous 12-point matrix. The skill now documents candidate ownership in `references/candidate-catalog.md` so a menu can describe every entry instead of guessing.
- **Self-learning scanner description**: the `SKILL.md` frontmatter, `skills.json` registry, and `llms.txt` index carry the same rewritten description. Command surface moves from 459 to **460** per harness (46 skills + 404 `<skill>-<mode>` commands + 10 aliases).
- **`new-project` emdash scaffold fix**: the preset writes `src/live.config.ts` and `src/worker.ts` but relied on the Astro scaffold having created `src/` first. On a clean provisioning run that directory was absent, so scaffolding aborted with `ENOENT`. The directory is now created before the write. Latent on `main` before this release.
- **Test hermeticity**: `harness-hygiene` fixtures force their tracked paths past global git excludes so the public-surface gate is deterministic, and the clean-system-cache suite asserts the 16-point matrix.

## 📊 Verification

| Metric | v8.1.3 | v8.1.4 |
|:---|:---|:---|
| Automated Tests | 386 | **386** |
| Test Assertions | 14,267 | **14,303** |
| Skills Count | 46 | **46** |
| Slash Commands / Harness | 459 | **460** |
| Test Failures | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Quick Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.1.3...v8.1.4

---

# 🏛️ Muse Skills v8.1.3 — Toolchain Patch

> **Patch release: TypeScript 7 and setup-uv 10 across the build and CI toolchain.** 386 automated tests. 14,267 assertions. 46 production-grade skills. Zero test failures. Zero tracked agent artifacts. Zero credential leaks.

---

## 🛠️ What Changed in v8.1.3

- **TypeScript 7.0.2**: the native compiler replaces TypeScript 5.9.3. `tsconfig.json` was already TS7-clean (`ESNext`, `bundler`, `strict`, explicit `bun-types`), and no programmatic compiler API, `tsserver`, typescript-eslint, ts-node, or tsx consumers exist. `bun.lock` is regenerated with the TS7 platform binaries; the dead `package-lock.json` stub is intentionally untouched.
- **setup-uv 10.3.3**: the CI ruff runner moves from v6.8.0 to v10.3.3. Only `.github/workflows/ci.yml` uses the action, with no `with:` inputs, so the v7–v10 breaking changes (node24, removed `server-url`, tag policy, cache defaults) are inert here.
- **Clean dependency hygiene**: the Dependabot TypeScript PR was replaced because it populated the abandoned npm lockfile instead of `bun.lock`; the replacement updates `package.json` + `bun.lock` only.
- **Documentation**: the Unreleased dependency note is stamped into this release, and the documentation ledger remains at zero pending points.

## 📊 Verification

| Metric | v8.1.2 | v8.1.3 |
|:---|:---|:---|
| Automated Tests | 386 | **386** |
| Test Assertions | 14,267 | **14,267** |
| Skills Count | 46 | **46** |
| TypeScript | 5.9.3 → 7.0.2 | **7.0.2** |
| setup-uv | 6.8.0 → 10.3.3 | **10.3.3** |
| Test Failures | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Quick Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v8.1.2...v8.1.3

---

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
