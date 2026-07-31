/**
 * inkDraw — THE stroke-draw utility. Spec: 08-implementation-guide.md §8.5.
 *
 * One function draws every line on this site: the Telugu title, the ensō, the
 * gate outlines, panel borders, the mon. That is the entire point — a shared
 * hand. If something needs to look drawn and does not go through here, the
 * site has two hands and the illusion breaks.
 *
 *   const tl = inkDraw(svgRef.current, { brush: 3, order: "data-stroke" });
 *
 * Always call inside a client effect. It touches the DOM and GSAP, so it must
 * never run during SSR (PROJECT-STATUS §4 gotcha 7 is a cautionary tale about
 * what silent hydration failure looks like).
 */
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { DUR, EASE, STAGGER } from "@/components/ink/ease";
import { n3 } from "@/lib/n3";

gsap.registerPlugin(DrawSVGPlugin);

export type BrushId = 1 | 2 | 3 | 4 | 5 | 6;

export interface InkDrawOptions {
  /**
   * "document" — draw in DOM order (default; right for ornament and borders).
   * "data-stroke" — draw in authentic writing order, reading the numeric
   * `data-stroke` attribute on each path or its nearest ancestor. Telugu
   * aksharas MUST use this: their strokes are not authored in writing order,
   * and drawing a letterform out of order is immediately, viscerally wrong to
   * anyone who writes the script.
   */
  order?: "document" | "data-stroke";
  /** Seconds per path. Default DUR.base. */
  duration?: number;
  /** Seconds between consecutive paths. Default STAGGER (0.07). */
  stagger?: number;
  /** Which brush texture, 1 (loaded) → 6 (spent). Default 3, the workhorse. */
  brush?: BrushId;
  /**
   * Bleed bloom at each stroke's end point — ink wicking into paper where the
   * brush lifts. Costs a filtered element per path, so it is skipped on
   * coarse pointers and under reduced motion. "auto" (default) decides.
   */
  bleed?: boolean | "auto";
  /** Start the timeline paused, to sequence it into a parent. Default false. */
  paused?: boolean;
}

const BRUSH_SRC = (id: BrushId) => `/brushes/brush-${id}.png`;

/** Elements DrawSVG can actually draw. Excludes <text> — it has no stroke geometry. */
const DRAWABLE = "path, line, polyline, polygon, rect, circle, ellipse";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isCoarsePointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

/**
 * Collect drawable geometry in the order it should be inked.
 *
 * Paths with no stroke are dropped: DrawSVG animates stroke-dashoffset, so a
 * fill-only shape would sit in the timeline consuming stagger slots while
 * visibly doing nothing. That failure mode looks like "the animation is
 * janky" rather than "this element cannot be drawn", so it is worth the
 * filter.
 */
function collectTargets(
  root: SVGElement,
  order: "document" | "data-stroke"
): SVGGeometryElement[] {
  // TWO DRAWING MODES, and the SVG declares which one it wants.
  //
  // Reveal mode (data-ink-reveal): the artwork is FILLED, and a hidden
  // centreline stroke inside a <mask> sweeps across to uncover it. Required
  // for anything with brush taper — a stroked path has one constant width, so
  // stroking a tapered silhouette destroys the taper, and what you'd watch is
  // its outline being traced rather than ink being laid down.
  //
  // Direct mode (everything else): animate the stroke-dashoffset of the
  // visible path. Correct for uniform line art — mon outlines, panel borders.
  //
  // Reveal wins when present: if a shape offers a centreline it is because
  // drawing its outline would look wrong.
  const reveal = Array.from(
    root.querySelectorAll<SVGGeometryElement>("[data-ink-reveal]")
  );
  if (reveal.length) return orderTargets(reveal, order);

  const all = Array.from(
    root.querySelectorAll<SVGGeometryElement>(DRAWABLE)
  ).filter((el) => {
    const s = getComputedStyle(el).stroke;
    return s && s !== "none" && s !== "rgba(0, 0, 0, 0)";
  });

  return orderTargets(all, order);
}

