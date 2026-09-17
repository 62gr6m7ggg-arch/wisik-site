import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pub=path.join(root,'public');
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const proof=process.env.PRIVACY_EVIDENCE_DIR||'/tmp/wisik-privacy-proof';
fs.mkdirSync(proof,{recursive:true});
let server;
let origin=process.env.LIVE_ORIGIN;
if(!origin){
  server=http.createServer((req,res)=>{
    try{
      const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const file=path.resolve(pub,'.'+p+(p.endsWith('/')?'index.html':''));
      if(!file.startsWith(pub+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found');}
      const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.ico':'image/x-icon','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif'};
      res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Referrer-Policy':'strict-origin-when-cross-origin'});fs.createReadStream(file).pipe(res);
    }catch{res.writeHead(500);res.end('Testserver error');}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  origin='http://127.0.0.1:'+server.address().port;
}
origin=origin.replace(/\/$/,'');
const files=[['/backstage/','backstage/index.html'],['/kladblok/','kladblok/index.html'],['/pabo/pabo-rekenklaar/','pabo/pabo-rekenklaar/index.html'],['/hbo/space-tent/','hbo/space-tent/index.html'],['/assets/js/site.js','assets/js/site.js'],['/assets/js/kladblok-context.js','assets/js/kladblok-context.js'],['/assets/js/site-data.js','assets/js/site-data.js'],['/assets/data/pabo-release-audit.json','assets/data/pabo-release-audit.json'],['/assets/data/ruimteklaar-release-audit.json','assets/data/ruimteklaar-release-audit.json']];
let verifiedBytes=false;
const report={origin,live:Boolean(process.env.LIVE_ORIGIN),startedAt:new Date().toISOString(),scenarios:[],realMailSent:false};
try{
  if(process.env.LIVE_ORIGIN){
    let failures=[];
    for(let attempt=0;attempt<30;attempt++){
      failures=[];
      for(const [url,file] of files){
        try{const response=await fetch(origin+url+'?privacy-check='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(20000)});const bytes=Buffer.from(await response.arrayBuffer());if(!response.ok||!bytes.equals(fs.readFileSync(path.join(pub,file))))failures.push(url);}catch{failures.push(url);}
      }
      if(!failures.length){verifiedBytes=true;break;}
      console.log('Wacht op publicatie van geteste bron:',failures.join(', '));
      await new Promise(resolve=>setTimeout(resolve,8000));
    }
    assert.ok(verifiedBytes,'Livebestanden moeten bytegelijk zijn aan geteste release');
  }
  for(const [label,engine,viewport] of [['chromium-desktop',chromium,{width:1366,height:900}],['chromium-mobiel',chromium,{width:390,height:844}],['webkit-smal',webkit,{width:320,height:740}]]){
    const browser=await engine.launch({headless:true});
    try{
      const context=await browser.newContext({viewport,deviceScaleFactor:1});
      const page=await context.newPage();
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      let submitted=null;
      await context.route('https://formsubmit.co/**',async route=>{
        const request=route.request();
        assert.equal(request.method(),'POST','uitsluitend onderschepte test-POST');
        submitted=new URLSearchParams(request.postData()||'');
        await route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Onderschepte privacytest</title><p>Er is geen mail verstuurd.</p>'});
      });
      await page.addInitScript(()=>{
        localStorage.setItem('wisik-privacy-progress-sentinel','KEEP_PRIVATE_PROGRESS');
        sessionStorage.setItem('wisik-last-attraction-context-v1',JSON.stringify({product:'Pabo Rekenklaar',productVersion:'1.8.0',view:'learn',pageUrl:location.origin+'/apps/pabo-rekenklaar/?antwoord=PRIVATE_ANSWER#PRIVATE_DIAGNOSIS',answer:'PRIVATE_ANSWER',xp:98765,diagnosis:'PRIVATE_DIAGNOSIS'}));
      });
      await page.goto(origin+'/backstage/#privacy',{waitUntil:'networkidle'});
      assert.equal(await page.locator('#privacy').count(),1);
      assert.equal(await page.locator('#privacy details').count(),6);
      for(const detail of await page.locator('#privacy details').all()){
        const summary=detail.locator('summary');await summary.focus();await page.keyboard.press('Enter');assert.equal(await detail.evaluate(e=>e.open),true);await page.keyboard.press('Enter');assert.equal(await detail.evaluate(e=>e.open),false);
      }
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Backstage geen horizontale overloop');
      await page.locator('#privacy details').nth(3).locator('summary').click();
      await page.locator('#privacy').screenshot({path:path.join(proof,label+'-privacy.png')});
      for(const url of ['/pabo/pabo-rekenklaar/','/hbo/space-tent/']){
        await page.goto(origin+url,{waitUntil:'networkidle'});
        const link=page.locator('a[href="/backstage/#privacy"]').first();assert.equal(await link.count(),1);await link.click();await page.waitForURL('**/backstage/#privacy');assert.equal(await page.locator('#privacy').count(),1);
      }
      const params=new URLSearchParams({product:'Space-tent',productversie:'0.5.4',onderdeel:'learn',bron:origin+'/apps/ruimteklaar/?antwoord=PRIVATE_ANSWER&xp=98765#PRIVATE_DIAGNOSIS',xp:'PRIVATE_ANSWER'});
      await page.goto(origin+'/kladblok/?'+params,{waitUntil:'networkidle'});
      const initialStorage=await page.evaluate(()=>JSON.stringify(Object.entries(localStorage).sort()));
      const form=page.locator('form.wisik-direct-feedback-form');
      assert.equal(await form.getAttribute('action'),'https://formsubmit.co/kladblok@wisik.nl');
      assert.equal(await page.locator('[name="Bronpagina"]').inputValue(),origin+'/apps/ruimteklaar/');
      assert.equal(await page.locator('[name="Pagina"]').inputValue(),origin+'/apps/ruimteklaar/');
      assert.equal(await page.locator('[name="Attractie of terrein"]').inputValue(),'Space-tent');
      assert.ok((await form.innerText()).includes('3 maanden'));
      assert.ok((await form.innerText()).includes('30 dagen'));
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Kladblok geen horizontale overloop');
      const autoPayload=await form.evaluate(f=>Object.fromEntries(new FormData(f)));
      assert.ok(!JSON.stringify(autoPayload).includes('PRIVATE_'),'geen leergegevens in formuliervelden');
      await page.locator('[name="Bericht"]').fill('Geautomatiseerde privacytest. De verzending wordt onderschept; er wordt geen echte mail verstuurd.');
      assert.equal(await page.locator('[name="email"]').getAttribute('required'),null,'e-mail blijft optioneel');
      assert.equal(await page.evaluate(()=>JSON.stringify(Object.entries(localStorage).sort())),initialStorage,'voortgang ongewijzigd');
      await form.screenshot({path:path.join(proof,label+'-formulier.png')});
      await Promise.all([page.waitForURL('https://formsubmit.co/**'),page.getByRole('button',{name:'Leg op het Kladblok'}).click()]);
      assert.ok(submitted,'werkelijke browser-POST onderschept');
      for(const name of ['Pagina','Bronpagina'])assert.equal(submitted.get(name),origin+'/apps/ruimteklaar/');
      assert.equal(submitted.get('Bronproduct'),'Space-tent');assert.equal(submitted.get('Productversie'),'0.5.4');assert.equal(submitted.get('Onderdeel'),'Leren per onderdeel');
      assert.ok(!submitted.toString().includes('PRIVATE_'),'geen leergegevens in uitgaande POST');
      assert.deepEqual(errors,[],'geen JavaScript-paginafouten');
      await context.close();
      report.scenarios.push({label,viewport,passed:true,detailsKeyboard:6,productLinks:2,postIntercepted:true,storageUnchanged:true});
    }finally{await browser.close();}
  }
  const browser=await chromium.launch();
  try{
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const page=await context.newPage();await page.goto(origin+'/backstage/#privacy');
    await page.locator('#privacy details summary').first().click();assert.equal(await page.locator('#privacy details').first().evaluate(e=>e.open),true);
    await page.goto(origin+'/kladblok/');assert.equal(await page.locator('form').getAttribute('action'),'https://formsubmit.co/kladblok@wisik.nl');assert.ok((await page.locator('form').innerText()).includes('3 maanden'));assert.equal(await page.locator('a[href="/backstage/#privacy"]').count(),1);
    report.scenarios.push({label:'zonder-javascript',passed:true});await context.close();
  }finally{await browser.close();}
  report.passed=true;report.verifiedLiveFiles=verifiedBytes?files.length:0;
  if(!process.env.LIVE_ORIGIN)fs.writeFileSync(path.join(root,'docs/privacy-terrein-browser-evidence.json'),JSON.stringify(report,null,2)+'\n');
}finally{
  report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(proof,'privacy-browser-report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));if(server)await new Promise(resolve=>server.close(resolve));
}
