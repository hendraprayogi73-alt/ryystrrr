const SHEETS = { products:'AkunGame', promos:'PromosiWA', reports:'LaporanPenipu', orders:'PesananVIP' };
function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) || 'home';
  const file = page === 'admin' ? 'Admin' : 'Index';
  return HtmlService.createTemplateFromFile(file).evaluate()
    .setTitle(page === 'admin' ? 'RAYYSTR Admin' : 'RAYYSTR — Gaming Marketplace')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
function include(filename){ return HtmlService.createHtmlOutputFromFile(filename).getContent(); }
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const defs = [
    [SHEETS.products,['id','createdAt','title','game','price','description','seller','whatsapp','status','vip']],
    [SHEETS.promos,['id','createdAt','name','whatsapp','title','link','description','status']],
    [SHEETS.reports,['id','createdAt','seller','whatsapp','store','loss','description','proof','status']],
    [SHEETS.orders,['id','createdAt','buyer','whatsapp','package','amount','proof','status']]
  ];
  defs.forEach(([name, headers]) => { let sh=ss.getSheetByName(name); if(!sh) sh=ss.insertSheet(name); if(sh.getLastRow()===0) sh.appendRow(headers); sh.setFrozenRows(1); });
  return 'Database RAYYSTR siap. Sheet dibuat: '+defs.map(x=>x[0]).join(', ');
}
function getPublicData(){
  return { products: readRows_(SHEETS.products).filter(x=>x.status==='approved'), promos: readRows_(SHEETS.promos).filter(x=>x.status==='approved'), reports: readRows_(SHEETS.reports).filter(x=>x.status==='verified') };
}
function submitListing(data){
  data=data||{}; requireFields_(data,['title','game','price','seller','whatsapp']);
  append_(SHEETS.products,[id_(),new Date(),clean_(data.title),clean_(data.game),Number(data.price)||0,clean_(data.description),clean_(data.seller),clean_(data.whatsapp),'pending',false]);
  return {ok:true,message:'Listing dikirim dan menunggu persetujuan admin.'};
}
function submitPromotion(data){
  data=data||{}; requireFields_(data,['name','whatsapp','title','link']);
  append_(SHEETS.promos,[id_(),new Date(),clean_(data.name),clean_(data.whatsapp),clean_(data.title),clean_(data.link),clean_(data.description),'pending']);
  return {ok:true,message:'Pengajuan promosi dikirim.'};
}
function submitScamReport(data){
  data=data||{}; requireFields_(data,['seller','whatsapp','store','description']);
  append_(SHEETS.reports,[id_(),new Date(),clean_(data.seller),clean_(data.whatsapp),clean_(data.store),Number(data.loss)||0,clean_(data.description),clean_(data.proof),'pending']);
  return {ok:true,message:'Laporan diterima dan menunggu pemeriksaan.'};
}
function createVipOrder(data){
  data=data||{}; requireFields_(data,['buyer','whatsapp','package']);
  append_(SHEETS.orders,[id_(),new Date(),clean_(data.buyer),clean_(data.whatsapp),clean_(data.package),Number(data.amount)||0,clean_(data.proof),'pending']);
  return {ok:true,message:'Pesanan VIP tersimpan dan menunggu verifikasi manual.'};
}
function adminLogin(password){ return {ok: password===PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD')}; }
function getAdminData(password){ auth_(password); return {products:readRows_(SHEETS.products),promos:readRows_(SHEETS.promos),reports:readRows_(SHEETS.reports),orders:readRows_(SHEETS.orders)}; }
function moderateItem(password, sheetKey, id, action){
  auth_(password); const name=SHEETS[sheetKey]; if(!name) throw new Error('Jenis data tidak valid');
  const sh=SpreadsheetApp.getActive().getSheetByName(name); if(!sh) throw new Error('Jalankan setupDatabase terlebih dahulu');
  const values=sh.getDataRange().getValues(); const headers=values[0]; const idCol=headers.indexOf('id')+1; const statusCol=headers.indexOf('status')+1;
  for(let r=2;r<=values.length;r++){ if(String(sh.getRange(r,idCol).getValue())===String(id)){ sh.getRange(r,statusCol).setValue(action==='approve'?(sheetKey==='reports'?'verified':'approved'):'rejected'); return {ok:true}; } }
  throw new Error('Data tidak ditemukan');
}
function readRows_(sheetName){
  const sh=SpreadsheetApp.getActive().getSheetByName(sheetName); if(!sh||sh.getLastRow()<2) return [];
  const vals=sh.getDataRange().getValues(), headers=vals.shift();
  return vals.map(row=>{const o={}; headers.forEach((h,i)=>o[h]=row[i] instanceof Date?row[i].toISOString():row[i]); return o;});
}
function append_(sheetName,row){ const sh=SpreadsheetApp.getActive().getSheetByName(sheetName); if(!sh) throw new Error('Jalankan setupDatabase terlebih dahulu.'); sh.appendRow(row); }
function id_(){return 'RY-'+Utilities.getUuid().slice(0,8).toUpperCase();}
function clean_(v){return String(v==null?'':v).trim().slice(0,2000);}
function requireFields_(obj,fields){fields.forEach(k=>{if(obj[k]===undefined||String(obj[k]).trim()==='') throw new Error('Kolom wajib diisi: '+k);});}
function auth_(password){const saved=PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD'); if(!saved||password!==saved) throw new Error('Kata sandi admin salah atau belum disetel.');}
