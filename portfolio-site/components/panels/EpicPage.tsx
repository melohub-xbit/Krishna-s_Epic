import Link from "next/link";
import { epics } from "@/data/projects";
import ProjectPanel from "@/components/panels/ProjectPanel";
import { Ribbon } from "@/components/ui/Ribbon";
import Sfx from "@/components/motion/Sfx";

export default function EpicPage({ epic }: { epic: "ramayanam" | "mahabharatam" }) {
  const e = epics[epic];
  const isRam = epic === "ramayanam";
  const accent = isRam ? "var(--ram)" : "var(--mbh)";
  const other = isRam ? epics.mahabharatam : epics.ramayanam;
  const otherHref = isRam ? "/mahabharatam" : "/ramayanam";

  return (
    <section
      data-epic={epic}
      className="relative min-h-screen overflow-hidden px-6 py-16 md:px-[5vw]"
    >
      <Ribbon>
        CHAPTER · {e.name.toUpperCase()}
      </Ribbon>

      <Sfx className="absolute right-[8%] top-[12%] z-[2]" rot={7} telugu size={52} color={accent}>
        {isRam ? "ఝణ్" : "ఢాం"}
      </Sfx>

      <div className="relative z-[2] mb-[26px] mt-2">
        <Link href="/#index" className="impact text-[12px] tracking-[0.14em]" style={{ color: "var(--fg-soft)" }}>
          ◀ BACK TO INDEX
        </Link>
        <div className="telugu font-bold leading-[1]" style={{ fontSize: "clamp(28px,4.4vw,50px)", color: accent }}>
          {e.te}
        </div>
        <div className="impact mt-1 tracking-[0.14em]" style={{ fontSize: "clamp(14px,1.8vw,20px)" }}>
          {e.name.toUpperCase()} · {e.role.toUpperCase()}
        </div>
        <p className="mt-2 max-w-[60ch] text-[15px]">{e.blurb}</p>
      </div>

      <div className="relative z-[2] mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-[18px] md:grid-flow-row-dense md:[grid-template-columns:1.35fr_1fr_1fr]">
        {e.projects.map((p, i) => (
          <ProjectPanel key={p.id} p={p} n={i + 1} accent={accent} />
        ))}
      </div>

      <div className="relative z-[2] mx-auto mt-8 flex w-full max-w-[1180px] items-center justify-between">
        <Link href="/#index" className="impact text-[13px] tracking-[0.12em]" style={{ color: "var(--fg-soft)" }}>
          ◀ INDEX
        </Link>
        <Link
          href={otherHref}
          className="impact border-[3px] px-4 py-2 text-[13px] tracking-[0.12em]"
          style={{ borderColor: "var(--line)", background: "var(--panel)", boxShadow: "4px 4px 0 var(--shadow)" }}
        >
          CROSS TO {other.name.toUpperCase()} ▶
        </Link>
      </div>
    </section>
  );
}
