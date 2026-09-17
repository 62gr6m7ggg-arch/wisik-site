import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const file='public/apps/pabo-rekenklaar/index.html';
execFileSync(process.execPath,['scripts/apply-pabo-variation.mjs'],{stdio:'inherit'});
let html=fs.readFileSync(file,'utf8');
const read=name=>fs.readFileSync(`src/pabo/${name}`,'utf8').trim();
function once(oldText,newText){
  if(html.includes(newText))return;
  if(!html.includes(oldText))throw new Error(`Required Pabo anchor missing: ${oldText.slice(0,130)}`);
  html=html.replace(oldText,newText);
}
function block(name,source,anchor){
  const start=`/* BEGIN PABO ${name} */`,end=`/* END PABO ${name} */`,text=`${start}\n${source}\n${end}`;
  if(html.includes(start)){const a=html.indexOf(start),b=html.indexOf(end,a);if(b<0)throw new Error('Incomplete '+name);html=html.slice(0,a)+text+html.slice(b+end.length)}
  else once(anchor,`${text}\n${anchor}`);
}
block('REASONING DESIGNS',read('reasoning-designs.js'),'const RUBRIC_VARIANTS = Object.freeze({');
once('const RUBRIC_VARIANTS = Object.freeze({','const RUBRIC_VARIANTS = Object.freeze({\n  ...Object.fromEntries(REASONING_DESIGNS.map(s=>[`reasoning.${s.id}`,rubricVariant(`denk-${s.id}`,s.title,RUBRIC_DEMAND[s.demand],s.reason)])),');
block('REASONING ENGINE',read('reasoning-engine.js'),'function almostEqual(a,b,tolerance=1e-9)');
// Replace the old sort methods once. Their replacements live in the reviewed source module.
if(!html.includes('/* BEGIN PABO ORDER POINTER */')){
  html=html.replace(/^function orderItemMarkup\([^\n]*\n/m,'');
  html=html.replace(/^function moveOrderItem\([^]*?^}\n/m,'');
}
block('ORDER POINTER',read('order-pointer.js'),'function renderSessionQuestion(containerId="playArea"){');
block('ORDER POINTER CSS',read('order-pointer.css'),'</style>');
// CSS section marker differs among earlier releases; below uses an exact known CSS anchor.
once('  const ledger=sessionVariation(session),identity=variationIdentity(q);','  const ledger=sessionVariation(session),identity=variationIdentity(q);');
once('applyCalculatorPolicy(q);applyDifficultyRubric(q);applyRequestedPrecisionDisplay(q);attachDiagnosticModels(q);return q;', 'applyCalculatorPolicy(q);applyDifficultyRubric(q);applyRequestedPrecisionDisplay(q);attachDiagnosticModels(q);applyReasoningMetadata(q);return q;');
once('  issues.push(...validateVariationQuestion(q));','  issues.push(...validateVariationQuestion(q));\n  issues.push(...validateReasoningQuestion(q));');
once('variation:{schemaVersion:1,recent:[]},diagnostics:', 'variation:{schemaVersion:1,recent:[]},reasoningExposure:{schemaVersion:1,recent:[]},diagnostics:');
once('    merged.variation=normalizeVariationHistory(parsed.variation);', '    merged.variation=normalizeVariationHistory(parsed.variation);\n    merged.reasoningExposure=normalizeReasoningExposure(parsed.reasoningExposure);');
once('return `<div class="order-list" id="orderList">', 'return `<p id="orderHelp" class="order-help">Sleep aan ☰ of gebruik de pijltjes. Met het toetsenbord: focus op ☰ en gebruik ↑ of ↓.</p><div id="orderStatus" class="sr-only" role="status" aria-live="polite"></div><div class="order-list" id="orderList">');
once('function renderSessionQuestion(containerId="playArea"){','function renderSessionQuestion(containerId="playArea"){\n  cancelOrderDrag();');
once('function renderExamQuestion(){','function renderExamQuestion(){\n  cancelOrderDrag();');
once('function quitSession(){','function quitSession(){\n  cancelOrderDrag();');
once('function markAnswerUI(q,response,correct){','function markAnswerUI(q,response,correct){\n  cancelOrderDrag();');
once('root.querySelectorAll(".order-controls button").forEach(b=>b.disabled=true);','root.querySelectorAll(".order-controls button, .drag-handle").forEach(b=>b.disabled=true);');
const oldDragStart='  let dragIndex=null;';
if(html.includes(oldDragStart)){
  const a=html.indexOf(oldDragStart),b=html.indexOf('\n}',a);if(b<0)throw new Error('Sort handler boundary missing');
  html=html.slice(0,a)+'  bindOrderPointer();'+html.slice(b);
}
once('window.PaboRekenklaarQA=Object.freeze({version:APP_VERSION,', 'window.PaboRekenklaarQA=Object.freeze({version:APP_VERSION,REASONING_DESIGNS,REASONING_GENERATORS,reasoningExpected,validateReasoningQuestion,normalizeReasoningExposure,reasoningExposureRecord,applyReasoningMetadata,');
// Only the product version changes. The site's unrelated components are not rebuilt.
once('const APP_VERSION = "1.7.1";', 'const APP_VERSION = "1.8.0";');
html=html.replace('<title>Pabo Rekenklaar 1.7.1','<title>Pabo Rekenklaar 1.8.0').replaceAll('data-app-version>1.7.1','data-app-version>1.8.0').replace('<span id="homeVersion">1.7.1</span>','<span id="homeVersion">1.8.0</span>');
const release=`  {version:"1.8.0",date:"17 september 2026",title:"Andere denkhandelingen, minder herhaling, echt slepen",items:["36 nieuwe vraagontwerpen: reconstrueren, grenzen bewaken, vergelijken, tegenvoorbeelden, figuren lezen en plannen onder voorwaarden.","Oefenselectie weegt rekenstructuur, denkhandeling, context en presentatie mee, ook over meerdere sessies in dezelfde browser.","Sorteervragen werken via muis of aanraking aan het handvat, via de knoppen en met het toetsenbord. Na nakijken staat de volgorde vast.","Nieuwe antwoorden worden gecontroleerd uit gestructureerde rekendata. Nieuwe teksten leveren niet automatisch een diagnose of flirt op.","Vraagzwaarte blijft een expertvoorspelling. Gerichte herhaling blijft mogelijk als het passende aanbod anders te klein is."]},`;
once('const RELEASE_NOTES = [','const RELEASE_NOTES = [\n'+release);
once('Voor variatie onthoudt de browser ook maximaal 480 vraagvingerafdrukken, zonder extra letterlijke antwoorden.', 'Voor variatie onthoudt de browser ook maximaal 480 vraagvingerafdrukken en 96 sets gehashte kenmerken van vraagaanpakken, zonder extra letterlijke antwoorden. Zo worden ook gelijksoortige aanpakken over meerdere sessies herkend. Bij te weinig passend aanbod kan een aanpak eerder terugkeren; onderwerp en haalbaar niveau blijven leidend.');
fs.writeFileSync(file,html);
for(const file of ['public/assets/js/site-data.js','public/index.html','public/pabo/pabo-rekenklaar/index.html','public/moshpit/index.html']){
  const text=fs.readFileSync(file,'utf8');fs.writeFileSync(file,text.replaceAll('1.7.1','1.8.0'));
}
const browser='scripts/check-pabo-variation-browser.mjs';let text=fs.readFileSync(browser,'utf8');
text=text.replace("await page.waitForFunction(()=>window.PaboRekenklaarQA?.version==='1.7.0');", "await page.waitForFunction(()=>Boolean(window.PaboRekenklaarQA?.REASONING_DESIGNS?.length));");fs.writeFileSync(browser,text);
console.log('Pabo 1.8.0: reasoning source and pointer sorting embedded.');
