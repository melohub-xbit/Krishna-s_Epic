"use client";

/**
 * /ink — the Phase 1 test bench. NOT part of the volume.
 *
 * Roadmap P1's exit test needs somewhere to run the ink language in
 * isolation, away from the chakra canvas and the scroll site, so that when
 * something looks wrong it is obvious which layer is at fault. This route is
 * that bench. It is also where the P1 acceptance criteria (08 §8.8) get
 * checked by eye: brush texture visible, 60fps, one ease registration.
 *
 * Delete or noindex before launch — it is a workshop, not a page.
 */
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Enso from "@/components/ink/Enso";
import VelidandaSeal from "@/components/ink/VelidandaSeal";
import TeluguTitle from "@/components/ink/TeluguTitle";
import { Hanko } from "@/components/ornament/Motifs";
import { inkDraw, type BrushId } from "@/components/ink/inkDraw";
import { DUR } from "@/components/ink/ease";

const BRUSHES: BrushId[] = [1, 2, 3, 4, 5, 6];

function DrawBench({ brush, variant }: { brush: BrushId; variant: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    // gsap.context scopes selectors to this host and reverts everything on
    // unmount. This is the documented fallback for projects without
    // @gsap/react's useGSAP hook; swap to useGSAP when that package lands.
    const ctx = gsap.context(() => {
      const svg = hostRef.current?.querySelector("svg");
      if (!svg) return;
      const tl = inkDraw(svg as SVGElement, { brush, duration: DUR.long });

      // Debug handle. Kept deliberately: a backgrounded tab gets no
      // requestAnimationFrame, so GSAP's ticker never advances and every
      // animation here reads as "frozen at ~2%" when it is in fact perfect.
      // Scrubbing these timelines by hand is the only way to inspect the ink
      // from an automated browser session. Costs nothing in prod — this route
      // does not ship.
      const w = window as unknown as { __inkAll?: gsap.core.Timeline[] };
      (w.__inkAll ??= []).push(tl);
    }, hostRef);
    return () => ctx.revert();
    // `n` is the replay key: bumping it re-runs the draw.
  }, [brush, variant, n]);

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={hostRef} style={{ color: "var(--paper)", lineHeight: 0 }}>
        <Enso variant={variant} size={190} drawable />
      </div>
      <button onClick={() => setN((v) => v + 1)} style={btn}>
        brush {brush} · replay
      </button>
    </div>
  );
}

/**
 * The title on its own, at landing size. Separate from DrawBench because the
 * title needs "data-stroke" order and a much longer stagger — six consecutive
 * strokes of one hand, not siblings appearing together.
 */
function TitleBench() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const svg = hostRef.current?.querySelector("svg");
      if (!svg) return;
      const tl = inkDraw(svg as SVGElement, {
        order: "data-stroke",
        duration: 0.5,
        stagger: 0.22,
        brush: 2,
      });
      const w = window as unknown as { __inkAll?: gsap.core.Timeline[] };
      (w.__inkAll ??= []).push(tl);
    }, hostRef);
    return () => ctx.revert();
  }, [n]);

  return (
    <div style={{ marginTop: 18 }}>
      <div ref={hostRef} style={{ color: "var(--paper)", lineHeight: 0 }}>
        <TeluguTitle height={116} drawable />
      </div>
      <button onClick={() => setN((v) => v + 1)} style={btn}>
        replay
      </button>
    </div>
  );
}

const h2: React.CSSProperties = {
  font: "800 17px 'Shippori Mincho', serif",
  color: "var(--paper)",
  margin: "48px 0 4px",
};

const h2te: React.CSSProperties = {
  display: "block",
  fontSize: 12.5,
  color: "var(--saffron)",
  fontWeight: 600,
};

const btn: React.CSSProperties = {
  marginTop: 10,
  background: "transparent",
  border: "1px solid rgba(224,170,74,.4)",
  color: "var(--gold)",
  font: "500 10.5px Inter, sans-serif",
  letterSpacing: ".14em",
  textTransform: "uppercase",
  padding: "7px 12px",
  cursor: "pointer",
};

export default function InkBench() {
  const [variant, setVariant] = useState(0);

  return (
    <main
      style={{
        minHeight: "100svh",
        background: "var(--ground)",
        padding: "48px clamp(20px, 4vw, 64px)",
      }}
    >
      <h1
        style={{
          font: "800 26px 'Shippori Mincho', serif",
          color: "var(--paper)",
          marginBottom: 6,
        }}
      >
        Ink bench
        <span
          className="te"
          style={{ display: "block", fontSize: 14, color: "var(--saffron)", fontWeight: 600 }}
        >
          సిరా పరీక్ష
        </span>
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 12.5, maxWidth: "62ch", lineHeight: 1.6 }}>
        Phase 1 exit test. Six brushes, four ensō hands. Watch for: visible
        bristle texture in the stroke, ink pooling where each stroke lifts, and
        a draw that hesitates then commits rather than moving at constant
        speed. Every ensō below is generated — no two variants share a radius.
      </p>

      <div style={{ display: "flex", gap: 8, margin: "18px 0 30px" }}>
        {[0, 1, 2, 3].map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            style={{
              ...btn,
              marginTop: 0,
              borderColor: v === variant ? "var(--gold)" : "rgba(224,170,74,.28)",
              color: v === variant ? "var(--gold-pale)" : "var(--muted)",
            }}
          >
            hand {v + 1}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 26,
        }}
      >
        {BRUSHES.map((b) => (
          <DrawBench key={`${b}-${variant}`} brush={b} variant={variant} />
        ))}
      </div>

      {/* The title, drawn. This is the other half of the P1 acceptance
          criterion (08 §8.8) and the one that exercises reveal-mask mode
          across multiple strokes with data-stroke ordering. */}
      <h2 style={h2}>
        Title
        <span className="te" style={h2te}>
          శీర్షిక
        </span>
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 12.5, maxWidth: "62ch", lineHeight: 1.6 }}>
        Watch the ORDER: aksharas left to right, strokes within a letter top to
        bottom. Each akshara is uncovered by its own centreline sweeping under a
        mask — the taper is in the artwork, never in the animated stroke.
      </p>
      <TitleBench />

      {/* The two seals, side by side at the sizes that matter. కృ has to work
          at nav/cursor size; వెలిదండ only has to work held large on the
          landing. Seeing them together is the check that they read as the
          same hand rather than two unrelated marks. */}
      <h2
        style={{
          font: "800 17px 'Shippori Mincho', serif",
          color: "var(--paper)",
          margin: "48px 0 4px",
        }}
      >
        Seals
        <span
          className="te"
          style={{ display: "block", fontSize: 12.5, color: "var(--saffron)", fontWeight: 600 }}
        >
          ముద్రలు
        </span>
      </h2>
      <div style={{ display: "flex", gap: 34, alignItems: "flex-end", flexWrap: "wrap", marginTop: 18 }}>
        {[110, 64, 34].map((h) => (
          <div key={h} style={{ textAlign: "center" }}>
            <VelidandaSeal height={h} />
            <div style={{ ...label }}>వెలిదండ · {h}px tall</div>
          </div>
        ))}
        <div style={{ textAlign: "center", color: "var(--kumkum-lit)" }}>
          <Hanko size={96} />
          <div style={{ ...label }}>కృ · 96px (unchanged)</div>
        </div>
      </div>
    </main>
  );
}

const label: React.CSSProperties = {
  marginTop: 8,
  font: "500 10px Inter, sans-serif",
  letterSpacing: ".1em",
  color: "var(--muted)",
};
