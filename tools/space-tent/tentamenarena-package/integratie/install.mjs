/** Guarded one-release installer. Default dry-run. No commit, push or deploy. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const here=path.dirname(fileURLToPath(import.meta.url)),pkg=path.resolve(here,'..');
const arg=process.argv[2];
if(!arg||arg.startsWith('--'))throw Error('Geef de root van de lokale wisik-site werkbranch.');
const repo=path.resolve(arg),course=path.join(repo,'tools/space-tent'),app=path.join(course,'app');
const payload=fs.readFileSync(path.join(pkg,'Spacetent_Tentamenarena_1.1.html'),'utf8');
const sha256=s=>createHash('sha256').update(s).digest('hex');
const release=JSON.parse(fs.readFileSync(path.join(pkg,'release.json'),'utf8'));
assert.equal(sha256(payload),release.payloadSha256,'Onbekende of gewijzigde arena-HTML; eerst opnieuw controleren.');
const match=payload.match(/<script id="arena-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Volledige arena-data ontbreekt.');
const data=JSON.parse(match[1]);
assert.equal(data.version,'1.1.0');
assert.equal(data.exam.length,18);assert.equal(data.reconstruction.length,33);assert.equal(data.training.length,24);assert.equal(Object.keys(data.reconstructionGroups).length,6);
for(const item of JSON.parse(fs.readFileSync(path.join(pkg,'bronbestanden/manifest.json'),'utf8'))){
 const document=data.documents[item.id];assert.ok(document?.base64);
 const bytes=Buffer.from(document.base64,'base64');assert.equal(bytes.length,item.bytes);assert.equal(sha256(bytes),item.sha256,item.id);
}
const bank=[...JSON.parse(fs.readFileSync(path.join(app,'content.json'),'utf8')).blocks,...JSON.parse(fs.readFileSync(path.join(app,'course-content.json'),'utf8')).blocks];
for(const q of [...data.exam,...data.reconstruction,...data.training])assert.ok(bank.some(b=>b.id===q.blockId),`Lesblok ontbreekt: ${q.id}/${q.blockId}`);
for(const b of data.courseBlocks){const actual=bank.find(x=>x.id===b.id);assert.ok(actual,b.id);assert.equal(actual.level||1,b.level,b.id);assert.equal(actual.title,b.title,b.id);}
const gitHash=s=>createHash('sha1').update(`blob ${Buffer.byteLength(s)}\0`).update(s).digest('hex');
function readGuard(relative,sha){const s=fs.readFileSync(path.join(repo,relative),'utf8');assert.equal(gitHash(s),sha,`${relative} is gewijzigd; geen blinde overschrijving.`);return s;}
function once(text,needle,replacement){assert.equal(text.split(needle).length,2,'Integratieanker is niet uniek: '+needle);return text.replace(needle,replacement);}
let source=readGuard('tools/space-tent/app/ruimteklaar.tsx','f50ba926ca6b757278f6d9e2e555cf4526efaa46');
let build=readGuard('tools/space-tent/scripts/build-space.mjs','10eaf805b99803207cc816ad0cb08f85d7732609');
let audit=readGuard('scripts/audit-space-release.mjs','25667b0a07755f42b696465bc88e5decc3e6722f');
assert.equal(fs.readFileSync(path.join(app,'version.ts'),'utf8'),"export const APP_VERSION='0.6.0';\n");
source=once(source,"'use client';","'use client';\n// TENTAMENARENA-INTEGRATION-110\nimport ArenaOverlay from './arena-overlay';");
source=once(source,'export default function Ruimteklaar({local=false}:{local?:boolean}){',`export default function Ruimteklaar({local=false}:{local?:boolean}){
 const [arenaOpen,setArenaOpen]=useState(false),[arenaReturn,setArenaReturn]=useState(false);
 function arenaLesson(level:number,id:string){
  const selected=BANK.blocks.find(b=>b.id===id&&(b.level||1)===level);
  if(!selected||level<1||level>6)return;
  setArenaOpen(false);setArenaReturn(true);start(selected);
 }
`);
source=once(source," {(view==='route'||view==='level')&&<>",` {local&&<ArenaOverlay open={arenaOpen} onClose={()=>setArenaOpen(false)} onLesson={arenaLesson}/>}
 {local&&(view==='route'||view==='level'||arenaReturn)&&<section className="atelier-invite no-print"><div><h2>{arenaReturn?'Terug naar je Tentamenarena?':'Tentamenarena'}</h2><p>Het tentamen uit 2018, de Wisik-reconstructie van de oefentoets en gerichte hersteltraining. Je levelresultaten blijven apart.</p></div><Button variant="outline" onClick={()=>setArenaOpen(true)}>{arenaReturn?'Terug naar mijn arena':'Open de Tentamenarena'}</Button></section>}
 {(view==='route'||view==='level')&&<>`);
build+=`\n// TENTAMENARENA-INTEGRATION-110: retain the arena on future complete builds.\nconst fs=await import('node:fs');\nconst arena=path.join(root,'app/tentamenarena/index.html');\nif(!fs.existsSync(arena))throw new Error('Complete Tentamenarena ontbreekt.');\nfs.mkdirSync(path.join(root,'.space-dist/tentamenarena'),{recursive:true});\nfs.copyFileSync(arena,path.join(root,'.space-dist/tentamenarena/index.html'));\n`;
audit=once(audit,"const report={",`const arena=currentEvidence('validation/tentamenarena-110.json');
assert.equal(arena.arenaVersion,'1.1.0');
assert.equal(arena.payloadSha256,hash(path.join(source,'app/tentamenarena/index.html')));
assert.equal(arena.payloadSha256,hash(path.join(root,'public/apps/ruimteklaar/tentamenarena/index.html')));
assert.deepEqual(arena.environments,['chromium-desktop','chromium-mobile','chromium-narrow','webkit-desktop','webkit-mobile','webkit-narrow']);
assert.ok(arena.results.every(r=>r.status==='passed'&&r.reload&&r.coursePreserved&&r.lessonReturn&&r.originalParts===18&&r.reconstructedParts===33));
const report={`);
audit=once(audit,' shapeVariation,',' arena,\n shapeVariation,');
const headers=readGuard('public/_headers','1b94018a09afc46d3ee8e53de04c22a0468705a8');
const policy=headers.match(/^  Content-Security-Policy: (.+)$/m)[1];
assert.ok(policy.includes("frame-src 'none'"));
const scoped=headers+"\n# Only the same-origin Tentamenarena iframe in Space-tent.\n/apps/ruimteklaar/*\n  ! Content-Security-Policy\n  Content-Security-Policy: "+policy.replace("frame-src 'none'","frame-src 'self'")+"\n";
const outputs=[
 [path.join(repo,'public/_headers'),scoped],[path.join(app,'ruimteklaar.tsx'),source],[path.join(course,'scripts/build-space.mjs'),build],[path.join(repo,'scripts/audit-space-release.mjs'),audit],
 [path.join(app,'arena-overlay.tsx'),fs.readFileSync(path.join(here,'arena-overlay.tsx'),'utf8')],
 [path.join(app,'tentamenarena/index.html'),payload],[path.join(app,'version.ts'),"export const APP_VERSION='0.7.0';\n"]
];
for(const rel of ['tools/space-tent/space/index.html','tools/space-tent/review/index.html','public/assets/js/site-data.js','public/hbo/space-tent/index.html','public/backstage/space-tent/index.html','public/films/ruimteklaar/catalog.json']){
 const name=path.join(repo,rel),old=fs.readFileSync(name,'utf8');outputs.push([name,old.replaceAll('0.6.0','0.7.0')]);
}
for(const [name] of outputs)console.log(path.relative(repo,name));
if(process.argv.includes('--apply')){for(const [name,text] of outputs){fs.mkdirSync(path.dirname(name),{recursive:true});fs.writeFileSync(name,text);}console.log('Geplaatst in de werkmap. Nog NIET gebouwd, getest, gecommit of gepubliceerd.');}
else console.log('Dry-run geslaagd. Geen bestanden gewijzigd.');
