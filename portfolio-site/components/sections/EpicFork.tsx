import Link from "next/link";
import { epics } from "@/data/projects";
import { Bow, Conch, Toranam } from "@/components/art";
import { Ribbon } from "@/components/ui/Ribbon";

function Gateway({
  href,
  te,
  en,
  role,
  blurb,
  count,
  accentVar,
  gwVar,
  art,
}: {
  href: string;
  te: string;
  en: string;
  role: string;
  blurb: string;
  count: number;
  accentVar: string;
  gwVar: string;
  art: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="panel reveal group flex min-h-[340px] flex-col overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative flex h-[180px] items-center justify-center" style={{ background: gwVar }}>
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{ backgroundImage: "radial-gradient(circle, var(--art-line) 1px, transparent 1.3px)", backgroundSize: "8px 8px" }}
        />
        {art}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="telugu text-[30px] font-bold" style={{ color: "var(--secondary)" }}>
          {te}
        </div>
        <div className="impact mt-[2px] text-[14px] tracking-[0.1em]" style={{ color: accentVar }}>
          {en} · {role.toUpperCase()}
        </div>
        <div className="mt-[10px] flex-1 text-[15px]">{blurb}</div>
        <div className="mt-[14px] flex items-center justify-between border-t-[3px] pt-3" style={{ borderColor: "var(--line)" }}>
          <span className="impact text-[15px]">
            <span style={{ color: accentVar, fontSize: 22 }}>{count}</span> chapters
          </span>
          <span className="impact text-[13px] tracking-[0.12em]" style={{ color: "var(--accent2)" }}>
            ENTER ▶
          </span>
        </div>
      </div>
    </Link>
  );
}

const chips = [
  { label: "ABOUT", href: "/#about" },
  { label: "SKILLS", href: "/#skills" },
  { label: "CONTACT", href: "/#contact" },
  { label: "RÉSUMÉ", href: "/resume.pdf" },
];

export default function EpicFork() {
  return (
    <section
      id="index"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-16 md:px-[5vw]"
      style={{ background: "var(--bg2)", borderBottom: "6px solid var(--line)" }}
    >
      <Ribbon>CHAPTER INDEX</Ribbon>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <span
          className="telugu whitespace-nowrap font-bold"
          style={{ fontSize: "clamp(64px,17vw,220px)", color: "var(--secondary)", opacity: 0.05, transform: "rotate(-4deg)" }}
        >
          రెండు మార్గాలు
        </span>
      </div>

      <div className="relative z-[2] mx-auto w-full max-w-[1120px]">
        <Toranam className="mb-1 block w-full" />
      </div>

      <div className="relative z-[2] mb-[26px] text-center">
        <div className="impact tracking-[0.16em]" style={{ fontSize: "clamp(22px,3vw,38px)" }}>
          CHOOSE YOUR <span style={{ color: "var(--accent)" }}>EPIC</span>
        </div>
      </div>

      <div className="relative z-[2] mx-auto grid w-full max-w-[1120px] gap-[26px] md:grid-cols-2">
        <Gateway
          href="/ramayanam"
          te={epics.ramayanam.te}
          en={epics.ramayanam.name}
          role={epics.ramayanam.role}
          blurb={epics.ramayanam.blurb}
          count={epics.ramayanam.projects.length}
          accentVar="var(--ram)"
          gwVar="var(--gw-ram)"
          art={<Bow size={150} />}
        />
        <Gateway
          href="/mahabharatam"
          te={epics.mahabharatam.te}
          en={epics.mahabharatam.name}
          role={epics.mahabharatam.role}
          blurb={epics.mahabharatam.blurb}
          count={epics.mahabharatam.projects.length}
          accentVar="var(--mbh)"
          gwVar="var(--gw-mbh)"
          art={<Conch size={150} />}
        />
      </div>

      <div className="relative z-[2] mt-[28px] flex flex-wrap justify-center gap-[14px]">
        {chips.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="impact flex items-center gap-2 border-[3px] px-[18px] py-[9px] text-[14px] tracking-[0.08em]"
            style={{ background: "var(--panel)", borderColor: "var(--line)", boxShadow: "4px 4px 0 var(--shadow)" }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full border-[1.5px]"
              style={{ background: "var(--marigold)", borderColor: "var(--line)" }}
            />
            {c.label}
          </a>
        ))}
      </div>
    </section>
  );
}
