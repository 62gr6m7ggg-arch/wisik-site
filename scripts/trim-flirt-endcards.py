from pathlib import Path
import json, math, re, subprocess, tempfile, shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
CODES = [f'A{i:02d}' for i in range(1,9)] + [f'B{i:02d}' for i in range(1,9)] + [f'C{i:02d}' for i in range(1,8)] + [f'D{i:02d}' for i in range(1,8)]
FPS = 10
WINDOW = 12.0
MIN_STATIC = 2.0
THRESHOLD = 1.7
NAVY = '#14344d'


def probe_duration(path: Path) -> float:
    out = subprocess.check_output([
        'ffprobe','-v','error','-show_entries','format=duration','-of','default=nk=1:nw=1',str(path)
    ], text=True).strip()
    return float(out)


def probe_video_size(path: Path):
    out = subprocess.check_output([
        'ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height',
        '-of','csv=p=0:s=x',str(path)
    ], text=True).strip()
    w,h = out.split('x')
    return int(w), int(h)


def frame_vector(path: Path):
    with Image.open(path) as im:
        im = im.convert('L').resize((48,27))
        return list(im.getdata())


def rmse(a,b):
    return math.sqrt(sum((x-y)*(x-y) for x,y in zip(a,b))/len(a))


def detect_static_tail(path: Path):
    duration = probe_duration(path)
    start = max(0.0, duration-WINDOW)
    with tempfile.TemporaryDirectory() as td:
        pattern = str(Path(td)/'f%04d.png')
        subprocess.run([
            'ffmpeg','-hide_banner','-loglevel','error','-ss',f'{start:.3f}','-i',str(path),
            '-vf',f'fps={FPS}','-frames:v',str(int(WINDOW*FPS)+5),pattern
        ], check=True)
        frames = sorted(Path(td).glob('f*.png'))
        if len(frames) < int(MIN_STATIC*FPS)+2:
            raise RuntimeError(f'{path}: te weinig frames voor slotdetectie')
        vectors = [frame_vector(p) for p in frames]
        final = vectors[-1]
        matches = [rmse(v, final) <= THRESHOLD for v in vectors]
        i = len(matches)-1
        while i >= 0 and matches[i]:
            i -= 1
        run_start = i+1
        run_len = len(matches)-run_start
        if run_len < int(MIN_STATIC*FPS):
            raise RuntimeError(f'{path}: geen betrouwbare statische slotkaart gevonden (run={run_len/FPS:.2f}s)')
        if run_start == 0:
            raise RuntimeError(f'{path}: slotkaart begint vóór analysevenster; venster nog te kort')
        static_start = start + run_start/FPS
        return duration, static_start, run_len/FPS


