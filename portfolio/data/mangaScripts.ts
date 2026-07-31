/**
 * PROJECT BOOKS — the compiled manga scripts.
 *
 * Authoring lives in `masterplan/09-manga-scripts.md`: the five-beat structure
 * (§9.1), the writing rules (§9.2), the script format (§9.3) and the complete
 * scripts. This file is the compiled form of those scripts, hand-translated to the
 * schema below. Read 09 before adding a book — the beats are not optional and the
 * register differs by epic: Ramayanam narrates as *tapasya* (patient, wide
 * gutters), Mahabharatam as *yuddha* (tight gutters, diagonals, speed).
 *
 * ================================================================
 * TYPE-ONLY PANELS ARE THE DEFAULT, NOT A COMPROMISE
 * ================================================================
 * §9.2: "A book with strong typography and two illustrated panels beats six
 * mediocre AI images." No art exists for these yet, so every panel here is
 * type-only and carries its composition through the caption, the SFX lettering and
 * the panel's own wagara wash. The art DESCRIPTION from the script is kept in
 * `artNote` — not rendered, but it is the prompt, and it belongs next to the panel
 * it is for rather than in a document nobody opens when generating images. Fill in
 * `art` (a key into public/art/) when a real image exists; the panel will use it
 * and ignore the note.
 *
 * ================================================================
 * WHAT IS *NOT* IN A SCRIPT
 * ================================================================
 * Anything already true of the project: its mon, its astras strip, its links, its
 * title. Those come from `data/projects.ts` via `projectId`, because duplicating
 * them here is how a book ends up disagreeing with the index page that links to
 * it. A script holds only what is unique to telling the story.
 */

export type Shot = "establishing" | "action" | "closeup" | "insert" | "splash";
export type PanelSize = "hero" | "wide" | "half" | "third";
export type PanelTone = "screentone" | "speedlines" | "none";

export interface Panel {
  shot: Shot;
  /** Grid weight. hero and wide are full width; hero is also double height. */
  size: PanelSize;
  /** Tachikiri — full bleed, no border. §03.2: "a moment that stops time." */
  bleed?: boolean;
  /** Slanted gutters, for action and menace. */
  diagonal?: boolean;
  /** Key into public/art/. Absent = type-only panel, which is fine (§9.2). */
  art?: string;
  /** The art prompt, for whoever generates it later. Never rendered. */
  artNote?: string;
  /** Narrator box. ≤ 18 words, present tense, no marketing voice (§9.2). */
  caption?: string;
  dialogue?: { speaker: string; text: string };
  /** Display lettering. Numbers are the loudest thing on the page (§9.2). */
  sfx?: string;
  /** Set when the SFX is a formula or architecture, not an onomatopoeia. */
  cartouche?: boolean;
  tone?: PanelTone;
}

export interface BookPage {
  panels: Panel[];
  gutter?: "tight" | "normal" | "wide";
  /**
   * Page 1 of every book. Rendered as a title lockup rather than through the panel
   * grammar — a cover is a different kind of page, and forcing it through the same
   * grid is what makes covers look like a first content page.
   */
  cover?: boolean;
}

export interface MangaScript {
  /** Must match an `id` in projects.ts. */
  projectId: string;
  /** Roman numeral as written in the script. Authored, not derived. */
  chapter: string;
  /** One thematic word, Telugu + English. The locked pairing rule (§9.2). */
  theme: [telugu: string, english: string];
  pages: BookPage[];
}

/* ============================================================ §9.4 — DALSP
   Ramayanam · research register. Tapasya: measured pacing, wide gutters on the
   pages that are meant to be sat with (the villain, the seal). */

