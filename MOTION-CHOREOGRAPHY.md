# Motion & Transition Choreography — v0.1

The beat-by-beat spec for every move in the world. Companion to `DESIGN-FLOW-BLUEPRINT.md`. Timings are targets to feel right, not gospel — we'll tune in build.

---

## 0. Motion tokens (one shared language)

**Durations**
- `micro` 180ms — hovers, cursor states
- `short` 320ms — small reveals, peeks
- `base` 560ms — standard transition
- `long` 900ms — scene changes
- `epic` 1500ms — landing, camera flights

**Easing curves**
- `ink` `cubic-bezier(.7,0,.2,1)` — brush accelerate-then-drag (the house curve)
- `soft` `cubic-bezier(.22,1,.36,1)` — gentle settle with slight overshoot
- `brush` `cubic-bezier(.65,0,.35,1)` — symmetric wipe
- `field` linear — continuous ambient/parallax loops

**Rhythm:** stagger children 70ms. Secondary motion on everything (cloth sway, float, overshoot). Long calm holds between big moves — restraint is the point.

---

## 1. Boot → Landing  (`epic`, ~4.2s, ink)

- `0.0s` black ink field; page silent.
- `0.3s` a single sumi-e stroke **paints the కృ seal** at center (stroke-draw, `ink`), faint conch swell begins (if audio on).
- `1.4s` seal **pulses** once (scale 1→1.08→1, `soft`); ring completes.
- `1.7s` ink **blooms outward** from the seal — a screentone shockwave wipes black → paper (`brush`, 700ms).
- `2.4s` camera **pulls back** revealing the hero diorama (Krishna sarathi + Kurukshetra dawn); toranam drops in with cloth sway (`soft`, staggered leaves).
- `3.1s` title **inks in** (Telugu name then KRISHNA SAI), SFX pops (`ink`).
- `3.8s` seal **shrinks to hub corner**; idle state begins (world breathing).
- Reduced motion: cut straight to `3.8s` end-state, no bloom.

---

## 2. Landing → Hub idle + chakra menu

- Seal now lives in a corner as the **hub anchor**.
- **Open menu** (`short`, soft): click/hover the seal → a **Sudarshana-chakra wheel** unfolds from it, spokes spinning in (rotate -40°→0°, scale 0.6→1, stagger 60ms). Slow idle spin (`field`, 60s/rev).
- **Hover a spoke** (`micro`, soft): wheel **slows to a stop**, that spoke lifts + gold-foil glow, and a **peek** of the destination art fades in behind (opacity 0→0.9, slight parallax). Soft tick sound.
- **Leave**: wheel resumes idle spin, peek fades.
- **Close**: chakra **retracts into the seal** (reverse), `short`.

---

## 3. Hub → Epic  (`long`, ink)  ·  the signature move

- `0.0s` chosen spoke **flares**; a black ink brush **wipes across** the screen L→R (SVG mask, `brush`, 520ms), covering everything at mid-point.
- `0.25s` under cover, camera **dollies** from hub into the epic location; lighting shifts to the epic key color (saffron / Krishna-blue).
- `0.55s` ink **wipes away** revealing the epic scene; the first project panel **inks in** (stroke-draw + fade, staggered).
- Audio: brush swish at wipe, low drone shifts pitch to the epic.
- Reduced motion: crossfade 200ms, no camera move.

---

## 4. Inside an epic — panel ↔ panel  (`base`, ink)

The epic shows **one project panel at a time** on the persistent stage (not a grid).
- Advance (wheel/arrow/drag): current panel **slides + peels** off like a turning cel (rotateY 0→-18°, x-shift, fade), next panel **inks in** from the opposite side. Camera holds.
- A thin **chapter counter** (Adi 01 / N) ticks with a stamp.
- Parallax background nudges with the change for depth.

---

## 5. Epic → Project book  (`long`, ink)  ·  go deep

