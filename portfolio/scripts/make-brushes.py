"""
Generate the sumi-e brush alpha masks for the portfolio's ink language.
Spec: masterplan/02-japanese-layer.md 2.8 + 08-implementation-guide.md 8.5.

WHAT THESE ARE. Not stroke silhouettes -- TEXTURES. inkDraw puts the whole
drawn SVG group inside a <mask> containing one of these, so the texture
modulates the alpha of every stroke passing under it. That is what makes a
Telugu akshara, an enso and a panel border all look drawn by the same hand.
A silhouette would only work for one stroke shape; a texture works for any.

ORIENTATION. Features are anisotropic about +X, and that anisotropy is what
separates "brush" from "dirty paper".

A KNOWN, ACCEPTED LIMITATION: the mask has ONE fixed orientation, but strokes
travel in every direction. A stroke running along X gets streaks parallel to
its travel (ideal); a stroke running along Y gets the hairs crossing it as
fine banding instead. Per-path rotated masks would fix it, but 08 8.5
specifies one mask per brush id over the whole group, and the cross-banding
reads acceptably as ink-density variation rather than as an error -- verified
on an enso, where the left and right arcs are pure cross-grain. Do not
"fix" this by cranking hair contrast; that makes the banding read as rungs.
If it ever needs solving properly, the answer is per-path masks, not a
different texture.

  - A hair's ink load changes SLOWLY as it travels (low frequency along X)
    but each hair is INDEPENDENT of its neighbours (high frequency along Y).
    Getting this backwards -- which is easy, and which the first version of
    this file did -- yields fine vertical hairlines and reads as scanner
    noise or a bad JPEG. If the output ever looks like grey static, this
    axis is why.
  - Dry-brush skips are ELONGATED along X. The brush is running out of ink
    while moving, so a skip is a streak, never a dot. Round gaussian voids
    read as bokeh smudges.
  - Ink pooling swells along the stroke, so it is elongated too.

Deliberately NOT doing per-element random jitter: PROJECT-STATUS 4 records
that hash-jitter on the chakra flames "reads as sloppiness". Same principle
here -- the variation is structured (hairs, skips, pools), never per-pixel.
"""
import numpy as np
from PIL import Image, ImageFilter
import os, sys

SIZE = 512
OUT = sys.argv[1] if len(sys.argv) > 1 else "brushes"
os.makedirs(OUT, exist_ok=True)


def _up(a, size=SIZE):
    """Bicubic-upsample a small float lattice to the full mask."""
    a = np.clip(a, 0.0, 1.0)
    img = Image.fromarray((a * 255).astype(np.uint8), mode="L")
    return np.asarray(img.resize((size, size), Image.BICUBIC), dtype=np.float32) / 255.0


def hairs(rng, n_hairs, along, contrast):
    """The bundle of bristles. THE defining feature -- get this right first.

    Shape (n_hairs, along): one row per hair, `along` control points down the
    stroke. `along` is deliberately small (12-28) so each hair's ink load
    drifts gradually over the travel. Upsampling stretches rows into parallel
    horizontal bands -- hairs cannot cross, exactly as in a real brush.
    """
    lattice = rng.random((n_hairs, along)).astype(np.float32)
    field = _up(lattice)
    return 1.0 - (1.0 - field) * contrast


def hair_gaps(rng, n_gaps, depth):
    """Dark lines where two bristles separate.

    Positions are RANDOM, not evenly spaced. Evenly spaced gaps read as a
    printed rule pattern -- the eye locks onto the regular pitch instantly.
    Each gap also fades along the stroke rather than running edge to edge,
    because bristles splay apart and close again as the brush travels.
    """
    field = np.ones((SIZE, SIZE), dtype=np.float32)
    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    for _ in range(n_gaps):
        cy = rng.random() * SIZE
        w = 1.2 + 2.4 * rng.random()
        # where along the stroke this gap is open, and how wide that span is
        cx = rng.random() * SIZE
        span = SIZE * (0.30 + 0.70 * rng.random())
        across = np.exp(-((yy - cy) / w) ** 2)
        along = np.exp(-(((xx - cx) / span) ** 2) * 1.4)
        field *= 1.0 - depth * (0.5 + 0.5 * rng.random()) * across * along
    return np.clip(field, 0.0, 1.0)


