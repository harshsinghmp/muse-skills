# Intended-vs-Implemented Mode — documentation-to-code drift

> Source: pm-skills-intended-vs-implemented (R14). A method, not a tool.
> Catches the class of bug generic scanners miss: no scanner has a model of
> intent. Use when auditing AI-built code, checking access control against
> documented permissions, or asking whether a codebase matches its own docs.

## When to Use
- Reviewing AI-generated code where "what it should do" was specified in a doc,
  spec, or issue, but the code may not match.
- Reviewing access control against documented permissions.
- Any review where a divergence between intent and implementation is more likely
  than a generic code smell.

## Do NOT Use
- When there is no documented intent (nothing to check against).
- For generic code review with no spec/docs in scope.

## What counts as documented intent
- Specs, issues, tickets, README claims, docstrings that state behavior,
  architecture docs, permission matrices, acceptance criteria.
- NOT: a TODO, a vague aspiration, or prose with no verifiable claim.

## What counts as implementation evidence
- Executable proof: code path, test, config, a visible effect that demonstrates
  the behavior. A comment claiming something does X is NOT evidence it does.

## Which mismatches matter
- Behavior missing entirely (intent says X, no code path for X).
- Behavior wrong (code does Y, docs say X).
- Over-claiming (docs/AI claims robust handling, code silently swallows errors).
- Access-control drift (permissions doc says group A only; code allows more).
- Over-built (code implements more than intent, dead speculative branches).

## How to avoid hand-wavy findings
Every finding must bind a specific intent claim to a specific evidence gap:
```
INTENT: <cite exact doc/spec line + the claim>
EVIDENCE GAP: <what the code would need to do, what it actually does, file:line>
MISMATCH CLASS: missing | wrong | over-claim | access-drift | over-built
SEVERITY: calibrated by blast radius of the mismatch, not its discoverability
```
If you cannot cite a concrete intent claim, it is NOT a finding — flag it as an
open question instead.

## Output shape
```
# Intended-vs-Implemented Review
## Requirements traced → evidence or explicit mismatch
| intent (cited) | evidence (file:line) | class | severity |
## Open questions (intent claims found but no code path to bind)
## Verdict
```