// Exacte modellen voor E, onafhankelijk van de bestaande A–D-figuren.
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1],norm=a=>Math.hypot(...a),mid=(a,b)=>mul(add(a,b),.5);
const rotate=(a,t)=>[a[0]*Math.cos(t)-a[1]*Math.sin(t),a[0]*Math.sin(t)+a[1]*Math.cos(t)];
const arc=(o,r,lo,hi)=>Array.from({length:121},(_,i)=>{const t=(lo+(hi-lo)*i/120)*Math.PI/180;return add(o,[r*Math.cos(t),r*Math.sin(t)]);});
const secant=(T,v,r)=>{const a=dot(v,v),b=2*dot(T,v),c=dot(T,T)-r*r,disc=Math.sqrt(b*b-4*a*c);return [(-b-disc)/(2*a),(-b+disc)/(2*a)].map(t=>add(T,mul(v,t)));};
function circum(a,b,c){const u=sub(b,a),v=sub(c,a),q=(dot(b,b)-dot(a,a))/2,w=(dot(c,c)-dot(a,a))/2,det=u[0]*v[1]-u[1]*v[0],o=[(q*v[1]-u[1]*w)/det,(u[0]*w-q*v[0])/det];return {o,r:norm(sub(o,a))};}
export function eModel(key){
 if(key.startsWith('e-rectangle'))return {A:[-2,-1.2],B:[2,-1.2],C:[2,1.2],D:[-2,1.2],S:[0,0],bounds:[-2.5,-1.7,2.5,1.7]};
 if(key==='e-equilateral'){const A=[0,0],B=[6,0],C=[1.8,3.5],P=rotate(B,-Math.PI/3),Q=rotate(C,Math.PI/3);return {A,B,C,P,Q,bounds:[-2.8,-5.8,6.6,4.1]};}
 if(key==='e-locus')return {A:[-1,0],B:[1,0],K:[0,0],M1:[0,1],M2:[0,-1],r:Math.SQRT2,upper:arc([0,1],Math.SQRT2,-45,225),lower:arc([0,-1],Math.SQRT2,135,405),bounds:[-1.8,-2.8,1.8,2.8]};
 if(key==='e-tangentCircle'){const h=Math.sqrt(1.25),x=(2*h+4)/(h+.5),other=(2*h-4)/(h-.5);return {M:[0,0],R:[2,0],T:[2,-3],X:[x,0],other:[other,0],r:x-2,l0:[-3,-5.5],l1:[6,-1],bounds:[-3.8,-6,6.8,3]};}
 if(key==='e-cyclic'){const A=[-1.5,-4.5],B=[3,-4.5],P=[-2.4,1.8],Q=[2.4,1.8],R=secant(A,sub(Q,A),3)[0],S=secant(B,sub(P,B),3)[0];return {M:[0,0],A,B,P,Q,R,S,result:circum(A,B,R),bounds:[-3.6,-7.5,3.8,3.6]};}
 if(key==='e-power'||key==='e-twoSecants'){const T=[7,0],A=[9/7,3*Math.sqrt(1-9/49)],[B,C]=secant(T,[-1,-.22],3),[D,E]=secant(T,[-1,.36],3);return {T,A,B,C,D,E,bounds:[-3.7,-3.7,7.8,3.8]};}
 throw new Error('Onbekende E-figuur: '+key);
}
export function drawEFigure(key,step=0){
 const p=eModel(key),parts=[],labels=[],[xmin,ymin,xmax,ymax]=p.bounds;
 const scale=Math.min(540/(xmax-xmin),342/(ymax-ymin)),xo=(640-scale*(xmax-xmin))/2,yo=(430-scale*(ymax-ymin))/2;
 const xy=a=>[xo+(a[0]-xmin)*scale,430-yo-(a[1]-ymin)*scale];
 const line=(a,b,cls='given')=>{a=xy(a);b=xy(b);parts.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="${cls}"/>`);};
 const poly=(ps,cls='given',closed=true)=>parts.push(`<${closed?'polygon':'polyline'} points="${ps.map(a=>xy(a).join(',')).join(' ')}" class="${cls}"/>`);
 const circle=(o,r,cls='circle')=>{o=xy(o);parts.push(`<circle cx="${o[0]}" cy="${o[1]}" r="${r*scale}" class="${cls}"/>`);};
 const text=(a,s,dx=10,dy=-10)=>{a=xy(a);labels.push(`<text x="${a[0]+dx}" y="${a[1]+dy}" class="point-label">${s}</text>`);};
 const point=(s,a,dx=10,dy=-10,open=false)=>{const v=xy(a);labels.push(`<circle cx="${v[0]}" cy="${v[1]}" r="${open?4:3}" class="${open?'open-point':'point'}"/>`);text(a,s,dx,dy);};
 const right=(a,v,b)=>{a=mul(sub(a,v),.11/norm(sub(a,v)));b=mul(sub(b,v),.11/norm(sub(b,v)));poly([add(v,a),add(add(v,a),b),add(v,b)],'accent',false);};
 const tick=(a,b,n=1)=>{const m=mid(a,b),v=sub(b,a),u=mul(v,6/scale/norm(v)),w=[-u[1],u[0]];for(let j=0;j<n;j++){const c=add(m,mul(u,j-(n-1)/2));line(sub(c,w),add(c,w),'accent');}};
 const angle=(a,v,b,label='',cls='accent',r=23)=>{a=xy(a);v=xy(v);b=xy(b);const t=Math.atan2(a[1]-v[1],a[0]-v[0]),z=Math.atan2(b[1]-v[1],b[0]-v[0]),d=(z-t+3*Math.PI)%(2*Math.PI)-Math.PI,start=[v[0]+r*Math.cos(t),v[1]+r*Math.sin(t)],end=[v[0]+r*Math.cos(t+d),v[1]+r*Math.sin(t+d)];parts.push(`<path d="M${start} A${r},${r} 0 0 ${d>0?1:0} ${end}" class="${cls}"/>`);if(label)labels.push(`<text x="${v[0]+(r+15)*Math.cos(t+d/2)}" y="${v[1]+(r+15)*Math.sin(t+d/2)+5}" text-anchor="middle">${label}</text>`);};
 if(key.startsWith('e-rectangle')){
  const forward=key==='e-rectangleForward';poly([p.A,p.B,p.C,p.D]);line(p.A,p.C);line(p.B,p.D);
  if(forward||step>=3)for(const [a,v,b] of [[p.D,p.A,p.B],[p.A,p.B,p.C],...(forward||step>=4?[[p.B,p.C,p.D],[p.C,p.D,p.A]]:[])])right(a,v,b);
  if(!forward||step>=2){tick(p.A,p.S);tick(p.S,p.C);tick(p.B,p.S,2);tick(p.S,p.D,2);}
  if(step>=(forward?3:2)){poly([p.D,p.A,p.B],'shade');poly([p.C,p.B,p.A],'shade2');line(p.D,p.A,'accent');line(p.C,p.B,'accent');}
  if(step>=4){line(p.A,p.C,'accent');line(p.B,p.D,'accent');}
  for(const n of ['A','B','C','D','S'])point(n,p[n],['A','D'].includes(n)?-23:10,['A','B','S'].includes(n)?22:-10);
 }else if(key==='e-equilateral'){
  poly([p.A,p.B,p.C]);poly([p.A,p.B,p.P]);poly([p.A,p.C,p.Q]);line(p.C,p.P);line(p.B,p.Q);
  if(step>=1){tick(p.A,p.P);tick(p.A,p.B);tick(p.A,p.C,2);tick(p.A,p.Q,2);}
  if(step>=2){angle(p.P,p.A,p.B,'60°','accent',33);angle(p.C,p.A,p.Q,'60°','accent2',33);angle(p.B,p.A,p.C,'α','accent',24);}
  if(step>=3){poly([p.P,p.A,p.C],'shade');poly([p.B,p.A,p.Q],'shade2');}
  if(step>=4){line(p.C,p.P,'accent');line(p.B,p.Q,'accent');}
  for(const n of ['A','B','C','P','Q'])point(n,p[n],['A','Q'].includes(n)?-24:10,n==='P'?25:-12);
 }else if(key==='e-locus'){
  line(p.A,p.B);
  if(step>=1){line([0,-2.55],[0,2.55],'aux');point('K',p.K,10,25);}
  if(step>=2){point('M₁',p.M1);point('M₂',p.M2,10,23);tick(p.K,p.M1);tick(p.K,p.M2);tick(p.K,p.A);}
  if(step>=3){circle(p.M1,p.r,'aux');circle(p.M2,p.r,'aux');line(p.M1,p.A,'aux');line(p.M1,p.B,'aux');}
  if(step>=4){poly(p.upper,'locus',false);poly(p.lower,'locus',false);}
  point('A',p.A,-25,-10,step>=4);point('B',p.B,10,-10,step>=4);
 }else if(key==='e-tangentCircle'){
  circle(p.M,2);point('M',p.M,-25,-10);point('R',p.R,-22,-12);line(p.l0,p.l1);text(p.l1,'l',10,0);
  if(step>=1){line([2,-5.5],[2,2.5],'aux');point('T',p.T,12,22);text([2,2.5],'t');line(p.M,p.R,'aux');right(p.M,p.R,[2,1]);}
  if(step>=2){const v=sub(p.X,p.T);line(sub(p.T,mul(v,.45)),add(p.T,mul(v,1.55)),'aux');}
  if(step>=3){line([-2.3,0],[6,0],'aux');point('X',p.X);}
  if(step>=4)circle(p.X,p.r,'accent');
 }else if(key==='e-cyclic'){
  circle(p.M,3);line(p.P,p.Q);line(p.A,p.B);line(p.A,p.Q);line(p.B,p.P);
  if(step>=1){line(p.P,p.R,'aux');line(p.R,p.S,'aux');angle(p.P,p.Q,p.R,'α');angle(p.P,p.S,p.R,'α');}
  if(step>=2){line(p.P,p.Q,'accent2');line(p.A,p.B,'accent2');angle(p.B,p.A,p.R,'α');}
  if(step>=3)angle(p.R,p.S,p.B,'','accent2',32);
  if(step>=4)poly([p.A,p.B,p.S,p.R],'shade');
  if(step>=5)circle(p.result.o,p.result.r,'accent');
  for(const n of ['M','A','B','P','Q','R','S'])point(n,p[n],['P','A','R'].includes(n)?-24:10,['A','B','R'].includes(n)?23:-11);
 }else{
  circle([0,0],3);line(p.T,p.A);line(p.T,p.C);line(p.T,p.E);
  const second=key==='e-twoSecants',U=second?p.D:p.B,V=second?p.E:p.C;
  if(step>=1){line(p.A,U,'aux');line(p.A,V,'aux');}
  if(step>=(second?1:2)){angle(p.T,p.A,U,'','accent',30);angle(p.T,V,p.A,'','accent',30);}
  if(step>=(second?1:3))angle(p.A,p.T,U,'β','accent2');
  if(step>=(second?2:4)){poly([p.T,p.A,U],'shade');poly([p.T,V,p.A],'shade2');}
  if(step>=(second?3:5)){line(p.T,p.A,'accent');line(p.T,U,'accent2');line(p.T,V,'accent2');}
  for(const n of ['A','B','C','D','E','T'])point(n,p[n],['C','E'].includes(n)?-24:10,['B','C'].includes(n)?24:-12);
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 430" role="img" aria-label="Meetkundige figuur E${step?' bij uitlegstap '+step:': gegeven situatie'}"><title>Gegeven in bordeaux; hulplijnen gestippeld; gevolg in groen. Open rondjes zijn uitgesloten punten.</title>${parts.join('')}${labels.join('')}</svg>`;
}
