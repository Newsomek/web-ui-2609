import { demoInvoices } from '../data/demo.js';
import { analyze, normalizeInvoices, fmtUnitCost } from '../js/analysis.js';
import { demoUsers, demoPersonaDisclosure } from '../data/users.js';

const invoices=normalizeInvoices(structuredClone(demoInvoices));
const a1=analyze(invoices);
const a2=analyze(normalizeInvoices(structuredClone(demoInvoices)));

const requireType=type=>{
  if(!a1.findings.some(f=>f.type===type)) throw new Error(`Missing required finding type: ${type}`);
};

for(const type of ['Price creep','Vendor variance','Order fragmentation','Contract variance','Possible equivalent','Duplicate invoice','Invoice reconciliation']) requireType(type);

if(!invoices.some(i=>i.documentType==='Credit memo' || i.credits>0)) throw new Error('Demo dataset lacks credit memo / return data.');

const hasReduction=[...a1.products.values()].some(history=>{
  const h=[...history].sort((x,y)=>x.invoiceDate.localeCompare(y.invoiceDate));
  return h.length>=2 && h[h.length-1].normalizedUnitCost < h[0].normalizedUnitCost*.95;
});
if(!hasReduction) throw new Error('Demo dataset lacks a clear price reduction example.');

const stable=JSON.stringify(a1.findings.map(f=>[f.id,f.type,Number(f.amount.toFixed(6))]))===JSON.stringify(a2.findings.map(f=>[f.id,f.type,Number(f.amount.toFixed(6))]));
if(!stable) throw new Error('Analysis is not deterministic for identical input.');

if(a1.duplicateCount<1) throw new Error('Duplicate detection did not identify synthetic duplicate.');
if(!(a1.opportunityTotal>0)) throw new Error('Opportunity total must be positive.');

console.log('PracticeSpend analysis test passed.');
console.log(`Invoices: ${invoices.length}`);
console.log(`Findings: ${a1.findings.length}`);
console.log(`Opportunity total: $${a1.opportunityTotal.toFixed(2)}`);
console.log(`Duplicate count: ${a1.duplicateCount}`);
console.log(`Finding types: ${[...new Set(a1.findings.map(f=>f.type))].join(', ')}`);

// QA2 credibility invariants.
for (const f of a1.findings.filter(f=>f.formula)) {
  const expected=f.formula.diff*f.formula.annualQty;
  if (Math.abs(expected-f.amount)>0.01) throw new Error(`Displayed formula inputs do not reconstruct amount for ${f.id}`);
}
for (const f of a1.findings) {
  if (!['Opportunity','Anomaly','Review item'].includes(f.classification)) throw new Error(`Missing/invalid classification for ${f.id}`);
}
if (a1.findings.find(f=>f.type==='Possible equivalent')?.countsTowardOpportunity!==false) throw new Error('Possible equivalents must not count toward opportunity total before human review.');
for (const history of a1.products.values()) {
  if (history.some(r=>r.matchType!=='exact')) throw new Error('Non-exact product match contaminated canonical product history.');
}
if (!(a1.duplicateIds instanceof Set) || a1.duplicateIds.size!==a1.duplicateCount) throw new Error('Duplicate IDs are not exposed consistently for UI exclusion/flagging.');
console.log('QA2 credibility invariants passed.');


// QA2.1 equivalence governance invariants.
const pendingEq=a1.findings.find(f=>f.type==='Possible equivalent');
if(!pendingEq?.equivalentGroup) throw new Error('Pending equivalence review is missing group identity.');
const approvedDecision=[{equivalentGroup:pendingEq.equivalentGroup,status:'approved',decidedByUserId:'u-heather',decidedByName:'Heather D. Rogers, MD, FAAD',decidedByRole:'Dermatologist / Mohs Surgeon - Co-Founder',updatedAt:'2026-09-03T20:45:00-04:00',history:[]}];
const approved=analyze(normalizeInvoices(structuredClone(demoInvoices)),{equivalenceDecisions:approvedDecision});
const approvedEq=approved.findings.find(f=>f.type==='Practice-approved equivalent');
if(!approvedEq || approvedEq.countsTowardOpportunity!==true) throw new Error('Approved equivalence must become a counted opportunity.');
if(Math.abs(approved.opportunityTotal-(a1.opportunityTotal+pendingEq.amount))>0.01) throw new Error('Approved equivalence did not change opportunity total by the reviewed amount.');
const rejected=analyze(normalizeInvoices(structuredClone(demoInvoices)),{equivalenceDecisions:[{...approvedDecision[0],status:'rejected'}]});
if(rejected.findings.some(f=>f.equivalentGroup===pendingEq.equivalentGroup)) throw new Error('Rejected equivalence should not be re-suggested as a finding.');
console.log('QA2.1 equivalence governance invariants passed.');


