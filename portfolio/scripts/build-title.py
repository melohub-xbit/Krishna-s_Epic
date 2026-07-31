"""
కృష్ణ సాయి — the landing title, as filled aksharas plus the centreline the
brush travelled. Emits /tmp/title_paths.json for components/ink/TeluguTitle.tsx.

WHY THIS EXISTS AT ALL (08 §8.5 [REVISED], PROJECT-STATUS §4 item 13). Telugu
aksharas are TAPERED, so they cannot be stroke-drawn: a stroked path has one
constant width, so stroking the silhouette throws away the taper, and what you
watch is an outline being traced round the letter and back — "outlining a
shape", never "laying down ink". Tapered forms use the REVEAL MASK instead: the
akshara stays filled, and a hidden centreline is stroked white inside an SVG
<mask> at ≥ the letter's fattest point. DrawSVG animates that. So this script
has to produce TWO things per akshara — the silhouette, and the path a hand
would have taken to write it.

THE CENTRELINE IS MEASURED, NOT DRAWN. Hand-tracing 4 aksharas by eye would be
guesswork that no one can re-derive when the wordmark changes. Instead:

  1. Shape with HarfBuzz, group glyphs into aksharas by cluster index.
  2. Union each akshara's glyphs into one silhouette (the ణ vattu overlaps ష —
     union, or the seam shows through the reveal as a crease).
  3. Rasterise, skeletonise (medial axis). The skeleton IS the centreline: it is
     the locus of points equidistant from the edges, which is where the middle
     of the brush was.
  4. Skeleton → graph, chains between junctions as edges.
  5. Prune spurs shorter than the stroke width. Skeletonisation always throws
     little whiskers into convex corners; they are artefacts of the raster, not
     strokes, and drawing them makes the brush twitch.
  6. Each CONNECTED COMPONENT is one stroke — the places a hand lifts are
     exactly the places the glyph is not connected. Within a component, an
     Eulerian path covers every branch; odd-degree nodes are paired by shortest
     path first (Chinese-postman) so the walk retraces as little as possible.
  7. Start each walk at the topmost-leftmost endpoint, and order strokes
     top-to-bottom. That is 08 §8.5's rule: aksharas left→right, strokes within
     an akshara top-to-bottom.

STROKE ORDER CAVEAT worth knowing before "fixing" it: this orders by geometry,
so the talakattu (head stroke) comes first because it sits highest. Many Telugu
writers add the talakattu LAST. 08 §8.5 specifies top-to-bottom, so that is what
this does — if Krishna wants true pen order it is a per-akshara override table
here, not a change to the extraction.

Needs: uharfbuzz, fonttools, skia-pathops, scikit-image, scipy, networkx,
cairosvg, pillow, numpy — and /tmp/telugu700.ttf (PROJECT-STATUS §4: unpack it
from the vendored woff2, no download needed).
"""
import io
import json
import math

import cairosvg
import networkx as nx
import numpy
import pathops
import uharfbuzz as hb
from PIL import Image
from fontTools.misc.transform import Transform
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from scipy.ndimage import distance_transform_edt
from skimage.morphology import skeletonize

FONT = "/tmp/telugu700.ttf"
TEXT = "కృష్ణ సాయి"

# Raster scale for skeletonisation, in pixels per font unit. 0.35 puts each
# akshara around 350px tall: fine enough that the medial axis follows the curve
# rather than staircasing, cheap enough to run in a second. Below ~0.2 the
# skeleton of a thin joint breaks into pieces and the walk splits a stroke in
# two.
RASTER_SCALE = 0.35
RASTER_PAD = 8          # px, keeps the shape off the raster edge
SPUR_FACTOR = 1.1       # prune spurs shorter than 1.1 × the max stroke radius
SAMPLE_EVERY = 3        # keep every 3rd skeleton pixel before smoothing
SMOOTH_WINDOW = 7       # moving-average window over the sampled points
RDP_EPS = 1.6           # simplify tolerance, font units

VH = 100.0              # emitted viewBox height
PAD_Y = 5.0
PAD_X = 5.0

tt = TTFont(FONT)
gs = tt.getGlyphSet()
order = tt.getGlyphOrder()
hb_font = hb.Font(hb.Face(open(FONT, "rb").read()))


# --- shaping ----------------------------------------------------------------

def shape(text):
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    buf.direction, buf.script, buf.language = "ltr", "telu", "te"
    hb.shape(hb_font, buf, {"kern": True, "liga": True})
    return [
        (order[i.codepoint], i.cluster, p.x_offset, p.y_offset, p.x_advance)
        for i, p in zip(buf.glyph_infos, buf.glyph_positions)
    ]


def aksharas():
    """Shaped run → list of aksharas, each a list of (glyph, dx, dy).

    Grouped by HarfBuzz cluster index, which is the authoritative answer to
    "which glyphs are one akshara" — ష్ణ is two glyphs (base + subscript ణ) at
    one cluster, and must draw as a single letter.
    """
    out, x, cur = [], 0.0, None
    for gname, cluster, ox, oy, adv in shape(TEXT):
        if gname == "space":
            x += adv
            cur = None
            continue
        if cur is None or cur["cluster"] != cluster:
            cur = {"cluster": cluster, "glyphs": []}
            out.append(cur)
        cur["glyphs"].append((gname, x + ox, oy))
        x += adv
    return out


