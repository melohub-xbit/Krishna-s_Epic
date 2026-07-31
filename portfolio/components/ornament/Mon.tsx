"use client";

/**
 * THE CREST ROLL — one kamon per project. Spec: 04-mon-system.md §4.1–4.2.
 *
 * A kamon compresses an identity into a bounded emblem, which is exactly what
 * a project needs on a manga chapter cover. The rules from §4.1 are mandatory
 * and they are what make twenty separate drawings read as ONE family:
 *
 *   1. MARU enclosure — every mon sits in the same circle, same weight.
 *   2. SINGLE INK WEIGHT inside. No hierarchy by thickness; hierarchy comes
 *      from density. This is the rule most likely to be broken by accident,
 *      and breaking it is instantly visible when the roll is seen together.
 *   3. Built from the project's actual MECHANISM, not its logo.
 *   4. The 12/24/48 angular rule wherever the form is radial — the same rule
 *      the chakra obeys, so the crests belong to the same object.
 *   5. Reads at 48px, rewards zoom at 480px. Those are both acceptance
 *      criteria (08 §8.8 P2), not aspirations: interior detail finer than
 *      ~1.5 units disappears at 48px, and a mon with no interior detail is
 *      dead at 480px.
 *
 * Every blazon is written above its component. Keep them: a future agent
 * editing paths needs to know what the shape MEANS, or the mon quietly drifts
 * into decoration.
 *
 * DRAWABLE: these are uniform line art, so they use inkDraw's DIRECT mode —
 * no `data-ink-reveal` here. That is the whole point of the two-mode split in
 * 08 §8.5: tapered brush forms need the reveal mask, line art does not.
 * Interiors are therefore STROKED, never filled, or there is nothing to draw.
 *
 * Coordinates: 100×100 user space, centre (50,50), maru radius 44. Anything
 * computed goes through n3() — hydration, PROJECT-STATUS §4 gotcha 1.
 */
import { n3 } from "@/lib/n3";

const C = 50;
const R_MARU = 44;

/** Point on a circle. 0° is 12 o'clock, clockwise — the way a crest is read. */
function polar(r: number, deg: number, cx = C, cy = C) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [n3(cx + r * Math.cos(a)), n3(cy + r * Math.sin(a))] as const;
}

function pt(r: number, deg: number, cx = C, cy = C) {
  const [x, y] = polar(r, deg, cx, cy);
  return `${x} ${y}`;
}

/** Arc between two angles at one radius. */
function arc(r: number, from: number, to: number, cx = C, cy = C) {
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  return `M${pt(r, from, cx, cy)}A${n3(r)} ${n3(r)} 0 ${large} ${sweep} ${pt(r, to, cx, cy)}`;
}

/** N radial ticks. N must be 12, 24 or 48 — the angular rule (§4.1 rule 4). */
function ticks(n: 12 | 24 | 48, r0: number, r1: number, offset = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = offset + (360 / n) * i;
    return `M${pt(r0, a)}L${pt(r1, a)}`;
  }).join("");
}

/** Repeat a shape at N angles about the centre. */
function radial(n: 12 | 24 | 48, fn: (deg: number, i: number) => string, offset = 0) {
  return Array.from({ length: n }, (_, i) => fn(offset + (360 / n) * i, i)).join("");
}

// ---------------------------------------------------------------- the roll

/**
 * Each entry is the interior only — the maru is drawn by <Mon/> so the
 * enclosure is guaranteed identical across the set.
 */
interface Blazon {
  /** What the shape means. §4.2. */
  blazon: string;
  /** Interior path data, one `d` per stroke group. */
  d: () => string[];
}

/* ============================================================ Ramayanam */

