"use client";

import { usePageProgress } from "@/lib/scroll";

/**
 * The ground the whole site sits on: two very slow colour fields and a
 * grain layer, both fixed behind everything.
 *
 * The fields drift with overall scroll position — `--scroll` is written to
 * <html> once a frame and the gradients read it in pure CSS, so nothing
 * re-renders and nothing is animated in JavaScript.
 *
 * No 3D, no shader, no canvas. It costs two painted layers.
 */
export default function Ambient() {
  usePageProgress();
  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
