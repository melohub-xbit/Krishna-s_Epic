# MASTERPLAN

**Velidanda Krishna Sai — portfolio.** Everything about the project lives in
this folder. The site itself is in `../site`.

## One line

A minimal portfolio where **everything resolves out of dots** — the wordmark,
the project marks, the numbers, the hover states, the navigation. One idea,
applied everywhere, on a two-colour palette.

## Status

> **Built and running.** Five sections, 20 projects, the dot language, light
> and dark. Next: verify the four flagged figures, then the detail pages.

Check `04-progress.md` for what is actually done.

## Read in order

| # | File | What it holds |
|---|---|---|
| 1 | `01-design.md` | The dot language, palette, type, motion. The design guide. |
| 2 | `02-structure.md` | The five sections and the quiet pages. |
| 3 | `03-content.md` | How a project is written up. The rule about numbers. |
| 4 | `04-progress.md` | The tracker. Keep it current. |

## Run it

```bash
cd site
npm install      # on Windows, not from a Linux shell
npm run dev
```

## Working rules

1. **Never run `git`.** Krishna does all git operations himself.
2. **Nothing is done until it has been looked at in a browser.**
3. **Colour only ever changes in `site/src/lib/palette.ts`.** If you are about
   to write a hex value anywhere else, stop.
4. **One requestAnimationFrame loop.** It lives in `site/src/lib/dots.ts`.
   Never start a second one.
5. Update `04-progress.md` in the same change that finishes something.
6. Keep these files short. They are meant to be scanned.

## Also in this folder

- `../dev_proj`, `../research_proj` — the 29 source repos. Reference for
  writing project content; never part of the build.
- `../Resume` — LaTeX source and PDF renders.
