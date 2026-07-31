import "./globals.css";

export const metadata = {
  title: "Velidanda Krishna Sai — Portfolio",
  description:
    "Machine-learning researcher and builder. Dual degree at IIIT Bangalore; multimodal EEG–ECG stress research at Samsung Lab. A portfolio read as a manga volume.",
};

/* Declared explicitly rather than relying on the framework default: the whole
   mobile pass (svh units, the 900px breakpoint) is meaningless without
   width=device-width. `maximumScale` is intentionally NOT set -- capping zoom
   is an accessibility failure, and nothing here breaks when zoomed. */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#25090e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Preload the two faces that paint above the fold: the hero lockup
          (Shippori 800) and body copy (Inter 400). @font-face alone is only
          discovered after the CSS parses, which costs a visible swap on the
          hero. The other 14 subsets stay lazy behind unicode-range.

          These are rendered as bare siblings of <body>, NOT wrapped in an
          explicit <head>. React 19 hoists <link rel="preload"> into the head
          on its own. Writing the <head> tag by hand here breaks hydration --
          and it fails silently: no console error, the server HTML paints fine,
          but client effects never run. The visible symptom was the chakra
          vanishing, because react-three-fiber sizes its canvas from a mount
          effect, so the canvas sat at its default 300x150 and rendered
          nothing. Cost an hour. Do not reintroduce the <head> wrapper. */}
      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href="/fonts/shippori-mincho-latin-800-normal.woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href="/fonts/inter-latin-400-normal.woff2"
        crossOrigin="anonymous"
      />
      <body>{children}</body>
    </html>
  );
}
