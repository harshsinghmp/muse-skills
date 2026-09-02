# 🤖 Agent Context & Instruction Policy

Rules for maintaining and synchronizing AI agent instruction files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, Cursor rules, Copilot instructions).

---

## 1. Purpose of Agent Context Files

Agent instruction files serve as binding operational contracts for AI coding assistants working in the repository. They establish behavioral boundaries, non-negotiable invariants, and essential workspace tooling.

---

## 2. What Belongs in Agent Context

Only include high-density, actionable information that directly guides an agent's code generation and tool usage:

| Category | Include in Agent Context | Do NOT Include |
|:---|:---|:---|
| **Commands** | Exact, verified build, test, lint, and typecheck commands (`bun test`, `npm run build`). | Long narrative tutorials on how to install Node or Git. |
| **Architecture** | Key entry points, core directory boundaries, state management models. | Full 1,000-line source code dumps or redundant directory listings. |
| **Conventions** | Naming conventions, error-handling contracts, styling tokens, typing strictness. | Generic programming advice (e.g. *"Write clean code"*). |
| **Hard Invariants** | Zero secret leakage, mandatory test runs before commit, forbidden files. | Unenforceable or speculative stylistic preferences. |
| **Gotchas** | Non-obvious environmental gotchas, ESM/CJS quirks, tricky test mocks. | Ephemeral bug logs that were permanently resolved. |

---

## 3. Token Budget & Progressive Disclosure

- **Size Budget**: Root `AGENTS.md` / `CLAUDE.md` should ideally stay under **5KB** (hard maximum **10KB**).
- **Progressive Disclosure**: Keep root contracts lean with turn invariants and DOX routing rails that point to detailed standards in subdirectories (`.agents/standards/`, `docs/`) loaded only on-demand.
- **No README Duplication**: Do not copy marketing copy, badges, or user-facing onboarding text into agent context files.

---

## 4. Companion Skill Handoff (`updateagents`)

- **Ownership Boundary**: `updatedocs` audits and updates user-facing project documentation (README, changelog, architecture, APIs, contributing guides).
- **Agent Context Handoff**: If deep workspace memory synchronization or specialized agent instruction refactoring is needed and the **`updateagents`** skill is available, note a clean handoff recommendation in the report rather than creating conflicting duplicate edits.
