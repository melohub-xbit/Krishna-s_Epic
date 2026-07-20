"use client";

/**
 * ORNAMENT LIBRARY — patterns
 *
 * Per ELEMENT-CRAFT-SPEC: authentic form → accurate blueprint → real
 * construction. Nothing here is a CSS box or a decorative approximation; each
 * pattern is generated from the geometry the real textile/craft is built on.
 *
 * Japanese (wagara) and Telugu/Hindu motifs sit side by side deliberately —
 * the site is both, so the ornament vocabulary has to be both.
 *
 * All patterns are emitted once into a single hidden <svg><defs>, then
 * referenced by id from anywhere via fill="url(#asanoha)".
 */

// ---------------------------------------------------------------- helpers

const deg = (d: number) => (d * Math.PI) / 180;

/**
 * Round every generated coordinate. Raw floats serialise differently on the
 * server and in the browser at the last decimal, which throws a React
 * hydration mismatch on procedurally drawn geometry.
 */
const n3 = (n: number) => Number(n.toFixed(3));

/** Pointy-top hexagon vertices, circumradius R, centred at (cx, cy). */
function hexVerts(cx: number, cy: number, R: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = deg(-90 + 60 * k);
    return [n3(cx + R * Math.cos(a)), n3(cy + R * Math.sin(a))] as const;
  });
}

/**
 * ASANOHA (麻の葉) — "hemp leaf".
 *
 * Authentic construction, not an approximation: a hexagon is split into six
 * equilateral triangles by its three long diagonals, then within each triangle
 * a three-armed star is drawn from its corners to its centroid. That centroid
 * star is what makes the leaf; drawing only the diagonals gives a plain
 * hexagon lattice, which is the usual mistake.
 *
 * Hexagons tile on a lattice of horizontal pitch √3·R and vertical pitch
 * 1.5·R with alternate rows offset by √3·R/2, so the smallest seamless
 * rectangle is √3·R wide by 3·R tall.
 */
function asanohaPath(R: number) {
  const pitchX = Math.sqrt(3) * R;
  const pitchY = 1.5 * R;
  const segs: string[] = [];

  // Draw beyond the tile on every side so the pattern seams cleanly.
  for (let row = -2; row <= 4; row++) {
    for (let col = -2; col <= 3; col++) {
      const cx = n3(col * pitchX + (row % 2 === 0 ? 0 : pitchX / 2));
      const cy = n3(row * pitchY);
      const v = hexVerts(cx, cy, R);

      // three long diagonals (also gives centre → every vertex)
      for (let k = 0; k < 3; k++) {
        segs.push(`M${v[k][0]} ${v[k][1]}L${v[k + 3][0]} ${v[k + 3][1]}`);
      }

      // per-triangle centroid star — the actual hemp leaf
      for (let k = 0; k < 6; k++) {
        const a = v[k];
        const b = v[(k + 1) % 6];
        const gx = n3((cx + a[0] + b[0]) / 3);
        const gy = n3((cy + a[1] + b[1]) / 3);
        segs.push(`M${a[0]} ${a[1]}L${gx} ${gy}`);
        segs.push(`M${b[0]} ${b[1]}L${gx} ${gy}`);
        segs.push(`M${cx} ${cy}L${gx} ${gy}`);
      }
    }
  }
  return { d: segs.join(""), w: pitchX, h: pitchY * 2 };
}

/**
 * SEIGAIHA (青海波) — "blue ocean waves".
 *
 * Concentric arc fans on a half-drop lattice. Each fan is a set of nested
 * semicircles; the row below is offset by half a pitch so the fans interlock
 * into scales. Tile is one pitch wide by half a fan-radius tall.
 */
function seigaihaPath(R: number, rings: number) {
  const segs: string[] = [];
  const fan = (cx: number, cy: number) => {
    for (let i = 1; i <= rings; i++) {
      const r = (R * i) / rings;
      segs.push(`M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}`);
    }
  };
  // two interlocking rows
  for (let col = -1; col <= 2; col++) {
    fan(col * R * 2, R);
    fan(col * R * 2 + R, R * 1.5);
  }
  return { d: segs.join(""), w: R * 2, h: R * 0.5 };
}

