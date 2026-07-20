"use client";
import { ReactNode } from "react";

/**
 * ORNAMENT LIBRARY — the manga panel frame.
 *
 * A panel is the primary layout unit of the whole site (portfolio-build-plan
 * §5), so this is the single most-reused crafted element and gets the most
 * detail.
 *
 * Construction — four layers, none of them a plain rectangle:
 *   1. a double rule (heavy outer, hairline inner) — the manga panel border
 *   2. a corner ornament at each corner, built from a Japanese kumiko bracket
 *      interlocked with a Telugu lotus-bud palmette and a raised boss
 *   3. an optional wagara pattern wash inside, masked so it fades from the edge
 *   4. an optional notched corner, the way a manga panel gets cut for emphasis
 *
 * The rules stretch with the panel; the corner ornaments never do — they are
 * fixed-size SVGs pinned to each corner, so the detail stays crisp at any
 * panel size. Stretching a single SVG frame is the usual mistake and it makes
 * the ornament read as smeared.
 */

export type PanelTone = "gold" | "kumkum" | "ink";
export type PanelWash = "none" | "asanoha" | "seigaiha" | "sayagata" | "kolam" | "screentone";

/**
 * One corner ornament, drawn for the top-left; the other three are rotations.
 *
 * Elements, from the corner outward:
 *   - an L bracket in a double line, with the elbow eased into a quarter round
 *   - a volute (scroll) springing off the elbow — the Japanese kumiko move
 *   - a three-petal lotus bud opening along the diagonal — the Telugu move
 *   - a boss: filled disc inside a ring, the rivet that pins temple metalwork
 *   - fine ticks along both arms, reading as engraving
 */
function Corner({ size = 58 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 58 58"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* double bracket, elbow eased */}
        <path d="M0 58 L0 15 Q0 0 15 0 L58 0" strokeWidth="1.5" />
        <path d="M7 58 L7 17 Q7 7 17 7 L58 7" strokeWidth="0.75" opacity="0.62" />

        {/* volute — a scroll unrolling off the elbow */}
        <path
          d="M17 7 C17 18 28 17 28 28 C28 36 19 37 19 29 C19 24 25 24 25 29"
          strokeWidth="1.05"
          opacity="0.9"
        />

        {/* lotus bud, three petals opening along the diagonal */}
        <path d="M11 11 C17 5 27 4 34 8" strokeWidth="0.9" opacity="0.75" />
        <path d="M11 11 C8 18 9 28 14 34" strokeWidth="0.9" opacity="0.75" />
        <path d="M11 11 C18 14 24 20 27 27" strokeWidth="0.9" opacity="0.55" />

        {/* engraving ticks along both arms */}
        {[20, 27, 34, 41, 48].map((v) => (
          <g key={v} opacity="0.5">
            <line x1="0" y1={v} x2="4" y2={v} strokeWidth="0.75" />
            <line x1={v} y1="0" x2={v} y2="4" strokeWidth="0.75" />
          </g>
        ))}
      </g>

      {/* boss: the rivet that pins temple metalwork */}
      <circle cx="11" cy="11" r="2.9" fill="currentColor" />
      <circle cx="11" cy="11" r="5.2" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
    </svg>
  );
}

export default function Panel({
  children,
  tone = "gold",
  wash = "none",
  notch = false,
  className = "",
  style,
}: {
  children?: ReactNode;
  tone?: PanelTone;
  wash?: PanelWash;
  notch?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`panel panel--${tone} ${notch ? "panel--notch" : ""} ${className}`}
      style={style}
    >
      {/* pattern wash, masked to fade inward so it never fights the copy */}
      {wash !== "none" && (
        <svg className="panel-wash" aria-hidden="true" preserveAspectRatio="none">
          <rect width="100%" height="100%" fill={`url(#${wash})`} />
        </svg>
      )}

      {/* four corner ornaments — fixed size, never stretched */}
      <span className="panel-c panel-c--tl"><Corner /></span>
      <span className="panel-c panel-c--tr"><Corner /></span>
      <span className="panel-c panel-c--br"><Corner /></span>
      <span className="panel-c panel-c--bl"><Corner /></span>

      <div className="panel-body">{children}</div>
    </div>
  );
}
