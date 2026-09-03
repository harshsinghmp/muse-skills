# Sample Routing Plan

```markdown
# Routing Plan: User Authentication & Profile Redesign

- **Overall Coupling Score**: `0.45` (Medium Coupling)
- **Selected Strategy**: `STAGED_PIPELINE`

---

## Execution DAG

```mermaid
flowchart TD
    Phase1[Phase 1 (Sequential): Database Schema & Shared Types]
    Phase1 --> Phase2a[Phase 2a (Parallel Subagent A): Auth Controller & Token API]
    Phase1 --> Phase2b[Phase 2b (Parallel Subagent B): Profile UI Components]
    Phase2a --> Phase3[Phase 3 (Sequential): End-to-End Integration Tests]
    Phase2b --> Phase3
```

---

## Phase Breakdown
1. **Phase 1 (Single Builder)**:
   - Target: `src/db/schema.ts`, `src/types/user.ts`
   - Gate: `bun test tests/schema.test.ts` passes.
2. **Phase 2 (Concurrent Fan-Out)**:
   - **Subagent A (Backend)**: `src/api/auth.ts`, `tests/api/auth.test.ts`
   - **Subagent B (Frontend)**: `src/components/ProfileCard.tsx`
3. **Phase 3 (Integrator)**:
   - Target: `tests/e2e/auth-flow.test.ts`
```
