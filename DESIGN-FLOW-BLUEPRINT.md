# Design & Flow Blueprint — v0.1

Studio-level design bible for the manga × Hindu × Telugu portfolio (v2). This is a **living document**: we iterate it until the flow, motion and art direction are locked, and only then build. Nothing here is final — it's the thing we argue over.

Target quality bar: [Alche](https://alche.studio/) / [Cappen](https://cappen.com/) — a crafted 3D world with continuous flow, reactive motion, and bespoke textured elements.

---

## 1. Concept & principles

**The promise.** The portfolio is not a website you scroll — it's a *manga world you move through*. One stage, always present; you turn and flip through it like reading a living volume, guided by Hindu-epic structure and Telugu craft.

**Five principles (every decision checks against these):**
1. **One stage, many states.** The screen is a persistent canvas. Content *transitions in place* — it never stacks into a scrollable document.
2. **Flow over pages.** Moving between things is a choreographed transition (flip / ink-morph / camera move), never a cut or a jump.
3. **Everything is crafted.** No flat solid shapes. Every element carries real texture — ink bleed, paper grain, gold foil, brush edges.
4. **Alive & reactive.** The world breathes and responds to the cursor; the కృ seal *is* the cursor.
5. **Two voices, one world.** Professional = disciplined ink/seinen manga. Personal = a warmer, different style — clearly "off the clock," still in the world.

---

## 2. The stage model

A single WebGL stage (react-three-fiber) holds a **camera** and a set of **scenes**. Navigation = the camera/state moving between scenes; the DOM/overlay content for each scene flips in over the 3D world. Think "diorama you fly through," not "pages you scroll."

- **Persistent layers (always on):** background world (reactive, parallax, particles), the కృ cursor, ambient audio (toggle), the nav origin (see §4).
- **Transient layer:** the active scene's panel/art/text, which *transitions out* as the next *transitions in*.

> **LOCKED: (b) Diorama shell + (a) page-flip inside project books.** A 3D world (temple courtyard / Kurukshetra) the camera flies through between scenes; going deep into a project opens a literal flip-through manga book. A world to move through, plus real page-turns where you go deep.

---

## 3. Flow / scene graph

Every state and how you move between them (see the visual map rendered alongside this doc).

```
                         ┌─────────────┐
                         │  LANDING     │  intro bloom from the seal-origin
                         └──────┬───────┘
                                ▼
                         ┌─────────────┐
        ┌───────────────│  HUB / INDEX │───────────────┐   (the origin point; nav lives here)
        │                └──────┬──────┘                │
        ▼                       ▼                        ▼
 ┌────────────┐         ┌────────────┐            ┌────────────┐
 │ RAMAYANAM  │         │  ABOUT     │            │ MAHABHARATAM│
 │ (research) │         │ (the author)│            │  (dev)      │
 └─────┬──────┘         └────────────┘            └─────┬──────┘
       │ pick a project                                  │ pick a project
       ▼                                                 ▼
 ┌───────────────┐                                ┌───────────────┐
 │ PROJECT BOOK  │  flip through 3–6 inner pages   │ PROJECT BOOK  │
 │ (mini manga)  │                                 │ (mini manga)  │
 └───────────────┘                                └───────────────┘

        ┌─────────────┐            ┌─────────────┐
        │  PERSONAL    │──────────│  CONTACT     │   (personal = different art style)
        │ anime/tolly/  │           │ (colophon)   │
        │ bikes/cars    │           └─────────────┘
        └─────────────┘
```

Movement rules: HUB is the home state you always return to (the origin). Epics and About/Personal/Contact are one hop from HUB. Project books are one hop deeper from an epic and are the only place with internal page-flip. Every hop is a named transition (§6).

---

## 4. Navigation model (Alche-inspired)

- **The origin.** Navigation physically lives at one anchor — the **కృ seal**, which sits at screen-center during LANDING, then settles into a corner as the persistent **nav hub**. Everything blooms out of it and collapses back into it. This is the "point from where navigation goes" you described.
- **The chooser (LOCKED): a radial Sudarshana-chakra menu.** A spinning chakra wheel whose spokes are destinations; hovering a spoke slows the wheel and peeks that scene's art; clicking flies there. The chakra emerges from the seal and retracts into it.
- **No scrollbar.** Wheel / arrow / drag advances *within* a scene (e.g., flipping a project book's pages); it never scrolls a long document.
- **Always-home.** The seal is always clickable to collapse back to HUB — a constant safe anchor.

_(Chooser form locked above: radial chakra menu.)_

---

## 5. Landing sequence (beat sheet)

A ~4–5s "crazy landing" that eases into the hero and originates from the nav point:
1. **Black ink field**, a single brush stroke paints the కృ seal at center (sumi-e draw-on).
2. Seal **pulses**; ink **blooms outward** in a screentone shockwave, wiping to the paper world.
3. Camera **pulls back** to reveal the hero scene (Krishna sarathi + Kurukshetra dawn backdrop), toranam settling in with a cloth-physics sway.
4. Title (Telugu name + KRISHNA SAI) **inks in**; SFX pops.
5. Seal **shrinks to its hub corner**; the mala beads bloom out. Idle state = the world breathing, reacting to cursor.

Reduced-motion path: skip to step 3 end-state instantly.

---

## 6. Motion & choreography language

**Transition vocabulary (one named move per hop):**
- HUB → epic: **ink-brush wipe** + camera dolly into the epic's world (saffron / blue lit).
- Epic → project book: **page lifts and opens** (3D page-flip), camera pushes in.
- Within book: **page turn** (right-to-left, true manga).
- Any → Personal: **style dissolve** — ink desaturates into the warmer personal palette (signals the tonal shift).
- Any → HUB: elements **collapse back into the seal**.

**Timing & easing language:** brush moves accelerate then drag (custom cubic-bezier ~ .7,0,.2,1); reveals stagger 60–90ms; secondary motion on everything (cloth sway, float, overshoot). One consistent ink vocabulary — restraint between big moves.

**Cursor (కృ seal):** replaces the system cursor everywhere; a soft brush-ink trail follows; on hover of an interactive element it **grows + the seal ring completes**; on click it **stamps** (kumkum press). Hidden for touch / reduced-motion → normal cursor.

**Background reactivity:** parallax layers offset to cursor; particle field (leaves/embers) drifts toward or scatters from the pointer; a subtle shader ripple follows slow cursor moves. All GPU, capped, paused offscreen.

**Box hover-highlight (your ask):** panels lift, gain a gold-foil edge glow + a screentone fill sweep on hover.

---

## 7. Art-direction & texture system

**Palette:** aged paper, ink black, kumkum red, turmeric gold, indigo; **saffron = Ramayanam, blue (Krishna) = Mahabharatam**; green only in mango-leaf motifs.

**Texture treatments (the "not flat" upgrade):**
- **Ink:** brush strokes with real bristle edges + bleed (AI sumi-e assets + SVG `feTurbulence`/`feDisplacementMap` for procedural edges).
- **Paper:** aged washi grain on every surface (texture map + grain shader).
- **Gold:** foil/leaf with a subtle animated sheen (gradient + noise mask).
- **Halftone:** proper screentone dot fields, size-varied, not a flat pattern.

**Elements to re-craft (no more solid shapes):** toranam (real leaves + cloth sway + marigold depth), chakra (engraved metal + foil), bow/conch (inked with shading), kolam (chalk-on-floor texture), seal (carved stamp), panels (torn-paper edges + ink borders).

**3D look:** shallow depth, painterly; materials read as paper/ink/metal, not plastic; soft directional "temple light"; day = warm dawn, night = moonlit indigo + gold rim light.

**Voices (LOCKED) — personal side splits by facet:**
- **Professional** — black-ink seinen manga, disciplined, high-contrast.
- **Personal › Tollywood movies** — hand-painted **retro Telugu film-poster** style: bold, saturated, dramatic hero framing, painted brush texture.
- **Personal › Anime** — **90s cel-shaded anime**: clean linework, flat cel color, nostalgic.
- **Personal › Bikes & cars** — a "garage" set rendered in the **film-poster** style (proposed) so the personal side reads as two looks (poster + anime), not four.

All personal styles stay paper-based and in-palette so the world still feels like one book — just "off the clock."

---

## 8. Project manga-books

Each project opens into a **3–6 page mini manga-book** you flip through:
- Pg 1 — cover (title, chapter number, hero panel).
- Pg 2 — the problem (a "villain" framing).
- Pg 3–4 — the approach / key feats as action panels.
- Pg 5 — result + tech "astras" + links (repo/live).
Built once as a reusable book component; content per project from `data/projects.ts`.

---

## 9. Tech architecture

- **react-three-fiber + drei + postprocessing** for the 3D stage; **GSAP** for choreography timelines; **Lenis** only where intra-scene inertia helps; **Framer Motion** for DOM overlays.
- **State router** (not URL-scroll): a scene-state machine (Zustand) drives camera + which overlay is mounted; deep links still map to scenes for shareability.
- **Asset pipeline:** AI art → cut-out → texture pass → compressed WebP/KTX2 (draco/basis for 3D); everything lazy per scene, preloaded one hop ahead.
- **Performance budget:** first meaningful paint fast (landing is light); heavy scenes stream in behind transitions; capped particles; `prefers-reduced-motion` + low-power fallback to a flatter 2D version. Target: smooth 60fps on mid laptops, graceful on mobile.

---

## 10. Roadmap

**Design phase (now — no code):**
1. This blueprint (v0.1 → locked) ← we are here
2. Visual flow map (rendered)
3. Art-direction & texture bible (with texture samples)
4. Motion & transition choreography spec (beat sheets per hop)
5. Storyboards for 5 key scenes
6. Lock decisions A/B/C and the slice-1 scope

**Build phase (after design lock):**
7. Slice 1 — landing + hub + one epic scene + కృ cursor + reactive bg + one textured element, with your first AI art.
8. Scale to all epics, project books, personal side, contact.
9. Polish, performance, deploy.

---

## 11. Open decisions (need your call)

**Locked:** A = Diorama + inner books · B = radial chakra menu · C = personal splits into Tollywood-poster (movies + bikes/cars) and 90s-anime (anime).

**All resolved:**
- **D — Audio: IN.** Subtle ambient temple drone + soft brush/conch on transitions; off by default with a toggle.
- ~~**E — Day/night: KEEP.** Time-based auto theme inside the 3D world (warm dawn / moonlit indigo + gold).~~
  **[REVERSED 2026-07-19] Day/night is OUT.** One festive palette only — gold +
  saffron + kumkum — defined in `portfolio/lib/palette.ts`. The auto-theme
  script, the `cosmic` easter-egg hour and all three theme variants were
  deleted. Reason: the switching split the design's identity and the dark
  variant fought the temple palette. Do not reintroduce without revisiting this.
- **F — Bikes & cars: film-poster style.** Personal side = two looks (Tollywood poster + 90s anime).

Every fork is now locked. Next design deliverables: motion choreography spec (`MOTION-CHOREOGRAPHY.md`) and storyboards for the five key scenes.
