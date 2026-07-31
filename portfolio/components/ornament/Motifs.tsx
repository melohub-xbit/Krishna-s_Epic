"use client";

/**
 * ORNAMENT LIBRARY — figurative motifs.
 *
 * Each follows the craft spec: research the true form, build the blueprint,
 * then construct it. Where a form is mathematical (the conch's spiral, the
 * garland's catenary) it is generated from the real equation rather than
 * eyeballed with beziers.
 */

// n3 rounds every generated coordinate to fixed precision — required for
// hydration, not cosmetic. It used to be defined here; it moved to lib/n3.ts
// when components/ink needed the same guarantee. The "why" lives there.
import { n3 } from "@/lib/n3";

const deg = (d: number) => (d * Math.PI) / 180;

// ============================================================ TORANA
/**
 * TORANAM — the mango-leaf and marigold doorway garland.
 *
 * Authentic form: a string hung in a **catenary** (y = a·cosh(x/a) — the curve
 * a hanging chain actually makes, not a parabola), carrying alternating mango
 * leaves and marigold clusters. A festive doorway blessing, so it heads each
 * section the way a torana heads a doorway.
 *
 * Mango leaf: a lancet with a central midrib and fine lateral veins, tip
 * curling. Marigold: layered concentric petal rings around a dense core.
 */
export function Torana({ width = 460, className = "" }: { width?: number; className?: string }) {
  const W = 460;
  const H = 108;
  const a = 150;                       // catenary tightness
  const span = W / 2;
  const TOP = 10;                      // height of the hang points
  const SAG = 54;                      // how far the middle dips
  const cosh = (x: number) => (Math.exp(x) + Math.exp(-x)) / 2;

  // A hanging garland is HIGHEST at its ends and dips in the middle, and in
  // SVG y grows downward — so the cosh term is subtracted, then normalised to
  // SAG. Written the other way round the curve inverts and lands hundreds of
  // units off-canvas, which is exactly what the first version did.
  const peak = cosh(span / a) - 1;
  const y = (x: number) => TOP + ((cosh(span / a) - cosh((x - span) / a)) / peak) * SAG;

  const pts = Array.from({ length: 61 }, (_, i) => {
    const x = (i / 60) * W;
    return [n3(x), n3(y(x))] as const;
  });
  const stringD = `M${pts.map(([x, yy]) => `${x} ${yy}`).join("L")}`;

  // hang points, skipping the very ends
  const hangs = Array.from({ length: 13 }, (_, i) => {
    const t = 0.045 + (i / 12) * 0.91;
    const x = t * W;
    return { x: n3(x), y: n3(y(x)), marigold: i % 3 === 1 };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} className={className} fill="none" aria-hidden="true">
      {/* the string, in catenary */}
      <path d={stringD} stroke="currentColor" strokeWidth="1.1" opacity="0.55" />

      {hangs.map((h, i) =>
        h.marigold ? (
          <g key={i} transform={`translate(${h.x} ${h.y + 15})`}>
            {/* marigold: three concentric petal rings + dense core */}
            {[
              { r: 11, n: 12, w: 3.4, o: 0.55 },
              { r: 7.6, n: 10, w: 3.0, o: 0.75 },
              { r: 4.4, n: 8, w: 2.6, o: 0.95 },
            ].map((ring, ri) =>
              Array.from({ length: ring.n }, (_, k) => {
                const ang = n3((k / ring.n) * 360 + ri * 12);
                const px = n3(Math.cos(deg(ang)) * ring.r * 0.62);
                const py = n3(Math.sin(deg(ang)) * ring.r * 0.62);
                return (
                  <ellipse
                    key={`${ri}-${k}`}
                    cx={px}
                    cy={py}
                    rx={ring.w}
                    ry={n3(ring.w * 1.5)}
                    transform={`rotate(${ang} ${px} ${py})`}
                    fill="currentColor"
                    opacity={n3(ring.o * 0.5)}
                  />
                );
              })
            )}
            <circle r="2.6" fill="currentColor" />
          </g>
        ) : (
          <g key={i} transform={`translate(${h.x} ${h.y})`}>
            {/* mango leaf: lancet outline, midrib, lateral veins, curling tip */}
            <path
              d="M0 2 C6.5 10 7.4 22 2.4 33 C1.4 35.2 -1.4 35.2 -2.4 33 C-7.4 22 -6.5 10 0 2 Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M0 2 C6.5 10 7.4 22 2.4 33 C1.4 35.2 -1.4 35.2 -2.4 33 C-7.4 22 -6.5 10 0 2 Z"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <path d="M0 3 C0.8 14 0.9 25 0.4 34" stroke="currentColor" strokeWidth="0.7" opacity="0.8" />
            {[9, 14, 19, 24, 28].map((v, k) => (
              <g key={v} opacity="0.5">
                <path d={`M0.3 ${v} C-2.2 ${v + 1.6} -3.6 ${v + 3.4} -4.2 ${v + 5.2}`} stroke="currentColor" strokeWidth="0.5" />
                <path d={`M0.3 ${v} C2.8 ${v + 1.6} 4.2 ${v + 3.4} 4.8 ${v + 5.2}`} stroke="currentColor" strokeWidth="0.5" />
              </g>
            ))}
          </g>
        )
      )}
    </svg>
  );
}

// ============================================================ HANKO SEAL
/**
 * HANKO / INKAN (印鑑) — the Japanese carved name seal.
 *
 * A red stamped square carrying the కృ ligature: the site's two traditions in
 * one mark. Deliberately imperfect at the edge — a real hanko impression
 * breaks up where the ink doesn't take, so a clean rectangle reads as a
 * sticker rather than a stamp.
 */
