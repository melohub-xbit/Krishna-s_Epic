# 04 · The mon system — an individual manga identity per project

**[CLARIFIED 2026-07-20]** Krishna's core ask is that each project *opens as
a readable manga* — flip its pages, read its panels, get the whole project.
That deliverable is the **project book**: mechanics in `08-implementation-
guide.md` §8.6, content authoring in `09-manga-scripts.md`. This file covers
the *crest layer*: every book carries a hand-designed kamon (its mon) + the
shared chapter furniture below. Mon = the project's emblem; the book = the
project's manga. Mon are exactly what kamon are for —
compressing an identity into a bounded emblem — and they rhyme with Hindu
sigils (the conch and bow already work this way).

## 4.1 Mon design rules (all mandatory)

1. **Maru (circle) enclosure**, single ink weight inside; reads at 48px AND
   rewards zoom at 480px (ornate interior detail — the [[detail-standard]]).
2. Built from the project's *actual mechanism*, not its logo. Authentic-form
   research applies to the metaphor chosen.
3. Stroke-drawn on first reveal (brush-mask system §02.8); stamped in kumkum
   when its chapter is "read" (visited).
4. One shared geometry kit (the 12/24/48 angular rule where radial) so the set
   reads as one crest family.
5. SVG, procedural where possible, coordinates rounded (`n3()` — hydration).

## 4.2 The crest roll (draft blazons — iterate in build)

**Ramayanam (research):**

| Project | Mon (blazon) |
|---|---|
| DALSP | A tree of 24 branches, half pruned clean — cut branches end in tiny scissor-marks; entropy dots thin toward the cut side |
| RACS | A lotus compass: needle between a full bloom (known) and a bud (cold item), risk ring dotted |
| EEG·ECG STRESS | Two interleaved waves — one spiked (EEG), one slow (ECG) — crossing but never touching (r = 0.08 made visible) |
| VIDEO ANALYTICS | A film-frame maru containing a running stick figure of joined pose-keypoints |
| PRISM WSI | A microscope lens as a mandala; tile grid visible in the glass |
| MoML | Three arrows converging on a Pareto arc, none reaching the same point |
| MUTANT HUNTER | A bug split by a test-tick blade; mutation strands as whiskers |
| DEVOPS DEBUG | A broken pipeline knot (kolam-style unending line, one strand snapped, one repaired) |
| NIVIQURE | A waveform emerging from a cracked-open bin/box — the reverse-engineered format |
| ML B120 | An ensemble fan: five stacked cards, gradient-boosted trees as leaf-veins |
| OS REGISTRAR | A three-key ring (admin/student/faculty) around a ledger |

**Mahabharatam (dev/hackathons):**

| Project | Mon (blazon) |
|---|---|
| MATRIX OF TRUTH | A magnifying glass over a halftone field where dots resolve into truth/false glyphs |
| DesAIgner | Two brushes crossed over one canvas, strokes interleaving mid-stroke |
| SELLORITA | A conch as a megaphone (the herald's shankha — announcement rhyme) |
| HFT SIM | A candlestick chart as a blade edge; order-book rungs as the hilt |
| DIALECTO | Two speech bubbles, Telugu 'అ' and Latin 'A', yin-yang interlocked |
| MediAssist | A stethoscope coiled into a chakra |
| PLUGIN LIVE | A mic within concentric assessment rings (seigaiha-wave rhyme) |
| relayBrain | A brain as a relay-baton passed between two hands |
| DAPI | A torii-shaped bridge between two scripts |

Experience/roles (Samsung Lab, NIMHANS, hackathon badges) reuse their parent
project's mon with a **ribbon** (kanmuri) added above the maru — rank marks,
not new crests.

## 4.3 Chapter treatment (per project, inside its book §03.4)

Every project book gets the same manga furniture, populated from
`data/projects.ts` + a new `mon.tsx` registry:

- **Cover:** mon top-right (hanko position), chapter number in Telugu +
  English, title with its SFX word in display lettering, one hero panel.
- **The villain:** the problem framed as an antagonist in one dark panel
  (screentone-heavy, diagonal gutters for menace).
- **Action spreads:** feats as impact panels — speed lines, SFX lettering
  (English onomatopoeia in manga style; no fake Japanese), diagonal koma.
- **The astra page:** tech stack as weapon-scroll items, each named in a
  cartouche.
- **Result stamp:** outcomes stamped with the Velidanda hanko; links as
  printed colophon marks (REPO / LIVE).

## 4.4 Build order

Mon are pure SVG + data — **they can be built before the navigation refactor**
and dropped into the current scroll site's panels immediately (roadmap Phase
2), giving visible progress while the volume shell is under construction.
Registry: `components/ornament/Mon.tsx` exporting `<Mon id="dalsp"/>`;
blazon comments beside each so future agents know the *meaning*, not just the
paths.
