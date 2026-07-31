/**
 * /grantha (గ్రంథం, "the bound volume") — the book's WORKBENCH.
 *
 * [2026-07-30] The book itself moved to `/` (see app/page.tsx). This route stays
 * on purpose, as the place to look at the volume in isolation: no landing
 * sequence, and `syncUrl` off so it never rewrites the address bar out from under
 * you while you are testing turns. Everything else — canvas rig, post chain,
 * book — is literally the same component the site root mounts, so what you see
 * here is what ships.
 *
 * noindex: a workbench is not a page. This duplicates `/` exactly, which is
 * precisely why it must not be indexed — two URLs for one volume.
 */
import BookStage from "@/components/grantha/BookStage";

export const metadata = {
  title: "grantha · workbench",
  robots: { index: false, follow: false },
};

export default function GranthaPage() {
  return <BookStage initialPage={0} />;
}
