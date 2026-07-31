/**
 * THE HOUSE CURVES — registered exactly once, for the whole site.
 *
 * Import this module for its side effect before using any named ease:
 *   import "@/components/ink/ease";
 * `inkDraw` already does, so anything going through it is covered.
 *
 * Curves and durations are transcribed from MOTION-CHOREOGRAPHY.md §0, which
 * is the single source for both. If a timing feels wrong, change it THERE
 * first and mirror it here — never the other way round, or the spec silently
 * stops describing the site.
 *
 * Why CustomEase and not the built-in "power2.inOut": `ink` is deliberately
 * asymmetric — it leaves fast and arrives slow, the hesitate-then-commit of a
 * loaded brush being set down and dragged off. No stock GSAP ease has that
 * shape, and approximating it with power-eases loses the whole character.
 */
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { RoughEase } from "gsap/EasePack";

// RoughEase powers the impact shakes (the hanko stamp, §03.1 beat 2.5). It is
// registered HERE rather than at the call site because a `rough({...})` string
// silently falls back to a linear tween if the plugin was never registered —
// the shake just quietly stops happening, with no console error to find.
gsap.registerPlugin(CustomEase, RoughEase);

/**
 * Duration tokens, in SECONDS (GSAP's unit — MOTION-CHOREOGRAPHY quotes ms).
 * Getting this wrong by 1000x is the classic GSAP mistake: `duration: 560`
 * is a nine-minute tween that looks like a frozen page, not an error.
 */
export const DUR = {
  micro: 0.18, // hovers, cursor states
  short: 0.32, // small reveals, peeks
  base: 0.56, // standard transition
  long: 0.9, // scene changes, the page-turn
  epic: 1.5, // landing, camera flights
} as const;

/** Stagger between siblings — the site's rhythm. MOTION-CHOREOGRAPHY §0. */
export const STAGGER = 0.07;

/**
 * Registration is idempotent by guard, not by CustomEase.create — calling
 * create twice with the same name is harmless but wasteful, and under React
 * Fast Refresh this module re-executes on every edit.
 */
let registered = false;

export function registerInkEases() {
  if (registered) return;
  registered = true;

  // The house curve. cubic-bezier(.7,0,.2,1) in CSS terms — CustomEase's
  // shorthand takes exactly those four control values.
  CustomEase.create("ink", "0.7,0,0.2,1");
  // Gentle settle with slight overshoot.
  CustomEase.create("soft", "0.22,1,0.36,1");
  // Symmetric wipe — for anything that should feel mechanical, not drawn.
  CustomEase.create("brush", "0.65,0,0.35,1");
}

registerInkEases();

/** Named eases, so call sites get autocomplete instead of magic strings. */
export const EASE = {
  ink: "ink",
  soft: "soft",
  brush: "brush",
  field: "none", // linear; continuous ambient loops
} as const;
