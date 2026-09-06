"use client";

import { useEffect, useRef, useState } from "react";
import { addJob, prefersReducedMotion } from "@/lib/dots";
import { readVar } from "@/lib/palette";
import { glyphFor } from "@/data/glyphs";
import { SKILLS, SKILL_USES } from "@/data/projects";
import BandStrip, { type StripMark } from "./BandStrip";

/* The scroll indicator is the same instrument the band uses, on a lower
   band: five stations across the shortwave broadcast range, one per
   group. The numbers are read off a linear scale rather than typed in,
   so adding a sixth group moves them all correctly. */
const SW0 = 5.9;
const SW1 = 15.6;

/**
 * THE GLYPH MATRIX — the skills section, as one circular dot screen.
 *
 * A ring of 545 cells, in the spirit of the 489 micro-LEDs on the back of
 * a Phone (3). Each group is baked once into a radius per cell, and the
 * screen redraws itself from one group into the next by **changing dot
 * size, not by fading** — the same move the background field makes
 * between sections, pointed at a circle instead of a rectangle.
 *
 * Scroll is the button. Each group holds for a little over half its beat
 * and then morphs, so the section reads as five deliberate stops rather
 * than a scrub. That dwell is the whole reason the section is tall: it
 * gives the field behind it time to arrive on the barcode, sit there
 * while you read, and leave cleanly into Contact.
 *
 * Only the live index goes through React — five state changes for the
 * whole section. Everything else is written straight to the canvas on the
 * one shared ticker.
 */

const R = 13;
const BAKE = 240;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

type Cell = { gx: number; gy: number; u: number; v: number };

