"use client";

import { PROFILE } from "@/data/projects";

/**
 * THE SEAL — the last section.
 *
 * The name signs off at wall size, outlined — the same wall the front
 * door opens with, reduced to a single line. The seal the section is
 * named after is behind it, in the field, rather than sitting on the
 * page as a button.
 *
 * It is deliberately a full screen tall. The field needs somewhere to
 * land: its last station is centred in here, and a short section meant
 * the sign-off never finished arriving before the page ran out.
 */
export default function Contact() {
  return (
    <section id="contact" className="contact" aria-label="Contact">
      {/* the field signs off here, with the name in Telugu */}
      <span id="contact-slot" className="fslot fslot--contact" aria-hidden="true" />

      <div className="shead">
        <h2>
          Contact <span className="te">ముద్ర</span>
        </h2>
        <span className="lab">Open to research and internships</span>
      </div>

      <p className="contact-sign te" aria-hidden="true">
        {PROFILE.te}
      </p>

      <div className="contact-body">
        <div className="contact-lines">
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

          <dl className="contact-facts">
            <div>
              <dt className="lab">Based in</dt>
              <dd>{PROFILE.location}</dd>
            </div>
            <div>
              <dt className="lab">Currently</dt>
              <dd>Dual degree, IIIT Bangalore</dd>
            </div>
            <div>
              <dt className="lab">Reply time</dt>
              <dd>A day or two, usually</dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="contact-close">
        If you have read this far, the fastest way to start is to tell me which
        poster you opened.
      </p>
    </section>
  );
}
