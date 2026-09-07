/**
 * THE LANDSCAPE — one drawing, generated.
 *
 * Those flowing dune lines are a flow field: a few hundred polylines
 * walking left to right, each one nudged by layered value noise. Because
 * neighbouring lines sample the same field they drift together, so the
 * surface reads as one form rather than as a pile of separate strokes.
 * It is the same maths behind wood grain and topographic maps, and it is
 * why this looks drawn rather than assembled out of CSS shapes.
 *
 * Everything is proportional to the canvas, so one seed composes itself
 * for any aspect instead of being cropped — the hero band and the share
 * card are the same picture, not the same picture cut differently.
 *
 * The seed is a plain number, so a composition can always be pinned by
 * writing that number down. Left unpinned it comes from the clock — see
 * timeSeed — and the site draws a different sky every time it opens.
 */

export type Ink = {
  ink: string;
  ink2: string;
  cream: string;
  cream2: string;
  sun: string;
  ember: string;
  haze: string;
  deep: string;
};

export const DUSK: Ink = {
  ink: "#0B1220",
  ink2: "#151C2C",
  cream: "#F4EADA",
  cream2: "#E8DCC7",
  sun: "#C75340",
  ember: "#B73B2A",
  haze: "#E9F2FE",
  deep: "#04060C",
};

function mulberry(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** value noise on a 256² lattice, smoothstepped, three octaves */
function makeNoise(seed: number) {
  const rnd = mulberry(seed);
  const N = 256;
  const g = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) g[i] = rnd();
  const sm = (t: number) => t * t * (3 - 2 * t);
  const at = (x: number, y: number) => g[(y & 255) * N + (x & 255)];
  function n2(x: number, y: number) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = sm(x - xi);
    const yf = sm(y - yi);
    const a = at(xi, yi);
    const b = at(xi + 1, yi);
    const c = at(xi, yi + 1);
    const d = at(xi + 1, yi + 1);
    const top = a + (b - a) * xf;
    return top + (c + (d - c) * xf - top) * yf;
  }
  return (x: number, y: number) =>
    n2(x, y) * 0.6 + n2(x * 2.1, y * 2.1) * 0.28 + n2(x * 4.3, y * 4.3) * 0.12;
}

/**
 * A seed from the clock, so no two visits get the same landscape.
 *
 * Milliseconds go in and a well-mixed integer comes out: consecutive
 * timestamps differ by one, and one seed away is a nearly identical
 * picture, so the value has to be hashed rather than used raw or two
 * people loading the site a second apart would see the same dunes.
 *
 * `offset` separates two drawings made in the same instant — the hero
 * and the sign-off are two places on the same evening, not one picture
 * shown twice.
 */
