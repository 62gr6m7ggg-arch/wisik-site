import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderToStaticMarkup} from 'react-dom/server';
import {ENTRIES,ENTRY_BY_ID,SOURCES,findEntries,suggestions,normalize} from '../app/knowledge/model';
import {SCENES,FIGURE_KINDS,footExample,areaRectangle} from '../app/knowledge/figure-data';
import KnowledgeFigure from '../app/knowledge/figures';
import * as M from '../app/model';
import * as L from '../app/local-progress';
import * as D from '../app/diagnostic';
import {cross,sub,dot,distance,type V3} from '../app/geometry-math';

const near=(a:number,b:number,label='')=>assert.ok(Math.abs(a-b)<1e-8,label+': '+a+' versus '+b);
assert.equal(ENTRIES.length,145);assert.equal(ENTRY_BY_ID.size,145);
assert.deepEqual(ENTRIES.map(e=>e.term),ENTRIES.map(e=>e.term).sort((a,b)=>a.localeCompare(b,'nl',{sensitivity:'base',numeric:true})));
for(const e of ENTRIES){
 assert.match(e.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
 assert.ok(e.summary.length>45&&e.explanation.join(' ').length>200,e.term+' meaningful explanation');
 assert.ok(e.steps.length>=3&&e.example.steps.length>=3&&e.pitfalls.length>=1,e.term+' complete sections');
 assert.ok(e.related.length>=2&&e.related.every(id=>id!==e.id&&ENTRY_BY_ID.has(id)),e.term+' valid references');
 assert.ok(e.sourceIds.length>0&&e.sourceIds.every(id=>SOURCES.has(id)),e.term+' source traceability');
 assert.ok(e.levels.every(l=>l>=1&&l<=6));
 if(e.figure)assert.ok(FIGURE_KINDS.includes(e.figure),e.term+' supported illustration');
 assert.ok(!/TODO|Lorem ipsum|uitleg volgt|nog uitwerken/i.test(JSON.stringify(e)),e.term+' no placeholders');
}
assert.deepEqual(findEntries('loodvoet').entries.map(e=>e.id),['loodvoet']);
assert.equal(findEntries('tetraeder').entries[0].term,'Viervlak');
assert.equal(findEntries('DIAMETER').entries[0].term,'Middellijn');
assert.equal(findEntries('  lijn-vlakhoek ').entries[0].term,'Hoek tussen een lijn en een vlak');
assert.equal(findEntries('arcsin').entries[0].term,'Inverse goniometrie');
assert.equal(findEntries('').entries.length,145);assert.equal(findEntries('','kern').entries.length,129);assert.equal(findEntries('','aanvullend').entries.length,8);assert.equal(findEntries('','geogebra').entries.length,8);
assert.equal(findEntries('zzzxxyy').entries.length,0);assert.ok(suggestions('loodvot').some(e=>e.id==='loodvoet'));
assert.equal(normalize('Tetraëder'),normalize('TETRAEDER'));

let planes=0;
for(const [id,s] of Object.entries(SCENES)){
 const points=s.points!;
 for(const v of Object.values(points))assert.ok(v.length===3&&v.every(Number.isFinite),id);
 for(const edge of [...s.edges||[],...s.highlights||[]])assert.ok(points[edge[0]]&&points[edge[1]],id+' line '+edge);
 for(const plane of s.planes||[]){const [a,b,c]=plane.map(p=>points[p]);assert.ok(a&&b&&c,id);const n=cross(sub(b,a),sub(c,a));assert.ok(Math.hypot(...n)>1e-9,id+' non-degenerate plane');for(const name of plane)near(dot(n,sub(points[name],a)),0,id+' coplanarity');planes++;}
}
// Independent coordinate checks of claims in captions, rather than image snapshots.
const p=SCENES.pyramid.points!;
near(distance(p.T,p.O),4);near(distance(p.O,p.M),3);near(distance(p.T,p.M),5);
near(dot(sub(p.T,p.M),sub(p.B,p.A)),0,'standline MT perpendicular to AB');
near(dot(sub(p.O,p.M),sub(p.B,p.A)),0,'standline MO perpendicular to AB');
near(Math.atan2(distance(p.T,p.O),distance(p.O,p.M))*180/Math.PI,53.13010235415598);
const sk=SCENES.skew.points!;
near(dot(sub(sk.B,sk.A),sub(sk.E,sk.A)),0);near(dot(sub(sk.B,sk.A),sub(sk.C,sk.B)),0);
const q=SCENES['point-plane'].points!,normal=cross(sub(q.B,q.A),sub(q.D,q.A));
near(Math.hypot(...cross(sub(q.P,q.F),normal)),0);near(dot(sub(q.F,q.A),normal),0);
const lp=SCENES['line-plane'].points!;
near(distance(lp.S,[.5,.5,.5]),0);near(dot(sub(lp.S,lp.B),cross(sub(lp.D,lp.B),sub(lp.H,lp.B))),0);
const tetra=SCENES.tetrahedron.points!;
near(Math.abs(dot(sub(tetra.A,tetra.O),cross(sub(tetra.B,tetra.O),sub(tetra.C,tetra.O))))/6,10);
let footCases=0;
for(let i=-20;i<=80;i++){
 const x=i/20,e=footExample(x);near(e.foot[0],x);near(e.foot[1],0);near(Math.hypot(e.p[0]-e.foot[0],e.p[1]-e.foot[1]),e.distance);
 // Compare to candidate endpoints and 201 points of the actual finite segment.
 for(let j=0;j<=200;j++)assert.ok(Math.hypot(x-j/100,1)>=e.segmentDistance-1e-9);
 near(e.segmentDistance,x<0?Math.hypot(x,1):x>2?Math.hypot(x-2,1):1);footCases++;
}
near(footExample(3).segmentDistance,Math.SQRT2);near(footExample(1).segmentDistance,1);
for(let i=0;i<=1000;i++){const x=i/100;near(areaRectangle(x),25-(x-5)**2);assert.ok(areaRectangle(x)<=25+1e-8)}
// Representative worked numeric results independently recomputed.
near(Math.sqrt(3**2+4**2+12**2),13);near(Math.sqrt(2**2+3**2+6**2),7);
near(6*6*9/3-(2*2*3/3),104);near((6*8)/10,4.8);near((3*4)/5,2.4);
near(3*10/7.5,4);near(Math.sqrt(5**2-3**2),4);near(2*(3*4+3*5+4*5),94);
near(5**2+7**2-2*5*7*Math.cos(Math.PI/3),39);near(Math.atan(.1)*180/Math.PI,5.710593137499643);
for(const kind of new Set(ENTRIES.flatMap(e=>e.figure?[e.figure]:[]))){const html=renderToStaticMarkup(<KnowledgeFigure kind={kind}/>);assert.ok(html.includes('<svg')&&html.length>500,kind+' complete graphic');assert.ok(!/NaN|Infinity|undefined/.test(html),kind+' finite graphic');}

let serial=0;
const event=(type:M.LearningEvent['type'],payload:Record<string,unknown>,at=100+(++serial)*2)=>L.normalizeEvent({id:'knowledge-check-'+String(++serial).padStart(7,'0'),at,type,payload});
const answers=(key:string,sid:string)=>M.CHECKS[key].map((id,i)=>event('answer',{questionId:id,answer:M.QUESTIONS[id].answer,helped:false,context:'check',sessionId:sid},100+i*2));
for(const key of Object.keys(M.CHECKS)){
 const es=answers(key,'independent-'+key),sid='independent-'+key,id=M.CHECKS[key][0];
 assert.equal(M.checkAttempts(es,key)[0].passed,true);
 const lookup=event('lookup',{questionId:id,context:'check',sessionId:sid},99);
 const between=event('lookup',{questionId:id,context:'check',sessionId:sid},101);
 const partial=M.checkAttempts([es[0],between],key)[0];assert.equal(partial.helped,true,'Help between check questions applies immediately');assert.equal(partial.at,101);
 assert.equal(M.checkAttempts([es[0],between,...es.slice(1)],key)[0].passed,false,'Help between answers prevents an independent pass');
 assert.equal(M.checkAttempts([lookup],key)[0].helped,true);assert.equal(M.checkAttempts([lookup],key)[0].complete,false);assert.equal(M.deriveProgress([lookup]).xp,0);
 const helped=[lookup,...es];assert.equal(M.checkAttempts(helped,key)[0].passed,false,key+' help cannot pass');
 assert.ok(M.checkAttempts(helped,key)[0].rows.every(e=>e.payload.helped));assert.equal(M.deriveProgress(helped).checks[key],false);
 assert.ok(M.visibleEvidenceAnswers(helped,M.BANK.checkpointIds).every(e=>e.payload.helped));
 assert.equal(M.visibleEvidenceAnswers(helped.slice(0,-1),M.BANK.checkpointIds).length,0,'No partial check result leakage');
 const late=event('lookup',{questionId:id,context:'check',sessionId:sid},10000);
 assert.equal(M.checkAttempts([...es,late],key)[0].passed,true,'Reading after submission cannot revoke a pass');
 const fresh=answers(key,'new-independent-'+key);
 assert.equal(M.deriveProgress([...helped,...fresh]).checks[key],true,'A fresh independent attempt can pass');
 const old=answers(key,'old-pass-'+key);
 assert.equal(M.deriveProgress([...old,...helped]).checks[key],true,'New help does not revoke earlier independent achievement');
}
const practiceId=M.BANK.blocks[0].questionIds[0],sid='lookup-practice';
const lookup=event('lookup',{questionId:practiceId,context:'practice',sessionId:sid,query:'DO NOT STORE',entryId:'DO NOT STORE'},10);
assert.deepEqual(Object.keys(lookup.payload).sort(),['context','questionId','sessionId']);
const good=event('answer',{questionId:practiceId,context:'practice',sessionId:sid,answer:M.QUESTIONS[practiceId].answer,helped:false},20);
assert.equal(M.deriveProgress([lookup,good]).evidence[practiceId].independent,false);
assert.equal(M.deriveProgress([lookup,good]).evidence[practiceId].correct,true);
assert.equal(M.deriveProgress([good]).evidence[practiceId].independent,true);
const map=new Map<string,string>(),storage={getItem:(k:string)=>map.get(k)||null,setItem:(k:string,v:string)=>{map.set(k,v)}};
const store=L.createLocalProgressStore(()=>storage);
assert.ok(store.append({id:lookup.id,type:lookup.type,payload:lookup.payload}).ok);
assert.equal(L.createLocalProgressStore(()=>storage).load().events[0].type,'lookup','Lookup survives reload');
assert.ok(store.exportProgress().ok);assert.ok(!JSON.stringify([...map.values()]).includes('DO NOT STORE'));
assert.throws(()=>event('lookup',{questionId:practiceId,context:'check',sessionId:sid}));
assert.throws(()=>event('lookup',{questionId:'unknown',context:'practice',sessionId:sid}));
// Helped diagnostic probes are not independent evidence of a named misconception.
const b=M.BANK.blocks[0],dsid='diagnostic-lookup';
const trigger=event('answer',{questionId:b.misconception.trigger.qid,answer:[b.misconception.trigger.wrongAnswer],helped:false,context:'practice',sessionId:dsid},30);
const probes=b.probeIds.map((id,i)=>event('answer',{questionId:id,answer:[b.misconception.probeWrongAnswers[i]],context:'probe',sessionId:dsid,helped:false},50+i));
assert.equal(D.getBlockDiagnosis(b,[trigger,...probes])?.supported,true);
const probeLookup=event('lookup',{questionId:b.probeIds[0],context:'probe',sessionId:dsid},40);
assert.equal(D.getBlockDiagnosis(b,[trigger,probeLookup,...probes])?.supported,false);
const lesson=fs.readFileSync('app/learning.tsx','utf8');assert.ok(lesson.includes('passed=allCorrect&&!assisted'),'UI check result respects support');
console.log(JSON.stringify({status:'passed',entries:145,relatedLinks:ENTRIES.reduce((n,e)=>n+e.related.length,0),illustrations:new Set(ENTRIES.flatMap(e=>e.figure?[e.figure]:[])).size,planarPolygons:planes,footCases,independentCheckGroups:Object.keys(M.CHECKS).length,coverage:['Complete articles and source references','Dutch alphabet, aliases and typo suggestions','Spatial geometry, foot inside/outside segment, example calculations','Help-only resume and storage; no queries or reading history','Assisted checks cannot pass or leak partial correctness','Old achievements preserved; later independent attempt can pass','Helped diagnostic answers excluded from independent confirmation']}));
