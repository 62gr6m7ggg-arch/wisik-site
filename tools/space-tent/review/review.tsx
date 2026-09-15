import {useEffect,useState} from 'react';
import {KnowledgeButton} from '../app/knowledge/context';
import {BANK,correctAnswer,type LearningEvent} from '../app/model';
import {QuestionCard,CorrectAnswer,LearningView,LevelCheck} from '../app/learning';
import QuestionFigure from '../app/question-figure';
import ConstructionLab from '../app/construction-lab';
import Workbench,{type SaveEvent} from '../app/workbench';
import Paper from '../app/paper';
import CoursePaper from '../app/course-paper';
import Geometry from '../app/geometry';
import {APP_VERSION} from '../app/version';
import {newEventId} from '../app/identity';
import {INVENTORY,KIND_LABELS,filterEntries,type Entry} from './inventory';
const ROOT='/apps/ruimteklaar/test/';
function initialEntry(){try{const id=decodeURIComponent(location.hash.slice(1));return INVENTORY.find(e=>e.id===id)||INVENTORY[0]}catch{return INVENTORY[0]}}
export default function Review(){
 const [entry,setEntry]=useState<Entry>(initialEntry),[level,setLevel]=useState(''),[kind,setKind]=useState(''),[role,setRole]=useState(''),[block,setBlock]=useState(''),[search,setSearch]=useState('');
 const [eventsByEntry,setEventsByEntry]=useState<Record<string,LearningEvent[]>>({}),[attempt,setAttempt]=useState(0),[reveal,setReveal]=useState(false),[message,setMessage]=useState(''),[expired,setExpired]=useState(false);
 const filtered=filterEntries(INVENTORY,level,kind,role,block,search),index=filtered.findIndex(e=>e.id===entry.id),events=eventsByEntry[entry.id]||[];
 useEffect(()=>{let stopped=false;const check=async()=>{try{const r=await fetch(ROOT+'session',{cache:'no-store',credentials:'same-origin'});if(!r.ok&&!stopped){setExpired(true);setEventsByEntry({});location.replace(ROOT)}}catch{if(!stopped)setMessage('De sessiecontrole kon de server niet bereiken. Herladen vraagt opnieuw toegang.')}};void check();const timer=setInterval(check,30000);const visible=()=>{if(document.visibilityState==='visible')void check()};document.addEventListener('visibilitychange',visible);const pageShow=(e:PageTransitionEvent)=>{if(e.persisted)location.reload()};window.addEventListener('pageshow',pageShow);return()=>{stopped=true;clearInterval(timer);document.removeEventListener('visibilitychange',visible);window.removeEventListener('pageshow',pageShow)}},[]);
 // Coalesce rapid navigation for WebKit, but flush the active entry before the
 // lookup pushes its history entry. Otherwise a pending update can change only
 // the overlay URL, and browser-back would select the previous exercise.
 function syncLocation(){const target=ROOT+'#'+encodeURIComponent(entry.id);if(location.pathname+location.hash===target)return;try{history.replaceState({...history.state},'',target)}catch{setMessage('De vraag is geopend. De browser kon de bronlink nog niet bijwerken.')}}
 useEffect(()=>{const timer=window.setTimeout(syncLocation,500);return()=>window.clearTimeout(timer)},[entry.id]);
 function choose(e:Entry){setEntry(e);setReveal(false);setAttempt(0);setMessage('');}
 useEffect(()=>{const changed=()=>choose(initialEntry());window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed)},[]);
 function move(delta:number){const e=filtered[index+delta];if(e)choose(e);else setMessage('Dit is het einde van de geselecteerde lijst. Kies bovenaan een ander onderdeel.');}
 const save:SaveEvent=async(type,payload)=>{
  if(expired)return false;
  const q=entry.question;const e:LearningEvent={id:newEventId(),at:Date.now(),type,payload:{...payload,...(type==='answer'&&q?{correct:correctAnswer(q,Array.isArray(payload.answer)?payload.answer:[])}:{})}};
  setEventsByEntry(previous=>({...previous,[entry.id]:[...(previous[entry.id]||[]),e]}));return true;
 };
 function restart(){setEventsByEntry(previous=>({...previous,[entry.id]:[]}));setAttempt(n=>n+1);setReveal(false);setMessage('Alleen deze testpoging is opnieuw gestart. Je leerlingvoortgang is niet aangeraakt.');}
 const exit=()=>setMessage('Kies bovenaan vrij een ander onderdeel. Dit was alleen een testpoging.');
 const code=entry.key,feedback=new URL('/kladblok/',location.origin);feedback.searchParams.set('bron',location.origin+ROOT+'#'+encodeURIComponent(entry.id));feedback.searchParams.set('attractie','Ruimteklaar testmodus');feedback.searchParams.set('appversie',APP_VERSION);feedback.searchParams.set('product','Ruimteklaar testmodus');feedback.searchParams.set('productversie',APP_VERSION);feedback.searchParams.set('onderdeel',code);
 const q=entry.question,t=entry.task,trigger=q&&BANK.blocks.find(b=>b.id===q.block)?.misconception.trigger;
 if(expired)return <p role="alert">Je testsessie is verlopen. Open de testmodus opnieuw.</p>;
 return <main className="app-shell reviewer" data-review-mode="true">
  <header className="review-banner"><div><strong>TESTMODUS</strong><span>Ruimteklaar {APP_VERSION} · telt niet mee voor je voortgang</span></div><KnowledgeButton beforeOpen={syncLocation}/><form method="post" action={ROOT+'logout'}><button type="submit">Uitloggen</button></form></header>
  <p className="review-intro">Vrij kiezen, proberen en overslaan. Testwerk blijft alleen in het geheugen van dit tabblad; herladen of uitloggen wist het. Je gewone leerroute en XP blijven ongewijzigd.</p>
  <section className="review-picker" aria-label="Vrije vragenlijst">
   <div className="review-filters">
    <label>Les / level<select aria-label="Les of level" value={level} onChange={e=>setLevel(e.target.value)}><option value="">Alle levels</option>{[1,2,3,4,5,6,7].map(n=><option key={n} value={n}>{n===7?'Toplevel / eindproeven':'Level '+n}</option>)}</select></label>
    <label>Onderdeel<select aria-label="Soort onderdeel" value={kind} onChange={e=>setKind(e.target.value)}><option value="">Alles</option>{Object.entries(KIND_LABELS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
    <label>Vraagfunctie<select aria-label="Vraagfunctie" value={role} onChange={e=>setRole(e.target.value)}><option value="">Alle functies</option>{[...new Set(INVENTORY.filter(e=>e.kind==='question').map(e=>e.role))].map(r=><option key={r}>{r}</option>)}</select></label>
    <label>Onderwerp<select aria-label="Onderwerp" value={block} onChange={e=>setBlock(e.target.value)}><option value="">Alle onderwerpen</option>{BANK.blocks.map(b=><option key={b.id} value={b.id}>{b.title}</option>)}</select></label>
    <label className="review-search">Zoeken op code of tekst<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Bijvoorbeeld loodvoet of l7b-14"/></label>
   </div>
   <label className="review-jump">Direct openen<select aria-label="Kies een onderdeel" value={index>=0?entry.id:''} onChange={e=>{const selected=INVENTORY.find(x=>x.id===e.target.value);if(selected)choose(selected)}}><option value="" disabled>{filtered.length?'Kies uit de gefilterde lijst':'Geen passende onderdelen'}</option>{filtered.map((e,i)=><option key={e.id} value={e.id}>{i+1}. [{e.key}] {e.role} — {e.title}</option>)}</select></label>
   <div className="review-list-meta"><span>{filtered.length} van {INVENTORY.length} onderdelen · {BANK.questions.length} losse vragen in totaal</span><button type="button" onClick={()=>{setLevel('');setKind('');setRole('');setBlock('');setSearch('')}}>Filters wissen</button></div>
  </section>
  <nav className="review-actions" aria-label="Testnavigatie"><button onClick={()=>move(-1)} disabled={index<=0}>← Vorige</button><button onClick={()=>move(1)} disabled={index<0||index>=filtered.length-1}>Volgende / overslaan →</button><button onClick={restart}>Opnieuw testen</button>{(q||t)&&<button aria-pressed={reveal} onClick={()=>setReveal(v=>!v)}>{reveal?'Verberg antwoord en uitwerking':'Toon antwoord en uitwerking'}</button>}<a href={feedback.href} target="_blank" rel="noopener noreferrer">Meld probleem via Kladblok ↗</a></nav>
  <div className="review-item-meta"><strong data-review-code={code}>{code}</strong><span>Level {entry.level} · {entry.role}</span></div>
  <p role="status" className="review-message">{message}</p>
  <div key={entry.id+':'+attempt} className="review-live-component" data-review-kind={entry.kind}>
   {q&&<QuestionCard question={q} context={entry.context} sessionId={'review-'+q.id+'-'+attempt} save={save} onNext={()=>move(1)} number={Math.max(1,index+1)} total={Math.max(1,filtered.length)} guided={entry.context==='retest'} deferOnAnswer={entry.context==='practice'&&trigger?.qid===q.id?trigger.wrongAnswer:undefined}/>}
   {t&&<ConstructionLab task={t} events={events} save={save} onBack={exit}/>}
   {entry.kind==='workbench'&&<Workbench save={save} onBack={exit}/>}
   {entry.lesson&&<LearningView block={entry.lesson} events={events} save={save} onBack={exit} onDone={exit}/>}
   {entry.kind==='check'&&<LevelCheck checkKey={entry.key} events={events} save={save} onBack={exit}/>}
   {entry.kind==='paper'&&(entry.key==='1'?<Paper save={save} onBack={exit} alreadyDone={false}/>:<CoursePaper paperKey={entry.key} save={save} onBack={exit} alreadyDone={false}/>)}
  </div>
  {reveal&&<aside className="review-answer" aria-label="Beoordelaarsuitwerking"><h2>Uitwerking voor de beoordelaar</h2><p>Dit paneel staat los van de leerlingbediening hierboven.</p>{q&&<><CorrectAnswer question={q}/><QuestionFigure question={q} reveal/><p>{q.explanation}</p></>}{t&&<><ol>{t.solution.map((s,i)=><li key={i}>{s}</li>)}</ol><Geometry guidance={false} fixed showCube={false} points={{...t.points,...t.solutionPoints}} edges={t.edges} fitToContent segments={t.targetSegments.map(([from,to])=>({from,to,color:'#94efb8'}))}/><p>{t.reason.options.find(o=>o.id===t.reason.answer)?.text}</p></>}</aside>}
  <footer className="review-footer"><a href="/apps/ruimteklaar/">Naar de gewone leerroute</a><span>Testbalie 1.0 · Edwin van der Plas</span></footer>
 </main>
}
