# Simplify Mode — behavior-preserving simplification, not refactor

> Addy Osmani's "Rule of 500": if you can't explain a piece of code in roughly a
> paragraph (or the change doesn't fit on ~500 lines of mental model), it is too
> complex to hold in your head. Loaded by the `simplify` mode, scoped to
> **recently-changed code only**.

## Scope discipline

- Only simplify code that this changeset (or the recent work at hand) introduced or
  touched. Stable, working code outside the change is off-limits — simplifying it is
  an unrelated refactor, not a review.
- Behavior-preserving: the simplified form must produce identical observable results.
  If a simplification changes behavior, it is a fix and belongs in a review finding,
  not a silent rewrite.

## The pass (per function / module)

1. Read the change and restate, in one short paragraph, what it does.
2. If you cannot, the cognitive burden is the finding — name the concrete lines that
   overflow the model (`location / what's hard to hold / the simpler shape`).
3. Ask "does every branch earn its existence?" — special-cases, flags, and
   single-use wrappers that the representation could absorb are simplification
   candidates (aligns with Theme 5 / Theme 10).
4. Offer the simpler representation as a concrete diff, explicitly marked
   behavior-preserving. If you cannot produce one, hold the suggestion as a
   Discussion item rather than a forced rewrite.

## Output

```
SIMPLIFY — <scope>
Per item: location / current complexity / proposed simpler shape (behavior-preserving)
Scope: restricted to <changed files> — stable code untouched
```