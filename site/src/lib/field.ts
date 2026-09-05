/**
 * What the field is currently showing behind a section.
 *
 * Two sections change their own background while you are inside them: the
 * rail knows which poster is live, and the glyph matrix knows which group
 * is up. Rather than lift either into React state — which would re-render
 * twenty-two posters every time you nudge the rail — they talk to the
 * field through this. One value each, one set of listeners.
 */

import type { MarkId } from "@/data/marks";

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

/** the mark of the poster currently centred on the rail */
const mark = channel<MarkId>("ring");
export const setFieldMark = mark.set;
export const onFieldMark = mark.on;

/** the skills group currently up on the glyph matrix */
const glyph = channel<string>("Languages");
export const setFieldGlyph = glyph.set;
export const onFieldGlyph = glyph.on;

/**
 * How much of the About photograph the projector is currently throwing.
 *
 * The field paints the photo into `#about-slot`'s rect whether or not the
 * projector has switched on, so a slot CSS-scaled to 0.04 still rendered a
 * thumb-sized halftone sitting on the base. The projector publishes its
 * figure stage here and the field multiplies it into that station's alpha,
 * so the picture genuinely is not there until it unfolds.
 */
const reveal = channel<number>(1);
export const setFieldReveal = reveal.set;
export const onFieldReveal = reveal.on;

/**
 * Which station the interests band is tuned to.
 *
 * The tuner publishes an index; the field turns a needle to match, so the
 * background dial and the dial on the page are the same instrument.
 */
const tune = channel<number>(0);
export const setFieldTune = tune.set;
export const onFieldTune = tune.on;
