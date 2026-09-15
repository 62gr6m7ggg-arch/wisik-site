import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const publicRoot=path.join(root,'public');
const output=process.env.PABO_NAV_EVIDENCE||'/tmp/pabo-nav-evidence';
fs.mkdirSync(output,{recursive:true});
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon'};
let server;
let origin=process.env.LIVE_ORIGIN;
if(!origin){
 server=http.createServer((req,res)=>{
  try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p.endsWith('/'))p+='index.html';const f=path.resolve(publicRoot,'.'+p);if(!f.startsWith(publicRoot+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);}catch{res.writeHead(400);res.end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port;
}
const app='/apps/pabo-rekenklaar/';
const result={status:'running',checkedAt:new Date().toISOString(),origin,bridgeVersion:'1.1.1',environments:[],assets:[],errors:[]};
const hash=b=>createHash('sha256').update(b).digest('hex');
async function deployedFiles(){
 for(const file of ['index.html','wisik-bridge.css','wisik-bridge.js']){
  const r=await fetch(origin+app+(file==='index.html'?'':file+'?v=1.1.1'),{cache:'no-store',signal:AbortSignal.timeout(15000)});assert.equal(r.status,200,file);const data=Buffer.from(await r.arrayBuffer());const expected=hash(fs.readFileSync(path.join(publicRoot,app,file)));assert.equal(hash(data),expected,'Deployed '+file+' differs from tested file');result.assets.push({file,sha256:expected});
 }
}
async function layout(page,label){
 const e=await page.evaluate(()=>{
  const errors=[];const header=document.querySelector('.topbar.wisik-header-integrated');if(!header)return ['integrated header missing'];
  const rect=header.getBoundingClientRect();const items=[...header.querySelectorAll('a, button, .stat-pill, .brand-copy')].filter(e=>e.getBoundingClientRect().height&&getComputedStyle(e).visibility!=='hidden');
  for(let i=0;i<items.length;i++){
   const a=items[i],ar=a.getBoundingClientRect();const name=a.id||a.className;
   if(ar.left < -1||ar.right>innerWidth+1)errors.push(name+' outside viewport');
   if(ar.top<rect.top-1||ar.bottom>rect.bottom+1)errors.push(name+' outside header');
   if(a.matches('.wisik-exit-link, .wisik-terrain-link, .icon-btn')&&(ar.height<43.5||ar.width<43.5))errors.push(name+' touch target too small');
   for(let j=i+1;j<items.length;j++){const br=items[j].getBoundingClientRect();if(Math.min(ar.right,br.right)-Math.max(ar.left,br.left)>1&&Math.min(ar.bottom,br.bottom)-Math.max(ar.top,br.top)>1)errors.push(name+' overlaps '+items[j].className);}
   if(a.matches('a,button')){const hit=document.elementFromPoint((ar.left+ar.right)/2,(ar.top+ar.bottom)/2);if(!hit||!a.contains(hit))errors.push(name+' covered');}
  }
  if(document.documentElement.scrollWidth>innerWidth+1)errors.push('horizontal overflow');
  if(innerWidth<=620&&document.querySelector('.wisik-exit-nav').getBoundingClientRect().top<header.querySelector('.brand').getBoundingClientRect().bottom)errors.push('mobile links not on separate row');
  const reserved=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--wisik-header-height'));if(Math.abs(reserved-rect.height)>1)errors.push('header size not updated');
  return errors;
 });assert.deepEqual(e,[],label);
}
try{
 if(process.env.LIVE_ORIGIN){let ready=false;for(let i=0;i<24;i++){try{result.assets=[];await deployedFiles();ready=true;break;}catch(e){if(i===23)throw e;await new Promise(r=>setTimeout(r,10000));}}assert.ok(ready);}else await deployedFiles();
 for(const config of [{name:'chromium-desktop',engine:chromium,width:1280,height:900},{name:'chromium-mobile',engine:chromium,width:390,height:844,mobile:true},{name:'chromium-small',engine:chromium,width:320,height:720,mobile:true},{name:'webkit-mobile',engine:webkit,width:390,height:844,mobile:true}]){
  const browser=await config.engine.launch({headless:true});const context=await browser.newContext({viewport:{width:config.width,height:config.height},isMobile:!!config.mobile,hasTouch:!!config.mobile});const page=await context.newPage();page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(origin+app);await page.locator('.wisik-header-integrated').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
   const initial=await page.evaluate(()=>localStorage.getItem('pabo-rekenklaar-state-v1'));
   await layout(page,config.name+' initial');
   assert.equal(await page.locator('[data-wisik-exit-nav]').count(),1);
   assert.equal(await page.locator('.top-stats .wisik-terrain-link').count(),0);
   assert.equal(await page.locator('.wisik-exit-nav .wisik-terrain-link').count(),1);
   await page.screenshot({path:path.join(output,config.name+'-home.png')});
   for(const view of ['learn','practice','exam','stats','home']){
    await page.locator('.bottom-nav [data-nav="'+view+'"]').click();await page.waitForTimeout(150);await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await layout(page,config.name+' '+view);
    await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(80);
    const footer=await page.locator('.bottom-nav').boundingBox();const active=await page.locator('.view.active').boundingBox();assert.ok(active.y+active.height<=footer.y-5,view+': view end cannot clear bottom navigation');
    const buttons=page.locator('.view.active button:visible:not([disabled])');if(await buttons.count()){
     const last=buttons.last();await last.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));const r=await last.boundingBox();const top=await page.locator('.topbar').boundingBox();const bottom=await page.locator('.bottom-nav').boundingBox();assert.ok(r.y>=top.y+top.height-1&&r.y+r.height<=bottom.y+1,view+': last button obscured');
    }
   }
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   assert.equal(await page.evaluate(()=>localStorage.getItem('pabo-rekenklaar-state-v1')),initial,'navigation changed learning state');
   if(config.name==='chromium-desktop'){
    for(const width of [320,360,390,520,620,768,1024,1440,390,1280]){await page.setViewportSize({width,height:900});await page.waitForTimeout(80);await layout(page,'resize '+width);assert.equal(await page.locator('[data-wisik-exit-nav]').count(),1);}
   }
   // Settings dialog must cover the header and retain working keyboard navigation.
   await page.locator('#settingsBtn').focus();await page.keyboard.press('Enter');await page.locator('#modalBackdrop.show').waitFor();
   const modalTop=await page.locator('.modal-head').evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});assert.ok(modalTop,'header covers settings');
   for(const id of ['settingLarge','settingMotion']){if(!await page.locator('#'+id).isChecked())await page.locator('label.switch:has(#'+id+')').click();assert.equal(await page.locator('#'+id).isChecked(),true);}await page.locator('#saveSettings').click();await page.waitForTimeout(120);await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await layout(page,'large text');
   await page.screenshot({path:path.join(output,config.name+'-large-text.png')});
   const learned=()=>page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('pabo-rekenklaar-state-v1')||'{}');return {xp:s.xp,answered:s.totalAnswered,lessons:s.completedLessons};});const progress=await learned();
   // Exercise a real practice view without submitting a fabricated answer.
   await page.locator('.bottom-nav [data-nav="practice"]').click();await page.locator('#startPracticeBtn').click();await page.locator('.question-card').first().waitFor();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await layout(page,'active question');assert.equal(await page.locator('.bottom-nav').isVisible(),false);
   const scratch=page.locator('[data-action="scratch"]');if(await scratch.count()){
    await scratch.first().click();const r=await page.locator('#scratchpad').boundingBox();const h=await page.locator('.topbar').boundingBox();assert.ok(r.y>=h.y+h.height,'scratchpad covers header');await page.locator('#closeScratch').click();
   }
   assert.deepEqual(await learned(),progress,'opening practice changed scores');
   const feedback=page.locator('.wisik-exit-feedback');const url=new URL(await feedback.getAttribute('href'));assert.equal(url.pathname,'/kladblok/');assert.equal(url.searchParams.get('bron'),origin+app);assert.equal(url.searchParams.get('appversie'),'1.6.3');
   // Intercept only the destination document in local preview; production visits it.
   if(!process.env.LIVE_ORIGIN)await page.route('https://wisik.nl/kladblok/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Preview destination</title>'}));
   await Promise.all([page.waitForURL(u=>u.pathname==='/kladblok/'),feedback.click()]);
   if(process.env.LIVE_ORIGIN){const snap=await page.evaluate(()=>JSON.parse(localStorage.getItem('wisik:pabo-rekenklaar:last-exit')));assert.equal(snap.app,'Pabo Rekenklaar');assert.ok(snap.destination.startsWith('https://wisik.nl/kladblok/'));}
   await page.goto(origin+app);await page.locator('.wisik-header-integrated').waitFor();assert.deepEqual(await learned(),progress,'return changed scores');
   assert.deepEqual(errors,[]);result.environments.push({name:config.name,status:'passed',checks:'no overlapping/covered header controls; wrapping; 44px links; all five views; last buttons and content clear footer; settings/large text; active question; scratchpad; Kladblok context and return; no unearned progress'});
  }catch(e){result.status='failed';result.errors.push(config.name+': '+e.message);await page.screenshot({path:path.join(output,config.name+'-failure.png'),fullPage:true});throw e;}
  finally{await context.close();await browser.close();}
 }
 result.status='passed';
}finally{
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));if(server)await new Promise(r=>server.close(r));
}
