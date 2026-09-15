'use client';
import {useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowUp,Search,ChevronRight,BookOpen} from 'lucide-react';
import {ENTRIES,ENTRY_BY_ID,SOURCES,findEntries,suggestions,scopeName,normalize,type Entry} from './model';
import KnowledgeFigure from './figures';
import {LinkedText} from './linked-text';
import type {LookupMode} from './context';

const returnText='terug naar waar ik aan het Spacen was';
type Props={open:boolean;onClose:()=>void;entryId:string|null;onSelect:(id:string)=>void;onList:()=>void;mode:LookupMode|null};
export default function KnowledgePanel({open,onClose,entryId,onSelect,onList,mode}:Props){
 const dialog=useRef<HTMLDialogElement>(null),list=useRef<HTMLDivElement>(null),article=useRef<HTMLDivElement>(null),search=useRef<HTMLInputElement>(null),returnButton=useRef<HTMLButtonElement>(null);
 const listPosition=useRef(0),lastEntry=useRef<string|null>(null);
 const [query,setQuery]=useState(''),[scope,setScope]=useState('all'),[lettersOpen,setLettersOpen]=useState(false);
 const result=useMemo(()=>findEntries(query,scope),[query,scope]);
 const entries=result.entries,entry=entryId?ENTRY_BY_ID.get(entryId):undefined;
 const groups=useMemo(()=>{const map=new Map<string,Entry[]>();for(const e of entries){const l=normalize(e.term)[0].toUpperCase();map.set(l,[...(map.get(l)||[]),e])}return [...map]},[entries]);
 const guessed=useMemo(()=>entries.length?[]:suggestions(query),[entries.length,query]);
 useEffect(()=>{
  const el=dialog.current;if(!el)return;
  if(!open){if(el.open)el.close();return;}
  if(!el.open)el.showModal();
  const overflow=document.body.style.overflow,padding=document.body.style.paddingRight;
  const scrollbar=innerWidth-document.documentElement.clientWidth;
  document.body.style.overflow='hidden';
  if(scrollbar)document.body.style.paddingRight=(parseFloat(getComputedStyle(document.body).paddingRight)+scrollbar)+'px';
  const viewport=()=>{el.style.setProperty('--knowledge-height',(window.visualViewport?.height||innerHeight)+'px');el.style.setProperty('--knowledge-top',(window.visualViewport?.offsetTop||0)+'px')};
  viewport();window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);
  if(innerWidth>760)search.current?.focus({preventScroll:true});else returnButton.current?.focus({preventScroll:true});
  if(list.current)list.current.scrollTop=listPosition.current;
  return()=>{document.body.style.overflow=overflow;document.body.style.paddingRight=padding;window.visualViewport?.removeEventListener('resize',viewport);window.visualViewport?.removeEventListener('scroll',viewport)};
 },[open]);
 useLayoutEffect(()=>{
  if(!open)return;
  if(entryId){if(article.current)article.current.scrollTop=0;article.current?.querySelector<HTMLElement>('h2')?.focus({preventScroll:true});}
  else if(list.current){list.current.scrollTop=listPosition.current;if(lastEntry.current)list.current.querySelector<HTMLElement>(`[data-entry="${lastEntry.current}"]`)?.focus({preventScroll:true});}
  lastEntry.current=entryId;
 },[entryId,open]);
 function choose(id:string){if(list.current&&(!entryId||innerWidth>760))listPosition.current=list.current.scrollTop;onSelect(id)}
 function changeQuery(value:string){setQuery(value);listPosition.current=0;if(list.current)list.current.scrollTop=0;}
 function jump(letter:string){
  setLettersOpen(false);
  requestAnimationFrame(()=>{const box=list.current,heading=box?.querySelector<HTMLElement>(`[data-letter="${letter}"]`);if(box&&heading){box.scrollTop+=heading.getBoundingClientRect().top-box.getBoundingClientRect().top;listPosition.current=box.scrollTop;heading.focus({preventScroll:true})}});
 }
 const check=mode==='check'||mode==='exam-construction';
 return <dialog ref={dialog} className="knowledge-dialog" aria-labelledby="knowledge-title" onCancel={e=>{e.preventDefault();onClose()}} onKeyDownCapture={e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onClose()}}}>
  <header className="knowledge-header"><div><span>Spacetent · Ruimtemeetkunde</span><h1 id="knowledge-title">Vraagbaak A–Z</h1></div><button ref={returnButton} type="button" className="knowledge-return" onClick={onClose}><ArrowLeft aria-hidden="true"/><span>{returnText}</span></button></header>
  <div className="knowledge-body" data-reading={!!entry}>
   <aside className="knowledge-index" aria-label="Begrippen opzoeken">
    <div className="knowledge-search-area">
     <label htmlFor="knowledge-search">Zoek een begrip</label><div className="knowledge-search"><Search aria-hidden="true"/><input ref={search} id="knowledge-search" type="search" value={query} maxLength={120} placeholder="Bijvoorbeeld loodvoet" autoComplete="off" onChange={e=>changeQuery(e.target.value)}/></div>
     <div className="knowledge-filter-row"><button type="button" aria-expanded={lettersOpen} aria-controls="knowledge-alphabet" onClick={()=>setLettersOpen(v=>!v)}>Kies een letter <span aria-hidden="true">A–Z</span></button><label><span className="knowledge-sr-only">Welke stof wil je zien?</span><select value={scope} onChange={e=>{setScope(e.target.value);listPosition.current=0;if(list.current)list.current.scrollTop=0}}><option value="all">Alle stof</option><option value="kern">Lesstof en voorkennis</option><option value="aanvullend">Aanvullende stof</option><option value="geogebra">GeoGebra-leertaak</option></select></label></div>
     {lettersOpen&&<nav id="knowledge-alphabet" className="knowledge-alphabet" aria-label="Spring naar beginletter">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l=><button type="button" key={l} disabled={!groups.some(([letter])=>letter===l)} onClick={()=>jump(l)}>{l}</button>)}</nav>}
     {check&&<p className="knowledge-help-notice knowledge-index-notice">Tijdens deze check geldt uitleg openen als hulp. Alleen bladeren telt niet mee.</p>}
     <p className="knowledge-count" role="status">{entries.length} van {ENTRIES.length} begrippen{result.fullText&&entries.length>0?' · gevonden in de uitleg':''}</p>
    </div>
    <div ref={list} className="knowledge-list" tabIndex={0} aria-label="Alfabetische begrippenlijst" onScroll={()=>{if(!entryId||innerWidth>760)listPosition.current=list.current?.scrollTop||0}}>
     {groups.map(([letter,rows])=><section key={letter}><h2 data-letter={letter} tabIndex={-1}>{letter}</h2><ul>{rows.map(e=><li key={e.id}><button type="button" data-entry={e.id} aria-current={entryId===e.id?'true':undefined} onClick={()=>choose(e.id)}><span>{e.term}{e.scope!=='kern'&&<small>{scopeName(e.scope)}</small>}</span><ChevronRight aria-hidden="true"/></button></li>)}</ul></section>)}
     {!entries.length&&<div className="knowledge-empty"><h2>Geen begrip gevonden</h2><p>Probeer een korter woord of kies ‘Alle stof’.</p>{guessed.length>0&&<><p>Bedoelde je:</p>{guessed.map(e=><button type="button" key={e.id} onClick={()=>choose(e.id)}>{e.term}<ChevronRight aria-hidden="true"/></button>)}</>}<button type="button" onClick={()=>{changeQuery('');setScope('all')}}>Alle begrippen tonen</button></div>}
    </div>
   </aside>
   <div ref={article} className="knowledge-reading" tabIndex={0} aria-label={entry?'Uitleg over '+entry.term:'Over de vraagbaak'}>
    {entry?<>
     <button type="button" className="knowledge-back-list" onClick={onList}><ArrowLeft aria-hidden="true"/>Terug naar begrippen</button>
     <div className="knowledge-entry-meta"><span>{scopeName(entry.scope)}</span>{entry.levels.length>0&&<span>{entry.levels.map(l=>'Les 1.'+l).join(' · ')}</span>}</div>
     <h2 className="knowledge-entry-title" tabIndex={-1}>{entry.term}</h2>
     <p className="knowledge-summary">{<LinkedText text={entry.summary} current={entry.id} onSelect={choose}/>}</p>
     {entry.aliases.length>0&&<p className="knowledge-aliases">Ook te vinden als: {entry.aliases.join(', ')}.</p>}
     {(check||mode==='probe')&&<p className="knowledge-help-notice">{check?'Je hebt uitleg geopend. Deze lopende poging geldt als oefenen met hulp. Je werk blijft staan.':'Je hebt bij deze controlevraag uitleg geraadpleegd. Dit antwoord telt als werken met hulp.'}</p>}
     {entry.figure&&<KnowledgeFigure key={entry.id} kind={entry.figure}/>} 
     <section><h3>Begrijpen</h3>{entry.explanation.map((p,i)=><p key={i}><LinkedText text={p} current={entry.id} onSelect={choose}/></p>)}</section>
     <section><h3>Zo pak je het aan</h3><ol className="knowledge-steps">{entry.steps.map((p,i)=><li key={i}><LinkedText text={p} current={entry.id} onSelect={choose}/></li>)}</ol></section>
     <section className="knowledge-example"><h3>Uitgewerkt voorbeeld</h3><p>{entry.example.given}</p><ol>{entry.example.steps.map((p,i)=><li key={i}>{p}</li>)}</ol></section>
     <section><h3>Let hierop</h3><ul>{entry.pitfalls.map((p,i)=><li key={i}><LinkedText text={p} current={entry.id} onSelect={choose}/></li>)}</ul></section>
     <section><h3>Dit helpt je verder</h3><div className="knowledge-related">{entry.related.map(id=>{const related=ENTRY_BY_ID.get(id);return related&&<button type="button" key={id} onClick={()=>choose(id)}>{related.term}<ChevronRight aria-hidden="true"/></button>})}</div></section>
     <details className="knowledge-sources"><summary>Bronnen bij dit begrip</summary><p>Vindplaats in het aangeleverde lesmateriaal: {entry.sourceRef}. L1–L6 zijn lessen 1.1–1.6; d staat voor dia en p voor PDF-pagina.</p><ul>{entry.sourceIds.map(id=><li key={id}><strong>{id}: {SOURCES.get(id)?.title||id}</strong><p>{SOURCES.get(id)?.detail}</p></li>)}</ul>{entry.supportingTerm&&<p>Dit begrip is toegevoegd om de taal en werkwijzen van de opgaven te verduidelijken; het hoeft niet als afzonderlijke definitie in de dia te staan.</p>}<p>Uitleg en voorbeelden zijn voor Spacetent geschreven op basis van deze stof. De figuur hierboven is een afzonderlijk voorbeeld bij het begrip; puntnamen en gegevens staan in het bijschrift.</p></details>
     <button type="button" className="knowledge-to-top" onClick={()=>{if(article.current)article.current.scrollTop=0;article.current?.querySelector<HTMLElement>('h2')?.focus({preventScroll:true})}}><ArrowUp aria-hidden="true"/>Bovenaan deze uitleg</button>
    </>:<div className="knowledge-welcome"><BookOpen aria-hidden="true"/><p className="knowledge-kicker">EVEN IETS OPZOEKEN</p><h2>Een begrip helder krijgen.<br/>Daarna weer verder Spacen.</h2><p>Blader op alfabet of zoek op een begrip. Eén klik opent uitleg, een aanpak, een uitgewerkt voorbeeld en verwante begrippen.</p><p>Ook de stof uit latere levels is hier beschikbaar.</p>{check&&<p className="knowledge-help-notice">Je werkt aan een zelfstandige check. Alleen bladeren telt niet als hulp. Zodra je uitleg opent, geldt deze poging als oefenen met hulp.</p>}{mode==='probe'&&<p className="knowledge-help-notice">Een uitleg openen bij deze controlevraag telt als hulp. Alleen de lijst bekijken telt niet mee.</p>}<p className="knowledge-memory">Je oefening blijft op dezelfde plek staan. Gebruik de vaste knop bovenaan om terug te keren.</p></div>}
   </div>
  </div>
 </dialog>;
}
