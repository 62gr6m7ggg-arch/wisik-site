import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const course=JSON.parse(fs.readFileSync('app/course-content.json'));
const fragments=[4,5,6].map(l=>JSON.parse(fs.readFileSync(`app/shape-variation-level${l}.json`)));
const ids=fragments.flatMap(f=>f.questions.map(q=>q.id));
const questions=course.questions.filter(q=>ids.includes(q.id));
assert.equal(questions.length,ids.length);assert.equal(new Set(ids).size,ids.length);
for(const f of fragments)for(const q of f.questions)assert.deepEqual(questions.find(x=>x.id===q.id),q,'Fragment/bank mismatch: '+q.id);
for(const q of questions){assert.equal(q.scene?.showCube,false,q.id);assert.ok(q.shapeFamily&&q.curriculumSource&&q.geometryCheck,q.id);assert.ok(q.explanation.length>60&&q.hint.length>15,q.id);}
for(const block of course.blocks.filter(b=>b.level>=4&&b.level<=6)){
 assert.ok(block.questionIds.some(id=>ids.includes(id)),block.id+' missing form transfer');
 assert.ok(block.questionIds.some(id=>!ids.includes(id)),block.id+' familiar foundation removed');
}
for(const key of ['4','5','6','7a','7b'])assert.ok(course.checks[key].filter(id=>ids.includes(id)).length>=2,key+' missing independent transfer');
const logs=[4,5,6].map(level=>({level,output:execFileSync(process.execPath,[`scripts/check-shape-level${level}.mjs`],{encoding:'utf8'})}));
const version=fs.readFileSync('app/version.ts','utf8').match(/APP_VERSION='([^']+)'/)[1];
let browser;
if(process.argv.includes('--browser')){
 browser=JSON.parse(fs.readFileSync('.shape-browser/results.json'));
 assert.equal(browser.version,version);assert.equal(browser.status,'passed');assert.deepEqual(browser.errors,[]);
 assert.deepEqual([...browser.ids].sort(),[...ids].sort());
 assert.deepEqual(browser.results.map(r=>r.environment).sort(),['chromium-desktop','chromium-mobile','webkit-mobile'].sort());
 for(const result of browser.results){assert.equal(result.status,'passed');assert.deepEqual(result.questions.map(q=>q.id).sort(),[...ids].sort());assert.ok(result.questions.every(q=>q.status==='passed'));}
}
const report={version,status:'passed',questionIds:ids,questions:questions.length,
 numeric:questions.filter(q=>q.type==='numeric').length,
 families:[...new Set(questions.map(q=>q.shapeFamily))].sort(),
 blocks:fragments.reduce((n,f)=>n+f.blockAdditions.length,0),
 theory:fragments.reduce((n,f)=>n+f.blockAdditions.reduce((t,b)=>t+(b.theory||[]).length,0),0),
 checks:Object.fromEntries(['4','5','6','7a','7b'].map(k=>[k,course.checks[k].filter(id=>ids.includes(id)).length])),
 independentGeometry:logs,browser,errors:[],
 limitations:['Eigen nieuwe opgaven; geen volledige census van de oorspronkelijke huiswerkvragen.','Geen onafhankelijke HAN-docentbeoordeling of aangetoonde leerwinst.']};
if(process.argv.includes('--write')){assert.ok(browser,'Published evidence requires browser results');fs.writeFileSync('validation/shape-variation-060.json',JSON.stringify(report,null,2)+'\n');}
console.log(`Shape variation checks passed: ${report.questions} questions, ${report.numeric} numeric, ${report.theory} theory additions, ${report.families.length} named figure families.`);
