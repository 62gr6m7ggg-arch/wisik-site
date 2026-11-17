import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {readMisconceptions} from './lib/pabo-source.mjs';
const root=process.cwd(), read=p=>fs.readFileSync(path.join(root,p),'utf8');
const misconceptions=readMisconceptions(root);
const catalog=JSON.parse(read('public/assets/data/grabbelton-videos.json'));
const selectedCodes=process.env.WISIK_FLIRT_CODES?.split(',').filter(Boolean)||null;
const html=read('public/apps/pabo-rekenklaar/index.html');
assert.match(html,/<script src="\/assets\/js\/pabo-flirt-player\.js\?v=[^" ]+" defer><\/script>/);
assert.ok(!html.includes('async function openDiagnosticFlirt('),'Speler mag niet opnieuw in de rekenbron belanden');
// DOM-double voor de bestaande modale levenscyclus; dit is geen browsertest.
const elements = new Map();
const handlers = {};
let focused = null;
function element(id) {
  if (elements.has(id)) return elements.get(id);
  const classes = new Set();
  const el = {
    id, innerHTML: "", textContent: "", style: {}, dataset: {}, isConnected: true,
    classList: { add: (...v) => v.forEach(x => classes.add(x)), remove: (...v) => v.forEach(x => classes.delete(x)), contains: x => classes.has(x), toggle() {} },
    focus() { focused = id; }, addEventListener() {}, setAttribute() {}, removeAttribute() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
  };
  elements.set(id, el);
  return el;
}
const video = { paused: 0, released: 0, loaded: 0, events: {}, pause() { this.paused++; }, removeAttribute(name) { if (name === "src") this.released++; }, load() { this.loaded++; }, querySelectorAll() { return []; }, addEventListener(name, callback) { this.events[name] = callback; } };
element("modalBody").querySelectorAll = () => element("diagnosticFlirtContent").innerHTML.includes("<video") ? [video] : [];
element("diagnosticFlirtContent").querySelector = selector => selector === "video" ? video : element("flirtError");
element("flirtError").hidden = true;
const context = {
  MISCONCEPTION_CATALOG: misconceptions, escapeHtml: value=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),
  console, URL, URLSearchParams, TextEncoder, crypto: webcrypto, AbortController,
  location: { search: "", href: "https://wisik.nl/apps/pabo-rekenklaar/" },
  performance: { now: () => Date.now() }, navigator: {},
  localStorage: { getItem() { return null; }, setItem() {} }, sessionStorage: { getItem() { return null; }, setItem() {} },
  document: { scripts: [], body: element("body"), documentElement: element("html"), activeElement: element("invitation"), getElementById: element, querySelector() { return null; }, querySelectorAll() { return []; }, addEventListener(name, fn) { handlers[name] = fn; } },
  setTimeout() {}, clearTimeout() {}, requestAnimationFrame(fn) { fn(); }, addEventListener() {},
  fetch: async () => ({ ok: true, json: async () => structuredClone(catalog) }),
};
context.window = context;
vm.createContext(context);
const run = expression => vm.runInContext(expression, context);
vm.runInContext(read("public/assets/js/site-data.js"), context);
vm.runInContext(read("public/assets/js/grabbelton-core.js"), context);
vm.runInContext(fs.readFileSync(path.join(root, "public/assets/js/pabo-flirt-player.js"), "utf8"), context);
vm.runInContext(`
let state={diagnostics:{patterns:{}}};
let activeSession={kind:"practice",answered:true,finished:false};
let modalRevision=0;
function diagnosticFlirtAllowed(code,status){return Boolean(MISCONCEPTION_CATALOG[code] && ["likely","recovering"].includes(status) && activeSession.answered && !activeSession.finished)}
function openModal(title,html){modalRevision++;document.getElementById("modalBody").innerHTML=html}
function closeModal(){modalRevision++;document.getElementById("modalBody").innerHTML=""}
`,context);

for(const name of ["generateQuestion","generateDiagnosticProbe","runQualityAudit","checkResponse"])context[name]=()=>{throw new Error("Spelercontrole mag geen rekenfunctie aanroepen: "+name)};

