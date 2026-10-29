import {VERSION,EXERCISES,IDS} from './content.js?v=1.3.0';
import {REFERENCES} from './references.js?v=1.3.0';
import {drawFigure} from './geometry.js?v=1.3.0';
import {emptyState,loadState,saveState,validateState,mergeState} from './state.js?v=1.3.0';
const $=id=>document.getElementById(id),escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw Error('storage unavailable');},setItem(){throw Error('storage unavailable');}};}
const loaded=loadState(storage);let state=loaded.state,readBlocked=!!loaded.error,current=null,angle=70;
function message(text,error=false){$('storage-message').textContent=text;$('storage-message').classList.toggle('warning',error);}
if(loaded.error)message(loaded.error,true);
const entry=()=>state.exercises[current.id]||(state.exercises[current.id]={notes:'',reflection:'',step:0,help:false,proof:false,check:false});
function persist(){const ok=!readBlocked&&saveState(storage,state);$('save-state').textContent=ok?'Bewaard in deze browser.':'Niet opgeslagen. Download je voortgang voordat je vertrekt.';if(!ok)message('Opslaan in deze browser is niet gelukt. Download je voortgang om je werk te bewaren.',true);return ok;}
function feedbackContext(){const u=new URL('/kladblok/',location.origin);u.searchParams.set('bron',location.href);u.searchParams.set('product','Duotent vlakke meetkunde');u.searchParams.set('productversie',VERSION);u.searchParams.set('onderdeel',current?`${current.id} · ${current.title}`:'Overzicht');$('feedback').href=u.pathname+u.search;}
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();$('main').focus();$('main').scrollIntoView();});
$('version').textContent=VERSION;
const examQuestions=l=>EXERCISES.filter(e=>e.exam===l);
const pdfPath=e=>`pdf/Meetkunde_1_Oefententamen_${e.exam}.pdf`;
$('exam-list').innerHTML=['A','B','C','D'].map(l=>{const qs=examQuestions(l);return `<article><h3>Tentamen ${l}</h3><p class="small">${qs.length?`6 opgaven · ${qs.length} deelvragen<br>Hints en uitleg met figuren`:'Opgaven en uitwerkingen<br>Zelfstandig oefenen op papier'}</p>${qs.length?`<a class="button primary" href="#${qs[0].id}">Open oefenroute ${l}</a>`:''}<a href="pdf/Meetkunde_1_Oefententamen_${l}.pdf" target="_blank" rel="noopener">Open PDF ${l} ↗</a><a href="pdf/Meetkunde_1_Oefententamen_${l}.pdf" download>Download PDF ${l}</a></article>`;}).join('');
$('exercise-select').innerHTML=['A','B','C','D'].map(l=>`<optgroup label="Tentamen ${l}">${examQuestions(l).map(e=>`<option value="${e.id}">${e.id} · ${escape(e.title)}</option>`).join('')}</optgroup>`).join('');
function reflection(){const texts={begin:'Begin bij de denkvraag. Noteer eerst één gegeven waarmee je iets kunt afleiden.',onderbouwen:'Bekijk bij één bewijsstap welke stelling wordt gebruikt. Kun je uitleggen waarom de voorwaarden hier gelden?',uitwerken:'Vergelijk stap voor stap. Zoek de eerste plek waar jouw redenering afwijkt en werk vanaf daar verder.',anders:'Vergelijk de logische onderbouwing, niet alleen de vorm van het voorbeeld. Vraag een medestudent of docent mee te kijken als je twijfelt.',zelf:'Probeer de nieuwe korte oefenvraag zonder terug te kijken. Zo onderzoek je of je het inzicht opnieuw kunt gebruiken.'};$('reflection-feedback').textContent=texts[$('reflection').value]||'';}
function renderStep(){if(!current)return;const e=entry(),n=Math.max(1,Math.min(current.steps.length,e.step||1));e.step=n;const visible=$('proof').open,nShown=visible?n:0;
 $('figure').innerHTML=drawFigure(current.figure,nShown,angle);$('figure-state').textContent=visible?`Uitleg · stap ${n} van ${current.steps.length}`:'Gegeven situatie';
 $('step-count').textContent=`${n} / ${current.steps.length}`;$('step-title').textContent=current.steps[n-1][0];$('step-text').textContent=current.steps[n-1][1];$('step-back').disabled=n===1;$('step-next').disabled=n===current.steps.length;
 $('alternative').hidden=!current.alternative||n!==current.steps.length;$('alternative').textContent=current.alternative||'';
 $('explore').hidden=!(visible&&n===current.steps.length&&['altitude','locus','c-motion','c-motionMidpoint'].includes(current.figure));
 if($('figure-dialog').open){$('large-figure').innerHTML=$('figure').innerHTML;$('large-caption').textContent=visible?`${n}. ${current.steps[n-1][0]} — ${current.steps[n-1][1]}`:'Gegeven situatie. Open de redenering om hulplijnen en bewijsstappen te zien.';$('large-back').disabled=!visible||n===1;$('large-next').disabled=!visible||n===current.steps.length;}
}
function route(){const id=location.hash.slice(1);current=EXERCISES.find(e=>e.id===id)||null;$('home').hidden=!!current;$('exercise').hidden=!current;
 if(!current){$('resume').hidden=!state.last;if(state.last){$('resume').href='#'+state.last;$('resume').textContent='Verder met '+state.last+' →';}document.title='Duotent vlakke meetkunde · Wisik';feedbackContext();return;}
 state.last=current.id;const e=entry(),moving=current.figure.startsWith('c-motion');angle=moving?35:70;$('position').min=moving?'0':'30';$('position').max=moving?'90':'150';$('position').value=String(angle);$('position-label').textContent=moving?'Onderzoek na de uitleg: schuif van B = D naar A = D':'Onderzoek na de uitleg: verplaats P binnen de toegestane boog';$('position-note').textContent=moving?'De driehoek behoudt zijn vorm en grootte. Bekijk ook de twee eindstanden.':'De ligging verandert; de cirkel en meetkundige voorwaarden blijven behouden.';$('exercise-title').textContent=current.title;$('exercise-meta').textContent=`Tentamen ${current.exam} · opgave ${current.group} · VWO-vraag ${current.question} · ${current.points} punten`;$('source').textContent=current.source;document.title=current.title+' · Wisik meetkunde';$('given').textContent=current.given;$('task').textContent=current.task;$('hint-text').textContent=current.hint;$('notes').value=e.notes;$('exercise-select').value=current.id;$('reflection').value=e.reflection;reflection();
 $('worksheet-link').hidden=!current.worksheetPage;$('worksheet-link').href=pdfPath(current)+'#page='+current.worksheetPage;
 $('source-link').href=pdfPath(current)+`#page=${current.page}`;$('answer-link').href=pdfPath(current)+`#page=${current.answerPage}`;
 $('reference-links').innerHTML=current.refs.map(n=>`<li><a href="/apps/stoicheia/?oefening=${current.id}#${REFERENCES[n].id}">${escape(REFERENCES[n].label)} · ${n}</a></li>`).join('');
 $('rubric').innerHTML=current.rubric.map(s=>`<li>${escape(s)}</li>`).join('');$('check-question').textContent=current.check;$('check-answer').textContent=current.checkAnswer;
 $('hint').open=e.help;$('proof').open=e.proof;$('reference-help').open=false;$('assessment').open=false;$('transfer').open=e.check;$('transfer').querySelector('details').open=false;
 const routeIds=examQuestions(current.exam).map(e=>e.id),i=routeIds.indexOf(id);$('previous').hidden=i===0;if(i>0){$('previous').href='#'+routeIds[i-1];$('previous').textContent='← '+routeIds[i-1];}$('next').hidden=i===routeIds.length-1;if(i<routeIds.length-1){$('next').href='#'+routeIds[i+1];$('next').textContent=routeIds[i+1]+' →';}renderStep();persist();feedbackContext();$('exercise-title').focus({preventScroll:true});window.scrollTo(0,0);
}
$('notes').addEventListener('input',()=>{entry().notes=$('notes').value.slice(0,20000);persist();});
$('notes').maxLength=20000;
$('exercise-select').addEventListener('change',()=>location.hash=$('exercise-select').value);
$('reflection').addEventListener('change',()=>{entry().reflection=$('reflection').value;reflection();persist();});
for(const [id,key] of [['hint','help'],['proof','proof'],['transfer','check']])$(id).addEventListener('toggle',()=>{if(!current)return;entry()[key]=$(id).open;if(id==='proof')renderStep();persist();});
function advance(by){if(!current)return;entry().step=Math.max(1,Math.min(current.steps.length,(entry().step||1)+by));renderStep();persist();}
$('step-back').onclick=()=>advance(-1);$('step-next').onclick=()=>advance(1);$('large-back').onclick=()=>advance(-1);$('large-next').onclick=()=>advance(1);
$('show-figure').onclick=()=>{$('figure').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
$('position').oninput=()=>{angle=Number($('position').value);renderStep();};
$('enlarge').onclick=()=>{$('figure-dialog').showModal();renderStep();};$('close-dialog').onclick=()=>$('figure-dialog').close();
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString(),appVersion:VERSION},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='wisik-meetkunde-voortgang.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Voortgang aangeboden als download. Bewaar het bestand op een plek die je terugvindt.');};
$('import-button').onclick=()=>$('import-file').click();
$('import-file').addEventListener('change',async()=>{const file=$('import-file').files[0];if(!file)return;try{if(file.size>1024*1024)throw Error('Het bestand is te groot (maximaal 1 MB).');const incoming=validateState(JSON.parse(await file.text()));state=mergeState(state,incoming);readBlocked=false;const ok=persist();route();message(ok?'Voortgang toegevoegd. Bij dubbele deelvragen is het werk uit deze browser behouden.':'Voortgang geopend, maar niet opgeslagen. Download je voortgang voor vertrek.',!ok);}catch(error){message('Niet geopend: '+error.message,true);}finally{$('import-file').value='';}});
window.addEventListener('hashchange',route);window.addEventListener('pagehide',()=>{if(current)persist();});route();
