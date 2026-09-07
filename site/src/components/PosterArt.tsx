"use client";

import { useEffect, useRef } from "react";
import { drawContour, drawHalo } from "@/lib/contour";

/**
 * A poster's picture — either a window onto the landscape, or the
 * contour halo behind a mark.
 *
 * Static: eighteen of these live on the rail at once and none of them
 * breathes. Drawn once, then again only if the box changes size, off a
 * ResizeObserver — the rail is a transformed, rotated stack, so
 * getBoundingClientRect lies about every card in it and the canvas has
 * to be measured from its own layout box.
 *
 * `unit` is the whole trick for the landscape at this size. drawContour
 * scales every line to w/2200 so one seed composes for any aspect; at a
 * 200px window that makes each line a fifth of a pixel and the picture
 * turns to mush. A small unit gives it back its weight.
 */
export default function PosterArt({
  seed,
  kind = "land",
  className,
}: {
  seed: number;
  kind?: "land" | "halo";
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const paint = () => {
      const w = cv.offsetWidth;
      const h = cv.offsetHeight;
      if (w < 2 || h < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pw = Math.round(w * dpr);
      const ph = Math.round(h * dpr);
      if (cv.width !== pw || cv.height !== ph) {
        cv.width = pw;
        cv.height = ph;
      }
      if (kind === "halo") drawHalo(cv, { seed });
      else drawContour(cv, { seed, unit: 340, dens: 44, amp: 30 });
    };

    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(cv);
    return () => ro.disconnect();
  }, [seed, kind]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
