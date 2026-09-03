"use client";

import { useEffect, useRef } from "react";
import { fitCanvas, paintDots, sampleDots } from "@/lib/dots";
import { readVar } from "@/lib/palette";
import { DIAGRAMS } from "@/data/diagrams";

/**
 * A project's own diagram, drawn as dots.
 *
 * Only mounts when its row is open, so nothing is rasterised for the
 * twenty-one panels you are not looking at.
 */
export default function DotDiagram({
  id,
  className,
  step = 3.1,
  dotRadius = 1.05,
}: {
  id: string;
  className?: string;
  step?: number;
  dotRadius?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const paint = DIAGRAMS[id];
    if (!cv || !paint) return;

    const draw = () => {
      const { ctx, w, h } = fitCanvas(cv);
      const pts = sampleDots((o, ww, hh) => paint(o, ww, hh), w, h, step);
      ctx.clearRect(0, 0, w, h);
      paintDots(ctx, pts, dotRadius, readVar("dot"));
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(cv);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [id, step, dotRadius]);

  if (!DIAGRAMS[id]) return null;

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