for(const item of catalog.videos.filter(v=>!selectedCodes||selectedCodes.includes(v.target.misconceptionCode))) {
 const code=item.target.misconceptionCode;
 context.requestedCode=code;
 run('state.diagnostics.patterns[requestedCode]={status:"likely"};');
 const before=run('JSON.stringify({state,activeSession})');
 await context.openDiagnosticFlirt(code);
 const markup=element('diagnosticFlirtContent').innerHTML;
 for(const route of [item.source.url,item.posterSrc,item.captionsSrc,item.transcriptUrl])assert.ok(markup.includes(context.escapeHtml(context.WisikGrabbeltonCore.versionedAssetUrl(route,context.WISIK_SITE_VERSION,item))),code+': verkeerde bron');
 assert.ok(markup.includes(`data-audio-mode="${item.audioMode}"`));
 const track=markup.match(/<track\b[^>]*>/)?.[0];assert.ok(track,code+': ondertitels ontbreken');assert.ok(!/\sdefault(?:\s|=|>)/.test(track),code+': extra ondertitels moeten uitstaan');
 assert.ok(!/autoplay/i.test(markup));
 assert.equal(run('JSON.stringify({state,activeSession})'),before,code+': speler wijzigt leergegevens');
 video.events.error();assert.equal(element('flirtError').hidden,false);
}
// A late catalogue response must not reopen a closed modal.
run('diagnosticFlirtCatalog=null;state.diagnostics.patterns.A01={status:"likely"}');
let respond;context.fetch=()=>new Promise(resolve=>{respond=resolve});
const pending=context.openDiagnosticFlirt('A01');context.closeModal();
respond({ok:true,json:async()=>catalog});await pending;
assert.equal(element('modalBody').innerHTML,'');
context.fetch=async()=>{throw new Error('offline')};
run('diagnosticFlirtCatalog=null;state.diagnostics.patterns.A01={status:"likely"}');
await context.openDiagnosticFlirt('A01');assert.ok(element('diagnosticFlirtContent').innerHTML.includes('kan nu niet worden geladen'));
// De Grabbelton gebruikt een tweede renderer: controleer ook zijn echte trackinstelling.
const grabSource = read("public/assets/js/grabbelton.js");
const renderStart = grabSource.indexOf("  function renderVideo(selection)");
const renderEnd = grabSource.indexOf("\n  function drawVideo()", renderStart);
assert.ok(renderStart >= 0 && renderEnd > renderStart, "Grabbelton-renderer ontbreekt");
function grabElement(tag) {
  return {
    tag, children: [], style: {}, dataset: {}, events: new Map(),
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = children; },
    setAttribute(name, value) { this[name] = value; },
    addEventListener(name, fn) { this.events.set(name, fn); },
    pause() {},
    querySelector(wanted) {
      for (const child of this.children) {
        if (child.tag === wanted) return child;
        const nested = child.querySelector?.(wanted);
        if (nested) return nested;
      }
      return null;
    }
  };
}
const grabResult = grabElement("div");
const grabContext = {
  core: context.WisikGrabbeltonCore, WISIK_SITE_VERSION: context.WISIK_SITE_VERSION,
  document: { createElement: grabElement }, byId: () => grabResult, rememberVideo() {}
};
vm.createContext(grabContext);
vm.runInContext(grabSource.slice(renderStart, renderEnd), grabContext);
for (const code of selectedCodes || catalog.videos.map(v => v.target.misconceptionCode)) {
  const selected = catalog.videos.find(video => video.target.misconceptionCode === code);
  grabContext.renderVideo({ video: selected, reason: "misconception" });
  const player = grabResult.querySelector("video");
  assert.equal(player.dataset.audioMode, selected.audioMode);
  const track = player.querySelector("track");
  assert.equal(track.default, false, `${code}: extra Grabbelton-ondertitels moeten standaard uitstaan`);
  assert.equal(track.kind, "captions");
  assert.equal(track.src, context.WisikGrabbeltonCore.versionedAssetUrl(selected.captionsSrc,context.WISIK_SITE_VERSION,selected));
}

console.log(`Beide spelers: ${(selectedCodes||catalog.videos).length} filmkeuzes, ondertiteling uit, fouten en late respons gecontroleerd; nul rekenopgaven.`);
