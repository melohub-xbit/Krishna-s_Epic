/**
 * What the field is currently showing behind the work section.
 *
 * The rail knows which poster is live; the field canvas needs to draw that
 * project's mark. Rather than lift that into React state — which would
 * re-render twenty-two posters every time you nudge the rail — the two talk
 * through this one tiny store. One value, one set of listeners.
 */

import type { MarkId } from "@/data/marks";

let mark: MarkId = "ring";
const subs = new Set<(m: MarkId) => void>();

export function setFieldMark(next: MarkId) {
  if (next === mark) return;
  mark = next;
  for (const f of subs) f(mark);
}

export function onFieldMark(f: (m: MarkId) => void) {
  subs.add(f);
  f(mark);
  return () => {
    subs.delete(f);
  };
}
