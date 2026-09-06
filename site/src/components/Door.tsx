"use client";

import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/dots";

/**
 * THE DOOR — the site is a printed sheet, and a sheet has a back.
 *
 * One 180° turn about the vertical centre, 900ms. /interests is the
 * reverse of the same piece of paper.
 *
 * WHAT MAKES IT PAPER RATHER THAN A DISAPPEARING TRICK.
 *
 * A sheet at angle θ is only cos θ wide on screen, and cos falls off a
 * cliff after 60°. So most of a turn's *visible* change is crammed into
 * its last third, and if the angle itself also accelerates through the
 * middle — which the site's own --ease does, it is slow-fast-slow — the
 * page spends almost no time in the 20–70° range where you can actually
 * read it as a rotating object. It reaches 45°, then it is gone. That is
 * the vanish.
 *
 * So the angle runs nearly linearly here, on its own gentle curve rather
 * than --ease: constant angular velocity, the way a turning object
 * actually behaves, which holds the readable range four times longer.
 *
 * Depth does the rest. The sheet is pushed away on the Z axis as it turns
 * — real recession under a 900px perspective, near edge closer than far
 * edge — instead of being scaled, which is only a squash by another name.
 * And a fixed specular band rakes across it: the light does not move, the
 * paper turns under it, so the highlight sweeps and then dies as the sheet
 * goes edge-on.
 *
 * The turn has to survive a navigation, which is the whole problem. It is
 * run as ONE animation on one clock: `deg = 180 · ease(x)` for x from 0
 * to 1. The route swaps at the instant the sheet is edge-on — not at the
 * halfway point in time, because `cubic-bezier(.7,0,.2,1)` does not reach
 * 0.5 at the halfway point. So x₉₀ is solved for once, the outgoing half
 * runs 0 → x₉₀ and the incoming half runs x₉₀ → 1, and the angular
 * velocity carries straight through the seam.
 *
 * The far side subtracts 180° from the same expression rather than
 * finishing at 180°, so it lands flat instead of mirrored. Identical
 * motion, readable text.
 *
 * TWO THINGS MAKE IT A TURN RATHER THAN A VANISH.
 *
 * The perspective has to sit on the flipping panel's PARENT. It was on
 * <html>, which is body's parent, not the panel's — so the panel got no
 * perspective at all and `rotateY` degenerated into a horizontal squash.
 * A squash reads as the page evaporating, never as paper.
 *
 * And the hinge has to be the middle of the VIEWPORT, not the middle of
 * the panel. The panel is the whole document — five or six screens tall —
 * so `transform-origin: 50% 50%` puts the hinge thousands of pixels off
 * screen and everything you can actually see swings past on the end of a
 * very long arm. Both origins are therefore set in pixels, to
 * `scrollY + innerHeight / 2`, and the page is pinned for the length of
 * the turn so that number stays true.
 *
 * The ground does not turn. Ambient lives outside the flipping panel in
 * layout.tsx: the paper turns, the light does not.
 *
 * The transform is added for the length of the turn and removed after,
 * because a transformed ancestor makes every `position: fixed`
 * descendant position against IT instead of the viewport — leave it on
 * and the canvas, the bar and every sticky scene stop pinning.
 *
 * Coming back lands you where you left: DoorLink records the scroll
 * position on the way out, DoorReturn restores it before first paint on
 * the way in. Otherwise "back" means the top of a five-screen page you
 * had already scrolled through once.
 */

const CLS = "door-flip";
const YKEY = "door-y";
const DUR = 900;

/* ── the turn's easing curve, sampled ─────────────────────── */
/* cubic-bezier(.45, .05, .55, .95) — deliberately NOT the site's --ease.
   --ease is slow-fast-slow, and its fast part lands exactly where the
   sheet is edge-on, whipping through the only angles worth looking at.
   This is near-linear with soft ends: it starts and stops like something
   with mass, and turns at a steady rate in between. */
const X1 = 0.45;
const Y1 = 0.05;
const X2 = 0.55;
const Y2 = 0.95;

const bx = (u: number) =>
  3 * (1 - u) * (1 - u) * u * X1 + 3 * (1 - u) * u * u * X2 + u * u * u;
const by = (u: number) =>
  3 * (1 - u) * (1 - u) * u * Y1 + 3 * (1 - u) * u * u * Y2 + u * u * u;

/** y for a given x on the curve — bisection, because it is called ~60×/s */
function ease(x: number) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (bx(mid) < x) lo = mid;
    else hi = mid;
  }
  return by((lo + hi) / 2);
}

/** where on the curve the sheet is exactly edge-on — solved once */
const X90 = (() => {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (ease(mid) < 0.5) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
})();

/* ── driving the panel ────────────────────────────────────── */

/** hinge the sheet on the middle of what is on screen, not of the document */
function origin() {
  document.documentElement.style.setProperty(
    "--flip-oy",
    `${Math.round(scrollY + innerHeight / 2)}px`
  );
}

/**
 * Move the page without animating it.
 *
 * The site sets `html { scroll-behavior: smooth }`, which every ordinary
 * link on it wants — but it also captures `window.scrollTo`, so restoring
 * a position on the way back was being played as a scroll from the top of
 * the portfolio down to the shelf. Overriding it inline for the one call
 * beats the stylesheet and needs no cooperation from the class.
 */
function jump(y: number) {
  const r = document.documentElement;
  const had = r.style.scrollBehavior;
  r.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  r.style.scrollBehavior = had;
}

