export function Ribbon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="impact absolute left-6 top-0 z-40 -translate-y-1/2 border-[3px] px-4 py-[7px] text-[13px] tracking-wider md:left-[5vw]"
      style={{
        background: "var(--accent)",
        color: "var(--ribbon-fg)",
        borderColor: "var(--line)",
        boxShadow: "4px 4px 0 var(--shadow)",
      }}
    >
      {children}
    </div>
  );
}
