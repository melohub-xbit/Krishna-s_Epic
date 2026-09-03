# 03 · Content

All 20 projects live in `site/src/data/projects.ts`. Their marks live in
`site/src/data/marks.ts`.

## The rule about numbers

> **Every `figure` is real, or it is a scale fact. Never a guess.**

The figure is the loudest thing on a row and the first thing anyone reads, so
it is the fastest way to lose trust. Three acceptable kinds:

1. **A measured result** — `20%`, `r = 0.08`, `2nd / 5,600+`.
2. **A scale fact** — `10 tasks`, `8 channels`, `3 roles`, `5 games`. True,
   checkable, and honest about being a size rather than an outcome.
3. **A characterising fact** — `0 interactions`, `O(log n)`, `Files only`.
   Used where the interesting thing about the project is a constraint rather
   than a number.

What is never acceptable: an invented percentage, a rounded-up benchmark, or
a metric that cannot be pointed to in the repo.

`caption` explains the figure in **≤ 18 words**, present tense, no marketing
voice. `note` is two sentences of real detail, shown only on an opened card.

### All figures verified — 2026-08-26

Every figure now traces to the résumé or to the repo it belongs to. The five
that were flagged were resolved by reading the source, not by guessing:

| Project | Figure | Where it came from |
|---|---|---|
| Mutant Hunter | `Mutation score` | the repo states mutation-score rewards; a Qwen-Coder-7B LoRA was trained |
| ML B120 | `6 families` | counted the experiment directories |
| Sellorita | `3 tools` | the README's feature list |
| PluginLive | `Video → report` | characterising fact; there is no published metric |
| Dialecto | `4 modes` | the README lists story, pronunciation, memory game, progress |

Two projects were also missing and have been added: **Vehicle Detection**
(1st of 2,000 teams, ICDEC'24) and **Voltiq** (ET AI Hackathon 2026).

If a figure is ever changed, the source has to change with it.

## Adding or editing a project

1. Add a mark painter to `marks.ts`, following the house rules in the comment
   at the top of that file. **No hairlines** — they vanish at dot pitch.
2. Add the entry to `PROJECTS` in `projects.ts`, with its `track`.

Groups and counts on the page derive from the array, so nothing else needs
touching.

## The marks

One circular emblem per project, drawn from **what the project does** — not
its subject and never a logo. They must read as a family, which is why they
all share one enclosure and one interior stroke weight.

They are procedural line drawings sampled into dots, so they inherit the
palette, work at any size, and add nothing to the bundle.

## Voice

Short, factual, slightly dry. The design is quiet; the claims should be too.
No superlatives, no "passionate about", no invented impact. Where something
was a team effort or a hackathon, say so.
