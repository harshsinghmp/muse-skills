# backend — Backend: APIs, schemas, auth, and integrations with the project's stack.

## Intake

- API consumers and their needs (who calls this?)
- Data model and access patterns
- Auth/permission model (who may do what)
- Existing backend conventions in the repo

## Deliverable

Working API endpoints / schema changes with validation at boundaries, auth enforcement, error contracts, and tests exercising the real paths.

## Procedure

1. Model the data first: schema, constraints (DB-level, not just app-level), indexes for the real query patterns. Start with the simplest store that works; upgrade only on measured triggers (e.g. >10 concurrent writers, >100GB data, or genuine PostGIS/full-text need) — never on projected scale.
2. Design the API shape: resources, verbs, status codes; validate ALL input at the boundary.
3. AuthZ: check permission at the resource level, not just the route level.
4. Write the happy path, then the failure paths (validation, not-found, forbidden, conflict).
5. Tests against the real DB/emulator where feasible — not only mocks.
6. Run the verification gate; document the endpoint contract (request/response shapes).

## Quality gate

- [ ] Input validated at the boundary (schema or equivalent).
- [ ] DB constraints back the app-level rules.
- [ ] AuthZ enforced per resource, not per route.
- [ ] Failure paths return proper status codes and safe errors (no internals leaked) — worded for non-technical callers (what happened, why, what to do).
- [ ] Tests exercise real paths.

## Routing

- Bounded reads: paginate every list endpoint (page/pageSize + totals); join/include instead of N+1 loops; treat third-party responses as untrusted and validate at the boundary.
- Idempotency: key from client/intent (never a per-attempt UUID/timestamp); claim via unique constraint (check-then-act is a race); reject same-key-different-payload loudly; record intent before side effects (timeout = unknown, not failure); retention outlives the longest retry chain including DLQ replays.
- Types: discriminated unions for variants, branded IDs, separate input/output shapes; extend by addition (optional fields) never modification; breaking changes route to `webdev` migrations (expand→contract).

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
