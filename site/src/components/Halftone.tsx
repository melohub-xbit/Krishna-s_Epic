"use client";

import { useEffect, useRef } from "react";
import { addJob } from "@/lib/dots";
import { readVar } from "@/lib/palette";
import {
  onFieldMark,
  onFieldGlyph,
  onFieldReveal,
  onFieldTune,
} from "@/lib/field";
import { MARKS, type MarkId } from "@/data/marks";
import { glyphFor } from "@/data/glyphs";

/**
 * THE FIELD — one fixed canvas for the whole page.
 *
 * Two sets of dots live on it.
 *
 * The **lattice** is computed in screen space and never moves: a faint even
 * screen behind everything, so the torch always has something to light.
 *
 * The **picture** is a halftone screen of a fixed size — COLS × ROWS cells,
 * always the same cells. What changes between sections is only each cell's
 * *radius* and *colour*, which is exactly how a real halftone encodes an
 * image. So one picture does not fade into the next: the dots stay where
 * they are and resize, and the screen redraws itself into the next thing.
 * That is the only transition on this site that could not be done with
 * anything but dots.
 *
 * Each section owns a slot — an empty, unpainted box that says where the
 * picture should sit. The screen is mapped through a rectangle interpolated
 * between the slot you are leaving and the slot you are arriving at, so the
 * picture travels up the page as well as changing. Because the cell pitch
 * is a fraction of that rectangle's width, a picture landing in a small
 * slot gets *finer* — it resolves as it shrinks.
 *
 *   about-slot    the photograph, in the projector's beam
 *   work-slot     the mark of whichever poster is live on the rail
 *   skills-slot   the glyph the matrix is showing
 *   contact-slot  the seal
 *
 * Cost per frame: one interpolation pass and two batched fills — one path,
 * one fill, however many dots — plus the few hundred inside the torch, and
 * only on frames where the scroll or the pointer actually moved.
 */

const COLS = 104;
const ROWS = 138;
const N = COLS * ROWS;

/** stations on the interests band — the dial needle divides by these */
const DIAL_STOPS = 6;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

type Kind = "image" | "mark" | "glyph" | "dial" | "seal";

type Station = {
  slot: string;
  kind: Kind;
  /** src, mark id or string — a change forces a resample */
  key: string;
  /** the colour the torch reveals where the source has no colour of its own */
  tint: [number, number, number] | null;
  /** how loud this picture is allowed to be behind the section's words */
  alpha: number;
  /** 0..1 live multiplier on alpha - the projector uses it to hold the
      About photograph off entirely until it has unfolded out of the lens */
  gate: number;
  aspect: number;
  r: Float32Array;
  c: Uint8ClampedArray;
  ready: boolean;
  /** the previous source, for the cross-fade when `key` changes under us */
  pr: Float32Array;
  mix: number;
  mixFrom: number;
};

