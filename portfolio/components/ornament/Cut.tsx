"use client";

/**
 * THE IAIJUTSU CUT — the chapter-jump transition (02 §2.7, 08 §8.4, Phase 4).
 *
 * ================================================================
 * WHY A JUMP CANNOT BE A PAGE TURN
 * ================================================================
 * Turning a page is adjacent motion: one leaf, one curl. Jumping from the cover to
 * the colophon is not — there is no single leaf to curl, and riffling six pages
 * takes six times as long as the reader's patience. Until now a nav click just
 * SWAPPED the page with nothing at all, which read as a bug. This is the intended
 * treatment.
 *
 * ================================================================
 * THE ONE PLACE A KATANA APPEARS
 * ================================================================
 * §2.7 is strict about this, and the strictness is the point: "Katana appears
 * exactly once: the section divider stroke… a single horizontal sword-draw flash
 * (iaijutsu: draw–cut–resheath in one motion) renders as the ink rule that slices
 * the old page away. NEVER a decorative sword graphic at rest." So there is no
 * sword drawn here — there is a CUT. Iaijutsu is the art of drawing, cutting and
 * resheathing in one continuous motion, which is why the slash is drawn in one
 * direction and never retracted: the blade does not come back.
 *
 * ================================================================
 * A THREE-FRAME MANGA CUT
 * ================================================================
 * 08 §8.4's budget, and it is deliberately under half a second — a transition you
 * notice twice is too long:
 *
 *   0.00  white flash, one frame's worth
 *   0.02  the slash DRAWS across the page, 120ms, diagonal
 *   0.16  the page swaps BEHIND the slash, hidden by it
 *   0.20  slash and flash fade out, 240ms
 *
 * The swap happens while the slash covers it. That is the whole trick, and it is
 * the same trick as the page curl: the change of state is never the thing you are
 * looking at.
 */
import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";

import { EASE } from "@/components/ink/ease";

export interface CutHandle {
  /**
   * Run the cut. `swap` is called at the covered midpoint — that is where the
   * caller changes the page. Resolves when the cut has fully cleared.
   */
  run: (swap: () => void) => void;
}

export default function Cut({ ref }: { ref?: React.Ref<CutHandle> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<SVGPathElement>(null);
  const busy = useRef(false);

  const run = useCallback((swap: () => void) => {
    const root = rootRef.current;
    const slash = slashRef.current;

    // Reduced motion, or no DOM yet: swap and be done. §8.7 — "content identical".
    if (
      !root ||
      !slash ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      swap();
      return;
    }
    if (busy.current) return;
    busy.current = true;

    const len = slash.getTotalLength();
    gsap.set(root, { autoAlpha: 1 });
    gsap.set(slash, { strokeDasharray: len, strokeDashoffset: len });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { autoAlpha: 0 });
        busy.current = false;
      },
    });

    tl
      // One frame of white. 60ms rather than a true single frame: at 120Hz a
      // one-frame flash is invisible, and at 60Hz it reads as a dropped frame.
      .fromTo(".cut-flash", { opacity: 0.7 }, { opacity: 0, duration: 0.06, ease: "none" }, 0)
      // Draw–cut: one direction, one motion, no retract.
      .to(slash, { strokeDashoffset: 0, duration: 0.12, ease: EASE.ink }, 0.02)
      // The swap, hidden under the blade.
      .call(swap, undefined, 0.16)
      // Resheath: the slash leaves along its own direction rather than fading in
      // place, which is what makes it a cut and not a wipe.
      .to(slash, { opacity: 0, x: 40, duration: 0.24, ease: "power2.in" }, 0.2)
      .set(slash, { opacity: 1, x: 0 });
  }, []);

  useImperativeHandle(ref, () => ({ run }), [run]);

  useEffect(
    () => () => {
      gsap.killTweensOf([rootRef.current, slashRef.current, ".cut-flash"]);
    },
    []
  );

  return (
    <div className="cut" ref={rootRef} aria-hidden="true" style={{ opacity: 0, visibility: "hidden" }}>
      <div className="cut-flash" />
      <svg className="cut-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* A single diagonal, drawn shoulder to hip — the kesagiri, the downward
            diagonal cut. Not horizontal: a horizontal line reads as a divider rule,
            and this has to read as a stroke that went through something. */}
        <path
          ref={slashRef}
          d="M-4 -4 L104 104"
          stroke="currentColor"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
      </svg>
    </div>
  );
}