const dalsp: Blazon = {
  blazon:
    "A tree of 24 branches, half pruned clean — cut branches end in scissor-marks; entropy dots thin toward the cut side.",
  d: () => {
    const trunk = `M50 82L50 44`;
    // 24 branches (the angular rule), 12 per side, rising from the trunk.
    const branches: string[] = [];
    const marks: string[] = [];
    const dots: string[] = [];
    for (let i = 0; i < 24; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const step = Math.floor(i / 2); // 0..11 up the trunk
      const y = n3(76 - step * 3.1);
      const len = n3(7 + step * 0.9);
      const tipX = n3(50 + side * len);
      const tipY = n3(y - len * 0.55);
      branches.push(`M50 ${y}L${tipX} ${tipY}`);
      // Pruned half: the LEFT. A cut branch stops short and is capped by a
      // small V — the scissor-mark. Uncut branches carry entropy dots, and the
      // dots thin toward the cut side, which is the whole point of the
      // method: the tree keeps the informative half.
      if (side < 0) {
        marks.push(
          `M${n3(tipX + 1.6)} ${n3(tipY - 1.6)}L${n3(tipX - 1.1)} ${n3(tipY + 1.1)}` +
            `M${n3(tipX + 1.6)} ${n3(tipY + 1.1)}L${n3(tipX - 1.1)} ${n3(tipY - 1.6)}`
        );
      } else if (step % 2 === 0) {
        dots.push(`M${n3(tipX + 1.2)} ${tipY}a1.2 1.2 0 1 0 -2.4 0a1.2 1.2 0 1 0 2.4 0`);
      }
    }
    return [trunk + branches.join(""), marks.join(""), dots.join("")];
  },
};

const racs: Blazon = {
  blazon:
    "A lotus compass: the needle swings between a full bloom (known item) and a bud (cold item); the risk ring is dotted, never solid.",
  d: () => {
    // Dotted risk ring: 24 dashes, so the angular rule holds even in a dash
    // pattern. A solid ring would claim certainty the method does not have.
    const risk = ticks(24, 33, 36.5);
    // Full bloom, left: 12 petals. Bud, right: three closed strokes.
    const bloom = radial(
      12,
      (a) => `M${pt(4, a, 30, 46)}Q${pt(11, a - 9, 30, 46)} ${pt(13.5, a, 30, 46)}Q${pt(11, a + 9, 30, 46)} ${pt(4, a, 30, 46)}`
    );
    const bud =
      `M70 58Q64.5 50 70 40Q75.5 50 70 58` +
      `M70 57Q67.5 49 70 42M70 57Q72.5 49 70 42`;
    const needle = `M38 66L64 34M64 34L60.5 35.4M64 34L62.6 37.5`;
    const pivot = `M51.6 50a1.6 1.6 0 1 0 -3.2 0a1.6 1.6 0 1 0 3.2 0`;
    return [risk, bloom + bud, needle + pivot];
  },
};

const eegStress: Blazon = {
  blazon:
    "Two interleaved waves — one spiked (EEG), one slow (ECG) — crossing but never touching. r = 0.08 made visible.",
  d: () => {
    // EEG: dense, spiky. ECG: slow, with one QRS spike. They interleave across
    // the maru and share no point — the near-zero correlation is the finding,
    // so the mon must not let them meet.
    let eeg = "M14 42";
    for (let x = 14; x <= 86; x += 3) {
      const t = (x - 14) / 72;
      const y = 42 - Math.sin(t * 22) * 6 - Math.sin(t * 7) * 2.4;
      eeg += `L${x} ${n3(y)}`;
    }
    const ecg =
      "M14 62Q22 62 26 60Q30 58 34 62L40 62L43 56L46 74L49 58L52 62L60 62" +
      "Q66 62 70 60Q74 58 78 62L86 62";
    return [eeg, ecg];
  },
};

const videoAnalytics: Blazon = {
  blazon:
    "A film-frame maru containing a running figure built only from joined pose keypoints — the skeleton is the data.",
  d: () => {
    // Sprocket holes: 12 per side would fight the maru, so 24 total around a
    // squared frame reads as film without becoming a gear.
    const frame = "M22 26H78V74H22Z";
    const perfs = Array.from({ length: 6 }, (_, i) => {
      const y = n3(31 + i * 7.6);
      return `M24.5 ${y}h3.4v3.4h-3.4Z` + `M72.1 ${y}h3.4v3.4h-3.4Z`;
    }).join("");
    // Keypoints joined: head, shoulders, elbows, wrists, hips, knees, ankles.
    const joints = [
      [50, 34], [50, 44], [42, 40], [37, 47], [58, 41], [64, 36],
      [50, 54], [44, 62], [40, 70], [57, 62], [63, 68],
    ] as const;
    const bones =
      "M50 37L50 54M42 40L58 41M42 40L37 47M58 41L64 36" +
      "M50 54L44 62L40 70M50 54L57 62L63 68";
    const head = "M53 34a3 3 0 1 0 -6 0a3 3 0 1 0 6 0";
    const dots = joints
      .slice(1)
      .map(([x, y]) => `M${n3(x + 1.15)} ${y}a1.15 1.15 0 1 0 -2.3 0a1.15 1.15 0 1 0 2.3 0`)
      .join("");
    return [frame + perfs, head + bones, dots];
  },
};

