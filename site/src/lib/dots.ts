/**
 * The dot engine.
 *
 * Everything visual on this site that moves is made of dots, and all of it
 * comes through here. The idea: draw a shape into an offscreen canvas, read
 * back which pixels are opaque, and keep those positions as dot targets.
 *
 * Deliberately small and 2D. No WebGL, no shaders, no per-frame allocation
 * beyond what is unavoidable.
 */

export type Pt = { x: number; y: number };

/** A drawing callback given a 2D context sized w x h, painting in white. */
export type Painter = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
) => void;

/** Size a canvas to its CSS box at capped DPR and return a ready context. */
export function fitCanvas(cv: HTMLCanvasElement) {
  const rect = cv.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  const ctx = cv.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

/**
 * Rasterise a shape and return the lattice points that land inside it.
 * `step` is the dot pitch in CSS pixels — smaller is denser.
 */
export function sampleDots(
  paint: Painter,
  w: number,
  h: number,
  step = 3.4
): Pt[] {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const o = off.getContext("2d")!;
  o.fillStyle = "#fff";
  o.strokeStyle = "#fff";
  paint(o, w, h);

  const data = o.getImageData(0, 0, w, h).data;
  const out: Pt[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = ((y | 0) * w + (x | 0)) * 4 + 3;
      if (data[i] > 120) out.push({ x, y });
    }
  }
  return out;
}

/** Paint a set of dots in one batched path. One fill, however many dots. */
export function paintDots(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  radius: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    ctx.moveTo(pts[i].x + radius, pts[i].y);
    ctx.arc(pts[i].x, pts[i].y, radius, 0, Math.PI * 2);
  }
  ctx.fill();
}

/**
 * Canvas `font` cannot resolve CSS custom properties, so read the family
 * string out of the variable next/font sets and hand canvas a real stack.
 */
export function fontStack(which: "sans" | "mono" | "telugu"): string {
  if (typeof window === "undefined") return "sans-serif";
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(`--font-${which}`)
    .trim();
  const fallback =
    which === "mono" ? "ui-monospace, monospace" : "Arial, sans-serif";
  return v ? `${v}, ${fallback}` : fallback;
}

/** The house easing curve: hesitate, then commit. */
export const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Respect the user's motion setting. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One shared ticker. Every animated dot canvas on the page runs off this,
 * so there is exactly one requestAnimationFrame loop on the site — which
 * is the thing that keeps scrolling smooth.
 */
type Job = (now: number) => boolean; // return false when finished

const jobs = new Set<Job>();
let running = false;

function loop(now: number) {
  for (const job of Array.from(jobs)) {
    if (!job(now)) jobs.delete(job);
  }
  if (jobs.size === 0) {
    running = false;
    return;
  }
  requestAnimationFrame(loop);
}

export function addJob(job: Job) {
  jobs.add(job);
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
  return () => jobs.delete(job);
}
