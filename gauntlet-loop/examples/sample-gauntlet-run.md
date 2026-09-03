# Sample Gauntlet Loop Run

## GAUNTLET_JOB_CONTRACT.md

```markdown
# Gauntlet Job Contract: Safe Memory Cache TTL Refactor

- **Goal**: Refactor cache eviction logic to support sliding TTLs without memory leaks.
- **Criteria**:
  - [x] Sliding expiration verified by unit tests.
  - [x] Eviction runs in O(1) time complexity.
  - [x] Concurrency tests pass with zero deadlocks.
- **Proof Commands**: `bun test tests/cache.test.ts`
- **Max Iterations**: 3
```

---

## ITERATION_LEDGER.md

```markdown
### Round 1
- **Candidate**: Implemented sliding expiration in `src/cache.ts`.
- **Automated Gate**: `bun test` passed (14/14 tests).
- **Critic Score**: 7.8 / 10.0
  - Correctness: 8.5 (sliding window works)
  - Minimal Diff: 7.0 (added unused debug helpers)
  - Edge Cases: 7.5 (missing negative TTL check)
  - Cleanliness: 8.0
- **Action**: Proceed to Round 2. Prompt: Remove unused helpers, validate negative TTL.

### Round 2
- **Candidate**: Removed debug helpers, added negative TTL guard.
- **Automated Gate**: `bun test` passed (16/16 tests).
- **Critic Score**: 9.4 / 10.0
  - Correctness: 9.8
  - Minimal Diff: 9.5
  - Edge Cases: 9.2
  - Cleanliness: 9.0
- **Action**: Score >= 9.0 -> TERMINATE (SUCCESS).
```

---

## ACCEPTANCE_PACKET.md

```markdown
# Acceptance Packet: Safe Memory Cache TTL Refactor

- **Verdict**: ACCEPTED (Round 2 Score: 9.4/10.0)
- **Rounds Executed**: 2 / 3
- **Receipts**: `bun test tests/cache.test.ts` exited 0 (16 tests passed).
- **Diff Summary**: +28 lines, -8 lines in `src/cache.ts`.
```
