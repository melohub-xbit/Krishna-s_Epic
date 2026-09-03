"use client";

import { useEffect, useRef } from "react";
import { fitCanvas, paintDots, sampleDots } from "@/lib/dots";
import { readVar } from "@/lib/palette";
import { MARKS, type MarkId } from "@/data/marks";

type Props = {
  mark: MarkId;
  className?: string;
  /** dot pitch — small marks need a tighter grid to stay readable */
  step?: number;
  dotRadius?: number;
};

/**
 * A project's mark, drawn as dots.
 *
 * Marks are procedural line drawings (see data/marks.ts) rather than
 * images, so they inherit the palette, scale to any size, and cost
 * nothing to ship. Each is built from what the project actually does.
 */
export default function DotMark({
  mark,
  className,
  step = 2.6,
  dotRadius = 0.95,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const draw = () => {
      const { ctx, w, h } = fitCanvas(cv);
      const paint = MARKS[mark] ?? MARKS.ring;
      const pts = sampleDots((o, ww, hh) => paint(o, ww, hh), w, h, step);
      ctx.clearRect(0, 0, w, h);
      paintDots(ctx, pts, dotRadius, readVar("dot"));
    };

    draw();
    window.addEventListener("resize", draw);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      window.removeEventListener("resize", draw);
      mo.disconnect();
    };
  }, [mark, step, dotRadius]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