def skips(rng, count, length, thickness, bias, strength):
    """Dry-brush breakup: streaks where the ink has run out.

    Elongated on X (length >> thickness) and biased toward the exit end,
    because a brush runs dry as it travels, never at the entry.
    """
    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    field = np.ones((SIZE, SIZE), dtype=np.float32)
    for _ in range(count):
        cx = SIZE * (rng.random() ** (1.0 - bias * 0.7))
        cy = rng.random() * SIZE
        lx = length * (0.4 + 1.2 * rng.random())
        ly = thickness * (0.5 + 1.0 * rng.random())
        d = ((xx - cx) / lx) ** 2 + ((yy - cy) / ly) ** 2
        field *= 1.0 - np.exp(-d * 2.2) * strength * (0.5 + 0.5 * rng.random())
    return np.clip(field, 0.0, 1.0)


def pools(rng, res_along, res_across, amount):
    """Low-frequency ink swell, elongated along the stroke."""
    lattice = rng.random((res_across, res_along)).astype(np.float32)
    return (1.0 - amount) + amount * _up(lattice)


def make(seed, n_hairs, along, contrast, n_gaps, gap_depth, n_skips, skip_len,
         skip_thick, bias, skip_strength, pool_amt, floor):
    rng = np.random.default_rng(seed)

    m = hairs(rng, n_hairs, along, contrast)
    m *= hair_gaps(rng, n_gaps, gap_depth)
    m *= pools(rng, 7, 4, pool_amt)
    m *= skips(rng, n_skips, skip_len, skip_thick, bias, skip_strength)
    # Paper tooth, barely there. This is the first knob to turn DOWN if the
    # output starts reading as static rather than ink.
    m *= 0.97 + 0.03 * _up(rng.random((64, 64)).astype(np.float32))

    # Floor keeps the stroke's core intact. Without it a skip can punch a
    # stroke out entirely and a letterform loses a limb.
    m = floor + (1.0 - floor) * np.clip(m, 0.0, 1.0)

    img = Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8), mode="L")
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))

    # Emit RGBA: solid white with the mask carried in the ALPHA channel.
    #
    # inkDraw applies these with CSS `mask-image`, whose default `mask-mode`
    # is `alpha`. A plain greyscale PNG has no alpha, so every pixel reads as
    # fully opaque and the mask does nothing at all -- a silent no-op that
    # looks like "the texture isn't working". The alternative is
    # `mask-mode: luminance`, which has patchier support than simply baking
    # the alpha here. White RGB costs nothing: it compresses flat.
    a = img
    rgb = Image.new("RGB", a.size, (255, 255, 255))
    out = rgb.convert("RGBA")
    out.putalpha(a)
    return out


# Six brushes, ordered wet -> dry. inkDraw's `brush` option indexes these 1-6.
# 1-2 carry the most ink (titles, the hanko); 5-6 are ragged (accents, tails).
#
# TUNE AGAINST STROKES, NOT THE FLAT MASK. Viewed flat at full size these
# textures look like grey static and the temptation is to cut hair counts
# hard. That is a trap: a 4-13px stroke samples a narrow slice, so what the
# eye actually gets is far coarser than the mask appears. Hair counts were
# swept at 14 / 40 / 90 / 170 against a test enso -- 14 gave a smooth
# airbrush fade with no bristle at all, 170 went noisy, ~90 is the knee.
#
# Hair count also RISES with dryness: a loaded brush floods the gaps between
# hairs so few show, while a spent one splays and every hair marks separately.
PRESETS = [
    # seed, hairs, along, contrast, gaps, gapDepth, skips, len, thick, bias, strength, pool, floor
    (11, 58, 16, 0.16, 3, 0.18, 3, 150, 11, 0.55, 0.34, 0.12, 0.66),  # 1 loaded
    (23, 68, 18, 0.20, 5, 0.23, 5, 132, 10, 0.62, 0.44, 0.15, 0.58),  # 2 body
    (37, 80, 20, 0.25, 7, 0.28, 8, 116, 9, 0.68, 0.54, 0.18, 0.50),   # 3 workhorse
    (53, 92, 23, 0.30, 9, 0.33, 11, 100, 8, 0.74, 0.63, 0.21, 0.42),  # 4 separated
    (71, 106, 26, 0.35, 12, 0.38, 15, 86, 8, 0.80, 0.71, 0.24, 0.35),  # 5 dry
    (89, 122, 30, 0.41, 15, 0.44, 20, 74, 7, 0.86, 0.78, 0.27, 0.28),  # 6 spent
]

for i, p in enumerate(PRESETS, start=1):
    out = os.path.join(OUT, f"brush-{i}.png")
    make(*p).save(out, optimize=True)
    print(f"brush-{i}.png  {os.path.getsize(out) // 1024} KB")
