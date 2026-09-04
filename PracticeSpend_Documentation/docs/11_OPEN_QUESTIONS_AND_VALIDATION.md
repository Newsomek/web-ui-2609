# PracticeSpend — Open Questions and Validation Plan

## Questions to answer with James and Heather

Do not lead them toward preferred answers.

### Purchasing workflow

- Who actually orders supplies today?
- Which vendors are used regularly?
- Does the practice use a GPO or negotiated contracts?
- How are price changes noticed?
- How are purchase histories reviewed?
- How often are vendor prices compared?
- Is any of this currently maintained in Excel or another manual tracker?
- Are shipping/free-shipping thresholds actively managed?
- Are rebates/credits easy to reconcile?
- How difficult is it to know the true historical price of an item?

### Existing systems

- Which EHR/practice-management platform is used?
- Which accounting system is used?
- Is an inventory/procurement tool already in use?
- What does that tool do well?
- What still requires manual effort despite it?
- Can existing systems export invoice/order history to CSV/XLSX?

### Value

- Which PracticeSpend finding would actually cause action?
- What finding would be interesting but not useful?
- Who would use this: physician owner, practice manager, buyer, bookkeeper, administrator?
- How often would they realistically open it?
- Would quarterly analysis be enough, or is pre-purchase/continuous monitoring needed?
- What would they expect such a tool to cost?

### Commercial signal

- Do they believe peer practices have the same problem?
- Can they immediately name practices/owners who would understand the pain?
- Would they introduce PracticeSpend for validation?
- Would they be comfortable publicly saying they helped design it if it proves valuable?

## Critical unknowns before commercialization

- strength of competing functionality in their current stack;
- invoice export availability from major vendors;
- prevalence of rebates/GPO pricing that is not visible on invoices;
- extent to which invoices contain information that complicates local-only handling;
- real-world difficulty of product and unit normalization;
- actual dollar value found in a practice of this size;
- frequency needed to create subscription value rather than one-time audit value.

## Kill criteria

Pause or pivot if:

- Modern Dermatology's current tools already provide the same analysis conveniently;
- real invoice data produces little actionable value;
- normalization requires so much manual effort that analysis is uneconomic;
- multiple comparable practices say the problem is not significant;
- users primarily want inventory/procurement features that would require competing head-on with mature systems;
- the product is not materially more useful than dropping a spreadsheet into a general-purpose AI tool.
