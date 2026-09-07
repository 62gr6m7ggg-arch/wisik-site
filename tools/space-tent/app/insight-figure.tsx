'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Slider} from '@/components/ui/slider';
import Geometry,{type IllustrationSegment} from './geometry';
import {CUBE,type V3} from './geometry-math';
import {COLORS,THREE_CASES,lineExtensions,type ExampleId} from './insight-scenes';
import LineExtensionExample from './line-extension-example';

export function Choices({items,value,onChange,label}:{items:[string,string][];value:string;onChange:(value:string)=>void;label:string}){
 return <div className="insight-choices" role="group" aria-label={label}>{items.map(([id,text])=><Button key={id} variant={value===id?'default':'outline'} aria-pressed={value===id} onClick={()=>onChange(id)}>{text}</Button>)}</div>
}
function Legend({names}:{names:string[]}){return <div className="insight-legend">{names.map((name,i)=><span key={name} style={{color:['#54dacc','#ffa35e','#aaa2ff'][i%3]}}>{name}</span>)}</div>}
export function ProjectionViews(){
 const [view,setView]=useState('front');
 const v=view as 'front'|'top'|'right';
 const info={front:{name:'Vooraanzicht',direction:'AD',plane:['A','B','F','E'],text:'De diepte verdwijnt. A en D komen op dezelfde beeldplek, net als B/C, E/H en F/G.',arrow:{from:[-.25,-.65,.5] as V3,to:[-.25,0,.5] as V3}},top:{name:'Bovenaanzicht',direction:'AE',plane:['A','B','C','D'],text:'De hoogte verdwijnt. A/E, B/F, C/G en D/H vallen telkens samen.',arrow:{from:[.5,-.25,1.6] as V3,to:[.5,-.25,1] as V3}},right:{name:'Rechterzijaanzicht',direction:'AB',plane:['B','C','G','F'],text:'De richting AB verdwijnt. A/B, C/D, E/F en G/H vallen telkens samen.',arrow:{from:[1.6,-.2,.5] as V3,to:[1,-.2,.5] as V3}}}[v];
 return <><Choices items={[["front","Voor"],["top","Boven"],["right","Rechts"]]} value={view} onChange={setView} label="Kies een aanzicht"/><div className="projection-pair"><div><h3>De kubus</h3><Geometry fixed compact planes={[info.plane]} segments={[{...info.arrow,color:COLORS[0],arrow:true}]} fitToContent caption={'Kijk evenwijdig aan '+info.direction}/></div><div><h3>{info.name}</h3><Geometry fixed compact view={v} caption="Dubbele namen: dezelfde beeldplek."/></div></div><p className="insight-explanation">{info.text}</p></>
}
export function PlaneHinge(){
 const [angle,setAngle]=useState(35),[locked,setLocked]=useState(false);
 const t=angle*Math.PI/180,points={M:[.5,0,0] as V3,U:[0,Math.cos(t),Math.sin(t)] as V3,V:[1,Math.cos(t),Math.sin(t)] as V3};
 return <><Geometry points={points} planes={[["A","B","V","U"]]} highlights={['AB']} hiddenLabels={['U','V']} selected={locked?['C']:['M']} caption="A, M en B blijven bij elke stand in het vlak."/><label className="insight-slider">Draai het vlak om AB <span>{angle}°</span><Slider min={0} max={90} step={1} value={[angle]} disabled={locked} onValueChange={v=>setAngle(v[0])} aria-label="Draai het vlak om AB"/></label><Button variant="outline" onClick={()=>{setLocked(!locked);setAngle(locked?35:0)}}>{locked?'Laat punt C weer los':'Leg ook punt C vast'}</Button><p className="insight-explanation">{locked?'C ligt buiten AB. Van alle vlakken door AB bevat alleen vlak ABCD ook C. De stand ligt nu vast.':`A, M en B liggen op één lijn. Het vlak kan nog draaien. ${angle===0?'In deze stand ligt C er ook in.':'C ligt nu buiten het gekleurde vlak.'}`}</p></>
}
export function ThreePlanes({initial='line',single=false}:{initial?:keyof typeof THREE_CASES;single?:boolean}){
 const [which,setWhich]=useState<keyof typeof THREE_CASES>(initial),[pairs,setPairs]=useState(true);
 const c=THREE_CASES[which];
 return <>{!single&&<Choices items={Object.entries(THREE_CASES).map(([id,c])=>[id,c.title])} value={which} onChange={v=>setWhich(v as keyof typeof THREE_CASES)} label="Vergelijk drie vlakken"/>}<Geometry planes={c.planes} highlights={pairs?c.lines:[]} segments={pairs?lineExtensions(c.lines):[]} selected={pairs?c.selected:[]} caption="De gekleurde vlakken en snijlijnen lopen onbeperkt door."/><Legend names={c.names.map(n=>'Vlak '+n)}/><Button variant="outline" onClick={()=>setPairs(!pairs)}>{pairs?'Alleen de vlakken bekijken':'Toon de snijlijnen'}</Button>{pairs&&<div className="plane-pairs">{c.pairs.map(pair=><span key={pair}>{pair}</span>)}</div>}<p className="insight-explanation">{c.text}</p></>
}
function PlaneDefinitions(){
 const [which,setWhich]=useState('point');
 const data={point:{highlights:['AB'],points:['H'],planes:[['A','B','G','H']],text:'AB en punt H buiten AB bepalen het diagonale vlak ABGH.'},intersect:{highlights:['AC','BD'],points:['I'],planes:[['A','B','C','D']],text:'De snijdende lijnen AC en BD bepalen het grondvlak ABCD.'},parallel:{highlights:['AB','HG'],points:[],planes:[['A','B','G','H']],text:'De verschillende evenwijdige lijnen AB en HG bepalen samen vlak ABGH.'}}[which]!;
 return <><Choices items={[["point","Lijn + punt"],["intersect","Snijdende lijnen"],["parallel","Evenwijdige lijnen"]]} value={which} onChange={setWhich} label="Manieren om een vlak vast te leggen"/><Geometry points={which==='intersect'?{I:[.5,.5,0]}:{}} highlights={data.highlights} planes={data.planes} selected={data.points}/><p className="insight-explanation">{data.text}</p></>
}
export function ExtendedPlane({point='U'}:{point?:'U'|'T'}){
 const points:Record<string,V3>={J:[-.45,-.45,0],K:[1.65,-.45,0],L:[1.65,1.45,0],N:[-.45,1.45,0],...(point==='T'?{T:[1.35,0,0] as V3}:{U:[-.3,.4,0] as V3})};
 return <><Geometry points={points} hiddenLabels={['J','K','L','N']} fitToContent planes={[["J","K","L","N"],["A","B","C"]]} highlights={['AB','BC','CD','DA']} selected={[point]} segments={point==='T'?[{from:CUBE.B,to:points.T,color:COLORS[0],dashed:true}]:[]} caption={`Punt ${point} ligt buiten de kubus, maar in hetzelfde vlak als A, B en C.`}/><p className="insight-explanation">Driehoek ABC en vierhoek ABCD zijn begrensde stukken van het vlak. Ook de buitenrand van het gekleurde vlak is alleen een tekenrand: het vlak gaat verder.</p></>
}
export function IntersectionExample(){
 const [step,setStep]=useState('points');
 return <><Choices items={[["planes","1. Twee vlakken"],["points","2. Gedeelde punten"],["line","3. Snijlijn"]]} value={step} onChange={setStep} label="Volg de redenering naar de snijlijn"/><Geometry planes={[["A","B","F","E"],["A","D","H","E"]]} selected={step==='planes'?[]:['A','E']} highlights={step==='line'?['AE']:[]} segments={step==='line'?lineExtensions(['AE']):[]} caption="Voorvlak ABF en linkervlak ADH."/><p className="insight-explanation">{step==='planes'?'Zoek punten die in beide verschillende vlakken liggen.':step==='points'?'A en E liggen in beide vlakken. Dat zijn twee verschillende punten.':'Beide vlakken bevatten de hele lijn door A en E. De volledige lijn AE is dus hun snijlijn.'}</p></>
}
function LineRelations(){
 const [which,setWhich]=useState('skew');
 const data={intersect:{line:'BC',selected:['B'],text:'AB en BC delen B. Hun lijnen snijden dus in B.'},parallel:{line:'HG',selected:[],text:'AB en HG hebben dezelfde richting en geen gemeenschappelijk punt: evenwijdig.'},skew:{line:'CG',selected:[],text:'AB en CG hebben verschillende richtingen en geen gemeenschappelijk punt, ook bij verlengen: kruisend.'}}[which]!;
 return <><Choices items={[["intersect","Snijdend"],["parallel","Evenwijdig"],["skew","Kruisend"]]} value={which} onChange={setWhich} label="Vergelijk lijnen met AB"/><Geometry highlights={['AB',data.line]} selected={data.selected} segments={lineExtensions(['AB',data.line])}/><p className="insight-explanation">{data.text}</p></>
}
export function FalseCrossing(){
 const points:Record<string,V3>={K:[.5,.5,0],L:[.5,.5,1]};
 return <><div className="projection-pair"><div><h3>Van boven</h3><Geometry fixed compact view="top" highlights={['BD','EG']} points={points} caption="K en L hebben hetzelfde beeld."/></div><div><h3>In de ruimte</h3><Geometry fixed compact highlights={['BD','EG']} points={points} segments={[{from:points.K,to:points.L,color:'#bed0dc',dashed:true}]} caption="K ligt onder L: het zijn twee punten."/></div></div><p className="insight-explanation">De beelden van BD en EG kruisen. BD ligt echter in het ondervlak en EG in het bovenvlak. De ruimtelijke lijnen hebben verschillende richtingen en geen gedeeld punt.</p></>
}
export function DirectionScale(){
 const [which,setWhich]=useState('scaled');
 return <><Choices items={[["scaled","Vaste beeldmaten"],["turn","Andere kijkrichting"]]} value={which} onChange={setWhich} label="Vergelijk projecties van dezelfde kubus"/><Geometry fixed view={which==='scaled'?'scaled':'spatial'} camera={[70,18]} highlights={['AB','AD','AE']} caption="Werkelijk: AB = AD = AE = 6 cm."/><div className="insight-facts">{which==='scaled'?<><span>Beeld AB: 4 cm</span><span>Beeld AD: 2 cm</span><span>Beeld AE: 3 cm</span></>:<span>De kijkrichting verandert; de echte ribben blijven 6 cm.</span>}</div><p className="insight-explanation">{which==='scaled'?'Elke richting heeft haar eigen beeldschaal: 4/6, 2/6 en 3/6. De rechte hoek BAD wordt in dit beeld 60°. De figuur schaalt mee met je scherm.':'Ook een tweede geldige parallelprojectie kan dezelfde kubus anders weergeven. Gebruik de gegevens van het object om echte lengtes te bepalen.'}</p></>
}
function ParallelPlanes(){
 const [third,setThird]=useState('cut');
 const points:Record<string,V3>={I:[0,0,.5],J:[1,0,.5],K:[1,1,.5],L:[0,1,.5]};
 return <><Choices items={[["cut","Eén parallel paar"],["parallel","Drie parallelle vlakken"]]} value={third} onChange={setThird} label="Vergelijk evenwijdige vlakken"/><Geometry points={third==='parallel'?points:{}} hiddenLabels={['I','J','K','L']} planes={[["A","B","C","D"],["E","F","G","H"],third==='cut'?["A","B","F","E"]:["I","J","K","L"]]} highlights={third==='cut'?['AB','EF']:[]} segments={third==='cut'?lineExtensions(['AB','EF']):[]}/><p className="insight-explanation">{third==='cut'?'ABC en EFG zijn evenwijdig. Vlak ABF snijdt ze langs AB en EF: twee evenwijdige snijlijnen. Geen punt ligt in alle drie vlakken.':'Deze drie verschillende horizontale vlakken zijn evenwijdig. Geen enkel paar heeft een snijlijn.'}</p></>
}

