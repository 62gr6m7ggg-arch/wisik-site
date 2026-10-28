import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {VERSION,EXERCISES,IDS} from '../public/apps/meetkunde/content.js';
import {REFERENCES} from '../public/apps/meetkunde/references.js';
import {model,drawFigure,dot,sub,norm,circum} from '../public/apps/meetkunde/geometry.js';
import {validateState,mergeState,loadState,saveState,emptyState} from '../public/apps/meetkunde/state.js';
const eq=(a,b,label)=>assert(Math.abs(a-b)<1e-8,label+': '+a+' vs '+b);
assert.equal(EXERCISES.length,21);assert.equal(new Set(IDS).size,21);
for(const [exam,count,points] of [['A',11,41],['D',10,40]]){const qs=EXERCISES.filter(e=>e.exam===exam);assert.equal(qs.length,count);assert.equal(qs.reduce((s,e)=>s+e.points,0),points);}
const refs=vm.runInNewContext(fs.readFileSync('public/apps/stoicheia/reference.js','utf8')+';ENTRIES');
for(const e of EXERCISES){assert(e.hint&&e.check&&e.checkAnswer&&e.source&&e.rubric.length);for(const n of e.refs){assert.equal(REFERENCES[n].id,refs[n-1].id);assert.equal(REFERENCES[n].label,refs[n-1].label);}for(let s=0;s<=e.steps.length;s++)assert(!/NaN|Infinity|undefined/.test(drawFigure(e.figure,s)),e.id+' finite diagram');}
let p=model('chord');eq(norm(p.P),1,'P circle');eq(norm(p.Q),1,'Q circle');eq(norm(sub(p.S,p.P)),norm(sub(p.S,p.Q)),'S midpoint');eq(dot(sub(p.M,p.S),sub(p.C,p.S)),0,'Thales chord');
p=model('geo');eq(norm(sub(p.P,p.Q)),norm(sub(p.P,p.R)),'isosceles');eq(dot(sub(p.Q,p.P),sub(p.R,p.P)),0,'right at P');
p=model('paraCircle');for(const n of ['A','B','D','F'])eq(norm(p[n]),1,n+' cyclic');eq(norm(sub(p.B,p.D)),norm(sub(p.B,p.E)),'BD BE');eq(dot(p.B,sub(p.C,p.B)),0,'tangent');
const baseline=model('altitude');const baseAngle=(a,v,b)=>Math.acos(dot(sub(a,v),sub(b,v))/(norm(sub(a,v))*norm(sub(b,v))));
for(let a=30;a<=150;a+=.5){p=model('locus',a);eq(dot(sub(p.B,p.Q),sub(p.P,p.A)),0,'altitude');eq(baseAngle(p.B,p.R,p.C),baseAngle(baseline.B,baseline.R,baseline.C),'constant angle');eq(norm(sub(p.R,baseline.circle.o)),baseline.circle.r,'fixed locus circle');assert(!/NaN|Infinity/.test(drawFigure('locus',4,a)));}
p=model('inverse');eq(norm(p.P)*norm(p.Pi),1,'P inverse');eq(norm(p.Q)*norm(p.Qi),1,'Q inverse');eq(norm(p.Pi)/norm(p.Q),norm(p.Qi)/norm(p.P),'similarity correspondence');
p=model('inverseCircle');eq(dot(sub(p.M,p.Bi),sub(p.Ai,p.Bi)),0,'inverse right angle');
p=model('cyclic');for(const n of ['C','D','E','F'])eq(norm(sub(p[n],p.circle.o)),p.circle.r,n+' on second circle');eq(p.E[1],p.F[1],'EF parallel AB');
const current={schema:1,last:'A1',exercises:{A1:{notes:'eigen werk',reflection:'anders',step:2,proof:true}}};const incoming={schema:1,last:'A2a',exercises:{A1:{notes:'oude versie'},A2a:{notes:'importwerk'}}};const merged=mergeState(current,incoming);assert.equal(merged.exercises.A1.notes,'eigen werk');assert.equal(merged.exercises.A2a.notes,'importwerk');assert.throws(()=>validateState({schema:9,exercises:{}}));assert.throws(()=>validateState({schema:1,exercises:[]}));assert.equal(validateState({schema:1,exercises:{onbekend:{notes:'x'}}}).exercises.onbekend,undefined);assert.equal(validateState({schema:1,exercises:{A1:{notes:'x'.repeat(30000),reflection:'evil',step:-8}}}).exercises.A1.notes.length,20000);
const store={v:null,getItem(){return this.v;},setItem(k,v){this.v=v;}};assert(saveState(store,current));assert.deepEqual(loadState(store).state,validateState(current));store.v='{bad';assert(loadState(store).error);assert(!saveState({setItem(){throw Error('quota');}},current));assert.deepEqual(emptyState(),{schema:1,last:'',exercises:{}});
for(const l of ['A','B','C','D'])assert(fs.statSync(`public/apps/meetkunde/pdf/Meetkunde_1_Oefententamen_${l}.pdf`).size>100000);
assert.equal(mergeState({schema:1,last:'A1',exercises:{A1:{notes:'',step:1}}},incoming).exercises.A1.notes,'oude versie');
// D: onafhankelijk berekende relaties, inclusief fysieke spiegelrichting.
const unit=v=>v.map(x=>x/norm(v)), angleDeg=(a,v,b)=>baseAngle(a,v,b)*180/Math.PI;
const on=(point,c,label)=>eq(norm(sub(point,c.o)),c.r,label);
p=model('d-triangle');for(const n of ['B','D','E'])eq(norm(p[n]),1,'D1 straal '+n);eq(angleDeg(p.C,p.D,p.E),angleDeg(p.B,p.A,p.C)/2,'D1 halve hoek');
p=model('d-equilateral');eq(norm(sub(p.A,p.E)),norm(sub(p.C,p.D)),'D2a gelijke zijden');on(p.S,p.c1,'D2b eerste cirkel');on(p.S,p.c2,'D2b tweede cirkel');eq(angleDeg(p.A,p.S,p.B),120,'D2b 120 graden');eq(angleDeg(p.B,p.S,p.E),60,'D2b 60 graden');eq(norm(sub(p.A,p.S))+norm(sub(p.S,p.E)),norm(sub(p.A,p.E)),'D2b S tussen A en E');
function reflectionLaw(a,s,b,c){const i=unit(sub(s,a)),u=unit(sub(c,s)),out=unit(sub(b,s));for(let j=0;j<2;j++)eq(2*dot(i,u)*u[j]-i[j],out[j],'D3 fysieke spiegelrichting');}
p=model('d-mirror');reflectionLaw(p.A,p.S,p.B,p.C);eq(angleDeg(p.B,p.A,p.C),angleDeg(p.A,p.B,p.C),'D3a gelijke basishoeken');
p=model('d-mirrorBuild');reflectionLaw(p.A,p.P,p.B,p.C1);reflectionLaw(p.A,p.Q,p.B,p.C2);for(const c of ['C1','C2'])eq(norm(sub(p[c],p.A)),norm(sub(p[c],p.B)),'D3b middelloodlijn');
p=model('d-intersections');for(const n of ['A','B','D'])eq(norm(sub(p[n],p.M)),p.r1,'D4 eerste cirkel');for(const n of ['A','B','C'])eq(norm(sub(p[n],p.N)),p.r2,'D4 tweede cirkel');for(const n of ['M','N','C','D'])on(p[n],p.circle,'D4 resultaat');eq(angleDeg(p.M,p.D,p.N),angleDeg(p.N,p.C,p.M),'D4 gelijke hoeken');
for(const key of ['d-parallel','d-parallelBuild']){p=model(key);for(const n of ['A','B','C'])eq(norm(p[n]),1,'D5 eerste cirkel');for(const n of ['A','B','R'])on(p[n],p.circle,'D5 tweede cirkel');eq(dot(sub(p.A,p.O),sub(p.R,p.A)),0,'D5 raaklijn A');eq(dot(sub(p.R,p.circle.o),sub(p.U,p.R)),0,'D5 raaklijn R en evenwijdigheid');assert(angleDeg(p.A,p.B,p.C)>angleDeg(p.A,p.C,p.B),'D5 gegeven hoekongelijkheid');}
p=model('d-bisectorCircle');eq(norm(sub(p.A,p.C)),norm(sub(p.B,p.C)),'D6 gelijkbenig');assert(angleDeg(p.A,p.C,p.B)>90);eq(angleDeg(p.C,p.A,p.D),angleDeg(p.C,p.A,p.B),'D6a bissectrice');for(const n of ['A','C','D','F'])on(p[n],p.circle,'D6b gestippelde cirkel');for(const n of ['A','E','F','G'])on(p[n],p.result,'D6b nieuwe cirkel');eq(norm(sub(p.C,p.F))+norm(sub(p.F,p.E)),norm(sub(p.C,p.E)),'D6b F tussen C en E');eq(angleDeg(p.E,p.A,p.G)+angleDeg(p.E,p.F,p.G),180,'D6b overstaande hoeken');
const both=mergeState(current,{schema:1,last:'D6b',exercises:{D6b:{notes:'eigen bewijs D',step:3,proof:true}}});assert.equal(both.exercises.A1.notes,'eigen werk');assert.equal(both.exercises.D6b.notes,'eigen bewijs D');assert.equal(both.last,'D6b');
const bridge=fs.readFileSync('public/apps/stoicheia/oefenbrug.js','utf8');for(const id of IDS)assert(bridge.includes("'"+id+"'"),'teruglink '+id);
assert(!drawFigure('d-parallelBuild',0).includes('>B</text>'),'D5b antwoord niet zichtbaar bij start');assert(!drawFigure('d-mirrorBuild',0).includes('C₁'),'D3b constructie niet zichtbaar bij start');
console.log('Meetkunde A en D: 21 deelvragen, 41 + 40 punten, stellingkoppelingen, exacte figuren, spiegelwet, 241 baanposities en behoud van voortgang gecontroleerd.');

// Cachecontract: iedere import in de browsermodulegraaf draagt de onderdeelversie.
for(const file of ['app.js','content.js','state.js']){const code=fs.readFileSync('public/apps/meetkunde/'+file,'utf8');for(const [,url] of code.matchAll(/from '(\.\/[^']+)'/g)){assert.equal(new URL(url,'https://wisik.nl/apps/meetkunde/').searchParams.get('v'),VERSION,'moduleversie '+file+' → '+url);assert(fs.existsSync('public/apps/meetkunde/'+url.split('?')[0]));}}
