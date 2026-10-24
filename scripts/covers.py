"""Builds WWE 2K cover templates from source cover images.

For each cover writes public/covers/<id>.jpg (upscaled original), <id>-clean.jpg (cover star
painted out from the surrounding background) and <id>-logo.png (the game logo with transparency,
drawn over the user's photo). Boxes are fractions of width/height. Run:
python3 -I scripts/covers.py "/path/to/WWE 2K COVERS"
"""
import sys, json, numpy as np
from PIL import Image, ImageFilter

COVERS = {
    '2k14': ('wwe 2k14 cover.jpeg', [(0.08, 0.05, 0.93, 0.25)], [(0.10, 0.22, 0.97, 1)], [], [(0.30, 0.17, 0.60, 0.25)]),
    '2k15': ('wwe 2k15 cover.jpeg', [(0.09, 0.11, 0.87, 0.31)], [(0.08, 0.28, 0.90, 1)], [(0.81, 0.89, 0.97, 0.985)], [(0.40, 0.24, 0.64, 0.31)]),
    '2k16': ('wwe 2k16 cover.jpeg', [(0.07, 0.05, 0.95, 0.28)], [(0.10, 0.22, 0.90, 1)], [(0.80, 0.89, 0.97, 0.985)], [(0.33, 0.19, 0.75, 0.28)]),
    '2k17': ('wwe 2k17 cover.jpeg', [(0.04, 0.09, 0.96, 0.39)], [(0.38, 0.29, 0.97, 1), (0.03, 0.39, 0.97, 1)], [(0.81, 0.89, 0.97, 0.985)], [(0.36, 0.28, 0.62, 0.39)]),
    '2k18': ('wwe 2k18 cover.jpeg', [(0.03, 0.04, 0.97, 0.34)], [(0.02, 0.33, 0.98, 1)], [(0.79, 0.89, 0.96, 0.985)], [(0.33, 0.21, 0.69, 0.34)]),
    '2k19': ('wwe 2k19 cover.jpeg', [(0.02, 0.03, 0.97, 0.34)], [(0.02, 0.33, 0.98, 1)], [(0.02, 0.83, 0.16, 0.995), (0.79, 0.88, 0.97, 0.985)], [(0.27, 0.20, 0.72, 0.34)]),
    '2k20': ('wwe 2k20 cover.jpeg', [(0.04, 0.03, 0.96, 0.27)], [(0.0, 0.24, 1, 1)], [(0.02, 0.83, 0.16, 0.995), (0.80, 0.88, 0.97, 0.985)], [(0.50, 0.19, 0.88, 0.27)]),
    '2k22': ('wwe 2k22 cover.jpeg', [(0.04, 0.36, 0.97, 0.56)], [(0.03, 0.08, 0.97, 1)], [(0.83, 0.89, 0.97, 0.98)], [(0.04, 0.36, 0.97, 0.56)]),
    '2k23': ('wwe 2k23 cover.jpeg', [(0.06, 0.04, 0.95, 0.22)], [(0.0, 0.17, 1, 1)], [], [(0.38, 0.16, 0.68, 0.22)]),
    '2k24': ('wwe 2k24 cover.jpeg', [(0.03, 0.04, 0.24, 0.73)], [(0.24, 0, 1, 1), (0.0, 0.73, 0.24, 0.84)], [(0.02, 0.84, 0.15, 0.995), (0.87, 0.9, 0.97, 0.98)], []),
    '2k25': ('WWE 2K25.jpg', [(0.02, 0.03, 0.22, 0.77)], [(0.22, 0, 1, 1), (0.16, 0.77, 0.22, 1)], [(0.03, 0.84, 0.15, 0.985), (0.87, 0.9, 0.98, 0.98)], []),
    '2k26': ('WWE 2K26 COVER.webp', [(0.14, 0.01, 0.87, 0.21)], [(0.03, 0.17, 0.97, 1)], [(0.02, 0.84, 0.14, 0.99), (0.80, 0.88, 0.97, 0.985)], [(0.30, 0.15, 0.72, 0.21)]),
}
TARGET_W = 1080

def px(box, w, h):
    x0, y0, x1, y1 = box
    return int(x0 * w), int(y0 * h), int(round(x1 * w)), int(round(y1 * h))

def fill_rows(a, mask, soften=True):
    """Fill each masked run by blending the colors on its left and right, then soften it.

    Keeps the cover's own colors and top-to-bottom streaks instead of averaging to one tone.
    Rows that span the full width are filled top-down from the column above instead."""
    out = a.copy()
    unfilled = np.zeros_like(mask)
    h, w = mask.shape
    for y in range(h):
        row = mask[y]
        if not row.any():
            continue
        xs = np.where(row)[0]
        # split into contiguous runs
        runs = np.split(xs, np.where(np.diff(xs) > 1)[0] + 1)
        for run in runs:
            x0, x1 = run[0], run[-1]
            L = a[y, max(0, x0 - 3):x0].mean(axis=0) if x0 > 0 else None
            R = a[y, x1 + 1:x1 + 4].mean(axis=0) if x1 < w - 1 else None
            if L is None and R is None:
                unfilled[y, run] = True
                continue
            L = R if L is None else L
            R = L if R is None else R
            t = np.linspace(0, 1, len(run))[:, None]
            out[y, run] = L * (1 - t) + R * t
    if unfilled.any():
        out = fill_rows(out.transpose(1, 0, 2), unfilled.T, soften=False).transpose(1, 0, 2)
        wide = np.asarray(Image.fromarray(out.clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(45))).astype(float)
        out[unfilled] = wide[unfilled]
    if not soften:
        return out
    # blur only inside the mask so streaks read as out-of-focus background
    blurred = np.asarray(Image.fromarray(out.clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(10))).astype(float)
    out[mask] = blurred[mask]
    rng = np.random.default_rng(1)
    out[mask] += rng.normal(0, 4, out[mask].shape)
    return out

