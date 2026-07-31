"use client";

/**
 * కృష్ణ సాయి — the landing wordmark, written rather than displayed.
 * Spec: 03-manga-navigation.md §3.1 beat 0.4; mechanics 08 §8.5 [REVISED].
 *
 * This is the site's opening gesture: a brush writes the name, holds a beat,
 * and the వెలిదండ seal stamps over it. Everything here exists to make the
 * writing read as writing.
 *
 * WHY REVEAL-MASK AND NOT STROKE-DRAW. Telugu aksharas are tapered, and a
 * stroked path has exactly one width — so stroking the silhouette throws away
 * the taper that makes it a brush mark, and what animates is the OUTLINE being
 * traced: a thin line running round each letter and back. That reads as
 * "outlining a shape", never as "laying down ink". It was tried on the ensō and
 * was wrong on sight (PROJECT-STATUS §4 item 13). So the aksharas stay FILLED
 * and a hidden centreline sweeps inside a <mask> to uncover them, round-capped
 * so the reveal edge is a brush tip rather than a guillotine.
 *
 * WHY THE GEOMETRY IS GENERATED. The centreline is the letter's medial axis,
 * extracted by skeletonising the shaped outline and walking it (see
 * scripts/build-title.py). Hand-tracing four aksharas by eye would be
 * unreproducible the moment the wordmark or the font changes; this way the
 * whole thing regenerates from the string.
 *
 * ORDER. `data-stroke` runs 0..n across the aksharas, left to right, strokes
 * within a letter top to bottom — 08 §8.5's rule, and inkDraw's "data-stroke"
 * mode sorts on it. Drawing a letterform out of order is viscerally wrong to
 * anyone who writes the script, so this is not cosmetic.
 *
 * NOTE for whoever revisits stroke order: geometric top-to-bottom puts the
 * talakattu (head stroke) FIRST because it sits highest, while many Telugu
 * writers add it last. 08 §8.5 specifies top-to-bottom and that is what ships;
 * true pen order would be a per-akshara override in build-title.py, not a
 * change here.
 */
import { useId } from "react";

import {
  TITLE_AKSHARAS,
  TITLE_ASPECT,
  TITLE_TEXT,
  TITLE_VH,
  TITLE_VW,
} from "@/components/ink/titleGlyphs";

export { TITLE_ASPECT, TITLE_TEXT };

export interface TeluguTitleProps {
  /** Rendered height in px; width follows the intrinsic ratio. */
  height?: number;
  className?: string;
  /**
   * Mount the reveal masks so inkDraw can write it. When false the title is
   * plain filled artwork — which is exactly what it must look like at the end
   * of the animation, and what reduced-motion and SSR get.
   */
  drawable?: boolean;
  /** Accessible name. Telugu is always paired with English (locked decision). */
  title?: string;
}

export default function TeluguTitle({
  height = 120,
  className,
  drawable = false,
  title = `${TITLE_TEXT} · Krishna Sai`,
}: TeluguTitleProps) {
  // useId, not a counter: mask ids must be identical across SSR and hydration,
  // and the title may appear twice (landing + hero spread) on one page.
  const uid = useId().replace(/:/g, "");

  // One running index across the whole word. inkDraw sorts on it, so it has to
  // be globally ordered, not per-akshara.
  let strokeIndex = 0;

  return (
    <svg
      viewBox={`0 0 ${TITLE_VW} ${TITLE_VH}`}
      height={height}
      width={height * TITLE_ASPECT}
      className={className}
      role="img"
      aria-label={title}
    >
      {drawable && (
        <defs>
          {TITLE_AKSHARAS.map((a) => (
            <mask
              key={a.cluster}
              id={`title-reveal-${uid}-${a.cluster}`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={TITLE_VW}
              height={TITLE_VH}
            >
              {a.centrelines.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  // inkDraw finds reveal paths by this attribute and switches
                  // modes; its presence is what says "do not stroke my outline".
                  data-ink-reveal=""
                  data-stroke={strokeIndex++}
                  fill="none"
                  stroke="#fff"
                  // Full brush body: anything narrower and the reveal clips the
                  // letter's own edges as it travels past them.
                  strokeWidth={a.reveal}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </mask>
          ))}
        </defs>
      )}

      <g fill="currentColor">
        {TITLE_AKSHARAS.map((a) => (
          <path
            key={a.cluster}
            d={a.d}
            mask={drawable ? `url(#title-reveal-${uid}-${a.cluster})` : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
