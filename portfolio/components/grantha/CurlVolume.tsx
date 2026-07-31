"use client";

/**
 * A TURNABLE TWO-PAGE BOOK — the shared body of every book in this project.
 *
 * ================================================================
 * WHY THIS IS EXTRACTED
 * ================================================================
 * There are now two books: the volume itself (`Grantha`, the site at `/`) and a
 * per-project mini-book (`MangaBook`, roadmap Phase 5). They must turn
 * IDENTICALLY. Two curls that look slightly different is worse than one curl
 * everywhere — the whole conceit is that opening a project is going one level
 * deeper into the same object, and a different turn breaks that in the one
 * moment the reader is paying most attention. So the turn lives here, once, and
 * both books mount it. It is also logged as a seam in roadmap Phase 6.5.
 *
 * Everything about HOW a page turns is in here: measurement, the capture window,
 * spread compositing, the tween, the phase guard, the live-DOM slots, the curl
 * canvas. Everything about WHAT the pages are, what chrome surrounds them, and
 * what a page change means to the URL stays with the caller.
 *
 * ================================================================
 * THE PAGE IS THE CALLER'S; THE ANIMATION IS OURS
 * ================================================================
 * `page` is a prop, not state. This component never decides which page you are
 * on — it decides what a turn looks like, and when the tween finishes it calls
 * `onTurnEnd(target)` and lets the caller commit. That split is deliberate:
 * `Grantha` has to keep the page and the URL in agreement, and a component that
 * owned the page while the caller owned the URL would give you two sources of
 * truth for one fact. Non-adjacent changes (nav, back button) just arrive as a
 * new `page` and are adopted with no animation, which is correct — a jump has no
 * single leaf to curl.
 *
 * See PageCurl.tsx and lib/curlSource.ts for the shader, and the `.book*` rules
 * in globals.css for the layer stack (plate / live pages / curl / spine).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

import PageCurl from "@/components/grantha/PageCurl";
import { captureSpread, clearCaptureCache } from "@/lib/captureSpread";
import { DUR, EASE } from "@/components/ink/ease";

gsap.registerPlugin(Observer);

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Is this book the one the reader is actually in?
 *
 * A project book is rendered INSIDE a page of the volume, so both volumes are
 * mounted at once, both have a window `keydown` listener, and the book's wheel
 * events bubble up to the volume's Observer target. Without this check one
 * ArrowRight turns two books at the same time, and the volume silently changes
 * page behind an open book.
 *
 * The rule is positional rather than a flag passed down: if a modal dialog is open
 * anywhere in the document and this book is not inside it, this book is not the
 * active one. That needs no communication between the two — a project book opened
 * from a page cannot reach the volume's props — and it holds for any future modal
 * without teaching it about books.
 */
function isActiveBook(root: HTMLElement | null) {
  if (typeof document === "undefined" || !root) return true;
  const modal = document.querySelector('[role="dialog"][aria-modal="true"]');
  return !modal || modal.contains(root);
}

export interface CurlVolumeProps {
  /** One node per page, in reading order. Rendered LIVE — see the slot note below. */
  pages: React.ReactNode[];
  /** Current page. Owned by the caller. */
  page: number;
  /** Fired when a turn's tween completes. The caller commits the new page. */
  onTurnEnd: (target: number) => void;
  /**
   * Namespace for the capture cache. Two books on screen at once (the volume and
   * an open project book) both capture "page 3", and without a prefix the second
   * would be handed the first one's texture.
   */
  cacheKey: string;
  /** Page width / height. */
  aspect?: number;
  /** Fraction of the viewport the open book may occupy, and a hard height cap. */
  fit?: { height: number; width: number; maxPageHeight: number };
  /** Reject all input — a landing sequence playing, or a book open over us. */
  paused?: boolean;
  /**
   * Element to bind the wheel/touch Observer to. Defaults to this component's own
   * root. The volume passes its full-viewport container so a wheel anywhere on
   * the page turns, not just over the book itself.
   */
  inputTarget?: React.RefObject<HTMLElement | null>;
  /** Bind arrow keys / PageUp / PageDown / Space on the window. */
  keyboard?: boolean;
  /**
   * Fired ONCE per turn, at the curl's apex, with the direction. This is where the
   * sakura burst hangs (02 §2.2) — petals are a moment-of-passage particle, and the
   * apex is that moment. Deliberately a callback rather than something this
   * component owns: petals have to be drawn ABOVE the book, and the book does not
   * know what is above it.
   */
  onApex?: (dir: 1 | -1) => void;
  className?: string;
}

