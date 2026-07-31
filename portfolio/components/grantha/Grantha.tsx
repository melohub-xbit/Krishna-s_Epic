"use client";

/**
 * గ్రంథం / THE BOOK — an open two-page spread you turn with a real page-curl.
 *
 * This replaces the deleted /volume, and since 2026-07-30 it IS the site at `/`
 * (the scroll document is retired). The lesson carried over: a page-turn is
 * STATE, not scroll. What changed is the turn itself. The old leaf was a blank
 * bending sheet because DOM can't cheaply put content on a curve; this one is a
 * WebGL curl (lib/curlSource.ts) fed by textures captured from the real spreads
 * (lib/captureSpread.ts), so the turning page carries its actual content.
 *
 * ================================================================
 * WHAT IS HERE, AND WHAT IS IN CurlVolume
 * ================================================================
 * [2026-07-30] The turn itself moved to `CurlVolume` so the project books
 * (Phase 5) turn with the SAME curl — two curls that looked slightly different
 * would break the illusion that opening a project goes one level deeper into the
 * same object. What stays here is everything a book needs but a *page turn* does
 * not: the chrome, the URL, and which spread the site is on.
 *
 * ================================================================
 * LIVE DOM AT REST, TEXTURE ONLY MID-TURN  (now in CurlVolume)
 * ================================================================
 * The shader can only deform a texture, so it would be easy to leave the book
 * permanently rasterised — and that is what this did until the book became `/`.
 * An image of a portfolio has no selectable text, nothing for a crawler and
 * nothing for a screen reader. So every spread is mounted ONCE as real DOM, two
 * of them slotted onto the open pages, and the curl canvas is revealed only while
 * a leaf is actually in flight (~1s). Nobody selects text mid-turn.
 *
 * Mounting ALL of them and moving them between slots (rather than mounting the
 * two that show) buys two things: a turn never unmounts and remounts twenty
 * panels and their SVGs on the frame the leaf lands, and every spread stays laid
 * out at exact page size, so it stays capturable without a second offscreen copy
 * of the markup to keep in sync.
 *
 * ================================================================
 * THE BOOK MODEL — ONE canvas across BOTH pages
 * ================================================================
 * Andrew Hung's shader curls one whole sheet. A book doesn't: it hinges a leaf
 * at the centre spine and has to roll OVER the spine to lie down on the far
 * half. So the canvas spans the WHOLE open book, not just the right page — an
 * earlier version confined it to the right page and the leaf simply vanished at
 * the spine, because it had nowhere to go.
 *
 * The shader (SimpleBookCurl, see lib/curlSource.ts) is an A -> B transition:
 * `from` is the current spread with BOTH pages composited, `to` is the next
 * spread with both. Pairing is sequential — at page P the book reads (P-1 | P).
 * A forward turn goes to (P | P+1); because `from` already holds P on its right
 * and `to` holds P on its left, turning `from`'s right page over reproduces `to`
 * exactly. A backward turn is that SAME curl MIRRORED (a `uMirror` uniform, not
 * progress run in reverse — reversing folds at the spine and reads wrong), so
 * the left leaf lifts and lays down on the right. One shader, both directions.
 *
 * ================================================================
 * THE PHASE GUARD IS THE ONLY LOCK
 * ================================================================
 * A wheel gesture fires dozens of events. `phaseRef` rejects every turn request
 * that isn't "idle", and ONLY the tween's onComplete clears it. One lock, one
 * owner — two places deciding whether a turn may start is how you strand a leaf
 * mid-curl (the exact bug the old volume warned about).
 */
import { useCallback, useEffect, useRef, useState } from "react";

import CurlVolume from "@/components/grantha/CurlVolume";
import Patterns from "@/components/ornament/Patterns";
import { Hanko } from "@/components/ornament/Motifs";
import { SPREADS } from "@/data/spreads";
import { profile, nav } from "@/data/profile";
import { teluguNum } from "@/lib/teluguNum";

/** The URL a spread lives at. The cover is the site root, not "/cover". */
export function spreadHref(i: number) {
  return i <= 0 ? "/" : `/${SPREADS[i].slug}`;
}

/**
 * Which spread a path is showing, or 0 (the cover) for anything unrecognised.
 * Unrecognised only happens for a path this component was never meant to own
 * (the /grantha workbench, say), and the cover is the safe reading of "the site
 * root" — a real bad slug 404s in the route, before we get here.
 */
function pageFromPath(path: string) {
  const slug = path.replace(/^\/+|\/+$/g, "");
  if (!slug) return 0;
  const i = SPREADS.findIndex((s) => s.slug === slug);
  return i < 0 ? 0 : i;
}

export interface GranthaProps {
  /** Which spread to open on — set by the route for a deep link. */
  initialPage?: number;
  /**
   * Write `history.pushState` on every turn and answer `popstate`. True on the
   * real site; false on the /grantha workbench, which must not fight the URL of
   * the route the reader is actually on.
   */
  syncUrl?: boolean;
  /** Ignore all input. Used while the landing sequence is still playing. */
  paused?: boolean;
  /**
   * Fired with the current spread's chakra keys whenever the page settles. The
   * canvas lives OUTSIDE this component (it is a fixed layer behind everything, so
   * the wheel does not move when a page does), so the keys have to travel up.
   */
  onChakra?: (keys: { spin: number; scale: number }) => void;
}

