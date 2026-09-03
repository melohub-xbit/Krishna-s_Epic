"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/data/projects";

/**
 * The whole navigation: five dots down one edge, the current one filled.
 *
 * Works on a phone without a hamburger, and it doubles as a position
 * indicator — where you are on the page is where you are in the route.
 */
export default function ProgressDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the entry closest to the top of the viewport that is showing
        let best: { i: number; top: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = els.indexOf(e.target as HTMLElement);
          const top = Math.abs(e.boundingClientRect.top);
          if (!best || top < best.top) best = { i, top };
        }
        if (best) setActive(best.i);
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
          <span className="rail-dot" />
          <span className="rail-label">
            <span className="te">{s.te}</span>
            <span>{s.en}</span>
          </span>
        </a>
      ))}
    </nav>
  );
}