def silhouette(akshara):
    """Union of the akshara's glyphs, in font units."""
    total = pathops.Path()
    for gname, gx, gy in akshara["glyphs"]:
        part = pathops.Path()
        gs[gname].draw(TransformPen(pathops.PathPen(part, glyphSet=gs),
                                    Transform(1, 0, 0, 1, gx, gy)))
        merged = pathops.Path()
        pathops.union([total, part], merged.getPen())
        total = merged
    total.simplify()
    return total


# --- skeleton → strokes -----------------------------------------------------

def rasterise(d, bounds):
    x0, y0, x1, y1 = bounds
    w = int((x1 - x0) * RASTER_SCALE) + 2 * RASTER_PAD
    h = int((y1 - y0) * RASTER_SCALE) + 2 * RASTER_PAD
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
        f'viewBox="0 0 {w} {h}"><g transform="translate({RASTER_PAD},{RASTER_PAD}) '
        f'scale({RASTER_SCALE},{-RASTER_SCALE}) translate({-x0},{-y1})">'
        f'<path d="{d}" fill="#fff"/></g></svg>'
    )
    png = cairosvg.svg2png(bytestring=svg.encode())
    return numpy.array(Image.open(io.BytesIO(png)).convert("L")) > 128


def chain_graph(sk):
    """Skeleton bitmap → MultiGraph whose edges carry their pixel chains."""
    pts = {(int(y), int(x)) for y, x in zip(*numpy.nonzero(sk))}

    def nb(p):
        return [(p[0] + dy, p[1] + dx)
                for dy in (-1, 0, 1) for dx in (-1, 0, 1)
                if (dy or dx) and (p[0] + dy, p[1] + dx) in pts]

    nodes = {p for p in pts if len(nb(p)) != 2}
    if not nodes:                      # a pure loop has no junction: cut it
        nodes = {min(pts)}

    g = nx.MultiGraph()
    g.add_nodes_from(nodes)
    seen = set()
    for n in nodes:
        for first in nb(n):
            if (n, first) in seen:
                continue
            chain = [n, first]
            seen.add((n, first))
            prev, cur = n, first
            while cur not in nodes:
                nxt = [q for q in nb(cur) if q != prev]
                if not nxt:
                    break
                prev, cur = cur, nxt[0]
                chain.append(cur)
            seen.add((chain[-1], chain[-2]))
            g.add_edge(chain[0], chain[-1], pts=chain, length=len(chain))
    return g


def prune_spurs(g, min_len):
    """Drop dead-end twigs. Skeletonisation grows them at every convex corner."""
    changed = True
    while changed:
        changed = False
        for n in list(g.nodes):
            if g.degree(n) == 1:
                u, v, k = list(g.edges(n, keys=True))[0]
                if g.edges[u, v, k]["length"] < min_len:
                    g.remove_edge(u, v, k)
                    changed = True
        g.remove_nodes_from([n for n in list(g.nodes) if g.degree(n) == 0])
    return g


def eulerise(g):
    """Duplicate the fewest edges needed for an Euler path (Chinese postman).

    Without this the walk simply cannot cover a letter with more than two
    junction ends, and every uncovered branch is a piece of the akshara that
    the reveal never uncovers — a visible hole at the end of the animation.
    """
    if g.number_of_edges() == 0:
        return g
    odd = [n for n in g.nodes if g.degree(n) % 2]
    if len(odd) <= 2:
        return g
    # Keep the two extreme odd nodes as the open ends; pair the rest off.
    extremes = sorted(odd)
    keep = {extremes[0], extremes[-1]}
    rest = [n for n in odd if n not in keep]

    simple = nx.Graph(g)
    dist = dict(nx.all_pairs_dijkstra_path_length(simple, weight="length"))
    w = nx.Graph()
    for i, a in enumerate(rest):
        for b in rest[i + 1:]:
            if b in dist.get(a, {}):
                w.add_edge(a, b, weight=dist[a][b])
    for a, b in nx.min_weight_matching(w):
        path = nx.shortest_path(simple, a, b, weight="length")
        for u, v in zip(path, path[1:]):
            k = min(g[u][v], key=lambda k: g[u][v][k]["length"])
            g.add_edge(u, v, **g[u][v][k])
    return g


def walk(g):
    """Euler path starting at the topmost-leftmost end — where a hand starts."""
    if g.number_of_edges() == 0:
        return []
    odd = [n for n in g.nodes if g.degree(n) % 2]
    start = sorted(odd or g.nodes)[0]
    out = []
    for u, v, k in nx.eulerian_path(g, source=start, keys=True):
        pts = g.edges[u, v, k]["pts"]
        if pts[0] != u:
            pts = pts[::-1]
        out.extend(pts if not out else pts[1:])
    return out


