import { ImageResponse } from "next/og";
import { PROJECTS } from "@/data/projects";

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
            {PROJECTS.length} projects · @jester
          </div>
        </div>
      </div>
    ),
    size
  );
}
