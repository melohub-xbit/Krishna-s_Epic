"use client";

/**
 * ONE PAGE OF A PROJECT BOOK — a koma grid, or a cover.
 *
 * Composed for a page, under exactly the two rules the index page established
 * (PROJECT-STATUS §4 items 38–39), because they are general and not specific to an
 * index:
 *
 *   1. **Page units, never viewport units.** Every length here is `cqw`/`cqh`
 *      against the `page` container on `.book-page`. A page scales as one object.
 *   2. **Fit is structural, not eyeballed.** The grid's rows are `1fr` with
 *      `minmax(0, …)`, so panels share whatever height the page has; adding a
 *      panel shrinks them all rather than pushing the last one off. Captions are
 *      line-clamped and each panel clips its own overflow. A page cannot overflow
 *      at any page size, for any panel count.
 *
 * Koma grammar from §03.2 and §9.1: panel SIZE encodes pace (a hero panel slows
 * the reader down, three thirds hurry them), the GUTTER encodes time (tight =
 * continuous, wide = a beat passing), BLEED encodes weight (tachikiri — a moment
 * that stops time), and DIAGONAL gutters encode action or menace.
 *
 * ================================================================
 * READING ORDER — AN OPEN QUESTION, DELIBERATELY LEFT LTR
 * ================================================================
 * 08 §8.6 specifies panels in RTL order (`direction: rtl` on the grid, `ltr`
 * restored inside each panel) because that is manga. But Krishna reversed the
 * volume's own direction to ordinary-book LTR on 2026-07-21, and the spine moved
 * to the centre on 2026-07-30. Panels are LTR here so that the book is internally
 * consistent with the volume that contains it — a reader turning pages
 * left-to-right and then reading panels right-to-left has to switch conventions
 * mid-gesture. This is flagged in 08 §8.2 as needing Krishna's decision; if he
 * wants true manga koma order, it is two CSS lines, not a rewrite.
 */
import Panel from "@/components/ornament/Frame";
import Mon from "@/components/ornament/Mon";
import { Hanko } from "@/components/ornament/Motifs";
import type { BookPage as BookPageDef, Panel as PanelDef } from "@/data/mangaScripts";
import type { Project } from "@/data/projects";
import { teluguNum } from "@/lib/teluguNum";

/** Panel size -> grid span on a 12-column page. */
const SPAN: Record<PanelDef["size"], number> = {
  hero: 12,
  wide: 12,
  half: 6,
  third: 4,
};

function Koma({ p, project }: { p: PanelDef; project: Project }) {
  return (
    <div
      className="koma"
      style={{ gridColumn: `span ${SPAN[p.size]}` }}
      data-size={p.size}
      data-shot={p.shot}
      data-tone={p.tone && p.tone !== "none" ? p.tone : undefined}
      data-diagonal={p.diagonal ? "1" : undefined}
      data-bleed={p.bleed ? "1" : undefined}
    >
      {/* `wash="none"` deliberately. Panel's wagara washes are `Patterns.tsx`
          fills drawn to sit on Panel's near-black background; a koma is INK ON
          PAPER (see .koma-panel in globals.css, which inverts the panel), and those
          fills are not toned for a cream ground. Screentone and speed lines are
          done as CSS overlays keyed off `data-tone` instead, so the page controls
          its own values. Panel is still worth using for the frame itself: the
          double inset border, the four corner ornaments and the notch are exactly
          koma furniture. */}
      <Panel
        tone={p.bleed ? "kumkum" : "gold"}
        wash="none"
        notch={p.shot === "action"}
        className="koma-panel"
      >
        {/* Art, when it exists. `artNote` is a prompt for later, never rendered —
            a panel with a grey placeholder box in it is worse than a panel that is
            confidently type-only (§9.2). */}
        {p.art && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="koma-art" src={`/art/${p.art}`} alt="" aria-hidden="true" />
        )}

        {p.sfx && (
          <div className="koma-sfx" data-cartouche={p.cartouche ? "1" : undefined}>
            {p.sfx}
          </div>
        )}

        {p.dialogue && (
          <p className="koma-dialogue">
            <b>{p.dialogue.speaker}</b>
            {p.dialogue.text}
          </p>
        )}

        {p.caption && <p className="koma-caption">{p.caption}</p>}

        {/* The mon sits in the hanko position on the panel that carries the
            project's identity — the bleed panel on a cover, or the hero. Not on
            every panel: a crest repeated six times stops being a seal. */}
        {p.size === "hero" && !p.bleed && (
          <span className="koma-mon">
            <Mon id={project.id} size={40} title={`${project.title} mon`} />
          </span>
        )}
      </Panel>
    </div>
  );
}

export default function BookPage({
  def,
  project,
  script,
  index,
  total,
}: {
  def: BookPageDef;
  project: Project;
  script: { chapter: string; theme: [string, string] };
  index: number;
  total: number;
}) {
  if (def.cover) {
    const [te, en] = script.theme;
    return (
      <section className="bpage bpage--cover" data-gutter={def.gutter ?? "normal"}>
        <div className="bcover-top">
          <span className="bcover-chapter">
            అధ్యాయం {teluguNum(index + 1)} · Chapter {script.chapter}
          </span>
          <span className="bcover-mon">
            <Mon id={project.id} size={54} title={`${project.title} mon`} />
          </span>
        </div>

        <div className="bcover-lockup">
          <h2 className="bcover-title">
            {project.title}
            {project.titleSfx && <> <s>{project.titleSfx}</s></>}
          </h2>
          {/* The thematic word, Telugu always paired with English (locked rule). */}
          <div className="bcover-theme">
            <span className="te">{te}</span>
            <i>{en}</i>
          </div>
          {project.sub && <p className="bcover-sub">{project.sub}</p>}
        </div>

        {def.panels[0]?.caption && (
          <p className="bcover-caption">{def.panels[0].caption}</p>
        )}

        <div className="bcover-seal" aria-hidden="true">
          <Hanko size={34} />
        </div>
      </section>
    );
  }

  const isSeal = index === total - 1;

  return (
    <section className="bpage" data-gutter={def.gutter ?? "normal"}>
      <div className="bpage-koma">
        {def.panels.map((p, i) => (
          <Koma key={i} p={p} project={project} />
        ))}
      </div>

      {/* THE SEAL PAGE (§9.1 beat 5). The astras strip and the colophon marks are
          not authored in the script — they are pulled from projects.ts, because a
          book restating its own project's tech stack is a second copy to keep in
          sync with the index page that links to it. */}
      {isSeal && (
        <footer className="bpage-seal">
          <div className="bseal-astras">
            {project.astras.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
          <div className="bseal-colophon">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        </footer>
      )}
    </section>
  );
}
