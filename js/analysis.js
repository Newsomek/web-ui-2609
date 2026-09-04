const money = n => Number.isFinite(n) ? n : 0;
export const fmtMoney = n => money(n).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
export const fmtMoney2 = n => { const v=Math.abs(money(n))<0.0000001?0:money(n); return v.toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}); };
export const fmtUnitCost = n => { const v=Math.abs(money(n))<0.0000001?0:money(n); const digits=Math.abs(v)<1?3:2; return v.toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits:digits,maximumFractionDigits:digits}); };
export const fmtPct = n => `${money(n).toFixed(1)}%`;
export const dateFmt = s => { try{return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${s}T00:00:00Z`));}catch{return s;} };

function finiteOr(value, fallback=0){ const n=Number(value); return Number.isFinite(n)?n:fallback; }

export function normalizeInvoices(raw){
  return raw.map((inv,idx)=>{
    const lines=(inv.lines||[]).map((l,i)=>({
      id:l.id||`${inv.id||idx}-line-${i+1}`,
      sku:String(l.sku||l.itemNumber||'').trim(),
      manufacturerSku:String(l.manufacturerSku||'').trim(),
      manufacturer:String(l.manufacturer||'').trim(),
      upc:String(l.upc||l.upcGtin||'').trim(),
      description:String(l.description||'Unnamed item').trim(),
      category:String(l.category||'Uncategorized').trim(),
      subcategory:String(l.subcategory||'').trim(),
      qty:finiteOr(l.qty||l.quantity,0),
      qtyOrdered:finiteOr(l.qtyOrdered||l.quantityOrdered,l.qty||l.quantity||0),
      qtyBackordered:finiteOr(l.qtyBackordered||l.quantityBackordered,0),
      uom:String(l.uom||'unit').trim(),
      packSize:Math.max(finiteOr(l.packSize||l.unitsPerPackage,1),1),
      packageCount:Math.max(finiteOr(l.packageCount,1),1),
      listPrice:finiteOr(l.listPrice,0),
      unitPrice:finiteOr(l.unitPrice,0),
      discountPercent:finiteOr(l.discountPercent,0),
      lineDiscount:finiteOr(l.lineDiscount||l.discountAmount,0),
      contractPriceShown:finiteOr(l.contractPriceShown||l.contractPrice,0),
      lineTax:finiteOr(l.lineTax,0),
      rebateAmount:finiteOr(l.rebateAmount,0),
      creditAmount:finiteOr(l.creditAmount,0),
      lotNumber:String(l.lotNumber||'').trim(),
      expirationDate:String(l.expirationDate||'').trim(),
      taxable:!!l.taxable,
      notes:String(l.notes||'').trim(),
      equivalentGroup:String(l.equivalentGroup||'').trim(),
      matchType:String(l.matchType||'exact').trim().toLowerCase(),
      lineTotal:finiteOr(l.lineTotal,0) || Math.max(0,finiteOr(l.qty||l.quantity,0)*finiteOr(l.unitPrice,0)-finiteOr(l.lineDiscount||l.discountAmount,0))
    }));
    const subtotal=lines.reduce((s,l)=>s+l.lineTotal,0);
    const shipping=finiteOr(inv.shipping||inv.shippingFreight,0), handling=finiteOr(inv.handling,0), tax=finiteOr(inv.tax||inv.taxTotal,0), discount=finiteOr(inv.discount||inv.discountsTotal,0), credits=finiteOr(inv.credits||inv.creditsTotal,0), rebates=finiteOr(inv.rebates||inv.rebatesShown,0), otherFees=finiteOr(inv.otherFees,0), fuelSurcharge=finiteOr(inv.fuelSurcharge,0), hazmatFee=finiteOr(inv.hazmatFee,0);
    const calculatedTotal=subtotal+shipping+handling+tax+otherFees+fuelSurcharge+hazmatFee-discount-credits-rebates;
    const statedRaw=inv.invoiceTotal;
    const hasStated=statedRaw!==undefined&&statedRaw!==null&&String(statedRaw).trim()!=='';
    const ingestionRaw=inv.ingestion||{};
    const ingestion={
      method:String(ingestionRaw.method||'unknown').trim(),
      ingestedByUserId:String(ingestionRaw.ingestedByUserId||'').trim(),
      ingestedByName:String(ingestionRaw.ingestedByName||'Unknown').trim(),
      ingestedAt:String(ingestionRaw.ingestedAt||'').trim(),
      sourceFileName:String(ingestionRaw.sourceFileName||'').trim(),
      sourceSystem:String(ingestionRaw.sourceSystem||'').trim(),
      importBatchId:String(ingestionRaw.importBatchId||'').trim(),
      originalDocumentId:String(ingestionRaw.originalDocumentId||inv.invoiceNumber||'').trim()
    };
    return {
      ...inv,
      id:inv.id||`inv-${Date.now()}-${idx}`,
      vendor:String(inv.vendor||'Unknown Vendor').trim(),
      invoiceNumber:String(inv.invoiceNumber||`UNNUMBERED-${idx+1}`),
      invoiceDate:inv.invoiceDate||new Date().toISOString().slice(0,10),
      documentType:String(inv.documentType||'Invoice'),
      ingestion,
      lines,subtotal,shipping,handling,tax,discount,credits,rebates,otherFees,fuelSurcharge,hazmatFee,calculatedTotal,
      invoiceTotal:hasStated?finiteOr(statedRaw,calculatedTotal):calculatedTotal
    };
  });
}

function keyFor(line){ return (line.manufacturerSku||line.sku||line.description.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()); }
function annualization(history, unitSelector=r=>r.qty*r.packSize){
  if(!history.length) return {observedQty:0,days:0,years:0,annualQty:0};
  const sorted=[...history].sort((a,b)=>a.invoiceDate.localeCompare(b.invoiceDate));
  const days=Math.max(90,(new Date(sorted[sorted.length-1].invoiceDate)-new Date(sorted[0].invoiceDate))/86400000);
  const observedQty=sorted.reduce((s,r)=>s+unitSelector(r),0);
  const years=days/365;
  return {observedQty,days,years,annualQty:observedQty/years};
}
function annualizedQuantity(history, unitSelector=r=>r.qty*r.packSize){ return annualization(history,unitSelector).annualQty; }

export function analyze(invoices, options={}){
  const equivalenceDecisions = Array.isArray(options.equivalenceDecisions) ? options.equivalenceDecisions : [];
  const duplicateKeepIds = new Set(Array.isArray(options.duplicateKeepIds) ? options.duplicateKeepIds : []);
  const decisionByGroup = new Map(equivalenceDecisions.map(d=>[d.equivalentGroup,d]));
  const rows=[]; const vendors=new Map(); const cats=new Map(); const products=new Map();
  const duplicateIds=new Set(); const findings=[];

  // Exact duplicate detection: same vendor + invoice number. Keep the first in spend analysis and flag later copies.
  const invoiceKeys=new Map();
  for(const inv of invoices){
    const key=`${inv.vendor.toLowerCase()}|${inv.invoiceNumber.toLowerCase()}`;
    if(invoiceKeys.has(key) && !duplicateKeepIds.has(inv.id)){
      const original=invoiceKeys.get(key); duplicateIds.add(inv.id);
      findings.push({
        id:`duplicate-${inv.id}`, type:'Duplicate invoice', title:`${inv.vendor} · ${inv.invoiceNumber}`,
        amount:Math.abs(inv.calculatedTotal), amountLabel:'possible duplicate exposure', confidence:'Verified', countsTowardOpportunity:false,
        summary:'The same vendor and invoice number appears more than once. The later copy is excluded from analyzed spend until reviewed.',
        calculation:[
          {label:'Original invoice',value:original.invoiceNumber},
          {label:'Duplicate invoice',value:inv.invoiceNumber},
          {label:'Amount to review',value:fmtMoney2(Math.abs(inv.calculatedTotal))}
        ], evidence:[
          {invoiceId:original.id,invoiceNumber:original.invoiceNumber,invoiceDate:original.invoiceDate,vendor:original.vendor,description:'Original occurrence'},
          {invoiceId:inv.id,invoiceNumber:inv.invoiceNumber,invoiceDate:inv.invoiceDate,vendor:inv.vendor,description:'Later occurrence'}
        ]
      });
    } else invoiceKeys.set(key,inv);
  }

  let spend=0, lineCount=0;
  for(const inv of invoices){
    if(duplicateIds.has(inv.id)) continue;
    spend+=inv.calculatedTotal; lineCount+=inv.lines.length;
    vendors.set(inv.vendor,(vendors.get(inv.vendor)||0)+inv.calculatedTotal);
    const allocDen=inv.lines.reduce((s,l)=>s+l.lineTotal,0)||1;
    for(const line of inv.lines){
      cats.set(line.category,(cats.get(line.category)||0)+line.lineTotal);
      const key=keyFor(line);
      const share=line.lineTotal/allocDen;
      const allocatedCharges=share*(inv.shipping+inv.handling+inv.otherFees+inv.fuelSurcharge+inv.hazmatFee);
      const allocatedDiscount=share*inv.discount;
      const allocatedCredit=share*inv.credits + line.creditAmount;
      const allocatedRebate=share*inv.rebates + line.rebateAmount;
      const effectiveLineCost=line.lineTotal+allocatedCharges-allocatedDiscount;
      const normalizedUnits=Math.max(line.qty,1)*Math.max(line.packSize,1);
      const normalizedUnitCost=effectiveLineCost/normalizedUnits;
      const netEconomicLineCost=effectiveLineCost-allocatedCredit-allocatedRebate;
      const row={invoiceId:inv.id,invoiceNumber:inv.invoiceNumber,invoiceDate:inv.invoiceDate,vendor:inv.vendor,key,...line,allocatedCharges,allocatedDiscount,allocatedCredit,allocatedRebate,effectiveLineCost,netEconomicLineCost,normalizedUnits,normalizedUnitCost};
      rows.push(row); if(line.matchType==='exact'){ if(!products.has(key))products.set(key,[]); products.get(key).push(row); }
    }
    const reconciliationDiff=inv.invoiceTotal-inv.calculatedTotal;
    if(Math.abs(reconciliationDiff)>=0.02){
      findings.push({
        id:`reconcile-${inv.id}`,type:'Invoice reconciliation',title:`${inv.vendor} · ${inv.invoiceNumber}`,
        amount:Math.abs(reconciliationDiff),amountLabel:'reconciliation difference',confidence:'Verified',countsTowardOpportunity:false,
        summary:'The stated invoice total does not match the total reconstructed from line items and invoice-level charges.',
        calculation:[
          {label:'Calculated total',value:fmtMoney2(inv.calculatedTotal)},
          {label:'Stated invoice total',value:fmtMoney2(inv.invoiceTotal)},
          {label:'Difference',value:fmtMoney2(Math.abs(reconciliationDiff))}
        ],evidence:[{invoiceId:inv.id,invoiceNumber:inv.invoiceNumber,invoiceDate:inv.invoiceDate,vendor:inv.vendor,description:'Invoice totals require review'}]
      });
    }
  }

  for(const [key,history] of products){
    history.sort((a,b)=>a.invoiceDate.localeCompare(b.invoiceDate));
    const first=history[0], last=history[history.length-1];
    if(history.length>=2 && first.normalizedUnitCost>0){
      const pct=(last.normalizedUnitCost-first.normalizedUnitCost)/first.normalizedUnitCost*100;
      if(pct>=8){
        const annualUnits=annualizedQuantity(history);
        const impact=Math.max(0,(last.normalizedUnitCost-first.normalizedUnitCost)*annualUnits);
        findings.push({id:`creep-${key}`,type:'Price creep',title:`${last.description}`,amount:impact,amountLabel:'potential annualized opportunity',confidence:'Verified',countsTowardOpportunity:true,summary:`Effective unit cost increased ${fmtPct(pct)} from the first to latest observed purchase.`,formula:{current:last.normalizedUnitCost,comparison:first.normalizedUnitCost,diff:last.normalizedUnitCost-first.normalizedUnitCost,annualQty:annualUnits,annualization:annualization(history),comparisonBasis:`Earliest exact observed purchase: ${first.vendor} · ${first.invoiceNumber} · ${first.invoiceDate}`},evidence:history.slice(-5),productKey:key});
      }
    }

    const latestByVendor=new Map();
    for(const r of history){const prev=latestByVendor.get(r.vendor);if(!prev||r.invoiceDate>prev.invoiceDate)latestByVendor.set(r.vendor,r)}
    if(latestByVendor.size>=2){
      const arr=[...latestByVendor.values()].sort((a,b)=>a.normalizedUnitCost-b.normalizedUnitCost); const low=arr[0], high=arr[arr.length-1];
      const gap=high.normalizedUnitCost-low.normalizedUnitCost;
      if(high.normalizedUnitCost>0 && gap/high.normalizedUnitCost>=.05){
        const highHist=history.filter(r=>r.vendor===high.vendor); const annualQty=annualizedQuantity(highHist); const amount=gap*annualQty;
        findings.push({id:`variance-${key}`,type:'Vendor variance',title:`${high.description}`,amount,amountLabel:'potential annualized opportunity',confidence:'Verified',countsTowardOpportunity:true,summary:`Latest observed effective unit cost is lower at ${low.vendor} than ${high.vendor}.`,formula:{current:high.normalizedUnitCost,comparison:low.normalizedUnitCost,diff:gap,annualQty,annualization:annualization(highHist),comparisonBasis:`Latest exact observed vendor comparison: ${low.vendor} · ${low.invoiceNumber} · ${low.invoiceDate}`},evidence:[high,low],productKey:key});
      }
    }

    // Contract price shown on an invoice line. Compare invoice pack price to stated contract pack price.
    for(const r of history.filter(x=>x.contractPriceShown>0 && x.unitPrice>x.contractPriceShown)){
      const annualPacks=annualizedQuantity(history,x=>x.qty);
      const diff=r.unitPrice-r.contractPriceShown;
      findings.push({
        id:`contract-${r.invoiceId}-${r.id}`,type:'Contract variance',title:r.description,
        amount:diff*annualPacks,amountLabel:'potential annualized opportunity',confidence:'Verified',countsTowardOpportunity:true,
        summary:`The invoiced pack price is above the contract price shown on the invoice record.`,
        calculation:[
          {label:'Invoiced pack price',value:fmtMoney2(r.unitPrice)},
          {label:'Contract pack price',value:fmtMoney2(r.contractPriceShown)},
          {label:'Difference per pack',value:fmtMoney2(diff)},
          {label:'Annualized observed packs',value:Math.round(annualPacks).toLocaleString()},
          {label:'Estimated annualized impact',value:fmtMoney2(diff*annualPacks)}
        ],evidence:[r],productKey:key
      });
    }
  }

  // Possible equivalents require an explicit practice decision before they can affect opportunity totals.
  const equivalentGroups=new Map();
  for(const r of rows){ if(r.equivalentGroup){ if(!equivalentGroups.has(r.equivalentGroup)) equivalentGroups.set(r.equivalentGroup,[]); equivalentGroups.get(r.equivalentGroup).push(r); } }
  for(const [group,groupRows] of equivalentGroups){
    const latestByKey=new Map();
    for(const r of groupRows){ const k=keyFor(r); const prev=latestByKey.get(k); if(!prev||r.invoiceDate>prev.invoiceDate) latestByKey.set(k,r); }
    if(latestByKey.size<2) continue;
    const arr=[...latestByKey.values()].sort((a,b)=>a.normalizedUnitCost-b.normalizedUnitCost); const low=arr[0], high=arr[arr.length-1];
    const gap=high.normalizedUnitCost-low.normalizedUnitCost;
    const meaningfulGap=high.normalizedUnitCost>0 && gap/high.normalizedUnitCost>=.05;
    const decision=decisionByGroup.get(group);
    if(decision?.status==='rejected') continue;
    const highHist=groupRows.filter(r=>keyFor(r)===keyFor(high)); const annualQty=annualizedQuantity(highHist); const amount=Math.max(0,gap*annualQty);
    const approved=decision?.status==='approved';
    findings.push({
      id:`equivalent-${group}`,type:approved?'Practice-approved equivalent':'Possible equivalent',title:high.description,amount,amountLabel:meaningfulGap?'potential annualized opportunity':'relationship review',confidence:approved?'Strong':'Potential',countsTowardOpportunity:approved&&meaningfulGap,
      summary:approved
        ? (meaningfulGap?`The practice approved this product relationship for purchasing analysis. The lower observed effective unit cost can now be included as an opportunity.`:`The practice approved this product relationship for purchasing analysis. No material cost gap is currently identified.`)
        : (meaningfulGap?`A lower-cost item is tagged as a possible equivalent. An authorized practice reviewer must approve the relationship before it can affect savings analysis.`:`Products are grouped as possible purchasing equivalents. Human approval is required even though no material cost gap is currently identified.`),
      formula:{current:high.normalizedUnitCost,comparison:low.normalizedUnitCost,diff:gap,annualQty,annualization:annualization(highHist),comparisonBasis:`Latest observed candidate comparison: ${low.vendor} · ${low.invoiceNumber} · ${low.invoiceDate}`},
      evidence:[high,low],equivalentGroup:group,equivalenceDecision:decision||null,requiredPermission:'approve_product_equivalence'
    });
  }

  // Fragmentation: actual shipping/handling on smaller orders.
  for(const inv of invoices){
    if(duplicateIds.has(inv.id)) continue;
    if(inv.subtotal<750 && (inv.shipping+inv.handling)>=30){
      findings.push({id:`frag-${inv.id}`,type:'Order fragmentation',title:`${inv.vendor} · ${inv.invoiceNumber}`,amount:inv.shipping+inv.handling,amountLabel:'observed fees to review',confidence:'Potential',countsTowardOpportunity:false,summary:`A relatively small order carried ${fmtMoney2(inv.shipping+inv.handling)} in shipping/handling. Review whether orders could be consolidated.`,calculation:[{label:'Invoice subtotal',value:fmtMoney2(inv.subtotal)},{label:'Shipping / handling',value:fmtMoney2(inv.shipping+inv.handling)},{label:'Review question',value:'Could this order have been consolidated?'}],evidence:[{invoiceId:inv.id,invoiceNumber:inv.invoiceNumber,invoiceDate:inv.invoiceDate,vendor:inv.vendor,description:'Invoice-level shipping / handling'}]});
    }
  }

  for(const f of findings){ f.classification = f.countsTowardOpportunity!==false ? 'Opportunity' : (['Duplicate invoice','Invoice reconciliation'].includes(f.type) ? 'Anomaly' : 'Review item'); }
  findings.sort((a,b)=>b.amount-a.amount);
  const priceChanges=findings.filter(f=>f.type==='Price creep').length;
  const opportunityFindings=findings.filter(f=>f.countsTowardOpportunity!==false);
  return {spend,lineCount,duplicateIds,vendors:[...vendors.entries()].sort((a,b)=>b[1]-a[1]),categories:[...cats.entries()].sort((a,b)=>b[1]-a[1]),products,rows,findings,priceChanges,opportunityTotal:opportunityFindings.reduce((s,f)=>s+f.amount,0),reviewExposureTotal:findings.filter(f=>f.countsTowardOpportunity===false).reduce((s,f)=>s+f.amount,0),duplicateCount:duplicateIds.size};
}
