# 08 · Implementation guide — the engineering handbook

Written so an agent with **zero conversation context** can build this. Read
`README.md` → `PROJECT-STATUS.md` → this file. Design intent lives in 01–05;
this file is *how*. Follow phase order from `07-roadmap.md`; per-phase
acceptance criteria are at the bottom. **Install the official GSAP agent
skills first: github.com/greensock/gsap-skills.**

---

## 8.1 Target component tree (create/modify in `portfolio/`)

**[REVISED 2026-07-30 — this tree is now a record of what exists, not a plan.]**
`components/volume/` was never kept: the whole `/volume` route, `TurnLeaf.tsx`,
`PageCounter.tsx` and `lib/store.ts` are **DELETED**. What actually shipped:

```
app/page.tsx                 the SCROLL site (fixed r3f canvas + <Site/>)  [exists]
app/grantha/page.tsx         THE BOOK — same canvas layer + <Grantha/>     [exists]
components/
  grantha/
    Grantha.tsx              the book: page state, input, capture window,
                             spread compositing, counter, offscreen render [exists]
    PageCurl.tsx             the WebGL surface across BOTH pages; upload-
                             on-identity-change / draw-on-progress split   [exists]
  spreads/Spreads.tsx        the 7 spread components — rendered by BOTH
                             / and /grantha, one copy of the markup        [exists]
lib/
  curlSource.ts              the GLSL (SimpleBookCurl port, §8.4)          [exists]
  captureSpread.ts           html-to-image rasterise + cache by el+size    [exists]
data/spreads.ts              the page list, with per-spread chakra keys    [exists]
```

Still unbuilt from the original plan below: `NorenMenu.tsx`, the `book/` tree,
`mangaScripts.ts`, `personal.ts`. `PageCounter` exists only as inline markup in
`Grantha.tsx`. The per-spread `chakra` keys in `data/spreads.ts` are **written
but not consumed** — nothing tweens the canvas rig on page change yet.

### Original plan (kept for the parts not yet built)

```
app/page.tsx                 mounts <Volume/> over the existing canvas   [modify]
components/
  volume/
    Volume.tsx               state-machine host; renders current spread,
                             turn layer, page counter, noren menu         [superseded → Grantha.tsx]
    Spread.tsx               one manga spread; lays out koma slots        [superseded → spreads/Spreads.tsx]
    TurnLeaf.tsx             the turning page (DOM lite path, §8.4)       [DELETED — see §8.4]
    PageCounter.tsx          అధ్యాయం 04 / 10, ticks with stamp            [inline in Grantha.tsx]
    NorenMenu.tsx            nav overlay (§02.5)                          [not built]
  book/
    MangaBook.tsx            project book host: open/close + inner flips  [new]
    BookPage.tsx             renders a BookPage from a MangaScript        [new]
    PanelFrame.tsx           koma with authored size/bleed/diagonal —
                             wraps existing ornament/Frame.tsx            [new]
  ink/
    inkDraw.ts               THE stroke-draw utility (§8.5)               [new]
    ease.ts                  registers the `ink` CustomEase once          [new]
    brushes/                 6–8 brush-mask PNGs + torn-edge textures     [new assets]
  ornament/Mon.tsx           crest registry (blazons in 04)               [new]
  crystal/, fields/, ornament/{Patterns,Frame,Motifs}.tsx                 [keep]
  foreground/Site.tsx        DISSOLVES: its sections re-parent into
                             spreads; Reveal.tsx logic moves into Spread  [migrate]
data/
  spreads.ts                 the volume's page list (§8.3)                [new]
  mangaScripts.ts            per-project MangaScript (schema §8.6,
                             content from 09-manga-scripts.md)            [new]
  personal.ts                omake content (needs Krishna's lists)        [new]
lib/
  store.ts                   Zustand volume store (§8.2)                  [new]
  palette.ts                 single source of colour                      [keep]
```

## 8.2 State machine

**[REVISED 2026-07-30] Zustand is gone. `lib/store.ts` is DELETED** and nothing
imports `zustand` any more (it is still in `package.json` — drop it). State is
local React state in `Grantha.tsx`, which was the right call once `/volume`'s
multi-component turn layer collapsed into one canvas: there is exactly one
consumer, so a store bought indirection and nothing else.

