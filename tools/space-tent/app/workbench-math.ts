import {CUBE,distance,sub,cross,dot,type V3,type DrawLine} from './geometry-math';
export function initialPoints(variant:number):Record<string,V3>{return {...CUBE,...(variant===1?{P:[0,0,.3] as V3,Q:[1,0,.6] as V3,R:[1,1,.8] as V3}:{P:[0,0,.4] as V3,Q:[1,0,.7] as V3,R:[1,1,.5] as V3})}}
export function sectionPoints(variant:number):V3[]{const p=initialPoints(variant);return [p.P,p.Q,p.R,[0,1,p.P[2]+p.R[2]-p.Q[2]]]}
export function pointOnSegment(p:V3,l:DrawLine){return distance(p,l.a)+distance(p,l.b)-distance(l.a,l.b)<1e-6}
export function verifyWorkbench(input:unknown[],points:unknown,variant:number){
 if(!Array.isArray(input)||!points||typeof points!=='object')return false;
 const vec=(p:unknown):p is V3=>Array.isArray(p)&&p.length===3&&p.every(x=>typeof x==='number'&&Number.isFinite(x)&&Math.abs(x)<20);
 const valid=input.filter((l):l is DrawLine=>{if(!l||typeof l!=='object')return false;const v=l as DrawLine;return vec(v.a)&&vec(v.b)&&distance(v.a,v.b)>1e-6&&!v.infinite;});
 const corners=sectionPoints(variant);
 return corners.every((a,i)=>{const b=corners[(i+1)%4];return valid.some(l=>{const u=sub(l.b,l.a);return dot(cross(sub(a,l.a),u),cross(sub(a,l.a),u))<1e-10&&dot(cross(sub(b,l.a),u),cross(sub(b,l.a),u))<1e-10&&pointOnSegment(a,l)&&pointOnSegment(b,l)})});
}
