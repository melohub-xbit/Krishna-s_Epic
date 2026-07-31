/**
 * noindex for the /landing workshop. Same reason as app/ink/layout.tsx: the page
 * is a client component and cannot export `metadata` itself.
 *
 * This route now duplicates a sequence that also plays at `/`, so indexing it
 * would put a bare animation bench in search results next to the real site.
 */
export const metadata = {
  title: "landing · workshop",
  robots: { index: false, follow: false },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
