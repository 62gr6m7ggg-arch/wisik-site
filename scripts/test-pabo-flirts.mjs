import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import { runFlirtChainAudit } from "./lib/flirt-chain-audit.mjs";
import { auditFlirtContent, verifyFlirtContentReview } from "./lib/flirt-content-audit.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const html = read("public/apps/pabo-rekenklaar/index.html");
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
const catalog = JSON.parse(read("public/assets/data/grabbelton-videos.json"));
const invitation = "Even anders kijken? Mag ik dan even met je flirten?";

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
  console, URL, URLSearchParams, TextEncoder, crypto: webcrypto, AbortController,
  location: { search: "", href: "https://wisik.nl/apps/pabo-rekenklaar/" },
  performance: { now: () => Date.now() }, navigator: {},
  localStorage: { getItem() { return null; }, setItem() {} }, sessionStorage: { getItem() { return null; }, setItem() {} },
  document: { scripts: [{ textContent: script }], body: element("body"), documentElement: element("html"), activeElement: element("invitation"), getElementById: element, querySelector() { return null; }, querySelectorAll() { return []; }, addEventListener(name, fn) { handlers[name] = fn; } },
  setTimeout() {}, clearTimeout() {}, requestAnimationFrame(fn) { fn(); }, addEventListener() {},
  fetch: async () => ({ ok: true, json: async () => structuredClone(catalog) }),
};
context.window = context;
vm.createContext(context);
const run = expression => vm.runInContext(expression, context);
vm.runInContext(read("public/assets/js/site-data.js"), context);
vm.runInContext(read("public/assets/js/grabbelton-core.js"), context);
vm.runInContext(script, context);
context.testCatalog = catalog;
const fixtures = JSON.parse(read("tests/flirt-cases.json"));
const chainAudit = runFlirtChainAudit(context, catalog, fixtures);
assert.deepEqual(runFlirtChainAudit(context, catalog, fixtures), chainAudit, "De ketentest moet met dezelfde seed reproduceerbaar zijn");
const contentAudit = auditFlirtContent(root, catalog, context.PaboRekenklaarQA.MISCONCEPTION_CATALOG);
assert.ok(contentAudit.passed, contentAudit.failures.join("\n"));
const allCodes = Object.keys(context.PaboRekenklaarQA.MISCONCEPTION_CATALOG);
for (const part of ['misconception','catalogItem','video','poster','captions','transcript']) {
  const changed = structuredClone(contentAudit.snapshot);
  changed[0].fingerprints[part] = '0'.repeat(64);
  assert.equal(verifyFlirtContentReview(contentAudit.review, changed, allCodes).passed, false, `Gewijzigd ${part} mag geen oude inhoudsreview erven`);
}
const swapped = structuredClone(contentAudit.snapshot);
[swapped[0].code,swapped[1].code]=[swapped[1].code,swapped[0].code];
assert.equal(verifyFlirtContentReview(contentAudit.review, swapped, allCodes).passed, false, 'Verwisselde codes moeten worden ontdekt');
const changedTitle = structuredClone(contentAudit.snapshot);
changedTitle[0].title = changedTitle[1].title;
assert.equal(verifyFlirtContentReview(contentAudit.review, changedTitle, allCodes).passed, false, 'Verkeerde titel moet worden ontdekt');
const missingReview = structuredClone(contentAudit.review);
missingReview.entries.pop();
assert.equal(verifyFlirtContentReview(missingReview, contentAudit.snapshot, allCodes).passed, false);
const knownMismatch = structuredClone(contentAudit.review);
knownMismatch.entries[0].verdict = 'mismatch'; knownMismatch.entries[0].notes = ['Bekend beeldprobleem: inhoudelijk herstel nodig.'];
assert.equal(verifyFlirtContentReview(knownMismatch, contentAudit.snapshot, allCodes).contentStatus, 'revision-needed', 'Geldige bestandsvingerafdruk mag een inhoudelijk probleem niet groen maken');

