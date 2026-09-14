import fs from 'node:fs';import assert from 'node:assert/strict';
const root='tools/ruimteklaar-review/';
let source=fs.readFileSync(root+'main.tsx','utf8');
const old="const p=new URLSearchParams();if(next){p.set('kind',next.kind);p.set('id',next.id)}history.replaceState(null,'',BASE+(p.size?'?'+p.toString():''))";
assert.ok(source.includes(old));source=source.replace(old,'');
const effect=` // Coalesce rapid navigation: WebKit limits history writes. Selecting an item remains immediate.
 useEffect(()=>{const timer=setTimeout(()=>{const p=new URLSearchParams();if(item){p.set('kind',item.kind);p.set('id',item.id)}try{history.replaceState(null,'',BASE+(p.size?'?'+p.toString():''))}catch{setNotice('De opgave is geopend. Gebruik Kopieer vraagverwijzing als de adresbalk niet wordt bijgewerkt.')}},250);return()=>clearTimeout(timer)},[item]);
`;
assert.ok(source.includes(' function storeSelection('));source=source.replace(' function storeSelection(',effect+' function storeSelection(');fs.writeFileSync(root+'main.tsx',source);
fs.appendFileSync(root+'review.css','\n/* Native WebKit text fields must be allowed to shrink with the review grid. */\n.review-content .answer-area,.review-content .numeric-label,.review-content .working-label{min-width:0;max-width:100%}\n.review-content input,.review-content textarea{min-width:0;max-width:100%;box-sizing:border-box}\n.review-content .view-buttons{min-width:0;max-width:100%}\n');
let test=fs.readFileSync(root+'test-browser.mjs','utf8');
const needle='document:await activePage?.content()';assert.ok(test.includes(needle));
test=test.replace(needle,"overflow:await activePage?.evaluate(()=>Array.from(document.querySelectorAll('body *')).map(e=>({tag:e.tagName,classes:e.className,rect:e.getBoundingClientRect().toJSON()})).filter(e=>e.rect.right>innerWidth+1||e.rect.left< -1).slice(0,25)).catch(()=>[]),document:await activePage?.content()");
const resize='await page.waitForTimeout(120);';assert.ok(test.includes(resize));
test=test.replace(resize,`await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth+1,null,{timeout:2000}).catch(async()=>{const d=await page.evaluate(()=>({innerWidth,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,scale:visualViewport?.scale,elements:Array.from(document.querySelectorAll('body,body *')).map(e=>({tag:e.tagName,classes:String(e.className),scroll:e.scrollWidth,client:e.clientWidth,right:e.getBoundingClientRect().right,left:e.getBoundingClientRect().left})).filter(e=>e.scroll>e.client+1||e.right>innerWidth+1||e.left< -1).slice(0,40)}));throw new Error('Responsive overflow '+JSON.stringify(d))});`);
fs.writeFileSync(root+'test-browser.mjs',test);
console.log('Coalesced browser URL updates and constrained native input widths without clipping content.');
