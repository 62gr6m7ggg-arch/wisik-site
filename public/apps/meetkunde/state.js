import {IDS,EXERCISES} from './content.js?v=1.5.0';
export const STORAGE_KEY='wisik-meetkunde-oefenen-v1';
const statuses=['','begin','onderbouwen','uitwerken','anders','zelf'];
const cleanText=v=>typeof v==='string'?v.slice(0,20000):'';
export function validateState(value){
 if(!value||value.schema!==1||!value.exercises||typeof value.exercises!=='object'||Array.isArray(value.exercises))throw Error('Dit bestand is geen geldige voortgang van de duotent (versie 1).');
 const exercises={};
 for(const exercise of EXERCISES){
  const id=exercise.id,v=value.exercises[id];if(!v||typeof v!=='object'||Array.isArray(v))continue;
  const count=exercise.methods?.length||1,validStep=n=>Number.isInteger(n)&&n>=0&&n<=10;
  const method=Number.isInteger(v.method)&&v.method>=0&&v.method<count?v.method:(v.method===undefined&&(v.proof||v.step)?exercise.legacyMethod||0:0);
  const methodSteps=Array.from({length:count},(_,i)=>validStep(v.methodSteps?.[i])?v.methodSteps[i]:0);
  const step=validStep(v.step)?v.step:0;methodSteps[method]=step;
  exercises[id]={notes:cleanText(v.notes),reflection:statuses.includes(v.reflection)?v.reflection:'',step,method,methodSteps,help:!!v.help,proof:!!v.proof,check:!!v.check};
 }
 return {schema:1,last:IDS.includes(value.last)?value.last:'',exercises};
}
export const emptyState=()=>({schema:1,last:'',exercises:{}});
export function loadState(storage){try {const raw=storage.getItem(STORAGE_KEY);return {state:raw?validateState(JSON.parse(raw)):emptyState(),error:null};}catch(error){return {state:emptyState(),error:'Je voortgang kon niet worden gelezen. Exporteer nieuwe notities voordat je vertrekt; bestaand beschadigd opgeslagen werk wordt niet automatisch overschreven.'};}}
export function saveState(storage,state){try{storage.setItem(STORAGE_KEY,JSON.stringify(validateState(state)));return true;}catch{return false;}}
export function mergeState(current,incoming){
 const exercises={...incoming.exercises};
 for(const [id,v] of Object.entries(current.exercises)){
  if(!exercises[id]||v.notes?.trim()||v.reflection||v.help||v.proof||v.check||v.method||v.step>1||v.methodSteps?.some(n=>n>1))exercises[id]=v;
 }
 return validateState({schema:1,last:incoming.last||current.last,exercises});
}
