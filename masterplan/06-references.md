# 06 · References — studied sources & tooling

## 6.1 alche.studio — dissection (studied 2026-07-20)

What the target actually does, and what we take:

| Observation | Lesson for us |
|---|---|
| Astro site with a **persistent WebGL key-visual ("kv") canvas**; DOM content choreographed over it | Matches our architecture exactly: r3f chakra canvas + DOM paper layer. Validated. |
| Sections have **explicit named choreography states** in the DOM: `works_intro → works → works_outro`, `mission_in`, `vision_out`, `service_in` | Every spread gets a scripted *enter*, *idle*, **and exit**. Exits are half the craft — most sites only design entrances. Encode as phases in the transition state machine. |
| Single instruction: "scroll to explore →" — no scrollbar UI, scroll drives scene state | Our page-turn on wheel is the same contract. One quiet affordance, then trust the reader. |
| **JP/EN bilingual pairing** on every statement (Japanese first, English under) | Direct precedent for the Telugu-always-paired rule. Their typography treats the two scripts as one lockup — copy that: Telugu display + Latin caption as a single composed unit, never two competing headlines. |
| Restraint between moves; long calm holds; black + one accent | The ma principle (§01). Their power is stillness between transitions. |
| Works = few, large, cinematic entries with tags — not a dense grid | Hero koma sizing (§03.2): weight = importance. |

## 6.2 Technique sources (verified links)

