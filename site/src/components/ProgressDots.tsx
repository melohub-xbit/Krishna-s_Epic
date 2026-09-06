"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/data/projects";

/**
 * THE SPINE — the whole navigation: six marks down one edge.
 *
 * Each stop is a 3×3 cell of dots rather than a single dot, in the spirit
 * of Ndot type. Nine dots is a shape and reads as a control; one dot is a
 * speck. At rest only the centre dot carries any weight, so the column
 * still looks like the row of dots it replaces — and the active cell
 * lights the whole grid, alternating full and half accent so it reads as
 * a lit matrix rather than a solid red square.
 *
 * The cells sit on the RIGHT, hard against the edge, and the label grows
 * leftward from them. That keeps the column of matrices dead straight
 * whatever the labels are doing — with the label first, every stop would
 * start at a different x and the one thing you navigate by would wobble.
 *
 * It doubles as a position indicator: where you are on the page is where
 * you are in the route.
 */
export default function ProgressDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!els.length) return;

    /* Which stops are currently crossing the middle band, kept as state
       rather than read off the callback's batch.

       The batch only contains what CHANGED. Contact is a marker inside
       the interests scene, so scrolling up off it produced a batch with
       one entry, not intersecting — nothing to choose from — and the
       old code simply left the previous stop lit. It stayed on Contact
       through the whole of the interests scene and only corrected when
       Skills finally came into the band. Anything that overlaps another
       stop hits this; holding the full set is the only version that is
       correct for a section inside a section. */
    const on = new Map<HTMLElement, boolean>();

    const pick = () => {
      let best: { i: number; top: number } | null = null;
      for (const [el, showing] of on) {
        if (!showing) continue;
        const i = els.indexOf(el);
        /* closest to the middle of the band wins, so a marker sitting in
           it beats the tall section it lives inside */
        const top = Math.abs(el.getBoundingClientRect().top);
        if (!best || top < best.top) best = { i, top };
      }
      if (best) setActive(best.i);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          on.set(e.target as HTMLElement, e.isIntersecting);
        }
        pick();
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="rail" aria-label="Sections">
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="rail-item"
          data-on={i === active ? "1" : undefined}
          aria-current={i === active ? "true" : undefined}
        >
          <span className="rail-label">
            <span className="te">{s.te}</span>
            <span>{s.en}</span>
          </span>
          <span className="rail-cell" aria-hidden="true">
            {Array.from({ length: 9 }, (_, d) => (
              <i key={d} />
            ))}
          </span>
        </a>
      ))}
    </nav>
  );
}
