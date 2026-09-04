# PracticeSpend Prototype

PracticeSpend is a zero-backend, GitHub-Pages-hostable purchasing intelligence prototype for independent medical practices.

## Prototype capabilities

- Starts in Demo Mode with fictional dermatology-practice purchasing data.
- Dashboard with analyzed spend, opportunity estimates, price changes, and vendor concentration.
- Deterministic price-creep, exact vendor-variance, and simple order-fragmentation findings.
- Every finding has a visible calculation and supporting invoice evidence.
- Invoice history and invoice detail with reconciliation.
- Product history and vendor analysis.
- Manual invoice entry.
- CSV/XLSX import using a canonical template.
- Downloadable XLSX import template.
- Browser-only persistence with IndexedDB.
- Export normalized data + findings to JSON.
- Clear practice data or restore packaged demo data.
- Role-aware review queue with delegation, bulk review, completed review history, reopen/override lifecycle, notes, and source/basis.
- Management area for practice-configurable reference dropdowns (source/basis, review reasons, categories, UOM, payment terms).
- No backend and no direct PDF processing.

## Run locally

Because the app uses ES modules, serve the directory rather than opening `index.html` directly.

```powershell
Set-Location "D:\PracticeSpend"
npx serve . -l 8000
```

Then open `http://localhost:8000`. Leave that PowerShell window running; stop the server later with `Ctrl+C`.

## GitHub Pages

Publish the repository root as a static GitHub Pages site. No build step is required.

## PDF invoices

The prototype intentionally does not parse PDFs. Download the import template, use a document-capable tool such as ChatGPT to convert the PDF to that schema, review the output, then import the reviewed XLSX/CSV file.

## Data boundary

Business purchasing data only. Do not upload PHI or patient information.

## QA2.6

The demo now starts with five pending product-equivalence reviews, uses **Assign for review** terminology, and records invoice ingestion provenance (method, actor, timestamp, source file/system, import batch, source document ID). Duplicate invoice detail compares provenance for the original and later record. User-facing unit-cost precision is limited for readability while calculations retain full internal precision.

### QA2.8 stability note
Navigation uses one delegated persistent listener. If performance is suspected, inspect `window.__PracticeSpendDiagnostics` in the browser console for render counts, analysis calls, and slow-operation records.


## QA2.9
Added shared invoice-date filtering, reconciled category drill-down, bulk product category reassignment with audit/batch history, and collapsed Management sections with per-user session state and explicit usage descriptions.

## QA2.11
Products now support Category + Vendor + Invoice Date population filtering with one product sort applied consistently to category spend detail and unit-cost history. Reset restores All categories / All vendors / All invoice dates / Product A-Z. Duplicate invoices can be kept, suppressed/restored, or permanently deleted with explicit confirmation and audit history. Effective Unit Cost now separates purchase discounts from later credits/returns and exposes its calculation math. Standard date presets also support neutral signed spend/volume comparisons to comparable prior periods.

## QA2.12

Vendor presentation now scales as a searchable/sortable table; Management is exercisable by the default fictional purchasing-coordinator persona; managed reference lists canonicalize case-insensitive duplicates; alphabetical sorts include reverse direction where applicable.


## QA2.13 workflow additions

- Invoice discrepancies can be reconciled by authorized users with before/after financial values, source/basis, note, actor, role, and timestamp retained in audit history.
- Products can be multi-selected and proposed as purchasing equivalents. Proposals are recorded, can be sent to physician review, or approved immediately by an authorized reviewer.
- Import template separates purchase discounts, credits/returns, rebates, and fee types and includes a field guide.
- Footer copyright identifies Michael Kelly Newsome and the linked name opens an email inquiry with a pre-filled subject.
