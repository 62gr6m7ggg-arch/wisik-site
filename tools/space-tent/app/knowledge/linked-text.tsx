import {ENTRIES} from './model';
const terms=new Map<string,string>();
for(const e of ENTRIES)for(const name of [e.term,...e.aliases])if(name.length>=7)terms.set(name.toLocaleLowerCase('nl'),e.id);
const escaped=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=[...terms.keys()].sort((a,b)=>b.length-a.length).map(escaped).join('|');
/** At most two optional prerequisite links per paragraph keeps the prose readable.
 * All related concepts also have large buttons at the end of the article. */
export function LinkedText({text,current,onSelect}:{text:string;current:string;onSelect:(id:string)=>void}){
 const expression=new RegExp('(?<![\\p{L}\\p{N}])('+pattern+')(?![\\p{L}\\p{N}])','giu');
 const pieces=[];let cursor=0,count=0;const used=new Set<string>();
 for(const match of text.matchAll(expression)){
  const id=terms.get(match[0].toLocaleLowerCase('nl'))!;
  if(id===current||used.has(id)||count>=2)continue;
  const at=match.index!;pieces.push(text.slice(cursor,at));
  pieces.push(<button key={at} type="button" className="knowledge-inline-term" title={'Open uitleg over '+match[0]} onClick={()=>onSelect(id)}>{match[0]}</button>);
  cursor=at+match[0].length;used.add(id);count++;
 }
 pieces.push(text.slice(cursor));return <>{pieces}</>;
}
