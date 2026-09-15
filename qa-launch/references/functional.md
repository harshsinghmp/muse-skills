# functional — Critical-path verification with pass/fail evidence.

## Intake

- Critical paths (signup, checkout, contact — max 5, ranked by revenue impact)
- Coverage matrix from `matrix` (or define inline for small sites)
- Staging URL + test credentials

## Deliverable

Pass/fail table per path: Path / Step / Expected / Observed / Evidence / Verdict, plus a findings list routed to owners.

## Procedure

1. Walk each critical path end to end on the P0 matrix; record observed vs expected per step.
2. Every fail gets evidence (screenshot/step/URL) and an owner (`webdev`, `mobile`, `design`, `content`).
3. Proof-gate each finding: Contract (which requirement it breaks) + Runtime (reproducible on the matrix) + Correction (one deterministic fix). Candidates without all three are notes.
4. Report at most the top failures first; unrun paths marked Not verified, never implied pass.

## Quality gate

- [ ] All P0 paths walked, none assumed.
- [ ] Every fail has evidence + owner.
- [ ] Unrun paths explicitly marked Not verified.
- [ ] Every data screen covers four states: loading, error, empty (resolved zero items), content — loading ≠ empty.
- [ ] Refetch keeps stale content with nonblocking error + retry (no full-screen spinner blink on revalidate); empty states explain why + offer the next action.
- [ ] Spec compliance sampled (keeper: trailofbits/spec-to-code-compliance): each client-approved requirement verdict — implemented / partial / contradicted / absent; partial (passes tested paths, fails untested ones) treated as HIGH.
- [ ] Hardening pass: extreme inputs (long/empty/RTL/emoji text, huge lists), API/network failure states, i18n expansion covered (keeper: pbakaus/impeccable).

## Routing

- Visual/aesthetic fails → `refactor-ui`; copy fails → `content`; code fixes → `webdev`/`mobile`; re-verify via `regression`.
- Debug loop: stop-the-line (preserve evidence, no new features) → reproduce → localize (bisect regressions to the commit) → reduce to the minimal case → fix root cause, not symptom → guard with a failing-first test.
- Browser triage: reproduce → inspect (console/DOM/network/styles/a11y tree) → diagnose → fix → verify with before/after screenshots and a clean console; network read: 4xx = wrong client data/URL, 5xx = server logs, timeout = payload/time, missing request = code never sent it.
- Reconnaissance-then-action: wait for networkidle before inspecting DOM/selectors (never inspect a loading page); triage static (file-servable) vs dynamic (server-first) before scripting.

## Live-browser walk (optional — dev-browser CLI, new tool, never assumed)

Reuse: this mode demands per-step evidence on a reproducible runtime; named persistent pages + ARIA snapshots produce exactly that.

- [ ] One named page per critical path (`getPage("<path>")`); no parallel calls against the same page.
- [ ] `goto` → `waitForLoad` (default wait is domcontentloaded only) → `snapshot({ interactive: true })`; re-snapshot after every navigation (refs reset).
- [ ] `waitForSelector` before every `click` (click never waits); end script lines with semicolons.
- [ ] Record headless vs headed profile with the evidence (separate Chromes/profiles).
- [ ] Every fail ships screenshot + URL + ref path as evidence.

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