export function timeSeed(offset = 0) {
  const t = Date.now();
  let h = (t ^ (t >>> 16)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  return ((h + Math.imul(offset, 0x9e3779b1)) >>> 0) % 100000;
}

export type ContourOpts = {
  seed?: number;
  /** lines across the near dune */
  dens?: number;
  /** how far a line may wander from its baseline */
  amp?: number;
  /** slides the whole field sideways — the breathing */
  phase?: number;
  /** the loose red curl across the top of the sky — the sign-off only */
  scribble?: boolean;
  /**
   * The width one "unit" of line weight is measured against. Everything
   * in here is proportional to `w / unit`, which is what lets one seed
   * compose itself for any aspect — but a poster is 200px wide, not
   * 2200, and at the banner's unit every line in it comes out a tenth
   * of a pixel thick and the picture renders as a smear. Cards pass a
   * small unit so the drawing keeps its weight when it is shrunk.
   */
  unit?: number;
  /** how many stars; scaled down with the plate by default */
  stars?: number;
  colours?: Ink;
};

export function drawContour(
  cv: HTMLCanvasElement,
  {
    seed = 4207,
    dens = 96,
    amp = 58,
    phase = 0,
    scribble = false,
    unit = 2200,
    stars,
    colours = DUSK,
  }: ContourOpts = {}
) {
  const g = cv.getContext("2d");
  if (!g) return;
  const w = cv.width;
  const h = cv.height;
  if (w < 2 || h < 2) return;

  const C = colours;
  const n = makeNoise(seed);
  const rnd = mulberry(seed * 31 + 7);
  /* one scale for every dimension, so nothing is hard-coded to a size */
  const S = w / unit;
  const horizon = h * 0.56;

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = C.deep;
  g.fillRect(0, 0, w, h);

  const sky = g.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, C.deep);
  sky.addColorStop(0.62, C.ink);
  sky.addColorStop(1, C.ink2);
  g.fillStyle = sky;
  g.fillRect(0, 0, w, horizon + 2);

  /* stars, thinning toward the horizon — that is where the light is */
  const nStars = stars ?? Math.round(420 * Math.min(1, w / 1400));
  for (let i = 0; i < nStars; i++) {
    const x = rnd() * w;
    const y = rnd() * horizon;
    const a = (1 - y / horizon) * 0.75 * rnd();
    if (a < 0.06) continue;
    g.fillStyle = `rgba(233,242,254,${a.toFixed(3)})`;
    g.beginPath();
    g.arc(x, y, (rnd() * 1.6 + 0.5) * S, 0, 7);
    g.fill();
  }

  /** one contour across the plate */
  const line = (
    y0: number,
    o: { fx?: number; fy?: number; a?: number; col: string; lw?: number; alpha?: number }
  ) => {
    const { fx = 0.0016, fy = 0.007, a = amp, col, lw = 1.4, alpha = 1 } = o;
    g.strokeStyle = col;
    g.globalAlpha = alpha;
    g.lineWidth = lw * S;
    g.beginPath();
    for (let x = -20; x <= w + 20; x += 6 * S) {
      /* phase slides the sample point, so every line drifts together and
         the surface breathes instead of shimmering */
      const y = y0 + (n(x * fx + phase, y0 * fy) - 0.5) * 2 * a * S;
      if (x <= -20) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
    g.globalAlpha = 1;
  };

  /* the streaks: the only warm thing in the sky, and what stops it
     being an empty rectangle */
  for (let i = 0; i < 7; i++) {
    const y = h * (0.06 + rnd() * 0.3);
    line(y, {
      fx: 0.0009,
      fy: 0.004,
      a: amp * 1.5,
      col: i % 3 ? C.sun : C.ember,
      lw: 1.1 + rnd() * 1.4,
      alpha: 0.34 + rnd() * 0.4,
    });
  }

  /* The curl. Everything else in the sky runs level; this one wanders in
     both axes, so it reads as a mark somebody made rather than as another
     layer of the same field. Two of them, thin, high, and the same red as
     the near dune — which is what ties the top of the picture to the
     bottom of it. */
  if (scribble) {
    for (let k = 0; k < 2; k++) {
      const y0 = h * (0.09 + k * 0.11 + n(k * 13.7, 5) * 0.05);
      const x0 = w * (0.1 + n(k * 5.1, 17) * 0.3);
      const len = w * (0.42 + n(k * 3.3, 23) * 0.3);
      g.strokeStyle = k ? C.sun : C.ember;
      g.globalAlpha = 0.62;
      g.lineWidth = 1.5 * S;
      g.beginPath();
      for (let t = 0; t <= 1.0001; t += 0.004) {
        const x = x0 + len * t;
        const y =
          y0 +
          (n(t * 7 + phase * 2 + k * 40, 3) - 0.5) * h * 0.14 +
          Math.sin(t * Math.PI * 5 + k) * h * 0.02;
        t === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
      g.globalAlpha = 1;
    }
  }

  /* the planet — contours inside it, and one terminator so it is a
     sphere rather than a coin */
  const pr = Math.min(w, h) * (0.19 + n(seed * 0.7, 3) * 0.1);
  const px = w * (0.2 + n(seed * 0.3, 9) * 0.34);
  const py = horizon - pr * 0.34;
  g.save();
  g.beginPath();
  g.arc(px, py, pr, 0, 7);
  g.clip();
  g.fillStyle = C.cream2;
  g.fillRect(px - pr, py - pr, pr * 2, pr * 2);
  /* the grain of the planet. These used to be a whisper at 0.16 and the
     disc read as a flat cream circle — at this weight it reads as a body
     with a surface, which is the only thing making it a planet. */
  for (let y = py - pr; y < py + pr; y += Math.max(3, 6 * S)) {
    line(y, { fx: 0.0026, fy: 0.02, a: amp * 0.34, col: C.ink, lw: 1.15, alpha: 0.34 });
  }
  const sh = g.createLinearGradient(px - pr, 0, px + pr, 0);
  sh.addColorStop(0, "rgba(11,18,32,0)");
  sh.addColorStop(1, "rgba(11,18,32,.42)");
  g.fillStyle = sh;
  g.fillRect(px - pr, py - pr, pr * 2, pr * 2);
  g.restore();

  /* a small one, low and on the other side */
  const qr = pr * 0.26;
  const qx = w * (0.62 + n(seed * 1.9, 2) * 0.3);
  const qy = horizon + (h - horizon) * 0.5;
  g.save();
  g.beginPath();
  g.arc(qx, qy, qr, 0, 7);
  g.clip();
  g.fillStyle = C.cream;
  g.fillRect(qx - qr, qy - qr, qr * 2, qr * 2);
  g.restore();

  /* far dune — cream, fine */
  g.save();
  g.beginPath();
  g.moveTo(0, h);
  for (let x = 0; x <= w; x += 8 * S)
    g.lineTo(x, horizon + (n(x * 0.0011, 11) - 0.5) * h * 0.06);
  g.lineTo(w, h);
  g.closePath();
  g.clip();
  g.fillStyle = C.cream;
  g.fillRect(0, 0, w, h);
  for (let y = horizon - h * 0.04; y < h; y += Math.max(3, 6.5 * S)) {
    line(y, { fx: 0.0018, fy: 0.012, a: amp * 0.5, col: C.ink, lw: 1, alpha: 0.2 });
  }
  g.restore();

  /* near dune — vermilion, dense and heavier */
  const near = horizon + (h - horizon) * 0.34;
  g.save();
  g.beginPath();
  g.moveTo(0, h);
  for (let x = 0; x <= w; x += 8 * S)
    g.lineTo(x, near + (n(x * 0.0014, 29) - 0.5) * h * 0.09);
  g.lineTo(w, h);
  g.closePath();
  g.clip();
  g.fillStyle = C.sun;
  g.fillRect(0, 0, w, h);
  const step = Math.max(2.4, (h * 0.9) / dens);
  for (let y = near - h * 0.06; y < h + step; y += step) {
    line(y, { fx: 0.0015, fy: 0.013, a: amp * 0.62, col: C.ember, lw: 1.3, alpha: 0.5 });
  }
  for (let y = near; y < h; y += step * 4) {
    line(y + step * 1.5, {
      fx: 0.0015,
      fy: 0.013,
      a: amp * 0.62,
      col: C.cream,
      lw: 1.1,
      alpha: 0.3,
    });
  }
  g.restore();

  /* the light that ties it together — over everything, no edges */
  const glow = g.createRadialGradient(w * 0.5, horizon, 0, w * 0.5, horizon, w * 0.55);
  glow.addColorStop(0, "rgba(199,83,64,.30)");
  glow.addColorStop(0.45, "rgba(199,83,64,.10)");
  glow.addColorStop(1, "rgba(199,83,64,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, w, h);
}

/**
 * A mark's ground, as contour rings.
 *
 * The same value noise that makes the dunes, wrapped around a centre:
 * twenty-six closed rings whose radius is pushed in and out by the field,
 * so they nest like a topographic map of a small hill rather than like a
 * target. Seeded, so a project's halo is always its own.
 *
 * Drawn in the palette's own colours — the outer few rings go warm, which
 * is what gives the disc an edge without drawing one.
 */
export function drawHalo(
  cv: HTMLCanvasElement,
  { seed = 11, colours = DUSK }: { seed?: number; colours?: Ink } = {}
) {
  const g = cv.getContext("2d");
  if (!g) return;
  const w = cv.width;
  const h = cv.height;
  if (w < 2 || h < 2) return;

  const C = colours;
  const n = makeNoise(seed);
  const S = Math.min(w, h) / 190;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.44;
  const RINGS = 26;

  for (let k = 0; k < RINGS; k++) {
    const t = k / RINGS;
    const r = R * (0.15 + t * 0.85);
    const warm = k > RINGS - 6;
    g.strokeStyle = warm ? C.sun : C.cream;
    g.globalAlpha = warm ? 0.8 : 0.3 + (k % 3) * 0.07;
    g.lineWidth = (warm ? 1.35 : 0.95) * S;
    g.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.05) {
      const rr =
        r *
        (1 +
          (n(Math.cos(a) * 3 + k * 0.4, Math.sin(a) * 3 + k * 0.4) - 0.5) *
            0.36);
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr * 0.98;
      if (a === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.closePath();
    g.stroke();
  }
  g.globalAlpha = 1;
}

/** a stable seed from a project id, so a poster is always the same place */
export function seedFrom(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 100000;
}
