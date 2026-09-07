"use client";

import { useEffect, useRef } from "react";
import { glyphFor } from "@/data/glyphs";

/**
 * One glyph, painted small.
 *
 * The skills disc redraws its painters onto a dot matrix; this is the
 * plain version — the same painter straight onto a tiny canvas, in
 * whatever colour the surrounding text is. Used by the M band, where a
 * station gets an emblem beside its name.
 *
 * The canvas is measured from its own box (offsetWidth), never from
 * getBoundingClientRect, because this thing renders inside the page-flip
 * panel and a transformed ancestor bakes itself into every rect.
 */
export default function Glyph({
  name,
  size = 26,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const cv = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const o = c.getContext("2d");
    if (!o) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = c.offsetWidth || size;
    c.width = Math.round(s * dpr);
    c.height = Math.round(s * dpr);
    o.setTransform(dpr, 0, 0, dpr, 0, 0);
    o.clearRect(0, 0, s, s);

    const ink = getComputedStyle(c).color;
    o.strokeStyle = ink;
    o.fillStyle = ink;
    glyphFor(name)(o, s, s);
  }, [name, size]);

  return (
    <canvas
      ref={cv}
      className={className}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
