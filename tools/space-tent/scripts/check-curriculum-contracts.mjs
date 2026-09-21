import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {build} from 'esbuild';

// Deliberately extend a real bank in memory so migration is exercised even if
// a future edit temporarily makes the live and legacy lists identical.
const course=JSON.parse(readFileSync('app/course-content.json','utf8'));
const block=course.blocks.find(b=>b.level===4);
const extra=block.retestIds.find(id=>!Object.values(course.checks).flat().includes(id));
assert.ok(extra);
course.checks['4']=[...course.checks['4'],extra];
block.questionIds=[block.questionIds[0],extra,...block.questionIds.slice(1)];
const bundle=await build({stdin:{contents:"export * as M from './app/model';export * as L from './app/local-progress';export * as D from './app/diagnostic';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false,plugins:[{name:'extended-curriculum',setup(b){b.onLoad({filter:/course-content\.json$/},()=>({contents:JSON.stringify(course),loader:'json'}));}}]});
const {M,L,D}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
let n=0;
const answer=(id,sessionId='historical',context='check',helped=false)=>({id:'contract-test-'+String(++n).padStart(6,'0'),type:'answer',at:n,payload:{questionId:id,answer:[...M.QUESTIONS[id].answer],context,sessionId,helped}});
const legacyIds=M.LEGACY_CHECKS['4'],currentIds=M.CHECKS['4'];
assert.ok(currentIds.length>legacyIds.length);
const legacy=legacyIds.map(id=>answer(id));
const envelope=(events,modern=false)=>JSON.stringify({format:L.LOCAL_PROGRESS_FORMAT,version:L.LOCAL_PROGRESS_VERSION,...(modern?{curriculumContracts:L.CURRICULUM_CONTRACT_VERSION}:{}),events});
const create=(events,modern=false)=>{
 const values=new Map(events?[[L.LOCAL_PROGRESS_KEY,envelope(events,modern)]]:[]);
 const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 return {store:L.createLocalProgressStore(storage),values,storage};
};
const append=(store,event)=>store.append({id:event.id,type:event.type,payload:event.payload},event.at);
const attempt=events=>M.checkAttempts(events,'4').at(-1);

// Historical successes remain historical successes, including their visible
// feedback and XP. Normalizing never trusts a supplied correctness flag.
const old=create(legacy),loaded=old.store.load();
assert.equal(loaded.ok,true,loaded.error);
assert.equal(attempt(loaded.events).passed,true);
assert.deepEqual(attempt(loaded.events).questionIds,legacyIds);
assert.equal(M.deriveProgress(loaded.events).xp,100);
assert.equal(M.visibleEvidenceAnswers(loaded.events,M.BANK.checkpointIds).length,legacyIds.length);
assert.equal(attempt(L.migrateLegacyEvents(legacy)).passed,true,'Bare remote history migrates too');
const exported=old.store.exportProgress();
assert.equal(JSON.parse(exported.text).curriculumContracts,L.CURRICULUM_CONTRACT_VERSION);
const restored=create();
assert.equal(restored.store.importProgress(exported.text).ok,true);
assert.equal(restored.store.importProgress(exported.text).events.length,legacy.length);
assert.equal(attempt(restored.store.load().events).passed,true);

// A new attempt, even with only former questions answered, must not acquire
// the legacy contract during reload, repeated imports or a progress export.
const fresh=create();
for(const id of legacyIds)assert.equal(append(fresh.store,answer(id,'new')).ok,true);
assert.equal(attempt(fresh.store.load().events).complete,false);
assert.equal(M.deriveProgress(fresh.store.load().events).xp,0);
assert.equal(M.visibleEvidenceAnswers(fresh.store.load().events,M.BANK.checkpointIds).length,0);
assert.equal(attempt(create(legacy,true).store.load().events).complete,false,'Modern envelope does not infer old coverage');
assert.equal(attempt(legacy).complete,false,'Uncontracted model-only fixtures are current, not legacy');
for(const id of currentIds.filter(id=>!legacyIds.includes(id)))assert.equal(append(fresh.store,answer(id,'new')).ok,true);
assert.equal(attempt(fresh.store.load().events).passed,true);

// An unfinished old session is expanded once. Answering the rest of its old
// questions cannot trigger feedback or a pass before the added questions.
const partial=create(legacy.slice(0,2));
assert.deepEqual(attempt(partial.store.load().events).questionIds,currentIds);
for(const id of legacyIds.slice(2))assert.equal(append(partial.store,answer(id)).ok,true);
assert.equal(attempt(partial.store.load().events).complete,false);
assert.equal(M.visibleEvidenceAnswers(partial.store.load().events,M.BANK.checkpointIds).length,0);
for(const id of currentIds.filter(id=>!legacyIds.includes(id)))assert.equal(append(partial.store,answer(id)).ok,true);
assert.equal(attempt(partial.store.load().events).passed,true);

const helped=legacy.map(e=>({...e,payload:{...e.payload}}));
helped.splice(1,0,{id:'legacy-lookup-000001',type:'lookup',at:helped[0].at,payload:{questionId:legacyIds[0],context:'check',sessionId:'historical'}});
const helpAttempt=attempt(create(helped).store.load().events);
assert.equal(helpAttempt.complete,true);assert.equal(helpAttempt.helped,true);assert.equal(helpAttempt.passed,false);
const lookupOnly=create([helped[1]]).store.load();
assert.deepEqual(attempt(lookupOnly.events).questionIds,currentIds);assert.equal(attempt(lookupOnly.events).helped,true);
const invalid=create();
assert.equal(append(invalid.store,{...answer(legacyIds[0]),payload:{...answer(legacyIds[0]).payload,checkQuestionIds:[legacyIds[0]]}}).ok,false,'Cannot forge a short contract');
const mixed=create();
assert.equal(append(mixed.store,answer(legacyIds[0])).ok,true);
assert.equal(append(mixed.store,{...answer(legacyIds[1]),payload:{...answer(legacyIds[1]).payload,checkQuestionIds:legacyIds}}).ok,false,'One session cannot switch its contract');

// Already completed blocks keep the coverage that justified them. New block
// completions still require the expanded practice list.
const blockIds=M.LEGACY_BLOCK_QUESTIONS[block.id];
const historicalBlock=blockIds.map(id=>answer(id,'old-block','practice'));
historicalBlock.push({id:'completed-block-0001',type:'block',at:++n,payload:{blockId:block.id}});
const blockStore=create(historicalBlock);
assert.equal(blockStore.store.load().ok,true);
assert.ok(M.deriveProgress(blockStore.store.load().events).complete.includes(block.id));
const newBlock=create();
for(const id of blockIds)assert.equal(append(newBlock.store,answer(id,'new-block','practice')).ok,true);
assert.equal(append(newBlock.store,{id:'new-block-complete-0001',type:'block',at:++n,payload:{blockId:block.id}}).ok,false);
for(const id of block.questionIds.filter(id=>!blockIds.includes(id)))assert.equal(append(newBlock.store,answer(id,'new-block','practice')).ok,true);
assert.equal(append(newBlock.store,{id:'new-block-complete-0001',type:'block',at:++n,payload:{blockId:block.id}}).ok,true);

// Interleaving new practice questions cannot silently skip a question before
// the last old answer. Keep the diagnostic detour before filling those gaps.
const activeBlock=M.BANK.blocks.find(b=>b.id===block.id);
const partialBlock=blockIds.slice(0,3).map(id=>answer(id,'interleaved','practice'));
const resumed=D.resumeBlock(activeBlock,partialBlock);
assert.equal(resumed.stage,'practice');
assert.equal(activeBlock.questionIds[resumed.index],extra);
partialBlock.push(answer(extra,'interleaved','practice'));
const following=D.nextUnansweredQuestionIndex(activeBlock,partialBlock,'interleaved');
assert.equal(activeBlock.questionIds[following],activeBlock.questionIds.find(id=>!partialBlock.some(e=>e.payload.questionId===id)));
assert.equal(D.nextUnansweredQuestionIndex(activeBlock,partialBlock,'fresh-session'),0,'Previous session does not skip a deliberate new practice run');
const trigger=activeBlock.misconception.trigger;
const interrupted=partialBlock.filter(e=>e.payload.questionId!==trigger.qid&&e.payload.questionId!==extra);
interrupted.push({...answer(trigger.qid,'interleaved','practice'),payload:{...answer(trigger.qid,'interleaved','practice').payload,answer:[trigger.wrongAnswer]}});
assert.equal(D.resumeBlock(activeBlock,interrupted).stage,'probe','Finish a pending diagnosis before filling new gaps');
assert.ok(!readFileSync(resolve('app/local-progress.ts'),'utf8').includes('Date.parse('),'No wall-clock migration cutoff');
console.log('Curriculum contracts passed: historical checks/blocks, expanded/interleaved new and resumed sessions, delayed feedback, lookup support, import/export, bare remote events, invalid/conflicting contracts.');
