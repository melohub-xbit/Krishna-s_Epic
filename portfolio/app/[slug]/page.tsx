/**
 * /:slug — a deep link straight to one spread. `/ramayanam`, `/about`, and so on.
 *
 * [2026-07-30] This is what closes the gap left when `lib/store.ts` was deleted:
 * the Zustand store owned `history.pushState` and the slug→index mapping, and
 * when it went, so did every URL. The book pushed no history at all, so a spread
 * could not be linked or reloaded.
 *
 * `generateStaticParams` prerenders one static page per spread, so these are real
 * URLs a crawler and a shared link both resolve — not client-side routes that
 * only work once the app has booted. The cover is deliberately NOT in the list:
 * it lives at `/`, and a second URL for the same page would split its ranking and
 * let the reader see `/cover` in the address bar for the site root.
 *
 * Explicit routes win over a dynamic segment in the app router, so `/ink`,
 * `/landing` and `/grantha` are unaffected by this file.
 */
import { notFound } from "next/navigation";

import BookStage from "@/components/grantha/BookStage";
import { SPREADS } from "@/data/spreads";

export function generateStaticParams() {
  return SPREADS.slice(1).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spread = SPREADS.find((s) => s.slug === slug);
  if (!spread) return {};
  const [te, latin] = spread.title;
  return { title: `${latin} · ${te} — Velidanda Krishna Sai` };
}

export default async function SpreadRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = SPREADS.findIndex((s) => s.slug === slug);
  // i === 0 is the cover, which is `/`. Anything unknown is a real 404 rather
  // than a silent fall back to the cover — a wrong URL should say so.
  if (i <= 0) notFound();
  return <BookStage initialPage={i} syncUrl />;
}
