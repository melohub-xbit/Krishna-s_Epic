/**
 * SPREAD -> TEXTURE. Rasterises a live, laid-out spread element into a canvas
 * the page-curl shader can upload.
 *
 * The spreads are real React DOM (components/spreads/Spreads.tsx) with SVG
 * ornaments and the vendored Telugu/Latin fonts. We render them offscreen at
 * page size (Grantha.tsx keeps them mounted and laid out) and capture on
 * demand. Capture is the one genuinely expensive step, so it is:
 *
 *   - CACHED by element + pixel size. A spread is only re-rasterised when the
 *     book is resized, never per turn.
 *   - FONT-SAFE. We block on document.fonts.ready first; capturing before the
 *     Telugu face loads bakes a fallback glyph into the texture permanently.
 *   - FALLIBLE WITHOUT BREAKING THE TURN. On any failure we return null and the
 *     caller shows a plain paper page, so a capture bug degrades the look
 *     rather than freezing navigation.
 *
 * html-to-image is dynamically imported so it never lands in the server bundle
 * and never runs during SSR.
 */

export interface CaptureOpts {
  /** Backing-store scale. Caps at 2 — a full-page texture at 3x is a lot of VRAM. */
  pixelRatio?: number;
  /** Paper fill behind transparent regions of the spread. */
  background?: string;
}

const cache = new Map<string, HTMLCanvasElement>();

function key(el: HTMLElement) {
  const w = Math.round(el.clientWidth);
  const h = Math.round(el.clientHeight);
  return `${el.dataset.captureKey ?? el.id ?? "spread"}@${w}x${h}`;
}

/**
 * Capture `el` to a canvas, or null on failure. Results are memoised on the
 * element's capture key + current pixel size.
 */
export async function captureSpread(
  el: HTMLElement,
  { pixelRatio, background = "#f3ede0" }: CaptureOpts = {}
): Promise<HTMLCanvasElement | null> {
  if (typeof window === "undefined") return null;
  if (el.clientWidth === 0 || el.clientHeight === 0) return null;

  const cacheKey = key(el);
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  try {
    if (document.fonts?.ready) await document.fonts.ready;
    const { toCanvas } = await import("html-to-image");
    const dpr = pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2);
    const w = el.clientWidth;
    const h = el.clientHeight;
    const canvas = await toCanvas(el, {
      pixelRatio: dpr,
      backgroundColor: background,
      // The spread is same-origin DOM; cacheBust avoids a stale data-URL for an
      // image the browser already has under a different query string.
      cacheBust: true,
      width: w,
      height: h,
      // [ADDED 2026-07-30] PIN THE CLONE TO A PLAIN STATIC BOX. html-to-image
      // copies computed styles onto its clone and then drops that clone at the
      // origin of a <foreignObject> that has no positioned ancestor. The pages are
      // now absolutely positioned inside the book (`left: 50%` for the right page,
      // `width: 50%` for both), and percentages resolve against the wrong box in
      // there: the content would be shifted half a page out of frame and sized to
      // half its width. Overriding position and size in pixels makes the capture
      // independent of however the node happens to be laid out on screen — which
      // it should have been all along.
      style: {
        position: "static",
        left: "auto",
        top: "auto",
        right: "auto",
        bottom: "auto",
        margin: "0",
        transform: "none",
        width: `${w}px`,
        height: `${h}px`,
      },
    });
    cache.set(cacheKey, canvas);
    return canvas;
  } catch (err) {
    console.warn("[captureSpread] falling back to plain page:", err);
    return null;
  }
}

/** Drop cached captures — call on resize so pages re-rasterise at the new size. */
export function clearCaptureCache() {
  cache.clear();
}
