"use client";

import { useEffect, useRef, useState } from "react";
import { addJob, prefersReducedMotion } from "@/lib/dots";
import { INTERESTS } from "@/data/interests";
import DoorLink from "./Door";
import Contact from "./Contact";
import BandStrip, { type StripMark } from "./BandStrip";

/**
 * THE BAND — the personal section and the sign-off, as one tuner.
 *
 * Scroll is the dial. How far through this scene you are is a position on
 * a frequency scale, and the whole end of the site happens inside it —
 * the page never leaves this pin until it is over:
 *
 *   0.00 – 0.58   the six stations. Between them the readout drops to
 *                 static and the name goes soft, so landing on one feels
 *                 like landing rather than like scrubbing a list.
 *   0.52 – 0.58   the set lets go
 *   0.55 – 0.80   past the end of the band: the door to /interests, alone
 *                 on screen, for a few screens of scroll
 *   0.72 – 0.86   dead air. The door goes under it and the noise comes up
 *   0.80 – 0.94   the card locks in — out of the noise, in place
 *   0.94 – 1.00   hold. Nothing moves; the page has ended.
 *
 * Contact is NOT a section below this one. It is the last thing the same
 * instrument lands on, faded up in the same pin the dial is in, which is
 * why there is no handoff to get wrong and no second scroll to sit
 * through. Scrolling back up runs every one of those ranges in reverse
 * for free: they are all windows on one number, not animations with a
 * direction of their own.
 *
 * Only the live station index and two booleans go through React — nine
 * state changes for the entire end of the site. Everything else is a CSS
 * variable written on the shared ticker.
 */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
/** a 0..1 window on p, eased */
const win = (p: number, a: number, b: number) =>
  smooth(clamp((p - a) / (b - a), 0, 1));

/* the timeline above, as numbers */
const BAND_END = 0.58;
const SET_GO = 0.52;
const DOOR_GO = 0.74;
const AIR_IN = 0.72;
const LOCK_IN = 0.8;
const LOCK_OUT = 0.94;

/**
 * The strip along the bottom is the WHOLE band, zoomed out; the dial in
 * the middle of the screen is the interests part of it, zoomed in. Both
 * hands are driven by the same scroll number, so they always agree — the
 * dial's position is just the strip's divided by BAND_END.
 *
 * Everything past the six stations is off the end of the interests band,
 * which is where the door and the sign-off live. Their frequencies are
 * not decoration: they are read off the same linear scale the six sit on,
 * so the numbers stay true however the timeline is retuned.
 */
const F0 = Number(INTERESTS[0].freq);
const F1 = Number(INTERESTS[INTERESTS.length - 1].freq);
const freqAt = (p: number) => F0 + ((F1 - F0) * p) / BAND_END;

const MARKS = [
  ...INTERESTS.map((s, i) => ({
    at: (i / (INTERESTS.length - 1)) * BAND_END,
    label: s.freq,
    name: s.name,
  })),
  { at: 0.66, label: freqAt(0.66).toFixed(1), name: "The shelf", minor: true },
  { at: 0.9, label: freqAt(0.9).toFixed(1), name: "Signal", minor: true },
];

