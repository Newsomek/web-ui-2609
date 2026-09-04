const DB_NAME = 'PracticeSpendDB';
const STORE = 'state';
const KEY = 'practice-data';

export const storage = {
  async open(){
    return new Promise((resolve,reject)=>{
      const req = indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{ const db=req.result; if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE); };
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
    });
  },
  async save(value){
    const db=await this.open();
    return new Promise((resolve,reject)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(value,KEY); tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error); });
  },
  async load(){
    const db=await this.open();
    return new Promise((resolve,reject)=>{ const req=db.transaction(STORE,'readonly').objectStore(STORE).get(KEY); req.onsuccess=()=>resolve(req.result||null); req.onerror=()=>reject(req.error); });
  },
  async clear(){
    const db=await this.open();
    return new Promise((resolve,reject)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).delete(KEY); tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error); });
  }
};
