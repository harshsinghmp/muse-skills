# spec — Build-ready spec: problem/solution/stories/seams-first, gated per phase.

No code. Produces the packet `implement` consumes. Every phase ends at a human gate — no silent progression.

## Intake

- Problem statement (who hurts, what breaks, why now)
- Solution sketch and non-goals (explicit Out-of-scope line)
- ≤5 user stories with acceptance criteria
- External claims grounded: reference URLs fetched and cited, not asserted
- Requirement anchor: actual (not projected) scale, maintaining team size — if unanswerable, that is itself a finding

## Deliverable

A spec packet: Problem / Solution / User stories / Seams-first module split / Assumptions / Ready-for-agent label. Small enough that `implement` can execute it slice by slice without re-asking.

## Procedure

1. Write Problem first, one paragraph. If it needs two, the scope is two specs — split.
2. Write Solution + non-goals. Every non-goal is a scope rejection with a reason.
3. Write user stories (≤5), each with acceptance criteria testable later.
4. Split seams-first: name modules, interfaces, and seams using the deep-module vocabulary (Module / Interface / Seam / Adapter) — exact terms, no synonyms. One adapter hypothetical is enough; two real callers earn the abstraction.
5. Surface the Assumptions block: load, team capability, direction, unknowns. Unwritten assumptions are the spec's biggest defect — write them before the plan.
6. Apply the ready-for-agent label only when: stories are testable, seams are named, assumptions are written, external claims carry citations. Not ready → name what is missing, stop.
7. Human gate per phase: Problem → Solution → Stories → Seams → Label. Each gate needs an explicit yes; "whatever you think" is not a yes.

## Quality gate

- [ ] Problem fits one paragraph; non-goals listed with reasons.
- [ ] ≤5 stories, each with testable acceptance criteria.
- [ ] Seams named in deep-module terms; deletion test applied to every abstraction.
- [ ] Assumptions block written; external claims cited to fetched sources.
- [ ] Ready-for-agent label earned, or missing items named.
- [ ] Human gate passed at each phase.

## Routing

- Needs a technical unknown answered first → `prototype` (LOGIC), then return here.
- Spec consumed by → `implement` (vertical tracer slices, one story at a time).
- Done work ships through → `qa-launch` gate.
- Visual questions belong to → `design` prototype (sibling lane); reference it, never duplicate it here.

## Sources

pocock to-spec (Problem/Solution/stories/seams-first/ready-for-agent label; lane-d-abubakar.md:31); addyosmani spec-driven assumptions-first + human gate per phase (lane-h1-addyosmani-workflow.md #2); pocock codebase-design deep-module vocabulary + deletion test (lane-d-abubakar.md #4); buyer research grounding habit (cited primary sources win over defaults). When a cited source conflicts with a default above, the source wins — record the override and why.
