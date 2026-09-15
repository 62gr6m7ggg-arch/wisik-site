/** Test the real Rafelrandjes pages, composite terrain groups and native links. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),pub=path.join(root,'public');
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=process.env.RAFEL_EVIDENCE_DIR||'/tmp/rafelrandjes-evidence';fs.mkdirSync(out,{recursive:true});
const live=process.env.LIVE_ORIGIN,version=JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version;
const proof={status:'running',version,live:!!live,checkedAt:new Date().toISOString(),results:[],assets:[],errors:[]};
let server,base=live,browser;
if(!live){
 server=http.createServer((req,res)=>{
  try{
   const url=new URL(req.url,'http://localhost');let f=path.resolve(pub,'.'+decodeURIComponent(url.pathname));
   assert.ok(f===pub||f.startsWith(pub+path.sep));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
   if(!fs.existsSync(f)){res.writeHead(404);res.end('Not found');return}
   const type={'.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.html':'text/html','.ico':'image/x-icon'}[path.extname(f)]||'application/octet-stream';
   res.writeHead(200,{'Content-Type':type});res.end(fs.readFileSync(f));
  }catch{res.writeHead(400);res.end('Bad request')}
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
}
const overflow=page=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
async function hittable(el){await el.scrollIntoViewIfNeeded();return el.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))})}
try{
 if(live){
  let ready=false;
  for(let n=0;n<24;n++){
   try{const r=await fetch(base+'/',{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(12000)});const s=await r.text();if(r.ok&&s.includes('id="rafelrandjes"')&&s.includes('styles.css?v='+version)){ready=true;break}}catch{}
   await new Promise(r=>setTimeout(r,5000));
  }assert.ok(ready,'The reviewed Rafelrandjes release is not live');
  for(const file of ['assets/css/rafelrandjes.css','assets/js/site.js','assets/js/site-data.js','assets/js/mobile-terrein.js']){
   const r=await fetch(base+'/'+file,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});assert.equal(r.status,200,file);
   const bytes=Buffer.from(await r.arrayBuffer()),hash=b=>createHash('sha256').update(b).digest('hex');assert.equal(hash(bytes),hash(fs.readFileSync(path.join(pub,file))),file);proof.assets.push({file,sha256:hash(bytes)});
  }
 }
 for(const cfg of [{name:'chromium-desktop',engine:chromium,width:1440,mobile:false},{name:'chromium-mobile',engine:chromium,width:390,mobile:true},{name:'chromium-narrow',engine:chromium,width:320,mobile:true},{name:'webkit-mobile',engine:webkit,width:390,mobile:true}]){
  browser=await cfg.engine.launch({headless:true});const context=await browser.newContext({viewport:{width:cfg.width,height:900},isMobile:cfg.mobile,hasTouch:cfg.mobile}),page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>proof.errors.push(cfg.name+': '+e.message));
  await page.goto(base+'/');assert.equal(await page.evaluate(()=>window.WISIK_SITE_VERSION),version);
  const paper=page.locator('#rafelrandjes'),work=paper.locator('.zone-hbo'),label=paper.locator('.zone-rafel'),space=page.locator('.space-venue');
  assert.equal(await paper.count(),1);assert.equal(await work.count(),1);assert.equal(await paper.locator('.zone-space,.space-artist-entry').count(),0);
  assert.equal(await work.getAttribute('href'),'/rafelrand/#hbo-werkplaats');assert.equal(await label.getAttribute('href'),'/rafelrand/');
  assert.ok(await hittable(label));assert.ok(await hittable(work));assert.ok(await overflow(page));
  assert.ok(await paper.evaluate(el=>getComputedStyle(el,'::before').clipPath.startsWith('polygon(')));
  assert.equal(await paper.evaluate(el=>getComputedStyle(el,'::before').pointerEvents),'none');
  await paper.screenshot({path:path.join(out,cfg.name+'-paper.png')});
  if(!cfg.mobile){
   await page.locator('.festival-map').screenshot({path:path.join(out,'desktop-terrein.png')});
   for(const width of [320,390,590,768,1000,1001,1280,1440,320,1440]){
    await page.setViewportSize({width,height:900});await page.waitForTimeout(80);
    assert.equal(await paper.count(),1);assert.equal(await work.count(),1);assert.equal(await paper.locator('.zone-rafel').count(),1);
    assert.equal(await space.locator('.space-artist-entry').count(),1);assert.equal(await space.locator('[data-space-billboard]').count(),1);
    assert.ok(await paper.evaluate((el,mobile)=>mobile?el.parentElement.id==='terrein':el.parentElement.classList.contains('festival-map'),width<=1000));
    assert.ok(await overflow(page),'Horizontal overflow at '+width);
   }
   const pos=await page.locator('.zone-pabo,.space-venue,.zone-stoicheia').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().y));assert.ok(pos.every(y=>Math.abs(y-pos[0])<2));
  }
  await page.evaluate(()=>localStorage.setItem('rafel-existing-progress','unchanged'));
  if(cfg.mobile)await work.tap();else await work.click();await page.waitForURL(base+'/rafelrand/#hbo-werkplaats');
  assert.equal(await page.locator('#hbo-workshop-title').innerText(),'HBO-werkplaats');assert.match(await page.locator('.paper-heading').innerText(),/nog niet te oefenen/i);
  assert.equal(await page.locator('.paper-facts section').count(),4);assert.equal(await page.locator('form').count(),0);assert.equal(await page.locator('[data-artist-entrance]').count(),0);assert.ok(await overflow(page));
  await page.locator('#hbo-workshop-title').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,cfg.name+'-workshop.png'),fullPage:true});
  await page.goto(base+'/hbo/#summer-course-bouwkunde');await page.locator('.tool-card').waitFor();assert.equal(await page.locator('.tool-card').count(),1);assert.ok((await page.locator('.tool-card').innerText()).includes('Space-tent'));assert.equal(await page.locator('.tool-card [data-artist-entrance="ruimteklaar"]').count(),1);assert.ok(await overflow(page));
  await page.goto(base+'/vo/');await page.locator('.tool-card').waitFor();assert.equal(await page.locator('.tool-card').count(),1);assert.ok((await page.locator('.tool-card').innerText()).includes('Euclides'));assert.ok(!(await page.innerText('main')).includes('Nog geen openbare attractie'));assert.ok(await overflow(page));
  await page.goto(base+'/');await page.locator('[data-terrain-directory]').evaluate(el=>el.open=true);assert.equal(await page.locator('[data-terrain-walk-list] > li').count(),10);const listWork=page.locator('[data-terrain-walk-list] a').filter({hasText:'HBO-werkplaats'});assert.equal(await listWork.count(),1);assert.equal(await listWork.getAttribute('href'),'/rafelrand/#hbo-werkplaats');
  await page.locator('.zone-hbo').focus();await page.keyboard.press('Enter');await page.waitForURL(base+'/rafelrand/#hbo-werkplaats');
  assert.equal(await page.evaluate(()=>localStorage.getItem('rafel-existing-progress')),'unchanged');
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:cfg.width,height:900}}),np=await nojs.newPage();await np.goto(base+'/');assert.ok(await np.locator('#rafelrandjes .zone-hbo').isVisible());await np.locator('#rafelrandjes .zone-hbo').click();await np.waitForURL(base+'/rafelrand/#hbo-werkplaats');assert.ok(await overflow(np));await nojs.close();
  proof.results.push({environment:cfg.name,status:'passed',checks:'paper/workshop grouping; visible torn edge; reachable click/tap/keyboard targets; no overflow; honest four-part status board; no fictitious app; HBO and VO card filtering; preserved Space entrance; 10-item alternative list; no-JS native link; unchanged progress sentinel'});
  await context.close();await browser.close();browser=null;
 }
 assert.deepEqual(proof.errors,[]);proof.status='passed';
}catch(e){proof.status='failed';proof.error=e.stack;throw e}
finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(proof,null,2)+'\n');if(browser)await browser.close();if(server)server.close()}
console.log('Rafelrandjes browsers passed: '+proof.results.length+' environments'+(live?' on live site':' in preview')+'.');
