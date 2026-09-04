# Invoiced Products and Equivalence Relationships — QA2.14

## Governing rule
Every distinct product represented in analyzed invoice lines remains visible on the Products page and in Management product-category assignments. Product normalization and purchasing-equivalence relationships add metadata and relationships; they do not remove or hide the underlying invoiced product record.

## Product relationship filter
Products supports: All products; No equivalence relationship; Possible equivalents; Awaiting review; Approved equivalents; Not equivalent. Possible equivalents includes possible relationships that are awaiting review.

## Multi-select equivalence workflow
Users can filter the product population, select two or more invoiced products, and create a purchasing-equivalence proposal. Selection is preserved when Category, Vendor, or Relationship filters change so a user can build a multi-product selection across filtered views. Reset clears all filters and the selection.

An authorized reviewer can approve immediately; otherwise the proposal is sent to review. Approval creates a relationship only. It never merges or deletes the underlying product records.

## Category management
Management lists the same complete invoiced-product population and shows relationship status alongside category. Category changes continue to record previous category, new category, acting user, role, timestamp, reason, and batch.
