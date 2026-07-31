# PROJECT STATUS

**Velidanda Krishna Sai — portfolio.** A manga volume you **turn**, themed on
Telugu/Hindu iconography and Japanese traditional design. (It was a scrolling
document until 2026-07-30; scroll input now turns pages instead.)

Last updated: 2026-07-30 (Phases 1–2 done. **The book is `/`**, the scroll site is
deleted, the v1 launch cut is done, and **PHASE 4 IS BUILT** — gate, sakura, cut,
noren, kikkō + shippō, endpapers. The volume is 8 pages. Remaining to launch:
favicon, OG image, Windows build, a11y + perf pass, deploy. Nothing in Phase 4 has
been seen in a browser.)

> **[2026-07-20] `masterplan/` is now the canonical design brain.** Start at
> `masterplan/README.md`. It supersedes the navigation model here (scroll →
> page-turn volume) and adds the Japanese layer, per-project mon, the new
> landing sequence, and the omake personal section. This file remains the
> record of *what is built*; the masterplan holds *intent*.
Supersedes `CHAKRA-STATUS.md` (deleted — it had accreted layers and was
misnamed once the work grew past the chakra).

---

## 1. Where things are

```
PORTFOLIO/
  portfolio/            <- THE SITE. npm run dev here.
  Resume/               <- LaTeX source (main.tex) + old PDF render
  dev_proj/             <- your hackathon/product repos  (source material)
  research_proj/        <- your research repos           (source material)
  incoming-art/         <- 13 raw JPGs, unused so far
  mockups/              <- 4 early HTML mockups, historical only
  *.md                  <- design briefs + this status
```

`portfolio-site/` and `field-concepts/` no longer exist: the first was
superseded, the second was renamed to `portfolio/`.

### Inside `portfolio/`

```
app/
  page.tsx              / — the book, landing first
  [slug]/page.tsx       one static page per spread (/about, /ramayanam, ...)
  grantha|ink|landing/  workbench routes, all noindex
  layout.tsx            metadata
  globals.css           the whole design system
components/
  crystal/
    ChakraSculpt.tsx    THE CHAKRA
    Crystal.tsx         lighting rig + chakra placement
    InkGlass.tsx        Form D — built, intentionally NOT rendered
  fields/
    Brahmanda.tsx       background wrapper
    KolamField.tsx      kolam + screentone shader plane
  ornament/
    Patterns.tsx        asanoha / seigaiha / sayagata / kolam / screentone
    Frame.tsx           the panel frame — DARK by default; a koma inverts it (§4 42)
    Motifs.tsx          torana, conch, bow, hanko, rosette
  grantha/              the volume: BookStage, Grantha, CurlVolume, PageCurl
  book/                 a project's own book: MangaBook, BookPage
  spreads/              Spreads.tsx (the pages) + EpicIndex.tsx (an arc's index)
  ink/                  inkDraw, ease, Enso, VelidandaSeal, TeluguTitle, Landing…
data/
  profile.ts            identity, nav, art paths
  projects.ts           all projects, both epics
  spreads.ts            the volume's page list
  mangaScripts.ts       compiled manga scripts (DALSP, HFT SIM)
lib/
  palette.ts            single source of colour
  curlSource.ts         the page-curl GLSL
  captureSpread.ts      spread -> texture, cached
  teluguNum.ts          Telugu numerals
public/art/             4 WebP illustrations (unused so far)
```

`components/foreground/` is GONE — that was the scroll site.

---

## 2. Locked decisions

| Decision | Value |
|---|---|
| Colour themes | **One only.** No day/night/cosmic, no easter-egg hour. |
| Palette | Gold + saffron + kumkum. `lib/palette.ts` only. |
| Background | Kolam lattice + manga screentone, flat, far back, low contrast. |
| Chakra angular base | **24.** Every ring count is 12 / 24 / 48. Nothing else. |
| Chakra radial layout | Derived from the `BANDS` table. Never hand-type a radius twice. |
| Composition | Chakra anchored right, bleeding off-edge; type in the left column. |
| Scroll | Chakra persists (fixed canvas); content scrolls over it. |
| Centre motif | **Ashtadala** (8-petal lotus). Not the shatkona — see §5. |
| Layout unit | The manga panel, everywhere. |
| Language | Telugu **always** paired with English, never standalone. |
| Spine | Ramayanam = research · Mahabharatam = dev/hackathons. |

---

## 3. Done

**Chakra** — 24-fold symmetry, pierced jali openwork (real holes), fire nimbus
of 24 curling tongues + 24 short, four cardinal accents, 12 spokes with rubies
and vajra tips, 24-petal lotus collar, ashtadala centre with bindu, recessed
backing plate with lathe grooves, antique palette spread.

**Background** — one flat plane at z=-9: sikku kolam loops on a pulli grid with
halftone and speed-line hatch over it, faded out at centre so it never crowds
the chakra.

**Ornament library** — every element built from real geometry, per
`ELEMENT-CRAFT-SPEC.md`. Details and construction notes in §4.

**Site** — cover, about, epic fork, Ramayanam, Mahabharatam, astras, contact.
Real content throughout. Irregular manga grid. Scroll reveal, nav tracking,
parva counter. Verified section by section in the browser.

**Form D** — ink-glass lens + కృ seal. Built and working; deliberately not
rendered. Uncomment the import and `<InkGlass />` in `Crystal.tsx` to restore.

**The ink language (Phase 1, 2026-07-20)** — `components/ink/`:
`ease.ts` (ink/soft/brush CustomEases + duration tokens), `inkDraw.ts` (the
one stroke-draw utility), `Enso.tsx` (4 generated hands), `VelidandaSeal.tsx`
(వెలిదండ from real HarfBuzz-shaped glyph outlines; లి carries a carved relief
slot at the ి/ల junction — see §4 item 16). 6 brush masks in
`public/brushes/`, regenerable via `scripts/make-brushes.py`. Test bench at
`/ink` — **workshop route, noindex or delete before launch.**