/**
 * SAYAGATA (紗綾形) — interlocking key fret.
 *
 * A lattice of linked manji-style hooks. Built as an L-hook repeated in four
 * rotations about the cell centre, which is how the woven original resolves.
 */
function sayagataPath(S: number) {
  const u = S / 4;
  const segs: string[] = [];
  for (let row = -1; row <= 2; row++) {
    for (let col = -1; col <= 2; col++) {
      const ox = col * S;
      const oy = row * S;
      for (let q = 0; q < 4; q++) {
        const rot = deg(90 * q);
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        // hook in local coords about the cell centre
        const pts: [number, number][] = [
          [0, 0], [2 * u, 0], [2 * u, -u], [u, -u], [u, -2 * u],
        ];
        const mapped = pts.map(([x, y]) => {
          const cx = x * cos - y * sin;
          const cy = x * sin + y * cos;
          return `${n3(ox + S / 2 + cx)} ${n3(oy + S / 2 + cy)}`;
        });
        segs.push(`M${mapped.join("L")}`);
      }
    }
  }
  return { d: segs.join(""), w: S, h: S };
}

/**
 * KOLAM / MUGGU — sikku (looped) kolam.
 *
 * Continuous loops woven around a pulli dot grid. The loops are approximated
 * with interlocking circles on two offset lattices, which is how the real
 * unbroken line resolves geometrically.
 */
function kolamPath(S: number) {
  const r = S * 0.35;
  const segs: string[] = [];
  for (let row = -1; row <= 2; row++) {
    for (let col = -1; col <= 2; col++) {
      segs.push(
        `M${col * S + r} ${row * S}A${r} ${r} 0 1 1 ${col * S - r} ${row * S}A${r} ${r} 0 1 1 ${col * S + r} ${row * S}`
      );
    }
  }
  return { d: segs.join(""), w: S, h: S };
}

// ---------------------------------------------------------------- component

const ASANOHA = asanohaPath(26);
const SEIGAIHA = seigaihaPath(30, 4);
const SAYAGATA = sayagataPath(34);
const KOLAM = kolamPath(38);

/**
 * Mount once, near the root. Emits every pattern into a zero-size svg so the
 * ids resolve document-wide.
 */
export default function Patterns() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        {/* ---- Japanese wagara ---- */}
        <pattern id="asanoha" patternUnits="userSpaceOnUse" width={ASANOHA.w} height={ASANOHA.h}>
          <path d={ASANOHA.d} fill="none" stroke="currentColor" strokeWidth="0.7" />
        </pattern>

        <pattern id="seigaiha" patternUnits="userSpaceOnUse" width={SEIGAIHA.w} height={SEIGAIHA.h}>
          <path d={SEIGAIHA.d} fill="none" stroke="currentColor" strokeWidth="0.8" />
        </pattern>

        <pattern id="sayagata" patternUnits="userSpaceOnUse" width={SAYAGATA.w} height={SAYAGATA.h}>
          <path d={SAYAGATA.d} fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="square" />
        </pattern>

        {/* ---- Telugu kolam ---- */}
        <pattern id="kolam" patternUnits="userSpaceOnUse" width={KOLAM.w} height={KOLAM.h}>
          <path d={KOLAM.d} fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="1.5" fill="currentColor" />
          <circle cx={KOLAM.w} cy="0" r="1.5" fill="currentColor" />
          <circle cx="0" cy={KOLAM.h} r="1.5" fill="currentColor" />
          <circle cx={KOLAM.w} cy={KOLAM.h} r="1.5" fill="currentColor" />
        </pattern>

        {/* ---- manga screentone ---- */}
        <pattern id="screentone" patternUnits="userSpaceOnUse" width="6" height="6">
          <circle cx="3" cy="3" r="1.15" fill="currentColor" />
        </pattern>
        <pattern id="screentone-fine" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.62" fill="currentColor" />
        </pattern>

        {/* ---- manga speed lines: radial hatch, for impact panels ---- */}
        <pattern id="speedlines" patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1.1" />
        </pattern>

        {/* soft vertical fade, for masking ornament out toward panel centres */}
        <linearGradient id="fadeDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
