import json, math
from pathlib import Path
from collections import Counter
P=Path(__file__).resolve().parent
b=json.loads((P/'levels-5-6.json').read_text())
def sub(a,b):return [x-y for x,y in zip(a,b)]
def dot(a,b):return sum(x*y for x,y in zip(a,b))
def cross(a,b):return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
def norm(v):return math.sqrt(dot(v,v))
def dl(p,a,b):return norm(cross(sub(p,a),sub(b,a)))/norm(sub(b,a))
def dp(p,a,b,c):
 n=cross(sub(b,a),sub(c,a));return abs(dot(sub(p,a),n))/norm(n)
def dll(a,b,c,d):
 n=cross(sub(b,a),sub(d,c));return abs(dot(sub(c,a),n))/norm(n)
def physical(scene,label):return [v*d for v,d in zip(scene['points'][label],scene.get('dimensions',[1,1,1]))]
def qpoint(q,p):return physical(q['scene'],p)
qs={q['id']:q for q in b['questions']}
assert len(qs)==len(b['questions'])==72
blocks={x['id']:x for x in b['blocks']}
assert len(blocks)==7
for block in blocks.values():
 assert len(block['theory'])==3
 assert len(block['questionIds'])==4
 assert len(block['probeIds'])==len(block['retestIds'])==2
 ids=block['questionIds']+block['probeIds']+block['retestIds']
 assert len(set(ids))==8
 for id in ids:assert qs[id]['block']==block['id']
 mis=block['misconception'];assert mis['trigger']['qid']==block['questionIds'][0]
 for id,wrong in [(mis['trigger']['qid'],mis['trigger']['wrongAnswer'])]+list(zip(block['probeIds'],mis['probeWrongAnswers'])):
  q=qs[id];assert wrong in [o['id'] for o in q['options']] and wrong not in q['answer']
for lev,checks in b['checks'].items():
 assert len(checks)==8 and len(set(checks))==8
 assert {qs[id]['skill'] for id in checks}=={'inzicht','construeren','onderbouwen','rekenen'}
 for id in checks:assert id not in sum([x['questionIds']+x['probeIds']+x['retestIds'] for x in blocks.values()],[])

plane_count=scene_count=segment_count=0
def walk(o):
 if isinstance(o,dict):
  if 'caption' in o and 'points' in o:yield o
  else:
   for v in o.values():yield from walk(v)
 elif isinstance(o,list):
  for v in o:yield from walk(v)
for scene in walk(b):
 scene_count+=1
 for label,p in scene['points'].items():assert len(p)==3 and all(math.isfinite(x) for x in p)
 for edge in scene.get('edges',[])+scene.get('highlights',[]):
  assert len(edge)==2 and edge[0] in scene['points'] and edge[1] in scene['points'],(scene['caption'],edge)
 for plane in scene.get('planes',[]):
  plane_count+=1
  pts=[physical(scene,n) for n in plane]
  assert norm(cross(sub(pts[1],pts[0]),sub(pts[2],pts[0])))>1e-8,(plane,'degenerate')
  for p in pts[3:]:assert dp(p,*pts[:3])<1e-8,(plane,p)
 for s in scene.get('segments',[]):
  segment_count+=1;assert norm(sub(s['from'],s['to']))>1e-8

line_problems={
 'l5-point-line-q3':('A','B','P'),'l5-point-line-q4':('P','A','B'),
 'l5-point-line-r1':('H','E','G'),'l5-point-line-r2':('A','B','P'),
 'l5-check-1':('A','B','P')}
plane_problems={
 'l5-point-plane-q3':('B','A','C','G'),'l5-point-plane-q4':('E','A','F','H'),
 'l5-point-plane-r1':('D','A','C','G'),'l5-volume-q3':('F','B','G','E'),
 'l5-volume-q4':('A','B','C','T'),'l5-volume-r2':('E','A','F','H'),
 'l5-check-4':('B','A','C','G'),'l5-check-5':('F','B','G','E')}
skew_problems={
 'l6-common-perpendicular-q3':('A','B','D','H'),'l6-common-perpendicular-q4':('A','C','F','H'),
 'l6-common-perpendicular-r1':('E','F','C','G'),'l6-parallel-plane-q3':('A','C','B','H'),
 'l6-parallel-plane-q4':('B','D','A','G'),'l6-parallel-plane-r2':('A','C','B','H'),
 'l6-check-2':('A','C','F','H'),'l6-check-4':('A','C','B','H')}
expected={}
for mapping,fn in [(line_problems,dl),(plane_problems,dp),(skew_problems,dll)]:
 for id,labels in mapping.items():expected[id]=fn(*(qpoint(qs[id],p) for p in labels))
