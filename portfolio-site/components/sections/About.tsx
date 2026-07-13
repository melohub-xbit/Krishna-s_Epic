import { profile } from "@/data/profile";
import { Ribbon } from "@/components/ui/Ribbon";
import Sfx from "@/components/motion/Sfx";

export default function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20 md:px-[5vw]"
      style={{ borderBottom: "6px solid var(--line)" }}
    >
      <Ribbon>ప్రస్తావన · PROLOGUE</Ribbon>

      <Sfx className="absolute right-[10%] top-[14%] z-[2]" rot={8} size={46}>
        !
      </Sfx>

      <div className="relative z-[2] mx-auto grid w-full max-w-[1180px] gap-[18px] md:grid-cols-3">
        <div className="panel reveal panel-dots flex flex-col p-6 md:col-span-2">
          <div className="impact text-[12px] tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            THE AUTHOR
          </div>
          <h2 className="impact mt-1 leading-[0.95]" style={{ fontSize: "clamp(26px,3.6vw,44px)" }}>
            WHO'S <span style={{ color: "var(--accent)" }}>WRITING</span>
          </h2>
          <p className="mt-3 text-[15px]">{profile.tagline}</p>

          <div className="mt-5 border-t-[3px] pt-4" style={{ borderColor: "var(--line)" }}>
            <div className="impact text-[13px] tracking-wide" style={{ color: "var(--secondary)" }}>
              {profile.education.school}
            </div>
            <div className="text-[14px]">{profile.education.degree}</div>
            <div className="text-[13px]" style={{ color: "var(--fg-soft)" }}>
              {profile.education.detail}
            </div>
          </div>

          <div className="mt-4 border-t-[3px] pt-4" style={{ borderColor: "var(--line)" }}>
            <div className="impact text-[13px] tracking-wide" style={{ color: "var(--secondary)" }}>
              {profile.research.where} · {profile.research.when}
            </div>
            <div className="text-[13px] italic" style={{ color: "var(--fg-soft)" }}>
              Supervisor: {profile.research.supervisor}
            </div>
            <p className="mt-1 text-[14px]">{profile.research.what}</p>
          </div>
        </div>

        <div className="panel reveal flex flex-col p-6" style={{ background: "var(--emblem-bg)", color: "var(--hero-fg)" }}>
          <div className="impact text-[12px] tracking-[0.2em]" style={{ color: "var(--accent2)" }}>
            అస్త్రాలు · HONOURS
          </div>
          <ul className="mt-3 flex flex-col gap-4">
            {profile.achievements.map((a) => (
              <li key={a.title}>
                <div className="text-[14px] font-semibold leading-tight">{a.title}</div>
                <div className="text-[12px]" style={{ opacity: 0.8 }}>
                  {a.detail}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div id="skills" className="relative z-[2] mx-auto mt-[18px] grid w-full max-w-[1180px] gap-[18px] md:grid-cols-3">
        {Object.entries(profile.skills).map(([group, list]) => (
          <div key={group} className="panel reveal panel-dots p-5">
            <div className="impact text-[13px] tracking-[0.16em]" style={{ color: "var(--accent)" }}>
              {group.toUpperCase()}
            </div>
            <div className="mt-3 flex flex-wrap gap-[6px]">
              {list.map((s) => (
                <span
                  key={s}
                  className="text-[12px] font-bold uppercase tracking-wide"
                  style={{ border: "2px solid var(--line)", borderRadius: 2, padding: "3px 9px" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