```ts
// components/grantha/Grantha.tsx — what actually exists
page: number                          // index into SPREADS
phase: "idle" | "turning"             // no "cutting" — jumps adopt instantly
dir: 1 | -1                           // which way the current turn goes
progress: number                      // 0..1, driven by one GSAP tween
size: { w, h }                        // one page, measured after hydration
caps: Record<number, HTMLCanvasElement | null>   // captured spread textures
```

The phase guard survives intact and is still **the only lock**: `phaseRef`
rejects any turn request that isn't `idle`, and ONLY the tween's `onComplete`
clears it. One lock, one owner.

**What was lost with the store and is now outstanding work:**

- **No history, no deep links.** `history.pushState` on turn and `popstate →
  turnTo` lived in the store. `/grantha` writes no URL, so a spread cannot be
  shared or reloaded into, and browser back/forward do nothing. (Silver lining:
  the old "spread slugs 404 on reload" bug is gone with it.)
- **No cut.** Non-adjacent nav (`jumpTo`, the top bar) adopts the page instantly
  with no transition. The iaijutsu cut (§02.7) is unbuilt.

Input as built (`Observer` on `.grantha`, created ONCE on mount — see §8.9):

```ts
Observer.create({
  target: document.querySelector(".grantha"),
  type: "wheel,touch",              // NO "pointer": a click-drag must not turn a page
  tolerance: 12, preventDefault: true,
  onDown: next, onUp: prev, onLeft: next, onRight: prev,
});
// keyboard: ArrowRight / PageDown / Space = next; ArrowLeft / PageUp = prev;
//           Home = cover, End = last.
// NOT built: the 48px edge click-strips.
```

### Original plan (Zustand — superseded, kept for the reasoning)

```ts
type Phase = "idle" | "turning" | "cutting" | "book-opening" | "book-closing";
interface VolumeState {
  page: number;                       // index into SPREADS
  prevPage: number;                   // for turn direction
  book: { projectId: string; page: number } | null;
  phase: Phase;
  turnTo(p: number): void;            // guard: only when phase==="idle"
  jumpTo(p: number): void;            // noren/deep-link → "cutting" (iaijutsu)
  openBook(id: string): void;
  closeBook(): void;
  bookTurn(dir: 1 | -1): void;
}
```

Rules: **every transition sets `phase` and only the GSAP timeline's
`onComplete` returns it to `idle`** — the phase guard is the debounce; no
other input locking. Deep links: `/:slug` maps to a spread index in
`spreads.ts`; `history.pushState` on turn; popstate → `turnTo`. Adjacent
turns animate; jumps of ≥2 pages use the cut.

Input (GSAP Observer, on the volume root):

```ts
Observer.create({
  type: "wheel,touch,pointer",
  tolerance: 10, preventDefault: true,
  onDown: () => next(), onUp: () => prev(),     // wheel down = next
  onLeft: () => prev(), onRight: () => next(),  // RTL: swipe RIGHT = next
});
// keyboard: ArrowLeft = next, ArrowRight = prev (RTL!); Escape closes book.
// click zones: fixed 48px hot-strips on LEFT edge = next, RIGHT edge = prev.
```

**[REVISED 2026-07-30] The spine is in the CENTRE.** The book is an open
two-page spread, not a single sheet, so "the spine is on the left" (below) is
itself superseded — though its *direction* stands. Ordinary book mapping: the
book reads (P-1 | P), a forward turn lifts the **RIGHT** leaf and lays it left,
`ArrowRight` / wheel-down / swipe-left advance.

**Open question for Krishna, flagged not decided:** the volume is therefore a
left-to-right book while §03.2 still specifies koma "revealed in RTL reading
order" and §8.6 renders `BookPage` right-to-left. Page order LTR + panel order
RTL is a defensible split (Western binding, manga panel grammar) but it is
currently accidental rather than chosen. Decide before Phase 5 writes books.

**[REVISED 2026-07-21 — Krishna] The spine is on the LEFT.** The RTL manga
convention below is REVERSED and the "do not fix" no longer applies. The sheet
is hinged at the left and falls over to the left, so the free edge is on the
right: `ArrowRight` / swipe-left / the right edge all advance. Ordinary book
mapping.

Rule that survives the reversal, and matters more than which way it goes:
**the leaf and the input mapping must always agree.** As built that means
`uMirror` in `PageCurl.tsx`/`curlSource.ts`, the `from`/`to` texture pairing in
`Grantha.tsx`, and the Observer/keyboard mapping — three places now, not two. If
one is ever flipped, flip all of them in the same change.

