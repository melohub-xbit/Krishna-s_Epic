"use client";

/**
 * AN EPIC PAGE, AS A PAGE — the chapter index (目次 / విషయసూచిక) for one arc.
 *
 * ================================================================
 * WHY THIS EXISTS
 * ================================================================
 * The epic spreads used to render EVERY project in the arc as a full card:
 * eleven of them for Ramayanam, nine for Mahabharatam. On a scrolling document
 * that is fine — a section is as tall as it needs to be. On a page it is not:
 * eleven cards single-column is roughly 2,400px of content inside a ~660px
 * rectangle, and `.book-page` clips the overflow, so the reader saw the top
 * quarter of the arc and nothing else. Krishna's words, 2026-07-30: "it
 * literally feels like a screenshotted section of the full content just pasted
 * on the area that looks like a page". It was — the crop was the bug.
 *
 * A scroll section and a page have opposite constraints. A section grows to fit
 * its content; a page is a fixed rectangle you COMPOSE INTO, and content that
 * does not fit has to be moved rather than squeezed. So the arc page stops
 * trying to be the arc: it becomes its index, and the detail moves into the
 * per-project book (masterplan 03 §3.4, roadmap Phase 5) — which is where
 * §03.2 always said "selecting a panel → project book".
 *
 * ================================================================
 * IT CANNOT OVERFLOW, BY CONSTRUCTION
 * ================================================================
 * "Make it fit" is not a thing you eyeball once and hope holds at every page
 * size. Three rules do it structurally:
 *
 *   1. The page is a 3-row grid — head / index / foot — where the index row is
 *      `1fr`. It takes exactly the space left over, never more.
 *   2. Inside it, one grid row per chapter, all in `fr`. Rows share whatever
 *      height there is; adding a project makes every row shorter rather than
 *      pushing the last one off the page. `minmax(0, …)` is what stops a long
 *      title forcing a row taller than its share.
 *   3. Every text run is line-clamped. A clamp is the honest version of
 *      `overflow: hidden` — it truncates at a word with an ellipsis instead of
 *      slicing a glyph in half.
 *
 * ================================================================
 * SIZED IN PAGE UNITS, NOT VIEWPORT UNITS
 * ================================================================
 * Everything here is in `cqw`/`cqh` against the `page` container declared on
 * `.book-page`. This is the fix for the other half of the complaint — resizing
 * the window used to change the page's size but not its type or spacing, so the
 * composition fell apart. A page-relative page scales as one object: at any
 * window size it is the same design, just larger or smaller. Viewport units are
 * meaningless inside a leaf, and `@media` is worse than meaningless — the page
 * box is ~480px wide while the media query still reads the real window.
 *
 * Weight = importance (§03.2): a `hero` project's row gets 1.5x the height of
 * the others and the kumkum accent, so the eye lands on it first. That is the
 * one piece of koma grammar an index can carry.
 */
import { useState } from "react";

import { Rosette, BrushRule } from "@/components/ornament/Motifs";
import Mon from "@/components/ornament/Mon";
import MangaBook from "@/components/book/MangaBook";
import { epics, type Project } from "@/data/projects";
import { profile } from "@/data/profile";
import { bookFor, isScripted } from "@/components/book/recordBook";
import { teluguNum } from "@/lib/teluguNum";

type Epic = typeof epics.ramayanam | typeof epics.mahabharatam;

