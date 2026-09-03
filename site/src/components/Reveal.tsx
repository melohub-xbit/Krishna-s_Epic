"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** ms */
  delay?: number;
  id?: string;
};

/**
 * A single fade-and-lift when a block first enters view. That is the entire
 * scroll animation budget for this site — motion explains where you are, it
 * does not perform. Under reduced motion it does nothing at all.
 */
export default function Reveal({
  children,
  as = "div",
  className = "",
  delay = 0,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-in");
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return createElement(
    as,
    { ref, id, className: `reveal ${className}`.trim() },
    children
  );
}
