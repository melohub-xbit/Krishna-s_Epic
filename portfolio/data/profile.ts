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
     * DISABLED — the PDF carried over from portfolio-site was a stale render
     * (it showed CGPA 3.44; the LaTeX source in ../Resume/ says 3.51).
     * Shipping an out-of-date resume is worse than shipping none.
     *
     * To restore: rebuild from Resume/main.tex, drop the output at
     * public/resume.pdf, set this back to "/resume.pdf", and re-add the
     * Résumé link in components/foreground/Site.tsx (Contact section).
     */
    resume: null as string | null,
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
