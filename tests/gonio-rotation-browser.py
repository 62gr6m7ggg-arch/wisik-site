"""Scene 3 regression: actual SVG geometry, labels and unchanged slider semantics."""
import functools
import hashlib
import http.server
import json
import math
import os
from pathlib import Path
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ROUTE = '/rafelrand/sinus-s-en-de-geit/'
BASE = os.getenv('GONIO_BASE', 'http://127.0.0.1:8767').rstrip('/')
OUT = ROOT / 'test-artifacts/gonio/rotation' / ('live' if os.getenv('GONIO_BASE') else 'local')
OUT.mkdir(parents=True, exist_ok=True)
CASES = [(35,30),(-27,61),(0,0),(90,0),(-90,0),(180,180),(-180,-180),(180,-180),(0,90),(0,-90),(170,20),(-170,-20),(-27,-61),(35,180),(35,-180),(1,-1)]
CHANGE = """([a,b,total])=>{
 for(const [id,value] of [['alpha',a],['beta',b]]){
  const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input'));
 }
 const t=document.getElementById('rotationTotal');t.checked=total;t.dispatchEvent(new Event('change'));
}"""
READ = """()=>{
 const s=document.getElementById('rotatePlot');
 const labels=[...s.querySelectorAll('[data-label]')].map(n=>({id:n.dataset.label,b:n.getBBox()}));
 const overlaps=[];
 for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
  const a=labels[i].b,b=labels[j].b;
  if(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y)overlaps.push([labels[i].id,labels[j].id]);
 }
 const arcs=Object.fromEntries([...s.querySelectorAll('[data-angle]')].map(n=>{
  const len=n.getTotalLength(),start=n.getPointAtLength(0),end=n.getPointAtLength(len);
  return [n.dataset.angle,{startDeg:+n.dataset.startDeg,sweepDeg:+n.dataset.sweepDeg,start:[start.x,start.y],end:[end.x,end.y],length:len}];
 }));
 const vectors=Object.fromEntries([...s.querySelectorAll('[data-vector]')].map(n=>[n.dataset.vector,[+n.getAttribute('x2'),+n.getAttribute('y2')]]));
 return {overlaps,arcs,vectors,outside:labels.filter(t=>t.b.x<0||t.b.x+t.b.width>500||t.b.y<0||t.b.y+t.b.height>470).map(t=>t.id),overflow:document.documentElement.scrollWidth>innerWidth+1};
}"""
def near(a, b, tolerance=.02):
    assert abs(a-b)<tolerance, (a,b)

def point(radius, deg):
    angle=math.radians(deg)
    return [250+radius*math.cos(angle),230-radius*math.sin(angle)]

server=None
if not os.getenv('GONIO_BASE'):
    server=http.server.ThreadingHTTPServer(('127.0.0.1',8767),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT/'public')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
results=[]
try:
    with sync_playwright() as p:
        for engine in ['chromium','webkit']:
            browser=getattr(p,engine).launch(headless=True)
            for width in [320,390,1440]:
                context=browser.new_context(viewport={'width':width,'height':900})
                page=context.new_page();errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                response=page.goto(BASE+ROUTE+'#3',wait_until='networkidle')
                assert response.status==200
                if width==1440:
                    assert len(page.locator('.layout').evaluate('e=>getComputedStyle(e).gridTemplateColumns').split())==2
                for id,value in [('alpha','35'),('beta','30')]:
                    assert page.locator('#'+id).input_value()==value
                    assert page.locator('#'+id).get_attribute('min')=='-180'
                    assert page.locator('#'+id).get_attribute('max')=='180'
                asset=context.request.get(BASE+ROUTE+'rotation-scene.js?v=0.2.2')
                assert asset.status==200
                expected=(ROOT/'public'/ROUTE.strip('/')/'rotation-scene.js').read_bytes()
                assert hashlib.sha256(asset.body()).digest()==hashlib.sha256(expected).digest()
                for a,b in CASES:
                    for total in [False,True]:
                        page.evaluate(CHANGE,[a,b,total]);r=page.evaluate(READ)
                        assert not r['overlaps'],(engine,width,a,b,total,r)
                        assert not r['outside'],(engine,width,a,b,total,r)
                        assert not r['overflow'],(engine,width,a,b,total,r)
                        for name,start,sweep,radius in [('a',0,a,58),('b',a,b,104)]+([('total',0,a+b,177)] if total else []):
                            arc=r['arcs'][name]
                            near(arc['startDeg'],start);near(arc['sweepDeg'],sweep)
                            for got,want in zip(arc['start'],point(radius,start)):near(got,want)
                            for got,want in zip(arc['end'],point(radius,start+sweep)):near(got,want)
                            near(arc['length'],radius*abs(math.radians(sweep)),.3)
                        assert ('total' in r['arcs'])==total
                        for name,deg in [('e',a),('n',a+90),('result',a+b)]:
                            for got,want in zip(r['vectors'][name],point(142,deg)):near(got,want)
                        if (a,b)==(-27,61):
                            assert 'a+b = 34°' in page.locator('#rotationRead').inner_text()
                            page.locator('#main').screenshot(path=str(OUT/f'{engine}-{width}-total-{total}.png'))
                        results.append({'engine':engine,'width':width,'a':a,'b':b,'total':total,'passed':True})
                page.locator('#alpha').focus();before=float(page.locator('#alpha').input_value());page.keyboard.press('ArrowRight')
                assert float(page.locator('#alpha').input_value())==before+1
                page.locator('[data-stage="3"]').click();page.locator('[data-stage="2"]').click()
                assert page.locator('#rotatePlot [data-angle="a"]').count()==1
                assert not errors,errors
                context.close()
            browser.close()
finally:
    if server:server.shutdown()
(OUT/'results.json').write_text(json.dumps({'base':BASE,'configurations':results,'physical_iPhone_test':False},indent=2))
print(f'Scene 3: {len(results)} configurations passed in Chromium/WebKit; actual arcs and vectors, labels, viewport, keyboard and re-entry checked.')
