"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DotMark from "./DotMark";
import DotDiagram from "./DotDiagram";
import { hasDiagram } from "@/data/diagrams";
import type { Project } from "@/data/projects";

/**
 * THE RECORD — the same poster, opened.
 *
 * Not a generic dialog. It is the poster you clicked, grown: same frame,
 * same WANTED head, same corner stamp, with everything the small sheet had
 * no room for printed underneath.
 *
 * It grows out of the card you clicked. The card's rect comes in as
 * `from`; on mount we measure where the sheet has landed, put it back on
 * top of that card with one transform, and let it travel from there. That
 * is a real FLIP — no guessing, no fixed origin — so it reads as the
 * poster opening rather than a panel arriving from nowhere. Closing runs
 * the same move backwards before the sheet unmounts.
 */
export default function PosterRecord({
  project,
  index,
  from,
  onClose,
}: {
  project: Project | null;
  index: number;
  from: DOMRect | null;
  onClose: () => void;
}) {
  const sheet = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  /* the project is held for the length of the closing animation */
  const [held, setHeld] = useState<{ p: Project; i: number } | null>(null);
  const closing = useRef(false);

  useEffect(() => {
    if (project) setHeld({ p: project, i: index });
  }, [project, index]);

  /** map the sheet onto the card it came from, then let it travel */
  useLayoutEffect(() => {
    const el = sheet.current;
    if (!el || !project || !from) return;

    closing.current = false;
    const to = el.getBoundingClientRect();
    if (!to.width || !to.height) return;

    const s = Math.max(0.12, Math.min(from.width / to.width, 1));
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);

    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
    el.style.opacity = "0.25";

    const id = requestAnimationFrame(() => {
      el.style.transition =
        "transform 520ms var(--ease), opacity 320ms var(--ease)";
      el.style.transform = "";
      el.style.opacity = "1";
      setShown(true);
    });
    return () => cancelAnimationFrame(id);
  }, [project, from]);

  /** run the move backwards, then let go */
  const close = () => {
    const el = sheet.current;
    if (closing.current) return;
    closing.current = true;
    setShown(false);

    if (el && from) {
      const to = el.getBoundingClientRect();
      const s = Math.max(0.12, Math.min(from.width / to.width, 1));
      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top + from.height / 2 - (to.top + to.height / 2);
      el.style.transition =
        "transform 340ms var(--ease), opacity 260ms var(--ease)";
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
      el.style.opacity = "0";
    }
    window.setTimeout(() => {
      onClose();
      setHeld(null);
      closing.current = false;
    }, 300);
  };

  /* Escape closes; the page behind holds still. The scrollbar's width is
     measured before it goes, so nothing jumps sideways as it opens. */
  useEffect(() => {
    if (!project) return;
    const root = document.documentElement;
    root.style.setProperty("--sbw", `${window.innerWidth - root.clientWidth}px`);
    root.dataset.recOpen = "true";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      delete root.dataset.recOpen;
      root.style.removeProperty("--sbw");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!held) return null;
  const p = held.p;
  const no = String(held.i).padStart(2, "0");

  return (
    <div
      className="pr-shell"
      data-open={shown ? "true" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${p.name} — record`}
    >
      <div className="pr" ref={sheet}>
        <div className="pr-scroll">
          <p className="pr-hd st" style={{ ["--i" as string]: 0 }}>
            Wanted
          </p>
          <p className="pr-for st" style={{ ["--i" as string]: 0 }}>
            {p.sub}
          </p>
          <hr className="pr-rule" />

          <div className="pr-top st" style={{ ["--i" as string]: 1 }}>
            <span className="pr-art">
              <DotMark mark={p.mark} step={2.2} dotRadius={0.95} />
            </span>
            <span>
              <h3 className="pr-name">{p.name}</h3>
              <p className="pr-fig">{p.figure}</p>
              <p className="pr-cap">{p.caption}</p>
            </span>
          </div>

          {hasDiagram(p.id) && (
            <div className="pr-diagram st" style={{ ["--i" as string]: 2 }}>
              <DotDiagram id={p.id} className="pr-diagram-canvas" />
            </div>
          )}

          <div className="pr-cols">
            <div className="st" style={{ ["--i" as string]: 3 }}>
              <p className="lab card-kicker">The problem</p>
              <p className="card-body">{p.problem}</p>
              <p className="lab card-kicker">The approach</p>
              <p className="card-body">{p.approach}</p>
            </div>

            <div className="st" style={{ ["--i" as string]: 4 }}>
              <div className="pr-notices">
                {p.details.map((d) => (
                  <div className="pr-notice" key={d.label}>
                    <span className="lab">{d.label}</span>
                    <span className="pr-notice-val">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pr-foot st" style={{ ["--i" as string]: 5 }}>
            <div className="pr-stack">
              {p.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
              <span className="pr-no">
                No. {no} · {p.year}
              </span>
            </div>
            <div className="pr-links">
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer">
                  Repo ↗
                </a>
              )}
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer">
                  Live ↗
                </a>
              )}
              <button type="button" onClick={close} className="pr-close">
                Close
              </button>
            </div>
          </div>
        </div>

        <span className="poster-stamp" aria-hidden="true">
          {p.award ?? `No. ${no}`}
        </span>
      </div>
    </div>
  );
}
