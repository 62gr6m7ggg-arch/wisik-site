import {cross,dot,mul,sub,type ProjectionView,type V3} from './geometry-math';
import type {ProjectionBasis} from './projection-lesson-math';
export const unit=(p:V3):V3=>mul(p,1/Math.hypot(...p));
export function viewingBasis(view:ProjectionView,angle=28,tilt=24):ProjectionBasis{
 if(view==='front')return {right:[1,0,0],up:[0,0,1],eye:[0,-1,0]};
 if(view==='top')return {right:[1,0,0],up:[0,1,0],eye:[0,0,1]};
 if(view==='right')return {right:[0,1,0],up:[0,0,1],eye:[1,0,0]};
 if(view==='scaled')return {right:[4,1,0],up:[0,Math.sqrt(3),4],eye:unit([.25,-1,Math.sqrt(3)/4])};
 if(view==='equal-image')return {right:[.5,.5,0],up:[0,Math.sqrt(3)/2,.5],eye:unit([1,-1,Math.sqrt(3)])};
 const a=angle*Math.PI/180,t=tilt*Math.PI/180;
 return {right:[Math.cos(a),Math.sin(a),0],up:[-Math.sin(t)*Math.sin(a),Math.sin(t)*Math.cos(a),Math.cos(t)],eye:[Math.cos(t)*Math.sin(a),-Math.cos(t)*Math.cos(a),Math.sin(t)]};
}
export function eyeLabel(eye:V3){
 const parts:string[]=[];
 if(Math.abs(eye[1])>1e-6)parts.push(eye[1]<0?'van voren':'van achteren');
 if(Math.abs(eye[0])>1e-6)parts.push(eye[0]>0?'van rechts':'van links');
 if(Math.abs(eye[2])>1e-6)parts.push(eye[2]>0?'van boven':'van onderen');
 return 'Je kijkt '+parts.join(', ')+'.';
}
/** A Euclidean, perpendicular view of a named plane in actual world units. */
export function planeBasis(names:string[],points:Record<string,V3>,toward:V3):ProjectionBasis|null{
 const ps=names.map(k=>points[k]);if(ps.length<3||ps.some(p=>!p))return null;
 const a=ps[0],b=ps.find(p=>Math.hypot(...sub(p,a))>1e-8);if(!b)return null;
 const right=unit(sub(b,a)),c=ps.find(p=>Math.hypot(...cross(right,sub(p,a)))>1e-8);if(!c)return null;
 let eye=unit(cross(right,sub(c,a)));
 if(ps.some(p=>Math.abs(dot(eye,sub(p,a)))>1e-7))return null;
 if(dot(eye,toward)<0)eye=mul(eye,-1);
 return {right,up:cross(eye,right),eye};
}
export function planarNames(points:Record<string,V3>,toward:V3){
 const names=Object.keys(points);return planeBasis(names,points,toward)?names:[];
}

/** A perpendicular observer follows the azimuth continuously. The entire
 * viewing ray stays visible in the overview, including at negative elevations. */
export function referenceCamera(eye:V3):[number,number]{
 return [Math.atan2(eye[0],-eye[1])*180/Math.PI+90,0];
}
