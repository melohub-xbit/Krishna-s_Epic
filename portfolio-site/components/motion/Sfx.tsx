"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  rot?: number;
  color?: string;
  telugu?: boolean;
  size?: number;
};

export default function Sfx({ children, className = "", rot = -6, color = "var(--accent)", telugu, size = 40 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setPlay(false);
            requestAnimationFrame(() => setPlay(true));
          }
        });
      },
      { threshold: 0.9 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none select-none ${telugu ? "telugu" : "impact"} ${className}`}
      style={{
        ["--rot" as string]: `${rot}deg`,
        color,
        fontSize: size,
        lineHeight: 1,
        transform: `rotate(${rot}deg)`,
        opacity: 0,
        animation: play ? "sfxPop 2.6s ease-out forwards" : "none",
        WebkitTextStroke: "1px var(--line)",
      }}
    >
      {children}
    </div>
  );
}