def projected_angle(q,end):
 v=sub(qpoint(q,end),qpoint(q,'A'));return math.degrees(math.asin(abs(v[2])/norm(v)))
for id in ['l6-method-q2','l6-check-5']:expected[id]=projected_angle(qs[id],'G')
q=qs['l6-method-r1'];v=sub(qpoint(q,'T'),qpoint(q,'A'));expected[q['id']]=math.degrees(math.asin(v[2]/norm(v)))
for id in ['l6-method-q3','l6-check-6']:
 q=qs[id];u=sub(qpoint(q,'F'),qpoint(q,'E'));v=sub(qpoint(q,'H'),qpoint(q,'E'));n=cross(u,v)
 expected[id]=math.degrees(math.acos(abs(n[2])/norm(n)))
def water_volume(h):
 # Independent geometric calculation from similar side triangles.
 width_bottom=2; width_water=width_bottom+(6-2)*(h/4)
 return 10*(width_bottom*h+2*.5*(width_water-width_bottom)/2*h)
expected['l5-model-q2']=water_volume(3)
expected['l5-check-7']=water_volume(1.5)
low,high=0,4
for _ in range(80):
 mid=(low+high)/2
 if water_volume(mid)>80:high=mid
 else:low=mid
expected['l5-model-q3']=(low+high)/2
def fold_height(x):
 side=(60-x)/2; displacement=(2*x-x)/2;return math.sqrt(side*side-displacement*displacement)
expected['l5-model-q4']=fold_height(12)
expected['l6-check-7']=40*(20+40)*fold_height(20)/2
expected['l5-model-r1']=3+(9-3)*2/6
expected['l5-volume-r1']=96/(24/3)
numeric=[q for q in qs.values() if q['type']=='numeric']
assert len(expected)==len(numeric)==33,(set(q['id'] for q in numeric)-set(expected))
for q in numeric:
 assert math.isclose(float(q['answer'][0]),expected[q['id']],abs_tol=1e-7), (q['id'],q['answer'],expected[q['id']])
 assert q['decimals']==(0 if q['unit']=='°' else 2)
 assert q['working'] is True
for q in qs.values():
 assert q['explanation'] and q['hint'] and q['scene']
 if q['type']=='choice':
  assert len(q['answer'])==1 and q['answer'][0] in [o['id'] for o in q['options']]
 if q['type']=='points':
  assert len(q['answer'])==q['selectCount']
  assert set(q['answer']).issubset(q['scene']['points'])

# Check every supplied green construction segment in a mathematically relevant known scene.
foot_checks=[
 ('l5-point-line-q2','F','E','B'),('l5-point-line-q3','A','B','P'),('l5-point-line-q4','P','A','B'),
 ('l5-point-line-r1','H','E','G')]
for id,p,a,c in foot_checks:
 q=qs[id];s=q['revealScene'];line=s['segments'][-1];dims=s.get('dimensions',[1,1,1]);n=[v*d for v,d in zip(line['to'],dims)]
 assert dl(n,qpoint(q,a),qpoint(q,c))<1e-8
 assert abs(dot(sub(qpoint(q,p),n),sub(qpoint(q,c),qpoint(q,a))))<1e-8
for id,labels in plane_problems.items():
 q=qs[id]
 if 'revealScene' not in q:continue
 s=q['revealScene'];target=s['segments'][-1]['to'];n=[x*y for x,y in zip(target,s.get('dimensions',[1,1,1]))]
 p,a,c,d=[qpoint(q,label) for label in labels]
 assert dp(n,a,c,d)<1e-8,(id,'off plane')
 assert abs(dot(sub(p,n),sub(c,a)))<1e-8 and abs(dot(sub(p,n),sub(d,a)))<1e-8,(id,'not normal')
for id,labels in skew_problems.items():
 q=qs[id]
 if 'revealScene' not in q:continue
 s=q['revealScene'];coords=s['segments'][-1];u,v=[[x*y for x,y in zip(coords[k],s.get('dimensions',[1,1,1]))] for k in ['from','to']]
 a,c,d,e=[qpoint(q,label) for label in labels]
 assert dl(u,a,c)<1e-8 and dl(v,d,e)<1e-8,(id,'off lines')
 assert abs(dot(sub(v,u),sub(c,a)))<1e-8 and abs(dot(sub(v,u),sub(e,d)))<1e-8,(id,'not common perpendicular')

summary={'blocks':len(blocks),'questions':len(qs),'numeric_independent_checks':len(numeric),'scenes':scene_count,'planar_polygons':plane_count,'illustrated_segments':segment_count,'question_types':dict(Counter(q['type'] for q in qs.values())),'skills':dict(Counter(q['skill'] for q in qs.values())),'checks_per_level':{k:len(v) for k,v in b['checks'].items()}}
(P/'levels-5-6-validation.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
