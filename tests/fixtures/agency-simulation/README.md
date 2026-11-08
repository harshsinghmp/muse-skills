# Multi-client agency simulation fixtures

Three end-to-end client engagements used by `tests/agency-simulation-workflows.test.ts`.
Each fixture is a DAG plan whose tasks name a real shipped skill and mode, so the
harness fails if a scenario references routing that does not exist.

| Fixture | Profile | Client | Shape |
| --- | --- | --- | --- |
| `ecommerce.json` | E-commerce | Northwind Supply Co. | Brand → design/copy → funnel (critical seam) → ads/analytics → QA → handover → invoicing |
| `b2b-saas.json` | B2B SaaS | Helios Analytics | Research → brief → wireframe → rebuild (critical seam) → migration → SAST (critical seam) → QA → status → pricing |
| `productized-agency.json` | Turnkey productized agency | Beacon Studio | Onboarding → intake → positioning (critical seam) → content → social/analytics → check-in → P&L |

## Schema

```jsonc
{
  "scenarioId": "unique-id",
  "client": "Client name used for billing attribution",
  "profile": "Human-readable engagement type",
  "billing": { "model": "token-ledger model key", "inputTokens": 0, "outputTokens": 0 },
  "planId": "swarm plan id",
  "maxTokenCeiling": 0,
  "requiredQuorum": 3,
  "tasks": [{
    "id": "unique task id",
    "name": "short description",
    "skill": "skill name from skills.json",
    "mode": "references/<mode>.md basename",
    "assignedDivision": "Sol | Jasper | Crew | Nexus",
    "dependsOn": ["upstream task id"],
    "estimatedTokens": 0,
    "criticalSeam": true
  }]
}
```

`skill` and `mode` are metadata for cross-department validation; the swarm
dispatcher consumes the standard `SwarmTask` fields. Every dependency must
resolve inside the same plan, and the DAG must be acyclic.

## What the harness proves

- Every task's skill/mode exists in the shipped tree.
- Waves are topological and every dependency runs before its dependent.
- A rejected critical seam fails consensus and prunes downstream dependents.
- The token ceiling halts dispatch instead of overspending.
- Concurrent worktree leases acquire, defer, hold, release, and take over stale leases.
- Each client produces a compute receipt with positive margin through `token-ledger`.
