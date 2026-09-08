import type {ExampleId} from './insight-scenes';
import data from './content.json';
import course from './course-content.json';
import constructionData from './construction-tasks.json';
import {numericValue} from './numeric';
import type {V3} from './geometry-math';
export type Skill='inzicht'|'construeren'|'onderbouwen'|'rekenen';
export type Scene={studyPlanes?:string[][];points?:Record<string,V3>;edges?:string[];showCube?:boolean;highlights?:string[];planes?:string[][];segments?:{from:V3;to:V3;color:string;dashed?:boolean}[];caption:string;view?:'spatial'|'front'|'top'|'side'|'right';dimensions?:V3;hiddenLabels?:string[]};
export type Question={id:string;block:string;skill:Skill;type:'choice'|'points'|'numeric';prompt:string;options?:{id:string;text:string}[];answer:string[];explanation:string;hint:string;highlights?:string[];planes?:string[][];extraPoints?:Record<string,V3>;selectCount?:number;acceptAny?:string[];tolerance?:number;decimals?:number;unit?:string;working?:boolean;scene?:Scene;revealScene?:Scene};
export type Theory={title:string;text:string;example?:ExampleId;highlights?:string[];planes?:string[][];scene?:Scene};
export type Block={id:string;level?:number;title:string;subtitle:string;theory:Theory[];questionIds:string[];probeIds:string[];retestIds:string[];repair:Theory;misconception:{label:string;trigger:{qid:string;wrongAnswer:string};probeWrongAnswers:string[]}};
export type PaperTask={title:string;prompt:string;steps:string[];rubric:string[];solution:string[];scene:Scene};
export const COURSE=course as unknown as {blocks:Block[];questions:Question[];checks:Record<string,string[]>;papers:Record<string,PaperTask>;sources:unknown[]};
export const CHECKS:Record<string,string[]>={'1':data.checkpointIds,...COURSE.checks};
export const BANK={blocks:[...data.blocks.map(b=>({...b,level:1})),...COURSE.blocks] as Block[],questions:[...data.questions,...COURSE.questions] as Question[],checkpointIds:Object.values(CHECKS).flat()};
export const QUESTIONS=Object.fromEntries(BANK.questions.map(q=>[q.id,q]));
export const SKILLS:Skill[]=['inzicht','construeren','onderbouwen','rekenen'];
export const SKILL_NAMES={inzicht:'Ruimtelijk inzicht',construeren:'Construeren',onderbouwen:'Onderbouwen',rekenen:'Rekenen'};
export type LearningEvent={id:string;type:'answer'|'block'|'paper'|'workbench'|'construction';at:number;payload:Record<string,unknown>};
export type AnswerEvent=LearningEvent & {payload:{questionId:string;answer:string[];helped:boolean;context:string;sessionId:string;correct:boolean;working?:string}};
export function correctAnswer(q:Question,a:string[]){if(new Set(a).size!==a.length)return false;if(q.type==='numeric'){const n=a.length===1?numericValue(a[0]):null;if(n===null)return false;const expected=Number(q.answer[0]);return q.decimals!==undefined?Math.abs(n-expected)<=1e-6||Math.abs(n-Number(expected.toFixed(q.decimals)))<=1e-7:Math.abs(n-expected)<=(q.tolerance??.02)}if(q.acceptAny?.length)return a.length===(q.selectCount||1)&&a.every(k=>q.acceptAny!.includes(k));return a.length===q.answer.length&&[...a].sort().join('|')===[...q.answer].sort().join('|')}
export function pointsForQuestion(q:Question){return q.scene?.showCube===false?Object.keys({...q.scene.points,...q.extraPoints}).filter(k=>!q.scene?.hiddenLabels?.includes(k)):Object.keys({...{A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0},...q.scene?.points,...q.extraPoints}).filter(k=>!q.scene?.hiddenLabels?.includes(k))}
export function checkGroup(questionId:string){return Object.keys(CHECKS).find(k=>CHECKS[k].includes(questionId))}
export function blocksForLevel(level:number){return BANK.blocks.filter(b=>(b.level||1)===level)}
export function checkAttempts(events:LearningEvent[],key:string){
 const ids=CHECKS[key]||[],groups=new Map<string,AnswerEvent[]>();
 for(const e of events)if(e.type==='answer'&&e.payload.context==='check'&&ids.includes(String(e.payload.questionId))){const sid=String(e.payload.sessionId);const rows=groups.get(sid)||[];if(!rows.some(a=>a.payload.questionId===e.payload.questionId))rows.push(e as AnswerEvent);groups.set(sid,rows)}
 return [...groups].map(([sessionId,rows])=>({sessionId,rows,complete:ids.length>0&&rows.length===ids.length,passed:ids.length>0&&rows.length===ids.length&&rows.every(e=>correctAnswer(QUESTIONS[e.payload.questionId],e.payload.answer)&&!e.payload.helped),at:Math.max(...rows.map(e=>e.at)),startedAt:Math.min(...rows.map(e=>e.at))}));
}
export const RETENTION_MS=24*60*60*1000;
export function deriveProgress(events:LearningEvent[]){
 const answers=events.filter(e=>e.type==='answer') as AnswerEvent[];
 const evidence:Record<string,{correct:boolean;independent:boolean;helped:boolean;tries:number}>={};
 for(const e of visibleEvidenceAnswers(events,BANK.checkpointIds)){const id=e.payload.questionId,q=QUESTIONS[id];if(!q)continue;const old=evidence[id],ok=correctAnswer(q,e.payload.answer);evidence[id]={correct:!!old?.correct||ok,independent:!!old?.independent||(!old&&ok&&!e.payload.helped),helped:!!old?.helped||e.payload.helped||!ok,tries:(old?.tries||0)+1};}
 const complete=[...new Set(events.filter(e=>e.type==='block'&&BANK.blocks.some(b=>b.id===e.payload.blockId)).map(e=>String(e.payload.blockId)))];
 const mainIds=BANK.blocks.flatMap(b=>b.questionIds),assessed=[...mainIds,...BANK.checkpointIds];
 const skillsFor=(ids:string[])=>Object.fromEntries(SKILLS.map(s=>{const selected=ids.filter(id=>QUESTIONS[id]?.skill===s);return [s,{total:selected.length,independent:selected.filter(id=>evidence[id]?.independent).length,helped:selected.filter(id=>evidence[id]?.correct&&!evidence[id]?.independent).length}]})) as Record<Skill,{total:number;independent:number;helped:number}>;
 const skills=skillsFor(assessed),checks=Object.fromEntries(Object.keys(CHECKS).map(key=>[key,checkAttempts(events,key).some(a=>a.passed)]));
 const paperDoneFor=(key:string)=>events.some(e=>e.type==='paper'&&String(e.payload.level??1)===key&&Array.isArray(e.payload.checks)&&new Set(e.payload.checks).size===4);
 const workbench=events.filter(e=>e.type==='workbench'&&e.payload.correct===true).at(-1);
 const constructions=events.filter(e=>e.type==='construction'&&e.payload.correct===true);
 const tasks=(constructionData as {tasks:{id:string;level:number;exam?:string}[]}).tasks;
 const firstA=checkAttempts(events,'7a').find(a=>a.passed);
 const laterB=!!firstA&&checkAttempts(events,'7b').some(a=>a.passed&&a.startedAt>=firstA.at+RETENTION_MS);
 const levels:Record<number,{passed:boolean;check:boolean;paper:boolean;construction:boolean;blocks:number;totalBlocks:number;percent:number;skills:typeof skills}>={};
 for(let level=1;level<=7;level++){
  const bs=blocksForLevel(level),ids=bs.flatMap(b=>b.questionIds),done=bs.filter(b=>complete.includes(b.id)).length;
  const required=tasks.filter(t=>t.level===level),construction=required.every(t=>constructions.some(e=>e.payload.taskId===t.id&&(level!==7||e.payload.helped===false)));
  const paper=level===7?paperDoneFor('7a')&&paperDoneFor('7b'):paperDoneFor(String(level)),check=level===7?!!checks['7a']&&laterB:!!checks[String(level)];
  const passed=done===bs.length&&check&&paper&&construction&&(level!==7||[1,2,3,4,5,6].every(l=>levels[l].passed));
  const total=ids.length+bs.length+2+required.length,finished=ids.filter(id=>evidence[id]).length+done+Number(check)+Number(paper)+required.filter(t=>constructions.some(e=>e.payload.taskId===t.id&&(level!==7||e.payload.helped===false))).length;
  levels[level]={passed,check,paper,construction,blocks:done,totalBlocks:bs.length,percent:passed?100:Math.min(99,Math.floor(finished/Math.max(1,total)*100)),skills:skillsFor([...ids,...(level===7?[...(CHECKS['7a']||[]),...(CHECKS['7b']||[])]:CHECKS[level]||[])])};
 }
 const successfulCheck=!!checks['1'],paperDone=paperDoneFor('1');
 const rewarded=new Set([...mainIds,...BANK.blocks.flatMap(b=>b.retestIds)]),constructionIds=new Set(constructions.map(e=>String(e.payload.taskId)));
 const xp=Object.entries(evidence).reduce((n,[id,v])=>n+(rewarded.has(id)&&v.correct?(v.independent?20:10):0),0)+complete.length*30+(workbench?60:0)+constructionIds.size*60+Object.values(levels).filter(l=>l.paper).length*30+Object.values(checks).filter(Boolean).length*100;
 return {answers,evidence,complete,skills,successfulCheck,paperDone,workbench,xp,level1Passed:levels[1].passed,levels,checks,constructions,firstSummitAt:firstA?.at,retentionReadyAt:firstA?firstA.at+RETENTION_MS:undefined};
}
export const LEVELS=[
 {id:1,title:'Leren kijken',subtitle:'Lijnen, vlakken en projecties',topics:['Parallelprojectie en aanzichten','Snijden, kruisen en evenwijdigheid','Vlakken bepalen en snijlijnen','Drie vlakken samen bekijken']},
 {id:2,title:'Doorsneden',subtitle:'Van hulpvlak naar constructie',topics:['Snijpunt van lijn en vlak','Zelf een hulpvlak kiezen','Doorsneden construeren','Gelijkvormigheid herkennen']},
 {id:3,title:'Vorm & inhoud',subtitle:'Van samenstellen naar berekenen',topics:['Samengestelde doorsneden','Zelf een opgave ontwerpen','Oppervlakte en inhoud']},
 {id:4,title:'Hoeken',subtitle:'De juiste hoek vinden',topics:['Cosinusregel','Hoek tussen twee lijnen','Hoek tussen lijn en vlak','Hoek tussen twee vlakken']},
 {id:5,title:'Afstanden',subtitle:'De kortste weg onderbouwen',topics:['Punt tot lijn','Punt tot vlak','Inhoud als andere aanpak','Formules opstellen']},
 {id:6,title:'Alles verbinden',subtitle:'Zelf de aanpak kiezen',topics:['Afstand tussen kruisende lijnen','Gemengde vraagstukken','Onderwerpen door elkaar oefenen']},
 {id:7,title:'Topniveau',subtitle:'De volledige tentamenproef',topics:['Onbekende opgaven uit alle zes levels','Zelfstandig de methode kiezen','Construeren en onderbouwen op papier','Volledige proef zonder hints','Nieuwe controle op een later moment']}
];


/** Feedback and aggregate counters reveal no answers before a whole check. */
export function visibleEvidenceAnswers(events:LearningEvent[],checkpointIds:string[]){
 const seen=new Set<string>();const answers=events.filter((e):e is AnswerEvent=>{if(e.type!=='answer'||seen.has(e.id))return false;seen.add(e.id);return true});
 const groups=new Map<string,Set<string>>();
 for(const e of answers)if(e.payload.context==='check'&&checkpointIds.includes(e.payload.questionId)){const key=checkGroup(e.payload.questionId)+'|'+e.payload.sessionId;const ids=groups.get(key)||new Set<string>();ids.add(e.payload.questionId);groups.set(key,ids)}
 return answers.filter(e=>{if(e.payload.context==='probe')return false;if(e.payload.context!=='check')return true;const group=checkGroup(e.payload.questionId);return !!group&&CHECKS[group].every(id=>groups.get(group+'|'+e.payload.sessionId)?.has(id))});
}
