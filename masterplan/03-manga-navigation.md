# 03 · Manga navigation — the volume model

**[REVISED 2026-07-20]** Supersedes the scroll-document model currently built
in `portfolio/` and refines `DESIGN-FLOW-BLUEPRINT.md` §2–4. The site becomes
a **manga volume**: each section is a page/spread with its own koma (panel)
layout; moving between sections is a **page-turn**, right-to-left, like real
manga. The chakra stage persists behind the paper — visible through gutters
and bleed panels.

---

## 3.1 The landing sequence (Krishna's brief, choreographed)

Target ~4.5s, skippable on any input, reduced-motion cuts to final state.
Timings use `MOTION-CHOREOGRAPHY.md` tokens; house curve `ink`.

| t | Beat |
|---|------|
| 0.0 | Aged-paper field, faint washi grain. Silence. |
| 0.4 | A sumi-e brush **writes కృష్ణ సాయి** — one continuous choreographed stroke-draw (DrawSVG along the glyph outlines under a brush-texture mask, §02.8): thick entries, dry-brush exits, ink bleed blooming at stroke ends. The stroke *hesitates then commits* (`ink` easing). ~1.6s. |
| 2.2 | Beat of ma — nothing moves. (0.3s hold; do not trim it.) |
| 2.5 | The **వెలిదండ hanko** (§02.1) **stamps down** over the top-right of the name: drops from slight scale (1.15→1) with 4° rotation settling to ~2°, kumkum impression + ink-splat ring, 1-frame white flash, micro screen-shake (2px, 90ms). Manga SFX moment. |
| 3.0 | Latin caption fades in under: "VELIDANDA KRISHNA SAI" (Telugu-always-paired rule). |
| 3.4 | The composition **becomes page one**: name+seal shrink/translate into the hero spread's title panel while the **chakra rises** behind the paper (scale+opacity from depth), kolam field fades in, nav blooms from the seal. The landing was never a separate screen — it was the first page being drawn. |

Asset prerequisite: కృష్ణ సాయి as SVG paths ordered in authentic stroke order,
grouped per akshara, so the draw-on follows how the script is actually written.

## 3.2 The spread map (the whole book)

Reading order = manga order. Each spread lists its koma grammar:

| Pg | Spread | Koma layout & grammar |
|----|--------|----------------------|
| 1 | **Cover / hero** | Full-bleed (tachikiri) — chakra as the sun, title panel, hanko. Bleed = "a moment that stops time." |
| 2 | **About — the author's code** | Kakemono scroll panel (bushidō ↔ dharma, §02.7) + portrait panel + irregular bio koma. Tight gutters (continuous thought). |
| 3 | **The fork** | Two-panel spread split by a diagonal gutter: conch sigil (Ramayanam) right, bow sigil (Mahabharatam) left. Choosing = flipping into that arc. The fused torii-torana gate (§02.3) frames the chosen half during transition. |
| 4–5 | **Ramayanam arc** | One project per *panel*, revealed in RTL reading order; hero projects get large koma (weight = importance), minor ones small koma (rapid pace). Each panel carries its mon (§04). Selecting a panel → project book. |
| 6–7 | **Mahabharatam arc** | Same grammar, blue-lit key. |
| 8 | **Astras (skills)** | Kikkō-armour backdrop, weapons-rack koma grid. |
| 9 | **Omake — personal** | Style-dissolve entry (§05). Anime · Tollywood · garage. |
| 10 | **Colophon — contact** | Shippō backdrop, ensō closes around the hanko, links as printer's marks. End-of-volume page. |
| — | **Endpapers** | Between arcs: a quiet interleaved kolam × asanoha pattern page shown for one beat mid-flip (the §01 rhyme made visible). |

## 3.3 The page-turn (the signature interaction)

- **Input:** wheel / trackpad / arrow keys / swipe / clicking page-edge. One
  gesture = one turn (Observer-pattern discrete navigation, momentum flicks
  can turn 2–3 with decaying speed). **No scrollbar** (locked). A thin
  page-counter (అధ్యాయం 04 / 10) ticks with a stamp.
