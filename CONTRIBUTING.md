# Contributing to Muse Skills

> **The QUEST Standard for Autonomous & Human Engineering**: Quality, Understanding, Education, Stimulation, and Transition.

Thank you for contributing to **Muse Skills**. This guide establishes the mandatory engineering standards, Git workflow, and skill anatomy required to maintain a zero-defect, production-grade AI agent skills library.

---

## 🎯 1. Qualify (Who This Is For)

This guide is for **human engineers, agency architects, and autonomous AI coding agents** contributing new capabilities, bug fixes, or performance optimizations to the `muse-skills` ecosystem.

We operate under a strict **Evidence Over Claims** doctrine:
- If code changes, tests and documentation must change.
- Claims of success must be backed by real, executable terminal output (`bun test`).
- Every contribution must maintain 100% backward compatibility and zero credential leakage.

---

## 🧩 2. Understand (The Problems We Solve)

Vanilla AI agent contributions frequently suffer from four fatal failure modes:
1. **Chaotic Commit History**: Vague messages like `update files` or `fix stuff` destroy forensic traceability and break automated changelogs.
2. **Monolithic Pull Requests**: Bundling multiple skill modifications into one giant PR creates merge conflicts, blocks releases, and hides regressions.
3. **Documentation Drift**: Adding features without updating `skills.json`, `llms.txt`, and `dispatch.md` blinds agent discovery engines.
4. **Credential Exposure**: Accidentally committing `.env` files or hardcoded API keys compromises security across the entire ecosystem.

In `muse-skills`, our protocols eliminate these risks at the root.

---

## 📚 3. Educate (Core Engineering Standards)

### A. Meaningful Git Commit Protocol (Mandatory)

Every commit in this repository must follow the **Conventional Commits** standard with explicit, high-signal context in the body.

#### Commit Message Format

```text
<type>(<scope>): <concise-imperative-summary>

- Why: [Explain the problem, user request, or business rationale]
- What: [Bullet list of specific files, components, or mechanisms modified]
- Verification: [Proof of clean build, linter/typecheck, or test receipts]
```

#### Allowed Types

- `feat`: A new skill, sub-mode, or CLI capability.
- `fix`: A bug fix or defect correction.
- `docs`: Documentation updates (`README.md`, references, comments).
- `refactor`: Code restructuring without changing observable behavior.
- `perf`: Performance optimizations (context compression, execution speed).
- `test`: Adding or modifying automated test suites.
- `chore`: Dependency updates, registry metadata, build tooling.
- `ci`: CI/CD workflow updates.

#### Commit Examples

```text
# ✅ Good Commit (Accepted):
feat(secretary): add continuous auto-sync dispatch engine and zero-drift contract (#31)

- Why: Ensures secretary:dispatch and multi-harness commands never drift when skills are modified.
- What:
  - Added scripts/sync-dispatch.ts to regenerate agency directory dynamically.
  - Wired auto-sync into scripts/hooks/sync-registry-on-skill-add.sh.
  - Added zero-drift test assertion in tests/skills.test.ts.
- Verification: Ran bun test (124 passed, 2,855 assertions); bun run lint passed cleanly.

# ❌ Bad Commits (Rejected by Pre-Commit Gates):
update files
fix bugs
wip
changes
```

---

### B. Git Workflow & Release Lifecycle

#### Branching Matrix

- `main` → Production releases only. **Never commit directly to `main`.**
- `dev` → Active integration and staging branch. All feature branches cut from `dev`.
- `feat/<skill>-<feature>` → Isolated feature branches for individual tasks or skills.
- `release/vX.Y.Z` → Staged from `dev` when preparing production release; merged into `main`, then back into `dev`.
- `hotfix/<issue>` → Emergency fixes cut from `main`; merged into both `main` and `dev`.

#### Invariant Rules

1. **Atomic PR Per Skill / Feature**: Always open a separate, dedicated feature branch and Pull Request for each skill or feature. Even when executing multiple upgrades in a single working session, never bundle multi-skill changes into one monolithic PR.
2. **Linear History & Rebase**: Prefer `git rebase` within feature branches to keep history clean and linear before merging.
3. **Zero Secrets (Vibeguard Protocol)**: Never commit secrets, tokens (`sk-*`, `ghp_*`, private keys), or `.env` files. Run pre-commit secret scans before staging.

#### Release Checklist (`release/vX.Y.Z`)

1. **Full suite green**: `bun test` — includes the three-scenario agency simulation, which must cover all 46 shipped skills (46/46). The harness asserts the union of scenario skills against `skills.json`; a new skill without a scenario fails here.
2. **Static checks**: `bun run lint` and `bunx tsc --noEmit` are clean.
3. **Freshness**: `bun run check:sync` confirms the release branch contains the latest `dev`.
4. **Version + derived artifacts**: move the `Unreleased` changelog block into `## [X.Y.Z]`, bump `package.json` and the README version, and regenerate every declared derived artifact in the same commit.
5. **Release notes**: add the new version's section to `RELEASE_NOTES.md` — the tag-triggered Release workflow publishes that section, and `tests/release-notes.test.ts` fails when the current `package.json` version has none.
6. **Delivery**: tag `vX.Y.Z` on a commit reachable from `main`, publish the release, merge back into `dev`, then confirm `bun run check:landed` exits 0.
7. **Release smoke**: run `bun run release:smoke` (also run by the `Release Smoke` workflow on publish). It verifies the tag commit against the release `checksums.txt` asset and the installer default ref; a failure means the published installer cannot verify itself.
8. **Docs ledger**: stamp the release with `bun skills/core-engine/updatedocs/scripts/updatedocs.ts . --release vX.Y.Z`, then confirm `bun run check:ledger` passes. The Release workflow gates on this check, so a stale ledger blocks the tag.
9. **Dependency smoke**: `bun run check:deps` fails when a direct dependency is behind the registry or the pinned `musememory` MCP runtime cannot start. CI runs it in the lint job.

