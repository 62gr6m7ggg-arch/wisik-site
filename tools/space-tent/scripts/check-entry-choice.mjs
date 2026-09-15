import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
const compiled=await build({stdin:{contents:"export * as E from './app/entry-choice';export * as M from './app/model';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {E,M}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
let tests=0;const equal=(a,b)=>{assert.deepEqual(a,b);tests++};
const memory=new Map([['untouched-progress','keep-this']]);const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
const blank=M.deriveProgress([]);equal(E.readEntryChoice(()=>storage),null);
for(let id=1;id<=7;id++){
 equal(E.canEnterLevel(id,blank.levels,false),id===1);equal(E.canEnterLevel(id,blank.levels,true),true);
 equal(E.writeEntryChoice(()=>storage,id),true);equal(E.readEntryChoice(()=>storage).level,id);
 equal(memory.get('untouched-progress'),'keep-this');equal(M.deriveProgress([]),blank);
}
for(const id of [0,8,-1,1.1,NaN,Infinity,'5',null,undefined]){equal(E.isEntryLevel(id),false);equal(E.canEnterLevel(id,blank.levels,true),false);if(id!==null)equal(E.writeEntryChoice(()=>storage,id),false);}
for(const raw of ['bad','{}','null','[]','{"format":"wisik-space-entry","version":2,"level":4}','{"format":"wisik-space-entry","version":1,"level":99}','{"format":"wisik-space-entry","version":1,"level":"4"}',' '.repeat(257)]){storage.setItem(E.ENTRY_CHOICE_KEY,raw);equal(E.readEntryChoice(()=>storage),null)}
equal(E.readEntryChoice(()=>{throw Error('blocked')}),null);equal(E.writeEntryChoice(()=>{throw Error('blocked')},4),false);
equal(E.writeEntryChoice(()=>storage,null),true);equal(E.readEntryChoice(()=>storage),null);equal(memory.get('untouched-progress'),'keep-this');
// Prove that selecting a later level is not recognised as learning evidence.
const q=M.BANK.questions.find(q=>q.block.startsWith('l4'))||M.BANK.questions.find(q=>M.blocksForLevel(4).some(b=>b.id===q.block));
assert.ok(q);
const event={id:'actual-answer-001',at:1,type:'answer',payload:{questionId:q.id,answer:q.answer,context:'practice',sessionId:'entry-unit',helped:false}};
const earned=M.deriveProgress([event]);assert.ok(earned.xp>0);equal(earned.levels[1].passed,false);equal(earned.levels[4].passed,false);equal(earned.levels[7].passed,false);
E.writeEntryChoice(()=>storage,7);E.writeEntryChoice(()=>storage,null);equal(M.deriveProgress([event]),earned);
const source=fs.readFileSync('app/ruimteklaar.tsx','utf8');assert.match(source,/unlocked=canEnterLevel\(levelId,p.levels,freeEntry\)/);assert.match(source,/if\(!canEnterLevel\(level,p.levels,freeEntry\)\)/);assert.match(source,/if\(!isEntryLevel\(id\)\)return;setFreeEntry\(true\)/);
assert.doesNotMatch(fs.readFileSync('app/entry-choice.ts','utf8'),/append\(|fetch\(|type:'answer'/);
console.log(JSON.stringify({status:'passed',assertions:tests,checks:'all seven access choices; corrupt/unsupported preferences; blocked storage; no fabricated evidence; preserved earned XP; guided return; shared access predicate'}));
