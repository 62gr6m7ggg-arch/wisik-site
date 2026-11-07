"""One-time candidate preparation; never publishes or writes to main."""
from pathlib import Path
import array, hashlib, html, json, math, re, subprocess, sys, urllib.request, wave
ROOT=Path(__file__).resolve().parents[2]
DEST=ROOT/'public/rafelrand/sinus-s-en-de-geit'
OUT=ROOT/'test-artifacts/goat-preparation'
OUT.mkdir(parents=True,exist_ok=True)
PAGE='https://freesound.org/people/TheKingOfGeeks360/sounds/842307/'
LICENSE='https://creativecommons.org/publicdomain/zero/1.0/'
def get(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Wisik-educational-audio-preparation/0.2.0'})
    with urllib.request.urlopen(req,timeout=30) as r:
        data=r.read(2000001)
        if len(data)>2000000:raise ValueError('Unexpectedly large source')
        return data
asset=DEST/'goat-bleat.wav'
if not asset.exists():
    page=get(PAGE).decode('utf-8')
    if 'creativecommons.org/publicdomain/zero/1.0' not in page:raise ValueError('CC0 source declaration not found; stop')
    cleaned=html.unescape(page.replace('\\/','/'))
    urls=re.findall(r'(?:https?:)?//[^\s\"\'<>]+/previews/842/842307_[^\s\"\'<>]+\.(?:mp3|ogg)',cleaned)
    urls=sorted(set(urls),key=lambda u:('hq.mp3' not in u,'mp3' not in u,u))
    if not urls:raise ValueError('Public preview URL not found in the licensed source; stop')
    url=urls[0]
    if url.startswith('//'):url='https:'+url
    raw=get(url)
    src=OUT/'original-preview.mp3';src.write_bytes(raw)
    pcm=subprocess.check_output(['ffmpeg','-v','error','-i',str(src),'-f','s16le','-ac','1','-ar','44100','pipe:1'])
    values=array.array('h');values.frombytes(pcm)
    if sys.byteorder!='little':values.byteswap()
    duration=len(values)/44100
    if not .2<duration<4:raise ValueError('Unexpected bleat duration')
    peak=max(abs(v) for v in values)
    if peak<100:raise ValueError('Source is effectively silent')
    fade=441
    for i,v in enumerate(values):
        edge=min(1,i/fade,(len(values)-1-i)/fade)
        values[i]=round(v*(.60*32767/peak)*max(0,edge))
    if sys.byteorder!='little':values.byteswap()
    with wave.open(str(asset),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(44100);w.writeframes(values.tobytes())
    metadata={'title':'Goats - Goat Bleat; Close Perspective, Take 2','author':'TheKingOfGeeks360','source':PAGE,'license':'CC0 1.0','license_url':LICENSE,'preview_url':url,'source_sha256':hashlib.sha256(raw).hexdigest(),'asset_sha256':hashlib.sha256(asset.read_bytes()).hexdigest(),'duration_seconds':duration,'processing':'Public preview decoded to 44.1 kHz mono PCM16; peak 0.60; 10 ms edge fades. No generated animal imitation.'}
    (DEST/'goat-source.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
    print('Real goat asset prepared:',json.dumps(metadata),flush=True)
index=DEST/'index.html'
text=index.read_text()
(OUT/'original.html').write_text(text)
if 'mixer.js?v=0.2.0' not in text:
    start=text.index('function mixStage(){')
    end=text.index('\nfunction proofStage()',start)
    replacement="""function mixStage(){return heading(5,'De stilteknop krijgt een geitenstem.','Eerst twee sinussen laten samenwerken. Daarna zelf ontdekken wat een hogere frequentie met de toonhoogte doet — met een echt bèèèh.')+q('silence','Wat geeft sin(t+π/2) + sin(t−π/2), voor iedere t?',['Een golf met dubbele amplitude','Een rechte lijn op nul','Een golf met halve amplitude'],1,'<p>De hoogten zijn tegengesteld: 2cos(π/2)=0. Dat geldt bij iedere gezamenlijke frequentie. De faseknop verandert de amplitude; de frequentieknop verandert de toonhoogte.</p>','Teken beide sinussen en vergelijk hun hoogten op hetzelfde tijdstip.')+'<div id="gonioMixer"></div>'}"""
    text=text[:start]+replacement+text[end:]
    start=text.index("()=>{function draw(){const d=G.rad(val('phase'))")
    end=text.index("\n()=>{$('#checksList')",start)
    text=text[:start]+"()=>globalThis.WisikGonioMixer.mount(),"+text[end:]
    needle='function stopSound(){'
    assert text.count(needle)==1
    text=text.replace(needle,needle+'if(globalThis.WisikGonioMixer)globalThis.WisikGonioMixer.stop();')
    assert text.count('<script>')==1
    text=text.replace('<script>','<script src="./mixer.js?v=0.2.0"></script>\n<script>')
    text=text.replace('Het geluid is een hier berekende sinus.','De sinusmix wordt hier berekend; de geitenstem is een CC0-opname met bronvermelding in de stilteknop.')
    text=text.replace('PROEFTENT · ANALYSE 2B · 0.1.0','PROEFTENT · ANALYSE 2B · 0.2.0').replace('proeftent 0.1.0.','proeftent 0.2.0.')
    index.write_text(text)
assert 'wisik.gonio.v1.checks' in text
assert text.count('function mixStage()')==1
assert text.count('WisikGonioMixer.mount()')==1
(OUT/'index.html').write_text(text)
(OUT/'mixer.js').write_bytes((DEST/'mixer.js').read_bytes())
(OUT/'goat-bleat.wav').write_bytes(asset.read_bytes())
(OUT/'goat-source.json').write_bytes((DEST/'goat-source.json').read_bytes())
print('Candidate prepared. Existing main, deployment settings and other tents unchanged.')
