# 04 · Progress

> ## CURRENT FOCUS
> All content is in and every figure is verified. The work section is now a
> deck of bounty posters you turn by scrolling; About hangs on a scroll with
> the record around it; Skills are barcode bands. Next: favicon, OG image,
> a11y pass, deploy.

Legend: `[x]` done · `[~]` in progress · `[ ]` not started · **⚑** needs
Krishna's eye.

---

## Done

- [x] Next.js App Router + TypeScript + Tailwind v4, at `site/`.
- [x] **Palette in one file** — `src/lib/palette.ts`. Four palettes, light and
      dark each, emitted as CSS vars and read by CSS, Tailwind and canvas.
      Swap by changing `ACTIVE`.
- [x] Fonts self-hosted via next/font — Instrument Sans, DM Mono, Noto Sans
      Telugu.
- [x] **The dot engine** — `src/lib/dots.ts`. Mask sampling, batched fills,
      one shared ticker.
- [x] `DotText`, `DotNumber`, `DotMark`.
- [x] Row dot-sweep and reveal — pure CSS.
- [x] Dot cursor, five-dot nav rail, theme toggle, reduced-motion path.
- [x] All 22 projects with marks, grouped research / built.
- [x] **The deck** — the whole work section is one fan of 22 bounty posters.
      A tall section with a sticky pin; scroll turns the fan and the card at
      top centre is live. ~13 on screen at once, so you always see what is
      coming and what you passed. Nothing is hijacked — the browser scrolls
      normally and one number becomes one angle per card.
- [x] **Band it** — the last tenth of the deck's scroll is the exit: the fan
      squares into one stack, an accent band draws itself around it, and
      `22 · SEALED` sets beneath. Then the pin releases.
- [x] **Jump, not just walk** — a 22-tick rail under the fan; clicking a tick
      scrolls to that card. Clicking a card you can see but that is not live
      scrolls to it; clicking the live one opens it.
- [x] **The record** — a poster opens in place, filling the frame the deck
      already occupies, with the fan held behind it. Dot lattice draws across,
      kolam brackets settle, seal stamps, then content staggers after a held
      beat. No dialog, no route change. GitHub is a choice inside the panel,
      never automatic. Escape closes.
- [x] **Skills as barcode bands** — one band per group, one bar per tool,
      growing on reveal. Deliberately not a chart: there is no proficiency
      number anywhere on this site.
- [x] **About as a hanging scroll** — the prose hangs on a kakemono that
      unrolls downward on entry, with education, achievements and experience
      set either side as callouts with leader lines pointing in.
- [x] **No Telugu in the work section** — the posters carry the other half of
      the theme by themselves. Telugu stays in the wordmark, the section
      headings and the footer.
- [x] Muggu dot-lattice dividers between sections.
- [x] Full real content: education, experience, achievements, skills.
- [x] Résumés in `public/`, both linked.
- [x] Runs clean in dev.

## Next

- [ ] ⚑ Read the copy end to end — the About paragraphs are written in
      Krishna's voice by inference and want his edit.
- [ ] Confirm the contact email: the résumé says kvelidanda.1177@gmail.com.
- [ ] Favicon + OG image, from the dot wordmark. **Small job — do it early.**
- [ ] Accessibility pass: keyboard nav, focus order, reduced-motion parity.
- [ ] Lighthouse budgets in CI.
- [ ] ⚑ Deploy target, then deploy.

## Open questions

1. **Is there a personal section?** Anime, films, cars. Needs Krishna's lists
   and it is the one thing nobody else can research. Not currently in the
   five sections.
2. **Domain and host.**

## Deferred seams

Anything joined later gets written here, in the change that defers it.

- *(empty — keep it that way)*

## Log

- **2026-08-26** — Direction set: minimal, two colours, dots as the design
  language. Site scaffolded and built to a running state with all 20
  projects. Masterplan rewritten to match.
- **2026-09-06** — The field became **the whole site's background**: five
  stations — photo, photo, live project mark, barcode, Telugu name — morphing
  into each other by **radius, not opacity**. The dots never move; the screen
  redraws itself. The rail publishes its live project through `lib/field.ts`.
  Open: which Skills enclosure, and what Contact is.
- **2026-09-05b** — The halftone became **one fixed field for the whole
  page**, and the portrait now **travels**: it is painted into a slot in the
  hero and a second slot in the About projection, and the field maps it
  through a rectangle interpolated between the two as you scroll. Not a
  cross-fade — the same picture walks up the page, and its screen gets finer
  as it shrinks. Torch radius up to ~a quarter of the viewport.
- **2026-09-05** — New front door: a **halftone of the photograph with a
  colour torch under the cursor**, a **boot log**, then the **name wall** with
  Velidanda in it. New `Halftone` component — reusable, and with no `src` it is
  a flat lattice, which is the same component ready to sit behind the rest of
  the site. `DotText` retired; the wall is the wordmark now.
- **2026-09-04** — The deck is gone. A pinned section that holds your scroll
  for eleven screens is the opposite of optional, so **work is now a
  horizontal rail** you can step into and out of, with the record redrawn as
  the poster itself, grown, opening out of the card you clicked. **About is
  now a projection**: an Apple liquid-glass base throwing a Nothing-style
  dot-matrix projection of the photo, with the callouts around it. **About
  now comes before Work.**
- **2026-09-03** — Photos in. The two pinned story sections (the thread, the
  method) removed: storytelling was meant to be the whole navigation, not one
  bolted-on chapter. Then three rounds of enclosure design, and the choices
  landed: **work = fanned deck of bounty posters, exit = band it; skills =
  barcode bands; about = hanging scroll with the data page around it.**
  Implemented. `WorkList`/`ProjectRow` retired to `_removed/`; the thread and
  method CSS, the legacy row, the figure rail and the old skills grid are all
  out of `globals.css` (~11 kB of dead rules gone).
