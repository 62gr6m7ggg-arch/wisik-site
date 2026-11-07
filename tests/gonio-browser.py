"""Functional browser checks for the actual tent, locally or against production."""
import functools
import hashlib
import http.server
import json
import os
from pathlib import Path
import threading
import time
import urllib.error
import urllib.request
from playwright.sync_api import sync_playwright
from gonio_integrity import compare_source

ROOT=Path(__file__).resolve().parents[1]
PATH='/rafelrand/sinus-s-en-de-geit/'
IS_LIVE=bool(os.environ.get('GONIO_BASE'))
OUT=ROOT/'test-artifacts'/'gonio'/('live' if IS_LIVE else 'local')
OUT.mkdir(parents=True,exist_ok=True)
base=os.environ.get('GONIO_BASE','http://127.0.0.1:8765').rstrip('/')
server=None
if not IS_LIVE:
    handler=functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT/'public'))
    server=http.server.ThreadingHTTPServer(('127.0.0.1',8765),handler)
    threading.Thread(target=server.serve_forever,daemon=True).start()
else:
    expected_bytes=(ROOT/'public'/PATH.strip('/')/'index.html').read_bytes()
    expected=hashlib.sha256(expected_bytes).hexdigest()
    # Follow the established Wisik live-check convention: honest service identity,
    # uncompressed bytes and the canonical route. No browser impersonation or security change.
    headers={'User-Agent':'Wisik-Gonio-publicatiecontrole/0.1.0','Accept-Encoding':'identity','Cache-Control':'no-cache'}
    for attempt in range(30):
        try:
            req=urllib.request.Request(base+PATH,headers=headers)
            with urllib.request.urlopen(req,timeout=20) as response:
                live=response.read()
                actual=hashlib.sha256(live).hexdigest()
                identity=compare_source(expected_bytes,live,'index.html')
                evidence={'url':response.url,'status':response.status,'content_type':response.headers.get('Content-Type'),'expected_sha256':expected,'received_sha256':actual,'bytes':len(live)}
            evidence.update(identity)
            (OUT/'source-identity.json').write_text(json.dumps(evidence,indent=2))
            if identity['verified']:
                print('Application HTML verified. Raw match:',identity['raw_equal'],'Hosting addition:',identity['hosting_addition'],flush=True)
                break
            print('Page is reachable but its source does not yet match the tested commit.',flush=True)
        except urllib.error.HTTPError as error:
            evidence={'url':error.url,'status':error.code,'server':error.headers.get('Server'),'cf_ray':error.headers.get('CF-Ray'),'reason':str(error)}
            (OUT/'probe-error.json').write_text(json.dumps(evidence,indent=2))
            if error.code in (401,403):
                raise AssertionError('Live access refused; stop without retrying, bypassing protection or claiming live verification.') from error
            print('Publication not available yet:',str(error),flush=True)
        except (urllib.error.URLError,TimeoutError) as error:
            print('Publication not reachable yet:',str(error),flush=True)
        print('Waiting for the existing Cloudflare publication, attempt',attempt+1,flush=True)
        time.sleep(10)
    else:
        raise AssertionError('Production HTML has not matched the tested source; do not claim a verified release.')

