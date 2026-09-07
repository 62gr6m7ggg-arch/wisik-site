import assert from 'node:assert/strict';
import {build} from 'esbuild';
async function load(entry){const output=await build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',write:false});return import('data:text/javascript;base64,'+Buffer.from(output.outputFiles[0].text).toString('base64'));}
const M=await load('app/model.ts'),D=await load('app/diagnostic.ts');
let n=0,combinations=0;
const event=(qid,answer,context='practice',sessionId='same')=>({id:'test-'+String(++n).padStart(6,'0'),type:'answer',at:n,payload:{questionId:qid,answer,helped:false,context,sessionId,correct:true}});
// `correct` is intentionally forged true: diagnostic checks must recompute it.
for(const block of M.BANK.blocks){
 const t=block.misconception.trigger,probeIds=block.probeIds;
 const trigger=event(t.qid,[t.wrongAnswer]);
 for(const a of M.QUESTIONS[t.qid].options)for(const b of M.QUESTIONS[probeIds[0]].options)for(const c of M.QUESTIONS[probeIds[1]].options){
  const history=[event(t.qid,[a.id]),event(probeIds[0],[b.id],'probe'),event(probeIds[1],[c.id],'probe')];
  const result=D.getBlockDiagnosis(block,history);
  assert.equal(!!result?.supported,a.id===t.wrongAnswer&&b.id===block.misconception.probeWrongAnswers[0]&&c.id===block.misconception.probeWrongAnswers[1],block.id);
  combinations++;
 }
 const probes=probeIds.map((id,i)=>event(id,[block.misconception.probeWrongAnswers[i]],'probe'));
 assert.equal(D.getBlockDiagnosis(block,probes),null,'Two errors without a trigger must not label a pattern');
 assert.equal(D.getBlockDiagnosis(block,[trigger,probes[0]]).supported,false,'One confirming probe is not sufficient');
 assert.equal(D.getBlockDiagnosis(block,[trigger,...probes.map(e=>({...e,payload:{...e.payload,sessionId:'other'}}))]).supported,false,'Do not mix sessions');
 assert.equal(D.getBlockDiagnosis(block,[...probes,trigger]).supported,false,'Do not use probes preceding the trigger');
 assert.equal(D.getBlockDiagnosis(block,[trigger,...probes]).supported,true);
 assert.equal(D.getBlockDiagnosis(block,[trigger,...probes,probes[1]]).supported,true,'Retrying an event is idempotent');
 assert.equal(D.getBlockDiagnosis(block,[trigger,...probes.map(e=>({...e,payload:{...e.payload,context:'practice'}}))]).supported,false,'The probe context matters');
 assert.equal(D.isMisconceptionTrigger(block,t.qid,[t.wrongAnswer,M.QUESTIONS[t.qid].answer[0]]),false,'Malformed multi-answer cannot confirm a single-choice error');
 let r=D.resumeBlock(block,[trigger]);assert.equal(r.stage,'probe');assert.equal(r.probeIndex,0);assert.equal(r.sessionId,'same');
 r=D.resumeBlock(block,[trigger,probes[0]]);assert.equal(r.stage,'probe');assert.equal(r.probeIndex,1);assert.deepEqual(r.probeAnswers,[probes[0].payload.answer]);
 r=D.resumeBlock(block,[trigger,...probes]);assert.equal(r.stage,'repair');assert.equal(r.supported,true);
 const noConfirmation=probeIds.map(id=>event(id,M.QUESTIONS[id].answer,'probe'));
 r=D.resumeBlock(block,[trigger,...noConfirmation]);assert.equal(r.stage,'repair');assert.equal(r.supported,false,'Unconfirmed suspicion uses neutral repair wording');
 const retests=block.retestIds.map(id=>event(id,M.QUESTIONS[id].answer,'retest'));
 if(retests.length>1){r=D.resumeBlock(block,[trigger,...probes,retests[0]]);assert.equal(r.stage,'retest');assert.equal(r.retestIndex,1);assert.deepEqual(r.retestSuccess,[true]);}
 r=D.resumeBlock(block,[trigger,...probes,...retests]);const index=block.questionIds.indexOf(t.qid);assert.equal(r.stage,index===block.questionIds.length-1?'complete':'practice');assert.ok(r.retestSuccess.every(Boolean));
 const wrongRetests=block.retestIds.map(id=>event(id,[],'retest'));
 assert.equal(D.getBlockDiagnosis(block,[trigger,...probes,...wrongRetests]).retested,false,'Stored payload.correct cannot make a failed repair successful');
 const closure={id:'finished-'+block.id,type:'block',at:++n,payload:{blockId:block.id}};
 assert.equal(D.resumeBlock(block,[trigger,...probes,...retests,closure]).stage,'theory');
 assert.equal(M.visibleEvidenceAnswers([trigger,...probes],M.BANK.checkpointIds).length,1,'Diagnostic answers never affect counters');
}
const cps=M.BANK.checkpointIds.map(id=>event(id,M.QUESTIONS[id].answer,'check','check-1'));
for(let i=1;i<cps.length;i++){
 const shown=M.visibleEvidenceAnswers(cps.slice(0,i),M.BANK.checkpointIds);
 assert.equal(shown.length,0,'No evidence release before the whole check');
 const progress=M.deriveProgress(cps.slice(0,i));
 assert.equal(progress.xp,0);
 for(const skill of Object.values(progress.skills)){assert.equal(skill.independent,0);assert.equal(skill.helped,0);}
}
assert.equal(M.visibleEvidenceAnswers(cps,M.BANK.checkpointIds).length,cps.length);
assert.equal(M.deriveProgress(M.visibleEvidenceAnswers(cps,M.BANK.checkpointIds)).successfulCheck,true);
console.log(`Diagnostic proposal passed ${combinations} complete answer combinations, all 4 resume chains, session isolation, forged correctness, and 7 incomplete-check counter states.`);
