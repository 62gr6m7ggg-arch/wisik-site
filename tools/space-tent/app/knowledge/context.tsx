'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {BookOpen} from 'lucide-react';
import KnowledgePanel from './panel';

export type LookupMode='practice'|'check'|'probe'|'construction'|'exam-construction';
type Scope={key:string;mode:LookupMode;read:()=>void};
type KnowledgeContext={open:()=>void;register:(scope:Scope)=>()=>void};
const Context=createContext<KnowledgeContext|null>(null);

/** The exercise stays mounted. Searching never reads or writes progress.
 * Only selecting an article invokes the active exercise's support callback. */
export function KnowledgeProvider({children}:{children:ReactNode}){
 const [opened,setOpened]=useState(false),[entryId,setEntryId]=useState<string|null>(null),[mode,setMode]=useState<LookupMode|null>(null);
 const current=useRef<Scope|null>(null),isOpen=useRef(false),marker=useRef('');
 const origin=useRef<{element:HTMLElement|null;x:number;y:number}>({element:null,x:0,y:0});
 const register=useCallback((scope:Scope)=>{
  current.current=scope;setMode(scope.mode);
  return()=>{if(current.current===scope){current.current=null;setMode(null)}};
 },[]);
 const restore=useCallback(()=>{
  if(!isOpen.current)return;
  isOpen.current=false;setOpened(false);
  requestAnimationFrame(()=>{window.scrollTo({left:origin.current.x,top:origin.current.y,behavior:'instant'});origin.current.element?.focus({preventScroll:true})});
 },[]);
 const close=useCallback(()=>{
  restore();
  if(marker.current&&history.state?.spaceKnowledge===marker.current)history.back();
 },[restore]);
 const open=useCallback(()=>{
  if(isOpen.current)return;
  origin.current={element:document.activeElement instanceof HTMLElement?document.activeElement:null,x:scrollX,y:scrollY};
  document.querySelectorAll<HTMLMediaElement>('audio,video').forEach(media=>media.pause());
  marker.current='space-lookup-'+Date.now()+'-'+Math.random().toString(36).slice(2);
  try{history.pushState({...history.state,spaceKnowledge:marker.current},'',location.href)}catch{marker.current=''}
  setEntryId(null);isOpen.current=true;setOpened(true);
 },[]);
 useEffect(()=>{
  const back=()=>{if(isOpen.current&&history.state?.spaceKnowledge!==marker.current)restore()};
  window.addEventListener('popstate',back);return()=>window.removeEventListener('popstate',back);
 },[restore]);
 function select(id:string){current.current?.read();setEntryId(id)}
 return <Context.Provider value={{open,register}}>{children}<KnowledgePanel open={opened} onClose={close} entryId={entryId} onSelect={select} onList={()=>setEntryId(null)} mode={mode}/></Context.Provider>;
}

export function KnowledgeButton(){
 const ctx=useContext(Context);if(!ctx)return null;
 return <button type="button" className="knowledge-launch no-print" onClick={ctx.open} aria-haspopup="dialog"><BookOpen aria-hidden="true"/><span>Vraagbaak A–Z</span></button>;
}
export function useKnowledgeSupport(key:string,mode:LookupMode,active:boolean,onRead:()=>void){
 const ctx=useContext(Context),callback=useRef(onRead);callback.current=onRead;
 const register=ctx?.register;
 useEffect(()=>{if(active&&register)return register({key,mode,read:()=>callback.current()})},[register,key,mode,active]);
}
