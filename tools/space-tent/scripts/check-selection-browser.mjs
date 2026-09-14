import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {build} from 'esbuild';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=process.cwd(),out=path.join(root,'.selection-browser');fs.mkdirSync(out,{recursive:true});
const tasks=JSON.parse(fs.readFileSync('app/construction-tasks.json','utf8')).tasks;
const fixture=`import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import Workbench from './app/workbench';import ConstructionLab from './app/construction-lab';import {CONSTRUCTION_TASKS} from './app/course-construction';
function App(){const [events,setEvents]=useState(()=>JSON.parse(localStorage.getItem('selection-test-events')||'[]'));window.__selectionEvents=events;const task=new URLSearchParams(location.search).get('task');const save=async(type,payload)=>{await new Promise(r=>setTimeout(r,40));const event={id:crypto.randomUUID(),type,payload,at:Date.now()};setEvents(previous=>{const next=[...previous,event];localStorage.setItem('selection-test-events',JSON.stringify(next));return next});return true};return <div className="app-shell">{task==='legacy'?<Workbench save={save} onBack={()=>{}}/>:<ConstructionLab task={CONSTRUCTION_TASKS.find(t=>t.id===task)||CONSTRUCTION_TASKS[0]} events={events} save={save} onBack={()=>{}}/>}</div>};createRoot(document.getElementById('root')).render(<App/>);`;
await build({stdin:{contents:fixture,loader:'tsx',resolveDir:root},absWorkingDir:root,tsconfig:'tsconfig.json',bundle:true,platform:'browser',format:'esm',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},outfile:path.join(out,'test.js')});
const css=fs.readdirSync('.space-dist/assets').find(f=>f.endsWith('.css'));
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/${css}"><div id="root"></div><script type="module" src="/test.js"></script></html>`);
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost'),rel=decodeURIComponent(url.pathname);let file=rel==='/test.js'?path.join(out,'test.js'):rel==='/test'?path.join(out,'index.html'):path.join(root,'.space-dist',rel.replace(/^\/apps\/ruimteklaar\//,'/'));if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const results=[],errors=[];let browser;
const configurations=[{name:'chromium-desktop',engine:chromium,width:1280,height:900,mobile:false},{name:'chromium-mobile',engine:chromium,width:390,height:844,mobile:true},{name:'webkit-mobile',engine:webkit,width:390,height:844,mobile:true}];
try{
for(const config of configurations){
 browser=await config.engine.launch({headless:true});const context=await browser.newContext({viewport:{width:config.width,height:config.height},isMobile:config.mobile,hasTouch:config.mobile});const page=await context.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(config.name+': '+e.message));
 const point=n=>page.locator('.selection-controls .point-tray').getByRole('button',{name:n,exact:true});
 const tap=async n=>{if(config.mobile)await point(n).tap();else await point(n).click();};
 const pair=async(a,b)=>{await tap(a);await tap(b);};
 const action=a=>page.locator(`[data-action="${a}"]`);
 const settle=()=>page.waitForFunction(()=>!document.querySelector('.selection-controls .point-tray button:disabled'));
 const chosen=()=>page.locator('.selection-caption').innerText();
 const drawn=()=>page.locator('.drawing-panel svg .drawn-line').count();
 const open=async task=>{await page.goto(base+'/test?task='+task);await page.evaluate(()=>localStorage.clear());await page.reload();await point('A').waitFor();const stage=await page.locator('.geometry-stage').first().boundingBox(),controls=await page.locator('.selection-controls').boundingBox();if(config.width>=1000){assert.ok(controls.x>=stage.x+stage.width,'Desktop controls beside figure');assert.ok(controls.y<stage.y+stage.height,'Desktop controls and figure overlap vertically')}else assert.ok(controls.y>=stage.y+stage.height-1&&controls.y-(stage.y+stage.height)<60,'Narrow screen controls follow figure');};
 const lineByName=async text=>{await page.locator('.selection-line-list summary').click();await page.locator('.selection-line-list').getByRole('button',{name:text}).click();};
 const undo=async()=>{await page.locator('.drawing-footer').getByRole('button').click();await settle();};
 const screenshot=async label=>{await page.screenshot({path:path.join(out,config.name+'-'+label+'.png'),fullPage:true});};
 // Every course construction, including both fixed independent construction exams.
 for(const task of tasks){
  await open(task.id);const [a,b]=task.edges[0];
  const initial=await page.evaluate(()=>window.__selectionEvents.length);
  await pair(a,b);assert.ok((await chosen()).includes(task.edges[0]));
  assert.equal(await drawn(),0);assert.equal(await page.evaluate(()=>window.__selectionEvents.length),initial,'Selecting must not persist a construction or help event');
  await action('extend').click();await settle();assert.equal(await drawn(),1);
  const event=await page.evaluate(()=>window.__selectionEvents.at(-1));assert.equal(event.payload.helped,false);assert.equal(event.payload.submitted,false);assert.equal(event.payload.lines[0].infinite,true);
  await pair(b,a);assert.equal(await action('extend').isDisabled(),true);assert.equal(await drawn(),1);
  await undo();assert.equal(await drawn(),0);
  await pair(a,b);await action('parallel').click();assert.ok((await chosen()).includes('blijft geselecteerd'));await page.getByRole('button',{name:'Actie annuleren',exact:true}).click();assert.ok((await chosen()).includes(task.edges[0]));assert.equal(await drawn(),0);
  await action('extend').click();await settle();await page.reload();assert.equal(await drawn(),1);assert.ok((await chosen()).includes('Nog niets'));
  await page.getByRole('button',{name:'Tekening vastleggen',exact:false}).click();await page.waitForFunction(()=>document.querySelector('.geometry-stage .point-hit')?.disabled);assert.equal(await page.locator('.drawing-panel [data-line-id]').count(),0);
  assert.ok((await page.evaluate(()=>window.__selectionEvents)).every(e=>!e.payload.submitted));
  if(task.exam)assert.equal(await page.getByRole('button',{name:'Rondkijken',exact:true}).count(),0);
  results.push({environment:config.name,task:task.id,checks:'pair, reverse, one-click extension, no duplicate, undo, cancel, reload, drawing lock, no early grading or support'});
 }
 // Complete both legacy variants with the new control sequence.
 await open('legacy');
 for(let variant=0;variant<2;variant++){
  if(variant)await page.getByRole('button',{name:'Andere variant',exact:true}).click();
  await pair('P','Q');await action('segment').click();await settle();
  await pair('Q','R');await action('segment').click();await settle();
  await pair('P','Q');await action('parallel').click();await tap('R');await settle();assert.equal(await drawn(),3);
  await lineByName(/door R/);await action('intersect').click();await pair('D','H');await settle();await point('S').waitFor();
  await pair('R','S');await action('segment').click();await settle();await pair('S','P');await action('segment').click();await settle();
  await page.getByRole('button',{name:'Controleer doorsnede',exact:true}).click();await page.getByRole('radio').nth(1).check();await page.getByRole('button',{name:'Rond de constructie af',exact:true}).click();await page.getByRole('heading',{name:'Een complete doorsnede.',exact:true}).waitFor();
  const last=await page.evaluate(()=>window.__selectionEvents.at(-1));assert.equal(last.payload.helped,false);assert.equal(last.payload.variant,variant);
  results.push({environment:config.name,task:'legacy-'+variant,checks:'complete independent construction and final verification'});
 }
 // A finite segment must be extended explicitly before an exterior intersection.
 await open('legacy');await pair('P','Q');await action('segment').click();await settle();
 await pair('P','Q');await action('intersect').click();await pair('A','B');await settle();assert.match(await page.locator('.drawing-panel .status-message').innerText(),/Verleng/);assert.equal(await point('S').count(),0);
 await page.getByRole('button',{name:'Selectie wissen',exact:true}).click();await pair('P','Q');await action('extend').click();await settle();await pair('A','B');await action('extend').click();await settle();
 await pair('P','Q');await action('intersect').click();await pair('A','B');await settle();await point('S').waitFor();await screenshot('exterior-intersection');
 if(await page.getByRole('button',{name:'Selectie wissen',exact:true}).isEnabled())await page.getByRole('button',{name:'Selectie wissen',exact:true}).click();
 // Crossing in a projection is not an intersection in space; parallel carriers also fail.
 await pair('A','B');await action('intersect').click();await pair('C','G');await settle();assert.match(await page.locator('.drawing-panel .status-message').innerText(),/geen uniek/);
 results.push({environment:config.name,task:'geometric-guards',checks:'explicit extension before exterior intersection; skew lines rejected'});
 // Midpoint and foot share the same selection-first controller.
 const ordinary=tasks.find(t=>!t.exam&&t.points.A&&t.points.B&&t.points.C);await open(ordinary.id);
 await pair('A','C');await action('midpoint').click();await settle();assert.equal(await drawn(),0);await point('S').waitFor();await undo();
 await pair('A','C');await action('segment').click();await settle();await pair('A','C');await action('foot').click();await tap('B');await settle();await point('S').waitFor();
 let evt=await page.evaluate(()=>window.__selectionEvents.at(-1));assert.equal(evt.payload.helped,false);assert.equal(evt.payload.lines.length,1);
 await screenshot('controls');
 // Real point hits in the diagram and a direct line hit, with an ambiguity chooser if needed.
 await open(ordinary.id);await page.getByRole('button',{name:'Punt A',exact:true}).click();await page.getByRole('button',{name:'Punt B',exact:true}).click();assert.match(await chosen(),/AB/);await page.getByRole('button',{name:'Selectie wissen',exact:true}).click();
 const target=page.locator('[data-line-id="edge-AB"]');await target.scrollIntoViewIfNeeded();const mid=await target.evaluate(el=>{const ps=el.getAttribute('points').split(' ').map(p=>p.split(',').map(Number));const svg=el.ownerSVGElement,r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return {x:r.left+(ps[0][0]+ps[1][0])/2*r.width/v.width,y:r.top+(ps[0][1]+ps[1][1])/2*r.height/v.height}});
 if(config.mobile)await page.touchscreen.tap(mid.x,mid.y);else await page.mouse.click(mid.x,mid.y);
 if(await page.locator('.line-pick-options').count())await page.locator('.line-pick-options').getByRole('button',{name:'AB',exact:true}).click();assert.match(await chosen(),/AB/);
 // The explicit exploration mode never edits the construction or selects a point while dragging.
 await page.getByRole('button',{name:'Selectie wissen',exact:true}).click();await page.getByRole('button',{name:'Rondkijken',exact:true}).click();const stage=page.locator('.geometry-stage').first();await stage.scrollIntoViewIfNeeded();const box=await stage.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+55,box.y+box.height/2+25,{steps:5});await page.mouse.up();assert.ok((await chosen()).includes('Nog niets'));assert.equal(await drawn(),0);await page.getByRole('button',{name:'Construeren',exact:true}).click();
 // Keyboard and narrower screens: focusable targets and no horizontal overflow.
 await point('A').focus();await page.keyboard.press('Enter');await point('B').focus();await page.keyboard.press('Space');assert.match(await chosen(),/AB/);
 for(const width of config.mobile?[320,390]:[760,1280]){await page.setViewportSize({width,height:config.height});await page.waitForTimeout(100);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),config.name+' overflows '+width);for(const btn of await page.locator('.selection-actions button').all()){const b=await btn.boundingBox();assert.ok(b.height>=43.5);}}
 results.push({environment:config.name,task:'interaction',checks:'midpoint, foot, real point/line hits, drag separation, keyboard, 44px actions, no horizontal overflow'});
 await page.goto(base+'/apps/ruimteklaar/');await page.getByText('Ruimteklaar',{exact:false}).first().waitFor();assert.equal(await page.locator('#root').innerHTML()==='',false);
 await browser.close();browser=null;
}
assert.deepEqual(errors,[],'Browser exceptions');
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({status:'passed',results,errors,limitations:['Browser automation on Linux, not a physical iPhone or Safari session.','Not an empirical usability or learning-effect study.']},null,2));console.log(JSON.stringify({status:'passed',scenarios:results.length,environments:configurations.map(c=>c.name)},null,2));
}finally{if(browser)await browser.close();server.close();}
