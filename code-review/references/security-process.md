# Security Lane — process methods (threat model · differential · fix verification)

Loaded by: the `security` mode, alongside the numbered control catalog in
`security-controls.md`. These three methods shape *how* the control pass runs
and how findings are cleared. They do not add controls — they add discipline.

## 1. Threat model before the vuln pass (#43)

Before enumerating controls, emit a concise Markdown threat model. This scopes
the pass to what actually matters and kills checklist-theatre. Cover:

- **Trust boundaries** — where untrusted input crosses into trusted code
  (process, network, tool, subagent, user-content surfaces).
- **Assets** — secrets, data stores, sessions, crypto keys, agent memory.
- **Attacker capabilities** — what the adversary controls (unauthenticated
  web input, a later compromised dependency, a malicious skill bundle, a
  local user) and their assumed reach.
- **Abuse paths** — the concrete ways a capability could reach an asset
  (SSRF to secret store, IDOR on tenant data, prompt injection to exfil).

### Threat-model chain (sources: `wshobson/agents` stride-analysis-patterns, attack-tree-construction, security-requirement-extraction, threat-mitigation-mapping)

Run the four legs in order; each leg feeds the next. A chain with a skipped leg
is checklist-theatre.

**Leg 1 — STRIDE matrix.** One row per category; each row names the question and
the control family it points at:

| Category | Question | Control family |
| :--- | :--- | :--- |
| **S**poofing | Can an actor pose as someone/something else? | Authentication |
| **T**ampering | Can data or code be modified in transit/at rest? | Integrity controls |
| **R**epudiation | Can an actor deny the action afterwards? | Logging / audit trail |
| **I**nformation disclosure | Can data leak to an unauthorized party? | Encryption / access scoping |
| **D**enial of service | Can the path be exhausted or flooded? | Rate limiting / quotas |
| **E**levation of privilege | Can a low-privilege actor gain higher rights? | Authorization |

**Leg 2 — Attack tree.** Decompose each abuse path into OR/AND/leaf nodes: OR
= any child suffices, AND = all children required, leaf = atomic attacker step.
Tag every leaf with cost, time, skill, and detectability attributes. Apply the
two rules: model the insider threat explicitly (a legitimate-access actor is
always one branch), and honor AND-dependencies (a finding that breaks one leg of
an AND-node downgrades the whole node — say so, don't re-flag each leg).

**Leg 3 — Requirement trace.** Bind each leaf to a Business → Security → Control
chain: the business requirement at risk, the security requirement it implies
(typed functional / non-functional / constraint), and the control that enforces
it. Every security requirement is testable with an acceptance criterion — an
untestable requirement is a note, not a requirement.

**Leg 4 — Mitigation map.** Place each control on the Preventive / Detective /
Corrective × Network / App / Data / Endpoint / Process grid. Prefer
defense-in-depth (two grid cells covering the same leaf beat one), and enforce
the no-threat-unmapped rule: every STRIDE row and every attack-tree leaf maps to
at least one control, or is recorded as an explicit accepted risk — never left
silent.

Then run the vuln pass against those paths. A finding that doesn't sit on a
named abuse path is re-examined; an abuse path with no control check is a gap.

## 2. Differential PR review (#46)

For a PR/diff (not a full module audit), scope the pass to the changed lines
and adapt depth to the change:

- **Blast radius** — count it, don't guess it: grep/`rg` callers of every
  changed exported symbol; a change to a widely-called function is deeper
  than its diff size implies.
- **Diff-scoped depth** — the *adapted* depth: a one-line auth check is
  reviewed as fiercely as a full module; a whitespace/rename diff gets a fast
  pass. Match scrutiny to aimed risk, not to diff size.
- **Git-blame context** — check who/why introduced the line; a security
  control silently edited inside a refactor is a regression risk even with
  green tests.
- **Test coverage of modified lines** — flag changed security paths that no
  test exercises; that gap is itself a finding.
- **Regression-reintroduction ledger** — if a last-known-security-findings
  ledger exists (repo `SECURITY.md`, `.agents` evidence ledger, etc.), diff
  the change against it: a fix being reverted/short-circuited is a Reject
  even if the new code is otherwise clean.

## 3. Fix verification pass (#45)

After remediation, re-scan the **changed code only**. Signal PASS for a
finding only when its exploit no longer reproduces under the original trigger
— not because the code "looks fixed". Attest per finding:

```
[SEC-03] FIXED — order fetch re-scoped to authenticated principal.
  Re-ran trigger (user A id→ resource B) → 403, no longer reproduces. PASS.
[SEC-07] STILL OPEN — logger still emits header; grep confirms no redaction.
```

A remediation that merely relocates the vuln (moved the risky call, added a
naming-based workaround) is still the same finding. Only reproduction-failure
clears it. Crossref with the `fix` mode (`fixing-findings.md`) for the
one-commit-per-finding discipline; this pass is the security-specific
verification half.