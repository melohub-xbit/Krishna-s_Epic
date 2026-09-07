"use client";

import { useEffect, useRef } from "react";
import { drawContour, timeSeed } from "@/lib/contour";

/**
 * The landscape, drawn into whatever box it is given.
 *
 * Redraws on a ResizeObserver rather than a window listener, because the
 * observer reports the LAYOUT box — unaffected by any transform on an
 * ancestor, and it fires the moment the element first has a size. A
 * canvas that measures itself mid page-turn otherwise sizes to a few
 * pixels and stays that way.
 *
 * BREATHING IS NOT FREE. A full redraw is a few hundred polylines and
 * runs in tens of milliseconds, so it cannot go at 60fps and does not
 * need to: the drift is slow enough that twelve frames a second is
 * indistinguishable from sixty, and it costs a fifth as much. The
 * animated buffer also drops to 0.75 device pixels — this is a soft,
 * grainy picture and nobody can see the difference, but a phone can
 * certainly feel it. It stops entirely when scrolled out of view, and
 * never starts at all under reduced motion.
 */

/** one redraw every this many ms while breathing */
const FRAME = 84;

export default function Contour({
  seed,
  offset = 0,
  animate = false,
  scribble = false,
  className,
}: {
  /** pin the composition; omit it to take one from the clock */
  seed?: number;
  /** separates two drawings made in the same instant */
  offset?: number;
  animate?: boolean;
  /** the loose red curl across the sky */
  scribble?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pinned = useRef<number | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    if (pinned.current === null) pinned.current = seed ?? timeSeed(offset);
    const s = pinned.current;

    const flat = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const moving = animate && !flat;

    let raf = 0;
    let last = -1e9;
    let visible = true;

    const paint = (phase: number) => {
      const w = cv.offsetWidth;
      const h = cv.offsetHeight;
      if (w < 2 || h < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, moving ? 0.75 : 1.5);
      const pw = Math.round(w * dpr);
      const ph = Math.round(h * dpr);
      if (cv.width !== pw || cv.height !== ph) {
        cv.width = pw;
        cv.height = ph;
      }
      drawContour(cv, { seed: s, phase, scribble, dens: moving ? 74 : 96 });
    };

    const ro = new ResizeObserver(() => {
      if (moving) return; /* the loop is already repainting */
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => paint(0));
    });
    ro.observe(cv);

    if (!moving) {
      paint(0);
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
      },
      { rootMargin: "120px" }
    );
    io.observe(cv);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || now - last < FRAME) return;
      last = now;
      paint(now * 0.000045);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [seed, offset, animate, scribble]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
