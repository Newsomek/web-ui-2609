# Review History and Managed Reference Data

## Purpose

PracticeSpend treats human review decisions as durable operational records. A product-equivalence decision may change over time, so the system must preserve every approval, rejection, reopen, override, source/basis, note, actor, role, and timestamp rather than overwriting prior state.

## Review history

Every completed review exposes a **Review history** action. The history view shows all recorded decision and lifecycle events in reverse chronological order, including:

- approval as a purchasing equivalent
- rejection / not equivalent
- reopen for fresh review
- override of a prior decision
- actor name and role
- event timestamp
- prior status when applicable
- source/basis
- notes / reason context
- assignment history where available

The current compact status must also surface the latest source/basis and notes when they exist so users do not need to open the full history just to understand the current state.

Existing history is immutable in meaning: later decisions supersede prior outcomes but do not erase them.

## Source / basis

Source/basis is a practice-managed dropdown for review decisions. Default prototype values include manufacturer specifications, vendor/distributor confirmation, physician review, practice purchasing history, contract/GPO documentation, and product labeling/packaging.

An **Other / not listed** choice permits a custom source when needed.

## Managed reference data

Practice-configurable dropdown/reference values are maintained in **Management** rather than hard-coded into each workflow.

Prototype managed lists:

- Source / basis
- Review change reasons
- Product categories
- Units of measure
- Payment terms

Changes affect new decisions/entries. Previously recorded history keeps the historical text value even if that option is later removed from the managed list.

## What is intentionally not managed here

These remain fixed system/application controls in the prototype:

- Acting as demo personas
- Review/workflow statuses
- Queue filters
- Decision status enum (approve / not equivalent)

Production user identity and permissions will eventually come from authenticated organization users rather than a configurable dropdown.

## Permissions

The prototype uses `manage_reference_data` for access to practice reference-data management. Demo Practice Manager, James, and Heather currently have this fictional demo permission. This is not a statement about Modern Dermatology's real internal authority.

## Persistence

Managed reference data is included in:

- local IndexedDB persistence
- PracticeSpend JSON backup/export

Restore Demo resets reference data to packaged defaults.
