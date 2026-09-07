'use client';
import {useEffect,useId,useRef,useState,type PointerEvent} from 'react';
import {Slider} from '@/components/ui/slider';
import {Button} from '@/components/ui/button';
import {Rotate3D, PanelTop, RotateCcw} from 'lucide-react';
import {CUBE,EDGES,parallelImage,constructionBounds,projectionFrame,edgeIsHidden,clipProjectedLine,type ProjectionView,type V3,type DrawLine} from './geometry-math';
export * from './geometry-math';
import {dragCamera,hasDragged} from './rotation';
const edgeNormals=[[1,-1,2,-1],[0,1,2,-1],[1,1,2,-1],[0,-1,2,-1],[1,-1,2,1],[0,1,2,1],[1,1,2,1],[0,-1,2,1],[0,-1,1,-1],[0,1,1,-1],[0,1,1,1],[0,-1,1,1]];
export type IllustrationSegment={from:V3;to:V3;color:string;dashed?:boolean;arrow?:boolean};
export type GeoProps={edges?:string[];construction?:boolean;onExplore?:()=>void;view?:ProjectionView;camera?:[number,number];showCube?:boolean;hiddenLabels?:string[];segments?:IllustrationSegment[];fitToContent?:boolean;ariaLabel?:string;points?:Record<string,V3>;highlights?:string[];planes?:string[][];lines?:DrawLine[];selected?:string[];selectable?:string[];onPoint?:(p:string)=>void;fixed?:boolean;compact?:boolean;caption?:string;dimensions?:V3};
export default function Geometry({edges=[],construction=false,onExplore,view='spatial',camera=[28,24],showCube=true,hiddenLabels=[],segments=[],fitToContent=false,ariaLabel='Ruimtefiguur met benoemde punten en lijnen. De figuur is een parallelprojectie.',points={},highlights=[],planes=[],lines=[],selected=[],selectable=[],onPoint,fixed=false,compact=false,caption,dimensions=[1,1,1]}:GeoProps){
 const markerId='arrow-'+useId().replaceAll(':','');
 const ref=useRef<HTMLDivElement>(null);const [width,setWidth]=useState(440),[angle,setAngle]=useState(camera[0]),[tilt,setTilt]=useState(camera[1]),[explore,setExplore]=useState(false);
 const drag=useRef<{id:number;x:number;y:number;camera:[number,number];moved:boolean}|null>(null),suppressClick=useRef(false);
 const canRotate=!fixed&&!compact&&view==='spatial',canDrag=canRotate&&(!construction||explore);
 function exploreStart(){if(!explore)onExplore?.();setExplore(true)}
 function pointerDown(e:PointerEvent<HTMLDivElement>){suppressClick.current=false;if(!canDrag||!e.isPrimary||e.button!==0)return;drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,camera:(explore||construction)?[angle,tilt]:camera,moved:false}}
 function pointerMove(e:PointerEvent<HTMLDivElement>){const d=drag.current;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.moved&&!hasDragged(dx,dy))return;d.moved=true;e.currentTarget.setPointerCapture(e.pointerId);suppressClick.current=true;exploreStart();const [a,t]=dragCamera(d.camera,dx,dy);setAngle(a);setTilt(t)}
 function pointerEnd(e:PointerEvent<HTMLDivElement>){if(drag.current?.id!==e.pointerId)return;suppressClick.current=drag.current.moved;drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}
 function reset(){drag.current=null;setAngle(camera[0]);setTilt(camera[1]);setExplore(false)}
 useEffect(()=>{if(!ref.current)return;const ro=new ResizeObserver(e=>setWidth(e[0].contentRect.width));ro.observe(ref.current);return()=>ro.disconnect()},[]);
 const all=showCube?{...CUBE,...points}:points,azimuth=(explore||construction)&&!fixed?angle:camera[0],elevation=(explore||construction)&&!fixed?tilt:camera[1],a=azimuth*Math.PI/180,t=elevation*Math.PI/180,h=compact?250:width<390?310:390;
 const raw=(p:V3)=>parallelImage(p.map((v,i)=>(v-.5)*dimensions[i]) as V3,view,azimuth,elevation);
 const contentPoints=fitToContent?constructionBounds(Object.values(all),lines):Object.values(all);
 const cs=(fitToContent||segments.length>0||!showCube?[...contentPoints,...segments.flatMap(s=>[s.from,s.to])]:Object.values(CUBE)).map(raw);
 const {center,scale}=projectionFrame(cs,width,h);
 const project=(p:V3)=>{const [x,y]=raw(p);return [width/2+(x-center[0])*scale,h/2+(y-center[1])*scale]};
 const pp=(p:V3)=>project(p).map(x=>x.toFixed(2)).join(','),eye=[Math.cos(t)*Math.sin(a),-Math.cos(t)*Math.cos(a),Math.sin(t)];
 const pointGroups:Record<string,{names:string[];p:V3}>={};
 for(const [name,p] of Object.entries(all)){if(hiddenLabels.includes(name))continue;const xy=project(p),key=xy.map(v=>Math.round(v*10)).join(',');(pointGroups[key]??={names:[],p}).names.push(name)}
 return <div className={'geometry '+(compact?'compact':'')}><div ref={ref} className={"geometry-stage "+(canDrag?"can-rotate":"")} style={{height:h,touchAction:canDrag?"none":"pan-y"}} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onPointerLeave={()=>{if(drag.current&&!drag.current.moved)drag.current=null}} onLostPointerCapture={()=>{drag.current=null}} onClickCapture={e=>{if(suppressClick.current){e.preventDefault();e.stopPropagation();suppressClick.current=false}}}><svg viewBox={`0 0 ${width} ${h}`} width="100%" height={h} role="img" aria-label={ariaLabel}>
 <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#ffa35e" strokeWidth="1.4"/></marker></defs>
 {showCube&&!planes.length&&<polygon points={['E','F','G','H'].map(k=>pp(all[k])).join(' ')} fill="#56d8cd" fillOpacity=".06"/>}
 {planes.map((p,i)=><polygon key={p.join('')} points={p.filter(k=>all[k]).map(k=>pp(all[k])).join(' ')} fill={['#54dacc','#ffa35e','#aaa2ff'][i%3]} fillOpacity=".16" stroke={['#54dacc','#ffa35e','#aaa2ff'][i%3]} strokeOpacity=".5" strokeWidth="1"/>)}
 {showCube&&EDGES.map((e,i)=>{const [k,s,l,q]=edgeNormals[i],hidden=view==='spatial'&&eye[k]*s<0&&eye[l]*q<0;return <polyline key={e} points={pp(all[e[0]])+' '+pp(all[e[1]])} className="cube-edge" strokeDasharray={hidden?'5 6':undefined}/>})}
 {edges.filter(s=>s.length===2&&all[s[0]]&&all[s[1]]&&(!showCube||!EDGES.some(e=>e===s||e===s[1]+s[0]))).map(s=><polyline key={'base-'+s} points={pp(all[s[0]])+' '+pp(all[s[1]])} className="cube-edge" strokeDasharray={edgeIsHidden(s,edges,all,eye as V3)?'5 6':undefined}/>)}
 {highlights.filter(s=>s.length===2&&all[s[0]]&&all[s[1]]).map((s,i)=><polyline key={s} points={pp(all[s[0]])+' '+pp(all[s[1]])} className={'highlight-line color-'+i}/>)}
 {lines.map(l=>{const endpoints=l.infinite?clipProjectedLine(project(l.a),project(l.b),width,h):[project(l.a),project(l.b)];return endpoints&&<polyline key={l.id} points={endpoints.map(p=>p.map(v=>v.toFixed(2)).join(',')).join(' ')} className="drawn-line" strokeDasharray={l.infinite?'8 4':undefined}/>})}
 {segments.map((segment,i)=><polyline key={i} points={pp(segment.from)+' '+pp(segment.to)} fill="none" stroke={segment.color} strokeWidth="2.8" strokeLinecap="round" strokeDasharray={segment.dashed?'2 6':undefined} markerEnd={segment.arrow?`url(#${markerId})`:undefined}/>)}
 {Object.values(pointGroups).map(({names,p})=>{const [x,y]=project(p),active=names.some(k=>selected.includes(k));return <g key={names.join('-')}><circle cx={x} cy={y} r={active?7:3.3} fill={active?'#ffa35e':names.every(k=>'ABCDEFGH'.includes(k))?'#acc5d5':'#54dacc'}/>{!names.some(k=>selectable.includes(k))&&<text x={x+(x>width/2?12:-12)} y={y+(y>h/2?19:-10)} textAnchor="middle" className="point-label">{names.join(' / ')}</text>}</g>})}</svg>
 {selectable.filter(k=>all[k]).map(k=>{const [x,y]=project(all[k]);return <button type="button" key={k} className={'point-hit '+(selected.includes(k)?'chosen':'')} aria-label={`Punt ${k}`} aria-pressed={selected.includes(k)} style={{left:x,top:y}} disabled={construction&&explore} onClick={()=>onPoint?.(k)}><span>{k}</span></button>})}</div>
 {caption&&<p className="figure-caption">{caption}</p>}{canRotate&&<><div className="view-controls"><div className="view-buttons">{construction?<><Button variant={explore?'ghost':'outline'} className="small-action" aria-pressed={!explore} onClick={()=>setExplore(false)}><PanelTop/>Construeren</Button><Button variant={explore?'outline':'ghost'} className="small-action" aria-pressed={explore} onClick={exploreStart}><Rotate3D/>Rondkijken</Button></>:<Button variant="ghost" className="small-action" aria-pressed={explore} onClick={exploreStart}><Rotate3D/>Onderzoeken in 3D</Button>}<Button variant="ghost" className="small-action" onClick={reset}><RotateCcw/>Standaardtekening</Button></div><span>{construction&&!explore?'Tik punten aan om te construeren.':'Sleep met muis of vinger om rond te kijken.'}</span></div>{explore&&<div className="rotation-controls"><label>Draaien<Slider value={[angle]} min={-180} max={180} step={1} onValueChange={v=>setAngle(v[0])} aria-label="Draai de figuur"/></label><label>Kantelen<Slider value={[tilt]} min={-80} max={80} step={1} onValueChange={v=>setTilt(v[0])} aria-label="Kantel de figuur"/></label></div>}</>}</div>
}
