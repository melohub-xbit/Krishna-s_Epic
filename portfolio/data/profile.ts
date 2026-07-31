// Mirrored from portfolio-site/data/profile.ts so the design exploration uses
// the real content rather than lorem. Keep the two in sync, or import from a
// shared package once the site and the field are merged.

export const profile = {
  nameTe: "వెలిదండ కృష్ణ సాయి",
  nameEn: "KRISHNA SAI",
  fullName: "Velidanda Krishna Sai",
  roleTe: "యంత్ర అభ్యాస పరిశోధకుడు",
  role:
    "Machine-learning researcher and builder. Dual degree at IIIT Bangalore; multimodal EEG–ECG stress research at Samsung Lab.",
  shlokaTe: "॥ కర్మణ్యేవాధికారస్తే మా ఫలేషు కదాచన ॥",
  shlokaGloss: "Your right is to the work alone, never to its fruits. — Gita 2.47",
  contacts: {
    github: "https://github.com/melohub-xbit",
    linkedin: "https://linkedin.com/in/krishna-sai-velidanda",
    email: "mailto:kvelidanda.1177@gmail.com",
    /**
     * RE-ENABLED 2026-07-20. The stale render (CGPA 3.44) was the June PDF;
     * ../Resume/ now holds current renders of both variants, each showing the
     * correct 3.51. Copied to public/ rather than linked out of Resume/ so the
     * deployed site carries its own copy.
     *
     * TWO résumés, split along the epic spine — same decision that governs the
     * project sections, applied to the document itself:
     *   resume         → 1-page general    (contact bar + Mahabharatam)
     *   resumeResearch → 2-page research   (Ramayanam)
     *
     * Regenerating: the sources are Resume/main.tex and main_research.tex.
     * They need the `newtx` LaTeX package, which the Linux sandbox does not
     * have — recompile on Windows or Overleaf, then re-copy into public/.
     */
    resume: "/resume.pdf" as string | null,
    resumeResearch: "/resume-research.pdf" as string | null,
  },
};

// Illustration assets carried over from the old portfolio-site/public.
// Not yet used on the page -- these are the Layer B slots from
// portfolio-build-plan.md §6 (epic gateway art, hero panels).
export const art = {
  krishna: "/art/hero/krishna.webp",
  krishnaMist: "/art/hero/krishna-mist.webp",
  backdrop: "/art/hero/backdrop.webp",
  inkTemple: "/art/textures/ink-temple.webp",
};

// The two epics are the spine of the site: Ramayanam = research track,
// Mahabharatam = dev/hackathon track. See portfolio-build-plan.md §2.
export const nav = [
  { en: "About", te: "పరిచయం", href: "#about" },
  { en: "Ramayanam", te: "పరిశోధన", href: "#ramayanam" },
  { en: "Mahabharatam", te: "నిర్మాణం", href: "#mahabharatam" },
  { en: "Contact", te: "సంప్రదింపు", href: "#contact" },
];
