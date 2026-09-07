"use client";

import PosterArt from "./PosterArt";
import Glyph from "./Glyph";

/**
 * A station's badge — the contour halo from the posters with the
 * station's glyph sitting in the middle of it.
 *
 * The rings are seeded per station, so each one is its own weather.
 */
export default function StationDisc({
  glyph,
  seed,
}: {
  glyph: string;
  seed: number;
}) {
  return (
    <span className="ns-disc">
      <PosterArt seed={seed} kind="halo" className="ns-disc-cv" />
      <span className="ns-disc-g">
        <Glyph name={glyph} size={64} />
      </span>
    </span>
  );
}
