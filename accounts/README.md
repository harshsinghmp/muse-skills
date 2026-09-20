# accounts

Agency and client financial operations engine: milestone invoicing, recurring retainer billing, Chart of Accounts bookkeeping, client profitability and P&L modeling, cash flow runway forecasting, and cross-border digital tax compliance — routed through six modes.

## Modes

- `invoicing`: Milestone billing, retainer schedules, deposit terms, payment gateway links, and dunning cadence.
- `bookkeeping`: Standard agency & client Chart of Accounts (COA), double-entry ledger classification, and subscription audits.
- `client-pnl`: True client & project gross margin calculation, scope-creep margin leakage detection, and Effective Hourly Rate (EHR).
- `cashflow`: Bootstrapped CFO cash forecasting, Days Sales Outstanding (DSO) compression, and operating reserve buffers.
- `tax-compliance`: Cross-border digital services tax rules (GST/VAT zero-rating, reverse charge), invoice requirements, and contractor compliance.
- `audit`: Comprehensive financial hygiene audit detecting zombie subscriptions, unbilled deliverables, and gateway drag.

## Installation & Usage

```bash
# Run with npx skills
npx skills run harshsinghmp/muse-skills/accounts -- invoicing "Send milestone 2 invoice to Acme Corp"
```
