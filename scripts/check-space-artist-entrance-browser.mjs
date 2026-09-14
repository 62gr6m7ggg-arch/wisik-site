/** End-to-end entrance, relocation and authentication regression checks. */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {handleReview, REVIEW_ROOT} from '../server/ruimteklaar-test-auth.mjs';
import {assets} from '../server/ruimteklaar-test-assets.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const live=process.env.LIVE_ORIGIN;
const out=process.env.ENTRANCE_EVIDENCE_DIR||'/tmp/space-entrance-evidence';
fs.mkdirSync(out,{recursive:true});
const evidence={status:'running',live:!!live,version:'0.1.26',checks:[],errors:[],checkedAt:new Date().toISOString()};
let server,base=live,browser;
if(!live){
 execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-subj','/CN=localhost','-keyout',out+'/key.pem','-out',out+'/cert.pem'],{stdio:'ignore'});
 server=https.createServer({key:fs.readFileSync(out+'/key.pem'),cert:fs.readFileSync(out+'/cert.pem')},async(req,res)=>{
  try{
   const url=new URL(req.url,'https://'+req.headers.host);let response;
   if(url.pathname===REVIEW_ROOT.slice(0,-1)||url.pathname.startsWith(REVIEW_ROOT)){
    const chunks=[];for await(const c of req)chunks.push(c);
    response=await handleReview(new Request(url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)}),{},assets);
   }else{
    let file=path.resolve(root,'public','.'+decodeURIComponent(url.pathname));
    if(file!==path.join(root,'public')&&!file.startsWith(path.join(root,'public')+path.sep))throw new Error('Outside public root');
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    const type={'.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.html':'text/html'}[path.extname(file)]||'application/octet-stream';
    response=fs.existsSync(file)?new Response(fs.readFileSync(file),{headers:{'Content-Type':type}}):new Response('Not found',{status:404});
   }
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){res.writeHead(500);res.end('Test adapter error: '+error.message)}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='https://127.0.0.1:'+server.address().port;
}
const configs=[{name:'chromium-desktop',engine:chromium,width:1280,height:900,mobile:false},{name:'chromium-mobile',engine:chromium,width:390,height:844,mobile:true},...(!process.env.BROWSER_EXECUTABLE?[{name:'webkit-mobile',engine:webkit,width:390,height:844,mobile:true}]:[])];
try{
 for(const config of configs){
  browser=await config.engine.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE,args:['--no-sandbox']}: {})});
  const context=await browser.newContext({ignoreHTTPSErrors:!live,viewport:{width:config.width,height:config.height},isMobile:config.mobile,hasTouch:config.mobile});
  const page=await context.newPage();page.setDefaultTimeout(15000);
  page.on('pageerror',e=>evidence.errors.push(config.name+': '+e.message));
  await page.goto(base+'/');
  assert.equal(await page.evaluate(()=>window.WISIK_SITE_VERSION),'0.1.26');
  const group=page.locator('.space-venue[data-terrain-group]'),bell=group.locator('[data-artist-entrance]'),tent=group.locator('.zone-space');
  await bell.waitFor({state:'visible'});
  assert.equal(await group.count(),1);assert.equal(await bell.getAttribute('href'),REVIEW_ROOT);
  assert.equal(await tent.getAttribute('href'),'/apps/ruimteklaar/');
  assert.equal(await page.locator('a a').count(),0,'No nested links anywhere in the page');
  const size=await bell.boundingBox();assert.ok(size.width>=44&&size.height>=44);
  await bell.scrollIntoViewIfNeeded();
  assert.ok(await bell.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}),'Bell must not be covered by another attraction');
  await page.evaluate(()=>{localStorage.setItem('artist-entry-progress-sentinel','unchanged');sessionStorage.setItem('artist-entry-session-sentinel','unchanged')});
  await group.screenshot({path:path.join(out,config.name+'-tent.png')});
  if(!config.mobile){
   await page.locator('.festival-map').screenshot({path:path.join(out,'desktop-map.png')});
   // Move the complete tent to a new stage container; the bell retains its local position.
   const moved=await group.evaluate(group=>{
    const bell=group.querySelector('[data-artist-entrance]'),r=group.getBoundingClientRect(),b=bell.getBoundingClientRect();
    const marker=document.createComment('original-stage');group.before(marker);
    const stage=document.createElement('div');stage.className='festival-map';stage.setAttribute('data-test-mainstage','');stage.style.cssText='position:relative;min-height:720px;width:100%;margin-top:40px';document.querySelector('#terrein').append(stage);stage.append(group);
    const nr=group.getBoundingClientRect(),nb=bell.getBoundingClientRect();
    const answer={moved:Math.abs(nr.y-r.y)>50,dx:Math.abs((nb.x-nr.x)-(b.x-r.x)),dy:Math.abs((nb.y-nr.y)-(b.y-r.y)),attached:group.contains(bell)};
    marker.replaceWith(group);stage.remove();return answer;
   });
   assert.ok(moved.moved&&moved.attached&&moved.dx<1&&moved.dy<1,'Relocation must preserve the bell attachment');
   for(const width of [320,390,590,768,1000,1001,1280,1440,390,1280]){
    await page.setViewportSize({width,height:900});await page.waitForTimeout(60);
    assert.equal(await group.count(),1);assert.equal(await bell.count(),1);assert.ok(await bell.isVisible());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow at '+width);
    if(width<=1000){
     assert.equal(await page.locator('[data-terrain-walk-list] > li').count(),10);
     assert.equal(await group.evaluate(g=>g.parentElement.id),'terrein');
    }else assert.ok(await group.evaluate(g=>g.parentElement.classList.contains('festival-map')));
   }
   await page.setViewportSize({width:1280,height:900});
  }
  await bell.focus();await page.keyboard.press('Enter');
  await page.getByLabel('Wachtwoord',{exact:true}).waitFor();
  assert.equal(new URL(page.url()).pathname,REVIEW_ROOT);assert.equal(await page.locator('input').count(),1);
  assert.equal(await page.locator('button').count(),0);assert.doesNotMatch(await page.locator('body').innerText(),/priem|factor|code|exponent/i);
  assert.equal(await page.locator('[data-review-mode]').count(),0);
  assert.equal((await context.request.get(base+REVIEW_ROOT+'session')).status(),401);
  await page.getByLabel('Wachtwoord',{exact:true}).fill('not-valid');await page.keyboard.press('Enter');
  await page.locator('input[aria-invalid=true]').waitFor();assert.equal(await page.locator('[data-review-mode]').count(),0);
  await page.getByLabel('Wachtwoord',{exact:true}).fill('360 2^3 3^2 5');await page.keyboard.press('Enter');
  await page.locator('[data-review-mode=true]').waitFor();
  await page.getByLabel('Kies een onderdeel',{exact:true}).selectOption('vraag:l7b-14');await page.locator('[data-review-code="l7b-14"]').waitFor();
  assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('artist-entry-progress-sentinel'),sessionStorage.getItem('artist-entry-session-sentinel')]),['unchanged','unchanged']);
  await page.getByRole('button',{name:'Uitloggen',exact:true}).click();await page.getByLabel('Wachtwoord',{exact:true}).waitFor();
  assert.equal((await context.request.get(base+REVIEW_ROOT+'session')).status(),401);
  // Both Rafelrand contexts retain a real, directly usable bell.
  for(const route of ['/rafelrand/','/rafelrand/space-tent/']){
   await page.goto(base+route);const entry=page.locator('[data-artist-entrance="ruimteklaar"]');assert.equal(await entry.count(),1);assert.ok(await entry.isVisible());
   if(config.mobile)await entry.tap();else await entry.click();await page.getByLabel('Wachtwoord',{exact:true}).waitFor();assert.equal(new URL(page.url()).pathname,REVIEW_ROOT);
  }
  await page.goto(base+'/hbo/');const cardBell=page.locator('.tool-card [data-artist-entrance="ruimteklaar"]');assert.equal(await cardBell.count(),1);assert.ok(await cardBell.isVisible());assert.equal(await cardBell.getAttribute('href'),REVIEW_ROOT);
  // Ordinary learning remains a separate route.
  await page.goto(base+'/');await page.locator('.zone-space').click();await page.getByRole('button',{name:'Open het oefenatelier',exact:false}).waitFor();assert.equal(await page.locator('[data-review-mode]').count(),0);
  // A plain HTML bell still works with scripts disabled.
  const native=await browser.newContext({ignoreHTTPSErrors:!live,javaScriptEnabled:false,viewport:{width:config.width,height:config.height}});const raw=await native.newPage();await raw.goto(base+'/');await raw.locator('.space-venue [data-artist-entrance]').click();await raw.getByLabel('Wachtwoord',{exact:true}).waitFor();await native.close();
  evidence.checks.push({environment:config.name,status:'passed',checks:'tent and bell separate links in one movable group; registry card; actual new-stage move; desktop/mobile resizing; target size; no overflow/cover; keyboard; tap; Rafelrand and tent page; no-JS link; unchanged hint-free login; invalid rejection and valid entry; free question; logout; ordinary learner route; progress sentinels unchanged'});
  await context.close();await browser.close();browser=null;
 }
 if(live){
  // The deployed site CSS, registry and navigation must match the reviewed checkout.
  const hash=b=>createHash('sha256').update(b).digest('hex');const checks=['/assets/css/styles.css','/assets/js/site.js','/assets/js/site-data.js','/assets/js/mobile-terrein.js'];
  evidence.assets=[];
  for(const file of checks){const response=await fetch(base+file+'?v=0.1.26');assert.equal(response.status,200);const bytes=Buffer.from(await response.arrayBuffer());const expected=hash(fs.readFileSync(path.join(root,'public',file)));assert.equal(hash(bytes),expected,file);evidence.assets.push({file,sha256:expected})}
 }
 assert.deepEqual(evidence.errors,[]);evidence.status='passed';
 console.log(JSON.stringify({status:'passed',live:!!live,environments:evidence.checks.length}));
}catch(error){evidence.status='failed';evidence.failure=error.stack;throw error}
finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(evidence,null,2)+'\n');if(browser)await browser.close();if(server)server.close();fs.rmSync(out+'/key.pem',{force:true});fs.rmSync(out+'/cert.pem',{force:true})}
