/**
 * THE MARKS.
 *
 * One circular emblem per project, drawn from what the project actually
 * does — never from a logo. They are procedural so they inherit the
 * palette and stay sharp at any size.
 *
 * House rules (keep them, or the set stops reading as a family):
 *   1. Everything sits inside one ring of the same weight.
 *   2. No hairlines and no fine detail — these render as dots, and
 *      anything thinner than the dot pitch disappears.
 *   3. Interior strokes are one weight, lighter than the ring.
 *   4. Keep the blazon comment above each one, so the meaning survives
 *      somebody editing the coordinates.
 */

export type MarkPainter = (
  o: CanvasRenderingContext2D,
  w: number,
  h: number
) => void;

/** The enclosure every mark sits in. Returns the working geometry. */
function ring(o: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.4;
  o.lineCap = "round";
  o.lineJoin = "round";
  o.lineWidth = Math.max(1.4, w * 0.055);
  o.beginPath();
  o.arc(cx, cy, R, 0, Math.PI * 2);
  o.stroke();
  o.lineWidth = Math.max(1.2, w * 0.045);
  return { cx, cy, R };
}

const line = (
  o: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  o.beginPath();
  o.moveTo(x1, y1);
  o.lineTo(x2, y2);
  o.stroke();
};

const circle = (
  o: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fill = false
) => {
  o.beginPath();
  o.arc(x, y, r, 0, Math.PI * 2);
  fill ? o.fill() : o.stroke();
};