const dalsp: MangaScript = {
  projectId: "dalsp",
  chapter: "I",
  theme: ["కత్తిరింపు", "The Pruning"],
  pages: [
    {
      cover: true,
      gutter: "normal",
      panels: [
        {
          shot: "splash",
          size: "hero",
          bleed: true,
          artNote:
            "A vast banyan of glowing neuron-branches under a pruning moon; a small figure with shears stands before it. Seinen ink + screentone.",
          caption: "Every domain pays for every neuron. Someone must cut.",
        },
      ],
    },
    {
      gutter: "wide",
      panels: [
        {
          shot: "establishing",
          size: "wide",
          diagonal: true,
          tone: "screentone",
          artNote:
            "Phi-3.5-mini as an armoured colossus, magnificent and too heavy to kneel; MLP blocks as armour plates.",
          caption:
            "The giant answers law, math, code alike — carrying all of its weight to every fight.",
        },
        {
          shot: "closeup",
          size: "third",
          dialogue: { speaker: "the giant", text: "All of me. Always." },
          sfx: "H E A V Y",
        },
      ],
    },
    {
      gutter: "normal",
      panels: [
        {
          shot: "closeup",
          size: "hero",
          artNote: "A lantern held to the branches; some blaze, some never light.",
          caption:
            "Entropy is a lantern. Branches that never light for a domain were never needed by it.",
        },
        {
          shot: "insert",
          size: "third",
          cartouche: true,
          sfx: "H(X) = −Σ p log p",
          caption: "An information-theoretic razor — Wanda, questioned and extended.",
        },
      ],
    },
    {
      gutter: "tight",
      panels: [
        {
          shot: "action",
          size: "wide",
          tone: "speedlines",
          artNote: "The shears close; branches fall as clean ink strokes.",
          sfx: "20% PRUNED",
        },
        {
          shot: "action",
          size: "half",
          diagonal: true,
          artNote:
            "Four slimmer silhouettes step out of the giant's shadow: General, Math, Code, Law.",
          caption: "Not one smaller giant — four specialists.",
        },
        { shot: "insert", size: "third", sfx: "NO RETRAINING." },
      ],
    },
    {
      gutter: "wide",
      panels: [
        {
          shot: "closeup",
          size: "hero",
          artNote: "The hanko pressed beside the pruned tree, ensō closing around it.",
          caption: "Specialised subnetworks, carved — nothing relearned.",
        },
      ],
    },
  ],
};

/* ========================================================== §9.5 — HFT SIM
   Mahabharatam · battle register. Yuddha: tight gutters throughout, and pages 3
   and 4 of the five beats deliberately MERGED — the turn and the battle are one
   move at this pace. Four pages, not five, and that is the script's choice. */

const hftSim: MangaScript = {
  projectId: "hft-sim",
  chapter: "VII",
  theme: ["వేగం", "Speed"],
  pages: [
    {
      cover: true,
      gutter: "tight",
      panels: [
        {
          shot: "splash",
          size: "hero",
          bleed: true,
          tone: "speedlines",
          artNote:
            "A candlestick chart forged into a blade mid-swing; order-book rungs as the hilt. Sparks are tick data.",
          caption: "The market never sleeps. Neither can the engine.",
        },
      ],
    },
    {
      gutter: "tight",
      panels: [
        {
          shot: "establishing",
          size: "wide",
          diagonal: true,
          tone: "screentone",
          artNote:
            "The order book as a waterfall demon — bids and asks as two colliding torrents.",
          caption:
            "Ten thousand orders a heartbeat. One slow match and the torrent walks over you.",
          sfx: "R U S H",
        },
      ],
    },
    {
      gutter: "tight",
      panels: [
        {
          shot: "action",
          size: "half",
          artNote: "A smith's anvil striking — each spark a matched order.",
          caption: "A matching engine forged first; everything else serves it.",
        },
        {
          shot: "action",
          size: "half",
          tone: "speedlines",
          sfx: "MATCH! MATCH! MATCH!",
        },
        {
          shot: "insert",
          size: "third",
          caption: "Price-time priority. No order jumps the queue — dharma of the book.",
        },
      ],
    },
    {
      gutter: "wide",
      panels: [
        {
          shot: "closeup",
          size: "hero",
          artNote: "The blade sheathed; the chart calm behind it. Hanko stamp.",
          caption: "An exchange that keeps its word at speed.",
        },
      ],
    },
  ],
};

export const MANGA_SCRIPTS: MangaScript[] = [dalsp, hftSim];

/** The script for a project, or null — 18 of 20 projects have none yet. */
export function scriptFor(projectId: string): MangaScript | null {
  return MANGA_SCRIPTS.find((s) => s.projectId === projectId) ?? null;
}
