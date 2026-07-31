"""
Shape వెలిదండ and emit real glyph outlines for the tensho seal.

Why HarfBuzz and not an SVG <text> element:
  - Telugu is a complex script. వెలిదండ is 7 codepoints that shape into 4
    visual clusters (వె | లి | దం | డ), with vowel signs that reposition and
    an anusvara that sits above. Only a real shaper gets this right.
  - <text> would also mean the seal depends on a webfont at paint time, and
    it cannot be stroke-drawn, squared toward tensho proportions, or given
    per-akshara treatment. Outlines can.

Tensho (seal script) is Chinese/Japanese and has no Telugu tradition, so this
is a fusion, not a reproduction. What is borrowed is the ARRANGEMENT logic:
  - characters fill their cell edge to edge, near-zero internal whitespace
  - proportions squared and vertically stretched to fit the square
  - the grid is regular; the seal reads as a block, not a word
Telugu letterforms themselves are untouched. That split matters: borrowing
the layout grammar is homage, redrawing the script would be counterfeit.
"""
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import json

FONT = "/tmp/telugu700.ttf"
CLUSTERS = ["వె", "లి", "దం", "డ"]

with open(FONT, "rb") as fh:
    data = fh.read()
face = hb.Face(data)
font = hb.Font(face)
upem = face.upem
tt = TTFont(FONT)
glyf_order = tt.getGlyphOrder()
gs = tt.getGlyphSet()


def shape(text):
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    # Explicit is better: Telugu, LTR. guess_segment_properties usually gets
    # this, but a wrong guess silently produces unshaped output.
    buf.direction = "ltr"
    buf.script = "telu"
    buf.language = "te"
    hb.shape(font, buf, {"kern": True, "liga": True})
    return list(zip(buf.glyph_infos, buf.glyph_positions))


out = {}
for cl in CLUSTERS:
    runs = shape(cl)
    pen = SVGPathPen(gs)
    x = 0
    paths = []
    for info, pos in runs:
        gname = glyf_order[info.codepoint]
        sub = SVGPathPen(gs)
        gs[gname].draw(sub)
        d = sub.getCommands()
        if d:
            paths.append({
                "d": d,
                "dx": x + pos.x_offset,
                "dy": pos.y_offset,
                "glyph": gname,
            })
        x += pos.x_advance
    out[cl] = {"advance": x, "parts": paths}
    print(f"{cl}: {len(runs)} glyphs, advance {x}, "
          f"names={[glyf_order[i.codepoint] for i,_ in runs]}")

out["_upem"] = upem
with open("/tmp/seal_glyphs.json", "w") as fh:
    json.dump(out, fh)
print("upem", upem)