export const MARKS = {
  /** fallback — the bare enclosure */
  ring: (o, w, h) => {
    ring(o, w, h);
  },

  /* ── research ─────────────────────────────────────────── */

  /** DALSP — a tree with one side pruned back to stubs */
  tree: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    line(o, cx, cy + R * 0.5, cx, cy - R * 0.55);
    for (let i = 0; i < 3; i++) {
      const y = cy + R * 0.2 - i * R * 0.32;
      line(o, cx, y, cx - R * 0.44, y - R * 0.24);
      line(o, cx, y, cx + R * 0.17, y - R * 0.09); // pruned: stubs
    }
  },

  /** RACS — a needle between a full bloom and a closed bud */
  compass: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    circle(o, cx - R * 0.4, cy + R * 0.18, R * 0.24);
    circle(o, cx + R * 0.42, cy + R * 0.18, R * 0.1);
    line(o, cx - R * 0.3, cy + R * 0.4, cx + R * 0.28, cy - R * 0.42);
  },

  /** EEG · ECG — two waves crossing, never touching */
  wave: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    o.beginPath();
    for (let x = -R * 0.72; x <= R * 0.72; x += 1) {
      const y = cy + Math.sin(x * 0.42) * R * 0.3;
      x === -R * 0.72 ? o.moveTo(cx + x, y) : o.lineTo(cx + x, y);
    }
    o.stroke();
    o.beginPath();
    for (let x = -R * 0.72; x <= R * 0.72; x += 1) {
      const y = cy + Math.sin(x * 0.15) * R * 0.15;
      x === -R * 0.72 ? o.moveTo(cx + x, y) : o.lineTo(cx + x, y);
    }
    o.stroke();
  },

  /** Video analytics — a film frame around a moving figure */
  frame: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    o.strokeRect(cx - R * 0.52, cy - R * 0.4, R * 1.04, R * 0.8);
    circle(o, cx, cy - R * 0.16, R * 0.1);
    line(o, cx, cy - R * 0.04, cx, cy + R * 0.14);
    line(o, cx, cy + R * 0.14, cx - R * 0.2, cy + R * 0.32);
    line(o, cx, cy + R * 0.14, cx + R * 0.2, cy + R * 0.3);
    line(o, cx, cy + R * 0.02, cx + R * 0.24, cy - R * 0.1);
  },

  /** PRISM — a lens over a tiled field */
  lens: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    for (let i = -1; i <= 1; i++) {
      line(o, cx - R * 0.5, cy + i * R * 0.3, cx + R * 0.5, cy + i * R * 0.3);
      line(o, cx + i * R * 0.3, cy - R * 0.5, cx + i * R * 0.3, cy + R * 0.5);
    }
    o.lineWidth = Math.max(1.6, w * 0.06);
    circle(o, cx, cy, R * 0.34);
  },

  /** MoML — three arrows converging on a Pareto arc, none arriving */
  pareto: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    o.beginPath();
    o.arc(cx + R * 0.42, cy + R * 0.42, R * 0.78, Math.PI, Math.PI * 1.5);
    o.stroke();
    for (let i = 0; i < 3; i++) {
      const a = Math.PI * (1.06 + i * 0.19);
      line(
        o,
        cx + R * 0.42 + Math.cos(a) * R * 0.28,
        cy + R * 0.42 + Math.sin(a) * R * 0.28,
        cx + R * 0.42 + Math.cos(a) * R * 0.62,
        cy + R * 0.42 + Math.sin(a) * R * 0.62
      );
    }
  },

  /** Mutant Hunter — a bug split by a test blade */
  blade: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    circle(o, cx, cy, R * 0.3);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      line(
        o,
        cx + Math.cos(a) * R * 0.32,
        cy + Math.sin(a) * R * 0.32,
        cx + Math.cos(a) * R * 0.56,
        cy + Math.sin(a) * R * 0.56
      );
    }
    o.lineWidth = Math.max(1.6, w * 0.06);
    line(o, cx - R * 0.62, cy + R * 0.5, cx + R * 0.62, cy - R * 0.5);
  },

  /** DevOps debug — a pipeline with one snapped link */
  pipe: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    line(o, cx - R * 0.6, cy, cx - R * 0.12, cy);
    line(o, cx + R * 0.14, cy, cx + R * 0.6, cy);
    line(o, cx - R * 0.02, cy - R * 0.24, cx + R * 0.02, cy + R * 0.24);
  },

  /** NIVIQURE — a waveform escaping a cracked container */
  crack: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    o.strokeRect(cx - R * 0.55, cy - R * 0.18, R * 0.62, R * 0.62);
    o.beginPath();
    for (let x = 0; x <= R * 1.1; x += 1) {
      const y = cy - R * 0.32 - Math.sin(x * 0.35) * R * 0.18;
      x === 0 ? o.moveTo(cx - R * 0.5 + x, y) : o.lineTo(cx - R * 0.5 + x, y);
    }
    o.stroke();
  },

  /** ML B120 — a stack of models, one lifted clear */
  stack: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    for (let i = 0; i < 3; i++) {
      o.strokeRect(
        cx - R * 0.5 + i * R * 0.1,
        cy + R * 0.32 - i * R * 0.22,
        R * 0.86,
        R * 0.17
      );
    }
    o.strokeRect(cx - R * 0.14, cy - R * 0.52, R * 0.86, R * 0.17);
  },

  /** OS registrar — three keys on one ring */
  keys: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    circle(o, cx, cy - R * 0.34, R * 0.17);
    for (let i = -1; i <= 1; i++) {
      const x = cx + i * R * 0.34;
      line(o, x, cy - R * 0.17, x, cy + R * 0.42);
      line(o, x, cy + R * 0.42, x + R * 0.16, cy + R * 0.42);
      line(o, x, cy + R * 0.2, x + R * 0.13, cy + R * 0.2);
    }
  },

  /* ── build ────────────────────────────────────────────── */

  /** Matrix of Truth — a glass over a field that resolves under it */
  glass: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    for (let y = -2; y <= 2; y++)
      for (let x = -2; x <= 2; x++)
        circle(o, cx + x * R * 0.26, cy + y * R * 0.26, R * 0.05, true);
    o.lineWidth = Math.max(1.6, w * 0.06);
    circle(o, cx - R * 0.12, cy - R * 0.12, R * 0.36);
    line(o, cx + R * 0.14, cy + R * 0.14, cx + R * 0.52, cy + R * 0.52);
  },

  /** DesAIgner — two brushes crossed over one canvas */
  brushes: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    o.strokeRect(cx - R * 0.5, cy - R * 0.5, R, R);
    line(o, cx - R * 0.42, cy + R * 0.42, cx + R * 0.34, cy - R * 0.34);
    line(o, cx + R * 0.42, cy + R * 0.42, cx - R * 0.34, cy - R * 0.34);
  },

  /** Sellorita — a conch as a herald's megaphone */
  horn: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    o.beginPath();
    o.moveTo(cx - R * 0.5, cy - R * 0.06);
    o.lineTo(cx - R * 0.5, cy + R * 0.06);
    o.lineTo(cx + R * 0.1, cy + R * 0.42);
    o.lineTo(cx + R * 0.1, cy - R * 0.42);
    o.closePath();
    o.stroke();
    for (let i = 1; i <= 2; i++) {
      o.beginPath();
      o.arc(cx + R * 0.14, cy, R * (0.16 + i * 0.2), -0.9, 0.9);
      o.stroke();
    }
  },

  /** HFT — an order book: rungs of decreasing depth */
  book: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    for (let k = 0; k < 4; k++) {
      const y = cy - R * 0.42 + k * R * 0.28;
      line(o, cx - R * 0.46, y, cx + R * 0.46 - k * R * 0.2, y);
    }
  },

  /** Dialecto — two speech shapes interlocked */
  speech: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    circle(o, cx - R * 0.2, cy - R * 0.12, R * 0.3);
    circle(o, cx + R * 0.2, cy + R * 0.12, R * 0.3);
  },

  /** MediAssist — a stethoscope coiled into a wheel */
  steth: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    circle(o, cx, cy + R * 0.3, R * 0.2);
    o.beginPath();
    o.arc(cx, cy - R * 0.08, R * 0.42, 0.2, Math.PI - 0.2, true);
    o.stroke();
    circle(o, cx - R * 0.42, cy - R * 0.16, R * 0.08, true);
    circle(o, cx + R * 0.42, cy - R * 0.16, R * 0.08, true);
  },

  /** PluginLive — a mic inside assessment rings */
  mic: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    o.beginPath();
    o.moveTo(cx - R * 0.13, cy - R * 0.06);
    o.lineTo(cx - R * 0.13, cy - R * 0.38);
    o.arc(cx, cy - R * 0.38, R * 0.13, Math.PI, 0);
    o.lineTo(cx + R * 0.13, cy - R * 0.06);
    o.arc(cx, cy - R * 0.06, R * 0.13, 0, Math.PI);
    o.stroke();
    line(o, cx, cy + R * 0.07, cx, cy + R * 0.34);
    for (let i = 1; i <= 2; i++) {
      o.beginPath();
      o.arc(cx, cy - R * 0.16, R * (0.28 + i * 0.2), 0.35, Math.PI - 0.35);
      o.stroke();
    }
  },

  /** relayBrain — a baton handed between two arcs */
  baton: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    o.beginPath();
    o.arc(cx - R * 0.46, cy, R * 0.34, -1.1, 1.1);
    o.stroke();
    o.beginPath();
    o.arc(cx + R * 0.46, cy, R * 0.34, Math.PI - 1.1, Math.PI + 1.1);
    o.stroke();
    o.lineWidth = Math.max(1.6, w * 0.06);
    line(o, cx - R * 0.24, cy, cx + R * 0.24, cy);
  },

  /** Vehicle detection — a detection box under falling weather */
  scope: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    // the box, drawn as corner brackets rather than a full rectangle
    const b = R * 0.44;
    const t = R * 0.2;
    [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ].forEach(([sx, sy]) => {
      line(o, cx + sx * b, cy + sy * b, cx + sx * (b - t), cy + sy * b);
      line(o, cx + sx * b, cy + sy * b, cx + sx * b, cy + sy * (b - t));
    });
    // rain
    for (let i = -1; i <= 1; i++) {
      line(
        o,
        cx + i * R * 0.3 - R * 0.08,
        cy - R * 0.62,
        cx + i * R * 0.3 + R * 0.02,
        cy - R * 0.34
      );
    }
    circle(o, cx, cy, R * 0.09, true);
  },

  /** Voltiq — a cell with its charge state read from inside */
  cell: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    o.strokeRect(cx - R * 0.34, cy - R * 0.46, R * 0.68, R * 0.92);
    line(o, cx - R * 0.12, cy - R * 0.56, cx + R * 0.12, cy - R * 0.56);
    for (let i = 0; i < 2; i++) {
      const y = cy + R * 0.24 - i * R * 0.3;
      line(o, cx - R * 0.2, y, cx + R * 0.2, y);
    }
    // the decay curve, read rather than reported
    o.beginPath();
    for (let x = 0; x <= R * 0.5; x += 1) {
      const y = cy - R * 0.3 + Math.pow(x / (R * 0.5), 1.3) * R * 0.5;
      x === 0 ? o.moveTo(cx + R * 0.42 + x * 0.4, y) : o.lineTo(cx + R * 0.42 + x * 0.4, y);
    }
    o.stroke();
  },

  /** Dapi — a bridge between two scripts */
  bridge: (o, w, h) => {
    const { cx, cy, R } = ring(o, w, h);
    line(o, cx - R * 0.6, cy + R * 0.3, cx + R * 0.6, cy + R * 0.3);
    o.beginPath();
    o.arc(cx, cy + R * 0.3, R * 0.44, Math.PI, 0);
    o.stroke();
    line(o, cx - R * 0.44, cy + R * 0.3, cx - R * 0.44, cy - R * 0.36);
    line(o, cx + R * 0.44, cy + R * 0.3, cx + R * 0.44, cy - R * 0.36);
  },
} satisfies Record<string, MarkPainter>;

export type MarkId = keyof typeof MARKS;
