# MASTERPLAN — the canonical design brain

**Velidanda Krishna Sai — portfolio.** A living manga volume you *turn*, not
scroll: Telugu/Hindu iconography bound together with traditional Japanese craft,
navigated like reading manga.

This folder is the single source of truth for **design intent**. Any agent (or
Krishna) picking up this project starts here, reads in order, and **updates
these files as decisions are made** — this is a living plan, not a snapshot.

> ### ⚠ READ THIS BEFORE JUDGING THE BUILD
> **[2026-07-30] The build order is: make every part first, compose them
> afterwards.** Krishna's call, and the right one for getting the pieces made — but
> it means that for a stretch the site will look like a collection of good separate
> elements rather than one designed object. That is expected, not a regression.
>
> It is also **not self-correcting.** Cohesion is not emergent: elements do not
> become a design by sharing a page. The work that binds them is enumerated in
> `07-roadmap.md` **Phase 6.5 — The composition pass**, with a debt register that
> every later phase must add to whenever it defers a seam. Nothing after it absorbs
> that work; Phase 7 is polish and deployment.
>
> So: do not read "these pieces don't feel connected yet" as a bug to hunt, and do
> not read it as fine either. Check it against the Phase 6.5 register, and if the
> seam is not listed there, **add it.**

---

## Reading order

| # | File | What it holds |
|---|------|---------------|
| 1 | `01-ideology.md` | The core thesis, the fusion rules, the non-negotiables |
| 2 | `02-japanese-layer.md` | Sakura · samurai · wagara · hanko — every Japanese element, researched, with its fusion partner |
| 3 | `03-manga-navigation.md` | The volume model: spreads, koma, page-flips, the new landing sequence |
| 4 | `04-mon-system.md` | Individual manga identity (kamon crest + chapter treatment) for every project |
| 5 | `05-omake-personal.md` | The personal-interests section: anime, Tollywood, bikes & cars as bonus chapters |
| 6 | `06-references.md` | alche.studio dissection, technique sources, tooling (GSAP etc.) |
| 7 | `07-roadmap.md` | When to do what, how, in what order — with the why |
| 8 | `08-implementation-guide.md` | **The engineering handbook** — component tree, state machine, page-turn mechanics, `inkDraw` API, schemas, acceptance criteria. Implementing agents live here |
| 9 | `09-manga-scripts.md` | How project info becomes readable manga pages — five-beat structure, writing rules, complete example scripts |

**Implementing agent fast path:** README → `PROJECT-STATUS.md` →
`08-implementation-guide.md` → the roadmap phase you're on → the intent file
(01–05) for whatever you're building. Install
[gsap-skills](https://github.com/greensock/gsap-skills) before writing motion
code. Files 01–07 are *why/what*; 08–09 are *how*.

## Relation to the root docs (do not duplicate them)

The root of `PORTFOLIO/` holds earlier canon that **still governs**:

- `PROJECT-STATUS.md` — what is actually built; gotchas; blockers. Always current.
- `ELEMENT-CRAFT-SPEC.md` — the craft standard (authentic form → blueprint →
  3D + material + light) and construction specs for the Telugu/Hindu elements.
- `MOTION-CHOREOGRAPHY.md` — motion tokens (durations/easings) and beat sheets.
  Largely unimplemented; `03-manga-navigation.md` here **supersedes its
  navigation model** (page-flip volume replaces some camera-flight beats) but
  inherits its motion tokens and micro-interactions wholesale.
- `DESIGN-FLOW-BLUEPRINT.md` — v0.1 blueprint. Its locked decisions carry
  forward **except** where `03-manga-navigation.md` marks a revision.
- `ART-BRIEF.md` — AI-art prompt anchor for illustration generation.

Rule: **status lives in PROJECT-STATUS.md; intent lives here.** When intent
changes, edit the masterplan file *and* leave a dated `[REVISED YYYY-MM-DD]`
marker, the same convention the root docs use.

## Locked decisions inherited (never re-litigate without Krishna)

- One palette only: gold + saffron + kumkum (`portfolio/lib/palette.ts`). No day/night.
- Telugu **always** paired with English, never standalone.
- 24-fold angular rule on the chakra (12/24/48).
- Ramayanam = research · Mahabharatam = dev/hackathons.
- Every element authentically researched and ornate — never plain shapes
  (`ELEMENT-CRAFT-SPEC.md` recipe: authentic form · construction · material · motion).
- Panels near-opaque (~97%); manga panel is the layout unit everywhere.
- Personal side = two looks only: Tollywood painted-poster + 90s anime cel.
- **[2026-07-30] The page-turn is a PORT, and stays one.** `lib/curlSource.ts` is
  SimpleBookCurl (Raymond Luckhurst, MIT) line for line — source URLs in
  `06-references.md` §6.2, mechanics in `08-implementation-guide.md` §8.4. Both
  artefacts Krishna has reported came from hand-tuning it, never from a gap in it.
  When the curl looks wrong, **diff against upstream before inventing a fix.**
  Flat `rotateY` and nested CSS strips are dead ends, rejected on sight; never
  propose either again.

## Update protocol for future agents

1. Read this README, then `PROJECT-STATUS.md`, then the file for your area.
2. Build. Run `npx tsc --noEmit` after every edit (sandbox cannot `next build` —
   it needs to fetch the linux SWC binary and has no network for it).
2b. Never run `git`. Krishna does all git operations himself.
3. Before finishing: update `PROJECT-STATUS.md` (state) and the relevant
   masterplan file (intent), dated. Never let the two drift.
4. New reversals go to the file's own "Reversed decisions" section — reversals
   are kept, not deleted; they are the project's memory of *why*.
5. **If you defer a seam, log it.** Any time you build something that will later
   need to be joined to something else — and leave the join for later — add it to
   the Phase 6.5 debt register in `07-roadmap.md` in the same change. An unlogged
   seam is how "we'll put it together afterwards" quietly becomes "we didn't".
