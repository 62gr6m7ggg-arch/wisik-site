import {dot,mul,type V3} from './geometry-math';

export type ProjectionBasis={right:V3;up:V3;eye:V3};
export type LessonProjection=ProjectionBasis&{planeRight:V3;planeUp:V3;kind:'oblique'|'orthographic'};
export const LESSON_CAMERA:[number,number]=[28,35];
export const LESSON_FRAME:[number,number][]=[[-.72,-.81],[.72,.81]];

/** Position 0: familiar cabinet drawing; 1: front view; 2: oblique view
 * with orthogonal projection. Intermediate states are valid projections too.
 * The screen scale stays fixed: one unshortened 6 cm edge is drawn as 4 cm.
 */
export function lessonProjection(position:number):LessonProjection{
 const p=Math.max(0,Math.min(2,position));
 if(p<=1){
  const x=(1-p)/4,z=(1-p)*Math.sqrt(3)/4,eye:V3=[x,-1,z];
  return {right:[1,x,0],up:[0,z,1],eye:mul(eye,1/Math.hypot(...eye)),planeRight:[1,0,0],planeUp:[0,0,1],kind:p===1?'orthographic':'oblique'};
 }
 const a=(p-1)*LESSON_CAMERA[0]*Math.PI/180,t=(p-1)*LESSON_CAMERA[1]*Math.PI/180;
 const right:V3=[Math.cos(a),Math.sin(a),0],up:V3=[-Math.sin(t)*Math.sin(a),Math.sin(t)*Math.cos(a),Math.cos(t)];
 return {right,up,eye:[Math.cos(t)*Math.sin(a),-Math.cos(t)*Math.cos(a),Math.sin(t)],planeRight:right,planeUp:up,kind:'orthographic'};
}
export const projectLessonPoint=(p:V3,b:ProjectionBasis):[number,number]=>[dot(p,b.right),-dot(p,b.up)];
export function lessonImageLengths(b:ProjectionBasis){
 return {AB:4*Math.hypot(b.right[0],b.up[0]),AD:4*Math.hypot(b.right[1],b.up[1]),AE:4*Math.hypot(b.right[2],b.up[2])};
}
