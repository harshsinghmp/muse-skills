# 🧠 Memory & Project State Policy

Standards for synchronizing persistent cognitive memory stores, state files (`STATE.md`, `CURRENT.md`, `.agents/context/current.md`), and rolling change ledgers (`SUMMARY.md`).

---

## 1. Durable Memory vs. Ephemeral Session Noise

Project memory preserves context across disparate agent conversations and developer sessions. It must contain only **durable, verified facts**.

```
[Raw Tool Output / Stack Trace]
          │
          ▼
 [Ephemeral Hypothesis] ──► (Discard upon task resolution)
          │
          ▼
 [Verified Finding / Permanent Rule] ──► Write to .memory/ / current.md
```

### ✅ What Qualifies for Durable Memory:
- **Verified Capabilities**: Features tested and proven working with concrete receipts.
- **Hard Active Constraints**: Project invariants, forbidden files, strictly required flags.
- **Architectural Decision Outcomes**: Approved decisions that govern ongoing work.
- **Durable Environmental Gotchas**: Non-obvious quirks (e.g. *"Native module requires Node 20+"*).
- **Migration & Schema State**: Currently active database schema version and in-flight migrations.

### ❌ What Must NEVER Be Put into Memory:
- Raw terminal logs, compiler stack traces, or entire file contents.
- Temporary debugging ideas or refuted hypotheses.
- Unverified assumptions about future user intent.
- Transient task checklists that expire with the current turn.

---

## 2. Standard State Files & Schemas

### 1. `CURRENT.md` / `.agents/context/current.md` (Active Reality State)
Maintains the immediate ground truth:
```markdown
# 📍 Current Shipped State & Reality Gate

- **Phase**: STABLE | IN_DEVELOPMENT | REFACTORING
- **Last Verified**: YYYY-MM-DD

## 1. Verified Capabilities
- [x] Feature A (Passed Playwright probe 2026-09-01)
- [x] Endpoint B (HTTP 200 verified)

## 2. Active Focus & Open Constraints
- [ ] Task C: In-progress
- Invariant: Zero secret exposure server-side execution.
```

### 2. `SUMMARY.md` / `SESSION_LOG.md` (Change Ledger)
Maintains a reverse-chronological rolling ledger of verified session changes:
```markdown
## [YYYY-MM-DD] - <Task Name>
- **Author**: <Agent / Contributor>
- **Changes**:
  - Implemented X in `src/api/`.
  - Added test suite in `tests/`.
  - Updated API docs in `docs/api/`.
- **Verification**: `bun test` passed (24 tests, 0 failures).
```
