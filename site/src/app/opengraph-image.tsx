import { ImageResponse } from "next/og";
import { PROJECTS } from "@/data/projects";

/**
 * The mark, inlined.
 *
 * Satori has no filesystem and no network at render time, so the icon
 * cannot be fetched — it travels as a base64 data URI. It is the same
 * drawing as app/icon.svg; if that changes, re-encode this. Kept as one
 * constant rather than JSX because Satori renders SVG through <img>, not
 * as elements.
 */
const MARK =
  "data:image/svg+xml;base64," +
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJLIj4gPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTQiIGZpbGw9IiMwQjEyMjAiLz4gPHJlY3QgeD0iNSIgeT0iMTQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMiIgcng9IjQuNiIgZmlsbD0iI0U4RENDNyIvPiA8cmVjdCB4PSI0OSIgeT0iMTQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMiIgcng9IjQuNiIgZmlsbD0iI0U4RENDNyIvPiA8cmVjdCB4PSI5IiB5PSI3IiB3aWR0aD0iNDYiIGhlaWdodD0iNDYiIHJ4PSIxOCIgZmlsbD0iI0U4RENDNyIvPiA8Y2lyY2xlIGN4PSIzMiIgY3k9IjI5LjUiIHI9IjE1LjQiIGZpbGw9IiNDNzUzNDAiLz4gPHBhdGggZD0iTTI3LjIgMjEuNHYxNi4yTTI3LjIgMjkuNWw5LjMtOC4xTTI3LjIgMjkuNWw5LjggOC4xIiBmaWxsPSJub25lIiBzdHJva2U9IiNGNEVBREEiIHN0cm9rZS13aWR0aD0iNC42IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4gPGVsbGlwc2UgY3g9IjIyLjYiIGN5PSIxOS40IiByeD0iNCIgcnk9IjIuMiIgdHJhbnNmb3JtPSJyb3RhdGUoLTMyIDIyLjYgMTkuNCkiIGZpbGw9IiNFOERDQzciIG9wYWNpdHk9IjAuNDUiLz4gPC9zdmc+";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Velidanda Krishna Sai — machine learning research";

/**
 * The share card.
 *
 * Not the canvas landscape — Satori has no canvas, so this is the same
 * palette and the same light rendered in the two things it does have:
 * layered gradients, and type. The landscape's job here is done by the
 * horizon glow, which is the part that carries at 1200 × 630 anyway;
 * the contour lines would be invisible at the size this is actually
 * seen, which is a 300px card in a chat window.
 */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "#04060C",
          backgroundImage:
            "linear-gradient(180deg,#04060C 0%,#0B1220 42%,#2A1B22 74%,#8E3524 92%,#C75340 100%)",
          color: "#F4EADA",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -260,
            width: 1400,
            height: 700,
            transform: "translateX(-50%)",
            background:
              "radial-gradient(closest-side, rgba(244,234,218,.85), rgba(199,83,64,.55) 30%, rgba(183,59,42,0) 72%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, zIndex: 1 }}>
          <img src={MARK} width={92} height={92} alt="" style={{ marginBottom: 10 }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "rgba(244,234,218,.62)",
            }}
          >
            Machine learning · systems · IIIT Bangalore
          </div>
          <div style={{ fontSize: 92, lineHeight: 1, letterSpacing: -3 }}>
            Velidanda Krishna Sai
          </div>
          <div style={{ fontSize: 30, color: "rgba(244,234,218,.72)" }}>
            {/* one template literal, not an expression next to text:
                Satori counts those as two children and demands
                display:flex on any div that has more than one. */}
            {`${PROJECTS.length} projects · @jester`}
          </div>
        </div>
      </div>
    ),
    size
  );
}
