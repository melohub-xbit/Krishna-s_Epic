"use client";

/**
 * /landing — the Phase 1 exit test: beats 0.4–3.0 of §03.1 in isolation.
 *
 * Isolated on purpose. The landing eventually lives inside the volume shell
 * with the chakra canvas behind it (Phase 3, beat 3.4), and if the first time
 * it runs is in that context, every timing problem is indistinguishable from a
 * canvas or layout problem. Here there is nothing else on the page.
 *
 * Workshop route — noindex or delete before launch, same as /ink.
 *
 * Scrubbing from an automated browser: a backgrounded tab gets no
 * requestAnimationFrame, so the timeline reads as frozen a few percent in and
 * survives reloads, which makes it very convincing. Check
 * document.visibilityState BEFORE debugging, then use the slider here or
 * window.__landingTl.progress(x). PROJECT-STATUS §4 item 12.
 */
import { useState } from "react";
import { gsap } from "gsap";

import LandingSequence from "@/components/ink/LandingSequence";

export default function LandingBench() {
  const [run, setRun] = useState(0);
  const [scrub, setScrub] = useState<number | null>(null);

  const tl = () =>
    (window as unknown as { __landingTl?: gsap.core.Timeline }).__landingTl;

  return (
    <>
      <LandingSequence key={run} />

      <div style={panel}>
        <button style={btn} onClick={() => { setScrub(null); setRun((n) => n + 1); }}>
          replay
        </button>
        <label style={{ ...label, display: "flex", alignItems: "center", gap: 8 }}>
          scrub
          <input
            type="range"
            min={0}
            max={1000}
            value={(scrub ?? 0) * 1000}
            onChange={(e) => {
              const p = Number(e.target.value) / 1000;
              setScrub(p);
              const t = tl();
              if (t) {
                t.pause();
                t.progress(p);
              }
            }}
            style={{ width: 190 }}
          />
          <span style={{ width: 34, textAlign: "right" }}>
            {scrub == null ? "—" : scrub.toFixed(2)}
          </span>
        </label>
        <span style={label}>
          beats · 0.4 write · 2.2 ma · 2.5 stamp · 3.0 caption
        </span>
      </div>
    </>
  );
}

const panel: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  gap: 18,
  alignItems: "center",
  flexWrap: "wrap",
  padding: "10px 16px",
  background: "rgba(24,10,12,.86)",
  borderTop: "1px solid rgba(224,170,74,.22)",
  zIndex: 50,
};

const btn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(224,170,74,.4)",
  color: "var(--gold)",
  font: "500 10.5px Inter, sans-serif",
  letterSpacing: ".14em",
  textTransform: "uppercase",
  padding: "7px 12px",
  cursor: "pointer",
};

const label: React.CSSProperties = {
  font: "500 10px Inter, sans-serif",
  letterSpacing: ".1em",
  color: "var(--muted)",
};
