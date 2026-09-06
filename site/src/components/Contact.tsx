import { PROFILE } from "@/data/projects";

/**
 * THE SEAL — the last card.
 *
 * No section, no scroll of its own, no id. It is a card that the band
 * scene fades up in place once the dial has run off the end and the dead
 * air has come and gone. Contact is not a place below the interests; it
 * is the last thing the same instrument lands on.
 *
 * Band.tsx owns the arrival and everything about when this is visible.
 * This file is only what it says.
 */
export default function Contact() {
  return (
    <div className="ct-card">
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
    </div>
  );
}
