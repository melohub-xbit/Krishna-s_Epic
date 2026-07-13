"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const scan = () => {
      const els = document.querySelectorAll<HTMLElement>(".reveal:not(.is-in), .ink-draw:not(.is-in)");
      els.forEach((el) => io.observe(el));
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    const t = window.setTimeout(scan, 60);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);
  return null;
}