~~RTL conventions — do not "fix" these, they are correct for manga: next page
lies to the *left*; the spine is on the *right*; swiping right / tapping the
left edge advances. Mirror of Western readers by design.~~

## 8.3 Spread registry (`data/spreads.ts`)

```ts
type SpreadDef = { slug: string; title: [telugu: string, latin: string];
  component: FC; chakra: { spin: number; scale: number; tint?: string };
  pattern?: "kikko" | "shippo" | "endpaper" };
export const SPREADS: SpreadDef[] = [ /* order = 03 §3.2 */ ];
```

`chakra` per spread solves the "chakra doesn't react" open item: on each
arrival, tween the canvas rig to that spread's spin/scale/tint (`base` 560ms).

## 8.4 The page-turn

**[REVISED 2026-07-30 — v3, and this one is built and accepted.] The turn is a
WebGL page-curl, and it is a PORT, not original code.**

Source of truth, fetch it rather than reconstructing it from memory:

```
https://raw.githubusercontent.com/scriptituk/xfade-easing/main/glsl/SimpleBookCurl.glsl
https://raw.githubusercontent.com/scriptituk/xfade-easing/main/glsl/SimplePageCurl.glsl   (companion)
```

**SimpleBookCurl** (Raymond Luckhurst, MIT) — the gl-transition adaptation of
Andrew Hung's curl. Take the *book* variant, not Hung's original: Hung's curls
one sheet across the whole screen and physically cannot cross a spine. Krishna's
standing instruction (2026-07-30) is that `lib/curlSource.ts` stays a
**line-for-line port**; every artefact so far came from hand-tuning it, never
from a gap in it.

**The model — ONE canvas across BOTH pages.** The first WebGL attempt confined
the curl canvas to the right page and the leaf simply vanished at the spine,
because it had nowhere to go. The shader is an A→B transition over the whole
open book:

- `from` = the current spread, both pages composited into one texture.
- `to`   = the next spread, both pages.
- At page P the book reads (P-1 | P); a forward turn goes to (P | P+1). It works
  because `from` already holds P on its right and `to` holds P on its left, so
  rolling `from`'s right page over the spine reproduces `to` exactly.
- The leaf's back face is reflected across the centre line (`* vec2(-1., 1.)`).
  **That reflection IS the spine** — it is the step that maps the rolled page
  onto the far half.
- A backward turn is the same curl **mirrored** (`uMirror`), never `progress`
  run in reverse — reversing folds at the spine and reads wrong. Mirror the
  coordinate *system*, not `dir.x`; see §8.9.

Uniforms and the reference defaults: `uAngle` 150° (target lift), `uRadius` 0.1
(curl tightness), `uShadow` 0.2 (contact-shadow **exponent**, not a strength),
`uRatio` = book width / height. Two phases inside one `progress` 0→1: the leaf
first rotates about the spine like a stiff board, then the radius eases to zero
to straighten it flat onto the far side. Splitting rotate from straighten is
what stops the end of a turn from blipping.

**The leaf carries real content, via a capture step.** This closes the question
§8.4 left open in 2026-07-21 — the answer was (a) rasterise.
`lib/captureSpread.ts` renders each spread offscreen with `html-to-image` and
caches by element + pixel size, so a spread is rasterised on resize and **never
per turn**. It blocks on `document.fonts.ready` first (capturing early bakes a
fallback glyph in permanently) and returns `null` on any failure, so a capture
bug degrades to plain paper instead of freezing navigation. `Grantha.tsx` keeps
the window P-2..P+1 warm — every page reachable in one turn is ready before the
turn asks.

**Division of labour in `PageCurl.tsx`:** UPLOAD only when a texture's identity
changes; DRAW on every `progress` change (cheap — new uniforms only). The `from`
/`to` canvases are memoised on page/dir, NOT progress, so nothing re-uploads
mid-curl. WebGL2 is preferred for non-power-of-two mipmaps, WebGL1 is the
fallback, and no context at all falls back to an instant page swap.

**Verification without a browser:** the fragment body ports to numpy in ~80
lines; rendering a progress sweep against a synthetic spread catches geometry
bugs in minutes (PROJECT-STATUS §4 item 34). This does not extend to capture,
GSAP or layout, which still need Windows.

### Superseded v2 — nested CSS strips (DELETED, do not revive)

