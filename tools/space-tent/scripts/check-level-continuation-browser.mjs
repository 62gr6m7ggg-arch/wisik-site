import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {build} from 'esbuild';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=await build({stdin:{contents:"export * as M from './app/model';export * as C from './app/course-construction';export * as L from './app/local-progress';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {M,C,L}=await import('data:text/javascript;base64,'+Buffer.from(out.outputFiles[0].text).toString('base64'));
let serial=0;
const event=(type,payload)=>L.normalizeEvent({id:'next-test-'+String(++serial).padStart(8,'0'),at:serial,type,payload});
const answer=(id,context='practice',sessionId='test')=>event('answer',{questionId:id,answer:M.QUESTIONS[id].answer,context,sessionId,helped:false,working:'Een uitgewerkte berekening.'});
function construction(task,submitted=true,correct=true,helped=false){return event('construction',{taskId:task.id,points:{...task.points,...task.solutionPoints},lines:task.targetSegments.map(([a,b],i)=>({id:'line-'+i,name:'L'+i,a,b})),reason:correct?task.reason.answer:task.reason.options.find(o=>o.id!==task.reason.answer).id,helped,submitted,drawingLocked:true});}
function history(task,correct=true,helped=false){const events=[];for(let level=1;level<=task.level;level++){
 for(const b of M.blocksForLevel(level)){events.push(...b.questionIds.map(id=>answer(id)),event('block',{blockId:b.id}));}
 if(level<task.level){events.push(...M.CHECKS[level].map(id=>answer(id,'check','level-'+level)),event('paper',{level:String(level),checks:['figure','relations','intersection','reason']}));}
 for(const t of C.CONSTRUCTION_TASKS.filter(t=>t.level===level)){if(t.id===task.id){events.push(construction(t,false,correct,helped));return events;}events.push(construction(t));}
}return events;}
const root=path.resolve('.space-dist');
const server=http.createServer((req,res)=>{let file=path.join(root,new URL(req.url,'http://localhost').pathname.replace(/^\/apps\/ruimteklaar\//,''));if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}/apps/ruimteklaar/`,errors=[],results=[];

const output=path.resolve('.continuation-browser');fs.mkdirSync(output,{recursive:true});
function completed(level){const events=[];for(let l=1;l<=level;l++){
 for(const b of M.blocksForLevel(l))events.push(...b.questionIds.map(id=>answer(id)),event('block',{blockId:b.id}));
 events.push(...(M.CHECKS[l]||[]).map(id=>answer(id,'check','level-'+l)),event('paper',{level:String(l),checks:['figure','relations','intersection','reason']}));
 for(const t of C.CONSTRUCTION_TASKS.filter(t=>t.level===l))events.push(construction(t));
}return events;}
let browser,currentPage;
try{for(const [name,engine,width,mobile] of [['desktop',chromium,1280,false],['mobile',chromium,390,true],['webkit-mobile',webkit,390,true]]){
 browser=await engine.launch({headless:true});const context=await browser.newContext({viewport:{width,height:844},isMobile:mobile,hasTouch:mobile});const page=await context.newPage();currentPage=page;page.on('pageerror',e=>errors.push(e.message));
 const button=label=>page.getByRole('button',{name:label,exact:true});
 async function seed(events,level){await page.goto(url);await page.evaluate(({key,events})=>localStorage.setItem(key,JSON.stringify({format:'wisik-space-tent-progress',version:1,events})),{key:L.LOCAL_PROGRESS_KEY,events});await page.reload();await page.locator('.level-tile').nth(level-1).click();}
 async function fillPaper(){await button('Mijn werk controleren').click();for(const box of await page.locator('.paper-checks [role=checkbox]').all())await box.check();}
 for(let level=1;level<=6;level++){
  await seed(completed(level).filter(e=>!(e.type==='paper'&&String(e.payload.level??1)===String(level))),level);
  await page.locator('.finishing-tasks button').filter({hasText:'Op papier toepassen'}).click();
  assert.equal(await button('Doorfeesten naar level '+(level+1)).count(),0);
  await fillPaper();await button('Zelfcontrole vastleggen').click();
  const next=button('Doorfeesten naar level '+(level+1));await next.waitFor();
  assert.equal(await button('Zelfcontrole vastleggen').count(),0);
  await next.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,name+'-paper-level-'+level+'.png')});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await next.click();const first=M.blocksForLevel(level+1)[0];
  if(first)await page.getByRole('heading',{name:first.title,exact:true}).waitFor();else await page.getByRole('heading',{name:'Alle stof, zelfstandig toegepast.',exact:true}).waitFor();
  results.push({environment:name,level,paperLast:true});
 }
 // Paper before the levelcheck continues within the same level.
 await seed(completed(1).filter(e=>e.type!=='paper'&&!(e.type==='answer'&&e.payload.context==='check')),1);
 await page.locator('.finishing-tasks button').filter({hasText:'Op papier toepassen'}).click();await fillPaper();await button('Zelfcontrole vastleggen').click();
 await button('Verder met dit level').click();await button('Begin de levelcheck').waitFor();assert.equal(await button('Doorfeesten naar level 2').count(),0);
 // A passed check can be the last requirement; reopening saved results also works.
 await seed(completed(1),1);await page.locator('.finishing-tasks button').filter({hasText:'Zelfstandige levelcheck'}).click();
 await button('Doorfeesten naar level 2').click();await page.getByRole('heading',{name:M.blocksForLevel(2)[0].title,exact:true}).waitFor();
 // Saved paper shows its continuation without rechecking or saving again.
 await seed(completed(1),1);await page.locator('.finishing-tasks button').filter({hasText:'Op papier toepassen'}).click();await button('Doorfeesten naar level 2').waitFor();
 // A construction can be the last requirement.
 const task=C.CONSTRUCTION_TASKS.find(t=>t.level===2);
 await seed([...completed(2).filter(e=>!(e.type==='construction'&&e.payload.taskId===task.id)),construction(task,false)],2);
 await page.locator('.finishing-tasks button').filter({hasText:task.title}).click();await button('Constructie en onderbouwing inleveren').click();
 await button('Doorfeesten naar level 3').click();await page.getByRole('heading',{name:M.blocksForLevel(3)[0].title,exact:true}).waitFor();
 // A learning block can also be the final requirement.
 const last=M.blocksForLevel(1).at(-1);
 await seed(completed(1).filter(e=>!(e.type==='block'&&e.payload.blockId===last.id)),1);
 await page.locator('.block-row').filter({hasText:last.title}).click();await button('Blok afronden').click();
 await button('Doorfeesten naar level 2').click();await page.getByRole('heading',{name:M.blocksForLevel(2)[0].title,exact:true}).waitFor();
 // The completed top level has no fictitious level 8.
 const summit=completed(6);
 for(const t of C.CONSTRUCTION_TASKS.filter(t=>t.level===7))summit.push(construction(t));
 for(const key of ['7a','7b']){
  summit.push(...M.CHECKS[key].map(id=>{const e=answer(id,'check',key);return {...e,at:e.at+(key==='7b'?M.RETENTION_MS:0)}}));
  summit.push(event('paper',{level:key,checks:['figure','relations','intersection','reason']}));
 }
 assert.equal(M.deriveProgress(summit).levels[7].passed,true);
 await seed(summit,7);await button('Papierwerk B').click();await button('Bekijk je topniveau').click();
 await page.getByRole('heading',{name:'Topniveau behaald.',exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:/Doorfeesten naar level 8/}).count(),0);
 // Saving must succeed before offering a continuation.
 await seed(completed(1).filter(e=>e.type!=='paper'),1);await page.locator('.finishing-tasks button').filter({hasText:'Op papier toepassen'}).click();await fillPaper();
 await page.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new Error('storage full')}});
 await button('Zelfcontrole vastleggen').click();await button('Opnieuw opslaan').waitFor();assert.equal(await button('Doorfeesten naar level 2').count(),0);
 await page.evaluate(()=>{Storage.prototype.setItem=window.originalSetItem});await button('Opnieuw opslaan').click();await button('Doorfeesten naar level 2').waitFor();
 await browser.close();browser=null;
}assert.deepEqual(errors,[]);fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({status:'passed',results,guards:['unfinished level stays in level','paper, check and construction as last requirement','reopening saved paper','failed save and successful retry'],errors},null,2));}
catch(error){if(currentPage)await currentPage.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});fs.writeFileSync(path.join(output,'failure.json'),JSON.stringify({results,errors,error:String(error)},null,2));throw error;}
finally{if(browser)await browser.close();server.close();}
