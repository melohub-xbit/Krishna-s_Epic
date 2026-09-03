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
  type Pt,
} from "@/lib/dots";
import { readVar } from "@/lib/palette";

type Line = {
  text: string;
  /** css font shorthand minus size, e.g. `600` */
  weight?: string;
  /** size as a fraction of the canvas height */
  size?: number;
  /** vertical centre as a fraction of canvas height */
  y?: number;
  family?: "sans" | "telugu";
};

type Props = {
  lines: Line[];
  /** dot pitch in px — smaller is denser */
  step?: number;
  dotRadius?: number;
  /** ms */
  duration?: number;
  className?: string;
  ariaLabel: string;
};

/**
 * Type that resolves out of a dot matrix.
 *
 * The dots do not fly in from off-screen — they start slightly scattered
 * around where they belong and tighten into place, which reads as focus
 * rather than as an effect. It fires once, when it first scrolls into view.
 */
export default function DotText({
  lines,
  step = 3.4,
  dotRadius = 1.25,
  duration = 1400,
  className,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    let stop: (() => void) | undefined;

    const build = (animate: boolean) => {
      const { ctx, w, h } = fitCanvas(cv);

      const targets: Pt[] = sampleDots(
        (o) => {
          o.textAlign = "left";
          o.textBaseline = "middle";
          for (const ln of lines) {
            const size = Math.round(h * (ln.size ?? 0.34));
            const fam = fontStack(ln.family === "telugu" ? "telugu" : "sans");
            o.font = `${ln.weight ?? "600"} ${size}px ${fam}`;
            o.fillText(ln.text, 0, h * (ln.y ?? 0.5));
          }
        },
        w,
        h,
        step
      );

      const color = readVar("dot");

      if (!animate) {
        ctx.clearRect(0, 0, w, h);
        paintDots(ctx, targets, dotRadius, color);
        return;
      }

      // each dot gets a small random offset and its own start delay
      const seeds = targets.map((p) => {
        const a = Math.random() * Math.PI * 2;
        const r = 8 + Math.random() * 22;
        return {
          tx: p.x,
          ty: p.y,
          ox: p.x + Math.cos(a) * r,
          oy: p.y + Math.sin(a) * r,
          d: Math.random() * 0.45,
        };
      });

      const start = performance.now();
      const frame: Pt[] = seeds.map(() => ({ x: 0, y: 0 }));

      stop = addJob((now) => {
        const p = Math.min(1, (now - start) / duration);
        for (let i = 0; i < seeds.length; i++) {
          const s = seeds[i];
          const u = ease(Math.max(0, Math.min(1, (p - s.d) / (1 - s.d))));
          frame[i].x = s.ox + (s.tx - s.ox) * u;
          frame[i].y = s.oy + (s.ty - s.oy) * u;
        }
        ctx.clearRect(0, 0, w, h);
        paintDots(ctx, frame, dotRadius, color);
        return p < 1;
      });
    };

    const reduced = prefersReducedMotion();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played.current) {
            played.current = true;
            build(!reduced);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(cv);

    const onResize = () => {
      if (played.current) build(false);
    };
    window.addEventListener("resize", onResize);

    // repaint when the palette or mode changes
    const mo = new MutationObserver(() => {
      if (played.current) build(false);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", onResize);
      stop?.();
    };
  }, [lines, step, dotRadius, duration]);

  return <canvas ref={ref} className={className} aria-label={ariaLabel} />;
}
