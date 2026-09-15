import entries from './entries.json';
import sources from './sources.json';

export type Entry = typeof entries[number];
export const ENTRIES: Entry[] = [...entries].sort((a,b)=>a.term.localeCompare(b.term,'nl',{sensitivity:'base',numeric:true}));
export const ENTRY_BY_ID = new Map(ENTRIES.map(e=>[e.id,e]));
export const SOURCES = new Map(sources.map(s=>[s.id,s]));
export const normalize = (s:string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('nl').replace(/[^a-z0-9]+/g,' ').trim();
export const LETTERS = [...new Set(ENTRIES.map(e=>normalize(e.term)[0].toUpperCase()))];
const names = new Map(ENTRIES.map(e=>[e.id,normalize([e.term,...e.aliases].join(' '))]));
const texts = new Map(ENTRIES.map(e=>[e.id,normalize([e.summary,...e.explanation,...e.steps,e.category].join(' '))]));

/** Name/alias hits first; only fall back to article text when no name matches.
 * Every displayed result set retains Dutch alphabetical order. */
export function findEntries(query:string,scope='all'){
 const tokens=normalize(query).split(' ').filter(Boolean);
 const pool=ENTRIES.filter(e=>scope==='all'||e.scope===scope);
 const match=(s:string)=>tokens.every(t=>s.includes(t));
 const direct=pool.filter(e=>match(names.get(e.id)!));
 if(direct.length||!tokens.length)return {entries:direct,fullText:false};
 return {entries:pool.filter(e=>match(texts.get(e.id)!)),fullText:true};
}
export function distance(a:string,b:string){
 let row=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+Number(a[i-1]!==b[j-1]));row=next;}
 return row[b.length];
}
export function suggestions(query:string){
 const q=normalize(query);if(q.length<4||q.length>45)return [];
 return ENTRIES.map(e=>({entry:e,score:Math.min(...[e.term,...e.aliases].map(n=>distance(q,normalize(n))))}))
  .filter(x=>x.score<=Math.min(3,Math.floor(q.length/4))).sort((a,b)=>a.score-b.score).slice(0,3).map(x=>x.entry);
}
export const scopeName=(scope:string)=>scope==='geogebra'?'GeoGebra-leertaak':scope==='aanvullend'?'Aanvullende stof':'Lesstof en voorkennis';
