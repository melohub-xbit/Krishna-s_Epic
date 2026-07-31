# 09 · Manga scripts — turning a project into readable pages

Each project book is a **4–6 page manga the visitor actually reads**: click
the project's panel → its book opens → flip RTL through pages of koma that
tell the project as a story. This file is (a) the authoring method, (b) the
script format, (c) two complete scripts to copy the pattern from. Scripts
compile to the `MangaScript` schema (§8.6) in `data/mangaScripts.ts`.

## 9.1 The five-beat structure (every book, no exceptions)

| Pg | Beat | Grammar |
|----|------|---------|
| 1 | **Cover** | Splash panel (bleed), title + SFX word, mon top-right, chapter no. in Telugu + English |
| 2 | **The villain** | The *problem* personified. Dark, screentone-heavy, diagonal gutters. Never a competitor — always the problem itself |
| 3 | **The turn** | The insight that breaks the problem. One hero panel for the idea; formula/architecture as a mantra cartouche |
| 4 | **The battle** | The work: feats as action panels, speed lines, real numbers as SFX lettering |
| 5 | **The seal** | Results stamped with the hanko; astras (tech) as a weapons-scroll strip; REPO/LIVE as colophon marks. Ensō closes if the project is "complete" |

Optional pg 6: an omake-style footnote panel (what broke, what you'd redo —
honesty panel; use sparingly, it's the most human page).

## 9.2 Writing rules

- Captions ≤ 18 words, present tense, no marketing voice. The feat text in
  `projects.ts` is the *source*, never pasted verbatim — scripts compress it.
- Numbers are the loudest thing on the page: render metrics as SFX lettering
  ("65% → 85.7%", "20% PRUNED", "r = 0.08").
- SFX are English onomatopoeia in manga lettering. No fake Japanese.
- Telugu appears as chapter numerals + one thematic word per cover, always
  paired with English (locked rule).
- Panels may be type-only (no art). A book with strong typography and two
  illustrated panels beats six mediocre AI images. Art prompts go through
  `ART-BRIEF.md`'s style anchor; add `--sref` from ART-01 for consistency.
- Research projects (Ramayanam) narrate as *tapasya* — patient, measured
  pacing, wide gutters. Dev/hackathon projects (Mahabharatam) narrate as
  *yuddha* — tight gutters, diagonals, speed.

## 9.3 Script format (authoring markdown → compiled to schema by hand)

```
PAGE n  [gutter: tight|normal|wide]
  PANEL n.1  [shot / size / flags]
    ART: description or "none — type panel"
    CAPTION: …
    DIALOGUE (speaker): …
    SFX: …
```

---

## 9.4 Complete script — DALSP (Ramayanam · research register)

```
PAGE 1  [gutter: normal]                                  — COVER
  PANEL 1.1  [splash / hero / bleed]
    ART: a vast banyan of glowing neuron-branches under a pruning moon;
         a small figure with shears stands before it. Seinen ink + screentone.
    SFX (title): DALSP — "కత్తిరింపు · THE PRUNING"
    CAPTION: Chapter I. Every domain pays for every neuron. Someone must cut.
    [mon: half-pruned 24-branch tree, top-right, stamped]

PAGE 2  [gutter: wide]                                    — VILLAIN
  PANEL 2.1  [establishing / wide / diagonal, screentone]
    ART: Phi-3.5-mini as an armoured colossus, magnificent and too heavy to
         kneel; MLP blocks as armour plates.
    CAPTION: The giant answers law, math, code alike — carrying all of its
             weight to every fight.
  PANEL 2.2  [closeup / third]
    ART: none — type panel
    DIALOGUE (the giant): All of me. Always.
    SFX: H E A V Y

PAGE 3  [gutter: normal]                                  — THE TURN
  PANEL 3.1  [closeup / hero]
    ART: a lantern held to the branches; some blaze, some never light.
    CAPTION: Entropy is a lantern. Branches that never light for a domain
             were never needed by it.
  PANEL 3.2  [insert / third]
    ART: none — mantra cartouche
    SFX (cartouche): H(X) = −Σ p log p
    CAPTION: An information-theoretic razor — Wanda, questioned and extended.

PAGE 4  [gutter: tight]                                   — BATTLE
  PANEL 4.1  [action / wide / speedlines]
    ART: the shears close; branches fall as clean ink strokes.
    SFX: 20% PRUNED
  PANEL 4.2  [action / half / diagonal]
    ART: four slimmer silhouettes step out of the giant's shadow:
         General, Math, Code, Law.
    CAPTION: Not one smaller giant — four specialists.
  PANEL 4.3  [insert / third]
    SFX: NO RETRAINING.

PAGE 5  [gutter: wide]                                    — SEAL
  PANEL 5.1  [closeup / hero]
    ART: the hanko pressed beside the pruned tree, ensō closing around it.
    CAPTION: Specialised subnetworks, carved — nothing relearned.
    [astras strip: Python · PyTorch · LLMs · Pruning · Shannon Entropy]
    [colophon: REPO → github.com/melohub-xbit/Domain-Aware_Layer_Sensitivity_Pruning]
```

## 9.5 Complete script — HFT SIM (Mahabharatam · battle register)

```
PAGE 1  [gutter: tight]                                   — COVER
  PANEL 1.1  [splash / hero / bleed / speedlines]
    ART: a candlestick chart forged into a blade mid-swing; order-book rungs
         as the hilt. Sparks are tick data.
    SFX (title): HFT SIM — "వేగం · SPEED"
    CAPTION: Chapter VII. The market never sleeps. Neither can the engine.

PAGE 2  [gutter: tight]                                   — VILLAIN
  PANEL 2.1  [establishing / wide / diagonal, screentone]
    ART: the order book as a waterfall demon — bids and asks as two
         colliding torrents.
    CAPTION: Ten thousand orders a heartbeat. One slow match and the
             torrent walks over you.
    SFX: R U S H

PAGE 3  [gutter: tight]                                   — TURN + BATTLE (merged: yuddha pacing)
  PANEL 3.1  [action / half]
    ART: a smith's anvil striking — each spark a matched order.
    CAPTION: A matching engine forged first; everything else serves it.
  PANEL 3.2  [action / half / speedlines]
    ART: none — type panel
    SFX: MATCH! MATCH! MATCH!
  PANEL 3.3  [insert / third]
    CAPTION: Price-time priority. No order jumps the queue — dharma of the book.

PAGE 4  [gutter: wide]                                    — SEAL
  PANEL 4.1  [closeup / hero]
    ART: the blade sheathed; the chart calm behind it. Hanko stamp.
    CAPTION: An exchange that keeps its word at speed.
    [astras strip: from projects.ts]
    [colophon: REPO link]
```

## 9.6 Production order & status table

Write scripts for flagships first (P5): DALSP ✍ done · HFT SIM ✍ done ·
RACS · EEG·ECG STRESS · PRISM WSI · MUTANT HUNTER — then the rest. Keep this
table updated:

| Project | Script | Compiled | Art |
|---|---|---|---|
| DALSP | ✅ §9.4 | ✅ 2026-07-30 | ☐ |
| HFT SIM | ✅ §9.5 | ✅ 2026-07-30 | ☐ |
| all others | ☐ | ☐ | ☐ |

**[2026-07-30] Both scripts are compiled and readable in the browser**, in
`portfolio/data/mangaScripts.ts`. Every panel is type-only, which §9.2 explicitly
allows — the art description from each script is preserved on the panel as
`artNote`, unrendered, so the prompt sits next to the panel it belongs to rather
than in this file. Setting a panel's `art` key makes it use a real image and ignore
the note. Renderers: `components/book/BookPage.tsx` (koma grid + cover treatment)
and `components/book/MangaBook.tsx` (the shell). A book reuses `CurlVolume`, so it
turns with the same curl as the volume — see 08 §8.4.

Two things a new script must not do: restate anything already in `projects.ts`
(title, mon, astras, links — the renderer pulls those, and a second copy is how a
book ends up contradicting the index page that links to it), and assume five pages
(HFT SIM merges the turn and the battle into one page because yuddha pacing says
so, and is four pages).

**[REVISED 2026-07-30] Unscripted projects no longer render a panel anywhere** —
the epic pages became chapter indexes, so `feat` and the astras strip lost their
home. An index row is title + sub + mon. That is correct for a project whose detail
moved into a book, and a straight content loss for the 18 that have no book.

So the fallback has to be a BOOK, not a panel: auto-generate a two-page record book
from `projects.ts` — a cover from title/sub/mon, then a record page carrying `feat`,
the astras strip and the links. Every row opens something; scripted projects get the
manga treatment and the rest get a clean record. This is v1 launch item 1 in
`07-roadmap.md`.

**And a gap in the scripts themselves.** A compiled script is the STORY register —
DALSP's book is metaphor plus two numbers. A portfolio book also needs the RECORD:
what was measured, against what, and what came out. §9.1 beat 5 currently carries
astras and links but no results. Every book wants both registers; give the seal page
the numbers, or add a record panel to beat 5.