- Selected panel **lifts off the stage** toward camera (scale up, `soft`).
- Its cover **opens like a book** (spine hinge, rotateY page peel, `ink`, 700ms); camera **pushes through** the opening.
- Lands on the book's **page 1**; ambient narrows (vignette in).
- Audio: paper rustle.

---

## 6. Book page-turn  (`base`, ink)  ·  right-to-left (manga)

- Drag/click right→left: the top page **curls and turns** (3D page-flip with a soft shadow under the lifting page), revealing the next spread.
- Momentum: a fast flick turns 2–3 pages with decaying speed (`ink`).
- Last page → a "close book" affordance returns to the epic (reverse of §5).

---

## 7. Any → Personal  (`long`, style dissolve)

- Not an ink wipe — a **tonal shift**: the ink world **desaturates and washes** into the personal palette (color grade + paper-to-poster texture crossfade, `soft`, 800ms). Signals "off the clock."
- Lands on the Personal hub: two doors — **Movies** (Tollywood poster) and **Anime** (90s cel); bikes/cars sit within Movies-style.
- Audio: drone softens to a warmer pad.

---

## 8. Personal sub-scenes

- **Movies / bikes & cars** — enter = a **film-poster unfurl** (poster drops in with a paint-splash reveal); items are poster cards with painted texture; hover tilts with a glossy sheen.
- **Anime** — enter = a **cel wipe** (hard-edged horizontal cel bands sweep in); flat cel color, visible linework; hover does a 2-frame "anime blink" pop.

---

## 9. Any → Contact  (`base`, ink)

- Elements **collapse toward the seal**, then a final **stamp**: the కృ seal presses down center-screen (kumkum press, scale + ink splat), and the contact colophon inks in around it.

---

## 10. Collapse → Hub  (`base`, ink)

- Reverse of whatever's open: panels/pages **fold back into the seal** (scale→0 toward the hub corner, `ink`), world returns to idle. Always available.

---

## 11. Micro-interactions

- **Cursor = కృ seal**: idle = small seal + faint brush trail; over interactive = **grows 1.4× + ring completes + gold glow** (`micro`); click = **stamp** (scale 0.9 + ink splat + haptic tick). Hidden on touch / reduced-motion.
- **Box hover-highlight**: panel lifts 4px, gold-foil edge glow, a screentone fill **sweeps** across once (`micro`).
- **Idle breathing**: whole scene has a ±0.5% scale + slow parallax so it's never dead-still.

---

## 12. Background reactivity (continuous, `field`)

- Parallax: 3–4 depth layers offset to cursor (max ±14px, eased follow).
- Particle field: mango leaves (day) / embers (night) drift; within ~120px of cursor they **scatter** (repel force), then rejoin.
- Slow cursor moves leave a faint **shader ripple** on the paper.
- All capped, DPR-clamped, paused when tab hidden or scene offscreen.

---

## 13. Reduced-motion & low-power

Every beat above has a static fallback: no camera flights (crossfade), no page-flip (instant), no particles/ripple, cursor reverts to system. The story reads identically — it just doesn't move.
*(day/night was dropped — one palette only.)*

> **[STATUS 2026-07-20] This document is largely UNIMPLEMENTED.**
> What exists in `portfolio/`: a slow constant chakra spin, scroll-reveal on
> panels (`Reveal.tsx`, one-shot, with a `prefers-reduced-motion` path), nav +
> parva-counter section tracking, and a drifting background field.
> What does **not** exist: camera flights, ink-brush chapter wipes, page-flip
> transitions, particles, the conch ripple, custom cursor, the crystal's
> section morph, and any scroll-driven reaction in the chakra (its spin rate
> and scale are constant). Treat this as a spec to build against, not a record
> of what's there.

---

## 14. Audio cue map (if enabled)

- Landing: conch swell → soft bloom whoosh.
- Ink wipe: brush swish. Page open/turn: paper rustle.
- Chakra hover: wooden tick. Contact stamp: dull thud.
- Bed: a low temple drone that shifts tone per epic (saffron warmer, blue cooler); warm pad on Personal. Master toggle, off by default.
