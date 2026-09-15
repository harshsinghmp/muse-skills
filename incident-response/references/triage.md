# triage — Severity classification, escalation spine, first-15-minutes checklist.

Default stack: self-hosted status page + Docker logs + Cloudflare analytics (fallbacks: any uptime monitor, `docker logs --tail`, any traffic graph).

## Intake

- What is broken, who is affected, when it started (defaults: assume user-facing until proven otherwise; start time = first report minus 10 min, marked assumption)
- Blast radius estimate: % users, revenue paths, regions (default: worst plausible, narrow down with evidence)

## Deliverable

Triage sheet: SEV level, blast radius, incident commander, escalation spine, first-15-minutes checklist state, comms cadence.

## Procedure

1. Classify severity — SEV-1 (full outage / breach / data loss, all hands), SEV-2 (major degradation, core path broken), SEV-3 (partial, workaround exists), SEV-4 (cosmetic, track only). Default ambiguous → one level higher, state the assumption.
2. Name the incident commander (default: you) and the escalation spine: commander → tech lead → client stakeholder. Page SEV-1/2 immediately; SEV-3 async.
3. Run the first-15-minutes checklist: confirm blast radius, freeze deploys, open the incident channel/log, snapshot logs and metrics, start the comms clock.
4. Set the comms cadence now: SEV-1 every 15 min, SEV-2 every 30 min, SEV-3 hourly, SEV-4 async. Hand the clock to `communicate`.
5. Route to `mitigate` with severity + class hypothesis; record every assumption with a timestamp.

## Quality gate

- [ ] SEV stated with blast radius and start time (assumptions marked).
- [ ] Commander named, escalation spine paged per severity.
- [ ] Deploys frozen, evidence snapshotted before any fix.
- [ ] Comms cadence set and first update scheduled.

## Routing

- Stop the bleeding → `mitigate`; stakeholder voice → `communicate`; infra mechanics → `devops`.
- Downgrade only on evidence, never on hope; upgrade on new reports without debate.

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
