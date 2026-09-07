"use client";

import { useEffect } from "react";
import { addJob, prefersReducedMotion } from "@/lib/dots";

/**
 * THE PROJECTOR — the About section, switching itself on.
 *
 * One number drives everything: how far through the pinned section you
 * are, shaped into assemble → hold → take apart. Every stage is a window
 * on that number, so the sequence runs forwards on the way in and
 * *backwards* on the way out, with no separate exit to keep in step:
 *
 *   0.00 – 0.14   the base snaps open sideways, a line of light
 *   0.08 – 0.20   it fills out into a slab
 *   ~0.16         the flash — the lamp striking
 *   0.16 – 0.48   the beam climbs out of the lens
 *   0.24 – 0.62   the picture unfolds up out of the base
 *   0.44 – 0.82   the callouts arrive
 *
 * The whole sequence used to be spread over the first 30% of the pin's
 * travel, which is half a screen of scrolling spent looking at an empty
 * stage before anything happened. It is 17% now — the projector is
 * assembling by the time the section has settled, not long after.
 *
 * Scrolling away runs that in reverse: the picture reels back down into
 * the lens, the beam retracts, and the slab collapses to a line and then
 * to nothing — the way a CRT switches off.
 *
 * The section is pinned and three screens tall so all of that happens
 * while the projector is actually in front of you. Anchored to a
 * one-screen section instead, both ramps finished before it came into
 * view and it simply sat there fully lit.
 *
 * The picture is a plain image inside `#about-slot`, so transforming the
 * slot is what unfolds it out of the lens and reels it back in. It used
 * to be a halftone painted by a full-screen canvas that read this slot's
 * rect every frame; the photograph is in colour now and the canvas is
 * gone, which cost this file nothing — it only ever moved the box.
 *
 * The flicker is deterministic, not random: three sines beaten together
 * so it wanders instead of buzzing, and mostly sits at 1 with occasional
 * dips. A projector that flickers on every frame reads as a broken web
 * page; one that dips twice a second reads as a projector.
 */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
/** a 0..1 window on `p`, eased */
const stage = (p: number, from: number, to: number) =>
  smooth(clamp((p - from) / (to - from), 0, 1));

export default function HoloDriver() {
  useEffect(() => {
    const sec = document.getElementById("about");
    if (!sec) return;

    const flat = prefersReducedMotion();

    if (flat) {
      /* no projector: everything simply on */
      for (const k of ["bx", "by", "flash", "beam", "fig", "call"]) {
        sec.style.setProperty(`--h-${k}`, k === "flash" ? "0" : "1");
      }
      sec.style.setProperty("--h-flick", "1");
      sec.style.setProperty("--h-jit", "0px");
      sec.style.setProperty("--to-base", "0px");
      return;
    }

    /* how far the picture has to travel to reach the lens */
    let toBase = 240;
    const measure = () => {
      const fig = document.getElementById("about-slot");
      const base = sec.querySelector<HTMLElement>(".holo-base");
      if (!fig || !base) return;
      const f = fig.getBoundingClientRect();
      const b = base.getBoundingClientRect();
      toBase = Math.max(0, b.top + b.height / 2 - (f.top + f.height / 2));
      sec.style.setProperty("--to-base", `${toBase.toFixed(0)}px`);
    };

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    io.observe(sec);

    let lastKey = "";
    let measured = false;

    const stop = addJob((now) => {
      /* Nothing measured during a page-turn is true: the whole page is
         inside a rotated panel, so every rect comes back foreshortened.
         --to-base is measured once and kept, so one bad read would stick. */
      if (document.documentElement.classList.contains("door-flip")) {
        return true;
      }
      if (!visible) {
        /* fully gone: collapsed, and nothing to compute */
        if (lastKey !== "off") {
          lastKey = "off";
          for (const k of ["bx", "by", "flash", "beam", "fig", "call"]) {
            sec.style.setProperty(`--h-${k}`, "0");
          }
          sec.style.setProperty("--h-flick", "1");
          sec.style.setProperty("--h-jit", "0px");
        }
        return true;
      }
      if (!measured) {
        measure();
        measured = true;
      }

      const h = window.innerHeight;
      const r = sec.getBoundingClientRect();
      const travel = sec.offsetHeight - h;

      let p: number;
      if (travel > h * 0.4) {
        /* pinned: the projector holds in the middle of the screen while
           the section's own scroll assembles it, holds, and undoes it */
        const prog = clamp(-r.top / travel, 0, 1);
        p =
          prog < 0.5
            ? smooth(clamp(prog / 0.17, 0, 1))
            : smooth(clamp((1 - prog) / 0.24, 0, 1));
      } else {
        /* too short to pin — fall back to how centred the section is */
        const c = r.top + r.height / 2;
        p = smooth(clamp(1 - Math.abs(c - h * 0.5) / (h * 0.7), 0, 1));
      }

      const bx = stage(p, 0, 0.14);
      const by = stage(p, 0.08, 0.2);
      const beam = stage(p, 0.16, 0.48);
      const fig = stage(p, 0.24, 0.62);
      const call = stage(p, 0.44, 0.82);
      /* the lamp striking — a triangle around the moment the slab fills */
      const flash = 1 - Math.min(1, Math.abs(p - 0.16) / 0.12);

      /* three sines beaten together: wanders, never repeats on a beat */
      const n =
        Math.sin(now * 0.0021) *
        Math.sin(now * 0.0071) *
        Math.sin(now * 0.0133);
      const lit = p > 0.24 ? 1 : 0;
      const flick = lit && n > 0.42 ? (n > 0.62 ? 0.82 : 0.93) : 1;
      const jit = lit && n > 0.72 ? (Math.sin(now * 0.05) > 0 ? 1.6 : -1.6) : 0;

      const key =
        `${bx.toFixed(3)}|${by.toFixed(3)}|${beam.toFixed(3)}|` +
        `${fig.toFixed(3)}|${call.toFixed(3)}|${flash.toFixed(3)}|` +
        `${flick}|${jit}`;
      if (key === lastKey) return true;
      lastKey = key;

      sec.style.setProperty("--h-bx", bx.toFixed(3));
      sec.style.setProperty("--h-by", by.toFixed(3));
      sec.style.setProperty("--h-beam", beam.toFixed(3));
      sec.style.setProperty("--h-fig", fig.toFixed(3));
      sec.style.setProperty("--h-call", call.toFixed(3));
      sec.style.setProperty("--h-flash", flash.toFixed(3));
      sec.style.setProperty("--h-flick", String(flick));
      sec.style.setProperty("--h-jit", `${jit}px`);

      return true;
    });

    const onResize = () => {
      measured = false;
      lastKey = "";
    };
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", onResize);
      stop();
    };
  }, []);

  return null;
}
