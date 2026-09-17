import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const site = read('public/assets/js/site.js');
const legacy = read('public/assets/js/kladblok-context.js');
const origin = 'https://wisik.nl';
const secret = 'PRIVATE_LEARNING_SENTINEL';
const names = ['Bronpagina','Bronproduct','Productversie','Onderdeel','Pagina','Attractieversie','Attractie of terrein','_subject'];
let assertions = 0;
function equal(actual, expected, label) { assert.equal(actual, expected, label); assertions++; }
function createHarness({href=origin+'/kladblok/', stored={}, referrer='', broken=false}={}) {
  const values = Object.fromEntries(names.map(name=>[name,{value:''}]));
  const notes = {'[data-feedback-source]':{hidden:true,textContent:''},'[data-feedback-context]':{hidden:true,textContent:''}};
  const listeners = [];
  const form = {
    elements:{namedItem:name=>values[name]||null},
    querySelector(selector){const match=selector.match(/^\[name=['"](.+?)['"]\]$/);return match?values[match[1]]||null:notes[selector]||null;},
    addEventListener(name, listener){if(name==='submit')listeners.push(listener);}
  };
  const sandbox = {
    URL, console, window:{location:new URL(href)},
    document:{referrer,querySelector:selector=>selector==='.wisik-direct-feedback-form'?form:null},
    sessionStorage:{getItem(key){equal(key,'wisik-last-attraction-context-v1','geen andere sessiegegevens lezen');if(broken)throw Error('blocked');return typeof stored==='string'?stored:JSON.stringify(stored);}},
    localStorage:{getItem(){throw Error('privacycode mag geen lokale leeropslag lezen');},setItem(){throw Error('privacycode mag geen leeropslag wijzigen');}}
  };
  return {sandbox,form,values,notes,listeners};
}
function runMain(h, source=site) {
  const view = source.match(/const VIEW_LABELS = Object\.freeze\([\s\S]*?\n  \}\);/)?.[0];
  const cleaner = source.match(/const cleanContextValue = [^\n]+/)?.[0];
  assert.ok(view && cleaner, 'werkelijke contextdeclaraties beschikbaar');
  const start = source.indexOf('  function sameOriginFeedbackPage(');
  const end = source.indexOf('  function setupFeedbackForms()', start);
  assert.ok(start>=0 && end>start, 'werkelijke productiefuncties beschikbaar');
  vm.runInNewContext('const WISIK_CONTEXT_KEY="wisik-last-attraction-context-v1";\n'+view+'\n'+cleaner+'\n'+source.slice(start,end)+'\nglobalThis.api={readFeedbackSourceContext,applyFeedbackSourceContext};', h.sandbox, {timeout:1000});
  const context = h.sandbox.api.readFeedbackSourceContext(new URL(h.sandbox.window.location.href));
  equal(Object.keys(context).sort().join(','), 'pageUrl,product,productVersion,view', 'alleen de vier expliciete contextvelden');
  h.sandbox.api.applyFeedbackSourceContext(h.form,context);
  return context;
}
function runLegacy(h, source=legacy){vm.runInNewContext(source,h.sandbox,{timeout:1000});}
const sourcePath = origin+'/apps/pabo-rekenklaar/';
const rawSource = sourcePath+'?antwoord='+secret+'&xp=999#diagnose='+secret;
const cases = [
  {name:'bron-query',href:origin+'/kladblok/?bron='+encodeURIComponent(rawSource), expected:sourcePath},
  {name:'relatieve bron',href:origin+'/kladblok/?bron='+encodeURIComponent('/apps/pabo-rekenklaar/?token='+secret+'#'+secret),expected:sourcePath},
  {name:'oude sessiecontext',stored:{pageUrl:rawSource,answer:secret,xp:999,diagnosis:secret,history:[secret]},expected:sourcePath},
  {name:'referrer',referrer:rawSource,expected:sourcePath},
  {name:'URL-inloggegevens',href:origin+'/kladblok/?bron='+encodeURIComponent('https://user:'+secret+'@wisik.nl/apps/pabo-rekenklaar/?q='+secret),expected:sourcePath},
  {name:'andere origin',href:origin+'/kladblok/?bron='+encodeURIComponent('https://example.org/private?'+secret),expected:''},
  {name:'ander subdomein',stored:{pageUrl:'https://www.wisik.nl/?'+secret},expected:''},
  {name:'protocol-relative externe bron',href:origin+'/kladblok/?bron='+encodeURIComponent('//example.org/?'+secret),expected:''},
  {name:'javascript-schema',stored:{pageUrl:'javascript:alert(1)'},expected:''},
  {name:'blob-schema met eigen origin',stored:{pageUrl:'blob:https://wisik.nl/'+secret},expected:''},
  {name:'ongeldige URL',stored:{pageUrl:'https://['},expected:''},
  {name:'externe referrer',referrer:'https://example.org/?'+secret,expected:''},
  {name:'beschadigde opslag',stored:'{',expected:''},
  {name:'opslag uitgeschakeld',broken:true,expected:''},
  {name:'array in opslag',stored:'[]',expected:''},
  {name:'directe ingang',href:origin+'/kladblok/?antwoord='+secret+'#'+secret,expected:''},
  {name:'eerdere kladblokpagina',referrer:origin+'/kladblok/?antwoord='+secret,expected:''},
  {name:'ongeldige expliciete bron, geldige sessie',href:origin+'/kladblok/?bron=javascript:alert(1)',stored:{pageUrl:rawSource},expected:sourcePath}
];
for(const c of cases){
  const h=createHarness(c);runMain(h);equal(h.values.Bronpagina.value,c.expected,c.name+' modern');
  runLegacy(h);equal(h.values.Pagina.value,c.expected||origin+'/kladblok/',c.name+' vangnet');
  for(const f of ['Pagina','Bronpagina'])if(h.values[f].value){const u=new URL(h.values[f].value);equal(u.origin,origin,c.name+' origin');equal(u.search+u.hash+u.username+u.password,'',c.name+' dataminimaal');}
  assert.ok(!JSON.stringify(h.values).includes(secret),c.name+' geen leergegevens');assertions++;
  for(const submit of h.listeners)submit();
  equal(h.values.Pagina.value,c.expected||origin+'/kladblok/',c.name+' submit');
}
for(const product of ['Pabo Rekenklaar','Space-tent']){
  const href=origin+'/kladblok/?bron='+encodeURIComponent('/apps/ruimteklaar/?xp='+secret)+'&product='+encodeURIComponent(product)+'&productversie=0.5.4&onderdeel=learn&antwoord='+secret;
  const h=createHarness({href,stored:{answer:secret,xp:999,diagnosis:secret}});runMain(h);runLegacy(h);
  equal(h.values.Bronproduct.value,product,'product blijft');equal(h.values.Productversie.value,'0.5.4','versie blijft');equal(h.values.Attractieversie.value,'0.5.4','versies consistent');equal(h.values.Onderdeel.value,'Leren per onderdeel','hoofdonderdeel blijft');equal(h.values['Attractie of terrein'].value,product,'juiste keuzelijstoptie');
  assert.ok(!h.notes['[data-feedback-source]'].hidden);assert.ok(h.notes['[data-feedback-context]'].hidden,'geen dubbele contextmelding');
  assert.ok(h.notes['[data-feedback-source]'].textContent.includes('/apps/ruimteklaar/'));assert.ok(!JSON.stringify(h.values).includes(secret));assertions+=4;
}
// Ook het afzonderlijke vangnet mag geen volledige URL lekken wanneer site.js ontbreekt.
for(const opts of [
  {href:origin+'/kladblok/?bron='+encodeURIComponent(rawSource)+'&attractie=Pabo%20Rekenklaar&appversie=1.8.0',expected:sourcePath},
  {referrer:rawSource,expected:sourcePath},
  {href:origin+'/kladblok/?x='+secret+'#'+secret,expected:origin+'/kladblok/'},
  {href:origin+'/kladblok/?bron='+encodeURIComponent('https://other.example/?'+secret),expected:origin+'/kladblok/'}
]){const h=createHarness(opts);runLegacy(h);equal(h.values.Pagina.value,opts.expected,'zelfstandig vangnet');assert.ok(!JSON.stringify(h.values).includes(secret));assertions++;}
// Bewijs dat de tests de oude lekvariant echt afkeuren, in beide productiecodepaden.
const guarded='return `${url.origin}${url.pathname}`;';
for(const which of ['modern','legacy']){
  let rejected=false;
  try{
    const h=createHarness({href:origin+'/kladblok/?bron='+encodeURIComponent(rawSource)});
    if(which==='modern'){assert.ok(site.includes(guarded));runMain(h,site.replace(guarded,'return url.href;'));assert.equal(h.values.Bronpagina.value,sourcePath);}
    else{assert.ok(legacy.includes(guarded));runLegacy(h,legacy.replace(guarded,'return url.href;'));assert.equal(h.values.Pagina.value,sourcePath);}
  }catch{rejected=true;}
  equal(rejected,true,'negatieve URL-mutatie afgewezen: '+which);
}
const backstage=read('public/backstage/index.html'),form=read('public/kladblok/index.html');
equal((backstage.match(/id="privacy"/g)||[]).length,1,'één terreinbrede privacysectie');
for(const html of [backstage,form])for(const term of ['3 maanden','opvolging','vervolggesprek','30 dagen','FormSubmit'])assert.ok(html.includes(term),'bewaarbeleid bevat '+term);
for(const p of ['public/pabo/pabo-rekenklaar/index.html','public/hbo/space-tent/index.html','public/kladblok/index.html'])assert.ok(read(p).includes('href="/backstage/#privacy"'),p+' verwijst naar centrale privacy');
assert.ok(form.includes('<option value="Space-tent">Space-tent</option>'));
assert.ok(/<input[^>]*name="email"[^>]*>/.test(form));assert.ok(!/<input[^>]*name="email"[^>]*required/.test(form),'email blijft optioneel');
equal((form.match(/<form\b/g)||[]).length,1,'één formulier');
assert.ok(!/localStorage\.(setItem|removeItem|clear)/.test(site.slice(site.indexOf('  function sameOriginFeedbackPage('),site.indexOf('  function setupFeedbackForms()'))));
const config=JSON.parse(read('.github/wisik-main-ruleset.json'));
equal(config.conditions.ref_name.include.join(','),'refs/heads/main','bescherming uitsluitend main');
equal(config.bypass_actors.length,0,'geen bypass-uitzonderingen');
equal(config.rules.find(r=>r.type==='pull_request').parameters.required_approving_review_count,0,'geen onbeschikbare tweede reviewer eisen');
console.log(JSON.stringify({passed:true,scenarioCount:cases.length,assertions,negativeMutations:2,scope:'beide contextpaden, formulier, bewaarbeleid en privacyverwijzingen; ruleset is slechts een importbestand'},null,2));