def detect_speech_end(audio: Path):
    duration = probe_duration(audio)
    proc = subprocess.run([
        'ffmpeg','-hide_banner','-i',str(audio),'-af','silencedetect=noise=-45dB:d=0.18','-f','null','-'
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    text = proc.stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', text)]
    ends = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', text)]
    # Als het bestand eindigt in stilte, is de start van die laatste stilte het einde van de echte spraak.
    if starts and len(ends) >= len(starts) and ends[-1] >= duration - 0.08:
        return starts[-1], duration
    if starts and len(ends) == len(starts)-1:
        return starts[-1], duration
    return duration, duration


def replace_static_tail(src: Path, static_start: float):
    duration = probe_duration(src)
    w,h = probe_video_size(src)
    tmp = src.with_suffix('.neutral.mp4')
    # Behoud exact de bestaande tijdlijn. Vanaf de oude statische slotkaart wordt alleen het beeld neutraal navy.
    vf = f"drawbox=x=0:y=0:w={w}:h={h}:color={NAVY}:t=fill:enable='gte(t,{static_start:.3f})'"
    subprocess.run([
        'ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(src),
        '-map','0:v:0','-an','-vf',vf,'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',
        '-movflags','+faststart',str(tmp)
    ], check=True)
    new_duration = probe_duration(tmp)
    if abs(new_duration-duration) > 0.12:
        raise RuntimeError(f'{src}: videoduur veranderde onverwacht {duration:.3f}->{new_duration:.3f}')
    shutil.move(tmp, src)


def main():
    results = {}
    speech_overlap_codes = []
    for code in CODES:
        video = PUBLIC / 'films' / 'rekenklaar' / code / 'flirt.mp4'
        audio = PUBLIC / 'assets' / 'audio' / 'eigenstem-2026-09-09-r2' / f'{code}.m4a'
        if not video.exists(): raise RuntimeError(f'{code}: flirt.mp4 ontbreekt')
        if not audio.exists(): raise RuntimeError(f'{code}: eigenstem-audio ontbreekt')

        video_dur, static_start, static_run = detect_static_tail(video)
        tail = video_dur - static_start
        if not (2.0 <= tail <= 11.5):
            raise RuntimeError(f'{code}: verdachte slotkaartduur {tail:.2f}s')

        audio_dur = probe_duration(audio)
        speech_end, _ = detect_speech_end(audio)
        rate = video_dur / audio_dur
        audio_time_at_static_start = static_start / rate
        speech_overlap = max(0.0, speech_end - audio_time_at_static_start)
        if speech_overlap > 0.20:
            speech_overlap_codes.append(code)

        replace_static_tail(video, static_start)
        new_dur = probe_duration(video)
        results[code] = {
            'videoDuration': round(video_dur,3),
            'staticEndcardStart': round(static_start,3),
            'staticEndcardDuration': round(tail,3),
            'audioDuration': round(audio_dur,3),
            'speechEnd': round(speech_end,3),
            'audioTimeAtOldEndcardStart': round(audio_time_at_static_start,3),
            'speechContinuesIntoOldEndcard': speech_overlap > 0.20,
            'speechOverlapSeconds': round(speech_overlap,3),
            'newVideoDuration': round(new_dur,3),
            'replacement': 'neutral-navy-frame-preserve-duration'
        }
        print(f'{code}: oude slotkaart {tail:.2f}s; spraakoverlap {speech_overlap:.2f}s; duur behouden {new_dur:.2f}s')

    evidence = {
        'codes': results,
        'speechOverlapCount': len(speech_overlap_codes),
        'speechOverlapCodes': speech_overlap_codes,
        'method': 'Statische oude slotkaart visueel gedetecteerd; laatste echte spraak via silencedetect -45dB. Video wordt niet ingekort: alleen het oude slotbeeld wordt vervangen door neutraal Wisik-navy.'
    }
    (ROOT/'tests'/'flirt-endcard-replacement-2026-09-09.json').write_text(json.dumps(evidence, ensure_ascii=False, indent=2)+'\n')

    package_path = ROOT/'package.json'
    package = json.loads(package_path.read_text())
    package['version'] = '0.1.24'
    package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2)+'\n')
    for path in PUBLIC.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in {'.html','.js','.json','.css','.webmanifest','.txt'}:
            continue
        try: text = path.read_text()
        except UnicodeDecodeError: continue
        updated = text.replace('0.1.23','0.1.24')
        if updated != text: path.write_text(updated)
    ownvoice_test = ROOT/'scripts'/'test-ownvoice-release.mjs'
    if ownvoice_test.exists(): ownvoice_test.write_text(ownvoice_test.read_text().replace('0.1.23','0.1.24'))

    test = '''import fs from "node:fs";\nconst evidence = JSON.parse(fs.readFileSync("tests/flirt-endcard-replacement-2026-09-09.json","utf8"));\nconst expected = ["A01","A02","A03","A04","A05","A06","A07","A08","B01","B02","B03","B04","B05","B06","B07","B08","C01","C02","C03","C04","C05","C06","C07","D01","D02","D03","D04","D05","D06","D07"];\nif (JSON.stringify(Object.keys(evidence.codes).sort()) !== JSON.stringify(expected.sort())) throw new Error("slotkaartbewijs dekt niet exact 30 flirts");\nfor (const [code,e] of Object.entries(evidence.codes)) {\n  if (!(e.staticEndcardDuration >= 2.0 && e.staticEndcardDuration <= 11.5)) throw new Error(`${code}: ongeldige oude slotkaartduur`);\n  if (Math.abs(e.newVideoDuration-e.videoDuration) > 0.12) throw new Error(`${code}: videoduur veranderde; voice-over kan zijn timing verliezen`);\n  if (e.replacement !== "neutral-navy-frame-preserve-duration") throw new Error(`${code}: oude slotkaart niet volgens neutrale strategie vervangen`);\n}\nif (evidence.speechOverlapCodes.length !== evidence.speechOverlapCount) throw new Error("spraakoverlaptelling inconsistent");\nconsole.log(`Flirt-slotkaartcontrole geslaagd: 30 oude herstelset-kaarten vervangen; bij ${evidence.speechOverlapCount} flirts liep spraak door in het oude slotbeeld.`);\n'''
    test_path = ROOT/'scripts'/'test-flirt-endcards.mjs'
    test_path.write_text(test)
    package = json.loads(package_path.read_text())
    if 'test-flirt-endcards.mjs' not in package['scripts']['check']:
        package['scripts']['check'] = package['scripts']['check'].replace('node scripts/test-grabbelton-cta.mjs', 'node scripts/test-grabbelton-cta.mjs && node scripts/test-flirt-endcards.mjs')
        package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2)+'\n')

if __name__ == '__main__':
    main()
