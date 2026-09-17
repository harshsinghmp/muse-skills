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

## Static-API testability audit (source-level, tool-independent)

When QA must vouch that a defect is *fixable and re-verifiable*, run a static scan of the product code for coupling to ambient static APIs — not just run the built site. Language-agnostic, no tool mandated.

- Flag direct, unmocked couplings to ambient statics: wall-clock time (`Date.now`/`System.currentTimeMillis`, unseeded RNG), filesystem (`fs`/`FileIO`), environment (`process.env`/`os.LookupEnv`, secrets), network (fetch/HTTP/db clients), console/logger, and process (`exit`/`syscall`s).
- Rank by raw frequency (grep count per API class); exclude any that already route through an injected seam (constructor/param/DI wrapper, clock or IO interface) — those are testable and need no flag.
- For each ranked class, name the idiomatic, framework-free test double (fake clock / seeded RNG, temp-dir fixture, config injection, stub transport, captured logger/stdout) and where the seam should sit.
- Verdict: which critical paths are *blocking on testability* (they cannot be verified without first injecting a seam) vs merely coupled — gate those Block with the needed seam listed, route the seam to `webdev`.

Keeping coupling flags honest: flag the *residual ambient call sites*, never already-injected seams.

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
