"""Builds roster backgrounds from the source screenshots.

Writes public/rosters/<key>.jpg (original) and <key>-clean.jpg, where name text and
featured characters are painted out so replacements don't show the original underneath.
Usage: python3 -I scripts/rosters.py /path/to/Games
"""
import sys, numpy as np
from PIL import Image, ImageFilter

SRC = {
    'marvel': ('Lego Marvel.png', [('v', (660, 326, 1020, 372))]),
    'batman': ('LEGO Batman.webp', [('v', (580, 246, 700, 276))]),
    'indy': ('LEGO Indiana Jones.jpg', [('v', (520, 348, 762, 392))]),
    'starwars': ('LEGO Star Wars.webp', []),
    'hp': ('LEGO Harry Potter.jpg', [('v', (176, 124, 302, 145))]),
    'smash': ('Smash Bros.webp', [('v', (975, 528, 1135, 572)), ('h', (352, 468, 470, 566)), ('h', (650, 455, 805, 622))]),
    'wwe': ('WWE 2k15.jpg', [
        ('hb', (232, 18, 538, 303)), ('h', (262, 352, 478, 385)), ('h', (336, 307, 492, 333)), ('h', (336, 335, 372, 352)), ('c', (390, 333, 586, 351), (560, 322)),
        ('hb', (746, 20, 1060, 303)), ('h', (700, 352, 1060, 385)), ('h', (898, 336, 982, 354)),
    ]),
    'mua3': ('Marvel Ultimate Alliance 3.png', [('v', (110, 840, 500, 890)), ('v', (560, 840, 870, 890)), ('v', (975, 840, 1262, 890)), ('v', (1395, 840, 1650, 890))]),
}

def fill(a, mode, box, sample=None):
    x0, y0, x1, y1 = box
    if mode == 'c':
        a[y0:y1, x0:x1] = a[sample[1], sample[0]]
    elif mode == 'v':
        top, bot = a[y0 - 2, x0:x1].copy(), a[y1 + 1, x0:x1].copy()
        for y in range(y0, y1):
            t = (y - y0) / max(1, y1 - y0)
            a[y, x0:x1] = top * (1 - t) + bot * t
    else:
        left, right = a[y0:y1, x0 - 2].copy(), a[y0:y1, x1 + 1].copy()
        for x in range(x0, x1):
            t = (x - x0) / max(1, x1 - x0)
            a[y0:y1, x] = left * (1 - t) + right * t

out = 'public/rosters/'
for key, (name, regions) in SRC.items():
    im = Image.open(f'{sys.argv[1]}/{name}').convert('RGB')
    im.save(out + key + '.jpg', quality=92)
    a = np.asarray(im).astype(float).copy()
    for mode, box, *sample in regions:
        fill(a, mode[0], box, *sample)
    clean = Image.fromarray(a.clip(0, 255).astype('uint8'))
    blurred = clean.filter(ImageFilter.GaussianBlur(16))
    for mode, box, *_ in regions:
        if mode == 'hb':  # soft-edged blur so the fill reads as out-of-focus background
            mask = Image.new('L', clean.size, 0)
            mask.paste(255, (box[0] + 10, box[1] + 10, box[2] - 10, box[3] - 10))
            mask = mask.filter(ImageFilter.GaussianBlur(8))
            clean = Image.composite(blurred, clean, mask)
    clean.save(out + key + '-clean.jpg', quality=92)
    print(key, im.size)
