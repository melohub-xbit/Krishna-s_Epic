"use client";

import { useEffect } from "react";
import { addJob, prefersReducedMotion } from "./dots";

/**
 * Page-level scroll reading.
 *
 * The deck does its own per-frame maths (see components/Deck.tsx); all that
 * is left here is the one number the ambient ground drifts with. It runs on
 * the shared ticker in `dots.ts`, so there is still exactly one
 * requestAnimationFrame loop on this site.
 *
 * It writes overall page progress (0..1) to `--scroll` on <html>, so the
 * ambient ground can drift with it in pure CSS.
 */
export function usePageProgress() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    const stop = addJob(() => {
      const max = root.scrollHeight - window.innerHeight;
      const p = max <= 0 ? 0 : Math.max(0, Math.min(1, window.scrollY / max));
      root.style.setProperty("--scroll", p.toFixed(4));
      return true;
    });
    return () => {
      stop();
    };
  }, []);
}
