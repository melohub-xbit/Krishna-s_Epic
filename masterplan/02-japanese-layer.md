# 02 · The Japanese layer — every element, researched, paired

Each element follows the `ELEMENT-CRAFT-SPEC.md` recipe: **authentic form ·
construction · material · motion**, and enters only through a rhyme from
`01-ideology.md`. Fusion partner named for each.

---

## 2.1 The Telugu hanko (in-kan) — THE signature element

**Authentic form.** A hanko is a carved seal stamped in vermilion cinnabar
paste (shuniku); the carved style for formal seals is *tensho* (seal script),
dense and squared, inside a circular or square border. The red impression
authenticates authorship — a manga artist signs work with one.

**Ours.** Kumkum-red impression with authentic imperfection — slightly uneven
ink take-up at the edges (wabi-sabi; a perfect vector square reads fake).

**[REVISED 2026-07-20 — Krishna]** These are TWO seals, not one re-cut seal.
The earlier plan replaced the కృ mark with a వెలిదండ square everywhere; that
is reversed.

- **కృ seal — unchanged, and it stays the site's mark.** Already built
  (`ornament/Motifs.tsx` → `Hanko`). It keeps the nav anchor, the cursor, and
  the "chapter approved" mark on project covers. Do not re-cut it.
- **వెలిదండ nameplate seal — a NEW, additional seal.** Scope for now is the
  **landing sequence only** (§03); it may appear at a few other moments later,
  but nothing else should depend on it yet.

**Form: one line, a RECTANGLE — not a square.** All four aksharas run in a
single row at ~3.77:1. Both shapes are authentic hanko forms; the rectangle is
the one used for longer names, which four aksharas is. The width is *derived*
from the shaped aksharas rather than chosen, so the frame fits the name and no
letterform is stretched to fill a predetermined box. (A 2×2 square was built
first and rejected — it forced దం, a two-glyph cluster, into the same cell as
single aksharas.)

**[REVISED 2026-07-21 — Krishna] Where two strokes fuse, treat it as a stroke
CROSSING, not as a gap to add.** In the 700 weight, లి is one closed contour:
the ి runs into ల's shoulder and the akshara reads as a blob at seal scale. వె
has a clear gap between ె and వ, and that gap is what the eye uses to parse the
mark — లి had none.

Two attempts were rejected before this landed, and both failed the same way:
they *added a separation* to a merged shape. First a hand-placed straight slot
(wrong orientation, and unfixably so — the boundary between two strokes is a
curve, so a bar at any guessed angle reads as a scratch). Then a cut following
ల's shoulder — right that it was a curve, wrong curve: following the buried
stroke makes the consonant look nicked.

**The rule: keep the over stroke whole and let the under stroke break.** The ి
is a ring laid across ల, so it stays a ring and ల gives way where the ring
crosses — what one brush stroke over another actually looks like. The break is
then the over stroke's own edge and nothing is "added" at all.

**And measure the over stroke; never assume it.** The ring is recovered by a
least-squares circle fit to the outer silhouette's free arc (mean residual 2.5
units on r≈155 — it really is a circle), so continuing it through ల is
reconstruction, not invention. The fit refuses to cut if the residual grows past
6, because a loose fit would put the break where the stroke never went.
`CROSSINGS` in `scripts/build-seal.py`, font units. This does not reopen
"letterforms untouched": no control point moves.

Why the split is right: కృ is one akshara and reads instantly at 48px, which
is what a mark used at nav/cursor size has to do. వెలిదండ is a held, large
mark — it earns its width precisely because the landing is the one place the
seal is big and on screen long enough to be read.

**Construction.** SVG glyph outlines (Noto Sans Telugu Bold — the కృ conjunct
shaping is already verified) → squared/condensed manually toward tensho
proportions → `feTurbulence` + `feDisplacementMap` for stamp-edge grain →
one baked texture, reused everywhere. Fusion partner: mudra/seal tradition +
kumkum. **Never render it flat-perfect.**

## 2.2 Sakura — the transition particle

**Authentic form.** Five petals, each with a notched (cleft) tip — the notch
is what distinguishes sakura from plum (rounded) in mon design. Falling petals
= mono no aware; in samurai culture, the warrior's brief life.

**Ours.** Petals appear **only at moments of passage** — they burst from a
page edge during a flip and drift across the gutter, then settle and fade
(the kolam rhyme: beauty redrawn each dawn). NOT an ambient screensaver rain;
scarcity keeps the meaning. Palette-locked: petals in aged-paper white with a
kumkum blush at the notch, ink-outlined, halftone-shaded — printed petals, not
pink photo petals.

