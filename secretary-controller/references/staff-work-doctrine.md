# Completed Staff Work Doctrine & Hash Gate

## Principles of Completed Staff Work

1. **Staff officers do not ask what to do**: They work out all details, consult with stakeholders, and present a complete single action ready for signature or rejection.
2. **Dissent is an asset**: If two data sources disagree on performance or cost, list both explicitly. Never average or obscure discrepancies.
3. **Cryptographic Confirmation**: When recommending external writes or destructive migrations, the proposed script or diff is hashed via SHA-256. The principal approves the exact hash, preventing race conditions or drift.

## Hash Computation Protocol

```bash
# Compute SHA-256 for a multi-file diff or migration script
sha256sum < payload.patch | awk '{print $1}'
```
