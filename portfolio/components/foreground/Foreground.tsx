"use client";
import { profile, nav } from "@/data/profile";

/**
 * The foreground layer: DOM over the 3D canvas.
 *
 * Composition: the chakra is anchored RIGHT and bleeds off the viewport edge
 * (see ChakraSculpt's offset in Crystal.tsx), which leaves a clean left column
 * for type. The crop is deliberate -- a fully visible disc reads as an
 * illustration, a cropped one reads as an object that continues past the frame.
 *
 * Everything here is pointer-events:none except the nav and links, so the
 * canvas underneath stays interactive.
 *
 * Telugu is always paired with English, never used alone.
 */
export default function Foreground() {
  return (
    <div className="fg">
      <div className="fg-top">
        <div className="mark">
          కృ
          <span>వెలిదండ</span>
        </div>

        <nav className="nav">
          {nav.map((n) => (
            <a key={n.en} href={n.href}>
              {n.en}
              <span className="te">{n.te}</span>
            </a>
          ))}
        </nav>
      </div>

      <header className="hero">
        <div className="hero-te">{profile.nameTe}</div>
        <h1 className="hero-en">{profile.nameEn}</h1>
        <div className="hero-rule" />
        <p className="hero-role">{profile.role}</p>
        <div className="hero-shloka">
          {profile.shlokaTe}
          <em>{profile.shlokaGloss}</em>
        </div>
      </header>

      <div className="fg-bottom">
        <div className="scroll-cue">
          <i />
          Scroll to read
        </div>
        <div className="links">
          <a href={profile.contacts.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.contacts.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={profile.contacts.email}>Email</a>
        </div>
      </div>
    </div>
  );
}
