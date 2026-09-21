import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// Independent coordinate calculations: teaching explanations deliberately use
// synthetic geometry, while this check uses vector products only for verification.
const fragmentPath = fileURLToPath(new URL('../app/shape-variation-level5.json', import.meta.url));
const fragment = JSON.parse(readFileSync(fragmentPath, 'utf8'));
const sub = (a,b) => a.map((v,i)=>v-b[i]);
const dot = (a,b) => a.reduce((s,v,i)=>s+v*b[i],0);
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm = a => Math.sqrt(dot(a,a));
const close = (a,b,message) => assert.ok(Math.abs(a-b) < 1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${message}: ${a} != ${b}`);
const lineDistance = (p,a,b) => norm(cross(sub(p,a),sub(b,a)))/norm(sub(b,a));
const planeDistance = (p,a,b,c) => Math.abs(dot(sub(p,a),cross(sub(b,a),sub(c,a))))/norm(cross(sub(b,a),sub(c,a)));
const poly = (coefficients,x) => coefficients.reduce((sum,c,i)=>sum+c*x**i,0);
const polygonArea = (scene,names) => {
 const origin=scene.points[names[0]];
 return names.slice(1,-1).reduce((sum,name,i)=>sum+norm(cross(sub(scene.points[name],origin),sub(scene.points[names[i+2]],origin)))/2,0);
};
const allIds=new Set();
function checkScene(scene,label) {
 assert.equal(scene.showCube,false,label+' uses an explicit non-cube model');
 const names=Object.keys(scene.points),points=Object.values(scene.points);
 assert.ok(points.length>=4,label+' needs a solid');
 let determinant=0;
 for(let i=1;i<points.length;i++)for(let j=i+1;j<points.length;j++)for(let k=j+1;k<points.length;k++)
  determinant=Math.max(determinant,Math.abs(dot(sub(points[i],points[0]),cross(sub(points[j],points[0]),sub(points[k],points[0])))));
 assert.ok(determinant>1e-8,label+' is genuinely three-dimensional');
 for(const [name,p] of Object.entries(scene.points))assert.ok(p.length===3&&p.every(Number.isFinite),label+' coordinates '+name);
 for(const edge of [...scene.edges,...(scene.highlights||[])]){
  assert.ok(edge.length===2&&edge.split('').every(n=>names.includes(n)),label+' valid edge '+edge);
  assert.ok(norm(sub(scene.points[edge[0]],scene.points[edge[1]]))>1e-8,label+' nonzero edge '+edge);
 }
 for(const plane of [...(scene.planes||[]),...(scene.studyPlanes||[])]){
  assert.ok(plane.every(n=>names.includes(n)),label+' valid plane '+plane.join(''));
  const [a,b,c]=plane.map(n=>scene.points[n]);
  assert.ok(norm(cross(sub(b,a),sub(c,a)))>1e-8,label+' plane is nondegenerate');
  for(const name of plane)close(planeDistance(scene.points[name],a,b,c),0,label+' planar '+name);
 }
}
const result=[];
for(const q of fragment.questions){
 assert.ok(q.id.startsWith('vorm-l5-')&&!allIds.has(q.id),'unique ID '+q.id);allIds.add(q.id);
 assert.ok(q.shapeFamily&&q.curriculumSource&&q.geometryCheck,q.id+' provenance');
 checkScene(q.scene,q.id);
 const g=q.geometryCheck,p=q.scene.points;
 let expected;
 if(g.type==='point-line-distance') expected=lineDistance(p[g.point],...g.line.map(n=>p[n]));
 else if(g.type==='point-plane-distance') expected=planeDistance(p[g.point],...g.plane.map(n=>p[n]));
 else if(g.type==='horizontal-section-area'){
  close(norm(sub(p.B,p.A)),g.baseWidth,q.id+' width');
  close(norm(sub(p.D,p.A)),g.baseDepth,q.id+' depth');
  close(p.T[2]-p.A[2],g.height,q.id+' height');
  expected=g.baseWidth*g.baseDepth*(1-g.sectionHeight/g.height)**2;
  close(polygonArea(q.scene,['P','Q','R','S']),expected,q.id+' drawn section area');
 }else if(g.type==='water-prism-formula'||g.type==='inscribed-pyramid-box-formula'){
  const isPrism=g.type==='water-prism-formula';
  const width=norm(sub(p.B,p.A)),height=(isPrism?p.C:p.T)[2]-p.A[2],length=isPrism?norm(sub(p.D,p.A)):undefined;
  close(width,isPrism?g.width:g.baseWidth,q.id+' width');close(height,g.height,q.id+' height');
  if(isPrism)close(length,g.length,q.id+' length');
  const physical=h=>isPrism?length*width*(1-h/height):h*(width*(1-h/height))**2;
  const matching=Object.entries(g.optionCoefficients).filter(([,coeffs])=>[0,.17,.39,.63,.89,1].every(t=>Math.abs(poly(coeffs,t*height)-physical(t*height))<1e-8)).map(([id])=>id);
  assert.deepEqual(matching,q.answer,q.id+' unique correct formula');
  for(const fraction of [0,.1,.5,.9,1])close(poly(g.coefficients,fraction*height),physical(fraction*height),q.id+' polynomial');
  if(isPrism)close(polygonArea(q.scene,['P','Q','R','S']),physical(p.P[2]),q.id+' drawn water surface');
  expected=q.answer[0];
 }else if(g.type==='inscribed-box-maximum'){
  const height=p.C[2]-p.A[2],width=norm(sub(p.B,p.A)),length=norm(sub(p.D,p.A));
  close(height,g.height,q.id+' height');close(width,g.baseWidth,q.id+' width');close(length,g.length,q.id+' length');
  expected=height/2;
  const vol=h=>length*width*h*(1-h/height);
  for(let i=0;i<=1000;i++)assert.ok(vol(i*height/1000)<=vol(expected)+1e-8,q.id+' global maximum');
 }else if(g.type==='inscribed-box-comparison'){
  const height=p.T[2]-p.A[2],width=norm(sub(p.B,p.A));
  close(height,g.height,q.id+' height');close(width,g.baseWidth,q.id+' width');
  const ranked=g.candidateHeights.map(h=>({h,v:h*(width*(1-h/height))**2})).sort((a,b)=>b.v-a.v);
  assert.ok(ranked[0].v>ranked[1].v,q.id+' unique winner');expected=ranked[0].h;
 }else if(g.type==='inscribed-box-volume'){
  const height=p.T[2]-p.A[2],width=norm(sub(p.B,p.A)),h=p.I[2]-p.E[2];
  close(height,g.height,q.id+' height');close(width,g.baseWidth,q.id+' width');close(h,g.boxHeight,q.id+' box height');
  expected=h*(width*(1-h/height))**2;
  close(polygonArea(q.scene,['I','J','K','L'])*h,expected,q.id+' drawn box volume');
 }else assert.fail(q.id+' unsupported check '+g.type);
 if(q.type==='numeric'){assert.equal(q.decimals,2,q.id+' rounding');assert.equal(q.working,true,q.id+' reasoning field');close(Number(q.answer[0]),expected,q.id+' unrounded answer');}
 else assert.ok(q.options.some(option=>option.id===q.answer[0]),q.id+' existing choice');
 if(q.shapeFamily==='box-in-square-pyramid'){
  const height=p.T[2]-p.A[2],h=p.I[2]-p.A[2],scale=1-h/height;
  for(const [base,top] of [['A','I'],['B','J'],['C','K'],['D','L']])for(let axis=0;axis<3;axis++)
   close(p[top][axis],p.T[axis]+scale*(p[base][axis]-p.T[axis]),q.id+' top corner on pyramid edge');
 }
 result.push({id:q.id,answer:expected});
}
const assigned=fragment.blockAdditions.flatMap(b=>[...b.questionIds,...b.retestIds]).concat(fragment.checkAdditions['5']);
assert.equal(assigned.length,20);assert.equal(new Set(assigned).size,20);assert.ok(assigned.every(id=>allIds.has(id)));
assert.equal(fragment.blockAdditions.reduce((n,b)=>n+b.questionIds.length,0),13);
assert.equal(fragment.blockAdditions.reduce((n,b)=>n+b.retestIds.length,0),4);
assert.equal(fragment.checkAdditions['5'].length,3);
for(const block of fragment.blockAdditions){assert.equal(block.theory.length,1);checkScene(block.theory[0].scene,block.id+' theory');}
const theories=Object.fromEntries(fragment.blockAdditions.map(b=>[b.id,b.theory[0].scene]));
const tl=theories['l5-point-line'].points,tp=theories['l5-point-plane'].points,tv=theories['l5-volume'].points,tm=theories['l5-model'];
close(lineDistance(tl.A,tl.B,tl.C),4.8,'point-line theory answer');close(lineDistance(tl.N,tl.B,tl.C),0,'point-line theory foot on line');close(dot(sub(tl.A,tl.N),sub(tl.C,tl.B)),0,'point-line theory perpendicular');
close(planeDistance(tp.O,tp.A,tp.B,tp.T),4.8,'point-plane theory answer');close(planeDistance(tp.N,tp.A,tp.B,tp.T),0,'point-plane theory foot on plane');close(norm(sub(tp.O,tp.N)),4.8,'point-plane theory displayed height');
close(planeDistance(tv.O,tv.A,tv.B,tv.C),12/Math.sqrt(29),'volume theory answer');
close(polygonArea(tm,['I','J','K','L'])*(tm.points.I[2]-tm.points.E[2]),128,'model theory box volume');
for(const id of fragment.checkAdditions['5']){
 const q=fragment.questions.find(q=>q.id===id);
 assert.ok(!q.scene.studyPlanes?.length,id+' no answer-revealing study plane');
 assert.ok(!q.scene.segments?.length,id+' no answer-revealing auxiliary segments');
 assert.ok(!/≈|antwoord|uitkomst|loodrechte voet/.test(q.scene.caption),id+' no answer in caption');
}
console.log(JSON.stringify({ok:true,questions:20,theories:4,independentMethods:'3D cross/dot products, polygon areas, geometric similarity and numerical formula comparisons',results:result},null,2));
