import type { MangaScript } from "@/data/mangaScripts";
import { scriptFor } from "@/data/mangaScripts";
import type { Project } from "@/data/projects";

/**
 * A BOOK FOR EVERY PROJECT — the record register.
 *
 * Two of twenty projects have a hand-written manga script (09-manga-scripts.md
 * §9.4–9.5). The other eighteen get their book generated from what is already
 * written about them in `data/projects.ts`.
 *
 * ================================================================
 * WHY THIS EXISTS, AND IT IS NOT "A PLACEHOLDER"
 * ================================================================
 * Turning the arc pages into chapter indexes was right, but it removed something:
 * the old project card showed the full description and the tech strip, and an index
 * row shows a name and a subtitle. For DALSP and HFT SIM that is fine, because the
 * detail moved into their books. For the other eighteen it meant their descriptions
 * rendered NOWHERE on the site, and the only way to find out what a project was, was
 * to leave for GitHub. Krishna spotted the symptom immediately: "the content in the
 * book doesn't match".
 *
 * So the fallback is a BOOK, not a smaller row. Every project opens; the two
 * flagships read as manga, the rest read as a clean record. Nothing is a dead end
 * and no writing is stranded. Promoting a project to a real script later is additive
 * — `scriptFor` wins, and this function is never consulted for it.
 *
 * ================================================================
 * THE STORY REGISTER AND THE RECORD REGISTER
 * ================================================================
 * 09 §9.1's five beats are a *story*. A portfolio also owes the reader the *record*:
 * what the thing is, what was actually built, what came out, what it was built with.
 * A generated book is deliberately the record register only — three pages, no
 * metaphor. Inventing a villain and a turn for a project from its one-paragraph
 * description would produce exactly the mediocre filler §9.2 warns against, and a
 * reader can always tell.
 *
 * Nothing here is invented. Every string comes from `projects.ts`.
 */

/** Roman numerals for chapter marks. Twenty projects, so this is enough. */
const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
];

/**
 * A sentence-ish split of the description, so the record page can give the first
 * claim its own emphasis instead of printing one grey paragraph. Splits on ". "
 * only — the descriptions use em dashes and decimals freely, and anything cleverer
 * mangles "3.5-mini" or "r = 0.08".
 */
function firstClaim(feat: string): [string, string] {
  const i = feat.indexOf(". ");
  if (i < 0 || i > 150) return [feat, ""];
  return [feat.slice(0, i + 1), feat.slice(i + 2)];
}

/**
 * Build the record book for a project. `chapterIndex` is its position in its own
 * arc, so the chapter mark matches the number the index page shows.
 */
export function recordBook(p: Project, chapterIndex: number): MangaScript {
  const [lead, rest] = firstClaim(p.feat);

  return {
    projectId: p.id,
    chapter: ROMAN[chapterIndex] ?? String(chapterIndex + 1),
    // The thematic word pair a hand-written cover would carry. A generated book has
    // no theme of its own, so it uses the honest one: this is a record.
    theme: ["నివేదిక", "The Record"],
    pages: [
      {
        cover: true,
        gutter: "normal",
        panels: [
          {
            shot: "splash",
            size: "hero",
            bleed: true,
            // The badge is the most editorial line available and belongs on the
            // cover; falling back to the subtitle keeps the page from being bare.
            caption: p.badge ?? p.sub ?? "",
          },
        ],
      },
      {
        gutter: "normal",
        panels: [
          {
            shot: "establishing",
            size: "hero",
            tone: "screentone",
            caption: lead,
          },
          ...(rest
            ? ([
                {
                  shot: "insert" as const,
                  size: "wide" as const,
                  caption: rest,
                },
              ] as const)
            : []),
        ],
      },
      {
        // The last page is the seal, and BookPage puts the tech strip and the links
        // there automatically from projects.ts — which is why neither is duplicated
        // into these panels.
        gutter: "wide",
        panels: [
          {
            shot: "closeup",
            size: "hero",
            caption: p.sub ?? p.title,
          },
        ],
      },
    ],
  };
}

/** The written script if there is one, otherwise the generated record. */
export function bookFor(p: Project, chapterIndex: number): MangaScript {
  return scriptFor(p.id) ?? recordBook(p, chapterIndex);
}

/** True when this project's book is hand-written manga rather than a record. */
export function isScripted(p: Project) {
  return scriptFor(p.id) !== null;
}
