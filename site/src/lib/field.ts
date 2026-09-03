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
