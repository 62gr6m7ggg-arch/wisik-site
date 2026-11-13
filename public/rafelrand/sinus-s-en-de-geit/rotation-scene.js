/* Scene 3 only: directed angles and labelled unit vectors. No audio or progress changes. */
(function(root){
'use strict';
const NS='http://www.w3.org/2000/svg';
const C={a:'#15627b',b:'#6a4a8c',n:'#ae3f32',sum:'#216149',axis:'#899a9d'};
const DEG=Math.PI/180;
function mount(G){
  const svg=document.getElementById('rotatePlot');
  const alpha=document.getElementById('alpha'),beta=document.getElementById('beta');
  const total=document.getElementById('rotationTotal');
  if(!svg||!alpha||!beta||!total)return;
  svg.setAttribute('viewBox','0 0 500 470');
  svg.style.maxHeight='none';
  const cx=250,cy=230,scale=142;
  const point=u=>[cx+scale*u[0],cy-scale*u[1]];
  const polar=(radius,angle)=>[cx+radius*Math.cos(angle),cy-radius*Math.sin(angle)];
  function el(name,attrs={},text){
    const node=document.createElementNS(NS,name);
    Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,String(v)));
    if(text!==undefined)node.textContent=text;
    svg.appendChild(node);return node;
  }
  function line(p,q,color,width=2,dash){
    return el('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:color,'stroke-width':width,...(dash?{'stroke-dasharray':dash}:{})});
  }
  function arrow(p,q,color,width=3,attribute){
    const len=Math.hypot(q[0]-p[0],q[1]-p[1]);
    if(len<.05)return;
    const node=line(p,q,color,width);if(attribute)node.setAttribute('data-vector',attribute);
    const ux=(q[0]-p[0])/len,uy=(q[1]-p[1])/len,z=Math.min(10,len*.35),w=z*.48;
    el('path',{d:`M ${q[0]-z*ux+w*uy} ${q[1]-z*uy-w*ux} L ${q[0]} ${q[1]} L ${q[0]-z*ux-w*uy} ${q[1]-z*uy+w*ux}`,fill:'none',stroke:color,'stroke-width':width,'stroke-linejoin':'round'});
  }
  function directedArc(start,amount,radius,color,name){
    const steps=Math.max(1,Math.ceil(Math.abs(amount)/DEG/3));
    const points=Array.from({length:steps+1},(_,i)=>polar(radius,start+amount*i/steps));
    const node=el('path',{d:points.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' '),fill:'none',stroke:color,'stroke-width':2.8,'data-angle':name,'data-start-deg':start/DEG,'data-sweep-deg':amount/DEG});
    if(Math.abs(amount)>1e-8){
      const end=polar(radius,start+amount),direction=Math.sign(amount),theta=start+amount;
      const tangent=[-Math.sin(theta)*direction,-Math.cos(theta)*direction];
      const head=Math.min(8,Math.abs(amount)*radius*.5),wing=head*.55;
      el('path',{d:`M ${end[0]-head*tangent[0]+wing*tangent[1]} ${end[1]-head*tangent[1]-wing*tangent[0]} L ${end.join(' ')} L ${end[0]-head*tangent[0]-wing*tangent[1]} ${end[1]-head*tangent[1]+wing*tangent[0]}`,fill:'none',stroke:color,'stroke-width':2.4});
    }else{
      const p=polar(radius,start);el('circle',{cx:p[0],cy:p[1],r:3,fill:color});
    }
    return node;
  }
  function draw(){
    const ad=Number(alpha.value),bd=Number(beta.value),a=ad*DEG,b=bd*DEG;
    const e=G.vec(a),n=G.quarter(e),u=G.vec(a+b),p=G.scale(Math.cos(b),e);
    svg.replaceChildren();
    el('title',{},'Eerst a vanaf de positieve x-as; daarna b vanaf e; de eindrichting is a+b.');
    el('desc',{},`a = ${ad} graden; b = ${bd} graden; a+b = ${ad+bd} graden. Blauw e=u(a), rood n loodrecht op e, groen u(a+b). Negatieve hoeken draaien rechtsom.`);
    line([30,cy],[470,cy],C.axis,1.3);line([cx,30],[cx,430],C.axis,1.3);
    line([cx,cy],[470,cy],C.axis,2.4);
    el('circle',{cx,cy,r:scale,fill:'none',stroke:'#b3bdb7','stroke-width':1.6});
    arrow([cx,cy],point(e),C.a,3,'e');arrow([cx,cy],point(n),C.n,2.5,'n');
    arrow([cx,cy],point(p),C.b,4,'component-e');arrow(point(p),point(u),C.b,4,'component-n');
    arrow([cx,cy],point(u),C.sum,3.4,'result');
    // Mark the right angle at the projection, only when both legs are visible.
    if(Math.abs(Math.cos(b))>.12&&Math.abs(Math.sin(b))>.12){
      const h=10/scale,v=G.scale(-Math.sign(Math.cos(b))*h,e),w=G.scale(Math.sign(Math.sin(b))*h,n);
      line(point(G.add(p,v)),point(G.add(p,G.add(v,w))),C.b,1.6);
      line(point(G.add(p,G.add(v,w))),point(G.add(p,w)),C.b,1.6);
    }
    directedArc(0,a,58,C.a,'a');directedArc(a,b,104,C.b,'b');
    if(total.checked)directedArc(0,a+b,177,C.sum,'total');
    const occupied=[],obstacles=[point(e),point(n),point(u),[cx,cy]];
    const overlaps=(r,s,pad=5)=>r.x<s.x+s.w+pad&&r.x+r.w+pad>s.x&&r.y<s.y+s.h+pad&&r.y+r.h+pad>s.y;
    // Measure actual SVG text, then place labels without text/text collisions.
    function label(text,desired,color,id,anchor){
      const node=el('text',{x:0,y:0,'text-anchor':'middle','dominant-baseline':'central','font-size':22,'font-weight':650,style:`fill:${color};stroke:#f7f6ef;stroke-width:5px`,'data-label':id},text);
      const box=node.getBBox(),w=box.width+10,h=box.height+8;
      let best=null;
      const offsets=[[0,0],[0,-26],[0,26],[-30,0],[30,0],[-35,-28],[35,-28],[-35,28],[35,28],[0,-52],[0,52],[-65,0],[65,0],[-65,-48],[65,-48],[-65,48],[65,48],[0,-80],[0,80],[-100,0],[100,0]];
      // Always include free edge positions for coincident vectors / zero angles.
      const candidates=offsets.map(([dx,dy])=>[desired[0]+dx,desired[1]+dy]);
      for(let y=54;y<=410;y+=36)for(const x of [76,424])candidates.push([x,y]);
      for(const [x,y] of candidates){
        const r={x:x-w/2,y:y-h/2,w,h};
        if(r.x<10||r.x+w>490||r.y<10||r.y+h>460)continue;
        const collisions=occupied.filter(other=>overlaps(r,other)).length;
        const covers=obstacles.filter(([px,py])=>px>r.x-4&&px<r.x+w+4&&py>r.y-4&&py<r.y+h+4).length;
        const score=collisions*100000+covers*1500+Math.hypot(x-desired[0],y-desired[1]);
        if(!best||score<best.score)best={x,y,r,score};
      }
      if(!best)best={x:desired[0],y:desired[1],r:{x:desired[0]-w/2,y:desired[1]-h/2,w,h}};
      node.setAttribute('x',best.x);node.setAttribute('y',best.y);occupied.push(best.r);
      if(['a','b','total'].includes(id)){const badge=el('rect',{x:best.r.x,y:best.r.y,width:best.r.w,height:best.r.h,rx:7,fill:'#fffdf8',stroke:color,'stroke-width':1.2});svg.insertBefore(badge,node);}
      if(anchor&&Math.hypot(best.x-anchor[0],best.y-anchor[1])>30){
        const guide=line(anchor,[best.x,best.y],color,1,'3 4');svg.insertBefore(guide,node);
      }
    }
    // Place the angle labels first. Their colour and leaders link them to their arcs.
    const angleLabel=(name,amount,start,r,color,id)=>{
      const mid=start+amount/2,anchor=polar(r,mid);
      label(Math.abs(amount)<1e-8?name+' = 0°':name,polar(r+21,mid),color,id,anchor);
    };
    angleLabel('a',a,0,58,C.a,'a');angleLabel('b',b,a,104,C.b,'b');
    if(total.checked)angleLabel('a+b',a+b,0,177,C.sum,'total');
    label('e = u(a)',polar(scale+37,a),C.a,'e',point(e));
    label('n',polar(scale+25,a+Math.PI/2),C.n,'n',point(n));
    label('u(a+b)',polar(scale+37,a+b),C.sum,'result',point(u));
    label('O',[cx-17,cy+20],C.axis,'origin');
    label('+x',[460,cy+23],C.axis,'x');label('y',[cx+18,38],C.axis,'y');
    const format=value=>value.toFixed(1).replace('.',',');
    document.getElementById('alphaOut').textContent=`${format(ad)}° · ${(ad/180).toFixed(3).replace('.',',')}π rad`;
    document.getElementById('betaOut').textContent=`${format(bd)}° · ${(bd/180).toFixed(3).replace('.',',')}π rad`;
    const direction=angle=>angle===0?'geen draai':angle>0?'linksom':'rechtsom';
    document.getElementById('rotationRead').innerHTML=`<span style="color:${C.a}"><strong>a = ${ad}°</strong> (${direction(ad)})</span> + <span style="color:${C.b}"><strong>b = ${bd}°</strong> (${direction(bd)})</span><br><span style="color:${C.sum}"><strong>a+b = ${ad+bd}°</strong>, gemeten vanaf de positieve x-as.</span>`;
    const coincident=Math.abs(Math.sin(b))<1e-9&&Math.cos(b)>0;
    const whole=Math.abs(ad+bd)===360;
    document.getElementById('rotationHint').textContent=whole?'De totale draai is een hele ronde; de groene pijl eindigt weer op de positieve x-as.':coincident?'Bij b = 0° vallen de blauwe en groene pijl samen. De labels blijven afzonderlijk zichtbaar.':'Volg de pijlpuntjes op de bogen. Positief is linksom; negatief is rechtsom.';
  }
  alpha.addEventListener('input',draw);beta.addEventListener('input',draw);total.addEventListener('change',draw);
  draw();
}
root.WisikGonioRotation={mount};
})(globalThis);
