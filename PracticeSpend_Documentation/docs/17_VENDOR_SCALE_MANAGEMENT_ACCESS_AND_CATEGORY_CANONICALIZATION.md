# PracticeSpend — Vendor Scale, Management Access, and Category Canonicalization

## Purpose

QA2.12 closes three demo/UX gaps identified during browser QA.

## Vendors

The Vendors page is a table rather than a card grid so the UI remains usable with dozens or hundreds of vendors. It supports vendor-name search and bidirectional sorts for name, spend, invoices, products, fees, and findings. Selecting a row opens vendor detail.

## Management demo authority

The fictional Demo Purchasing Coordinator is allowed to manage practice reference data in the prototype so the default demo persona can exercise Management without switching identities. This is a demo authority assumption, not a claim about Modern Dermatology's real permissions. Production authorization remains configurable.

## Category canonicalization

Reference-data lists are normalized case-insensitively. Default category labels use the same canonical capitalization as the invoice dataset. Saved lists are normalized when loaded so values such as `Medical Supplies` and `Medical supplies` do not appear as separate categories.

Product category overrides are also resolved through canonical category labels before display or analysis.

## Sorting convention

Where an alphabetical sort is offered, both A–Z and Z–A are provided. Product history includes Vendor A–Z and Vendor Z–A. The Products page includes Product A–Z and Product Z–A.
