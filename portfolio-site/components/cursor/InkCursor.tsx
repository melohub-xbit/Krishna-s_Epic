"use client";
import { useEffect, useRef } from "react";

export default function InkCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0;
    const trail: { x: number; y: number; a: number; s: number }[] = [];
    let mx = -100, my = -100, raf = 0;

    const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      trail.push({ x: mx, y: my, a: 1, s: 5 + Math.random() * 4 });
      if (trail.length > 22) trail.shift();
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const color = css("--accent") || "#a5262a";
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.a *= 0.9;
        ctx.globalAlpha = p.a * 0.5;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s * (i / trail.length), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="fixed inset-0 z-[60] pointer-events-none" />;
}
