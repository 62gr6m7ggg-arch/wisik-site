import {useMemo,useRef,useState} from 'react';
import type {FigureModel,V3} from './types';
const sub=(a:V3,b:V3):V3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const dot=(a:V3,b:V3)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a:V3,b:V3):V3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export function projectModel(model:FigureModel,yaw=-0.55,pitch=0.5){
 const names=Object.keys(model.points),vertices=[...new Set(model.faces.join('').split(''))];
 const center:V3=[0,1,2].map(i=>vertices.reduce((s,k)=>s+model.points[k][i],0)/vertices.length) as V3;
 const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 const camera:V3=[-sy*cp,-cy*cp,sp];
 const raw=Object.fromEntries(names.map(k=>{const [x,y,z]=sub(model.points[k],center);return [k,[cy*x-sy*y,-sy*sp*x-cy*sp*y-cp*z,dot([x,y,z],camera)]];})) as Record<string,V3>;
 const xs=names.map(k=>raw[k][0]),ys=names.map(k=>raw[k][1]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys),scale=Math.min(300/Math.max(xmax-xmin,1e-7),255/Math.max(ymax-ymin,1e-7));
 const screen=Object.fromEntries(names.map(k=>[k,[210+(raw[k][0]-(xmin+xmax)/2)*scale,176+(raw[k][1]-(ymin+ymax)/2)*scale]])) as Record<string,[number,number]>;
 const faces=model.faces.map(text=>{const ns=text.split(''),a=model.points[ns[0]],b=model.points[ns[1]],c=model.points[ns[2]];let n=cross(sub(b,a),sub(c,a));const mid:V3=[0,1,2].map(i=>ns.reduce((s,k)=>s+model.points[k][i],0)/ns.length) as V3;if(dot(n,sub(mid,center))<0)n=n.map(x=>-x) as V3;return {names:ns,front:model.faces.length===1||dot(n,camera)>1e-8,depth:ns.reduce((s,k)=>s+raw[k][2],0)/ns.length};}).sort((a,b)=>a.depth-b.depth);
 const edges=new Map<string,{a:string;b:string;visible:boolean}>();
 for(const face of faces)for(let i=0;i<face.names.length;i++){const a=face.names[i],b=face.names[(i+1)%face.names.length],key=[a,b].sort().join('|');const prior=edges.get(key);edges.set(key,{a,b,visible:face.front||!!prior?.visible});}
 const labels:Record<string,{x:number;y:number}>={},boxes:{x:number;y:number;w:number;h:number}[]=[];
 const overlap=(a:{x:number;y:number;w:number;h:number},b:{x:number;y:number;w:number;h:number})=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
 for(const k of names){const [x,y]=screen[k],w=18*Math.max(1,k.length*.65),h=23;let best={x:x+10,y:y-10},bestScore=Infinity;
  for(const [dx,dy] of [[14,-13],[-15,-13],[16,18],[-16,18],[0,-20],[0,26],[26,1],[-26,1],[25,-26],[-25,30]]){
   const nx=Math.max(w/2+4,Math.min(416-w/2,x+dx)),ny=Math.max(23,Math.min(348,y+dy)),box={x:nx-w/2,y:ny-18,w,h};
   const hits=boxes.filter(b=>overlap(box,b)).length,pointHits=names.filter(n=>n!==k&&screen[n][0]>box.x-3&&screen[n][0]<box.x+w+3&&screen[n][1]>box.y-3&&screen[n][1]<box.y+h+3).length;
   const outward=(nx-210)*(x-210)+(ny-176)*(y-176);const score=hits*10000+pointHits*5000+dx*dx+dy*dy-outward*.09;
   if(score<bestScore){bestScore=score;best={x:nx,y:ny};}
  }
  labels[k]=best;boxes.push({x:best.x-w/2,y:best.y-18,w,h});
 }
 return {screen,faces,edges:[...edges.values()],labels};
}
export default function ArenaFigure({model,title,interactive=true}:{model:FigureModel;title:string;interactive?:boolean}){
 const [yaw,setYaw]=useState(-0.55),[pitch,setPitch]=useState(0.5),drag=useRef<{id:number;x:number;y:number;ya:number;pi:number}|null>(null);
 const p=useMemo(()=>projectModel(model,yaw,pitch),[model,yaw,pitch]);
 const rotate=(dy:number,dp=0)=>{setYaw(y=>y+dy);setPitch(x=>Math.max(-1.45,Math.min(1.45,x+dp)));};
 return <figure className="arena-figure"><svg viewBox="0 0 420 360" role="img" aria-label={title+'; ruimtelijke figuur. Alle gegevens staan ook in tekst.'} tabIndex={interactive?0:undefined}
  onKeyDown={e=>{if(!interactive)return;const changes:Record<string,[number,number]>={ArrowLeft:[-.18,0],ArrowRight:[.18,0],ArrowUp:[0,.12],ArrowDown:[0,-.12]};if(changes[e.key]){e.preventDefault();rotate(...changes[e.key]);}}}
  onPointerDown={e=>{if(!interactive||e.button!==0)return;drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,ya:yaw,pi:pitch};e.currentTarget.setPointerCapture(e.pointerId);}}
  onPointerMove={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;setYaw(d.ya+(e.clientX-d.x)*.012);setPitch(Math.max(-1.45,Math.min(1.45,d.pi-(e.clientY-d.y)*.008)));}}
  onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
  <title>{title}</title>
  {p.faces.filter(f=>f.front).map((f,i)=><polygon key={f.names.join('')} points={f.names.map(k=>p.screen[k].join(',')).join(' ')} className={'arena-face arena-face-'+i%3}/>)}
  {p.edges.sort((a,b)=>Number(a.visible)-Number(b.visible)).map(e=><line key={e.a+'-'+e.b} x1={p.screen[e.a][0]} y1={p.screen[e.a][1]} x2={p.screen[e.b][0]} y2={p.screen[e.b][1]} className={e.visible?'arena-edge':'arena-hidden-edge'}/>)}
  {(model.extra||[]).map(([a,b],i)=>p.screen[a]&&p.screen[b]?<line key={i} x1={p.screen[a][0]} y1={p.screen[a][1]} x2={p.screen[b][0]} y2={p.screen[b][1]} className="arena-helper-edge"/>:null)}
  {Object.keys(model.points).map(k=><g key={k}><circle cx={p.screen[k][0]} cy={p.screen[k][1]} r="3.5" className="arena-point"/><text x={p.labels[k].x} y={p.labels[k].y} textAnchor="middle" className="arena-point-label">{k}</text></g>)}
 </svg>{interactive&&<div className="arena-figure-actions"><button type="button" aria-label="Draai figuur links" onClick={()=>rotate(-.25)}>↶ Links</button><button type="button" aria-label="Draai figuur rechts" onClick={()=>rotate(.25)}>Rechts ↷</button><button type="button" onClick={()=>{setYaw(0);setPitch(1.45);}}>Bovenaanzicht</button><button type="button" onClick={()=>{setYaw(-.55);setPitch(.5);}}>Beginstand</button></div>}<figcaption>{interactive?'Sleep horizontaal of gebruik de knoppen of pijltjestoetsen. ':''}Meet niet op het perspectiefplaatje; gebruik de gegeven maten.</figcaption></figure>;
}
