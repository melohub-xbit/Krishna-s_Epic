"use client";

import { useEffect, useRef } from "react";
import { addJob } from "@/lib/dots";
import { readVar } from "@/lib/palette";
import { onFieldReveal } from "@/lib/field";

/**
 * THE PROJECTION — the photograph, as a halftone, and nothing else.
 *
 * One fixed canvas the size of the viewport. It paints exactly one thing:
 * a COLS × ROWS halftone screen of the portrait, mapped into whatever
 * rect `#about-slot` currently occupies. The About section transforms
 * that slot, so the picture unfolds out of the projector's lens and reels
 * back into it without this file knowing the section exists.
 *
 * The torch is here too, but only over the picture: within a radius of
 * the cursor each dot swells slightly and takes the photograph's *real*
 * colour, so moving the pointer across the projection reveals it. Colour
 * is mixed for the few hundred cells inside that radius rather than for
 * the grid, because everywhere else the dots are one flat fill.
 *
 * This used to be the whole page's background — a full-screen lattice
 * lit by the same torch, and four more stations (the live poster's mark,
 * the skills glyph, the interests dial, the contact seal) that the screen
 * morphed between as you scrolled. All of that is gone: the marks still
 * exist on the posters and the matrix still draws its own screen, but
 * nothing paints behind the page any more. What is left behind the site
 * is Ambient's two colour fields, and this.
 *
 * Cost per frame: one interpolation-free pass over the grid, batched into
 * a single path and fill, plus the torch cells — and only on frames where
 * the scroll or the pointer actually moved.
 */

