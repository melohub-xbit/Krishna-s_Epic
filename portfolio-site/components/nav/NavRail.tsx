"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { id: "cover", label: "Cover", href: "/#cover" },
  { id: "index", label: "Index", href: "/#index" },
  { id: "ramayanam", label: "Ramayanam", href: "/ramayanam" },
  { id: "mahabharatam", label: "Mahabharatam", href: "/mahabharatam" },
  { id: "about", label: "About", href: "/#about" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export default function NavRail() {
  const pathname = usePathname();
  const [active, setActive] = useState("cover");

  useEffect(() => {
    if (pathname === "/ramayanam") return setActive("ramayanam");
    if (pathname === "/mahabharatam") return setActive("mahabharatam");
    const ids = ["cover", "index", "about", "contact"];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.5 }
    );
    const t = window.setTimeout(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }, 80);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  return (
    <nav
      aria-label="Chapters"
      className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex"
    >
      {items.map((it) => {
        const on = active === it.id;
        return (
          <Link
            key={it.id}
            href={it.href}
            className="group flex items-center justify-end gap-2"
            aria-current={on ? "true" : undefined}
          >
            <span
              className="impact whitespace-nowrap rounded-sm border-2 px-2 py-1 text-[11px] tracking-wider opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--fg)" }}
            >
              {it.label}
            </span>
            <span
              className="block rounded-full border-2 transition-all duration-200"
              style={{
                width: on ? 15 : 11,
                height: on ? 15 : 11,
                borderColor: "var(--line)",
                background: on ? "var(--accent)" : "var(--marigold)",
              }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
