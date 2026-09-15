'use client';
import {useEffect,useRef} from 'react';
import {LEVELS} from './model';
export const ENTRY_VERSE='als niemand kijkt, ben ik op mijn best in het level dat mij verrijkt';
export default function EntryChooser({open,onClose,onChoose}:{open:boolean;onClose:()=>void;onChoose:(level:number)=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=dialog.current;if(!d)return;if(open&&!d.open)d.showModal();else if(!open&&d.open)d.close()},[open]);
 return <dialog ref={dialog} className="entry-dialog no-print" aria-labelledby="entry-title" aria-describedby="entry-description" onClose={onClose} onCancel={onClose}>
  <div className="entry-dialog-head"><div><span className="eyebrow">JOUW PLEK IN DE SPACE-TENT</span><h2 id="entry-title">Waar wil jij instromen?</h2></div><button type="button" className="entry-close" onClick={onClose} aria-label="Keuze sluiten">×</button></div>
  <p id="entry-description">Kies het level dat bij je past. Je hoeft eerdere levels niet eerst te maken. Binnen je gekozen level blijft de uitleg- en oefenopbouw beschikbaar.</p>
  <div className="entry-levels">{LEVELS.map(l=><button type="button" key={l.id} data-entry-level={l.id} onClick={()=>onChoose(l.id)}><span className="entry-number">{l.id===7?'TOP':l.id}</span><span><strong>{l.title}</strong><small>{l.subtitle}</small></span><span aria-hidden="true">→</span></button>)}</div>
  <p className="entry-note">Vrij instromen is gewoon leren: gemaakte opdrachten tellen mee. Een level kiezen betekent niet dat je eerdere levels hebt behaald. Voor de topstatus blijven de bestaande voorwaarden gelden.</p>
 </dialog>
}