export function Hanko({ size = 74, label = "కృ" }: { size?: number; label?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" className="hanko">
      <defs>
        <filter id="hanko-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#hanko-rough)">
        <rect x="4" y="4" width="92" height="92" rx="9" fill="currentColor" />
        <rect x="12" y="12" width="76" height="76" rx="5" fill="none" stroke="#f0e0c4" strokeWidth="2.4" opacity="0.9" />
      </g>
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#f6e7cc"
        style={{ font: "700 44px 'Noto Sans Telugu', sans-serif" }}
      >
        {label}
      </text>
    </svg>
  );
}

// ============================================================ BRUSH RULE
/**
 * Sumi brush stroke divider. A real brush stroke is thick at the press and
 * tapers as it lifts, so this is drawn as a filled shape with unequal ends,
 * not a stroked line of constant width.
 */
export function BrushRule({ width = 300, flip = false }: { width?: number; flip?: boolean }) {
  return (
    <svg viewBox="0 0 300 12" width={width} height={12} aria-hidden="true"
         style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}>
      <path
        d="M2 6.6 C40 3.2 74 2.4 126 3.6 C176 4.8 226 6.2 296 5.0 C232 8.4 176 8.6 126 7.6 C76 6.6 42 7.4 2 6.6 Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================ EPIC SIGILS
/**
 * CONCH — Panchajanya. Mahabharatam sigil.
 *
 * Built on a **logarithmic spiral** (r = a·e^(bθ)) because that is the curve a
 * real shell grows on, and wound **clockwise** — the sacred conch is
 * dakṣiṇāvarti (right-turning). Getting the handedness wrong is the classic
 * error and inverts the meaning.
 */
export function Conch({ size = 92 }: { size?: number }) {
  const turns = 3.15;
  const steps = 200;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const th = (i / steps) * turns * Math.PI * 2;
    const r = 2.0 * Math.exp(0.238 * th);
    // negative x → clockwise winding (dakṣiṇāvarti)
    pts.push(`${n3(50 - r * Math.cos(th))} ${n3(52 - r * Math.sin(th))}`);
  }

  // ribs across the whorl
  const ribs = Array.from({ length: 13 }, (_, i) => {
    const th = ((i + 3) / 16) * turns * Math.PI * 2;
    const r1 = 2.0 * Math.exp(0.238 * th);
    const r2 = 2.0 * Math.exp(0.238 * (th - 0.55));
    return `M${n3(50 - r1 * Math.cos(th))} ${n3(52 - r1 * Math.sin(th))}L${n3(50 - r2 * Math.cos(th))} ${n3(52 - r2 * Math.sin(th))}`;
  });

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" aria-hidden="true">
      {/* flared aperture */}
      <path d="M50 52 C68 40 86 46 90 62 C93 76 78 90 60 86 C46 83 42 68 50 52 Z"
            fill="currentColor" opacity="0.13" />
      <path d="M50 52 C68 40 86 46 90 62 C93 76 78 90 60 86 C46 83 42 68 50 52 Z"
            stroke="currentColor" strokeWidth="1.5" />
      {/* the growth spiral */}
      <path d={`M${pts.join("L")}`} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <g opacity="0.55">
        {ribs.map((d, i) => <path key={i} d={d} stroke="currentColor" strokeWidth="0.8" />)}
      </g>
      {/* tapering spire tip */}
      <path d="M14 20 C10 14 12 9 18 9" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
    </svg>
  );
}

/**
 * BOW — Kodanda / Śārṅga. Ramayanam sigil.
 *
 * A **recurve**: the limbs bend back on themselves near the tips, which is what
 * distinguishes Rama's bow from a plain arc. Ornate central grip with engraved
 * bands, taut string drawn as a straight chord between the nocks.
 */
export function Bow({ size = 92 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" aria-hidden="true">
      {/* limbs, recurved at both tips */}
      <path
        d="M38 8 C30 14 34 20 40 26 C56 44 56 56 40 74 C34 80 30 86 38 92"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* engraved fittings along the limbs */}
      <g opacity="0.7">
        {[22, 30, 38, 62, 70, 78].map((cy) => (
          <line key={cy} x1="40" y1={cy} x2="50" y2={cy} stroke="currentColor" strokeWidth="1" />
        ))}
      </g>
      {/* string: straight chord, nock to nock */}
      <path d="M38 8 L38 92" stroke="currentColor" strokeWidth="0.9" opacity="0.85" />
      {/* ornate grip */}
      <g>
        <rect x="42" y="42" width="13" height="16" rx="3" fill="currentColor" opacity="0.22" />
        <rect x="42" y="42" width="13" height="16" rx="3" stroke="currentColor" strokeWidth="1.2" />
        <line x1="42" y1="47" x2="55" y2="47" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
        <line x1="42" y1="53" x2="55" y2="53" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
      </g>
    </svg>
  );
}

// ============================================================ SECTION MARK
/** Small chapter mark: a lotus rosette used as a section bullet / parva number. */
export function Rosette({ size = 26, petals = 8 }: { size?: number; petals?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" aria-hidden="true">
      {Array.from({ length: petals }, (_, i) => (
        <ellipse
          key={i}
          cx="20"
          cy="11"
          rx="3.1"
          ry="7.4"
          fill="currentColor"
          opacity="0.55"
          transform={`rotate(${(i * 360) / petals} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="3.2" fill="currentColor" />
      <circle cx="20" cy="20" r="5.6" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}
