"use client";

/**
 * THE LANDING — beats 0.0 → 3.4 of 03-manga-navigation.md §3.1.
 *
 * "The landing was never a separate screen — it was the first page being
 * drawn." Beats 0.4 (the name writes) through 3.0 (the Latin caption) are the
 * Phase 1 exit test and are complete here. Beat 3.4 — the composition becoming
 * page one, chakra rising behind the paper — needs the volume shell and lands
 * in Phase 3; the `onDone` callback is where it hooks in.
 *
 * | t   | beat                                                        |
 * |-----|-------------------------------------------------------------|
 * | 0.0 | aged-paper field, silence                                    |
 * | 0.4 | brush writes కృష్ణ సాయి, ~1.6s, hesitate-then-commit          |
 * | 2.2 | ma — 0.3s of nothing. DO NOT TRIM IT.                        |
 * | 2.5 | వెలిదండ seal stamps: 1.15→1, 4°→2°, flash, 2px shake         |
 * | 3.0 | Latin caption fades in under                                  |
 *
 * The 0.3s hold at 2.2 is load-bearing. It is the pause before the seal, and
 * without it the stamp reads as part of the writing instead of as a separate,
 * deliberate act. It will look like dead time in a timeline scrub and it is
 * not.
 *
 * SKIPPABLE ON ANY INPUT (§3.1). Any key, pointer or wheel jumps to the end
 * state — not a fast-forward. Someone skipping wants the page, not the same
 * animation at 4×.
 *
 * REDUCED MOTION renders the final state directly and never builds a timeline.
 * Identical content, no draw. inkDraw makes the same call internally; this
 * check exists because the stamp and caption are choreographed here, not there.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import TeluguTitle from "@/components/ink/TeluguTitle";
import VelidandaSeal from "@/components/ink/VelidandaSeal";
import { inkDraw } from "@/components/ink/inkDraw";
import { DUR, EASE } from "@/components/ink/ease";

/** Beat times, seconds. Straight from §3.1 — change the spec first. */
const BEAT = {
  write: 0.4,
  ma: 2.2,
  stamp: 2.5,
  caption: 3.0,
} as const;

/**
 * The write occupies 2.2 − 0.4 = 1.8s of wall time, and §3.1 budgets ~1.6s of
 * actual drawing inside it. Six strokes: 5 × 0.22 stagger + 0.50 each = 1.6.
 * Stagger is deliberately far above the house STAGGER (0.07) — that token is
 * for sibling elements appearing together, whereas these are consecutive
 * strokes of one hand and must not overlap into a scribble.
 */
const WRITE_DURATION = 0.5;
const WRITE_STAGGER = 0.22;

