// Integration target: app/diagnostic.ts. No writes to the Site were made.
import {QUESTIONS,correctAnswer,type AnswerEvent,type Block,type LearningEvent} from './model';

export type BlockStage='theory'|'practice'|'probe'|'repair'|'retest'|'complete';
export type BlockResume={stage:BlockStage;sessionId?:string;index:number;probeIndex:number;probeAnswers:string[][];retestIndex:number;retestSuccess:boolean[];supported:boolean};

function answerEvents(events:LearningEvent[]):AnswerEvent[]{
 const ids=new Set<string>();
 return events.filter((event):event is AnswerEvent=>{
  if(event.type!=='answer'||ids.has(event.id))return false;
  ids.add(event.id);return true;
 });
}
function exactWrong(questionId:string,answer:string[],wrong:string){
 const q=QUESTIONS[questionId];
 return !!q&&answer.length===1&&answer[0]===wrong&&!correctAnswer(q,answer);
}
export function isMisconceptionTrigger(block:Block,questionId:string,answer:string[]){
 return questionId===block.misconception.trigger.qid&&exactWrong(questionId,answer,block.misconception.trigger.wrongAnswer);
}
export function supportsMisconception(block:Block,answers:string[][]){return answers.length===block.probeIds.length&&answers.every((a,i)=>exactWrong(block.probeIds[i],a,block.misconception.probeWrongAnswers[i]));}
/** A named pattern needs its trigger plus both matching probes from one episode. */
export function getBlockDiagnosis(block:Block,events:LearningEvent[],sessionId?:string){
 const answers=answerEvents(events);
 const trigger=[...answers].reverse().find(e=>e.payload.context==='practice'&&(!sessionId||e.payload.sessionId===sessionId)&&isMisconceptionTrigger(block,e.payload.questionId,e.payload.answer));
 if(!trigger)return null;
 const subsequent=answers.slice(answers.indexOf(trigger)+1).filter(e=>e.payload.sessionId===trigger.payload.sessionId);
 // A later main answer closes this diagnostic episode. Answers from an unrelated
 // later practice visit cannot retroactively confirm an earlier suspicion.
 const nextMain=subsequent.findIndex(e=>e.payload.context==='practice'&&block.questionIds.includes(e.payload.questionId));
 const episode=nextMain<0?subsequent:subsequent.slice(0,nextMain);
 const probes=block.probeIds.map(id=>episode.find(e=>e.payload.context==='probe'&&e.payload.questionId===id));
 const investigated=probes.every(Boolean);
 const supported=investigated&&supportsMisconception(block,probes.map(e=>e!.payload.answer));
 const lastProbe=investigated?Math.max(...probes.map(e=>episode.indexOf(e!))):-1;
 const retests=block.retestIds.map(id=>investigated?episode.slice(lastProbe+1).find(e=>e.payload.context==='retest'&&e.payload.questionId===id):undefined);
 const retestSuccess=retests.map(e=>!!e&&correctAnswer(QUESTIONS[e.payload.questionId],e.payload.answer));
 return {trigger,probes,probeAnswers:probes.map(e=>e?.payload.answer||[]),investigated,supported,retests,retestSuccess,retested:retests.every(Boolean)&&retestSuccess.every(Boolean)};
}

/** Recover the current teaching step from persisted answer events. */
export function resumeBlock(block:Block,events:LearningEvent[]):BlockResume{
 const initial:BlockResume={stage:'theory',index:0,probeIndex:0,probeAnswers:[],retestIndex:0,retestSuccess:[],supported:false};
 const main=[...answerEvents(events)].reverse().find(e=>e.payload.context==='practice'&&block.questionIds.includes(e.payload.questionId));
 if(!main)return initial;
 const completion=[...events].reverse().find(e=>e.type==='block'&&e.payload.blockId===block.id);
 // A deliberate return to an already completed block starts with its theory.
 if(completion&&events.indexOf(completion)>events.indexOf(main))return initial;
 const index=block.questionIds.indexOf(main.payload.questionId);
 const previousDiagnosis=getBlockDiagnosis(block,events,main.payload.sessionId);
 const base={...initial,index,sessionId:main.payload.sessionId,...(previousDiagnosis?{
  probeAnswers:previousDiagnosis.probeAnswers.filter(a=>a.length),supported:previousDiagnosis.supported,
  retestSuccess:previousDiagnosis.retestSuccess.slice(0,previousDiagnosis.retests.filter(Boolean).length),
 }:{})};
 const nextMain=():BlockResume=>index+1<block.questionIds.length?{...base,stage:'practice',index:index+1}:{...base,stage:'complete'};
 if(!isMisconceptionTrigger(block,main.payload.questionId,main.payload.answer))return nextMain();
 const diagnosis=getBlockDiagnosis(block,events,main.payload.sessionId)!;
 const firstMissingProbe=diagnosis.probes.findIndex(e=>!e);
 if(firstMissingProbe>=0)return {...base,stage:'probe',probeIndex:firstMissingProbe,probeAnswers:diagnosis.probeAnswers.slice(0,firstMissingProbe)};
 const diagnosed={...base,probeAnswers:diagnosis.probeAnswers,supported:diagnosis.supported};
 const firstMissingRetest=diagnosis.retests.findIndex(e=>!e);
 // No saved retest yet: reopening the repair also covers leaving while reading it.
 if(firstMissingRetest===0)return {...diagnosed,stage:'repair'};
 if(firstMissingRetest>0)return {...diagnosed,stage:'retest',retestIndex:firstMissingRetest,retestSuccess:diagnosis.retestSuccess.slice(0,firstMissingRetest)};
 return {...nextMain(),probeAnswers:diagnosis.probeAnswers,supported:diagnosis.supported,retestSuccess:diagnosis.retestSuccess};
}

