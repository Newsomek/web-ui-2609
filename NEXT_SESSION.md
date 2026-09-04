# PracticeSpend - Next Session Handoff

Last updated: 2026-09-03
Project root: D:\PracticeSpend
Status: Gate 2 prototype development

---

## 1. Project Purpose

PracticeSpend is an independent purchasing intelligence and spend-analysis system initially aimed at independent medical practices, with dermatology as the first validation market.

Core proposition:

> Don't replace your purchasing system. Audit it.

PracticeSpend analyzes what a practice actually paid and identifies:

- price creep
- vendor price differences
- purchasing anomalies
- shipping/fee leakage
- possible contract pricing discrepancies
- duplicate invoices
- spend concentration
- potential purchasing opportunities

Every financial finding should be deterministic, explainable, and traceable to supporting invoice data.

PracticeSpend is NOT intended to be:

- an EHR
- an accounting system
- an AP/payment system
- a credit card
- a purchasing marketplace
- an inventory-management replacement
- a clinical application

The initial product should work alongside whatever systems and vendors a practice already uses.

---

## 2. Current Validation Strategy

This project is deliberately being developed as a low-cost validation experiment.

### Gate 1 - Prototype

Build a useful prototype for essentially $0 infrastructure cost.

STATUS: IN PROGRESS

### Gate 2 - Modern Dermatology

Put the prototype in front of James Collyer and Heather Rogers at Modern Dermatology.

Determine whether analysis of their real purchasing data reveals useful information they are not already obtaining easily.

Key reactions to look for:

- "We didn't know that."
- "Why did that price increase?"
- "Can we run more invoices?"
- "Can it also do ___?"
- "Other practices would want this."

Weak validation:

- "This is cool."
- compliments on appearance
- interest based primarily on friendship

Important validation question:

> If I weren't your friend and this cost $99/month, would you buy it?

If Gate 2 fails, stop or rethink the product before making a major investment.

### Gate 3 - External Practices

Test with approximately 3-5 unrelated practice owners/managers.

Only after successful external validation should significant effort go into production SaaS infrastructure, integrations, automated PDF processing, subscriptions, benchmarking, etc.

---

## 3. Canonical Local Paths

Project root:

D:\PracticeSpend

Documentation:

D:\PracticeSpend\PracticeSpend_Documentation

Application files live directly under D:\PracticeSpend.

There should NOT be a nested:

D:\PracticeSpend\PracticeSpend

That accidental extraction directory was removed on 2026-09-03.

---

## 4. Verified Project Structure

The following structure was verified on 2026-09-03:

D:\PracticeSpend
|
+-- index.html
+-- README.md
+-- assets\
+-- css\
|   +-- styles.css
+-- data\
|   +-- demo.js
+-- js\
|   +-- analysis.js
|   +-- app.js
|   +-- importer.js
|   +-- storage.js
+-- tests\
|   +-- smoke-test.mjs
+-- PracticeSpend_Documentation\
    +-- README.md
    +-- docs\
        +-- 01_PRODUCT_BRIEF.md
        +-- 02_MVP_REQUIREMENTS.md
        +-- 03_DATA_MODEL_AND_INVOICE_SCHEMA.md
        +-- 04_ANALYSIS_ENGINE.md
        +-- 05_ARCHITECTURE_AND_STORAGE.md
        +-- 06_SECURITY_PRIVACY_AND_DATA_BOUNDARIES.md
        +-- 07_COMPETITIVE_POSITIONING_AND_VALUE.md
        +-- 08_DESIGN_SYSTEM_AND_UX.md
        +-- 09_ROADMAP_AND_COMMERCIALIZATION.md
        +-- 10_DEMO_ACCEPTANCE_CRITERIA.md
        +-- 11_OPEN_QUESTIONS_AND_VALIDATION.md
        +-- SOURCES.md

Smoke test:

node .\tests\smoke-test.mjs

Last verified result:

PracticeSpend smoke test: required files present and non-empty.
Smoke test passed.

---

## 5. Prototype Requirements

The prototype should start immediately with realistic fictional/demo data.

The user can then:

- explore demo data
- load CSV data
- load XLSX data
- manually enter an invoice
- save imported data locally in the browser
- export their data
- clear practice data
- restore the original demo dataset

Application modes should be visibly distinguishable:

DEMO MODE

and

LOCAL PRACTICE MODE

