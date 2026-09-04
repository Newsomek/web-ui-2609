export const defaultReferenceData = {
  sourceBasis: [
    'Manufacturer specifications',
    'Vendor / distributor confirmation',
    'Physician review',
    'Practice purchasing history',
    'Contract / GPO documentation',
    'Product labeling / packaging',
    'Other / not listed'
  ],
  reviewChangeReasons: [
    'New information received',
    'Product specification changed',
    'Vendor or manufacturer clarification',
    'Practice policy changed',
    'Prior decision entered in error',
    'Periodic re-review',
    'Other / not listed'
  ],
  productCategories: [
    'Medical Supplies',
    'Procedure Supplies',
    'Injectables',
    'Retail Skincare',
    'Office Supplies',
    'Uncategorized'
  ],
  unitsOfMeasure: ['unit', 'box', 'case', 'pack', 'vial', 'syringe', 'bottle', 'tube'],
  paymentTerms: ['Due on receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Other / not listed']
};

export const referenceListLabels = {
  sourceBasis: 'Source / basis',
  reviewChangeReasons: 'Review change reasons',
  productCategories: 'Product categories',
  unitsOfMeasure: 'Units of measure',
  paymentTerms: 'Payment terms'
};

export const referenceListUsage = {
  sourceBasis: 'Controls Reviews → Source / basis and Review history display.',
  reviewChangeReasons: 'Controls Reopen Review and Override Decision → Reason dropdowns.',
  productCategories: 'Controls Products → Category filter, bulk assignment, Product detail, Category View, Management assignments, and Manual Invoice Entry → Category.',
  unitsOfMeasure: 'Controls Manual Invoice Entry → Unit of measure and normalization entry values.',
  paymentTerms: 'Controls Manual Invoice Entry → Payment terms.'
};
