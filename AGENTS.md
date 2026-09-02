# Project Guidelines & Agent Instructions

<!-- musememory:start -->
## 🧠 Persistent Cognitive Memory (Muse Memory)

You are connected to **Muse Memory** via the `memory` MCP server.

### 🚀 Session Start & Task Lifecycle:
1. **Session Start / Context Loading**: At the start of a task or session, call `get_context(query=...)` to retrieve the active user profile (`USER.md`), active hard constraints (`CURRENT.md`), and top relevant past architecture decisions/bug fixes before answering or modifying code.
2. **Active Working Constraints**: When hard constraints, open loops, or project invariants are established or modified, immediately record them to `CURRENT.md` via `memory_capture(type="constraint")` or updating `CURRENT.md`.
3. **Learning Durable Knowledge**: Whenever you solve a non-trivial bug, make an architectural decision, discover an operational rule, or learn user preferences, immediately call `memory_capture` to persist it as an atomic memory unit.
4. **Verification & Supersession**: When replacing outdated patterns or obsolete rules, call `memory_supersede` to link the old memory to the new confirmed memory so future sessions never hallucinate deprecated methods.
<!-- musememory:end -->
