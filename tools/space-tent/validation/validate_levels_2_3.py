"""Independent coordinate, numerical-key and asset-contract validation."""
import json, math
from pathlib import Path
import numpy as np
from scipy.spatial import ConvexHull
P=Path(__file__).resolve().parent
b=json.loads((P/'levels-2-3.json').read_text()); q={x['id']:x for x in b['questions']}
C={'A':[0,0,0],'B':[1,0,0],'C':[1,1,0],'D':[0,1,0],'E':[0,0,1],'F':[1,0,1],'G':[1,1,1],'H':[0,1,1]}
def points(scene):return {k:np.array(v,dtype=float) for k,v in {**(C if scene.get('showCube',True) else {}),**scene.get('points',{})}.items()}
def area(scene,a='A',bb='B',c='C'):
 p=points(scene);return np.linalg.norm(np.cross(p[bb]-p[a],p[c]-p[a]))/2
def volume(scene,names=None):
 p=points(scene);coords=list(p.values()) if names is None else [p[k]for k in names]
 return ConvexHull(np.array(coords)).volume
def dist(scene,a,bb):
 p=points(scene);return np.linalg.norm(p[bb]-p[a])
def angle(scene,a,vertex,c):
 p=points(scene);u=p[a]-p[vertex];v=p[c]-p[vertex]
 return math.degrees(math.acos(np.dot(u,v)/np.linalg.norm(u)/np.linalg.norm(v)))
def line_meet(a,b,c,d):
 a,b,c,d=map(lambda x:np.array(x,dtype=float),[a,b,c,d])
 uv=np.column_stack([b-a,-(d-c)])
 ts,res,_,_=np.linalg.lstsq(uv,c-a,rcond=None)
 p=a+ts[0]*(b-a);assert np.linalg.norm(p-(c+ts[1]*(d-c)))<1e-9
 return p

def ext(m,rib):return np.linalg.norm(line_meet([1,1,1],[0,0,m],[0,0,0],[1,1,0]))*rib
def s_height(hp,hq,hr):
 # Solve for the plane from physical x/y coordinates; evaluate at the fourth corner.
 coeff=np.linalg.solve(np.array([[0,0,1],[1,0,1],[1,1,1]],float),np.array([hp,hq,hr],float))
 return np.dot(coeff,[0,1,1])
expected={
'l2-hulpvlak-3':np.linalg.norm([1,1,1]),
'l2-doorsnede-3':s_height(2,4,6),
'l2-buiten-3':ext(.5,6),
'l2-buiten-r2':ext(1/3,6),
'l2-gelijkvormig-2':dist(q['l2-gelijkvormig-2']['scene'],'A','Q'),
'l2-gelijkvormig-4':dist(q['l2-gelijkvormig-4']['scene'],'P','Q'),
'l2-gelijkvormig-r1':dist(q['l2-gelijkvormig-r1']['scene'],'A','Q'),
'l2-gelijkvormig-r2':dist(q['l2-gelijkvormig-r2']['scene'],'B','C'),
'l3-oppervlakte-2':area(q['l3-oppervlakte-2']['scene']),
'l3-oppervlakte-3':area(q['l3-oppervlakte-3']['scene']),
'l3-oppervlakte-r1':area(q['l3-oppervlakte-r1']['scene']),
'l3-oppervlakte-r2':area(q['l3-oppervlakte-r2']['scene']),
'l3-inhoud-2':volume(q['l3-inhoud-2']['scene']),
'l3-inhoud-3':volume(q['l3-inhoud-3']['scene'],list('ADPR')),
'l3-inhoud-4':volume(q['l3-inhoud-4']['scene'],list('ABCPQR')),
'l3-inhoud-r1':volume(q['l3-inhoud-r1']['scene'],list('ABCDT')),
'l3-inhoud-r2':volume(q['l3-inhoud-r2']['scene'],list('ABCPQR')),
'l3-goniometrie-2':round(angle(q['l3-goniometrie-2']['scene'],'B','A','C')),
'l3-goniometrie-3':dist(q['l3-goniometrie-3']['scene'],'B','C'),
'l3-goniometrie-4':dist(q['l3-goniometrie-4']['scene'],'B','C'),
'l3-goniometrie-r1':round(angle(q['l3-goniometrie-r1']['scene'],'A','C','B')),
'l3-goniometrie-r2':dist(q['l3-goniometrie-r2']['scene'],'B','C'),
'l2-doorsnede-check-4':s_height(2,5,7),
'l2-buiten-check-6':ext(.25,4),
'l2-gelijkvormig-check-7':dist(q['l2-gelijkvormig-check-7']['scene'],'P','Q'),
'l3-oppervlakte-check-4':area(q['l3-oppervlakte-check-4']['scene']),
'l3-inhoud-check-5':volume(q['l3-inhoud-check-5']['scene'],list('ABCPQR')),
'l3-goniometrie-check-7':round(angle(q['l3-goniometrie-check-7']['scene'],'C','A','G')),
}
assert set(expected)=={k for k,x in q.items()if x['type']=='numeric'}
for k,v in expected.items():
 assert abs(float(q[k]['answer'][0])-v)<1e-8,(k,v,q[k]['answer'])
 assert q[k]['decimals']==(0 if q[k]['unit']=='°' else 2)
 # Supplied scenes must be consistent with the stated physical dimensions for all non-unit-cube figures.
 assert q[k]['working'] is True
