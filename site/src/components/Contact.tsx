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
        <h2>Contact</h2>
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

          {/* The handle belongs here rather than in the hero: every link
              directly above it carries the same name, so the claim is
              visibly true at the moment it is made instead of being an
              assertion five screens earlier. */}
          <div className="jester">
            <p className="jester-handle">
              known most places as <b>@jester</b>
            </p>
            <p className="jester-why">
              Why be a master at one trade when you can be the jack of so many
              more? Jack, jester — same J, same job description.
            </p>
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
          </dl>
        </div>
      </div>

      <p className="contact-close">
        Thank you for coming all this way. Hope you enjoyed the tour, and talk to you soon!:)
      </p>
    </div>
  );
}
