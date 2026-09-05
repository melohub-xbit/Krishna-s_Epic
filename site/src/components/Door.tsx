"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/dots";

/**
 * THE DOOR — how you cross between the page and /interests.
 *
 * A hole opens in the middle of the screen and eats outwards until the
 * page is gone, then the same hole closes back down over the new one. The
 * hole is made of the site's own halftone: one dot-grid layer with a
 * radial mask whose radius is animated, so what you see going out is the
 * page dissolving into the dots it was drawn from, and what you see
 * coming in is those dots resolving back into a page.
 *
 * There is exactly ONE veil, found by id, and it survives the navigation
 * on purpose — that is what makes the two halves of the animation join up
 * instead of flashing. Which also means whoever finds it is responsible
 * for removing it:
 *
 *   DoorLink    grows it, navigates, and arms a failsafe
 *   DoorReveal  mounts on the far side, shrinks whatever it finds, removes
 *
 * The first version appended the veil and left it. `router.push` is a
 * client navigation, so the new page rendered *underneath* a full-screen
 * `pointer-events: all` layer that nothing owned any more: the route
 * looked empty and every link on it was dead. Hence the failsafe, and
 * hence DoorReveal clearing a veil whether or not it believes it should
 * be there. A stale veil is never recoverable by the user, so nothing
 * here is allowed to depend on the happy path.
 */

const ID = "door-veil";
const FLAG = "door";
/** how far the hole has to grow to have covered a screen corner */
const FULL = 78;
const D = 460;

function veil() {
  let el = document.getElementById(ID);
  if (!el) {
    el = document.createElement("div");
    el.id = ID;
    el.className = "door-veil";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }
  return el;
}

function clear() {
  document.getElementById(ID)?.remove();
}

function run(el: HTMLElement, from: number, to: number, done?: () => void) {
  const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / D);
    const e = t * t * (3 - 2 * t);
    el.style.setProperty("--m", `${(from + (to - from) * e).toFixed(1)}%`);
    if (t < 1) requestAnimationFrame(step);
    else done?.();
  };
  requestAnimationFrame(step);
}

export default function DoorLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const cross = (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return;
    /* let the browser handle modified clicks — new tab, new window */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    try {
      sessionStorage.setItem(FLAG, "1");
    } catch {}

    const el = veil();
    el.style.setProperty("--m", "0%");
    requestAnimationFrame(() =>
      run(el, 0, FULL, () => {
        router.push(href);
        /* if the far side never mounts — a failed route, a slow chunk —
           uncover anyway rather than leaving the page sealed */
        window.setTimeout(() => {
          const stale = document.getElementById(ID);
          if (stale) run(stale, FULL, 0, clear);
        }, 1600);
      })
    );
  };

  return (
    <Link href={href} className={className} onClick={cross}>
      {children}
    </Link>
  );
}

/** the other side: uncover whatever the crossing left behind */
export function DoorReveal() {
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    try {
      sessionStorage.removeItem(FLAG);
    } catch {}

    const el = document.getElementById(ID);
    if (!el) return;
    if (prefersReducedMotion()) {
      clear();
      return;
    }
    run(el, FULL, 0, clear);

    /* and if this component ever unmounts mid-animation, do not leave a
       lid on the page */
    return clear;
  }, []);

  return null;
}
