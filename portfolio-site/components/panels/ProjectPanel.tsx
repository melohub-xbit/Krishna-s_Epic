import type { Project } from "@/data/projects";

export default function ProjectPanel({ p, n, accent }: { p: Project; n: number; accent: string }) {
  const hero = !!p.hero;
  return (
    <article
      className={`panel reveal panel-dots flex flex-col p-5 ${hero ? "md:row-span-2" : ""}`}
      style={
        hero
          ? { background: "var(--emblem-bg)", color: "var(--hero-fg)", boxShadow: "10px 10px 0 var(--shadow)" }
          : undefined
      }
    >
      <div className="impact text-[12px] tracking-[0.2em]" style={{ color: hero ? "var(--accent2)" : accent }}>
        CHAPTER {String(n).padStart(2, "0")}
      </div>
      <h3 className="impact mt-1 leading-[0.95]" style={{ fontSize: hero ? "clamp(24px,3vw,38px)" : "clamp(19px,2.2vw,28px)" }}>
        {p.title}
        {p.titleSfx ? <span style={{ color: "var(--accent)" }}> {p.titleSfx}</span> : null}
      </h3>
      {p.sub ? (
        <div className="mt-1 text-[13px]" style={{ opacity: 0.72 }}>
          {p.sub}
        </div>
      ) : null}
      <p className="mt-3 flex-1 text-[14px]" style={{ fontWeight: 400 }}>
        {p.feat}
      </p>

      {p.badge ? (
        <div
          className="mt-3 inline-block self-start border-2 px-2 py-[2px] text-[11px] font-bold uppercase tracking-wide"
          style={{ borderColor: hero ? "var(--hero-fg)" : "var(--accent)", color: hero ? "var(--hero-fg)" : "var(--accent)", borderRadius: 2 }}
        >
          {p.badge}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-[6px]">
        {p.astras.map((a) => (
          <span
            key={a}
            className="text-[11px] font-bold uppercase tracking-wide"
            style={{ border: `2px solid ${hero ? "var(--hero-fg)" : "var(--line)"}`, borderRadius: 2, padding: "2px 8px" }}
          >
            {a}
          </span>
        ))}
      </div>

      <div className="impact mt-3 flex gap-3 text-[12px] tracking-wider">
        {p.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="pb-[1px]"
            style={{ borderBottom: "2px solid var(--accent)" }}
          >
            {l.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}
