# PracticeSpend — Data Model and Invoice Schema

## Design principle

All data sources must normalize into the same canonical model. Manual entry, CSV, XLSX, future PDF extraction, and future vendor integrations must not create separate analytical paths.

## Core entities

### Organization

Future-ready ownership boundary.

Fields:

- organization_id
- organization_name
- created_at
- currency
- status

### Location

Optional in prototype but supported structurally.

- location_id
- organization_id
- name
- address fields
- cost_center / department

### Vendor

- vendor_id
- organization_id
- vendor_name
- vendor_account_number
- contact_name
- sales_rep
- phone
- email
- website
- notes

### Invoice

Invoice header fields should support the fields commonly found on medical-supply/vendor invoices.

- invoice_id
- organization_id
- location_id
- vendor_id
- vendor_name_raw
- vendor_account_number
- invoice_number
- invoice_date
- order_date
- ship_date
- due_date
- purchase_order_number
- sales_order_number
- customer_number
- salesperson_rep
- payment_terms
- currency
- bill_to_name
- bill_to_address_1
- bill_to_address_2
- bill_to_city
- bill_to_state
- bill_to_postal_code
- ship_to_name
- ship_to_address_1
- ship_to_address_2
- ship_to_city
- ship_to_state
- ship_to_postal_code
- attention
- subtotal
- shipping_freight
- handling
- fuel_surcharge
- hazmat_fee
- other_fees
- discounts_total
- credits_total
- rebates_shown
- tax_total
- prior_balance
- amount_paid
- invoice_total
- amount_due
- source_type: demo | csv | xlsx | manual | future_pdf | integration
- source_filename
- created_at
- notes

### InvoiceLine

- invoice_line_id
- invoice_id
- line_number
- vendor_sku
- manufacturer_sku
- manufacturer
- upc_gtin
- raw_description
- normalized_product_id
- category
- subcategory
- quantity_ordered
- quantity_shipped
- quantity_backordered
- unit_of_measure
- package_size
- package_count
- units_per_package
- normalized_unit_quantity
- list_price
- unit_price
- discount_percent
- discount_amount
- contract_price_shown
- extended_line_total
- taxable
- line_tax
- rebate_amount
- credit_amount
- lot_number
- expiration_date
- notes

### Product

The normalized product identity is central to PracticeSpend.

- product_id
- canonical_name
- manufacturer
- manufacturer_sku
- upc_gtin
- category
- subcategory
- size
- strength_or_concentration
- unit_of_measure
- normalized_unit_definition
- active

### ProductAlias

Maps messy descriptions/vendor SKUs to normalized products.

- alias_id
- product_id
- vendor_id
- vendor_sku
- raw_description
- match_type: exact | equivalent | possible
- confidence_score
- reviewed_by_user

### PriceObservation

Derived from invoice lines.

- observation_id
- organization_id
- product_id
- vendor_id
- invoice_id
- invoice_line_id
- observation_date
- gross_unit_cost
- normalized_unit_cost
- allocated_shipping
- allocated_fees
- allocated_discount
- allocated_rebate
- allocated_credit
- effective_unit_cost
- net_economic_unit_cost

### ContractPrice

Optional now, high-value later.

- contract_price_id
- vendor_id
- product_id
- agreed_price
- effective_date
- expiration_date
- volume_threshold
- notes

### Credit / Return

A credit/return is a separate adjustment event, not a discount. It must remain traceable to the original purchase when known so purchase-time unit cost and eventual net economic cost are not conflated.

- adjustment_id
- vendor_id
- original_invoice_id
- original_invoice_line_id
- credit_memo_number
- adjustment_type
- amount
- product_id
- quantity
- date
- notes

### Finding

- finding_id
- organization_id
- finding_type
- title
- description
- observed_amount
- annualized_amount
- confidence: verified | strong | potential
- severity / priority
- status
- calculation_json
- supporting_record_ids
- created_at

## Manual invoice entry requirements

Only a small subset should be required:

- vendor;
- invoice number;
- invoice date;
- at least one item description;
- quantity;
- unit price or line total.

All other invoice fields should be available under expandable details.

The form should automatically calculate totals and flag reconciliation differences.

## Duplicate invoice logic

At minimum:

- exact vendor + invoice number;
- near duplicate: same vendor, date, total, and highly similar line items.
