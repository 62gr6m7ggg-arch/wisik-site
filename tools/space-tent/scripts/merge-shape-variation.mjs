// Idempotent source-data merge. Existing questions and their IDs are retained.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const file='app/course-content.json';
const course=JSON.parse(fs.readFileSync(file,'utf8'));
const fragments=[4,5,6].map(level=>JSON.parse(fs.readFileSync(`app/shape-variation-level${level}.json`,'utf8')));
const addedIds=new Set(fragments.flatMap(f=>f.questions.map(q=>q.id)));
assert.equal(addedIds.size,fragments.reduce((n,f)=>n+f.questions.length,0));
course.questions=course.questions.filter(q=>!addedIds.has(q.id));
for(const block of course.blocks){
 for(const key of ['questionIds','retestIds'])block[key]=block[key].filter(id=>!addedIds.has(id));
 for(const f of fragments)for(const a of f.blockAdditions.filter(a=>a.id===block.id)){
  const titles=new Set((a.theory||[]).map(t=>t.title));
  block.theory=block.theory.filter(t=>!titles.has(t.title));
 }
}
for(const key of Object.keys(course.checks))course.checks[key]=course.checks[key].filter(id=>!addedIds.has(id));
for(const f of fragments){
 course.questions.push(...f.questions);
 for(const a of f.blockAdditions){
  const b=course.blocks.find(b=>b.id===a.id);assert.ok(b,a.id);
  // Alternate familiar and transfer figures, preserving the original diagnostic trigger.
  const previous=b.questionIds,extra=a.questionIds||[],mixed=[];
  for(let i=0;i<Math.max(previous.length,extra.length);i++){
   if(previous[i])mixed.push(previous[i]);if(extra[i])mixed.push(extra[i]);
  }
  b.questionIds=mixed;
  b.retestIds.push(...(a.retestIds||[]));
  b.theory.push(...(a.theory||[]));
 }
 for(const [key,ids] of Object.entries(f.checkAdditions||{})){assert.ok(course.checks[key]);course.checks[key].push(...ids)}
 if(f.papers)Object.assign(course.papers,f.papers);
}
const source={id:'han-homework-shape-variation-060',level:'4–7',source:'HAN Ruimtemeetkunde 1: huiswerk bij lessen 1.4–1.6; Par 2_2 2_4 en 2_5.pdf; Par 4-5.pdf; Uitwerkingen Ruimtemeetkunde 1.pdf',coverage:'Nieuwe eigen opgaven naar de vaardigheden en vormfamilies in het huiswerk: hoeken, loodvoeten, inhoudsmethode, gelijkvormige doorsneden, ingepaste balken en kruisende lijnen. Prisma’s, tetraëders, centrale en scheve piramides, afgeknotte piramides en samengestelde modellen. Geen letterlijke kopieën en geen claim van een volledige telling van het originele hoofdstuk 10.'};
course.sources=course.sources.filter(s=>s.id!==source.id);course.sources.push(source);
assert.equal(new Set(course.questions.map(q=>q.id)).size,course.questions.length);
fs.writeFileSync(file,JSON.stringify(course,null,2)+'\n');
console.log(`Merged ${addedIds.size} shape-transfer questions; original question IDs preserved.`);