function orderTargets(
  els: SVGGeometryElement[],
  order: "document" | "data-stroke"
): SVGGeometryElement[] {
  if (order === "document") return els;

  // Stable sort by the nearest data-stroke value; elements without one keep
  // document order at the end. Array.prototype.sort is stable per spec in
  // every engine we target, so equal keys preserve authoring order — which is
  // exactly what "strokes within one akshara go top to bottom" relies on.
  const key = (el: Element) => {
    const holder = el.closest("[data-stroke]");
    const raw = holder?.getAttribute("data-stroke");
    const n = raw == null ? NaN : Number(raw);
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
  };
  return els
    .map((el, i) => ({ el, k: key(el), i }))
    .sort((a, b) => a.k - b.k || a.i - b.i)
    .map((r) => r.el);
}

/**
 * Apply the brush texture as a CSS mask on the root.
 *
 * CSS `mask-image` rather than an SVG <mask> element, deliberately: an SVG
 * mask requires wrapping the strokes in <g mask="url(#…)">, i.e. moving DOM
 * children that React rendered, which fights reconciliation on every
 * re-render. A CSS mask needs no DOM surgery at all.
 *
 * The brush PNGs carry the texture in their ALPHA channel (see
 * scripts/make-brushes.py) because CSS masking defaults to `mask-mode: alpha`.
 * A greyscale PNG here would be a silent no-op — fully opaque everywhere, no
 * visible error, just no texture.
 */
function applyBrushMask(root: SVGElement, brush: BrushId) {
  const url = `url("${BRUSH_SRC(brush)}")`;
  const s = root.style as CSSStyleDeclaration & {
    webkitMaskImage?: string;
    webkitMaskSize?: string;
    webkitMaskRepeat?: string;
  };
  s.maskImage = url;
  s.maskSize = "100% 100%";
  s.maskRepeat = "no-repeat";
  // Safari < 15.4 still wants the prefix; harmless elsewhere.
  s.webkitMaskImage = url;
  s.webkitMaskSize = "100% 100%";
  s.webkitMaskRepeat = "no-repeat";
}

const BLEED_GROUP = "data-ink-bleed";
const BLEED_FILTER_ID = "ink-bleed-filter";

/**
 * One turbulence filter per document, reused by every bloom. Filters are
 * expensive to instantiate and identical across call sites, so there is no
 * reason to mint one per ensō.
 */
function ensureBleedFilter(svg: SVGSVGElement) {
  if (svg.ownerDocument.getElementById(BLEED_FILTER_ID)) return;
  const NS = "http://www.w3.org/2000/svg";
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(NS, "defs");
    svg.insertBefore(defs, svg.firstChild);
  }
  const filter = document.createElementNS(NS, "filter");
  filter.setAttribute("id", BLEED_FILTER_ID);
  // Generous region: displacement pushes pixels outside the source bbox, and
  // the default -10%/120% clips the bloom into a visible square.
  filter.setAttribute("x", "-75%");
  filter.setAttribute("y", "-75%");
  filter.setAttribute("width", "250%");
  filter.setAttribute("height", "250%");
  // sRGB, explicitly. SVG filters default to linearRGB, which darkens a
  // light fill noticeably — the first version of this rendered the bloom as a
  // dark chevron sitting on the stroke and read as a rendering glitch rather
  // than as ink.
  filter.setAttribute("color-interpolation-filters", "sRGB");
  // Fine, shallow displacement plus a slight blur. Coarse displacement on a
  // shape only a few units across does not read as "wicking into paper", it
  // reads as a torn polygon: the noise wavelength has to be well under the
  // radius of the thing it is disturbing.
  filter.innerHTML =
    '<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
    '<feGaussianBlur in="d" stdDeviation="0.45"/>';
  defs.appendChild(filter);
}

/**
 * A soft, irregular dot at each stroke's end — ink wicking into the paper
 * fibres at the moment the brush lifts. Small, but it is most of what sells
 * "brush" over "animated vector".
 */
