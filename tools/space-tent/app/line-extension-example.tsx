'use client';

import Geometry,{type IllustrationSegment} from './geometry';
import {CUBE,add,mul,sub,type V3} from './geometry-math';

export const M:V3=[0,0,.5];
export const S:V3=[-1,-1,0];
const orange='#ffa35e',teal='#56d8cd';
const gm=sub(M,CUBE.G),ac=sub(CUBE.C,CUBE.A);
const segments:IllustrationSegment[]=[
 {from:CUBE.G,to:M,color:orange},
 {from:CUBE.A,to:CUBE.C,color:teal},
 {from:M,to:add(S,mul(gm,.18)),color:orange,dashed:true},
 {from:CUBE.G,to:add(CUBE.G,mul(gm,-.18)),color:orange,dashed:true},
 {from:CUBE.A,to:add(S,mul(ac,-.18)),color:teal,dashed:true},
 {from:CUBE.C,to:add(CUBE.C,mul(ac,.18)),color:teal,dashed:true},
];

export default function LineExtensionExample(){
 return <div className="line-extension-example">
  <Geometry points={{M,S}} segments={segments} fitToContent
   ariaLabel="Kubus ABCD.EFGH met M halverwege EA. De oranje lijn GM en de groene lijn AC lopen buiten de kubus gestippeld door. Ze snijden elkaar in S, voorbij M en voorbij A."
   caption="M ligt halverwege EA. Het snijpunt S ligt buiten de kubus. Ook voorbij S lopen de lijnen verder."/>
  <div className="extension-legend"><span style={{color:orange}}>Lijn GM</span><span style={{color:teal}}>Lijn AC</span><span>Gestippeld: buiten de kubus</span></div>
 </div>
}
