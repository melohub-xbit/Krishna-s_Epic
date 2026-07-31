"use client";

/**
 * A PROJECT'S OWN BOOK — the click-a-project-read-its-manga deliverable
 * (masterplan 03 §3.4, 08 §8.6, roadmap Phase 5).
 *
 * It is the SAME book, one level deeper: `CurlVolume` is shared with the volume at
 * `/`, so the paper, the curl, the live-DOM-at-rest behaviour and the input
 * handling are not merely similar, they are the same code. That was the one
 * non-negotiable — a project book that turned differently would break the illusion
 * that you have gone deeper into one object, in the exact moment the reader is
 * paying most attention.
 *
 * ================================================================
 * OPENING FROM THE ROW IT WAS CLICKED ON
 * ================================================================
 * §8.6 specifies a GSAP Flip morph from the clicked panel to centre stage. What
 * happens here is the honest version of that with the parts that exist: the book
 * animates from the clicked row's bounding rect to the centre, so it reads as that
 * row lifting rather than as a modal appearing. `origin` is the rect, measured at
 * click time by the caller. Flip proper is a refinement, not a prerequisite, and
 * this way there is no second animation system in the project.
 *
 * ================================================================
 * IT IS A DIALOG, SO IT BEHAVES LIKE ONE
 * ================================================================
 * `role="dialog"` + `aria-modal`, focus moved in on open and restored on close,
 * Escape closes, and the volume underneath is `paused` by the caller so arrow keys
 * turn THIS book's pages and not the ones behind it. Two books listening to the
 * same keydown is the bug this exists to not have.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

import CurlVolume from "@/components/grantha/CurlVolume";
import BookPage from "@/components/book/BookPage";
import type { MangaScript } from "@/data/mangaScripts";
import type { Project } from "@/data/projects";
import { DUR, EASE } from "@/components/ink/ease";

export interface MangaBookProps {
  script: MangaScript;
  project: Project;
  /** The clicked row's rect, so the book can lift out of it. */
  origin?: DOMRect | null;
  onClose: () => void;
}

export default function MangaBook({ script, project, origin, onClose }: MangaBookProps) {
  const [page, setPage] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<Element | null>(null);
  /**
   * PORTALLED TO <body>, AND THIS IS NOT OPTIONAL.
   *
   * The book is opened from a row on an index page, so in the React tree it lives
   * inside `.book-page` — which declares `container-type: size` for page units, and
   * that implies `contain: layout size`. A `contain: layout` ancestor becomes the
   * containing block for `position: fixed` descendants, so `.mbook { inset: 0 }`
   * would resolve against a ~480px page box instead of the viewport, and
   * `.book-page`'s `overflow: hidden` would then clip whatever was left. The modal
   * has to leave the page it was opened from.
   *
   * Mounted in an effect rather than rendered straight away because `document` does
   * not exist during the server render.
   */
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);

  const commit = useCallback((target: number) => setPage(target), []);

  // Open: from the row's rect to centre. Measured, not guessed — the row is the
  // thing the reader just pointed at, so it is where the book should come from.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    restoreRef.current = document.activeElement;

    const ctx = gsap.context(() => {
      if (origin) {
        const to = stage.getBoundingClientRect();
        gsap.from(stage, {
          x: origin.left + origin.width / 2 - (to.left + to.width / 2),
          y: origin.top + origin.height / 2 - (to.top + to.height / 2),
          // The row is a sliver of the book's size; scaling from its actual height
          // ratio is what makes this read as "that row grew" rather than "a box
          // zoomed". Floored so a very short row does not start at a dot.
          scaleY: Math.max(0.12, origin.height / to.height),
          scaleX: Math.max(0.12, origin.width / to.width),
          opacity: 0,
          duration: DUR.base,
          ease: EASE.ink,
        });
      } else {
        gsap.from(stage, { opacity: 0, scale: 0.94, duration: 0.4, ease: EASE.ink });
      }
      gsap.from(".mbook-veil", { opacity: 0, duration: 0.3 });
    }, rootRef);

    rootRef.current?.focus();
    return () => {
      ctx.revert();
      (restoreRef.current as HTMLElement | null)?.focus?.();
    };
  }, [origin]);

  // Escape closes. Capture phase and stopPropagation, so this wins over the
  // volume's own key handler underneath even though both are on the window.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  // Focus trap: cycle Tab within the dialog. Without it, Tab walks out into the
  // volume behind, which is still in the DOM and now unreachable-looking.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const root = rootRef.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!items.length) return;
    const first = items[0];
    const lastEl = items[items.length - 1];
    if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      lastEl.focus();
    }
  };

  const total = script.pages.length;
  if (!host) return null;

  return createPortal(
    <div
      className="mbook"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — chapter ${script.chapter}`}
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <div className="mbook-veil" onClick={onClose} aria-hidden="true" />

      <div className="mbook-stage" ref={stageRef}>
        <CurlVolume
          pages={script.pages.map((def, i) => (
            <BookPage
              key={i}
              def={def}
              project={project}
              script={script}
              index={i}
              total={total}
            />
          ))}
          page={page}
          onTurnEnd={commit}
          // Namespaced, or this book's page 0 would be handed the volume's cover
          // texture out of the shared capture cache.
          cacheKey={`book:${project.id}`}
          fit={{ height: 0.72, width: 0.84, maxPageHeight: 680 }}
        />
      </div>

      <div className="mbook-chrome">
        <span className="mbook-where">
          {project.title} · {page + 1} / {total}
        </span>
        <button className="mbook-close" onClick={onClose}>
          Close <kbd>esc</kbd>
        </button>
      </div>
    </div>,
    host
  );
}