def inpaint(a, mask, iters=300):
    """Fill masked pixels by diffusing the surrounding colors inward (coarse-to-fine)."""
    h, w = mask.shape
    if min(h, w) > 64:
        small = np.asarray(Image.fromarray(a.astype('uint8')).resize((w // 2, h // 2), Image.BILINEAR)).astype(float)
        sm = np.asarray(Image.fromarray((mask * 255).astype('uint8')).resize((w // 2, h // 2), Image.BILINEAR)) > 10
        filled = inpaint(small, sm, iters)
        up = np.asarray(Image.fromarray(filled.clip(0, 255).astype('uint8')).resize((w, h), Image.BILINEAR)).astype(float)
        a = a.copy()
        a[mask] = up[mask]
        iters = 40
    else:
        a = a.copy()
        a[mask] = a[~mask].mean(axis=0)
    for _ in range(iters):
        p = np.pad(a, ((1, 1), (1, 1), (0, 0)), mode='edge')
        avg = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4
        a[mask] = avg[mask]
    return a

meta = {}
for cid, (name, logos, stars, badges, overlaps) in COVERS.items():
    src = Image.open(f'{sys.argv[1]}/{name}').convert('RGB')
    k = TARGET_W / src.width
    H = round(src.height * k)
    im = src.resize((TARGET_W, H), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
    w, h = im.size
    a = np.asarray(im).astype(float)
    star = np.zeros((h, w), bool)
    for b in stars:
        x0, y0, x1, y1 = px(b, w, h)
        star[y0:y1, x0:x1] = True
    logo = np.zeros((h, w), bool)
    for b in logos:
        x0, y0, x1, y1 = px(b, w, h)
        logo[y0:y1, x0:x1] = True
    over = np.zeros((h, w), bool)
    for b in overlaps:
        x0, y0, x1, y1 = px(b, w, h)
        over[y0:y1, x0:x1] = True
    star = (star & ~logo) | over
    for b in badges:
        x0, y0, x1, y1 = px(b, w, h)
        star[y0:y1, x0:x1] = True
    filled = fill_rows(a, star)
    # logo layer: keep white, logo-red and the dark outline next to them. Where the cover star
    # overlaps the logo, only keep clearly white/red pixels so hair and skin don't come along.
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bgest = inpaint(filled, logo & ~over)
    diff = np.abs(a - bgest).max(axis=2)
    white = np.minimum(np.minimum(r, g), b) > 175
    red = (r > 150) & (g < 90) & (b < 100) & (diff > 45)
    key = (white | red) & logo
    near = np.asarray(Image.fromarray((key * 255).astype('uint8')).filter(ImageFilter.MaxFilter(7))) > 0
    dark = (np.maximum(np.maximum(r, g), b) < 70) & near & logo & ~over
    strict = ((np.minimum(np.minimum(r, g), b) > 205) | ((r > 175) & (g < 70) & (b < 80))) & over & logo
    alpha = ((key & ~over) | dark | strict).astype(float)
    alpha = np.asarray(Image.fromarray((alpha * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))).astype(float) / 255
    # clean plate = painted background with the logo laid back on top
    soft = np.asarray(Image.fromarray((star * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(6))).astype(float)[..., None] / 255
    base = filled * soft + a * (1 - soft)
    la = (alpha * logo)[..., None]
    clean = base * (1 - la) + a * la
    clean_img = Image.fromarray(clean.clip(0, 255).astype('uint8'))
    alpha = alpha * 255
    rgba = np.dstack([a, alpha]).clip(0, 255).astype('uint8')
    lx0 = min(px(b, w, h)[0] for b in logos); ly0 = min(px(b, w, h)[1] for b in logos)
    lx1 = max(px(b, w, h)[2] for b in logos); ly1 = max(px(b, w, h)[3] for b in logos)
    Image.fromarray(rgba[ly0:ly1, lx0:lx1], 'RGBA').save(f'public/covers/{cid}-logo.png', optimize=True)
    im.save(f'public/covers/{cid}.jpg', quality=90)
    clean_img.save(f'public/covers/{cid}-clean.jpg', quality=90)
    meta[cid] = {'w': w, 'h': h, 'logo': [lx0, ly0, lx1, ly1], 'badges': [list(px(b, w, h)) for b in badges]}
    print(cid, w, h)
json.dump(meta, open('src/templates/covers-meta.json', 'w'))
