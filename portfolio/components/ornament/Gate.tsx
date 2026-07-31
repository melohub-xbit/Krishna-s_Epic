"use client";

/**
 * TORII ∘ TORANA — the fused gate (02 §2.3, roadmap Phase 4).
 *
 * One gate, both thresholds. A torii marks the passage from the mundane to the
 * sacred; a torana marks the entrance to a sacred enclosure. They are almost
 * certainly the same object historically — scholars trace the torii's form back to
 * the Indian torana, and the words themselves may be cognate. That is not a
 * decorative pun, it is the §01 rhyme this whole site is built on, and it is why
 * this is ONE element rather than two side by side.
 *
 * ================================================================
 * AUTHENTIC FORM — the myōjin torii, member by member
 * ================================================================
 * Reference: en.wikipedia.org/wiki/Torii (and JAANUS, linked from it). The
 * myōjin torii is by far the most common style and the one with curved lintels,
 * so it is the one a reader recognises as "a torii". Its members, all built here
 * and all named in the code below:
 *
 *   hashira (柱)     the two pillars. Slightly TAPERED, and leaning inward — that
 *                    lean is called uchikorobi (内転び) and it is what stops the
 *                    gate reading as a goalpost.
 *   kasagi (笠木)    the top lintel, curving upward at the ends. The upward curve
 *                    is sorimashi (反り増し). Pentagonal in section, so the real
 *                    thing shows a ridge line along its length.
 *   shimaki (島木)   a second, rectangular lintel immediately under the kasagi,
 *                    following the same curve. A myōjin torii has both.
 *   nuki (貫)        the tie-beam below, PROTRUDING past the pillars.
 *   kusabi (楔)      the wedges that lock the nuki. Often purely ornamental, and
 *                    always present in this style.
 *   gakuzuka (額束)  the short strut standing on the nuki, centred, carrying the
 *                    shrine's name tablet.
 *   nemaki (根巻)    a black sleeve at each pillar's foot.
 *
 * COLOUR IS ALSO SPECIFIED, and it happens to fit the locked palette exactly:
 * a painted torii is vermilion, and "the colour black is limited to the kasagi
 * and the nemaki". Vermilion is kumkum here. Nothing had to be invented and
 * nothing had to be bent — which is usually the sign a rhyme is real.
 *
 * ================================================================
 * THE FUSION — the garland IS the nuki
 * ================================================================
 * §2.3: "torii posture carrying a torana garland as its nuki." So the tie-beam is
 * drawn as a beam AND a mango-leaf catenary hangs from it, using the same
 * cosh-based construction as `Torana` in Motifs.tsx (see PROJECT-STATUS §4 for why
 * a hanging garland must be a catenary and not a quadratic curve). The gate is
 * structurally a torii and ornamentally a torana, at the same time, in the same
 * members.
 *
 * ================================================================
 * DRAWABLE
 * ================================================================
 * Every stroke is a path with `data-stroke` in build order — foot to lintel, the
 * way a gate is actually raised — so `inkDraw` can draw the gate on. It is used
 * that way when an epic is entered.
 */
import { n3 } from "@/lib/n3";

const VW = 400;
const VH = 300;

const cosh = (x: number) => (Math.exp(x) + Math.exp(-x)) / 2;

/* ------------------------------------------------------------- geometry */

/** Pillar lean (uchikorobi) as a fraction of height, and taper at the top. */
const KOROBI = 0.045;
const TAPER = 0.82;

const GROUND = VH - 8;
const TOP = 26; // underside of the shimaki
const HALF = VW / 2;

/** Pillar centre x at a given y, leaning inward as it rises. */
function pillarX(side: -1 | 1, y: number) {
  const base = HALF + side * VW * 0.34;
  const t = (GROUND - y) / (GROUND - TOP);
  return base - side * VW * KOROBI * t;
}

const PW_BASE = 20; // pillar width at the foot

