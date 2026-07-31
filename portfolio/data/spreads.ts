/**
 * THE SPREAD REGISTRY — the volume's page list. Spec: 08 §8.3, order from
 * 03 §3.2.
 *
 * This array IS the book: index = page number, order = reading order, and the
 * store's `page` is an index into it. Reordering here reorders the volume, and
 * nothing else needs to change.
 *
 * `chakra` per spread is what closes the long-standing "chakra doesn't react
 * to scroll" item (PROJECT-STATUS §6): on arrival the canvas rig tweens to
 * that spread's spin/scale/tint. It lands naturally now because pages are
 * discrete states rather than a continuous scroll offset — there is an exact
 * moment to key to.
 *
 * Omake (§03.2 page 9) is deliberately absent: it needs Krishna's actual lists
 * and its art, which is Phase 6. Adding an empty page now would put a dead
 * spread in the middle of the volume.
 */
import type { FC } from "react";

import {
  AboutSpread,
  AstrasSpread,
  ColophonSpread,
  CoverSpread,
  ForkSpread,
  MahabharatamSpread,
  RamayanamSpread,
} from "@/components/spreads/Spreads";

export interface SpreadDef {
  /** URL segment. Page 0's slug is not used — the cover lives at "/". */
  slug: string;
  /** [Telugu, Latin]. Telugu is always paired (locked decision). */
  title: [telugu: string, latin: string];
  component: FC;
  /**
   * Canvas keys for this page. `spin` is a multiplier on the chakra's base
   * rate, `scale` on its radius. Values are deliberately close to 1: the
   * chakra is the one thing that persists across every page, and if it lurches
   * between spreads it stops reading as a fixed stage and starts reading as
   * another animated element.
   */
  chakra: { spin: number; scale: number; tint?: string };
  /** Backdrop pattern, where §03.2 calls for one. */
  pattern?: "kikko" | "shippo" | "endpaper";
}

export const SPREADS: SpreadDef[] = [
  {
    slug: "cover",
    title: ["ముఖచిత్రం", "Cover"],
    component: CoverSpread,
    // The cover is the chakra's own page — largest and slowest, the sun.
    chakra: { spin: 1, scale: 1 },
  },
  {
    slug: "about",
    title: ["పరిచయం", "About"],
    component: AboutSpread,
    chakra: { spin: 0.75, scale: 0.92 },
  },
  {
    slug: "fork",
    title: ["రెండు మార్గాలు", "The fork"],
    component: ForkSpread,
    // The fork is the decision point: the chakra slows almost to a stop and
    // pulls back, so the two gates carry the page.
    chakra: { spin: 0.45, scale: 0.86 },
  },
  {
    slug: "ramayanam",
    title: ["రామాయణం", "Ramayanam"],
    component: RamayanamSpread,
    // Research arc: warm and steady. One disciplined journey (§03.2).
    chakra: { spin: 0.6, scale: 0.88, tint: "gold" },
  },
  {
    slug: "mahabharatam",
    title: ["మహాభారతం", "Mahabharatam"],
    component: MahabharatamSpread,
    // Build arc: faster, blue-lit key — the battlefield.
    chakra: { spin: 1.3, scale: 0.88, tint: "kumkum" },
  },
  {
    slug: "astras",
    title: ["అస్త్రాలు", "Astras"],
    component: AstrasSpread,
    chakra: { spin: 0.9, scale: 0.9 },
    pattern: "kikko",
  },
  {
    slug: "contact",
    title: ["సంప్రదింపు", "Colophon"],
    component: ColophonSpread,
    // End of volume: the chakra settles and recedes as the ensō closes.
    chakra: { spin: 0.35, scale: 0.82 },
    pattern: "shippo",
  },
];

export const PAGE_COUNT = SPREADS.length;
