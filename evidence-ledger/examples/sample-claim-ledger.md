# Sample Claim Ledger

```markdown
# Claim Ledger: SQLite Vector Search Architecture Brief

| ID | Statement | Tier | Verification Receipt / Path | Status |
| :--- | :--- | :--- | :--- | :--- |
| **CLM-01** | "Vector index queries execute under 15ms p99 at 100k items." | `[RAW]` | `bun test tests/perf.test.ts` (Measured: 12.4ms p99) | `VERIFIED` |
| **CLM-02** | "SQLite supports virtual table extensions via `sqlite3_create_module`." | `[FETCH]` | https://www.sqlite.org/c3ref/create_module.html | `VERIFIED` |
| **CLM-03** | "HNSW graph search uses less RAM than brute force IVF flat index." | `[INFER]` | Premise: HNSW prunes edges; IVF requires full vector scan in memory. | `VERIFIED` |
| **CLM-04** | "Adopting this reduces AWS infrastructure bill by 60%." | `[UNVERIFIED]` | No historical billing model or simulation data provided. | `REDACTED` |
```
