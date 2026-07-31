"use client";

/**
 * THE VELIDANDA SEAL — వెలిదండ cut as a rectangular nameplate hanko.
 * Spec: 02-japanese-layer.md §2.1 [REVISED 2026-07-20].
 *
 * SCOPE: the landing sequence. This does NOT replace the కృ seal
 * (`ornament/Motifs.tsx` → `Hanko`), which remains the site's mark for the nav
 * anchor, cursor and chapter-approved stamp. కృ is one akshara and reads at
 * 48px; this is four on one line and is meant to be held large.
 *
 * FORM. A single row in a VW:VH rectangle — the nameplate proportion, not the
 * square. Both are authentic hanko shapes; the rectangle is the one used for
 * longer names, which four aksharas is. The width is DERIVED from the shaped
 * aksharas rather than chosen: the frame fits the name, so no letterform is
 * stretched to fill a predetermined box.
 *
 * AUTHENTICITY — what is borrowed and what is not. Tensho (篆書, seal script)
 * is Chinese/Japanese and has no Telugu tradition, so a "Telugu tensho" is
 * invention either way. What is borrowed is the ARRANGEMENT grammar: a dense
 * block, a carved inner rule, white-on-vermilion (hakubun) impression. The
 * letterforms are untouched Noto Sans Telugu Bold. Borrowing layout grammar is
 * homage; redrawing an Indic script into a Sinitic idiom would be counterfeit.
 *
 * ONE deliberate exception [2026-07-21]: in లి the ి reads as a stroke laid
 * OVER ల, and ల breaks where it crosses. They are a single closed contour in
 * the 700 weight — not two glyphs — so there is nothing to nudge, and at seal
 * scale they fuse into a blob and the gunintam stops reading as a gunintam.
 * వె has a clear gap between ె and వ; లి had none.
 *
 * This is a stroke crossing, NOT an added separation — that distinction is the
 * whole fix. Two earlier attempts added a gap to the merged shape (a straight
 * slot, then a cut following ల's shoulder) and both read as damage to ల. The ి
 * is a ring, so it stays a whole ring and the under stroke gives way, which is
 * what one brush stroke laid over another actually looks like. The break is
 * therefore the OVER stroke's own edge.
 *
 * The ring is measured, not assumed: a least-squares circle through the outer
 * silhouette's free arc gives centre ≈(366, 562) r ≈155 at 2.5 units mean
 * residual, so continuing it through ల reconstructs the stroke rather than
 * inventing one. `CROSSINGS` in scripts/build-seal.py; the fit refuses to cut
 * if the residual grows. No control point of either outline moves.
 *
 * CONSTRUCTION. Real GLYPH OUTLINES, not <text>. వెలిదండ is 7 codepoints
 * shaping into 4 clusters (వె | లి | దం | డ) — two vowel-sign ligatures and an
 * anusvara — so it was shaped with HarfBuzz, outlines extracted with fontTools
 * and transforms baked. See scripts/shape-seal.py → build-seal.py; rerun both
 * if the wordmark changes. Consequences: no webfont dependency at paint time,
 * no hydration risk from text metrics, and the paths can be fed to inkDraw if
 * the seal ever needs to carve itself on screen.
 *
 * One uniform scale across all four clusters, columns sized to content.
 * Scaling each to an equal cell squashes దం (two glyphs, ~1.7× the width of a
 * single akshara) — stroke weight is what the eye compares across a seal.
 *
 * NEVER RENDER IT FLAT-PERFECT (§2.1). The displacement filter is the point:
 * a real impression takes ink unevenly and breaks up at the edge. A crisp
 * vector rectangle reads as a sticker.
 */
import { useId } from "react";
import { PALETTE } from "@/lib/palette";

/** Intrinsic aspect ratio, derived from the shaped name. */
export const SEAL_ASPECT = 376.9 / 100;

export interface VelidandaSealProps {
  /** Rendered height in px; width follows the intrinsic ratio. */
  height?: number;
  className?: string;
  /** Ink take-up irregularity. 0 = flat vector (don't), 1 = default press. */
  roughness?: number;
  title?: string;
}

