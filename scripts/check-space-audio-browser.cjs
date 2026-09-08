// Run from the repository root with Playwright installed. Optional SPACE_BROWSER_BINARY and SPACE_BROWSER_PACKAGE select a local Chromium runtime.
const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const http=require('node:http'),path=require('node:path');
 const server=http.createServer((req,res)=>{let file=path.join(process.cwd(),'public',decodeURIComponent(req.url.split('?')[0]));if(file.endsWith('/'))file+='index.html';try{const bytes=fs.readFileSync(file);const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.m4a':'audio/mp4','.svg':'image/svg+xml'})[ext]||'application/octet-stream');res.setHeader('Content-Length',bytes.length);res.end(bytes)}catch{res.writeHead(404);res.end()}});await new Promise(r=>server.listen(8765,'127.0.0.1',r));
 const binary=process.env.SPACE_BROWSER_PACKAGE?(await import(process.env.SPACE_BROWSER_PACKAGE)).default:undefined;
 const browser=await chromium.launch({executablePath:process.env.SPACE_BROWSER_BINARY,args:(binary?.args||['--no-sandbox']).filter(a=>!a.includes("disable-web-security")&&!a.includes("allow-running-insecure-content")),headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/apps/ruimteklaar/');
 
 await page.locator('.explanation-audio>summary').click();
 await page.locator('.audio-content select').selectOption('1.1');
 const audio=page.locator('audio');
 console.log('initial',await audio.evaluate(a=>({paused:a.paused,preload:a.preload,currentTime:a.currentTime})));
 await audio.evaluate(a=>a.play());
 await page.waitForFunction(()=>document.querySelector('audio').currentTime>.1);
 console.log('playing',await audio.evaluate(a=>({duration:a.duration,paused:a.paused,currentTime:a.currentTime,error:a.error?.message})));
 await page.evaluate(()=>window.previousAudio=document.querySelector('audio'));
 await page.locator('.audio-content select').selectOption('1.2');
 console.log('switched',await page.evaluate(()=>({oldPaused:window.previousAudio.paused,newPaused:document.querySelector('audio').paused,oldSrc:window.previousAudio.getAttribute('src')})));
 await page.locator('audio').evaluate(a=>a.play());
 await page.evaluate(()=>window.previousAudio=document.querySelector('audio'));
 await page.locator('.explanation-audio>summary').click();
 await page.waitForFunction(()=>!document.querySelector('audio'));
 console.log('closed',await page.evaluate(()=>({paused:window.previousAudio.paused,source:window.previousAudio.getAttribute('src')})));
 const assert=require('node:assert/strict');
 assert.deepEqual(errors,[]);
 const checked=[];
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:900});
  for(let lesson=1;lesson<=6;lesson++){
   await page.locator('.level-tile').nth(lesson-1).click();
   const panel=page.locator('.explanation-audio');
   if(!await panel.evaluate(e=>e.open))await panel.locator(':scope>summary').click();
   const select=panel.locator('select');await select.locator('option').nth(1).waitFor({state:'attached'});
   const ids=await select.locator('option').evaluateAll(es=>es.map(e=>e.value).filter(Boolean));
   assert.equal(ids.length,[9,8,8,10,9,6][lesson-1]);
   for(const id of ids){
    await select.selectOption(id);await page.locator('.audio-example h3').waitFor();
    const state=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,bad:/NaN|Infinity/.test(document.querySelector('.audio-example').innerHTML),paused:document.querySelector('audio').paused}));
    assert.ok(state.scroll<=state.width,`${id} at ${width}: horizontal overflow ${state.scroll}`);assert.equal(state.bad,false,id);assert.equal(state.paused,true,id+' autoplay');checked.push({id,width});
   }
   if(width===390){await page.locator('audio').evaluate(a=>a.play());await page.waitForFunction(()=>document.querySelector('audio').currentTime>.1);await page.locator('audio').evaluate(a=>a.pause());}
  }
 }
 await page.locator('.level-tile').first().click();
 await page.getByRole('button',{name:/Kijken in de ruimte/}).click();
 await page.locator('.explanation-audio>summary').click();
 await page.locator('.audio-content select').selectOption('1.1');
 await page.locator('audio').evaluate(a=>a.play());await page.evaluate(()=>window.previousAudio=document.querySelector('audio'));
 while(await page.getByRole('button',{name:'Volgend inzicht',exact:false}).count())await page.getByRole('button',{name:'Volgend inzicht',exact:false}).click();
 await page.getByRole('button',{name:'Zelf proberen',exact:false}).click();
 assert.equal(await page.locator('audio').count(),0);assert.equal(await page.evaluate(()=>window.previousAudio.paused),true);
 assert.deepEqual(errors,[]);
 console.log('PASS: '+checked.length+' fragment/scherm-controles; zes lessen afspeelbaar; geen autoplay; stoppen bij wisselen, sluiten en oefenen; geen JavaScript-fouten.');
 if(process.env.SPACE_BROWSER_REPORT)fs.writeFileSync(process.env.SPACE_BROWSER_REPORT,JSON.stringify({status:'passed',examples:50,widths:[320,390,1280],renders:checked.length,playedLessons:6,errors},null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
