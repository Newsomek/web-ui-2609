import { readFileSync } from 'node:fs';
const files=['index.html','css/styles.css','js/app.js','js/analysis.js','js/storage.js','js/importer.js','data/demo.js','data/users.js','data/reference.js','README.md'];
for(const f of files){const s=readFileSync(new URL(`../${f}`,import.meta.url),'utf8');if(!s.trim())throw new Error(`${f} empty`);}
console.log('PracticeSpend smoke test: required files present and non-empty.');

const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const users=readFileSync(new URL('../data/users.js',import.meta.url),'utf8');
if(!index.includes('data-nav="reviews"')) throw new Error('Reviews navigation missing.');
if(!index.includes('data-nav="management"')) throw new Error('Management navigation missing.');
if(!app.includes('function renderReviews')) throw new Error('Reviews implementation missing.');
if(!app.includes('function renderManagement')) throw new Error('Management implementation missing.');
if(!app.includes('Review history')) throw new Error('Review history UI missing.');

if(!app.includes('ADDED TO PRACTICESPEND')) throw new Error('Invoice provenance UI missing.');
if(!app.includes('Assign for review')) throw new Error('Assign-for-review terminology missing.');
if(!users.includes('James C. Collyer, MD, FAAD') || !users.includes('Heather D. Rogers, MD, FAAD')) throw new Error('Modern Dermatology physician demo personas missing.');
console.log('PracticeSpend UI/persona smoke checks passed.');

// QA2.7.1 browser-startup regression guard
if (!app.includes('function renderVendors(){\n  const a=analysis();')) {
  throw new Error('QA2.7.1: multiline renderVendors implementation missing');
}
console.log('QA2.7.1 browser-startup regression guard passed.');

