// Eenmalige binaire transport-gate voor een goedgekeurd flirtpakket.
// Gebruik uitsluitend in een Work/checkout met echte Git-push-toegang.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const [code, packageDir, expectedSha] = process.argv.slice(2);
const fail = message => { console.error('FLIRT-TRANSPORT GEBLOKKEERD: '+message); process.exit(2); };
if (!/^[A-D]\d{2}$/.test(code||'')) fail('Gebruik: node scripts/publish-flirt-package.mjs A03 /pad/naar/uitgepakte-map [sha256]');
if (!packageDir || !fs.existsSync(path.join(packageDir,'flirt.mp4'))) fail('Geen lokaal toegankelijk MP4-bestand. Gebruik Work met bestandsupload of browserupload; geen Base64 via de chat.');
const movie=path.join(packageDir,'flirt.mp4');
const size=fs.statSync(movie).size;
if (size===0 || size>=24*1024*1024) fail('Film ontbreekt, is leeg of is >=24 MiB.');
for (const name of ['poster.jpg','captions.vtt','transcript.html','metadata.json','review.json'])
  if (!fs.existsSync(path.join(packageDir,name))) fail('Pakket onvolledig: '+name);
const hash=crypto.createHash('sha256').update(fs.readFileSync(movie)).digest('hex');
if (expectedSha && hash.toLowerCase()!==expectedSha.toLowerCase()) fail('SHA-256 wijkt af van goedgekeurde film.');
const run=(bin,args,opts={})=>execFileSync(bin,args,{encoding:'utf8',timeout:opts.timeout||20000,stdio:opts.stdio||'pipe'}).trim();
let branch, remote, main;
try {
 branch=run('git',['branch','--show-current']);
 remote=run('git',['remote','get-url','origin']);
 if (!remote) fail('Git-remote ontbreekt.');
 // Expliciete netwerk- en authenticatietest vóór enige filmcontrole of wijziging.
 main=run('git',['ls-remote','--heads','origin','main'],{timeout:20000}).split(/\s+/)[0];
 if (!/^[0-9a-f]{40}$/.test(main||'')) fail('GitHub main kon niet gelezen worden.');
} catch(error) { fail('Git-pushroute niet bruikbaar: '+(error.message||error)+'. Stop zonder herhaling van audits.'); }
if (!branch || branch==='main') fail('Gebruik een bestaande featurebranch, niet main.');
try {
 // Droogproef test óók de schrijfrechten, zonder wijzigingen te publiceren.
 run('git',['push','--dry-run','origin','HEAD:refs/heads/'+branch],{timeout:20000});
} catch(error) { fail('Git-push niet toegestaan of niet bereikbaar: '+(error.message||error)+'. Geen audits starten.'); }
if (run('git',['status','--porcelain'])) fail('Checkout heeft al wijzigingen; voorkom onbedoelde commits. Gebruik een schone checkout.');
console.log(JSON.stringify({phase:'transport-ready',code,branch,bytes:size,sha256:hash,base:main}));
try {
 run('npm',['run','flirt:replace','--',code,path.resolve(packageDir)],{timeout:120000});
 run('npm',['run','release:prepare','--','--base='+main],{timeout:240000});
 const paths=['public/films/rekenklaar/'+code+'/flirt.mp4','public/films/rekenklaar/'+code+'/poster.jpg','public/films/rekenklaar/'+code+'/captions.vtt','public/films/rekenklaar/'+code+'/transcript.html','public/assets/data/grabbelton-videos.json','public/assets/data/flirt-content-review.json'];
 run('git',['add','--',...paths]);
 if (!run('git',['diff','--cached','--name-only'])) { console.log('Geen wijzigingen: pakket staat al op branch.'); process.exit(0); }
 run('git',['commit','-m',code+': plaats goedgekeurd binair flirtpakket'],{timeout:30000});
 run('git',['push','origin','HEAD:refs/heads/'+branch],{timeout:120000});
 console.log(JSON.stringify({phase:'pushed',branch,commit:run('git',['rev-parse','HEAD']),sha256:hash,next:'Bestaande PR hervatten of één PR openen; één CI-check; merge; Cloudflare aflevering.'}));
} catch(error) {
 console.error('FLIRT-PUBLICATIE GESTOPT: '+(error.message||error));
 console.error('Controleer alleen de falende stap; geen nieuwe branch, geen brede audit, geen automatische herpoging.');
 process.exit(1);
}