// Opzettelijk fout gedrag: bewijst dat de ketentest verkeerde triggers en films werkelijk afvangt.
const originalOutcome = context.recordDiagnosticOutcome;
context.recordDiagnosticOutcome = (...args) => { const result=originalOutcome(...args);return result.kind==='pattern'?{...result,code:'D07'}:result; };
assert.throws(() => runFlirtChainAudit(context,catalog,fixtures), /uitnodiging|film/);
context.recordDiagnosticOutcome = originalOutcome;
const originalMatch = context.matchingDiagnosticFlirt;
context.matchingDiagnosticFlirt = () => catalog.videos[0];
assert.throws(() => runFlirtChainAudit(context,catalog,fixtures), /verkeerde exacte film/);
context.matchingDiagnosticFlirt = originalMatch;
const originalMarkup = context.diagnosticFeedbackMarkup;
context.diagnosticFeedbackMarkup = () => '<button data-diagnostic-flirt="A01">Fout-positieve uitnodiging</button>';
assert.throws(() => runFlirtChainAudit(context,catalog,fixtures), /correct antwoord toont flirt/);
context.diagnosticFeedbackMarkup = originalMarkup;

// Controleer ook de interpretatielaag zelf, niet alleen de selectie uit de catalogus.
for (const item of fixtures.cases) {
  context.rendererCase = item;
  run(`state=deepClone(DEFAULT_STATE);state.diagnostics=freshDiagnostics();activeSession={kind:"practice",answered:true,finished:false};
    for(let variant=0;variant<2;variant++){
      const q=generateDiagnosticProbe(rendererCase.code,variant,"mix"),value=rendererCase.wrong[variant];
      recordDiagnosticOutcome(q,q.type==="mc"?q.options.indexOf(value):value,false);
    }`);
  const before = run('JSON.stringify({state,activeSession})');
  await run('openDiagnosticFlirt(rendererCase.code)');
  const expected = catalog.videos.find(video => video.target.misconceptionCode === item.code);
  context.rendererExpected = expected;
  const markup = element("diagnosticFlirtContent").innerHTML;
  assert.ok(markup.includes(`<h4>${run('escapeHtml(rendererExpected.title)')}</h4>`), `${item.code}: verkeerde getoonde titel`);
  assert.ok(markup.includes(run('escapeHtml(rendererExpected.summary)')), `${item.code}: verkeerde getoonde flirttekst`);
  for (const route of [expected.source.url,expected.posterSrc,expected.captionsSrc,expected.transcriptUrl]) {
    assert.ok(markup.includes(`https://wisik.nl${route}?v=${context.WISIK_SITE_VERSION}`), `${item.code}: speler verwijst naar verkeerde asset ${route}`);
  }
  assert.ok(element("modalBody").innerHTML.includes(`data-start-repair="${item.code}"`), `${item.code}: verkeerde herstelset`);
  run('closeModal()');
  assert.equal(run('JSON.stringify({state,activeSession})'), before, `${item.code}: film wijzigt voortgang`);
}
run('state=deepClone(DEFAULT_STATE);state.diagnostics=freshDiagnostics();');

run('activeSession={kind:"practice",answered:true,finished:false};');
// Werkelijke bewijsopbouw: dezelfde fout herhalen is onvoldoende; een andere controlevraag bevestigt.
run('testQuestion=generateDiagnosticProbe("A01",0,"mix"); testResult=recordDiagnosticOutcome(testQuestion,diagnosticTestResponseFor(testQuestion,"A01"),false);');
assert.equal(run('testResult.status'), "suspected");
assert.ok(!run('diagnosticFeedbackMarkup(testResult,testQuestion)').includes(invitation));
run('testResult=recordDiagnosticOutcome(testQuestion,diagnosticTestResponseFor(testQuestion,"A01"),false);');
assert.ok(!run('diagnosticFeedbackMarkup(testResult,testQuestion)').includes(invitation));
run('testQuestion=generateDiagnosticProbe("A01",1,"mix");testResult=recordDiagnosticOutcome(testQuestion,diagnosticTestResponseFor(testQuestion,"A01"),false);');
assert.equal(run('testResult.status'), "likely");
assert.ok(run('diagnosticFeedbackMarkup(testResult,testQuestion)').includes(invitation));
for (const status of ["none", "signal", "suspected", "recovered"]) assert.equal(run(`diagnosticFlirtAllowed("A01",${JSON.stringify(status)})`), false);
for (const kind of ["exam", "sprint"]) {
  run(`activeSession.kind=${JSON.stringify(kind)}`);
  assert.ok(!run('diagnosticFeedbackMarkup(testResult,testQuestion)').includes(invitation));
  const revision = run("modalRevision");
  await run('openDiagnosticFlirt("A01")');
  assert.equal(run("modalRevision"), revision);
}
run('activeSession.kind="practice";activeSession.answered=false;');
assert.equal(run('diagnosticFlirtAllowed("A01","likely")'), false);
run('activeSession.answered=true;');
assert.equal(run('diagnosticFlirtAllowed("A01","recovering")'), true);

