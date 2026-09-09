from pathlib import Path
import json, math, re, subprocess, tempfile
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
CODES = [f'A{i:02d}' for i in range(1,9)] + [f'B{i:02d}' for i in range(1,9)] + [f'C{i:02d}' for i in range(1,8)] + [f'D{i:02d}' for i in range(1,8)]
FPS=10; WINDOW=12.0; MIN_STATIC=2.0; THRESHOLD=1.7

def duration(path):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nk=1:nw=1',str(path)],text=True).strip())

def vec(path):
    with Image.open(path) as im:
        return list(im.convert('L').resize((48,27)).getdata())

def rmse(a,b): return math.sqrt(sum((x-y)*(x-y) for x,y in zip(a,b))/len(a))

def static_start(path):
    dur=duration(path); start=max(0,dur-WINDOW)
    with tempfile.TemporaryDirectory() as td:
        pat=str(Path(td)/'f%04d.png')
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-ss',f'{start:.3f}','-i',str(path),'-vf',f'fps={FPS}','-frames:v',str(int(WINDOW*FPS)+5),pat],check=True)
        frames=sorted(Path(td).glob('f*.png')); vs=[vec(p) for p in frames]; final=vs[-1]
        matches=[rmse(v,final)<=THRESHOLD for v in vs]; i=len(matches)-1
        while i>=0 and matches[i]: i-=1
        rs=i+1; rl=len(matches)-rs
        if rl<int(MIN_STATIC*FPS): raise RuntimeError(f'{path}: statische slotkaart < {MIN_STATIC}s')
        if rs==0: raise RuntimeError(f'{path}: analysevenster te kort')
        return dur,start+rs/FPS

def speech_end(path):
    dur=duration(path)
    p=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','silencedetect=noise=-45dB:d=0.18','-f','null','-'],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
    starts=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',p.stderr)]
    ends=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',p.stderr)]
    if starts and ((len(ends)>=len(starts) and ends[-1]>=dur-.08) or len(ends)==len(starts)-1): return starts[-1]
    return dur

out={}; overlap=[]
for code in CODES:
    v=PUBLIC/'films'/'rekenklaar'/code/'flirt.mp4'; a=PUBLIC/'assets'/'audio'/'eigenstem-2026-09-09-r2'/f'{code}.m4a'
    vd,ss=static_start(v); ad=duration(a); se=speech_end(a); rate=vd/ad; at=ss/rate; ov=max(0,se-at); yes=ov>.20
    if yes: overlap.append(code)
    out[code]={'videoDuration':round(vd,3),'oldEndcardStart':round(ss,3),'oldEndcardDuration':round(vd-ss,3),'audioDuration':round(ad,3),'speechEnd':round(se,3),'audioTimeAtOldEndcardStart':round(at,3),'speechContinuesIntoOldEndcard':yes,'speechOverlapSeconds':round(ov,3)}
    print(f'{code}: overlap={yes} {ov:.2f}s')
report={'speechOverlapCount':len(overlap),'speechOverlapCodes':overlap,'codes':out,'threshold':'spraak >0,20 s na begin oude statische slotkaart; silencedetect -45 dB'}
(ROOT/'tests'/'flirt-endcard-speech-analysis-2026-09-09.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('RESULT',len(overlap),','.join(overlap))
