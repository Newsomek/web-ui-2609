# Invoice Provenance and Demo Review Volume

## Purpose

QA2.6 makes two operational facts explicit in the PracticeSpend model:

1. A review queue should look and behave like real work, not a single synthetic edge case.
2. Every invoice should preserve where it came from, who added it, and when it entered PracticeSpend.

These requirements are important for trust, duplicate investigation, and eventual auditability.

## Demo review workload

The fictional Modern-Dermatology-tailored demo should expose approximately five pending product-equivalence review items at startup.

The current QA2.6 demo deliberately creates five pending equivalence groups across different supply categories. Several are pre-assigned to different public physician demo personas and others remain unassigned so the bulk-review, Needs my review, and delegation flows are meaningful immediately.

All assignments and review authority remain fictional demo assumptions and do not represent Modern Dermatology's real internal policies.

## Assignment terminology

Use **Assign for review** for normal routing of work to an authorized reviewer.

Do not use **Escalate for review** for ordinary assignment. Escalation should be reserved for a future workflow in which an issue is explicitly moved upward because of risk, value, uncertainty, aging, or policy.

Assignment does not grant approval authority. The selected reviewer must already possess the permission required for the review type.

## Invoice provenance model

Every invoice should carry an `ingestion` record containing:

- `method`
- `ingestedByUserId`
- `ingestedByName`
- `ingestedAt`
- `sourceFileName`
- `sourceSystem`
- `importBatchId`
- `originalDocumentId`

Document dates and system-ingestion dates are different facts and must not be conflated.

Examples:

- Invoice date: August 20, 2026
- Added to PracticeSpend: August 20, 2026 at 10:05 AM
- Method: Excel import
- Added by: Demo Purchasing Coordinator
- Source file: Northwest_August_Invoices.xlsx
- Import batch: IMP-2026-0820-01

## Duplicate analysis

A suspected duplicate should show the provenance of both records side by side where practical.

The user should be able to understand not only that the same vendor/invoice number appears twice, but how each record entered the system.

A useful example is:

- Original record: Excel import by purchasing staff
- Possible duplicate: Manual entry by a practice manager later the same day

The later copy remains excluded from analyzed spend until reviewed.

## Import provenance

CSV/XLSX imports should record:

- file name
- import type
- user/persona that performed the import
- import timestamp
- shared import batch ID
- invoice number as source document ID

Manual entry should record PracticeSpend manual entry as the source and the acting user as the person who added it.

Future vendor/API integrations can use the same model without changing downstream analysis.

## Display precision

Full numerical precision should be retained internally.

User-facing presentation should prioritize readability:

- invoice totals / savings / dollar impacts: 2 decimals
- normalized unit costs below $1: 3 decimals
- normalized unit costs at or above $1: 2 decimals
- percentages: normally 1 decimal
- annualized quantities: up to 2 decimals where useful

Where a displayed calculation is based on more precise internal values, the UI should disclose that the result uses unrounded underlying values rather than exposing long decimal strings by default.

## Persistence and backup

Invoice provenance is part of the invoice object. It therefore must survive:

- IndexedDB persistence
- JSON backup/export
- restore operations
- future migration to a hosted database

Provenance should not be regenerated on reload.
