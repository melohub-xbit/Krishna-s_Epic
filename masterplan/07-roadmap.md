# 07 · Roadmap — when to do what, how

Ordering logic: (a) unblock production truth first (a build that runs), (b)
build the shared ink language before anything that uses it, (c) ship visible
wins early (mon in the current site) while the big refactor (volume shell)
lands, (d) art-heavy phases last so style anchors are stable.

Each phase ends: `npx tsc --noEmit` clean → update `PROJECT-STATUS.md` +
masterplan intent files.

---

## Phase 0 — Ground truth (blockers from PROJECT-STATUS §6) — do first, small
- [x] `next build` (never yet run). Passes clean, 3 static routes. Run on a
      clean Linux install rather than Windows — same Next 16.2.10 / Turbopack
      compile and TypeScript pass, so it surfaces the same errors. **Still
      worth one `npm run build` on Windows before deploy** to confirm the
      Windows SWC binary path.
- [x] Mobile pass. Found and fixed five real breakages — see PROJECT-STATUS §4.
      CSS breakpoints verified at a true 375px viewport. **One item unverified:
      the chakra recentre at <900px could not be eyeballed** (Chrome would not
      resize below its minimum while maximized, and the JS never hydrates in a
      nested iframe). The logic is now correct by construction — it reads the
      same pixel width the media query does — but it wants one human look.
- [x] Vendor fonts into `public/fonts/`. 15 woff2, 400 KB, unicode-range
      subset; zero requests to fonts.googleapis.com, confirmed in the network
      log. Shippori ships latin only (its japanese subset is 1.4 MB/weight and
      nothing on the page sets kana).
- [x] Rebuild résumé, re-enable link. The 3.44 render was simply the stale
      June PDF; `Resume/` already held current 3.51 renders of both variants.
      Split by epic per Krishna: research CV on Ramayanam, general on
      Mahabharatam + the contact bar.
- [ ] Commit history started (repo has one "init" commit). Commit per phase.

## Phase 1 — The ink language (shared assets everything else consumes)
- [x] 6 brush-texture masks (`public/brushes/`, generator
      `portfolio/scripts/make-brushes.py`) + `components/ink/inkDraw.ts` and
      `ease.ts`. Verified on an ensō at `/ink`. Two spec revisions came out of
      it — see 08 §8.5 [REVISED 2026-07-20]: reveal-mask mode for tapered
      forms, and CSS masking instead of an SVG `<mask>` element.
- [x] Install GSAP + plugins (3.15.0 — every plugin free post-Webflow, no
      token). gsap-skills installed as a Cowork plugin marketplace rather than
      vendored into the repo; `npx skills add` is the path for CLI agents.
- [x] The Velidanda seal (§02.1): `components/ink/VelidandaSeal.tsx`. Real
      glyph outlines — వెలిదండ shaped with HarfBuzz (7 codepoints → 4 clusters,
      two vowel-sign ligatures + an anusvara), outlines extracted with
      fontTools and transforms baked, so there is no webfont dependency at
      paint time. Regenerate with `scripts/shape-seal.py` → `build-seal.py`.
      **Scope corrected by Krishna 2026-07-20:** this is an ADDITIONAL seal for
      the landing only. The కృ seal is unchanged and keeps nav/cursor/chapter
      duty — see 02 §2.1 [REVISED]. **Form: one line, rectangular (~3.77:1),
      not a square** — a 2×2 square was built first and rejected.
- [x] కృష్ణ సాయి stroke-order SVG. `components/ink/TeluguTitle.tsx` +
      generated `titleGlyphs.ts`, from `scripts/build-title.py`. Not traced by
      hand — **the centreline is measured**: shape with HarfBuzz, union each
      akshara's glyphs, skeletonise the silhouette (the medial axis IS where
      the middle of the brush was), prune raster spurs, then walk each
      connected component as an Eulerian path (Chinese-postman pairing, so it
      retraces as little as possible). A component = a stroke, because the
      places a hand lifts are exactly the places the glyph is not connected.
      4 aksharas → 6 strokes; coverage check says the reveal uncovers 99.8% of
      the silhouette. Hand-tracing would not survive a change of wordmark or
      font; this regenerates from the string.