/** One tapered, leaning pillar as a closed quad. */
function hashira(side: -1 | 1) {
  const halfB = PW_BASE / 2;
  const halfT = (PW_BASE * TAPER) / 2;
  const xb = pillarX(side, GROUND);
  const xt = pillarX(side, TOP);
  return (
    `M${n3(xb - halfB)} ${n3(GROUND)}` +
    `L${n3(xb + halfB)} ${n3(GROUND)}` +
    `L${n3(xt + halfT)} ${n3(TOP)}` +
    `L${n3(xt - halfT)} ${n3(TOP)}Z`
  );
}

/**
 * A lintel that curves upward toward its ends (sorimashi). Built as a swept band
 * rather than a stroked path so the ends can be thicker than the middle, which is
 * what gives a real kasagi its lift.
 */
function lintel(y: number, overhang: number, thick: number, rise: number) {
  const x0 = HALF - VW * 0.34 - overhang;
  const x1 = HALF + VW * 0.34 + overhang;
  const N = 40;
  const curve = (x: number) => {
    const t = (x - HALF) / (x1 - HALF); // -1 … 1
    return y - rise * t * t;
  };
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = x0 + ((x1 - x0) * i) / N;
    const yy = curve(x);
    // Ends thicken slightly — "the ends of the kasagi are slightly thicker,
    // giving the impression of an upward slant".
    const t = Math.abs((x - HALF) / (x1 - HALF));
    const th = thick * (1 + 0.35 * t * t);
    top.push(`${n3(x)} ${n3(yy - th / 2)}`);
    bot.push(`${n3(x)} ${n3(yy + th / 2)}`);
  }
  return `M${top.join("L")}L${bot.reverse().join("L")}Z`;
}

/** The kasagi's ridge line — the visible edge of its pentagonal section. */
function ridge(y: number, overhang: number, rise: number) {
  const x0 = HALF - VW * 0.34 - overhang;
  const x1 = HALF + VW * 0.34 + overhang;
  const pts = Array.from({ length: 41 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / 40;
    const t = (x - HALF) / (x1 - HALF);
    return `${n3(x)} ${n3(y - rise * t * t)}`;
  });
  return `M${pts.join("L")}`;
}

const NUKI_Y = TOP + 52;
const NUKI_TH = 13;

/** The garland hanging from the nuki: the same catenary as `Torana`. */
function garland() {
  const x0 = pillarX(-1, NUKI_Y);
  const x1 = pillarX(1, NUKI_Y);
  const span = (x1 - x0) / 2;
  const a = 120;
  const SAG = 34;
  const peak = cosh(span / a) - 1;
  const y = (x: number) =>
    NUKI_Y + NUKI_TH / 2 + ((cosh(span / a) - cosh((x - x0 - span) / a)) / peak) * SAG;

  const pts = Array.from({ length: 49 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / 48;
    return `${n3(x)} ${n3(y(x))}`;
  });
  // 12 hang points — the 12/24/48 angular rule applies to counted ornament too.
  const leaves = Array.from({ length: 12 }, (_, i) => {
    const t = 0.05 + (i / 11) * 0.9;
    const x = x0 + (x1 - x0) * t;
    return { x: n3(x), y: n3(y(x)), marigold: i % 3 === 1 };
  });
  return { d: `M${pts.join("L")}`, leaves };
}

const G = garland();

export interface GateProps {
  width?: number;
  /** Which epic is being entered — only the tablet text differs. */
  label?: string;
  labelTe?: string;
  /** Emit `data-stroke` in raise order so inkDraw can draw the gate on. */
  drawable?: boolean;
  className?: string;
}

