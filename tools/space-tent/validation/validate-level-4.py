import json, math
from pathlib import Path
D=Path(__file__).resolve().parent
b=json.loads((D/'level-4.json').read_text()); qs={q['id']:q for q in b['questions']}
sub=lambda a,b:[x-y for x,y in zip(a,b)]
dot=lambda a,b:sum(x*y for x,y in zip(a,b))
norm=lambda a:math.sqrt(dot(a,a))
def cross(a,b):return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
def vec(s,a,c):return sub(s['points'][c],s['points'][a])
def angle(u,v,small=False):
 d=dot(u,v)/(norm(u)*norm(v)); d=abs(d) if small else d
 return math.degrees(math.acos(max(-1,min(1,d))))
def plnormal(s,n):return cross(vec(s,n[0],n[1]),vec(s,n[0],n[2]))
def linenplane(s,a,c,plane):
 n=plnormal(s,plane); v=vec(s,a,c)
 return math.degrees(math.asin(min(1,abs(dot(n,v))/(norm(n)*norm(v)))))
def dangle(s,p,q):return angle(plnormal(s,p),plnormal(s,q),True)
def tangle(s):return angle(vec(s,'A','B'),vec(s,'A','C'))
def tarea(s):return norm(cross(vec(s,'A','B'),vec(s,'A','C')))/2
calc={
 'l4-cos-q2':tangle,
 'l4-cos-q3':lambda s:norm(vec(s,'B','C')),
 'l4-cos-q4':tarea,
 'l4-cos-r1':tangle,
 'l4-cos-r2':tarea,
 'l4-lines-q2':lambda s:angle(vec(s,'A','B'),vec(s,'D','G'),True),
 'l4-lines-q4':lambda s:angle(vec(s,'E','G'),vec(s,'I','B'),True),
 'l4-lines-r1':lambda s:angle(vec(s,'A','C'),vec(s,'F','H'),True),
 'l4-lines-r2':lambda s:angle(vec(s,'A','B'),vec(s,'D','G'),True),
 'l4-plane-q3':lambda s:linenplane(s,'A','G','ABC'),
 'l4-plane-r1':lambda s:linenplane(s,'A','G','ABC'),
 'l4-dihedral-q3':lambda s:dangle(s,'ABC','ABG'),
 'l4-dihedral-q4':lambda s:dangle(s,'EJG','ABF'),
 'l4-dihedral-r1':lambda s:dangle(s,'ABC','ABG'),
 'l4-check-2':lambda s:norm(vec(s,'B','C')),
 'l4-check-4':lambda s:angle(vec(s,'A','B'),vec(s,'D','G'),True),
 'l4-check-6':lambda s:linenplane(s,'A','G','ABC'),
 'l4-check-8':lambda s:dangle(s,'EJG','ABF')}
assert set(calc)=={q['id'] for q in b['questions'] if q['type']=='numeric'}
result=[]
for id,fn in calc.items():
 q=qs[id]; v=fn(q['scene']); saved=float(q['answer'][0]); delta=abs(v-saved)
 assert delta<1e-9,(id,v,saved)
 result.append({'question':id,'coordinateResult':v,'storedAnswer':saved,'difference':delta})
scenes=[]
for block in b['blocks']:
 assert len(block['theory'])==3 and len(block['questionIds'])==4 and len(block['probeIds'])==2 and len(block['retestIds'])==2
 scenes += [(block['id']+'-theory'+str(i),t['scene']) for i,t in enumerate(block['theory'])]
 scenes.append((block['id']+'-repair',block['repair']['scene']))
 ids=block['questionIds']+block['probeIds']+block['retestIds']
 assert all(id in qs for id in ids)
 assert block['misconception']['trigger']['qid']==ids[0]
 trigger=qs[ids[0]]; wrong=block['misconception']['trigger']['wrongAnswer']
 assert wrong not in trigger['answer'] and wrong in [o['id'] for o in trigger['options']]
 for i,id in enumerate(block['probeIds']):
  wrong=block['misconception']['probeWrongAnswers'][i]
  assert wrong not in qs[id]['answer'] and wrong in [o['id'] for o in qs[id]['options']]
