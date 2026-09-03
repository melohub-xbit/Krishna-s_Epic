/**
 * PROJECT DIAGRAMS.
 *
 * Research work has no screenshots. There is no pretty UI to photograph for
 * a pruning method or an EEG protocol — which is a real constraint, and
 * dressing it with stock imagery would be worse than nothing.
 *
 * So each project draws its own picture, from what the project actually is,
 * in the same dot material as the rest of the site. A signal trace. A layer
 * stack with holes cut in it. An order book. These are landscape panels,
 * shown inside an opened row.
 *
 * Rules, same as the marks: no hairlines, no fine detail. Anything thinner
 * than the dot pitch disappears.
 */

export type DiagramPainter = (
  o: CanvasRenderingContext2D,
  w: number,
  h: number
) => void;

/** shared: set up strokes at a weight that survives the dot sampling */
function pen(o: CanvasRenderingContext2D, w: number, weight = 0.006) {
  o.lineCap = "round";
  o.lineJoin = "round";
  o.lineWidth = Math.max(1.6, w * weight);
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

export const DIAGRAMS: Record<string, DiagramPainter> = {
  /* EEG over ECG — two traces on one time axis, at their real rates.
     The point of the picture is that they do not agree. */
  "eeg-stress": (o, w, h) => {
    pen(o, w);
    const mid = h * 0.5;
    // EEG: fast, noisy, upper
    o.beginPath();
    for (let x = 0; x <= w; x += 1) {
      const t = x / w;
      const y =
        h * 0.3 +
        Math.sin(t * 78) * h * 0.09 +
        Math.sin(t * 191 + 1.2) * h * 0.05 +
        Math.sin(t * 33) * h * 0.04;
      x === 0 ? o.moveTo(x, y) : o.lineTo(x, y);
    }
    o.stroke();
    // ECG: slow, spiky, lower
    o.beginPath();
    for (let x = 0; x <= w; x += 1) {
      const t = (x / w) * 7;
      const beat = t % 1;
      let y = h * 0.74;
      if (beat > 0.44 && beat < 0.52) y -= h * 0.2 * Math.sin((beat - 0.44) * 39);
      else if (beat > 0.38 && beat < 0.44) y += h * 0.04;
      y += Math.sin(t * 3) * h * 0.012;
      x === 0 ? o.moveTo(x, y) : o.lineTo(x, y);
    }
    o.stroke();
    // the window markers — 4,939 of these in the real thing
    o.globalAlpha = 0.5;
    for (let i = 1; i < 8; i++) line(o, (w / 8) * i, mid - h * 0.42, (w / 8) * i, mid + h * 0.42);
    o.globalAlpha = 1;
  },

  /* DALSP — a stack of layers with blocks cut out of the ones that
     stayed quiet for this domain. */
  dalsp: (o, w, h) => {
    pen(o, w);
    const rows = 6;
    const cols = 14;
    const pad = w * 0.06;
    const cw = (w - pad * 2) / cols;
    const ch = (h - pad * 2) / rows;
    const keep = (r: number, c: number) =>
      !((r === 1 && c % 4 === 1) || (r === 3 && c % 3 === 0) || (r === 4 && c % 5 === 2));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = pad + c * cw;
        const y = pad + r * ch;
        if (keep(r, c)) {
          o.strokeRect(x + cw * 0.12, y + ch * 0.16, cw * 0.76, ch * 0.68);
        } else {
          // pruned — a cut mark where the block was
          o.globalAlpha = 0.55;
          line(o, x + cw * 0.24, y + ch * 0.5, x + cw * 0.64, y + ch * 0.5);
          o.globalAlpha = 1;
        }
      }
    }
  },

  /* HFT — the order book. Bids climbing from the left, asks from the
     right, meeting at the spread. */
  "hft-sim": (o, w, h) => {
    pen(o, w);
    const rows = 9;
    const rh = (h * 0.86) / rows;
    const top = h * 0.07;
    const mid = w * 0.5;
    for (let i = 0; i < rows; i++) {
      const y = top + i * rh + rh * 0.5;
      const depth = Math.abs(i - (rows - 1) / 2);
      const len = (w * 0.4) * (0.25 + depth / rows);
      if (i < rows / 2) line(o, mid - w * 0.02, y, mid - w * 0.02 - len, y);
      else line(o, mid + w * 0.02, y, mid + w * 0.02 + len, y);
    }
    // the spread
    o.globalAlpha = 0.6;
    line(o, mid, top, mid, top + rows * rh);
    o.globalAlpha = 1;
  },

  /* Vehicle detection — boxes over a scene, in weather. */
  "vehicle-detection": (o, w, h) => {
    pen(o, w);
    // rain
    o.globalAlpha = 0.4;
    for (let i = 0; i < 26; i++) {
      const x = (i / 26) * w + ((i * 37) % 19);
      line(o, x, h * 0.05, x + w * 0.012, h * 0.28);
    }
    o.globalAlpha = 1;
    // road
    line(o, 0, h * 0.86, w, h * 0.86);
    // detections, as corner brackets
    const boxes = [
      [0.08, 0.5, 0.2, 0.32],
      [0.36, 0.56, 0.14, 0.24],
      [0.58, 0.46, 0.26, 0.38],
      [0.86, 0.6, 0.1, 0.2],
    ];
    boxes.forEach(([bx, by, bw, bh]) => {
      const x = bx * w;
      const y = by * h;
      const ww = bw * w;
      const hh = bh * h;
      const t = Math.min(ww, hh) * 0.28;
      line(o, x, y, x + t, y);
      line(o, x, y, x, y + t);
      line(o, x + ww, y, x + ww - t, y);
      line(o, x + ww, y, x + ww, y + t);
      line(o, x, y + hh, x + t, y + hh);
      line(o, x, y + hh, x, y + hh - t);
      line(o, x + ww, y + hh, x + ww - t, y + hh);
      line(o, x + ww, y + hh, x + ww, y + hh - t);
    });
  },

  /* RACS — a ranked column with one item that has no history at all. */
  racs: (o, w, h) => {
    pen(o, w);
    const n = 7;
    const rh = (h * 0.84) / n;
    for (let i = 0; i < n; i++) {
      const y = h * 0.08 + i * rh + rh * 0.5;
      const len = w * (0.62 - i * 0.06);
      line(o, w * 0.16, y, w * 0.16 + len, y);
      // the cold item: an outline, no bar
      if (i === 3) {
        o.globalAlpha = 0.55;
        o.strokeRect(w * 0.16, y - rh * 0.3, w * 0.2, rh * 0.6);
        o.globalAlpha = 1;
      }
    }
  },

  /* DevOps env — a pipeline of stages with one broken link. */
  "devops-debug": (o, w, h) => {
    pen(o, w);
    const n = 5;
    const gap = w / n;
    for (let i = 0; i < n; i++) {
      const cx = gap * i + gap * 0.5;
      o.strokeRect(cx - gap * 0.22, h * 0.36, gap * 0.44, h * 0.28);
      if (i < n - 1) {
        if (i === 2) {
          // the break
          line(o, cx + gap * 0.22, h * 0.5, cx + gap * 0.34, h * 0.5);
          line(o, cx + gap * 0.62, h * 0.5, cx + gap * 0.78, h * 0.5);
          o.globalAlpha = 0.6;
          line(o, cx + gap * 0.44, h * 0.4, cx + gap * 0.52, h * 0.6);
          o.globalAlpha = 1;
        } else {
          line(o, cx + gap * 0.22, h * 0.5, cx + gap * 0.78, h * 0.5);
        }
      }
    }
  },

  /* PRISM — a slide, tiled, becoming one vector. */
  prism: (o, w, h) => {
    pen(o, w);
    const cols = 9;
    const rows = 5;
    const gw = w * 0.44;
    const cw = gw / cols;
    const chh = (h * 0.72) / rows;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        o.strokeRect(w * 0.05 + c * cw, h * 0.14 + r * chh, cw * 0.82, chh * 0.78);
    // the aggregation
    for (let i = 0; i < 5; i++) {
      line(o, w * 0.52, h * (0.22 + i * 0.14), w * 0.66, h * 0.5);
    }
    for (let i = 0; i < 7; i++) {
      const y = h * 0.24 + i * h * 0.075;
      line(o, w * 0.74, y, w * 0.74 + w * 0.16 * (0.3 + ((i * 5) % 7) / 9), y);
    }
  },

  /* Mutant Hunter — a grid of mutants, most killed, some alive. */
  mutanthunter: (o, w, h) => {
    pen(o, w);
    const cols = 12;
    const rows = 5;
    const cw = (w * 0.9) / cols;
    const chh = (h * 0.74) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = w * 0.05 + c * cw + cw * 0.5;
        const y = h * 0.13 + r * chh + chh * 0.5;
        const alive = (r * cols + c) % 7 === 3;
        if (alive) {
          o.beginPath();
          o.arc(x, y, Math.min(cw, chh) * 0.26, 0, Math.PI * 2);
          o.stroke();
        } else {
          const t = Math.min(cw, chh) * 0.2;
          line(o, x - t, y - t, x + t, y + t);
          line(o, x + t, y - t, x - t, y + t);
        }
      }
    }
  },

  /* NIVIQURE — the byte layout of an undocumented format. */
  "ect-nimhans": (o, w, h) => {
    pen(o, w);
    const chunks = 4;
    const perChunk = 8;
    const cw = (w * 0.92) / (chunks * perChunk);
    for (let k = 0; k < chunks; k++) {
      for (let i = 0; i < perChunk; i++) {
        const x = w * 0.04 + (k * perChunk + i) * cw;
        o.strokeRect(x, h * 0.3, cw * 0.78, h * 0.26);
      }
      // chunk boundary
      o.globalAlpha = 0.55;
      const bx = w * 0.04 + (k + 1) * perChunk * cw - cw * 0.14;
      line(o, bx, h * 0.2, bx, h * 0.66);
      o.globalAlpha = 1;
    }
    // the signal that came out
    o.beginPath();
    for (let x = 0; x <= w; x += 1) {
      const y = h * 0.82 + Math.sin((x / w) * 41) * h * 0.07;
      x === 0 ? o.moveTo(x, y) : o.lineTo(x, y);
    }
    o.stroke();
  },

  /* MoML — a Pareto front with the dominated points behind it. */
  moml: (o, w, h) => {
    pen(o, w);
    line(o, w * 0.1, h * 0.86, w * 0.92, h * 0.86);
    line(o, w * 0.1, h * 0.1, w * 0.1, h * 0.86);
    o.beginPath();
    for (let x = 0; x <= 1; x += 0.01) {
      const px = w * (0.16 + x * 0.7);
      const py = h * (0.2 + Math.pow(x, 0.55) * 0.58);
      x === 0 ? o.moveTo(px, py) : o.lineTo(px, py);
    }
    o.stroke();
    o.globalAlpha = 0.55;
    for (let i = 0; i < 14; i++) {
      const px = w * (0.24 + ((i * 17) % 60) / 100);
      const py = h * (0.34 + ((i * 29) % 46) / 100);
      o.beginPath();
      o.arc(px, py, Math.min(w, h) * 0.014, 0, Math.PI * 2);
      o.stroke();
    }
    o.globalAlpha = 1;
  },
};

export function hasDiagram(id: string) {
  return Object.prototype.hasOwnProperty.call(DIAGRAMS, id);
}
