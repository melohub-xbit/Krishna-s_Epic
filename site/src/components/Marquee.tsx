"use client";

/**
 * A slow capability marquee. Pure CSS — the track is duplicated once and
 * translated by exactly -50%, which is what makes the loop seamless.
 *
 * Pauses on hover, and stops entirely under reduced motion.
 */
export default function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((s, i) => (
          <span key={`${s}-${i}`}>{s}</span>
        ))}
      </div>
    </div>
  );
}
