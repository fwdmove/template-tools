import json, sys
from PIL import Image, ImageDraw
G = {}
def circ(cx,cy,r): return {'t':'c','cx':round(cx,1),'cy':round(cy,1),'r':r}
def rect(x,y,w,h): return {'t':'r','x':round(x,1),'y':round(y,1),'w':w,'h':h}
def quad(x,y,w,h,sk): return {'t':'q','x':round(x,1),'y':round(y,1),'w':w,'h':h,'sk':sk}

# LEGO MARVEL 1680x1050
cells=[]
for j in range(7):
    for i in range(20):
        cells.append(circ(143+i*73.42, 459+j*73.5, 27))
G['marvel']=dict(src='lego-marvel.jpg', w=1680, h=1050, cells=cells,
    big=circ(840,250,58), p1=circ(190,135,42), p2=circ(1490,135,42),
    sel=circ(143,459,40), selIndex=0)
# LEGO BATMAN 1280x725
cells=[]
for j in range(6):
    rng = range(25) if j<5 else range(5,20)
    for i in rng:
        cells.append(circ(124.5+i*42.92, 324.5+j*43, 15.5))
G['batman']=dict(src='lego-batman.jpg', w=1280, h=725, cells=cells,
    big=circ(639,194,38), p1=circ(164,102,28), p2=circ(1115,102,28), sel=circ(124.5,324.5,23), selIndex=0)
# LEGO INDY 1280x800
cells=[]
for j in range(5):
    for i in range(17):
        cells.append(circ(256.5+i*47.94, 479.5+j*47.5, 18))
G['indy']=dict(src='lego-indy.jpg', w=1280, h=800, cells=cells,
    big=circ(640,259,68), p1=circ(144,104,37), p2=circ(1136,104,37), sel=circ(256.5,479.5,24), selIndex=0)
# LEGO STAR WARS 1080x603
cells=[]
for j in range(10):
    for i in range(25):
        cells.append(circ(114+i*35.46, 255+j*35.4, 14))
G['starwars']=dict(src='lego-starwars.jpg', w=1080, h=603, cells=cells,
    big=circ(539,143,62), p1=circ(45,53,30), p2=circ(1032,53,30), sel=None)
# LEGO HP 480x360
cells=[]
for j in range(6):
    for i in range(19):
        cells.append(circ(68.75+i*18.85, 158.25+j*23.25, 7.5))
for i in range(10):
    cells.append(circ(154.5+i*18.85, 297.5, 7.5))
G['hp']=dict(src='lego-hp.jpg', w=480, h=360, cells=cells,
    big=circ(238,96,26), p1=circ(16,58,13), p2=circ(461,58,13), sel=circ(248.75,297.5,11), selIndex=119)

# SMASH 1200x675
cells=[]
rows=[54,105,156,207,259,310,361]
for j,y in enumerate(rows):
    rng = range(13) if j<6 else range(2,10)
    for i in rng:
        cells.append(rect(16+i*90, y, 88, 49 if j<6 else 46))
G['smash']=dict(src='smash-ultimate.jpg', w=1200, h=675, cells=cells)

# WWE 2K15 1280x720
cells=[]
spec=[(0,21),(1,19),(2,17),(7,6)]
for j,(start,n) in enumerate(spec):
    for i in range(start,start+n):
        cells.append(rect(176+i*43.86, 388+j*50, 42, 48))
G['wwe']=dict(src='wwe2k15.jpg', w=1280, h=720, cells=cells)

# MUA3 1855x1088
cells=[]
x0s=[270,226,178]
for j in range(3):
    for i in range(12):
        cells.append(quad(x0s[j]+i*120 - 14, 151+j*151, 123, 138, 14))
G['mua3']=dict(src='mua3.jpg', w=1855, h=1088, cells=cells)

json.dump(G, open('geo.json','w'))
import shutil; shutil.copy('geo.json', sys.argv[1] if len(sys.argv)>1 and sys.argv[1].endswith('.json') else 'geo.json')

SRC={'marvel':'Lego Marvel.png','batman':'LEGO Batman.webp','indy':'LEGO Indiana Jones.jpg','starwars':'LEGO Star Wars.webp','hp':'LEGO Harry Potter.jpg','smash':'Smash Bros.webp','wwe':'WWE 2k15.jpg','mua3':'Marvel Ultimate Alliance 3.png'}
for k in ([a for a in sys.argv[1:] if not a.endswith('.json')] or G):
    g=G[k]; im=Image.open('/Users/cam/Desktop/Games/'+SRC[k]).convert('RGB'); d=ImageDraw.Draw(im)
    allc = g['cells'] + [g[x] for x in ('big','p1','p2','sel') if g.get(x)]
    for c in allc:
        if c['t']=='c': d.ellipse((c['cx']-c['r'],c['cy']-c['r'],c['cx']+c['r'],c['cy']+c['r']), outline=(255,0,255), width=1)
        elif c['t']=='r': d.rectangle((c['x'],c['y'],c['x']+c['w'],c['y']+c['h']), outline=(255,0,255), width=1)
        else:
            x,y,w,h,s=c['x'],c['y'],c['w'],c['h'],c['sk']
            d.polygon([(x+s,y),(x+w,y),(x+w-s,y+h),(x,y+h)], outline=(255,0,255))
    im.save(f'ov_{k}.png')