const COLS = 104;
const ROWS = 138;
const N = COLS * ROWS;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export default function Halftone({
  photo,
  className,
}: {
  photo: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let reach = 190;

    let dot = "rgba(242,239,234,.85)";

    const mouse = { x: -9999, y: -9999, on: false };
    let dirty = true;
    let lastKey = "";

    /** how much of the picture the projector is currently throwing */
    let gate = 1;

    /* the screen: one radius and one colour per cell */
    const rad = new Float32Array(N);
    const col = new Uint8ClampedArray(N * 3);
    let ready = false;
    let aspect = 0;

    const img = new Image();
    let imgReady = false;

    /* ── sampling ─────────────────────────────────────────── */

    /** resample the photograph into COLS × ROWS, contained at `asp` */
    function render(asp: number) {
      if (!imgReady) return false;

      const off = document.createElement("canvas");
      off.width = COLS;
      off.height = ROWS;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.clearRect(0, 0, COLS, ROWS);

      /* The grid is COLS × ROWS cells covering a rect of this aspect, so a
         cell is (W/COLS) wide and (H/ROWS) tall. Contain a source of aspect
         S inside that rect and measure the result in cells:
             wider than the box   → dw = COLS, dh = ROWS · asp / S
             taller than the box  → dh = ROWS, dw = COLS · S / asp
         Both branches once took their base from the *other* axis, which
         scaled everything by ROWS/COLS — 33% here — and cropped the face. */
      const S = img.naturalWidth / img.naturalHeight;
      let dw: number;
      let dh: number;
      if (S > asp) {
        dw = COLS;
        dh = (ROWS * asp) / S;
      } else {
        dh = ROWS;
        dw = (COLS * S) / asp;
      }
      const dx = (COLS - dw) / 2;
      const dy = (ROWS - dh) / 2;

      /* Step down by halves rather than dropping 1400px straight to a
         hundred-odd. One big drawImage point-samples and the face comes
         out speckled; halving averages every pixel in. */
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      let src: CanvasImageSource = img;
      while (sw > dw * 2 && sh > dh * 2) {
        const half = document.createElement("canvas");
        half.width = Math.max(1, Math.round(sw / 2));
        half.height = Math.max(1, Math.round(sh / 2));
        const hc = half.getContext("2d")!;
        hc.imageSmoothingEnabled = true;
        hc.imageSmoothingQuality = "high";
        hc.drawImage(src, 0, 0, half.width, half.height);
        src = half;
        sw = half.width;
        sh = half.height;
      }
      o.imageSmoothingEnabled = true;
      o.imageSmoothingQuality = "high";
      o.drawImage(src, dx, dy, dw, dh);

      const d = o.getImageData(0, 0, COLS, ROWS).data;
      for (let i = 0; i < N; i++) {
        const a = d[i * 4 + 3] / 255;
        const lum =
          a > 0.02
            ? (0.2126 * d[i * 4] +
                0.7152 * d[i * 4 + 1] +
                0.0722 * d[i * 4 + 2]) /
              255
            : 0;
        rad[i] = Math.pow(lum * a, 0.8);
        col[i * 3] = d[i * 4];
        col[i * 3 + 1] = d[i * 4 + 1];
        col[i * 3 + 2] = d[i * 4 + 2];
      }
      aspect = asp;
      ready = true;
      return true;
    }

    /* ── sizing ───────────────────────────────────────────── */
    function fit() {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv!.width = Math.round(w * dpr);
      cv!.height = Math.round(h * dpr);
      cv!.style.width = w + "px";
      cv!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      reach = clamp(Math.min(w, h) * 0.26, 150, 300);
      dirty = true;
    }

    /* ── the frame ────────────────────────────────────────── */
    function paint() {
      ctx!.clearRect(0, 0, w, h);
      if (gate < 0.01) return;

      const el = document.getElementById("about-slot");
      if (!el) return;
      const box = el.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) return;
      if (box.top > h + 240 || box.top + box.height < -240) return;

      const asp = box.width / Math.max(1, box.height);
      if (!ready || Math.abs(aspect - asp) > 0.02) {
        if (!render(asp)) return;
      }

      const cw = box.width / COLS;
      const chh = box.height / ROWS;
      /* the radius follows the SHORTER side of a cell. A wide slot has
         wide, short cells, and sizing off the width alone made every dot
         overlap its neighbours into a solid cloud. */
      const rMax = Math.min(cw, chh) * 0.62;

      /* 1 · the picture, one path, one fill */
      ctx!.fillStyle = dot;
      ctx!.globalAlpha = gate;
      ctx!.beginPath();
      for (let j = 0; j < ROWS; j++) {
        const y = box.top + (j + 0.5) * chh;
        if (y < -20 || y > h + 20) continue;
        const odd = j % 2 ? 0.5 : 0;
        for (let k = 0; k < COLS; k++) {
          const rr = rad[j * COLS + k];
          if (rr < 0.06) continue;
          const x = box.left + (k + odd + 0.5) * cw;
          if (x < -20 || x > w + 20) continue;
          const r = rMax * rr;
          ctx!.moveTo(x + r, y);
          ctx!.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx!.fill();
      ctx!.globalAlpha = 1;

      /* 2 · the torch — the photograph's real colour, under the cursor.
         Skipped outright unless the pointer is near the picture. */
      const near =
        mouse.on &&
        mouse.x > box.left - reach &&
        mouse.x < box.right + reach &&
        mouse.y > box.top - reach &&
        mouse.y < box.bottom + reach;
      if (!near) return;

      const R2 = reach * reach;
      const inner = 0.55;
      for (let j = 0; j < ROWS; j++) {
        const y = box.top + (j + 0.5) * chh;
        const dy = y - mouse.y;
        if (dy * dy > R2) continue;
        const odd = j % 2 ? 0.5 : 0;
        for (let k = 0; k < COLS; k++) {
          const i = j * COLS + k;
          const rr = rad[i];
          if (rr < 0.06) continue;
          const x = box.left + (k + odd + 0.5) * cw;
          const dx = x - mouse.x;
          const d2 = dx * dx + dy * dy;
          if (d2 > R2) continue;
          const tt = 1 - Math.sqrt(d2) / reach;
          const ff = tt <= 1 - inner ? tt / (1 - inner) : 1;
          /* the torch writes its own alpha rather than going through
             globalAlpha, so the gate has to be folded in here as well —
             miss it and a collapsed slot still shows a full-colour
             thumbnail wherever the cursor is */
          ctx!.fillStyle = `rgba(${col[i * 3]},${col[i * 3 + 1]},${
            col[i * 3 + 2]
          },${(ff * 0.96 * gate).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(x, y, rMax * rr * (1 + ff * 0.22), 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    /* ── wiring ───────────────────────────────────────────── */
    const readColours = () => {
      dot = readVar("dot");
      dirty = true;
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.on = true;
      dirty = true;
    };
    const onLeave = () => {
      mouse.on = false;
      dirty = true;
    };
    const onResize = () => fit();

    const hover = window.matchMedia("(hover: hover)").matches;
    if (hover) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("resize", onResize);

    const mo = new MutationObserver(readColours);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    readColours();
    fit();

    img.decoding = "async";
    img.src = photo;
    const onImg = () => {
      imgReady = true;
      ready = false;
      dirty = true;
    };
    if (img.complete && img.naturalWidth) onImg();
    else img.onload = onImg;

    /* the projector, telling us how much of the picture it is throwing */
    const offReveal = onFieldReveal((v) => {
      const g = v < 0.02 ? 0 : v;
      if (g === gate) return;
      gate = g;
      dirty = true;
    });

    const stop = addJob(() => {
      const key =
        Math.round(window.scrollY) +
        "|" +
        Math.round(mouse.x) +
        "|" +
        Math.round(mouse.y) +
        "|" +
        (mouse.on ? 1 : 0);
      if (!dirty && key === lastKey) return true;
      lastKey = key;
      dirty = false;
      paint();
      return true;
    });

    return () => {
      if (hover) {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
      }
      window.removeEventListener("resize", onResize);
      mo.disconnect();
      offReveal();
      stop();
    };
  }, [photo]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
