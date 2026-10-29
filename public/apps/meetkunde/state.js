import {IDS} from './content.js?v=1.2.0';
export const STORAGE_KEY='wisik-meetkunde-oefenen-v1';
const statuses=['','begin','onderbouwen','uitwerken','anders','zelf'];
const cleanText=v=>typeof v==='string'?v.slice(0,20000):'';
export function validateState(value){
 if(!value||value.schema!==1||!value.exercises||typeof value.exercises!=='object'||Array.isArray(value.exercises))throw Error('Dit bestand is geen geldige voortgang van de duotent (versie 1).');
 const exercises={};
 for(const id of IDS){const v=value.exercises[id];if(!v||typeof v!=='object'||Array.isArray(v))continue;exercises[id]={notes:cleanText(v.notes),reflection:statuses.includes(v.reflection)?v.reflection:'',step:Number.isInteger(v.step)&&v.step>=0&&v.step<=10?v.step:0,help:!!v.help,proof:!!v.proof,check:!!v.check};}
 return {schema:1,last:IDS.includes(value.last)?value.last:'',exercises};
}
export const emptyState=()=>({schema:1,last:'',exercises:{}});
export function loadState(storage){try {const raw=storage.getItem(STORAGE_KEY);return {state:raw?validateState(JSON.parse(raw)):emptyState(),error:null};}catch(error){return {state:emptyState(),error:'Je voortgang kon niet worden gelezen. Exporteer nieuwe notities voordat je vertrekt; bestaand beschadigd opgeslagen werk wordt niet automatisch overschreven.'};}}
export function saveState(storage,state){try{storage.setItem(STORAGE_KEY,JSON.stringify(validateState(state)));return true;}catch{return false;}}
export function mergeState(current,incoming){
 const exercises={...incoming.exercises};
 for(const [id,v] of Object.entries(current.exercises)){
  if(!exercises[id]||v.notes?.trim()||v.reflection||v.help||v.proof||v.check)exercises[id]=v;
 }
 return validateState({schema:1,last:incoming.last||current.last,exercises});
}
