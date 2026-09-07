import type {ExampleId} from './insight-scenes';
import data from './content.json';
export type Skill='inzicht'|'construeren'|'onderbouwen'|'rekenen';
export type Question={id:string;block:string;skill:Skill;type:'choice'|'points';prompt:string;options?:{id:string;text:string}[];answer:string[];explanation:string;hint:string;highlights?:string[];planes?:string[][];extraPoints?:Record<string,[number,number,number]>;selectCount?:number;acceptAny?:string[]};
export type Block={id:string;title:string;subtitle:string;theory:{title:string;text:string;example?:ExampleId;highlights?:string[];planes?:string[][]}[];questionIds:string[];probeIds:string[];retestIds:string[];repair:{title:string;text:string;example?:ExampleId;highlights?:string[];planes?:string[][]};misconception:{label:string;trigger:{qid:string;wrongAnswer:string};probeWrongAnswers:string[]}};
export const BANK=data as {blocks:Block[];questions:Question[];checkpointIds:string[]};
export const QUESTIONS=Object.fromEntries(BANK.questions.map(q=>[q.id,q]));
export const SKILLS:Skill[]=['inzicht','construeren','onderbouwen','rekenen'];
export const SKILL_NAMES={inzicht:'Ruimtelijk inzicht',construeren:'Construeren',onderbouwen:'Onderbouwen',rekenen:'Rekenen'};
export type LearningEvent={id:string;type:'answer'|'block'|'paper'|'workbench';at:number;payload:Record<string,unknown>};
export type AnswerEvent=LearningEvent & {payload:{questionId:string;answer:string[];helped:boolean;context:string;sessionId:string;correct:boolean}};
export function correctAnswer(q:Question,a:string[]){if(new Set(a).size!==a.length)return false;if(q.acceptAny?.length)return a.length===(q.selectCount||1)&&a.every(k=>q.acceptAny!.includes(k));return a.length===q.answer.length&&[...a].sort().join('|')===[...q.answer].sort().join('|')}
export function deriveProgress(events:LearningEvent[]){
 const answers=events.filter(e=>e.type==='answer') as AnswerEvent[];
 const evidence:Record<string,{correct:boolean;independent:boolean;helped:boolean;tries:number}>={};
 for(const e of visibleEvidenceAnswers(events,BANK.checkpointIds)){const id=e.payload.questionId,q=QUESTIONS[id];if(!q)continue;const old=evidence[id];const ok=correctAnswer(q,e.payload.answer);evidence[id]={correct:!!old?.correct||ok,independent:!!old?.independent||(!old&&ok&&!e.payload.helped),helped:!!old?.helped||e.payload.helped||!ok,tries:(old?.tries||0)+1};}
 const complete=[...new Set(events.filter(e=>e.type==='block').map(e=>String(e.payload.blockId)))];
 const mainIds=BANK.blocks.flatMap(b=>b.questionIds),assessed=[...mainIds,...BANK.checkpointIds];
 const skills=Object.fromEntries(SKILLS.map(s=>{const ids=assessed.filter(id=>QUESTIONS[id]?.skill===s);return [s,{total:ids.length,independent:ids.filter(id=>evidence[id]?.independent).length,helped:ids.filter(id=>evidence[id]?.correct&&!evidence[id]?.independent).length}]})) as Record<Skill,{total:number;independent:number;helped:number}>;
 const sessions:Record<string,AnswerEvent[]>={};for(const a of answers.filter(e=>e.payload.context==='check'&&BANK.checkpointIds.includes(e.payload.questionId)))(sessions[a.payload.sessionId]??=[]).push(a);
 const successfulCheck=Object.values(sessions).some(es=>es.length===BANK.checkpointIds.length&&new Set(es.map(e=>e.payload.questionId)).size===BANK.checkpointIds.length&&es.every(e=>correctAnswer(QUESTIONS[e.payload.questionId],e.payload.answer)&&!e.payload.helped));
 const paper=events.filter(e=>e.type==='paper').at(-1);const paperDone=Array.isArray(paper?.payload.checks)&&paper.payload.checks.length===4;
 const workbench=events.filter(e=>e.type==='workbench'&&e.payload.correct===true).at(-1);
 const rewarded=new Set([...mainIds,...BANK.blocks.flatMap(b=>b.retestIds)]);
 const xp=Object.entries(evidence).reduce((n,[id,v])=>n+(rewarded.has(id)&&v.correct?(v.independent?20:10):0),0)+complete.length*30+(workbench?60:0)+(paperDone?30:0)+(successfulCheck?100:0);
 return {answers,evidence,complete,skills,successfulCheck,paperDone,workbench,xp,level1Passed:complete.length===4&&successfulCheck&&paperDone};
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

/** Keep answer-dependent counters silent until a whole levelcheck is submitted.
 * Use the returned events for `evidence`/skills/XP, but retain all raw answers in
 * deriveProgress().answers for resuming. Probe answers are diagnostic only.
 */
export function visibleEvidenceAnswers(events:LearningEvent[],checkpointIds:string[]){
 const seen=new Set<string>();const answers=events.filter((e):e is AnswerEvent=>{if(e.type!=='answer'||seen.has(e.id))return false;seen.add(e.id);return true}),sessions=new Map<string,AnswerEvent[]>();
 for(const e of answers)if(e.payload.context==='check'&&checkpointIds.includes(e.payload.questionId)){
  const rows=sessions.get(e.payload.sessionId)||[];rows.push(e);sessions.set(e.payload.sessionId,rows);
 }
 const complete=new Set([...sessions].filter(([,rows])=>checkpointIds.every(id=>rows.some(e=>e.payload.questionId===id))).map(([id])=>id));
 return answers.filter(e=>e.payload.context!=='probe'&&(e.payload.context!=='check'||complete.has(e.payload.sessionId)));
}