const DEFAULT_FIT = { height: 0.82, width: 0.94, maxPageHeight: 780 };

export default function CurlVolume({
  pages,
  page,
  onTurnEnd,
  cacheKey,
  aspect = 0.72,
  fit = DEFAULT_FIT,
  paused = false,
  inputTarget,
  keyboard = true,
  onApex,
  className,
}: CurlVolumeProps) {
  const [phase, setPhase] = useState<"idle" | "turning">("idle");
  const [dir, setDir] = useState<1 | -1>(1);
  const [progress, setProgress] = useState(0);
  // A FIXED default for the first render on both server and client — measuring the
  // viewport during render makes the server emit one size and the client hydrate at
  // another, which React flags as a mismatch. Measured in an effect after mount.
  const [size, setSize] = useState({ w: 480, h: 660 });
  const [caps, setCaps] = useState<Record<number, HTMLCanvasElement | null>>({});
  /**
   * Is the curl actually going to draw? Assumed yes until PageCurl says otherwise
   * (no WebGL, or a lost context). It matters because the live page layer is hidden
   * for the duration of a turn so the curl can be seen — if the curl is not there,
   * hiding the pages would show a second of blank paper. So a broken curl degrades
   * to an instant swap, which is what the fallback was always documented to be.
   */
  const [curlOk, setCurlOk] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const last = pages.length - 1;

  const computeSize = useCallback(() => {
    if (typeof window === "undefined") return { w: 480, h: 660 };
    let h = Math.min(window.innerHeight * fit.height, fit.maxPageHeight);
    let w = h * aspect;
    if (w * 2 > window.innerWidth * fit.width) {
      w = (window.innerWidth * fit.width) / 2;
      h = w / aspect;
    }
    return { w: Math.round(w), h: Math.round(h) };
  }, [aspect, fit.height, fit.width, fit.maxPageHeight]);

  /* ------------------------------------------------------------- capture */

  const capture = useCallback(
    async (i: number) => {
      if (i < 0 || i > last) return;
      const node = pageRefs.current[i];
      if (!node) return;
      const canvas = await captureSpread(node);
      setCaps((prev) => (prev[i] === canvas ? prev : { ...prev, [i]: canvas }));
    },
    [last]
  );

  // Rasterise the window around the current page. Everything reachable in one
  // turn (P-2..P+1) is ready before the turn asks for it.
  useEffect(() => {
    if (phase !== "idle") return;
    for (let i = page - 2; i <= page + 1; i++) capture(i);
  }, [page, phase, size, capture]);

  useEffect(() => {
    setSize(computeSize());
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Every texture was rasterised at the old size and is now wrong.
        clearCaptureCache();
        setCaps({});
        setSize(computeSize());
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [computeSize]);

  /* ------------------------------------------------------------- turning */

  const turn = useCallback(
    (d: 1 | -1) => {
      if (pausedRef.current || phaseRef.current !== "idle") return;
      if (!isActiveBook(rootRef.current)) return;
      const target = page + d;
      if (target < 0 || target > last) return;

      // Reduced motion, or no working curl: adopt the page. Same content, same
      // order — the turn is the only thing lost.
      if (reducedMotion() || !curlOk) {
        onTurnEnd(target);
        return;
      }

      setDir(d);
      setPhase("turning");
      setProgress(0);
      // BOTH directions animate 0 -> 1. A backward turn is not this motion
      // reversed (that folds at the spine and looks wrong) — it is the same curl
      // MIRRORED, so it lifts the left page. The mirror is a uniform in PageCurl;
      // here the only difference is the destination texture.
      const box = { v: 0 };
      let apexFired = false;
      gsap.to(box, {
        v: 1,
        duration: DUR.long,
        ease: EASE.ink,
        onUpdate: () => {
          setProgress(box.v);
          // The APEX — where the leaf stands closest to vertical and the gutter is
          // most open. Keyed off eased progress rather than a timer, so it stays the
          // apex if the duration or easing ever changes.
          if (!apexFired && box.v >= 0.42) {
            apexFired = true;
            onApexRef.current?.(d);
          }
        },
        onComplete: () => {
          onTurnEnd(target);
          setDir(1);
          setProgress(0);
          setPhase("idle");
        },
      });
    },
    [page, last, onTurnEnd, curlOk]
  );

  // Held in a ref for the same reason the input handlers are: the tween closes over
  // it, and a new callback identity from a parent re-render must not restart a turn.
  const onApexRef = useRef(onApex);
  onApexRef.current = onApex;

  // The Observer and the key listener are created ONCE. `turn` changes identity
  // whenever `page` does, so binding it directly would kill and rebuild the
  // Observer mid-gesture with preventDefault active — swallowing the wheel events
  // that arrive during teardown, which reads as scrolling that skips or sticks.
  const turnRef = useRef(turn);
  turnRef.current = turn;

  useEffect(() => {
    const target = inputTarget?.current ?? rootRef.current;
    if (!target) return;
    // Wheel and touch only — no "pointer", so a mouse click-and-drag selects text
    // instead of turning the page.
    const obs = Observer.create({
      target,
      type: "wheel,touch",
      tolerance: 12,
      preventDefault: true,
      onDown: () => turnRef.current(1),
      onUp: () => turnRef.current(-1),
      onLeft: () => turnRef.current(1),
      onRight: () => turnRef.current(-1),
    });
    return () => obs.kill();
  }, [inputTarget]);

  useEffect(() => {
    if (!keyboard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ")
        turnRef.current(1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") turnRef.current(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboard]);

  /* ------------------------------------------------- which leaf is showing */

  // Composite two single-page captures into one open-book texture: page `li` on
  // the left half, `ri` on the right. The curl is an A -> B transition over the
  // whole book, so both the page turning and the page it lands on must be present
  // in each texture. A missing capture leaves that half plain paper.
  const composeBook = useCallback(
    (li: number, ri: number): HTMLCanvasElement | null => {
      if (typeof document === "undefined") return null;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pw = Math.round(size.w * dpr);
      const ph = Math.round(size.h * dpr);
      const c = document.createElement("canvas");
      c.width = pw * 2;
      c.height = ph;
      const x = c.getContext("2d");
      if (!x) return null;
      x.fillStyle = "#f3ede0";
      x.fillRect(0, 0, c.width, c.height);
      const L = caps[li];
      const R = caps[ri];
      if (L) x.drawImage(L, 0, 0, pw, ph);
      if (R) x.drawImage(R, pw, 0, pw, ph);
      return c;
    },
    [caps, size]
  );

  // `from` is always the current open book (P-1 | P). Only the destination and
  // the mirror flag differ by direction:
  //   forward  -> to = (P | P+1),   curl lifts the RIGHT page
  //   backward -> to = (P-2 | P-1), curl MIRRORED, lifts the LEFT page
  // These depend on caps/size/page/dir but NOT progress, so the textures keep a
  // stable identity across the turn and are never re-uploaded mid-curl.
  const back = phase === "turning" && dir === -1;
  const fromTex = useMemo(() => composeBook(page - 1, page), [composeBook, page]);
  const toTex = useMemo(
    () => composeBook(back ? page - 2 : page, back ? page - 1 : page + 1),
    [composeBook, back, page]
  );

  const turning = phase === "turning" && curlOk;
  const slotOf = (i: number) => (i === page - 1 ? "l" : i === page ? "r" : "off");

  return (
    <div
      ref={rootRef}
      className={`book ${className ?? ""}`}
      style={{ width: size.w * 2, height: size.h }}
    >
      <div className="book-plate" aria-hidden="true" />

      {/* EVERY page, mounted once, real live DOM. The two on the open spread sit
          in the l/r slots; the rest are parked off-viewport but still laid out.
          This is what the reader reads and selects, and what a crawler and a
          screen reader get — the curl only borrows a capture of it. Mounting all
          of them and moving them between slots (rather than mounting the two that
          show) means a turn never unmounts and remounts a page's whole subtree on
          the frame the leaf lands. */}
      <div className="book-pages" data-hidden={turning ? "1" : undefined}>
        {pages.map((node, i) => {
          const slot = slotOf(i);
          const open = slot !== "off";
          return (
            <div
              key={i}
              ref={(el) => {
                pageRefs.current[i] = el;
              }}
              data-capture-key={`${cacheKey}:${i}`}
              className="book-page"
              data-slot={slot}
              // A reader must not be able to Tab into a link on a page that is not
              // open. `inert` does that and hides it from assistive tech; aria-hidden
              // alone would leave the links focusable.
              {...(open ? {} : { inert: true, "aria-hidden": true })}
            >
              {node}
            </div>
          );
        })}
      </div>

      <PageCurl
        from={fromTex}
        to={toTex}
        progress={progress}
        ratio={(size.w * 2) / size.h}
        mirror={back}
        className="book-face-full"
        hidden={!turning}
        onReady={setCurlOk}
      />

      <div className="book-spine" aria-hidden="true" />
    </div>
  );
}
