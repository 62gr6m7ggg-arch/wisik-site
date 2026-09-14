import {BANK,CHECKS,COURSE,type Question,type Block} from '../app/model';
import {CONSTRUCTION_TASKS,type ConstructionTask} from '../app/course-construction';
export type ReviewKind='question'|'construction'|'workbench'|'block'|'check'|'paper';
export type Entry={id:string;key:string;kind:ReviewKind;level:number;title:string;block:string;role:string;context?:string;question?:Question;lesson?:Block;task?:ConstructionTask};
export const KIND_LABELS:Record<ReviewKind,string>={question:'Losse vragen',construction:'Constructies',workbench:'Oefenatelier',block:'Hele lesblokken',check:'Hele checks / proeven',paper:'Papieropdrachten'};
export const INVENTORY:Entry[]=[
 ...BANK.questions.map(q=>{
  const b=BANK.blocks.find(b=>b.id===q.block),check=Object.keys(CHECKS).find(k=>CHECKS[k].includes(q.id));
  const context=check?'check':b?.probeIds.includes(q.id)?'probe':b?.retestIds.includes(q.id)?'retest':'practice';
  const role=check?(check.startsWith('7')?'Eindproef '+check.slice(1).toUpperCase():'Levelcheck '+check):context==='probe'?'Diagnosevraag':context==='retest'?'Herstelvraag':'Oefenvraag';
  return {id:'vraag:'+q.id,key:q.id,kind:'question' as const,level:check?Number(check[0]):b?.level||1,title:q.prompt,block:q.block,role,context,question:q};
 }),
 ...CONSTRUCTION_TASKS.map(t=>({id:'constructie:'+t.id,key:t.id,kind:'construction' as const,level:t.level,title:t.title,block:'',role:t.exam?'Constructieproef '+t.exam.toUpperCase():'Constructie',task:t})),
 {id:'atelier:doorsnede',key:'doorsnede',kind:'workbench',level:2,title:'Doorsnedewerkbank · twee varianten',block:'',role:'Oefenatelier'},
 ...BANK.blocks.map(b=>({id:'blok:'+b.id,key:b.id,kind:'block' as const,level:b.level||1,title:b.title,block:b.id,role:'Uitleg, vragen en herstelroute',lesson:b})),
 ...Object.keys(CHECKS).map(k=>({id:'check:'+k,key:k,kind:'check' as const,level:Number(k[0]),title:k.startsWith('7')?'Eindproef '+k.slice(1).toUpperCase():'Levelcheck '+k,block:'',role:CHECKS[k].length+' vragen · oorspronkelijke proefbediening'})),
 ...['1',...Object.keys(COURSE.papers)].map(k=>({id:'papier:'+k,key:k,kind:'paper' as const,level:Number(k[0]),title:k==='1'?'Papierwerk · leren kijken':COURSE.papers[k].title,block:'',role:'Papieropdracht'}))
];
export function filterEntries(entries:Entry[],level:string,kind:string,role:string,block:string,text:string){
 const words=text.toLocaleLowerCase('nl-NL').trim().split(/\s+/).filter(Boolean);
 return entries.filter(e=>(!level||e.level===Number(level))&&(!kind||e.kind===kind)&&(!role||e.role===role)&&(!block||e.block===block)&&words.every(w=>`${e.key} ${e.title} ${e.role}`.toLocaleLowerCase('nl-NL').includes(w)));
}
