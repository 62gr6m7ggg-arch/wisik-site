import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {EXERCISES,IDS} from '../public/apps/meetkunde/content.js';
import {REFERENCES} from '../public/apps/meetkunde/references.js';
import {model,drawFigure,dot,sub,norm,circum} from '../public/apps/meetkunde/geometry.js';
import {validateState,mergeState,loadState,saveState,emptyState} from '../public/apps/meetkunde/state.js';
const eq=(a,b,label)=>assert(Math.abs(a-b)<1e-8,label+': '+a+' vs '+b);
assert.equal(EXERCISES.length,11);assert.equal(new Set(IDS).size,11);assert.equal(EXERCISES.reduce((s,e)=>s+e.points,0),41);
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
console.log('Meetkunde: 11 deelvragen, 41 punten, stellingkoppelingen, figuren, 241 baanposities, opslag en veilige import gecontroleerd.');
