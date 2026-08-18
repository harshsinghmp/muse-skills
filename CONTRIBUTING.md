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
