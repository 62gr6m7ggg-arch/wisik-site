import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {handleReview,REVIEW_ROOT as R} from '../../../server/ruimteklaar-test-auth.mjs';
import {assets} from '../../../server/ruimteklaar-test-assets.mjs';

// Exercise the compiled, protected reviewer through a localhost-only adapter.
// The factor code below is synthetic test input, not a production credential.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(root,'../..'),out=path.join(root,'.shape-browser');
fs.mkdirSync(out,{recursive:true});
const course=JSON.parse(fs.readFileSync(path.join(root,'app/course-content.json'),'utf8'));
const questions=course.questions.filter(q=>q.id.startsWith('vorm-'));
const checks=new Set(Object.values(course.checks).flat());
const version=fs.readFileSync(path.join(root,'app/version.ts'),'utf8').match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/)[1];
const report={version,status:'failed',ids:questions.map(q=>q.id),results:[],errors:[],limitations:[
 'Automated Linux browsers and mobile emulation; not a physical iPhone test.',
 'Checks submission, rendering and feedback rules, not the quality of a student-written proof.',
 'Exact mathematical answers are independently tested by the shape coordinate validators.'
]};
let server,browser,stage='setup';
const env={};

async function inspectFigure(page,label,selector='.review-live-component'){
 const result=await page.locator(selector).evaluate(live=>{
  const svgs=[...live.querySelectorAll('svg')];
  const invalid=[];
  for(const svg of svgs){
   const vb=svg.viewBox.baseVal;
   if(svg.hasAttribute('viewBox')&&!(vb.width>0&&vb.height>0&&[vb.x,vb.y,vb.width,vb.height].every(Number.isFinite)))invalid.push('invalid viewBox');
   for(const element of [svg,...svg.querySelectorAll('*')])for(const a of element.attributes){
    if(/NaN|Infinity|undefined/.test(a.value))invalid.push(`${element.tagName}.${a.name}`);
   }
   const box=svg.getBoundingClientRect();
   if(![box.x,box.y,box.width,box.height].every(Number.isFinite))invalid.push('nonfinite rendered bounds');
   // Closed native <details> legitimately give their SVG a zero-size box.
   if(svg.getClientRects().length>0&&!svg.closest('details:not([open])')&&!(box.width>0&&box.height>0))invalid.push('empty visible SVG');
  }
  return {svgs:svgs.length,invalid,overflow:document.documentElement.scrollWidth>innerWidth+1,badText:/\b(?:NaN|undefined|Infinity)\b/.test(live.innerText)};
 });
 assert.ok(result.svgs>0,`${label}: a real SVG figure is rendered`);
 assert.deepEqual(result.invalid,[],`${label}: finite SVG attributes and dimensions`);
 assert.equal(result.overflow,false,`${label}: no horizontal page overflow`);
 assert.equal(result.badText,false,`${label}: no invalid value in visible teaching text`);
 return result.svgs;
}

async function answerQuestion(page,q){
 if(q.type==='numeric'){
  const value=q.decimals===undefined?q.answer[0]:Number(q.answer[0]).toFixed(q.decimals);
  await page.getByLabel('Jouw berekende uitkomst',{exact:true}).fill(value.replace('.',','));
 }else if(q.type==='choice'){
  const option=q.options.find(o=>o.id===q.answer[0]);assert.ok(option,`${q.id}: valid answer option`);
  await page.locator('.answer-area .answer-option').filter({hasText:option.text}).first().click();
 }else if(q.type==='points'){
  const selected=(q.acceptAny||q.answer).slice(0,q.selectCount||q.answer.length);
  for(const name of selected)await page.locator('.answer-area .point-tray').getByRole('button',{name,exact:true}).click();
 }else throw new Error(`${q.id}: unsupported type ${q.type}`);
 if(q.working)await page.locator('.answer-area .working-label textarea').fill('Ik kies een geschikte hulpfiguur en controleer de loodrechte stand vóór mijn berekening.');
 const submit=page.getByRole('button',{name:'Antwoord vastleggen',exact:false});
 assert.ok(await submit.isEnabled(),`${q.id}: complete answer enables submission`);
 await submit.click();await page.locator('.feedback-panel').waitFor();
 await page.locator('.feedback-panel').getByRole('button',{name:'Verder',exact:false}).waitFor();
 assert.equal(await page.locator('.feedback-panel [role=alert]').count(),0,`${q.id}: saved without error`);
}

