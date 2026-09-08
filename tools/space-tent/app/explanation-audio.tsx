'use client';
import {useEffect,useId,useRef,useState} from 'react';
import CourseFigure from './course-figure';
import type {Scene} from './model';
import examples from './audio-examples.json';
import {APP_VERSION} from './version';
type Clip={id:string;lesson:number;blockId:string;title:string;audio:string;duration:number;sha256:string;paragraphs:string[]};
const visuals=examples as unknown as Record<string,{scene?:Scene;notes:string[]}>;
let catalog:Promise<Clip[]>|undefined;
function loadCatalog(){return catalog??=(fetch(`/films/ruimteklaar/catalog.json?v=${APP_VERSION}`).then(r=>{if(!r.ok)throw Error('catalog');return r.json()}).then(d=>{if(!Array.isArray(d.items))throw Error('catalog');return d.items as Clip[]}).catch(e=>{catalog=undefined;throw e}))}
function Player({clip}:{clip:Clip}){
 const ref=useRef<HTMLAudioElement>(null),[error,setError]=useState(false);const visual=visuals[clip.id];
 useEffect(()=>{const audio=ref.current;return()=>{audio?.pause();audio?.removeAttribute('src');audio?.load()}},[]);
 return <article className="audio-example"><h3>{clip.id} · {clip.title}</h3><audio ref={ref} controls preload="none" src={`${clip.audio}?v=${clip.sha256.slice(0,12)}`} aria-label={`Luister naar ${clip.title}`} onError={()=>setError(true)}/>{error&&<p role="alert">Het geluid kon niet laden. <a href={`${clip.audio}?v=${clip.sha256.slice(0,12)}`}>Open de opname</a> of lees de uitleg hieronder.</p>}<p className="muted">Dit luistervoorbeeld heeft zijn eigen figuur en gegevens.</p>{visual?.scene&&<CourseFigure scene={visual.scene} guidance/>}{!!visual?.notes.length&&<div className="audio-example-notes">{visual.notes.map((note,i)=><p key={i}>{note}</p>)}</div>}<details className="audio-reading"><summary>Uitleg in tekst</summary>{clip.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</details></article>
}
export default function ExplanationAudio({blockId,lesson}:{blockId?:string;lesson?:number}){
 const [open,setOpen]=useState(false),[items,setItems]=useState<Clip[]>([]),[selected,setSelected]=useState(''),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0);const label=useId();
 useEffect(()=>{if(!open)return;let alive=true;setFailed(false);loadCatalog().then(all=>{if(alive)setItems(all.filter(c=>blockId?c.blockId===blockId:c.lesson===lesson))}).catch(()=>{if(alive)setFailed(true)});return()=>{alive=false}},[open,blockId,lesson,retry]);
 const clip=items.find(c=>c.id===selected);
 return <details className="explanation-audio" onToggle={e=>setOpen(e.currentTarget.open)}><summary>{blockId?'Luistervoorbeelden bij dit blok':`Luistervoorbeelden · les ${lesson}`}</summary>{open&&<div className="audio-content">{failed?<p role="alert">De luisterlijst kon niet laden. <button type="button" onClick={()=>setRetry(n=>n+1)}>Opnieuw proberen</button></p>:items.length?<><label htmlFor={label}>Kies een uitleg</label><select id={label} value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Selecteer een onderwerp…</option>{items.map(c=><option key={c.id} value={c.id}>{c.id} · {c.title} ({Math.floor(Math.round(c.duration)/60)}:{String(Math.round(c.duration)%60).padStart(2,'0')})</option>)}</select>{clip&&<Player key={clip.id} clip={clip}/>}</>:<p role="status">Luisterlijst laden…</p>}</div>}</details>
}
