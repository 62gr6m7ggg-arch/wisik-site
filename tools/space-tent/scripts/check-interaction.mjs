// Run from the Site checkout after copying to scripts/check-interaction.mjs.
// SSR validates exact component output. Pointer/touch behavior still needs browser QA.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const site=process.env.SPACE_AUDIT_SITE||process.cwd(),require=createRequire(site+'/package.json');
const {build}=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const learningPath=resolve(site,'app/learning.tsx');
const result=await build({stdin:{contents:`export * as React from 'react';export {renderToStaticMarkup} from 'react-dom/server';export {BANK,QUESTIONS,deriveProgress} from './app/model'; export {QuestionCard,LearningView} from './app/learning'; export {default as QuestionFigure} from './app/question-figure'; export {default as Geometry} from './app/geometry'; export {default as Workbench} from './app/workbench'; export * as G from './app/geometry-math'; export * as W from './app/workbench-math'; export * as V from './app/question-visuals'; export * as R from './app/rotation';`,resolveDir:site},absWorkingDir:site,tsconfig:resolve(site,'tsconfig.json'),bundle:true,platform:'node',format:'cjs',minify:process.argv.includes('--compile'),define:{'process.env.NODE_ENV':'"production"'},packages:process.argv.includes('--compile')?'bundle':'external',write:false,plugins:[{name:'question-state-fixture',setup(b){b.onLoad({filter:/[/\\]app[/\\]learning\.tsx$/},args=>{
 assert.equal(args.path,learningPath);
 let source=readFileSync(args.path,'utf8');
 // Inject only the initial state for SSR, never changing render/feedback logic.
 // The original component has no exported state-fixture API.
 for(const [from,to] of [
  ['[answer,setAnswer]=useState<string[]>([])','[answer,setAnswer]=useState<string[]>(globalThis.__questionFixture?.answer||[])'],
  ['[submitted,setSubmitted]=useState(false)','[submitted,setSubmitted]=useState(!!globalThis.__questionFixture?.submitted)'],
 ]){assert.equal(source.split(from).length,2,'Question state fixture anchor must remain unique');source=source.replace(from,to);}
 return {contents:source,loader:'tsx',resolveDir:resolve(site,'app')};
});}}]});
if(process.argv.includes('--compile')){
 const tail=readFileSync(new URL(import.meta.url),'utf8').split('/* STANDALONE TESTS */').at(-1);
 mkdirSync('.audit-dist',{recursive:true});
 writeFileSync('.audit-dist/check-interaction.cjs',result.outputFiles[0].text+"\n{const assert=require('node:assert/strict');const {readFileSync}=require('node:fs');const {resolve}=require('node:path');const site=process.cwd();const learningPath=resolve(site,'app/learning.tsx');const {React,renderToStaticMarkup}=module.exports;\n"+tail+"\n}");
 process.exit(0);
}
const module={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(require,module,module.exports);
/* STANDALONE TESTS */
const {BANK,QuestionCard,LearningView,QuestionFigure,Geometry,Workbench,G,W,V,R,deriveProgress}=module.exports;
const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
const hasRotation=html=>html.includes('>Onderzoeken in 3D<')||html.includes('>Rondkijken<')||html.includes('class="geometry-stage can-rotate"');
const assertFinite=(html,id)=>assert.ok(!/(?:NaN|Infinity)/.test(html),id+' contains non-finite coordinates');
let cards=0,figures=0;
for(const question of BANK.questions){
 for(const context of ['practice','retest','probe','check'])for(const submitted of [false,true]){
  // Correct and incorrect submissions: feedback has to obey the context in both.
  for(const answer of submitted?[question.answer,question.options?[question.options.find(o=>!question.answer.includes(o.id)).id]:['A']]:[[]]){
   globalThis.__questionFixture={submitted,answer};
   const html=render(QuestionCard,{question,context,sessionId:'render-audit',save:async()=>true,onNext:()=>{},number:1,total:8});
   assertFinite(html,`${question.id}/${context}/${submitted}`);
   const hidden=!submitted||context==='check'||context==='probe';
   if(hidden)assert.ok(!html.includes('answer-correct')&&!html.includes('class="correct-answer"'),`${question.id}/${context} leaks correctness`);
   if(context==='check'||context==='probe'||question.block==='projection')assert.equal(hasRotation(html),false,`${question.id}/${context} must have a fixed view`);
   if(submitted&&(context==='probe'||context==='check'))assert.ok(html.includes('Antwoord vastgelegd.')&&!html.includes('Bekijk de redenering.'),`${question.id}/${context} must defer feedback`);
   if(!submitted&&question.id==='p2')assert.ok(!/>M<|>M<\/span>/.test(html),'p2 must not draw the hidden midpoint');
   if(!submitted&&question.id==='cp-p1')assert.ok(!/>N<|>N<\/span>/.test(html),'cp-p1 must not draw the hidden division point');
   cards++;
  }
 }
 for(const reveal of [false,true]){const html=render(QuestionFigure,{question,reveal,answer:question.answer});assertFinite(html,question.id);figures++;}
}
// Trigger feedback is also withheld in an ordinary practice card.
for(const block of BANK.blocks){
 const trigger=block.misconception.trigger,question=BANK.questions.find(q=>q.id===trigger.qid);
 globalThis.__questionFixture={submitted:true,answer:[trigger.wrongAnswer]};
 const html=render(QuestionCard,{question,context:'practice',deferOnAnswer:trigger.wrongAnswer,sessionId:'render-audit',save:async()=>true,onNext:()=>{},number:1,total:8});
 assert.ok(html.includes('Antwoord vastgelegd.')&&!html.includes('answer-correct')&&!html.includes('class="correct-answer"'),block.id+' must not preteach its probes');
}
delete globalThis.__questionFixture;
// Render the resumed UI itself as well as testing the pure resume model.
let sequence=0;
const answerEvent=(questionId,answer,context)=>({id:'resume-'+(++sequence),type:'answer',at:sequence,payload:{questionId,answer,context,sessionId:'same-resume',helped:false,correct:false}});
for(const block of BANK.blocks){
 const trigger=answerEvent(block.misconception.trigger.qid,[block.misconception.trigger.wrongAnswer],'practice');
 const probes=block.probeIds.map((id,i)=>answerEvent(id,[block.misconception.probeWrongAnswers[i]],'probe'));
 const retests=block.retestIds.map(id=>answerEvent(id,BANK.questions.find(q=>q.id===id).answer,'retest'));
 const resume=events=>render(LearningView,{block,events,save:async()=>true,onBack:()=>{},onDone:()=>{}});
 assert.ok(resume([trigger]).includes('EVEN PRECIES KIJKEN'),block.id+' must resume the first probe');
 assert.ok(resume([trigger,probes[0]]).includes('2 / 2'),block.id+' must resume the second probe');
 assert.ok(resume([trigger,...probes]).includes('We zien hetzelfde denkpatroon.'),block.id+' must resume supported repair');
 const correctProbes=block.probeIds.map(id=>answerEvent(id,BANK.questions.find(q=>q.id===id).answer,'probe'));
 assert.ok(resume([trigger,...correctProbes]).includes('We maken het onderscheid helder.'),block.id+' must not assert a confirmed pattern');
 if(retests.length>1)assert.ok(resume([trigger,...probes,retests[0]]).includes('NIEUWE TOEPASSING'),block.id+' must resume unfinished repair practice');
 const isLast=block.questionIds.indexOf(block.misconception.trigger.qid)===block.questionIds.length-1;
 assert.ok(resume([trigger,...probes,...retests]).includes(isLast?'Blok afronden':'ZELF AAN DE SLAG'),block.id+' must continue or complete after retests');
}
const home=render(Geometry,{});assert.equal(hasRotation(home),true,'General teaching figures permit rotation');
const atelier=render(Workbench,{save:async()=>true,onBack:()=>{}});
assert.ok(atelier.includes('>Construeren<')&&atelier.includes('>Rondkijken<'));
assert.ok(atelier.includes('touch-action:pan-y'),'Construction mode preserves page scrolling');
assert.ok(atelier.includes('aria-pressed="true"'),'Construction mode is identified');
const source=readFileSync(learningPath,'utf8');
assert.match(source,/helped:hint\|\|guided\|\|rotated/,'Rotating a practice figure must register support');
assert.match(source,/onExplore=\{\(\)=>\{if\(!submitted\)setRotated\(true\)\}\}/,'Post-answer exploration must not retroactively change the support label');
const workbenchSource=readFileSync(resolve(site,'app/workbench.tsx'),'utf8');
assert.match(workbenchSource,/onExplore=\{\(\)=>\{if\(!done\)setHelped\(true\)\}\}/,'Workbench exploration must count as support only before completion');
const geometrySource=readFileSync(resolve(site,'app/geometry.tsx'),'utf8');
assert.match(geometrySource,/onPointerCancel=\{pointerEnd\}/,'Canceled touches must end the gesture');
assert.match(geometrySource,/onLostPointerCapture=/,'Lost pointer capture must clear gesture state');
assert.match(geometrySource,/onClickCapture=/,'A drag must not accidentally click a point');
assert.match(geometrySource,/disabled=\{construction&&explore\}/,'Point selection on the rotating figure is disabled in look mode');

// Camera limits, wrap-around, and drag threshold, including negative elevations.
assert.equal(R.hasDragged(3,4),false);assert.equal(R.hasDragged(6,0),true);assert.equal(R.hasDragged(0,-6),true);
const cameras=[];
for(const start of [[28,24],[-180,-80],[180,80],[0,0]])for(const dx of [-10000,-800,-6,0,6,800,10000])for(const dy of [-10000,-300,0,300,10000]){
 const camera=R.dragCamera(start,dx,dy);assert.ok(camera.every(Number.isFinite));assert.ok(camera[0]>=-180&&camera[0]<180);assert.ok(camera[1]>=-80&&camera[1]<=80);cameras.push(camera);
}
const near=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-7,message||`${a} != ${b}`);
const p2len=p=>Math.hypot(...p),sub2=(a,b)=>a.map((v,i)=>v-b[i]);
let projections=0;
for(const camera of cameras)for(const q of BANK.questions)for(const reveal of [false,true]){
 const data=V.questionGeometry(q,reveal),points={...G.CUBE,...data.points};
 const before=JSON.stringify(points),values=Object.values(points);
 const project=p=>G.parallelImage(p,'spatial',...camera);
 const ps=values.map(project);assert.ok(ps.flat().every(Number.isFinite),q.id);
 const frame=G.projectionFrame(ps,320,310);assert.ok(Number.isFinite(frame.scale)&&frame.scale>0);
 for(const line of data.highlights){const a=points[line[0]],b=points[line[1]],mid=G.mul(G.add(a,b),.5);const actual=project(mid),expected=G.mul(G.add([...project(a),0],[...project(b),0]),.5);near(actual[0],expected[0]);near(actual[1],expected[1]);}
 // Orthographic views cannot make a segment longer than its 3D length.
 for(let i=1;i<values.length;i++)assert.ok(p2len(sub2(ps[i],ps[0]))<=G.distance(values[i],values[0])+1e-7);
 assert.equal(JSON.stringify(points),before,'A camera operation must not change world geometry');projections++;
}
for(const variant of [0,1]){
 const points=W.initialPoints(variant),corners=W.sectionPoints(variant),lines=corners.map((a,i)=>({id:String(i),name:String(i),a,b:corners[(i+1)%4]}));
 assert.equal(W.verifyWorkbench(lines,{...points,S:corners[3]},variant),true);
 for(const camera of [[0,0],[90,0],[-90,0],[179,-80],[28,24]]){const html=render(Geometry,{construction:true,camera,points,lines,fitToContent:true,selectable:Object.keys(points)});assertFinite(html,'atelier');}
}
// Checkpoint evidence remains silent for all seven partial lengths.
const checkpoint=BANK.checkpointIds.map((id,i)=>({id:'audit-check-'+i,type:'answer',at:i,payload:{questionId:id,answer:BANK.questions.find(q=>q.id===id).answer,helped:false,context:'check',sessionId:'audit',correct:true}}));
for(let i=1;i<checkpoint.length;i++){const p=deriveProgress(checkpoint.slice(0,i));assert.equal(p.xp,0);for(const s of Object.values(p.skills)){assert.equal(s.independent,0);assert.equal(s.helped,0);}}
console.log(`Interaction SSR checks passed: ${cards} question-card states, ${figures} feedback figures, 4 deferred triggers, ${cameras.length} camera movements and ${projections} projected question scenes. Pointer behavior still requires browser QA.`);
