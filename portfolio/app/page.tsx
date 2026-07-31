/**
 * / — THE SITE. The manga volume, opened at the cover, with the landing
 * sequence writing itself first.
 *
 * [2026-07-30] This used to be the scroll site (`components/foreground/Site.tsx`
 * + `Reveal.tsx`, both now DELETED). The scroll document was always the interim
 * reading path — see masterplan 03 "Reversed decisions". The spread components it
 * rendered are unchanged and now live only in the book; nothing was lost with it,
 * because Site.tsx held chrome and no content of its own.
 *
 * A server component on purpose, so this route stays statically prerenderable and
 * the spread markup is in the HTML a crawler receives.
 */
import BookStage from "@/components/grantha/BookStage";

export default function Page() {
  return <BookStage initialPage={0} landing syncUrl />;
}