**[REVISED 2026-07-21 — Krishna] The flat-rotateY "lite path" below FAILED the
eye test.** Verdict: "it feels like a slide deck". That is not a tuning
problem — it is what a flat `rotateY` *is*. A rigid rectangle pivoting about an
edge is a card flip; paper bulges away from the spine as it lifts, and the
bulge is most of what the eye reads as "page". Easing, shadow and duration
cannot fix a flat plane.

**~~What ships instead~~: nested strips.** CSS has no curved surfaces, so the curve
is approximated by 12 strips that are NESTED, not siblings — each is a child of
the previous and rotates a few degrees relative to its parent, so the rotations
compound into a smooth arc with no per-strip trigonometry. (Technique from
Fabrizio Bianchi's CSS bending page-flip.) Siblings fan; only nesting curves.

**The leaf carries no page content, deliberately.** A DOM node exists in one
place, so N strips need N clones of the spread — twelve copies of twenty panels
and their SVGs, built during the one animation that must not drop frames. The
alternative is rasterising the spread and slicing it by `background-position`
(what the reference does with a static JPG), which for live DOM means
`foreignObject` serialisation plus base64-inlining ~400KB of vendored fonts,
per turn. So the leaf is the SHEET — aged paper, grain, a fore-edge, shading
that moves with the bend — and the page you were reading stays flat underneath
until the sheet covers it. That is also the more honest reading of the gesture:
turning a page, you lift a sheet and see its mostly-blank back.

If content on the leaf is ever wanted, the capture pipeline is the route, and
it is separate work — not a tweak to `TurnLeaf.tsx`.

The r3f bent-plane escalation named below does NOT solve this on its own: it
needs the page as a texture, so it has the same capture problem.

### Superseded first attempt (kept for the reasoning)

Structure during a turn (in `TurnLeaf.tsx`, portal-ed over everything):

```html
<div class="turn-scene">        <!-- perspective:1400px; perspective-origin: 100% 50% (the spine, right edge) -->
  <div class="leaf">            <!-- transform-origin: right center -->
    <div class="leaf-front">…outgoing spread clone…</div>
    <div class="leaf-back">…incoming spread clone, transform: scaleX(-1)…</div>
    <div class="leaf-crease"></div>   <!-- vertical gradient strip at the fold -->
  </div>
  <div class="floor-shadow"></div>    <!-- on the page beneath -->
</div>
```

Timeline (`long` 900ms, `ink` ease), advancing (leaf sweeps rightward over the
spine):

```ts
tl.set(".turn-scene", { autoAlpha: 1 })
  .fromTo(".leaf", { rotationY: 0 }, { rotationY: 180, duration: .9, ease: "ink" })
  .to(".floor-shadow", { opacity: .35, duration: .45, yoyo: true, repeat: 1 }, 0)
  .to(".leaf-crease", { opacity: .5, duration: .45, yoyo: true, repeat: 1 }, 0)
  // petal burst at apex (§02.2): fire a one-shot at tl.time ≈ .45
  .call(swapUnderlyingSpread, [], .45)   // real DOM swap hidden under the leaf
```

Non-negotiables learned the hard way:
- `backface-visibility: hidden` on BOTH faces; back face pre-mirrored with
  `scaleX(-1)` so its content reads correctly when the leaf passes 90°.
- Both faces are **clones** (static snapshots of the spreads) — never animate
  the live spread; swap the live DOM at the covered midpoint (`.call` above).
- Faint show-through: `.leaf-front { }` gets a low-opacity mirrored copy of
  the back content via a masked overlay at 0.06 opacity — reads as thin paper.
- Animate ONLY transform/opacity; `will-change: transform` applied at turn
  start and **removed** on complete (permanent will-change kills scrolling perf).
- Momentum flicks: Observer velocity > threshold queues a second turn at
  `base` speed with the petal burst suppressed (once per gesture, not per page).
- Torn-paper edge: the leaf's left edge carries a `mask-image` torn-edge PNG.

The **cut** (chapter jump): white flash (1 frame full-screen div), a single
diagonal black slash SVG DrawSVG-draws in 120ms, spread swaps behind it,
slash + flash fade 240ms. Total ≤ 480ms.

## 8.5 `inkDraw` — the one stroke-draw utility (Phase 1; everything uses it)

```ts
// components/ink/inkDraw.ts
export function inkDraw(root: SVGElement, opts?: {
  order?: "document" | "data-stroke";   // Telugu title uses data-stroke groups
  duration?: number; stagger?: number;  // per-path
  brush?: 1|2|3|4|5|6;                  // which brush mask
}): gsap.core.Timeline
```

Implementation notes:
- Each path animated with DrawSVG `from "0% 0%"` to `"0% 100%"`.

**[REVISED 2026-07-20 — two changes, both learned by building it]**

1. **Two draw modes, not one.** Direct stroke-dashoffset (as written above) is
   correct only for *uniform line art* — mon outlines, panel borders. It is
   wrong for anything with brush taper: a stroked path has exactly ONE width,
   so stroking a tapered silhouette destroys the taper that makes it a brush
   mark, and what animates is its **outline being traced** — a thin line
   running round the shape's border and back, which reads as "outlining a
   shape", never as "laying down ink". Verified on the ensō; it looked wrong
   immediately.
   So tapered forms use a **reveal mask**: artwork stays FILLED, and the
   *centreline* (the path the brush travelled) is stroked white inside an SVG
   `<mask>` at ≥ the silhouette's max width, with `stroke-linecap="round"` so
   the reveal edge is a brush tip. DrawSVG animates that hidden stroke.
   `inkDraw` picks the mode by looking for `data-ink-reveal`; reveal wins when
   present. The Telugu title will need this too — its aksharas are tapered.
2. **Brush texture is a CSS `mask-image` on the root, not an SVG `<mask>`.**
   An SVG mask requires wrapping the strokes in `<g mask="url(#…)">`, i.e.
   moving DOM children React rendered, which fights reconciliation on every
   re-render. CSS masking needs no DOM surgery. Consequence: the brush PNGs
   carry their texture in the **alpha** channel (CSS masking defaults to
   `mask-mode: alpha`); a greyscale PNG is a silent no-op there.
   Assets live in `public/brushes/`, not `ink/brushes/` — an SVG/CSS mask
   needs a servable URL. Generator: `portfolio/scripts/make-brushes.py`.
   Known compromise: one fixed mask orientation vs strokes travelling every
   direction, so cross-grain strokes get banding rather than parallel
   streaks. Reads as ink-density variation; the real fix is per-path masks.
- Stroke ends get a bleed bloom: tiny radial `feTurbulence`+`feDisplacementMap`
  filtered circle faded in at each path's end point (skip on mobile).
- `ease.ts`: `CustomEase.create("ink", "M0,0 C0.7,0 0.2,1 1,1")` — registered
  once, imported for side effect. This IS the house curve from
  MOTION-CHOREOGRAPHY tokens.
- Coordinates rounded via the existing `n3()` helper (hydration gotcha,
  PROJECT-STATUS §4).
- Telugu title asset: trace కృష్ణ సాయి into per-akshara `<g data-stroke="n">`
  groups in authentic writing order (left→right, each akshara's strokes
  top-to-bottom); the tracing itself is a Phase 1 art task.

## 8.6 MangaScript schema (`data/mangaScripts.ts`) — the project-manga data

```ts
type Shot = "establishing" | "action" | "closeup" | "insert" | "splash";
type Panel = {
  shot: Shot;
  size: "hero" | "wide" | "half" | "third";   // grid weight
  bleed?: boolean;        // tachikiri — full-bleed, no border
  diagonal?: boolean;     // slanted gutters (action/menace)
  art?: string;           // key into public/art/, optional (panels can be type-only)
  caption?: string;       // narrator box, ≤ 18 words
  dialogue?: { speaker: string; text: string };
  sfx?: string;           // display lettering: "PRUNE!!", "65% → 85.7%"
  tone?: "screentone" | "speedlines" | "none";
};
type BookPage = { panels: Panel[]; gutter?: "tight" | "normal" | "wide" };
type MangaScript = { projectId: string;    // must match projects.ts id
  pages: BookPage[] };                     // 4–6 pages, structure per 09
```

`BookPage.tsx` renders panels in **RTL reading order** (first panel in the
array = top-RIGHT). CSS grid with `direction: rtl` on the page container and
`direction: ltr` restored inside each panel's content — this two-line trick
gives correct koma flow without manual placement math.

`MangaBook.tsx`: open = the clicked panel FLIP-plugin-morphs (GSAP Flip) from
its spread position to center-stage, then spine-hinge opens (rotateY on a
cover div, 700ms `ink`); inner turns reuse the curl — `PageCurl` + the same
capture pipeline, at `base` 560ms (**[REVISED 2026-07-30]**: was `TurnLeaf`,
which no longer exists; note a project book's pages need capturing too); close
= reverse; scroll position/spread state untouched underneath. Escape, page-
edge zones and swipe all work inside. Books with no script yet fall back to
the current panel layout (feat text + astras) — ship incrementally.

## 8.7 Rendering, a11y, performance rules

- Current spread ±1 rendered (`visibility:hidden` for neighbours, real DOM —
  keeps SEO/a11y and makes clones cheap); others `display:none`.
- Reduced motion (`prefers-reduced-motion` OR a manual toggle in the noren):
  crossfade 200ms replaces every turn/cut/draw; content identical.
- `aria-live="polite"` on the page counter; spreads are `<section aria-label>`;
  book is `role="dialog"` with focus trap; ALL interactions keyboard-reachable.
- 60fps rule: transforms/opacity only; petals instanced in the existing r3f
  layer, capped 48 (angular rule pun intended), pooled and reused.
- Test after every edit: `npx tsc --noEmit` (sandbox can't `next build` —
  Windows-side build per Phase 0).

## 8.8 Acceptance criteria (per roadmap phase)

- **P1**: `inkDraw` draws an ensō and the Telugu title with visible brush
  texture at 60fps; `ink` ease registered once; hanko component renders with
  stamp-grain imperfection at 48px and 480px.
- **P2**: every project panel shows its mon; mon stroke-draw on hover ≤ 600ms;
  all mon read at 48px.
- **P3**: full volume traversable by wheel, swipe, keys, edge-clicks, noren,
  URL, and browser back/forward; phase guard prevents double-turns; reduced-
  motion path verified; mobile 375px wide verified; landing plays and is
  skippable by any input.
- **P4**: gate/petals/noren/cut all present; petals ONLY at flip apex; chakra
  visibly reacts per spread.
- **P5**: ≥4 flagship books openable, flippable, closable with state
  preserved; unscripted projects fall back gracefully.
- **P6**: omake reachable, style dissolve works, all three pages populated.
- **P7**: Lighthouse ≥90 perf/a11y; deployed; OG image = hanko lockup.

## 8.9 Known traps (inherited + new — read before coding)

All of PROJECT-STATUS §4 applies (n3 rounding, scrim layers, panel opacity
~97%, no per-element jitter). New ones: don't leave `will-change` on; don't
animate live spreads (clone them); don't invert the RTL input mapping; don't
give the leaf `overflow:hidden` ancestors (clips the 3D sweep); `direction:
rtl` grid trick needs `ltr` restored inside panels or Telugu+Latin text
mis-aligns.

**[ADDED 2026-07-30] The three curl traps.** Full write-ups in PROJECT-STATUS §4
items 30–33; the short forms, because each one produced an artefact Krishna
reported:

1. **Never clamp `asin(dist / rad)`.** Past the cylinder `dist > rad`, so asin
   returns NaN, the in-bounds tests fail (comparisons against NaN are false), and
   the fragment correctly falls through to "show B". **The NaN is the
   off-the-cylinder test.** Clamping pins `phi` to PI/2 across half the book,
   where every pixel then samples ONE vertical column of the destination texture
   — a page-sized rectangle of horizontal streaks. Mipmaps and anisotropy cannot
   help; nothing is aliasing. Guard the branch with `dist <= rad` instead.
2. **Never shade the leaf to hide a sampling bug.** A `paper` blend + cosine
   `lit` term added to mask trap 1 washed half the book to a translucent grey
   frame. And in a *book* the leaf's back face genuinely IS the next page, so it
   must show `to` unshaded — SimplePageCurl's `opacity`/`greyback` whitening
   exists for the single-sheet case and breaks the book model.
3. **Mirror the coordinate system, not `dir.x`.** `q` (the hinge corner) derives
   from the sign of `dir`, so flipping the component moves which corner the leaf
   hinges from and leaves the back-face reflection pointing the wrong way.
4. **Never rebuild a GSAP Observer on state change.** Binding it to `useCallback`s
   over `page` makes the effect kill and recreate it mid-gesture with
   `preventDefault` active, swallowing the wheel events that arrive during
   teardown — it reads as scrolling that skips or sticks. Create once, route
   handlers through a ref.