export default function InsightFigure({example}:{example:ExampleId}){
 switch(example){
  case 'external-intersection':return <LineExtensionExample/>;
  case 'projection-views':return <ProjectionViews/>;
  case 'midpoint':return <><Geometry points={{M:[.5,.5,.5]}} highlights={['AM','MG']} selected={['M']} caption="M is het midden van AG: AM en MG zijn even lang."/><p className="insight-explanation">De twee helften hebben dezelfde richting en dezelfde lengte. Ze krijgen dezelfde beeldschaal. Draai het beeld: zolang A en G niet samenvallen, blijft M midden tussen hun beelden.</p></>;
  case 'direction-scale':return <DirectionScale/>;
  case 'line-relations':return <LineRelations/>;
  case 'shared-plane':return <><Geometry points={{I:[.5,0,.5]}} planes={[["A","B","F","E"]]} highlights={['AF','BE']} selected={['I']} segments={lineExtensions(['AF','BE'])} caption="AF en BE liggen samen in het voorvlak ABFE."/><p className="insight-explanation">De diagonalen ontmoeten elkaar echt in I, het midden van het voorvlak. Ook buiten het vlakdeel dat je tekent lopen de lijnen verder.</p></>;
  case 'false-crossing':return <FalseCrossing/>;
  case 'plane-hinge':return <PlaneHinge/>;
  case 'plane-definitions':return <PlaneDefinitions/>;
  case 'plane-extension':return <ExtendedPlane/>;
  case 'plane-intersection':return <IntersectionExample/>;
  case 'plane-pairs':return <ThreePlanes initial="point" single/>;
  case 'parallel-planes':return <ParallelPlanes/>;
  case 'three-planes':return <ThreePlanes/>;
  case 'triangle-walls':return <ThreePlanes initial="none" single/>;
 }
}
