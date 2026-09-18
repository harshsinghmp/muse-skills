# fullstack — Fullstack: full features data-to-UI with the verification gate.

## Intake

- Feature spec and acceptance criteria
- Data model impact
- UI expectations (spec or wireframe)
- Rollout constraints (feature flag? gradual?)
- Requirement anchor: who uses this, ≤5 core stories, actual (not projected) scale, maintaining team size — if unanswerable, that is itself a finding.

## Deliverable

A working end-to-end feature: schema, API, UI, states, and tests; verification gate green; PR-ready diff.

## Procedure

1. Split the feature into data → API → UI slices; build in that order. Surface unwritten assumptions first (load, team capability, direction) and justify every abstraction with the deletion test — if nobody would notice its removal, it ships deleted; one implementation behind an interface is indirection, not abstraction.
2. Data first (backend mode procedure), then API, then UI (frontend mode procedure).
3. Add the state matrix: every screen × loading/empty/error/success.
4. Write the acceptance criteria as tests before polish.
5. Run the full verification gate.
6. Route the diff through `code-review` before the PR.

## Quality gate

- [ ] Slices built and verified in order.
- [ ] State matrix complete.
- [ ] Acceptance criteria exist as tests.
- [ ] Verification gate green.
- [ ] `code-review` run on the diff.

## Routing

- Test-authoring (e2e): pyramid (few E2E on critical paths only), `data-testid`/role selectors over CSS, page-objects, `test.step` reporting, headed/debug/trace triage, no fixed-timeout waits. Source: `wshobson/agents` (`e2e-testing-patterns`).
- Test-authoring (pytest): AAA shape, `test_<unit>_<input>_<expect>` names, retry-behavior via mock side_effect (transient-retry / permanent-no-retry), freezegun time-travel, markers (slow/integration/skipif/xfail), `--cov-fail-under` floor. Source: `wshobson/agents` (`python-testing-patterns`).
- Temporal workflow tests + bats shell-test leg gated — adopt only if the project uses Temporal / shell-hook testing needs it; else skip (roadmap §4).

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
