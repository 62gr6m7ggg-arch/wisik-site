// Bounded delivery check only: no second audit after merge.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {changedPaths} from './classify-release-change.mjs';
const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const base=process.env.RELEASE_BEFORE_SHA || process.argv.find(a=>a.startsWith('--base='))?.slice(7);
const paths=changedPaths(base).filter(p=>p.startsWith('public/'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const origin=process.env.LIVE_ORIGIN || 'https://wisik.nl';
const attempts=6;
let pending=paths;
fs.mkdirSync('.release',{recursive:true});
const result={head:sha,origin,paths,verified:[],status:'waiting',failures:[]};
const save=()=>fs.writeFileSync('.release/publication.json',JSON.stringify(result,null,2)+'\n');save();
for(let attempt=1;attempt<=attempts && pending.length;attempt++) {
 const failed=[];
 // Small batches avoid flooding the origin or filling the execution context.
 for(let i=0;i<pending.length;i+=4) await Promise.all(pending.slice(i,i+4).map(async p=>{
  try {
   const route='/'+p.slice('public/'.length).replace(/index\.html$/,'');
   // These configuration files are consumed by Pages, not served as files.
   if (['public/_headers','public/_redirects','public/_routes.json'].includes(p)) {result.verified.push({path:p,check:'hosting configuration; checked by deployment'});return;}
   const response=await fetch(`${origin}${route}?wisik-release=${sha}`,{cache:'no-store',signal:AbortSignal.timeout(20000)});
   if(!fs.existsSync(p)) {if(response.status!==404) throw new Error(`verwijderd bestand retourneert ${response.status}`);}
   else {
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const actual=Buffer.from(await response.arrayBuffer());
    if(hash(actual)!==hash(fs.readFileSync(p))) throw new Error('productie bevat nog een andere versie');
   }
   result.verified.push({path:p,check:'SHA-256 / deletion'});
  } catch(e) {failed.push(p);result.failures.push({attempt,path:p,message:e.message});}
 }));
 pending=failed;result.pending=pending;result.attempt=attempt;save();console.log(`Publicatie ${sha.slice(0,8)}: ${paths.length-pending.length}/${paths.length} bestanden bevestigd (poging ${attempt}/${attempts}).`);
 if(pending.length && attempt<attempts) await new Promise(resolve=>setTimeout(resolve,10000));
}
result.status=pending.length?'delivery-unconfirmed':'published';result.pending=pending;result.finishedAt=new Date().toISOString();
fs.writeFileSync('.release/publication.json',JSON.stringify(result,null,2)+'\n');
if(pending.length){console.error(`Cloudflare-publicatie niet bevestigd voor ${pending.join(', ')}. Controleer de deployment; herhaal geen inhoudsaudit.`);process.exit(1);}
console.log(paths.length?'Publicatie bevestigd; geen herhaalde inhoudsaudit.':'Geen openbare bestanden gewijzigd; geen publicatiecontrole nodig.');
