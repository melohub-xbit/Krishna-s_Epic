"""
Lay the four shaped clusters into a tensho grid and bake the transforms,
emitting plain SVG path data for the React component.

Transforms are baked here rather than applied as SVG transform attributes so
the component ships literal path data: no runtime matrix maths, nothing for
the server and client to disagree about, and the paths can be fed straight to
inkDraw later if the seal ever needs to draw itself.
"""
import json
import math
import numpy
import uharfbuzz as hb
import pathops
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

FONT = "/tmp/telugu700.ttf"
# Reading order is Telugu's own: left-to-right, top row then bottom. A
# Japanese seal would run top-right down then left, but the letterforms here
# are Telugu and forcing them into a foreign reading order would be
# illegible to the only people who can actually read them. We borrow the
# tensho GRID, not its reading direction.
CLUSTERS = ["వె", "లి", "దం", "డ"]

VB = 100.0          # viewBox
FIELD = (3.0, 97.0)  # the red square
GLYPH_AREA = (12.0, 88.0)
# Gutter in FONT units (em = 1000), not viewBox units. It has to be font units
# because the layout is measured in font units and only scaled afterwards —
# mixing the two silently inflated the gutter to ~36% of the block and left
# the seal looking airy, which is the one thing a seal must never look.
# 90/1000 ≈ a tenth of an em: enough to separate aksharas, tight enough that
# the four read as one carved block.
GUTTER_FU = 90.0
# Tensho packs characters edge to edge. Cap the non-uniform stretch: filling
# the cell exactly would distort Telugu badly, and past ~1.3 the letterforms
# stop being Telugu and start being a typeface crime.
MAX_ASPECT_DISTORT = 1.28
FILL = 0.99

# --- Stroke crossings -------------------------------------------------------
# [REVISED 2026-07-21 — Krishna] `livoweltelu` (లి) is ONE closed contour: the ి
# and the ల are not separate glyphs, so there is nothing to nudge or re-offset.
# At 700 weight the vowel loop runs into ల's shoulder and the two fuse into a
# blob — the gunintam stops reading as a gunintam. Compare వె in the same seal,
# where a clear gap separates ె from వ; that gap is what the eye uses to parse
# the mark, and లి had none.
#
# WHAT THIS IS NOT. Two earlier attempts were rejected, and both failed the same
# way — they treated the fix as *adding a separation* to a merged shape:
#   1. A hand-placed straight slot. Wrong orientation, and unfixably so: the
#      boundary between two strokes is a curve, so a bar at any guessed angle
#      reads as a scratch across ల.
#   2. A cut following ల's shoulder — the UNDER stroke's edge. Right that it was
#      a curve, wrong curve. Following the buried stroke makes ల look nicked.
#
# WHAT IT IS. The separation belongs to the STROKE, not to the gap. The ి is a
# ring laid over ల, so it should stay a whole ring and ల should give way where
# the ring crosses it — the way two brush strokes read when one is laid over the
# other. The demarcation is then the OVER stroke's own edge, and no separation
# is being "added" at all: it is what one continuous stroke crossing another
# looks like.
#
# The ring is measured, not assumed. Least-squares circle fit to the outer
# silhouette points inside SAMPLE gives centre ≈(366.5, 562.0), r ≈155.3 with a
# mean residual of 2.6 units — the loop really is a circle, to well under the
# cut width, so continuing it through ల is reconstruction, not invention. The
# cut is that circle, band-widened, intersected with the under glyph so it only
# bites where the two actually cross. Nothing is hand-placed and no control
# point of either outline moves.
#
# This is what 02 §2.1 licenses: a carver keeps each stroke whole and lets the
# lower one break, because ink bleed closes any gap narrower than the blade.
#
# Geometry is in FONT units, applied before the layout transform, so it scales
# with the glyph. The cut is interior, so the cluster bbox — and therefore the
# 3.77:1 viewBox — is unchanged.
#
# WIDTH: 26 font units (≈2.5 at seal scale). 20 is too faint to survive the
# displacement filter; 32 starts eating ల's shoulder rather than parting it.
CROSSINGS = {
    "livoweltelu": {
        "under": "latelu",   # the consonant the vowel ring is laid over
        "width": 26.0,
        # Outer-silhouette window to fit the ring in: x < 440 and y > 500 is the
        # ring's free left arc, clear of ల and of both eye counters.
        "sample": (440.0, 500.0),
    },
}


