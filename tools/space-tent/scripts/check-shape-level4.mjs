// Read-only coordinate reference checks. Uses the merged bank when present,
// otherwise the level-4 merge fragment. No browser or learning-effect claim.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../app/',import.meta.url);
const bank=JSON.parse(readFileSync(new URL('course-content.json',root),'utf8'));
const fragment=JSON.parse(readFileSync(new URL('shape-variation-level4.json',root),'utf8'));
const expected=fragment.questions.map(q=>q.id);
const merged=bank.questions.filter(q=>expected.includes(q.id));
assert(merged.length===0||merged.length===expected.length,'Only part of the level-4 fragment was merged');
const qs=merged.length?merged:fragment.questions;
const minus=(p,q)=>p.map((a,i)=>a-q[i]);
const scalar=(p,q)=>p.reduce((a,b,i)=>a+b*q[i],0);
const size=p=>Math.hypot(...p);
const wedge=(p,q)=>[p[1]*q[2]-p[2]*q[1],p[2]*q[0]-p[0]*q[2],p[0]*q[1]-p[1]*q[0]];
const direction=(p,line)=>minus(p[line[1]],p[line[0]]);
const perpendicular=(p,f)=>wedge(minus(p[f[1]],p[f[0]]),minus(p[f[2]],p[f[0]]));
const near=(a,b,label)=>assert(Math.abs(a-b)<1e-8,`${label}: ${a} != ${b}`);
const right=(a,b,label)=>near(scalar(a,b)/(size(a)*size(b)),0,label);
const parallel=(a,b,label)=>near(size(wedge(a,b))/(size(a)*size(b)),0,label);
const angle=(a,b)=>Math.atan2(size(wedge(a,b)),Math.abs(scalar(a,b)))*180/Math.PI;
const pointLineDistance=(p,a,b)=>size(wedge(minus(p,a),minus(b,a)))/size(minus(b,a));
const reports=[];
for(const q of qs){
 const label=q.id,p=q.scene.points,g=q.geometryCheck;
 assert(q.scene.showCube===false,label+' implicit cube');
 assert(q.shapeFamily&&q.curriculumSource.includes('geen kopie'),label+' source metadata');
 assert(g,label+' missing independent reference');
 for(const scene of [q.scene,q.revealScene].filter(Boolean)){
  assert(scene.showCube===false,label+' reveal implicit cube');
  assert(Object.values(scene.points).every(a=>a.length===3&&a.every(Number.isFinite)),label+' invalid coordinates');
  assert(Object.keys(scene.points).every(n=>n.length===1),label+' unsupported point label');
  for(const edge of [...scene.edges,...(scene.highlights||[])])assert(edge.length===2&&scene.points[edge[0]]&&scene.points[edge[1]],label+' invalid edge '+edge);
  for(const f of [...scene.planes||[],...scene.studyPlanes||[]]){
   assert(f.length>=3&&f.every(n=>scene.points[n]),label+' invalid plane');
   const n=perpendicular(scene.points,f);assert(size(n)>1e-8,label+' degenerate plane');
   for(const k of f)near(scalar(minus(scene.points[k],scene.points[f[0]]),n),0,label+' nonplanar figure');
  }
 }
 for(const [edge,wanted] of Object.entries(g.givenLengths||{}))near(size(direction(p,edge)),wanted,label+' stated length '+edge);
 if(g.givenPointLineDistance){const d=g.givenPointLineDistance;near(pointLineDistance(p[d.point],p[d.line[0]],p[d.line[1]]),d.distance,label+' stated point-line distance');}
 if(g.solutionFoot){
  const foot=g.solutionFoot;
  assert(!p[foot.name],label+' solution foot leaked into initial scene');
  assert(q.revealScene?.points[foot.name],label+' missing revealed foot');
  for(let i=0;i<3;i++)near(q.revealScene.points[foot.name][i],foot.coordinate[i],label+' foot coordinate');
 }
 let result;
 if(g.kind==='line-angle'||g.kind==='line-angle-statement')result=angle(direction(p,g.lines[0]),direction(p,g.lines[1]));
 if(g.kind==='line-plane-angle')result=90-angle(direction(p,g.line),perpendicular(p,g.plane));
 if(g.kind==='plane-angle')result=angle(perpendicular(p,g.planes[0]),perpendicular(p,g.planes[1]));
 if(q.type==='numeric'){
  assert(Number.isFinite(result),label+' unsupported numeric reference');
  near(result,Number(q.answer[0]),label+' numerical answer');
  assert(q.decimals===2&&q.working&&q.unit==='°',label+' numeric answer contract');
  reports.push({id:label,degrees:result,rounded:result.toFixed(2)});
 }
 if(g.kind==='line-angle-statement')near(result,g.expectedDegrees,label+' stated line angle');
 if(g.kind==='parallel-line'){
  parallel(direction(p,g.sourceLine),direction(p,g.answerLine),label+' parallel answer');
  assert(g.answerLine.includes(g.through),label+' wrong through point');
  assert([...g.answerLine].sort().join('')===[...q.answer].sort().join(''),label+' parallel answer labels');
 }
 if(g.kind==='line-projection'){
  const normal=perpendicular(p,g.plane),origin=p[g.plane[0]];
  const projected=[...g.line].map(name=>{const t=scalar(minus(p[name],origin),normal)/scalar(normal,normal);return p[name].map((v,i)=>v-t*normal[i]);});
  for(let i=0;i<2;i++)for(let j=0;j<3;j++)near(projected[i][j],p[g.projectedLine[i]][j],label+' orthogonal projection');
  assert([...g.projectedLine].sort().join('')===[...q.answer].sort().join(''),label+' projection answer labels');
 }
 if(g.kind==='stand-triangle'){
  assert([...g.triangle].sort().join('')===[...q.answer].sort().join(''),label+' stand triangle labels');
  for(let i=0;i<2;i++){
   const ray=direction(p,g.rays[i]);
   right(ray,direction(p,g.intersectionLine),label+' stand ray perpendicular to intersection');
   // The first ray is in the base (second given plane), second in the side.
   const plane=g.planes[1-i],n=perpendicular(p,plane);
   right(ray,n,label+' stand ray in its face');
  }
 }
}
const checkIds=fragment.checkAdditions['4'];
for(const id of checkIds){const q=qs.find(q=>q.id===id);assert(q&&!q.scene.studyPlanes?.length,id+' check must not expose a chosen solution plane');}
const prismCheck=qs.find(q=>q.id==='vorm-l4-check-prisma-lijnen');
const prismTheory=fragment.blockAdditions.find(b=>b.id==='l4-lines').theory[0];
const checkAngle=angle(direction(prismCheck.scene.points,'BC'),direction(prismCheck.scene.points,'DF'));
const theoryAngle=angle(direction(prismTheory.scene.points,'BC'),direction(prismTheory.scene.points,'DF'));
assert(Math.abs(checkAngle-theoryAngle)>1,'Prism check must use a genuinely different triangle from the worked example');
console.log(JSON.stringify({ok:true,source:merged.length?'course-content.json':'shape-variation-level4.json',questions:qs.length,numeric:reports.length,checks:checkIds.length,results:reports},null,2));
