export type V3=[number,number,number];
export type ProjectionView='spatial'|'front'|'top'|'right'|'scaled'|'equal-image';
export function parallelImage([x,y,z]:V3,view:ProjectionView='spatial',angle=28,tilt=24):[number,number]{
 if(view==='front')return [x,-z];
 if(view==='top')return [x,-y];
 if(view==='right')return [y,-z];
 if(view==='scaled')return [4*x+y,-Math.sqrt(3)*y-3*z];
 if(view==='equal-image')return [.5*x+.5*y,-Math.sqrt(3)/2*y-.75*z];
 const a=angle*Math.PI/180,t=tilt*Math.PI/180;
 return [Math.cos(a)*x+Math.sin(a)*y,Math.sin(t)*(Math.sin(a)*x-Math.cos(a)*y)-Math.cos(t)*z];
}
export const CUBE:Record<string,V3>={A:[0,0,0],B:[1,0,0],C:[1,1,0],D:[0,1,0],E:[0,0,1],F:[1,0,1],G:[1,1,1],H:[0,1,1]};
export const EDGES=['AB','BC','CD','DA','EF','FG','GH','HE','AE','BF','CG','DH'];
export const sub=(a:V3,b:V3):V3=>a.map((x,i)=>x-b[i]) as V3;
export const add=(a:V3,b:V3):V3=>a.map((x,i)=>x+b[i]) as V3;
export const mul=(a:V3,s:number):V3=>a.map(x=>x*s) as V3;
export const dot=(a:V3,b:V3)=>a.reduce((s,x,i)=>s+x*b[i],0);
export const cross=(a:V3,b:V3):V3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const distance=(a:V3,b:V3)=>Math.sqrt(dot(sub(a,b),sub(a,b)));
export type DrawLine={id:string;a:V3;b:V3;name:string;infinite?:boolean};
export function lineIntersection(a:DrawLine,b:DrawLine):V3|null{const u=sub(a.b,a.a),v=sub(b.b,b.a),w=sub(b.a,a.a),n=cross(u,v),den=dot(n,n);if(den<1e-10||Math.abs(dot(w,n))>1e-7)return null;const t=dot(cross(w,v),n)/den,p=add(a.a,mul(u,t));return p.every(Number.isFinite)?p:null}

// Frame only the student's existing geometry. Candidate intersections affect
// the camera, but do not add labelled points or construct an answer.
export function constructionBounds(points:V3[],lines:DrawLine[]):V3[]{
 const bounds=[...points,...lines.flatMap(l=>[l.a,l.b])];
 const contains=(l:DrawLine,p:V3)=>l.infinite||distance(p,l.a)+distance(p,l.b)-distance(l.a,l.b)<1e-6;
 for(let i=0;i<lines.length;i++)for(let j=i+1;j<lines.length;j++){
  const p=lineIntersection(lines[i],lines[j]);
  if(p&&contains(lines[i],p)&&contains(lines[j],p))bounds.push(p);
 }
 return bounds;
}
export function projectionFrame(points:[number,number][],width:number,height:number){
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
 return {center:[(xmin+xmax)/2,(ymin+ymax)/2] as [number,number],scale:Math.min(Math.max(1,width-100)/Math.max(.1,xmax-xmin),Math.max(1,height-100)/Math.max(.1,ymax-ymin))};
}
// Clip an infinite projected line to the actual viewport, not an arbitrary
// multiple of its defining segment (which may stop before the intersection).
export function clipProjectedLine(a:number[],b:number[],width:number,height:number,padding=18):[number[],number[]]|null{
 const d=b.map((v,i)=>v-a[i]);let lo=-Infinity,hi=Infinity;
 if(Math.hypot(...d)<1e-9)return null;
 for(let i=0;i<2;i++){
  const min=padding,max=(i===0?width:height)-padding;
  if(Math.abs(d[i])<1e-9){if(a[i]<min||a[i]>max)return null;continue;}
  const t1=(min-a[i])/d[i],t2=(max-a[i])/d[i];lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));
 }
 return lo>hi?null:[a.map((v,i)=>v+lo*d[i]),a.map((v,i)=>v+hi*d[i])];
}

/** Convex solid edge visibility from its actual face planes (custom prisms/pyramids). */
export function edgeIsHidden(edge:string,edges:string[],points:Record<string,V3>,eye:V3){
 const vertices=[...new Set(edges.join('').split(''))].map(k=>points[k]).filter(Boolean),a=points[edge[0]],b=points[edge[1]];
 if(!a||!b||vertices.length<4)return false;
 const u=sub(b,a),normals:V3[]=[];
 for(const p of vertices){let n=cross(u,sub(p,a));const size=Math.hypot(...n);if(size<1e-8)continue;n=mul(n,1/size);const distances=vertices.map(v=>dot(n,sub(v,a)));if(distances.some(d=>d>1e-7)&&distances.some(d=>d< -1e-7))continue;if(distances.every(d=>Math.abs(d)<1e-7))continue;if(distances.some(d=>d>1e-7))n=mul(n,-1);if(!normals.some(m=>distance(m,n)<1e-7))normals.push(n)}
 return normals.length>=2&&normals.every(n=>dot(n,eye)< -1e-8);
}