def _p(gname):
    p = pathops.Path()
    gs[gname].draw(p.getPen())
    return p


def _op(name, a, b):
    o = pathops.Path()
    getattr(pathops, name)([a], [b], o.getPen())
    return o


class _Flatten(BasePen):
    """Outline → point cloud, for fitting. Curves sampled at 30 steps."""

    def __init__(self):
        BasePen.__init__(self, None)
        self.pts = []
        self._cur = None

    def _moveTo(self, pt):
        self._cur = pt
        self.pts.append(pt)

    def _lineTo(self, pt):
        self.pts.append(pt)
        self._cur = pt

    def _curveToOne(self, a, b, c):
        x0, y0 = self._cur
        for i in range(1, 31):
            t = i / 30.0
            u = 1.0 - t
            self.pts.append((
                u ** 3 * x0 + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t ** 3 * c[0],
                u ** 3 * y0 + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t ** 3 * c[1],
            ))
        self._cur = c

    def _closePath(self):
        pass


def fit_ring(gname, sample):
    """Least-squares circle through the over-stroke's free outer arc."""
    simplified = _p(gname)
    simplified.simplify()          # self-intersecting contour → real contours
    outer = list(simplified.contours)[0]   # largest = the silhouette
    flat = _Flatten()
    outer.draw(flat)
    max_x, min_y = sample
    pts = [(x, y) for x, y in flat.pts if x < max_x and y > min_y]
    if len(pts) < 24:
        raise SystemExit(f"{gname}: only {len(pts)} sample points — check SAMPLE")

    # Algebraic (Kåsa) fit: x² + y² = 2ax + 2by + c, solved linearly.
    a_rows = [[2 * x, 2 * y, 1.0] for x, y in pts]
    rhs = [x * x + y * y for x, y in pts]
    (cx, cy, c), *_ = numpy.linalg.lstsq(numpy.array(a_rows), numpy.array(rhs),
                                         rcond=None)
    r = math.sqrt(c + cx * cx + cy * cy)
    resid = [abs(math.hypot(x - cx, y - cy) - r) for x, y in pts]
    mean_res = sum(resid) / len(resid)
    print(f"  ring fit {gname}: centre ({cx:.1f}, {cy:.1f}) r {r:.1f} "
          f"residual mean {mean_res:.2f} max {max(resid):.2f}")
    # If the arc is not really a circle the whole premise is wrong — a bad fit
    # would put the cut somewhere the stroke never went.
    if mean_res > 6.0:
        raise SystemExit(f"{gname}: ring fit too loose ({mean_res:.2f}) — "
                         "the over-stroke is not circular; do not cut blind.")
    return cx, cy, r


def _circle(cx, cy, r):
    k = r * 0.55228475  # circle-to-cubic constant
    p = pathops.Path()
    pen = p.getPen()
    pen.moveTo((cx + r, cy))
    pen.curveTo((cx + r, cy + k), (cx + k, cy + r), (cx, cy + r))
    pen.curveTo((cx - k, cy + r), (cx - r, cy + k), (cx - r, cy))
    pen.curveTo((cx - r, cy - k), (cx - k, cy - r), (cx, cy - r))
    pen.curveTo((cx + k, cy - r), (cx + r, cy - k), (cx + r, cy))
    pen.closePath()
    return p


def crossing_cut(gname, spec):
    """The over-stroke's ring, widened, where it crosses the under stroke."""
    cx, cy, r = fit_ring(gname, spec["sample"])
    w = spec["width"] / 2.0
    band = _op("difference", _circle(cx, cy, r + w), _circle(cx, cy, r - w))
    # ∩ under glyph: the ring only breaks what it actually crosses, so there is
    # no hand-tuned bounding box anywhere in this.
    return _op("intersection", band, _p(spec["under"]))


def draw_carved(gname, out_pen):
    """Draw a glyph, parted where a stroke crosses another."""
    if gname not in CROSSINGS:
        gs[gname].draw(out_pen)
        return
    _op("difference", _p(gname),
        crossing_cut(gname, CROSSINGS[gname])).draw(out_pen)

