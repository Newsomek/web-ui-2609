# PracticeSpend — Analysis Engine

## Principle

Financial conclusions should be deterministic and explainable. AI may assist with messy-document extraction or product matching later, but it should not invent savings values or silently declare products equivalent.

## Required prototype analyses

### 1. Price Creep

Detect increases in Effective Unit Cost for the same product over time.

Outputs:

- prior price;
- current price;
- percentage change;
- absolute change;
- transaction history;
- annualized impact based on observed historical quantity.

### 2. Exact Vendor Price Variance

Compare the same exact product/SKU across vendors.

Confidence: `Verified` when exact identity is known.

### 3. Equivalent / Possible Alternative

Surface potential alternatives without representing them as interchangeable.

Labels:

- Exact match — Verified
- Equivalent — Human confirmation required
- Possible alternative — Review required

### 4. Effective Unit Cost

Preferred purchase-time comparison metric:

`line merchandise after line discount + allocated shipping/handling/fees - allocated invoice/volume discount = effective purchase cost`

`effective purchase cost / normalized units = effective unit cost`

Invoice-level allocations use each line's share of merchandise value unless another explicit rule is configured. The UI must expose the math and retain full precision internally.

Credits/returns and rebates are separate adjustment events. They affect eventual net economic cost but are not silently relabeled as purchase discounts or folded into purchase-time Effective Unit Cost.

`effective purchase cost - applicable credits/returns - applicable rebates = net economic cost`

### 5. Invoice Reconciliation

Compare line totals and invoice-level charges against stated invoice total.

Flag discrepancies beyond an allowed rounding tolerance.

### 6. Duplicate Invoice Detection

Flag exact and high-confidence near duplicates.

### 7. Contract Price Variance

When a contract/agreed price exists:

`invoice effective price - agreed price = possible discrepancy`

Do not call it an overcharge until reviewed.

### 8. Order Fragmentation

Identify patterns of repeated small orders, shipping/handling expense, and potential threshold misses.

### 9. Spend Concentration

- spend by vendor;
- spend by category;
- spend by product;
- top-N contribution;
- vendor dependence.

### 10. Purchasing Anomaly

After sufficient history, identify purchases materially outside the practice's normal pattern:

- unusual quantity;
- unusual frequency;
- unusual price;
- unusual vendor;
- sudden fee changes.

## Savings / opportunity terminology

Never present uncertain calculations as guaranteed savings.

Preferred language:

- `Potential annualized opportunity`
- `Possible pricing discrepancy`
- `Observed price difference`
- `Review recommended`

Confidence categories:

### Verified

Based on exact products and directly observed data with no unresolved equivalency assumption.

### Strong

Very likely comparable, but packaging normalization, rebate assumptions, or another non-trivial assumption exists.

### Potential

Requires human review, product-equivalence validation, or additional information.

## Annualization rules

Annualized results must show:

- observation period;
- actual observed quantity;
- annualization formula;
- any extrapolation assumption.

Do not annualize very short datasets without explicitly labeling the limitation.

## Analysis auditability

Every finding must retain:

- source invoice(s);
- source invoice line(s);
- normalized product identity;
- calculation formula;
- assumptions;
- confidence;
- generated timestamp/version of rule.
