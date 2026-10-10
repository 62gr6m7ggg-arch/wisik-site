import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
fs.mkdirSync('.arena-unit',{recursive:true});
await build({stdin:{contents:"export * from './app/arena/core';export {projectModel} from './app/arena/figure';export {BANK} from './app/model';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'.arena-unit/native.mjs'});
const M=await import(pathToFileURL(path.resolve('.arena-unit/native.mjs')).href);
let assertions=0;const ok=(x,m)=>{assert.ok(x,m);assertions++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);assertions++;},near=(a,b,m)=>{assert.ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(b)),`${m}: ${a} != ${b}`);assertions++;};
const sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>Math.sqrt(dot(a,a)),dist=(a,b)=>norm(sub(a,b)),area=(a,b,c)=>norm(cross(sub(b,a),sub(c,a)))/2;
const angle=(a,b)=>Math.acos(Math.min(1,Math.max(-1,dot(a,b)/(norm(a)*norm(b)))))*180/Math.PI;
const planeDist=(p,a,b,c)=>Math.abs(dot(sub(p,a),cross(sub(b,a),sub(c,a))))/norm(cross(sub(b,a),sub(c,a)));
const parallel=(a,b)=>norm(cross(a,b))<1e-7;
const lineDist=(a,b,c,d)=>{const n=cross(sub(b,a),sub(d,c));return Math.abs(dot(sub(c,a),n))/norm(n);};
function section(model,aa,bb,cc){const n=cross(sub(bb,aa),sub(cc,aa)),edges=new Set(),points=[];for(const f of model.faces)for(let i=0;i<f.length;i++)edges.add([f[i],f[(i+1)%f.length]].sort().join(''));
 for(const e of edges){const a=model.points[e[0]],b=model.points[e[1]],fa=dot(sub(a,aa),n),fb=dot(sub(b,aa),n);if(Math.abs(fa)<1e-9)points.push(a);if(fa*fb<0){const t=fa/(fa-fb);points.push(a.map((x,i)=>x+t*(b[i]-x)));}if(Math.abs(fb)<1e-9)points.push(b);}
 return points.filter((p,i)=>!points.slice(0,i).some(q=>dist(p,q)<1e-7));}
