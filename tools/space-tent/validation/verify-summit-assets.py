import json, math
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parent
bank=json.loads((ROOT/'summit.json').read_text());tasks=json.loads((ROOT/'construction-tasks.json').read_text())['tasks'];count=0
v=lambda p:np.array(p,dtype=float)
def near(a,b):return np.linalg.norm(v(a)-v(b))<1e-8
def norm(a):return np.linalg.norm(v(a))
def cross(a,b):return np.cross(v(a),v(b))
def dot(a,b):return np.dot(v(a),v(b))
def angle(a,b):return math.degrees(math.acos(np.clip(abs(dot(a,b))/(norm(a)*norm(b)),-1,1)))
def area(points):
 a=v(points[0]);return sum(norm(cross(v(points[i])-a,v(points[i+1])-a))/2 for i in range(1,len(points)-1))
def plane(a,b,c):return cross(v(b)-v(a),v(c)-v(a))
def pointplane(p,a,b,c):n=plane(a,b,c);return abs(dot(v(p)-v(a),n))/norm(n)
def foot(p,a,b):p,a,b=map(v,(p,a,b));d=b-a;return a+dot(p-a,d)/dot(d,d)*d

def lines(a,b,c,d):
 a,b,c,d=map(v,(a,b,c,d));u=b-a;w=d-c
 m=np.column_stack((u,-w));ts=np.linalg.lstsq(m,c-a,rcond=None)[0]
 assert np.linalg.matrix_rank(m)==2 and norm(m@ts-(c-a))<1e-8,'No unique 3D line intersection'
 return a+ts[0]*u

def ll_distance(a,b,c,d):a,b,c,d=map(v,(a,b,c,d));n=cross(b-a,d-c);return abs(dot(c-a,n))/norm(n)
def polygon(q,labels):return [q['scene']['points'][x]for x in labels]
answers={}
A={q['id']:q for q in bank['questions']}
P=lambda id:{k:v(p) for k,p in A[id]['scene']['points'].items()}
answers['l7a-04']=area(polygon(A['l7a-04'],'PQRS'))
p=P('l7a-05');answers['l7a-05']=abs(np.linalg.det(np.array([p['B']-p['A'],p['C']-p['A'],p['T']-p['A']])))/6
answers['l7a-06']=8*6*5-abs(np.linalg.det([[4,0,0],[0,3,0],[0,0,5]]))/6
p=P('l7a-07');answers['l7a-07']=angle(p['G']-p['A'],p['F']-p['E'])
p=P('l7a-08');answers['l7a-08']=90-angle(p['G']-p['A'],plane(p['A'],p['B'],p['C']))
p=P('l7a-09');answers['l7a-09']=angle(plane(p['A'],p['B'],p['G']),plane(p['A'],p['B'],p['C']))
p=P('l7a-10');answers['l7a-10']=norm(p['B']-foot(p['B'],p['A'],p['C']))
p=P('l7a-11');answers['l7a-11']=pointplane(p['A'],p['B'],p['C'],p['T'])
p=P('l7a-12');answers['l7a-12']=ll_distance(p['A'],p['C'],p['B'],p['H'])
p=P('l7a-14');answers['l7a-14']=area([p[x]for x in 'ABCD'])*norm(p['E']-p['A'])
answers['l7b-04']=area(polygon(A['l7b-04'],'PQR'))
p=P('l7b-05');base=area([p[x]for x in 'ABC']);answers['l7b-05']=base*10-abs(np.linalg.det(np.array([p['B'],p['C'],p['P']])))/6
p=P('l7b-06');base=area([p[x]for x in 'ABCD']);top=area([p[x]for x in 'PQRS']);answers['l7b-06']=3/3*(base+top+math.sqrt(base*top))
p=P('l7b-07');answers['l7b-07']=angle(p['A']-p['T'],p['B']-p['T'])
p=P('l7b-08');answers['l7b-08']=90-angle(p['F']-p['B'],plane(p['A'],p['B'],p['D']))
p=P('l7b-09');answers['l7b-09']=angle(plane(p['B'],p['C'],p['T']),plane(p['A'],p['B'],p['C']))
p=P('l7b-10');answers['l7b-10']=norm(p['C']-foot(p['C'],p['B'],p['T']))
p=P('l7b-11');answers['l7b-11']=pointplane(p['A'],p['B'],p['C'],p['T'])
p=P('l7b-12');answers['l7b-12']=ll_distance(p['A'],p['B'],p['C'],p['T'])
target_volume=0.5*12*12*9/3;answers['l7b-14']=(target_volume*27/16)**(1/3)
assert len(answers)==20
for id,want in answers.items():
 q=A[id];assert abs(float(q['answer'][0])-want)<1e-6,(id,q['answer'],want)
 assert q['decimals']==1 and q['working'] and 'één decimaal' in q['prompt'],id
 count+=1