**Phase 1 complete (2026-07-21).** Added `TeluguTitle.tsx` + generated
`titleGlyphs.ts` (కృష్ణ సాయి: 4 aksharas, 6 strokes, silhouette + measured
centreline, from `scripts/build-title.py`) and `LandingSequence.tsx` (§03.1
beats 0.0–3.0, skippable, reduced-motion parity). `/landing` is the isolated
exit-test route with a scrub slider; `/ink` now also draws the title.
`inkDraw` gained one fix — reveal paths are hidden until their own tween
starts, see §4 item 19. Production build clean, 4 static routes.

**Phase 2 in progress (2026-07-21).** `components/ornament/Mon.tsx` — all 20
crests from 04 §4.2, one shared kit (single maru, one ink weight set on the
`<svg>` and inherited, 12/24/48 enforced by the helper signatures). Wired into
every project panel in the hanko position with hover stroke-draw (`MonMark` in
`Site.tsx`, `.p-mon` in globals.css). Mon drafts reviewed by Krishna
2026-07-21 — **accepted as-is**, no redraws wanted for now.

**Phase 4 — the Japanese layer, BUILT 2026-07-30.** Every element researched from
its real form first (sources in masterplan 06 §6.2, cited in each file's header):

```
components/ornament/Gate.tsx     the fused torii ∘ torana. Full myōjin torii —
                                 hashira with the uchikorobi lean, kasagi with
                                 sorimashi, shimaki, protruding nuki, kusabi,
                                 gakuzuka, nemaki — carrying the torana garland as
                                 its nuki. It IS the fork page's two choices, and
                                 each epic's name sits on the gakuzuka tablet
components/ornament/Sakura.tsx   12 five-petal blossoms with a real notched tip,
                                 rocking about their long axis. Fires ONCE per turn
                                 at eased progress 0.42 and never idles
components/ornament/Cut.tsx      the iaijutsu cut for chapter jumps: flash, one
                                 kesagiri slash, swap under the blade, resheath
components/ornament/Noren.tsx    the menu, and the phone's only navigation
components/spreads/Pages.tsx     += EndpaperSpread, where kolam and asanoha meet
```

Two things worth knowing. The torii's authentic COLOUR rule — vermilion, with black
allowed only on the kasagi and the nemaki — fit the locked palette exactly, with
nothing bent; that is usually the sign a rhyme is real rather than decorative. And
the sakura's scarcity is load-bearing: falling petals mean *this moment passed*, so
an ambient drift would not be a bonus, it would delete the meaning.

**Phase 3 = THE BOOK IS `/` (2026-07-24, curl fixed and route moved
2026-07-30).** This is the third and accepted page-turn, and it is now the site.
`/volume`, `lib/store.ts` (Zustand), `components/volume/` and — as of the move —
`components/foreground/{Site,Reveal}.tsx` are all **DELETED**. Do not resurrect
any of them. What ships:

```
app/page.tsx                      / — the book, opened at the cover, landing first
app/[slug]/page.tsx               /about, /ramayanam, ... one static page per
                                  spread. generateStaticParams; unknown slug 404s
app/grantha/page.tsx              the workbench: same book, no landing, no URL
                                  writing. noindex
app/ink/layout.tsx                noindex for /ink  (page is "use client", so the
app/landing/layout.tsx            noindex for /landing  directive must live in a
                                  server layout or Next silently drops it)
components/grantha/BookStage.tsx  canvas rig + book + landing veil. Shared by all
                                  three book routes so they cannot drift apart
components/grantha/Grantha.tsx    the book: state, URLs, input, slots, capture
components/grantha/PageCurl.tsx   the WebGL surface (upload / draw split)
lib/curlSource.ts                 the GLSL
lib/captureSpread.ts              html-to-image rasterisation + cache
components/grantha/CurlVolume.tsx the SHARED body of every book: measurement,
                                  capture window, compositing, the tween, the
                                  phase guard, the live-DOM slots, the curl canvas
components/book/MangaBook.tsx     a project's own book — the modal shell
components/book/BookPage.tsx      one book page: koma grid, or a cover lockup
components/spreads/EpicIndex.tsx  an epic page as its chapter index (the koma pilot)
data/mangaScripts.ts              the compiled manga scripts (DALSP, HFT SIM)
components/spreads/Spreads.tsx    the spread markup — now only the book renders it
data/spreads.ts                   7 spreads: cover, about, fork, ramayanam,
                                  mahabharatam, astras, contact
```

**The visible spread is LIVE DOM, not an image.** This was the one real
prerequisite for the move and it is done. The curl can only deform a texture, so
the book used to show a rasterised screenshot at all times and park the real
markup off-viewport under `aria-hidden` — survivable only while the scroll site
was the readable copy. Now every spread is mounted once inside `.book-pages`, two
of them slotted onto the open pages (`data-slot="l"|"r"`, the rest `"off"` at
left:-99999px but still laid out so they stay capturable), and the curl canvas is
revealed only while a leaf is in flight. Off-slot pages get `inert` +
`aria-hidden` so a reader cannot Tab into a link on a closed page.

**Deep links work again.** `history.pushState` on every settled page change (one
effect owns the write, so a page and its URL cannot disagree), `popstate` adopts
the page, and the top-bar nav is real `<a href>` — which also means `/about` and
friends are reachable by a crawler instead of being orphan pages.

The shader is **SimpleBookCurl by Raymond Luckhurst** (MIT), the gl-transition
adaptation of Andrew Hung's curl — *not* Hung's original, which curls one sheet
across the whole screen and cannot cross a spine. Canonical source, fetch it
rather than remembering it:
`https://raw.githubusercontent.com/scriptituk/xfade-easing/main/glsl/SimpleBookCurl.glsl`
(companion `SimplePageCurl.glsl` alongside it). `lib/curlSource.ts` is a
line-for-line port and **should stay one** — see §4 items 30–31 for what happened
both times it was hand-tuned.

The model: ONE canvas across BOTH pages, running an A→B transition. `from` is the
current spread with both pages composited into a single texture, `to` is the next
spread with both. At page P the book reads (P-1 | P); a forward turn to (P | P+1)
works because `from` already holds P on its right and `to` holds P on its left,
so rolling `from`'s right page over the spine reproduces `to` exactly. A backward
turn is the same curl **mirrored** (a `uMirror` uniform), never progress run in
reverse. Real spread content rides the leaf because the spreads are rasterised
offscreen to textures with `html-to-image`.

Dead ends, both rejected by Krishna on sight — **never revisit**: v1 a single
flat `rotateY` ("feels like a slide deck"), v2 twelve nested CSS strips ("no
good"), which bent correctly and still failed because a contentless leaf cannot
read as a page (§4 item 27). That was the whole reason for going to a texture.

**`npm install` needed on Windows — dep `html-to-image`.** `zustand` is still in
package.json but nothing imports it any more; safe to drop.

---

## 4. Construction notes worth keeping

These are the bits that are easy to get subtly wrong.

- **Asanoha** — a hexagon split into six triangles by its three long diagonals,
  then a three-armed star from each triangle's corners to its **centroid**. The
  centroid star *is* the hemp leaf. Drawing only the diagonals gives a plain hex
  lattice, which is the usual mistake.
- **Conch** — a **logarithmic** spiral (r = a·e^bθ), the curve a shell actually
  grows on, wound **clockwise**: the sacred conch is *dakṣiṇāvarti*. Wrong
  handedness inverts the meaning.
- **Torana** — a true **catenary** (cosh), not a parabola. Highest at the ends,
  dipping in the middle, and SVG y grows downward.
- **Bow** — a **recurve**; limbs bend back near the tips. That's what
  distinguishes Rama's bow from a plain arc.
- **Panel frame** — the rules stretch, the **corner ornaments never do**. They
  are fixed-size SVGs pinned to each corner. Stretching one frame SVG across a
  panel smears the ornament.
- **Flames** — the prabha-mandala is a continuous nimbus of rays, so every
  tongue shares the same lean and the ring reads as rotating. A 4-fold accent on
  a 24-fold ring reads as intent; **per-element hash jitter reads as
  sloppiness** — that was removed and must not come back.

### Gotchas that cost time

1. **Round every generated SVG coordinate.** Raw floats serialise differently on
   server and client at the last decimal and throw a React hydration mismatch on
   every procedural shape. Use the `n3()` helper.
2. **Don't put the scrim on a `::before` of `.doc`.** `.doc` carries a z-index,
   so a `z-index:-1` pseudo-element stays trapped in that layer and paints over
   the canvas — the chakra vanishes. Three explicit sibling layers instead:
   `.wrap` (0) → `.scrim` (1) → `.doc` (2).
3. **A sphere flattened on Z is not a lens.** Near-perpendicular rim curvature
   drives total internal reflection and the glass goes mirror-like. Flat disc.
4. **Ink-density tint extinguishes the subject.** "Ink-glass" means *suggesting*
   ink, not using it.
5. **Panels must be near-opaque** (~97%). A manga panel is ink on paper; at 80%
   copy became unreadable wherever it crossed the chakra.
6. The Linux sandbox cannot build *against the checked-in `node_modules`* —
   that tree holds Windows binaries. It builds fine from a **fresh install in
   a copy outside the repo** (`tar` the source to `/tmp`, `npm install`,
   `npx next build`). Never run `npm install` against `portfolio/node_modules`
   from Linux; it will replace the Windows binaries and break `npm run dev`.

### [2026-07-20] Phase 0 gotchas — all cost real time

7. **Never write an explicit `<head>` in the App Router root layout.** Adding
   one (for font preloads) breaks hydration, and it fails *silently*: no
   console error, no error overlay, server HTML paints correctly. The only
   symptom was the chakra disappearing — react-three-fiber sizes its canvas
   from a mount effect, so with effects never running the canvas sat at its
   default 300×150 and drew nothing. Diagnose this class of bug by checking
   `document.querySelector('canvas').width`: 300 means "never hydrated", not
   "WebGL problem". React 19 hoists `<link rel="preload">` from anywhere in
   the tree, so the wrapper is unnecessary anyway.
8. **`viewport` and `size` from `useThree()` are not interchangeable.**
   `viewport` is three.js world units (a function of aspect ratio), `size` is
   CSS pixels. The mobile breakpoint must use `size` to match the media query;
   object placement must use `viewport` because it happens in world space.
   The old code tested `viewport.width < 7.4`, which really meant
   `aspect < 1.32` — a short landscape window went full-width in CSS while the
   chakra stayed anchored right, and they collided.
9. **A fixed topbar with no background needs one on mobile.** On desktop it
   floats over the dark left edge of the scrim; on a phone the content column
   runs full width and headings passed under the name mark. A short gradient,
   not a solid bar — a solid bar reads as UI chrome and breaks the paper.
10. **Decorative SVGs must be capped at `max-width: 100%`.** Torana is authored
    at 420px against a 375px viewport and silently widened the whole document.
    `max-width` only — adding `height: auto` would override the explicit
    `height` attribute on the square motifs and fight `.panel-wash`.
11. Testing a responsive layout in a **nested iframe validates CSS but not JS**:
    the Next dev server does not hydrate inside one, so anything driven by an
    effect (chakra placement, `.rv` reveals) reads as broken when it isn't.

### [2026-07-20] Phase 1 gotchas

12. **A backgrounded tab gets no `requestAnimationFrame`**, so GSAP's ticker
    never advances and every timeline reads as frozen a few percent in —
    indistinguishable from a broken tween, and it survives reloads, which
    makes it very convincing. Check `document.visibilityState` BEFORE
    debugging any animation. Scrub with `tl.progress(x)` instead; screenshots
    work fine on a hidden tab. `/ink` exposes `window.__inkAll` for this.
13. **Taper and DrawSVG are incompatible.** A stroked path has exactly one
    width, so you cannot stroke-draw a tapered brush form without destroying
    the taper — and what animates is the *outline being traced*, which reads
    as outlining a shape, not as laying down ink. Tapered forms use the
    reveal-mask technique instead (08 §8.5 [REVISED]).
14. **CSS `mask-image` defaults to `mask-mode: alpha`.** A greyscale PNG mask
    is therefore a silent no-op — fully opaque, no error, no texture. Bake the
    mask into the alpha channel (`scripts/make-brushes.py` does).
15. **SVG filters default to `linearRGB`**, which visibly darkens a light
    fill. The bleed bloom rendered as a dark chevron on the stroke until
    `color-interpolation-filters="sRGB"` was set. Also: displacement noise
    must have a wavelength well under the radius of what it disturbs, or it
    tears the shape into a polygon instead of softening it.
16. **A bold Telugu akshara can fuse into a blob.** `livoweltelu` (లి) is a
    SINGLE closed contour — the ి sign and the ల are not separate glyphs, so
    the gunintam cannot be nudged or re-offset; there is nothing to move. At
    700 weight the loop's underside runs into the consonant's shoulder and the
    akshara stops parsing. Interior cut, so the cluster bbox and the 3.77:1
    viewBox are unchanged. Check every new akshara against వె, which has a real
    gap between ె and వ and is the reference for how much separation reads.
    **Model it as a stroke CROSSING, not as a gap to add** — this took three
    tries and the first two were rejected for the same reason. (a) A
    hand-placed straight slot: wrong orientation, unfixably, because the
    boundary between two strokes is a curve. (b) A cut following ల's shoulder,
    i.e. the UNDER stroke's edge: right that it was a curve, wrong curve — it
    makes ల look nicked. (c) Correct: the ి is a ring laid over ల, so keep the
    ring whole and let ల break where it crosses. The break is then the OVER
    stroke's own edge, and nothing is added.
    **Measure the over stroke.** Least-squares circle fit to the outer
    silhouette's free arc (`CROSSINGS` in `scripts/build-seal.py`) recovers
    centre ≈(366, 562) r ≈155 at 2.5 units mean residual, so continuing it
    through ల is reconstruction. The build aborts if the residual exceeds 6.
    Two traps: `livoweltelu` is a single SELF-INTERSECTING contour, so call
    `Path.simplify()` before taking `contours[0]` as the silhouette; and
    `Path.stroke()` emits conics — `convertConicsToQuads()` or the SVG pen
    throws `UnsupportedVerbError`.
17. **Rebuilding the seal needs a TTF the repo doesn't ship.** `build-seal.py`
    wants `/tmp/telugu700.ttf`. Get it from the vendored subset without any
    download: `TTFont('public/fonts/noto-sans-telugu-telugu-700-normal.woff2')`,
    set `flavor=None`, save as `.ttf` (needs `brotli`). The subset carries all
    four clusters. Also needs `uharfbuzz`, `fonttools`, `skia-pathops`.
18. **Telugu needs a real shaper.** వెలిదండ is 7 codepoints → 4 clusters, with
    vowel-sign ligatures and an anusvara. `<text>` + webfont works visually but
    can't be stroke-drawn or laid out per-akshara; HarfBuzz + fontTools with
    baked transforms gives outlines and removes the paint-time font dependency.

### [2026-07-21] Phase 1 completion gotchas

19. **A round-capped reveal path paints a DOT at zero length.** The reveal
    centreline must be round-capped (the reveal edge is a brush tip), but a
    round cap on a zero-length dash still renders a full dot — so with a
    stagger, every stroke that has not started yet sits there as a blob at its
    own start point, and the whole word appears as a row of dots before the
    brush arrives. `inkDraw` now hides reveal targets (`opacity: 0`) until each
    one's tween begins. They live inside a `<mask>`, so opacity 0 means
    "contributes nothing" — no DOM surgery. Only affects reveal mode;
    direct-mode strokes are butt-capped and paint nothing at zero length.
20. **The landing stagger is NOT the house STAGGER token.** `STAGGER` (0.07) is
    for siblings appearing together. Six consecutive strokes of one hand at
    0.07 overlap into a scribble; the landing uses 0.22 with 0.5s strokes to
    fill §03.1's ~1.6s write. If the writing ever reads as "several brushes at
    once", this is the number.
21. **Skeletonisation needs spur pruning or the brush twitches.** The medial
    axis grows a whisker into every convex corner. They are raster artefacts,
    not strokes, and the Euler walk faithfully draws each one as a little
    out-and-back flick. Prune anything shorter than the local stroke width.
23. **A flat `rotateY` is a card flip, not a page-turn — this is definitional.**
    A rigid rectangle pivoting about an edge cannot read as paper, because
    paper bulges away from the spine as it lifts and the bulge is most of what
    the eye identifies as "page". No easing, shadow or duration fixes it; v1
    was rejected on sight. The fix is a real bend: **nested** strips, each a
    child of the previous rotating a few degrees relative to its parent, so the
    rotations compound into an arc. Sibling strips fan out; only nesting
    curves. Below ~8 strips the arc visibly facets at full-screen size.
24. **The bending leaf cannot carry page content without a capture step.** A
    DOM node exists in exactly one place, so N strips need N clones of the
    spread — at 12 strips that is twelve copies of twenty panels and their SVGs
    built during the one animation that must not drop frames. Slicing an image
    by `background-position` (what every reference does) needs the live DOM
    rasterised: `foreignObject` plus base64-inlining ~400KB of vendored fonts,
    per turn. Note the r3f bent-plane escalation named in 08 §8.4 does NOT
    dodge this — a textured plane needs the same capture. So the leaf is the
    SHEET and the page stays flat underneath until covered.
25. **Nested strips must have an ABSOLUTE width.** `width: 8.3333%` resolves
    against the parent, and the strips are nested, so the widths compounded:
    strip 1 was W/12, strip 2 W/144, strip 3 W/1728. On screen that was a
    single narrow band at the left plus eleven invisible slivers — Krishna
    described it as "a random white thing appears at the side and vanishes".
    `--strip` is now set by `TurnLeaf` from its own `STRIPS` constant, in `vw`.
26. **Perspective has to be sized against the SHEET, not picked by feel.** At
    `perspective: 1600px` with a 1699px-wide sheet, the far strips are close to
    the camera plane and magnify enormously: the projected sheet measured
    4629×3855 on a 1699×975 viewport. 3200px keeps it in frame; past ~8000px
    the projection is flat and the bend stops reading. Measured, not guessed.
27. **A contentless leaf cannot read as a page, no matter how well it bends.**
    This is the one that matters. With the width bug fixed, a correct 12-strip
    bend just paints the viewport cream — at 22% progress the free edge
    measured x=1938 on a 1699px viewport, i.e. the sheet covers the whole
    screen for most of the turn. There is nothing ON the surface for the eye to
    track, so the curvature is invisible and the turn reads as "the screen goes
    blank, then comes back". **The leaf has to carry the page.** See §6 — this
    is an open design fork, not a bug to tune.
28. **[MOOT 2026-07-30 — kept for the lesson]** `/volume` is deleted and
    `/grantha` writes no history at all, so nothing 404s. The lesson stands for
    when deep links come back: routes and pushed URLs must be the same list.
    **The volume's own URLs 404 on reload.** `pushHistory` writes `/about`,
    `/fork` etc., but the only routes are `/`, `/ink`, `/landing`, `/volume`.
    Inside the SPA this is fine; reload or share the link and it is a 404.
    Needs a catch-all route before the volume replaces `/`.
29. **The sandbox has no browser.** No chromium, and `playwright install`
    cannot fetch one (sudo is blocked, downloads fail). Static SVG rasterising
    via cairosvg works and is how the title's reveal coverage was checked, but
    anything involving GSAP, hydration or layout has to be eyeballed on
    Windows. Do not claim a motion beat is verified from this sandbox.

### [2026-07-30] Grantha page-curl gotchas — the v3 fix

30. **NEVER clamp `asin(dist / rad)` in the curl shader. The NaN is
    load-bearing.** This is the single most expensive line in the project — it
    cost two sessions and produced both artefacts Krishna reported ("streaky",
    "a grey frame"). Upstream reads `phi = asin(dist / rad)` with no clamp
    because a fragment *past* the cylinder has `dist > rad`, so the quotient
    exceeds 1, asin returns NaN, and both the `p2` and `p1` in-bounds tests fail
    — every comparison against NaN is false. That fall-through is precisely how a
    fragment is classified "not on the leaf, show B". The NaN **is** the
    off-the-cylinder test. Adding `clamp(..., -1., 1.)` looks like obvious
    hardening and instead pins `phi` to PI/2 across that entire half of the book,
    where `p2` collapses to a constant x — so every pixel on half the surface
    samples **one vertical column** of the destination texture, smeared sideways.
    That is a page-sized rectangle of horizontal streaks, and it is why mipmaps
    and anisotropic filtering did nothing: nothing was aliasing, the sampling was
    just wrong over a huge area. The fix is an explicit `dist <= rad` region
    guard on the branch — well defined, no NaN reliance, exactly equivalent.
31. **Don't shade the leaf to hide a sampling bug.** The first attempt at the
    streaks blended the leaf toward a paper colour by a `graze` term and
    multiplied by a cosine `lit` term. Over a correct thin cylinder that would
    have been invisible; over the item-30 slab it washed half the book to
    `paper * 0.45`, which is the translucent **grey frame**. Two lessons. One: a
    shading term that changes the reading of a large area is evidence the
    geometry is wrong, not a finish. Two: in a BOOK the back face of the turning
    leaf genuinely *is* the next page, so it must show `to`'s content unshaded —
    SimplePageCurl's `opacity`/`greyback` whitening exists for the single-sheet
    case and would break the book model. SimpleBookCurl shades the leaf not at
    all, deliberately.
32. **Mirroring a curl means mirroring the coordinate system, not `dir.x`.** A
    backward turn was implemented as `if (mirror) dir.x = -dir.x`. That is not a
    mirror: `q` (the hinge corner) is derived from the *sign* of `dir`, so
    flipping the component moves which corner the leaf hinges from, and it leaves
    the `* vec2(-1., 1.)` back-face reflection — the step that maps the rolled
    page across the spine — pointing the wrong way. The whole effect now runs in
    a "curl space" where the right page always turns, with one involution
    `mirror(p)` applied to `vUv` on the way in and to every texture read on the
    way out. It preserves [0,1], so the reference's in-bounds tests are untouched.
    The existing texture pairing (`to = (P-2 | P-1)` for a backward turn) was
    already correct for a true mirror.
33. **A GSAP Observer must not be rebuilt on every state change.** The Observer
    was created in an effect with `[next, prev, jumpTo, last]` deps, and
    `next`/`prev` are `useCallback`s over `page` — so they changed identity on
    every turn and the effect killed and recreated the Observer *mid-gesture*,
    with `preventDefault: true` active. Wheel events arriving during the teardown
    went nowhere, which is what made scrolling feel like it skipped or stuck.
    Create it once on mount and route the handlers through a ref. Applies to any
    persistent input listener, not just Observer.
35. **A "use client" page cannot export `metadata`, and Next does not tell you.**
    `/ink` and `/landing` are client components, so `export const metadata = {
    robots: ... }` on them is silently ignored — the worst possible failure mode
    for a robots directive, because the code looks right and the page is indexed
    anyway. The directive has to live in a server `layout.tsx` wrapping the route.
36. **html-to-image drops its clone into a `<foreignObject>` with no positioned
    ancestor.** It copies computed styles onto the clone but not a containing
    block, so any percentage geometry on the captured node resolves against the
    wrong box: once the pages became `position:absolute; left:50%; width:50%`
    inside the book, a naive capture would have been shifted half a page out of
    frame and sized to half its width. `captureSpread` now overrides
    position/inset/size in pixels via the `style` option, which also makes capture
    independent of however the node is laid out — it should always have been.
43. **`WEBGL_lose_context.loseContext()` in an effect cleanup breaks the canvas
    permanently, and lies about why.** The symptom Krishna hit on 2026-07-30:
    *both* shaders fail to compile and `getShaderInfoLog` returns **null** — which
    reads exactly like a GLSL syntax error and is not one. `reactStrictMode` is on,
    so React runs every effect twice in dev (setup → cleanup → setup); the cleanup
    force-lost the context, and `canvas.getContext()` keeps returning that SAME
    now-dead context, so the second and final setup compiled against a corpse and
    the curl silently never drew. **A null info log is the tell** — a real compile
    error always carries a message. Correct cleanup deletes the program, shaders,
    buffer and textures; the context is a shared limited resource we do not own
    hard enough to destroy, and it goes when the canvas is collected. Latent since
    the curl was written; two `PageCurl`s on screen (volume + project book) made it
    fire reliably.
44. **A fallback has to be wired, not just documented.** PageCurl's header claimed
    "if WebGL is missing the component renders nothing and Grantha falls back to an
    instant page swap" — which was never true: the caller hid the live page layer
    for the whole turn regardless, so a dead curl showed a second of blank paper
    instead of swapping. `onReady` now reports usability up, and `CurlVolume` skips
    both the hide and the tween when the curl cannot draw. A `webglcontextlost`
    listener covers a real GPU reset the same way. If a degradation path is written
    in a comment, check that some code actually takes it.
40. **`container-type: size` makes an element a containing block for
    `position: fixed` descendants.** It implies `contain: layout size`, and
    `contain: layout` does that. So a modal rendered inside a page — a project book
    opened from an index row — had `inset: 0` resolving against a ~480px page box
    instead of the viewport, then got clipped by that page's `overflow: hidden`. The
    fix is a portal to `<body>`; the general lesson is that the page-units decision
    (item 38) silently changes what "fixed" means for everything inside a page.
41. **Two books on screen both listened to the same keydown.** A project book is
    rendered inside a page of the volume, so both `CurlVolume`s were mounted, both
    had a window key listener, and the book's wheel events bubbled to the volume's
    Observer target — one ArrowRight turned two books, and the volume changed page
    behind an open book. Solved positionally rather than by threading a flag down
    (the book cannot reach the volume's props): if a `[role="dialog"][aria-modal]`
    is open and this book is not inside it, this book is not the active one. Works
    for any future modal without teaching it about books.
42. **`ornament/Frame.tsx` is a DARK card, and a koma is ink on paper.** Panel is
    built to float over the dark scroll ground: near-black background, `--paper`
    text, wagara washes toned for that ground, and `padding: clamp(18px, 2vw, 26px)`
    — a viewport unit, meaningless inside a page. Reusing it for book panels
    unchanged would have put the old project cards back on a page, which is the
    exact thing the koma pass undoes. `.koma-panel` inverts it (paper ground, ink
    text, page-unit padding, washes off in favour of CSS screentone/speed-lines) and
    keeps what is genuinely koma furniture: the frame, the double inset border, the
    corner ornaments, the notch. Also: Panel puts children in its own
    `.panel-body`, so THAT is the flex column — styling the panel root as a column
    lays out one child and stacks nothing.
38. **A page is a container, so size it in container units — never viewport units,
    and never `@media`.** This is the rule the whole koma pass rests on. A page box
    is ~480px wide while `@media` still reads the real window, so every breakpoint
    fires at the wrong moment; and `vh`/`vw` inside a leaf are simply meaningless.
    `.book-page` now declares `container-type: size` and everything composed for a
    page is in `cqw`/`cqh`. The payoff is that a page scales as ONE object — same
    design at any window size, just larger or smaller — which was the other half of
    Krishna's complaint ("if i resize … the content on each page is not full").
    It also makes fit **provable**: because every length is proportional, checking
    the box model at one page size checks it at all of them.
39. **"Make it fit" has to be structural, not eyeballed.** `EpicIndex` cannot
    overflow at any page size or project count, and that is three properties, not
    good luck: the index region is `1fr` so it takes exactly what is left; its rows
    are `fr` with `minmax(0, …)` so adding a chapter shortens every row instead of
    pushing the last one off; and every text run is line-clamped, with
    `overflow: hidden` on the row as a last resort. Worth knowing the numbers were
    checked arithmetically (a ~40-line box-model script, no browser needed) and the
    hero row failed by **0.2px** at 1.5fr — invisible to reasoning, obvious to
    arithmetic. It is 1.7fr. Re-run that check if the hero type scale changes.
37. **The nav was rendering as raw browser buttons.** The stylesheet only ever
    styled `.nav a`, and the book's chrome used `<button>`; the current-page
    marker was written as `data-current` while the CSS reads `[data-on]`, so that
    never lit either. Both visible in Krishna's 2026-07-30 screenshots and both
    invisible in code review, because each half looked correct on its own. When
    porting chrome between two hosts, diff the selectors, not just the markup.
34. **The shader math can be verified without a browser** — worth knowing given
    item 29. Porting the fragment body to numpy and rendering a progress sweep
    against a synthetic two-page spread (dark cards, fine horizontal text rows)
    reproduced the grey slab exactly and confirmed its absence after the fix, in
    minutes. Pure per-fragment math needs no GL context. This does NOT extend to
    anything involving GSAP, capture, hydration or layout.

---

## 5. Decisions reversed along the way

- **Shatkona → ashtadala.** The shatkona is authentic (core of the Sri Yantra)
  but as an isolated six-pointed outline it read as a Star of David. Replaced
  with the eight-petalled lotus, a traditional Vaishnava centre. Eight divides
  24, so the 24-fold rule still holds.
- **Crossed vajra moved out of the centre.** It was invisible twice: its bars
  sat inside the shatkona's hexagon at the same gold tone. It now terminates the
  four cardinal spokes.
- **Résumé link disabled → re-enabled [REVISED 2026-07-20].** The stale 3.44
  render was the June PDF; `Resume/` already held current 3.51 renders. Now
  shipping **two**: `/resume.pdf` (1-page general) on the contact bar and the
  Mahabharatam epic, `/resume-research.pdf` (2-page research) on Ramayanam —
  the spine split applied to the document itself. Regenerating needs the
  `newtx` LaTeX package, which the Linux sandbox lacks; recompile on Windows
  or Overleaf and re-copy into `portfolio/public/`.
- **Mobile nav: hidden, not restyled [2026-07-20].** Dropping the Telugu gloss
  to make the nav fit would have broken the locked "Telugu always paired with
  English" rule, so the whole unit steps aside below 900px instead. This is a
  stopgap that is only acceptable while the site is one scrolling document —
  the noren menu (roadmap P4) is the real answer.

---

## 6. What's left

### Blocking a real launch

- [x] **Production build verified** (2026-07-20). Compiles clean, 3 static
      routes. Run once on Windows too before deploying.
- [x] **Mobile pass done** (2026-07-20). See §4 items 7–11 for what was broken.
      Note the old claim here that "nav hides below 820px" was **false** —
      there was no such rule; the nav simply overflowed. There is one now, and
      the breakpoint is 900px everywhere (CSS *and* the chakra), not 820.
      Still wants a human eyeball on the chakra recentre — see roadmap P0.
- [x] **Fonts vendored** (2026-07-20). `public/fonts/`, 15 woff2, 400 KB.
- [x] **Résumé rebuilt and linked** (2026-07-20). Two of them, split by epic.
- [ ] **Deploy.** No Vercel project yet.
- [x] **RESOLVED — what the turning leaf shows** (was §4 item 27). Answer: **(a)
      rasterise**, plus most of (c). The spreads are captured offscreen with
      `html-to-image` and the book is drawn as an object with visible page edges
      rather than filling the viewport. The leaf carries real content and reads as
      paper. The strip-slicing half of (a) is moot — the texture goes to a shader,
      not to DOM strips. (b), the turn.js two-panel fold, was never built.
- [x] **The `/volume` slug 404 on reload is moot** (was §4 item 28). `/grantha`
      never pushes history — page state stays in React. A catch-all route becomes
      necessary again the moment deep-linkable spread URLs are wanted; see §6
      "Design work still open".
- [x] **The book replaces `/`** (2026-07-30, Krishna's call). Scroll site retired.
- [x] **Workshop routes noindexed**, all three kept as routes per Krishna.
- [ ] **THE WHOLE MOVE NEEDS A BROWSER.** `tsc` is clean and the curl is verified
      geometrically (numpy sweep, §4 item 34), but the sandbox has no browser
      (§4 item 29) and cannot even `next build` (it fetches the linux SWC binary
      over a network it does not have). Nothing about the move below has been
      *run*. Check, in order:
      1. `npm run build` on Windows — expect `/`, `/[slug]` × 6, `/ink`,
         `/landing`, `/grantha` prerendered.
      2. `/` plays the landing, then reveals the book at the cover. Any input
         skips it. Reload: it should NOT replay in the same session.
      3. Text on the open spread is **selectable**. This is the whole point of the
         live-DOM change; if it isn't, the layer swap is inverted.
      4. Turn a few pages: the URL should change (`/about`, `/ramayanam`), the
         back button should walk back through them, and a hard reload on
         `/ramayanam` should open there.
      5. The nav should look styled (gold, letterspaced) and the current spread's
         item should be lit — both were broken before this change (§4 item 37).
      6. Turn quality unchanged from `/grantha`: no flash as the leaf lands (the
         live layer fading back in is the risky moment), no half-blank page
         (§4 item 36), capture still sharp at DPR 2.
- [x] **THE KOMA PASS IS DONE (2026-07-30).** All seven pages are now composed for a
      page: the two arcs as chapter indexes (`EpicIndex.tsx`) and the five framing
      pages in `components/spreads/Pages.tsx` — cover as full bleed with no panel at
      all, about as a kakemono column beside the record, the fork as two gates split
      by a real diagonal, astras as a weapons rack on a kikkō ground, colophon as
      printer's marks with the ensō closing around the seal. Each one's fit was
      checked arithmetically at four page heights rather than by eye; the tightest
      margin is ~2x the content's need. `Spreads.tsx` is now just the registry
      mapping, and the `.book-page .sec/.grid/.rv` override crutch is DELETED so the
      next page cannot be written as a scroll section and appear to work.
- [ ] ~~**THE KOMA PASS — the spreads were never authored as pages.**~~ Krishna,
      2026-07-30: "each page still feels like a regular webpage just pasted on a
      page-like view … the elements don't look like manga panels, they just seem
      like boxes thrown around randomly." He is right, and the numbers are brutal:
      the Ramayanam spread renders **11 project cards** and Mahabharatam **9**, one
      page each. Single-column at page width that is ~2,400px of content in a
      ~660px box, and `.book-page` clips the rest — the reader saw the top quarter
      of each arc. It was not a styling nit; a scroll section grows to fit its
      content and a page is a fixed rectangle you compose INTO. Opposite
      constraints, and no CSS reflow converts one into the other.
      **Decided:** each epic page becomes its arc's chapter index (mon + title),
      and project detail moves into the per-project book — which is what §03.2
      always said ("selecting a panel → project book"). Pilot built for Ramayanam
      only (`components/spreads/EpicIndex.tsx`); Mahabharatam is deliberately left
      as the old version, and since they are pages 3 and 4 the open book shows the
      two side by side for comparison. Awaiting Krishna's eye before rollout.
- [x] **Landing flash fixed** (2026-07-30). `LandingSequence` painted the finished
      lockup on its first frame because its "are we animating" state started at
      `false` (= static, = end state) and only became `true` one paint later. It is
      three-state now: `null` on the first paint renders the lockup invisible, which
      is beat 0.0 as written — "aged-paper field, faint washi grain. Silence."
- [x] **FIXED 2026-07-30 — every project has a book.** `components/book/recordBook.ts`
      generates a three-page record book from `projects.ts` for any project without a
      hand-written script: cover, the description, then the seal page which already
      pulls the tech strip and links from the project. Two of twenty read as manga
      (marked "Chapter" on the index), eighteen read as a clean record (marked
      "Read"). No row is a dead end and no writing is stranded. The regression it
      fixes is below, kept because it is the reason the record book exists.
- [ ] ~~**REGRESSION — the index page shows LESS than the card it replaced, and 18
      of 20 projects lost their substance.**~~ The old `ProjectCard` rendered badge,
      mon, title, sub, the full `feat` paragraph, the astras strip and the links. An
      index row renders mon, number, title, sub. For the 2 projects with a compiled
      script that is fine — the detail moved into the book, which is the whole design.
      For the other **18 it is a straight loss**: their `feat` text and astras are now
      rendered nowhere on the site, and the only way to learn what the project is, is
      to leave for GitHub. This is the likely root of Krishna's 2026-07-30 note that
      "the content in the book doesn't match".
      **Fix (cheap, and it makes the site content-complete): auto-generate a 2-page
      book from `projects.ts` for any project without a script** — a cover from
      title/sub/mon, and a record page carrying `feat`, the astras strip and the
      links. Then every row opens a book, scripted projects get the manga treatment
      and the rest get a clean record. No project is a dead end and no content is
      stranded. This is higher priority than writing the remaining 18 scripts by
      hand, which can happen over time.
- [ ] **Books tell the story but not the RECORD.** Even DALSP's book, which follows
      §9.4 faithfully, is metaphor plus two numbers ("20% PRUNED", "NO RETRAINING").
      A portfolio book needs the facts too — what was measured, against what, and
      what came out. §9.1 beat 5 carries astras and links but no results. The story
      register and the record register both belong in a book; right now only one does.
- [ ] **TASTE CHECKPOINT — the koma grammar inside a book.** DALSP is readable from
      the Ramayanam index (rows marked "Read ›"). It is the reference every later
      book copies, so it wants an eye before more are written: are the panels
      reading as koma, is the gutter doing its pacing job, is type-only enough?
      Not verified in a browser — no browser in the sandbox (§4 item 29).
- [x] **The chakra reacts per page (2026-07-30).** The `chakra: { spin, scale }` keys
      in `data/spreads.ts` were authored long ago and read by nothing; they now reach
      the sculpt through `Grantha → BookStage → Crystal → ChakraSculpt`, eased over
      ~0.45s on arrival rather than snapped. One trap worth keeping: the spin RATE is
      integrated per frame (`spun += dt * base * rate`) and never computed as
      `elapsedTime * rate` — the latter recomputes the whole history at the new rate,
      so changing gear would jump the wheel to a different angle. Closes the oldest
      open item in this file and the first entry in the Phase 6.5 register.
- [x] **Landing flash fixed properly (2026-07-30, second attempt).** The first fix
      handled the pending state; the frame Krishna could still see came from the
      reveal MASK, which starts fully open until inkDraw gives it a dash offset. Two
      changes: the title is invisible while the decision is pending, and the timeline
      is built in a `useLayoutEffect` so the mask is closed before anything paints.
- [ ] **Beat 3.4 is still not the real hand-off.** The landing currently dissolves
      to reveal the book; §03.1 wants the name and seal to shrink INTO the cover's
      title panel while the chakra rises. `BookStage` marks the seam.
- [ ] **Eyeball `/landing` and `/ink` on Windows** (Phase 1 exit). The sandbox
      has no browser (§4 item 29), so the title's *geometry* is verified
      (99.8% reveal coverage, frame-by-frame raster) but its *motion* is not.
      Watch for: strokes reading as one hand rather than several; the 0.3s ma
      at 2.2 not feeling like a stall; the stamp landing on the name's
      top-right at both desktop and 375px.

### Design work still open

- [ ] **Deep-linkable spread URLs for `/grantha`.** No history is written today,
      so a spread cannot be shared or reloaded into. Needs `pushState` on turn
      plus a catch-all route that resolves a slug to a page index.
- [ ] **Drag-to-turn and corner curl.** The shader already takes a continuous
      `progress`; only wheel/touch/keyboard drive it. A pointer drag mapping to
      progress is the obvious next reach, and the curl radius/angle uniforms make
      a corner peel-on-hover cheap.
- [ ] **Landing hand-off (beat 3.4) and koma-reveal on arrival** — carried over
      from the Phase 3 shell, never built.
- [ ] **Chakra doesn't react to scroll.** It persists, but spin rate and scale
      are constant. Intended: subtle per-section reaction.
- [ ] **Epic gateway illustrations** (Layer B, build-plan §6). The conch and bow
      are line sigils. The four WebP assets are ported and exported as `art` in
      `profile.ts` but unused.
- [ ] **True ambient occlusion** on the chakra. The antique read currently comes
      from palette spread + backing plate + grooves, not real AO.
- [ ] **Motion choreography** — `MOTION-CHOREOGRAPHY.md` is largely unimplemented
      (ink-brush chapter wipes, panel-by-panel beats).

### Housekeeping

- [ ] Education / research / achievements / skills are **hardcoded in
      `Site.tsx`** rather than `profile.ts`. Fine now, annoying when editing.
- [ ] `incoming-art/` (13 JPGs) and `mockups/` (4 HTML) — decide keep or bin.
- [ ] Drop `zustand` from package.json. It went with `lib/store.ts`; nothing
      imports it now.
- [ ] Commit. The repo still has a single "init" commit. (Krishna does all git
      himself — never run git from a session.)
