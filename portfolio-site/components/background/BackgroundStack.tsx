export default function BackgroundStack() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 paper-dots" style={{ background: "var(--bg)" }}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 15%, transparent 55%, rgba(0,0,0,0.10))" }}
      />
    </div>
  );
}
