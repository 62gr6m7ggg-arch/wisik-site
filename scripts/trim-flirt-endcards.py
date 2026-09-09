from pathlib import Path
import json, math, subprocess, tempfile, shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
CODES = [f'A{i:02d}' for i in range(1,9)] + [f'B{i:02d}' for i in range(1,9)] + [f'C{i:02d}' for i in range(1,8)] + [f'D{i:02d}' for i in range(1,8)]
FPS = 10
WINDOW = 5.0
MIN_STATIC = 0.8
THRESHOLD = 1.7


def probe_duration(path: Path) -> float:
    out = subprocess.check_output([
        'ffprobe','-v','error','-show_entries','format=duration','-of','default=nk=1:nw=1',str(path)
    ], text=True).strip()
    return float(out)


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
        static_start = start + run_start/FPS
        # Begin iets vóór de statische kaart, maar laat geen volledig frame van die kaart staan.
        trim_at = max(0.5, static_start - 0.06)
        return duration, static_start, trim_at, run_len/FPS


def rewrite_video(src: Path, trim_at: float):
    tmp = src.with_suffix('.trim.mp4')
    subprocess.run([
        'ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(src),'-t',f'{trim_at:.3f}',
        '-map','0:v:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',
        '-movflags','+faststart',str(tmp)
    ], check=True)
    if probe_duration(tmp) > trim_at + 0.12:
        raise RuntimeError(f'{src}: getrimde duur onverwacht lang')
    shutil.move(tmp, src)


def main():
    results = {}
    for code in CODES:
        src = PUBLIC / 'films' / 'rekenklaar' / code / 'flirt.mp4'
        if not src.exists():
            raise RuntimeError(f'{code}: flirt.mp4 ontbreekt')
        old_dur, static_start, trim_at, static_len = detect_static_tail(src)
        # De oude slotkaart moet aan het einde zitten en mag geen groot deel van de flirt innemen.
        tail = old_dur - static_start
        if not (0.7 <= tail <= 4.0):
            raise RuntimeError(f'{code}: verdachte slotkaartduur {tail:.2f}s')
        rewrite_video(src, trim_at)
        new_dur = probe_duration(src)
        results[code] = {
            'oldDuration': round(old_dur,3),
            'staticEndcardStart': round(static_start,3),
            'staticEndcardDuration': round(tail,3),
            'trimAt': round(trim_at,3),
            'newDuration': round(new_dur,3)
        }
        print(f'{code}: {old_dur:.2f}s -> {new_dur:.2f}s; oude slotkaart {tail:.2f}s verwijderd')

    (ROOT/'tests'/'flirt-endcard-trim-2026-09-09.json').write_text(json.dumps(results, ensure_ascii=False, indent=2)+'\n')

    # Siteversie verhogen en cacheverwijzingen vernieuwen.
    package_path = ROOT/'package.json'
    package = json.loads(package_path.read_text())
    package['version'] = '0.1.24'
    package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2)+'\n')
    for path in PUBLIC.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in {'.html','.js','.json','.css','.webmanifest','.txt'}:
            continue
        try:
            text = path.read_text()
        except UnicodeDecodeError:
            continue
        updated = text.replace('0.1.23','0.1.24')
        if updated != text:
            path.write_text(updated)
    for path in [ROOT/'scripts'/'test-ownvoice-release.mjs']:
        if path.exists():
            path.write_text(path.read_text().replace('0.1.23','0.1.24'))

    # Permanente regressietest: alle 30 video's moeten aantoonbaar getrimd zijn.
    test = '''import fs from "node:fs";\nconst evidence = JSON.parse(fs.readFileSync("tests/flirt-endcard-trim-2026-09-09.json","utf8"));\nconst expected = ["A01","A02","A03","A04","A05","A06","A07","A08","B01","B02","B03","B04","B05","B06","B07","B08","C01","C02","C03","C04","C05","C06","C07","D01","D02","D03","D04","D05","D06","D07"];\nif (JSON.stringify(Object.keys(evidence).sort()) !== JSON.stringify(expected.sort())) throw new Error("trim-bewijs dekt niet exact 30 flirts");\nfor (const [code,e] of Object.entries(evidence)) {\n  if (!(e.staticEndcardDuration >= 0.7 && e.staticEndcardDuration <= 4.0)) throw new Error(`${code}: ongeldige oude slotkaartduur`);\n  if (!(e.newDuration < e.oldDuration - 0.5)) throw new Error(`${code}: oude slotkaart niet werkelijk verwijderd`);\n}\nconsole.log("Flirt-slotkaartcontrole geslaagd: oude statische herstelset-eindkaart is bij alle 30 MP4's verwijderd.");\n'''
    (ROOT/'scripts'/'test-flirt-endcards.mjs').write_text(test)
    if 'test-flirt-endcards.mjs' not in package['scripts']['check']:
        package = json.loads(package_path.read_text())
        package['scripts']['check'] = package['scripts']['check'].replace('node scripts/test-grabbelton-cta.mjs', 'node scripts/test-grabbelton-cta.mjs && node scripts/test-flirt-endcards.mjs')
        package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2)+'\n')

if __name__ == '__main__':
    main()
