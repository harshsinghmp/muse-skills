# Contributing to Muse Skills

Thank you for contributing to the **Muse Skills** repository.

---

## 📜 Meaningful Git Commit Protocol (Mandatory)

Every commit in this repository must follow the **Conventional Commits** standard with explicit, high-signal context in the body.

### Commit Format

```
<type>(<scope>): <concise-imperative-summary>

- Why: [Explain the problem, user request, or business rationale]
- What: [Bullet list of specific files, components, or mechanisms modified]
- Verification: [Proof of clean build, linter/typecheck, or test receipts]
```

---

### Allowed Types

- `feat`: A new skill, feature, or CLI capability.
- `fix`: A bug fix or defect correction.
- `docs`: Documentation only changes (README, references, comments).
- `refactor`: Code restructuring without changing behavior.
- `perf`: Performance optimizations.
- `test`: Adding or modifying automated tests/probes.
- `chore`: Dependency updates, registry metadata, build tooling.
- `ci`: CI/CD workflow updates.

---

### Examples

#### Good Commit:
```
feat(new-project): add dynamic llms.txt generation and reality machine

- Why: Enables newly scaffolded projects to maintain persistent, auto-indexed documentation for LLMs.
- What:
  - Added scripts/generate_llms_txt.ts to Project OS template.
  - Initialized STATE.md with 8-stage reality lifecycle.
  - Linked agency-suite skills into .agents/skills.
- Verification: Tested in sandbox directory /tmp/test-project-os; build and index generation passed.
```

#### Bad Commits (Rejected):
❌ `update files`
❌ `fix bugs`
❌ `wip`
❌ `changes`

---

## 🌿 Git Workflow & Release Lifecycle (Mandatory)

### Branches

- `main` → Production. **Never commit directly to** `main`**.**
- `dev` → Staging/integration branch.
- `feature/*` or `feat/*` → Created from `dev` for individual features/tasks.
- `release/vX.Y.Z` → Created from `dev` when changes are ready for production; merge into `main`, then back into `dev`.
- `hotfix/*` → Created from `main` for urgent production fixes; merge into both `main` and `dev`.

### Rules

- Feature branches must be created from `dev`.
- Use descriptive branch names.
- Every merge into `dev` or `main` requires a Pull Request and code review.
- Do not rewrite or force-push `dev` or `main` history.
- Prefer `rebase` within feature branches when integrating changes and keeping history linear.
- For production bugs, use `hotfix/*` rather than merging unfinished work from `dev`.
- Prefer a new revert commit over rewriting shared history.

### Commit Message Standard

- **Subject (≤50 chars)**: Capitalized imperative Conventional Commit (e.g., `Skill: Added New - Designs Scope`, never `Added designscope` or `Fix stuff`).
- **Body (≤72 chars/line)**: Focus on *why* and non-obvious rationale instead of restating the diff; avoid pronouns (`I`, `we`) and meta-phrasing (`This commit/PR`).
- **Issue References**: Link issues at the bottom (e.g., `Closes #123`, `Resolves #456`).

### Releases & Semantic Versioning (`vX.Y.Z`)

- `X` **(Major)**: Breaking architectural changes, core schema shifts, or protocol overhauls (`vX.0.0`).
- `Y` **(Feature)**: Substantive new agent capabilities, MCP tools, or CLI subcommands (`vX.Y.0`).
- `Z` **(Minor / Hotfix)**: Bug fixes, security patches, performance, and urgent hotfixes (`vX.Y.Z`).

Invariants:

- Sync `package.json` `"version"` with the `vX.Y.Z` tag in the release commit.
- Stage on `release/vX.Y.Z` from `dev` → merge to `main` → back-merge to `dev`.
- CI publishes on `v*` tag push (`git tag -a vX.Y.Z -m "release: vX.Y.Z"`). Never `npm publish` manually.

---

## Adding a New Skill

1. Create a directory for your skill: `mkdir my-skill`
2. Include all required assets:
   - `SKILL.md` (Main skill prompt & workflow)
   - `README.md` (User documentation)
   - `agents/openai.yaml` (Agent tool definition)
   - `scripts/` or `references/` (Optional helpers)
3. Register the skill in `skills.json`.
4. Validate JSON and test locally.
5. Create a meaningful commit following the protocol above and submit a PR or push.
