# PracticeSpend

Working product documentation for the PracticeSpend prototype.

PracticeSpend is a local-first purchasing intelligence and invoice analysis application for independent medical practices. It begins with invoice evidence and converts purchasing history into explainable findings about price changes, vendor variance, fees, duplicate invoices, contract discrepancies, and potential savings opportunities.

## Prototype objective

Build a zero-infrastructure-cost, GitHub-hosted prototype that:

- starts with realistic synthetic demo data;
- allows users to load CSV/XLSX purchasing data;
- supports full manual invoice entry;
- stores optional user data locally in the browser with IndexedDB;
- exports normalized data and analysis;
- clears user data and restores the original demo dataset;
- does not require patient data, EHR integration, server storage, or a production backend;
- is architected so local storage can later be replaced by a hosted multi-tenant data provider without rewriting the analysis engine or UI.

## Documents

1. `docs/01_PRODUCT_BRIEF.md`
2. `docs/02_MVP_REQUIREMENTS.md`
3. `docs/03_DATA_MODEL_AND_INVOICE_SCHEMA.md`
4. `docs/04_ANALYSIS_ENGINE.md`
5. `docs/05_ARCHITECTURE_AND_STORAGE.md`
6. `docs/06_SECURITY_PRIVACY_AND_DATA_BOUNDARIES.md`
7. `docs/07_COMPETITIVE_POSITIONING_AND_VALUE.md`
8. `docs/08_DESIGN_SYSTEM_AND_UX.md`
9. `docs/09_ROADMAP_AND_COMMERCIALIZATION.md`
10. `docs/10_DEMO_ACCEPTANCE_CRITERIA.md`
11. `docs/11_OPEN_QUESTIONS_AND_VALIDATION.md`
12. `docs/12_REVIEW_AUTHORITY_AND_ESCALATION.md`
13. `docs/13_REVIEW_HISTORY_AND_REFERENCE_DATA.md`
14. `docs/14_INVOICE_PROVENANCE_AND_DEMO_REVIEW_VOLUME.md`
15. `docs/15_STABILITY_NAVIGATION_AND_CATEGORIES.md`
16. `docs/16_INVOICE_DUPLICATE_FINANCIAL_SEMANTICS_AND_PRODUCT_FILTERS.md`
17. `docs/17_RECONCILIATION_EQUIVALENCE_AND_IMPORT_SEMANTICS.md`
18. `docs/SOURCES.md`

## Working product statement

**PracticeSpend analyzes what a practice actually paid and shows where the money went, what changed, what looks unusual, and where there may be an opportunity to spend less. It works with the vendors and systems the practice already uses.**

## Added during QA2.1

- `docs/12_REVIEW_AUTHORITY_AND_ESCALATION.md` - role-aware reviews, product-equivalence approval, escalation, permissions, and audit-history requirements.

- `docs/13_REVIEW_HISTORY_AND_REFERENCE_DATA.md` - Review history, compact decision status, source/basis dropdowns, and managed practice reference data.

- `docs/14_INVOICE_PROVENANCE_AND_DEMO_REVIEW_VOLUME.md` - Five-item demo review workload, assignment terminology, invoice ingestion provenance, duplicate provenance, and display-precision policy.

## QA2.7 list-control update

List-heavy screens now use a shared interaction pattern: Filter / Sort / Reset with a visible result count. Product history supports vendor filtering and multiple sort modes; invoice, product, and vendor screens expose the highest-value controls for their data.

- `docs/15_STABILITY_NAVIGATION_AND_CATEGORIES.md` - QA2.8 listener-lifecycle fix, dashboard drill-down behavior, dynamic opportunity summaries, and managed product categories.


## QA2.9
Added shared invoice-date filtering, reconciled category drill-down, bulk product category reassignment with audit/batch history, and collapsed Management sections with per-user session state and explicit usage descriptions.

## QA2.11 additions
- `docs/16_INVOICE_DUPLICATE_FINANCIAL_SEMANTICS_AND_PRODUCT_FILTERS.md`
- Product filters now use a shared population/sort contract.
- Duplicate invoices now have keep/suppress/restore/permanent-delete governance.
- Effective Unit Cost now separates purchase discounts from credits/returns.


## QA2.13 additions
- `docs/17_RECONCILIATION_EQUIVALENCE_AND_IMPORT_SEMANTICS.md`
- Authorized invoice reconciliation now edits financial fields and retains before/after audit history.
- Products can be grouped as proposed purchasing equivalents, sent to review, or approved immediately by an authorized reviewer.
- Import template and field guide separate discounts, credits/returns, rebates, and fee types.
- Demo footer includes copyright ownership with a hidden-address mail link on the owner's name.
