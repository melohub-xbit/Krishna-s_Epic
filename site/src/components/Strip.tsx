"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Poster from "./Poster";
import PosterRecord from "./PosterRecord";
import { addJob, prefersReducedMotion } from "@/lib/dots";
import type { Project } from "@/data/projects";

/**
 * THE RAIL — the work section, as a line of bounty posters.
 *
 * You scroll it like anything else — the rail just runs sideways. While
 * the cursor is over it and it still has room to travel, the wheel moves
 * the rail; the moment it reaches either end, the wheel goes back to the
 * page. So you scroll in, go through all twenty-two, and scroll out, and
 * the section never holds you longer than it has posters. Nothing is
 * pinned, and the page is never taller than it looks.
 *
 * A mouse notch advances one poster, smoothly. A trackpad or a phone
 * moves it directly, at whatever speed you push. You can also click any
 * poster you can see to bring it to the centre, or a tick underneath to
 * jump. Clicking the poster that is already centred opens its record.
 *
 * The turn is driven per frame from the rail's own scrollLeft — never the
 * page's — and only while the rail is on screen. It rides the one shared
 * ticker in lib/dots, so there is still exactly one rAF loop on this site.
 */
export default function Strip({ projects }: { projects: Project[] }) {
  const N = projects.length;

  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const ticks = useRef<(HTMLButtonElement | null)[]>([]);
  const readout = useRef<HTMLParagraphElement>(null);

  const liveRef = useRef(0);
  const [open, setOpen] = useState<{ i: number; rect: DOMRect } | null>(null);

  /** bring card `i` to the centre of the rail */
  const centre = useCallback((i: number, smooth = true) => {
    const el = track.current;
    const it = items.current[i];
    if (!el || !it) return;
    el.scrollTo({
      left: it.offsetLeft + it.offsetWidth / 2 - el.clientWidth / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  /* ── the turn ─────────────────────────────────────────────── */
  useEffect(() => {
    const el = track.current;
    const box = wrap.current;
    if (!el || !box) return;

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          box.dataset.active = e.isIntersecting ? "true" : "false";
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(box);

    const flat = prefersReducedMotion();
    let lastLive = -1;
    let lastScroll = -1;

    const stop = addJob(() => {
      if (!visible) return true;

      const c = el.scrollLeft + el.clientWidth / 2;
      const moved = c !== lastScroll;
      lastScroll = c;

      let nearest = 0;
      let nearestD = Infinity;

      if (moved || lastLive < 0) {
        /* the real pitch, gap included, straight off the layout */
        const a = items.current[0];
        const b = items.current[1];
        const pitch =
          a && b ? b.offsetLeft - a.offsetLeft : a?.offsetWidth || 1;

        for (let i = 0; i < N; i++) {
          const it = items.current[i];
          if (!it) continue;
          const d = (it.offsetLeft + it.offsetWidth / 2 - c) / pitch;
          const ad = Math.abs(d);
          if (ad < nearestD) {
            nearestD = ad;
            nearest = i;
          }

          if (!flat) {
            const ry = Math.max(-1, Math.min(1, d)) * -38;
            const sc =
              ad < 1 ? 1.14 - ad * 0.2 : 0.94 - Math.min(ad - 1, 3) * 0.022;
            const tz = ad < 1 ? 60 - ad * 40 : -ad * 34;
            const op = ad > 4.6 ? 0 : 1 - ad / 6;

            it.style.transform = `translate3d(0,0,${tz.toFixed(
              1
            )}px) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
            it.style.opacity = op.toFixed(3);
            it.style.zIndex = String(400 - Math.round(ad * 10));
          }
        }
      }

      if (nearest !== lastLive && moved) {
        const prev = items.current[lastLive];
        if (prev) prev.dataset.live = "false";
        const now = items.current[nearest];
        if (now) now.dataset.live = "true";

        const pt = ticks.current[lastLive];
        if (pt) pt.dataset.on = "false";
        const nt = ticks.current[nearest];
        if (nt) nt.dataset.on = "true";

        if (readout.current) {
          readout.current.innerHTML =
            `${String(nearest + 1).padStart(2, "0")} / ${N} &nbsp;·&nbsp; ` +
            `<b>${projects[nearest].name}</b>`;
        }
        lastLive = nearest;
        liveRef.current = nearest;
        /* the field behind the section draws whatever is live */
      }

      return true;
    });

    return () => {
      io.disconnect();
      stop();
    };
  }, [N, projects]);

  /* ── the wheel drives the rail ───────────────────────────── */
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    /* ── the mouse wheel, and nothing else ───────────────────
       The track is an ordinary `overflow-x: auto` box, so a trackpad
       already scrolls it: a two-finger horizontal swipe is native
       horizontal scrolling and the browser does it better than we can.
       The ONLY thing missing is a mouse, which has no horizontal axis
       to give — so all this does is turn a wheel notch into a poster.

       Two earlier versions got this wrong by trying to own the gesture:
       the first refused any event within 200ms of a page scroll, which
       deadlocks on a trackpad (it fires continuously, so the window
       never elapses); the second took the dominant axis and hand-rolled
       `scrollLeft += delta`, which meant calling preventDefault on the
       very swipes the browser was already handling correctly, and
       fighting scroll-snap on every event.

       So: touch nothing that has a horizontal component, and nothing
       small enough to be a trackpad. Everything else is native. */

    let target = -1;
    let settle = 0;

    const onWheel = (e: WheelEvent) => {
      /* real horizontal intent — a trackpad swipe. The browser owns it. */
      if (e.deltaX !== 0) return;

      /* Line-mode, or a large vertical delta with no horizontal component
         at all: a wheel notch. Trackpads emit small, continuous, mixed
         deltas, and their vertical gestures should scroll the page — a
         horizontal strip inside a page does not get to eat that. */
      const isWheel = e.deltaMode !== 0 || Math.abs(e.deltaY) >= 50;
      if (!isWheel) return;

      const dy = e.deltaY;
      const max = el.scrollWidth - el.clientWidth;
      /* out of rail in the direction asked for — let the page have it */
      if (dy < 0 && el.scrollLeft <= 1) return;
      if (dy > 0 && el.scrollLeft >= max - 1) return;

      e.preventDefault();

      const a = items.current[0];
      const b = items.current[1];
      const pitch =
        a && b ? b.offsetLeft - a.offsetLeft : a?.offsetWidth || 240;

      /* one poster per notch, accumulated so a fast run of notches glides
         to the right place instead of restarting from wherever the smooth
         scroll happened to be */
      if (target < 0) target = el.scrollLeft;
      target = Math.max(0, Math.min(max, target + Math.sign(dy) * pitch));
      el.scrollTo({ left: target, behavior: "smooth" });
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        target = -1;
      }, 260);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settle);
    };
  }, []);

  /* start centred on the first poster, without a scroll animation */
  useEffect(() => {
    centre(0, false);
    const it = items.current[0];
    if (it) it.dataset.live = "true";
  }, [centre]);

  const onCard = useCallback(
    (i: number, el: HTMLButtonElement) => {
      if (i === liveRef.current) {
        setOpen({ i, rect: el.getBoundingClientRect() });
      } else {
        centre(i);
      }
    },
    [centre]
  );

  return (
    <div className="strip" ref={wrap}>
      <div className="strip-track" ref={track}>
        {projects.map((p, i) => (
          <button
            type="button"
            key={p.id}
            className="strip-item"
            ref={(el) => {
              items.current[i] = el;
            }}
            onClick={(e) => onCard(i, e.currentTarget)}
            aria-label={`${p.name} — ${p.figure}`}
            data-live={i === 0 ? "true" : undefined}
            /* the rest state, rendered on the server so the rail is
               already turned correctly before the first frame runs */
            style={{
              transform:
                i === 0
                  ? "translate3d(0,0,60px) scale(1.14)"
                  : `translate3d(0,0,${(-i * 34).toFixed(
                      0
                    )}px) rotateY(-38deg) scale(${(
                      0.94 -
                      Math.min(i - 1, 3) * 0.022
                    ).toFixed(3)})`,
              opacity: i > 4.6 ? 0 : Number((1 - i / 6).toFixed(3)),
              zIndex: 400 - i * 10,
            }}
          >
            <Poster project={p} index={i + 1} />
          </button>
        ))}
      </div>

      <div className="strip-under">
        <p className="strip-live" ref={readout}>
          01 / {N} &nbsp;·&nbsp; <b>{projects[0].name}</b>
        </p>
        <nav className="strip-ticks" aria-label="Jump to a project">
          {projects.map((p, i) => (
            <button
              type="button"
              key={p.id}
              className="strip-tick"
              ref={(el) => {
                ticks.current[i] = el;
              }}
              data-on={i === 0 ? "true" : "false"}
              onClick={() => centre(i)}
              title={p.name}
              aria-label={`Jump to ${p.name}`}
            />
          ))}
        </nav>
      </div>

      <PosterRecord
        project={open ? projects[open.i] : null}
        index={open ? open.i + 1 : 0}
        from={open?.rect ?? null}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}
