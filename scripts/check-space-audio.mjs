import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const {version,items}=read('public/films/ruimteklaar/catalog.json'),examples=read('tools/space-tent/app/audio-examples.json');
const blocks=[...read('tools/space-tent/app/content.json').blocks,...read('tools/space-tent/app/course-content.json').blocks];
const appVersion=fs.readFileSync(path.join(root,'tools/space-tent/app/version.ts'),'utf8').match(/APP_VERSION='([^']+)'/)[1];
assert.equal(version,appVersion);assert.equal(items.length,50);assert.equal(new Set(items.map(c=>c.id)).size,50);
assert.deepEqual([1,2,3,4,5,6].map(n=>items.filter(c=>c.lesson===n).length),[9,8,8,10,9,6]);
const cube={A:[0,0,0],B:[1,0,0],C:[1,1,0],D:[0,1,0],E:[0,0,1],F:[1,0,1],G:[1,1,1],H:[0,1,1]};
for(const c of items){
 assert.equal(Number(c.id.split('.')[0]),c.lesson);assert.ok(blocks.some(b=>b.id===c.blockId),c.id+' block');
 assert.equal(c.audio,`/films/ruimteklaar/${c.id}/uitleg.m4a`);
 const bytes=fs.readFileSync(path.join(root,'public',c.audio));assert.equal(createHash('sha256').update(bytes).digest('hex'),c.sha256,c.id+' audio hash');
 assert.ok(bytes.length>10000&&bytes.length<25000000);assert.ok(c.duration>20&&c.duration<120);assert.equal(c.paragraphs.length,5);assert.ok(c.paragraphs.every(p=>typeof p==='string'&&p.length>10));
 const visual=examples[c.id];assert.ok(visual);assert.ok(visual.scene||visual.notes.length);
 if(visual.scene){const s=visual.scene;const points=s.showCube===false?s.points:{...cube,...s.points};for(const p of Object.values(points))assert.ok(p.length===3&&p.every(Number.isFinite));for(const edge of [...s.edges||[],...s.highlights||[]])assert.ok(edge.length===2&&points[edge[0]]&&points[edge[1]],c.id+' '+edge);for(const plane of s.planes||[])assert.ok(plane.every(p=>points[p]),c.id+' plane');}
}
assert.equal(Object.keys(examples).length,50);
assert.ok(examples['3.5'].notes.some(s=>s.includes('⅓ × 25 × 5 = 41⅔')));
const world=(id,name)=>{const s=examples[id].scene,p=s.points[name]||cube[name];return p.map((v,i)=>v*(s.dimensions?.[i]||1))};
const sub=(a,b)=>a.map((v,i)=>v-b[i]);const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≠ ${b}`);
// Independent perpendicular-foot checks for the numerical listener examples.
for(const [id,from,foot,ends] of [['5.2','P','Q',['E','B']],['5.3','S','H',['A','T']],['5.4','E','Q',['A','I']],['5.5','F','Q',['B','E']],['5.5','F','Q',['B','G']],['6.4','M','Q',['A','G']],['6.4','M','Q',['H','F']]])near(dot(sub(world(id,from),world(id,foot)),sub(world(id,ends[0]),world(id,ends[1]))),0);
near(Math.sqrt(dot(sub(world('5.4','E'),world('5.4','Q')),sub(world('5.4','E'),world('5.4','Q')))),12/Math.sqrt(17));
near(Math.sqrt(dot(sub(world('6.4','M'),world('6.4','Q')),sub(world('6.4','M'),world('6.4','Q')))),10/Math.sqrt(6));
const learning=fs.readFileSync(path.join(root,'tools/space-tent/app/learning.tsx'),'utf8');assert.equal((learning.match(/<ExplanationAudio/g)||[]).length,1);assert.ok(learning.indexOf('<ExplanationAudio')>learning.indexOf("{stage==='theory'"));assert.ok(learning.indexOf('<ExplanationAudio')<learning.indexOf("{stage==='practice'"));
console.log('50 luistervoorbeelden: les-/blokkoppelingen, mediavingerafdrukken, figuurreferenties en loodvoeten correct; hulp alleen in uitleg.');