No backend is required for the prototype.

---

## 6. Local Data Architecture

Prototype storage:

GitHub/static application
        |
        v
Browser
        |
        +-- application state
        |
        +-- IndexedDB
        |
        +-- deterministic analysis engine

Practice data should remain on the user's device.

Desired trust message:

> Your data stays on this device.

The prototype should not transmit uploaded purchasing data to a PracticeSpend server.

---

## 7. Invoice Input Strategy

Native prototype formats:

- CSV
- XLSX
- manual invoice entry

PDF processing is intentionally deferred.

For PDFs, the user should be instructed to use a document-capable AI system such as ChatGPT or another appropriate tool to convert the PDF into the PracticeSpend Excel/CSV import format.

Workflow:

PDF invoice
    ->
external conversion
    ->
user reviews spreadsheet
    ->
PracticeSpend imports CSV/XLSX
    ->
PracticeSpend validates totals
    ->
analysis

PracticeSpend should provide:

- downloadable import template
- conversion instructions/prompt
- reconciliation/validation after import

Do NOT build native PDF extraction until product value has been validated.

---

## 8. Manual Invoice Entry

Manual entry is a first-class feature.

Invoice fields should support normal medical/vendor invoice information, including where applicable:

Header:

- vendor
- vendor account
- invoice number
- invoice date
- order date
- due date
- PO number
- salesperson/rep
- payment terms
- currency

Bill/ship information:

- practice
- address
- location
- department
- attention

Line items:

- vendor SKU
- manufacturer SKU
- UPC
- description
- manufacturer
- category
- quantity ordered
- quantity shipped
- backordered quantity
- unit of measure
- pack size
- normalized quantity
- unit price
- list price
- discount
- line total
- tax
- lot number
- expiration
- notes

Totals:

- subtotal
- freight/shipping
- handling
- surcharges
- tax
- credits
- rebates shown
- prior balance
- amount paid
- invoice total
- amount due

Not every field should be required.

Minimum practical required fields:

- vendor
- invoice number
- invoice date
- item description
- quantity
- unit price

Manual invoices must enter the same canonical invoice model as imported invoices.

---

## 9. Analysis Principles

Financial conclusions must be deterministic and inspectable.

AI may eventually assist with:

- document extraction
- product-name matching
- normalization suggestions

AI should NOT silently generate financial conclusions.

Every opportunity should answer:

WHY?

Example:

Current effective unit cost: $22.84
Comparison cost: $18.97
Difference: $3.87
Historical annual units: 383

Annualized opportunity:

383 x $3.87 = $1,482.21

The user should be able to drill from:

opportunity
    ->
calculation
    ->
product
    ->
purchase observations
    ->
supporting invoices

---

## 10. Critical Analysis Requirements

Do not compare raw prices without accounting for packaging and quantity.

Unit-of-measure normalization is foundational.

Distinguish:

- exact product
- equivalent product
- possible/similar product

Never silently assert clinical interchangeability.

Use confidence levels such as:

- Verified
- Strong
- Potential / Review Required

Use landed/effective cost where possible:

product cost
+ shipping
+ handling
+ surcharges
- discounts
- rebates
= effective landed cost

Support or plan for:

- credit memos
- returns
- duplicate invoices
- contract pricing
- GPO pricing
- rebates
- volume discounts
- shipping thresholds
- temporal price comparisons

Do not present estimates as guaranteed savings.

Preferred wording:

> Potential annualized opportunities identified

rather than:

> You will save

---

## 11. Important Future Value Features

Potential post-validation capabilities include:

- purchasing fingerprint
- unusual-order detection
- vendor scorecards
- vendor negotiation packets
- quote comparison
- before-you-buy analysis
- price-change alerts
- spend concentration
- rebate threshold analysis
- inventory economics
- expiration exposure
- reorder intelligence
- equipment ROI
- practice economics
- anonymized/aggregated benchmarking

Do NOT build these merely because they are interesting.

They require validation first.

---

## 12. Competitive Positioning

PracticeSpend should not compete by claiming invoice analysis itself is novel.

Existing competitors already provide combinations of:

- procurement
- inventory
- spend analytics
- price comparison
- AP automation
- invoice extraction
- vendor intelligence

Potential PracticeSpend wedge:

> Independent second opinion on practice purchasing.

Important differentiators to test:

