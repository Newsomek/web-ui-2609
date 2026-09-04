# PracticeSpend Review Authority and Assignment

## Purpose

PracticeSpend should not assume that physician owners personally import invoices or resolve every finding. Daily users may be purchasing coordinators, practice managers, administrators, finance staff, clinical leads, or physicians.

The product therefore separates a person's practice role from the specific decisions that person is authorized to make.

## Prototype model

The Gate 2 prototype uses a hybrid local-persona model rather than real authentication.

- Publicly listed Modern Dermatology physician names are used for physician reviewer personas so the demonstration feels tailored to the practice.
- Operational staff personas remain explicitly fictional because PracticeSpend should not invent or infer private employee identities or responsibilities.
- All prototype permissions, assignments, approvals, and decisions are fictional demonstration data and must not be represented as Modern Dermatology's actual internal authority structure.

Public physician personas currently represented in the prototype include James C. Collyer, MD, FAAD; Heather D. Rogers, MD, FAAD; Carly J. Roman, MD; Richard B. Grabowski, MD, FAAD; Robin Green Whipple, MD, FAAD; and Joan Leavens, MD, FAAD.

Operational demo personas include a Demo Purchasing Coordinator and Demo Practice Manager.

This demonstrates workflow and authority without requiring a backend, login system, password reset, or cloud identity service.

## Permissions

Initial permission concepts include:

- import_invoices
- resolve_duplicate
- resolve_reconciliation
- assign_reviews
- approve_vendor_change
- approve_high_value
- approve_product_equivalence

Production permissions should be configurable by organization and potentially by product category, financial threshold, or location.

## Product equivalence states

PracticeSpend must maintain three distinct concepts:

1. Exact product
   - Same canonical/manufacturer product identity.
   - May participate in exact-product analysis automatically.

2. Practice-approved equivalent
   - An authorized human at the practice has approved the relationship for purchasing analysis.
   - May participate in equivalent-product purchasing comparisons.
   - Must never be relabeled as an Exact Match.

3. Possible equivalent
   - System-detected candidate relationship awaiting review.
   - Must not affect opportunity totals before approval.

A rejected relationship is remembered so PracticeSpend does not repeatedly suggest the same pair as equivalent.

## Decision record

Every approval/rejection should record:

- equivalentGroup / relationship identifier
- status: approved or rejected
- deciding user ID
- deciding user's displayed name
- deciding user's role at decision time
- timestamp
- source/basis
- optional notes
- complete decision history

Changing a decision adds a new history entry rather than deleting the prior decision.

## Meaning of approval

The UI should use wording such as:

> Approved as purchasing equivalent for this practice.

The application should explicitly avoid implying that PracticeSpend itself made a clinical-equivalence determination.

## Assignment

Review routing should be driven by required permission rather than ownership title.

Example:

Possible product equivalence
-> requires approve_product_equivalence
-> can be assigned to any active user holding that permission

A non-owner physician may therefore be authorized to approve an equivalence review.

Future routing can support:

- category-specific reviewers
- financial thresholds
- location-specific authority
- fallback reviewers
- overdue escalation
- secondary approval

## Production migration

Real authentication is deferred until product validation.

The production model should eventually include:

Organization
-> Users
-> Roles
-> Permissions
-> Review assignments
-> Decisions
-> Audit events

The prototype data structures should migrate cleanly into authenticated users later.

## QA2.3 bulk review and delegation

Busy physician owners should not be forced to process reviews one at a time.

The review queue therefore supports batch work while keeping assignment separate from approval authority.

### Queue views

Prototype queue filters include:

- All pending
- Needs my review
- Unassigned
- Assigned by me

"Needs my review" includes reviews assigned to the acting user and unassigned reviews the acting user is authorized to decide.

### Selection and bulk actions

The prototype supports:

- Select visible reviews
- Clear selection
- Assign selected to me
- Assign selected to another eligible reviewer
- Review selected sequentially without returning to the queue after every decision
- Approve selected product-equivalence reviews using one shared basis/notes record
- Mark selected product-equivalence reviews not equivalent using one shared basis/notes record

Bulk approval/rejection is only exposed when the acting user is authorized for every selected review and the selected items share the product-equivalence decision type.

### Assignment is not authority

Delegating a review does not grant permission.

An assignee must already hold the permission required by every selected review. The prototype filters the assignee list accordingly.

James and Heather demo personas have assignment authority in the prototype so the demonstration can show an owner choosing to:

- review work personally,
- claim unassigned work,
- delegate a group of reviews to another authorized physician,
- or split a queue among several reviewers.

These permissions remain fictional prototype assumptions and are not claims about Modern Dermatology's actual internal authority structure.

### Audit trail

Each assignment/reassignment records:

- assignee user ID and display name
- assigning user ID, name, and role
- timestamp
- optional notes

When a final product-equivalence decision is made, prior assignment history is copied into the decision record so the routing trail is not lost when the pending assignment is cleared.

Each bulk decision still produces an individual decision record and history entry for every reviewed product relationship.

## Completed review lifecycle

A recorded approval or rejection is not a terminal dead end. PracticeSpend must allow authorized users to inspect completed decisions and, when circumstances change, either reopen the review or explicitly override the current decision.

### Reopen

Reopening a completed decision returns the item to the pending review queue. The prior approved/rejected outcome remains in immutable decision history. Reopening does not itself assert a new equivalence outcome and therefore an approved-equivalence opportunity must stop counting as approved until a new decision is recorded.

The reopen event records the acting user, role, timestamp, source/basis when provided, reason/notes, and the prior status.

### Override

An authorized product-equivalence reviewer may override an approved decision to Not Equivalent, or a rejected decision to Approved as Purchasing Equivalent. An override becomes the current active decision immediately, while the superseded decision remains visible in history.

The override event records the acting user, role, timestamp, source/basis, reason/notes, and the previous status.

### Permissions

Reopening may be performed by a user authorized to approve product equivalence or by a user with review-assignment authority. Overriding requires product-equivalence approval authority. Assignment never grants decision authority.

### Review experience

The Reviews area should expose completed decisions separately from pending work, with filters for approved and rejected decisions. Each completed record should support Review decision, Reopen, and, for authorized reviewers, Override.