for route,ids in bank['checks'].items():
 assert len(ids)==14 and len(set(ids))==14
 assert {A[id]['skill']for id in ids}=={'inzicht','onderbouwen','construeren','rekenen'}
assert not set(bank['checks']['7a'])&set(bank['checks']['7b'])
for q in bank['questions']:
 if q['type']=='choice':assert q['answer'][0] in {a['id']for a in q['options']}
 for field in ['scene','revealScene']:
  if field not in q:continue
  sc=q[field];pts=sc['points']
  for ed in sc.get('edges',[])+sc.get('highlights',[]):assert len(ed)==2 and all(a in pts for a in ed),(q['id'],ed)
  for face in sc.get('planes',[]):
   n=plane(*(pts[x]for x in face[:3]));assert norm(n)>0
   assert all(abs(dot(v(pts[x])-v(pts[face[0]]),n))<1e-6 for x in face),(q['id'],face)
# Every section target must exactly match plane/polyhedron edge intersections.
section_count=0
for t in tasks:
 pts={k:v(p)for k,p in t['points'].items()}
 assert all(len(k)==1 for k in pts)
 assert all(max(abs(float(x))for x in p)<20 for p in pts.values())
 assert len(t['hints'])==3
 for p in t.get('targetPoints',[]):assert not any(near(p,g)for g in pts.values()),(t['id'],'answer pre-included')
 if len(t['targetSegments'])<3:continue
 n=plane(*(pts[x]for x in t['givens']));k=dot(n,pts[t['givens'][0]]);intersections=[]
 for ed in t['edges']:
  a,b=(pts[x]for x in ed);delta=dot(n,b-a)
  if abs(delta)<1e-9:continue
  frac=(k-dot(n,a))/delta
  if -1e-9<=frac<=1+1e-9:
   point=a+frac*(b-a)
   if not any(near(point,x)for x in intersections):intersections.append(point)
 target=[]
 for segment in t['targetSegments']:
  for point in segment:
   if not any(near(point,x)for x in target):target.append(point)
 assert len(target)==len(intersections),(t['id'],target,intersections)
 assert all(any(near(x,y)for y in intersections)for x in target),t['id']
 section_count+=1
# Recreate the written construction algorithms using only the allowed operations.
for t in tasks:
 p={k:v(x)for k,x in t['points'].items()};id=t['id'];created=[]
 if id=='construct-l2-parallel':created=[lines(p['P'],p['P']+p['R']-p['Q'],p['D'],p['H'])]
 elif id=='construct-l2-six':
  x=lines(p['Q'],p['R'],p['B'],p['F']);u=lines(p['P'],x,p['A'],p['E']);z=lines(u,u+p['R']-p['Q'],p['E'],p['H']);s=lines(z,z+p['Q']-p['P'],p['G'],p['H']);created=[u,z,s]
 elif id=='construct-l3-pyramid':created=[lines(p['R'],p['R']+p['Q']-p['P'],p['T'],p['D'])]
 elif id=='construct-l3-prism':x=lines(p['Q'],p['R'],p['B'],p['E']);created=[lines(p['P'],x,p['A'],p['D'])]
 elif id=='construct-l2-lineplane':
  k=(p['B']+p['C'])/2;y=lines(p['A'],k,p['B'],p['D']);created=[lines(y,y+p['E']-p['A'],p['A'],p['P'])]
 elif id=='construct-l4-standvlak':created=[(p['B']+p['C'])/2,lines(p['A'],p['C'],p['B'],p['D'])]
 elif id=='construct-l5-foot':created=[foot(p['B'],p['A'],p['C'])]
 elif id=='construct-l6-commonfoot':created=[foot(p['A'],p['C'],p['T'])]
 elif id=='construct-l7-a':
  u=lines(p['P'],p['Q'],p['A'],p['D']);x=lines(u,p['R'],p['A'],p['B']);s=lines(p['R'],p['R']+p['Q']-p['P'],p['C'],p['G']);y=lines(p['Q'],p['Q']+p['R']-u,p['G'],p['H']);created=[x,s,y]
 elif id=='construct-l7-b':
  u=lines(p['P'],p['Q'],p['A'],p['D']);v1=lines(p['P'],p['Q'],p['C'],p['D']);x=lines(u,p['R'],p['T'],p['A']);y=lines(v1,p['R'],p['T'],p['C']);created=[x,y]
 else:raise Exception(id)
 assert all(any(near(x,y)for y in created)for x in t.get('targetPoints',[])),id
 for segment in t['targetSegments']:
  assert all(any(near(x,y)for y in list(p.values())+created)for x in segment),id
 count+=1
print(json.dumps(dict(numeric_answers_checked=len(answers),routes=2,questions=28,choice_questions=8,section_polygons_checked=section_count,allowed_tool_construction_sequences=len(tasks),source_plane_and_point_reference_checks='passed',all_targets_hidden=True,status='passed'),indent=2))