- no purchasing-system replacement
- no accounting migration
- no bank/card connection
- no marketplace requirement
- vendor agnostic
- historical forensic analysis
- read-only analysis
- deterministic findings
- evidence behind every dollar
- very low implementation friction
- can complement existing systems

Important competitive threat:

General-purpose AI such as ChatGPT can already analyze spreadsheets and invoices.

PracticeSpend therefore needs value beyond "AI reads invoices."

Potential durable value:

- persistent normalized product identity
- longitudinal price history
- unit normalization
- vendor history
- deterministic calculations
- confidence levels
- recurring analysis
- contract/rebate rules
- audit trail
- eventual cross-practice benchmarks

---

## 13. Design Direction

The prototype look and feel should be inspired by Modern Dermatology's public website without copying its branding.

Desired characteristics:

- premium
- restrained
- physician-oriented
- editorial rather than generic SaaS
- generous whitespace
- strong typography
- neutral palette
- clean hierarchy
- minimal visual noise
- professional enough to put directly in front of physicians

PracticeSpend must remain its own brand.

Working product name:

PracticeSpend

---

## 14. Demo Dataset

The initial prototype contains fictional dermatology-practice purchasing data.

Last known generated demo characteristics:

- 14 invoices
- 52 line items
- 9 normalized products
- 4 vendors
- approximately $3,740 in deliberately constructed potential annualized opportunities

These values are synthetic and should never be represented as Modern Dermatology data.

The demo should feel plausible rather than artificially generating huge savings.

---

## 15. Security and Data Boundaries

Prototype is intended for business purchasing documents only.

Explicitly prohibit patient/clinical information.

Suggested message:

> This application is for business purchasing documents only. Do not upload patient records, patient names, medical records, photographs, clinical documents, or other protected health information.

Even without PHI, purchasing information can contain sensitive business information including:

- vendor relationships
- negotiated pricing
- account numbers
- payment information
- spend patterns

Prototype design therefore emphasizes local browser processing/storage.

---

## 16. Production Migration Philosophy

Prototype-speed, production-aware, not production-overengineered.

Application logic should not depend directly on one storage vendor.

Conceptual interfaces:

StorageService
InvoiceService
VendorService
ProductService
AnalysisService

Prototype:

StorageProvider = IndexedDB

Possible commercial implementation:

StorageProvider = hosted database/object storage

Future production architecture should support multi-tenancy from the beginning of SaaS development:

Organization
    ->
Users
Vendors
Products
Invoices
InvoiceLines
PriceObservations
AnalysisRuns
Opportunities

Records should ultimately carry organization_id where appropriate.

---

## 17. Development Rules

These conventions apply to future PracticeSpend development sessions.

### PowerShell

Complete PowerShell run blocks should begin with:

cls

Successful completion should produce an audible signal such as:

[console]::Beep(800, 250)

For multi-step operations, prefer a bounded block:

& {
    $ErrorActionPreference = "Stop"
    ...
}

### Terminal Failure Rule

Do NOT blindly repeat a failed terminal command.

When a command fails:

1. Read the actual error.
2. Determine the likely cause.
3. Inspect targeted state if necessary.
4. Make the smallest appropriate correction.
5. Retry only when the correction addresses the identified failure.

Do not repeatedly run equivalent commands hoping for a different result.

### Output Discipline

Avoid dumping huge diagnostics into the terminal.

For large output:

- write diagnostics to a file
- inspect targeted sections
- use bounded output

### Destructive Operations

Avoid destructive operations unless necessary.

Always scope deletion/move commands carefully.

D:\PracticeSpend is the canonical project root.

### Continuity

Maintain this NEXT_SESSION.md file throughout development.

Update it BEFORE conversation context becomes constrained.

Do not wait until the final few messages.

A new session should be able to read this file and resume without reconstructing the project from conversation history.

---

## 18. Immediate Next Steps

Next development session should begin by:

1. Read NEXT_SESSION.md.
2. Read BUILD_STATUS.md.
3. Run the smoke test.
4. Launch the prototype locally.
5. Visually inspect every current screen.
6. Test demo-mode navigation.
7. Test opportunity drill-down/calculation explanations.
8. Test manual invoice entry.
9. Test CSV/XLSX import.
10. Test IndexedDB persistence.
11. Test export.
12. Test clear-data behavior.
13. Test restore-demo behavior.
14. Record defects before adding features.
15. Fix the highest-impact demo defects first.

