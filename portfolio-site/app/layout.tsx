import type { Metadata } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/theme/ThemeScript";
import BackgroundStack from "@/components/background/BackgroundStack";
import Particles from "@/components/background/Particles";
import InkCursor from "@/components/cursor/InkCursor";
import NavRail from "@/components/nav/NavRail";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Reveal from "@/components/providers/Reveal";

export const metadata: Metadata = {
  title: "Velidanda Krishna Sai — a portfolio in panels",
  description:
    "The portfolio of Velidanda Krishna Sai — machine-learning researcher and builder — told as a manga across two epics: Ramayanam (research) and Mahabharatam (dev).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Noto+Serif+Telugu:wght@400;600;700&family=Zilla+Slab:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <BackgroundStack />
        <Particles />
        <SmoothScroll />
        <Reveal />
        <NavRail />
        <InkCursor />
        <main>{children}</main>
      </body>
    </html>
  );
}
