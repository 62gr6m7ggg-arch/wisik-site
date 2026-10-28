// Analytisch geconstrueerde figuren: geen benaderde relaties uit plaatjes.
export const add=(a,b)=>[a[0]+b[0],a[1]+b[1]], sub=(a,b)=>[a[0]-b[0],a[1]-b[1]], mul=(a,k)=>[a[0]*k,a[1]*k];
export const dot=(a,b)=>a[0]*b[0]+a[1]*b[1], norm=a=>Math.hypot(...a), mid=(a,b)=>mul(add(a,b),.5);
export const lerp=(a,b,t)=>add(a,mul(sub(b,a),t));
export const polar=(d,r=1)=>[r*Math.cos(d*Math.PI/180),r*Math.sin(d*Math.PI/180)];
export function intersect(a,b,c,d){const u=sub(b,a),v=sub(d,c),w=sub(c,a),cross=(p,q)=>p[0]*q[1]-p[1]*q[0];return add(a,mul(u,cross(w,v)/cross(u,v)));}
export const foot=(p,a,b)=>add(a,mul(sub(b,a),dot(sub(p,a),sub(b,a))/dot(sub(b,a),sub(b,a))));
export function circum(a,b,c){const ab=mid(a,b),bc=mid(b,c),u=sub(b,a),v=sub(c,b);const o=intersect(ab,add(ab,[-u[1],u[0]]),bc,add(bc,[-v[1],v[0]]));return {o,r:norm(sub(o,a))};}
export function model(key,angle=70){
 if(key==='chord'){const M=[0,0],C=[.5,.45],u=polar(15),S=sub(C,mul(u,dot(C,u))),h=Math.sqrt(1-dot(S,S));return {M,C,S,P:add(S,mul(u,-h)),Q:add(S,mul(u,h))};}
 if(key==='geo'||key==='geoBuild')return {P:[0,0],A:[0,0],S:[0,1.6],T:[0,-2.4],Q:[-2.4,1.6],R:[-1.6,-2.4]};
 if(key==='para'||key==='paraCircle'){const A=[-.6,-.8],B=[1,0],C=[1,1.6],D=[-.6,.8],unit=v=>mul(v,1/norm(v)),u=add(unit(sub(A,D)),unit(sub(B,D))),E=intersect(D,add(D,u),B,C),v=sub(E,D),F=add(D,mul(v,-2*dot(D,v)/dot(v,v)));return {A,B,C,D,E,F};}
 if(key==='altitude'||key==='locus'){const A=polar(210),B=polar(330),C=polar(280),P=polar(angle),Q=foot(B,A,P),R=intersect(B,Q,C,P);const Rof=a=>{const p=polar(a);return intersect(B,foot(B,A,p),C,p);};const S=polar(150),T=polar(30),U=Rof(150),V=Rof(30),circle=circum(B,C,R);return {A,B,C,P,Q,R,S,T,U,V,circle,Rof};}
 if(key==='inverse'){const M=[0,0],P=[2.5,.4],Q=[1.6,1.7];return {M,P,Q,Pi:mul(P,1/dot(P,P)),Qi:mul(Q,1/dot(Q,Q))};}
 if(key==='inverseCircle'){const M=[0,0],A=[2,0],B=[2,1.8];return {M,A,B,Ai:[.5,0],Bi:mul(B,1/dot(B,B))};}
 const A=polar(210),B=polar(330),C=polar(70),D=polar(150),S=intersect(A,C,B,D),E=lerp(S,D,.45),F=intersect(E,add(E,[1,0]),A,C);return {A,B,C,D,S,E,F,circle:circum(C,D,E)};
}
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function drawFigure(key,step=0,angle=70){
 const p=model(key,angle),parts=[],labels=[],pointLabels=new Map();let bounds=[-1.4,-1.4,1.4,1.4];
 if(key.startsWith('geo'))bounds=[-3.4,-3,3,2.3];
 if(key.startsWith('para'))bounds=[-1.15,-2.15,1.55,1.95];
 if(key==='inverse')bounds=[-1.2,-1.2,3,2.2];
 if(key==='inverseCircle')bounds=[-1.15,-1.15,2.6,2.3];
 if(key.startsWith('cyclic'))bounds=[-1.3,-1.15,1.3,1.95];
 const [xmin,ymin,xmax,ymax]=bounds,scale=Math.min(540/(xmax-xmin),342/(ymax-ymin));const xoff=(640-scale*(xmax-xmin))/2,yoff=(430-scale*(ymax-ymin))/2;
 const xy=a=>[xoff+(a[0]-xmin)*scale,430-yoff-(a[1]-ymin)*scale];
 const attrs=c=>`class="${c||'given'}"`;
 function line(a,b,c='given'){a=xy(a);b=xy(b);parts.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${attrs(c)}/>`);}
 function poly(ps,c='given',closed=true){parts.push(`<${closed?'polygon':'polyline'} points="${ps.map(a=>xy(a).join(',')).join(' ')}" ${attrs(c)}/>`);}
 function circle(o,r,c='circle'){o=xy(o);parts.push(`<circle cx="${o[0]}" cy="${o[1]}" r="${r*scale}" ${attrs(c)}/>`);}
 function point(name,a,dx=10,dy=-10){const k=a.map(v=>v.toFixed(7)).join();if(pointLabels.has(k)){const previous=pointLabels.get(k);labels[previous.index]=labels[previous.index].replace(`>${esc(previous.name)}</text>`,`>${esc(previous.name+"="+name)}</text>`);previous.name+="="+name;return;}pointLabels.set(k,{index:labels.length,name});a=xy(a);labels.push(`<circle cx="${a[0]}" cy="${a[1]}" r="3" class="point"/><text x="${a[0]+dx}" y="${a[1]+dy}" class="point-label">${esc(name)}</text>`);}
 function angleMark(a,v,b,name='',c='accent',radius=24){a=xy(a);v=xy(v);b=xy(b);const t=Math.atan2(a[1]-v[1],a[0]-v[0]),z=Math.atan2(b[1]-v[1],b[0]-v[0]);let delta=(z-t+3*Math.PI)%(2*Math.PI)-Math.PI;const q=[v[0]+radius*Math.cos(t),v[1]+radius*Math.sin(t)],r=[v[0]+radius*Math.cos(t+delta),v[1]+radius*Math.sin(t+delta)];parts.push(`<path d="M${q} A${radius},${radius} 0 0 ${delta>0?1:0} ${r}" class="${c}"/>`);if(name)labels.push(`<text x="${v[0]+(radius+14)*Math.cos(t+delta/2)}" y="${v[1]+(radius+14)*Math.sin(t+delta/2)+5}" text-anchor="middle" class="angle-label">${name}</text>`);}
 function right(a,v,b){a=sub(a,v);b=sub(b,v);a=mul(a,.09/norm(a));b=mul(b,.09/norm(b));poly([add(v,a),add(add(v,a),b),add(v,b)],'accent',false);}
 function tick(a,b,count=1){const m=mid(a,b),u=sub(b,a),n=mul([-u[1],u[0]],.045/norm(u)),dir=mul(u,.045/norm(u));for(let j=0;j<count;j++){const c=add(m,mul(dir,j-(count-1)/2));line(sub(c,n),add(c,n),'accent');}}
 if(key==='chord'){
  circle(p.M,1);line(p.P,p.Q);['M','P','Q','S','C'].forEach(n=>point(n,p[n],n==='S'?-16:9,n==='C'?20:-10));
  if(step>=1){poly([p.M,p.P,p.S],'shade');poly([p.M,p.Q,p.S],'shade2');line(p.M,p.P,'accent');line(p.M,p.Q,'accent');line(p.M,p.S,'aux');tick(p.M,p.P);tick(p.M,p.Q);tick(p.P,p.S,2);tick(p.S,p.Q,2);}
  if(step>=2){right(p.M,p.S,p.Q);right(p.M,p.S,p.P);}
  if(step>=3){circle(mid(p.M,p.C),norm(sub(p.M,p.C))/2,'accent');line(p.M,p.C,'aux');}
 }else if(key.startsWith('geo')){
  const a=key==='geo'?'P':'A';line([-3.1,1.6],[2.6,1.6]);line([-3.1,-2.4],[2.6,-2.4]);point('k',[2.6,1.6]);point('m',[2.6,-2.4]);point(a,p[a],10,4);
  if(key==='geo'||step>=1){line(p.S,p.T,'aux');point('S',p.S,9,-10);point('T',p.T,9,23);right(p[a],p.S,p.Q);right(p[a],p.T,p.R);}
  if(key==='geo'||step>=2){point('Q',p.Q,-20,-8);point('R',p.R,10,22);}
  if(key==='geo'||step>=3){poly([p[a],p.Q,p.R]);right(p.Q,p[a],p.R);}
  if(step>=1&&key==='geo'||step>=2&&key==='geoBuild'){poly([p[a],p.Q,p.S],'shade');poly([p.R,p[a],p.T],'shade2');}
  if(key==='geo'&&step>=1){angleMark(p.S,p.P,p.Q,'α');angleMark(p.P,p.Q,p.S,'β','accent2');}
  if(key==='geo'&&step>=2)angleMark(p.R,p.P,p.T,'β','accent2');
  if(key==='geo'&&step>=3){tick(p.P,p.Q);tick(p.R,p.P);}
  if(key==='geoBuild'&&step>=2){line(p.S,p.Q,'accent');line(p.T,p.R,'accent2');tick(p.S,p.Q);tick(p.A,p.T);tick(p.T,p.R,2);tick(p.A,p.S,2);}
 }else if(key.startsWith('para')){
  poly([p.A,p.B,p.C,p.D]);line(p.D,p.B);line(p.B,p.E);line(p.D,p.E);Object.entries(p).forEach(([n,v])=>{if(n!=='F'||key==='paraCircle')point(n,v,n==='D'?-22:10,n==='E'?20:-10);});
  if(key==='paraCircle'){circle([0,0],1);line(p.B,p.F);if(step>=1){angleMark(p.B,p.D,p.F,'α');angleMark(p.E,p.B,p.F,'α');}if(step>=2)angleMark(p.B,p.E,p.F,'α');if(step>=3)angleMark(p.B,p.F,p.D,'2α','accent2',32);}
  else {if(step>=1){line(p.A,p.D,'accent');line(p.B,p.E,'accent');angleMark(p.A,p.D,p.E,'α');angleMark(p.B,p.E,p.D,'α');}if(step>=2)angleMark(p.E,p.D,p.B,'α','accent2',38);if(step>=3){tick(p.B,p.D);tick(p.B,p.E);}}
 }else if(key==='altitude'||key==='locus'){
  circle([0,0],1);poly([p.A,p.B,p.P]);line(p.P,p.C);line(p.B,p.Q);right(p.P,p.Q,p.B);for(const n of ['A','B','C','P','Q','R'])point(n,p[n],n==='Q'?-23:10,n==='R'?20:-10);
  if(key==='altitude'){if(step>=1)angleMark(p.A,p.P,p.C,'α');if(step>=2){poly([p.P,p.Q,p.R],'shade');angleMark(p.P,p.R,p.Q,'β','accent2');}if(step>=3)angleMark(p.B,p.R,p.C,'β','accent2',32);}
  else {
   if(step>=1){circle(p.circle.o,p.circle.r,'accent');point('K',p.circle.o,-21,22);for(const pair of [[p.B,p.R],[p.C,p.R]]){const m=mid(...pair);line(m,p.circle.o,'aux');right(pair[0],m,p.circle.o);}}
   if(step>=2){line(p.A,p.S,'aux');line(p.B,p.T,'aux');point('S',p.S,-23,-8);point('T',p.T,12,-8);}
   if(step>=3){line(p.C,p.S,'aux');line(p.C,p.T,'aux');line(p.B,p.A,'aux');line(p.B,foot(p.B,p.A,p.T),'aux');point('U',p.U,-18,22);point('V',p.V,13,-3);}
   if(step>=4)poly(Array.from({length:121},(_,i)=>p.Rof(30+i)),'locus',false);
  }
 }else if(key==='inverse'){
  circle(p.M,1);poly([p.M,p.P,p.Q]);poly([p.M,p.Pi,p.Qi]);for(const [n,a] of Object.entries(p))point(n==='Pi'?'P′':n==='Qi'?'Q′':n,a,n==='Pi'?8:-18,n==='Pi'?22:-8);
  if(step>=1){line(p.M,p.Pi,'accent');line(p.M,p.Q,'accent');line(p.M,p.Qi,'accent2');line(p.M,p.P,'accent2');}
  if(step>=2)angleMark(p.P,p.M,p.Q,'α','accent',48);
  if(step>=3){poly([p.M,p.Pi,p.Qi],'shade');poly([p.M,p.Q,p.P],'shade2');}
 }else if(key==='inverseCircle'){
  circle(p.M,1);line([2,-.7],[2,2.15]);point('l',[2,2.15]);poly([p.M,p.A,p.B]);poly([p.M,p.Bi,p.Ai]);right(p.M,p.A,p.B);for(const [n,a] of Object.entries(p))point(n==='Ai'?'A′':n==='Bi'?'B′':n,a,n==='M'?-25:n==='Bi'?-15:10,n==='M'?18:n==='Bi'?-18:n==='Ai'?22:-10);
  if(step>=1){poly([p.M,p.Bi,p.Ai],'shade');poly([p.M,p.A,p.B],'shade2');}
  if(step>=2)right(p.M,p.Bi,p.Ai);
  if(step>=3)circle(mid(p.M,p.Ai),.25,'accent');
 }else {
  circle([0,0],1);poly([p.A,p.B,p.C,p.D]);line(p.A,p.C);line(p.B,p.D);line(p.E,p.F);for(const n of ['A','B','C','D','S','E','F'])point(n,p[n],n==='D'||n==='E'?-23:9,n==='S'?23:-9);
  if(key==='cyclic'){
   if(step>=1){angleMark(p.B,p.D,p.C,'','accent',16);angleMark(p.B,p.A,p.C,'α');}
   if(step>=2){line(p.A,p.B,'accent2');line(p.E,p.F,'accent2');angleMark(p.A,p.F,p.E,'','accent2',16);}
   if(step>=3)angleMark(p.E,p.F,p.C,'','accent2',22);
   if(step>=4)circle(p.circle.o,p.circle.r,'accent');
  }else{circle(p.circle.o,p.circle.r);line(p.D,p.F);line(p.C,p.E);if(step>=1){angleMark(p.A,p.D,p.B,'','accent',18);angleMark(p.A,p.C,p.B,'','accent',18);}if(step>=2){angleMark(p.E,p.D,p.F,'','accent2',24);angleMark(p.E,p.D,p.F,'','accent2',28);angleMark(p.E,p.C,p.F,'','accent2',24);angleMark(p.E,p.C,p.F,'','accent2',28);}if(step>=3){line(p.D,p.F,'accent');line(p.C,p.E,'accent');}}
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 430" role="img" aria-label="Meetkundige figuur${step?' bij uitlegstap '+step:': gegeven situatie'}"><title>Gegeven in bordeaux; hulplijnen gestippeld; gevolg in groen. Letters en tekens dragen de betekenis.</title>${parts.join('')}${labels.join('')}</svg>`;
}
