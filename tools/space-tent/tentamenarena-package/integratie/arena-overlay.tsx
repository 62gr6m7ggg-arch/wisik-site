'use client';
import {useEffect,useRef} from 'react';

type Props={open:boolean;onClose:()=>void;onLesson:(level:number,terms:string[])=>void};

/** Same-origin bridge; the arena never writes the course's learning events. */
export default function ArenaOverlay({open,onClose,onLesson}:Props){
 const dialog=useRef<HTMLDialogElement>(null),frame=useRef<HTMLIFrameElement>(null);
 useEffect(()=>{
  if(!open)return;
  const element=dialog.current,previous=document.activeElement as HTMLElement|null;
  const overflow=document.body.style.overflow;
  if(element&&!element.open)element.showModal();
  document.body.style.overflow='hidden';
  return()=>{element?.close();document.body.style.overflow=overflow;previous?.focus();};
 },[open]);
 useEffect(()=>{
  if(!open)return;
  function receive(event:MessageEvent){
   if(event.origin!==window.location.origin||event.source!==frame.current?.contentWindow)return;
   const data=event.data;
   if(!data||typeof data!=='object')return;
   if(data.type==='wisik:arena:close'){onClose();return;}
   if(data.type==='wisik:arena:lesson'&&Number.isInteger(data.lesson)&&data.lesson>=1&&data.lesson<=6){
    const terms=Array.isArray(data.terms)?data.terms.filter((x:unknown)=>typeof x==='string').slice(0,8).map((x:string)=>x.slice(0,80)):[];
    onLesson(data.lesson,terms);
   }
  }
  window.addEventListener('message',receive);
  return()=>window.removeEventListener('message',receive);
 },[open,onClose,onLesson]);
 if(!open)return null;
 return <dialog ref={dialog} aria-label="Tentamenarena" onCancel={event=>{event.preventDefault();onClose();}} style={{position:'fixed',inset:0,width:'100vw',height:'100dvh',maxWidth:'100vw',maxHeight:'100dvh',margin:0,padding:0,border:0,background:'#071521',color:'#eff8f8',display:'grid',gridTemplateRows:'auto minmax(0,1fr)'}}>
  <div style={{minHeight:52,display:'flex',flexWrap:'wrap',gap:8,alignItems:'center',justifyContent:'space-between',padding:'8px 16px',borderBottom:'1px solid #38515a'}}><strong>Tentamenarena</strong><button type="button" onClick={onClose} style={{background:'#17313c',color:'white',border:'1px solid #45616b',padding:'8px 14px',borderRadius:8}}>Terug naar waar ik aan het Spacen was ×</button></div>
  <iframe ref={frame} title="Tentamenarena: archief, simulatie en hersteltraining" src="/apps/ruimteklaar/tentamenarena/index.html" style={{display:'block',width:'100%',height:'100%',border:0}}/>
 </dialog>;
}
