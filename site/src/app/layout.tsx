import type { Metadata, Viewport } from "next";
import {
  Instrument_Sans,
  DM_Mono,
  Noto_Sans_Telugu,
  Fraunces,
} from "next/font/google";
import { paletteCSS, PALETTES, ACTIVE, DEFAULT_MODE } from "@/lib/palette";
import Cursor from "@/components/Cursor";
import Ambient from "@/components/Ambient";
import "./globals.css";

/* Self-hosted by next/font — no requests leave the origin, and the
   metric-matched fallback is generated automatically. */
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
/* The one warm face. Fraunces is variable on a softness and a wonk axis,
   so quotes can be set soft and slightly hand-drawn while headings are the
   same family set flat — one family, two temperaments. */
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});
const telugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600"],
  variable: "--font-telugu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Velidanda Krishna Sai",
  description:
    "Machine learning research and the systems that carry it. Dual degree at IIIT Bangalore; multimodal stress research at Samsung Lab.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: PALETTES[ACTIVE][DEFAULT_MODE].bg,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${telugu.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      {/* This MUST live inside <head>. React 19 will not hoist a bare
          <style> without a `precedence` + `href` pair — put one directly
          under <html> and you get console errors and a hydration
          mismatch. */}
      <head>
        {/* The entire palette, generated from src/lib/palette.ts.
            This is the only place colour enters the document. */}
        <style
          id="palette"
          dangerouslySetInnerHTML={{ __html: paletteCSS() }}
        />
      </head>
      <body>
        {/* Outside the flipping panel on purpose: the paper turns, the
            light does not. */}
        <Ambient />
        {/* The panel the door flips. It carries no transform at rest — an
            ancestor with one turns every `position: fixed` child into a
            positioned one, which would quietly break the field canvas, the
            bar and every pinned section. Door.tsx adds the transform for
            the length of the flip and takes it off again. */}
        <div className="flip">{children}</div>
        <Cursor />
      </body>
    </html>
  );
}