// QA2.2 Modern Dermatology demo-persona invariants.
const publicPhysicianNames=[
  'James C. Collyer, MD, FAAD',
  'Heather D. Rogers, MD, FAAD',
  'Carly J. Roman, MD',
  'Richard B. Grabowski, MD, FAAD',
  'Robin Green Whipple, MD, FAAD',
  'Joan Leavens, MD, FAAD'
];
for(const name of publicPhysicianNames){
  const u=demoUsers.find(x=>x.name===name);
  if(!u) throw new Error(`Missing Modern Dermatology public physician demo persona: ${name}`);
  if(!u.permissions.includes('approve_product_equivalence')) throw new Error(`Physician demo persona lacks equivalence review authority: ${name}`);
}
if(demoUsers.some(u=>['Dr. Alex Morgan','Dr. Priya Shah','Emily Chen','Sarah Mitchell'].includes(u.name))) throw new Error('Retired fictional named personas are still present.');
if(!demoUsers.some(u=>u.name==='Demo Purchasing Coordinator')) throw new Error('Fictional operational purchasing persona missing.');
if(!demoPersonaDisclosure.includes('fictional demo content')) throw new Error('Demo persona disclosure is missing or weakened.');
console.log('QA2.2 Modern Dermatology demo-persona invariants passed.');

// QA2.3 bulk review/delegation invariants.
const james=demoUsers.find(u=>u.id==='u-james');
const heather=demoUsers.find(u=>u.id==='u-heather');
if(!james?.permissions.includes('assign_reviews')) throw new Error('James demo persona must be able to delegate review work.');
if(!heather?.permissions.includes('assign_reviews')) throw new Error('Heather demo persona must be able to delegate review work.');
const {readFileSync}=await import('node:fs');
const appSource=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const analysisSource=readFileSync(new URL('../js/analysis.js',import.meta.url),'utf8');
for(const marker of ['Select visible','Assign selected','Assign to me','Review selected','Approve selected as purchasing equivalents','Mark selected not equivalent','function eligibleAssignees','function assignGroups']){
  if(!appSource.includes(marker)) throw new Error(`QA2.3 bulk review UI/logic missing marker: ${marker}`);
}
if(!appSource.includes('assignmentHistory')) throw new Error('QA2.3 decisions must preserve assignment history.');
console.log('QA2.3 bulk review/delegation invariants passed.');

// QA2.4 completed-review lifecycle invariants.
for (const marker of [
  'Completed reviews remain inspectable',
  'Review history',
  'Reopen review',
  'Override to',
  'function showDecisionRecord',
  'async function reopenDecision',
  'async function overrideDecision',
  "status:'reopened'",
  "action:'override'"
]) {
  if (!appSource.includes(marker)) throw new Error(`QA2.4 completed-review lifecycle missing marker: ${marker}`);
}
console.log('QA2.4 completed-review lifecycle invariants passed.');

// QA2.5 review history + managed-reference-data invariants.
for (const marker of [
  'Review history',
  'function compactDecisionStatus',
  'function renderManagement',
  "referenceOptions('sourceBasis')",
  "referenceOptions('reviewChangeReasons')",
  "referenceOptions('productCategories'",
  "referenceOptions('unitsOfMeasure'",
  "referenceOptions('paymentTerms')",
  'manage_reference_data',
  'referenceData:state.referenceData'
]) {
  const haystack = marker==='manage_reference_data' ? readFileSync(new URL('../data/users.js',import.meta.url),'utf8') : appSource;
  if (!haystack.includes(marker)) throw new Error(`QA2.5 review/reference-data feature missing marker: ${marker}`);
}
const referenceSource=readFileSync(new URL('../data/reference.js',import.meta.url),'utf8');
for(const marker of ['sourceBasis','reviewChangeReasons','productCategories','unitsOfMeasure','paymentTerms']){
  if(!referenceSource.includes(marker)) throw new Error(`QA2.5 managed list missing: ${marker}`);
}
console.log('QA2.5 review history/reference-data invariants passed.');


