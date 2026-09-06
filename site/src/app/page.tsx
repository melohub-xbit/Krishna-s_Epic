import Hero from "@/components/Hero";
import Strip from "@/components/Strip";
import GlyphMatrix from "@/components/GlyphMatrix";
import ProgressDots from "@/components/ProgressDots";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import Halftone from "@/components/Halftone";
import HoloDriver from "@/components/HoloDriver";
import GlyphRail from "@/components/GlyphRail";
import Band from "@/components/Band";
import { DoorReveal, DoorReturn } from "@/components/Door";
import {
  PROJECTS,
  PROFILE,
  EDUCATION,
  EXPERIENCE,
  ACHIEVEMENTS,
} from "@/data/projects";

const CAPABILITIES = [
  "Model efficiency",
  "Physiological signal",
  "Reinforcement environments",
  "Recommendation",
  "Computer vision",
  "Matching engines",
  "Reverse engineering",
  "Agent tooling",
];

export default function Home() {
  return (
    <>
      {/* if they turned the sheet back over: finish the turn, and put
          them down where they left rather than at the top */}
      <DoorReveal back />
      <DoorReturn />

      {/* one fixed field for the whole page: a faint lattice, the torch
          that colours it under the cursor, and the portrait travelling
          from the hero's slot into the projection in About */}
      <Halftone photo="/photo/krishna.webp" className="field" />

      <header className="bar">
        <span className="bar-id">VELIDANDA KRISHNA SAI</span>
      </header>

      <ProgressDots />

      <main className="shell">
        {/* ── 01 · ENTRY ─────────────────────────────── */}
        <Hero statement={PROFILE.statement} quiet={PROFILE.quiet} />

        {/* ── 02 · ABOUT ─────────────────────────────────
            A projection and the thing projecting it. The base
            is a made object — glass, depth, a travelling
            highlight. What it throws is light and pixels:
            monochrome, dot matrix, scan lines, mono caps. */}
        <section id="about" className="about-scene">
          <HoloDriver />

          <div className="about-pin">
            <div className="shead">
              <h2>
                About <span className="te">పరిచయం</span>
              </h2>
              <span className="lab">Projected from the mark</span>
            </div>

            <div className="holo">
            <div className="holo-field">
              <span className="holo-beam" aria-hidden="true" />

              <div className="holo-grid">
                <div className="callouts callouts--l">
                  <div className="callout">
                    <p className="lab">Education</p>
                    <div className="list">
                      <div>
                        <span>
                          {EDUCATION.school}
                          <small>{EDUCATION.degree}</small>
                        </span>
                        <span>
                          {EDUCATION.span}
                          <br />
                          CGPA {EDUCATION.cgpa}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="callout">
                    <p className="lab">Achievements</p>
                    <div className="list">
                      {ACHIEVEMENTS.map((a) => (
                        <div key={a.what}>
                          <span>
                            <span className="place">{a.place}</span> {a.what}
                            <small>{a.scale}</small>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="holo-core">
                  {/* the projection lands here — the picture itself is
                      painted by the field canvas, which walks it up from
                      the hero as you scroll */}
                  <figure
                    id="about-slot"
                    className="holo-figure"
                    aria-label="Velidanda Krishna Sai"
                  />

                  <div className="holo-copy">
                    <p className="big">
                      I work on machine learning and the systems around it —
                      model efficiency, physiological signals, and the tooling
                      that keeps experiments honest.
                    </p>
                    <p>
                      The EEG work exists because nobody had recorded both
                      signals from the same subjects at once. The pruning work
                      exists because a benchmark method looked like it was
                      answering a different question than the one it claimed.
                      That is the pattern: the interesting part is usually the
                      measurement, not the model.
                    </p>
                    <p>
                      Telugu is my first language. I like the parts of a system
                      nobody sees.
                    </p>
                  </div>
                </div>

                <div className="callouts callouts--r">
                  <div className="callout">
                    <p className="lab">Experience</p>
                    <div className="list">
                      {EXPERIENCE.map((e) => (
                        <div key={e.org} className="list-block">
                          <span>
                            {e.role}
                            <small>{e.org}</small>
                            <small className="list-note">{e.note}</small>
                          </span>
                          <span>{e.span}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="holo-base">
              <GlyphRail />
            </div>
            <span className="holo-label">Proj · Krishna Sai · Rev 2026</span>
            </div>
          </div>
        </section>

        {/* ── 03 · WORK ──────────────────────────────────
            A rail, not a tunnel. It scrolls on its own axis,
            so the page scrolls straight past it unless you
            choose to step in. */}
        <Reveal as="section" id="work">
          <div className="shead">
            <h2>Work</h2>
            <span className="lab">
              {PROJECTS.length} posters · scroll the rail, click one to open it
            </span>
          </div>

          <Marquee items={CAPABILITIES} />

          <Strip projects={PROJECTS} />
        </Reveal>

        {/* ── 04 · SKILLS ────────────────────────────────
            A circular dot screen turned by scroll. Tall on
            purpose: the height is what lets the field arrive
            on the barcode, hold, and leave cleanly. */}
        <GlyphMatrix />

        {/* ── 05 · OFF THE CLOCK, AND THE SIGN-OFF ──────
            One tuner, and the end of the site. Six stations,
            then the door to /interests, then dead air, then
            Contact tunes in — all inside the same pin, so the
            page never leaves this scene until it is over. */}
        <Band />

        <footer>
          <span className="lab">© 2026 {PROFILE.name}</span>
          <span className="lab te">{PROFILE.te}</span>
        </footer>
      </main>
    </>
  );
}
