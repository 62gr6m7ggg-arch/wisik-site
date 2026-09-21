import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Independent analytic-geometry checks of the synthetic teaching examples.
// This validator does not feed any formula or answer back into question data.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data=JSON.parse(fs.readFileSync(path.join(root,'app/shape-variation-level6.json'),'utf8'));
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const length=a=>Math.hypot(...a);
const close=(actual,expected,label,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<tolerance,`${label}: ${actual} != ${expected}`);
const vector=(points,names)=>sub(points[names[1]],points[names[0]]);
const normal=(points,names)=>cross(sub(points[names[1]],points[names[0]]),sub(points[names[2]],points[names[0]]));
const planeDistance=(p,points,names)=>Math.abs(dot(sub(p,points[names[0]]),normal(points,names)))/length(normal(points,names));
const resolve=(points,p)=>typeof p==='string'?points[p]:p;
const onLine=(p,points,names)=>length(cross(sub(p,points[names[0]]),vector(points,names)))/length(vector(points,names));
const angleFactor=180/Math.PI;

function validateScene(scene,label){
 assert.equal(scene.showCube,false,`${label}: no cube fallback`);
 const entries=Object.entries(scene.points);
 for(const [name,p] of entries){assert.equal(p.length,3);assert.ok(p.every(Number.isFinite),`${label}: finite ${name}`)}
 for(const edge of [...scene.edges||[],...scene.highlights||[]]){
  assert.equal(edge.length,2,`${label}: two endpoint labels for ${edge}`);
  assert.ok(scene.points[edge[0]]&&scene.points[edge[1]],`${label}: endpoints ${edge}`);
 }
 for(const plane of [...scene.planes||[],...scene.studyPlanes||[]]){
  assert.ok(plane.every(p=>scene.points[p]),`${label}: plane point exists`);
  assert.ok(length(normal(scene.points,plane))>1e-8,`${label}: nondegenerate plane`);
  for(const name of plane)close(planeDistance(scene.points[name],scene.points,plane),0,`${label}: coplanar ${name}`);
 }
 let volume=0;
 const p0=entries[0][1];
 for(const [,a] of entries)for(const [,b] of entries)for(const [,c] of entries){
  volume=Math.max(volume,Math.abs(dot(sub(a,p0),cross(sub(b,p0),sub(c,p0)))));
 }
 assert.ok(volume>1e-6,`${label}: full 3D scene, not a disguised flat schematic`);
}

