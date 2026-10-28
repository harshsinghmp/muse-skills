# 🤖 GitHub Copilot Instructions

> Canonical Architecture: Single source of truth is codified in `./AGENTS.md` and `./.agents/standards/`.

## Core Guardrails
- **Negative Constraints**: Strictly follow anti-patterns in `.agents/standards/anti-patterns.md` (no speculative architecture, no silent mocks).
- **Stack Fence**: All dependencies must match allowlist in `.agents/context/stack.md`.
- **Modern Tool Primacy**: Use installed CLI tools explicitly by binary name (`rg`, `fd`, `bat`, `eza`).
- **Autonomous Orchestration**: On session start, follow Secretary Protocol in root `AGENTS.md`.