const prism: Blazon = {
  blazon:
    "A microscope objective seen as a mandala; the whole-slide tile grid is visible inside the glass.",
  d: () => {
    const barrel = "M36 20H64L60 34H40Z";
    const lens = "M50 72a20 20 0 1 0 0 -40a20 20 0 1 0 0 40";
    // The tiles: a WSI is read tile by tile, so the grid belongs inside the
    // optics, not beside them. Clipped by eye to stay within the lens circle.
    const grid = [
      "M36 44H64", "M34 52H66", "M36 60H64",
      "M42 34V70", "M50 32V72", "M58 34V70",
    ].join("");
    const petals = radial(
      12,
      (a) => `M${pt(20, a)}Q${pt(25, a - 7)} ${pt(28.5, a)}Q${pt(25, a + 7)} ${pt(20, a)}`
    );
    return [barrel + petals, lens, grid];
  },
};

const moml: Blazon = {
  blazon:
    "Three arrows converging on a Pareto arc — none reaching the same point, because a Pareto front has no single winner.",
  d: () => {
    const front = arc(30, -58, 58);
    const arrows = [
      { from: [20, 78], to: [37, 43] },
      { from: [50, 86], to: [50, 36] },
      { from: [80, 78], to: [63, 43] },
    ]
      .map(({ from, to }) => {
        const [x0, y0] = from;
        const [x1, y1] = to;
        const ang = Math.atan2(y1 - y0, x1 - x0);
        const hx = (d: number) => n3(x1 - 5 * Math.cos(ang + d));
        const hy = (d: number) => n3(y1 - 5 * Math.sin(ang + d));
        return `M${x0} ${y0}L${x1} ${y1}M${x1} ${y1}L${hx(0.42)} ${hy(0.42)}M${x1} ${y1}L${hx(-0.42)} ${hy(-0.42)}`;
      })
      .join("");
    // Three distinct landing points marked — the arrows stop at different
    // places on the arc on purpose.
    const marks = [[37, 43], [50, 36], [63, 43]]
      .map(([x, y]) => `M${n3(x + 1.4)} ${y}a1.4 1.4 0 1 0 -2.8 0a1.4 1.4 0 1 0 2.8 0`)
      .join("");
    return [front, arrows, marks];
  },
};

const mutantHunter: Blazon = {
  blazon:
    "A bug split by a test-tick blade; the surviving mutation strands trail off as whiskers.",
  d: () => {
    const body = "M50 66a13 13 0 1 0 0 -26a13 13 0 1 0 0 26";
    const legs =
      "M37 46L28 40M37 53H27M37 60L28 66M63 46L72 40M63 53H73M63 60L72 66";
    // The tick is a blade: it enters top-left, crosses the body, exits right.
    const tick = "M28 52L44 68L78 26";
    // Whiskers = mutants that survived. Deliberately an odd number: a clean
    // sweep would be a lie about what mutation testing reports.
    const whiskers = "M56 38L60 30M50 37V29M44 38L40 31";
    return [body + legs, whiskers, tick];
  },
};

const devopsDebug: Blazon = {
  blazon:
    "A kolam-style unending line knotted into a pipeline — one strand snapped, one spliced and repaired.",
  d: () => {
    // An unending line (sikku kolam) is the right rhyme for a pipeline: one
    // continuous path through every node. The break is what makes it a debug
    // crest rather than a pipeline crest.
    const knot =
      "M30 38Q50 22 70 38Q86 50 70 62Q50 78 30 62Q14 50 30 38" +
      "M30 62Q50 46 70 62M30 38Q50 54 70 38";
    const snap = "M46 30L54 24M46 24L54 30"; // the break, marked as a cut
    const splice = "M62 70h10M64 67v6M70 67v6"; // the repair, bound with ties
    const nodes = [[30, 38], [70, 38], [70, 62], [30, 62]]
      .map(([x, y]) => `M${n3(x + 2)} ${y}a2 2 0 1 0 -4 0a2 2 0 1 0 4 0`)
      .join("");
    return [knot, nodes, snap + splice];
  },
};