with open(FONT, "rb") as fh:
    data = fh.read()
face = hb.Face(data)
hbfont = hb.Font(face)
tt = TTFont(FONT)
order = tt.getGlyphOrder()
gs = tt.getGlyphSet()


def shape(text):
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    buf.direction, buf.script, buf.language = "ltr", "telu", "te"
    hb.shape(hbfont, buf, {"kern": True, "liga": True})
    return list(zip(buf.glyph_infos, buf.glyph_positions))


def cluster_geometry(text):
    """Glyph draw-calls plus the combined bbox, in font units."""
    parts, x = [], 0
    bounds = None
    for info, pos in shape(text):
        gname = order[info.codepoint]
        ox, oy = x + pos.x_offset, pos.y_offset
        bp = BoundsPen(gs)
        gs[gname].draw(bp)
        if bp.bounds:
            x0, y0, x1, y1 = bp.bounds
            b = (x0 + ox, y0 + oy, x1 + ox, y1 + oy)
            bounds = b if bounds is None else (
                min(bounds[0], b[0]), min(bounds[1], b[1]),
                max(bounds[2], b[2]), max(bounds[3], b[3]),
            )
            parts.append((gname, ox, oy))
        x += pos.x_advance
    return parts, bounds


# SINGLE ROW — a rectangular nameplate seal, not a 2x2 square.
# [REVISED 2026-07-20 — Krishna] Four aksharas on one line.
#
# ONE scale for all four clusters, columns sized to their content. Scaling
# each cluster to fill an identical cell — the obvious first approach — looks
# broken, and the reason is worth recording: దం is TWO glyphs (base plus
# anusvara) and so is ~1.7x the width of a single akshara. Forcing it into an
# equal cell squashed it to 0.027 while వె and లి sat at 0.048, and the seal
# read as one heavy group beside a crushed one. Stroke weight is what the eye
# compares across a seal, and stroke weight scales with the glyph, so unequal
# scales are immediately visible as an error. A real tensho carver gives a
# complex character a WIDER column rather than shrinking it.
geo = [cluster_geometry(cl) for cl in CLUSTERS]
dims = [(b[2] - b[0], b[3] - b[1]) for _, b in geo]

# Height drives the scale; the rectangle's width then follows from content.
# Deriving width from the aksharas (rather than forcing a chosen ratio) is what
# keeps the letterforms undistorted — the frame fits the name, not the reverse.
VH = 100.0                     # viewBox height
PAD_Y = 15.0                   # field edge → glyph, vertically
PAD_X = 13.0                   # field edge → glyph, horizontally
glyph_h = VH - 2 * PAD_Y

block_h = max(h for _, h in dims)
scale = glyph_h / block_h
block_w = sum(w for w, _ in dims) * scale + GUTTER_FU * scale * (len(CLUSTERS) - 1)
VW = block_w + 2 * PAD_X

out = []
x_cursor = PAD_X
for i, cl in enumerate(CLUSTERS):
    parts, (x0, y0, x1, y1) = geo[i]
    gw, gh = dims[i]
    # Sit every cluster on a shared bottom line so ascenders vary naturally,
    # as they do in written Telugu. Vertical centring makes short aksharas
    # float and breaks the line the eye reads along.
    oy = PAD_Y + (glyph_h - gh * scale)
    t = Transform(scale, 0, 0, -scale, x_cursor - x0 * scale, oy + y1 * scale)
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}")
    for gname, gx, gy in parts:
        tp = TransformPen(pen, t.transform(Transform(1, 0, 0, 1, gx, gy)))
        draw_carved(gname, tp)
    out.append({"cluster": cl, "d": pen.getCommands()})
    x_cursor += gw * scale + GUTTER_FU * scale

print(f"uniform scale {scale:.4f}  viewBox 0 0 {VW:.1f} {VH:.0f}  ratio {VW/VH:.2f}:1")
for o in out:
    print(f"  {o['cluster']}: {len(o['d'])} chars")

with open("/tmp/seal_paths.json", "w") as fh:
    json.dump({"vw": round(VW, 1), "vh": VH, "paths": out}, fh, ensure_ascii=False)
print("total path chars:", sum(len(o["d"]) for o in out))
