"use client";

import { useEffect, useRef, useState } from "react";
import { addJob, prefersReducedMotion } from "@/lib/dots";
import { setFieldTune } from "@/lib/field";
import { INTERESTS } from "@/data/interests";
import DoorLink from "./Door";

/**
 * THE BAND — the personal section, as one tuner.
 *
 * Scroll is the dial. The scene is pinned and tall, and how far through it
 * you are is a position on a frequency scale; the nearest station is what
 * shows. Between stations the readout drops to static, which does two
 * useful things: it makes landing on a station feel like landing, and it
 * stops the section reading as a list you scrub past.
 *
 * The same number turns the needle painted into the page background, so
 * the giant halftone dial behind you and the small one in front are one
 * instrument. That is the whole reason this section works where a list of
 * hobbies would not.
 *
 * Past the last station the band does not stop — the last stretch of the
 * scene is the run-out, and the door to /interests sits at the end of it.
 * Overshooting is how you get in.
 *
 * Only the live index goes through React: six state changes for the whole
 * section. Everything else is a CSS variable written on the shared ticker.
 */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

/** fraction of the scene given over to the run-out past the last station */
const RUNOUT = 0.16;

export default function Band() {
  const N = INTERESTS.length;
  const scene = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(0);
  /** true once the band has run out and the door is the only thing left */
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = scene.current;
    const box = pin.current;
    if (!el || !box) return;

    const flat = prefersReducedMotion();
    if (flat) {
      box.style.setProperty("--tune", "0.5");
      box.style.setProperty("--lock", "1");
      box.style.setProperty("--out", "0");
      /* no scroll timeline to run out, so the door is simply there */
      setOpen(true);
      return;
    }

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    io.observe(el);

    let lastKey = "";
    let lastLive = -1;

    const stop = addJob(() => {
      if (!visible) return true;
      const key = `${Math.round(window.scrollY)}|${window.innerWidth}`;
      if (key === lastKey) return true;
      lastKey = key;

      const travel = el.offsetHeight - window.innerHeight;
      const p = travel <= 0 ? 0 : clamp(-el.getBoundingClientRect().top / travel, 0, 1);

      /* the band occupies everything before the run-out */
      const band = clamp(p / (1 - RUNOUT), 0, 1);
      const out = smooth(clamp((p - (1 - RUNOUT)) / RUNOUT, 0, 1));

      const pos = band * (N - 1);
      const idx = Math.round(pos);
      /* how far off station we are, 0 at a stop and 1 exactly between two */
      const drift = Math.min(1, Math.abs(pos - idx) * 2);
      /* the last station stays locked through the run-out */
      const lock = out > 0 ? 1 : 1 - smooth(clamp((drift - 0.34) / 0.5, 0, 1));

      box.style.setProperty("--tune", band.toFixed(4));
      box.style.setProperty("--lock", lock.toFixed(3));
      box.style.setProperty("--out", out.toFixed(3));

      if (idx !== lastLive) {
        lastLive = idx;
        setLive(idx);
        /* the needle in the page background turns with this one */
        setFieldTune(idx);
      }
      setOpen(out > 0.5);
      return true;
    });

    return () => {
      io.disconnect();
      stop();
    };
  }, [N]);

  /** jump the page to the scroll offset where a station sits */
  const goTo = (i: number) => {
    const el = scene.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const p = (i / (N - 1)) * (1 - RUNOUT);
    window.scrollTo({
      top: el.offsetTop + travel * p,
      behavior: "smooth",
    });
  };

  const st = INTERESTS[live];

  return (
    <section
      id="interests"
      className="bd-scene"
      ref={scene}
      style={{ height: `${N * 40 + 80}vh` }}
      aria-label="Interests"
    >
      <div className="bd-pin" ref={pin}>
        <div className="shead">
          <h2>
            Off the clock <span className="te">అభిరుచులు</span>
          </h2>
          <span className="lab">
            {String(live + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} ·
            scroll to tune
          </span>
        </div>

        <div className="bd-stage">
          {/* the field paints the same dial here, at section scale */}
          <span id="band-slot" className="fslot fslot--band" aria-hidden="true" />

          <div className="bd-set">
            <p className="bd-freq" aria-hidden="true">
              {st.freq} <i>MHz</i>
            </p>
            <h3 className="bd-name">
              {st.name} <span className="te">{st.te}</span>
            </h3>
            <p className="bd-sub">
              <span className="bd-copy">{st.sub}</span>
              <span className="bd-static" aria-hidden="true">
                · · ─ · ─ · · ─ ─ · ─ · · ·
              </span>
            </p>

            <div className="bd-scale" aria-hidden="true">
              <span className="bd-ticks" />
              <span className="bd-ticks bd-ticks--big" />
              <span className="bd-hand" />
            </div>

            <div className="bd-stops">
              {INTERESTS.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  className="bd-stop"
                  data-on={i === live ? "true" : "false"}
                  onClick={() => goTo(i)}
                >
                  <span className="lab">{s.freq}</span>
                  <span className="bd-stop-name">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bd-out" data-open={open} aria-hidden={!open}>
            <p className="lab">Past the end of the band</p>
            <DoorLink href="/interests" className="bd-door">
              The whole shelf
            </DoorLink>
          </div>
        </div>

        <div className="bd-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
