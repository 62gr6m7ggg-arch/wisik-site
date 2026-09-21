import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'tools/space-tent');
const reportPath=path.join(root,'public/assets/data/ruimteklaar-release-audit.json');
const read=relative=>JSON.parse(fs.readFileSync(path.join(source,relative),'utf8'));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>e.name==='node_modules'||e.name.startsWith('.')||e.name.endsWith('.tsbuildinfo')?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const hashes=dir=>Object.fromEntries(walk(dir).map(file=>[path.relative(root,file).replaceAll(path.sep,'/'),hash(file)]));
const version=fs.readFileSync(path.join(source,'app/version.ts'),'utf8').match(/APP_VERSION='([^']+)'/)[1];
const oldBank=read('app/content.json'),course=read('app/course-content.json');
const bank={questions:[...oldBank.questions,...course.questions],blocks:[...oldBank.blocks,...course.blocks]};
const checks={'1':oldBank.checkpointIds,...course.checks};
const constructions=read('app/construction-tasks.json').tasks;
const numeric=bank.questions.filter(q=>q.type==='numeric').length;
const theory=bank.blocks.reduce((n,b)=>n+b.theory.length,0);
const app=fs.readFileSync(path.join(root,'public/apps/ruimteklaar/index.html'),'utf8');
assert.ok(app.includes('Space-tent')&&app.includes(version));
for(const [,url] of app.matchAll(/(?:src|href)="(\/apps\/ruimteklaar\/[^"?]+)"/g))assert.ok(fs.existsSync(path.join(root,'public',url)),url);
assert.match(fs.readFileSync(path.join(source,'space/main.tsx'),'utf8'),/<Ruimteklaar local\s*\/>/,'Public entry must use local progress');

const runs=['check-entry-choice.mjs','check-learning.mjs','check-diagnostic.mjs','check-local-progress.mjs','check-curriculum-contracts.mjs','check-interaction.cjs','check-course.mjs','check-knowledge.cjs'].map(file=>({file,output:execFileSync(process.execPath,[path.join(source,'audit-runtime',file)],{cwd:source,encoding:'utf8',timeout:120000}).trim()}));
const metrics=(file,pattern)=>{
 const match=runs.find(run=>run.file===file).output.match(pattern);
 assert.ok(match,`${file}: missing current test counts`);
 const values=match.slice(1).map(Number);
 assert.ok(values.every(n=>Number.isSafeInteger(n)&&n>0),`${file}: invalid test counts`);
 return values;
};
const [diagnosticAnswerCombinations,resumeChains,checkGroups]=metrics('check-diagnostic.mjs',/Diagnostic checks passed: (\d+) answer combinations, (\d+) resume chains and (\d+) independent check groups\./);
const [questionCardStates,feedbackFigures,deferredTriggers,cameraMovements,projectedScenes]=metrics('check-interaction.cjs',/Interaction SSR checks passed: (\d+) question-card states, (\d+) feedback figures, (\d+) deferred triggers, (\d+) camera movements and (\d+) projected question scenes\./);
const [instructionStates,studyViews,viewingModels,preservedFigures,viewedConstructions,viewedPapers]=metrics('check-interaction.cjs',/Whole-tool viewing checks passed: (\d+) instruction\/repair states, (\d+) explicit study-plane views, (\d+) matching view\/ray models, (\d+) unchanged primary SVGs, all (\d+) construction tasks and (\d+) paper tasks\./);
const [intermediateProjections]=metrics('check-interaction.cjs',/Projection checks passed: (\d+) valid intermediate projections/);
const [testedQuestions,testedNumeric,courseScenes,planePolygons,testedConstructions]=metrics('check-course.mjs',/Course checks passed: (\d+) questions, (\d+) numeric answer keys and rounded inputs, (\d+) scenes, (\d+) plane polygons, (\d+) construction tasks/);
assert.equal(resumeChains,bank.blocks.length);
assert.equal(checkGroups,Object.keys(checks).length);
assert.equal(deferredTriggers,bank.blocks.length);
assert.equal(questionCardStates,bank.questions.length*12);
assert.equal(feedbackFigures,bank.questions.length*2);
assert.equal(instructionStates,theory+bank.blocks.length);
assert.equal(testedQuestions,bank.questions.length);
assert.equal(testedNumeric,numeric);
assert.equal(testedConstructions,constructions.length);
assert.equal(viewedConstructions,constructions.length);
assert.equal(viewedPapers,Object.keys(course.papers).length+1);
const legacyFigures=read('validation/visual-regression-042.json');
assert.equal(preservedFigures,Object.keys(legacyFigures).filter(key=>!key.startsWith('probe-p2/')).length,'Every unchanged legacy figure retains its regression check');