const ids=new Set();
const results=[];
for(const q of data.questions){
 assert.ok(!ids.has(q.id),`${q.id}: unique ID`);ids.add(q.id);
 validateScene(q.scene,q.id);
 if(q.revealScene)validateScene(q.revealScene,`${q.id} reveal`);
 assert.ok(q.shapeFamily&&q.curriculumSource,`${q.id}: explicit classification and curriculum scope`);
 assert.ok(q.explanation&&q.hint,`${q.id}: feedback and hint`);
 const p=q.scene.points,g=q.geometryCheck;
 let actual;
 if(g.kind==='lineLineDistance'){
  const u=vector(p,g.lines[0]),v=vector(p,g.lines[1]),n=cross(u,v);
  assert.ok(length(n)>1e-8,`${q.id}: directions are not parallel`);
  actual=Math.abs(dot(sub(p[g.lines[1][0]],p[g.lines[0][0]]),n))/length(n);
  if(g.mustBeSkew)assert.ok(actual>1e-8,`${q.id}: lines are skew, not intersecting`);
  if(g.feet){
   const feet=g.feet.map(f=>resolve(p,f));
   close(onLine(feet[0],p,g.lines[0]),0,`${q.id}: first foot on full line`);
   close(onLine(feet[1],p,g.lines[1]),0,`${q.id}: second foot on full line`);
   const connection=sub(feet[1],feet[0]);
   close(dot(connection,u),0,`${q.id}: first perpendicular`);
   close(dot(connection,v),0,`${q.id}: second perpendicular`);
   close(length(connection),actual,`${q.id}: foot length equals line distance`);
  }
 }else if(g.kind==='pointPlaneDistance'){
  actual=planeDistance(p[g.point],p,g.plane);
 }else if(g.kind==='linePlaneAngle'){
  const u=vector(p,g.line),n=normal(p,g.plane);
  actual=Math.asin(Math.min(1,Math.abs(dot(u,n))/(length(u)*length(n))))*angleFactor;
 }else if(g.kind==='planePlaneAngle'){
  const n=normal(p,g.planes[0]),m=normal(p,g.planes[1]);
  actual=Math.acos(Math.min(1,Math.abs(dot(n,m))/(length(n)*length(m))))*angleFactor;
 }else if(g.kind==='parallelHelperPlane'){
  for(const name of g.lineInPlane)close(planeDistance(p[name],p,g.plane),0,`${q.id}: helper contains first line`);
  close(dot(vector(p,g.parallelLine),normal(p,g.plane)),0,`${q.id}: helper follows other direction`);
  assert.ok(planeDistance(p[g.parallelLine[0]],p,g.plane)>1e-8,`${q.id}: second line outside plane`);
  close(onLine(p[g.point],p,g.parallelLine),0,`${q.id}: selected point lies on other line`);
  const u=vector(p,g.lineInPlane),v=vector(p,g.parallelLine),n=cross(u,v);
  actual=Math.abs(dot(sub(p[g.parallelLine[0]],p[g.lineInPlane[0]]),n))/length(n);
  close(actual,planeDistance(p[g.point],p,g.plane),`${q.id}: point-plane reduction matches line distance`);
 }else throw new Error(`${q.id}: unvalidated geometry kind ${g.kind}`);
 close(actual,g.expected,`${q.id}: metadata matches independently computed geometry`);
 if(q.type==='numeric'){
  assert.equal(q.answer.length,1);assert.equal(q.decimals,2);
  close(actual,Number(q.answer[0]),`${q.id}: numeric answer matches coordinates`);
  assert.equal(q.working,true,`${q.id}: working requested`);
 }else if(q.type==='points'){
  assert.equal(q.answer.length,q.selectCount);
  assert.ok(q.answer.every(a=>p[a]),`${q.id}: selectable answer points exist`);
 }else{
  assert.ok(q.options.some(o=>o.id===q.answer[0]),`${q.id}: answer is an option`);
 }
 results.push({id:q.id,shape:q.shapeFamily,value:Number(actual.toFixed(8))});
}
for(const block of data.blockAdditions){
 assert.equal(block.questionIds.length,3);assert.equal(block.retestIds.length,1);
 for(const id of [...block.questionIds,...block.retestIds])assert.ok(ids.has(id),`mapped exercise exists: ${id}`);
 for(const t of block.theory)validateScene(t.scene,`${block.id} theory`);
}
for(const [key,list] of Object.entries(data.checkAdditions)){
 assert.equal(list.length,key==='6'?3:2);
 for(const id of list)assert.ok(ids.has(id),`mapped check exists: ${id}`);
}
assert.equal(data.questions.length,19);
const named=data.blockAdditions.flatMap(b=>[...b.questionIds,...b.retestIds]).concat(Object.values(data.checkAdditions).flat());
assert.equal(new Set(named).size,19,'every new question routed once');
assert.equal(named.length,19,'no duplicate routing');

// The frustum exercise intentionally uses a foot outside the physical edge.
const outside=data.questions.find(q=>q.id==='vorm-l6-common-q3').scene.points;
const fg=vector(outside,['F','G']);
const parameter=dot(sub(outside.Q,outside.F),fg)/dot(fg,fg);
assert.ok(parameter<0,'Q must lie on GF extended beyond F, outside edge FG');
// The oblique-pyramid theory uses a valid extended helper plane and a
// perpendicular plane-distance foot, not the wrong foot on the original line.
const theory=data.blockAdditions.find(b=>b.id==='l6-parallel-plane').theory[0].scene.points;
close(onLine(theory.N,theory,['B','U']),0,'theory N on BU');
const an=vector(theory,['A','N']);
close(dot(an,vector(theory,['B','U'])),0,'theory AN perpendicular BU');
close(dot(an,vector(theory,['B','C'])),0,'theory AN perpendicular BC');
close(length(an),7.2,'theory distance');
assert.ok(onLine(theory.N,theory,['B','T'])>0.1,'theory plane foot is not falsely called a BT foot');
console.log(JSON.stringify({passed:true,questions:results.length,results,checks:data.checkAdditions,theoryExamples:3,limitations:'Coordinate and content-structure checks only; no browser, physical-device, independent teacher review or measured learning-effect claim.'},null,2));