const niviqure: Blazon = {
  blazon:
    "A waveform emerging from a cracked-open proprietary bin — the format, reverse-engineered.",
  d: () => {
    const box = "M22 44H50L50 76H22Z";
    // The crack: a jagged split down the box's right wall, where it was opened.
    const crack = "M50 44L46 52L52 58L46 66L50 76";
    let wave = "M52 60";
    for (let x = 52; x <= 84; x += 2) {
      const t = (x - 52) / 32;
      const y = 60 - Math.sin(t * 12) * (4 + t * 7);
      wave += `L${x} ${n3(y)}`;
    }
    const lid = "M22 44L30 32H58L50 44";
    return [box + lid, crack, wave];
  },
};

const mlB120: Blazon = {
  blazon:
    "An ensemble fan of five stacked cards; the boosted trees show as leaf-veins across them.",
  d: () => {
    const cards = Array.from({ length: 5 }, (_, i) => {
      const a = -32 + i * 16;
      const [x, y] = polar(30, a, 50, 74);
      const [x2, y2] = polar(11, a, 50, 74);
      const w = 7.5;
      const nx = n3(Math.cos(((a - 90) * Math.PI) / 180 + Math.PI / 2) * w);
      const ny = n3(Math.sin(((a - 90) * Math.PI) / 180 + Math.PI / 2) * w);
      return `M${n3(x2 + nx)} ${n3(y2 + ny)}L${n3(x + nx)} ${n3(y + ny)}L${n3(x - nx)} ${n3(y - ny)}L${n3(x2 - nx)} ${n3(y2 - ny)}Z`;
    }).join("");
    // Veins: each card carries a small tree, because the ensemble IS trees.
    const veins = Array.from({ length: 5 }, (_, i) => {
      const a = -32 + i * 16;
      const [x, y] = polar(24, a, 50, 74);
      const [x2, y2] = polar(15, a, 50, 74);
      return `M${x2} ${y2}L${x} ${y}M${x} ${y}l-3.2 -3.4M${x} ${y}l3.2 -3.4`;
    }).join("");
    return [cards, veins];
  },
};

const osRegistrar: Blazon = {
  blazon:
    "Three keys on one ring — admin, student, faculty — hung over a ledger.",
  d: () => {
    const ledger = "M28 52H72V78H28ZM28 60H72M28 68H72M42 52V78";
    const ring = "M50 40a11 11 0 1 0 0 -22a11 11 0 1 0 0 22";
    // Three keys, three different bit patterns — the roles are not equal.
    const keys = [
      { a: -46, bits: 2 },
      { a: 0, bits: 3 },
      { a: 46, bits: 1 },
    ]
      .map(({ a, bits }) => {
        const [x0, y0] = polar(11, a, 50, 29);
        const [x1, y1] = polar(25, a, 50, 29);
        const teeth = Array.from({ length: bits }, (_, i) => {
          const [tx, ty] = polar(25 - i * 3.4, a, 50, 29);
          return `M${tx} ${ty}l3 3`;
        }).join("");
        return `M${x0} ${y0}L${x1} ${y1}` + teeth;
      })
      .join("");
    return [ledger, ring + keys];
  },
};

/* ========================================================= Mahabharatam */

const matrixOfTruth: Blazon = {
  blazon:
    "A magnifying glass over a halftone field; under the lens the dots resolve into true/false glyphs.",
  d: () => {
    // Halftone outside the lens, resolved marks inside — the claim is that
    // scrutiny is what turns noise into a verdict.
    const field = Array.from({ length: 24 }, (_, i) => {
      const x = n3(20 + (i % 6) * 11);
      const y = n3(20 + Math.floor(i / 6) * 11);
      const r = n3(1 + ((i * 7) % 3) * 0.5);
      return `M${n3(x + r)} ${y}a${r} ${r} 0 1 0 ${n3(-2 * r)} 0a${r} ${r} 0 1 0 ${n3(2 * r)} 0`;
    }).join("");
    const lens = "M62 62a17 17 0 1 0 0 -34a17 17 0 1 0 0 34";
    const handle = "M74 57L86 71";
    const verdict = "M54 45l4 5l9 -11"; // the tick, resolved
    const cross = "M68 50l6 6M68 56l6 -6";
    return [field, lens + handle, verdict + cross];
  },
};

