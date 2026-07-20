"use client";
import { useEffect } from "react";

/**
 * Scroll reveal + section tracking.
 *
 * One IntersectionObserver for every `.rv` element (panels reveal as you scroll
 * — the manga "turn the page" beat), and a second for `[data-sec]` sections so
 * the top nav and the parva counter can mark the current chapter.
 *
 * Reveal is one-shot: once a panel has been read it stays visible. Re-hiding
 * content on scroll-up is disorienting.
 */
export default function Reveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cleanupReveal: (() => void) | undefined;

    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    if (reduced) {
      els.forEach((el) => el.setAttribute("data-in", "1"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.setAttribute("data-in", "1");
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
      );
      els.forEach((el) => io.observe(el));
      cleanupReveal = () => io.disconnect();
    }

    // ---- current-section tracking ----
    const secs = Array.from(document.querySelectorAll<HTMLElement>("[data-sec]"));
    const mark = (id: string) => {
      document.querySelectorAll<HTMLElement>("[data-navfor]").forEach((n) => {
        n.setAttribute("data-on", n.getAttribute("data-navfor") === id ? "1" : "0");
      });
    };
    const so = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) mark((vis.target as HTMLElement).dataset.sec || "");
      },
      { threshold: [0.25, 0.5, 0.75] }
    );
    secs.forEach((s) => so.observe(s));

    return () => {
      cleanupReveal?.();
      so.disconnect();
    };
  }, []);

  return null;
}