eq(M.EXAMS.map(e=>e.questions.length),[18,33],'both complete digital routes');eq(M.TRAINING.length,24);
const all=[...M.EXAMS.flatMap(e=>e.questions),...M.TRAINING];eq(new Set(all.map(q=>q.id)).size,75);
for(const q of all){ok(M.BANK.blocks.some(b=>b.id===q.blockId),'exact lesson link '+q.id);ok(q.prompt.length>20&&q.title.length>3,'meaningful question '+q.id);}
for(const e of M.EXAMS){ok(e.warning.length>100&&e.source.length>60);for(const q of e.questions){ok(!!e.groups[q.group]);eq(q.criteria.length,3);ok(q.answer.length>70);}
 for(const [key,g] of Object.entries(e.groups)){
  const points=g.model.points;ok(Object.values(points).every(p=>p.length===3&&p.every(Number.isFinite)),e.id+'/'+key+' finite model');
  for(const f of g.model.faces){ok(f.length>=3&&[...f].every(k=>!!points[k]),f+' known vertices');const [a,b,c]=[...f].slice(0,3).map(k=>points[k]);ok(area(a,b,c)>1e-8,f+' nondegenerate');for(const k of f)near(planeDist(points[k],a,b,c),0,f+' coplanar');}
  for(const yaw of [-2,-.55,0,1.4])for(const pitch of [-1,.5,1.45]){const p=M.projectModel(g.model,yaw,pitch);eq(Object.keys(p.screen).length,Object.keys(points).length);for(const [k,v] of Object.entries(p.screen)){ok(v.every(Number.isFinite)&&v[0]>=40&&v[0]<=380&&v[1]>=30&&v[1]<=330,'visible point '+k);const l=p.labels[k];ok(l.x>=4&&l.x<=416&&l.y>=23&&l.y<=348,'label on canvas '+k);}}
 }
}
const p18=g=>M.EXAMS[0].groups[g].model.points,pr=g=>M.EXAMS[1].groups[g].model.points;
{
 const p=p18('1');near(lineDist(p.A,p.K,p.F,p.I),0.7155417527999327,'independent skew AK/FI');ok(!parallel(sub(p.K,p.B),sub(p.L,p.H)));ok(lineDist(p.B,p.K,p.H,p.L)>0,'BK/HL skew');
 const x=[-6,0,0];near(planeDist(x,p.A,p.E,p.H),0,'three-plane intersection in AEH');near(planeDist(x,p.G,p.C,p.D),0,'three-plane intersection in GCD');near(x[2],0);
}
{
 const p=p18('2'),m=M.EXAMS[0].groups['2'].model;near(dot(sub(p.H,p.A),cross(sub(p.F,p.E),sub(p.S,p.E)))/(norm(sub(p.H,p.A))*norm(cross(sub(p.F,p.E),sub(p.S,p.E)))),1,'AH normal EFCD');eq(section(m,p.Q,p.P,p.C).length,5,'2018 section 2a');
}
{
 const p=p18('3'),m=M.EXAMS[0].groups['3'].model;near(angle(sub(p.E,p.H),sub(p.G,p.H)),Math.acos(12/(10*Math.sqrt(20)))*180/Math.PI,'EHG');near(p.F[2],1);near(planeDist(p.F,p.E,p.G,p.H),0,'flat top');near(lineDist(p.A,p.C,p.H,p.B),6*Math.sqrt(2/17),'AC/HB distance');const vertices=section(m,p.P,p.Q,p.R);eq(vertices.length,5);ok(vertices.some(v=>dist(v,p.R)<1e-7),'R is a section vertex');ok(!M.EXAMS[0].questions.find(q=>q.id==='3a').answer.includes('hoeft geen hoekpunt'),'incorrect R note removed');
}
{
 const p=p18('4');near(area(p.E,p.G,p.D),16*Math.sqrt(22),'EGD area');near(planeDist(p.H,p.E,p.G,p.D),24/Math.sqrt(22),'H to EGD');near(dist(p.E,p.P),Math.sqrt(208)/5,'EP');near(angle(sub(p.H,p.B),sub(p.D,p.E)),Math.acos(80/Math.sqrt(212*208))*180/Math.PI,'BH/ED');near(Math.asin(12/dist(p.C,p.Q))*180/Math.PI,Math.atan(12/Math.sqrt(164))*180/Math.PI,'43-degree correction');
}
near(Math.sqrt(40**2-5**2)*10,396.8626966596886,'millimetres');
const volume=x=>75*x*Math.sqrt(2025-45*x);for(const x of [10.09238055,43.08458134])ok(Math.abs(volume(x)-30000)<.001,'volume boundary');ok(volume(20)>30000&&volume(5)<30000&&volume(44)<30000);
{
 const p=pr('1'),m=M.EXAMS[1].groups['1'].model;near(area(p.P,p.Q,p.R),24*Math.sqrt(3),'PQR area');eq(section(m,p.P,p.Q,p.R).length,6,'six-edge section');for(const [a,b,c] of ['BFQ','BAR','GHR','BFP','DHP'])eq([dist(p[a],p[b])**2,dist(p[b],p[c])**2,dist(p[c],p[a])**2].map(Math.round).sort((a,b)=>a-b),[64,68,100],'congruent triangles');
}
{
 const p=pr('2');near(dist(p.A,p.D),6);near(dist(p.C,p.D),6);near(dot(sub(p.M,p.A),sub(p.C,p.B)),0);near(dot(sub(p.M,p.D),sub(p.C,p.B)),0);near(dist([p.P[0],p.P[1],0],[p.Q[0],p.Q[1],0]),3,'projected PQ');
}
{
 const p=pr('3');near(area(p.E,p.B,p.G),3*Math.sqrt(29),'corrected EBG area');near(planeDist(p.F,p.E,p.B,p.G),12/Math.sqrt(29),'corrected F/EBG distance');near(Math.abs(dot(sub(p.E,p.F),cross(sub(p.B,p.F),sub(p.G,p.F))))/6,12,'tetra volume');eq(Math.round(angle(sub(p.A,p.P),sub(p.E,p.P))),33);eq(Math.round(angle(sub(p.P,p.B),sub(p.G,p.E))),68);eq(Math.round(Math.atan(4/Math.sqrt(45))*180/Math.PI),31);
}
{
 const p=pr('4');near(planeDist(p.A,p.B,p.D,p.P),4/Math.sqrt(6));near(dot(sub(p.C,p.D),sub(p.P,p.B)),0);
}
{
 const p=pr('5');near(planeDist(p.H,p.C,p.M,p.N),Math.sqrt(3));near(planeDist(p.C,p.F,p.D,p.L),2);near(planeDist(p.B,p.A,p.F,p.H),2*Math.sqrt(3/7));ok(parallel(sub(p.F,p.A),sub(p.E,p.B)));ok(parallel(sub(p.H,p.A),sub(p.L,p.E)));
}
{
 const p=pr('6');near(dist(p.B,p.F),5);near(dist(p.D,p.E),5);near(dist(p.E,p.B),Math.sqrt(37));near(p.F[2],Math.sqrt(12));eq(Math.round(Math.atan(p.F[2]/2)*180/Math.PI),60);eq(Math.round(180-2*Math.atan(p.F[2]/3)*180/Math.PI),82);const a=angle(sub(p.F,p.B),sub(p.E,p.D));near(a,87.70755722404412,'smallest line angle');
}
const expectedChoices={'L1-1':2,'L1-2':1,'L1-3':1,'L1-4':1,'L2-2':1,'L2-3':1,'L3-4':2,'L4-1':0,'L4-3':0,'L4-4':1,'L5-3':0,'L5-4':0,'L6-1':0,'L6-2':1,'L6-3':0};
const expectedNumbers={'L2-1':10/2,'L2-4':8*9/12,'L3-1':18*7/3,'L3-2':(6*3+6*2/2)*10,'L3-3':3*40/24,'L4-2':Math.atan(3/4)*180/Math.PI,'L5-1':6*8/10,'L5-2':30*4/3,'L6-4':3};
for(const q of M.TRAINING){const p=M.freshPractice();eq(M.checkTraining(q,p),'invalid');eq(M.assessTraining(q,p).tries,0);if(q.options){eq(q.answer,expectedChoices[q.id]);p.selected=q.answer;}else{near(q.answer,expectedNumbers[q.id],q.id+' numeric key');p.input=String(q.answer).replace('.',',');}const right=M.assessTraining(q,p);ok(right.correct&&right.independent);ok(!M.assessTraining(q,{...p,stage:1}).independent);ok(!M.assessTraining(q,{...p,tries:1}).independent);ok(q.hint.length>10&&q.step.length>10&&q.explanation.length>40&&q.strategy.length>20);}
eq(M.numeric('36,9'),36.9);eq(M.numeric('1+1'),null);eq(M.numeric('4 cm'),null);eq(M.numeric('Infinity'),null);
let s=M.startAttempt(M.empty(),'2018',150,true,10000);eq(M.remaining(s.session,11000),8999);assert.throws(()=>M.startAttempt(s,'reconstructie',150,true));assertions++;s.session.ratings['1a']=0;eq(Object.keys(M.validate(s).session.ratings).length,0,'no pre-end self-grades');s.session.finished=12000;s.session.ratings={'1a':1};eq(M.needs(s.session).length,1);eq(M.needs({...s.session,ratings:{}}),[],'unrated not wrong');eq(M.parse(JSON.stringify(s)).session.answers,{});
for(const bad of ['{','{"version":1,"format":"wisik-space-tent-progress"}','{"format":"wisik-native-arena","version":8}']){assert.throws(()=>M.parse(bad));assertions++;}
for(let i=0;i<8;i++){if(s.session)s.session.finished=s.session.start+1000;s=M.startAttempt(s,i%2?'2018':'reconstructie',150,true,20000+i*3000);}eq(s.history.length,5);
const sourceText=fs.readFileSync('app/arena/arena.tsx','utf8');ok(!sourceText.includes('dangerouslySetInnerHTML'));ok(!sourceText.includes('<iframe'));ok(!sourceText.includes('wisik.space-tent.progress.v1'));ok(sourceText.includes('setPrintMode'));ok(sourceText.includes('current!==expected.current'),'cross-tab CAS');
const report={status:'passed',version:'0.7.0',assertions,exams:2,examQuestions:51,trainingQuestions:24,errors:[],limitations:['Symbolische controles vervangen geen menselijke beoordeling van elke geldige constructieroute.','De oorspronkelijke PDF-bestanden zijn niet als facsimile in deze native bron opgenomen.']};fs.writeFileSync('.arena-unit/results.json',JSON.stringify(report,null,2));console.log('Native arena unit/math checks passed: '+assertions+' assertions; 51 exam questions and 24 training questions.');
