/** Native production-bundle checks. Real origins and native Storage; no scoring mocks. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const course=path.resolve(here,'../..'),repo=path.resolve(course,'../..');
const out=path.join(course,'.arena-browser');fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.join(course,'app/tentamenarena/index.html'),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
const DATA=JSON.parse(html.match(/<script id="arena-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
assert.equal(DATA.version,'1.1.0');assert.equal(DATA.exam.length,18);assert.equal(DATA.reconstruction.length,33);assert.equal(DATA.training.length,24);
const manifest=JSON.parse(fs.readFileSync(path.join(here,'../bronbestanden/manifest.json'),'utf8'));
for(const d of manifest){assert.equal(hash(Buffer.from(DATA.documents[d.id].base64,'base64')),d.sha256);assert.equal(DATA.documents[d.id].pages.length,d.pages);}
const bank=[...JSON.parse(fs.readFileSync(path.join(course,'app/content.json'))).blocks,...JSON.parse(fs.readFileSync(path.join(course,'app/course-content.json'))).blocks];
for(const q of [...DATA.exam,...DATA.reconstruction,...DATA.training])assert.ok(bank.some(b=>b.id===q.blockId),'Unknown block '+q.blockId);
const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>Math.sqrt(dot(a,a)),distance=(a,b)=>norm(sub(a,b));
const normal=(a,b,c)=>cross(sub(b,a),sub(c,a));
const area=(a,b,c)=>norm(normal(a,b,c))/2;
const pp=(p,a,b,c)=>Math.abs(dot(sub(p,a),normal(a,b,c)))/norm(normal(a,b,c));
const close=(a,b,label)=>assert.ok(Math.abs(a-b)<1e-8,label+': '+a+' != '+b);
const degrees=x=>x*180/Math.PI;
const lineAngle=(u,v)=>degrees(Math.acos(Math.min(1,Math.abs(dot(u,v))/(norm(u)*norm(v)))));
const pts=n=>DATA.reconstructionGroups[String(n)].model.points;
{
 const p=pts(1);close(area(p.P,p.Q,p.R),24*Math.sqrt(3),'R1f area');
 for(const names of ['BFQ','BAR','GHR','BFP','DHP']){
  const lengths=[distance(p[names[0]],p[names[1]]),distance(p[names[1]],p[names[2]]),distance(p[names[0]],p[names[2]])].sort((a,b)=>a-b);
  [8,Math.sqrt(68),10].forEach((v,i)=>close(lengths[i],v,'R1b '+names));
 }
 const n=normal(p.P,p.Q,p.R);for(const v of [[2,0,8],[8,6,8],[0,6,0]])close(dot(sub(v,p.P),n),0,'R1e section edge');
}
{
 const p=pts(2);for(const a of 'ABCD')for(const b of 'ABCD')if(a<b)close(distance(p[a],p[b]),6,'R2 regular tetrahedron');
 const n=normal(p.A,p.D,p.M);close(norm(cross(n,sub(p.C,p.B))),0,'R2a perpendicular');
 close(distance([p.P[0],p.P[1],0],[p.Q[0],p.Q[1],0]),3,'R2d projection');
}
{
 const p=pts(3);close(area(p.E,p.B,p.G),3*Math.sqrt(29),'R3e corrected area');close(pp(p.F,p.E,p.B,p.G),12/Math.sqrt(29),'R3g corrected distance');
 close(Math.abs(dot(sub(p.G,p.E),normal(p.B,p.E,p.F)))/6,12,'R3f volume');
 assert.equal(Math.round(lineAngle(sub(p.P,p.B),sub(p.G,p.E))),68);
 assert.equal(Math.round(degrees(Math.atan(6/5))),50);
}
{
 const p=pts(4);close(pp(p.A,p.B,p.D,p.P),4/Math.sqrt(6),'R4d distance');close(dot(sub(p.D,p.C),sub(p.P,p.B)),0,'R4a');
}
{
 const p=pts(5);close(pp(p.H,p.C,p.M,p.N),Math.sqrt(3),'R5c');close(pp(p.C,p.F,p.D,p.L),2,'R5e');close(pp(p.A,p.B,p.E,p.L),2*Math.sqrt(3/7),'R5f');
 close(norm(cross(normal(p.A,p.F,p.H),normal(p.B,p.E,p.L))),0,'R5f parallel planes');
}
{
 const p=pts(6);close(p.E[2],Math.sqrt(12),'R6 height');close(distance(p.E,p.B),Math.sqrt(37),'R6f');
 close(lineAngle(normal(p.B,p.C,p.F),[0,0,1]),60,'R6b');
 close(lineAngle(sub(p.F,p.B),sub(p.E,p.D)),degrees(Math.acos(1/25)),'R6d acute angle');
}
const expected={'L2-1':5,'L2-4':6,'L3-1':42,'L3-2':240,'L3-3':5,'L4-2':degrees(Math.atan(3/4)),'L5-1':4.8,'L5-2':40,'L6-4':3};
for(const q of DATA.training)if(!q.options)close(q.answer,expected[q.id],'training '+q.id);
if(process.argv.includes('--math-only')){console.log('Payload, 75 lesson links and independent geometry/numeric checks passed.');process.exit(0);}
const live=process.env.ARENA_LIVE_URL;let server,base=live;
if(!base){
 const publicRoot=path.join(repo,'public'),headers=fs.readFileSync(path.join(publicRoot,'_headers'),'utf8');
 const globalPolicy=headers.match(/^  Content-Security-Policy: (.+)$/m)[1];
 assert.ok(headers.includes("! Content-Security-Policy"));
 const scoped=globalPolicy.replace("frame-src 'none'","frame-src 'self'");
 assert.ok(headers.includes('  Content-Security-Policy: '+scoped));
 const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.webp':'image/webp','.mp3':'audio/mpeg'};
 server=http.createServer((req,res)=>{
  try{const url=new URL(req.url,'http://localhost');let rel=decodeURIComponent(url.pathname);if(rel.endsWith('/'))rel+='index.html';const file=path.resolve(publicRoot,'.'+rel);if(!file.startsWith(publicRoot+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
   res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Security-Policy':url.pathname.startsWith('/apps/ruimteklaar/')?scoped:globalPolicy,'X-Frame-Options':'SAMEORIGIN','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
  }catch{res.writeHead(500);res.end();}
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
}
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const KEY='wisik.spacetent.tentamenarena.v1',COURSE_KEY='wisik.space-tent.progress.v1';
const seed={format:'wisik-space-tent-progress',version:1,curriculumContracts:1,events:[{id:'arena-preserve-paper-0001',at:1760000000000,type:'paper',payload:{checks:['figure'],source:'self-check'}}]};
const environments=['chromium-desktop','chromium-mobile','chromium-narrow','webkit-desktop','webkit-mobile','webkit-narrow'];
const results=[],errors=[];
async function act(scope,a,extra=''){
 const loc=scope.locator(`button[data-action="${a}"]${extra}`).first();
 if(!await loc.isVisible())await scope.locator('details').evaluateAll(els=>els.forEach(e=>e.open=true));
 await loc.click();return loc;
}
async function frameOf(page){const f=page.frameLocator('iframe[title^="Tentamenarena:"]');await f.locator('#pageTitle').waitFor();return f;}
const snapshot=page=>page.evaluate(k=>localStorage.getItem(k),COURSE_KEY);
async function openArena(page){await page.getByRole('button',{name:/Open de Tentamenarena|Terug naar mijn arena/}).click();return frameOf(page);}
async function closeArena(page){await page.getByRole('button',{name:'Terug naar waar ik aan het Spacen was ×',exact:true}).click();}
try{
 for(const environment of environments){
  const engine=environment.startsWith('webkit')?'webkit':'chromium',narrow=environment.endsWith('narrow'),mobile=narrow||environment.endsWith('mobile');
  const browser=await playwright[engine].launch();const context=await browser.newContext({viewport:{width:narrow?320:mobile?390:1440,height:mobile?844:1000},acceptDownloads:true});context.setDefaultTimeout(15000);
  const page=await context.newPage(),localErrors=[],writes=[];
  page.on('pageerror',e=>localErrors.push(String(e)));page.on('console',msg=>{if(msg.type()==='error'&&/Content Security Policy|Refused to frame|Refused to load/.test(msg.text()))localErrors.push(msg.text());});
  context.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
  await page.goto(base+'/apps/ruimteklaar/',{waitUntil:'networkidle'});
  await page.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:COURSE_KEY,value:seed});
  await page.reload({waitUntil:'networkidle'});const before=await snapshot(page);assert.ok(JSON.parse(before).events.length===1);
  let f=await openArena(page);assert.ok((await f.locator('#app').innerText()).includes('18 + 33'));
  assert.ok(await f.locator('html').evaluate(e=>e.scrollWidth<=innerWidth+1));
  await act(f,'archive');
  for(const d of manifest){
   await act(f,'doc',`[data-id="${d.id}"]`);await f.locator('#docBody img').waitFor();
   await f.locator('#docBody img').evaluate(img=>img.decode());
   for(let i=1;i<d.pages;i++){await act(f,'doc-next');await f.locator('#docBody img').evaluate(img=>img.decode());}
   assert.ok((await f.locator('#docPage').innerText()).endsWith(String(d.pages)));await act(f,'doc-close');
  }
  if(!mobile)for(const d of manifest){const promise=page.waitForEvent('download');await act(f,'download',`[data-id="${d.id}"]`);const download=await promise;const file=await download.path();assert.equal(hash(fs.readFileSync(file)),d.sha256);}
  await act(f,'home');await act(f,'setup');await act(f,'choose-exam','[data-id="2018"]');
  await f.locator('#paperReady').check();await act(f,'begin');assert.equal(await f.locator('[data-action="question"]').count(),18);
  for(let i=0;i<18;i++){await act(f,'question',`[data-index="${i}"]`);await f.locator('.exam-image').evaluate(img=>img.decode());assert.equal(await f.locator('[data-action="hint"]').count(),0);}
  await act(f,'question','[data-index="0"]');
  await f.locator('#examAnswer').fill('Mijn oude tentamen: <veilig> & eigen tekening.');await f.locator('#flagQuestion').check();
  await closeArena(page);assert.equal(await snapshot(page),before);await page.reload({waitUntil:'networkidle'});f=await openArena(page);
  assert.equal(await f.locator('#examAnswer').inputValue(),'Mijn oude tentamen: <veilig> & eigen tekening.');assert.ok(await f.locator('#flagQuestion').isChecked());
  await act(f,'home');assert.ok(await f.locator('[data-action="archive"]').isDisabled());assert.ok(await f.locator('[data-action="training"]').isDisabled());await act(f,'exam');
  await act(f,'finish');await act(f,'confirm-cancel');assert.equal(await f.locator('#examAnswer').getAttribute('readonly'),null);
  await act(f,'finish');await act(f,'confirm-ok');await act(f,'question','[data-index="0"]');await act(f,'rate','[data-value="0"]');
  await act(f,'repair');assert.ok((await f.locator('#app').innerText()).includes('17 deelopgaven niet beoordeeld'));
  await act(f,'lesson','[data-block="lines"]');await page.locator('iframe[title^="Tentamenarena:"]').waitFor({state:'detached'});
  assert.ok((await page.locator('main').innerText()).includes('Lijnen doorgronden'));assert.equal(await snapshot(page),before);
  f=await openArena(page);assert.ok((await f.locator('#app').innerText()).includes('Hier ligt je volgende leerwinst'));
  await act(f,'home');await act(f,'setup');await act(f,'choose-exam','[data-id="reconstructie"]');await f.locator('#paperReady').check();await act(f,'begin');
  if(await f.locator('#confirmDialog').evaluate(e=>e.open))await act(f,'confirm-ok');
  assert.equal(await f.locator('[data-action="question"]').count(),33);
  const covered=new Set();
  for(let i=0;i<DATA.reconstruction.length;i++){
   const q=DATA.reconstruction[i];await act(f,'question',`[data-index="${i}"]`);assert.ok((await f.locator('#app').innerText()).includes(q.prompt));
   assert.equal(await f.locator('[data-action="hint"]').count(),0);
   assert.ok(await f.locator('.reconstruction-figure svg').count()===1);assert.ok(await f.locator('html').evaluate(e=>e.scrollWidth<=innerWidth+1));
   if(!covered.has(q.group)){covered.add(q.group);await act(f,'rotate-model');await f.locator('.reconstruction-figure').screenshot({path:path.join(out,environment+'-figure-'+q.group+'.png')});}
  }
  await f.locator('#examAnswer').fill('Laatste reconstructievraag');await closeArena(page);await page.reload({waitUntil:'networkidle'});f=await openArena(page);
  assert.equal(await f.locator('#examAnswer').inputValue(),'Laatste reconstructievraag');
  await act(f,'finish');await act(f,'confirm-ok');await act(f,'question','[data-index="14"]');assert.ok((await f.locator('#app').innerText()).includes('16,16'));
  await act(f,'question','[data-index="16"]');assert.ok((await f.locator('#app').innerText()).includes('2,23'));
  await act(f,'rate','[data-value="1"]');await act(f,'repair');assert.ok((await f.locator('#app').innerText()).includes('32 deelopgaven niet beoordeeld'));
  await act(f,'training');
  for(const q of DATA.training){
   await act(f,'lesson-training',`[data-lesson="${q.lesson}"]`);await act(f,'train-select',`[data-id="${q.id}"]`);
   if(q.options)await f.locator(`input[name="trainChoice"][value="${q.answer}"]`).check();else await f.locator('#trainInput').fill(String(q.answer).replace('.',','));
   await act(f,'check-training');assert.ok((await f.locator('.feedback').innerText()).includes('Dit antwoord klopt.'));
   assert.ok(await f.locator('html').evaluate(e=>e.scrollWidth<=innerWidth+1));
  }
  await act(f,'lesson-training','[data-lesson="5"]');await act(f,'reset-training');await f.locator('#trainInput').fill('2');await act(f,'check-training');assert.ok((await f.locator('.feedback').innerText()).includes('nog niet'));
  await act(f,'hint','[data-stage="1"]');await f.locator('#trainInput').fill('24/5');await act(f,'check-training');assert.ok((await f.locator('.feedback').innerText()).includes('met hulp of na herhaling'));
  await act(f,'home');await f.locator('details').evaluateAll(es=>es.forEach(e=>e.open=true));
  const state=await page.evaluate(k=>localStorage.getItem(k),KEY);
  await f.locator('#importFile').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":999}')});
  await f.locator('#status').filter({hasText:'geen geldig'}).waitFor();assert.equal(await page.evaluate(k=>localStorage.getItem(k),KEY),state);
  const result={environment,status:'passed',reload:true,coursePreserved:true,lessonReturn:true,originalParts:18,reconstructedParts:33,training:24,figureGroups:covered.size,pdfReaders:4};
  assert.deepEqual(localErrors,[]);assert.deepEqual(writes,[]);assert.equal(await snapshot(page),before);
  await page.screenshot({path:path.join(out,environment+'-integrated.png'),fullPage:true});results.push(result);await context.close();await browser.close();
 }
 assert.equal(results.length,6);
}catch(e){errors.push(String(e.stack||e));throw e;}
finally{server?.close();const report={status:errors.length?'failed':'passed',version:'0.7.0',arenaVersion:'1.1.0',payloadSha256:hash(html),environments,results,errors,mode:live?'live native browser':'local production bundle with real origin and native Storage',limitations:['No physical iPhone test.','Paper work is self-assessed.']};fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');if(!live&&!errors.length){fs.mkdirSync(path.join(course,'validation'),{recursive:true});fs.writeFileSync(path.join(course,'validation/tentamenarena-110.json'),JSON.stringify(report,null,2)+'\n');}}
console.log('Native Tentamenarena checks passed in '+results.length+' environments.');
