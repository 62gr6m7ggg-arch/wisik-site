import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),source=path.join(root,'tools/space-tent'),reportPath=path.join(root,'public/assets/data/ruimteklaar-release-audit.json');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>e.name==='node_modules'||e.name.startsWith('.')||e.name.endsWith('.tsbuildinfo')?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const hashes=dir=>Object.fromEntries(walk(dir).map(file=>[path.relative(root,file).replaceAll(path.sep,'/'),hash(file)]));
const version=fs.readFileSync(path.join(source,'app/version.ts'),'utf8').match(/APP_VERSION='([^']+)'/)[1];
const bank=JSON.parse(fs.readFileSync(path.join(source,'app/content.json'),'utf8'));
const app=fs.readFileSync(path.join(root,'public/apps/ruimteklaar/index.html'),'utf8');
assert.ok(app.includes('Space-tent')&&app.includes(version));
for(const [,url] of app.matchAll(/(?:src|href)="(\/apps\/ruimteklaar\/[^"?]+)"/g))assert.ok(fs.existsSync(path.join(root,'public',url)),url);
assert.match(fs.readFileSync(path.join(source,'space/main.tsx'),'utf8'),/<Ruimteklaar local\s*\/>/,'Public entry must use local progress');
const runs=['check-learning.mjs','check-diagnostic.mjs','check-local-progress.mjs','check-interaction.cjs'].map(file=>({file,output:execFileSync(process.execPath,[path.join(source,'audit-runtime',file)],{cwd:source,encoding:'utf8',timeout:120000}).trim()}));
const report={product:'Space-tent · Ruimteklaar',appVersion:version,siteVersion:JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version,status:'passed',scope:{questions:bank.questions.length,theory:bank.blocks.reduce((n,b)=>n+b.theory.length,0),diagnosticRoutes:bank.blocks.length,constructionVariants:2,available:'Level 1 en constructieatelier; vervolglevels en toplevel nog niet beschikbaar'},checks:{diagnosticAnswerCombinations:144,questionCardStates:492,feedbackFigures:82,cameraMovements:140,projectedScenes:11480,externalIntersections:'beide varianten, vier schermbreedtes en drie kijkrichtingen',storage:'herladen, import/export, ontdubbeling, ongeldige bestanden, opslagfouten, nul netwerkaanroepen'},browser:{environment:'Chromium, eigen preview van dezelfde clientbron',verified:['Lijn QR tekenen en evenwijdige lijn door P toevoegen','Muisdrag verandert kijkrichting van hele constructie','Terug naar Construeren behoudt kijkrichting en maakt punten selecteerbaar','Standaardtekening herstelt oorspronkelijke projectie','Mobiel iframe 390×844: geen horizontale overloop, punt aantikken, rondkijkstand','Fout antwoord toont juiste antwoord in groen','Voortgang blijft na herladen beschikbaar, geen aanmelding nodig'],limitations:['Geen fysieke iPhone/Safari-test uitgevoerd','Aanraakcode gebruikt dezelfde Pointer Events; echte vingertest blijft nuttig','Geen empirische validering van leerwinst of diagnostische foutpositieven','Geen volledige tentamenvoorbereiding en geen geauthenticeerd toetsbewijs']},runs,sourceFiles:hashes(source),publicFiles:hashes(path.join(root,'public/apps/ruimteklaar'))};
if(process.argv.includes('--write')){fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');console.log('Space-tent controlebewijs vernieuwd.');}
else{assert.deepEqual(JSON.parse(fs.readFileSync(reportPath,'utf8')),report,'Space-tent bewijs is verouderd of controles zijn gewijzigd');console.log('Space-tent vrijgavecontrole geslaagd: meetkunde, 144 diagnosecombinaties, 492 kaarttoestanden, 11480 projecties, opslag en bron-/bundelbinding.');}