function blank(): Station {
  return {
    slot: "",
    kind: "mark",
    key: "",
    tint: null,
    alpha: 1,
    gate: 1,
    aspect: 0,
    r: new Float32Array(N),
    c: new Uint8ClampedArray(N * 3),
    ready: false,
    pr: new Float32Array(N),
    mix: 1,
    mixFrom: 0,
  };
}

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

    /* the lattice, in screen space */
    let lx = new Float32Array(0);
    let ly = new Float32Array(0);
    let ln = 0;
    const lr = 0.95;
    const pitch = 17;

    let dot = "rgba(242,239,234,.85)";
    let accentCss = "#ff2d55";
    let accent: [number, number, number] = [255, 45, 85];
    let fg: [number, number, number] = [242, 239, 234];

    const mouse = { x: -9999, y: -9999, on: false };
    let dirty = true;
    let lastKey = "";

    const img = new Image();
    let imgReady = false;

    const stations: Station[] = [
      /* The photograph belongs to About and nowhere else. Everywhere after
         it the picture sits behind live text and has to give way. */
      { ...blank(), slot: "about-slot", kind: "image", key: photo, tint: null, alpha: 1 },
      { ...blank(), slot: "work-slot", kind: "mark", key: "ring", tint: accent, alpha: 0.3 },
      { ...blank(), slot: "skills-slot", kind: "glyph", key: "Languages", tint: accent, alpha: 0.28 },
      { ...blank(), slot: "band-slot", kind: "dial", key: "0", tint: accent, alpha: 0.3 },
      { ...blank(), slot: "contact-slot", kind: "seal", key: "seal", tint: accent, alpha: 0.34 },
    ];

    /* ── the sources ──────────────────────────────────────── */

    /** draw a source into a COLS×ROWS box, contained at the slot's aspect */
    function render(st: Station, aspect: number) {
      const off = document.createElement("canvas");
      off.width = COLS;
      off.height = ROWS;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.clearRect(0, 0, COLS, ROWS);

      /* The grid is COLS × ROWS cells covering a rect of this aspect, so a
         cell is (W/COLS) wide and (H/ROWS) tall. Contain a source of aspect
         S inside that rect and measure the result in cells:
             wider than the box   → dw = COLS, dh = ROWS · aspect / S
             taller than the box  → dh = ROWS, dw = COLS · S / aspect
         Both branches used to take their base from the *other* axis, which
         scaled everything by ROWS/COLS — 33% here. A picture whose aspect
         already matched its slot came out a third too wide and cropped, and
         the seal came out an ellipse. */
      const fit = (S: number) => {
        let dw: number;
        let dh: number;
        if (S > aspect) {
          dw = COLS;
          dh = (ROWS * aspect) / S;
        } else {
          dh = ROWS;
          dw = (COLS * S) / aspect;
        }
        return { dw, dh, dx: (COLS - dw) / 2, dy: (ROWS - dh) / 2 };
      };

      if (st.kind === "image") {
        if (!imgReady) return false;
        const b = fit(img.naturalWidth / img.naturalHeight);
        /* Step the photograph down by halves rather than dropping 1400px
           straight to a hundred-odd. One big drawImage point-samples and
           the face comes out speckled; halving averages every pixel in. */
        let sw = img.naturalWidth;
        let sh = img.naturalHeight;
        let src: CanvasImageSource = img;
        while (sw > b.dw * 2 && sh > b.dh * 2) {
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
        o.drawImage(src, b.dx, b.dy, b.dw, b.dh);
      } else {
        /* everything else is drawn big and downsampled, so the strokes
           land on the screen as smooth luminance rather than aliasing */
        const S = 1;
        const b = fit(S);
        const big = document.createElement("canvas");
        const BW = 480;
        const BH = Math.round(BW / S);
        big.width = BW;
        big.height = BH;
        const g = big.getContext("2d")!;
        g.fillStyle = "#fff";
        g.strokeStyle = "#fff";

        if (st.kind === "mark") {
          const paint = MARKS[st.key as MarkId] ?? MARKS.ring;
          paint(g, BW, BH);
        } else if (st.kind === "glyph") {
          glyphFor(st.key)(g, BW, BH);
        } else if (st.kind === "dial") {
          drawDial(g, BW, BH, Number(st.key) || 0);
        } else {
          drawSeal(g, BW, BH);
        }
        o.drawImage(big, b.dx, b.dy, b.dw, b.dh);
      }

      const d = o.getImageData(0, 0, COLS, ROWS).data;
      st.pr.set(st.r);
      for (let i = 0; i < N; i++) {
        const a = d[i * 4 + 3] / 255;
        const lum =
          a > 0.02
            ? (0.2126 * d[i * 4] +
                0.7152 * d[i * 4 + 1] +
                0.0722 * d[i * 4 + 2]) /
              255
            : 0;
        st.r[i] = Math.pow(lum * a, 0.8);
        if (st.tint) {
          st.c[i * 3] = st.tint[0];
          st.c[i * 3 + 1] = st.tint[1];
          st.c[i * 3 + 2] = st.tint[2];
        } else {
          st.c[i * 3] = d[i * 4];
          st.c[i * 3 + 1] = d[i * 4 + 1];
          st.c[i * 3 + 2] = d[i * 4 + 2];
        }
      }
      st.aspect = aspect;
      st.ready = true;
      return true;
    }

    /** the tuner, at the station the band is currently on */
    function drawDial(
      g: CanvasRenderingContext2D,
      W: number,
      H: number,
      idx: number
    ) {
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.42;
      const A0 = Math.PI * 0.78;
      const A1 = Math.PI * 2.22;
      g.lineWidth = Math.max(3, W * 0.018);

      /* the scale */
      g.beginPath();
      g.arc(cx, cy, R, A0, A1);
      g.stroke();

      /* one tick per station, the tuned one twice as long */
      const n = DIAL_STOPS;
      for (let i = 0; i < n; i++) {
        const a = A0 + ((A1 - A0) * i) / (n - 1);
        const inner = i === idx ? R * 0.72 : R * 0.86;
        g.beginPath();
        g.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        g.lineTo(cx + Math.cos(a) * R * 0.98, cy + Math.sin(a) * R * 0.98);
        g.stroke();
      }

      /* the needle */
      const a = A0 + ((A1 - A0) * idx) / (n - 1);
      g.lineWidth = Math.max(4, W * 0.026);
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8);
      g.stroke();

      /* the spindle */
      g.beginPath();
      g.arc(cx, cy, R * 0.11, 0, Math.PI * 2);
      g.fill();
    }

    /** the seal the last section is named after */
    function drawSeal(g: CanvasRenderingContext2D, W: number, H: number) {
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.42;
      g.lineWidth = Math.max(3, W * 0.02);
      g.beginPath();
      g.arc(cx, cy, R, 0, Math.PI * 2);
      g.stroke();
      g.setLineDash([W * 0.02, W * 0.022]);
      g.beginPath();
      g.arc(cx, cy, R * 0.78, 0, Math.PI * 2);
      g.stroke();
      g.setLineDash([]);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        g.beginPath();
        g.moveTo(cx + Math.cos(a) * R * 0.5, cy + Math.sin(a) * R * 0.5);
        g.lineTo(cx + Math.cos(a) * R * 0.64, cy + Math.sin(a) * R * 0.64);
        g.stroke();
      }
      g.beginPath();
      g.arc(cx, cy, R * 0.3, 0, Math.PI * 2);
      g.stroke();
    }

    /* ── sizing and the lattice ───────────────────────────── */
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

      const c = Math.ceil(w / pitch) + 2;
      const r = Math.ceil(h / pitch) + 2;
      lx = new Float32Array(c * r);
      ly = new Float32Array(c * r);
      ln = 0;
      for (let gy = 0; gy < r; gy++) {
        for (let gx = 0; gx < c; gx++) {
          lx[ln] = gx * pitch + (gy % 2 ? pitch * 0.5 : 0);
          ly[ln] = gy * pitch;
          ln++;
        }
      }
      for (const st of stations) st.aspect = 0;
      dirty = true;
    }

    /* ── which station, and where ─────────────────────────── */
    type Live = { st: Station; rect: DOMRect } | null;

    function rects(): Live[] {
      return stations.map((st) => {
        const el = document.getElementById(st.slot);
        if (!el) return null;
        return { st, rect: el.getBoundingClientRect() };
      });
    }

    /* ── the frame ────────────────────────────────────────── */
    function paint(now: number) {
      ctx!.clearRect(0, 0, w, h);
      const R2 = reach * reach;
      const inner = 0.55;

      /* 1 · the lattice, one path */
      ctx!.fillStyle = dot;
      ctx!.globalAlpha = 0.22;
      ctx!.beginPath();
      for (let i = 0; i < ln; i++) {
        ctx!.moveTo(lx[i] + lr, ly[i]);
        ctx!.arc(lx[i], ly[i], lr, 0, Math.PI * 2);
      }
      ctx!.fill();
      ctx!.globalAlpha = 1;

      /* 2 · which two stations we are between */
      const live = rects().filter(Boolean) as { st: Station; rect: DOMRect }[];
      if (live.length) {
        /* Walk the stations in document order. Everything whose slot has
           risen past the arrival line is behind us; the first one that has
           not gives the blend.
           
           This used to sum the per-station progress into one float and take
           its floor. That looked equivalent and was not: a slot parked at
           the middle of a pinned section only ever reached ~0.97, so the
           floor stayed one station back and the field spent the whole
           section 97% of the way out of the *previous* slot — which by then
           was far off-screen, dragging the picture up and off centre with
           it. Never let a discrete choice hang off a float that only
           approaches its limit. */
        /* Measured from the slot's TOP, as it originally was. Using the
           middle meant a tall slot started pulling while it was still a
           long way down: at the very top of the page the About slot was
           already a few percent in, which dragged the hero's photograph
           down out of its frame.
           
           START sits just below the fold — far enough that nothing bleeds
           into a section you have not reached, close enough to give the
           crossing a real runway. LINE has to sit below the resting top of
           every pinned slot (the skills matrix rests near 0.26h) or that
           section never saturates and the field parks between stations. */
        const START = h * 1.15;
        const LINE = h * 0.45;
        let i0 = 0;
        let f = 0;
        for (let i = 1; i < live.length; i++) {
          const top = live[i].rect.top;
          const t = smooth(clamp((START - top) / (START - LINE), 0, 1));
          if (t >= 1) {
            i0 = i;
            f = 0;
          } else {
            f = t;
            break;
          }
        }
        const i1 = Math.min(i0 + 1, live.length - 1);

        const a = live[i0];
        const b = live[i1];
        const box = {
          x: lerp(a.rect.left, b.rect.left, f),
          y: lerp(a.rect.top, b.rect.top, f),
          w: lerp(a.rect.width, b.rect.width, f),
          h: lerp(a.rect.height, b.rect.height, f),
        };

        /* make sure both ends are sampled for the aspect they are being
           shown at — this costs a 68×90 read, so it is cheap enough to do
           on demand rather than tracking invalidation by hand */
        for (const s of [a, b]) {
          const asp = s.rect.width / Math.max(1, s.rect.height);
          if (!s.st.ready || Math.abs(s.st.aspect - asp) > 0.02) {
            render(s.st, asp);
          }
        }

        if (
          a.st.ready &&
          b.st.ready &&
          box.y < h + 240 &&
          box.y + box.h > -240
        ) {
          /* the within-station cross-fade, for when the live poster changes */
          const ma =
            a.st.mix >= 1 ? 1 : clamp((now - a.st.mixFrom) / 420, 0, 1);
          const mb =
            b.st.mix >= 1 ? 1 : clamp((now - b.st.mixFrom) / 420, 0, 1);
          if (ma >= 1) a.st.mix = 1;
          if (mb >= 1) b.st.mix = 1;

          /* The radius of one cell, this frame. This used to be baked into
             two whole-grid buffers up front — a hundred thousand writes a
             frame at this resolution, most of them for cells that are dark
             and never drawn, and all of the colour ones for cells outside
             the torch. Computing it where it is needed costs nothing and
             took the per-frame work back under what it was at half the
             resolution. */
          const rad = (i: number) =>
            lerp(
              lerp(a.st.pr[i], a.st.r[i], ma),
              lerp(b.st.pr[i], b.st.r[i], mb),
              f
            );

          const cw = box.w / COLS;
          const chh = box.h / ROWS;
          /* the radius follows the SHORTER side of a cell. A wide slot has
             wide, short cells, and sizing off the width alone made every
             dot overlap its neighbours into a solid white cloud. */
          const rMax = Math.min(cw, chh) * 0.62;

          /* How much of this picture exists at all. The projector drives
             this for About, so the photograph is genuinely absent until
             the beam has unfolded it — the slot is still there, still
             being measured, but nothing is painted into it. */
          const gate = lerp(a.st.gate, b.st.gate, f);

          /* 3 · the picture, one path */
          ctx!.fillStyle = dot;
          ctx!.globalAlpha = lerp(a.st.alpha, b.st.alpha, f) * gate;
          ctx!.beginPath();
          for (let j = 0; j < ROWS; j++) {
            const y = box.y + (j + 0.5) * chh;
            if (y < -20 || y > h + 20) continue;
            const off = j % 2 ? 0.5 : 0;
            for (let k = 0; k < COLS; k++) {
              const i = j * COLS + k;
              const rr = rad(i);
              if (rr < 0.06) continue;
              const x = box.x + (k + off + 0.5) * cw;
              if (x < -20 || x > w + 20) continue;
              const r = rMax * rr;
              ctx!.moveTo(x + r, y);
              ctx!.arc(x, y, r, 0, Math.PI * 2);
            }
          }
          ctx!.fill();
          ctx!.globalAlpha = 1;

          /* 4 · the torch over the picture — its real colour.
             Skipped outright unless the cursor is actually near the box. */
          const near =
            gate > 0.01 &&
            mouse.on &&
            mouse.x > box.x - reach &&
            mouse.x < box.x + box.w + reach &&
            mouse.y > box.y - reach &&
            mouse.y < box.y + box.h + reach;
          if (near) {
            for (let j = 0; j < ROWS; j++) {
              const y = box.y + (j + 0.5) * chh;
              const dy = y - mouse.y;
              if (dy * dy > R2) continue;
              const off = j % 2 ? 0.5 : 0;
              for (let k = 0; k < COLS; k++) {
                const i = j * COLS + k;
                const rr = rad(i);
                if (rr < 0.06) continue;
                const x = box.x + (k + off + 0.5) * cw;
                const dx = x - mouse.x;
                const d2 = dx * dx + dy * dy;
                if (d2 > R2) continue;
                const tt = 1 - Math.sqrt(d2) / reach;
                const ff = tt <= 1 - inner ? tt / (1 - inner) : 1;
                /* colour is only ever needed for the few hundred cells
                   inside the torch, so it is mixed here rather than for
                   the whole grid */
                const cr = lerp(a.st.c[i * 3], b.st.c[i * 3], f) | 0;
                const cg = lerp(a.st.c[i * 3 + 1], b.st.c[i * 3 + 1], f) | 0;
                const cb = lerp(a.st.c[i * 3 + 2], b.st.c[i * 3 + 2], f) | 0;
                /* the torch writes its own alpha rather than going
                   through globalAlpha, so the gate has to be folded in
                   here as well — miss it and a collapsed slot still
                   shows a full-colour thumbnail wherever the cursor is */
                ctx!.fillStyle = `rgba(${cr},${cg},${cb},${(
                  ff *
                  0.96 *
                  gate
                ).toFixed(3)})`;
                ctx!.beginPath();
                ctx!.arc(x, y, rMax * rr * (1 + ff * 0.22), 0, Math.PI * 2);
                ctx!.fill();
              }
            }
          }
        }
      }

      /* 5 · the torch over the bare lattice — accent */
      if (mouse.on) {
        ctx!.fillStyle = accentCss;
        for (let i = 0; i < ln; i++) {
          const dx = lx[i] - mouse.x;
          const dy = ly[i] - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > R2) continue;
          const tt = 1 - Math.sqrt(d2) / reach;
          const ff = tt <= 1 - inner ? tt / (1 - inner) : 1;
          ctx!.globalAlpha = ff * 0.5;
          ctx!.beginPath();
          ctx!.arc(lx[i], ly[i], lr * (1 + ff * 0.7), 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.globalAlpha = 1;
      }
    }

    /* ── wiring ───────────────────────────────────────────── */
    function readColours() {
      dot = readVar("dot");
      accentCss = readVar("accent");
      const m = accentCss.match(/\d+/g);
      if (m && m.length >= 3) accent = [+m[0], +m[1], +m[2]];
      else if (/^#/.test(accentCss)) {
        const v = accentCss.replace("#", "");
        accent = [
          parseInt(v.slice(0, 2), 16),
          parseInt(v.slice(2, 4), 16),
          parseInt(v.slice(4, 6), 16),
        ];
      }
      const f = readVar("fg").match(/\d+/g);
      if (f && f.length >= 3) fg = [+f[0], +f[1], +f[2]];
      for (const st of stations) {
        if (st.tint) st.tint = accent;
        st.aspect = 0;
      }
      void fg;
      dirty = true;
    }

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

    /* the photograph */
    img.decoding = "async";
    img.src = photo;
    const onImg = () => {
      imgReady = true;
      stations[0].aspect = 0;
      stations[1].aspect = 0;
      dirty = true;
    };
    if (img.complete && img.naturalWidth) onImg();
    else img.onload = onImg;

    /* the two sections that change their own background as you scroll
       through them: the rail's live poster, and the matrix's live group */
    const swap = (i: number) => (next: string) => {
      const st = stations[i];
      if (st.key === next) return;
      st.key = next;
      st.aspect = 0;
      st.mix = 0;
      st.mixFrom = performance.now();
      dirty = true;
    };
    const offMark = onFieldMark(swap(1));
    const offGlyph = onFieldGlyph(swap(2));

    /* the projector, telling us how much of the photograph it is throwing */
    const offTune = onFieldTune((v) => swap(3)(String(v)));

    const offReveal = onFieldReveal((v) => {
      const g = v < 0.02 ? 0 : v;
      if (stations[0].gate === g) return;
      stations[0].gate = g;
      dirty = true;
    });

    const stop = addJob((now) => {
      const key =
        Math.round(window.scrollY) +
        "|" +
        Math.round(mouse.x) +
        "|" +
        Math.round(mouse.y) +
        "|" +
        (mouse.on ? 1 : 0) +
        "|" +
        stations.map((s) => (s.mix < 1 ? 1 : 0)).join("");
      if (!dirty && key === lastKey && stations.every((s) => s.mix >= 1))
        return true;
      lastKey = key;
      dirty = false;
      paint(now);
      return true;
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      mo.disconnect();
      offMark();
      offGlyph();
      offTune();
      offReveal();
      stop();
    };
  }, [photo]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