export default function VelidandaSeal({
  height = 88,
  className,
  roughness = 1,
  title = "వెలిదండ · Velidanda",
}: VelidandaSealProps) {
  // useId: the filter id must survive SSR → hydration unchanged, and several
  // seals may share a page.
  const uid = useId().replace(/:/g, "");
  const roughId = `seal-rough-${uid}`;

  return (
    <svg
      viewBox="0 0 376.9 100"
      height={height}
      width={height * SEAL_ASPECT}
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <filter id={roughId} x="-8%" y="-14%" width="116%" height="128%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.075"
            numOctaves={3}
            seed={11}
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale={3.1 * roughness}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* The whole impression is displaced as ONE unit. Filtering the field and
          the glyphs separately makes them drift apart, and the seal stops
          looking like a single press of a single carved block. */}
      <g filter={`url(#${roughId})`}>
        <rect
          x="2.5"
          y="2.5"
          width={376.9 - 5}
          height={100 - 5}
          rx="2"
          fill={PALETTE.kumkum}
        />
        {/* The carved inner rule, standard on a formal seal. */}
        <rect
          x="7"
          y="7"
          width={376.9 - 14}
          height={100 - 14}
          fill="none"
          stroke={PALETTE.sealInk}
          strokeWidth="1.9"
        />
        <g fill={PALETTE.sealInk}>
          {/* వె */}
          <path d="M61.09 85.00Q56.54 85.00 53.03 83.67Q49.52 82.34 45.96 79.17Q42.40 75.99 37.47 70.49Q34.82 67.45 33.30 66.27Q31.78 65.08 29.79 65.08Q28.27 65.08 26.80 66.27Q25.33 67.45 25.33 69.92Q25.33 72.86 26.90 74.00Q28.46 75.14 30.55 75.14Q32.82 75.14 35.10 73.24Q37.38 71.34 38.33 66.98L46.20 75.33Q44.30 77.98 42.26 80.21Q40.22 82.44 37.19 83.72Q34.15 85.00 29.03 85.00Q23.43 85.00 19.88 82.87Q16.32 80.73 14.66 77.27Q13.00 73.81 13.00 70.01Q13.00 65.46 15.18 62.09Q17.36 58.73 21.16 56.83Q24.95 54.93 29.69 54.93Q33.68 54.93 36.71 55.98Q39.75 57.02 42.64 59.39Q45.53 61.76 49.04 65.65Q52.08 68.97 54.07 70.68Q56.06 72.38 57.67 72.95Q59.29 73.52 60.99 73.52Q64.03 73.52 65.83 71.63Q67.63 69.73 67.63 65.56Q67.63 60.62 65.17 56.64Q62.70 52.66 58.43 50.09Q54.17 47.53 48.66 46.78H40.70V36.44H50.75L52.74 38.24Q62.04 40.04 68.30 43.50Q74.56 46.96 77.69 52.18Q80.82 57.40 80.82 64.61Q80.82 70.77 78.54 75.37Q76.27 79.97 71.86 82.49Q67.44 85.00 61.09 85.00ZM75.98 31.98Q75.98 35.30 74.70 38.24Q73.42 41.18 71.24 42.79Q68.77 44.69 65.45 45.73Q62.13 46.78 56.63 46.78H42.97V36.44H56.25Q59.00 36.44 60.38 36.10Q61.75 35.77 62.51 35.11Q63.08 34.54 63.37 33.83Q63.65 33.12 63.65 32.26Q63.65 31.12 63.37 30.32Q63.08 29.51 62.42 28.94Q61.66 28.28 60.28 27.99Q58.91 27.71 55.78 27.71H17.65V16.99H54.54Q61.28 16.99 65.07 17.94Q68.87 18.89 71.52 21.26Q73.51 22.97 74.75 25.62Q75.98 28.28 75.98 31.98Z" />
          {/* లి */}
          <path d="M122.36 85.00Q131.18 85.00 137.73 83.06Q144.27 81.11 148.68 77.13Q153.09 73.14 155.28 67.17Q157.46 61.19 157.46 53.22Q157.46 47.53 156.13 42.13Q154.80 36.72 152.19 31.98Q149.59 27.24 145.55 23.68Q141.52 20.12 136.12 18.08Q130.71 16.04 123.88 16.04Q117.91 16.04 114.02 17.94Q110.13 19.84 108.18 22.97Q106.24 26.10 106.24 29.80Q106.24 33.31 107.95 36.25Q108.02 36.38 108.11 36.52Q108.53 36.48 108.95 36.46C109.45 37.48 110.08 38.43 110.81 39.29C111.09 39.62 111.39 39.94 111.71 40.24C114.13 42.58 117.42 44.01 121.05 44.01C121.62 44.01 122.18 43.98 122.72 43.91Q122.07 43.21 121.28 42.58Q127.14 42.34 130.66 39.47Q134.50 36.34 134.50 30.46Q134.50 30.31 134.50 30.16Q137.14 32.29 138.96 34.87Q141.81 38.90 143.04 43.60Q144.27 48.29 144.27 53.60Q144.27 59.58 142.52 63.47Q140.76 67.36 137.73 69.54Q134.69 71.72 130.90 72.62Q127.11 73.52 123.03 73.52Q114.59 73.52 109.89 71.58Q105.20 69.63 103.35 66.79Q103.00 66.26 102.72 65.75Q102.91 65.82 103.11 65.89Q106.14 66.98 109.94 66.98Q115.15 66.98 118.76 65.32Q122.36 63.66 124.26 60.53Q126.16 57.40 126.16 53.04Q126.16 49.62 124.54 46.49Q124.45 46.31 124.35 46.14C123.29 46.36 122.18 46.48 121.05 46.48C115.52 46.48 110.65 43.66 107.80 39.39Q103.34 39.79 99.60 41.70Q94.86 44.12 92.11 48.72Q89.36 53.32 89.36 59.96Q89.36 66.79 92.96 72.48Q96.56 78.17 103.91 81.59Q111.27 85.00 122.36 85.00ZM101.60 56.25Q101.98 53.50 103.77 51.38Q106.05 48.67 109.37 48.67Q111.55 48.67 112.69 50.00Q113.83 51.33 113.83 53.04Q113.83 55.50 112.02 56.64Q110.22 57.78 107.28 57.78Q104.82 57.78 102.82 56.88Q102.19 56.59 101.60 56.25ZM124.04 26.16Q125.02 27.78 125.02 29.99Q125.02 31.60 123.83 32.59Q122.65 33.59 120.56 33.59Q118.76 33.59 117.72 32.69Q116.67 31.79 116.67 29.99Q116.67 28.09 118.00 27.09Q119.33 26.10 121.89 26.10Q123.29 26.10 124.04 26.16Z" />
          {/* దం */}
          <path d="M214.84 85.00Q210.95 85.00 208.01 84.10Q205.07 83.20 202.75 81.11Q200.43 79.02 198.24 75.51L200.24 75.33Q197.49 79.40 194.83 81.49Q192.17 83.58 189.28 84.29Q186.39 85.00 182.78 85.00Q175.29 85.00 170.64 79.69Q165.99 74.38 165.99 64.89Q165.99 56.73 169.98 50.28Q173.96 43.83 181.41 40.14Q188.85 36.44 199.10 36.44Q209.53 36.44 216.98 40.18Q224.42 43.93 228.36 50.33Q232.30 56.73 232.30 64.89Q232.30 71.34 229.97 75.85Q227.65 80.35 223.71 82.68Q219.78 85.00 214.84 85.00ZM212.66 73.52Q215.70 73.52 217.40 71.29Q219.11 69.07 219.11 63.66Q219.11 58.92 216.98 55.17Q214.84 51.42 210.53 49.29Q206.21 47.15 199.76 47.15H198.81Q192.46 47.15 188.09 49.29Q183.73 51.42 181.46 55.17Q179.18 58.92 179.18 63.66Q179.18 68.97 180.89 71.25Q182.59 73.52 185.63 73.52Q188.76 73.52 190.70 71.29Q192.65 69.07 193.03 64.70H205.26Q205.83 69.35 207.92 71.44Q210.01 73.52 212.66 73.52ZM196.25 46.30Q191.79 46.30 188.38 44.83Q184.96 43.36 182.59 39.99Q180.22 36.63 178.89 30.84L191.79 27.52Q192.84 32.36 194.07 34.40Q195.30 36.44 197.49 36.44Q198.91 36.44 200.33 35.39Q201.75 34.35 204.12 31.41L208.11 26.38Q211.43 22.21 214.37 19.79Q217.31 17.37 220.77 16.23Q224.23 15.09 229.07 15.00L229.83 26.00Q226.60 26.19 224.28 27.09Q221.96 27.99 220.06 29.61Q218.16 31.22 216.08 33.88L212.95 37.76Q211.14 40.04 208.68 41.99Q206.21 43.93 203.13 45.12Q200.05 46.30 196.25 46.30ZM238.27 64.23Q238.27 58.25 241.12 53.51Q243.96 48.77 249.18 46.02Q254.40 43.27 261.60 43.27Q268.91 43.27 274.03 46.02Q279.15 48.77 281.86 53.51Q284.56 58.25 284.56 64.23Q284.56 70.20 281.81 74.90Q279.06 79.59 273.89 82.30Q268.72 85.00 261.41 85.00Q254.21 85.00 248.99 82.25Q243.77 79.50 241.02 74.80Q238.27 70.11 238.27 64.23ZM250.98 64.13Q250.98 68.50 253.59 71.48Q256.20 74.47 261.41 74.47Q264.92 74.47 267.20 73.10Q269.48 71.72 270.66 69.35Q271.85 66.98 271.85 64.13Q271.85 59.77 269.14 56.78Q266.44 53.79 261.41 53.79Q258.09 53.79 255.77 55.17Q253.45 56.54 252.21 58.87Q250.98 61.19 250.98 64.13Z" />
          {/* డ */}
          <path d="M345.93 85.00Q340.52 85.00 336.73 84.00Q332.93 83.01 330.28 81.16Q327.62 79.31 325.53 76.84L326.20 76.94Q323.92 80.26 321.41 82.01Q318.89 83.77 316.10 84.38Q313.30 85.00 309.88 85.00Q302.39 85.00 297.74 79.69Q293.09 74.38 293.09 64.61Q293.09 55.50 297.55 49.19Q302.01 42.89 310.17 39.66Q318.33 36.44 329.23 36.44Q335.02 36.44 339.76 37.10Q344.50 37.76 348.96 39.04Q353.42 40.33 358.35 42.32L352.57 52.94Q347.44 50.66 343.60 49.43Q339.76 48.20 336.25 47.68Q332.74 47.15 328.57 47.15Q320.79 47.15 315.86 49.38Q310.93 51.61 308.60 55.36Q306.28 59.11 306.28 63.66Q306.28 68.97 307.99 71.25Q309.69 73.52 312.73 73.52Q315.86 73.52 317.80 71.25Q319.75 68.97 320.13 64.89H331.79Q332.08 68.59 334.02 70.87Q335.97 73.14 340.62 73.81Q342.04 74.09 343.79 74.23Q345.55 74.38 347.54 74.38Q350.20 74.38 351.71 73.33Q353.23 72.29 353.23 69.92Q353.23 68.31 352.14 67.26Q351.05 66.22 349.15 66.22Q347.35 66.22 346.07 67.26Q344.79 68.31 344.79 70.68Q344.79 72.38 345.64 73.86Q346.50 75.33 348.01 76.46L338.81 79.12Q337.20 76.84 336.39 73.86Q335.59 70.87 335.59 69.07Q335.59 63.28 339.24 59.72Q342.89 56.17 349.53 56.17Q353.89 56.17 357.12 57.97Q360.34 59.77 362.15 62.85Q363.95 65.93 363.95 69.73Q363.95 72.57 363.05 75.33Q362.15 78.08 360.11 80.26Q358.07 82.44 354.56 83.72Q351.05 85.00 345.93 85.00ZM325.82 46.30Q321.36 46.30 317.95 44.83Q314.53 43.36 312.16 39.99Q309.79 36.63 308.46 30.84L321.36 27.52Q322.40 32.36 323.64 34.40Q324.87 36.44 327.05 36.44Q328.47 36.44 329.90 35.39Q331.32 34.35 333.69 31.41L337.67 26.38Q340.99 22.21 343.93 19.79Q346.88 17.37 350.34 16.23Q353.80 15.09 358.64 15.00L359.40 26.00Q356.17 26.19 353.85 27.09Q351.52 27.99 349.63 29.61Q347.73 31.22 345.64 33.88L342.51 37.76Q340.71 40.04 338.24 41.99Q335.78 43.93 332.70 45.12Q329.61 46.30 325.82 46.30Z" />
        </g>
      </g>
    </svg>
  );
}
