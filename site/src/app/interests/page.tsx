import type { Metadata } from "next";
import DoorLink, { DoorReveal } from "@/components/Door";
import Glyph from "@/components/Glyph";
import StationDisc from "@/components/StationDisc";
import { INTERESTS } from "@/data/interests";

export const metadata: Metadata = {
  title: "Night Shift on the M Band — Velidanda Krishna Sai",
  description:
    "Six stations, no adverts, no professionalism whatsoever: movies, animation, motors, Modern Family, music, and the animals a cartoon dog is responsible for.",
  /* Reachable, readable, and deliberately not indexed. Somebody who
     wants this half has to come and get it. */
  robots: { index: false, follow: false },
};

/**
 * /interests — the far side of the door.
 *
 * The home page is the instrument. This is the station's own after-hours
 * broadcast: the half of the portfolio that would not survive a code
 * review, and is not trying to.
 *
 * Two rules hold it together while it misbehaves.
 *
 * ONE: the ground alternates. Stations carry `invert` and land on cream,
 * ink type, warm rules — the same inversion the posters use. The route is
 * long, and a dark page that never changes ground reads as a single very
 * tall section however much is in it.
 *
 * TWO: nothing here is invented. Every chip, every pick and every joke on
 * the spec sheets comes off the list; the copy is voice, not content. A
 * blank stays a dash.
 */
export default function Interests() {
  return (
    <>
      <DoorReveal />

      <header className="bar">
        <DoorLink href="/" back className="bar-id">
          ← VELIDANDA KRISHNA SAI
        </DoorLink>
        <span className="ns-air">
          <span className="ns-lamp" aria-hidden="true" />
          <span className="lab">On air</span>
        </span>
      </header>

      <main className="ns">
        <div className="ns-head">
          <p className="lab">
            88.2 – 108.0 FM · after hours ·{" "}
            <span className="ns-acc">unlicensed</span>
          </p>
          <h1>
            Night Shift
            <br />
            on the <em>M Band</em>
          </h1>
          <p className="ns-lede">
            Six stations, no adverts, and no professionalism whatsoever. The
            work is on the front page. This is everything else — the things I
            like, and the ones I keep coming back to.
          </p>
          <span className="ns-seal" aria-hidden="true">
            <span>
              Certified
              <br />
              not
              <br />a CV
            </span>
          </span>
        </div>

        {/* the ticker, doubled so the loop has nothing to seam */}
        <div className="ns-tick" aria-hidden="true">
          <div className="ns-tick-t">
            {[0, 1].map((k) =>
              INTERESTS.map((s) => (
                <span key={`${k}-${s.name}`}>
                  {s.freq} <b>{s.name}</b> ·{" "}
                  {s.groups.reduce(
                    (n, g) => n + (g.chips?.length ?? 0) + (g.picks?.length ?? 0),
                    0
                  )}{" "}
                  picks
                </span>
              ))
            )}
          </div>
        </div>

        <nav className="ns-dial" aria-label="Jump to a station">
          {INTERESTS.map((s, i) => (
            <a key={s.name} href={`#stn-${i}`}>
              <Glyph name={s.glyph} size={16} className="ns-dial-g" />
              {s.name}
              <span className="lab">{s.freq}</span>
            </a>
          ))}
        </nav>

        {INTERESTS.map((s, i) => (
          <section
            key={s.name}
            id={`stn-${i}`}
            className="ns-stn"
            data-invert={s.invert ? "true" : "false"}
          >
            <div className="ns-stn-in">
              <div className="ns-top">
                <StationDisc glyph={s.glyph} seed={i * 7919 + 13} />
                <div>
                  <p className="ns-freq">
                    {s.freq} MHz · station {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2>{s.name}</h2>
                  <p className="ns-pitch">{s.pitch}</p>
                </div>
              </div>

              {s.groups.map((g) => (
                <div
                  key={g.title}
                  className="ns-grp"
                  data-loud={g.spotlight ? "true" : "false"}
                >
                  <p className="ns-grp-hd">
                    <span className="lab">{g.title}</span>
                    {g.note && <span className="ns-note">{g.note}</span>}
                  </p>

                  {g.picks && (
                    <div className="ns-picks">
                      {g.picks.map((p, j) => (
                        <div
                          key={p.t}
                          className="ns-pick"
                          data-star={p.star ? "true" : "false"}
                        >
                          <span className="ns-no">
                            {String(j + 1).padStart(2, "0")}
                          </span>
                          <span className="ns-pick-t">{p.t}</span>
                          <span className="ns-pick-w">{p.w}</span>
                          {p.tag && <span className="ns-tag">{p.tag}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {g.chips && (
                    <div className="ns-chips">
                      {g.chips.map((c) => (
                        <span key={c} className="ns-chip">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="ns-row">
                <dl className="ns-spec">
                  {s.specs.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd data-blank={v === "—" ? "true" : "false"}>{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="ns-take">
                  <p className="lab">Why it stuck</p>
                  <p>{s.take}</p>
                </div>
              </div>

              {s.caller && (
                <p className="ns-caller">
                  <span className="lab">{s.caller.who}</span>
                  <span>{s.caller.q}</span>
                </p>
              )}
            </div>
          </section>
        ))}

        <div className="ns-foot">
          <p className="lab">Requests line</p>
          <h3>“Play something good.”</h3>
          <p className="ns-foot-w">
            Nobody is at the desk. Everything worth asking for is already on
            one of the six.
          </p>
          <DoorLink href="/" back className="ns-back">
            ↩ Turn it back
          </DoorLink>
        </div>
      </main>
    </>
  );
}