export default function GlyphMatrix() {
  const N = SKILLS.length;

  const scene = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const ticks = useRef<(HTMLSpanElement | null)[]>([]);

  const [live, setLive] = useState(0);

  useEffect(() => {
    const canvas = cv.current;
    const el = scene.current;
    if (!canvas || !el) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* the cells: a disc of the lattice */
    const cells: Cell[] = [];
    for (let gy = -R; gy <= R; gy++) {
      for (let gx = -R; gx <= R; gx++) {
        if (Math.hypot(gx, gy) > R + 0.3) continue;
        cells.push({ gx, gy, u: (gx + R) / (2 * R), v: (gy + R) / (2 * R) });
      }
    }

    /* bake each group to one radius per cell, once */
    const baked: Float32Array[] = SKILLS.map((g) => {
      const off = document.createElement("canvas");
      off.width = BAKE;
      off.height = BAKE;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.fillStyle = "#fff";
      o.strokeStyle = "#fff";
      glyphFor(g.group)(o, BAKE, BAKE);
      const d = o.getImageData(0, 0, BAKE, BAKE).data;
      const out = new Float32Array(cells.length);
      cells.forEach((c, i) => {
        const x = Math.round(c.u * (BAKE - 1));
        const y = Math.round(c.v * (BAKE - 1));
        let acc = 0;
        let n = 0;
        for (let dy = -4; dy <= 4; dy += 2) {
          for (let dx = -4; dx <= 4; dx += 2) {
            const px = clamp(x + dx, 0, BAKE - 1);
            const py = clamp(y + dy, 0, BAKE - 1);
            acc += d[((py | 0) * BAKE + (px | 0)) * 4 + 3] / 255;
            n++;
          }
        }
        out[i] = Math.pow(acc / n, 0.7);
      });
      return out;
    });

    let dotCss = readVar("dot");
    const readColours = () => {
      dotCss = readVar("dot");
    };
    readColours();

    let lastLive = -1;
    let lastKey = "";
    const flat = prefersReducedMotion();

    const draw = () => {
      /* the LAYOUT box, not the painted one: getBoundingClientRect bakes
         in any ancestor transform, and this screen only redraws when the
         scroll changes — so measuring it mid page-turn would leave the
         matrix wrong until the next scroll */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.offsetWidth));
      const h = Math.max(1, Math.round(canvas.offsetHeight));
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      const p = flat ? 0 : travel <= 0 ? 0 : clamp(-rect.top / travel, 0, 1);

      /* each group holds for the first 55% of its beat, then morphs */
      const pos = p * (N - 0.0001);
      const i0 = Math.min(N - 1, Math.floor(pos));
      const i1 = Math.min(N - 1, i0 + 1);
      const f = pos - i0;
      const e = smooth(clamp((f - 0.55) / 0.45, 0, 1));
      const now = e > 0.5 ? i1 : i0;

      const step = w / (2 * R + 2.4);
      const rMax = step * 0.46;

      ctx.clearRect(0, 0, w, h);

      /* the screen at rest — every cell lit faintly, so the disc reads as
         a device that is on rather than as a shape floating in the dark */
      ctx.fillStyle = dotCss;
      ctx.globalAlpha = 0.16;
      ctx.beginPath();
      for (const c of cells) {
        const x = w / 2 + c.gx * step;
        const y = h / 2 + c.gy * step;
        ctx.moveTo(x + rMax * 0.3, y);
        ctx.arc(x, y, rMax * 0.3, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.globalAlpha = 1;

      /* the glyph, one path */
      const A = baked[i0];
      const B = baked[i1];
      ctx.fillStyle = dotCss;
      ctx.beginPath();
      for (let i = 0; i < cells.length; i++) {
        const r = lerp(A[i], B[i], e) * rMax;
        if (r < 0.3) continue;
        const c = cells[i];
        const x = w / 2 + c.gx * step;
        const y = h / 2 + c.gy * step;
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();

      /* the strip reads this off the pin, so it cannot disagree with the
         screen it is reporting on */
      pin.current?.style.setProperty("--p", p.toFixed(4));
      if (now !== lastLive) {
        lastLive = now;
        setLive(now);
        ticks.current.forEach((t, i) => {
          if (t) t.dataset.on = i <= now ? "true" : "false";
        });
      }
    };

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) visible = en.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    io.observe(el);

    const mo = new MutationObserver(() => {
      readColours();
      lastKey = "";
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    const stop = addJob(() => {
      if (!visible) return true;
      const key = `${Math.round(window.scrollY)}|${window.innerWidth}`;
      if (key === lastKey) return true;
      lastKey = key;
      draw();
      return true;
    });

    draw();
    return () => {
      io.disconnect();
      mo.disconnect();
      stop();
    };
  }, [N]);

  const g = SKILLS[live];
  const uses = SKILL_USES[g.group] ?? 0;

  /* one station per group, at the middle of the beat it holds for */
  const strip: StripMark[] = SKILLS.map((s, i) => ({
    at: (i + 0.5) / N,
    label: (SW0 + ((SW1 - SW0) * i) / Math.max(1, N - 1)).toFixed(1),
    name: s.group,
    on: i === live,
  }));

  return (
    <section
      id="skills"
      className="gm-scene"
      ref={scene}
      style={{ height: `${N * 62 + 90}vh` }}
      aria-label="Skills"
    >
      <div className="gm-pin" ref={pin}>
        <div className="shead">
          <h2>
            Skills <span className="te">అస్త్రాలు</span>
          </h2>
          <span className="lab">
            {String(live + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} ·
            scroll to turn
          </span>
        </div>

        <div className="gm-stage">
          <div className="gm">
            <canvas ref={cv} className="gm-screen" aria-hidden="true" />

            <div className="gm-read">
              <h3>{g.group}</h3>
              <p className="gm-cnt">
                {g.items.length} tools
                {uses > 0 && ` · used in ${uses} of 22 projects`}
              </p>
              <ul className="gm-list">
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <div className="gm-ticks" aria-hidden="true">
                {SKILLS.map((s, i) => (
                  <span
                    key={s.group}
                    ref={(node) => {
                      ticks.current[i] = node;
                    }}
                    data-on={i === 0 ? "true" : "false"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <BandStrip band="SW" marks={strip} />
      </div>
    </section>
  );
}
