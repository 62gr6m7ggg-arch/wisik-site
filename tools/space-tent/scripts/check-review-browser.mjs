import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {handleReview,REVIEW_ROOT as R} from '../../../server/ruimteklaar-test-auth.mjs';
import {assets} from '../../../server/ruimteklaar-test-assets.mjs';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=process.cwd(),repo=path.resolve(root,'../..'),out=path.join(root,'.review-browser');fs.mkdirSync(out,{recursive:true});
execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-subj','/CN=localhost','-keyout',path.join(out,'key.pem'),'-out',path.join(out,'cert.pem')],{stdio:'ignore'});
const env={};
let now=Date.now();
const server=https.createServer({key:fs.readFileSync(path.join(out,'key.pem')),cert:fs.readFileSync(path.join(out,'cert.pem'))},async(req,res)=>{
 try{const origin='https://'+req.headers.host,url=new URL(req.url,origin);let response;
 if(url.pathname===R.slice(0,-1)||url.pathname.startsWith(R)){
  const chunks=[];for await(const c of req)chunks.push(c);
  response=await handleReview(new Request(url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)}),env,assets,()=>now);
 }else{
  let file=path.resolve(repo,'public','.'+decodeURIComponent(url.pathname));if(!file.startsWith(path.join(repo,'public')+path.sep))throw new Error('outside public');if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  response=fs.existsSync(file)?new Response(fs.readFileSync(file),{headers:{'Content-Type':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html'}}):new Response('Not found',{status:404});
 }
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){res.writeHead(500);res.end('Test adapter error: '+e.message)}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='https://127.0.0.1:'+server.address().port;
const d=JSON.parse(fs.readFileSync('app/content.json')),c=JSON.parse(fs.readFileSync('app/course-content.json')),questions=[...d.questions,...c.questions],blocks=[...d.blocks,...c.blocks],tasks=JSON.parse(fs.readFileSync('app/construction-tasks.json')).tasks,checks={'1':d.checkpointIds,...c.checks};
const ids=[...questions.map(q=>'vraag:'+q.id),...tasks.map(t=>'constructie:'+t.id),'atelier:doorsnede',...blocks.map(b=>'blok:'+b.id),...Object.keys(checks).map(k=>'check:'+k),...['1',...Object.keys(c.papers)].map(k=>'papier:'+k)];
const results=[],errors=[];let browser;
try{
for(const config of [{name:'chromium-desktop',engine:chromium,width:1280,height:900,mobile:false},{name:'chromium-mobile',engine:chromium,width:390,height:844,mobile:true},{name:'webkit-mobile',engine:webkit,width:390,height:844,mobile:true}]){
 browser=await config.engine.launch({headless:true});const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:config.width,height:config.height},isMobile:config.mobile,hasTouch:config.mobile});const page=await context.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(config.name+': '+e.message));const requests=[];page.on('request',r=>requests.push({method:r.method(),url:r.url()}));
 await page.goto(base+R);await page.getByLabel('Wachtwoord',{exact:true}).waitFor();
 assert.equal(await page.locator('input:visible').count(),1);assert.equal(await page.getByRole('button').count(),0);assert.equal(await page.innerText('body'),'');
 assert.doesNotMatch(await page.content(),/priem|factor|ontbind|exponent|rekensom|voorbeeld|placeholder=/i);
 await page.screenshot({path:path.join(out,config.name+'-login.png'),fullPage:true});
 const js=Object.keys(assets).find(k=>k.endsWith('.js'));assert.equal((await context.request.get(base+R+js)).status(),401);
 await page.getByLabel('Wachtwoord',{exact:true}).fill('12 4 3');await page.getByLabel('Wachtwoord',{exact:true}).press('Enter');await page.locator('input[aria-invalid=true]').waitFor();assert.equal(await page.locator('[data-review-mode]').count(),0);
 assert.doesNotMatch(await page.content(),/priem|factor|ontbind|exponent|rekensom|voorbeeld/i);
 const credential=config.name==='chromium-desktop'?'12 2 2 3':config.name==='chromium-mobile'?'72 2^3 3^2':'360 2³ 3² 5';
 await page.getByLabel('Wachtwoord',{exact:true}).fill(credential);await page.getByLabel('Wachtwoord',{exact:true}).press('Enter');await page.locator('[data-review-mode=true]').waitFor();
 await page.evaluate(()=>{localStorage.setItem('review-learner-sentinel','unchanged-existing-progress');sessionStorage.setItem('review-tab-sentinel','unchanged-existing-context');window.__reviewSnapshot={local:{...localStorage},session:{...sessionStorage}}});
 assert.ok(!(await page.evaluate(()=>document.cookie)).includes('__Host-wisik-ruimteklaar-test'),'Session cookie must be HttpOnly');
 const snapshot=await page.evaluate(()=>window.__reviewSnapshot);
 const jump=async id=>{await page.getByLabel('Kies een onderdeel',{exact:true}).selectOption(id);await page.locator('[data-review-code="'+id.slice(id.indexOf(':')+1)+'"]').waitFor()};
 // Every item must be directly reachable without route progression or a prior answer.
 for(const id of ids){await jump(id);assert.equal(await page.locator('.review-live-component').count(),1);assert.equal(await page.locator('.review-answer').count(),0);if(id.startsWith('vraag:'))assert.equal(await page.locator('.question-prompt').count(),1);}
 await jump('vraag:'+questions[0].id);await page.getByRole('button',{name:'Volgende / overslaan',exact:false}).click();assert.equal(await page.locator('[data-review-code]').getAttribute('data-review-code'),questions[1].id);await page.getByRole('button',{name:'← Vorige',exact:true}).click();assert.equal(await page.locator('[data-review-code]').getAttribute('data-review-code'),questions[0].id);
 await page.getByLabel('Les of level').selectOption('7');await page.getByLabel('Soort onderdeel').selectOption('question');assert.equal(await page.getByLabel('Kies een onderdeel').locator('option').count(),checks['7a'].length+checks['7b'].length+1);await page.getByLabel('Vraagfunctie').selectOption('Eindproef B');assert.equal(await page.getByLabel('Kies een onderdeel').locator('option').count(),checks['7b'].length+1);await page.getByRole('button',{name:'Filters wissen',exact:true}).click();
 await page.getByRole('searchbox').fill('l7b-14');assert.equal(await page.getByLabel('Kies een onderdeel').locator('option').count(),2);await page.getByLabel('Kies een onderdeel').selectOption('vraag:l7b-14');await page.getByRole('button',{name:'Filters wissen',exact:true}).click();
 // Same question component, original feedback rules; explicit assessor reveal is separate.
 for(const type of ['numeric','choice','points']){
  const q=questions.find(q=>q.type===type);await jump('vraag:'+q.id);
  await page.getByRole('button',{name:'Toon antwoord en uitwerking',exact:true}).click();await page.getByLabel('Beoordelaarsuitwerking',{exact:true}).waitFor();await page.getByRole('button',{name:'Verberg antwoord en uitwerking',exact:true}).click();
  if(q.type==='numeric')await page.getByLabel('Jouw berekende uitkomst',{exact:true}).fill(q.answer[0]);
  if(q.type==='choice'){const text=q.options.find(o=>o.id===q.answer[0]).text;await page.locator('.answer-area .answer-option').filter({hasText:text}).first().click()}
  if(q.type==='points')for(const p of (q.acceptAny||q.answer).slice(0,q.selectCount||q.answer.length))await page.locator('.answer-area .point-tray').getByRole('button',{name:p,exact:true}).click();
  if(q.working)await page.getByLabel('Jouw aanpak en berekening').fill('Controle van de bestaande antwoordbediening.');
  await page.getByRole('button',{name:'Antwoord vastleggen',exact:false}).click();await page.locator('.feedback-panel').waitFor();await page.getByRole('button',{name:'Opnieuw testen',exact:true}).click();assert.equal(await page.locator('.feedback-panel').count(),0);
 }
 await jump('vraag:l7b-14');assert.equal(await page.getByRole('button',{name:'Aanwijzing',exact:true}).count(),0,'A check retains its no-hint presentation');
 // Lookup uses the same overlay in reviewer mode, without touching learner data.
 const lookup=async()=>{const expected=await page.getByLabel('Kies een onderdeel',{exact:true}).inputValue();await page.getByRole('button',{name:'Vraagbaak A–Z',exact:true}).click();assert.equal(await page.evaluate(()=>decodeURIComponent(location.hash.slice(1))),expected,'Active reviewer URL is synchronized before lookup');await page.getByLabel('Zoek een begrip',{exact:true}).fill('loodvoet');await page.locator('[data-entry=loodvoet]').click();await page.locator('.knowledge-entry-title').waitFor();await page.getByRole('button',{name:'terug naar waar ik aan het Spacen was',exact:true}).click();await page.locator('.knowledge-dialog').waitFor({state:'hidden'});await page.waitForFunction(()=>!history.state?.spaceKnowledge);assert.equal(await page.getByLabel('Kies een onderdeel',{exact:true}).inputValue(),expected,'Lookup returns to the same reviewer entry')};
 const numeric=questions.find(q=>q.type==='numeric');await jump('vraag:'+numeric.id);await page.getByLabel('Jouw berekende uitkomst',{exact:true}).fill('1,2');await lookup();assert.equal(await page.getByLabel('Jouw berekende uitkomst',{exact:true}).inputValue(),'1,2');assert.equal(await page.locator('[data-review-code]').getAttribute('data-review-code'),numeric.id);
 await jump('constructie:'+tasks[0].id);const pair=tasks[0].edges[0];for(const p of pair){const btn=page.locator('.selection-controls .point-tray').getByRole('button',{name:p,exact:true});if(config.mobile)await btn.tap();else await btn.click()};assert.equal(await page.locator('.drawing-panel .drawn-line').count(),0);await page.locator('[data-action=extend]').click();await page.waitForFunction(()=>document.querySelectorAll('.drawing-panel .drawn-line').length===1);await page.locator('.drawing-footer button').click();await page.waitForFunction(()=>document.querySelectorAll('.drawing-panel .drawn-line').length===0);
 await lookup();assert.equal(await page.locator('[data-review-code]').getAttribute('data-review-code'),tasks[0].id);
 const link=await page.getByRole('link',{name:'Meld probleem via Kladblok',exact:false}).getAttribute('href');assert.ok(new URL(link).searchParams.get('bron').includes(encodeURIComponent('constructie:'+tasks[0].id)));assert.equal(new URL(link).pathname,'/kladblok/');assert.ok(!link.includes('password'));
 assert.deepEqual(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}})),snapshot,'Test mode must not write learner or session storage');assert.equal(requests.filter(r=>r.url.includes('/api/progress')).length,0);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');await page.screenshot({path:path.join(out,config.name+'.png'),fullPage:true});
 await page.waitForFunction(id=>decodeURIComponent(location.hash.slice(1))===id,'constructie:'+tasks[0].id);
 // Deep link after reload selects the item but carries no test attempts over.
 await page.reload();await page.locator('[data-review-mode=true]').waitFor();assert.equal(await page.locator('[data-review-code]').getAttribute('data-review-code'),tasks[0].id);assert.equal(await page.locator('.drawing-panel .drawn-line').count(),0);
 await page.getByRole('button',{name:'Uitloggen',exact:true}).click();await page.getByLabel('Wachtwoord',{exact:true}).waitFor();assert.equal((await context.request.get(base+R+js)).status(),401);
 await page.getByLabel('Wachtwoord',{exact:true}).fill('360 2^3 3² 5');await page.getByLabel('Wachtwoord',{exact:true}).press('Enter');await page.locator('[data-review-mode=true]').waitFor();
 now+=3601000;await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.getByLabel('Wachtwoord',{exact:true}).waitFor();assert.equal(await page.locator('[data-review-mode]').count(),0);
 await page.goto(base+'/apps/ruimteklaar/');await page.getByRole('button',{name:'Open het oefenatelier',exact:false}).waitFor();assert.equal(await page.locator('[data-review-mode]').count(),0);
 results.push({environment:config.name,status:'passed',directEntries:ids.length,questions:questions.length,constructions:tasks.length,lessonBlocks:blocks.length,checks:Object.keys(checks).length,papers:8,checksPerformed:'one field without hints; native Enter; rejected composite factors; accepted repeat/caret/superscript codes; protected JS; all items free; filters; next/skip; three answer types; original check rules; extension and undo; source-linked Kladblok; unchanged local/session storage; no progress API; logout; session expiry; ordinary learner route'});
 await context.close();await browser.close();browser=null;
}
assert.deepEqual(errors,[]);
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({version:fs.readFileSync('app/version.ts','utf8').match(/APP_VERSION='([^']+)'/)[1],status:'passed',results,errors,limitations:['Automated browsers on Linux; no physical iPhone test.','Mathematical access gate, not identity authentication. No professional penetration test; per-isolate throttling is not global.']},null,2));console.log(JSON.stringify({status:'passed',environments:results.length,directEntriesPerEnvironment:ids.length}));
}finally{if(browser)await browser.close();server.close();fs.rmSync(path.join(out,'key.pem'),{force:true});fs.rmSync(path.join(out,'cert.pem'),{force:true})}