results=[]
try:
    with sync_playwright() as p:
        for engine in ['chromium','webkit']:
            browser=getattr(p,engine).launch(headless=True)
            for width in [320,390,1440]:
                context=browser.new_context(viewport={'width':width,'height':900},device_scale_factor=1)
                page=context.new_page()
                errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                response=page.goto(base+PATH,wait_until='networkidle')
                assert response.status==200
                assert page.locator('.brand img').evaluate('el=>el.complete&&el.naturalWidth>0')
                for i in range(8):
                    page.locator(f'[data-stage="{i}"]').click()
                    assert page.locator('h2').count()==1
                    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),(engine,width,i)
                    for slider in page.locator('input[type=range]').all():
                        for edge in ['min','max']:
                            slider.evaluate('(el,side)=>{el.value=el[side];el.dispatchEvent(new Event("input",{bubbles:true}))}',edge)
                    for question in page.locator('[data-q]').all():
                        for choice in question.locator('[data-choice]').all():
                            choice.click()
                    if i==0:
                        page.locator('#unit').click();page.locator('#quarter').click()
                    if i==1:
                        for value in ['neg','pi','half','quarter','comp']:
                            page.locator('#mirror').select_option(value)
                    if i==3:
                        for k,choice in enumerate(['2 cos m cos d','2 sin m cos d','−2 sin m sin d','2 cos m sin d']):
                            page.locator(f'#f{k}').select_option(choice)
                            page.locator(f'[data-check-formula="{k}"]').click()
                            assert page.locator(f'#f{k}').locator('..').locator('.feedback').inner_text().startswith('Klopt')
                        for selector in ['#align','#diffMode','#sumMode','#align']:
                            page.locator(selector).click()
                        page.locator('#spread').evaluate('el=>{el.value=90;el.dispatchEvent(new Event("input"))}')
                        assert 'Nulvector: geen richting.' in page.locator('#signRead').inner_text()
                    if i==4:
                        for tab in page.locator('[data-rule]').all():tab.click()
                    if i==5:
                        page.locator('#quiet').click()
                        assert 'amplitude ≈ 0' in page.locator('#waveRead').inner_text()
                        page.locator('#sound').click()
                        page.wait_for_timeout(250)
                        if page.locator('#sound').get_attribute('aria-pressed')=='true':
                            page.locator('#sound').click()
                        page.locator('#together').click()
                    if i==7:
                        page.locator('#move').click();page.wait_for_timeout(180)
                        page.locator('#move').click();page.locator('#circle').click()
                assert not errors,errors
                assert '12 van 12' in page.locator('#progressText').inner_text()
                page.reload(wait_until='networkidle')
                assert '12 van 12' in page.locator('#progressText').inner_text()
                page.locator('[data-stage="3"]').click()
                page.locator('#reveal').evaluate('el=>{el.value=3;el.dispatchEvent(new Event("input"))}')
                page.screenshot(path=str(OUT/f'{engine}-{width}-middle.png'),full_page=True)
                page.locator('[data-stage="0"]').click();page.locator('#quarter').click()
                page.screenshot(path=str(OUT/f'{engine}-{width}-quarter.png'),full_page=True)
                page.on('dialog',lambda d:d.accept())
                page.evaluate("localStorage.setItem('wisik-unrelated-test','preserve')")
                page.locator('#reset').click()
                assert '0 van 12' in page.locator('#progressText').inner_text()
                assert page.evaluate("localStorage.getItem('wisik-unrelated-test')")=='preserve'
                page.evaluate("localStorage.setItem('wisik.gonio.v1.checks','null')")
                page.reload();assert page.locator('h2').count()==1
                page.goto(base+'/rafelrand/')
                entry=page.locator('a[href="/rafelrand/sinus-s-en-de-geit/"]')
                assert entry.count()==1
                entry.click();assert 'Sinus S.' in page.title()
                results.append({'engine':engine,'width':width,'screens':8,'errors':errors,'progress':'12/12 persisted; reset isolated','entry':'Rafelrandjes linked'})
                context.close()
            context=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
            page=context.new_page();page.goto(base+PATH)
            # Native range controls are keyboard-operable; all animations start only on explicit action.
            page.locator('#turn').focus();before=page.locator('#turn').input_value();page.keyboard.press('ArrowRight')
            assert page.locator('#turn').input_value()!=before
            context.close()
            context=browser.new_context(java_script_enabled=False)
            page=context.new_page();page.goto(base+PATH)
            assert 'Deze tent beweegt' in page.locator('main').inner_text()
            context.close();browser.close()
finally:
    if server:server.shutdown()
(OUT/'results.json').write_text(json.dumps({'base':base,'checks':results},indent=2))
print(json.dumps(results,indent=2))
