import { profile } from "@/data/profile";
import { Chakra, Kolam, Seal } from "@/components/art";
import { Ribbon } from "@/components/ui/Ribbon";
import Sfx from "@/components/motion/Sfx";

export default function Cover() {
  return (
    <section
      id="cover"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-16 md:px-[5vw]"
      style={{ borderBottom: "6px solid var(--line)" }}
    >
      <Ribbon>CHRONICLE / VOL. 01</Ribbon>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          background: "repeating-conic-gradient(from 0deg at 62% 42%, var(--line) 0deg 0.5deg, transparent 0.5deg 3deg)",
          WebkitMaskImage: "radial-gradient(circle at 62% 42%, #000 0%, transparent 46%)",
          maskImage: "radial-gradient(circle at 62% 42%, #000 0%, transparent 46%)",
        }}
      />
      <div className="pointer-events-none absolute left-4 top-4 z-[1] h-[120px] w-[120px] opacity-50">
        <Kolam />
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 z-[1] h-[120px] w-[120px] rotate-180 opacity-50">
        <Kolam />
      </div>

      <Sfx className="absolute left-[8%] top-[18%] z-[2]" rot={-10} telugu size={54}>
        దుం
      </Sfx>

      <div className="relative z-[2] mx-auto grid w-full max-w-[1180px] items-stretch gap-[22px] md:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-[18px]">
          <div className="panel panel-dots relative flex flex-1 flex-col justify-center p-[30px]">
            <div className="impact mb-[6px] text-[13px] tracking-[0.35em]" style={{ color: "var(--accent)" }}>
              A PORTFOLIO IN PANELS
            </div>
            <div className="telugu font-bold leading-[1.05]" style={{ fontSize: "clamp(30px,5.2vw,58px)", color: "var(--secondary)" }}>
              {profile.nameTe}
            </div>
            <div className="impact leading-[0.9]" style={{ fontSize: "clamp(38px,7vw,88px)", marginTop: 6, textShadow: "3px 3px 0 var(--accent2)" }}>
              {profile.nameEn}
            </div>
            <div className="mt-[3px] text-[13px] italic" style={{ color: "var(--fg-soft)" }}>
              {profile.fullName}
            </div>
            <div
              className="my-[14px] h-[5px]"
              style={{ background: "var(--line)", clipPath: "polygon(0 40%,4% 0,7% 60%,12% 10%,100% 30%,100% 70%,0 100%)" }}
            />
            <div className="max-w-[34ch] font-semibold" style={{ fontSize: "clamp(15px,1.6vw,19px)" }}>
              {profile.tagline}
            </div>
            <div className="telugu mt-[14px] text-[15px]" style={{ color: "var(--accent)" }}>
              {profile.shlokaTe}
            </div>
            <div className="mt-[3px] text-[13px] italic" style={{ color: "var(--fg-soft)" }}>
              {profile.shlokaGloss}
            </div>
            <div className="absolute bottom-[16px] right-[18px] rotate-[-8deg] opacity-90">
              <Seal size={88} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[22px]">
          <div className="panel relative flex flex-1 items-center justify-center overflow-hidden" style={{ background: "var(--emblem-bg)" }}>
            <div
              className="absolute inset-0 opacity-[0.14]"
              style={{ backgroundImage: "radial-gradient(circle, var(--art-line) 1px, transparent 1.3px)", backgroundSize: "9px 9px" }}
            />
            <div className="ink-draw reveal" style={{ ["--len" as string]: 620 }}>
              <Chakra size={220} />
            </div>
          </div>
          <div
            className="panel relative"
            style={{ borderRadius: 26, padding: "16px 20px", boxShadow: "5px 5px 0 var(--shadow)" }}
          >
            <div className="impact text-[14px] tracking-[0.06em]" style={{ color: "var(--accent)" }}>
              MY STORY BEGINS HERE
            </div>
            <div className="mt-[5px] text-[14px] font-semibold">
              Two epics, two bodies of work — scroll to choose your path.
            </div>
          </div>
        </div>
      </div>

      <div className="impact relative z-[2] mt-[26px] text-center text-[14px] tracking-[0.25em]">
        READ ONWARD&nbsp;<span style={{ color: "var(--accent)" }}>▼</span>
      </div>
    </section>
  );
}
