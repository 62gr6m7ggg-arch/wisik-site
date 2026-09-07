import data from './construction-tasks.json';
import {distance,sub,cross,dot,type V3,type DrawLine} from './geometry-math';
import {pointOnSegment} from './workbench-math';
export type ConstructionTask={id:string;level:number;title:string;prompt:string;points:Record<string,V3>;edges:string[];givens:string[];targetSegments:[V3,V3][];targetPoints?:V3[];solutionPoints?:Record<string,V3>;hints:string[];solution:string[];reason:{prompt:string;options:{id:string;text:string}[];answer:string};exam?:'a'|'b'};
export const CONSTRUCTION_TASKS=(data as unknown as {tasks:ConstructionTask[]}).tasks;
export function verifyConstruction(task:ConstructionTask,lines:DrawLine[],points:Record<string,V3>){
 const finite=lines.filter(l=>!l.infinite&&distance(l.a,l.b)>1e-7);
 const complete=task.targetSegments.every(([a,b])=>finite.some(l=>{const u=sub(l.b,l.a);return Math.hypot(...cross(sub(a,l.a),u))<1e-7&&Math.hypot(...cross(sub(b,l.a),u))<1e-7&&pointOnSegment(a,l)&&pointOnSegment(b,l)}));
 return complete&&(task.targetPoints||[]).every(p=>Object.values(points).some(q=>distance(p,q)<1e-7));
}
export function footOnLine(p:V3,l:DrawLine):V3|null{const u=sub(l.b,l.a),den=dot(u,u);if(den<1e-12)return null;const t=dot(sub(p,l.a),u)/den;return l.a.map((v,i)=>v+t*u[i]) as V3;}
