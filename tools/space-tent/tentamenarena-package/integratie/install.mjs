/** Install only in a separate work branch. Does not build, commit, push or publish.
 * node integratie/install.mjs /path/to/wisik-site [--apply]
 * Default: dry-run. Fails closed if the observed source changed.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const here=path.dirname(fileURLToPath(import.meta.url));
const packageRoot=path.resolve(here,'..');
const target=process.argv[2];
if(!target||target.startsWith('--'))throw Error('Geef de root van een lokale wisik-site work-branch.');
const repo=path.resolve(target),app=path.join(repo,'tools/space-tent/app');
const mainPath=path.join(app,'ruimteklaar.tsx'),buildPath=path.join(repo,'tools/space-tent/scripts/build-space.mjs');
const payloadPath=path.join(packageRoot,'Spacetent_Tentamenarena_1.0.html');
const payload=fs.readFileSync(payloadPath,'utf8');
const match=payload.match(/<script id="arena-data" type="application\/json">([\s\S]*?)<\/script>/);
if(!match)throw Error('De complete arena-payload met bronbestanden ontbreekt.');
const content=JSON.parse(match[1]);
if(content.exam?.length!==18||content.training?.length!==24)throw Error('Onverwachte arena-inhoud.');
const manifest=JSON.parse(fs.readFileSync(path.join(packageRoot,'bronbestanden/manifest.json'),'utf8'));
for(const item of manifest){
 const encoded=content.documents?.[item.id]?.base64;
 if(!encoded)throw Error(`Bron ontbreekt: ${item.id}`);
 const hash=createHash('sha256').update(Buffer.from(encoded,'base64')).digest('hex');
 if(hash!==item.sha256)throw Error(`Bron-checksum wijkt af: ${item.id}`);
}
let source=fs.readFileSync(mainPath,'utf8'),build=fs.readFileSync(buildPath,'utf8');
const gitHash=s=>createHash('sha1').update(`blob ${Buffer.byteLength(s)}\0`).update(s).digest('hex');
if(source.includes('// TENTAMENARENA-INTEGRATION-1'))throw Error('Integratie is al aanwezig; pas deze niet nogmaals toe.');
if(gitHash(source)!=='f50ba926ca6b757278f6d9e2e555cf4526efaa46')throw Error('De Spacetent-bron is sinds de controle gewijzigd. Vergelijk eerst de wijzigingen; niet blind overschrijven.');
if(gitHash(build)!=='10eaf805b99803207cc816ad0cb08f85d7732609')throw Error('De buildprocedure is gewijzigd; eerst opnieuw beoordelen.');
function replaceOnce(text,needle,replacement){if(text.split(needle).length!==2)throw Error('Integratieanker is niet uniek: '+needle);return text.replace(needle,replacement);}
source=replaceOnce(source,"'use client';","'use client';\n// TENTAMENARENA-INTEGRATION-1\nimport ArenaOverlay from './arena-overlay';");
source=replaceOnce(source,"export default function Ruimteklaar({local=false}:{local?:boolean}){",`export default function Ruimteklaar({local=false}:{local?:boolean}){
 const [arenaOpen,setArenaOpen]=useState(false),[arenaReturn,setArenaReturn]=useState(false);
 function arenaLesson(level:number,terms:string[]){
  if(!Number.isInteger(level)||level<1||level>6)return;
  const candidates=blocksForLevel(level);
  const score=(b:Block)=>terms.filter(term=>b.title.toLocaleLowerCase('nl').includes(term.toLocaleLowerCase('nl'))).length;
  const selected=[...candidates].sort((a,b)=>score(b)-score(a))[0];
  if(!selected)return;
  setArenaOpen(false);setArenaReturn(true);setFreeEntry(true);start(selected);
 }
`);
source=replaceOnce(source," {(view==='route'||view==='level')&&<>",` {local&&<ArenaOverlay open={arenaOpen} onClose={()=>setArenaOpen(false)} onLesson={arenaLesson}/>}
 {local&&(view==='route'||view==='level'||arenaReturn)&&<section className="atelier-invite no-print"><div><h2>{arenaReturn?'Terug naar je Tentamenarena?':'Tentamenarena'}</h2><p>Originele opgaven, zelfstandig proberen en een gerichte herstelroute. Je bestaande levelresultaten blijven apart.</p></div><Button variant="outline" onClick={()=>setArenaOpen(true)}>{arenaReturn?'Terug naar mijn arena':'Open de Tentamenarena'}</Button></section>}
 {(view==='route'||view==='level')&&<>`);
build+="\n// TENTAMENARENA-INTEGRATION-1: keep arena payload through future course builds.\nconst fs=await import('node:fs');\nconst arena=path.join(root,'app/tentamenarena/index.html');\nif(!fs.existsSync(arena))throw new Error('Complete Tentamenarena-payload ontbreekt; release gestopt.');\nfs.mkdirSync(path.join(root,'.space-dist/tentamenarena'),{recursive:true});\nfs.copyFileSync(arena,path.join(root,'.space-dist/tentamenarena/index.html'));\n";
const outputs=[
 [mainPath,source],[buildPath,build],
 [path.join(app,'arena-overlay.tsx'),fs.readFileSync(path.join(here,'arena-overlay.tsx'),'utf8')],
 [path.join(app,'tentamenarena/index.html'),payload]
];
for(const [name] of outputs)console.log(path.relative(repo,name));
if(process.argv.includes('--apply')){
 for(const [name,text] of outputs){fs.mkdirSync(path.dirname(name),{recursive:true});fs.writeFileSync(name,text);}
 console.log('Integratie geplaatst in de lokale werkmap. Nog NIET gebouwd, getest, gecommit of gepubliceerd.');
}else console.log('Dry-run geslaagd; geen bestanden gewijzigd. Gebruik --apply pas op de work-branch.');