The immediate objective is NOT feature expansion.

The immediate objective is:

> Make the existing Gate 2 prototype reliable and polished enough to put directly in front of James and Heather.

---

## 19. Resume Commands

From PowerShell:

cls

Set-Location "D:\PracticeSpend"

node .\tests\smoke-test.mjs

[console]::Beep(800, 250)

To launch a local web server:

cls

Set-Location "D:\PracticeSpend"

python -m http.server 8000

Then open:

http://localhost:8000

Do not repeatedly start additional servers if port 8000 is already occupied. Diagnose the existing listener first.

---

## 20. Handoff Rule

Before ending any substantial PracticeSpend development session, update:

D:\PracticeSpend\NEXT_SESSION.md

and:

D:\PracticeSpend\BUILD_STATUS.md

Include:

- what changed
- files changed
- tests performed
- current failures
- unresolved questions
- exact next action
- any important decisions made during the session

## QA2.5 update - 2026-09-03 21:39
Review decisions now preserve and expose full history. Source/Basis and other practice reference dropdowns are managed through the new Management area. QA2.5 automated tests passed.
Immediate next step: Ctrl+F5, visually test Reviews > Review history and Management, then proceed to manual invoice + IndexedDB persistence testing.

## QA2.6 update - 2026-09-03 22:01
Demo now has five pending equivalence reviews. Invoice provenance records method, actor, timestamp, source file/system, batch, and source document ID. Duplicate detail compares original versus later-record provenance. Display precision simplified while retaining full internal precision.
Next: Ctrl+F5, visually inspect Reviews and duplicate invoice provenance, then continue persistence/import QA.

## QA2.7 update - 2026-09-03 22:16
List-heavy screens now use a consistent Filter / Sort / Reset pattern. Product History includes vendor filter, multiple sort options, reset, and Showing X of Y summary. Invoice, Product, and Vendor lists also expose appropriate sorting/filtering.
Next: Ctrl+F5 and visually confirm Product History + Invoices, then continue manual invoice/persistence QA.

## QA2.8 update - 2026-09-03 22:58
Root cause of progressive tab freeze was repeated event-listener registration on persistent header navigation. Replaced with one delegated listener. Opportunity totals now follow active filters. Overview vendors/categories/metrics drill into details. Products expose categories; Management controls product-category assignments with actor/time history.
Immediate next step: Ctrl+F5 and stress-test navigation repeatedly before continuing feature QA.

## QA2.9 update - 2026-09-03 23:23
Invoice-derived views now share date presets and custom date range filtering. Category View totals reconcile to invoice-line detail. Products supports bulk category reassignment with from/to, actor, role, time, reason, and batch history. Management sections are collapsed by default, describe their downstream controls, and preserve open state per acting demo user for the browser session.
Next: Ctrl+F5 and visually verify date filtering, Retail Skincare reconciliation, bulk category assignment, and Management accordion behavior.

## QA2.11 update - 2026-09-04 00:16
Products now use Category + Vendor + Invoice Date as shared population filters and one shared product sort across category spend and unit-cost history. Reset restores All categories / All vendors / All invoice dates / Product A-Z. Duplicate invoices support Keep both, Suppress, Restore, and permanent Delete with audit history. Effective Unit Cost separates discounts from credits/returns and exposes calculation math.
Next: Ctrl+F5 and perform visual/interaction QA of Products, duplicate handling, and Effective Unit Cost calculations.

## QA2.12 update - 2026-09-04 00:22
Vendors now use a scalable table with search and expanded sorting. Demo Purchasing Coordinator can exercise Management. Managed reference data is normalized case-insensitively to prevent duplicate categories caused by capitalization differences. Alphabetical sorts include reverse direction where applicable.
Next: Ctrl+F5, verify Management sections render, confirm duplicate categories are gone, and test Vendors table search/sort/detail navigation.

## QA2.13 update - 2026-09-04 00:47
Invoice discrepancies can now be corrected and audited. Products can be grouped into proposed purchasing-equivalence relationships and sent for review or approved by an authorized reviewer. Import template separates discounts from credits/returns and rebates. Footer copyright/mail link added.
Next: Ctrl+F5 and visually test reconciliation, product equivalence proposal workflow, Data & Import navigation, template download, and footer link.