export default function Grantha({
  initialPage = 0,
  syncUrl = false,
  paused = false,
  onChakra,
}: GranthaProps) {
  const [page, setPage] = useState(initialPage);
  const rootRef = useRef<HTMLDivElement>(null);
  const last = SPREADS.length - 1;

  /* ----------------------------------------------------------------- URLs */

  // The page and the URL must never disagree, so ONE effect owns the write: it
  // fires on every settled page change, whatever caused it (turn, nav, back
  // button). Pushing from inside the turn callback instead would mean every new
  // way of changing the page has to remember to push, which is how a page and
  // its URL drift apart.
  useEffect(() => {
    if (!syncUrl) return;
    // Compare through pageFromPath, not string equality: "/about/" and "/about"
    // are the same spread, and a raw compare would push a duplicate history entry
    // on arrival at the trailing-slash form.
    if (pageFromPath(window.location.pathname) === page) return;
    window.history.pushState({ page }, "", spreadHref(page));
  }, [page, syncUrl]);

  // Back / forward. Adopts the page with no turn: the reader asked to jump, and
  // a browser-history hop has no single leaf to curl (same reasoning as jumpTo).
  useEffect(() => {
    if (!syncUrl) return;
    const onPop = () => setPage(pageFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [syncUrl]);

  // The chakra reacts on ARRIVAL, not during the turn: the values in
  // data/spreads.ts were authored per page, and mid-curl the reader is watching the
  // leaf, not the stage behind it. 03 §3.3.
  useEffect(() => {
    const k = SPREADS[page]?.chakra;
    if (k) onChakra?.({ spin: k.spin, scale: k.scale });
  }, [page, onChakra]);

  /* --------------------------------------------------------- page changes */

  // What a completed turn commits to. CurlVolume runs the animation and calls
  // this; the URL effect above then follows the page. One direction of flow.
  const commit = useCallback((target: number) => setPage(target), []);

  // Non-adjacent nav (the top bar, the browser): no riffle, just adopt — a deep
  // jump has no single leaf to curl. The iaijutsu cut (§02.7) is the intended
  // treatment and is not built; until then a jump is instant.
  const jumpTo = useCallback(
    (i: number) => {
      if (paused || i < 0 || i > last || i === page) return;
      setPage(i);
    },
    [paused, page, last]
  );

  // A nav click turns the book instead of navigating — but only a plain one.
  // Ctrl/Cmd/Shift/middle clicks are the browser's ("open in new tab"), and
  // swallowing them is a small, infuriating way to break a link.
  const onNav = useCallback(
    (e: React.MouseEvent, i: number) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      jumpTo(i);
    },
    [jumpTo]
  );

  const meta = SPREADS[page];

  return (
    <div className="grantha" ref={rootRef}>
      <Patterns />

      {/* The chrome is <a href> and not <button>, for three reasons that all bit:
          the stylesheet only ever styled `.nav a` (as buttons these rendered as
          raw browser widgets — visible in Krishna's 2026-07-30 screenshots); the
          current-page marker is `[data-on]`, not `data-current`, so the highlight
          never lit; and now that spreads have real URLs, these are the ONLY
          internal links to them — as buttons, /about and /ramayanam would be
          orphan pages no crawler could reach. Plain clicks are intercepted so the
          book turns instead of navigating; modified and middle clicks fall through
          to the browser so "open in new tab" still works. */}
      <header className="topbar">
        <a className="mark" href="/" onClick={(e) => onNav(e, 0)}>
          <Hanko size={38} />
          <span className="mark-txt">
            KRISHNA SAI
            <span>{profile.nameTe}</span>
          </span>
        </a>
        <nav className="nav">
          {nav.map((n) => {
            const target = SPREADS.findIndex((s) => s.slug === n.href.slice(1));
            if (target < 0) return null;
            return (
              <a
                key={n.en}
                href={spreadHref(target)}
                data-on={target === page ? "1" : undefined}
                aria-current={target === page ? "page" : undefined}
                onClick={(e) => onNav(e, target)}
              >
                {n.en}
                <i>{n.te}</i>
              </a>
            );
          })}
        </nav>
      </header>

      <div className="scrim" aria-hidden="true" />

      {/* The book. Its whole body — the paper plate, every spread as live DOM in
          l/r/off slots, the curl canvas and the gutter — is CurlVolume, shared
          with the project books so both turn identically. The Observer binds to
          `.grantha` (this component's root) rather than to the book itself, so a
          wheel anywhere on the page turns, not only over the paper. */}
      <CurlVolume
        pages={SPREADS.map(({ slug, component: Spread }) => <Spread key={slug} />)}
        page={page}
        onTurnEnd={commit}
        cacheKey="volume"
        paused={paused}
        inputTarget={rootRef}
      />
      {/* Telugu-paired page marker (locked "Telugu always paired" rule). */}
      <div className="book-counter" aria-live="polite">
        <span className="te">
          {meta.title[0]} · అధ్యాయం {teluguNum(page + 1)}
        </span>
        <span className="book-counter-latin">
          {String(page + 1).padStart(2, "0")} / {String(SPREADS.length).padStart(2, "0")}
        </span>
      </div>

    </div>
  );
}
