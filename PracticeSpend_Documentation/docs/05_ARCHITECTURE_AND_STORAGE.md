# PracticeSpend — Architecture and Storage

## Prototype architecture

```
GitHub Pages
    |
    v
Static HTML/CSS/JavaScript application
    |
    +-- DemoDataProvider
    +-- ImportService (CSV/XLSX)
    +-- ManualInvoiceService
    +-- NormalizationService
    +-- AnalysisEngine
    +-- ExportService
    +-- StorageProvider
            |
            +-- Session memory
            +-- IndexedDB (optional persistence)
```

## Architectural goal

The prototype must be local-first but not structurally disposable.

The UI and analysis engine should communicate through service interfaces rather than directly calling IndexedDB.

Example conceptual API:

- `storage.saveInvoice(invoice)`
- `storage.getInvoices()`
- `storage.saveProduct(product)`
- `storage.getPriceHistory(productId)`
- `storage.exportOrganization()`
- `storage.clearPracticeData()`

Prototype implementation:

`StorageProvider = IndexedDB`

Future implementation:

`StorageProvider = Hosted API/Postgres/Object Storage`

## Demo data isolation

Packaged demo data must be immutable.

- Demo data ships with the application.
- User data is stored separately.
- `Restore Demo Data` never depends on previously modified browser state.

## Browser persistence modes

### Temporary Session

- imported data exists only during current application session;
- closing/reloading may discard it depending on implementation;
- clearly communicate behavior.

### Save on This Device

- persist normalized data using IndexedDB;
- show last locally saved time;
- user may clear it at any time.

## Export

Support at minimum:

- normalized CSV/XLSX-friendly export;
- JSON full backup/export;
- findings CSV;
- optionally a printable HTML/PDF-style report later.

## Future hosted architecture

```
Static web application / CDN
        |
        v
Authentication
        |
        v
Practice API
        |
        +-- Postgres
        +-- Object storage
        +-- Analysis workers
        +-- Invoice extraction provider
```

Every future record must carry an organization boundary so multi-practice commercialization does not require a data-model rewrite.

## Repository proposal

```
PracticeSpend/
├── index.html
├── css/
├── js/
│   ├── app.js
│   ├── ui/
│   ├── services/
│   ├── analysis/
│   ├── storage/
│   └── models/
├── data/
│   └── demo/
├── docs/
├── tests/
└── README.md
```