export default function EpicIndex({
  epic,
  sigil,
}: {
  epic: Epic;
  sigil: React.ReactNode;
}) {
  // The résumé cut to this track: the research path gets the 2-page research CV,
  // the builder path the 1-page general one. The spine split is the whole point —
  // a recruiter reading one arc gets the matching document.
  const resume =
    epic.key === "ramayanam"
      ? profile.contacts.resumeResearch &&
        { href: profile.contacts.resumeResearch, label: "Research résumé" }
      : profile.contacts.resume && { href: profile.contacts.resume, label: "Résumé" };

  // Row weights, declared rather than derived from a CSS nth-child cycle: the
  // whole point is that importance is authored per project (`hero` in
  // projects.ts), and this is the line where that becomes layout.
  //
  // 1.7 and not a rounder 1.5 because a hero row carries a larger crest, a larger
  // title AND a two-line subtitle: at 1.5 it came out 0.2px short of its own
  // content at every page size (checked numerically, not by eye). Whenever the
  // hero row's type changes, re-run that check — the number is a consequence of
  // the type scale, not a taste choice.
  const rows = epic.projects.map((p) => (p.hero ? "1.7fr" : "1fr")).join(" ");

  // Which book is open, and the rect of the row it was opened from so the book can
  // lift out of that row rather than just appearing.
  const [open, setOpen] = useState<{
    project: Project;
    rect: DOMRect;
    chapter: number;
  } | null>(null);

  return (
    <section className="page-idx" id={epic.key} data-sec={epic.key}>
      <header className="idx-head">
        <div className="idx-eyebrow">
          <Rosette size={16} />
          {epic.role}
          <span className="te">{epic.te}</span>
        </div>
        <h2 className="idx-title">
          <span className="te">{epic.te}</span>
          {epic.name}
        </h2>
        <p className="idx-lede">{epic.blurb}</p>
        <div className="idx-rule">
          <BrushRule width={220} />
        </div>
        <div className="idx-sigil" aria-hidden="true">
          {sigil}
        </div>
      </header>

      {/* An ordered list because that is what it is: chapters, in reading order.
          A screen reader announcing "list, 11 items" is exactly right, and it is
          the one bit of structure a crawler can use to see eleven projects here
          rather than one blob of text. */}
      <ol className="idx-list" style={{ gridTemplateRows: rows }}>
        {epic.projects.map((p, i) => {
          // EVERY project has a book now: a written script where one exists, a
          // generated record otherwise. The distinction is worth showing (a manga
          // chapter and a record read very differently) but it is never a reason for
          // a row to do nothing.
          const scripted = isScripted(p);
          return (
            <li
              key={p.id}
              className="idx-row"
              data-hero={p.hero ? "1" : undefined}
              data-book="1"
              data-scripted={scripted ? "1" : undefined}
            >
              {/* Every row opens a book. Two of twenty are hand-written manga
                  (marked "Chapter"); the rest are generated record books built from
                  the project's own description and tech (see recordBook.ts for why
                  that is a real answer and not a placeholder). §8.6's Flip morph is
                  approximated from the row's measured rect — see MangaBook. */}
              <a
                className="idx-link"
                // The href stays real so the row is a link a crawler can follow and
                // a modified click can open in a tab; the plain click opens the book.
                href={p.links[0]?.href ?? "#"}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  setOpen({
                    project: p,
                    rect: (e.currentTarget as HTMLElement).getBoundingClientRect(),
                    chapter: i,
                  });
                }}
              >
                <span className="idx-mon">
                  <Mon id={p.id} size={40} title={`${p.title} mon`} />
                </span>

                <span className="idx-no te" aria-hidden="true">
                  {teluguNum(i + 1)}
                </span>

                <span className="idx-name">
                  <b>
                    {p.title}
                    {p.titleSfx && <> <s>{p.titleSfx}</s></>}
                  </b>
                  {p.sub && <i>{p.sub}</i>}
                </span>

                {/* Which rows have a book to read is information the reader wants
                    before clicking, so it is on the row, not discovered by trying. */}
                <span className="idx-read">
                  {scripted ? "Chapter ›" : "Read ›"}
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      <footer className="idx-foot">
        {resume ? (
          <a href={resume.href} target="_blank" rel="noreferrer">
            {resume.label} ↓
          </a>
        ) : (
          <span />
        )}
        <span className="idx-count">
          {teluguNum(epic.projects.length)} · {epic.projects.length} chapters
        </span>
      </footer>

      {open && (
        <MangaBook
          script={bookFor(open.project, open.chapter)}
          project={open.project}
          origin={open.rect}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
