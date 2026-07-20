"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "@/lib/palette";

/**
 * SUDARSHANA CHAKRA
 *
 * Rebuilt on two rules, because both were the source of the broken symmetry:
 *
 * 1. ONE ANGULAR BASE. Every ring count is a divisor or multiple of 24
 *    (12 / 24 / 48). Previously 12 spokes fought 16 petals fought 36 jali
 *    fought 48 beads -- counts that share almost no divisors, so the rings
 *    only agreed at a handful of points and visibly drifted everywhere else.
 *
 * 2. ONE RADIAL TABLE. Bands, grooves, studs and flame bases are all derived
 *    from the BANDS table below. Nothing is hand-typed twice, so nothing can
 *    fall out of alignment. Previously the groove radii were typed separately
 *    from the band radii and slowly disagreed.
 *
 * And all pseudo-random jitter is gone. The old code offset each flame by a
 * hash-derived angle and length; that reads as sloppiness, not craft. Fire
 * gets its life here from the SHAPE of the tongue (a leaning, curling cut)
 * repeated exactly -- which also matches the iconography, where the flames
 * are a prabha-mandala, a continuous nimbus of rays, rather than loose sparks.
 */

// ---------------------------------------------------------------- constants

const DEPTH = 0.09;

const EX: THREE.ExtrudeGeometryOptions = {
  depth: DEPTH,
  bevelEnabled: true,
  bevelThickness: 0.02,
  bevelSize: 0.02,
  bevelSegments: 3,
  curveSegments: 22,
};

const Z = -DEPTH / 2; // so extruded parts straddle the plate plane

// The single radial table. r = centre radius, w = width, t = thickness.
// Band 1 is now PIERCED jali openwork rather than a solid band with studs
// applied on top -- real jali is cut through, and you should see the field
// behind it.
const BANDS = [
  { r: 0.88, w: 0.12, t: 0.10, lite: false }, // inner collar, outside the lotus
  { r: 1.54, w: 0.20, t: 0.10, lite: false }, // JALI -- pierced, 48 openings
  { r: 1.74, w: 0.10, t: 0.08, lite: true }, // bright band, carries the beads
  { r: 1.88, w: 0.09, t: 0.09, lite: false }, // outer lip, the flames spring from here
] as const;

const JALI_BAND = 1;

// Spokes span the gap between band 0 and band 1, with clearance at both ends.
const SPOKE_IN = BANDS[0].r + BANDS[0].w / 2 + 0.03; // 0.97
const SPOKE_OUT = BANDS[1].r - BANDS[1].w / 2 - 0.03; // 1.41

// Backing plate: fills the medallion out to the inner edge of the jali, so the
// gaps between spokes read as dark recessed metal instead of showing the
// background straight through. This is most of what makes it read as a solid
// cast object rather than a flat cut-out.
const PLATE_R = BANDS[1].r - BANDS[1].w / 2 + 0.01;

// Centre stack: hub -> ashtadala rosette -> bindu.
//
// This replaced a shatkona. The shatkona is authentic (it is the core of the
// Sri Yantra) but rendered as a clean isolated six-pointed outline it read to
// most viewers as a Star of David, which is the wrong association for a
// Vaishnava Sudarshana chakra. The ashtadala -- the eight-petalled lotus -- is
// a traditional Vaishnava centre and is unambiguous.
//
// Eight divides 24, so every third petal of the outer lotus collar lines up
// with a rosette petal. The 24-fold rule holds.
const HUB_R = 0.34;
const ROSETTE_LEN = 0.26;
const ROSETTE_W = 0.075;

// A crossed vajra used to live at the centre too and was completely invisible:
// its bars sat inside the old shatkona's hexagon at the same tone, so it read
// as four stray dots. It now terminates the four cardinal spokes instead.
const PETAL_BASE = 0.48;
const PETAL_LEN = 0.30;

// Flames spring from the outer lip.
const FLAME_BASE = BANDS[3].r + BANDS[3].w / 2; // 1.925

