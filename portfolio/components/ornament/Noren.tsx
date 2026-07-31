"use client";

/**
 * NOREN — the menu (02 §2.5, roadmap Phase 4).
 *
 * ================================================================
 * WHAT A NOREN IS, AND WHY IT IS THE RIGHT OBJECT
 * ================================================================
 * A noren is the split fabric curtain hung at a threshold. It is a *kekkai* — a
 * boundary marker — and its message is "the space beyond this is different". It
 * carries the shop's mon. That is exactly what a navigation overlay is for: you
 * are about to leave the page you were reading and go somewhere else in the
 * volume. A hamburger drawer says "here is a list of links"; a noren says "you are
 * crossing a threshold", which is the same thing said in this site's language.
 *
 * ================================================================
 * IT ALSO FIXES A REAL BUG
 * ================================================================
 * The top-bar nav is `display: none` below 900px and has been since 2026-07-20 —
 * four items each stacking English over a Telugu gloss measure ~500px of content
 * in a 375px bar. Hiding it kept the locked "Telugu always paired" rule intact,
 * but it was logged as "a stopgap that is only acceptable while the site is one
 * scrolling document", because in a scroll you could still reach everything. In a
 * BOOK you cannot: there is no scrolling past, so on a phone the volume currently
 * has no navigation at all. The noren is the fix that was always planned.
 *
 * ================================================================
 * CLOTH, NOT A PANEL
 * ================================================================
 * §2.5: "two indigo cloth panels… drop in with cloth sway, then part centre-out."
 * Two things make that read as fabric rather than as two divs:
 *
 *   1. The panels hang from a ROD and drop with a slight rotation, so the bottom
 *      edge lags the top. Cloth pivots; a box translates.
 *   2. The bottom hem is a wave, and the wave animates. A straight hem is a
 *      guillotine. This is a `border-radius`-free wave built from an SVG path so
 *      the hem shape is real geometry (see the `hem` function).
 *
 * Indigo (ai-zome) is the traditional noren dye, and it is the one colour outside
 * the locked palette that gets in — as the deepest value of the ground rather than
 * as a blue accent, so the palette lock holds.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import { Hanko } from "@/components/ornament/Motifs";
import { n3 } from "@/lib/n3";
import { DUR, EASE, STAGGER } from "@/components/ink/ease";

/**
 * The hem of a hanging cloth: a shallow sine, deeper at the free (outer) edge
 * where the fabric is unsupported and lighter at the seam.
 */
function hem(w: number, h: number, amp: number, phase: number) {
  const N = 24;
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const x = t * w;
    // Amplitude grows toward the free edge — a cloth hangs straighter where it is
    // pinned and swings where it is not.
    const grow = 0.35 + 0.65 * t;
    const y = h - amp + Math.sin(t * Math.PI * 2 + phase) * amp * grow;
    return `${n3(x)} ${n3(y)}`;
  });
  return `M0 0L${w} 0L${pts.reverse().join("L")}Z`;
}

export interface NorenProps {
  open: boolean;
  onClose: () => void;
  items: { en: string; te: string; href: string; current?: boolean }[];
  onPick: (href: string, e: React.MouseEvent) => void;
}

const PW = 100; // panel viewBox width
const PH = 140;

export default function Noren({ open, onClose, items, onPick }: NorenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Kept mounted-but-hidden between opens so the drop can be animated FROM a known
  // state; unmounting would mean re-measuring the cloth every time.
  const [shown, setShown] = useState(false);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (open) setShown(true);
  }, [open]);

  useEffect(() => {
    if (!shown) return;
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (open) {
        if (reduced) {
          gsap.set(".nr-panel", { yPercent: 0, rotate: 0, xPercent: 0, opacity: 1 });
          gsap.set(".nr-menu", { opacity: 1, y: 0 });
          return;
        }
        // DROP, then PART. Two beats, not one — a curtain that parts as it falls
        // reads as a wipe. The rotation is what makes it cloth: the bottom edge
        // arrives after the top.
        gsap
          .timeline()
          .fromTo(
            ".nr-panel",
            { yPercent: -104, rotate: (i: number) => (i === 0 ? -3.5 : 3.5), xPercent: 0 },
            {
              yPercent: 0,
              rotate: 0,
              duration: DUR.base,
              ease: EASE.soft,
              stagger: STAGGER,
            }
          )
          // Sway: one overshoot after landing, opposite on the two panels, because
          // fabric that stops dead is a board.
          .to(".nr-panel", { rotate: (i: number) => (i === 0 ? 1.1 : -1.1), duration: 0.22, ease: "sine.out" })
          .to(".nr-panel", { rotate: 0, duration: 0.34, ease: "sine.inOut" })
          .fromTo(".nr-menu", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: DUR.short }, "-=0.4")
          // The hem keeps breathing while the menu is open. Very small — this is
          // the difference between hanging cloth and a printed backdrop.
          .to(
            ".nr-hem",
            { attr: { d: (i: number) => hem(PW, PH, 7, i * 1.6 + Math.PI) }, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true },
            0
          );
      } else {
        gsap
          .timeline({ onComplete: () => setShown(false) })
          .to(".nr-menu", { opacity: 0, y: 8, duration: 0.18 })
          .to(".nr-panel", { yPercent: -104, rotate: (i: number) => (i === 0 ? -2.5 : 2.5), duration: DUR.short, ease: "power2.in", stagger: 0.05 }, 0.1);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [open, shown]);

  // Escape closes, and focus goes into the menu on open — it is a dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    window.addEventListener("keydown", onKey, true);
    rootRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, close]);

  if (!shown) return null;

  return (
    <div
      className="noren"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Contents"
      data-open={open ? "1" : undefined}
    >
      <button className="nr-scrim" onClick={close} aria-label="Close contents" />

      {[0, 1].map((side) => (
        <svg
          key={side}
          className="nr-panel"
          data-side={side === 0 ? "l" : "r"}
          viewBox={`0 0 ${PW} ${PH}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* the cloth */}
          <path className="nr-hem" d={hem(PW, PH, 7, side * 1.6)} />
          {/* The rod the cloth hangs from. A noren without a visible rod looks
              like a projected image rather than a hung object. */}
          <rect className="nr-rod" x="0" y="0" width={PW} height="2.4" />
          {/* Vertical seams: a noren is sewn from panels, and the seams are how you
              read its width. Three per half, so six across — a 12-divisor. */}
          {[0.25, 0.5, 0.75].map((t) => (
            <line key={t} className="nr-seam" x1={n3(PW * t)} y1="2.4" x2={n3(PW * t)} y2={PH} />
          ))}
        </svg>
      ))}

      {/* The shop-mon, printed across the parting — on a real noren the mon spans
          the split, so it is cut in half when the curtain opens. */}
      <div className="nr-mon" aria-hidden="true">
        <Hanko size={52} />
      </div>

      <nav className="nr-menu">
        <span className="nr-label">
          విషయసూచిక
          <i>Contents</i>
        </span>
        <ul>
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                aria-current={it.current ? "page" : undefined}
                data-on={it.current ? "1" : undefined}
                onClick={(e) => onPick(it.href, e)}
              >
                <b>{it.en}</b>
                <i>{it.te}</i>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
