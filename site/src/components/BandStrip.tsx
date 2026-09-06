/**
 * THE FREQUENCY STRIP — where you are in a long scene, as a dial.
 *
 * A progress bar that says what it is measuring. Two scenes on this site
 * are long enough to get lost in — the skills matrix and the interests
 * band — and both of them are already instruments you tune, so their
 * scroll indicator is the same instrument seen from further away.
 *
 * It reads `--p` off whichever pin it is placed in rather than taking a
 * prop, so the hand physically cannot disagree with the scene driving it;
 * there is one number and both the scene and this read it.
 *
 * `zone` draws a bracket over part of the scale — on the band that is the
 * stretch the big dial in the middle of the screen is showing, because
 * the dial is this same scale blown up.
 *
 * Marks are given, not computed here: what counts as a station is the
 * scene's business, and only the scene knows which one is live.
 */

export type StripMark = {
  /** 0..1 along the scene */
  at: number;
  /** the frequency, or whatever this scale is counting in */
  label: string;
  /** shown only while this one is tuned in */
  name: string;
  on: boolean;
  /** off the end of the main band — drawn shorter */
  minor?: boolean;
};

export default function BandStrip({
  band,
  marks,
  zone,
}: {
  /** which band this is — FM, SW. It is a different instrument each time */
  band: string;
  marks: StripMark[];
  /** 0..1 — the stretch a larger dial is showing, if there is one */
  zone?: number;
}) {
  return (
    <div className="fstrip" aria-hidden="true">
      <span className="fstrip-band">{band}</span>
      <span className="fstrip-ticks" />
      <span className="fstrip-major" />
      {zone !== undefined && (
        <span
          className="fstrip-zone"
          style={{ width: `calc(${zone} * (100% - 2 * var(--pad)))` }}
        />
      )}
      {marks.map((m) => (
        <span
          key={m.label + m.name}
          className="fstrip-mark"
          data-kind={m.minor ? "minor" : "station"}
          data-on={m.on}
          style={{
            left: `calc(${m.at} * (100% - 2 * var(--pad)) + var(--pad))`,
          }}
        >
          <i />
          <b>{m.label}</b>
          <em>{m.name}</em>
        </span>
      ))}
      <span className="fstrip-hand" />
    </div>
  );
}