- [x] Exit test: `/landing` runs beats 0.4–3.0 in isolation (workshop route,
      noindex or delete before launch — same standing as `/ink`). Beat 3.4
      needs the volume shell and is Phase 3; `onDone` is its hook.
      **Still wants Krishna's eye** — see PROJECT-STATUS §6.

**Gotcha for whoever tests animation from an automated browser:** a
backgrounded tab gets no `requestAnimationFrame`, so GSAP's ticker never
advances and every timeline reads as frozen at a few percent — indistinguishable
from a broken tween. Check `document.visibilityState` before debugging
anything. Scrub with `tl.progress(x)` instead; screenshots work on hidden tabs.
`/ink` keeps a `window.__inkAll` handle for exactly this.

## Phase 2 — Mon roll (visible win, no refactor needed)
- [x] `Mon.tsx` registry; all 20 blazons from §04.2 drafted. Shared kit: one
      maru, one ink weight set on the `<svg>` and inherited (no path may
      override it), `polar/arc/ticks/radial` helpers with the 12/24/48 rule
      enforced by the tick/radial signatures. Blazon text sits above each
      component — the meaning has to survive an agent editing the paths.
- [x] Mon dropped into the scroll site's project panels, hanko position
      (top-right), stroke-draw on hover via `MonMark`. Direct mode, timeline
      built once and replayed — rebuilding per hover re-runs target collection
      and re-applies the brush mask on every pointer entry across 20 panels.
- [ ] **Iterate the weakest mon with Krishna** — TASTE CHECKPOINT. First-pass
      self-review says 8 of 20 miss: `dalsp` (branches too dense, reads as a
      feather; the pruned half is invisible), `medireport` (barrel and petals
      collide into a sunflower), `mutanthunter` (reads as a sun/asterisk),
      `devops-debug` (knot mushy, snap and splice unreadable), `os-mini` (keys
      are bare sticks), `desaigner` (brushes read as a tent, the interleave is
      lost), `dialecto` (the అ/A stand-ins are crude), `ect-nimhans` (crude
      box). The other 12 hold at both 48px and 480px.

## Phase 3 — The volume shell (the big one) · **[REWRITTEN 2026-07-30]**

The route is **`/grantha`**, not `/volume`. `/volume`, `TurnLeaf.tsx`,
`PageCounter.tsx` and `lib/store.ts` are DELETED. Dep added: `html-to-image`
(**run `npm install` on Windows** — the sandbox must never `npm install` against
the Windows binaries, PROJECT-STATUS §4 item 6). Dep to remove: `zustand`.

