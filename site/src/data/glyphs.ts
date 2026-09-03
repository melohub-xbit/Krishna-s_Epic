/**
 * THE GROUP GLYPHS.
 *
 * One emblem per skills group, drawn the way the project marks are —
 * procedurally, from what the group is, never from a logo. These are
 * rendered onto a circular dot matrix, so the same house rules apply
 * twice over: no hairlines, no fine detail, nothing thinner than the
 * cell pitch, because anything smaller than a dot simply is not there.
 *
 * Unlike the marks these carry no enclosing ring — the matrix itself is
 * the enclosure.
 */

export type GlyphPainter = (
  o: CanvasRenderingContext2D,
  w: number,
  h: number
) => void;

function pen(o: CanvasRenderingContext2D, w: number, k = 0.058) {
  o.lineCap = "round";
  o.lineJoin = "round";
  o.lineWidth = Math.max(2, w * k);
}

export const GLYPHS: Record<string, GlyphPainter> = {
  /* Everything here has to survive being redrawn on a 27-cell disc, which
     is about the resolution of an app icon on a very old phone. That means
     two or three thick elements each and nothing else — the first pass of
     these had four nested frames and they merged into a solid lump. */

  /** two angle brackets — the oldest picture of source there is */
  Languages: (o, w, h) => {
    pen(o, w, 0.085);
    o.beginPath();
    o.moveTo(w * 0.42, h * 0.28);
    o.lineTo(w * 0.22, h * 0.5);
    o.lineTo(w * 0.42, h * 0.72);
    o.moveTo(w * 0.58, h * 0.28);
    o.lineTo(w * 0.78, h * 0.5);
    o.lineTo(w * 0.58, h * 0.72);
    o.stroke();
  },

  /** one signal, crossing */
  "ML & signal": (o, w, h) => {
    pen(o, w, 0.095);
    o.beginPath();
    for (let x = w * 0.14; x <= w * 0.86; x += 1.5) {
      const t = (x - w * 0.14) / (w * 0.72);
      const y = h / 2 - Math.sin(t * Math.PI * 2) * h * 0.24;
      x === w * 0.14 ? o.moveTo(x, y) : o.lineTo(x, y);
    }
    o.stroke();
  },

  /** a store, drawn the way every database has been drawn since 1970 */
  "Backend & data": (o, w, h) => {
    pen(o, w, 0.08);
    o.beginPath();
    o.ellipse(w / 2, h * 0.3, w * 0.26, h * 0.09, 0, 0, Math.PI * 2);
    o.stroke();
    o.beginPath();
    o.moveTo(w * 0.24, h * 0.3);
    o.lineTo(w * 0.24, h * 0.7);
    o.moveTo(w * 0.76, h * 0.3);
    o.lineTo(w * 0.76, h * 0.7);
    o.stroke();
    o.beginPath();
    o.ellipse(w / 2, h * 0.7, w * 0.26, h * 0.09, 0, 0, Math.PI);
    o.stroke();
  },

  /** the box everything ships inside, divided in four */
  Platform: (o, w, h) => {
    pen(o, w, 0.08);
    o.strokeRect(w * 0.24, h * 0.24, w * 0.52, h * 0.52);
    o.beginPath();
    o.moveTo(w * 0.24, h * 0.5);
    o.lineTo(w * 0.76, h * 0.5);
    o.moveTo(w * 0.5, h * 0.24);
    o.lineTo(w * 0.5, h * 0.76);
    o.stroke();
  },

  /** a stack of them, read and shelved */
  Coursework: (o, w, h) => {
    const bar = h * 0.11;
    const rows: [number, number][] = [
      [0.22, 0.56],
      [0.16, 0.68],
      [0.26, 0.48],
    ];
    rows.forEach(([x, ww], i) => {
      o.fillRect(w * x, h * (0.28 + i * 0.18), w * ww, bar);
    });
  },
};

/** anything unnamed falls back to the divided box */
export function glyphFor(group: string): GlyphPainter {
  return GLYPHS[group] ?? GLYPHS.Platform;
}
