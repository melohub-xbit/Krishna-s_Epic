"use client";

/**
 * SAKURA — the transition particle (02 §2.2, roadmap Phase 4).
 *
 * ================================================================
 * SCARCITY IS THE POINT
 * ================================================================
 * §2.2: petals appear "ONLY at moments of passage… NOT an ambient screensaver
 * rain; scarcity keeps the meaning." Falling petals are mono no aware — the brief
 * life — and a thing that is always happening cannot mean "this moment passed".
 * So this fires once per page turn, at the APEX of the curl, and then it is gone.
 * If you ever find yourself adding an idle drift, you have deleted the meaning.
 *
 * ================================================================
 * AUTHENTIC FORM
 * ================================================================
 * Five petals, each with a NOTCHED (cleft) tip. The notch is the whole
 * identification: it is what distinguishes sakura from plum (ume), which has
 * rounded petals, in mon design. So the notch is built as real geometry, not
 * suggested — a single petal is drawn here with the cleft cut into its outer edge
 * and a midrib line, then instanced.
 *
 * ================================================================
 * PALETTE-LOCKED — printed petals, not pink photo petals
 * ================================================================
 * The one palette is locked, and cherry-pink was explicitly REJECTED (02
 * "Rejected / guarded"). So a petal is aged-paper white, ink-outlined, with a
 * kumkum blush at the notch. It reads as a printed petal on a printed page, which
 * is what the rest of the volume is.
 *
 * ================================================================
 * MOTION — rocking, not tumbling
 * ================================================================
 * §2.2: "a falling-leaf flutter (rocking around the petal's long axis, not
 * tumbling — real petals oscillate)." A real petal is a wing: it stalls, slips
 * sideways, and rocks. Tumbling end over end is what a coin does. So each petal
 * gets a `rotateY` oscillation around its own long axis plus a slow drift and a
 * gentle `rotate`, and NEVER a spin about its centre.
 *
 * 12 petals — the 12/24/48 angular rule holds for counted ornament too.
 */
import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";

import { n3 } from "@/lib/n3";

const COUNT = 12;

/**
 * ONE petal, in its own 0..20 x 0..26 box, hanging tip-down.
 *
 * The cleft is the two inner curves meeting at (10, 3.4) — a notch cut INTO the
 * tip rather than a dip in a silhouette. Widest at about 60% of its length, which
 * is where a real sakura petal carries its shoulder.
 */
const PETAL_D =
  "M10 26" +
  "C4.2 22.4 0.6 16.2 1.2 10.4" +
  "C1.7 5.6 5 1.6 8.2 0.6" +           // left shoulder rising to the tip
  "L10 3.4" +                            // the cleft — into the tip, not around it
  "L11.8 0.6" +
  "C15 1.6 18.3 5.6 18.8 10.4" +
  "C19.4 16.2 15.8 22.4 10 26Z";

export interface SakuraHandle {
  /** Fire one burst from the spine. Called at a turn's apex. */
  burst: (dir: 1 | -1) => void;
}

export default function Sakura({
  ref,
  className,
}: {
  ref?: React.Ref<SakuraHandle>;
  className?: string;
}) {
  const rootRef = useRef<SVGSVGElement>(null);
  const busy = useRef(false);

  const burst = useCallback((dir: 1 | -1) => {
    const root = rootRef.current;
    if (!root) return;
    // One burst per gesture. §2.2's "momentum flicks suppress the burst" rule in
    // reverse: a second burst layered on the first reads as weather.
    if (busy.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    busy.current = true;

    const petals = Array.from(root.querySelectorAll<SVGGElement>(".sk-petal"));
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false;
      },
    });

    petals.forEach((p, i) => {
      // They leave the GUTTER — the spine is where the leaf lifts, so that is
      // where a petal would be dislodged from.
      const spread = (i / (COUNT - 1) - 0.5) * 2; // -1 … 1
      const x = dir * (18 + Math.abs(spread) * 46) + spread * 10;
      const y = -30 + spread * 26;
      const driftX = dir * (60 + Math.random() * 90);
      const driftY = 120 + Math.random() * 130;
      const dur = 1.5 + Math.random() * 0.9;

      tl.fromTo(
        p,
        { x, y, opacity: 0, scale: 0.5 + Math.random() * 0.35, rotate: spread * 40 },
        {
          x: x + driftX,
          y: y + driftY,
          opacity: 1,
          rotate: spread * 40 + dir * (40 + Math.random() * 70),
          duration: dur,
          ease: "none",
          // A petal does not fade in and out symmetrically; it appears at the edge
          // and dies out as it settles.
          onStart: () => gsap.to(p, { opacity: 1, duration: 0.18 }),
        },
        i * 0.035
      )
        // The rock: around the petal's own long axis. `rotationY` on a flat SVG
        // group needs a perspective ancestor, which `.sakura` provides in CSS.
        .to(
          p,
          {
            rotationY: 180 + Math.random() * 180,
            duration: dur,
            ease: "sine.inOut",
            repeat: 1,
            yoyo: true,
          },
          i * 0.035
        )
        .to(p, { opacity: 0, duration: 0.5, ease: "power1.in" }, i * 0.035 + dur * 0.62);
    });
  }, []);

  useImperativeHandle(ref, () => ({ burst }), [burst]);

  // Kill any in-flight tween on unmount, or GSAP keeps ticking a detached node.
  useEffect(
    () => () => {
      const root = rootRef.current;
      if (root) gsap.killTweensOf(root.querySelectorAll(".sk-petal"));
    },
    []
  );

  return (
    <svg
      ref={rootRef}
      className={`sakura ${className ?? ""}`}
      viewBox="-160 -160 320 320"
      aria-hidden="true"
    >
      {Array.from({ length: COUNT }, (_, i) => (
        <g className="sk-petal" key={i} style={{ opacity: 0 }}>
          {/* Scaled so a petal is ~11 units across in the burst's coordinate
              space, and centred on its own long axis so the rock reads. */}
          <g transform={`translate(-10 -13) scale(${n3(0.55 + (i % 3) * 0.08)})`}>
            <path className="sk-body" d={PETAL_D} />
            <path className="sk-blush" d={PETAL_D} />
            {/* midrib — a petal has one, and at this size it is what stops the
                shape reading as a generic blob */}
            <path className="sk-rib" d="M10 24.4V6.2" />
          </g>
        </g>
      ))}
    </svg>
  );
}
