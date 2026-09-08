import {cross,dot,sub,mul,distance,type V3,type DrawLine} from './geometry-math';

// Line identity follows construction order, including restored drafts. Extending
// a line keeps its id and its position, so it also keeps its visual identity.
const LINE_COLORS=['#ffc078','#78c9ff','#d2a1ff','#ff91b7','#67ded1','#e6dc83'];
export const PLANE_COLORS=['#54dacc','#ffa35e','#aaa2ff'];
export function lineColor(line:DrawLine,lines:DrawLine[]){
 const index=lines.findIndex(l=>l.id===line.id);
 return index<0?'#7794aa':LINE_COLORS[index%LINE_COLORS.length];
}

/** Shade only an explicitly supplied closed, planar solution polygon. */
export function closedSectionPlane(segments:[V3,V3][],points:Record<string,V3>):string[][]{
 if(segments.length<3||segments.some((s,i)=>distance(s[1],segments[(i+1)%segments.length][0])>1e-7))return [];
 const vertices=segments.map(s=>s[0]),normal=cross(sub(vertices[1],vertices[0]),sub(vertices[2],vertices[0]));
 if(Math.hypot(...normal)<1e-8||vertices.some(v=>Math.abs(dot(normal,sub(v,vertices[0])))>1e-7))return [];
 const labels=vertices.map(v=>Object.keys(points).find(k=>distance(points[k],v)<1e-7));
 return labels.every((k):k is string=>!!k)?[labels]:[];
}

/** Only boundary faces of the given convex solid; never infer a target section. */
export function boundaryFaces(edges:string[],points:Record<string,V3>):string[][]{
 const names=[...new Set(edges.join('').split(''))].filter(k=>points[k]).sort();
 const faces=new Map<string,string[]>();
 for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++)for(let k=j+1;k<names.length;k++){
  const a=points[names[i]],u=sub(points[names[j]],a),n=cross(u,sub(points[names[k]],a)),size=Math.hypot(...n);
  if(size<1e-8)continue;
  const normal=mul(n,1/size),ds=names.map(key=>dot(normal,sub(points[key],a)));
  if(ds.some(d=>d>1e-7)&&ds.some(d=>d< -1e-7)||ds.every(d=>Math.abs(d)<1e-7))continue;
  const face=names.filter((_,ix)=>Math.abs(ds[ix])<1e-7),key=face.join('');
  if(faces.has(key))continue;
  const center=mul(face.reduce<V3>((sum,name)=>sum.map((v,ix)=>v+points[name][ix]) as V3,[0,0,0]),1/face.length);
  const axis=mul(u,1/distance(points[names[j]],a)),other=cross(normal,axis);
  face.sort((p,q)=>Math.atan2(dot(sub(points[p],center),other),dot(sub(points[p],center),axis))-Math.atan2(dot(sub(points[q],center),other),dot(sub(points[q],center),axis)));
  // Start the cyclic boundary at the alphabetically first vertex for readability.
  const start=face.indexOf([...face].sort()[0]),cycle=[...face.slice(start),...face.slice(0,start)];
  if(cycle[1]>cycle[cycle.length-1])cycle.splice(1,cycle.length-1,...cycle.slice(1).reverse());
  faces.set(key,cycle);
 }
 return [...faces.values()].sort((a,b)=>a.join('').localeCompare(b.join('')));
}
