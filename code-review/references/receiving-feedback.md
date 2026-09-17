# Receiving Feedback — rigor over compliance

Loaded by the `receive` mode: review feedback has arrived on your work and needs
acting on. The failure mode this lane exists for is **performative agreement** —
implementing feedback because it arrived, not because it is correct.

## Protocol

1. **Verify before implementing.** Check every piece of feedback against the actual
   code. Read the lines the reviewer cites; confirm the claimed behavior exists.
2. **Classify each item** into exactly one response:
   - **Implement** — verified correct; apply it (one commit per finding when more
     than one).
   - **Rebut** — verified wrong; answer with evidence (test output, spec reference,
     line citations), never with deference. A reviewer can be wrong; the code is the
     arbiter.
   - **Ask** — genuinely ambiguous; reply with one specific question, not a restate
     of the feedback.
3. **Risk-gate before applying.** Feedback touching authentication, payments,
   migrations, or public contracts gets investigation before application — never a
   blind edit, however senior the source. Blocking feedback that you decline needs a
   stated reason and, where the call is not yours to make, a named authority to
   override — you are the executor, not the approver, on blockers.
4. **Answer every comment.** Every piece of feedback is either fixed and verified or
   answered with a reasoned why-not (with evidence), before the thread closes. No
   silent partial application.
5. **Close the loop.** After applying, re-verify the original concern is actually
   addressed (not just the literal suggestion implemented) and report what was done
   per item.

## Default to Fix — don't churn

Default to fixing the feedback. Most review comments — nitpicks included — are
correct and worth fixing, so the baseline is compliance, not scrutiny. Diverge only
for a concrete, stated reason:

- The fix changes deliberately-chosen behavior (a documented decision, an intended
  trade-off).
- The fix is outside this change's scope (orthogonal work logged separately).
- The comment is factually wrong — read the actual code to confirm before rebutting.

Read the code to decide; do not churn pointlessly, but treat "I'll just recheck every
nit rather than fix it" as the default to reject.

## Convergence trajectory — one flag over a pile of nit-fixes

If the same root cause keeps being re-raised across review rounds (rounds ≥ 2 raised the
same underlying issue) and no escalation has been answered, stop fixing nit-by-nit.
Recurrence of the same root cause is the trigger — not a score plateau. Emit **one**
approach-level flag instead: the point of disagreement needs a human decision (product,
scope, or design call), and no amount of per-item fixes will resolve it. Escalate once,
clearly, and hold there until someone answers.

## Anti-patterns

- "Great catch!" followed by an unverified edit — sycophancy is not review.
- Silent partial application (implementing 3 of 5 items, mentioning none).
- Complying with mutually contradictory feedback instead of surfacing the conflict.
- Treating the review as an approval ritual to survive rather than a correctness
  instrument.
