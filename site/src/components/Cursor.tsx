"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/dots";

/**
 * The cursor is a dot. It opens into a ring over anything interactive.
 *
 * Adds itself to every link, button and [data-cursor] element via one
 * delegated listener, so nothing has to opt in by hand. Hidden entirely
 * on touch devices and under reduced motion.
 */
export default function Cursor() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = document.createElement("div");
    el.className = "cursor-dot";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);

    let x = 0,
      y = 0,
      tx = 0,
      ty = 0,
      shown = false,
      raf = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        el.style.opacity = "1";
      }
    };

    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const hit = t?.closest("a, button, [data-cursor], input, summary");
      el.classList.toggle("is-open", !!hit);
    };

    const leave = () => {
      el.style.opacity = "0";
      shown = false;
    };

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      el.remove();
    };
  }, []);

  return null;
}
