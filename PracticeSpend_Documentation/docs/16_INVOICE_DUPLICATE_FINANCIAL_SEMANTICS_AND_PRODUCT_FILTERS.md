# PracticeSpend — Invoice Duplicate Governance, Financial Semantics, and Product Filters

## Duplicate lifecycle
Possible duplicates are reviewable records, not automatic deletions. A reviewer can Keep both, Suppress duplicate, or Delete permanently.

- Keep both: confirms both records are legitimate and includes both in analysis.
- Suppress duplicate: preserves the record and provenance but excludes it from spend, products, vendors, findings, and opportunity calculations. Suppressed invoices remain available through Invoices > Status > Suppressed and can be restored.
- Delete permanently: requires a warning plus explicit `DELETE` confirmation. Invoice content is removed, while a lightweight deletion audit event remains in exported governance data.

Suppression, restoration, keep-both, and deletion actions record actor, role, and timestamp.

## Discounts versus credits/returns
Discounts reduce purchase price. Credits/returns are separate financial adjustment events and may reference an original invoice, product/line, quantity, reason, and credit memo. The prototype manual-entry form supports document type, original invoice reference, and credit/return reason.

Effective Unit Cost is purchase-time economics:

1. merchandise after line discount;
2. plus allocated shipping/handling/fees;
3. minus allocated invoice/volume discount;
4. divided by normalized units.

Credits/returns and rebates remain separate. Net economic cost may reflect them later, but they are not silently folded into Effective Unit Cost.

## Product page filter/sort model
Category, Vendor, and Invoice Date define the population. Every affected total and product statistic is recalculated. Product sort controls both category detail grouping and the product summary order. Reset restores the canonical initial state: All categories, All vendors, All invoice dates, Product A-Z.

## Period comparisons
For standard year/quarter/month presets, Product detail can compare spend and normalized units with the comparable prior-year period. These changes always display `+`/`−` but remain neutral in color because direction alone is not a value judgment.