// QA2.8 persistent-listener regression guard.
if(!app.includes('function installGlobalDelegatedEvents')) throw new Error('QA2.8 delegated event installer missing.');
if(!app.includes('function bindView(){}')) throw new Error('QA2.8 bindView must not re-register persistent listeners.');
if(app.includes("document.querySelectorAll('.site-header [data-nav]').forEach(b=>b.addEventListener")) throw new Error('QA2.8 old accumulating header listener pattern remains.');
const globalClickRegistrations=(app.match(/document\.addEventListener\('click'/g)||[]).length;
if(globalClickRegistrations!==1) throw new Error(`QA2.8 expected exactly one delegated document click listener; found ${globalClickRegistrations}.`);
console.log('QA2.8 listener-lifecycle regression guard passed.');


// QA2.9 date/category/management regression guards
for (const marker of ['dateFilterControls','bindDateFilterControls','applyProductCategoryChanges','managementStateKey','sessionStorage','CATEGORY SPEND DETAIL · TOTAL DOLLARS SPENT','selectVisibleProducts']) {
  if(!app.includes(marker)) throw new Error(`QA2.9 missing app marker: ${marker}`);
}
console.log('QA2.9 date/category/management smoke guards passed.');

// QA2.10 financial semantics/accessibility regression guards
for (const marker of ['signedPct','costChangeHtml','Highest observed','Change: Earliest → Latest','Effective unit cost','CATEGORY SPEND DETAIL · TOTAL DOLLARS SPENT','PRODUCT UNIT-COST HISTORY']) {
  if(!app.includes(marker)) throw new Error(`QA2.10 missing financial-semantics marker: ${marker}`);
}
if(app.includes('Normalized landed unit cost') || app.includes('Highest landed cost') || app.includes('Lowest landed cost')) throw new Error('QA2.10 user-facing landed-cost terminology remains.');
if(!app.includes("n>0?'+'") || !app.includes("n<0?'−'")) throw new Error('QA2.10 signed percent indicators missing.');
console.log('QA2.10 financial-semantics/accessibility smoke guards passed.');

// QA2.12 scalable vendor/reference-data regression guards.
{
  const appQa212 = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
  const usersQa212 = readFileSync(new URL('../data/users.js', import.meta.url), 'utf8');
  const referenceQa212 = readFileSync(new URL('../data/reference.js', import.meta.url), 'utf8');
  if(!/class="data-table vendor-table"/.test(appQa212)) throw new Error('QA2.12 Vendors should render as a scalable table.');
  if(!/Vendor Z-A/.test(appQa212)) throw new Error('QA2.12 Vendor Z-A sort should be present.');
  if(!/Product Z-A/.test(appQa212)) throw new Error('QA2.12 Product Z-A sort should be present.');
  if(!/vendor_desc/.test(appQa212)) throw new Error('QA2.12 product-history Vendor Z-A sorter should be implemented.');
  if(!/function normalizeReferenceData\(/.test(appQa212)) throw new Error('QA2.12 reference-data normalization should be implemented.');
  if(!/Demo Purchasing Coordinator[\s\S]*manage_reference_data/.test(usersQa212)) throw new Error('QA2.12 demo purchasing coordinator should be able to exercise Management.');
  if(!/'Medical Supplies'/.test(referenceQa212)) throw new Error('QA2.12 canonical category casing should match invoice data.');
  if(/'Medical supplies'/.test(referenceQa212)) throw new Error('QA2.12 duplicate category casing should be removed.');
  console.log('QA2.12 vendor/management/category-normalization smoke guards passed.');
}


// QA2.13 reconciliation/equivalence/import/footer guards
const app13 = readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const importer13 = readFileSync(new URL('../js/importer.js',import.meta.url),'utf8');
const index13 = readFileSync(new URL('../index.html',import.meta.url),'utf8');
if(!app13.includes('RECONCILIATION WORKFLOW')) throw new Error('QA2.13 requires invoice reconciliation workflow');
if(!(app13.includes('Send to review') && app13.includes('Approve now'))) throw new Error('QA2.13 requires product equivalence proposal actions');
if(!(importer13.includes('Credits / Returns') && importer13.includes('Invoice Discount') && importer13.includes('Field Guide'))) throw new Error('QA2.13 import template must separate discounts/credits and include guidance');
if(!(index13.includes('Copyright 2026 - ') && index13.includes('Michael Kelly Newsome') && index13.includes('mailto:Kelly@Newsome.com?subject=PracticeSpend%20Inquiry'))) throw new Error('QA2.13 footer copyright/mail link missing');
console.log('QA2.13 reconciliation/equivalence/import/footer smoke guards passed.');

// QA2.14 invoiced-product/equivalence guards
if (!app.includes('allProductHistories')) throw new Error('QA2.14: Products must be built from all invoiced product observations.');
if (!app.includes('productRelationshipFilter')) throw new Error('QA2.14: Products relationship filter missing.');
if (!app.includes('Possible equivalents')) throw new Error('QA2.14: Possible-equivalents filter missing.');
if (!app.includes('Every distinct invoiced product remains visible')) throw new Error('QA2.14: invoiced-product visibility rule missing.');
if (!app.includes('<th>Relationship</th>')) throw new Error('QA2.14: Products relationship column missing.');
console.log('QA2.14 invoiced-product/equivalence smoke guards passed.');

// QA2.14.1 restricted-demo footer guard.
const indexSource2141 = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
for (const marker of ['Restricted Demo for Dr. James C. Collyer and Dr. Heather D. Rogers of Modern Dermatology, PLLC','mailto:Kelly@Newsome.com?subject=PracticeSpend%20Inquiry']) {
  if (!indexSource2141.includes(marker)) throw new Error(`QA2.14.1 footer marker missing: ${marker}`);
}
console.log('QA2.14.1 restricted-demo footer guard passed.');

// QA2.15 deployment-hardening guards.
{
  const fs = await import('node:fs');
  const indexText = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  if (!indexText.includes('noindex,nofollow,noarchive,nosnippet,noimageindex')) {
    throw new Error('QA2.15 missing noindex deployment directive.');
  }
  if (!indexText.includes('Restricted Demo for Dr. James C. Collyer and Dr. Heather D. Rogers of Modern Dermatology, PLLC')) {
    throw new Error('QA2.15 missing restricted-demo identification.');
  }
  const robots = fs.readFileSync(new URL('../robots.txt', import.meta.url), 'utf8');
  if (!robots.includes('Disallow: /')) {
    throw new Error('QA2.15 robots.txt must discourage indexing.');
  }
  const workflow = fs.readFileSync(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  for (const required of ['Build restricted public surface', 'actions/upload-pages-artifact@v3', 'actions/deploy-pages@v4']) {
    if (!workflow.includes(required)) throw new Error(`QA2.15 Pages workflow missing: ${required}`);
  }
  console.log('QA2.15 deployment-hardening smoke guards passed.');
}