execFileSync(process.execPath,[path.join(root,'scripts/check-space-audio.mjs')],{cwd:root,encoding:'utf8',timeout:120000});
const knowledge=read('app/knowledge/entries.json');
const currentEvidence=relative=>{
 const evidence=read(relative);
 assert.equal(evidence.status,'passed',relative);
 assert.equal(evidence.version,version,`${relative}: stale release evidence`);
 assert.deepEqual(evidence.errors,[],relative);
 return evidence;
};
const knowledgeBrowser=currentEvidence('validation/knowledge-browser-050.json');
assert.equal(knowledge.length,145);
assert.equal(knowledgeBrowser.results.length,5);
assert.ok(knowledgeBrowser.results.every(r=>r.lookupReturn&&r.draftAnswer&&r.constructionAndUndo&&r.camera&&r.searchNotHelp&&r.assistedCheck&&r.reloadedCheck&&r.newIndependentCheck));
assert.ok(knowledgeBrowser.results.some(r=>r.environment==='desktop'&&r.articles===knowledge.length));
assert.ok(knowledgeBrowser.results.some(r=>r.environment==='narrow'&&r.articles===knowledge.length));
assert.ok(knowledgeBrowser.results.some(r=>r.environment==='mobile-webkit'));
const workspaceBrowser=currentEvidence('validation/desktop-workspace-050.json');
for(const environment of ['laptop-short','laptop','small-desktop','monitor','mobile','mobile-narrow','mobile-webkit']){
 const results=workspaceBrowser.results.filter(r=>r.environment===environment);
 assert.deepEqual(results.map(r=>r.task).sort(),constructions.map(t=>t.id).sort(),`${environment}: every construction reviewed`);
 assert.ok(results.every(r=>r.editUndo&&r.sideBySide===!environment.startsWith('mobile')),environment);
}
const freeEntry=currentEvidence('validation/free-entry-054.json');
assert.deepEqual(freeEntry.network,[]);
assert.deepEqual(freeEntry.results.map(r=>r.environment).sort(),['desktop','mobile','narrow','mobile-webkit'].sort());
assert.ok(freeEntry.results.every(r=>r.status==='passed'&&r.levels===7&&r.choiceNotCompletion&&r.reloadChoice&&r.realLearning&&r.guidedReturnPreservesProgress&&r.topStatusGuard&&r.keyboardAndCancel&&r.knowledgeReturn));
const shapeVariation=currentEvidence('validation/shape-variation-060.json');
const newQuestionIds=bank.questions.filter(q=>q.id.startsWith('vorm-')).map(q=>q.id).sort();
assert.ok(newQuestionIds.length>0,'Shape variation must be present in the released question bank');
assert.deepEqual([...shapeVariation.questionIds].sort(),newQuestionIds,'Independent shape validation must cover every new question exactly once');