const desaigner: Blazon = {
  blazon:
    "Two brushes crossed over one canvas, their strokes interleaving mid-stroke — neither hand finishes alone.",
  d: () => {
    const canvas = "M24 30H76V70H24Z";
    const brushA = "M20 74L44 44M44 44l6 3l-3 6L20 74Z";
    const brushB = "M80 74L56 44M56 44l-6 3l3 6L80 74Z";
    // The interleave: two strokes that alternate over/under across the canvas.
    const strokes =
      "M30 62Q40 50 50 58Q60 66 70 54" + "M30 46Q40 58 50 50Q60 42 70 52";
    return [canvas, strokes, brushA + brushB];
  },
};

const sellorita: Blazon = {
  blazon:
    "A conch as a megaphone — the herald's shankha. Announcement, in the register the site already speaks.",
  d: () => {
    // Logarithmic spiral, wound CLOCKWISE: the sacred conch is dakshinavarti,
    // and the wrong handedness inverts the meaning (PROJECT-STATUS §4).
    const turns = 2.6;
    const steps = 48;
    let spiral = "";
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const th = t * turns * Math.PI * 2;
      const r = 3 + 11 * Math.exp(0.36 * th) * 0.1;
      const [x, y] = polar(r, (th * 180) / Math.PI, 40, 44);
      spiral += `${i ? "L" : "M"}${x} ${y}`;
    }
    const mouth = "M52 54Q66 60 74 74Q60 78 50 68";
    // Sound: three arcs, the herald's carry.
    const sound = [22, 27, 32].map((r) => arc(r, 28, 92, 62, 62)).join("");
    return [spiral + mouth, sound];
  },
};

const hftSim: Blazon = {
  blazon:
    "A candlestick chart honed into a blade edge; the order-book rungs form the hilt.",
  d: () => {
    // Candles rise toward the tip: the chart IS the blade, so the data has to
    // be monotone enough to read as an edge.
    const candles = Array.from({ length: 7 }, (_, i) => {
      const x = n3(30 + i * 6);
      const h = n3(6 + i * 2.6);
      const top = n3(60 - h);
      return `M${x} ${n3(top - 4)}V${n3(top + h + 4)}M${n3(x - 2.4)} ${top}h4.8v${h}h-4.8Z`;
    }).join("");
    const edge = "M26 66L74 18L78 22L30 70Z";
    // Hilt: order-book rungs, deepest at the bottom (most resting size).
    const hilt = "M18 74L30 62M20 80h16M22 84h12M24 88h8";
    return [edge, candles, hilt];
  },
};

const dialecto: Blazon = {
  blazon:
    "Two speech bubbles interlocked as a yin-yang: Telugu అ and Latin A, neither containing the other.",
  d: () => {
    // The S-curve is the join, so neither bubble is the container — which is
    // the whole point of a dialect bridge.
    const yin = "M50 14a18 18 0 0 1 0 36a18 18 0 0 0 0 36a36 36 0 0 1 0 -72";
    const outer = "M50 86a36 36 0 1 0 0 -72a36 36 0 1 0 0 72";
    const tailA = "M28 74L20 84L32 80";
    const tailB = "M72 26L80 16L68 20";
    // Glyph stand-ins: a bar-and-hook for అ, a triangle-and-bar for A. Drawn,
    // not typeset — a webfont here would be a paint-time dependency and would
    // not stroke-draw.
    const telugu = "M40 30h9M44.5 26v12M49 30q5 0 5 5t-5 5";
    const latin = "M52 66l5 -12l5 12M54 62h6";
    return [outer, yin, tailA + tailB, telugu + latin];
  },
};

const mediassist: Blazon = {
  blazon: "A stethoscope coiled into a chakra — 12 spokes, the angular rule.",
  d: () => {
    const spokes = ticks(12, 12, 24);
    const hub = "M56 50a6 6 0 1 0 -12 0a6 6 0 1 0 12 0";
    const rim = arc(24, 200, 520);
    // The tubing leaves the rim and ends in the two earpieces — the chakra is
    // literally made of the instrument.
    const tube = "M32 66Q20 78 26 86M68 66Q80 78 74 86";
    const ears = "M26 86l-5 4M74 86l5 4";
    return [rim + spokes, hub, tube + ears];
  },
};