const ring = (n: number, off = 0) =>
  Array.from({ length: n }, (_, i) => off + (i * Math.PI * 2) / n);

// ---------------------------------------------------------------- profiles

function bandProfile(r: number, w: number, t: number) {
  const h = t / 2;
  const i = r - w / 2;
  const o = r + w / 2;
  const b = Math.min(w, t) * 0.28;
  return [
    new THREE.Vector2(i, -h + b),
    new THREE.Vector2(i, h - b),
    new THREE.Vector2(i + b, h),
    new THREE.Vector2(o - b, h),
    new THREE.Vector2(o, h - b),
    new THREE.Vector2(o, -h + b),
    new THREE.Vector2(o - b, -h),
    new THREE.Vector2(i + b, -h),
    new THREE.Vector2(i, -h + b),
  ];
}

/**
 * A fire tongue, not a blade.
 *
 * The old shape was symmetric and pointed -- it read as a gear tooth. A real
 * flame leans, swells low, narrows through the middle and CURLS at the tip.
 * `lean` drives that hook; every flame gets the same lean, so repeating it
 * around the rim makes the whole nimbus appear to rotate in one direction.
 */
function flameShape(len: number, w: number, lean: number) {
  const s = new THREE.Shape();
  s.moveTo(-w, 0);
  // Leading edge: swell out low, then sweep in toward the curl.
  s.bezierCurveTo(
    -w * 1.28, len * 0.20,
    -w * 0.98, len * 0.54,
    -w * 0.30 + lean * len * 0.16, len * 0.79
  );
  // Into the curled tip.
  s.bezierCurveTo(
    lean * len * 0.09, len * 0.91,
    lean * len * 0.25, len * 0.985,
    lean * len * 0.34, len
  );
  // The tip hooks back on itself -- this is what makes it read as fire.
  s.bezierCurveTo(
    lean * len * 0.19, len * 0.93,
    lean * len * 0.03, len * 0.84,
    w * 0.20, len * 0.64
  );
  // Trailing edge falls back to the base.
  s.bezierCurveTo(
    w * 0.64, len * 0.40,
    w * 1.06, len * 0.18,
    w, 0
  );
  s.closePath();
  return s;
}

/** Layered lotus petal: outer envelope with a raised inner leaf drawn separately. */
function petalShape(len: number, w: number) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(-w, len * 0.26, -w * 0.86, len * 0.74, 0, len);
  s.bezierCurveTo(w * 0.86, len * 0.74, w, len * 0.26, 0, 0);
  return s;
}

function spokeShape(inner: number, outer: number, wi: number, wo: number) {
  const s = new THREE.Shape();
  const shoulder = outer - (outer - inner) * 0.14;
  s.moveTo(-wi, inner);
  s.lineTo(-wo, shoulder);
  s.lineTo(0, outer);
  s.lineTo(wo, shoulder);
  s.lineTo(wi, inner);
  s.closePath();
  return s;
}

/**
 * Pierced jali band: a ring with `n` openings cut clean through it.
 *
 * The previous pass faked this by scattering octahedron studs on a solid band.
 * Jali is openwork -- the whole point is that it is cut through and the field
 * shows behind it. ExtrudeGeometry takes multiple holes, so the openings are
 * genuine holes in the shape rather than applied decoration.
 */
function jaliBand(r: number, w: number, n: number, holeR: number) {
  const s = new THREE.Shape();
  s.absarc(0, 0, r + w / 2, 0, Math.PI * 2, false);

  const bore = new THREE.Path();
  bore.absarc(0, 0, r - w / 2, 0, Math.PI * 2, true);
  s.holes.push(bore);

  for (let i = 0; i < n; i++) {
    const a = (i * Math.PI * 2) / n;
    const p = new THREE.Path();
    p.absarc(Math.cos(a) * r, Math.sin(a) * r, holeR, 0, Math.PI * 2, true);
    s.holes.push(p);
  }
  return s;
}

