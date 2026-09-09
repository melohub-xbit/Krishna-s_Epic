"use client";

import DotMark from "./DotMark";
import PosterArt from "./PosterArt";
import { seedFrom } from "@/lib/contour";
import type { Project } from "@/data/projects";

/**
 * A bounty sheet — in two faces.
 *
 * The rail used to be eighteen identical dark cards with a dot-matrix
 * emblem in the middle of a dotted field, which read as a spreadsheet
 * once you had seen three of them. Both faces here are made of the same
 * flow field as the dunes, so a poster is a place on the same planet
 * rather than a logo on a grid:
 *
 *   PLATE — the inversion. A cream card, ink type, and a stadium window
 *           cut into it with the landscape inside. The loudest thing on
 *           the rail, on purpose.
 *   HALO  — the dark card kept, but the mark's ground redrawn as contour
 *           rings seeded from the project. The emblem survives, which is
 *           what keeps a project identifiable at a glance.
 *
 * Which face a project wears is fixed by `face` in the data, not chosen
 * here — a poster that changed its look when you filtered the rail would
 * read as a different project.
 *
 * No Telugu in this section — the posters carry the other half of the
 * theme by themselves, and mixing the two here made the cards fussy.
 */
export default function Poster({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const seed = seedFrom(project.id);
  const no = String(index).padStart(2, "0");
  const cap = project.track === "research" ? "Research" : "Built";

  if (project.face === "plate") {
    return (
      <span className="poster poster--plate">
        <span className="pl-top">
          <span className="poster-hd">Wanted</span>
          <span className="poster-hd">No. {no}</span>
        </span>

        <span className="pl-win">
          <PosterArt seed={seed} className="pl-cv" />
        </span>

        {/* The big vermilion line says WHAT IT IS, not what it scored.
            On a rail you read at an angle, "Computed, not read" tells a
            stranger nothing; "EV fleet intelligence" tells them
            everything. The number keeps its place underneath, and gets
            to be the headline again in the opened record. */}
        <span className="pl-body">
          <span className="poster-name">{project.name}</span>
          <span className="poster-fig">{project.sub}</span>
          <span className="poster-for">{project.figure}</span>
        </span>

        <span className="poster-foot">
          <span>{cap}</span>
          <span>{project.year}</span>
        </span>

        {project.award && <span className="poster-stamp">{project.award}</span>}
      </span>
    );
  }

  return (
    <span className="poster poster--halo">
      <span className="poster-hd">Wanted</span>
      <span className="poster-for">{project.figure}</span>

      <span className="poster-art">
        <PosterArt seed={seed} kind="halo" className="hl-cv" />
        <span className="hl-mk">
          <DotMark mark={project.mark} step={2.2} dotRadius={0.85} />
        </span>
      </span>

      <span className="poster-name">{project.name}</span>
      <span className="poster-fig">{project.sub}</span>
      <span className="poster-cap">{cap}</span>

      <span className="poster-foot">
        <span>No. {no}</span>
        <span>{project.year}</span>
      </span>

      {project.award && <span className="poster-stamp">{project.award}</span>}
    </span>
  );
}
