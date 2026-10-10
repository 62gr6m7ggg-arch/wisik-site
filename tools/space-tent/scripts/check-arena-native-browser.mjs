import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
const course=process.cwd(),root=path.resolve(course,'../..'),publicDir=path.join(root,'public');
const out=path.join(course,'.arena-browser');fs.mkdirSync(out,{recursive:true});
await build({stdin:{contents:"export * from './app/arena/core';export {BANK} from './app/model';",resolveDir:course},bundle:true,platform:'node',format:'esm',outfile:path.join(out,'test-data.mjs')});
const M=await import(pathToFileURL(path.join(out,'test-data.mjs')).href);
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.webmanifest':'application/manifest+json','.mp3':'audio/mpeg','.woff2':'font/woff2'};
const policy=fs.readFileSync(path.join(publicDir,'_headers'),'utf8').match(/^  Content-Security-Policy: (.+)$/m)[1];
assert.ok(policy.includes("frame-src 'none'"),'Native arena must not relax the global iframe policy');
let server;let base=process.env.ARENA_LIVE_URL;
if(!base){server=http.createServer((req,res)=>{try{const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname),p=path.resolve(publicDir,'.'+name+(name.endsWith('/')?'index.html':''));if(!p.startsWith(publicDir+path.sep)){res.writeHead(403);res.end();return;}if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream','Content-Security-Policy':policy,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});fs.createReadStream(p).pipe(res);}catch{res.writeHead(400);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;}
const environments=[['chromium-desktop',chromium,1280,900],['chromium-mobile',chromium,390,844],['chromium-narrow',chromium,320,700],['webkit-desktop',webkit,1280,900],['webkit-mobile',webkit,390,844],['webkit-narrow',webkit,320,700]];
const results=[],errors=[];let assertions=0;
const ok=(x,m)=>{assert.ok(x,m);assertions++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);assertions++;};
const courseKey='wisik.space-tent.progress.v1';
const seed=JSON.stringify({format:'wisik-space-tent-progress',version:1,curriculumContracts:1,events:[{id:'arena-course-preserved-00001',at:100000,type:'answer',payload:{questionId:'p1',answer:['c'],helped:false,context:'practice',sessionId:'arena-course-session-01',correct:true}}]});
async function run(environment,engine,width,height){
 const browser=await engine.launch({headless:true}),context=await browser.newContext({viewport:{width,height},acceptDownloads:true});
 await context.addInitScript(({key,seed})=>{if(localStorage.getItem(key)===null)localStorage.setItem(key,seed);},{key:courseKey,seed});
 const page=await context.newPage(),jsErrors=[],writes=[];page.setDefaultTimeout(15000);page.on('pageerror',e=>jsErrors.push(String(e)));page.on('dialog',d=>d.accept());page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
 const dialog=()=>page.locator('.arena-shell[open]');
 const btn=name=>dialog().getByRole('button',{name,exact:true});
 async function open(){await page.getByRole('button',{name:/^(Open de Tentamenarena|Terug naar mijn arena)$/}).click();await dialog().waitFor({state:'visible'});await dialog().locator('.arena-scroll h1').first().waitFor();}
 async function home(){if(await dialog().getByRole('button',{name:'← Tentamenarena',exact:true}).count())await btn('← Tentamenarena').click();}
 async function overflow(){const x=await dialog().locator('.arena-scroll').evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth}));ok(x.scroll<=x.client+2,environment+' no horizontal scroll '+JSON.stringify(x));}
 try{
  await page.goto(base+'/apps/ruimteklaar/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Open de Tentamenarena',exact:true}).waitFor();
  const original=await page.evaluate(k=>localStorage.getItem(k),courseKey);ok(original&&JSON.parse(original).events.length===1,'existing course progress loaded');
  await open();await overflow();await dialog().screenshot({path:path.join(out,environment+'-home.png')});
  await page.keyboard.press('Escape');eq(await dialog().count(),0,'native escape closes arena');await open();
  for(const source of M.EXAMS){
   await home();await btn('Kies mijn oefentoets').click();await dialog().getByRole('button',{name:new RegExp('^'+source.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).click();await btn('Start zelfstandige poging').click();
   eq(await dialog().locator('.arena-question-nav button').count(),source.questions.length,'all original/reconstructed parts');eq(await dialog().locator('.arena-solution').count(),0,'no answers during attempt');
   await dialog().locator('#arena-note').fill('Bewaar deze notitie <b>als tekst</b>: '+source.id);await btn('Markeer voor later').click();
   const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),M.KEY);await page.reload({waitUntil:'networkidle'});await open();
   eq(await dialog().locator('#arena-note').inputValue(),'Bewaar deze notitie <b>als tekst</b>: '+source.id,'real reload retains draft');ok(await btn('Markering verwijderen').count()===1);
   const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),M.KEY);eq(after.session.start,before.session.start,'timer start retained');
   await home();ok(await btn('Bekijk het materiaal').isDisabled(),'archive unavailable during active attempt');ok(await btn('Verken de training').isDisabled(),'training unavailable during active attempt');await btn('Verder met mijn poging').click();
   for(let i=0;i<source.questions.length;i++){
    const q=source.questions[i];await dialog().getByRole('button',{name:new RegExp('^Deelopgave '+q.label+'(?:,|$)')}).click();ok((await dialog().locator('h1').innerText()).includes(q.label+'.'),'part '+q.id+' reachable');eq(await dialog().locator('.arena-solution').count(),0);
    if(i===0||q.label==='3a'||q.label==='4c'||q.label==='5f'){await overflow();await dialog().locator('.arena-figure').screenshot({path:path.join(out,environment+'-'+source.id+'-'+q.label+'.png')});}
   }
   await btn('Afronden en nakijken').first().click();await dialog().getByRole('heading',{name:'Wisik-uitwerking',exact:true}).waitFor();
   for(let i=0;i<source.questions.length;i++){
    const q=source.questions[i];await dialog().getByRole('button',{name:new RegExp('^Deelopgave '+q.label+'(?:,|$)')}).click();const text=await dialog().locator('.arena-solution').innerText();ok(text.includes(q.answer),'complete answer '+q.id);if(q.editorial)ok(text.includes(q.editorial),'editorial correction '+q.id);eq(await dialog().locator('.arena-solution input[type=checkbox]').count(),3);
    if(i===0)await dialog().getByRole('radio',{name:'Deels of onzeker',exact:true}).check();if(i===1)await dialog().getByRole('radio',{name:'Zelfstandig gelukt',exact:true}).check();
   }
   await btn('Mijn herstelroute').click();ok((await dialog().innerText()).includes((source.questions.length-2)+' deelopgaven zijn nog niet beoordeeld'),'unrated not wrong');
   const blockId=source.questions[0].blockId,blockTitle=M.BANK.blocks.find(b=>b.id===blockId).title;
   await btn('Open dit lesblok').first().click();eq(await dialog().count(),0,'lesson callback closes arena');await page.locator('#root').getByText(blockTitle,{exact:true}).first().waitFor();await open();ok((await dialog().innerText()).includes('Jouw herstelroute'),'return retains arena location');
  }
  await home();await btn('Bekijk het materiaal').click();for(const source of M.EXAMS){await btn(source.title).click();eq(await dialog().locator('.arena-archive-question').count(),source.questions.length);eq(await dialog().locator('.arena-figure').count(),Object.keys(source.groups).length);await overflow();}
  await page.evaluate(()=>{window.print=()=>{};});await btn('Afdrukken: alleen opgaven').click();await page.locator('.arena-print-root').waitFor({state:'attached'});await page.waitForFunction(()=>document.body.classList.contains('arena-printing'));
  eq(await page.locator('.arena-print-root .arena-print-question').count(),33);ok(!(await page.locator('.arena-print-root').textContent()).includes('Wisik-uitwerking.'));
  await page.emulateMedia({media:'print'});ok(await page.locator('.arena-print-root').isVisible());ok(!(await page.locator('#root').isVisible()));
  if(environment==='chromium-desktop')await page.pdf({path:path.join(out,'reconstructie-opgaven.pdf'),format:'A4',printBackground:true});
  await page.emulateMedia({media:'screen'});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await page.locator('.arena-print-root').waitFor({state:'detached'});
  await btn('Afdrukken: met uitwerkingen').click();await page.locator('.arena-print-root').waitFor({state:'attached'});await page.waitForFunction(()=>document.body.classList.contains('arena-printing'));ok((await page.locator('.arena-print-root').textContent()).includes('Wisik-uitwerking.'));await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await page.locator('.arena-print-root').waitFor({state:'detached'});
  await home();await btn('Mijn herstelroute').click();await btn('Alle herstelvragen').click();
  for(const q of M.TRAINING){
   await btn('Onderwerp '+q.lesson).click();await btn(q.id).click();await btn('Controleer mijn antwoord').click();ok((await dialog().innerText()).includes('Vul eerst een geldig antwoord'),'empty not graded');
   if(q.id==='L1-1'){await dialog().getByRole('radio',{name:q.options[0],exact:true}).check();await btn('Controleer mijn antwoord').click();ok((await dialog().innerText()).includes('Nog niet juist'));}if(q.id==='L2-1')await btn('Een aanwijzing').click();
   if(q.options)await dialog().getByRole('radio',{name:q.options[q.answer],exact:true}).check();else await dialog().getByRole('textbox',{name:'Antwoord herstelvraag',exact:true}).fill(q.id==='L4-2'?'36,9':String(q.answer).replace('.',','));
   await btn('Controleer mijn antwoord').click();ok((await dialog().innerText()).includes(q.explanation),'training explanation '+q.id);ok((await dialog().innerText()).includes('Strategie.'),'explicit strategy');
   const expected=q.id==='L1-1'||q.id==='L2-1'?'Goed na hulp of herhaling.':'Direct zelfstandig goed.';ok((await dialog().innerText()).includes(expected),'independence distinction '+q.id);await overflow();
  }
  await page.reload({waitUntil:'networkidle'});await open();ok((await dialog().innerText()).includes('Direct zelfstandig goed.'),'real training persistence');
  await home();await dialog().locator('summary').filter({hasText:'Voortgang meenemen'}).click();
  const pending=page.waitForEvent('download');await btn('Arena-voortgang downloaden').click();const dl=await pending;const downloaded=fs.readFileSync(await dl.path(),'utf8');const snapshot=M.parse(downloaded);eq(Object.keys(snapshot.training).length,24);
  await dialog().locator('input[type=file]').setInputFiles({name:'arena.json',mimeType:'application/json',buffer:Buffer.from(downloaded)});await dialog().getByText('Arena-voortgang geïmporteerd. Je bestaande cursusresultaten zijn niet gewijzigd.',{exact:true}).waitFor();ok((await dialog().innerText()).includes('Arena-voortgang geïmporteerd'));
  await dialog().locator('input[type=file]').setInputFiles({name:'ongeldig.json',mimeType:'application/json',buffer:Buffer.from('{')});await dialog().getByText('Dit is geen leesbaar JSON-bestand. Er is niets vervangen.',{exact:true}).waitFor();ok((await dialog().innerText()).includes('geen leesbaar JSON'));
  eq(await page.evaluate(k=>localStorage.getItem(k),courseKey),original,'existing course bytes preserved');
  const other=await context.newPage();await other.goto(base+'/apps/ruimteklaar/',{waitUntil:'networkidle'});await other.getByRole('button',{name:'Open de Tentamenarena',exact:true}).click();await other.locator('.arena-shell[open]').waitFor();
  await btn('Bekijk het materiaal').click();await other.locator('.arena-shell').getByText(/Een ander tabblad heeft/).first().waitFor();eq(await page.evaluate(k=>localStorage.getItem(k),courseKey),original);await other.close();
  await btn('Terug naar waar ik aan het Spacen was ×').click();await page.evaluate(k=>localStorage.setItem(k,'{broken'),M.KEY);await page.reload({waitUntil:'networkidle'});await open();ok((await dialog().innerText()).includes('niet leesbaar'));eq(await page.evaluate(k=>localStorage.getItem(k),M.KEY),'{broken');eq(await page.evaluate(k=>localStorage.getItem(k),courseKey),original);
  eq(jsErrors,[],'no JavaScript exceptions');eq(writes,[],'no learner data sent to a server');
  const result={environment,status:'passed',reload:true,coursePreserved:true,lessonReturn:true,originalParts:18,reconstructedParts:33,training:24,print:true,importExport:true,crossTab:true,corruptPreserved:true};results.push(result);console.log(JSON.stringify(result));
 }catch(e){await page.screenshot({path:path.join(out,environment+'-FAILED.png'),fullPage:true}).catch(()=>{});fs.writeFileSync(path.join(out,environment+'-FAILED.txt'),String(e.stack||e)+'\n'+await page.locator('body').innerText().catch(()=>''));errors.push(environment+': '+String(e));throw e;}
 finally{await context.close();await browser.close();}
}
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const hashes=d=>Object.fromEntries(walk(d).map(f=>[path.relative(root,f).replaceAll(path.sep,'/'),createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
try{for(const args of environments)await run(...args);}finally{
 const report={status:errors.length?'failed':'passed',version:'0.7.0',exams:2,examQuestions:51,trainingQuestions:24,environments:environments.map(x=>x[0]),assertions,results,errors,sourceFiles:hashes(path.join(course,'app/arena')),publicFiles:hashes(path.join(publicDir,'apps/ruimteklaar')),live:!!process.env.ARENA_LIVE_URL,limitations:['Geen fysieke iPhone/Safari-test; WebKit is een browserengine-test.','Tekeningen en redeneringen berusten op zelfbeoordeling.','Afdrukken is via browser-PDF; oorspronkelijke PDF-facsimiles zijn niet gehost.']};fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));if(!errors.length&&results.length===6&&!process.env.ARENA_LIVE_URL)fs.writeFileSync('validation/arena-native-070.json',JSON.stringify(report,null,2)+'\n');if(server)await new Promise(r=>server.close(r));
}
console.log('Native arena browser checks passed in six environments; '+assertions+' assertions.');
