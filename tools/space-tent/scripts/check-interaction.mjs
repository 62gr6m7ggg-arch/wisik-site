// Run from the Site checkout after copying to scripts/check-interaction.mjs.
// SSR validates exact component output. Pointer/touch behavior still needs browser QA.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const site=process.env.SPACE_AUDIT_SITE||process.cwd(),require=createRequire(site+'/package.json');
const {build}=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const learningPath=resolve(site,'app/learning.tsx');
const result=await build({stdin:{contents:`export * as React from 'react';export {renderToStaticMarkup} from 'react-dom/server';export {BANK,COURSE,QUESTIONS,CHECKS,deriveProgress} from './app/model'; export {QuestionCard,LearningView} from './app/learning'; export {default as QuestionFigure} from './app/question-figure'; export {default as Geometry} from './app/geometry'; export {default as Workbench} from './app/workbench'; export * as G from './app/geometry-math'; export * as W from './app/workbench-math'; export * as V from './app/question-visuals'; export * as R from './app/rotation'; export * as CV from './app/construction-visuals'; export * as PM from './app/projection-lesson-math'; export * as VM from './app/viewing-math'; export {default as CourseFigure} from './app/course-figure'; export {default as InsightFigure} from './app/insight-figure'; export {default as ConstructionLab} from './app/construction-lab'; export {default as CoursePaper} from './app/course-paper'; export {default as Paper} from './app/paper'; export {ProjectionLessonFrame,ViewingCue} from './app/projection-lesson';`,resolveDir:site},absWorkingDir:site,tsconfig:resolve(site,'tsconfig.json'),bundle:true,platform:'node',format:'cjs',minify:process.argv.includes('--compile'),define:{'process.env.NODE_ENV':'"production"'},packages:process.argv.includes('--compile')?'bundle':'external',write:false,plugins:[{name:'question-state-fixture',setup(b){b.onLoad({filter:/[/\\]app[/\\]geometry\.tsx$/},args=>{
 let source=readFileSync(args.path,'utf8');const anchor="[planeFocus,setPlaneFocus]=useState('')";
 assert.equal(source.split(anchor).length,2);
 source=source.replace(anchor,"[planeFocus,setPlaneFocus]=useState(globalThis.__planeFixture||'')");
 return {contents:source,loader:'tsx',resolveDir:resolve(site,'app')};
});b.onLoad({filter:/[/\\]app[/\\]learning\.tsx$/},args=>{
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
const {BANK,CHECKS,QuestionCard,LearningView,QuestionFigure,Geometry,Workbench,G,W,V,R,deriveProgress}=module.exports;
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
   if(context==='check'||context==='probe')assert.ok(!html.includes('data-viewing-guide'),'Extra viewing aids stay hidden during assessment and diagnosis');
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
 const data=q.scene?(reveal?(q.revealScene||q.scene):q.scene):V.questionGeometry(q,reveal),points={...(data.showCube===false?{}:G.CUBE),...data.points};
 const before=JSON.stringify(points),values=Object.values(points);
 const project=p=>G.parallelImage(p,'spatial',...camera);
 const ps=values.map(project);assert.ok(ps.flat().every(Number.isFinite),q.id);
 const frame=G.projectionFrame(ps,320,310);assert.ok(Number.isFinite(frame.scale)&&frame.scale>0);
 for(const line of data.highlights||[]){const a=points[line[0]],b=points[line[1]],mid=G.mul(G.add(a,b),.5);const actual=project(mid),expected=G.mul(G.add([...project(a),0],[...project(b),0]),.5);near(actual[0],expected[0]);near(actual[1],expected[1]);}
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
for(const ids of Object.values(CHECKS)){
const checkpoint=ids.map((id,i)=>({id:'audit-check-'+i,type:'answer',at:i,payload:{questionId:id,answer:BANK.questions.find(q=>q.id===id).answer,helped:false,context:'check',sessionId:'audit',correct:true}}));
for(let i=1;i<checkpoint.length;i++){const p=deriveProgress(checkpoint.slice(0,i));assert.equal(p.xp,0);for(const s of Object.values(p.skills)){assert.equal(s.independent,0);assert.equal(s.helped,0);}}
}
console.log(`Interaction SSR checks passed: ${cards} question-card states, ${figures} feedback figures, ${BANK.blocks.length} deferred triggers, ${cameras.length} camera movements and ${projections} projected question scenes. Pointer behavior still requires browser QA.`);

// Visual identity must survive extension/resume; side-face aids cannot reveal a section.
{
 const {CV}=module.exports;
 const ls=[{id:'one',name:'PQ',a:[0,0,.3],b:[1,0,.5]},{id:'two',name:'QR',a:[1,0,.5],b:[1,1,.7]}];
 assert.notEqual(CV.lineColor(ls[0],ls),CV.lineColor(ls[1],ls));
 const extended=JSON.parse(JSON.stringify(ls));extended[0].infinite=true;
 assert.equal(CV.lineColor(extended[0],extended),CV.lineColor(ls[0],ls));
 const html=render(Geometry,{construction:true,lines:extended});
 for(const l of ls)assert.ok(html.includes(CV.lineColor(l,ls)));
 assert.ok(html.includes('stroke-dasharray="8 4"'));
 assert.ok(!html.includes('Gearceerd vlak'),'No side face or answer plane appears automatically');
 const tasks=JSON.parse(readFileSync(resolve(site,'app/construction-tasks.json'),'utf8')).tasks;
 for(const task of tasks){
  const faces=CV.boundaryFaces(task.edges,task.points);
  const section=CV.closedSectionPlane(task.targetSegments,{...task.points,...task.solutionPoints});
  assert.equal(section.length,task.targetSegments.length>=3?1:0,task.id+' closed solution plane');
  const vertices=[...new Set(task.edges.join(''))];
  assert.equal(vertices.length-task.edges.length+faces.length,2,task.id+' Euler boundary');
  for(const edge of task.edges)assert.equal(faces.filter(f=>f.some((v,i)=>(v===edge[0]&&f[(i+1)%f.length]===edge[1])||(v===edge[1]&&f[(i+1)%f.length]===edge[0]))).length,2,task.id+'/'+edge);
  for(const face of faces){
   assert.ok(face.every(v=>vertices.includes(v)),'No given section point becomes a boundary vertex');
   const [a,b,c]=face.map(v=>task.points[v]),n=G.cross(G.sub(b,a),G.sub(c,a));
   assert.ok(Math.hypot(...n)>1e-8);
   for(const key of face)assert.ok(Math.abs(G.dot(n,G.sub(task.points[key],a)))<1e-7);
  }
 }
 const markup=renderToStaticMarkup(React.createElement('div',null,...[1,2].map(key=>React.createElement(Geometry,{key,planes:[['A','B','F','E']]}))));
 const ids=[...markup.matchAll(/id="([^"]*-hatch-0)"/g)].map(m=>m[1]);assert.equal(ids.length,2);assert.notEqual(ids[0],ids[1]);
 assert.ok(markup.includes('fill-opacity=".09"'));
 console.log('Construction visual checks passed: stable line colors, distinct hatch IDs, no automatic answer planes, and complete convex boundary faces for all tasks.');
}

// Every animated position must describe one real parallel projection, with its
// ray, image plane and numerical lengths derived from that same geometry.
{
 const {PM,ProjectionLessonFrame}=module.exports;
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
 assert.deepEqual(PM.lessonImageLengths(PM.lessonProjection(0)),{AB:4,AD:2,AE:4});
 assert.deepEqual(PM.lessonImageLengths(PM.lessonProjection(1)),{AB:4,AD:0,AE:4});
 for(let i=0;i<=200;i++){
  const position=i/100,b=PM.lessonProjection(position),normal=G.cross(b.planeRight,b.planeUp),toward=G.mul(b.eye,-1);
  near(G.dot(b.planeRight,b.planeUp),0);near(G.dot(b.planeRight,b.planeRight),1);near(G.dot(b.planeUp,b.planeUp),1);near(G.dot(b.eye,b.eye),1);
  assert.ok(Math.abs(G.dot(normal,toward))>.1,'Ray is not parallel to its image plane');
  near(Math.hypot(...PM.projectLessonPoint(toward,b)),0,'The viewing direction disappears in its own projection');
  for(const point of Object.values(G.CUBE)){
   // Independently intersect the ray with the plane through the origin.
   const t=-G.dot(normal,point)/G.dot(normal,toward),hit=G.add(point,G.mul(toward,t));
   const expected=[G.dot(hit,b.planeRight),-G.dot(hit,b.planeUp)],actual=PM.projectLessonPoint(point,b);
   near(actual[0],expected[0]);near(actual[1],expected[1]);
  }
  if(position<1){assert.ok(b.eye[0]>0&&b.eye[1]<0&&b.eye[2]>0);near(PM.lessonImageLengths(b).AB,PM.lessonImageLengths(b).AE);}
  if(position>1){assert.ok(b.eye[0]>0&&b.eye[1]<0&&b.eye[2]>0);for(const [j,name]of ['AB','AD','AE'].entries())near(PM.lessonImageLengths(b)[name],4*Math.sqrt(1-b.eye[j]**2));}
  for(const width of [280,320,440,800]){
   const height=width<390?310:390,{center,scale}=G.projectionFrame(PM.LESSON_FRAME,width,height);
   for(const p of Object.values(G.CUBE)){const raw=PM.projectLessonPoint(G.sub(p,[.5,.5,.5]),b),x=width/2+(raw[0]-center[0])*scale,y=height/2+(raw[1]-center[1])*scale;assert.ok(x>=40&&x<=width-40&&y>=40&&y<=height-40,'Animated corner remains inside the figure');}
  }
 }
 for(const p of Object.values(G.CUBE)){
  const a=G.parallelImage(p,'scaled'),b=PM.projectLessonPoint(p,PM.lessonProjection(0));near(a[0],4*b[0]);near(a[1],4*b[1]);
 }
 const probe=V.questionGeometry(BANK.questions.find(q=>q.id==='probe-p1'));
 const project=p=>G.parallelImage(p,probe.view,...probe.camera);
 assert.ok(Math.hypot(...project(G.CUBE.E))<Math.hypot(...project(G.CUBE.B)),'The diagnostic AE-shorter-than-AB premise still holds');
 for(const position of [0,.5,1,1.5,2]){
  const html=render(ProjectionLessonFrame,{position});assertFinite(html,'projection lesson '+position);
  assert.ok(html.includes('marker-end="url(#look-')&&html.includes('het blauwe kader is het tekenvlak'));
  assert.ok(html.includes('Beeld AB:')&&html.includes('Beeld AD:')&&html.includes('Beeld AE:'),'Image lengths must be visibly distinguished from real lengths');
  assert.ok(html.includes(position===1?'Je kijkt recht van voren.':'Je kijkt schuin van voren, van rechts en van boven.'));
 }
 console.log('Projection checks passed: 201 valid intermediate projections, consistent rays/planes/lengths, and four viewport sizes.');
}

// Whole-tool viewing review: match the active projection, preserve flat metrics,
// retain assessment independence and compare unchanged primary SVGs with 0.4.2.
{
 const {VM,PM,COURSE,CourseFigure,InsightFigure,ConstructionLab,CoursePaper,Paper}=module.exports;
 const digest=value=>require('node:crypto').createHash('sha256').update(value).digest('hex');
 function firstSvg(html){const begin=html.indexOf('<svg');if(begin<0)return '';let depth=0;for(const m of html.slice(begin).matchAll(/<\/?svg\b[^>]*>/g)){depth+=m[0].startsWith('</')?-1:1;if(depth===0)return html.slice(begin,begin+m.index+m[0].length).replace(/id="[^"]+"/g,'id="ID"').replace(/url\(#[^)]+\)/g,'url(#ID)');}throw Error('Unclosed SVG');}
 const old=JSON.parse(readFileSync(resolve(site,'validation/visual-regression-042.json'),'utf8'));
 let preserved=0;
 for(const question of BANK.questions)for(const reveal of [false,true]){
  const key=question.id+'/'+reveal,actual=digest(firstSvg(render(QuestionFigure,{question,reveal})));
  if(question.id==='probe-p2')assert.notEqual(actual,old[key],'The paired-camera comparison deliberately gets one fixed scale');
  else{assert.equal(actual,old[key],key+' original main figure must stay intact');preserved++;}
 }
 const q3=render(QuestionFigure,{question:BANK.questions.find(q=>q.id==='p3'),reveal:true});
 assert.ok(q3.includes('Van boven: 90°')&&q3.includes('A / E')&&q3.includes('B / F'),'The counterexample really includes the top view');
 const q3Before=render(QuestionFigure,{question:BANK.questions.find(q=>q.id==='p3')});
 assert.ok(!q3Before.includes('Van boven: 90°')&&!q3Before.includes('In de ruimte: 60°'),'No counterexample is taught before answering');
 let rays=0;
 for(const view of ['front','top','right','scaled','equal-image','spatial'])for(const a of [-175,-90,-28,0,28,90,175])for(const t of [-80,-24,0,24,80]){
  const b=VM.viewingBasis(view,a,t);near(G.dot(b.eye,b.eye),1);near(Math.hypot(...PM.projectLessonPoint(b.eye,b)),0);
  for(const p of Object.values(G.CUBE)){const expected=G.parallelImage(p,view,a,t),actual=PM.projectLessonPoint(p,b);near(expected[0],actual[0]);near(expected[1],actual[1]);}
  const ray=G.parallelImage(b.eye,'spatial',...VM.referenceCamera(b.eye));assert.ok(Math.hypot(...ray)>.6,'The overview arrow must remain visible');rays++;
 }
 assert.equal(VM.eyeLabel([0,-1,0]),'Je kijkt van voren.');
 assert.equal(VM.eyeLabel([-1,0,0]),'Je kijkt van links.');
 assert.equal(VM.eyeLabel([0,0,-1]),'Je kijkt van onderen.');
 assert.equal(VM.planeBasis(['A','B','C','G'],G.CUBE,[1,-1,1]),null,'A noncoplanar set is not a study plane');
 assert.equal(VM.planeBasis(['A','B','Z'],G.CUBE,[1,-1,1]),null);
 assert.equal(VM.planeBasis(['A','B','M'],{...G.CUBE,M:[.5,0,0]},[1,-1,1]),null);
 // Independent distances in a non-cubic solid must also survive a plane view.
 for(const dimensions of [[1,1,1],[5,6,4],[8,3,12]]){
  const points=Object.fromEntries(Object.entries(G.CUBE).map(([k,p])=>[k,p.map((v,i)=>v*dimensions[i])]));
  for(const names of ['ADHE','ACGE','ABGH','ABF']){
   const b=VM.planeBasis([...names],points,[1,-1,1]);assert.ok(b);
   near(G.dot(b.right,b.up),0);near(G.dot(b.eye,b.right),0);near(G.dot(b.eye,b.up),0);
   near(G.dot(b.right,b.right),1);near(G.dot(b.up,b.up),1);
   for(const a of names)for(const c of names)near(Math.hypot(...sub2(PM.projectLessonPoint(points[a],b),PM.projectLessonPoint(points[c],b))),G.distance(points[a],points[c]));
  }
 }
 let instructions=0,studyViews=0;
 for(const block of BANK.blocks)for(const entry of [...block.theory,block.repair]){
  const html=entry.scene?render(CourseFigure,{scene:entry.scene}):entry.example?render(InsightFigure,{example:entry.example}):render(Geometry,entry);
  assertFinite(html,block.id+'/'+entry.title);instructions++;
  if(!entry.scene)continue;
  const scene=entry.scene,dimensions=scene.dimensions||[1,1,1],points=Object.fromEntries(Object.entries({...scene.showCube===false?{}:G.CUBE,...scene.points}).map(([k,p])=>[k,p.map((v,i)=>(v-.5)*dimensions[i])]));
  for(const names of scene.studyPlanes||[]){
   const basis=VM.planeBasis(names,points,[1,-1,1]);assert.ok(basis,block.id+'/'+names.join('')+' must be a real plane');
   for(const a of names)for(const b of names)near(Math.hypot(...sub2(PM.projectLessonPoint(points[a],basis),PM.projectLessonPoint(points[b],basis))),G.distance(points[a],points[b]));
   globalThis.__planeFixture=names.join('');
   const focused=render(CourseFigure,{scene});assertFinite(focused,block.id+'/'+names.join(''));
   assert.ok(focused.includes('Je kijkt loodrecht op vlak '+names.join(''))&&focused.includes('Terug naar de ruimtelijke tekening'),block.id+' must show an active plane and a way back');
   assert.equal(hasRotation(focused),false,'Plane views must not offer an ineffective camera drag');
   delete globalThis.__planeFixture;studyViews++;
  }
 }
 const fixedBefore=firstSvg(render(Geometry,{guidance:false,planes:[['A','B','C','D']]}));
 globalThis.__planeFixture='ABCD';
 assert.equal(firstSvg(render(Geometry,{guidance:false,planes:[['A','B','C','D']]})),fixedBefore,'A leftover practice plane choice must never change an assessment projection');
 delete globalThis.__planeFixture;
 const tasks=JSON.parse(readFileSync(resolve(site,'app/construction-tasks.json'),'utf8')).tasks;
 for(const task of tasks){
  const html=render(ConstructionLab,{task,events:[],save:async()=>true,onBack:()=>{}});assertFinite(html,task.id);
  assert.equal(html.includes('data-viewing-guide'),!task.exam,task.id+' assessment independence');
  assert.ok(!html.includes('plane-view-controls'),'Construction point interaction remains separate from plane inspection');
  assert.ok(!html.includes('Gearceerd vlak'),'No automatically inferred answer plane in a construction attempt');
 }
 for(const paperKey of Object.keys(COURSE.papers))assert.ok(!render(CoursePaper,{paperKey,save:async()=>true,onBack:()=>{},alreadyDone:false}).includes('data-viewing-guide'),'Independent paper task '+paperKey);
 assert.ok(!render(Paper,{save:async()=>true,onBack:()=>{},alreadyDone:false}).includes('data-viewing-guide'));
 assert.match(geometrySource,/onExplore\?\.\(\);setPlaneFocus\(name\)/,'A practice plane view records support');
 assert.match(geometrySource,/function reset\(\)\{drag.current=null;setPlaneFocus\(''\)/,'Reset clears the active plane');
 const oldContract=JSON.parse(readFileSync(resolve(site,'validation/learning-contract-042.json'),'utf8'));
 const currentContract={questions:BANK.questions,blocks:BANK.blocks.map(({theory,repair,...rest})=>rest),checks:CHECKS,papers:COURSE.papers,constructions:tasks};
 assert.deepEqual(currentContract,oldContract,'Questions, answers, diagnoses, checks, paper tasks and construction data stay intact');
 const ledger=JSON.parse(readFileSync(resolve(site,'validation/viewing-review-043.json'),'utf8'));
 assert.deepEqual(ledger.questions.map(q=>q.id).sort(),BANK.questions.map(q=>q.id).sort());
 assert.deepEqual(ledger.blocks.map(b=>b.id).sort(),BANK.blocks.map(b=>b.id).sort());
 assert.equal(ledger.instructionStates,instructions);assert.equal(ledger.explicitStudyViews,studyViews);
 console.log(`Whole-tool viewing checks passed: ${instructions} instruction/repair states, ${studyViews} explicit study-plane views, ${rays} matching view/ray models, ${preserved} unchanged primary SVGs, all ${tasks.length} construction tasks and ${Object.keys(COURSE.papers).length+1} paper tasks. All grading and diagnosis data match 0.4.2.`);
}
