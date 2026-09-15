# Audit Mode Guidance

What an `audit` mode should contain, which skills get it, and what the rest get instead.

## When to add a full `audit` mode

Add `audit` as a first-class mode when the skill produces persistent artifacts that decay:

- Reports and documents (`updatedocs`, `dead-letter`)
- Routing and config tables (`secretary`, `coupling-router`)
- Knowledge bases and evidence stores (`evidence-ledger`)
- Design systems and style guides (`designscope`, `design`)

For these, "audit the thing I produce" is a first-class task — you can't use the skill without eventually needing to verify its output.

## When NOT to add an `audit` mode

Functional and operational skills (database, telegram, automation, devops, git) — "audit" is too vague to resolve to a single behavior. Give these narrow live-check modes instead:

- `database` → `verify-connection`
- `telegram` → `test-notification`
- `automation` → `dry-run`
- `devops` → `check-deploy`
- `git` → `audit-lease`

## What every `audit` mode must contain

Based on the existing `audit/` skill structure — reuse these five checkpoints:

1. **Link integrity** — dead markdown links, broken file paths, missing targets
2. **Orphaned artifacts** — files with zero incoming references
3. **Stale contradictions** — outdated versions, renamed skills, obsolete APIs
4. **Secret leakage** — hardcoded keys or tokens in output artifacts
5. **Frontmatter health** — invalid YAML, missing required keys

### Severity classes

| Severity | Default action |
|:---|:---|
| Critical Blocker (secrets, broken core navigation) | `PROPOSE-DIFF` or `AUTO-REPAIR` with logging |
| Warning (dead links, version drift) | `AUTO-REPAIR` with evidence |
| Notice (orphaned file, stale prose) | `REPORT-ONLY` or `DEFER-ROUTE` |

### Action classes

- `AUTO-REPAIR` — fix directly, log every edit with `file:line` evidence
- `PROPOSE-DIFF` — present minimal edit, apply only after user approval
- `REPORT-ONLY` — document finding with evidence and suggested owner
- `DEFER-ROUTE` — log to routing table for companion skill

### Operating tiers

| Tier | Scope | Checkpoints used |
|:---|:---|:---|
| Quick | One file or directory touched this session | 1, 4, 5 |
| Standard | Full skill output tree | All 5 |
| Deep | Standard + cross-repo references + orphan walk | All 5 + reachability |

### Routing table (reuse across audit modes)

| Finding | Route to |
|:---|:---|
| Broken refs inside shipped docs | `updatedocs` |
| Gaps in AGENTS.md or standards | `updateagents` |
| Unverifiable claims | `evidence-ledger` |
| Repeated defect class = broken upstream process | `dead-letter` |
| Repo-hygiene gaps (missing CI, templates) | `ai-ready` |
| Strategic contradictions | `periodic-retreat` |

## What non-audit skills get instead

A `## Verification` section at the bottom of SKILL.md — a checklist the agent runs at closeout:

1. Run the skill's primary command in dry-run mode (if available)
2. Verify output files exist and are non-empty
3. Spot-check 3 inputs against the output
4. If any check fails → report, don't silence

This gives every skill an auditable closeout without the token cost of a full audit mode.

## New audit mode template

```markdown
## Mode: audit

**Trigger**: "audit [skill name]", "verify [output]", "check [artifact]"

### Checklist

- [ ] Link integrity — all local paths resolve
- [ ] Orphan scan — every output referenced
- [ ] Version/identifier drift — grep for stale names
- [ ] Secret sweep — `sk-*`, `ghp_*`, tokens in output
- [ ] Frontmatter health — required keys present

### Output

One report at `.agents/artifacts/audit-<slug>-<timestamp>.md`:
- Findings table (severity, location, evidence)
- Action class per finding
- Routing line for deferred items
```
