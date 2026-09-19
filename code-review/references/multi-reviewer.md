# Multi-Reviewer Mode — parallel dimensions, dedup, calibration

> Sources: wshobson-agents-multi-reviewer-patterns (R2). A method, not a tool.
> Use when two or more independent review passes should run in parallel over
> the same diff, then collapse into ONE calibrated report.

## When to Use
- A change touches multiple quality dimensions (correctness, security, UI,
  performance, docs) and no single review pass should judge them together.
- The same findings keep appearing across passes and need deduplication.
- Severity is inconsistently rated across passes and needs a single calibration.

## Do NOT Use
- Single-dimension diffs (hotfix). One pass is enough.
- When reviewers should be biased toward agreement — independence is the point.

## Procedure

### 1. Spawn independent passes
Run N concurrent review passes, each scoped to ONE dimension:
- correctness / structure → `code-review` diff or audit mode
- security / OWASP → `code-review` security mode
- UI / component → `refactor-ui`
- accessibility → `refactor-ui` (WCAG 2.2) or accessibility lens
- performance → `web-perf` or platform profiler
- docs / intent → `intended-vs-implemented` mode

Each pass reports findings with its OWN severity, before cross-pass calibration.
**No-persona-spawns** (source: `addyosmani/agent-skills` agents rule): a pass never delegates to sub-reviewers — orchestration belongs to the caller.
**Mandatory-findings**: every lens must return at least one finding or finding-free
declaration with named satisfied principles — a pass that returns nothing and names
no principles hasn't looked. A lens earning no real finding names that explicitly
rather than padding.

### 2. Deduplicate
The same root cause reported by N passes is ONE finding, not N.
- Merge by **root cause**, not by surface phrasing. Two passes flagging "unchecked
  input reaches SQL" from different angles is one issue.
- Keep the most specific evidence snippet; drop the redundant rest.

### 3. Calibrate severity onto ONE scale
- Escalate when 2+ independent passes flag the same thing (independent
  corroboration raises confidence; **concurrence promotion**: two lenses agreeing on
  a finding promote its severity one rung — Nitpick → Request Changes, Request
  Changes → Reject).
- De-escalate a single pass's Reject if it rests on a false-positive-prone pattern
  and other passes saw no issue.
- Record the pre/post severity per merged finding so calibration is auditable.

### 4. Emit one consolidated report
Single verdict + ordered findings (calibrated severity) + dedup count.
Call out where independent passes disagreed and how the disagreement resolved.

### 5. Noise gate + weighed verdict → one `gh` review (source: `tech-leads-club-the-judge`)
- **Noise gate first**: drop findings with no demonstrating execution and
  low-confidence nits naming no defect — deterministically, before calibration.
- **Weighed verdict**: weigh the calibrated findings into one verdict —
  any Reject / Request-Changes → `REQUEST_CHANGES`; clean (3+ satisfied
  principles named) → `APPROVE`; discussion-only → `COMMENT`.
- **One consolidated post**: emit the report as a single
  `gh pr review <pr> --{approve|comment|request-changes}` with inline comments —
  never N separate reviews, one per pass.

## Output shape
```
# Consolidated review (N passes → 1 report)
## Verdict: <REJECT | REQUEST-CHANGES | APPROVE>
## Merged findings (n findings from n_raw passes)
each: evidence | original severities per pass | calibrated severity | resolution
## Disagreements resolved
## Per-dimension receipts (each pass's raw count, before dedup)
```