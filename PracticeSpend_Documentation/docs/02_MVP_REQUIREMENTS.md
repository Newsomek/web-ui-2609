# PracticeSpend — MVP / Prototype Requirements

## Required operating modes

### Demo Mode

- Default startup mode.
- Preloaded with realistic synthetic dermatology-practice purchasing data.
- No setup required.
- Clearly labeled `DEMO MODE`.
- Demo data must illustrate meaningful findings rather than random transactions.

### Local Practice Mode

Activated after the user loads or manually enters practice data.

- Clearly labeled `LOCAL PRACTICE MODE`.
- User can choose whether data remains only for the current session or is saved locally on the device.
- No server-side storage in prototype.
- Practice data must never overwrite the immutable packaged demo dataset.

## Required data actions

- Load CSV.
- Load XLSX.
- Download/import template.
- Manual invoice entry.
- Import additional invoices into an existing local dataset.
- Save on this device using IndexedDB.
- Export normalized practice data.
- Export analysis results.
- Clear practice data.
- Restore demo data.
- Offer export before destructive clearing.

## PDF workflow

Direct PDF parsing is intentionally out of scope for the initial prototype.

The UI should explain:

1. Download the PracticeSpend import template.
2. Upload the PDF invoice to a document-capable AI tool such as ChatGPT or another trusted tool.
3. Ask the tool to convert the invoice to the PracticeSpend CSV/XLSX schema.
4. Review the result for accuracy.
5. Upload the reviewed file to PracticeSpend.

PracticeSpend must validate totals and required fields after import. External AI output is never assumed correct.

## Required screens

1. Dashboard.
2. Savings / Opportunity Finder.
3. Invoice History.
4. Invoice Detail.
5. Manual Invoice Entry.
6. Product / Item History.
7. Vendor Analysis.
8. Price Change / Price Creep.
9. Vendor Comparison.
10. Order / Quote Comparison or simple optimizer.
11. Data Import / Export / Reset.
12. About Local Data / Privacy.

## Dashboard minimum content

- analyzed spend;
- invoice count;
- vendors;
- normalized products/items;
- material price changes;
- verified/strong/potential opportunities;
- estimated annualized opportunity value;
- top spend categories;
- top vendors;
- largest findings requiring attention.

## Core UX behavior

Every financial finding must include a `Why?` or `Show calculation` path.

Example:

- Current effective unit cost: $22.84
- Comparison cost: $18.97
- Difference: $3.87
- Historical annual quantity: 383
- Annualized opportunity: 383 × $3.87 = $1,482.21
- Confidence: Verified exact SKU match
- Supporting invoice links/records

## Prototype constraints

- GitHub-hostable static application.
- No required backend.
- Zero required infrastructure cost.
- No authentication required for demo/local prototype.
- No patient information.
- No EHR integrations.
- No production billing.
- No multi-tenant backend yet.
- No automated vendor purchasing.
- No accounting ledger.
- No direct PDF extraction.
