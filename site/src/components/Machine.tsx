import {
  PROJECTS,
  PROFILE,
  EDUCATION,
  EXPERIENCE,
  ACHIEVEMENTS,
  SKILLS,
} from "@/data/projects";

/**
 * THE SAME SITE, AS TEXT.
 *
 * The front page is a pinned scene, a rail that only renders the shelf
 * you have selected, and a set of records that only exist once you open
 * them. All of that is good for a person and useless to a machine: a
 * scraper reading this page would come away with half the projects, none
 * of their descriptions, and an About section split across three columns.
 *
 * So this is the whole thing again, in order, as ordinary headings and
 * paragraphs — about, then the work grouped by track with every record's
 * full text, then skills, experience, education, achievements, contact.
 * It is the first complete, linear copy of the site, and it is what any
 * reader that does not run JavaScript layout gets.
 *
 * `aria-hidden` because it is a DUPLICATE: a screen reader already has
 * the visible page and should not be read the same portfolio twice. The
 * hiding is the clip-rect kind, not `display: none`, so text extraction
 * still finds it — a scraper that only reads rendered text would skip a
 * hidden block, which would defeat the entire point of having one.
 *
 * What is deliberately NOT here: anything from the M band. That lives on
 * /interests, behind a nofollow, and a recruiter reading this page sees
 * the professional half and nothing else.
 */
export default function Machine() {
  const research = PROJECTS.filter((p) => p.track === "research");
  const build = PROJECTS.filter((p) => p.track === "build");

  const shelf = (title: string, list: typeof PROJECTS) => (
    <section>
      <h3>{title}</h3>
      {list.map((p) => (
        <article key={p.id}>
          <h4>
            {p.name} — {p.sub}
          </h4>
          <p>
            <strong>{p.figure}</strong> {p.caption}
          </p>
          <p>{p.problem}</p>
          <p>{p.approach}</p>
          <ul>
            {p.details.map((d) => (
              <li key={d.label}>
                {d.label}: {d.value}
              </li>
            ))}
          </ul>
          <p>Stack: {p.stack.join(", ")}</p>
          <p>Year: {p.year}</p>
          {p.award && <p>Award: {p.award}</p>}
          {p.repo && <p>Repository: {p.repo}</p>}
          {p.live && <p>Live: {p.live}</p>}
        </article>
      ))}
    </section>
  );

  return (
    <div className="machine" aria-hidden="true">
      <h2>{PROFILE.name}</h2>
      <p>{PROFILE.statement}</p>

      <section>
        <h3>About</h3>
        {PROFILE.about.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      <section>
        <h3>Work</h3>
        <p>
          {PROJECTS.length} projects, in two halves: {research.length} research
          and {build.length} development.
        </p>
        {shelf("Research", research)}
        {shelf("Development", build)}
      </section>

      <section>
        <h3>Skills</h3>
        {SKILLS.map((g) => (
          <p key={g.group}>
            <strong>{g.group}:</strong> {g.items.join(", ")}
          </p>
        ))}
      </section>

      <section>
        <h3>Experience</h3>
        {EXPERIENCE.map((e) => (
          <article key={e.org}>
            <h4>
              {e.role} — {e.org}
            </h4>
            <p>{e.span}</p>
            <p>{e.note}</p>
          </article>
        ))}
      </section>

      <section>
        <h3>Education</h3>
        <p>
          {EDUCATION.school} — {EDUCATION.degree}, {EDUCATION.span}, CGPA{" "}
          {EDUCATION.cgpa}
        </p>
      </section>

      <section>
        <h3>Achievements</h3>
        <ul>
          {ACHIEVEMENTS.map((a) => (
            <li key={a.what}>
              {a.place !== "—" ? `${a.place} — ` : ""}
              {a.what}, {a.scale}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Contact</h3>
        <p>Email: {PROFILE.email}</p>
        <p>GitHub: {PROFILE.github}</p>
        <p>LinkedIn: {PROFILE.linkedin}</p>
        <p>Résumé: /resume.pdf</p>
        <p>Résumé (research): /resume-research.pdf</p>
        <p>Based in: {PROFILE.location}</p>
        <p>Currently: Dual degree, IIIT Bangalore</p>
      </section>
    </div>
  );
}
