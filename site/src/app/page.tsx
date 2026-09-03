import Hero from "@/components/Hero";
import DotMark from "@/components/DotMark";
import Strip from "@/components/Strip";
import ProgressDots from "@/components/ProgressDots";
import ThemeToggle from "@/components/ThemeToggle";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import Ambient from "@/components/Ambient";
import Halftone from "@/components/Halftone";
import {
  PROJECTS,
  PROFILE,
  EDUCATION,
  EXPERIENCE,
  ACHIEVEMENTS,
  SKILLS,
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

/**
 * Bars for a barcode band.
 *
 * Deterministic from the group name, so the server and the client draw the
 * same thing and nothing rehydrates differently. These carry texture, not
 * data: there is no proficiency score anywhere on this site, and inventing
 * one to fill a bar chart would be the easiest lie in a portfolio.
 */
function bars(seed: string, count: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out: { w: boolean; a: boolean; h: number }[] = [];
  for (let i = 0; i < count; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const r = (h >>> 0) / 4294967296;
    out.push({ w: r > 0.66, a: i % 7 === 3, h: 50 + Math.round(r * 50) });
  }
  return out;
}

export default function Home() {
  return (
    <>
      <Ambient />

      {/* one fixed field for the whole page: a faint lattice, the torch
          that colours it under the cursor, and the portrait travelling
          from the hero's slot into the projection in About */}
      <Halftone photo="/photo/krishna.webp" className="field" />

      <header className="bar">
        <span className="bar-id">VELIDANDA KRISHNA SAI</span>
        <ThemeToggle />
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
        <Reveal as="section" id="about">
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
              <span className="holo-lens">
                <DotMark mark="ring" step={2.1} dotRadius={0.8} />
              </span>
            </div>
            <span className="holo-label">
              Proj · Krishna Sai · Rev 2026
            </span>
          </div>
        </Reveal>

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

          {/* the field paints the live poster's mark here */}
          <span id="work-slot" className="fslot fslot--work" aria-hidden="true" />

          <Strip projects={PROJECTS} />
        </Reveal>

        {/* ── 04 · SKILLS ──────────────────────────────── */}
        <Reveal as="section" id="skills">
          <div className="shead">
            <h2>
              Skills <span className="te">అస్త్రాలు</span>
            </h2>
            <span className="lab">What I reach for</span>
          </div>

          {/* the field paints the barcode here, at section scale */}
          <span id="skills-slot" className="fslot fslot--skills" aria-hidden="true" />

          <div className="bands">
            {SKILLS.map((s) => {
              const b = bars(s.group, s.items.length * 2 + 5);
              return (
                <div key={s.group} className="band">
                  <p className="lab">{s.group}</p>
                  <div>
                    <div className="band-code" aria-hidden="true">
                      {b.map((bar, i) => (
                        <i
                          key={i}
                          data-w={bar.w ? "true" : undefined}
                          data-a={bar.a ? "true" : undefined}
                          style={{
                            height: `${bar.h}%`,
                            ["--i" as string]: i,
                          }}
                        />
                      ))}
                    </div>
                    <p className="band-names">
                      {s.items.join(" · ").toUpperCase()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ── 05 · CONTACT ───────────────────────────── */}
        <Reveal as="section" id="contact">
          <div className="shead">
            <h2>
              Contact <span className="te">ముద్ర</span>
            </h2>
          </div>
          {/* the field signs off here, with the name in Telugu */}
          <span id="contact-slot" className="fslot fslot--contact" aria-hidden="true" />

          <a className="mail" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>
          <div className="links">
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer">
              Résumé ↗
            </a>
            <a href="/resume-research.pdf" target="_blank" rel="noreferrer">
              Résumé — research ↗
            </a>
          </div>
        </Reveal>

        <footer>
          <span className="lab">© 2026 {PROFILE.name}</span>
          <span className="lab te">{PROFILE.te}</span>
        </footer>
      </main>
    </>
  );
}
