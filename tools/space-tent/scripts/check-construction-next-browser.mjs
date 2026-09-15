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
let browser;
try{for(const [name,engine,width,mobile] of [['desktop',chromium,1280,false],['mobile',chromium,390,true],['webkit-mobile',webkit,390,true]]){
 browser=await engine.launch({headless:true});const context=await browser.newContext({viewport:{width,height:900},isMobile:mobile,hasTouch:mobile});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 async function open(task,correct=true,helped=false){await page.goto(url);await page.evaluate(({key,events})=>localStorage.setItem(key,JSON.stringify({format:'wisik-space-tent-progress',version:1,events})),{key:L.LOCAL_PROGRESS_KEY,events:history(task,correct,helped)});await page.reload();await page.locator('.finishing-tasks').getByRole('button',{name:task.title+' Construeren',exact:true}).click();await page.getByRole('button',{name:'Constructie en onderbouwing inleveren',exact:true}).waitFor();}
 for(const task of C.CONSTRUCTION_TASKS){await open(task);assert.equal(await page.getByRole('button',{name:'Verder met dit level',exact:true}).count(),0);await page.getByRole('button',{name:'Constructie en onderbouwing inleveren',exact:true}).click();const next=page.getByRole('button',{name:'Verder met dit level',exact:true});await next.waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Verder met dit level')&&!b.disabled));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await next.click();await page.waitForFunction(()=>!document.querySelector('.workbench .success-panel'));const following=C.CONSTRUCTION_TASKS.find(t=>t.level===task.level&&C.CONSTRUCTION_TASKS.indexOf(t)>C.CONSTRUCTION_TASKS.indexOf(task));if(following)await page.getByRole('heading',{name:following.title,exact:true}).waitFor();else if(task.level<7)assert.equal(await page.locator('.workbench').count(),0);else await page.getByText('Alle stof, zelfstandig toegepast.',{exact:true}).waitFor();results.push({environment:name,task:task.id,status:'passed'});}
 const task=C.CONSTRUCTION_TASKS[0];await open(task,false);await page.getByRole('button',{name:'Constructie en onderbouwing inleveren',exact:true}).click();await page.getByRole('heading',{name:'Een volgende poging wordt gerichter.',exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'Verder met dit level',exact:true}).count(),0);
 await open(task);await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new Error('storage full')}});await page.getByRole('button',{name:'Constructie en onderbouwing inleveren',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Verder met dit level',exact:true}).isDisabled(),true);
 await browser.close();browser=null;
}assert.deepEqual(errors,[]);console.log(JSON.stringify({status:'passed',results,guards:['No button before submission','Incorrect submission has no next button','Failed save blocks continuation'],limitations:['Linux browser automation; no physical phone tested']},null,2));}finally{if(browser)await browser.close();server.close();}
