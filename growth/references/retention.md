# retention — Churn prevention and renewal: keep what you already won.

## Scope

- The post-onboarding customer lifecycle and where drop-off happens.
- Voluntary vs involuntary churn (cancel intent vs failed payment) — they need different plays.
- Renewal/subscription economics and the payback period.

## Deliverable

A retention plan: churn-risk segmentation, voluntary churn plays (cancel-flow, save-offers, win-back), involuntary churn plays (dunning, payment recovery), and a measurement loop on net retention.

## Procedure

1. Split churn by type: voluntary (customer chooses to leave) vs involuntary (payment/dunning) — different root causes, different plays.
2. Diagnose where value dies post-signup: onboarding → first value → habit → price mismatch; fix the value gap before the price.
3. Intercept voluntary churn at the cancel-flow: surface the save-offer only at the moment of genuine intent, sized to the real objection (never a bait-and-switch).
4. Recover involuntary churn with dunning: retry payment with the right cadence and messaging, and drop the card friction.
5. Run a win-back lane for departed customers with a reason-aware offer.
6. Measure net revenue retention and churn by segment, not headline churn — seasonality and cohort mix skew the headline number.

## Quality gate

- [ ] Voluntary vs involuntary churn separated with distinct plays.
- [ ] Value-gap diagnosed before price (the usual root cause).
- [ ] Save-offer sized to the real objection at the cancel moment.
- [ ] Dunning cadence/messaging defined for payment recovery.
- [ ] Measured on net retention by segment, not headline churn.

## Routing

- In-product cancel-flow / save-UI → `webdev` / `mobile`.
- Incentive economics → `pricing` / `referral` modes; billing infrastructure → `automation`.
- Cohort and retention reporting → `analytics`.

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.