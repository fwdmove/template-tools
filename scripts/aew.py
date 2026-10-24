"""Builds the AEW "is All Elite" template backgrounds from the source graphic.

Writes public/rosters/aew.jpg (original) and aew-clean.jpg: a brick wall tiled from the clean
top band of the original, with the AEW logo (keyed out of the original) and brackets put back.
Usage: python3 -I scripts/aew.py "/path/to/IS ALL ELITE.jpg"
"""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter

src = Image.open(sys.argv[1]).convert('RGB')
a = np.asarray(src).astype(float)
H, W = a.shape[:2]
PERIOD = 41  # two staggered brick courses
band = a[2:2 + PERIOD, 0:640]
rng = np.random.default_rng(7)
wall = np.zeros_like(a)
for i, y in enumerate(range(0, H, PERIOD)):
    strip = np.roll(band, int(rng.integers(0, 640)), axis=1)
    strip = np.concatenate([strip, strip[:, ::-1]], axis=1)[:, :W]
    wall[y:y + PERIOD] = strip[:H - y]
# match the original's darker edges
yy, xx = np.mgrid[0:H, 0:W]
d = ((xx - W / 2) / (W / 2)) ** 2 * 0.8 + ((yy - H / 2) / (H / 2)) ** 2 * 0.5
wall *= np.clip(1.05 - 0.45 * d, 0.45, 1.05)[..., None]
clean = Image.fromarray(wall.clip(0, 255).astype('uint8'))

# logo: bright (white/gold) pixels of the original, so its cracks show the wall through
lx0, ly0, lx1, ly1 = 125, 58, 505, 256
lum = a[..., :3].mean(axis=2)
alpha = np.clip((lum - 55) / 70, 0, 1)
logo = Image.fromarray(np.dstack([a, alpha * 255]).clip(0, 255).astype('uint8'), 'RGBA').crop((lx0, ly0, lx1, ly1))
clean = clean.convert('RGBA')
clean.alpha_composite(logo, (lx0, ly0))
dr = ImageDraw.Draw(clean)
for x0, x1, tx0, tx1 in ((38, 56, 38, 115), (968, 986, 909, 986)):
    dr.rectangle((x0, 49, x1, 534), fill='white')
    dr.rectangle((tx0, 49, tx1, 68), fill='white')
    dr.rectangle((tx0, 515, tx1, 534), fill='white')
clean.convert('RGB').save('public/rosters/aew-clean.jpg', quality=92)
src.save('public/rosters/aew.jpg', quality=92)
print('ok', W, H)
