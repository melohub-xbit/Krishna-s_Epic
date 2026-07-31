"use client";

/**
 * ENSŌ (円相) — the one-breath circle. Spec: 02-japanese-layer.md §2.4.
 *
 * Authentic form: a single uninhibited brushstroke, drawn in one motion and
 * never retouched. Left OPEN — the gap is fukinsei, deliberate imperfection;
 * a closed ensō is a different (and rarer) statement. It expresses mu and the
 * moment of creation, which is why it is the site's loading mark.
 *
 * Construction. The thing that must NOT happen is a geometric circle with a
 * brush font over it — that reads as a logo, not a gesture. So:
 *
 *   - The radius WOBBLES around the sweep on a low-order harmonic series. A
 *     hand cannot hold a true radius, but it also does not jitter randomly;
 *     it drifts. Two or three harmonics is drift. Per-vertex noise is
 *     jitter, and PROJECT-STATUS §4 records that per-element hash jitter
 *     "reads as sloppiness" — the same trap that was removed from the chakra
 *     flames. Do not add noise here.
 *   - The stroke TAPERS: heavy where the brush is set down, thinning as it
 *     lifts. Rendered as a filled outline rather than a stroked path, because
 *     a stroked path has one constant width and a real brush never does.
 *   - Variants exist so a remount is not a photocopy. §2.4 asks for 3–4;
 *     there are four, picked by index.
 *
 * Coordinates are generated, so every one goes through n3() — hydration,
 * PROJECT-STATUS §4 gotcha 1.
 */
import { useId } from "react";
import { n3 } from "@/lib/n3";

/** Four hands. Each is a plausible single gesture, not a random seed. */
const VARIANTS = [
  // gapStart, gapArc, wobble harmonics [amp, freq, phase], weight, taper
  { gap: 292, arc: 34, w: [[2.4, 2, 0.7], [1.2, 3, 2.1]], weight: 7.4, taper: 0.42 },
  { gap: 318, arc: 26, w: [[3.1, 2, 1.9], [1.0, 5, 0.4]], weight: 8.6, taper: 0.55 },
  { gap: 268, arc: 41, w: [[1.9, 3, 0.2], [1.4, 2, 2.8]], weight: 6.8, taper: 0.36 },
  { gap: 305, arc: 30, w: [[2.7, 2, 2.4], [0.9, 4, 1.1]], weight: 9.2, taper: 0.61 },
] as const;

const CX = 50;
const CY = 50;
const R = 36;
// Segment count. These are straight L segments, so too few and the "hand-drawn
// wobble" turns into visible faceting — a rounded polygon, which reads as
// crude rather than as hand-made. 84 showed flat spots on the low-curvature
// arcs at 190px; 132 is clean well past the 480px the hanko criterion asks
// for. Cost is a longer `d` string once at build, nothing at runtime.
const STEPS = 132;

type Pt = { x: number; y: number };

function buildCenterline(v: (typeof VARIANTS)[number]) {
  // The path the brush TRAVELLED — no width, just the gesture. inkDraw sweeps
  // this inside a <mask> to reveal the silhouette, so it is never painted.
  const start = v.gap + v.arc;
  const sweep = 360 - v.arc;
  const pts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const ang = ((start + sweep * t) * Math.PI) / 180;
    let r = R;
    for (const [amp, freq, phase] of v.w) {
      r += amp * Math.sin(t * Math.PI * 2 * freq + phase);
    }
    pts.push(`${n3(CX + Math.cos(ang) * r)} ${n3(CY + Math.sin(ang) * r)}`);
  }
  return `M${pts.join("L")}`;
}

function buildEnso(v: (typeof VARIANTS)[number]) {
  const start = v.gap + v.arc;
  const sweep = 360 - v.arc;

  const radiusAt = (t: number) => {
    // t is 0→1 along the stroke. Harmonics are phase-locked to the SWEEP, not
    // to absolute angle, so the wobble always starts and ends coherently
    // instead of showing a seam at the gap.
    let r = R;
    for (const [amp, freq, phase] of v.w) {
      r += amp * Math.sin(t * Math.PI * 2 * freq + phase);
    }
    return r;
  };

  // Brush width over the stroke: a fast press at entry, a long thinning drag
  // to the lift. Asymmetric on purpose — symmetric tapering reads as a
  // stretched ellipse rather than a stroke with a direction.
  const widthAt = (t: number) => {
    const entry = Math.min(1, t / 0.06); // set-down, quick
    const lift = Math.pow(1 - t, v.taper); // drag out, slow
    return v.weight * entry * (0.35 + 0.65 * lift);
  };

  const outer: Pt[] = [];
  const inner: Pt[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const ang = ((start + sweep * t) * Math.PI) / 180;
    const r = radiusAt(t);
    const hw = widthAt(t) / 2;
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    outer.push({ x: CX + cos * (r + hw), y: CY + sin * (r + hw) });
    inner.push({ x: CX + cos * (r - hw), y: CY + sin * (r - hw) });
  }

  const seg = (pts: Pt[]) =>
    pts.map((p) => `${n3(p.x)} ${n3(p.y)}`).join("L");

  // Out along the outer edge, back along the inner — one closed silhouette.
  return `M${seg(outer)}L${seg([...inner].reverse())}Z`;
}

export interface EnsoProps {
  /** Which hand drew it, 0–3. Out-of-range wraps. */
  variant?: number;
  size?: number;
  className?: string;
  /** Rendered as an outline so inkDraw can draw it; filled when static. */
  drawable?: boolean;
}

/**
 * `drawable` switches on the REVEAL MASK, and the ensō stays filled either way.
 *
 * [REVISED 2026-07-20] This first stroked the silhouette's outline so DrawSVG
 * could animate its stroke-dashoffset — the literal reading of 08 §8.5. That
 * is wrong for any tapered form, for a reason worth keeping: a stroked path
 * has exactly ONE width, so stroking a brush silhouette throws away the taper
 * that makes it a brush mark at all. And what animates is the outline being
 * traced — a thin line running around the shape's border and back — which
 * reads as "outlining a shape", never as "laying down ink".
 *
 * So: the silhouette is always FILLED, and to draw it we sweep the CENTRELINE
 * (the path the brush actually travelled) as a thick white stroke inside an
 * SVG <mask>. DrawSVG animates that hidden stroke; the fill is revealed
 * progressively along the direction of travel, taper intact. The mask stroke
 * is `strokeLinecap="round"` so the reveal edge is a brush tip, not a guillotine.
 *
 * §8.5's direct-stroke path is still right for uniform line art — mon
 * outlines, panel borders. Both live in inkDraw; it picks by looking for
 * data-ink-reveal.
 */
export default function Enso({
  variant = 0,
  size = 220,
  className,
  drawable = false,
}: EnsoProps) {
  const v = VARIANTS[((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length];
  const d = buildEnso(v);
  // useId, not a counter or Math.random: the id must match between the server
  // render and the client hydration or React tears the tree down.
  const uid = useId().replace(/:/g, "");
  const maskId = `enso-reveal-${uid}`;

  // Mask stroke must be at least as wide as the fattest part of the
  // silhouette, or the reveal clips the stroke's own edges as it travels.
  const revealWidth = v.weight + 3;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {drawable && (
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
            <path
              d={buildCenterline(v)}
              data-ink-reveal=""
              fill="none"
              stroke="#fff"
              strokeWidth={revealWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>
      )}
      <path d={d} fill="currentColor" mask={drawable ? `url(#${maskId})` : undefined} />
    </svg>
  );
}
