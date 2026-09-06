/**
 * How much of the About photograph the projector is currently throwing.
 *
 * One value, one set of listeners, no React. The projector writes it every
 * frame from its own scroll timeline; the halftone canvas multiplies it
 * into the picture's alpha, so the photograph genuinely is not there until
 * the beam has unfolded it. CSS `opacity` on the slot cannot do this — the
 * canvas paints wherever the slot's rect is, whatever the slot looks like,
 * and a slot scaled to 4% used to render a thumb-sized halftone sitting on
 * the projector base.
 *
 * This file used to carry four channels: the rail's live poster mark, the
 * matrix's live glyph, and the interests dial, all feeding a full-page
 * background that morphed between sections. That background is gone — the
 * marks live on the posters and the matrix draws its own screen — so only
 * this one is left.
 */

type Chan<T> = {
  get: () => T;
  set: (next: T) => void;
  on: (f: (v: T) => void) => () => void;
};

function channel<T>(initial: T): Chan<T> {
  let value = initial;
  const subs = new Set<(v: T) => void>();
  return {
    get: () => value,
    set: (next) => {
      if (next === value) return;
      value = next;
      for (const f of subs) f(value);
    },
    on: (f) => {
      subs.add(f);
      f(value);
      return () => {
        subs.delete(f);
      };
    },
  };
}

const reveal = channel<number>(1);
export const setFieldReveal = reveal.set;
export const onFieldReveal = reveal.on;
