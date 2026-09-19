# Gauntlet Loop Protocol Reference

## Scoring Rubric (0.0 – 10.0 Scale)

The Fresh Critic calculates round scores using this weighted formula:

$$S_{\text{total}} = 0.40 \cdot S_{\text{correctness}} + 0.25 \cdot S_{\text{minimal\_diff}} + 0.20 \cdot S_{\text{edge\_cases}} + 0.15 \cdot S_{\text{cleanliness}}$$

1. **Correctness & Invariants (40%)**:
   - 10: Zero logic errors, API breaks, or race conditions.
   - 5: Functional but contains subtle boundary edge case.
   - 0: Automated tests fail or core invariant broken.

2. **Minimal Diff Discipline (25%)**:
   - 10: Exactly the lines needed to fix the defect; zero collateral refactoring.
   - 5: Includes minor unrelated formatting or renaming.
   - 0: Massive rewrite or unrelated architectural shift.

3. **Edge-Case Coverage (20%)**:
   - 10: Negative paths, null bounds, timeouts, and overflow conditions explicitly handled.
   - 5: Happy path and one error branch covered.
   - 0: Only happy path handled.

4. **Architectural Cleanliness (15%)**:
    - 10: Follows existing repo idioms and patterns.
    - 5: Introduces slightly redundant helper.
    - 0: Violates project structure or adds unnecessary framework dependency.

## Critic Rules (superpowers/systematic-debugging S5)

- **Root-cause-before-fix**: no fix scores above 5 on Correctness without a named root cause (Symptom→Source chain). Symptom-only patches are rejected feedback, not progress.
- **3-failed-fixes → question architecture**: three rounds failing on the same root cause stops the fix loop — the critic escalates to an architecture question instead of requesting another same-shape fix. Record the escalation in `ITERATION_LEDGER.md`.

## Judge Pattern (paired-judge + ratchet)

(sources: `alchaincyf/darwin-skill` judge/ratchet legs + `bjgreenberg/senior-engineering-partner` `evals/` + `references/skill-self-improvement.md` — judge pattern only, MIT/Apache-2.0; single-supplier ENRICH, no optimizer CREATE)

- **Paired same-judge**: when two candidates compete, score both with the *same* judge and prompt — absolute scores are triage-only (which advances), never proof of quality; odd-N majority settles disagreements.
- **Keep/revert ratchet**: every accepted round is a git checkpoint; a regressing round reverts to the previous checkpoint instead of patching forward — the bar only ratchets up, never drifts down to meet the candidate.
- **Evals regression suite**: persist real misses as replayable scenarios; re-run the suite per round with an LLM-judge plus per-model baselines so a fixed defect stays fixed. Self-improvement of the loop itself stays consent-gated and ledger-recorded — never silent.
