"use client";

import { useMemo, useState } from "react";
import Strip from "./Strip";
import Marquee from "./Marquee";
import type { Project } from "@/data/projects";

/**
 * THE WORK, IN TWO HALVES.
 *
 * One rail, two lists. Research and development are different kinds of
 * object — one is measured, the other is shipped — and mixing them made
 * a run of twenty-three posters where the reason a card was next to
 * another card was nothing at all. Split, each rail is a shelf with an
 * argument.
 *
 * Strip is keyed by the track, so switching REMOUNTS it rather than
 * handing it a new array. That is deliberate: the rail holds its scroll
 * position, its per-card transforms and a live index in refs, and
 * swapping the list under all of that leaves the turn pointing at
 * posters that are no longer there. A remount starts the new shelf
 * centred on its own first card, which is also what you want to look at.
 */

/* The band of words over each shelf. Umbrellas, not specifics — a field
   somebody would search for, never the name of one technique inside one
   project. Each list belongs to the shelf under it, so switching the
   track switches what the section claims to be about. */
const TRACKS = [
  {
    id: "research",
    label: "Research",
    domains: [
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "Natural Language Processing",
      "Reinforcement Learning",
      "Model Efficiency",
      "Signal Processing",
      "Medical Imaging",
      "Multi-objective Optimisation",
    ],
  },
  {
    id: "build",
    label: "Development",
    domains: [
      "Full-stack Web",
      "Backend Engineering",
      "Distributed Systems",
      "Real-time Systems",
      "Agentic AI",
      "Systems Programming",
      "Cloud and DevOps",
      "Developer Tooling",
      "Data Engineering",
    ],
  },
] as const;

type TrackId = (typeof TRACKS)[number]["id"];

export default function WorkRail({ projects }: { projects: Project[] }) {
  const [track, setTrack] = useState<TrackId>("research");

  const shelves = useMemo(
    () =>
      Object.fromEntries(
        TRACKS.map((t) => [t.id, projects.filter((p) => p.track === t.id)])
      ) as Record<TrackId, Project[]>,
    [projects]
  );

  const current = TRACKS.find((t) => t.id === track) ?? TRACKS[0];

  return (
    <>
      <div className="wk-switch" role="tablist" aria-label="Which half of the work">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={track === t.id}
            className="wk-seg"
            data-on={track === t.id ? "true" : "false"}
            onClick={() => setTrack(t.id)}
          >
            <span className="wk-lamp" aria-hidden="true" />
            <span className="wk-seg-name">{t.label}</span>
            <span className="wk-n">
              {String(shelves[t.id].length).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      <Marquee key={`m-${track}`} items={[...current.domains]} />

      <Strip key={track} projects={shelves[track]} />
    </>
  );
}
