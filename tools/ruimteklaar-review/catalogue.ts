import {BANK,CHECKS,COURSE} from '../space-tent/app/model';
import {CONSTRUCTION_TASKS} from '../space-tent/app/course-construction';
export type Kind='question'|'construction'|'block'|'check'|'paper';
export type Item={kind:Kind;id:string;title:string;level:number;block:string;roles:string[];type:string};
export const KIND_NAMES:Record<Kind,string>={question:'Vragen',construction:'Constructies',block:'Blokroutes & uitleg',check:'Volledige checks',paper:'Papierwerk'};
export const ROLE_NAMES:Record<string,string>={practice:'Oefenvraag',probe:'Diagnosevraag',retest:'Herstelvraag',check:'Toetsvraag'};
export const catalogue:Item[]=[
 ...BANK.questions.map(q=>{const b=BANK.blocks.find(b=>b.id===q.block);const roles=[...new Set(BANK.blocks.flatMap(b=>[...(b.questionIds.includes(q.id)?['practice']:[]),...(b.probeIds.includes(q.id)?['probe']:[]),...(b.retestIds.includes(q.id)?['retest']:[])]))];const ck=Object.keys(CHECKS).find(k=>CHECKS[k].includes(q.id));if(ck)roles.push('check');return {kind:'question' as const,id:q.id,title:q.prompt,level:b?.level||Number(ck?.[0])||1,block:q.block,roles,type:q.type}}),
 ...CONSTRUCTION_TASKS.map(t=>({kind:'construction' as const,id:t.id,title:t.title,level:t.level,block:'',roles:[t.exam?'check':'practice'],type:'constructie'})),
 ...([0,1] as const).map(v=>({kind:'construction' as const,id:'atelier-'+v,title:'Oefenatelier · variant '+(v+1),level:2,block:'',roles:['practice'],type:'constructie'})),
 ...BANK.blocks.map(b=>({kind:'block' as const,id:b.id,title:b.title,level:b.level||1,block:b.id,roles:[],type:'blokroute'})),
 ...Object.keys(CHECKS).map(k=>({kind:'check' as const,id:k,title:k.startsWith('7')?'Eindproef '+k[1].toUpperCase():'Levelcheck '+k,level:Number(k[0]),block:'',roles:['check'],type:'check'})),
 {kind:'paper' as const,id:'1',title:'Van scherm naar schrift',level:1,block:'',roles:[],type:'papier'},
 ...Object.entries(COURSE.papers).filter(([k])=>k!=='1').map(([k,t])=>({kind:'paper' as const,id:k,title:t.title,level:Number(k[0]),block:'',roles:[],type:'papier'})),
];
export function matching(kind:Kind,level:string,block:string,role:string,query:string){const needle=query.trim().toLocaleLowerCase('nl');return catalogue.filter(i=>i.kind===kind&&(!level||i.level===Number(level))&&(!block||i.block===block)&&(!role||i.roles.includes(role))&&(!needle||(i.id+' '+i.title).toLocaleLowerCase('nl').includes(needle)))}