export default function Gate({
  width = 400,
  label,
  labelTe,
  drawable = false,
  className,
}: GateProps) {
  // Raise order, foot to lintel — the order a gate is actually built in, which is
  // the order it should draw in. Numbers are consumed by inkDraw's "data-stroke".
  let k = 0;
  const st = () => (drawable ? { "data-stroke": String(k++) } : {});

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width={width}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* hashira — the two pillars, tapered and leaning inward (uchikorobi) */}
      <path d={hashira(-1)} {...st()} />
      <path d={hashira(1)} {...st()} />

      {/* nemaki — the black root sleeve. One of only two members that may be
          black on a painted torii; the other is the kasagi. */}
      {([-1, 1] as const).map((side) => {
        const x = pillarX(side, GROUND);
        return (
          <rect
            key={`nemaki${side}`}
            x={n3(x - PW_BASE / 2 - 1.5)}
            y={n3(GROUND - 22)}
            width={n3(PW_BASE + 3)}
            height={22}
            className="gate-nemaki"
            {...st()}
          />
        );
      })}

      {/* nuki — the tie-beam, protruding past the pillars */}
      <rect
        x={n3(pillarX(-1, NUKI_Y) - PW_BASE / 2 - 16)}
        y={n3(NUKI_Y - NUKI_TH / 2)}
        width={n3(pillarX(1, NUKI_Y) - pillarX(-1, NUKI_Y) + PW_BASE + 32)}
        height={NUKI_TH}
        {...st()}
      />

      {/* kusabi — the wedges locking the nuki. Ornamental in most gates, and
          always drawn: their absence is what makes a torii look like scaffolding. */}
      {([-1, 1] as const).map((side) => {
        const x = pillarX(side, NUKI_Y);
        const w = 7;
        return (
          <path
            key={`kusabi${side}`}
            d={`M${n3(x - w)} ${n3(NUKI_Y - NUKI_TH / 2 - 4)}L${n3(x + w)} ${n3(
              NUKI_Y - NUKI_TH / 2 - 4
            )}L${n3(x + w * 0.55)} ${n3(NUKI_Y + NUKI_TH / 2 + 4)}L${n3(
              x - w * 0.55
            )} ${n3(NUKI_Y + NUKI_TH / 2 + 4)}Z`}
            {...st()}
          />
        );
      })}

      {/* THE FUSION: a torana garland hangs from the nuki. Catenary, not a
          quadratic — a hanging chain is a cosh curve and the eye knows it. */}
      <path d={G.d} className="gate-string" {...st()} />
      {G.leaves.map((l, i) =>
        l.marigold ? (
          <circle key={`m${i}`} cx={l.x} cy={n3(l.y + 7)} r={4.2} className="gate-marigold" />
        ) : (
          // A mango leaf: long, pointed, hanging tip-down with a midrib.
          <g key={`l${i}`} className="gate-leaf">
            <path
              d={`M${l.x} ${n3(l.y + 1)}C${n3(l.x - 4.6)} ${n3(l.y + 8)} ${n3(
                l.x - 3
              )} ${n3(l.y + 17)} ${l.x} ${n3(l.y + 21)}C${n3(l.x + 3)} ${n3(
                l.y + 17
              )} ${n3(l.x + 4.6)} ${n3(l.y + 8)} ${l.x} ${n3(l.y + 1)}Z`}
            />
            <path d={`M${l.x} ${n3(l.y + 3)}V${n3(l.y + 19)}`} strokeWidth={1} />
          </g>
        )
      )}

      {/* shimaki — the second lintel, under the kasagi, following its curve */}
      <path d={lintel(TOP + 2, 10, 11, 16)} {...st()} />

      {/* kasagi — the top lintel. Black on a painted gate, curving up at the
          ends (sorimashi), with its pentagonal section's ridge drawn. */}
      <path d={lintel(TOP - 12, 22, 14, 20)} className="gate-kasagi" {...st()} />
      <path d={ridge(TOP - 12, 22, 20)} className="gate-ridge" strokeWidth={1.1} />

      {/* gakuzuka — the centre strut on the nuki, carrying the name tablet */}
      <rect x={n3(HALF - 26)} y={n3(TOP + 14)} width={52} height={n3(NUKI_Y - TOP - 20)} {...st()} />
      {(label || labelTe) && (
        <g className="gate-tablet">
          {labelTe && (
            <text x={HALF} y={n3(TOP + 30)} textAnchor="middle" className="gate-te">
              {labelTe}
            </text>
          )}
          {label && (
            <text x={HALF} y={n3(TOP + 44)} textAnchor="middle" className="gate-en">
              {label}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