function buildBleeds(root: SVGElement, targets: SVGGeometryElement[]) {
  const svg = (root.closest("svg") ?? root) as SVGSVGElement;
  ensureBleedFilter(svg);

  // Clear any group from a previous run so repeated calls cannot stack blooms.
  root.querySelectorAll(`[${BLEED_GROUP}]`).forEach((g) => g.remove());

  const NS = "http://www.w3.org/2000/svg";
  const group = document.createElementNS(NS, "g");
  group.setAttribute(BLEED_GROUP, "");
  group.setAttribute("aria-hidden", "true");
  group.setAttribute("pointer-events", "none");

  const dots: SVGCircleElement[] = [];
  for (const el of targets) {
    let pt: DOMPoint;
    try {
      const len = el.getTotalLength();
      if (!len) continue;
      pt = el.getPointAtLength(len);
    } catch {
      continue; // some shapes refuse getTotalLength; a missing bloom is fine
    }
    const cs = getComputedStyle(el);
    const w = parseFloat(cs.strokeWidth) || 1;

    // A reveal centreline lives inside a <mask>, so its own paint is #fff and
    // its width is the full brush body. Neither describes the visible ink:
    // copying them would drop a fat white blob on the artwork. Inherit the
    // artwork's colour instead, and shrink the dot to a tip rather than a body.
    const isReveal = el.hasAttribute("data-ink-reveal");
    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("cx", String(n3(pt.x)));
    dot.setAttribute("cy", String(n3(pt.y)));
    dot.setAttribute("r", String(n3(w * (isReveal ? 0.34 : 0.85))));
    dot.setAttribute("fill", isReveal ? "currentColor" : cs.stroke);
    dot.setAttribute("filter", `url(#${BLEED_FILTER_ID})`);
    dot.setAttribute("opacity", "0");
    group.appendChild(dot);
    dots.push(dot);
  }

  if (!dots.length) return { group: null, dots };
  root.appendChild(group);
  return { group, dots };
}

/**
 * Draw an SVG as if by brush. Returns the timeline so callers can sequence,
 * scrub, or reverse it.
 *
 * Cleanup is the caller's job — wrap in gsap.context() and revert (or use
 * useGSAP from @gsap/react). Bleed elements are removed by the next call on
 * the same root, and by ctx.revert() killing the tweens that reveal them.
 */
export function inkDraw(
  root: SVGElement | null | undefined,
  opts: InkDrawOptions = {}
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: opts.paused ?? false });
  if (!root) return tl;

  const {
    order = "document",
    duration = DUR.base,
    stagger = STAGGER,
    brush = 3,
    bleed = "auto",
  } = opts;

  const targets = collectTargets(root, order);
  if (!targets.length) return tl;

  applyBrushMask(root, brush);

  const reduced = prefersReducedMotion();

  // Reduced motion: the content must be IDENTICAL, it simply does not draw.
  // Not a faster draw — no draw. Anyone who set this preference did so for a
  // reason, and a 200ms version of the same motion still moves.
  if (reduced) {
    tl.set(targets, { drawSVG: "0% 100%", opacity: 1 });
    return tl;
  }

  tl.fromTo(
    targets,
    { drawSVG: "0% 0%" },
    { drawSVG: "0% 100%", duration, stagger, ease: EASE.ink }
  );

  // A reveal centreline is round-capped (the reveal edge has to be a brush tip,
  // not a guillotine). A round cap on a ZERO-LENGTH dash still paints a full
  // round dot, so every stroke that has not started yet sits there as a blob at
  // its own start point — with a stagger, the whole word appears as a row of
  // dots before the brush reaches them. Hide each reveal path until its own
  // tween begins.
  //
  // Mask paths, so opacity 0 means "contributes nothing to the mask" — exactly
  // the same result as not being there, with no DOM surgery. Only reveal
  // targets need this: direct-mode strokes are butt-capped and paint nothing at
  // zero length.
  const staggered = targets.filter((el) => el.hasAttribute("data-ink-reveal"));
  if (staggered.length > 1) {
    tl.set(staggered, { opacity: 0 }, 0);
    staggered.forEach((el, i) => {
      tl.set(el, { opacity: 1 }, i * stagger);
    });
  }

  const wantBleed = bleed === "auto" ? !isCoarsePointer() : bleed;
  if (wantBleed) {
    const { dots } = buildBleeds(root, targets);
    dots.forEach((dot, i) => {
      // Land each bloom as its own stroke finishes, not at the end of the
      // whole timeline — the ink pools when THAT brush lifts.
      // Peak then settle. Kept low: this is a suggestion of ink spreading
      // into paper, and anything stronger reads as a blob stuck on the end of
      // the stroke. If you can point at it, it is too strong.
      tl.to(
        dot,
        { opacity: 0.32, duration: DUR.short, ease: EASE.soft },
        i * stagger + duration * 0.82
      ).to(
        dot,
        { opacity: 0.14, duration: DUR.base, ease: EASE.soft },
        i * stagger + duration * 0.82 + DUR.short
      );
    });
  }

  return tl;
}

export default inkDraw;