- **THE PAGE-CURL — the implementation that shipped [ADDED 2026-07-30].** The
  turn is a port of **SimpleBookCurl** by Raymond Luckhurst (MIT), the
  gl-transition adaptation of Andrew Hung's page curl. Take the *book* variant:
  Hung's original curls one sheet across the whole screen and cannot cross a
  spine. Krishna's instruction is to follow it **exactly** — every artefact so
  far came from hand-tuning it. Fetch, don't reconstruct:
  [SimpleBookCurl.glsl](https://raw.githubusercontent.com/scriptituk/xfade-easing/main/glsl/SimpleBookCurl.glsl)
  · [SimplePageCurl.glsl](https://raw.githubusercontent.com/scriptituk/xfade-easing/main/glsl/SimplePageCurl.glsl)
  · [Andrew Hung's breakdown](https://andrewhungblog.wordpress.com/2018/04/29/page-curl-shader-breakdown/)
  (the *how it works* essay — cylinder, curl axis, the three scenarios)
  · [his shadertoy ls3cDB](https://www.shadertoy.com/view/ls3cDB)
  · [gl-transitions editor](https://gl-transitions.com/editor) to try variants live.
  Mechanics and traps: 08 §8.4 and §8.9.
- Page-flip approaches considered and NOT used: [StPageFlip](https://nodlik.github.io/StPageFlip/) · [Turn.js](http://www.turnjs.com/) (the two-panel fold) · [CSS 3D bending page flip](https://gist.github.com/mqxu/9cfd8d902c1f2ac9a79dcf0ca2956377) (the nested-strip technique, built as v2 and rejected) · [GSAP book-flip forum thread](https://gsap.com/community/forums/topic/36550-book-flip-animation-on-gsap/)
- [GSAP scroll tools](https://gsap.com/scroll/) · [Codrops 3D scroll-driven text](https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/) · [Three.js scroll-driven scenes](https://medium.com/@pablobandinopla/scroll-driven-presentation-in-threejs-with-gsap-a2be523e430a)
- GSAP is **100% free since April 2025** incl. formerly-paid plugins: [announcement/summary](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/) · [plugin docs](https://gsap.com/docs/v3/Plugins/)
- **Official GSAP AI-agent skills**: [github.com/greensock/gsap-skills](https://github.com/greensock/gsap-skills) — any agent building motion here should install/read these first.
- Manga grammar: [koma-wari & paneling](https://www.mangaka.online/blog/manga-panel-layout-guide/) · [reading order/gutters/tachikiri](https://mangashed.com/how-to-read-manga-panels/) — gutters encode time; bleed encodes weight; panel size encodes pace. Encoded into §03.2.
- **PHASE 4 — the Japanese layer, sources for each element [ADDED 2026-07-30].**
  Every one of these was read before the component was written, per the standing
  rule; the geometry in each file comes from them and the file headers cite them.
  - **Torii anatomy**: [Wikipedia · Torii](https://en.wikipedia.org/wiki/Torii) and
    [JAANUS](http://www.aisf.or.jp/~jaanus/deta/t/torii.htm). The members the gate
    is built from and their real names — hashira (pillars, with the inward
    *uchikorobi* lean), kasagi (top lintel, upward *sorimashi* curve, pentagonal in
    section), shimaki (second lintel under it), nuki (protruding tie-beam), kusabi
    (locking wedges), gakuzuka (centre strut + name tablet), nemaki (black foot
    sleeve). Also the COLOUR RULE, which turned out to fit the locked palette
    exactly: a painted torii is vermilion and "the colour black is limited to the
    kasagi and the nemaki". `components/ornament/Gate.tsx`.
  - **Torii ← torana**: same page, "Proposed relatives" — scholars trace the torii's
    form to the Indian torana and the words may be cognate. The fusion in §02.3 is
    not a pun; it is the §01 rhyme with a citation.
  - **Shippō construction**: [Wikipedia · Overlapping circles
    grid](https://en.wikipedia.org/wiki/Overlapping_circles_grid), *square lattice
    form*. Shippō is circles of radius r on a square lattice of spacing r·√2, so each
    passes through its neighbours' centres and they meet on the diagonals. That exact
    ratio is the pattern — at any other spacing the four-petal rosette stops reading.
    Same family as batik's kawung and Mesopotamian *apsamikkum*.
    `components/ornament/Patterns.tsx`.
  - **Kikkō**: regular hexagonal tiling with a rim, because kikkō-gane was literal
    quilted samurai armour plating — which is the whole reason §02.6 assigns it to
    the astras page and nowhere else.
- Japanese motifs: [wagara meanings](https://en.thebecos.com/blogs/column/10-japanese-patterns-steeped-in-history-and-their-traditional-meaning) · [mon/kamon](https://en.wikipedia.org/wiki/Mon_(emblem)) · [ensō](https://en.wikipedia.org/wiki/Ens%C5%8D) · [torii](https://en.wikipedia.org/wiki/Torii) · [sakura symbolism](https://aboutwallart.com/blogs/news-articles-home-decor-inspiration/cherry-blossom-art-japan-understanding-the-deep-symbolism) · [bushidō](https://japanupclose.web-japan.org/techculture/c20240531_2.html)

## 6.3 Toolchain decisions

| Tool | Role | Status |
|---|---|---|
| Next.js + r3f + drei | stage, chakra, fields | built, keep |
| GSAP core + ScrollTrigger/Observer/DrawSVG/MorphSVG/SplitText/Flip/CustomEase | ALL choreography; Observer for discrete page-turn input; DrawSVG for every stroke-draw | adopt (free) |
| Zustand | volume/book state machine | **dropped 2026-07-30** — one consumer, so it bought only indirection; state is local to `Grantha.tsx`. Still in package.json; remove. |
| `html-to-image` | rasterise a spread to a texture for the curl | adopt (dep added) |
| WebGL (raw, no three.js) | the page-curl quad — `PageCurl.tsx` | adopt. Deliberately NOT r3f: it is one quad and two textures, and the chakra canvas is a separate fixed layer that must not move when a page turns. |
| Framer Motion | small DOM micro-interactions only; GSAP owns transitions — don't split ownership | limit |
| Lenis | NOT needed once scroll → discrete turns | drop |
| SVG filters (feTurbulence/feDisplacementMap) | ink bleed, stamp grain, torn edges | adopt |

## 6.4 Bar-setting sites to revisit before each phase

alche.studio (world + restraint) · cappen.com (flow) · Awwwards "manga/comic"
tagged winners for panel-based navigation patterns. Study exits, not
entrances.