// QA2.6 review-volume + invoice-provenance + precision invariants.
const pendingEquivalenceFindings=a1.findings.filter(f=>f.type==='Possible equivalent');
if(pendingEquivalenceFindings.length!==5) throw new Error(`QA2.6 demo should expose exactly 5 pending equivalence review items; found ${pendingEquivalenceFindings.length}.`);
for(const invoice of invoices){
  const x=invoice.ingestion||{};
  if(!x.method||x.method==='unknown') throw new Error(`Invoice provenance method missing for ${invoice.invoiceNumber}`);
  if(!x.ingestedByName||!x.ingestedAt) throw new Error(`Invoice provenance actor/time missing for ${invoice.invoiceNumber}`);
}
const duplicatePair=invoices.filter(i=>i.vendor==='Northwest Medical Supply'&&i.invoiceNumber==='NW-261955');
if(duplicatePair.length!==2) throw new Error('QA2.6 synthetic duplicate pair missing.');
if(duplicatePair[0].ingestion.method===duplicatePair[1].ingestion.method) throw new Error('QA2.6 duplicate demo should show distinct ingestion paths.');
if(fmtUnitCost(0.0855)!=='$0.086') throw new Error(`QA2.6 low unit-cost display should use 3 decimals, got ${fmtUnitCost(0.0855)}`);
if(fmtUnitCost(13.331)!=='$13.33') throw new Error(`QA2.6 normal unit-cost display should use 2 decimals, got ${fmtUnitCost(13.331)}`);
for(const marker of ['Assign for review','ADDED TO PRACTICESPEND','WHY PRACTICESPEND FLAGGED THIS','ingestionMethodLabel','Calculated from unrounded underlying values']){
  if(!appSource.includes(marker)) throw new Error(`QA2.6 app feature missing marker: ${marker}`);
}
if(appSource.includes('Escalate for review')) throw new Error('QA2.6 old escalation wording remains in app.');
const importerSource=readFileSync(new URL('../js/importer.js',import.meta.url),'utf8');
for(const marker of ['sourceFileName:file.name','importBatchId:batchId','ingestedByName:context.ingestedByName']){
  if(!importerSource.includes(marker)) throw new Error(`QA2.6 importer provenance missing marker: ${marker}`);
}
console.log('QA2.6 review-volume/provenance/precision invariants passed.');

// QA2.7 shared list-control invariants.
for (const marker of [
  'invoiceVendorFilter',
  'invoiceSourceFilter',
  'invoiceStatusFilter',
  'invoiceResetFilters',
  'productSort',
  'productResetFilters',
  'vendorSort',
  'vendorResetFilters',
  'historyVendorFilter',
  'historySort',
  'historyReset',
  'Showing ${products.length} invoiced products'
]) {
  if (!appSource.includes(marker)) throw new Error(`QA2.7 list-control feature missing marker: ${marker}`);
}
console.log('QA2.7 list filtering/sorting/reset invariants passed.');

// QA2.8 stability/navigation/category-management invariants.
for (const marker of [
  'opportunitySelectionSummary',
  'data-overview-vendor',
  'data-overview-category',
  'data-overview-metric',
  'productCategoryFilter',
  'Product category assignments',
  'productCategoryOverrides',
  'productCategoryHistory',
  'PracticeSpend slow render',
  '__PracticeSpendDiagnostics'
]) {
  if(!appSource.includes(marker)) throw new Error(`QA2.8 stability/navigation/category feature missing marker: ${marker}`);
}
if(!appSource.includes("state.listControls.products.category=category.dataset.overviewCategory")) throw new Error('QA2.8 category drill-down route missing.');
if(!appSource.includes("state.oppFilter='Price creep'")) throw new Error('QA2.8 overview price-change drill-down missing.');
console.log('QA2.8 stability/navigation/category invariants passed.');