const codes = Object.keys(context.PaboRekenklaarQA.MISCONCEPTION_CATALOG);
assert.equal(codes.length, 30);
for (const code of codes) {
  context.testCode = code;
  assert.equal(run('matchingDiagnosticFlirt(testCatalog,testCode)?.target.misconceptionCode'), code);
}
context.unpublished = structuredClone(catalog);
context.unpublished.videos.find(v => v.target.misconceptionCode === "A01").status = "draft";
assert.equal(run('matchingDiagnosticFlirt(unpublished,"A01")'), null, "Geen willekeurig alternatief voor een ontbrekende exacte flirt");
context.unsafe = structuredClone(catalog);
context.unsafe.videos[0].source.url = "https://untrusted.example/flirt.mp4";
assert.equal(run('matchingDiagnosticFlirt(unsafe,"A01")'), null);

const progressBefore = run('JSON.stringify({state,activeSession})');
await run('openDiagnosticFlirt("A01")');
const playerMarkup = element("diagnosticFlirtContent").innerHTML;
assert.ok(playerMarkup.includes('/A01/flirt.mp4?v=' + context.WISIK_SITE_VERSION));
assert.ok(playerMarkup.includes('controls tabindex="0" playsinline preload="none"'));
assert.ok(!/autoplay/i.test(playerMarkup));
assert.ok(playerMarkup.includes('kind="captions"') && playerMarkup.includes('target="_blank"'));
assert.ok(element("modalBody").innerHTML.includes('data-start-repair="A01"'));
video.events.error();
assert.equal(element("flirtError").hidden, false);
run('closeModal()');
assert.equal(run('JSON.stringify({state,activeSession})'), progressBefore);
assert.ok(video.paused && video.released && video.loaded);
assert.equal(element("modalBody").innerHTML, "");
assert.equal(focused, "invitation");

// Een late netwerkrespons mag een gesloten of vervangen venster niet terugbrengen.
for (const action of ['closeModal()', 'openModal("Instellingen","Ander venster")']) {
  let resolve;
  context.fetch = () => new Promise(done => { resolve = done; });
  run('diagnosticFlirtCatalog=null');
  const pending = run('openDiagnosticFlirt("A01")');
  run(action);
  const markup = element("modalBody").innerHTML;
  resolve({ ok: true, json: async () => structuredClone(catalog) });
  await pending;
  assert.equal(element("modalBody").innerHTML, markup);
}
context.fetch = async () => { throw new Error("offline"); };
run('diagnosticFlirtCatalog=null');
await run('openDiagnosticFlirt("A01")');
assert.ok(element("diagnosticFlirtContent").innerHTML.includes("kan nu niet worden geladen"));
assert.ok(element("modalBody").innerHTML.includes('data-start-repair="A01"'));
assert.equal(run('JSON.stringify({state,activeSession})'), progressBefore);

delete context.WisikGrabbeltonCore;
await run('openDiagnosticFlirt("A01")');
assert.ok(element("diagnosticFlirtContent").innerHTML.includes("kan nu niet worden geladen"));
assert.ok(element("modalBody").innerHTML.includes('data-close-flirt'));
assert.equal(run('JSON.stringify({state,activeSession})'), progressBefore);

// Bestaande klikdelegatie voert de precieze herstelset uit; alleen UI-rendering wordt vervangen.
run('bindEvents();stopTimers=()=>{};showView=()=>{};nextPracticeQuestion=()=>{};');
handlers.click({ target: { closest: selector => selector === "[data-start-repair]" ? { dataset: { startRepair: "A01" } } : null } });
assert.equal(run('activeSession.kind'), "repair");
assert.equal(run('activeSession.diagnosticCode'), "A01");
assert.equal(run('activeSession.total'), 4);
assert.equal(element("modalBackdrop").classList.contains("show"), false);
console.log(`Pabo-flirts geslaagd: ${chainAudit.chains} vaste ketens en gerenderde spelers, ${chainAudit.answerExamples} antwoordchecks, ${chainAudit.negativeExamples} andere fouten, ${chainAudit.modeExclusions} toets-/sprintuitsluitingen; inhoudsreview bewaakt en opzettelijke verwisselingen afgewezen. Inhoudelijk: ${contentAudit.counts.needsRevision} open herstelpunten.`);
