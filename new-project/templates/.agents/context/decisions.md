# 🔒 Durable Architectural Decisions

> **Invariant**: Decisions documented here are locked. Do not reopen or refactor without explicit authorization.

---

## Decision Record

### ADR-001: Progressive Disclosure for Agent Context
- **Context**: Monolithic `AGENTS.md` loaded excessive tokens and suffered from context drift.
- **Decision**: Split rules into lean root `AGENTS.md` with modular standards in `./.agents/standards/` and context maps in `./.agents/context/`.
- **Status**: Accepted & Implemented.

### ADR-002: Zero Absolute Path Coupling
- **Context**: Hardcoded paths break when repositories are cloned, moved, or renamed.
- **Decision**: All intra-repo links and tool references must be relative (`./`).
- **Status**: Accepted & Implemented.

### ADR-003: Agent File Containment
- **Context**: Agents previously created scattered dot-directories in the root workspace (`.jez`, `.crush`, etc.).
- **Decision**: All agent outputs, research, artifacts, plans, and goals live strictly within `./.agents/*`.
- **Status**: Accepted & Implemented.
