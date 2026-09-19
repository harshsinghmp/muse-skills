# mitigate — Stop-the-bleeding playbooks per incident class: outage, breach, data-loss, perf-collapse.

Default stack: self-hosted status page + Docker logs + Cloudflare analytics (fallbacks: `git log --oneline -5` for last change, host metrics, CDN cache purge).

## Intake

- SEV + class hypothesis from `triage` (defaults: class = outage; proceed on hypothesis, correct mid-run)
- Last deploy/change window and rollback owner (default solo: rollback owner is you — confirm you can execute before attempting)

## Deliverable

Mitigation report: class, actions taken in order with timestamps, service state (restored / degraded / still down), handoff to root-cause work.

## Procedure

1. Mitigate before diagnosing — restore service first, ask why second. Pick the playbook by class:
   - **Outage:** freeze deploys → rollback last change → failover / restart → cache-static fallback → confirm health 200 on critical paths.
   - **Breach:** isolate affected host/keys (rotate credentials) → preserve logs forensically → block attacker vector at edge → confirm no active exfil before restoring.
   - **Data-loss:** stop writes to the affected store → snapshot current state → restore latest verified backup to a staging target first → verify row counts before promoting.
   - **Perf-collapse:** shed load (rate-limit, queue, static fallback) → scale horizontally → kill the top offender query/endpoint → confirm p95 back within 20% of baseline.
2. Timebox each step (default 10 min); if a step fails, escalate to the next playbook action, never retry the same fix twice.
3. Verify restoration with a user-path check, not a green dashboard — dashboard lies, checkout flow does not.
4. Hand off: root-cause fix → `webdev` / `devops`, proof the fix holds → `qa-launch` regression, stakeholder voice → `communicate`.

## Breach forensics + quarantine + creds playbook (enrich — source: `BagelHole/incident-response`)

- **6-phase order.** Detect → contain → eradicate → recover → lessons → harden.
  Never skip contain for eradicate speed.
- **Evidence kit (Linux).** Hash-chained collection script (sha256 manifest
  per artifact), memory capture before disk, AWS snapshot + CloudTrail export.
  Image first, inspect the copy.
- **Quarantine.** Isolate host via quarantine security group (deny-all except
  forensics collector), revoke sessions/keys at the edge. Confirm no active
  exfil before restoring.
- **Forensics command ref.** Disk (mount ro, image, hash), logs (auth/syslog/
  app windowed to blast radius), net (established conns, listening ports,
  DNS), malware (strings, hashes vs threat feeds).
- **Compromised-credentials playbook.** Rotate all exposed creds → revoke
  sessions/tokens → audit access logs for misuse window → re-issue with
  least privilege → confirm rotation in the report with timestamps.

## Quality gate

- [ ] Service state verified by a user-path check, timestamped.
- [ ] No step retried twice; every action logged with time and actor.
- [ ] Rollback/failover executed by a confirmed owner, reversible.
- [ ] Root-cause work routed, never started inline during SEV-1/2.

## Routing

- Infra mechanics (rollback, DNS, failover) → `devops`; code fix → `webdev` / `mobile`; DB restore verification → `postgres-perf-tuner` where applicable.
- Breach with legal exposure → flag to stakeholder immediately; this skill mitigates technically, it never gives legal advice.

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
