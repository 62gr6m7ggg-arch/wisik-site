#!/usr/bin/env python3
"""Reproduce the C01/C04 visual repair from the original festival MP4s.

Requires Python 3, Pillow, DejaVu Sans and ffmpeg/ffprobe. No network access.
Usage: python scripts/repair-flirt-diagrams.py ORIGINAL_FILMS OUTPUT_DIRECTORY
ORIGINAL_FILMS contains C01/flirt.mp4 and C04/flirt.mp4 from the original zip
or git revision f1c133d231277eefdfd325c4d8a480b253f9e290. Output is separate
from the input. Review the resulting films before replacing published assets
and renewing their content-review fingerprints; this script never approves them.

Copyright Edwin van der Plas. Mathematical diagrams use exact coordinates.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont

SCALE = 2
FPS = 25
TOP, BOTTOM = 220, 870
BG, INK, TEAL, GOLD, RED = '#d4eaf6', '#12304a', '#2f8991', '#dfb344', '#b64c31'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
EXPECTED = {
    'C01': ('d8756e6debbd870d73c4eb3d4433841aed7ff37d03de162a7dcc175d1c68ebdd', 1381, 1244),
    'C04': ('efd5bb4a8453f309b3b53d6102df2f143ef8af57c7991682a3c112ae242675b8', 1223, 1086),
}


class Diagram:
    def __init__(self):
        self.image = Image.new('RGB', (1920*SCALE, (BOTTOM-TOP)*SCALE), BG)
        self.draw = ImageDraw.Draw(self.image)

    def xy(self, p):
        return p[0]*SCALE, (p[1]-TOP)*SCALE

    def line(self, points, fill=INK, width=3):
        self.draw.line([self.xy(p) for p in points], fill=fill, width=round(width*SCALE))

    def rect(self, box, fill=None, outline=INK, width=3):
        self.draw.rectangle([self.xy(box[:2]), self.xy(box[2:])], fill=fill, outline=outline, width=round(width*SCALE))

    def polygon(self, points, fill):
        self.draw.polygon([self.xy(p) for p in points], fill=fill)
        self.line(points+[points[0]], width=4)

    def text(self, p, value, size=42, color=INK, anchor='mm', bold=False):
        font = ImageFont.truetype(FONT.replace('.ttf','-Bold.ttf') if bold else FONT, size*SCALE)
        self.draw.text(self.xy(p), value, font=font, fill=color, anchor=anchor)

    def save(self, path):
        self.image.resize((1920, BOTTOM-TOP), Image.Resampling.LANCZOS).save(path)


def square(stage):
    d = Diagram()
    x, y, side, cells = 390, 320, 440, 100
    label = '1 m' if stage == 0 else '1 m = 100 cm'
    d.text((610, 275), label, 44, bold=True)
    d.text((225, 475), '1 m', 44, bold=True)
    if stage: d.text((225, 535), '= 100 cm', 36, bold=True)
    d.rect((x,y,x+side,y+side), fill='#f5fcff')
    if stage:
        # 99 internal lines + the two boundary lines => exactly 100 intervals
        # per axis, hence 10,000 cells (each 1 cm x 1 cm in a 1 m square).
        for i in range(1, cells):
            q = i*side/cells
            d.line([(x+q,y),(x+q,y+side)], TEAL, 0.5)
            d.line([(x,y+q),(x+side,y+q)], TEAL, 0.5)
        d.rect((x,y,x+side,y+side), width=4)
        d.text((1425, 380), '100 rijen', 48, bold=True)
        d.text((1425, 450), '× 100 vakjes', 48, bold=True)
    if stage >= 2:
        # Connect a single top-right cell to its labelled enlargement.
        d.rect((x+side-side/cells,y,x+side,y+side/cells), fill=GOLD, outline=RED, width=2)
        d.line([(x+side,y),(1020,345)], RED, 2)
        d.line([(x+side,y+side/cells),(1020,515)], RED, 2)
        d.rect((1020,345,1190,515), fill='#fff4c9', outline=RED, width=4)
        d.text((1105,295), '1 cm', 36, bold=True)
        d.rect((915,405,1010,458), fill=BG, outline=None, width=0)
        d.text((968,432), '1 cm', 32)
        d.text((1105,430), '1 cm²', 40, bold=True)
        d.text((1105,565), 'Vergroot vakje', 32)
    if stage >= 3:
        d.text((1430,530), '= 10.000 vakjes', 40, bold=True)
        d.text((1350,675), '1 m² = 10.000 cm²', 52, RED, bold=True)
    return d


def triangle(stage):
    d = Diagram()
    a, b, c, v = (300,670), (940,670), (1220,320), (580,320)
    d.polygon([a,b,v], TEAL)
    if stage:
        # Half-turn about midpoint of shared diagonal VB maps ABV onto CVB.
        d.polygon([b,c,v], GOLD)
        d.text((1080,270), 'Precies gelijke kopie', 38, bold=True)
    d.line([(300,705),(940,705)], INK, 3)
    d.line([(300,696),(300,714)], INK, 3)
    d.line([(940,696),(940,714)], INK, 3)
    d.text((620,739), 'basis b', 38, bold=True)
    if stage >= 2:
        d.text((1500,395), 'Samen:', 38)
        d.text((1500,455), 'b × h', 58, bold=True)
    if stage >= 3:
        d.text((1500,560), 'Eén driehoek:', 38)
        d.text((1500,625), '½ × b × h', 52, RED, bold=True)
    color = RED if stage >= 4 else INK
    d.line([v,(580,670)], color, 5 if stage >= 4 else 3)
    d.line([(580,646),(604,646),(604,670)], color, 4)
    d.text((544,490), 'h', 46, color, bold=True)
    if stage >= 4: d.text((1500,715), 'h staat loodrecht op b', 34, RED)
    return d


def probe(path):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))


def audio_hash(path):
    data = subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map','0:a:0','-c:a','copy','-f','adts','-'])
    return hashlib.sha256(data).hexdigest()


def repair(code, source, output, temporary):
    expected_hash, frames, end = EXPECTED[code]
    if hashlib.sha256(source.read_bytes()).hexdigest() != expected_hash:
        raise ValueError(f'{code}: expected original reviewed MP4, refusing an unknown input')
    starts = [113,411,584,683] if code == 'C01' else [113,278,489,645,737]
    make = square if code == 'C01' else triangle
    command = ['ffmpeg','-v','error','-y','-i',str(source)]
    filters = []
    for i, start in enumerate(starts):
        png = temporary / f'{code}-{i}.png'
        make(i).save(png)
        command += ['-loop','1','-framerate',str(FPS),'-i',str(png)]
        previous = '[0:v]' if i == 0 else f'[v{i-1}]'
        stop = starts[i+1] if i+1 < len(starts) else end
        filters.append(f"{previous}[{i+1}:v]overlay=0:{TOP}:enable='gte(n,{start})*lt(n,{stop})'[v{i}]")
    silent = temporary / f'{code}-video.mp4'
    command += ['-filter_complex_threads','1','-filter_complex',';'.join(filters),
                '-map',f'[v{len(starts)-1}]','-an','-c:v','libx264',
                '-threads','2','-preset','medium','-crf','18','-pix_fmt','yuv420p',
                '-frames:v',str(frames),str(silent)]
    subprocess.run(command, check=True)
    # Mux independently: -frames:v during encoding can otherwise truncate the
    # final AAC packets when audio lasts slightly longer than the last frame.
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(silent),'-i',str(source),
                    '-map','0:v:0','-map','1:a:0','-c','copy','-movflags','+faststart',str(output)],check=True)
    before, after = probe(source), probe(output)
    old_video = next(s for s in before['streams'] if s['codec_type']=='video')
    new_video = next(s for s in after['streams'] if s['codec_type']=='video')
    for field in ['nb_frames','r_frame_rate','duration','width','height','pix_fmt']:
        if old_video[field] != new_video[field]: raise ValueError(f'{code}: changed video {field}')
    before_audio, after_audio = audio_hash(source), audio_hash(output)
    if before_audio != after_audio: raise ValueError(f'{code}: audio changed')
    subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(output),'-f','null','-'],check=True)
    return {'code': code, 'frames': frames, 'fps': FPS, 'duration': after['format']['duration'],
            'sha256': hashlib.sha256(output.read_bytes()).hexdigest(), 'unchangedAudioSha256': after_audio,
            'stageFrames': starts, 'mainSceneEndFrame': end}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('original_films', type=Path)
    parser.add_argument('output_directory', type=Path)
    args = parser.parse_args()
    args.output_directory.mkdir(parents=True, exist_ok=True)
    evidence = []
    with tempfile.TemporaryDirectory(prefix='wisik-diagrams-') as tmp:
        for code in EXPECTED:
            source, target = args.original_films/code/'flirt.mp4', args.output_directory/f'{code}.mp4'
            if source.resolve() == target.resolve(): raise ValueError('Output must be separate from input')
            evidence.append(repair(code,source,target,Path(tmp)))
    report = args.output_directory/'verification.json'
    report.write_text(json.dumps(evidence, indent=2)+'\n')
    print(report.read_text())


if __name__ == '__main__':
    main()