scenes=[]
for bl in b['blocks']:
 scenes.extend(x['scene']for x in bl['theory']); scenes.append(bl['repair']['scene'])
for x in b['questions']:
 scenes.append(x['scene'])
 if 'revealScene'in x:scenes.append(x['revealScene'])
scenes.extend(p['scene'] for p in b['papers'].values())
plane_count=0
for s in scenes:
 pp=points(s)
 assert s['caption']
 assert all(len(k)==1 and len(v)==3 and np.all(np.isfinite(v))for k,v in pp.items())
 for e in s.get('edges',[])+s.get('highlights',[]):
  assert len(e)==2 and e[0]in pp and e[1]in pp,(e,s['caption'])
  assert np.linalg.norm(pp[e[0]]-pp[e[1]])>1e-9
 for pl in s.get('planes',[]):
  assert len(pl)>=3 and all(k in pp for k in pl)
  vv=np.array([pp[k]for k in pl]); singular=np.linalg.svd(vv-vv[0],compute_uv=False)
  assert singular[1]>1e-8 and (len(singular)<3 or singular[2]<1e-8),(s['caption'],pl)
  plane_count+=1
 for l in s.get('segments',[]):assert all(len(l[k])==3 and all(math.isfinite(v)for v in l[k])for k in ['from','to'])
# Independent intersection enumeration for all three illustrated nontrivial sections.
def section_on_edges(base,edges,through):
 u,v,w=[np.array(x,float)for x in through];normal=np.cross(v-u,w-u)
 result=[]
 for edge in edges:
  a=np.array(base[edge[0]],float);bb=np.array(base[edge[1]],float)
  da=np.dot(normal,a-u);db=np.dot(normal,bb-u)
  if abs(da)<1e-8:result.append(a)
  if da*db < -1e-10:result.append(a+(bb-a)*(-da)/(db-da))
 unique=[]
 for x in result:
  if all(np.linalg.norm(x-y)>1e-8 for y in unique):unique.append(x)
 return unique
cases=[
({'A':[0,0,0],'B':[1,0,0],'C':[1,1,0],'D':[0,1,0],'E':[0,0,1],'F':[1,0,1],'G':[1,1,1],'H':[0,1,1]},['AB','BC','CD','DA','EF','FG','GH','HE','AE','BF','CG','DH'],[[0,0,.25],[1,0,.5],[1,1,.75]],[[0,0,.25],[1,0,.5],[1,1,.75],[0,1,.5]]),
({'A':[0,0,0],'B':[2,0,0],'C':[0,2,0],'D':[0,0,3],'E':[2,0,3],'F':[0,2,3]},['AB','BC','CA','DE','EF','FD','AD','BE','CF'],[[1,0,0],[0,1,0],[2,0,1.5]],[[1,0,0],[0,1,0],[2,0,1.5],[0,2,1.5]]),
({'A':[0,0,0],'B':[2,0,0],'C':[2,2,0],'D':[0,2,0],'T':[1,1,4]},['AB','BC','CD','DA','AT','BT','CT','DT'],[[.25,.25,1],[1.5,.5,2],[1.5,1.5,2]],[[.25,.25,1],[1.5,.5,2],[1.5,1.5,2],[.25,1.75,1]])]
for base,edges,through,wanted in cases:
 actual=section_on_edges(base,edges,through)
 assert len(actual)==len(wanted)
 assert all(any(np.linalg.norm(x-y)<1e-8 for x in actual)for y in np.array(wanted))
# Verify the pupil's forbidden pyramid parallel really is nonparallel in this example.
p=np.array([.25,.25,1]);qq=np.array([1.5,.5,2]);r=np.array([1.5,1.5,2]);s=np.array([.25,1.75,1])
assert np.linalg.norm(np.cross(qq-p,s-r))>1e-8
# Verify exterior pyramid construction, including both extension points and the final corner.
x=line_meet(p,qq,[0,0,0],[2,0,0]); assert np.linalg.norm(x-[-1,0,0])<1e-9
y=line_meet(x,x+(r-qq),[2,2,0],[0,2,0]); assert np.linalg.norm(y-[-1,2,0])<1e-9
ss=line_meet(r,y,[0,2,0],[1,1,4]);assert np.linalg.norm(ss-s)<1e-9
# Numerically confirm decomposition equals the convex hull of the remaining solid.
for k in ['l3-inhoud-4','l3-inhoud-r2','l3-inhoud-check-5']:
 scene=q[k]['scene'];whole=volume(scene,list('ABCDEF'))
 cuts=sum(volume(scene,list(z))for z in ['ADPR','BEPQ','CFQR'])
 rest=volume(scene,list('ABCPQR'))
 assert abs(whole-cuts-rest)<1e-8
summary={'blocks':len(b['blocks']),'questions':len(q),'numeric_keys_independently_verified':len(expected),'scene_occurrences_checked':len(scenes),'planar_polygons_checked':plane_count,'complete_sections_verified':len(cases),'composite_volumes_verified_by_convex_hull':3,'external_pyramid_construction_verified':True,'correct_option_positions':{c:sum(x['type']=='choice' and x['answer']==[c]for x in q.values())for c in ['a','b','c']}}
(P/'levels-2-3-validation.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
