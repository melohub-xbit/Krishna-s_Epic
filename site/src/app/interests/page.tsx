import type { Metadata } from "next";
import Link from "next/link";
import Ambient from "@/components/Ambient";
import ThemeToggle from "@/components/ThemeToggle";
import { DoorReveal } from "@/components/Door";
import { INTERESTS } from "@/data/interests";
import { PROFILE } from "@/data/projects";

export const metadata: Metadata = {
  title: "Off the clock — Velidanda Krishna Sai",
  description:
    "The six things on the personal band, at length: hackathons, music, anime, cars, bikes, Telugu cinema.",
};

/**
 * /interests — the far side of the door.
 *
 * The band on the home page is a tuner: one station at a time, a line
 * each. This is the same six stations laid out flat, so nothing has to be
 * scrubbed to be read. Deliberately quiet — no pinned scene, no canvas,
 * no field. The home page is the instrument; this is the manual.
 */
export default function Interests() {
  return (
    <>
      <Ambient />
      <DoorReveal />

      <header className="bar">
        <Link href="/" className="bar-id">
          ← VELIDANDA KRISHNA SAI
        </Link>
        <ThemeToggle />
      </header>

      <main className="in-page">
        <div className="in-head">
          <p className="lab">The band · six stations</p>
          <h1>
            Off the clock <span className="te">అభిరుచులు</span>
          </h1>
          <p className="in-lede">
            The work is on the front page. This is everything else — the
            things that get the hours nobody is paying for.
          </p>
        </div>

        <ol className="in-list">
          {INTERESTS.map((s, i) => (
            <li key={s.name} className="in-item">
              <div className="in-mark" aria-hidden="true">
                <span className="in-freq">{s.freq}</span>
                <span className="lab">MHz</span>
                <span className="in-no">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <div className="in-body">
                <h2>
                  {s.name} <span className="te">{s.te}</span>
                </h2>
                <p className="in-sub">{s.sub}</p>
                <p className="in-long">{s.long}</p>
              </div>

              <dl className="in-facts">
                {s.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd data-blank={v === "—" ? "true" : "false"}>{v}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>

        <div className="in-foot">
          <Link href="/#interests" className="in-back">
            ← Back to the dial
          </Link>
          <span className="lab te">{PROFILE.te}</span>
        </div>
      </main>
    </>
  );
}
