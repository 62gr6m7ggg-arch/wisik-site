import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {REVIEW_ROOT} from '../server/ruimteklaar-test-auth.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pages=['public/index.html','public/hbo/space-tent/index.html'];
const context={window:{}};vm.runInNewContext(read('public/assets/js/site-data.js'),context);
const tool=context.window.WISIK_TOOLS.find(t=>t.id==='ruimteklaar');
assert.equal(tool.artistEntrance.url,REVIEW_ROOT);assert.equal(tool.artistEntrance.label,'artiesten-ingang');
for(const name of pages){
 const html=read(name),entries=[...html.matchAll(/<a\b[^>]*data-artist-entrance="ruimteklaar"[^>]*>[\s\S]*?<\/a>/g)];
 assert.equal(entries.length,1,name);const markup=entries[0][0];
 assert.ok(markup.includes('href="'+REVIEW_ROOT+'"'));assert.ok(markup.includes('artiesten-ingang'));
 assert.ok(markup.includes('space-doorbell'));assert.doesNotMatch(markup,/onclick|password|factor|priem|exponent|autoplay|<audio/i);
 assert.ok(html.includes('data-venue-id="ruimteklaar"'));
}
assert.equal(tool.maturity,'mainstage');assert.equal(tool.status,'open');
assert.equal(tool.appUrl,'/apps/ruimteklaar/');assert.equal(tool.productUrl,'/hbo/space-tent/');
assert.ok(read('public/_redirects').includes('/rafelrand/space-tent/ /hbo/space-tent/ 301'));
assert.ok(!read('public/rafelrand/index.html').includes('data-artist-entrance'));
assert.ok(read('public/rafelrand/index.html').includes('href="/hbo/space-tent/"'));
const home=read(pages[0]);
assert.match(home,/<div id="space-tent" class="space-venue" data-terrain-group data-venue-id="ruimteklaar">\s*<a class="map-zone zone-space [\s\S]*?<\/a>\s*<a class="space-artist-entry"[\s\S]*?<\/a>\s*<figure class="space-billboard space-billboard-map">[\s\S]*?<\/figure>\s*<\/div>/);
const runtime=read('public/assets/js/mobile-terrein.js');assert.ok(runtime.includes('link.closest("[data-terrain-group]") || link'));
const css=read('public/assets/css/styles.css');assert.match(css,/\.space-artist-entry\s*\{[\s\S]*?min-height: 52px/);
assert.ok(css.includes('.space-artist-entry:focus-visible'));assert.ok(css.includes('prefers-reduced-motion'));
// Render the actual registry-card function, also after a simulated MainStage promotion.
const source=read('public/assets/js/site.js');
const body=source.slice(source.indexOf('  const escapeHtml ='),source.indexOf('  function renderToolGrids()'));
const sandbox={};vm.createContext(sandbox);vm.runInContext(body+'\nthis.render = toolCardMarkup;',sandbox);
for(const candidate of [tool,{...tool,route:'HBO',venue:'Space MainStage',maturity:'mainstage',status:'open',productUrl:'/hbo/'}]){
 const html=sandbox.render(candidate);assert.ok(html.includes('data-artist-entrance="ruimteklaar"'));
 assert.ok(html.includes('href="'+REVIEW_ROOT+'"'));assert.equal((html.match(/space-doorbell/g)||[]).length,1);
}
for(const other of context.window.WISIK_TOOLS.filter(t=>t.id!=='ruimteklaar'))assert.ok(!sandbox.render(other).includes('data-artist-entrance'));
console.log('Spacetent artiesten-ingang: vaste testroute, hoofdpodium en productpagina, verplaatsbare tentgroep, statusonafhankelijke attractiekaart, aanraakdoel en geen inloghints gecontroleerd.');