/** the hinge is a fixed pixel offset, so the page must not move under it */
const block = (e: Event) => e.preventDefault();
function lock() {
  addEventListener("wheel", block, { passive: false });
  addEventListener("touchmove", block, { passive: false });
}
function unlock() {
  removeEventListener("wheel", block);
  removeEventListener("touchmove", block);
}

/**
 * @param deg  where the sheet is pointing
 * @param prog how far through the whole turn, 0..1 — the highlight tracks
 *             this rather than the angle, because the angle is ambiguous
 *             (90° and −90° are the same picture) and the light is not
 */
function set(deg: number, prog: number) {
  const r = document.documentElement;
  /* edge-on is where the sheet is furthest from you, whichever way it
     turned — sin is 1 at 90° and at 270°, and 0 flat at either end */
  const e = Math.abs(Math.sin((deg * Math.PI) / 180));
  r.style.setProperty("--flip", `${deg.toFixed(2)}deg`);
  /* recede, do not shrink: with perspective this is a real move away from
     the reader, so the near edge stays large while the far edge foreshortens */
  r.style.setProperty("--flip-z", `${(-210 * e).toFixed(1)}px`);
  r.style.setProperty("--flip-b", (1 - 0.52 * e).toFixed(3));
  /* the specular band: brightest as the sheet turns into the light,
     gone by the time it is edge-on and has no face to catch it */
  r.style.setProperty("--flip-gl", (0.62 * e * (1 - e * 0.55)).toFixed(3));
  r.style.setProperty("--flip-gx", `${(8 + 84 * prog).toFixed(1)}%`);
}

function clear() {
  unlock();
  const r = document.documentElement;
  r.classList.remove(CLS);
  r.style.removeProperty("--flip");
  r.style.removeProperty("--flip-z");
  r.style.removeProperty("--flip-b");
  r.style.removeProperty("--flip-gl");
  r.style.removeProperty("--flip-gx");
  r.style.removeProperty("--flip-oy");
}

/**
 * Run the turn over a stretch of the curve.
 * `offset` is subtracted from the angle so the incoming half lands flat.
 */
function turn(
  x0: number,
  x1: number,
  sign: number,
  offset: number,
  done?: () => void
) {
  const t0 = performance.now();
  const ms = Math.max(1, DUR * (x1 - x0));
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / ms);
    const x = x0 + (x1 - x0) * t;
    const prog = ease(x);
    set(sign * (180 * prog - offset), prog);
    if (t < 1) requestAnimationFrame(step);
    else done?.();
  };
  requestAnimationFrame(step);
}

export default function DoorLink({
  href,
  className,
  back,
  children,
}: {
  href: string;
  className?: string;
  /** turning the sheet back over rather than forward */
  back?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const cross = (e: React.MouseEvent) => {
    /* let the browser handle modified clicks — new tab, new window */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    /* recorded before the reduced-motion check, so a reader who turned
       the animation off still lands back where they were */
    try {
      if (!back) sessionStorage.setItem(YKEY, String(Math.round(scrollY)));
    } catch {}
    if (prefersReducedMotion()) return;

    e.preventDefault();
    const sign = back ? -1 : 1;
    lock();
    origin();
    document.documentElement.classList.add(CLS);
    set(0, 0);
    requestAnimationFrame(() =>
      turn(0, X90, sign, 0, () => {
        /* scroll: false — the far side puts the reader back exactly where
           they were while the sheet is still edge-on. Let Next reset to
           the top first and you get the top of the page for a frame and
           then a jump, which is what "it scrolls me there" was. */
        router.push(href, { scroll: false });
        /* if the far side never mounts — a failed route, a slow chunk —
           finish the turn anyway rather than leaving the sheet on edge */
        window.setTimeout(() => {
          if (document.documentElement.classList.contains(CLS)) {
            turn(X90, 1, sign, 180, clear);
          }
        }, 1800);
      })
    );
  };

  return (
    <Link href={href} className={className} onClick={cross}>
      {children}
    </Link>
  );
}

/** the other side: finish the turn the crossing started */
export function DoorReveal({ back }: { back?: boolean }) {
  const once = useRef(false);

  useLayoutEffect(() => {
    if (once.current) return;
    once.current = true;

    const r = document.documentElement;
    if (!r.classList.contains(CLS)) return;
    if (prefersReducedMotion()) {
      clear();
      return;
    }

    /* Put the reader down before anything is visible. The sheet is edge-on
       for the whole of this effect, so there is no scrolling to watch:
       they left at the shelf, they come back at the shelf. */
    if (back) {
      try {
        const y = sessionStorage.getItem(YKEY);
        sessionStorage.removeItem(YKEY);
        if (y !== null) jump(Number(y));
      } catch {}
    }

    const sign = back ? -1 : 1;
    lock();
    origin();
    /* pick the turn up past edge-on, minus a half turn so it lands flat
       rather than mirrored */
    set(sign * (180 * ease(X90) - 180), ease(X90));
    requestAnimationFrame(() => turn(X90, 1, sign, 180, clear));

    /* and if this ever unmounts mid-turn, do not leave the page on edge */
    return clear;
  }, [back]);

  return null;
}

/**
 * The reduced-motion way back.
 *
 * With the turn on, DoorReveal has already put the reader down while the
 * sheet was edge-on. This only fires when there was no turn to hide the
 * move behind, so it runs before paint and never animates.
 */
export function DoorReturn() {
  useLayoutEffect(() => {
    let y: string | null = null;
    try {
      y = sessionStorage.getItem(YKEY);
      sessionStorage.removeItem(YKEY);
    } catch {}
    if (y !== null) jump(Number(y));
  }, []);

  return null;
}
