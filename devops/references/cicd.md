# cicd — CI/CD: test → build → gate → deploy, with secrets and rollback.

## Intake

- Repo and target environment(s)
- Test/build/lint commands
- Deployment target and credentials model
- Required gates (tests, scans) before deploy

## Deliverable

A pipeline config: stages (install → lint → test → build → deploy) with caching, secrets via the CI secret store, environment protection for prod, and a deploy/rollback step.

## Procedure

1. Define stages in order: install → lint → test → build → deploy.
2. Add dependency/build caching for speed.
3. Store credentials in the CI secret store; never echo them.
4. Gate deployment on tests (and security scans via `code-review`) passing.
5. Protect the production environment (approvals/branch rules where warranted).
6. Make the deploy idempotent and the rollback a single step.
7. Fail the pipeline loudly; notify the owner on failure.

## Quality gate

- [ ] Stages ordered and cached.
- [ ] Secrets in the CI secret store only.
- [ ] Deploy gated on tests/scans.
- [ ] Production protected (approvals/rules).
- [ ] Rollback is one step.
- [ ] Failures notify the owner.

## Routing

- Failure loop: paste the CI error to the fixer, verify locally, repush; never skip a red gate (no rule-disable, no test-skip); a build-cop owns green main — fix or revert, never accumulate breakage.
- Speed + safety: cache deps → parallel jobs → path filters → matrix sharding → trim the critical path; every PR gets a preview deploy; flags live create→canary→rollout→remove with an owner and cleanup date.
- Pipeline troubleshooting: Argo Rollouts `inconclusiveLimit` (never hang on no-data metric), deep-readiness probes over `/ping`, additive-only migrations + versioned undo; env-protection reviewer gate, Docker manifest-first layer order. Source: `wshobson/agents` (`deployment-pipeline-design`).
- Shell discipline (CI/deploy scripts): `set -Eeuo pipefail`, quote-all, `[[`, trap+mktemp cleanup, dry-run flag, idempotent steps. Source: `wshobson/agents` (`bash-defensive-patterns`; near-miss fold into cicd/hosting).
- Gates + evidence: environment approval-gate snippet + Trivy/SARIF upload so scans block prod and findings stay queryable. Source: `wshobson/agents` (`github-actions-templates`; near-miss fold).
- Gate order + flag lifecycle: lint → type-check (tsc/doctest where the stack has them) → unit → build → integration → e2e → audit → bundlesize; flags carry owner + expiry, 2-week cleanup, test both states. Source: `addyosmani/agent-skills` (`ci-cd-and-automation`).

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
