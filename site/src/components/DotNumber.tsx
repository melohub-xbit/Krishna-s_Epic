"use client";

import { useEffect, useRef } from "react";
import {
  addJob,
  ease,
  fitCanvas,
  fontStack,
  paintDots,
  prefersReducedMotion,
  sampleDots,
} from "@/lib/dots";
import { readVar } from "@/lib/palette";

type Props = {
  /** the value to count up to */
  value: number;
  /** appended to the number, e.g. "%" */
  suffix?: string;
  decimals?: number;
  duration?: number;
  step?: number;
  dotRadius?: number;
  className?: string;
};

/**
 * The hero figure on a project card: one measured number, counting up,
 * rendered in the same dot matrix as everything else.
 *
 * It is drawn in the accent colour while it moves and settles to the
 * normal dot colour when it lands — so the eye is pulled to it exactly
 * once, then released.
 */
export default function DotNumber({
  value,
  suffix = "",
  decimals = 0,
  duration = 1500,
  step = 3.6,
  dotRadius = 1.35,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let stop: (() => void) | undefined;

    // Size the canvas once per run, not per frame — resizing a canvas
    // reallocates its backing store and is expensive inside a loop.
    let surface = fitCanvas(cv);

    const render = (shown: number, moving: boolean) => {
      const { ctx, w, h } = surface;
      const label = shown.toFixed(decimals) + suffix;
      const pts = sampleDots(
        (o) => {
          o.textAlign = "center";
          o.textBaseline = "middle";
          o.font = `600 ${Math.round(h * 0.86)}px ${fontStack("sans")}`;
          o.fillText(label, w / 2, h * 0.52);
        },
        w,
        h,
        step
      );
      ctx.clearRect(0, 0, w, h);
      paintDots(ctx, pts, dotRadius, moving ? readVar("accent") : readVar("dot"));
    };

    const run = () => {
      if (prefersReducedMotion()) {
        render(value, false);
        return;
      }
      const t0 = performance.now();
      stop = addJob((now) => {
        const p = Math.min(1, (now - t0) / duration);
        render(ease(p) * value, p < 1);
        return p < 1;
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played.current) {
            played.current = true;
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(cv);

    const repaint = () => {
      if (!played.current) return;
      surface = fitCanvas(cv);
      render(value, false);
    };
    window.addEventListener("resize", repaint);
    const mo = new MutationObserver(repaint);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", repaint);
      stop?.();
    };
  }, [value, suffix, decimals, duration, step, dotRadius]);

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label={`${value}${suffix}`}
    />
  );
}