**Construction.** Instanced quads (r3f) with a petal texture from a single
inked SVG (notched tip, midrib); per-instance rotation + a falling-leaf
flutter (rocking around the petal's long axis, not tumbling — real petals
oscillate). 12/24 counts, honouring the angular rule.

## 2.3 Torii ∘ Torana — the double gate

**Authentic form.** Torii: two pillars, a curved top lintel (*kasagi*) with
upswept ends, a straight tie-beam (*nuki*) below; vermilion; marks sacred
threshold. Torana: catenary garland of mango leaves + marigolds (already
built — the catenary/cosh construction note in PROJECT-STATUS §4 stands).

**Ours.** Entering an epic = passing through a **fused gate**: torii posture
(pillars + kasagi silhouette) carrying a torana garland as its nuki. Vermilion
pillars = kumkum red, garland = the built mango-leaf string. One gate, both
thresholds. Used on the two epic gateway spreads only.

## 2.4 Ensō — the loop of the chakra

**Authentic form.** One uninhibited brushstroke circle; open or closed; the
open gap = deliberate incompleteness (fukinsei). Expresses mu, enlightenment,
the moment of creation.

**Ours.** (a) Loading/preloader: an ensō draws itself around the కృ seal
(DrawSVG stroke-draw with a real brush-texture mask — thick entry, dry-brush
exit, visible bristle streaks). (b) Section-complete moments: a faint ensō
closes around a finished chapter's mon. The ensō is always **hand-imperfect**:
generate 3–4 variants, pick per mount, never geometric-circle-with-brush-font.

## 2.5 Noren — the menu

**Authentic form.** Split fabric curtain at a threshold; a quiet kekkai
(boundary) that says "the space beyond is different"; carries the shop's mon.

**Ours.** The nav overlay = a **noren parting**: two indigo cloth panels (with
the Velidanda hanko printed as the shop-mon) drop in with cloth sway, then
part center-out to reveal the chakra menu. Close = curtains fall back.
Construction: two DOM panels with a cloth-wave displacement (small skew/wave
keyframes or a shader plane), stagger 70ms, `soft` easing.

## 2.6 Wagara — pattern vocabulary (extends the built set)

Already built in `Patterns.tsx`: asanoha, seigaiha, sayagata (+ kolam,
screentone). Additions, each with meaning that must match its use:

- **Kikkō** (tortoiseshell hexagons) — longevity/protection → background for
  the *skills/astras* block (armour rhyme; kikkō was literal samurai armour
  plating pattern).
- **Shippō** (interlocking circles, "seven treasures") — harmony/connections →
  the *contact* colophon backdrop.
- **Kanoko / same-komon fine dots** — already covered by screentone; note the
  rhyme so nobody adds a redundant pattern.

Placement rule: wagara for Japanese-format zones (page margins, book
endpapers), kolam for the world background. They meet only in the endpapers
(§03 spread map), where a kolam row and an asanoha row interleave — the §01
"sacred geometry" rhyme made visible, once.

## 2.7 The samurai register — discipline, not cosplay

Bushidō enters as *voice*, not swords on walls:

- **About spread** — framed as the author's code: eight virtues ↔ the
  kshatriya dharma; typeset as a hanging scroll (kakemono) panel with vertical
  rhythm, Rama's recurve bow inked beside it as the Indian counterpart.
- **Katana appears exactly once:** the *section divider stroke*. Between
  chapters, a single horizontal sword-draw flash (iaijutsu: draw–cut–resheath
  in one motion) renders as the ink rule that slices the old page away — this
  IS the page-cut transition accent, a 3-frame manga cut: white flash, black
  slash line, settle. Never a decorative sword graphic at rest.
- **Speed lines / focus lines** — the manga action grammar (already in the
  screentone shader) intensifies on interaction, the shōnen "impact frame."

## 2.8 Sumi-e brush system — the ink that draws the world

Every draw-on animation shares one brush language: strokes have entry pressure
(thick), dry-brush tails, bleed at stroke ends (feTurbulence displacement),
and **hesitate then commit** (`ink` easing curve `.7,0,.2,1` — the house
curve). Assets: 6–8 reusable brush-texture masks (PNG alpha), applied to any
SVG stroke via mask so *all* stroke-draws — Telugu title, ensō, gate outlines,
panel borders — look drawn by the same hand. Build these masks FIRST (roadmap
Phase 1); they are the single highest-leverage art asset.

---

## Rejected / guarded

- **Cherry-pink palette** — rejected; violates the one-palette lock. Sakura
  renders in paper/ink/kumkum.
- **Geisha/fans/lanterns/pagodas** — no rhyme, no entry.
- **Rising-sun ray motif** — too loaded + no rhyme; the chakra's prabha-mandala
  already owns radial fire.
