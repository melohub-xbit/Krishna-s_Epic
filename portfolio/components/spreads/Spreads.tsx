"use client";

/**
 * THE VOLUME'S PAGES — the registry's view of them.
 *
 * `data/spreads.ts` imports every page from here, so this file is the one place
 * that decides which component is which page. The markup itself lives next door:
 *
 *   - `Pages.tsx`     the five framing pages — cover, about, fork, astras, colophon
 *   - `EpicIndex.tsx` an arc page, as its chapter index
 *
 * [2026-07-30] Everything used to be in this file, as the scroll site's
 * `<section>`s. Two changes emptied it. First the arc pages became indexes, because
 * eleven full project cards cannot fit a page. Then the other five were composed FOR
 * a page rather than squeezed into one. What is left is the mapping, and keeping
 * that separate means the registry never has to change when a page is rewritten.
 *
 * Two constraints that apply to any page component, wherever it lives:
 *
 *   - **Nothing may depend on the viewport.** A page box is ~480px wide while
 *     `@media` still reads the real window, so viewport breakpoints fire at the
 *     wrong moment and `vh`/`vw` are meaningless. Size pages in `cqw`/`cqh` against
 *     the `page` container declared on `.book-page`.
 *   - **A page cannot grow.** It is a fixed rectangle; content that does not fit has
 *     to be moved to another page, not squeezed. Make fit structural — a `1fr`
 *     content region, `minmax(0, …)` rows, clamped text — so it holds at every page
 *     size rather than at the one you happened to look at.
 *
 * Every page keeps its `data-sec` attribute for the koma-reveal-on-arrival that
 * 03 §3.3 still wants and that nothing drives yet.
 */
import { Conch, Bow } from "@/components/ornament/Motifs";
import { epics } from "@/data/projects";
import EpicIndex from "@/components/spreads/EpicIndex";

export {
  CoverSpread,
  AboutSpread,
  ForkSpread,
  AstrasSpread,
  ColophonSpread,
} from "@/components/spreads/Pages";

/**
 * Both arcs are chapter indexes. Ramayanam was the pilot (2026-07-30) and
 * Mahabharatam followed once the approach was accepted — see EpicIndex.tsx for why
 * an arc page cannot be a list of full project cards.
 */
export function RamayanamSpread() {
  return <EpicIndex epic={epics.ramayanam} sigil={<Bow size={54} />} />;
}

export function MahabharatamSpread() {
  return <EpicIndex epic={epics.mahabharatam} sigil={<Conch size={54} />} />;
}
