# PracticeSpend — Date Filtering, Category Governance, and Management UX

## Date filtering
Invoice-derived views share an Invoice Date control with All time, this/last year, this/last quarter, this/last month, and custom range. The selected period drives Overview, Opportunities, Invoices, Products, Vendors, product histories, category totals, and vendor totals.

## Category reconciliation
Category View totals are invoice-line spend for the selected date period. Selecting a category opens Products filtered to that category plus a reconciled invoice-line detail whose footer equals the clicked Category View total. Invoice-level shipping, tax, and unrelated fees are not included in category line-item totals.

## Bulk category assignment
Products supports multi-select, Select all visible, target category, optional reason/note, and bulk assignment. Each changed product receives its own audit event containing prior category, new category, actor, role, timestamp, and shared batch ID. Products already in the target category are skipped.

## Management UX
Managed-list sections are collapsed by default. Each section states which pages/dropdowns it controls. Open/close state is stored in sessionStorage per acting demo user. Open all and Close all are provided. Acting-as demo personas remain application-controlled and are not managed reference data.


## Products filter/sort contract
Category, Vendor, and Invoice Date are population filters. Any population filter recalculates category spend and all product observations shown below it. Sort changes presentation order only and must never change totals. The same product sort governs both Category Spend Detail and Product Unit-Cost History. Reset restores All categories, All vendors, All invoice dates, Product A-Z, and clears temporary product selections/drill-down state.

Vendor filtering narrows both category line-spend detail and product histories. Earliest, latest, low, high, purchase count, spend, and cost-change values are recalculated from the filtered population.

## Directional comparison semantics
Effective Unit Cost changes use signed percentages plus semantic color: red `+` for cost increases, green `−` for cost decreases, and neutral zero. Color is never the only signal. Spend and purchase-volume changes use explicit `+`/`−` but neutral color because more or less purchasing is not inherently favorable or unfavorable.