for q in b['questions']:
 assert q['skill'] in ['inzicht','construeren','onderbouwen','rekenen']
 scenes.append((q['id'],q['scene']))
 if 'revealScene' in q:scenes.append((q['id']+'-reveal',q['revealScene']))
 if q['type']=='choice':
  assert len(q['answer'])==1 and q['answer'][0] in [o['id'] for o in q['options']]
 if q['type']=='points':
  assert q['selectCount']==len(q['answer']) and all(p in q['scene']['points'] for p in q['answer'])
scenes.append(('paper',b['papers']['4']['scene']))
planecount=0
for id,s in scenes:
 assert isinstance(s['caption'],str) and s['caption']
 p=s['points']
 assert all(len(v)==3 and all(math.isfinite(x) for x in v) for v in p.values())
 for edge in s.get('edges',[])+s.get('highlights',[]):
  assert len(edge)==2 and all(l in p for l in edge),(id,edge)
  assert norm(vec(s,edge[0],edge[1]))>1e-8,(id,edge)
 for poly in s.get('planes',[]):
  n=plnormal(s,poly); assert norm(n)>1e-9,(id,poly)
  for pt in poly[3:]:assert abs(dot(n,vec(s,poly[0],pt)))<1e-7,(id,poly)
  planecount+=1
# Verify the constructed feet and stand-angle conditions on every advanced EJG reveal.
feet=[]
for id,s in scenes:
 if all(p in s['points'] for p in ['I','J','F']) and 'FI' in s.get('highlights',[]):
  ej=vec(s,'E','J'); fi=vec(s,'F','I'); gi=vec(s,'G','I'); ei=vec(s,'E','I')
  assert norm(cross(ej,ei))<1e-8
  assert abs(dot(ej,fi))<1e-8 and abs(dot(ej,gi))<1e-8
  assert abs(dot(fi,vec(s,'F','G')))<1e-8
  feet.append(id)
# Parallel translation E->J equals I->B, both probe directions, and three projection constructions.
s=qs['l4-lines-q3']['scene'];assert norm(sub(vec(s,'I','B'),vec(s,'E','J')))<1e-9
s=qs['l4-lines-p1']['scene'];assert abs(angle(vec(s,'A','C'),vec(s,'F','H'),True)-90)<1e-9
s=qs['l4-lines-p2']['scene'];assert abs(angle(vec(s,'B','C'),vec(s,'E','D'),True)-45)<1e-9
for id,pl,pairs in [('l4-plane-q1','ABC',[('G','C')]),('l4-plane-q4','ADH',[('B','A'),('G','H')]),('l4-check-5','DCG',[('A','D')])]:
 s=qs[id]['scene']; n=plnormal(s,pl)
 for a,c in pairs:assert norm(cross(vec(s,a,c),n))<1e-8
# Every checkpoint is new and aggregate covers all four skills and all four blocks.
checkids=b['checks']['4'];practice={id for x in b['blocks'] for key in ['questionIds','probeIds','retestIds'] for id in x[key]}
assert len(checkids)==8 and not set(checkids)&practice
assert {qs[id]['skill'] for id in checkids}=={'inzicht','construeren','onderbouwen','rekenen'}
assert {qs[id]['block'] for id in checkids}=={x['id'] for x in b['blocks']}
report={'level':4,'status':'passed','counts':{'blocks':4,'theoryScenes':12,'questions':40,'numericAnswersIndependentlyChecked':len(result),'scenesChecked':len(scenes),'planarPolygonsChecked':planecount,'advancedFootpointScenesChecked':len(feet)},'numericChecks':result,'footpointChecks':feet,'methods':['Vector dot products for line angles, independent of cosine-law explanations','Cross products for triangle areas and plane normals','Line-plane angle via dot product with a plane normal','Exact perpendicularity, collinearity and planarity of construction scenes','IDs, option keys, diagnostic trigger and probe structure, practice/check separation'],'limitations':['Automated coordinate checks verify mathematical geometry and numeric targets; they do not measure learning effects or empirically validate diagnosis.','Paper construction and written method require student self-review or teacher assessment.']}
(D/'level-4-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report['counts']))