export interface LandingSequenceProps {
  /** Fires after beat 3.0 — Phase 3 hands off to the volume here. */
  onDone?: () => void;
  /** Skip straight to the end state (deep links, returning visitors). */
  immediate?: boolean;
  className?: string;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function LandingSequence({
  onDone,
  immediate = false,
  className,
}: LandingSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  /**
   * THREE states, not two — and that is the whole fix for the flash.
   *
   * `null` = "we have not decided yet", and it is the state of the FIRST PAINT.
   * Whether this plays or cuts to the end depends on `prefers-reduced-motion` and
   * on props, and neither can be read during render without risking a hydration
   * mismatch — so the decision happens in an effect, one paint later. Previously
   * the initial value was `false`, i.e. "static", which renders the FINISHED
   * composition: name filled in, seal and caption at full opacity. So every
   * visitor saw the completed lockup for a frame, then it vanished, then it was
   * drawn. Krishna, 2026-07-30: "the whole name written — the red page shows up,
   * then the animation starts, then the red page with the name shows up".
   *
   * `null` renders the lockup present but invisible, which is not a compromise —
   * it is beat 0.0 as specified: "aged-paper field, faint washi grain. Silence."
   * The correct first frame of this sequence has nothing on it. Present rather
   * than unmounted so the SVG is laid out and measured before the timeline
   * touches it (inkDraw needs real path lengths).
   */
  const [animated, setAnimated] = useState<boolean | null>(null);
  // Show the static end state only once we know we are NOT animating.
  const still = animated === false;

  useEffect(() => {
    if (immediate || prefersReducedMotion()) {
      setAnimated(false);
      onDone?.();
      return;
    }
    setAnimated(true);
  }, [immediate, onDone]);

  /**
   * useLayoutEffect, NOT useEffect — this is the second half of the flash fix.
   *
   * When the title is `drawable` it renders inside a reveal mask, and that mask
   * starts FULLY OPEN: the stroke that uncovers the letterforms has no dash offset
   * until inkDraw gives it one. So the frame between "we decided to animate" and
   * "the timeline exists" shows the finished name. `useEffect` runs after paint, so
   * that frame was guaranteed. A layout effect runs before it, so the mask is
   * closed by the time anything is drawn.
   *
   * Paired with the opacity gate on `.landing-title` below, which covers the OTHER
   * frame — the very first paint, before we know whether we are animating at all.
   */
  useLayoutEffect(() => {
    if (animated !== true) return;

    const ctx = gsap.context(() => {
      const svg = titleRef.current?.querySelector("svg") as SVGElement | null;

      const tl = gsap.timeline({ onComplete: () => onDone?.() });
      tlRef.current = tl;

      // Beat 0.4 — the name writes itself. data-stroke order: the aksharas run
      // left to right and each letter's strokes top to bottom. Drawing a
      // letterform out of order is immediately wrong to anyone who reads it.
      tl.add(
        inkDraw(svg, {
          order: "data-stroke",
          duration: WRITE_DURATION,
          stagger: WRITE_STAGGER,
          brush: 2,
        }),
        BEAT.write
      );

      // Beat 2.2 — ma. Nothing is scheduled between 2.2 and 2.5 on purpose.

      // Beat 2.5 — the stamp. A hanko is pressed, not faded: it arrives
      // slightly large and rotated and settles, which is what a hand pushing a
      // seal onto paper actually does.
      // Rotation settles to 0.8°, not 2°: the seal is now as wide as the name,
      // and at that width 2° throws the ends several pixels off the baseline
      // and reads as misaligned rather than hand-pressed.
      tl.fromTo(
        ".landing-seal",
        { autoAlpha: 0, scale: 1.1, rotate: 2.6 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0.8,
          duration: DUR.short,
          ease: EASE.ink,
        },
        BEAT.stamp
      )
        // One frame of white — the manga SFX flash. 60ms is about two frames;
        // a single frame is unreliable across refresh rates and reads as a
        // dropped frame rather than an effect.
        .fromTo(
          ".landing-flash",
          { opacity: 0.62 },
          { opacity: 0, duration: 0.06, ease: "none" },
          BEAT.stamp + 0.04
        )
        // Micro screen-shake, 2px / 90ms (§3.1). Transform only — shaking
        // anything that triggers layout drops frames on exactly the beat that
        // must not drop frames.
        .fromTo(
          ".landing-stage",
          { x: -2 },
          {
            x: 0,
            duration: 0.09,
            ease: "rough({ strength: 1.4, points: 8, template: none.out })",
          },
          BEAT.stamp + 0.04
        );

      // Beat 3.0 — the Latin caption. Telugu is never left standing alone
      // (locked decision); this is the pairing, not decoration.
      tl.fromTo(
        ".landing-caption",
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: DUR.base, ease: EASE.soft },
        BEAT.caption
      );

      // Debug handle — a backgrounded tab gets no requestAnimationFrame, so
      // this timeline reads as frozen a few percent in from any automated
      // browser. Scrub with __landingTl.progress(x). PROJECT-STATUS §4 item 12.
      (window as unknown as { __landingTl?: gsap.core.Timeline }).__landingTl = tl;

      const skip = () => {
        if (tl.progress() < 1) tl.progress(1);
      };
      const opts = { passive: true } as AddEventListenerOptions;
      window.addEventListener("keydown", skip, opts);
      window.addEventListener("pointerdown", skip, opts);
      window.addEventListener("wheel", skip, opts);
      return () => {
        window.removeEventListener("keydown", skip);
        window.removeEventListener("pointerdown", skip);
        window.removeEventListener("wheel", skip);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [animated, onDone]);

  return (
    <div ref={rootRef} className={`landing ${className ?? ""}`}>
      <div className="landing-stage">
        {/* [REVISED 2026-07-21 — Krishna] The seal is a BANNER above the name,
            matched to its width, not a small stamp on the top-right corner.
            Width is matched in CSS (`.landing-seal svg { width: 100% }`) rather
            than by picking a height here: the seal and the title have different
            intrinsic ratios, so any hard-coded height stops matching the moment
            either changes. Order in the DOM is seal-then-title so the column
            stacks correctly without absolute positioning. */}
        {/* `still` and not `!animated`: these must be visible ONLY in the decided
            static state. While the decision is pending (animated === null, the
            first paint) everything stays at opacity 0 — beat 0.0 is an empty paper
            field, and painting the finished lockup there is what caused the flash. */}
        <div className="landing-lockup">
          <div
            className="landing-seal"
            style={{ opacity: still ? 1 : 0, transform: "rotate(0.8deg)" }}
          >
            <VelidandaSeal height={40} />
          </div>
          <div
            ref={titleRef}
            className="landing-title"
            // Hidden until the decision is made. `animated === null` is the first
            // paint, where a drawable title would show through its wide-open mask.
            style={{ opacity: animated === null ? 0 : 1 }}
          >
            {/* Drawable while animating AND while undecided: a drawable title is
                rendered with its strokes hidden, ready for inkDraw. Handing it
                `false` for one paint would fill it in — the flash again. */}
            <TeluguTitle height={132} drawable={animated !== false} />
          </div>
        </div>
        <p className="landing-caption" style={{ opacity: still ? 1 : 0 }}>
          Velidanda Krishna Sai
        </p>
      </div>
      <div className="landing-flash" aria-hidden="true" style={{ opacity: 0 }} />
    </div>
  );
}
