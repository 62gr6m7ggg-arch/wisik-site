import original from './exam-2018';
import reconstructed from './reconstruction';
import training from './training';
import type {ArenaState,Attempt,PracticeState,TrainingQuestion,Rating} from './types';
export const EXAMS=[original,reconstructed];
export const TRAINING=training;
export const KEY='wisik.space-tent.arena.native.v1';
export const MAX_IMPORT_BYTES=8_000_000;
export const REASONS=['inzicht','constructie','rekenen','strategie','tijd','twijfel'];
export const VIEWS=['home','archive','setup','exam','review','repair','training'];
const object=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const num=(x:unknown,a:number,b:number)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
const fail=(message:string):never=>{throw new Error(message);};
export const newId=()=>globalThis.crypto?.randomUUID?.()||'arena-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
export const exam=(id:string)=>EXAMS.find(e=>e.id===id)||EXAMS[0];
export const task=(id:string)=>TRAINING.find(q=>q.id===id)||TRAINING[0];
export const freshPractice=():PracticeState=>({input:'',selected:null,stage:0,tries:0,correct:false,independent:false,feedback:null});
export const empty=():ArenaState=>({format:'wisik-native-arena',version:1,revision:newId(),session:null,history:[],training:{},ui:{view:'home',index:0,selectedExam:'2018',trainId:'L1-1'}});
export function numeric(text:string):number|null{
 const s=text.trim().replace(/\u2212/g,'-').replace(',','.');
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return null;
 const n=Number(s);return Number.isFinite(n)?n:null;
}
export function checkTraining(q:TrainingQuestion,p:PracticeState):'correct'|'wrong'|'invalid'{
 if(q.options){if(p.selected===null||!Number.isInteger(p.selected)||p.selected<0||p.selected>=q.options.length)return 'invalid';return p.selected===q.answer?'correct':'wrong';}
 const n=numeric(p.input);return n===null?'invalid':Math.abs(n-q.answer)<=(q.tolerance??0.001)?'correct':'wrong';
}
export function assessTraining(q:TrainingQuestion,p:PracticeState):PracticeState{
 const result=checkTraining(q,p);if(result==='invalid')return {...p,feedback:result};
 const tries=Math.min(10000,p.tries+1),correct=result==='correct';
 return {...p,tries,correct,independent:correct&&tries===1&&p.stage===0,feedback:result};
}
function attempt(value:unknown):Attempt|null{
 if(value===null||value===undefined)return null;if(!object(value))return fail('Ongeldige toetsgegevens.');
 const e=EXAMS.find(x=>x.id===(value.examId??'2018'));if(!e)return fail('Onbekende oefentoets.');
 if(typeof value.id!=='string'||value.id.length<1||value.id.length>100||!num(value.start,0,8.64e15)||!num(value.minutes,1,600))return fail('Ongeldige poging of tijdsinstelling.');
 const start=value.start as number;
 if(value.finished!==null&&value.finished!==undefined&&!num(value.finished,start,8.64e15))return fail('Ongeldige afrondtijd.');
 const o:Attempt={id:value.id,examId:e.id,start,minutes:value.minutes as number,showClock:value.showClock!==false,finished:typeof value.finished==='number'?value.finished:null,answers:{},flags:{},ratings:{},criteria:{},reasons:{}};
 for(const field of ['answers','flags','ratings','criteria','reasons'])if(value[field]!==undefined&&!object(value[field]))return fail('Ongeldige velden in de poging.');
 const answers=(value.answers||{}) as Record<string,unknown>,flags=(value.flags||{}) as Record<string,unknown>,ratings=(value.ratings||{}) as Record<string,unknown>,criteria=(value.criteria||{}) as Record<string,unknown>,reasons=(value.reasons||{}) as Record<string,unknown>;
 for(const q of e.questions){
  if(answers[q.id]!==undefined){if(typeof answers[q.id]!=='string'||(answers[q.id] as string).length>12000)return fail('Een notitie is ongeldig of te lang.');o.answers[q.id]=answers[q.id] as string;}
  if(flags[q.id]===true)o.flags[q.id]=true;
  if(o.finished!==null&&[0,1,2].includes(ratings[q.id] as number))o.ratings[q.id]=ratings[q.id] as Rating;
  if(o.finished!==null&&Array.isArray(criteria[q.id]))o.criteria[q.id]=q.criteria.map((_,i)=>(criteria[q.id] as unknown[])[i]===true);
  if(o.finished!==null&&REASONS.includes(reasons[q.id] as string))o.reasons[q.id]=reasons[q.id] as string;
 }
 return o;
}
export function validate(value:unknown):ArenaState{
 if(!object(value)||value.version!==1)return fail('Dit is geen ondersteund Arena-voortgangsbestand.');
 const legacy=value.format===undefined&&('session' in value)&&('training' in value);
 if(value.format!=='wisik-native-arena'&&!legacy)return fail('Dit bestand hoort niet bij de Tentamenarena. Je cursusvoortgang blijft ongemoeid.');
 if(value.history!==undefined&&!Array.isArray(value.history))return fail('Ongeldige eerdere pogingen.');
 if(value.training!==undefined&&!object(value.training))return fail('Ongeldige trainingsgegevens.');
 const out=empty();out.revision=typeof value.revision==='string'&&value.revision.length<=100?value.revision:newId();out.session=attempt(value.session);
 out.history=((value.history||[]) as unknown[]).slice(-5).map(attempt).filter((x):x is Attempt=>x!==null);
 const incoming=(value.training||{}) as Record<string,unknown>;
 for(const q of TRAINING){const x=incoming[q.id];if(!object(x))continue;const p=freshPractice();p.input=typeof x.input==='string'?x.input.slice(0,100):'';p.selected=Number.isInteger(x.selected)&&q.options&&num(x.selected,0,q.options.length-1)?x.selected as number:null;p.stage=Number.isInteger(x.stage)&&num(x.stage,0,3)?x.stage as number:0;p.tries=Number.isInteger(x.tries)&&num(x.tries,0,10000)?x.tries as number:0;
  const result=checkTraining(q,p);p.feedback=['correct','wrong','invalid'].includes(x.feedback as string)?result:null;p.correct=p.tries>0&&x.correct===true&&result==='correct';p.independent=p.correct&&p.tries===1&&p.stage===0&&x.independent===true;out.training[q.id]=p;
 }
 const u=object(value.ui)?value.ui:{};out.ui={view:VIEWS.includes(u.view as string)?u.view as string:'home',index:Number.isInteger(u.index)&&num(u.index,0,100)?u.index as number:0,selectedExam:EXAMS.some(e=>e.id===u.selectedExam)?u.selectedExam as string:'2018',trainId:TRAINING.some(q=>q.id===u.trainId)?u.trainId as string:'L1-1'};
 if(out.session&&out.session.finished===null&&['archive','training','setup','review','repair'].includes(out.ui.view))out.ui.view='exam';
 if(!out.session&&['exam','review','repair'].includes(out.ui.view))out.ui.view='home';
 if(out.session?.finished!==null&&out.ui.view==='exam')out.ui.view='review';
 if(out.session)out.ui.index=Math.min(out.ui.index,exam(out.session.examId).questions.length-1);
 return out;
}
export function parse(text:string):ArenaState{if(text.length>MAX_IMPORT_BYTES)return fail('Het bestand is te groot. Er is niets vervangen.');let x:unknown;try{x=JSON.parse(text);}catch{return fail('Dit is geen leesbaar JSON-bestand. Er is niets vervangen.');}return validate(x);}
export function startAttempt(state:ArenaState,examId:string,minutes:number,showClock:boolean,now=Date.now()):ArenaState{
 if(state.session&&state.session.finished===null)throw Error('Rond de lopende poging eerst af.');
 if(!EXAMS.some(e=>e.id===examId)||!num(minutes,1,600))throw Error('Kies een bekende toets en 1 tot 600 minuten.');
 const history=state.session?[...state.history,state.session].slice(-5):state.history;
 return {...state,history,session:{id:newId(),examId,start:now,minutes,showClock,finished:null,answers:{},flags:{},ratings:{},criteria:{},reasons:{}},ui:{...state.ui,selectedExam:examId,index:0,view:'exam'}};
}
export function needs(session:Attempt|null){
 if(!session||session.finished===null)return [];
 const groups=new Map<string,{blockId:string;questions:string[];reasons:string[]}>();
 for(const q of exam(session.examId).questions){const r=session.ratings[q.id];if(r!==0&&r!==1)continue;const row=groups.get(q.blockId)||{blockId:q.blockId,questions:[],reasons:[]};row.questions.push(q.label);if(session.reasons[q.id])row.reasons.push(session.reasons[q.id]);groups.set(q.blockId,row);}
 return [...groups.values()].sort((a,b)=>b.questions.length-a.questions.length);
}
export function remaining(session:Attempt,now=Date.now()){return Math.floor(session.minutes*60-((session.finished??now)-session.start)/1000);}
