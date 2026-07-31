# 05 · Omake — the personal spread (anime · Tollywood · bikes & cars)

Real manga volumes end with **omake** (おまけ): bonus pages where the mangaka
drops the serious style, draws themselves loosely, and talks about what they
love. That is *exactly* this section — it's not a "hobbies grid", it's the
author's omake pages. This framing decides every design call below.

Locked inheritance: personal side = two looks only — **Tollywood painted
poster** (movies + bikes & cars) and **90s anime cel** (anime). Both stay
paper-based and in-palette ("off the clock, same book").

## 5.1 Entry — the style dissolve

From any professional spread → omake: not an ink wipe. The seinen ink
**washes out** — linework loosens, screentone coarsens, colour warms
(`soft`, 800ms) — landing on a hand-scrawled omake title panel:
"అభిరుచులు · OFF THE CLOCK" with a chibi self-portrait sketch (the one place
a loose, doodled style is correct; mangakas draw themselves as scribbles).

## 5.2 The three omake pages

**Anime (90s cel look).** Cel-band wipe entry (hard-edged horizontal bands).
Content as a **shelf of tankōbon spines** — favourite series as book spines
the visitor pulls; pulling one opens a small cel-styled panel: why it matters,
one line, one frame-feel image treatment (flat cel colour, visible linework,
2-frame "anime blink" on hover). This is also where the site winks at itself:
a spine labelled "this website" pulls out a mini making-of panel.

**Tollywood (painted-poster look).** Poster-unfurl entry with paint-splash
reveal. Favourite films/heroes as a **wall of painted mini-posters** — bold
saturated brushwork, dramatic hero framing, hand-painted Telugu title
lettering (the old-school poster-painter tradition — a real dying craft;
honouring it IS the design). Hover = glossy sheen tilt.

**Garage (bikes & cars, poster look).** A pit-lane spread: machines rendered
as painted posters with spec-sheet cartouches (the manga *mecha data page*
grammar — cutaway callouts, stat strips). Initial D / speed-line energy in
the panel borders; kikkō pattern on the "garage wall".

## 5.3 Data & build

- New `data/personal.ts`: `{ anime: [...], films: [...], machines: [...] }`
  with per-item note + link. **Needs Krishna's actual lists — collect before
  building** (favourite anime, films/actors, specific bikes/cars).
- Art via `ART-BRIEF.md` pipeline with two new style anchors (poster + cel)
  added to that file when this phase starts.
- The omake spread sits at page 9 of the volume (§03.2) and uses the same koma
  reveal machinery — only the skin changes.