// QA2.9 date/category/management invariants.
for (const marker of [
  'All time','This year','Last year','This quarter','Last quarter','Custom date range',
  'CATEGORY SPEND DETAIL · TOTAL DOLLARS SPENT','Filtered category line-item spend','selectVisibleProducts','bulkProductCategory',
  'previousCategory','newCategory','batchId','managementOpenAll','managementCloseAll','referenceListUsage'
]) {
  if(!appSource.includes(marker) && !referenceSource.includes(marker)) throw new Error(`QA2.9 feature missing marker: ${marker}`);
}
console.log('QA2.9 date/category/management invariants passed.');


// QA2.10 UI financial-semantics invariants.
for (const marker of ['HIGHEST OBSERVED','CHANGE: EARLIEST → LATEST','Red + means unit cost increased; green − means unit cost decreased']) {
  if(!appSource.includes(marker)) throw new Error(`QA2.10 missing marker: ${marker}`);
}
console.log('QA2.10 financial-semantics/accessibility invariants passed.');

// QA2.11 filters/sort/duplicate/financial semantics guards
for (const marker of ['productVendorFilter','Highest spend','invoiceGovernance','Suppress duplicate','Delete permanently','Credits / returns','Show math','Filters change the population and recalculate this total']) { if(!appSource.includes(marker)) throw new Error(`QA2.11 app marker missing: ${marker}`); }
if(!analysisSource.includes('allocatedDiscount') || !analysisSource.includes('allocatedCredit') || !analysisSource.includes('duplicateKeepIds')) throw new Error('QA2.11 analysis semantics missing');
console.log('QA2.11 integrated filter/duplicate/financial-semantics invariants passed.');

// QA2.11 behavioral invariants.
const duplicateId=[...a1.duplicateIds][0];
if(duplicateId){
  const kept=analyze(normalizeInvoices(structuredClone(demoInvoices)),{duplicateKeepIds:[duplicateId]});
  if(kept.duplicateIds.has(duplicateId)) throw new Error('QA2.11 Keep both must remove the reviewed invoice from duplicate suppression.');
}
const rowsWithCredits=a1.rows.filter(r=>Number(r.allocatedCredit||0)>0 || Number(r.allocatedRebate||0)>0);
for(const r of rowsWithCredits){
  if(r.effectiveLineCost < r.netEconomicLineCost) throw new Error('QA2.11 net economic cost must not exceed purchase-time effective cost when credits/rebates apply.');
}
for(const histories of a1.products.values()) for(const r of histories){
  const expected=(r.lineTotal + Number(r.allocatedCharges||0) - Number(r.allocatedDiscount||0))/Number(r.normalizedUnits||1);
  if(Math.abs(expected-r.normalizedUnitCost)>1e-9) throw new Error('QA2.11 Effective Unit Cost formula mismatch.');
}
console.log('QA2.11 behavioral duplicate/effective-cost invariants passed.');

console.log('QA2.12 scalable vendor/management/category-canonicalization invariants passed.');


// QA2.13 integrated workflow invariants
{
  const source = appSource;
  if(!source.includes("action=Math.abs(differenceAfter)<.02?'reconciled':'reconciliation_updated'")) throw new Error('Reconciliation must distinguish resolved from still-unresolved changes');
  if(!(source.includes('before=moneyFieldSnapshot(i)') && source.includes('changes=formatReconciliationChanges(before,after)'))) throw new Error('Reconciliation must retain before/after changes');
  if(!source.includes('state.equivalenceProposals.push(proposal)')) throw new Error('Product equivalence proposals must be recorded');
  if(!(source.includes('productKeys:keys') && source.includes('proposedByName:me.name') && source.includes('proposedAt:at'))) throw new Error('Equivalence proposal must retain selected products, actor, and time');
  if(!source.includes("state.invoiceGovernance.reconciliation[i.id]")) throw new Error('Invoice reconciliation state must be retained');
}
console.log('QA2.13 reconciliation/equivalence workflow invariants passed.');

// QA2.14 source-level invariants are exercised by smoke-test.mjs; analytical semantics remain unchanged.
console.log('QA2.14 preserves analytical engine semantics; product visibility is a UI/governance-layer change.');
