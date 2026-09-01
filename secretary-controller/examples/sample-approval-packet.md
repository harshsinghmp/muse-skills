# Sample Approval Packet

```markdown
# Approval Packet: Production Redis Migration to Valkey 8.0

- **State**: `NEEDS_APPROVAL`
- **Timestamp**: `2026-09-01T14:30:00Z`
- **Originating Agent**: `secretary-controller`

---

## 1. Recommendation Summary
Migrate secondary read-replica cluster from Redis 7.2 to Valkey 8.0 to reduce licensing overhead and achieve a measured 18% p99 latency reduction.

---

## 2. Preserved Dissent & Unknowns
- **Contradiction**: Benchmark on single-node showed 18% improvement, but multi-AZ cluster benchmark data is `[NO-DATA]`.
- **Known Risk**: Fallback rollback script requires 4 minutes of read-only mode if failover triggers.

---

## 3. Payload Manifest & Hash
- **Payload Target**: `scripts/migrate-valkey.sh` (+42 lines)
- **Payload SHA-256**: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

---

## 4. Action Required
To execute this migration script, reply with:
`APPROVE:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
```