- [x] **Page-turn, v3 — accepted.** A WebGL page-curl: a line-for-line port of
      SimpleBookCurl (Raymond Luckhurst / Andrew Hung; source URLs in 06 §6.2),
      running on ONE canvas across both pages so the leaf can roll over the
      spine. Real spread content rides it via a capture pipeline. Spine is now
      the CENTRE; forward turns lift the right leaf. Two rejected predecessors,
      both deleted: v1 flat `rotateY` ("slide deck"), v2 nested CSS strips ("no
      good"). Mechanics: 08 §8.4. Traps: 08 §8.9 + PROJECT-STATUS §4 items 30–34.
- [x] **v3 debugged 2026-07-30** — the streaks and the grey frame were one bug, a
      clamped `asin()` mismapping half the book, plus a shading term added to hide
      it. Fixed by returning to the reference exactly. Verified with a numpy
      render of the fragment math; `tsc` clean.
- [x] Capture pipeline — `lib/captureSpread.ts`. Cached by element + pixel size,
      blocks on `document.fonts.ready`, returns null (plain paper) rather than
      breaking a turn. Window P-2..P+1 kept warm.
- [x] Re-parent `Site.tsx` sections into spread components —
      `components/spreads/Spreads.tsx` + `data/spreads.ts` with the per-spread
      chakra keys. **`Site.tsx` still exists** as a thin scroll host rendering the
      same components: one copy of the markup, two reading paths, and a known-good
      comparison while the book is unproven.
- [x] Observer input (wheel/touch/keys) — created ONCE, handlers via ref (08 §8.9
      trap 4). Page counter with Telugu numerals and `aria-live`. Reduced-motion
      path swaps instantly, no leaf.
- [x] **The book IS `/`** (2026-07-30, Krishna's call). Scroll site retired and
      deleted (`components/foreground/` is gone). `/ink`, `/landing`, `/grantha`
      all KEPT as routes, all noindexed via server layouts (a "use client" page
      cannot export `metadata` — PROJECT-STATUS §4 item 35).
- [x] **Live DOM at rest.** The prerequisite for the move: the visible spread is
      real selectable/crawlable markup and the rasterised curl canvas is revealed
      only mid-turn. Every spread mounted once and slotted. 08 §8.4.
- [x] **Deep links restored** — the gap dropping Zustand left. One static page per
      spread (`app/[slug]/page.tsx`), pushState on every settled page change,
      popstate adopts, and the nav is real `<a href>` so the slug pages are
      reachable by a crawler rather than orphaned.
- [ ] **No cut.** `jumpTo` still adopts the page instantly; the iaijutsu cut
      (§02.7) is unbuilt. This is the last piece of the old store's behaviour.
- [ ] Edge click-strips (48px, left/right) — specced in 08 §8.2, CSS exists
      (`.book-edge`), markup does not.
- [ ] Koma-reveal in reading order on arrival. `Reveal.tsx` is deleted with the
      scroll site, so nothing drives `.rv` any more — the book force-shows them via
      `.book-page .rv { opacity: 1 !important }`. That rule is what makes content
      appear at all today; replacing it with a real per-arrival reveal is the job.
- [ ] Wire `.parva` (the dot column) to `page` as the place-marker, or delete the
      dead CSS. Ten-line job, better than a number.
- [ ] Chakra reaction per spread: the `chakra: { spin, scale, tint }` values are
      **written in `data/spreads.ts` and consumed by nothing.** Wiring them is now
      a small job with a visible payoff — the one open item from PROJECT-STATUS §6
      that is already half-done.
- [ ] Landing sequence integrated as "page one being drawn" (§03.1 beat 3.4).
      `LandingSequence`'s `onDone` is the hook; the chakra rise and the
      shrink-into-title-panel are not built.
- [ ] **TASTE CHECKPOINT — the first page-turn. STILL OPEN.** v1 and v2 rejected;
      v3 is built and fixed but has only ever been judged from Krishna's screen
      recordings. Needs a real look on Windows at turn duration, curl radius,
      capture sharpness at DPR 2 and the wheel threshold. **`npm run build` on
      Windows too** — the sandbox cannot `next build` (it needs to fetch the linux
      SWC binary), §4 item 29 extended.
- [ ] **The landing is now the entry point, but beat 3.4 is not built.** It plays
      on its own paper field at `/` and dissolves to reveal the book already at the
      cover. §03.1 wants the name and seal to shrink INTO the cover's title panel
      while the chakra rises behind the paper. `BookStage.tsx` marks the seam.
- Exit test: full volume navigable end-to-end at 60fps mid-laptop, mobile OK.

## Phase 4 — Gates, petals, curtains (the Japanese layer in motion) · **BUILT 2026-07-30**

Sources for every element are in 06 §6.2 and cited in each component's header. The
standing rule was followed: the real form was read first, then built.

- [x] **Fused torii-torana gate** — `components/ornament/Gate.tsx`. A full myōjin
      torii, member by member (hashira with the *uchikorobi* lean, curved kasagi with
      *sorimashi*, shimaki, protruding nuki, kusabi, gakuzuka, nemaki), carrying the
      torana garland as its nuki on the same cosh catenary as `Torana`. It is the
      FORK page's two choices, so choosing a path is passing through its gate — and
      each epic's name sits on the gakuzuka, the tablet a real torii carries its
      shrine's name on. The authentic colour rule (vermilion; black only on kasagi
      and nemaki) fit the locked palette with nothing bent.
- [x] **Sakura at the apex only** — `components/ornament/Sakura.tsx`. Five petals with
      a real NOTCHED tip (the notch is what separates sakura from plum in mon design),
      12 of them, paper-white with a kumkum blush masked to the notch, ink-outlined.
      They rock about the petal's long axis rather than tumbling, because a real petal
      is a wing. Fires once per turn at eased progress ≥ 0.42 and never idles —
      scarcity IS the meaning, so an ambient drift would delete it.
- [x] **Iaijutsu cut** — `components/ornament/Cut.tsx`, wired to `jumpTo`. Flash,
      one diagonal *kesagiri* slash drawn in one direction, page swaps while the blade
      covers it, resheath. ~0.44s. Replaces a nav jump that previously swapped the
      page with no transition at all.
- [x] **Noren menu** — `components/ornament/Noren.tsx`. Two indigo panels that DROP
      (pivoting from the rod, so the hem lags) then part, with a live wave hem and
      sewn seams, the hanko printed across the parting. It is also the fix for the nav
      being `display: none` below 900px — acceptable in a scroll, but in a book a
      phone had NO navigation at all.
- [x] **Kikkō + shippō** in `Patterns.tsx`, from their real constructions, each with
      the single assigned use §02.6 gives it: kikkō (armour) on astras, shippō
      (connection) on the colophon. The CSS-gradient fake that stood in for kikkō is
      deleted.
- [x] **Endpapers spread** — a new page between the two arcs, where kolam and asanoha
      interleave as printed bands. §02.6 says the two traditions meet ONLY here, which
      is what earns it a page. The volume is 8 pages now.
- [x] ~~Chakra scroll-reaction~~ — done in Phase 3.
- [ ] **Still open in Phase 4's spirit, not its letter:** the gate is a static frame
      on the fork page; §03.2 also wants it to frame the chosen half DURING the
      transition. That needs the cut and the gate choreographed together.

## Phase 5 — Project books (the click-a-project-read-its-manga deliverable)
- [x] **The shell, 2026-07-30.** `components/book/{MangaBook,BookPage}.tsx`.
      `PanelFrame` was not needed as a separate component — `ornament/Frame.tsx`
      already IS the koma frame (double inset border, corner ornaments, notch); a
      koma is that component with its palette inverted to ink-on-paper, since a
      book page is paper and Panel is built to float over the dark ground.
      Opens from the clicked row's measured rect, `role="dialog"` + focus trap +
      Escape, portalled to `<body>` (it must escape the page's containment — see
      PROJECT-STATUS §4 item 41).
- [x] **The turn is SHARED, not reimplemented.** `components/grantha/CurlVolume.tsx`
      was extracted from `Grantha` and now carries the whole body of a book —
      measurement, capture window, compositing, tween, phase guard, live-DOM slots,
      curl canvas. The volume and every project book mount the same component, so
      "one curl everywhere" is structural rather than a thing to keep checking.
      `Grantha` is chrome + URLs around it. Logged as closed in the Phase 6.5
      register.
- [x] **Both finished scripts compiled** (DALSP, HFT SIM) into
      `data/mangaScripts.ts`, with the §9.6 status table updated. Type-only panels
      per §9.2; each panel keeps its art prompt as an unrendered `artNote`.
- [ ] Write + compile scripts for RACS, EEG·ECG, PRISM, MutantHunter (five-beat
      structure, §9.1); remaining projects keep panel fallback until scripted.
      **The fallback is live**: an index row with a script opens its book and is
      marked "Read ›"; the other 18 still link out to the repo. Shipping books
      incrementally is the design — the alternative is 18 rows opening placeholder
      books to make 2 consistent.
- [ ] **TASTE CHECKPOINT — the koma grammar inside a book.** DALSP is readable now
      and is the reference every later book copies, so it wants Krishna's eye before
      any more are written. Specifically: are the panels reading as koma, is the
      gutter doing its pacing job (tight vs wide), and is type-only enough or does
      it need art?
- [ ] **DECIDE: panel reading order.** Panels are laid out LTR to match the volume's
      own direction. 08 §8.6 specifies RTL (true manga koma order). Two CSS lines
      either way — but decide before more books exist. 08 §8.2 carries the question.
- [ ] Update the status table in §9.6 as each ships.

## Phase 6 — Omake (personal)
- [ ] Collect Krishna's actual lists (anime, films, machines) → `personal.ts`.
- [ ] Two style anchors added to `ART-BRIEF.md`; generate art.
- [ ] Style dissolve + three omake pages (§05).

## Phase 6.5 — THE COMPOSITION PASS · deferred by decision, NOT optional

> **[DECIDED 2026-07-30 — Krishna] Build every part first; put them together
> afterwards.** This is a deliberate sequencing choice and it is the right one for
> getting the pieces made. It carries one specific risk, and this section exists so
> that risk cannot be forgotten: **cohesion is not emergent.** A set of individually
> well-made elements does not become a designed object by being placed on the same
> page. Krishna's own read of the build on 2026-07-30 — *"none of that seems
> theme-integrated, seems all distinct elements"* — was accurate, and it will stay
> accurate until the work below is actually done. No phase after this one absorbs
> it: Phase 7 is polish and deployment, which is a different job.

Numbered 6.5 rather than 8 so it sits where it belongs — after the making, before
launch — without renumbering the P1–P7 acceptance criteria in 08 §8.8.

### The integration debt register

Every item here is a place where two things that were built separately still have
to be made into one thing. Add to this list whenever a phase defers a seam.

- [x] ~~**The chakra is inert.**~~ **DONE 2026-07-30** — the per-page `spin`/`scale`
      keys now reach the sculpt and are eased on arrival. Note the outcome, though:
      making it move did NOT make it feel present. See the item below.
- [ ] **THE CHAKRA READS AS BACKGROUND, NOT AS THE STAGE. [Krishna, 2026-07-30,
      after the per-page reaction landed: "the chakra feels like an unimportant
      background element."]** Deferred by him, logged here because it is a design
      problem and not a bug, and because the obvious fix — make it move more — is
      probably wrong. It is behind a dark scrim, low-contrast, off to one side, and
      now that the pages are properly composed they hold the eye completely. Things
      worth trying when this comes up: lift it *through* the gutter and bleed panels
      the way §03.2 assumes ("the chakra stage persists behind the paper — visible
      through gutters and bleed panels"), give the cover a genuinely bled panel so it
      is the art rather than a backdrop, reconsider the scrim's opacity over the
      right half, and let it participate in a turn (the leaf's shadow falling ON it).
      A faster spin will not fix "unimportant"; presence is contrast and occlusion,
      not motion.
- [ ] **Per-spread koma grammar (§03.2).** Every page has a specified panel
      language — kakemono scroll panel on About, diagonal gutter splitting the fork,
      weapons-rack grid on Astras, endpapers between arcs. As of 2026-07-30 exactly
      one page has any composition at all (`EpicIndex`, the Ramayanam pilot); the
      rest are still scroll sections in a page-shaped box. See PROJECT-STATUS §4
      items 38–39 for the two rules any page composition must follow (page units,
      structural fit).
- [ ] **The landing does not become page one (§03.1 beat 3.4).** It plays on its own
      paper field and dissolves; the name and seal are meant to shrink INTO the
      cover's title panel while the chakra rises behind the paper. This is the first
      seam a visitor sees, which makes it the most expensive one to leave open.
- [ ] **`MOTION-CHOREOGRAPHY.md` is largely unimplemented** and says so itself. The
      motion tokens are in use; the beat sheets are not. Ink-brush chapter wipes and
      panel-by-panel beats are the connective tissue between spreads.
- [ ] **Phase 4 is the integration phase in disguise.** Gate, petals, noren, cut,
      wagara, endpapers — none of it is a *feature*, all of it is binding material.
      If Phase 4 slips, this is what slips with it.
- [x] **Project books vs. the volume — CLOSED 2026-07-30.** The turn is one shared
      component (`CurlVolume`), so a book cannot drift from the volume by accident.
      Still open within it: the book's paper tone and the volume's are set
      independently, and closing a book does not yet restore anything about where
      you were beyond the index page itself.
- [ ] **One typographic system, or it will read as several.** The spreads, the
      index page and the landing were each type-set at different times. Before
      launch, one pass to reconcile scale, weight and the Telugu/Latin lockup rule
      across all of them.

### Exit test for this phase

Not "is each element good" — that is Phases 1–6. The test is: **can a stranger
read the whole volume start to finish and describe it as one designed thing?** If
they name individual effects instead, this phase is not done.

## v1 LAUNCH CUT — **[DECIDED 2026-07-30 — Krishna wants to ship soon]**

The phases above are the full design. This is the subset that has to be true for the
site to be worth having in public, and — more usefully — the list of things that get
**cut from v1 on purpose** so that "finish soon" means something.

A portfolio's job is that a stranger can find out what Krishna has done. Measured
against that, the ranking is not the phase order: content completeness beats
cohesion, and cohesion beats ornament.

### Must ship

1. [x] **Every project readable** — `components/book/recordBook.ts` generates a
   record book from `projects.ts` for the 18 without a script. Every index row opens
   something.
2. [x] **Mahabharatam ported to the index.**
3. [x] **The koma pass on the five remaining spreads** — `components/spreads/Pages.tsx`.
   Cover, about, fork, astras, colophon, each with the panel language §03.2 specifies
   rather than a generic grid. Fit checked arithmetically at four page heights.
4. [x] **The chakra reacts per page** — the authored keys finally reach the sculpt,
   eased on arrival.
5. [ ] **Ship it:** favicon (currently a 404), OG image, `npm run build` on Windows,
   Vercel, one accessibility pass, one performance pass. **This is all that is left.**

**Nothing above has been seen in a browser** — the sandbox has none (PROJECT-STATUS
§4 item 29). `tsc` is clean and every page's fit was checked numerically, but the
composition itself is unreviewed.

### Cut from v1, deliberately

- **All of Phase 4** — torii-torana gate, sakura petals, noren menu, iaijutsu cut,
  kikkō/shippō, endpapers. This is the binding material and it is genuinely wanted,
  but none of it is needed for a stranger to read the volume.
- **Phase 6 omake** — needs Krishna's lists and new art. Post-launch.
- **The remaining 18 hand-written manga scripts.** The auto record book covers them;
  promote them to real scripts a few at a time, forever. Two flagships being real
  manga and eighteen being clean records is a coherent v1.
- **Beat 3.4's landing hand-off, audio, true AO on the chakra.** Finishing moves on
  a volume that is already coherent; they buy nothing while items 1–3 are open.

**The one thing not to cut:** item 4. Skipping it is what will make a launched site
still feel like separate screens, and it costs the least of anything on this page.

## Phase 7 — Polish & launch
- [ ] Audio map (MOTION-CHOREOGRAPHY §14), off by default.
- [ ] Performance audit (petals instanced, preload one hop, tab-hidden pause).
- [ ] Accessibility pass: full keyboard nav, reduced-motion parity, alt text.
- [ ] Deploy (Vercel), OG images (the hanko + title lockup), metadata.

---

## Standing rules while executing

1. Never skip Phase 1 to get to Phase 3 — every later phase consumes the ink
   language; building flips with placeholder strokes doubles the work.
2. Any new element: research authentic form first (`ELEMENT-CRAFT-SPEC.md`
   recipe), and it must map to a §01 rhyme.
3. Krishna reviews at each phase exit — mon drafts (P2), first page-turn
   (P3), gate (P4) are the three taste checkpoints that steer everything after.
