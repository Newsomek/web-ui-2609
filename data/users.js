export const demoUsers = [
  {
    id: 'u-purchasing-demo',
    name: 'Demo Purchasing Coordinator',
    role: 'Purchasing Coordinator',
    personaType: 'fictional-operational',
    permissions: ['import_invoices', 'resolve_duplicate', 'resolve_reconciliation', 'manage_reference_data']
  },
  {
    id: 'u-manager-demo',
    name: 'Demo Practice Manager',
    role: 'Practice Manager',
    personaType: 'fictional-operational',
    permissions: ['resolve_duplicate', 'resolve_reconciliation', 'assign_reviews', 'approve_vendor_change', 'manage_reference_data']
  },
  {
    id: 'u-james',
    name: 'James C. Collyer, MD, FAAD',
    role: 'Dermatologist - Co-Founder',
    personaType: 'public-physician-demo-authority',
    permissions: ['approve_product_equivalence', 'approve_vendor_change', 'approve_high_value', 'assign_reviews', 'manage_reference_data']
  },
  {
    id: 'u-heather',
    name: 'Heather D. Rogers, MD, FAAD',
    role: 'Dermatologist / Mohs Surgeon - Co-Founder',
    personaType: 'public-physician-demo-authority',
    permissions: ['approve_product_equivalence', 'approve_vendor_change', 'approve_high_value', 'assign_reviews', 'manage_reference_data']
  },
  {
    id: 'u-carly',
    name: 'Carly J. Roman, MD',
    role: 'Dermatologist',
    personaType: 'public-physician-demo-authority',
    permissions: ['approve_product_equivalence']
  },
  {
    id: 'u-richard',
    name: 'Richard B. Grabowski, MD, FAAD',
    role: 'Dermatologist',
    personaType: 'public-physician-demo-authority',
    permissions: ['approve_product_equivalence']
  },
  {
    id: 'u-robin',
    name: 'Robin Green Whipple, MD, FAAD',
    role: 'Dermatologist',
    personaType: 'public-physician-demo-authority',
    permissions: ['approve_product_equivalence']
  },
  {
    id: 'u-joan',
    name: 'Joan Leavens, MD, FAAD',
    role: 'Dermatologist',
    personaType: 'public-physician-demo-authority',
    permissions: ['approve_product_equivalence']
  }
];

export const permissionLabels = {
  import_invoices: 'Import purchasing data',
  resolve_duplicate: 'Resolve duplicate invoices',
  resolve_reconciliation: 'Resolve invoice discrepancies',
  assign_reviews: 'Assign review work',
  approve_vendor_change: 'Approve vendor changes',
  approve_high_value: 'Approve high-value purchasing actions',
  approve_product_equivalence: 'Approve product equivalence for purchasing analysis',
  manage_reference_data: 'Manage practice dropdown/reference values'
};

export const demoPersonaDisclosure = "Public physician names are used only to tailor the prototype to Modern Dermatology. Purchasing data, operational staff, reviewer permissions, assignments, and decisions are fictional demo content and do not represent the practice's actual internal roles or actions.";