---

### B2. Issue Triage, Labels & Blocked-By

Every issue carries exactly one **type**, one **priority**, and at least one **area** label:

| Dimension | Labels |
| :--- | :--- |
| Type | `security`, `skill-quality`, `bug`, `enhancement`, `docs` |
| Priority | `p0` (data loss / credential exposure), `p1` (fail-open / broken contract), `p2` (hardening / drift) |
| Area | `area:skills`, `area:ci`, `area:scripts`, `area:docs`, `area:templates` |

- **Blocked-by is explicit in the body.** Add a line `Blocked by #123` (one per blocker). Do not start or merge the issue while a blocker is open; resolve the blocker first or record a written waiver in the issue.
- **Tracking issues** list child issues as `- [ ] #NNN — title` and close only when every child is closed or explicitly declined with a reason.
- **Security findings are never silently closed.** A finding is closed by a merged fix with a regression test, or by a written false-positive rationale with file/line evidence.

### C. Skill Directory Anatomy (RFC Standard)

Every skill must reside in its own dedicated directory at repository root:

```text
<skill-name>/
├── agents/
│   └── openai.yaml         # Tool parameter schema for OpenAI/Codex/Cursor
├── examples/               # (Recommended) Concrete input/output artifacts
│   └── sample-<name>.md
├── references/             # Supporting deep architectural references and mode playbooks
│   └── <mode>.md
├── scripts/                # (Optional) Executable validation or generation scripts
│   └── helper-script.ts
├── README.md               # User-facing summary, modes table & installation guide
└── SKILL.md                # The definitive agent operational prompt with YAML frontmatter
```

#### Required Frontmatter Parity

Every `SKILL.md` must have valid YAML frontmatter matching `skills.json` and `llms.txt`:

```yaml
---
name: <skill-name>
description: "Trigger-rich description outlining when to invoke and what is delivered."
argument-hint: "[mode] [flags]"
user-invocable: true
metadata:
  hermes:
    tags: [tag1, tag2]
    related_skills: [skill-a, skill-b]
    requires_tools: [bash, view_file, write_to_file]
---
```

---

## ⚡ 4. Stimulate (Why High Standards Matter)

When your pull request respects these standards:
- **Instant Portability**: Your skill is immediately usable across 80+ agent harnesses (OpenCode, Antigravity, Cursor, Windsurf, Claude Code, Hermes).
- **Universal Slash Commands**: It automatically compiles into native slash commands (`/<skill>`, `/<skill>:<mode>`) and the `muse` CLI runner.
- **Autonomous Dispatch**: It gets indexed into `secretary:dispatch`, allowing agents to auto-route tasks to your skill without user prompt engineering.
- **Zero Regression Churn**: Automated test suites protect your code from being broken by future changes.

---

## 🚀 5. Transition (Step-by-Step Contribution Checklist)

Follow this 6-step checklist to submit your contribution:

```bash
# 1. Cut a fresh feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feat/<skill-name>-<feature>

# Keep agent/harness state local-only (never committed, never in public .gitignore)
bun skills/core-engine/updateagents/scripts/updateagents.ts . --install-excludes

# 2. Author or modify your skill assets
# (SKILL.md, README.md, agents/openai.yaml, references/<mode>.md)

# 3. Synchronize catalog, dispatch directory & harness commands
bun run sync-dispatch

# 4. Verify test suite, linting & type checks
bun test
bun run lint
bun run type-check

# 5. Commit using the Meaningful Git Commit Protocol
git add -A
git commit -m "feat(<skill-name>): <imperative summary> (#issue)"

# 6. Confirm branch freshness, then push and open your atomic PR against dev
bun run check:sync
git push origin feat/<skill-name>-<feature>

# 7. Prove delivery (Landing Gate) — a commit is not a delivery.
bun run check:landed -- --mode=pre-review --head="$(git branch --show-current)"
```

### Pre-merge sync gate

Run `bun run check:sync` before opening or updating a PR, and again immediately before merging. It fetches the integration branch and fails when the current branch does not contain the latest `origin/dev`, or when the local `dev` branch is behind its remote. The same check runs in CI as the `sync-gate` job.

The durable guarantee is server-side: on `dev` and `main`, enable **Require branches to be up to date before merging** and mark `sync-gate` as a required status check. Local checks cannot stop another device from advancing the base branch, so never merge a stale PR through the GitHub UI.

The gate's verdicts are `REVIEWABLE` / `NOT REVIEWABLE` before merge and `LANDED` / `LOCAL` after it; until the gate exits 0, say LOCAL — never "landed". Full standard: [`.agents/standards/landing-gate.md`](.agents/standards/landing-gate.md).

---

## 📄 License

By contributing to Muse Skills, you agree that your contributions will be licensed under the [MIT License](LICENSE).
