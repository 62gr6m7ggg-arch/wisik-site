import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {assets} from '../server/ruimteklaar-test-assets.mjs';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin='https://wisik.nl',R='/apps/ruimteklaar/test/',out=process.env.EVIDENCE_DIR||'/tmp/factor-live-evidence';fs.mkdirSync(out,{recursive:true});
const sha=s=>createHash('sha256').update(s).digest('hex');
const report={status:'running',checkedAt:new Date().toISOString(),release:process.env.GITHUB_SHA||null,http:[],browsers:[],errors:[]};
const get=async route=>{let last;for(let i=0;i<3;i++){try{return await fetch(origin+route,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)})}catch(e){last=e}}throw last};
const js=Object.keys(assets).find(k=>k.endsWith('.js'));
let ready=false;
for(let i=0;i<24;i++){try{const r=await get(R),body=await r.text();if(r.status===200&&body.includes('enterkeyhint="go"')&&!body.includes('<button')){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,5000))}
assert.ok(ready,'Expected single-field gate not yet deployed');
for(const rel of ['session',...Object.keys(assets).filter(k=>k!=='index.html')]){const r=await get(R+rel);assert.equal(r.status,401);assert.match(r.headers.get('Cache-Control')||'',/no-store/);report.http.push({route:R+rel,status:401})}
const learner=fs.readFileSync('public/apps/ruimteklaar/index.html','utf8');
for(const route of ['/apps/ruimteklaar/',...Array.from(learner.matchAll(/(?:src|href)="(\/apps\/ruimteklaar\/assets\/[^"?]+)"/g),m=>m[1])]){const r=await get(route);assert.equal(r.status,200);const body=Buffer.from(await r.arrayBuffer()),expected=fs.readFileSync('public'+route+(route.endsWith('/')?'index.html':''));assert.equal(sha(body),sha(expected));report.http.push({route,status:200,unchangedLearner:true,sha256:sha(body)})}
const tasks=JSON.parse(fs.readFileSync('tools/space-tent/app/construction-tasks.json')).tasks;
for(const config of [{name:'chromium-desktop',engine:chromium,width:1280,mobile:false,credential:'12 2 2 3'},{name:'chromium-mobile',engine:chromium,width:390,mobile:true,credential:'72 2^3 3^2'},{name:'webkit-mobile',engine:webkit,width:390,mobile:true,credential:'360 2³ 3² 5'}]){
  const browser=await config.engine.launch({headless:true});const context=await browser.newContext({viewport:{width:config.width,height:900},isMobile:config.mobile,hasTouch:config.mobile});const page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>report.errors.push(config.name+': '+e.message));
  try{
    await page.goto(origin+R);const input=page.getByLabel('Wachtwoord',{exact:true});await input.waitFor();assert.equal(await page.locator('input:visible').count(),1);assert.equal(await page.getByRole('button').count(),0);assert.equal((await page.innerText('body')).trim(),'');assert.doesNotMatch(await page.content(),/priem|factor|ontbind|exponent|rekensom|voorbeeld|placeholder=/i);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(out,config.name+'-login.png'),fullPage:true});
    await page.evaluate(()=>{localStorage.setItem('factor-login-sentinel','unchanged');sessionStorage.setItem('factor-tab-sentinel','unchanged')});const snapshot=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}));
    await input.fill('12 4 3');await input.press('Enter');await page.locator('input[aria-invalid=true]').waitFor();assert.equal(await page.locator('[data-review-mode]').count(),0);assert.equal((await context.request.get(origin+R+js)).status(),401);
    await input.fill(config.credential);await input.press('Enter');await page.locator('[data-review-mode=true]').waitFor();
    for(const [file,asset] of Object.entries(assets).filter(([file])=>file!=='index.html')){const response=await context.request.get(origin+R+file);assert.equal(response.status(),200);assert.equal(sha(await response.body()),sha(asset.body));}
    await page.getByLabel('Kies een onderdeel',{exact:true}).selectOption('constructie:'+tasks[0].id);await page.locator('[data-review-code="'+tasks[0].id+'"]').waitFor();
    for(const p of tasks[0].edges[0]){const button=page.locator('.selection-controls .point-tray').getByRole('button',{name:p,exact:true});if(config.mobile)await button.tap();else await button.click()}
    assert.equal(await page.locator('.drawing-panel .drawn-line').count(),0);await page.locator('[data-action=extend]').click();await page.waitForFunction(()=>document.querySelectorAll('.drawing-panel .drawn-line').length===1);await page.locator('.drawing-footer button').click();await page.waitForFunction(()=>document.querySelectorAll('.drawing-panel .drawn-line').length===0);
    assert.deepEqual(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}})),snapshot);await page.screenshot({path:path.join(out,config.name+'-review.png'),fullPage:true});
    await page.getByRole('button',{name:'Uitloggen',exact:true}).click();await input.waitFor();assert.equal((await context.request.get(origin+R+js)).status(),401);assert.equal(await page.locator('[data-review-mode]').count(),0);
    await page.goto(origin+'/apps/ruimteklaar/');await page.getByRole('button',{name:'Open het oefenatelier',exact:false}).waitFor();assert.equal(await page.locator('[data-review-mode]').count(),0);
    report.browsers.push({environment:config.name,status:'passed',checks:'one empty field; no hints; Enter; reject composite factors; valid factor code; authenticated asset hashes; free construction; extend and undo; unchanged browser storage; logout denies assets; normal learner route'});
  }catch(e){await page.screenshot({path:path.join(out,config.name+'-failure.png'),fullPage:true}).catch(()=>{});throw e}finally{await context.close();await browser.close()}
}
assert.deepEqual(report.errors,[]);report.status='passed';fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
