"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE FRONT DOOR — three layers, arriving in order.
 *
 *   1. A halftone of the photograph, filling the right of the frame,
 *      monochrome, with a torch of real colour following the cursor. The
 *      pixels come from the one fixed field canvas (see Halftone.tsx);
 *      all the hero holds is the slot marking where it should sit, so
 *      the same picture can travel out of here and into About.
 *   2. A boot log. The page comes up like a device: eight true lines type
 *      out, each one checks off, and the last says online. Under a second
 *      and a half, skippable with any input, and skipped outright on the
 *      second visit in a session — nobody should have to watch it twice.
 *   3. The name wall. Five rows of the name at wall size, outlined and
 *      drifting in alternating directions, Telugu and Latin alternating
 *      with them, one solid row through the middle.
 *
 * The wall and the copy do not exist until the log finishes, so the hero
 * has an order to it rather than everything competing on arrival.
 */

const BOOT: [string, string, string][] = [
  ["init ", "profile", "velidanda krishna sai"],
  ["load ", "location", "bangalore, india"],
  ["load ", "institution", "iiit bangalore · dual degree"],
  ["load ", "affiliation", "samsung r&d · research"],
  ["index", "projects", "22"],
  ["check", "best result", "95.6%"],
  ["check", "best placing", "1st / 2,000"],
  ["ready", "", "online"],
];

const WALL = [
  { text: "VELIDANDA", dir: "a", te: false, hot: false },
  { text: "కృష్ణ సాయి", dir: "b", te: true, hot: false },
  { text: "KRISHNA SAI", dir: "a", te: false, hot: true },
  { text: "వెలిదండ", dir: "b", te: true, hot: false },
  { text: "VELIDANDA KRISHNA SAI", dir: "a", te: false, hot: false },
];

const DOTS = "·".repeat(40);

export default function Hero({
  statement,
  quiet,
}: {
  statement: string;
  quiet: string;
}) {
  const [line, setLine] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("booted") === "1";
    } catch {
      /* private mode, blocked storage — just play it */
    }
    const flat = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      window.clearTimeout(timer.current);
      setLine(BOOT.length);
      setDone(true);
      try {
        sessionStorage.setItem("booted", "1");
      } catch {
        /* nothing to do */
      }
    };

    if (seen || flat) {
      finish();
      return;
    }

    let i = 0;
    const step = () => {
      i += 1;
      setLine(i);
      if (i >= BOOT.length) {
        timer.current = window.setTimeout(finish, 260);
        return;
      }
      timer.current = window.setTimeout(step, 145);
    };
    timer.current = window.setTimeout(step, 260);

    /* any input at all skips the rest of it */
    const skip = () => finish();
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchstart", skip, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer.current);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, []);

  return (
    <section id="entry" className="hero" data-done={done ? "true" : undefined}>
      <div className="hero-bg" aria-hidden="true">
        {/* the picture is painted here by the field canvas, and this is
            the rect it is painted into — see Halftone.tsx */}
        <div id="hero-slot" className="hero-slot" />
        <span className="hero-veil" />
      </div>

      <div className="hero-wall" aria-hidden="true">
        {WALL.map((r, i) => (
          <div
            key={r.text + i}
            className={`hw ${r.dir}${r.hot ? " hot" : ""}${r.te ? " te" : ""}`}
            style={{ ["--i" as string]: i }}
          >
            {Array.from({ length: 6 }, (_, k) => (
              <span key={k}>{r.text}</span>
            ))}
          </div>
        ))}
      </div>

      <h1 className="sr-only">Velidanda Krishna Sai — {statement}</h1>

      <div className="hero-copy">
        <div className="hero-boot" aria-hidden="true">
          {BOOT.slice(0, line).map((b, i) => (
            <p key={b[1] + i}>
              <span className="bk">{b[0]}</span>
              {b[1] && (
                <>
                  {" "}
                  <span className="bn">{b[1]}</span>{" "}
                  <span className="bd">
                    {DOTS.slice(0, Math.max(2, 26 - b[1].length))}
                  </span>{" "}
                </>
              )}
              {!b[1] && <span className="bd"> {DOTS.slice(0, 26)} </span>}
              <span className={i === BOOT.length - 1 ? "bo" : "bv"}>
                {b[2]}
              </span>
              {i < BOOT.length - 1 && i >= 4 && <span className="bo"> ok</span>}
            </p>
          ))}
          {!done && <span className="caret" />}
        </div>

        <div className="hero-say">
          <p className="hero-stmt">
            {statement} <span className="quiet">{quiet}</span>
          </p>
          <div className="meta">
            <div>
              <span className="lab">Based in</span>
              <span>Bangalore, India</span>
            </div>
            <div>
              <span className="lab">Currently</span>
              <span>Dual degree, IIIT Bangalore</span>
            </div>
            <div>
              <span className="lab">Most recently</span>
              <span>Research at Samsung Lab</span>
            </div>
          </div>
        </div>
      </div>

      <p className="hero-status lab">
        <span className="bo">Online</span> · ↓ Scroll
      </p>
    </section>
  );
}
