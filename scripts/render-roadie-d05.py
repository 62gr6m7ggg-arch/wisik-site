#!/usr/bin/env python3
"""Build the D05 Roadie instructional montage from HeyGen A-roll and exact counter motion."""
import math
import os
import subprocess
import sys
from PIL import Image, ImageDraw, ImageFont

SOURCE = sys.argv[1]
OUTPUT = sys.argv[2]
W, H, FPS = 740, 720, 25

def font(size, bold=False):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/" + name, size)

F32, F27, F23, F19, F16 = font(32, True), font(27, True), font(23, True), font(19), font(16)
def duration_of(video):
    data = subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nokey=1:noprint_wrappers=1",video],text=True)
    return float(data.strip())

def label(draw, at, text, f, fill="#163f58", anchor="mm"):
    draw.text(at,text,font=f,fill=fill,anchor=anchor,stroke_width=0)

def item_xy(tray, index):
    x=94+tray*178
    return (x+((index%4)-1.5)*29, 336+(index//4)*36)

def counter(draw,xy,flash=False):
    x,y=xy;r=13
    draw.ellipse((x-r,y-r,x+r,y+r),fill="#f1b94a" if not flash else "#fd8b36",outline="#875326",width=3)
    draw.ellipse((x-5,y-7,x-1,y-3),fill="#fff2bc")

def draw_frame(t, duration):
    im=Image.new("RGB",(W,H),"#fbf4df")
    d=ImageDraw.Draw(im)
    d.rounded_rectangle((16,17,W-16,H-16),radius=18,fill="#fffbea",outline="#156b79",width=10)
    d.rectangle((0,0,W,19),fill="#f7b447")
    for i in range(15):
        x=25+i*49
        d.polygon([(x,18),(x+17,18),(x+9,41)],fill=["#dd6a46","#73a65c","#368fb2"][i%3])
    label(d,(W//2,83),"D05 · Het gemiddelde",F32)
    label(d,(W//2,129),"Vier meetwaarden, drie tussenruimten",F19)
    d.rounded_rectangle((40,162,W-40,206),radius=12,fill="#e5f3ee")
    label(d,(W//2,184),"2  +  4  +  6  +  8  =  20 fiches",F23)
    for i in range(4):
        cx=94+178*i
        d.rounded_rectangle((cx-69,295,cx+69,409),radius=16,fill="#e3f0e7",outline="#3a766c",width=3)
        label(d,(cx,275),str(i+1)+("e bakje" if i==0 else "e bakje"),F16)
        if i<3:
            d.ellipse((cx+81,352,cx+89,360),fill="#a9a7a1")
    start,end=duration*.41,duration*.71
    moves=[(2,1),(3,0),(3,0),(3,0)]
    counts=[2,4,6,8]
    moving=None
    if t>=start:
        progress=(t-start)/((end-start)/4)
        done=min(4,max(0,int(progress)))
        for a,b in moves[:done]:
            counts[a]-=1;counts[b]+=1
        if done<4 and progress>=0:
            u=min(1,max(0,progress-done))
            a,b=moves[done]
            begin=item_xy(a,counts[a]-1)
            finish=item_xy(b,counts[b])
            counts[a]-=1
            smooth=u*u*(3-2*u)
            mx=begin[0]+(finish[0]-begin[0])*smooth
            my=begin[1]+(finish[1]-begin[1])*smooth-72*math.sin(math.pi*u)
            moving=(mx,my)
    for tray,n in enumerate(counts):
        for index in range(n):
            counter(d,item_xy(tray,index))
        label(d,(94+178*tray,441),str(n),F32)
    if moving:
        counter(d,moving,True)
        x,y=moving
        d.line([(x+9,y-22),(x+25,y-31),(x+38,y-22)],fill="#bc8169",width=5,joint="curve")
        d.ellipse((x+26,y-29,x+38,y-17),fill="#e9b891",outline="#9f644d",width=2)
    if t<start:
        label(d,(W//2,515),"Vier waarden, dus vier bakjes.",F23)
        label(d,(W//2,551),"De tussenruimten tellen niet mee.",F19)
    elif t<end:
        label(d,(W//2,515),"Verdeel de 20 fiches eerlijk.",F23)
        label(d,(W//2,551),"Het aantal bakjes blijft vier.",F19)
    else:
        d.rounded_rectangle((56,485,W-56,600),radius=18,fill="#e7f1cc",outline="#688e3c",width=3)
        label(d,(W//2,519),"5 + 5 + 5 + 5 = 20",F27)
        label(d,(W//2,565),"20 ÷ 4 = 5",F32)
    d.line((60,628,W-60,628),fill="#dfd8c6",width=2)
    label(d,(W//2,656),"Vier meetwaarden → gemiddelde 5",F23)
    label(d,(W//2,687),"Wisik · Pabo Rekenklaar · Roadie",F16)
    return im

def main():
    duration=duration_of(SOURCE)
    assert 20<duration<120,duration
    total=math.ceil(duration*FPS)
    cmd=["ffmpeg","-y","-nostdin","-v","error","-i",SOURCE,
         "-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","pipe:0",
         "-filter_complex","[0:v]fps=25,scale=-2:720,crop=540:720:(iw-ow)*0.13:0,setsar=1[left];[left][1:v]hstack=inputs=2[v]",
         "-map","[v]","-map","0:a:0","-t",str(duration),"-c:v","libx264","-preset","veryfast","-crf","21",
         "-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart",OUTPUT]
    p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.PIPE)
    try:
        for frame in range(total):
            p.stdin.write(draw_frame(frame/FPS,duration).tobytes())
        p.stdin.close()
        err=p.stderr.read().decode("utf8","replace")
        rc=p.wait()
        if rc: raise RuntimeError(err[-4000:])
    except:
        p.kill()
        raise
    print(f"D05 Roadie montage: {duration:.3f}s / {total} frames / {os.path.getsize(OUTPUT)} bytes",flush=True)

if __name__ == "__main__":
    main()
