"""Exercise actual audio nodes, not only the mute-button text. Run on local HTTP or production."""
import functools, hashlib, http.server, json, os, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
from gonio_integrity import compare_source
ROOT=Path(__file__).resolve().parents[1]
ROUTE='/rafelrand/sinus-s-en-de-geit/'
OUT=ROOT/'test-artifacts/gonio/audio'/('live' if os.getenv('GONIO_BASE') else 'local')
OUT.mkdir(parents=True,exist_ok=True)
server=None
base=os.getenv('GONIO_BASE','http://127.0.0.1:8766').rstrip('/')
if not os.getenv('GONIO_BASE'):
    server=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT/'public')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
PROBE="""(() => {
const connect=AudioNode.prototype.connect;
window.__probes=[];
AudioNode.prototype.connect=function(target,...args){
 if(target instanceof AudioDestinationNode){
  const probe=this.context.createAnalyser();probe.fftSize=8192;
  connect.call(this,probe);connect.call(probe,target,...args);
  window.__probe=probe;window.__probes.push(probe);return target;
 }
 return connect.call(this,target,...args);
};
window.__audioMeasure=()=>{
 const p=window.__probe;if(!p)return {rms:0,frequency:0};
 const t=new Float32Array(p.fftSize);p.getFloatTimeDomainData(t);
 const bins=new Float32Array(p.frequencyBinCount);p.getFloatFrequencyData(bins);
 let index=1;for(let i=2;i<bins.length;i++)if(bins[i]>bins[index])index=i;
 return {rms:Math.sqrt(t.reduce((s,v)=>s+v*v,0)/t.length),frequency:index*p.context.sampleRate/p.fftSize};
};
})();"""
def change(page,id,value):
    page.locator('#'+id).evaluate('(el,v)=>{el.value=v;el.dispatchEvent(new Event("input",{bubbles:true}));}',value)
# Function predicates are retained by Playwright between polls. Bare expression
# strings may be re-evaluated by page JavaScript, which production CSP disallows.
# Keep that policy intact: do not enable unsafe-eval or bypass_csp for these tests.
results=[]
try:
 with sync_playwright() as p:
  for engine in ['chromium','webkit']:
   browser=getattr(p,engine).launch(headless=True)
   for width in [320,390,1440]:
    context=browser.new_context(viewport={'width':width,'height':900})
    context.add_init_script(PROBE)
    page=context.new_page();errors=[];requests=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:requests.append(r.url))
    response=page.goto(base+ROUTE+'#6',wait_until='networkidle')
    assert response.status==200
    assert page.locator('#goatSound').count()==1
    assert page.evaluate('WisikGonioMixer.status()') is None
    assert not any('goat-bleat.wav' in u for u in requests),'Audio fetched before a click'
    if engine=='chromium' and width==320:
      identities={}
      for name in ['index.html','mixer.js','goat-bleat.wav','goat-source.json']:
        fetched=context.request.get(base+ROUTE+name+'?v=0.2.0')
        assert fetched.status==200,(name,fetched.status)
        actual=hashlib.sha256(fetched.body()).hexdigest()
        expected_bytes=(ROOT/'public'/ROUTE.strip('/')/name).read_bytes()
        identity=compare_source(expected_bytes,fetched.body(),name)
        assert identity['verified'],(name,'HTTP source differs from tested candidate',identity)
        identities[name]=identity
      (OUT/'source-identity.json').write_text(json.dumps(identities,indent=2))
    page.locator('#together').click();page.locator('#sound').click()
    page.wait_for_function('() => WisikGonioMixer.status()?.state==="running"')
    page.wait_for_function('() => __audioMeasure().rms>.01')
    page.wait_for_timeout(350)
    low=page.evaluate('__audioMeasure()');assert abs(low['frequency']-220)<12,low
    count=page.evaluate('__probes.length')
    change(page,'frequency',440);page.wait_for_timeout(400)
    high=page.evaluate('__audioMeasure()');assert abs(high['frequency']-440)<12,high
    assert page.evaluate('__probes.length')==count,'Slider restarted the audio'
    page.locator('#quiet').click();page.wait_for_timeout(700)
    silent=page.evaluate('__audioMeasure()');assert silent['rms']<1e-5,silent
    assert page.evaluate('WisikGonioMixer.status().state')=='running'
    page.locator('#together').click();page.wait_for_function('() => __audioMeasure().rms>.01')
    page.locator('#goatSound').click()
    page.wait_for_function('() => WisikGonioMixer.status()?.kind==="goat" && WisikGonioMixer.status()?.rate!==null')
    page.wait_for_function('() => __audioMeasure().rms>.002')
    goat=page.evaluate('__audioMeasure()')
    assert page.locator('#sound').get_attribute('aria-pressed')=='false'
    count=page.evaluate('__probes.length')
    path=page.locator('#goatPlot path').last.get_attribute('d')
    page.locator('#goatHigh').click();page.wait_for_timeout(400)
    assert abs(page.evaluate('WisikGonioMixer.status().rate')-2)<.001
    assert page.locator('#goatPlot path').last.get_attribute('d')!=path
    page.locator('#goatLow').click();page.wait_for_timeout(400)
    assert abs(page.evaluate('WisikGonioMixer.status().rate')-.5)<.001
    assert page.evaluate('__probes.length')==count
    page.locator('#quiet').click()
    assert page.evaluate('WisikGonioMixer.status().kind')=='goat'
    page.wait_for_function('() => __audioMeasure().rms>.002')
    change(page,'listenVolume',0);page.wait_for_timeout(700)
    assert page.evaluate('__audioMeasure().rms')<1e-5
    change(page,'listenVolume',35);page.locator('#goatOriginal').click()
    page.wait_for_function('() => __audioMeasure().rms>.002')
    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
    page.screenshot(path=str(OUT/f'{engine}-{width}-goat.png'),full_page=True)
    page.locator('[data-stage="0"]').click();page.wait_for_timeout(150)
    assert page.evaluate('WisikGonioMixer.status()') is None
    assert page.evaluate('__probes.every(p=>p.context.state==="closed")')
    page.locator('[data-stage="5"]').click()
    assert page.evaluate('WisikGonioMixer.status()') is None
    assert not errors,errors
    results.append({'engine':engine,'width':width,'sine_220':low,'sine_440':high,'silence':silent,'real_goat_output':goat,'rates':[.5,1,2],'continuous_sliders':True,'navigation_closes_audio':True,'errors':errors})
    context.close()
   context=browser.new_context();page=context.new_page()
   page.route('**/goat-bleat.wav*',lambda route:route.fulfill(status=404,body='missing'))
   page.goto(base+ROUTE+'#6');page.locator('#goatSound').click()
   page.wait_for_function('() => document.querySelector("#audioStatus").textContent.includes("niet gestart")')
   assert page.evaluate('WisikGonioMixer.status()') is None
   assert page.locator('#goatSound').get_attribute('aria-pressed')=='false'
   context.close();browser.close()
finally:
 if server:server.shutdown()
(OUT/'results.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
