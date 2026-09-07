import Image from "next/image";
import Hero from "@/components/Hero";
import Sunrise from "@/components/Sunrise";
import WorkRail from "@/components/WorkRail";
import GlyphMatrix from "@/components/GlyphMatrix";
import ProgressDots from "@/components/ProgressDots";
import Reveal from "@/components/Reveal";
import HoloDriver from "@/components/HoloDriver";
import GlyphRail from "@/components/GlyphRail";
import Band from "@/components/Band";
import Machine from "@/components/Machine";
import { DoorReveal, DoorReturn } from "@/components/Door";
import {
  PROJECTS,
  PROFILE,
  EDUCATION,
  EXPERIENCE,
  ACHIEVEMENTS,
} from "@/data/projects";

export default function Home() {
  return (
    <>
      {/* nine seconds of dawn, once per session, over the same landscape
          the hero then sits on */}
      <Sunrise />

      {/* if they turned the sheet back over: finish the turn, and put
          them down where they left rather than at the top */}
      <DoorReveal back />
      <DoorReturn />


      <header className="bar">
        <span className="bar-id">VELIDANDA KRISHNA SAI</span>
      </header>

      <ProgressDots />

      <main className="shell">
        {/* ── 01 · ENTRY ─────────────────────────────── */}
        <Hero statement={PROFILE.statement} />

        {/* ── 02 · ABOUT ─────────────────────────────────
            A projection and the thing projecting it. The base
            is a made object — glass, depth, a travelling
            highlight. What it throws is light and pixels:
            monochrome, dot matrix, scan lines, mono caps. */}
        <section id="about" className="about-scene">
          <HoloDriver />

          <div className="about-pin">
            <div className="shead">
              <h2>About</h2>
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

                  </div>

                  <div className="holo-core">
                    {/* the projection lands here — the picture itself is
                      painted by the field canvas, which walks it up from
                      the hero as you scroll */}
                    <figure id="about-slot" className="holo-figure">
                      <Image
                        src="/photo/krishna.webp"
                        alt="Velidanda Krishna Sai"
                        fill
                        sizes="(max-width: 999px) 76vw, 310px"
                        priority
                      />
                    </figure>

                  </div>

                  <div className="callouts callouts--r">
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
                </div>

                <div className="holo-under">
                  {/* The paragraphs now sit UNDER the projection rather than
                    beside it. In a side column they had a 42ch measure and
                    had to share the height with a list; across the full
                    width of the scene they get a proper measure and the
                    top row is left to the two things worth reading at a
                    glance. */}
                  <div className="holo-copy">
                    <p className="big">
                      Hey again. Here&rsquo;s some more about
                      me, what I&rsquo;ve done and what I do.
                    </p>
                    <p>
                      I&rsquo;m a curious, avid developer across several domains,
                      working with all kinds of teams and building things that
                      have a real use case at the end of them. I put AI and
                      agentic systems into a lot of my own workflows and build
                      streamlined applications around them, and my thing for
                      hackathons and long sprints of dev has gotten me across a
                      lot of ground &mdash; real-time and distributed systems,
                      computer vision, recommendation, and the full-stack
                      platforms that hold them up.
                    </p>
                    <p>
                      Along with dev, I've also taken up research in
                      domains like NLP, RecSys and CV, and I&rsquo;ve
                      worked on genuinely new problems: multimodal EEG and ECG
                      stress detection, medical image analysis and report generation, anomaly detection in
                      hyperspectral imagery, and others in RecSys and NLP.
                    </p>
                    <p>
                      Jack of many trades, and happy about it. The goal is to keep this going
                      and improving every day.
                    </p>
                  </div>

                  <div className="callout holo-exp">
                    <p className="lab">Experience</p>
                    <div className="list list--row">
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
              {PROJECTS.length} posters, in two halves · scroll the rail, click
              one to open it
            </span>
          </div>

          <WorkRail projects={PROJECTS} />
        </Reveal>

        {/* ── 04 · SKILLS ────────────────────────────────
            A circular dot screen turned by scroll. Tall on
            purpose: the height is what lets the field arrive
            on the barcode, hold, and leave cleanly. */}
        <GlyphMatrix />

        {/* ── 05 · THE M BAND, AND THE SIGN-OFF ──────────
            One tuner, and the end of the site. Six stations,
            then the door to /interests, then dead air, then
            Contact tunes in — all inside the same pin, so the
            page never leaves this scene until it is over. */}
        <Band />

        {/* Everything above, again, as plain marked-up text — see
            components/Machine.tsx. */}
        <Machine />

        <footer>
          <span className="lab">© 2026 {PROFILE.name}</span>
          <span className="lab te">{PROFILE.te}</span>
        </footer>
      </main>
    </>
  );
}
