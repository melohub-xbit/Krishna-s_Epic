"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE FRONT DOOR — nine seconds of dawn, once per session.
 *
 * Light and words, and nothing else. The sky warms from the bottom up,
 * an edgeless glow climbs behind the horizon, the stars go out, and the
 * line arrives a few words at a time. Then the plate lifts and the hero
 * is underneath it — and THAT is where the landscape is. Putting the
 * drawing in here as well meant seeing the same picture twice in nine
 * seconds, and it gave the dawn an outline to argue with.
 *
 * There are no drawn objects in the light — no disc, no hills. A
 * border-radius circle reads as a browser shape no matter how well it is
 * coloured; light has no edges. Everything here is an unbounded gradient
 * with one grain layer over the top, which is also what stops a wide
 * gradient banding across a warm ground.
 *
 * Nine seconds is a long time to hold somebody, so: it is skippable with
 * any input, it never plays twice in a session, and reduced motion never
 * sees it at all.
 */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

const LINE = "Watch a sunrise at least once a day.".split(" ");
const DUR = 9000;

export default function Sunrise() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const plate = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("dawn") === "1";
    } catch {
      /* blocked storage — just play it */
    }
    const flat = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || flat) return;

    setShow(true);
    /* the page must not scroll underneath it */
    document.documentElement.style.overflow = "hidden";

    let raf = 0;
    let t0 = 0;
    let ended = false;

    const end = () => {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      try {
        sessionStorage.setItem("dawn", "1");
      } catch {
        /* nothing to do */
      }
      setGone(true);
      document.documentElement.style.overflow = "";
      /* unmount after the lift, not during it */
      window.setTimeout(() => setShow(false), 900);
    };

    const step = (now: number) => {
      if (!t0) t0 = now;
      const p = clamp((now - t0) / DUR, 0, 1);
      const el = plate.current;
      if (el) {
        el.style.setProperty("--t", smooth(clamp(p / 0.94, 0, 1)).toFixed(4));
        /* the words overlap heavily, so it reads as one movement rather
           than seven separate arrivals */
        const span = 0.56 / LINE.length;
        for (let i = 0; i < LINE.length; i++) {
          el.style.setProperty(
            `--w${i}`,
            smooth(clamp((p - (0.3 + i * span)) / (span * 3.4), 0, 1)).toFixed(3)
          );
        }
        /* --c is the tail of the sequence: the skip hint fades up on it */
        el.style.setProperty("--c", smooth(clamp((p - 0.84) / 0.14, 0, 1)).toFixed(3));
      }
      if (p < 1) raf = requestAnimationFrame(step);
      else window.setTimeout(end, 700);
    };
    raf = requestAnimationFrame(step);

    const skip = () => end();
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchstart", skip, { once: true, passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="dawn"
      ref={plate}
      data-gone={gone ? "true" : undefined}
      role="presentation"
    >
      <span className="dawn-sky" />
      <span className="dawn-stars" />
      <span className="dawn-glow" />
      <span className="dawn-land" />
      <div className="dawn-say">
        <p className="dawn-line">
          {LINE.map((word, i) => (
            <i key={word + i} style={{ ["--w" as string]: `var(--w${i}, 0)` }}>
              {word}
            </i>
          ))}
        </p>
      </div>
      <span className="dawn-grain" />
      <span className="dawn-skip lab">any key to skip</span>
    </div>
  );
}