/** Shatkona -- two interlocking triangles. Built as one outlined triangle, used twice. */
function triRing(r: number, inner = 0.80) {
  const s = new THREE.Shape();
  const pts = (rad: number) =>
    Array.from({ length: 3 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
      return new THREE.Vector2(Math.cos(a) * rad, Math.sin(a) * rad);
    });
  const outer = pts(r);
  s.moveTo(outer[0].x, outer[0].y);
  s.lineTo(outer[1].x, outer[1].y);
  s.lineTo(outer[2].x, outer[2].y);
  s.closePath();
  const hole = new THREE.Path();
  const inr = pts(r * inner);
  hole.moveTo(inr[0].x, inr[0].y);
  hole.lineTo(inr[1].x, inr[1].y);
  hole.lineTo(inr[2].x, inr[2].y);
  hole.closePath();
  s.holes.push(hole);
  return s;
}

// ---------------------------------------------------------------- component

export default function ChakraSculpt({ scale = 1 }: { scale?: number }) {
  const g = useRef<THREE.Group>(null);

  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: PALETTE.gold, metalness: 1, roughness: 0.42, envMapIntensity: 1.1 }),
    []
  );
  const goldLite = useMemo(
    () => new THREE.MeshStandardMaterial({ color: PALETTE.goldLite, metalness: 1, roughness: 0.26, envMapIntensity: 1.4 }),
    []
  );
  const goldPale = useMemo(
    () => new THREE.MeshStandardMaterial({ color: PALETTE.goldPale, metalness: 1, roughness: 0.18, envMapIntensity: 1.6 }),
    []
  );
  const goldDark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: PALETTE.goldDark, metalness: 1, roughness: 0.68, envMapIntensity: 0.42 }),
    []
  );
  const ruby = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: PALETTE.ruby, metalness: 0, roughness: 0.12,
      transmission: 0.55, thickness: 0.25, clearcoat: 1, ior: 1.7,
    }),
    []
  );
  const kumkum = useMemo(
    () => new THREE.MeshStandardMaterial({ color: PALETTE.kumkum, metalness: 0.2, roughness: 0.6 }),
    []
  );
  // Backing plate. Very dark, quite rough -- it must not compete, it exists to
  // give the openwork something to sit against.
  const plate = useMemo(
    () => new THREE.MeshStandardMaterial({ color: PALETTE.goldPlate, metalness: 0.9, roughness: 0.55, envMapIntensity: 0.75 }),
    []
  );

  // --- geometry, all derived from the tables above ---

  // Band 1 is pierced openwork; the rest stay lathed.
  const bands = useMemo(
    () =>
      BANDS.map((b, i) =>
        i === JALI_BAND ? null : new THREE.LatheGeometry(bandProfile(b.r, b.w, b.t), 192)
      ),
    []
  );

  const jaliGeo = useMemo(
    () =>
      new THREE.ExtrudeGeometry(jaliBand(BANDS[JALI_BAND].r, BANDS[JALI_BAND].w, 48, 0.045), {
        ...EX,
        depth: BANDS[JALI_BAND].t,
        bevelSize: 0.012,
        bevelThickness: 0.012,
        curveSegments: 12,
      }),
    []
  );

  const plateGeo = useMemo(() => new THREE.CircleGeometry(PLATE_R, 128), []);

  // Two engraved grooves per band, inset from its edges. Derived, never typed.
  const grooveRadii = useMemo(
    () => BANDS.flatMap((b) => [b.r - b.w * 0.32, b.r + b.w * 0.32]),
    []
  );

  const flameBig = useMemo(() => new THREE.ExtrudeGeometry(flameShape(0.56, 0.072, 0.55), EX), []);
  const flameSm = useMemo(
    () => new THREE.ExtrudeGeometry(flameShape(0.32, 0.048, 0.55), { ...EX, depth: DEPTH * 0.8 }),
    []
  );
  const flameCore = useMemo(
    () => new THREE.ExtrudeGeometry(flameShape(0.34, 0.040, 0.55), { ...EX, depth: DEPTH * 0.5, bevelSize: 0.012, bevelThickness: 0.012 }),
    []
  );

  const petal = useMemo(() => new THREE.ExtrudeGeometry(petalShape(PETAL_LEN, 0.085), EX), []);
  const petalInner = useMemo(
    () => new THREE.ExtrudeGeometry(petalShape(PETAL_LEN * 0.62, 0.048), { ...EX, depth: DEPTH * 0.55 }),
    []
  );

  const spoke = useMemo(
    () => new THREE.ExtrudeGeometry(spokeShape(SPOKE_IN, SPOKE_OUT, 0.062, 0.038), EX),
    []
  );
  // Ashtadala: eight raised lotus petals, each with a smaller inner leaf.
  const rosette = useMemo(
    () => new THREE.ExtrudeGeometry(petalShape(ROSETTE_LEN, ROSETTE_W), { ...EX, depth: DEPTH * 0.7 }),
    []
  );
  const rosetteInner = useMemo(
    () => new THREE.ExtrudeGeometry(petalShape(ROSETTE_LEN * 0.58, ROSETTE_W * 0.5), { ...EX, depth: DEPTH * 0.45 }),
    []
  );
  const hubWell = useMemo(() => new THREE.CylinderGeometry(HUB_R * 0.52, HUB_R * 0.52, 0.06, 64), []);

  const gem = useMemo(() => new THREE.SphereGeometry(0.048, 24, 24), []);
  const hub = useMemo(() => new THREE.CylinderGeometry(HUB_R, HUB_R, 0.12, 96), []);
  const hubRim = useMemo(() => new THREE.TorusGeometry(HUB_R, 0.026, 20, 96), []);
  const bead = useMemo(() => new THREE.SphereGeometry(0.026, 14, 14), []);
  const groove = useMemo(() => new THREE.TorusGeometry(1, 0.0065, 10, 192), []);
  const vTip = useMemo(() => new THREE.OctahedronGeometry(0.045), []);
  const bindu = useMemo(() => new THREE.SphereGeometry(0.038, 24, 24), []);

  useFrame((s) => {
    if (g.current) g.current.rotation.z = s.clock.elapsedTime * 0.08;
  });

  return (
    <group rotation={[-0.26, 0.16, 0]} scale={scale}>
      <group ref={g}>
        {/* ---- backing plate: gives the openwork something to sit against ---- */}
        <mesh geometry={plateGeo} material={plate} position={[0, 0, -0.055]} />

        {/* ---- lathed bands ---- */}
        {bands.map((bg, i) =>
          bg ? (
            <mesh key={"b" + i} geometry={bg} material={BANDS[i].lite ? goldLite : gold} rotation={[Math.PI / 2, 0, 0]} />
          ) : null
        )}

        {/* ---- pierced jali band ---- */}
        <mesh geometry={jaliGeo} material={gold} position={[0, 0, -BANDS[JALI_BAND].t / 2]} />

        {/* ---- engraved grooves, derived from the band table ---- */}
        {grooveRadii.map((r, i) => (
          <mesh key={"gv" + i} geometry={groove} material={goldDark} scale={[r, r, 1]} position={[0, 0, 0.052]} />
        ))}

        {/* ---- 48 beads on the bright band ---- */}
        {ring(48).map((a, i) => (
          <group key={"bd" + i} rotation={[0, 0, a]}>
            <mesh geometry={bead} material={goldLite} position={[0, BANDS[2].r, 0.052]} />
          </group>
        ))}

        {/*
          prabha-mandala: 24 tall tongues + 24 short, interleaved.

          Every sixth tongue (so four, at the cardinals) is taller and pale.
          The iconography puts four flames symmetrically on the outermost
          circle, and unlike the hash-jitter this replaces, a 4-fold accent on
          a 24-fold ring reads as intent rather than noise.
        */}
        {ring(24).map((a, i) => {
          const cardinal = i % 6 === 0;
          return (
            <group key={"fb" + i} rotation={[0, 0, a]}>
              <mesh
                geometry={flameBig}
                material={cardinal ? goldPale : goldLite}
                position={[0, FLAME_BASE, Z]}
                scale={cardinal ? [1.1, 1.22, 1] : [1, 1, 1]}
              />
              <mesh
                geometry={flameCore}
                material={goldPale}
                position={[0, FLAME_BASE + 0.03, Z + DEPTH * 0.42]}
                scale={cardinal ? [1.1, 1.22, 1] : [1, 1, 1]}
              />
            </group>
          );
        })}
        {ring(24, Math.PI / 24).map((a, i) => (
          <group key={"fs" + i} rotation={[0, 0, a]}>
            <mesh geometry={flameSm} material={gold} position={[0, FLAME_BASE - 0.01, Z]} />
          </group>
        ))}

        {/*
          ---- plate turning grooves ----
          The recessed plate was a large dead zone between the lotus and the
          jali. Fine concentric grooves read as lathe/spinning marks on cast
          brass and give the light something to catch there.
        */}
        {[1.02, 1.10, 1.18, 1.26, 1.34, 1.40].map((r, i) => (
          <mesh key={"pg" + i} geometry={groove} material={goldDark} scale={[r, r, 1]} position={[0, 0, -0.048]} />
        ))}

        {/*
          ---- 12 spokes, each set with a ruby at mid-span ----
          The four cardinal spokes carry vajra tips. The crossed vajra used to
          sit at the centre where it was completely swallowed by the shatkona;
          out here it reads, and it reinforces the same 4-fold accent the
          cardinal flames use.
        */}
        {ring(12).map((a, i) => {
          const cardinal = i % 3 === 0;
          return (
            <group key={"s" + i} rotation={[0, 0, a]}>
              <mesh geometry={spoke} material={goldLite} position={[0, 0, Z]} />
              <mesh geometry={gem} material={ruby} position={[0, (SPOKE_IN + SPOKE_OUT) / 2, 0.07]} />
              {cardinal && (
                <mesh geometry={vTip} material={goldPale} position={[0, SPOKE_OUT - 0.02, 0.055]} />
              )}
            </group>
          );
        })}

        {/* ---- 24 lotus petals: every other one lines up with a spoke ---- */}
        {ring(24).map((a, i) => (
          <group key={"p" + i} rotation={[0, 0, a]}>
            <mesh geometry={petal} material={gold} position={[0, PETAL_BASE, Z]} />
            <mesh geometry={petalInner} material={goldLite} position={[0, PETAL_BASE + 0.05, Z + DEPTH * 0.5]} />
          </group>
        ))}

        {/*
          ---- centre stack ----
          Rebuilt because the hub and vajra were both invisible in the last
          pass: the vajra was buried inside the shatkona at the same gold tone,
          and the hub read as background. Now the hub is a dark kumkum disc and
          the vajra sits on top of it in pale gold -- maximum tonal contrast, so
          it reads. Order back-to-front: hub, shatkona, vajra, bindu.
        */}
        <mesh geometry={hub} material={kumkum} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.01]} />
        <mesh geometry={hubRim} material={goldLite} />

        {/* ashtadala: eight-petalled lotus, layered */}
        {ring(8).map((a, i) => (
          <group key={"as" + i} rotation={[0, 0, a]}>
            <mesh geometry={rosette} material={goldLite} position={[0, 0.06, 0.02]} />
            <mesh geometry={rosetteInner} material={goldPale} position={[0, 0.10, 0.055]} />
          </group>
        ))}

        {/* recessed well at the very centre, so the bindu sits IN something */}
        <mesh geometry={hubWell} material={goldDark} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} />

        {/* bindu: the still point */}
        <mesh geometry={bindu} material={goldPale} position={[0, 0, 0.07]} />
      </group>
    </group>
  );
}
