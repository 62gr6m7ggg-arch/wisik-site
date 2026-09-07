import assert from 'node:assert/strict';
import {build} from 'esbuild';
const out=await build({stdin:{contents:"export * as M from './app/model';export * as C from './app/course-construction';export * as L from './app/local-progress';export * as G from './app/geometry-math';export * as N from './app/numeric';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {M,C,L,G,N}=await import('data:text/javascript;base64,'+Buffer.from(out.outputFiles[0].text).toString('base64'));
/* COURSE TESTS */
let numeric=0,scenes=0,polygons=0,serial=0,clock=1000;
const event=(type,payload,at=++clock)=>({id:'course-audit-'+String(++serial).padStart(7,'0'),type,at,payload});
const answer=(id,context='practice',sid='audit')=>event('answer',{questionId:id,answer:M.QUESTIONS[id].answer,context,sessionId:sid,helped:false,working:'Een onafhankelijke uitgewerkte berekening.'});
assert.equal(new Set(M.BANK.questions.map(q=>q.id)).size,M.BANK.questions.length);
const assigned=M.BANK.blocks.flatMap(b=>[...b.questionIds,...b.probeIds,...b.retestIds]).concat(M.BANK.checkpointIds);
assert.equal(new Set(assigned).size,assigned.length,'Each question has one pedagogical role');assert.equal(assigned.length,M.BANK.questions.length);
function checkScene(s,name){
 if(!s)return;scenes++;const p={...(s.showCube===false?{}:G.CUBE),...s.points};assert.ok(Object.keys(p).length>1,name);for(const v of Object.values(p))assert.ok(v.length===3&&v.every(Number.isFinite),name);
 for(const line of [...(s.edges||[]),...(s.highlights||[])])assert.ok(line.length===2&&p[line[0]]&&p[line[1]],name+' missing line '+line);
 for(const plane of s.planes||[]){polygons++;assert.ok(plane.length>=3&&plane.every(k=>p[k]),name+' plane');const a=p[plane[0]],n=G.cross(G.sub(p[plane[1]],a),G.sub(p[plane[2]],a));assert.ok(Math.hypot(...n)>1e-9,name+' degenerate plane');for(const k of plane)assert.ok(Math.abs(G.dot(n,G.sub(p[k],a)))<1e-5,name+' noncoplanar polygon');}
 const points=[...Object.values(p),...(s.segments||[]).flatMap(l=>[l.from,l.to])];for(const camera of [[28,24],[-65,70],[140,-35]]){const raw=points.map(p=>G.parallelImage(p,'spatial',...camera));for(const width of [280,390,800]){const h=390,frame=G.projectionFrame(raw,width,h);assert.ok(Number.isFinite(frame.scale)&&frame.scale>0);for(const [x,y] of raw){assert.ok(Math.abs((x-frame.center[0])*frame.scale)<=width/2-49.9,name);assert.ok(Math.abs((y-frame.center[1])*frame.scale)<=h/2-49.9,name)}}}
}
for(const b of M.BANK.blocks){assert.ok(b.theory.length>=3);assert.equal(b.probeIds.length,2);assert.ok(b.retestIds.length>=1);const trigger=M.QUESTIONS[b.misconception.trigger.qid];assert.ok(b.questionIds.includes(trigger.id)&&trigger.type==='choice');assert.equal(M.correctAnswer(trigger,[b.misconception.trigger.wrongAnswer]),false);b.theory.forEach(t=>checkScene(t.scene,b.id+'/'+t.title));checkScene(b.repair.scene,b.id+'/repair');}
for(const q of M.BANK.questions){assert.equal(M.correctAnswer(q,q.answer),true,q.id);if(q.type==='numeric'){numeric++;assert.equal(M.correctAnswer(q,['Infinity']),false,q.id);assert.equal(M.correctAnswer(q,['1/0']),false,q.id);if(q.decimals!==undefined){const rounded=Number(Number(q.answer[0]).toFixed(q.decimals));assert.equal(M.correctAnswer(q,[String(rounded).replace('.',',')]),true,q.id+' rounded');assert.equal(M.correctAnswer(q,[String(rounded+1)]),false,q.id+' wrong');}}else if(q.type==='choice'){assert.ok(q.options.length>=3);assert.ok(q.options.some(o=>o.id===q.answer[0]));}checkScene(q.scene,q.id);checkScene(q.revealScene,q.id+'/feedback');}
for(const [key,paper] of Object.entries(M.COURSE.papers)){assert.equal(paper.rubric.length,4);assert.ok(paper.solution.length>=3);checkScene(paper.scene,'paper/'+key)}
for(const [key,ids] of Object.entries(M.CHECKS)){assert.ok(ids.length>=6);const es=ids.map(id=>answer(id,'check',key));for(let i=0;i<es.length;i++){const p=M.deriveProgress(es.slice(0,i));assert.equal(p.xp,0,key+' early XP');assert.equal(p.checks[key],false,key+' early pass')}assert.equal(M.deriveProgress(es).checks[key],true,key);const wrong=[{...es[0],payload:{...es[0].payload,answer:['invalid'],correct:true}},...es.slice(1)];assert.equal(M.deriveProgress(wrong).checks[key],false,key+' forged correct');}
const history=[];
for(let level=1;level<=6;level++){
 assert.ok(M.blocksForLevel(level).length>=3);assert.equal(M.deriveProgress(history).levels[level].passed,false);
 for(const b of M.blocksForLevel(level)){history.push(...b.questionIds.map(id=>answer(id)));history.push(event('block',{blockId:b.id}))}
 history.push(...M.CHECKS[level].map(id=>answer(id,'check','level-'+level)));assert.equal(M.deriveProgress(history).levels[level].passed,false,'No pass without paper and constructions');
 history.push(event('paper',{level:String(level),checks:['figure','relations','intersection','reason']}));
 for(const task of C.CONSTRUCTION_TASKS.filter(t=>t.level===level)){
  const lines=task.targetSegments.map(([a,b],i)=>({id:'line-'+i,name:'L'+i,a,b})),points={...task.points,...task.solutionPoints};
  assert.equal(C.verifyConstruction(task,lines,points),true,task.id);
  assert.equal(C.verifyConstruction(task,lines.map(l=>({...l,infinite:true})),points),false,task.id+' helpers alone');
  if(lines.length)assert.equal(C.verifyConstruction(task,lines.slice(1),points),false,task.id+' missing side');
  const base={taskId:task.id,lines,points,reason:task.reason.answer,helped:false};
  const draft=L.normalizeEvent(event('construction',{...base,submitted:false}));assert.equal(draft.payload.correct,false);assert.equal(M.deriveProgress([draft]).xp,0);
  const done=L.normalizeEvent(event('construction',{...base,submitted:true}));assert.equal(done.payload.correct,true);history.push(done);
 }
 assert.equal(M.deriveProgress(history).levels[level].passed,true,'Level '+level+' can be completed');
}
assert.equal(M.deriveProgress(history).levels[7].passed,false);
const a=M.CHECKS['7a'].map(id=>answer(id,'check','summit-a'));history.push(...a);
const aEnd=a.at(-1).at;
const premature=M.CHECKS['7b'].map((id,i)=>({...answer(id,'check','summit-early'),at:aEnd+M.RETENTION_MS-1+i}));
assert.equal(M.deriveProgress([...history,...premature]).levels[7].check,false,'Starting before 24h cannot pass retention');
clock=aEnd+M.RETENTION_MS+1;history.push(...M.CHECKS['7b'].map(id=>answer(id,'check','summit-b')));
for(const key of ['7a','7b'])history.push(event('paper',{level:key,checks:['figure','relations','intersection','reason']}));
for(const task of C.CONSTRUCTION_TASKS.filter(t=>t.level===7)){
 const lines=task.targetSegments.map(([a,b],i)=>({id:'line-'+i,name:'h'+i,a,b})),points={...task.points,...task.solutionPoints};
 history.push(L.normalizeEvent(event('construction',{taskId:task.id,lines,points,reason:task.reason.answer,helped:false,submitted:true})));
}
assert.equal(M.deriveProgress(history).levels[7].passed,true,'Full route reaches summit');
const validated=L.validateLocalEvents(history);assert.equal(M.deriveProgress(validated).levels[7].passed,true,'Roundtrip keeps summit evidence');
const withoutPaper=history.filter(e=>e.type!=='paper');assert.equal(M.deriveProgress(withoutPaper).levels[7].passed,false);
const withHelp=history.map(e=>e.type==='construction'?{...e,payload:{...e.payload,helped:true}}:e);assert.equal(M.deriveProgress(withHelp).levels[7].passed,false,'Critical exam construction may not be compensated');
assert.equal(N.numericValue('4*sqrt(2)'),4*Math.sqrt(2));assert.equal(N.numericValue('-2^2'),-4);assert.equal(N.numericValue('2^3^2'),512);assert.equal(N.numericValue('alert(1)'),null);
console.log(`Course checks passed: ${M.BANK.questions.length} questions, ${numeric} numeric answer keys and rounded inputs, ${scenes} scenes, ${polygons} plane polygons, ${C.CONSTRUCTION_TASKS.length} construction tasks, eight assessment groups and a complete seven-level storage roundtrip with delayed summit gate.`);
