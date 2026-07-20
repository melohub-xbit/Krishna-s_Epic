"use client";
import { profile, nav } from "@/data/profile";
import { epics, type Project } from "@/data/projects";
import Panel from "@/components/ornament/Frame";
import Patterns from "@/components/ornament/Patterns";
import { Torana, Hanko, BrushRule, Conch, Bow, Rosette } from "@/components/ornament/Motifs";
import Reveal from "@/components/foreground/Reveal";

/**
 * THE SITE.
 *
 * Structure follows portfolio-build-plan.md: the site is read as a manga
 * volume, each section is a chapter (parva), and the panel is the layout unit
 * for everything. Navigation is the manuscript index rather than a guide
 * character.
 *
 * The two epics are the spine:
 *   Ramayanam    → research track (the disciplined single journey)
 *   Mahabharatam → dev / hackathons (the battlefield, many warriors)
 *
 * Telugu is always paired with English, never standalone.
 */

// Assign an irregular manga grid span per project — hero projects take the
// full width, the rest alternate so the grid never settles into a boring
// even rhythm. That irregularity IS the manga panel language.
function span(p: Project, i: number) {
  if (p.hero) return "g-hero";
  const cycle = i % 5;
  if (cycle === 1 || cycle === 4) return "g-wide";
  if (cycle === 2) return "g-third";
  return "g-half";
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <div className={`${span(p, i)} rv`} style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
      <Panel
        tone={p.hero ? "kumkum" : "gold"}
        wash={p.hero ? "seigaiha" : i % 3 === 0 ? "asanoha" : "none"}
        notch={p.hero}
      >
        {p.badge && <div className="p-badge">{p.badge}</div>}
        <div className="p-title">
          {p.title}
          {p.titleSfx && <> <s>{p.titleSfx}</s></>}
        </div>
        {p.sub && <div className="p-sub">{p.sub}</div>}
        <p className="p-feat">{p.feat}</p>
        <div className="astras">
          {p.astras.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>
        <div className="p-links">
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function EpicSection({
  epic,
  sigil,
}: {
  epic: typeof epics.ramayanam | typeof epics.mahabharatam;
  sigil: React.ReactNode;
}) {
  return (
    <section className="sec" id={epic.key} data-sec={epic.key}>
      <div className="sec-in">
        <div className="rv">
          <div className="eyebrow">
            <Rosette size={18} />
            {epic.role}
            <span className="te">{epic.te}</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 22, flexWrap: "wrap" }}>
            <h2 className="h-sec">
              <span className="te">{epic.te}</span>
              {epic.name}
            </h2>
            <div style={{ color: "var(--gold)", opacity: 0.8 }}>{sigil}</div>
          </div>
          <p className="lede">{epic.blurb}</p>
          <div className="brush"><BrushRule width={260} /></div>
        </div>

        <div className="grid">
          {epic.projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Site() {
  return (
    <>
      <Patterns />
      <Reveal />

      {/* ---------------------------------------------- nav */}
      <header className="topbar">
        <a className="mark" href="#cover">
          <Hanko size={38} />
          <span className="mark-txt">
            KRISHNA SAI
            <span>వెలిదండ కృష్ణ సాయి</span>
          </span>
        </a>
        <nav className="nav">
          {nav.map((n) => (
            <a key={n.en} href={n.href} data-navfor={n.href.slice(1)}>
              {n.en}
              <i>{n.te}</i>
            </a>
          ))}
        </nav>
      </header>

      {/* parva counter — the manuscript page marker */}
      <div className="parva">
        {["cover", "about", "ramayanam", "mahabharatam", "astras", "contact"].map((s) => (
          <b key={s} data-navfor={s} />
        ))}
      </div>

      {/* legibility wash between the canvas and the content */}
      <div className="scrim" aria-hidden="true" />

      <div className="doc">
        {/* ---------------------------------------------- cover */}
        <section className="cover" id="cover" data-sec="cover">
          <div className="col">
            <div className="hero-te">{profile.nameTe}</div>
            <h1 className="hero-en">{profile.nameEn}</h1>
            <div className="hero-rule" />
            <p className="hero-role">{profile.role}</p>
            <div className="hero-shloka">
              {profile.shlokaTe}
              <em>{profile.shlokaGloss}</em>
            </div>
            <div className="scroll-cue">
              <i />
              Scroll to read
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- about */}
        <section className="sec" id="about" data-sec="about">
          <div className="sec-in">
            <Torana width={420} className="torana rv" />
            <div className="col rv">
              <div className="eyebrow">
                <Rosette size={18} />
                Prologue
                <span className="te">పరిచయం</span>
              </div>
              <h2 className="h-sec">
                <span className="te">పరిచయం</span>
                About
              </h2>
              <p className="lede">
                Dual-degree student at IIIT Bangalore, researching multimodal
                EEG–ECG signals of stress and recovery at Samsung Lab. I move
                between deep research and fast building — the two epics below
                are how that work splits.
              </p>
            </div>

            <div className="grid">
              <div className="g-half rv">
                <Panel wash="asanoha">
                  <div className="p-sub">Education</div>
                  <div className="p-title" style={{ fontSize: 22, marginTop: 8 }}>IIIT Bangalore</div>
                  <p className="p-feat">
                    Dual Degree (B.Tech + M.Tech), Computer Science &amp; Engineering.
                    CGPA 3.51 / 4.0 · Jul 2023 – 2028. Dean&apos;s Merit List, 2023–24.
                  </p>
                </Panel>
              </div>
              <div className="g-half rv" style={{ transitionDelay: "80ms" }}>
                <Panel tone="kumkum" wash="kolam">
                  <div className="p-sub">Research</div>
                  <div className="p-title" style={{ fontSize: 22, marginTop: 8 }}>Samsung Lab, IIITB</div>
                  <p className="p-feat">
                    Jan – May 2026 · under Dr. Sakshi Arora. Multi-stressor protocol,
                    8-channel EEG at 500 Hz plus single-lead ECG from 15 subjects
                    across 4,939 windows, with CNN-LSTM stress models.
                  </p>
                </Panel>
              </div>
              {[
                ["1st Prize — ICDEC'24 Vehicle Detection", "International challenge, out of 2000 teams"],
                ["2nd Prize — TruthTell, WAVES Summit 2025", "Top 2 of 5,600+ global submissions"],
                ["2nd Prize — MERNify, Synergy'24", "IIITB tech fest, 3,500+ participants"],
              ].map(([t, d], i) => (
                <div className="g-third rv" key={t} style={{ transitionDelay: `${120 + i * 70}ms` }}>
                  <Panel tone="ink" wash="screentone">
                    <div className="p-title" style={{ fontSize: 15, lineHeight: 1.3 }}>{t}</div>
                    <p className="p-feat" style={{ fontSize: 12.5 }}>{d}</p>
                  </Panel>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- epic fork */}
        <section className="sec" data-sec="fork">
          <div className="sec-in">
            <div className="col rv">
              <div className="eyebrow">
                <Rosette size={18} />
                The two paths
                <span className="te">రెండు మార్గాలు</span>
              </div>
              <h2 className="h-sec">Choose a path</h2>
              <p className="lede">
                The work splits into two epics. One is a single disciplined journey;
                the other is a battlefield of alliances and fast decisive builds.
              </p>
            </div>

            <div className="fork">
              <a className="gate rv" href="#ramayanam">
                <Panel wash="asanoha" notch>
                  <div className="gate-sig"><Bow size={104} /></div>
                  <div className="gate-te">{epics.ramayanam.te}</div>
                  <div className="gate-en">{epics.ramayanam.name}</div>
                  <div className="gate-role">{epics.ramayanam.role}</div>
                  <p className="gate-blurb">{epics.ramayanam.blurb}</p>
                </Panel>
              </a>
              <a className="gate rv" href="#mahabharatam" style={{ transitionDelay: "90ms" }}>
                <Panel tone="kumkum" wash="seigaiha" notch>
                  <div className="gate-sig"><Conch size={104} /></div>
                  <div className="gate-te">{epics.mahabharatam.te}</div>
                  <div className="gate-en">{epics.mahabharatam.name}</div>
                  <div className="gate-role">{epics.mahabharatam.role}</div>
                  <p className="gate-blurb">{epics.mahabharatam.blurb}</p>
                </Panel>
              </a>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- the two epics */}
        <EpicSection epic={epics.ramayanam} sigil={<Bow size={54} />} />
        <EpicSection epic={epics.mahabharatam} sigil={<Conch size={54} />} />

        {/* ---------------------------------------------- astras */}
        <section className="sec" id="astras" data-sec="astras">
          <div className="sec-in">
            <div className="col rv">
              <div className="eyebrow">
                <Rosette size={18} />
                The arsenal
                <span className="te">అస్త్రాలు</span>
              </div>
              <h2 className="h-sec">
                <span className="te">అస్త్రాలు</span>
                Astras
              </h2>
              <p className="lede">Weapons kept sharp. What I reach for, by domain.</p>
            </div>

            <div className="astra-rack">
              {Object.entries({
                Languages: ["Python", "C++", "C", "Java", "JavaScript", "SQL"],
                "ML / AI": ["PyTorch", "LLMs", "Transformers", "RecSys", "Computer Vision", "Signal Processing"],
                "Systems / Web": ["Next.js", "React", "FastAPI", "MongoDB", "Docker", "Kubernetes"],
              }).map(([group, items], i) => (
                <div className="rv" key={group} style={{ transitionDelay: `${i * 80}ms` }}>
                  <Panel wash={i === 1 ? "sayagata" : "asanoha"}>
                    <div className="rack-h">{group}</div>
                    <div className="astras">
                      {items.map((it) => (
                        <span key={it}>{it}</span>
                      ))}
                    </div>
                  </Panel>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- contact */}
        <section className="sec" id="contact" data-sec="contact">
          <div className="sec-in">
            <Torana width={420} className="torana rv" />
            <div className="col rv">
              <div className="eyebrow">
                <Rosette size={18} />
                Colophon
                <span className="te">సంప్రదింపు</span>
              </div>
              <h2 className="h-sec">
                <span className="te">సంప్రదింపు</span>
                Get in touch
              </h2>
              <p className="lede">
                Open to research collaborations and hard build problems.
              </p>
              <div className="contact-links">
                <a href={profile.contacts.github} target="_blank" rel="noreferrer">GitHub</a>
                <a href={profile.contacts.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={profile.contacts.email}>Email</a>
                {/* Only renders once a fresh resume is built -- see profile.ts */}
                {profile.contacts.resume && (
                  <a href={profile.contacts.resume} target="_blank" rel="noreferrer">Résumé ↓</a>
                )}
              </div>
              <div className="brush"><BrushRule width={220} /></div>
              <div className="colophon">
                {profile.fullName} · Built as a manga volume ·
                {" "}{new Date().getFullYear()}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
