"use client";

import DotMark from "./DotMark";
import type { Project } from "@/data/projects";

/**
 * A bounty sheet.
 *
 * WANTED across the top, what it is wanted for underneath, the project's
 * own mark in the frame, then the name and the number it is wanted for.
 * A placing, where there is one, stamps the corner.
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
  return (
    <span className="poster">
      <span className="poster-hd">Wanted</span>
      <span className="poster-for">{project.sub}</span>

      <span className="poster-art">
        <DotMark mark={project.mark} step={2.2} dotRadius={0.85} />
      </span>

      <span className="poster-name">{project.name}</span>
      <span className="poster-fig">{project.figure}</span>
      <span className="poster-cap">
        {project.track === "research" ? "Research" : "Built"}
      </span>

      <span className="poster-foot">
        <span>No. {String(index).padStart(2, "0")}</span>
        <span>{project.year}</span>
      </span>

      {project.award && <span className="poster-stamp">{project.award}</span>}
    </span>
  );
}
