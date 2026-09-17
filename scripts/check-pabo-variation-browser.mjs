import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),publicRoot=path.join(root,'public');
const output=process.env.PABO_VARIATION_EVIDENCE||'/tmp/pabo-variation-browser';fs.mkdirSync(output,{recursive:true});
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const report={status:'running',environments:[],assets:[],errors:[]};
let server,origin=process.env.LIVE_ORIGIN;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.webp':'image/webp'};
if(!origin){server=http.createServer((req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p.endsWith('/'))p+='index.html';const file=path.resolve(publicRoot,'.'+p);if(!file.startsWith(publicRoot+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)}catch{res.writeHead(400);res.end()}});await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port}
report.origin=origin;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function verifyAssets(){
  const assets=[];for(const file of ['apps/pabo-rekenklaar/index.html','assets/data/pabo-release-audit.json']){
    const response=await fetch(origin+'/'+file,{cache:'no-store',signal:AbortSignal.timeout(15000)});assert.equal(response.status,200,file);const bytes=Buffer.from(await response.arrayBuffer()),expected=hash(fs.readFileSync(path.join(publicRoot,file)));assert.equal(hash(bytes),expected,'Published source differs: '+file);assets.push({file,sha256:expected});
  }report.assets=assets;
}
async function layout(page,label){
  const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,questionWidth:document.querySelector('.question-card')?.getBoundingClientRect().width||0,viewport:innerWidth,alert:activeSession?.variationIssue||null}));
  assert.equal(result.overflow,false,label+' horizontal overflow');assert.equal(result.alert,null,label+' inventory shortage');assert.ok(result.questionWidth<=result.viewport+1,label+' question too wide');
}
async function answerQuestion(page,exam){
  const q=await page.evaluate(()=>({type:activeSession.current.type,answer:activeSession.current.answer,mode:activeSession.current.mode}));
  if(q.type==='mc')await page.locator('.option-btn').nth(q.answer).click();
  else if(q.type==='order'){
    for(let target=0;target<q.answer.length;target++){
      let index=await page.evaluate(value=>activeSession.order.indexOf(value),q.answer[target]);
      while(index>target){await page.locator(`[data-move="up"][data-index="${index}"]`).click();index--}
    }
  }else await page.locator('#answerInput').fill(String(q.answer).replace('.',','));
  if(q.mode==='head')assert.equal(await page.locator('.question-card [data-action="calculator"]').count(),0);
  await page.locator(exam?'[data-action="submitExam"]':'[data-action="submitPractice"]').click();
}
try{
  for(let attempt=0;;attempt++){try{await verifyAssets();break}catch(error){if(!process.env.LIVE_ORIGIN||attempt>=23)throw error;await new Promise(r=>setTimeout(r,10000))}}
  const configurations=[{name:'chromium-desktop',engine:chromium,width:1280,height:900},{name:'chromium-mobile',engine:chromium,width:390,height:844},{name:'chromium-small',engine:chromium,width:320,height:720},{name:'webkit-mobile',engine:webkit,width:390,height:844}];
  for(const config of configurations){
    const browser=await config.engine.launch({headless:true});
    try{
      const context=await browser.newContext({viewport:{width:config.width,height:config.height},isMobile:config.width<700,hasTouch:config.width<700});
      await context.addInitScript(()=>localStorage.setItem('pabo-rekenklaar-state-v1',JSON.stringify({version:'1.6.3',xp:321,profile:{name:'Variatiecontrole',sound:false,reduceMotion:true},completedLessons:['A1']})));
      const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(15000);
      await page.goto(origin+'/apps/pabo-rekenklaar/');await page.waitForFunction(()=>Boolean(window.PaboRekenklaarQA?.REASONING_DESIGNS?.length));
      assert.equal(await page.evaluate(()=>state.xp),321,'Existing XP lost');assert.deepEqual(await page.evaluate(()=>state.completedLessons),['A1']);
      await page.evaluate(()=>{Math.random=seededRandom(16092026);showView('exam')});await page.locator('#startFullExamBtn').click();
      for(let index=0;index<55;index++){
        if(await page.locator('[data-action="startPart2"]').count())await page.locator('[data-action="startPart2"]').click();
        await layout(page,config.name+' question '+index);await answerQuestion(page,true);
        await page.waitForFunction(i=>activeSession.index>i,index);
      }
      const full=await page.evaluate(()=>({finished:activeSession.finished,correct:activeSession.correct,unique:new Set(activeSession.results.map(r=>variationIdentity(r.question))).size,families:activeSession.variationLedger.families,topics:Object.keys(activeSession.variationLedger.topics).length,history:state.variation.recent.length}));
      assert.equal(full.finished,true);assert.equal(full.correct,55);assert.equal(full.unique,55);assert.equal(full.topics,18);assert.ok(Math.max(...Object.values(full.families))<=3);
      const generators=await page.evaluate(()=>Object.entries(VARIATION_GENERATORS).flatMap(([domain,list])=>list.map(g=>({domain,name:g.fn.name,level:Math.max(...g.levels),topic:g.topic}))));
      for(const descriptor of generators){
        await page.evaluate(descriptor=>{startPractice({domain:descriptor.domain,mode:'non',count:1,difficulty:descriptor.level,topic:descriptor.topic});const g=VARIATION_GENERATORS[descriptor.domain].find(g=>g.fn.name===descriptor.name);const q=finalizeGeneratedQuestion(g.fn(descriptor.level,'non'),{domain:descriptor.domain,mode:'non',requestedLevel:descriptor.level,effectiveLevel:descriptor.level,generator:g});activeSession.current=q;renderSessionQuestion('playArea')},descriptor);
        await layout(page,config.name+' '+descriptor.name);
        if(['genCVariationFence','genDVariationWeighted','genDVariationGraphRate','genDVariationFormulaBudget'].includes(descriptor.name))await page.screenshot({path:path.join(output,config.name+'-'+descriptor.name+'.png'),fullPage:true});
        await answerQuestion(page,false);assert.equal(await page.evaluate(()=>activeSession.results.at(-1).correct),true,descriptor.name+' answer rejected');
        assert.ok(await page.locator('#feedbackBox').innerText(),'Missing worked explanation');
      }
      assert.deepEqual(errors,[],config.name+' browser errors');report.environments.push({name:config.name,fullExam:full,newGeneratorsAnswered:generators.length,errors});
    }finally{await browser.close()}
  }
  report.status='passed';console.log(JSON.stringify(report,null,2));
}catch(error){report.status='failed';report.errors.push(error.stack||error.message);console.error(error);process.exitCode=1}
finally{fs.writeFileSync(path.join(output,'browser-proof.json'),JSON.stringify(report,null,2)+'\n');if(server)await new Promise(r=>server.close(r))}