try{
 assert.ok(questions.length>0,'Merge vorm-* questions into course-content.json and rebuild protected assets before running this test.');
 const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
 execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-subj','/CN=localhost','-keyout',path.join(out,'key.pem'),'-out',path.join(out,'cert.pem')],{stdio:'ignore'});
 server=https.createServer({key:fs.readFileSync(path.join(out,'key.pem')),cert:fs.readFileSync(path.join(out,'cert.pem'))},async(req,res)=>{
  try{
   const url=new URL(req.url,'https://'+req.headers.host);let response;
   if(url.pathname===R.slice(0,-1)||url.pathname.startsWith(R)){
    const chunks=[];for await(const chunk of req)chunks.push(chunk);
    response=await handleReview(new Request(url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)}),env,assets);
   }else{
    let file=path.resolve(repo,'public','.'+decodeURIComponent(url.pathname));
    assert.ok(file.startsWith(path.join(repo,'public')+path.sep),'Only local public assets are served');
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    response=fs.existsSync(file)?new Response(fs.readFileSync(file),{headers:{'Content-Type':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':file.endsWith('.ico')?'image/x-icon':'text/html'}}):new Response('Not found',{status:404});
   }
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){res.writeHead(500);res.end('Local test adapter: '+error.message)}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='https://127.0.0.1:'+server.address().port;
 const representatives=[questions.find(q=>/prism/.test(q.shapeFamily||'')),questions.find(q=>/frustum/.test(q.shapeFamily||''))].filter(Boolean);
 const screenshotIds=new Set(representatives.map(q=>q.id));
 for(const config of [
  {name:'chromium-desktop',engine:chromium,width:1366,height:900,mobile:false},
  {name:'chromium-mobile',engine:chromium,width:390,height:844,mobile:true},
  {name:'webkit-mobile',engine:webkit,width:390,height:844,mobile:true}
 ]){
  const run={environment:config.name,viewport:{width:config.width,height:config.height},status:'failed',questions:[],screenshots:[]};
  report.results.push(run);
  try{
   stage=config.name+' launch';browser=await config.engine.launch({headless:true});
   const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:run.viewport,isMobile:config.mobile,hasTouch:config.mobile});
   const page=await context.newPage();page.setDefaultTimeout(15000);
   page.on('pageerror',error=>report.errors.push({stage,message:error.message}));
   await page.goto(base+R);await page.getByLabel('Wachtwoord',{exact:true}).fill('360 2^3 3^2 5');
   await page.getByLabel('Wachtwoord',{exact:true}).press('Enter');await page.locator('[data-review-mode=true]').waitFor();
   const storageBefore=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}));
   for(const q of questions){
    stage=config.name+' '+q.id;
    await page.getByLabel('Kies een onderdeel',{exact:true}).selectOption('vraag:'+q.id);
    await page.locator(`[data-review-code="${q.id}"]`).waitFor();
    assert.equal(await page.locator('.question-prompt').innerText(),q.prompt,`${stage}: correct source prompt`);
    assert.equal(await page.locator('.review-answer,.feedback-panel,.answer-correct,.answer-verdict,.correct-answer').count(),0,`${stage}: answer remains hidden before submission`);
    assert.ok(!(await page.locator('.review-live-component').innerText()).includes(q.explanation),`${stage}: no premature explanation`);
    const isCheck=checks.has(q.id);
    if(isCheck){
     assert.equal(await page.locator('.exercise-heading .eyebrow').innerText(),'LEVELCHECK',`${stage}: check context preserved`);
     assert.equal(await page.getByRole('button',{name:'Aanwijzing',exact:true}).count(),0,`${stage}: no check hints`);
    }
    assert.ok(await page.locator('.exercise-figure svg').count()>0,`${stage}: course figure present`);
    const initialSvgCount=await inspectFigure(page,stage+' before');
    if(screenshotIds.has(q.id)){
     const filename=config.name+'-'+q.id+'.png';
     await page.locator('.review-live-component').screenshot({path:path.join(out,filename)});run.screenshots.push(filename);
    }
    await answerQuestion(page,q);
    if(isCheck){
     assert.equal(await page.locator('.feedback-panel.neutral').count(),1,`${stage}: deferred neutral check feedback`);
     assert.equal(await page.locator('.answer-correct,.answer-verdict,.correct-answer').count(),0,`${stage}: no premature check correctness`);
     assert.doesNotMatch(await page.locator('.feedback-panel').innerText(),/Dat klopt|Bekijk de redenering|Goed antwoord/);
     assert.ok(!(await page.locator('.review-live-component').innerText()).includes(q.explanation),`${stage}: check explanation stays deferred`);
    }else{
     assert.equal(await page.locator('.feedback-panel.correct').count(),1,`${stage}: supplied correct answer is accepted`);
     assert.ok((await page.locator('.feedback-panel').innerText()).includes(q.explanation),`${stage}: complete teaching feedback shown`);
    }
    const feedbackSvgCount=await inspectFigure(page,stage+' after');
    // Reviewer-only reveal also exercises the check's solution figure, but only
    // after the ordinary check controls and their non-disclosure were verified.
    await page.getByRole('button',{name:'Toon antwoord en uitwerking',exact:true}).click();
    await page.getByLabel('Beoordelaarsuitwerking',{exact:true}).waitFor();
    assert.doesNotMatch(await page.getByLabel('Beoordelaarsuitwerking',{exact:true}).innerText(),/\b(?:NaN|undefined|Infinity)\b/);
    const revealSvgCount=await inspectFigure(page,stage+' reviewer reveal','.review-answer');
    await page.getByRole('button',{name:'Verberg antwoord en uitwerking',exact:true}).click();
    run.questions.push({id:q.id,type:q.type,check:isCheck,status:'passed',initialSvgCount,feedbackSvgCount,revealSvgCount});
   }
   assert.deepEqual(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}})),storageBefore,`${config.name}: reviewer must not modify learner progress`);
   // A real hash deep link survives reload with a fresh, unanswered component.
   const last=questions.at(-1);await page.goto(base+R+'#'+encodeURIComponent('vraag:'+last.id));await page.reload();
   await page.locator(`[data-review-code="${last.id}"]`).waitFor();
   assert.equal(await page.locator('.feedback-panel').count(),0,'Reload clears reviewer-only attempts');
   run.status='passed';await context.close();
  }catch(error){report.errors.push({stage,message:error.stack||error.message})}
  finally{if(browser){await browser.close();browser=undefined}}
 }
 if(report.errors.length===0&&report.results.length===3&&report.results.every(r=>r.status==='passed'))report.status='passed';
}catch(error){report.errors.push({stage,message:error.stack||error.message})}
finally{
 if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));
 for(const name of ['key.pem','cert.pem'])fs.rmSync(path.join(out,name),{force:true});
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({status:report.status,questions:report.ids.length,environments:report.results.length,errors:report.errors.length,result:'.shape-browser/results.json'}));
 if(report.errors.length)console.error(JSON.stringify(report.errors,null,2));
 if(report.status!=='passed')process.exitCode=1;
}