const pluginLive: Blazon = {
  blazon:
    "A microphone inside concentric assessment rings — the seigaiha wave, read as scoring bands.",
  d: () => {
    // Seigaiha is overlapping arcs; here the overlap is the scoring band, so
    // the ornament carries the meaning rather than sitting behind it.
    const rings = [16, 23, 30, 37].map((r) => arc(r, 200, 520)).join("");
    const mic = "M50 22a7 7 0 0 1 7 7v11a7 7 0 0 1 -14 0V29a7 7 0 0 1 7 -7Z";
    const cradle = "M38 38a12 12 0 0 0 24 0M50 50v9M42 59h16";
    return [rings, mic, cradle];
  },
};

const relaybrain: Blazon = {
  blazon:
    "A brain passed as a relay baton between two hands — the handover is the mechanism.",
  d: () => {
    const brain =
      "M50 30Q38 30 34 40Q26 44 30 54Q30 64 42 66H58Q70 64 70 54Q74 44 66 40Q62 30 50 30Z" +
      "M50 31V66M42 38q6 3 0 8q-6 5 0 9M58 38q-6 3 0 8q6 5 0 9";
    // Two hands, opposed: one releasing, one closing. Drawn as open Cs so the
    // gesture stays legible at 48px where fingers would not.
    const handL = "M20 60q-6 6 0 12q6 6 12 2M22 72l8 4";
    const handR = "M80 60q6 6 0 12q-6 6 -12 2M78 72l-8 4";
    return [brain, handL + handR];
  },
};

const dapi: Blazon = {
  blazon:
    "A torii-shaped bridge spanning two scripts — the gate as an interface between them.",
  d: () => {
    // Torii as bridge: the kasagi (top rail) curves, which is what separates a
    // torii from a goalpost. It arcs UP at the ends.
    const kasagi = "M14 30Q50 22 86 30M18 36H82";
    const posts = "M26 36L30 76M74 36L70 76";
    const nuki = "M24 50H76";
    // The two scripts it joins, as marks on either bank.
    const left = "M18 66h8M22 62v8";
    const right = "M74 62l4 8l4 -8M76 68h6";
    const bank = "M12 76H88";
    return [kasagi + posts + nuki, bank, left + right];
  },
};

// ---------------------------------------------------------------- registry

export const MON: Record<string, Blazon> = {
  // Ramayanam — research
  dalsp,
  racs,
  "eeg-stress": eegStress,
  videoanalytics: videoAnalytics,
  medireport: prism,
  moml,
  mutanthunter: mutantHunter,
  "devops-debug": devopsDebug,
  "ect-nimhans": niviqure,
  "ml-b120": mlB120,
  "os-mini": osRegistrar,
  // Mahabharatam — dev / hackathons
  "matrix-of-truth": matrixOfTruth,
  desaigner,
  sellorita,
  "hft-sim": hftSim,
  dialecto,
  mediassist,
  pluginlive: pluginLive,
  relaybrain,
  dapi,
};

export type MonId = keyof typeof MON;

export interface MonProps {
  id: string;
  size?: number;
  className?: string;
  /**
   * Kanmuri — a rank ribbon above the maru. Experience and role entries reuse
   * their parent project's mon with this added rather than getting a crest of
   * their own (§4.2): they are rank marks, not separate identities.
   */
  ribbon?: boolean;
  title?: string;
}

/**
 * The maru and the interior are separate stroke groups so inkDraw draws the
 * enclosure first and the contents after — a crest is cut outside-in, and
 * drawing the interior before its circle looks like the parts arrived before
 * the emblem.
 */
export default function Mon({ id, size = 48, className, ribbon, title }: MonProps) {
  const entry = MON[id];
  if (!entry) return null;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title ?? `${id} mon`}
      fill="none"
      stroke="currentColor"
      // SINGLE INK WEIGHT (§4.1 rule 2). Set once, here, and inherited by
      // everything inside: no path may override it.
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ribbon && (
        // Kanmuri, drawn first: it sits above the crest in rank order.
        <path d="M34 9h32l-5 7H39ZM50 16v4" strokeWidth={2.2} />
      )}
      <circle cx={C} cy={C} r={R_MARU} strokeWidth={3.2} />
      {entry.d().map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
