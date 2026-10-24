"""Builds the "Empty out" version of each roster screen: public/rosters/<key>-empty.jpg.

LEGO: every portrait (plus a margin for hair/helmets that stick out past the ring) is painted out
and the game's own empty-slot circle, copied from an empty spot in the same screenshot, is stamped
back. Smash / WWE 2K15 / MUA3: tiles are replaced with each game's empty look.
Run after scripts/rosters.py:  python3 -I scripts/empty.py
"""
import json, numpy as np
from PIL import Image, ImageDraw, ImageFilter

G = json.load(open('src/templates/rosters-geo.json'))
OUT = 'public/rosters/'

def inpaint(a, mask, iters=60):
    h, w = mask.shape
    a = a.copy()
    if min(h, w) > 48:
        small = np.asarray(Image.fromarray(a.clip(0, 255).astype('uint8')).resize((w // 2, h // 2), Image.BILINEAR)).astype(float)
        sm = np.asarray(Image.fromarray((mask * 255).astype('uint8')).resize((w // 2, h // 2), Image.BILINEAR)) > 10
        up = np.asarray(Image.fromarray(inpaint(small, sm, iters).clip(0, 255).astype('uint8')).resize((w, h), Image.BILINEAR)).astype(float)
        a[mask] = up[mask]
    else:
        a[mask] = a[~mask].mean(axis=0)
    for _ in range(iters):
        p = np.pad(a, ((1, 1), (1, 1), (0, 0)), mode='edge')
        a[mask] = ((p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4)[mask]
    return a

def disc(h, w, cx, cy, r):
    yy, xx = np.mgrid[0:h, 0:w]
    return (xx - cx) ** 2 + (yy - cy) ** 2 <= r * r

def sprite(img, cx, cy, r, ss=4):
    """Circular cut-out (anti-aliased) of radius r around (cx, cy)."""
    box = (int(cx - r - 2), int(cy - r - 2), int(cx + r + 3), int(cy + r + 3))
    crop = img.crop(box).convert('RGBA')
    m = Image.new('L', (crop.width * ss, crop.height * ss), 0)
    ox, oy = (cx - box[0]) * ss, (cy - box[1]) * ss
    ImageDraw.Draw(m).ellipse((ox - r * ss, oy - r * ss, ox + r * ss, oy + r * ss), fill=255)
    crop.putalpha(m.resize(crop.size, Image.LANCZOS))
    return crop, (box[0] - cx, box[1] - cy)

def stamp(base, spr, off, cx, cy, scale=1.0):
    s, (ox, oy) = spr, off
    if scale != 1:
        s = s.resize((max(1, round(s.width * scale)), max(1, round(s.height * scale))), Image.LANCZOS)
        ox, oy = ox * scale, oy * scale
    base.alpha_composite(s, (round(cx + ox), round(cy + oy)))

def fill_rows(a, mask):
    out = a.copy()
    for y in np.where(mask.any(axis=1))[0]:
        xs = np.where(mask[y])[0]
        for run in np.split(xs, np.where(np.diff(xs) > 1)[0] + 1):
            x0, x1 = run[0], run[-1]
            L = a[y, max(0, x0 - 3):x0].mean(axis=0) if x0 > 0 else a[y, x1 + 1:x1 + 4].mean(axis=0)
            R = a[y, x1 + 1:x1 + 4].mean(axis=0) if x1 < a.shape[1] - 1 else L
            t = np.linspace(0, 1, len(run))[:, None]
            out[y, run] = L * (1 - t) + R * t
    soft = np.asarray(Image.fromarray(out.clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(3))).astype(float)
    out[mask] = soft[mask]
    return out

def draw_ring(img, cx, cy, ri, ro, color):
    d = ImageDraw.Draw(img)
    d.ellipse((cx - ro - 1.5, cy - ro - 1.5, cx + ro + 1.5, cy + ro + 1.5), fill=(10, 10, 14, 255))
    d.ellipse((cx - ro, cy - ro, cx + ro, cy + ro), fill=color)
    d.ellipse((cx - ri - 1, cy - ri - 1, cx + ri + 1, cy + ri + 1), fill=(10, 10, 14, 255))

LEGO = {
    # outer ring radius, protrusion margin, inner radius, an empty cell, selection rings {cell: inner r}, ghosts to remove
    'marvel': dict(ro=32.5, margin=9, ri=28.5, empty=139, sel={0: 43}, ghosts=[(734, 282, 27), (945, 282, 27), (768, 264, 41), (913, 264, 41)], bigring=(63, 70, 8)),
    'batman': dict(ro=18.5, margin=5, ri=16, empty=139, sel={0: 25}, ghosts=[], bigring=(39, 44, 10)),
    'indy': dict(ro=21.5, margin=6, ri=19, empty=84, sel={0: 29, 1: 21}, ghosts=[], bigring=(69, 77, 12)),
    'starwars': dict(ro=17.3, margin=4, ri=14.5, empty=249, sel={26: 15, 18: 15}, ghosts=[], bigring=(63, 70, 8)),
    'hp': dict(ro=9.3, margin=4, ri=8, empty=113, sel={119: 11}, ghosts=[], bigring=(26.5, 30, 14)),
}

for key, c in LEGO.items():
    orig = Image.open(OUT + key + '.jpg').convert('RGB')
    base = Image.open(OUT + key + '-clean.jpg').convert('RGB')
    a = np.asarray(base).astype(float)
    h, w = a.shape[:2]
    g = G[key]
    cells = g['cells']
    e = cells[c['empty']]
    ring, roff = sprite(orig, e['cx'], e['cy'], c['ro'] + 0.5)
    inner, ioff = sprite(orig, e['cx'], e['cy'], c['ri'])
    mask = np.zeros((h, w), bool)
    for i, cell in enumerate(cells):
        r = c['sel'].get(i, c['ro'] + c['margin']) if i in c['sel'] else c['ro'] + c['margin']
        mask |= disc(h, w, cell['cx'], cell['cy'], r)
    for (gx, gy, gr) in c['ghosts']:
        mask |= disc(h, w, gx, gy, gr)
    filled = inpaint(a, mask)
    # big top circle: wipe a wider area (helmets/manes stick out) and redraw its ring
    bri, bro, bm = c['bigring']
    big = g['big']
    ring_color = tuple(int(v) for v in a[int(big["cy"]), int(big["cx"] - (bri + bro) / 2)]) + (255,)
    bmask = disc(h, w, big['cx'], big['cy'], bro + bm)
    for (gx, gy, gr) in c['ghosts']:
        bmask |= disc(h, w, gx, gy, gr)
    filled = fill_rows(filled, bmask)
    # keep the selection rings (they're the cursor) by restoring their ring pixels
    out = Image.fromarray(filled.clip(0, 255).astype('uint8')).convert('RGBA')
    for i, r_in in c['sel'].items():
        cell = cells[i]
        rs, rso = sprite(orig, cell['cx'], cell['cy'], r_in + 6)
        out.alpha_composite(rs, (round(cell['cx'] + rso[0]), round(cell['cy'] + rso[1])))
    for i, cell in enumerate(cells):
        if i in c['sel']:
            stamp(out, inner, ioff, cell['cx'], cell['cy'], c['sel'][i] / c['ri'])
        else:
            stamp(out, ring, roff, cell['cx'], cell['cy'])
    draw_ring(out, big['cx'], big['cy'], bri, bro, ring_color)
    for k in ('big', 'p1', 'p2'):
        s = g.get(k)
        if s:
            stamp(out, inner, ioff, s['cx'], s['cy'], (s['r'] + 1) / c['ri'])
    out.convert('RGB').save(OUT + key + '-empty.jpg', quality=92)
    print(key)

# --- Smash Ultimate: plain dark tiles
img = Image.open(OUT + 'smash-clean.jpg').convert('RGB')
d = ImageDraw.Draw(img)
for cell in G['smash']['cells']:
    x, y, w_, h_ = cell['x'], cell['y'], cell['w'], cell['h']
    for t in range(int(h_)):
        v = int(58 - 35 * t / h_)
        d.line([(x, y + t), (x + w_ - 1, y + t)], fill=(v, v, v + 5))
img.save(OUT + 'smash-empty.jpg', quality=92)
print('smash')

# --- WWE 2K15: black tiles, featured wrestler and name already cleaned
img = Image.open(OUT + 'wwe-clean.jpg').convert('RGB')
d = ImageDraw.Draw(img)
for cell in G['wwe']['cells']:
    d.rectangle((cell['x'] - 1, cell['y'] - 1, cell['x'] + cell['w'] + 1, cell['y'] + cell['h'] + 1), fill=(11, 11, 12))
img.save(OUT + 'wwe-empty.jpg', quality=92)
print('wwe')

# --- MUA3: every card becomes the game's empty gray card (copied from the first one)
orig = Image.open(OUT + 'mua3.jpg').convert('RGB')
img = Image.open(OUT + 'mua3-clean.jpg').convert('RGBA')
cells = G['mua3']['cells']
c0 = cells[0]
def quad_mask(size, q, grow, ss=4):
    m = Image.new('L', (size[0] * ss, size[1] * ss), 0)
    x, y, w_, h_, sk = q['x'] - grow, q['y'] - grow, q['w'] + 2 * grow, q['h'] + 2 * grow, q['sk']
    ImageDraw.Draw(m).polygon([((x + sk) * ss, y * ss), ((x + w_) * ss, y * ss), ((x + w_ - sk) * ss, (y + h_) * ss), (x * ss, (y + h_) * ss)], fill=255)
    return m.resize(size, Image.LANCZOS)
card = orig.convert('RGBA')
card.putalpha(quad_mask(orig.size, c0, 1))
card = card.crop((int(c0['x']) - 4, int(c0['y']) - 4, int(c0['x'] + c0['w']) + 4, int(c0['y'] + c0['h']) + 4))
# clear a wider area first so no edge of the old portraits survives, then stamp every card
dark = Image.new('RGBA', img.size, (14, 14, 18, 255))
for q in cells:
    img = Image.composite(dark, img, quad_mask(img.size, q, 6))
for q in cells:
    img.alpha_composite(card, (round(q['x']) - 4, int(q['y']) - 4))
# team cards: gray art area
for tx in (132, 542, 950, 1352):
    q = {'x': tx, 'y': 612, 'w': 375, 'h': 178, 'sk': 10}
    gray = Image.new('RGBA', img.size, (58, 58, 62, 255))
    img = Image.composite(gray, img, quad_mask(img.size, q, 1))
img.convert('RGB').save(OUT + 'mua3-empty.jpg', quality=92)
print('mua3')
