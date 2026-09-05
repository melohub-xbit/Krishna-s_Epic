"use client";

import { useEffect, useRef } from "react";
import { addJob, prefersReducedMotion } from "@/lib/dots";

/**
 * THE RAIL — what sits in the projector's base.
 *
 * Thirty-four discrete cells, in the spirit of the Glyph interface: not a
 * progress bar and not a graphic, just LEDs that are either carrying
 * something or not. The pattern is throughput — a few cells at a time
 * flipping on and off, so the base reads as busy rather than as animated.
 * Nothing travels across it, which means there is no path for the eye to
 * follow and it never competes with the copy beside it.
 *
 * The flicker is a hash, not a random: cell index and the current eighth
 * of a second go in, the same value comes out every time. So it is stable
 * under a re-render, identical on every machine, and costs one sine per
 * cell per tick rather than a stored buffer of state.
 *
 * Two layers per cell: a pure white bar that is always there, and an
 * accent lamp over it that the loop fades in and out. White is on
 * purpose — the one place on the site that does not take its colour
 * from the palette. An LED is not warm, and the moment these picked up
 * the page's off-white (#f2efea) they stopped reading as hardware.
 *
 * Only the lamp opacities are written, and only while the base is on
 * screen. No React state, no layout, no elements created after mount.
 */

const N = 34;
/** how many eighths of a second one pattern lasts */
const RATE = 8;

export default function GlyphRail() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;

    const lamps = Array.from(rail.querySelectorAll<HTMLElement>(".holo-lamp"));
    if (!lamps.length) return;

    if (prefersReducedMotion()) {
      /* one still frame of the same pattern rather than nothing at all */
      lamps.forEach((c, i) => {
        c.style.opacity = i % 7 === 2 || i % 11 === 5 ? "1" : "0";
      });
      return;
    }

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    io.observe(rail);

    let lastFrame = -1;

    const stop = addJob((now) => {
      if (!visible) return true;
      const f = Math.floor((now / 1000) * RATE);
      if (f === lastFrame) return true;
      lastFrame = f;

      for (let i = 0; i < lamps.length; i++) {
        const s = Math.sin(i * 127.1 + f * 311.7) * 43758.5453;
        const r = s - Math.floor(s);
        lamps[i].style.opacity = r > 0.86 ? "1" : r > 0.8 ? "0.42" : "0";
      }
      return true;
    });

    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <div className="holo-rail" ref={ref} aria-hidden="true">
      {Array.from({ length: N }, (_, i) => (
        <span key={i} className="holo-cell">
          <i className="holo-lamp" />
        </span>
      ))}
    </div>
  );
}
