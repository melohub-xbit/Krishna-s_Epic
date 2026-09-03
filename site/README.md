# krishna-sai

The portfolio. Next.js App Router + Tailwind v4. Design language: everything
resolves out of dots.

## Run it

```bash
cd site
npm install
npm run dev
```

Open http://localhost:3000

> Run `npm install` **on Windows**, not from a Linux shell — installing from
> Linux into this folder puts Linux binaries where the Windows `next dev` will
> look for Windows ones, and `npm run dev` then fails in a confusing way.

---

## Changing the colour — one file

Everything is in **`src/lib/palette.ts`**. There is no second place where a
colour is written down.

**To swap the whole site**, change one line near the bottom:

```ts
export const ACTIVE: PaletteName = "mono";   // → "kumkum" | "peacock" | "turmeric"
```

**To tweak a palette**, edit its values in the same file.

**To add your own**, copy a block, rename it, and add it to `PALETTES`:

```ts
const mine: Palette = {
  label: "Mine",
  dark:  { bg: "#0b0b10", bg2: "…", fg: "…", /* …the other six */ },
  light: { /* … */ },
};

export const PALETTES = { mono, kumkum, peacock, turmeric, mine } as const;
export const ACTIVE: PaletteName = "mine";
```

`DEFAULT_MODE` in the same file decides whether the site opens dark or light
before the visitor touches the toggle.

### How it reaches everything

The palette object is turned into CSS custom properties once, in
`src/app/layout.tsx`, and injected into `<head>`. From there:

- **CSS** reads `var(--bg)`, `var(--accent)` and so on. No hex values appear
  anywhere in `globals.css`.
- **Tailwind** maps the same variables in the `@theme inline` block, so
  utility classes like `text-accent` stay in sync.
- **The canvas** reads them at draw time through `readVar()` in
  `src/lib/palette.ts`, which is why the dots change colour when you flip the
  theme without a reload.

One object → CSS, Tailwind and canvas. They cannot drift apart.

---

## The dot engine

`src/lib/dots.ts` is the whole thing, and it is small on purpose.

- `sampleDots(painter, w, h, step)` — draw any shape into an offscreen
  canvas, get back the lattice points that land inside it.
- `paintDots(ctx, pts, r, colour)` — one batched path, one fill, however many
  dots.
- `addJob(fn)` — **the single ticker**. Every animated canvas on the site runs
  off this one `requestAnimationFrame` loop. Do not start another one; two
  loops racing is where scroll stutter comes from.

Built on it:

| Component | What it does |
|---|---|
| `DotText` | Type that tightens out of a dot matrix. Fires once, when it scrolls into view. |
| `DotNumber` | The hero metric, counting up. Accent while moving, settles to normal. |
| `DotMark` | A project's emblem, drawn as dots. |

The dot sweep on work rows and the page dissolve are **pure CSS** — see
`.row::after` in `globals.css`. No JavaScript runs on hover.

---

## Adding a project

1. Add a mark painter to `src/data/marks.ts` (keep the house rules in the
   comment at the top — no hairlines, they vanish at dot pitch).
2. Add an entry to `PROJECTS` in `src/data/projects.ts`.

`figure` must be a **real measured number**. Where a project has no metric,
use a scale fact — throughput, dataset size, users — never an invented
percentage.

---

## Structure

```
src/
  app/
    layout.tsx      fonts, palette injection, no-flash mode script
    page.tsx        the five sections
    globals.css     every style; no hardcoded colour
  components/
    DotText.tsx     DotNumber.tsx   DotMark.tsx
    WorkRow.tsx     ProgressDots.tsx
    Cursor.tsx      ThemeToggle.tsx  Reveal.tsx
  data/
    projects.ts     the work
    marks.ts        the emblems
  lib/
    palette.ts      ← COLOUR LIVES HERE
    dots.ts         the dot engine + the shared ticker
```

## Next steps

- `npx shadcn@latest init` when a dialog/popover is first needed. Six
  components maximum — plumbing only, never style.
- `npm i @number-flow/react` for ordinary numerals (the big hero figure stays
  on the dot renderer).
- `npm i next-view-transitions` when `/work/[id]` routes exist, for the
  page-to-page dot dissolve.
- Favicon and OG image, from the dot wordmark.
