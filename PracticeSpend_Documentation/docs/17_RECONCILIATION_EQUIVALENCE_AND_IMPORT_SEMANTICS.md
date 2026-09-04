# Reconciliation, Equivalence Proposals, and Import Semantics

## Invoice reconciliation
A mismatch is not merely acknowledged. An authorized user corrects the invoice-level financial fields from the source document. PracticeSpend records before/after values, source/basis, note, actor, role, timestamp, and whether the resulting invoice fully reconciles. A corrected invoice is shown as `Reconciled · changed`.

## Purchasing equivalence proposals
Users may select two or more exact products and group them as possible purchasing equivalents. The proposal records the products, proposer, role, time, source/basis, and notes. It can be sent to an authorized physician review queue or approved immediately by a user who already has product-equivalence approval authority. Product equivalence remains purchasing-analysis governance, not a PracticeSpend clinical-equivalence determination.

## Import semantics
The import template distinguishes purchase-time line/invoice discounts from credits/returns and rebates. Credits/returns may identify the original invoice and reason. Fee fields remain separate so Effective Unit Cost calculations are inspectable.
