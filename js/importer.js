function parseDate(v){
  if(!v) return '';
  if(typeof v==='number' && window.XLSX){ const d=XLSX.SSF.parse_date_code(v); if(d)return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`; }
  const s=String(v).trim(); const d=new Date(s); return Number.isNaN(d.getTime())?s:d.toISOString().slice(0,10);
}
const num=v=>{ const n=Number(String(v??'').replace(/[$,%]/g,'').replace(/,/g,'')); return Number.isFinite(n)?n:0; };
function get(row,names){ for(const n of names){ const k=Object.keys(row).find(k=>k.trim().toLowerCase()===n.toLowerCase()); if(k!==undefined&&row[k]!==undefined&&row[k]!==null&&row[k]!=='')return row[k]; } return ''; }
export function rowsToInvoices(rows){
  const grouped=new Map();
  rows.forEach((r,idx)=>{
    const vendor=String(get(r,['Vendor','Vendor Name'])||'Unknown Vendor').trim();
    const invoiceNumber=String(get(r,['Invoice #','Invoice Number','Invoice'])||`Imported-${idx+1}`).trim();
    const date=parseDate(get(r,['Invoice Date','Date']))||new Date().toISOString().slice(0,10);
    const key=`${vendor}|${invoiceNumber}|${date}`;
    if(!grouped.has(key)) grouped.set(key,{id:`imp-${Date.now()}-${grouped.size}`,vendor,invoiceNumber,invoiceDate:date,orderDate:parseDate(get(r,['Order Date'])),dueDate:parseDate(get(r,['Due Date'])),poNumber:String(get(r,['PO #','PO Number','Purchase Order'])||''),vendorAccount:String(get(r,['Vendor Account','Account Number'])||''),documentType:String(get(r,['Document Type'])||'Invoice'),creditAgainstInvoice:String(get(r,['Original Invoice Reference','Credit Against Invoice'])||''),creditReason:String(get(r,['Credit / Return Reason','Credit Reason'])||''),paymentTerms:String(get(r,['Payment Terms','Terms'])||''),shipping:num(get(r,['Shipping','Freight'])),handling:num(get(r,['Handling'])),tax:num(get(r,['Tax','Sales Tax'])),discount:num(get(r,['Invoice Discount','Discount Total','Volume Discount'])),credits:num(get(r,['Credits / Returns','Credits','Credit'])),rebates:num(get(r,['Rebates','Rebate'])),otherFees:num(get(r,['Other Fees','Fees'])),fuelSurcharge:num(get(r,['Fuel Surcharge'])),hazmatFee:num(get(r,['Hazmat Fee'])),invoiceTotal:num(get(r,['Invoice Total','Total'])),lines:[]});
    grouped.get(key).lines.push({sku:String(get(r,['SKU','Item #','Item Number','Vendor SKU'])||''),manufacturerSku:String(get(r,['Manufacturer SKU','Mfr SKU','Manufacturer Part Number'])||''),description:String(get(r,['Description','Item Description','Product'])||'Imported item'),category:String(get(r,['Category'])||'Uncategorized'),qty:num(get(r,['Qty','Quantity','Quantity Shipped']))||1,uom:String(get(r,['UOM','Unit of Measure'])||'unit'),packSize:num(get(r,['Pack Size','Units Per Pack'])||1)||1,unitPrice:num(get(r,['Unit Price','Price'])),lineDiscount:num(get(r,['Line Discount','Discount Amount'])),creditAmount:num(get(r,['Line Credit / Return','Line Credit'])),rebateAmount:num(get(r,['Line Rebate'])),lineTotal:num(get(r,['Line Total','Extended Total','Extended Price']))});
  });
  return [...grouped.values()];
}
export async function readFiles(files,context={}){
  const all=[];
  const importedAt=context.ingestedAt||new Date().toISOString();
  const batchId=context.importBatchId||`IMP-${Date.now()}`;
  for(const file of files){
    const ext=file.name.split('.').pop().toLowerCase();
    const rows=[];
    if(ext==='csv'){
      const text=await file.text(); const wb=XLSX.read(text,{type:'string'}); const ws=wb.Sheets[wb.SheetNames[0]]; rows.push(...XLSX.utils.sheet_to_json(ws,{defval:''}));
    } else if(['xlsx','xls'].includes(ext)){
      const buf=await file.arrayBuffer(); const wb=XLSX.read(buf,{type:'array'}); for(const name of wb.SheetNames){ rows.push(...XLSX.utils.sheet_to_json(wb.Sheets[name],{defval:''})); }
    } else throw new Error(`Unsupported file: ${file.name}`);
    const invoices=rowsToInvoices(rows);
    for(const inv of invoices){
      inv.ingestion={
        method:ext==='csv'?'csv_import':'xlsx_import',
        ingestedByUserId:context.ingestedByUserId||'',
        ingestedByName:context.ingestedByName||'Unknown',
        ingestedAt:importedAt,
        sourceFileName:file.name,
        sourceSystem:ext==='csv'?'CSV import':'Excel import',
        importBatchId:batchId,
        originalDocumentId:inv.invoiceNumber
      };
      all.push(inv);
    }
  }
  return all;
}
export function downloadTemplate(){
  const rows=[{'Document Type':'Invoice','Vendor':'Example Medical Supply','Invoice #':'INV-1001','Invoice Date':'2026-08-01','Order Date':'2026-07-30','Due Date':'2026-08-31','PO #':'PO-001','Vendor Account':'ACCT-100','Payment Terms':'Net 30','Original Invoice Reference':'','Credit / Return Reason':'','SKU':'SKU-100','Manufacturer SKU':'MFR-100','Description':'Example item','Category':'Medical Supplies','Qty':10,'UOM':'box','Pack Size':100,'Unit Price':19.50,'Line Discount':0,'Line Credit / Return':0,'Line Rebate':0,'Line Total':195,'Shipping':18,'Handling':0,'Other Fees':0,'Fuel Surcharge':0,'Hazmat Fee':0,'Tax':0,'Invoice Discount':0,'Credits / Returns':0,'Rebates':0,'Invoice Total':213}];
  const ws=XLSX.utils.json_to_sheet(rows); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'PracticeSpend Import');
  const guide=[
    {'Field':'Line Discount / Invoice Discount','Meaning':'Purchase-time discount that reduces purchase price. Do not use for later returns or credits.'},
    {'Field':'Credits / Returns','Meaning':'Separate credit/return adjustment. Use Original Invoice Reference and Credit / Return Reason when applicable.'},
    {'Field':'Rebates','Meaning':'Rebate shown or recorded separately from purchase discounts.'},
    {'Field':'Other Fees / Fuel Surcharge / Hazmat Fee','Meaning':'Invoice-level charges kept separate for transparent Effective Unit Cost allocation.'}
  ];
  const gs=XLSX.utils.json_to_sheet(guide);XLSX.utils.book_append_sheet(wb,gs,'Field Guide');
  XLSX.writeFile(wb,'PracticeSpend_Import_Template.xlsx');
}