const report={
 product:'Space-tent · Ruimteklaar',appVersion:version,
 siteVersion:JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version,status:'passed',
 scope:{knowledgeEntries:knowledge.length,questions:bank.questions.length,numeric,blocks:bank.blocks.length,theory,diagnosticRoutes:bank.blocks.length,constructionTasks:constructions.length,legacyConstructionVariants:2,shapeVariationQuestions:newQuestionIds.length,available:'Alle zes leslevels en het toplevel met proeven A en B en papierwerk'},
 checks:{
  knowledge:`${knowledge.length} begrippen uit de zes lessen en het bijbehorende materiaal; uitleg, aanpak, voorbeeld, valkuilen, bronnen en verwante begrippen; zoeken zonder hulpregistratie, uitleg lezen met hulpregistratie; behoud van onafhankelijke eerdere resultaten`,
  voiceOvers:'50 zelfgehoste luistervoorbeelden met leestekst, eigen voorbeeldgegevens en gekoppelde lesblokken; mediavingerafdrukken en loodvoeten gecontroleerd',
  projectionLesson:`${intermediateProjections} tussenstanden: snijpunten van projectiestralen met het tekenvlak onafhankelijk vergeleken met de getoonde projectie; kijkrichting, vlakstand en beeldlengten kloppen bij elkaar; alle hoekpunten passen op vier schermbreedten`,
  unaffectedFigures:`${preservedFigures} hoofd-SVGs uit de oorspronkelijke vragenbank gelijk aan vrijgave 0.4.2; twee standen van het vergelijkingsvoorbeeld doelbewust op dezelfde schermschaal gezet. Nieuwe vormvragen vallen onder de huidige meetkunde- en weergavecontroles, niet onder deze historische gelijkheidsclaim.`,
  wholeToolViewing:`Alle ${bank.blocks.length} blokken, ${instructionStates} uitleg-/hersteltoestanden, ${studyViews} besproken hulpvlakaanzichten, ${viewingModels} kijkrichtingmodellen, ${viewedConstructions} constructietaken en ${viewedPapers} papieropdrachten gecontroleerd; extra hulp verborgen in diagnoses en proeven.`,
  constructionVisuals:`Vaste lijnkleuren bij verlengen en hervatten, unieke SVG-arceringen, gesloten antwoordvlakken en correcte zijvlakken voor alle ${constructions.length} taken; geen automatisch zichtbaar antwoordvlak`,
  diagnosticAnswerCombinations,questionCardStates,feedbackFigures,cameraMovements,projectedScenes,courseScenes,planePolygons,
  fullRoute:'Alle zeven levels bereikbaar via gevalideerde antwoorden, constructies en zelfcontroles; proef B start minstens 24 uur na geslaagde proef A',
  constructionDrafts:'Geen beoordeling of XP vóór expliciet inleveren; hervatten behoudt punten, lijnen en gekozen onderbouwing',
  storage:'Herladen, import/export, ontdubbeling, ongeldige bestanden, opslagfouten, oude voortgang behouden, nul netwerkaanroepen'
 },
 shapeVariation,
 browser:{
  freeEntry,knowledge:knowledgeBrowser,desktopWorkspace:workspaceBrowser,
  historicalEvidence:{
   selectionFirst:{evidenceVersion:'0.4.5',...read('validation/selection-first-045.json')},
   voiceOvers:{evidenceVersion:'0.4.4',environment:'Chromium 149, lokale productiebundel',verified:'50 voorbeelden op 320, 390 en 1280 px; afspelen vanuit alle zes lessen; geen autoplay; stoppen bij wisselen, sluiten en oefenen; geen JavaScript-fouten'}
  },
  limitations:['Geen fysieke iPhone/Safari-test uitgevoerd','Geen empirische validering van leerwinst, moeilijkheid of diagnostische foutpositieven','Schriftelijke redeneringen en papierconstructies berusten op zelfcontrole','Topstatus is geen geauthenticeerd toetsbewijs of garantie voor een tentamencijfer']
 },
 sources:course.sources,runs,releaseChecker:hash(fileURLToPath(import.meta.url)),sourceFiles:hashes(source),
 publicFiles:{...hashes(path.join(root,'public/apps/ruimteklaar')),...hashes(path.join(root,'public/films/ruimteklaar'))}
};
if(process.argv.includes('--write')){
 fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
 console.log('Space-tent controlebewijs vernieuwd.');
}else{
 assert.deepEqual(JSON.parse(fs.readFileSync(reportPath,'utf8')),report,'Space-tent bewijs is verouderd of controles zijn gewijzigd');
 console.log(`Space-tent vrijgavecontrole geslaagd: alle zeven levels, ${diagnosticAnswerCombinations} diagnosecombinaties, ${questionCardStates} kaarttoestanden, ${newQuestionIds.length} nieuwe vormvragen, meetkunde, opslag en bron-/bundelbinding.`);
}
