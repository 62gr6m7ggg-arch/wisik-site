'use client';
import {useId} from 'react';
import {Eye} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {parallelImage,projectionFrame,sub,mul,add,type V3} from './geometry-math';
import {eyeLabel,referenceCamera} from './viewing-math';
import type {ProjectionBasis} from './projection-lesson-math';

export default function ViewingGuide({points,edges,basis,compact=false,flat=false,frontOn=false,planeNames=[],activePlane='',onPlane,onReset,legend=[]}:{points:Record<string,V3>;edges:string[];basis:ProjectionBasis;compact?:boolean;flat?:boolean;frontOn?:boolean;planeNames?:string[];activePlane?:string;onPlane?:(name:string)=>void;onReset?:()=>void;legend?:{name:string;color:string}[]}){
 const id=useId().replaceAll(':',''),names=[...new Set(edges.join('').split(''))].filter(k=>points[k]),ps=(names.length?names:Object.keys(points)).map(k=>points[k]);
 if(!ps.length)return null;
 const center=ps.reduce<V3>((sum,p)=>add(sum,mul(p,1/ps.length)),[0,0,0]),radius=Math.max(.1,...ps.map(p=>Math.hypot(...sub(p,center))));
 const eye=add(center,mul(basis.eye,radius*2.4)),end=add(center,mul(basis.eye,radius*.9));
 // An independent overview keeps the viewing ray visible even when the main
 // figure is seen straight on. This is the actual given solid, never a stock cube.
 const observer=referenceCamera(basis.eye),raw=(p:V3)=>parallelImage(sub(p,center),'spatial',...observer);
 const frame=projectionFrame([...ps,eye].map(raw),240,180),project=(p:V3)=>raw(p).map((v,i)=>(i===0?120:90)+(v-frame.center[i])*frame.scale);
 const xy=(p:V3)=>project(p).map(v=>v.toFixed(2)).join(','),[ex,ey]=project(eye);
 const label=activePlane?`Je kijkt loodrecht op vlak ${activePlane}.`:flat&&frontOn?'Vlakke figuur, loodrecht bekeken.':eyeLabel(basis.eye);
 const anchors=names.length?[names[0],names[1],names.reduce((a,b)=>points[a][2]>=points[b][2]?a:b)]:[];
 return <div className="viewing-guide no-print" data-viewing-guide="true"><p className="viewing-label"><Eye size={17} aria-hidden="true"/>{label}</p>{legend.length>0&&<div className="plane-legend">{legend.map(l=><span key={l.name} style={{color:l.color}}>▧ Vlak {l.name}</span>)}</div>}
 {!compact&&!(flat&&frontOn)&&<details><summary>Kijkrichting in beeld</summary><div className="viewing-guide-detail"><svg viewBox="0 0 240 180" role="img" aria-label="Ruimtelijk overzicht van de gegeven figuur. Het oog en de pijl wijzen in de kijkrichting van de hoofdfiguur."><defs><marker id={'view-'+id} viewBox="0 0 8 8" markerWidth="7" markerHeight="7" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#ffa35e" strokeWidth="1.5"/></marker></defs>{edges.filter(e=>points[e[0]]&&points[e[1]]).map(e=><polyline key={e} points={xy(points[e[0]])+' '+xy(points[e[1]])} fill="none" stroke="#8caabd" strokeWidth="1.5"/>)}{[...new Set(anchors)].filter(Boolean).map(name=>{const [x,y]=project(points[name]);return <text key={name} x={x-8} y={y+16} fill="#d9e9f3" fontSize="14">{name}</text>})}<polyline points={xy(add(center,mul(basis.eye,radius*2.1)))+' '+xy(end)} fill="none" stroke="#ffa35e" strokeWidth="2.5" markerEnd={`url(#view-${id})`}/><Eye x={ex-10} y={ey-10} width="20" height="20" stroke="#ffa35e"/></svg><p>De puntnamen en ruimteassen blijven vast. Voor, achter, links en rechts volgen die vaste oriëntatie. Het overzicht draait mee zodat de kijkpijl zichtbaar blijft. De pijl loopt van het oog naar de figuur. Punten achter elkaar in deze richting vallen in de hoofdfiguur samen. Het gekleurde vlakdeel heeft een tekenrand; het wiskundige vlak gaat verder.</p></div></details>}
 {onPlane&&planeNames.length>0&&<div className="plane-view-controls"><p>Bekijk een gegeven of besproken vlak recht van voren:</p><div>{planeNames.map(name=><Button key={name} variant={activePlane===name?'default':'outline'} aria-pressed={activePlane===name} onClick={()=>onPlane(name)}>Vlak {name}</Button>)}</div>{activePlane&&<><p>Dit is een loodrechte projectie op een tekenvlak evenwijdig aan dit vlak. Hierin blijven vormen en hoeken behouden. Punten buiten het vlak kunnen ervoor of erachter liggen en in beeld samenvallen.</p><Button variant="ghost" onClick={onReset}>Terug naar de ruimtelijke tekening</Button></>}</div>}
 </div>;
}
