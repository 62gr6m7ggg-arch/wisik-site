'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {ArrowLeft,Printer,CheckCircle2,Eye} from 'lucide-react';
import Geometry from './geometry';
import QuestionFigure from './question-figure';
import {QUESTIONS} from './model';
import type {SaveEvent} from './workbench';

export default function Paper({save,onBack,alreadyDone}:{save:SaveEvent;onBack:()=>void;alreadyDone:boolean}){
 const [show,setShow]=useState(false),[checks,setChecks]=useState<string[]>([]),[done,setDone]=useState(alreadyDone),[busy,setBusy]=useState(false);
 const criteria=[['figure','Mijn kubus is correct benoemd; evenwijdige ribben zijn evenwijdig getekend.'],['relations','Ik onderbouw dat AE en BC kruisend zijn met richting en gemeenschappelijke punten.'],['intersection','Ik construeer AG als snijlijn en herken A als gezamenlijke punt van de drie gevraagde vlakken.'],['reason','Ik geef een ruimtelijke redenering; “dat zie je” is niet mijn bewijs.']];
 const reviews=[
  {question:'probe-l1',title:'Opdracht 2 · AE en BC',text:'AE loopt in de hoogterichting, BC in de diepterichting. De lijnen hebben verschillende richtingen en geen gemeenschappelijk punt. Ze zijn kruisend.'},
  {question:'v3',title:'Opdracht 3 · De snijlijn AG',text:'A en G liggen in beide verschillende vlakken ABG en ADG. Verbind A en G. Beide vlakken bevatten de hele lijn AG, ook buiten de kubus: dit is de snijlijn.'},
  {question:'d3',title:'Opdracht 4 · Alleen punt A',text:'ABC en ABF delen AB. Alleen A van die lijn ligt ook in ADH. De andere paarsgewijze snijlijnen zijn AD en AE; ze komen eveneens samen in A.'},
 ];
 return <section className="paper-view"><div className="section-top no-print"><Button variant="ghost" onClick={onBack}><ArrowLeft/>Mijn route</Button><span className="eyebrow">LEVEL 01 · PAPIERWERK</span></div>
  <div className="paper-sheet"><span className="eyebrow">RUIMTEKLAAR · ZELFSTANDIG OP PAPIER</span><h1 className="page-title">Van scherm naar schrift.</h1><p>Gebruik potlood en liniaal. Maak de vier opdrachten voordat je de controle opent. Je kunt deze pagina afdrukken of de kubus zelf overnemen.</p><div className="paper-layout"><ol><li>Teken kubus ABCD.EFGH in parallelprojectie. Geef onzichtbare ribben gestippeld weer.</li><li>Onderzoek de lijnen AE en BC. Schrijf op of ze snijden, evenwijdig zijn of kruisen. Onderbouw je antwoord.</li><li>Construeer de snijlijn van de vlakken ABG en ADG. Nummer je stappen en leg uit waarom deze lijn in beide vlakken ligt.</li><li>Wat hebben de vlakken ABC, ABF en ADH alle drie gemeen? Geef een redenering.</li></ol><Geometry guidance={false} fixed compact caption="Alle ribben van deze kubus zijn even lang."/></div><div className="paper-writing-space" aria-hidden="true"/></div>
  <div className="question-actions no-print"><Button variant="outline" onClick={()=>window.print()}><Printer/>Afdrukken</Button><Button onClick={()=>setShow(true)}><Eye/>Mijn werk controleren</Button></div>
  {show&&<div className="paper-feedback no-print"><h2>Controleer je constructie én je argumenten.</h2><p>Vergelijk de opdrachten één voor één. Elke figuur laat alleen de lijnen en vlakken zien die bij die redenering horen.</p>
   <div className="paper-review-grid">{reviews.map(review=><article key={review.question}><h3>{review.title}</h3><QuestionFigure question={QUESTIONS[review.question]} reveal/><p>{review.text}</p></article>)}</div>
   <p>Dit is een zelfcontrole. Laat je redenering bij twijfel ook door een docent of medestudent bekijken.</p><div className="paper-checks">{criteria.map(([id,text])=><label key={id}><Checkbox checked={checks.includes(id)} onCheckedChange={v=>setChecks(c=>v?[...c,id]:c.filter(k=>k!==id))}/><span>{text}</span></label>)}</div><Button disabled={checks.length!==4||busy} onClick={async()=>{setBusy(true);if(await save('paper',{checks}))setDone(true);setBusy(false)}}>{busy?'Opslaan…':'Zelfcontrole vastleggen'}<CheckCircle2/></Button>{done&&<p className="positive" role="status">Je papierwerk is als zelfgecontroleerd vastgelegd.</p>}
  </div>}
 </section>
}
