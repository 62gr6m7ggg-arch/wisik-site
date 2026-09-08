"""Rebuild self-hosted lesson audio from the six original recordings (ffmpeg required).
Usage: python prepare.py INPUT_DIRECTORY PLAN_JSON
The input recordings stay private; the committed edit list uses seconds in originals.
"""
import sys,json,subprocess,hashlib,pathlib,tempfile,concurrent.futures
ROOT=pathlib.Path(__file__).resolve().parents[4]
inputs=pathlib.Path(sys.argv[1]); plan=json.load(open(sys.argv[2])); out=ROOT/'public/films/ruimteklaar'; out.mkdir(parents=True,exist_ok=True)
files={i:inputs/('Nieuwe opname.m4a' if i==1 else f'Ruimte les {i}.m4a') for i in range(1,7)}
starts={'1.6':360.32,'1.7':453.16,'5.1':9.60,'5.5':306.38,'6.2':68.86}
blocks=[['projection','projection','projection','planes','lines','lines','projection','planes','threeplanes'],['l2-hulpvlak','l2-hulpvlak','l2-doorsnede','l2-doorsnede','l2-buiten','l2-gelijkvormig','l2-gelijkvormig','l2-gelijkvormig'],['l3-ruimtefiguren','l3-oppervlakte','l3-inhoud','l3-inhoud','l3-inhoud','l3-inhoud','l3-oppervlakte','l3-goniometrie'],['l4-cos']*4+['l4-lines']+['l4-plane']*3+['l4-dihedral']*2,['l5-point-line']*3+['l5-point-plane','l5-volume']+['l5-model']*4,['l6-common-perpendicular','l6-common-perpendicular','l6-parallel-plane','l6-common-perpendicular','l6-method','l6-method']]
cuts={'1.4':[(230.3,241.99)],'2.6':[(430.9,432.2)],'4.6':[(337.48,339.0)],'4.7':[(419.1,425.12)],'5.5':[(363.5,367.9)],'6.2':[(78.1,82.5)],'6.3':[(179.05,187.55)],'6.6':[(355.48,360.85)]}
def segments(f):
 n=f['lesson']; start=starts.get(f['id'],f['sourceStart'])-.12; end=f['sourceEnd']+.12
 if f['id']=='2.3': return [(1,247.50,253.17),(2,162.90,end)]
 if f['id']=='3.1': return [(3,start,31.70),(2,219.55,224.14),(3,35.90,end)]
 parts=[]
 for a,b in cuts.get(f['id'],[]):parts.append((n,start,a));start=b
 parts.append((n,start,end));return parts
edits=[]
for f in plan:
 f['edits']=segments(f); f['blockId']=blocks[f['lesson']-1][int(f['id'].split('.')[1])-1]
 edits.append({'id':f['id'],'segments':[{'source':files[n].name,'start':a,'end':b} for n,a,b in f['edits']]})
(ROOT/'tools/space-tent/scripts/audio/edits.json').write_text(json.dumps({'sources':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in files.values()},'edits':edits},indent=2)+'\n')
def build(f):
 target=out/f['id'];target.mkdir(exist_ok=True);path=target/'uitleg.m4a'
 with tempfile.TemporaryDirectory() as tmp:
  parts=[]
  for j,(n,a,b) in enumerate(f['edits']):
   dest=pathlib.Path(tmp)/f'{j}.wav';parts.append(dest)
   subprocess.run(['ffmpeg','-v','error','-y','-ss',str(a),'-t',str(b-a),'-i',str(files[n]),'-af',f'afade=t=in:d=0.008,afade=t=out:st={b-a-.008}:d=0.008','-ar','48000','-ac','1',str(dest)],check=True)
  cat=pathlib.Path(tmp)/'parts.txt';cat.write_text(''.join(f"file '{p}'\n" for p in parts))
  subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(cat),'-af','loudnorm=I=-19:TP=-2:LRA=9','-ar','48000','-ac','1','-c:a','aac','-b:a','96k','-movflags','+faststart',str(path)],check=True)
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(path)]))
 paragraphs=[s['speech'] for s in f['shots']]
 if f['id']=='2.3':paragraphs[0]='Daarom benoemen we een vlak met drie punten die niet op één lijn liggen. Betekent dat dat de doorsnede altijd een driehoek is?'
 if f['id']=='3.1':paragraphs[2]='Evenwijdige zijvlakken geven een richting cadeau. Maar let op: een piramide heeft geen twee evenwijdige grondvlakken zoals een prisma.'
 return {'id':f['id'],'lesson':f['lesson'],'blockId':f['blockId'],'title':'Kies een standvlak loodrecht op de snijlijn' if f['id']=='4.9' else f['title'],'audio':f"/films/ruimteklaar/{f['id']}/uitleg.m4a",'duration':round(duration,3),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'paragraphs':paragraphs}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: films=list(pool.map(build,plan))
(out/'catalog.json').write_text(json.dumps({'version':'0.4.4','recordedBy':'Eigen docentstem','items':films},ensure_ascii=False,indent=2)+'\n')
print(f'{len(films)} clips, {sum(f["duration"] for f in films)/60:.1f} minuten')
