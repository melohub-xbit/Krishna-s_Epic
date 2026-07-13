import { profile } from "@/data/profile";
import { Ribbon } from "@/components/ui/Ribbon";
import { Chakra } from "@/components/art";

const links = [
  { label: "GITHUB", value: "melohub-xbit", href: profile.contacts.github },
  { label: "LINKEDIN", value: "krishna-sai-velidanda", href: profile.contacts.linkedin },
  { label: "EMAIL", value: profile.contacts.emailPlain, href: profile.contacts.email },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20 md:px-[5vw]"
      style={{ background: "var(--bg2)" }}
    >
      <Ribbon>సంప్రదింపు · COLOPHON</Ribbon>

      <div className="relative z-[2] mx-auto grid w-full max-w-[1120px] items-stretch gap-[22px] md:grid-cols-[1fr_0.7fr]">
        <div className="panel reveal panel-dots flex flex-col justify-center p-8">
          <h2 className="impact leading-[0.95]" style={{ fontSize: "clamp(28px,4vw,52px)" }}>
            THE STORY <span style={{ color: "var(--accent)" }}>CONTINUES</span>
          </h2>
          <div className="telugu mt-2 text-[20px]" style={{ color: "var(--secondary)" }}>
            కలిసి పని చేద్దాం
          </div>
          <div className="text-[13px] italic" style={{ color: "var(--fg-soft)" }}>
            Let's build something together.
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-[3px] px-4 py-3 transition-transform duration-150 hover:translate-x-1"
                style={{ borderColor: "var(--line)", background: "var(--panel)" }}
              >
                <span className="impact text-[13px] tracking-[0.12em]" style={{ color: "var(--accent)" }}>
                  {l.label}
                </span>
                <span className="text-[14px]">{l.value} ↗</span>
              </a>
            ))}
            <a
              href={profile.contacts.resume}
              target="_blank"
              rel="noreferrer"
              className="impact flex items-center justify-center gap-2 border-[3px] px-4 py-3 text-[14px] tracking-[0.12em]"
              style={{ borderColor: "var(--line)", background: "var(--accent)", color: "var(--ribbon-fg)", boxShadow: "5px 5px 0 var(--shadow)" }}
            >
              DOWNLOAD RÉSUMÉ ↓
            </a>
          </div>
        </div>

        <div className="panel reveal flex items-center justify-center overflow-hidden" style={{ background: "var(--emblem-bg)" }}>
          <div className="animate-[spinSlow_36s_linear_infinite]">
            <Chakra size={200} />
          </div>
        </div>
      </div>

      <div className="relative z-[2] mx-auto mt-6 w-full max-w-[1120px] text-center text-[12px] italic" style={{ color: "var(--fg-soft)" }}>
        {profile.fullName} · built with Next.js — a manga read in panels.
      </div>
    </section>
  );
}
