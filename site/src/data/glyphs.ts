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
  "ML/DL": (o, w, h) => {
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
  Backend: (o, w, h) => {
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
  "Tools and Frameworks": (o, w, h) => {
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
  /** a window with a divided pane — the only thing here you look AT */
  Frontend: (o, w, h) => {
    pen(o, w, 0.075);
    o.beginPath();
    o.rect(w * 0.24, h * 0.26, w * 0.52, h * 0.48);
    o.moveTo(w * 0.24, h * 0.42);
    o.lineTo(w * 0.76, h * 0.42);
    o.moveTo(w * 0.44, h * 0.42);
    o.lineTo(w * 0.44, h * 0.74);
    o.stroke();
  },

  /** a chip: the die, and the pins coming out of both sides */
  Systems: (o, w, h) => {
    pen(o, w, 0.075);
    o.strokeRect(w * 0.28, h * 0.28, w * 0.44, h * 0.44);
    o.beginPath();
    [0.38, 0.5, 0.62].forEach((y) => {
      o.moveTo(w * 0.16, h * y);
      o.lineTo(w * 0.28, h * y);
      o.moveTo(w * 0.72, h * y);
      o.lineTo(w * 0.84, h * y);
    });
    o.stroke();
    o.beginPath();
    o.arc(w * 0.5, h * 0.5, w * 0.07, 0, Math.PI * 2);
    o.fill();
  },

  /** a fitted line through three points — the oldest picture of a model */
  "ML foundations": (o, w, h) => {
    pen(o, w, 0.07);
    o.beginPath();
    o.moveTo(w * 0.2, h * 0.72);
    o.lineTo(w * 0.8, h * 0.3);
    o.stroke();
    const r = w * 0.062;
    [
      [0.3, 0.56],
      [0.52, 0.58],
      [0.7, 0.34],
    ].forEach(([x, y]) => {
      o.beginPath();
      o.arc(w * x, h * y, r, 0, Math.PI * 2);
      o.fill();
    });
  },


  /* ── the M band ────────────────────────────────────────────
     Four more painters, same rules — these ride at 26px next to
     a station name rather than on the 27-cell disc, but they are
     drawn to the disc's tolerances anyway so they can move onto
     it later without being redrawn. */

  /** a film frame: the gate, and four sprocket holes down the sides */
  Movies: (o, w, h) => {
    pen(o, w, 0.075);
    o.strokeRect(w * 0.2, h * 0.22, w * 0.6, h * 0.56);
    o.beginPath();
    o.moveTo(w * 0.34, h * 0.22);
    o.lineTo(w * 0.34, h * 0.78);
    o.moveTo(w * 0.66, h * 0.22);
    o.lineTo(w * 0.66, h * 0.78);
    o.stroke();
    const r = w * 0.045;
    [0.34, 0.5, 0.66].forEach((y) => {
      o.beginPath();
      o.arc(w * 0.27, h * y, r, 0, Math.PI * 2);
      o.arc(w * 0.73, h * y, r, 0, Math.PI * 2);
      o.fill();
    });
  },

  /** a wheel — hub, rim, and two spokes; the same picture for either
      number of them */
  Motorhead: (o, w, h) => {
    pen(o, w, 0.08);
    o.beginPath();
    o.arc(w * 0.5, h * 0.5, w * 0.28, 0, Math.PI * 2);
    o.stroke();
    o.beginPath();
    o.arc(w * 0.5, h * 0.5, w * 0.09, 0, Math.PI * 2);
    o.fill();
    o.beginPath();
    o.moveTo(w * 0.5, h * 0.22);
    o.lineTo(w * 0.5, h * 0.78);
    o.moveTo(w * 0.22, h * 0.5);
    o.lineTo(w * 0.78, h * 0.5);
    o.stroke();
  },

  /** a roof, and three under it */
  "Modern Family": (o, w, h) => {
    pen(o, w, 0.08);
    o.beginPath();
    o.moveTo(w * 0.16, h * 0.48);
    o.lineTo(w * 0.5, h * 0.2);
    o.lineTo(w * 0.84, h * 0.48);
    o.stroke();
    const r = w * 0.075;
    [0.28, 0.5, 0.72].forEach((x) => {
      o.beginPath();
      o.arc(w * x, h * 0.68, r, 0, Math.PI * 2);
      o.fill();
    });
  },

  /** three bars of a level meter, mid-song */
  Music: (o, w, h) => {
    const bw = w * 0.13;
    const cols: [number, number][] = [
      [0.26, 0.34],
      [0.5, 0.56],
      [0.74, 0.42],
    ];
    cols.forEach(([x, hh]) => {
      o.fillRect(w * x - bw / 2, h * (0.78 - hh), bw, h * hh);
    });
  },

  /** a set with rabbit ears — where every one of these was first seen */
  "Moving Pictures": (o, w, h) => {
    pen(o, w, 0.075);
    o.beginPath();
    o.moveTo(w * 0.36, h * 0.3);
    o.lineTo(w * 0.5, h * 0.44);
    o.lineTo(w * 0.64, h * 0.3);
    o.stroke();
    o.beginPath();
    o.roundRect
      ? o.roundRect(w * 0.18, h * 0.44, w * 0.64, h * 0.34, w * 0.06)
      : o.rect(w * 0.18, h * 0.44, w * 0.64, h * 0.34);
    o.stroke();
    o.beginPath();
    o.arc(w * 0.5, h * 0.61, w * 0.07, 0, Math.PI * 2);
    o.fill();
  },

  /** a paw — pad and three toes, which is all that survives a dot grid */
  "Meows and Bows": (o, w, h) => {
    const r = w * 0.085;
    [
      [0.3, 0.4],
      [0.5, 0.32],
      [0.7, 0.4],
    ].forEach(([x, y]) => {
      o.beginPath();
      o.arc(w * x, h * y, r, 0, Math.PI * 2);
      o.fill();
    });
    o.beginPath();
    o.ellipse(w * 0.5, h * 0.66, w * 0.2, h * 0.15, 0, 0, Math.PI * 2);
    o.fill();
  },
};

/** anything unnamed falls back to the divided box */
export function glyphFor(group: string): GlyphPainter {
  return GLYPHS[group] ?? GLYPHS.Languages;
}