def strokes(sk, min_len):
    """One continuous polyline per connected component, top-to-bottom."""
    g = chain_graph(sk)
    out = []
    for comp in nx.connected_components(nx.Graph(g)):
        h = nx.MultiGraph()
        h.add_nodes_from(comp)
        for u, v, k, data in g.edges(keys=True, data=True):
            if u in comp:
                h.add_edge(u, v, **data)
        h = prune_spurs(h, min_len)
        if h.number_of_edges() == 0:
            continue
        path = walk(eulerise(h))
        if len(path) > 2:
            out.append(path)
    out.sort(key=lambda w: (w[0][0], w[0][1]))
    return out


# --- polyline cleanup -------------------------------------------------------

def smooth(pts, window):
    """Moving average. The skeleton is pixel-quantised and staircases without."""
    if len(pts) < window:
        return pts
    half = window // 2
    out = []
    for i in range(len(pts)):
        lo, hi = max(0, i - half), min(len(pts), i + half + 1)
        seg = pts[lo:hi]
        out.append((sum(p[0] for p in seg) / len(seg),
                    sum(p[1] for p in seg) / len(seg)))
    # Endpoints must not drift inward or the stroke starts/stops short of the
    # letter, which the reveal shows as an un-inked tip.
    out[0], out[-1] = pts[0], pts[-1]
    return out


def rdp(pts, eps):
    """Ramer–Douglas–Peucker. Cuts point count ~10× with no visible change."""
    if len(pts) < 3:
        return pts
    (x0, y0), (x1, y1) = pts[0], pts[-1]
    dx, dy = x1 - x0, y1 - y0
    norm = math.hypot(dx, dy)
    worst, idx = -1.0, 0
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        d = (abs(dy * px - dx * py + x1 * y0 - y1 * x0) / norm if norm
             else math.hypot(px - x0, py - y0))
        if d > worst:
            worst, idx = d, i
    if worst <= eps:
        return [pts[0], pts[-1]]
    return rdp(pts[:idx + 1], eps)[:-1] + rdp(pts[idx:], eps)


# --- build ------------------------------------------------------------------

def main():
    items = aksharas()
    for a in items:
        a["path"] = silhouette(a)
        a["d_font"] = _d(a["path"])
        a["bounds"] = a["path"].bounds

    x0 = min(a["bounds"][0] for a in items)
    y0 = min(a["bounds"][1] for a in items)
    x1 = max(a["bounds"][2] for a in items)
    y1 = max(a["bounds"][3] for a in items)
    scale = (VH - 2 * PAD_Y) / (y1 - y0)
    vw = (x1 - x0) * scale + 2 * PAD_X
    # Font units are y-up, SVG is y-down.
    to_view = Transform(scale, 0, 0, -scale, PAD_X - x0 * scale,
                        VH - PAD_Y + y0 * scale)

    out = []
    max_reveal = 0.0
    for a in items:
        b = a["bounds"]
        mask = rasterise(a["d_font"], b)
        radius = distance_transform_edt(mask).max()          # px
        lines = strokes(skeletonize(mask), radius * SPUR_FACTOR)

        # px → font units → view units, in one step.
        def back(p):
            fx = b[0] + (p[1] - RASTER_PAD) / RASTER_SCALE
            fy = b[3] - (p[0] - RASTER_PAD) / RASTER_SCALE
            return to_view.transformPoint((fx, fy))

        centrelines = []
        for line in lines:
            pts = [back(p) for p in line[::SAMPLE_EVERY]]
            if line[-1] != line[::SAMPLE_EVERY][-1]:
                pts.append(back(line[-1]))
            pts = rdp(smooth(pts, SMOOTH_WINDOW), RDP_EPS)
            centrelines.append(
                "M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in pts))

        pen = SVGPathPen(None, ntos=lambda v: f"{v:.2f}")
        a["path"].transform(*to_view).draw(pen)

        # The mask stroke has to be at least as wide as the fattest part of the
        # letter, or the reveal clips the letter's own edges as it travels.
        reveal = (radius * 2 / RASTER_SCALE) * scale + 1.5
        max_reveal = max(max_reveal, reveal)
        out.append({
            "cluster": a["cluster"],
            "glyphs": [g[0] for g in a["glyphs"]],
            "d": pen.getCommands(),
            "centrelines": centrelines,
            "reveal": round(reveal, 2),
        })
        print(f"  akshara {a['cluster']:>2} {'+'.join(g[0] for g in a['glyphs']):<40} "
              f"{len(centrelines)} stroke(s), reveal {reveal:.1f}")

    payload = {"vw": round(vw, 1), "vh": VH, "text": TEXT,
               "maxReveal": round(max_reveal, 2), "aksharas": out}
    with open("/tmp/title_paths.json", "w") as fh:
        json.dump(payload, fh, ensure_ascii=False)
    print(f"viewBox 0 0 {vw:.1f} {VH:.0f}  ratio {vw / VH:.2f}:1  "
          f"{len(out)} aksharas")


def _d(path):
    pen = SVGPathPen(None)
    path.draw(pen)
    return pen.getCommands()


if __name__ == "__main__":
    main()
