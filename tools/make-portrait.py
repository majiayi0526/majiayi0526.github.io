#!/usr/bin/env python3
"""Build portrait.png (used in the home page hero) from photo.jpg.

The source is a formal ID photograph on a pure white ground. Dropped onto
the page as-is it reads as a document pasted over a design — the white
rectangle announces its own edges.

Rather than cut the subject out (segmentation eats the white collar, and
leaves a fringe in the hair), this does two simpler things:

  1. multiplies the whole image by  ivory / 255,  which maps the white
     ground to exactly the page background while keeping every other tone
     in proportion — skin shifts by a few percent and reads unchanged;
  2. fades the outer edge and, more generously, the lower third, so the
     shoulders dissolve into the paper instead of stopping at a border.

The page background must stay flat for this to work. A radial wash would
make the paper lighter in places than the portrait's own flat ivory, and
the rectangle would reappear.

    python3 tools/make-portrait.py

Requires: pillow, numpy.
"""
import numpy as np
from PIL import Image

IVORY = (245, 243, 238)          # keep in sync with --bg in styles/tokens.css
CROP = (25, 45, 905, 1275)       # head and shoulders, from the 930×1275 source
MAX_SIZE = (720, 1010)

src = Image.open("photo.jpg").convert("RGB").crop(CROP)
W, H = src.size

a = np.asarray(src).astype(np.float32) * (np.array(IVORY, np.float32) / 255.0)
tinted = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

yy, xx = np.mgrid[0:H, 0:W]
fade_x = np.clip(np.minimum(xx, W - 1 - xx) / (W * 0.09), 0, 1)
fade_t = np.clip(yy / (H * 0.07), 0, 1)
fade_b = np.clip((H - 1 - yy) / (H * 0.30), 0, 1)
alpha = (np.minimum(np.minimum(fade_x, fade_t), fade_b) ** 0.9 * 255).astype(np.uint8)

out = tinted.copy()
out.putalpha(Image.fromarray(alpha))
out.thumbnail(MAX_SIZE, Image.LANCZOS)

# WebP carries the alpha, so the portrait stays correct if the palette is
# ever swapped. A PNG of the same image is ~450 kB; this is ~27 kB.
out.save("portrait.webp", "WEBP", quality=86, method=6)

# Fallback for browsers without WebP: the same image flattened onto the
# page colour. Identical on the ivory palette, wrong on a dark one — but
# the browsers that need it are the ones that also predate the themes.
flat = Image.new("RGB", out.size, IVORY)
flat.paste(out, (0, 0), out)
flat.save("portrait.jpg", quality=88, optimize=True, progressive=True)

print(f"portrait.webp / portrait.jpg  {out.size[0]}×{out.size[1]}")
