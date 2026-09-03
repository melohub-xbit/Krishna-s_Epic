# 01 · Design

## The idea

**Everything on the site resolves out of dots.**

One device, applied to every moving thing, so the site reads as one designed
object rather than a collection of effects. It comes from three places at
once — print screentone, dot-matrix displays, and kolam *pulli*, the dot grid
a kolam is drawn around. That convergence is why it can carry a Telugu
portfolio without any of it being decoration.

### Where it appears

| | Where | How |
|---|---|---|
| **Type resolves** | the wordmark, once | dots start slightly scattered and tighten into place. Reads as focus, not as an effect. |
| **Numbers count** | each project's figure | ticks up in the same matrix, accent while moving, settles when it lands |
| **Marks** | one per project | drawn as dots from a procedural line drawing |
| **Rows sweep** | hovering a project | a dot wave crosses the row. **Pure CSS.** |
| **The cursor** | everywhere | a dot that opens into a ring over anything clickable |
| **Position** | the nav | five dots; the one you are on fills and grows |

The signature move — type resolving — is used **exactly once**, at the top.
Used more, it stops being a signature and becomes a tic.

## Palette

**Two colours: a neutral ground and one accent.** The accent is rationed —
it only ever marks the thing you are pointing at. That rationing is what
makes it read as energetic rather than loud.

**All colour lives in `site/src/lib/palette.ts`.** There is no second place
where a colour is written down. To change the whole site, change one line:

```ts
export const ACTIVE: PaletteName = "mono";   // kumkum | peacock | turmeric
```

The object is emitted as CSS custom properties once in the root layout, then
read by CSS, by Tailwind's `@theme`, and by the canvas through `readVar()` —
which is why the dots recolour instantly when the theme flips. One source,
three consumers, no drift.

Every palette ships a full **light and dark** scheme. Both are designed; the
toggle is real. Opens dark.

## Type

| Role | Face | Job |
|---|---|---|
| Display & body | **Instrument Sans** | everything that is read |
| Data | **DM Mono** | figures, labels, metadata, anything *recorded* rather than written |
| Telugu | **Noto Sans Telugu** | section glosses |

- **Telugu is always paired with English**, never standalone. On this site it
  sits as a small gloss beside the English section title — the restrained
  version of the rule.
- **UPPERCASE + letterspacing for structure.** lowercase for interface voice.
  Two registers, never mixed up.
- **The figure is the loudest thing on a row.** Someone scanning a portfolio
  gives each item about three seconds; the number is what survives that.
- Telugu needs `lang="te"` and a taller line-height than Latin — 1.7–1.9, or
  conjuncts collide.

## Motion

Near zero, on purpose. **Motion explains where you are; it does not perform.**

- One easing curve: `cubic-bezier(.7, 0, .2, 1)`. Hesitate, then commit.
- Three durations and no others: **200ms** hover, **560ms** reveals,
  **900ms** anything larger.
- A single fade-and-lift when a block enters view. That is the entire scroll
  budget. No pinning, no scrubbing, no scroll-jacking, no parallax.
- **No 3D anywhere.** No shaders, no WebGL, no persistent canvas loop.
- Four of the six dot behaviours are **pure CSS**. Nothing runs on hover.
- **Reduced motion is a real path**, not a degraded one: transitions off,
  cursor hidden, identical content in identical order.

## References

Apple's principles (content first, deference, restraint), Nothing's design
language (dot matrix, monochrome plus one accent, exposed structure), and
[panache.fr](https://panache.fr/) — one column, huge whitespace, no metrics
theatre, restraint over spectacle.
