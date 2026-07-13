"use client";
import { useEffect, useRef } from "react";

type P = { x: number; y: number; s: number; r: number; vr: number; vy: number; vx: number; a: number };

export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0;
    const parts: P[] = [];
    let raf = 0;
    let running = true;

    const isNight = () => document.documentElement.getAttribute("data-daynight") === "night";
    const css = (v: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888";

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(38, Math.round(W / 34));
      while (parts.length < target) parts.push(spawn(true));
      parts.length = target;
    };

    const spawn = (anywhere = false): P => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : -20,
      s: 3 + Math.random() * 6,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.02,
      vy: 0.25 + Math.random() * 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      a: 0.35 + Math.random() * 0.4,
    });

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const night = isNight();
      const c1 = night ? css("--accent2") : css("--leaf");
      const c2 = night ? css("--accent") : css("--marigold");
      const t = performance.now() * 0.001;

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (night) {
          p.y -= p.vy * 0.7;
          p.x += Math.sin(t + i) * 0.25;
          if (p.y < -20) Object.assign(p, spawn(), { y: H + 20 });
          ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(t * 2 + i));
          ctx.fillStyle = i % 3 === 0 ? c2 : c1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s * 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          p.y += p.vy;
          p.x += p.vx + Math.sin(t + i) * 0.2;
          p.r += p.vr;
          if (p.y > H + 20) Object.assign(p, spawn());
          ctx.globalAlpha = p.a;
          ctx.fillStyle = i % 4 === 0 ? c2 : c1;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.s, p.s * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="fixed inset-0 -z-[5] pointer-events-none" style={{ opacity: 0.5 }} />;
}
