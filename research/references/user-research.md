# user-research — Method-matched user research on a client's product.

## Scope

- The decision the research serves (fix, validate, prioritize, name, segment).
- The product/audience and the gap that triggered it.
- Constraints: budget, timeline, access to users, NDA.
- Default stack: screener + calls/notes via any meeting/note tool; surveys via a free form tool; synthesis in a shared doc. Solo operator: same, one practitioner owns the study end-to-end.

## Method selection

Match the method to the goal — never default to interviews:

| Question | Method |
|:---|:---|
| Exploratory ("what should we build / how do they think") | Generative interviews, diary study |
| Evaluative ("does this flow work") | Usability test, task-based think-aloud |
| Validation ("did the change help") | Survey, A/B readout (route to analytics for the A/B harness) |
| Segmentation ("who are the clusters") | JTBD-interviews + clustering |

State your sample and saturation plan up front. Use the shared `sample-size` script (scripts/sample-size.ts) for quantitative power/sample sizing; for qualitative, target saturation (code until new interviews stop adding themes), and say your stopping rule.

## Gather

1. Recruit a representative sample from real or proxy users of the client's product.
2. Run the chosen method with a written guide; one decision per interview.
3. Capture verbatim + the participant's own words for what they did and why (not the moderator's paraphrase).

## Synthesize

1. Code observations into themes.
2. Gate each insight on recurrence: a theme is an insight only if it recurs across independent participants; a single quote is an anecdote, not a finding.
3. Produce: findings (with participant-count per theme), user needs/pain points, and prioritized recommendations tied to the stated decision.

## Quality gate

- [ ] Decision stated and served.
- [ ] Method matches the question.
- [ ] Sample/saturation plan stated before running.
- [ ] Insights gated on cross-participant recurrence.
- [ ] Quotations verbatim; claims cited to participants or sources.
- [ ] Recommendations prioritized and linked to the decision.

## Routing

- Larger quant read-outs → `analytics` (cro/experimentation harness).
- Personas/journeys turned into content → `content`.
- Findings logged → `evidence-ledger`.

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.