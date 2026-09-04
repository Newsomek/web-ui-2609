# PracticeSpend — Demo Acceptance Criteria

## Five-minute test

A new user should be able to open the GitHub URL and understand the product without explanation.

Within five minutes, the demo must demonstrate:

1. PracticeSpend begins with realistic fictional data.
2. It identifies at least several categories of credible findings.
3. Every major finding can be explained from underlying invoice data.
4. The user can inspect price history for an item.
5. The user can compare vendor pricing.
6. The user can open an invoice and inspect line items.
7. The user can manually create an invoice.
8. The user can access CSV/XLSX import.
9. The user can understand how PDF invoices can be converted externally for import.
10. The user can switch from demo to local practice data.
11. The user can save locally, export, clear, and restore demo data.
12. The application clearly says that local practice data is not uploaded to a PracticeSpend server.

## Demo data requirements

The synthetic dataset should include enough history to intentionally demonstrate:

- gradual price creep;
- same exact SKU from two vendors at different effective unit costs;
- one contract-price discrepancy;
- a shipping/order-fragmentation opportunity;
- a duplicate or suspected duplicate invoice;
- a credit memo/return;
- one uncertain possible-equivalent product that requires review;
- spend concentration among a few vendors;
- at least one invoice reconciliation issue;
- an item with a price reduction so the product does not only generate negative findings.

## Presentation requirements

The product should look finished enough that the user does not interpret it as a wireframe.

- responsive desktop/tablet/mobile layout;
- no dead buttons;
- no placeholder lorem ipsum;
- no broken calculations;
- no unexplained fake AI;
- no unsupported claims of guaranteed savings;
- polished empty/error states;
- visible demo/local mode indicator;
- clear data-control actions.

## Technical acceptance

- Runs from GitHub Pages/static hosting.
- No required backend.
- No external database required.
- Local persistence uses IndexedDB or equivalent browser-native structured storage.
- No imported data sent to external services.
- Demo reset is deterministic.
- Analysis produces identical output for identical input.
