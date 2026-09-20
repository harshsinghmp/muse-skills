# bookkeeping — Chart of Accounts, double-entry classification, and monthly closing.

## Scope

- Double-entry ledger management and Chart of Accounts (COA) tailored for software development and creative agencies.
- Distinction between Direct Project Costs (COGS) and General Overhead (OPEX).
- Monthly close checklist, transaction reconciliation, and receipt audit trails.

## Deliverable

A standardized Chart of Accounts taxonomy, double-entry journal schemas, and a 5-step monthly financial closing checklist.

## Procedure

1. **Agency Standard Chart of Accounts (COA)**:
   - `1000–1999 Assets`:
     - `1010` Primary Operating Checking (Operating Capital).
     - `1020` Tax Reserve Savings (Locked sub-account, 20-25% of net revenues).
     - `1030` Payment Gateway Clearing (Stripe/Razorpay/Wise unsettled funds).
     - `1100` Accounts Receivable (Invoiced client amounts awaiting payment).
   - `2000–2999 Liabilities`:
     - `2010` Accounts Payable (Pending contractor invoices, vendor bills).
     - `2020` Deferred Revenue (Unearned client upfront deposits awaiting milestone completion).
     - `2030` Sales Tax / GST / VAT Payable (Collected taxes held in trust).
   - `3000–3999 Equity`:
     - `3010` Principal / Partner Contributed Capital.
     - `3020` Retained Earnings (Compounded profits).
     - `3030` Principal Draws / Distributions.
   - `4000–4999 Revenue`:
     - `4010` Custom Web & Software Engineering Revenue.
     - `4020` Ongoing Retainers & Maintenance Revenue.
     - `4030` Strategic Advisory & Growth Consulting.
   - `5000–5999 Direct Cost of Goods Sold (COGS)`:
     - `5010` Subcontractor & Specialist Contractor Delivery Fees.
     - `5020` Dedicated Client Cloud & API Infrastructure (OpenAI tokens, Vercel team seats allocated to projects).
     - `5030` Merchant Payment Processing Fees (Stripe 2.9% + $0.30, Wise FX spread).
   - `6000–6999 Operating Expenses (OPEX)`:
     - `6010` Core Agency Software Subscriptions (Figma, GitHub, Linear, Google Workspace).
     - `6020` Legal, Accounting & Professional Fees.
     - `6030` Agency Growth, Brand & Paid Acquisition.
     - `6040` Bank Fees & General Administration.

2. **Core Double-Entry Transactions**:
   - *Client Pays 50% Deposit ($10,000)*:
     - `DEBIT` 1010 Operating Cash: +$10,000
     - `CREDIT` 2020 Deferred Revenue: +$10,000 *(Never recognize revenue before work is delivered)*.
   - *Milestone Delivered & Approved by Client*:
     - `DEBIT` 2020 Deferred Revenue: -$10,000
     - `CREDIT` 4010 Custom Engineering Revenue: +$10,000 *(Earned revenue recognized)*.
   - *Subcontractor Developer Bills Agency for Milestone ($3,000)*:
     - `DEBIT` 5010 Subcontractor Fees (COGS): +$3,000
     - `CREDIT` 2010 Accounts Payable: +$3,000.

3. **5-Step Monthly Financial Close Protocol**:
   - **Step 1 (Gateway Zero-Out)**: Reconcile Stripe/Razorpay payouts against bank deposits; match gateway fees directly to account `5030`.
   - **Step 2 (AR Aging Audit)**: Verify open Accounts Receivable (`1100`); trigger dunning for anything >14 days past due.
   - **Step 3 (Deferred Revenue True-Up)**: Shift completed project deposits from `2020 Deferred Revenue` to `4000 Revenue`.
   - **Step 4 (Contractor Payouts)**: Settle approved AP (`2010`) and log corresponding tax reporting files (W-9/W-8BEN).
   - **Step 5 (Tax Reserve Lock)**: Calculate month's Net Operating Profit and sweep 20–25% from `1010 Operating Cash` into `1020 Tax Reserve`.

## Quality gate

- [ ] All direct delivery costs (contractors, project APIs, payment fees) classified under COGS (`5000`), not OPEX (`6000`).
- [ ] Upfront deposits held in Deferred Revenue until client deliverable is approved.
- [ ] Tax reserve sweep executed into isolated sub-account (`1020`).
- [ ] Gateway clearing balance reconciled to zero monthly.
- [ ] Every expense supported by a digital invoice or receipt.

## Routing

- Client profitability calculations → `client-pnl` mode.
- Cash reserve sizing and runway questions → `cashflow` mode.
- Contractor tax compliance and 1099/W-8BEN files → `tax-compliance` mode.

## Sources

- `openaccountants` — Chart of accounts taxonomy and dual-entry double-ledger verification standards.
- `EveryInc/charlie-cfo-skill` — Deferred revenue discipline and direct project cost separation.
