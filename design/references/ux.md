# ux — UX structure: flows, information architecture, journey maps, friction audits.

## Intake

- Users, jobs-to-be-done, entry points (ads, organic, direct)
- Current IA or site map if one exists
- Analytics/heatmaps or known friction points
- Business constraints (what can't change)

## Deliverable

Flow diagrams (entry → steps → decision points → exits including error paths), a sitemap/IA with labels in user language, a journey map with friction flags, and a prioritized friction-fix list.

## Procedure

1. List user segments and each one's job-to-be-done.
2. Map each critical flow: entry, steps, decisions, exits — include error and abandonment paths.
3. Derive the IA: group by user mental model, label in their words, not internal jargon.
4. Overlay the journey: actions, thoughts, emotions, obstacles per stage.
5. Run a heuristic pass (findability, feedback, consistency, error recovery, cognitive load).
6. Proof-gate every finding before reporting: Contract (which binding rule it breaks) + Runtime (it reaches a real rendered surface, not a hypothetical) + Correction (one deterministic change fixes it). Candidates without all three are notes, not findings — report at most 3, prioritized; anything unrun is marked Not verified, never implied.
7. For agentic/memory features: design trust in three stages — transparent (show reasoning) → selective (explain only uncertain calls) → autonomous (act with undo path). Ship memory visualization plus forgetting controls; measure relationship quality (delegation comfort, Month-6 vs Month-1 outcomes), not session clicks.
7. Rank friction fixes by impact ÷ effort; hand the top ones to `wireframe` or `ui`. Report one row per root cause: Severity / Location / Before / After / Why.
8. Validate the IA before building navigation: open card sort for new structures, closed sort to validate; tree-test the draft. Hold findability (any item ≤3 clicks), scent (labels predict contents), and depth (≤3 levels for primary content).
9. Run a competitive teardown that matters (direct + indirect + one aspirational rival): per key task record support level, steps required, and UX quality 1–5; separate table-stakes patterns from unaddressed gaps and feed the gaps into the friction-fix list.

## Quality gate

- [ ] Every flow has entry, exit, and error paths — no happy-path-only maps.
- [ ] Labels validated against user language, not company jargon.
- [ ] Step count minimized — every step justified or deleted.
- [ ] Keyboard/no-mouse path exists for every interaction.
- [ ] Each friction finding names where it was observed.
- [ ] IA tree-tested with users before navigation is built; competitive gaps traced to fixes.
- [ ] Pit-of-success defaults (keeper: trailofbits/sharp-edges): the safe choice is the default or only option; "it's documented" rejected as a defense; dangerous combinations validated/rejected, not merely warned.
- [ ] Controls name their action; errors name the problem and the recovery (keeper: pbakaus/impeccable).
- [ ] Empty and first-use states orient toward the aha moment, never blank slates (keeper: pbakaus/impeccable).
- [ ] Screen-reader pass: landmarks/headings announced, images named, state changes announced (keeper: wshobson/accessibility-compliance).

## Routing

- Ready to structure → `wireframe`, then `ui`; data-shape questions → `analytics` (reporting mode).

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