- **Anatomy of a turn (`long`, `ink`) — [REVISED 2026-07-30, and BUILT]:** the
  book is an open two-page spread with the spine down the middle. The **right**
  leaf lifts at the spine, rolls over it on a real cylinder and lays down on the
  left half; the destination spread is underneath the whole time. It is a WebGL
  curl (SimpleBookCurl — see 08 §8.4 for the source URL and the model), running
  on ONE canvas across both pages, fed textures captured from the real spreads,
  so **the turning leaf carries its actual content** — which was the thing two
  earlier attempts could not do. A contact shadow sweeps the page beneath. The
  cylindrical bend is genuine, not approximated: the leaf rotates about the spine
  and then straightens flat.
  Still unbuilt from this beat: sakura petals at the apex, the paper-settle
  rustle, and the chakra keying its lighting to the incoming section (the
  per-spread `chakra` values exist in `data/spreads.ts` but nothing consumes
  them). Show-through of the reverse content is moot — the back face shows the
  destination page for real.
- **Chapter jumps** (nav menu, deep links): iaijutsu cut (§02.7) instead of
  a multi-page riffle — one blade-flash wipe, land on the target spread.
- **Within a spread:** koma reveal in reading order on arrival (stagger 70ms,
  stroke-draw borders then content inks in). Interactive panels use the built
  hover grammar (lift, gold-foil edge, screentone sweep).
- **Fallback path:** `prefers-reduced-motion` or weak GPU → instant crossfade
  between spreads, koma appear without draw-on; identical content and order.

## 3.4 Project books (unchanged from blueprint §8, now nested consistently)

The volume's panels open into **project mini-books** — flip-through 3–6 page
chapters (cover → villain/problem → action panels → result + astras + links).
Book-open = panel lifts + spine-hinge opens, camera pushes in. Inside, the
same RTL page-turn at `base` speed. Close = reverse, return to the arc spread
with your place preserved. Content from `data/projects.ts` + mon from §04.

## 3.5 Architecture

- **State machine, not scroll position.** **[REVISED 2026-07-30] Zustand is gone**
  — state is local to `Grantha.tsx` (08 §8.2), because the turn collapsed into a
  single component and a store bought only indirection. The phase guard survives
  and is still the only lock. **Deep links and browser back/forward went with the
  store and are outstanding**: `/grantha` writes no URL today.
- **Layers:** (0) r3f canvas: chakra + kolam field + petals + gate/lighting —
  persists; (1) the paper: the book, DOM + one WebGL surface; (2) transition
  layer. **[REVISED 2026-07-30]** Layers 1 and 2 merged: the turn happens *in*
  the page surface rather than in an overlay above it, because the curl needs the
  destination spread present in its own texture. Consequence to keep in view: the
  spreads the reader sees during a turn are **rasterised**, so the selectable /
  accessible / crawlable DOM copy is the offscreen render (`aria-hidden`) plus
  the scroll site at `/`. If `/grantha` ever becomes `/`, that copy has to be
  made real — see 07 Phase 3.
  `Reveal.tsx` still does scroll-based nav tracking; koma-reveal-in-reading-order
  on arrival is unbuilt.
- **Timelines:** GSAP owns all choreography (now 100% free incl. DrawSVG,
  MorphSVG, SplitText, CustomEase, Flip, Observer). One `CustomEase` = the
  `ink` curve. Official AI-agent skill exists: github.com/greensock/gsap-skills
  — install for any agent building this.
- **Budget:** 60fps mid-laptop; petal/effect instancing; preload adjacent
  spreads one hop ahead; pause canvas when tab hidden.

## Reversed decisions

- **[2026-07-20] Scroll-document → volume.** The built scroll site was always
  interim; Krishna's core ask is manga navigation. Scroll input remains — it
  just turns pages now.
- **[2026-07-20] Landing beat sheet revised**: seal-first bloom (blueprint §5)
  → name-stroke-then-stamp (§3.1). The కృ seal still ends as nav anchor.
- **[2026-07-30] Three page-turns, two rejected.** v1 flat `rotateY` ("feels like
  a slide deck") and v2 twelve nested CSS strips ("no good") are both DELETED. v2
  bent correctly and still failed, which is the useful part: a **contentless leaf
  cannot read as a page** — with nothing on the surface the eye has nothing to
  track, so the curvature is invisible and the turn reads as "the screen goes
  blank, then comes back". That is why v3 pays for a capture pipeline. Any future
  turn proposal must put real content on the leaf or it is already dead.
- **[2026-07-30] Spine moved to the CENTRE.** It was on the right (manga RTL),
  then the left (2026-07-21), and is now the middle of an open two-page spread.
  Direction is unchanged from the 07-21 reversal: ordinary book, right leaf turns
  forward. Note this leaves page order LTR while koma order is still specified
  RTL — flagged as an open question in 08 §8.2, not decided.
