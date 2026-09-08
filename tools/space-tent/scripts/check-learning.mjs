import {build} from 'esbuild';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
async function load(entry){const result=await build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',write:false});return import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));}
const M=await load('app/model.ts'),G=await load('app/geometry-math.ts'),W=await load('app/workbench-math.ts'),R=await load('app/route-progress.ts'),S=await load('app/insight-scenes.ts'),V=await load('app/question-visuals.ts');
const bank=JSON.parse(readFileSync('app/content.json','utf8'));
assert.equal(bank.questions.length,41);assert.equal(new Set(bank.questions.map(q=>q.id)).size,41);
for(const b of bank.blocks){for(const id of [...b.questionIds,...b.probeIds,...b.retestIds])assert.ok(M.QUESTIONS[id]);assert.equal(b.probeIds.length,2);b.probeIds.forEach((id,i)=>assert.equal(M.correctAnswer(M.QUESTIONS[id],[b.misconception.probeWrongAnswers[i]]),false));}
for(const q of bank.questions){assert.equal(M.correctAnswer(q,q.answer),true,q.id);for(const plane of q.planes||[]){const ps=plane.map(p=>({...G.CUBE,...q.extraPoints})[p]);assert.ok(ps.every(Boolean),q.id);const normal=G.cross(G.sub(ps[1],ps[0]),G.sub(ps[2],ps[0]));for(const p of ps)assert.ok(Math.abs(G.dot(G.sub(p,ps[0]),normal))<1e-8,q.id+' nonplanar');}}
assert.equal(M.correctAnswer(M.QUESTIONS.v2,['H']),true);assert.equal(M.correctAnswer(M.QUESTIONS.v2,['A']),false);assert.equal(M.correctAnswer(M.QUESTIONS.v3,['G','A']),true);
const mk=(id,answer,helped=false,context='practice',sessionId='session-1')=>({id:crypto.randomUUID(),type:'answer',at:Date.now(),payload:{questionId:id,answer,helped,context,sessionId,correct:M.correctAnswer(M.QUESTIONS[id],answer)}});
let es=[mk('p1',['a']),mk('p1',M.QUESTIONS.p1.answer)];let p=M.deriveProgress(es);assert.equal(p.evidence.p1.independent,false);assert.equal(p.evidence.p1.correct,true);assert.equal(p.xp,10);es.push(mk('p1',M.QUESTIONS.p1.answer));assert.equal(M.deriveProgress(es).xp,10);
const probes=bank.blocks[0].probeIds.map(id=>mk(id,M.QUESTIONS[id].answer,false,'probe'));assert.equal(M.deriveProgress(probes).xp,0,'Probes must not leak correctness via XP');
const cps=bank.checkpointIds.map(id=>mk(id,M.QUESTIONS[id].answer,false,'check'));assert.equal(M.deriveProgress(cps.slice(0,-1)).xp,0,'No XP clue during checkpoint');assert.equal(M.deriveProgress(cps).successfulCheck,true);assert.equal(M.deriveProgress(cps).level1Passed,false,'Checkpoint alone is not a level pass');
const mixed=[...cps,{id:'block-projection',type:'block',at:1,payload:{blockId:'projection'}}];assert.equal(M.deriveProgress(mixed).level1Passed,false);
const all=[...cps,...bank.blocks.map(b=>({id:b.id,type:'block',at:1,payload:{blockId:b.id}})),{id:'paper-complete',type:'paper',at:1,payload:{checks:['figure','relations','intersection','reason']}}];assert.equal(M.deriveProgress(all).level1Passed,true);
assert.equal(G.lineIntersection({id:'a',name:'AE',a:G.CUBE.A,b:G.CUBE.E},{id:'b',name:'BC',a:G.CUBE.B,b:G.CUBE.C}),null,'A crossing in the image is not a 3D intersection');
for(const variant of [0,1]){const ps=W.initialPoints(variant),corners=W.sectionPoints(variant);const parallel={id:'parallel',name:'l',a:ps.R,b:G.add(ps.R,G.sub(ps.Q,ps.P)),infinite:true};const side={id:'side',name:'DH',a:ps.D,b:ps.H};const s=G.lineIntersection(parallel,side);assert.ok(s&&G.distance(s,corners[3])<1e-8);const alternative=G.lineIntersection({id:'alt',name:'l2',a:ps.P,b:G.add(ps.P,G.sub(ps.R,ps.Q)),infinite:true},side);assert.ok(alternative&&G.distance(alternative,corners[3])<1e-8);const edges=corners.map((a,i)=>({id:String(i),name:String(i),a,b:corners[(i+1)%4]}));assert.equal(W.verifyWorkbench(edges,{...ps,S:s},variant),true);assert.equal(W.verifyWorkbench(edges.slice(0,3),ps,variant),false);const triangle=[ps.P,ps.Q,ps.R].map((a,i,arr)=>({id:String(i),name:String(i),a,b:arr[(i+1)%3]}));assert.equal(W.verifyWorkbench(triangle,ps,variant),false,'A triangle through PQR is not the cube section');}
assert.equal(W.verifyWorkbench([null,{a:[NaN,0,0],b:[1,1,1]}],{},0),false);

// Route coverage must never act as a hidden correctness signal.
const route=events=>R.levelOneRoute(M.deriveProgress(events));
assert.equal(route([]).percent,0);
assert.equal(route([mk('p1',['a'])]).percent,route([mk('p1',M.QUESTIONS.p1.answer)]).percent,'Practice coverage does not reveal correctness');
assert.equal(route(es).completed,1,'Repeating a question cannot inflate route coverage');
assert.equal(route(probes).percent,0,'Diagnostic answers do not move the route');
assert.equal(route(cps.slice(0,-1)).percent,0,'Incomplete checkpoint reveals no result via the route');
const attempted=bank.blocks.flatMap(b=>b.questionIds).map(id=>mk(id,[]));
const blocks=bank.blocks.map(b=>({id:b.id,type:'block',at:1,payload:{blockId:b.id}}));
assert.ok(route([...attempted,...blocks]).percent<100,'Practice alone must never look like a completed level');
assert.equal(route([...attempted,...all]).percent,100);
// Check the mathematics that the new teaching figures actually display.
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const length2=p=>Math.hypot(...p);
const pi=(p,view)=>G.parallelImage(p,view);
for(const [view,pairs] of [['front',['AD','BC','EH','FG']],['top',['AE','BF','CG','DH']],['right',['AB','CD','EF','GH']]]){
 for(const pair of pairs)assert.deepEqual(pi(G.CUBE[pair[0]],view),pi(G.CUBE[pair[1]],view));
}
near(length2(pi(G.CUBE.B,'scaled')),4);near(length2(pi(G.CUBE.D,'scaled')),2);near(length2(pi(G.CUBE.E,'scaled')),4);
near(length2(pi([8,0,0],'equal-image')),4);near(length2(pi([0,4,0],'equal-image')),4);
near(G.dot(G.CUBE.F,G.CUBE.H)/G.distance(G.CUBE.A,G.CUBE.F)/G.distance(G.CUBE.A,G.CUBE.H),.5);
for(const scene of Object.values(S.THREE_CASES))for(const plane of scene.planes){
 const ps=plane.map(k=>G.CUBE[k]),normal=G.cross(G.sub(ps[1],ps[0]),G.sub(ps[2],ps[0]));
 for(const point of ps)near(G.dot(normal,G.sub(point,ps[0])),0);
}
const contains=(plane,p)=>{const ps=plane.map(k=>G.CUBE[k]);return Math.abs(G.dot(G.cross(G.sub(ps[1],ps[0]),G.sub(ps[2],ps[0])),G.sub(p,ps[0])))<1e-8};
for(const plane of S.THREE_CASES.line.planes){assert.ok(contains(plane,G.CUBE.A));assert.ok(contains(plane,G.CUBE.B));}
for(const plane of S.THREE_CASES.point.planes)assert.ok(contains(plane,G.CUBE.A));
assert.equal(S.THREE_CASES.none.planes.every(plane=>contains(plane,G.CUBE.B)),false);
for(const angle of [0,15,35,45,90]){
 const t=angle*Math.PI/180,u=[0,Math.cos(t),Math.sin(t)],n=G.cross([1,0,0],u);
 near(G.dot(n,[.5,0,0]),0);assert.equal(Math.abs(G.dot(n,G.CUBE.C))<1e-8,angle===0);
}
const wp=S.WORKED_SECTION,normal=G.cross(G.sub(wp.Q,wp.P),G.sub(wp.R,wp.P));near(G.dot(normal,G.sub(wp.S,wp.P)),0);
near(G.dot(G.cross(G.sub(wp.Q,wp.P),G.sub(wp.R,wp.S)),G.cross(G.sub(wp.Q,wp.P),G.sub(wp.R,wp.S))),0);
for(const q of bank.questions)for(const reveal of [false,true]){
 const v=V.questionGeometry(q,reveal),points={...G.CUBE,...v.points};
 for(const line of v.highlights)assert.ok(points[line[0]]&&points[line[1]],q.id+' missing line point');
 for(const plane of v.planes){const ps=plane.map(k=>points[k]);assert.ok(ps.every(Boolean));const n=G.cross(G.sub(ps[1],ps[0]),G.sub(ps[2],ps[0]));for(const p of ps)near(G.dot(n,G.sub(p,ps[0])),0);}
}
assert.equal(V.questionGeometry(M.QUESTIONS.p2).points.M,undefined);
assert.ok(V.questionGeometry(M.QUESTIONS.p2,true).points.M);
assert.equal(V.questionGeometry(M.QUESTIONS['cp-p1']).points.N,undefined);
assert.equal(V.questionGeometry(M.QUESTIONS.l4).highlights.includes('DC'),false);
assert.ok(V.questionGeometry(M.QUESTIONS.l4,true).highlights.includes('DC'));
assert.equal(V.questionGeometry(M.QUESTIONS['retest-l2']).planes.length,0);
for(const id of ['v3','cp-v1'])assert.equal(V.questionGeometry(M.QUESTIONS[id]).highlights.length,0);
assert.equal(V.questionGeometry(M.QUESTIONS.p5).view,'spatial');assert.equal(V.questionGeometry(M.QUESTIONS.p5,true).view,'front');
for(const chosen of M.QUESTIONS.v2.acceptAny){const visual=V.questionGeometry(M.QUESTIONS.v2,true,[chosen]);assert.ok(visual.planes[0].includes(chosen));assert.deepEqual(visual.selected,[chosen]);}
assert.ok(bank.blocks.every(b=>b.theory.every(t=>t.example)&&b.repair.example));
// Regression: external intersections must fit before the student creates them.
for(const variant of [0,1]){
 const ps=W.initialPoints(variant);
 const line=(a,b,infinite=true)=>({id:a+b,name:a+b,a:ps[a],b:ps[b],infinite});
 const lines=[line('P','Q'),line('A','B'),line('Q','R'),line('B','C')];
 const left=G.lineIntersection(lines[0],lines[1]),right=G.lineIntersection(lines[2],lines[3]);
 assert.ok(left&&right);
 const bounds=G.constructionBounds(Object.values(ps),lines);
 for(const target of [left,right])assert.ok(bounds.some(p=>G.distance(p,target)<1e-8));
 const unextended=G.constructionBounds(Object.values(ps),lines.map(l=>({...l,infinite:false})));
 for(const target of [left,right])assert.ok(!unextended.some(p=>G.distance(p,target)<1e-8),'Unextended segments must not disclose a future intersection');
 for(const width of [280,320,440,800])for(const camera of [[28,24],[-60,40],[70,15]]){
  const raw=p=>G.parallelImage(p,'spatial',...camera),height=width<390?310:390;
  const {center,scale}=G.projectionFrame(bounds.map(raw),width,height);
  const project=p=>raw(p).map((v,i)=>(i===0?width:height)/2+(v-center[i])*scale);
  for(const p of bounds){const [x,y]=project(p);assert.ok(x>=49.99&&x<=width-49.99&&y>=49.99&&y<=height-49.99,'Construction point has a visible margin');}
  for(const l of lines){const ends=G.clipProjectedLine(project(l.a),project(l.b),width,height);assert.ok(ends);for(const [x,y] of ends)assert.ok(x>=17.99&&x<=width-17.99&&y>=17.99&&y<=height-17.99);}
  // Each actual intersection lies on the rendered portion of both lines.
  for(const [target,pair] of [[left,lines.slice(0,2)],[right,lines.slice(2)]])for(const l of pair){
   const [a,b]=G.clipProjectedLine(project(l.a),project(l.b),width,height),p=project(target);
   const distance=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1]);
   assert.ok(Math.abs(distance(a,p)+distance(p,b)-distance(a,b))<1e-6);
  }
 }
}
assert.ok(G.lineIntersection({a:[0,0,1],b:[1,0,.99]},{a:[0,0,0],b:[1,0,0]})?.[0]>99,'A remote intersection is still an intersection');
assert.equal(G.clipProjectedLine([20,20],[20,20],320,310),null);
console.log('Construction framing checks passed: both variants, external intersections, 4 widths and 3 cameras; no premature points.');
console.log('Learning checks passed: 41 questions, 16 theory examples, 4 visual repair routes, projection/plane geometry and unrevealed answers, scoring, route progress, checkpoint gates and both valid construction routes in both variants.');