export default function Band() {
  const N = INTERESTS.length;
  const scene = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(0);
  /** the door is alone on screen and can be reached */
  const [open, setOpen] = useState(false);
  /** the card has tuned in and can be read */
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const el = scene.current;
    const box = pin.current;
    if (!el || !box) return;

    const flat = prefersReducedMotion();
    if (flat) {
      for (const [k, v] of [
        ["--tune", "1"],
        ["--lock", "1"],
        ["--out", "0"],
        ["--door", "1"],
        ["--ct-air", "0"],
        ["--ct-lock", "1"],
        ["--p", "1"],
      ] as const) {
        box.style.setProperty(k, v);
      }
      setOpen(true);
      setLocked(true);
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
    let wasOpen = false;
    let wasLocked = false;

    const stop = addJob(() => {
      if (!visible) return true;
      const key = `${Math.round(window.scrollY)}|${window.innerWidth}`;
      if (key === lastKey) return true;
      lastKey = key;

      const travel = el.offsetHeight - window.innerHeight;
      const p =
        travel <= 0
          ? 0
          : clamp(-el.getBoundingClientRect().top / travel, 0, 1);

      /* ── the band ── */
      const band = clamp(p / BAND_END, 0, 1);
      const pos = band * (N - 1);
      const idx = Math.round(pos);
      /* how far off station, 0 at a stop and 1 exactly between two */
      const drift = Math.min(1, Math.abs(pos - idx) * 2);
      const out = win(p, SET_GO, BAND_END);
      /* the last station stays locked once the set is on its way out */
      const lock = out > 0 ? 1 : 1 - smooth(clamp((drift - 0.34) / 0.5, 0, 1));

      /* ── the crossing ── */
      const ctLock = win(p, LOCK_IN, LOCK_OUT);
      /* the door comes up with the run-out and goes under the noise */
      const door = out * (1 - win(p, DOOR_GO, AIR_IN + 0.08));
      /* dead air: up as the door leaves, gone once the card has landed */
      const air = win(p, AIR_IN, AIR_IN + 0.06) * (1 - ctLock);

      box.style.setProperty("--p", p.toFixed(4));
      box.style.setProperty("--tune", band.toFixed(4));
      box.style.setProperty("--lock", lock.toFixed(3));
      box.style.setProperty("--out", out.toFixed(3));
      box.style.setProperty("--door", door.toFixed(3));
      box.style.setProperty("--ct-air", air.toFixed(3));
      box.style.setProperty("--ct-lock", ctLock.toFixed(4));

      if (idx !== lastLive) {
        lastLive = idx;
        setLive(idx);
      }
      const o = door > 0.5;
      if (o !== wasOpen) {
        wasOpen = o;
        setOpen(o);
      }
      const l = ctLock > 0.5;
      if (l !== wasLocked) {
        wasLocked = l;
        setLocked(l);
      }
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
    window.scrollTo({
      top: el.offsetTop + travel * ((i / (N - 1)) * BAND_END),
      behavior: "smooth",
    });
  };

  const st = INTERESTS[live];

  const strip: StripMark[] = MARKS.map((m, i) => ({
    ...m,
    on:
      i < N
        ? !open && !locked && i === live
        : m.name === "The shelf"
          ? open && !locked
          : locked,
  }));

  return (
    <section
      id="interests"
      className="bd-scene"
      ref={scene}
      style={{ height: `${N * 40 + 80 + 210}vh` }}
      aria-label="Interests and contact"
    >
      {/* What the nav dot for Contact tracks, because Contact has no
          section of its own any more.

          It has to be a RANGE, not a point, and it has to be positioned
          in the scene's own coordinates rather than as a flat percentage.
          A pinned scene scrolls by `height - 100vh`, so a marker at a
          fixed 82% only crosses the middle of the viewport for about two
          percent of the scroll and sits above it for the whole of the
          final hold — which is exactly when you are reading the card.
          Anchored to the moment the card locks, and running to the end
          of the scene, it is in the band for as long as Contact is what
          you are looking at. */}
      <span
        id="contact"
        className="ct-anchor"
        aria-hidden="true"
        style={{ top: `calc(50vh + ${LOCK_IN} * (100% - 100vh))`, bottom: 0 }}
      />

      <div className="bd-pin" ref={pin} data-open={open} data-locked={locked}>
        <div className="shead bd-head">
          <h2>
            Off the clock <span className="te">అభిరుచులు</span>
          </h2>
          <span className="lab">
            {String(live + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} ·
            scroll to tune
          </span>
        </div>

        <div className="bd-stage">
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

          <div className="bd-out" aria-hidden={!open}>
            <p className="lab">Past the end of the band</p>
            <DoorLink href="/interests" className="bd-door">
              The whole shelf
            </DoorLink>
          </div>

          {/* dead air, between the end of the band and the last card */}
          <span className="ct-noise" aria-hidden="true" />

          <Contact />
        </div>

        {/* the whole band, zoomed out — the dial above is the left 58%
            of this, and both hands come off the same number */}
        <BandStrip band="FM" zone={BAND_END} marks={strip} />
      </div>
    </section>
  );
}
