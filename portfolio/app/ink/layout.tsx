/**
 * noindex for the /ink workshop.
 *
 * It lives in a layout rather than the page because `app/ink/page.tsx` is a
 * client component ("use client"), and a client component cannot export
 * `metadata` — Next silently ignores it, which is the worst possible failure for
 * a robots directive. A server layout wrapping it can.
 */
export const metadata = {
  title: "ink · workshop",
  robots: { index: false, follow: false },
};

export default function InkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
