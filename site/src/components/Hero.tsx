"use client";

import { useEffect, useRef, useState } from "react";
import Contour from "./Contour";

/**
 * THE FRONT DOOR — three layers, arriving in order.
 *
 *   1. The field's lattice, and the torch that colours it under the
 *      cursor. No photograph — the face belongs to About, and having it
 *      here as well meant meeting the same person twice.
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

/* The line the loader is long enough to read. It is about attention to
   detail, which is the claim the rest of the site spends five scenes
   making — and the joke is in the arithmetic, which needs a beat. */
const CREED = "Success is 1% inspiration, 98% perspiration, and 2% attention to detail.";

const WALL = [
  { text: "VELIDANDA", dir: "a", te: false, hot: false, mark: true },
  { text: "కృష్ణ సాయి", dir: "b", te: true, hot: false },
  { text: "KRISHNA SAI", dir: "a", te: false, hot: true },
  { text: "వెలిదండ", dir: "b", te: true, hot: false },
  { text: "VELIDANDA KRISHNA SAI", dir: "a", te: false, hot: false },
];

const DOTS = "·".repeat(40);

/**
 * The two pointers.
 *
 * Each is one continuous stroke that sweeps out, loops once, and then
 * leaves the loop heading at the thing it is pointing at — the loop is
 * what makes it read as drawn by a hand rather than plotted. The head is
 * an open V laid on the tip, not a filled triangle: a filled head is an
 * icon, two strokes are a pen.
 *
 * They are two separate shapes rather than one rotated, because the top
 * one has to travel right and down into the wall while the bottom one
 * drops straight onto the line beneath it, and a rotated copy of either
 * ends up curling the wrong way round.
 */

/** sweeps right, loops, and comes down into the name wall */
function CurlToWall() {
  return (
    <svg className="doodle" viewBox="0 0 64 48" fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11C17 3 32 5 41 14c7 7 5 17-2 17-6 0-8-7-2-9 7-2 14 5 15 17" />
        <path d="M46 33l6 7 6-7" />
      </g>
    </svg>
  );
}

/**
 * Drops, loops, and lands on the line below it.
 *
 * The stroke starts at the far LEFT of the box and level with the middle
 * of the text, because the box is aligned on the baseline and hangs
 * below it — begin the path at the top of the viewBox, as this did, and
 * the arrow appears to start an inch above the words it belongs to,
 * floating on its own.
 */
function CurlToLine() {
  return (
    <svg className="doodle" viewBox="0 0 46 56" fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 11c13-2 24 4 26 15 1 7-4 11-8 9-3-2-3-7 1-8 7-1 12 7 11 17" />
        <path d="M26 39l6 8 6-8" />
      </g>
    </svg>
  );
}

export default function Hero({ statement }: { statement: string }) {
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
        {/* the picture. The dawn is only light — this is the thing it
            was rising over, and it breathes. */}
        <Contour className="hero-land" animate />
        <span className="hero-veil" />
      </div>

      <p className="hero-yo" aria-hidden="true">
        <span>Yo! I&rsquo;m</span>
        <CurlToWall />
      </p>

      <div className="hero-wall" aria-hidden="true">
        {WALL.map((r, i) => (
          <div
            key={r.text + i}
            className={
              `hw ${r.dir}` +
              (r.hot ? " hot" : "") +
              (r.te ? " te" : "") +
              (r.mark ? " mark" : "")
            }
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
          {done && <p className="boot-creed">{CREED}</p>}
          {!done && <span className="caret" />}
        </div>

        <div className="hero-say">
          <p className="hero-thought" aria-hidden="true">
            <span>Here&rsquo;s a thought</span>
            <CurlToLine />
          </p>

          <p className="said">
            &ldquo;When life gives you lemonade, make lemons. Life will be all
            like, &lsquo;Whaaaaaat?!&rsquo;&rdquo;
          </p>

          <p className="hero-quip">Good one, right :)</p>

          <p className="hero-intro">
            Anyway — I&rsquo;m Krishna Sai. A developer across a lot of domains and
            a researcher in a few of them. I like building things, shipping
            them, and making it just in time for a twilight.{" "}
            <span>The rest of it is below.</span>
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
          </div>
        </div>
      </div>

      <p className="hero-status lab">
        <span className="bo">Online</span> · ↓ Scroll
      </p>
    </section>
  );
}
