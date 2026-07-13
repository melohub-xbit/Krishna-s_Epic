# Velidanda Krishna Sai — a portfolio in panels

A manga-styled portfolio fused with Hindu iconography and Telugu culture. The site is read like a manga volume across **two epics**:

- **Ramayanam** — the research path (`/ramayanam`)
- **Mahabharatam** — the dev & hackathon path (`/mahabharatam`)

Built with Next.js (App Router) + TypeScript + Tailwind, GSAP-free scroll reveals, Lenis smooth scroll, Framer Motion ink-wipe transitions, a canvas ambient layer, and an ink-brush cursor.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

## Deploy (Vercel, free tier)

Push this folder to a Git repo and import it on Vercel — zero config. It's a static-first App Router app; all routes prerender. Google Fonts load at runtime via a `<link>` (so builds never depend on font-network access).

## Theme: day / night by time of day

No toggle — the theme is chosen from the visitor's local clock:

- **07:00–18:00** → Tanjore / temple palette (light)
- **18:00–07:00** → Night / cosmic palette (dark)

Logic lives in `components/theme/ThemeScript.tsx` (runs before first paint) and the palettes are CSS variables in `app/globals.css` (`:root[data-daynight="day"]` / `["night"]`).

## Where the content lives

- **`data/projects.ts`** — every project (title, description, tech "astras", links), split into `ramayanam` and `mahabharatam`. Edit here to update your work.
- **`data/profile.ts`** — name, tagline, shloka, education, research, achievements, skills, contact links.
- **`public/resume.pdf`** — the résumé served by the download button.

## Structure

```
app/            layout, home (cover→index→about→contact), /ramayanam, /mahabharatam, ink-wipe template
components/
  art.tsx       chakra, bow, conch, kolam, mango-leaf toranam, kumkum seal (SVG)
  sections/     Cover, EpicFork (two-epic fork), About, Contact
  panels/       ProjectPanel, EpicPage
  background/   BackgroundStack, Particles (canvas)
  cursor/       InkCursor
  nav/          NavRail (mala side-rail)
  motion/       Sfx (manga onomatopoeia pop-ins)
  providers/    SmoothScroll (Lenis), Reveal (scroll ink-in)
data/           projects.ts, profile.ts
```

## Design language

- Palette: aged paper, kumkum red, turmeric/gold, indigo — with **saffron = Ramayanam**, **blue (Krishna) = Mahabharatam**.
- Telugu is reserved for the name, the shloka, and the epic titles; elsewhere it's a faint watermark.
- Green appears only in the **mango-leaf toranam** (folded-leaf parrots + marigold clusters), never as a box fill.
- The **kumkum seal** (కృ) stamps the cover.

## Art slots to upgrade later

The two epic gateway panels and the cover emblem use finished SVG art now. These are the natural slots for AI-generated / hand-drawn manga illustrations (Rama with the Kodanda bow; Krishna on the Kurukshetra chariot). Drop images into `public/` and swap the art in `components/sections/EpicFork.tsx`.

## Performance

Static prerender, ~94 kB first-load JS, transform/opacity-only animation, canvas particles capped and paused when offscreen or the tab is hidden, and a full `prefers-reduced-motion` fallback.
