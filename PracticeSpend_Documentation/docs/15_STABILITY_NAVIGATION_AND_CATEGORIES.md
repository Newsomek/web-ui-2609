# QA2.8 - Stability, Dashboard Navigation, and Product Categories

## Purpose

QA2.8 addresses a browser-tab slowdown that accumulated during repeated navigation and eventually caused the PracticeSpend tab to freeze. It also makes dashboard summaries drill into their underlying data and introduces practice-managed product category assignments.

## Root cause of the freeze

`bindView()` previously queried every `[data-nav]` element after each render and attached another click listener. Header navigation nodes persist between renders, so those listeners accumulated. One click could eventually trigger many route/render calls, which then registered still more listeners.

QA2.8 replaces that pattern with one delegated document click listener installed once during initialization. Dynamic view-specific controls may still bind to newly rendered nodes because those nodes are replaced when the view changes.

A lightweight `window.__PracticeSpendDiagnostics` object tracks render count, analysis calls, global listener installation, and operations that exceed performance thresholds.

## Opportunity filtering

The Opportunities banner is calculated from the currently visible findings. It reports the annualized opportunity value of the current selection and separately identifies anomaly/review counts. Review items and anomalies are not included as guaranteed savings.

## Overview navigation

The Overview becomes a navigation surface:

- Analyzed spend -> Invoices
- Potential annualized opportunities -> Opportunities
- Material price changes -> Opportunities filtered to Price creep
- Vendors reviewed -> Vendors
- Top vendor row -> Vendors plus that vendor's detail view
- Category row -> Products filtered to the selected category
- View all under Largest Findings -> Opportunities

## Product categories

Products now display a Category column and support category filtering.

Category display uses a practice-level override when one exists; otherwise it uses the latest exact invoice category for the product.

Management includes **Product category assignments**. An authorized management user can assign or change a product's category using the practice-managed Product Categories list.

Each category change records:

- canonical product key
- product description
- previous category
- new category
- acting user
- acting role
- timestamp

Category overrides and history are included in local persistence and JSON exports.

## Prototype scope

QA2.8 does not add production authentication or server-side audit storage. Category attribution is local prototype state associated with the selected demo persona.
