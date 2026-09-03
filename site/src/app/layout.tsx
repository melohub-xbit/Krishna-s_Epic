import type { Metadata, Viewport } from "next";
import { Instrument_Sans, DM_Mono, Noto_Sans_Telugu } from "next/font/google";
import { paletteCSS, PALETTES, ACTIVE, DEFAULT_MODE } from "@/lib/palette";
import Cursor from "@/components/Cursor";
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

/* Set the mode before first paint so there is never a flash of the wrong
   one. Reads a saved choice, else the OS setting, else DEFAULT_MODE. */
const modeScript = `(function(){try{
var s=localStorage.getItem('mode');
var m=s||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'${DEFAULT_MODE}');
document.documentElement.dataset.mode=m;
}catch(e){document.documentElement.dataset.mode='${DEFAULT_MODE}';}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${telugu.variable}`}
      suppressHydrationWarning
    >
      {/* Both of these MUST live inside <head>. React 19 will not hoist a
          bare <style> without a `precedence` + `href` pair, and a
          non-async <script> outside the head has no defined order — put
          either directly under <html> and you get four console errors and
          a hydration mismatch. */}
      <head>
        {/* The entire palette, generated from src/lib/palette.ts.
            This is the only place colour enters the document. */}
        <style
          id="palette"
          dangerouslySetInnerHTML={{ __html: paletteCSS() }}
        />
        {/* Runs before paint, so the mode is set on <html> before the
            first frame and there is no flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        {children}
        <Cursor />
      </body>
    </html>
  );
}
