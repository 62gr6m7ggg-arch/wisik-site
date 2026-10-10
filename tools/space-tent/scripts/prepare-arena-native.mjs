import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const course=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),repo=path.resolve(course,'../..');
const read=p=>fs.readFileSync(path.join(repo,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(repo,p),s);
const gitHash=s=>createHash('sha1').update(`blob ${Buffer.byteLength(s)}\0`).update(s).digest('hex');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Integratieanker ontbreekt of is dubbel: '+a);return s.replace(a,b);};
const mainPath='tools/space-tent/app/ruimteklaar.tsx';let main=read(mainPath);
if(!main.includes('// ARENA-NATIVE-070')){
 assert.equal(gitHash(main),'f50ba926ca6b757278f6d9e2e555cf4526efaa46','Cursusbron veranderd; eerst vergelijken, niet blind vervangen.');
 main=once(main,"'use client';","'use client';\n// ARENA-NATIVE-070\nimport ArenaEntry from './arena/entry';");
 main=once(main,'export default function Ruimteklaar({local=false}:{local?:boolean}){',`export default function Ruimteklaar({local=false}:{local?:boolean}){
 const [arenaOpen,setArenaOpen]=useState(false),[arenaReturn,setArenaReturn]=useState(false);
 function arenaStudy(id:string){
  const selected=BANK.blocks.find(b=>b.id===id);
  if(!selected)return;
  setArenaOpen(false);setArenaReturn(true);start(selected);
 }
`);
 main=once(main," {(view==='route'||view==='level')&&<>",` {local&&<ArenaEntry open={arenaOpen} onClose={()=>setArenaOpen(false)} onStudy={arenaStudy}/>}
 {local&&(view==='route'||view==='level'||(arenaReturn&&view==='learn'))&&<section className="atelier-invite arena-launch no-print"><div><h2>{arenaReturn?'Terug naar je Tentamenarena?':'Tentamenarena'}</h2><p>Het tentamen uit 2018, een herkenbare Wisik-reconstructie en gerichte hersteltraining. Je bestaande levelresultaten blijven apart.</p></div><Button variant="outline" onClick={()=>setArenaOpen(true)}>{arenaReturn?'Terug naar mijn arena':'Open de Tentamenarena'}</Button></section>}
 {(view==='route'||view==='level')&&<>`);
 write(mainPath,main);
}
assert.ok(read(mainPath).includes("(arenaReturn&&view==='learn')"),'Arena-return mag geen hulpingang in zelfstandige checks toevoegen.');
const examPath='tools/space-tent/app/arena/exam-2018.ts';let exam=read(examPath);
exam=exam.replace(/^const cube=.* as const;\n/m,'');
exam=exam.replace('Voor de getoonde posities is het een vijfhoek; R ligt op een zijde van de grondvlakdoorsnede en hoeft geen hoekpunt te zijn.','Voor de getoonde posities is het een vijfhoek met hoekpunten op AB, op DC bij R, op DH, op HE bij P en op EF bij Q. R is hier een hoekpunt omdat het snijvlak ribbe DC raakt.');
exam=exam.replace('Ik werk de volledige gesloten doorsnede uit en herken dat R niet per se een hoekpunt is.','Ik werk de volledige gesloten doorsnede uit, met R als ribbesnijpunt op DC.');
write(examPath,exam);
const trainingPath='tools/space-tent/app/arena/training.ts';write(trainingPath,read(trainingPath).replace("'V = G·h/3.'","'V = G·h/3: neem de grondoppervlakte maal de loodrechte hoogte en deel dat door drie.'"));
const versionPath='tools/space-tent/app/version.ts',version=read(versionPath);assert.ok(["export const APP_VERSION='0.6.0';\n","export const APP_VERSION='0.7.0';\n"].includes(version));write(versionPath,"export const APP_VERSION='0.7.0';\n");
for(const file of ['tools/space-tent/space/index.html','tools/space-tent/review/index.html','public/assets/js/site-data.js','public/hbo/space-tent/index.html','public/backstage/space-tent/index.html','public/films/ruimteklaar/catalog.json'])write(file,read(file).replaceAll('0.6.0','0.7.0'));
for(const file of ['public/hbo/space-tent/index.html','public/backstage/space-tent/index.html']){
 let text=read(file);
 if(!text.includes('arena-native-description')){
 const note='<section class="section compact arena-native-description"><div class="content-card"><h2>Tentamenarena</h2><p>In Spacetent kun je het tentamen van 5 november 2018 digitaal bewerkt oefenen (18 deelopgaven) en een expliciete Wisik-reconstructie van de oefentoets bij hoofdstuk 9 en 10 (33 deelopgaven). De vragen en opnieuw getekende figuren zijn afdrukbaar, met of zonder uitwerkingen. Dit zijn tekstversies, geen facsimiles van de oorspronkelijke PDF’s.</p><p>Na zelfstandig werken op papier volgt zelfcontrole en een gerichte route naar bestaande lesblokken en 24 nieuwe herstelvragen. Aanvullingen en correcties worden zichtbaar vermeld. Er wordt geen officieel cijfer of automatische beheersingsstatus toegekend; de cursusvoortgang blijft apart.</p><p><a class="btn primary" href="/apps/ruimteklaar/">Open Spacetent en kies Tentamenarena</a></p></div></section>';
 text=once(text,'</main>',note+'</main>');write(file,text);
 }
}
const auditPath='scripts/audit-space-release.mjs';let audit=read(auditPath);
if(!audit.includes('// ARENA-NATIVE-070')){
 assert.equal(gitHash(audit),'25667b0a07755f42b696465bc88e5decc3e6722f','Bestaande vrijgavecontrole gewijzigd; eerst beoordelen.');
 audit=once(audit,'const report={',`// ARENA-NATIVE-070: evidence must belong to the exact native source and bundle.
const nativeArena=currentEvidence('validation/arena-native-070.json');
assert.deepEqual(nativeArena.environments,['chromium-desktop','chromium-mobile','chromium-narrow','webkit-desktop','webkit-mobile','webkit-narrow']);
assert.equal(nativeArena.exams,2);assert.equal(nativeArena.examQuestions,51);assert.equal(nativeArena.trainingQuestions,24);
assert.ok(nativeArena.results.length===6&&nativeArena.results.every(r=>r.status==='passed'&&r.reload&&r.coursePreserved&&r.lessonReturn&&r.originalParts===18&&r.reconstructedParts===33));
assert.deepEqual(nativeArena.sourceFiles,hashes(path.join(source,'app/arena')));
assert.deepEqual(nativeArena.publicFiles,hashes(path.join(root,'public/apps/ruimteklaar')));
const report={`);
 audit=once(audit,' shapeVariation,',' nativeArena,\n shapeVariation,');write(auditPath,audit);
}
console.log('Native Tentamenarena aangesloten op de gewone Spacetent-bron. De bestaande bouw- en vrijgavecontroles blijven verplicht.');
