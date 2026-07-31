"use client";

/**
 * THE FRAMING PAGES, COMPOSED FOR A PAGE — cover, about, the fork, astras,
 * colophon.
 *
 * The two arc pages became chapter indexes (EpicIndex.tsx); these five were the
 * remainder, and they were still the scroll site's `<section>`s squeezed into a
 * page-shaped box by CSS overrides. Krishna, 2026-07-30: "each page still feels
 * like a regular webpage just pasted on a page-like view … the elements don't look
 * like manga panels, they just seem like boxes thrown around randomly."
 *
 * Same three rules as every other composed page here — they are general, not
 * specific to an index:
 *
 *   1. **Page units.** Every length is `cqw`/`cqh` against the `page` container on
 *      `.book-page`, so a page scales as ONE object at any window size. Viewport
 *      units are meaningless inside a leaf, and `@media` is worse: the page box is
 *      ~480px wide while a media query still reads the real window.
 *   2. **Structural fit.** Each page is a grid whose content region is `1fr` with
 *      `minmax(0, …)` rows, and every text run is line-clamped. Adding an item
 *      shortens the others; nothing can be pushed off the page at any page size.
 *   3. **Koma grammar (§03.2).** Each page uses the panel language its spec calls
 *      for rather than a generic card grid: a kakemono hanging-scroll column for
 *      About, a diagonal split for the fork, a weapons rack for the astras, and
 *      printer's marks for the colophon.
 *
 * Content is unchanged — every string here was already on the site. This is a
 * composition pass, not a rewrite.
 */
import {
  Torana,
  BrushRule,
  Conch,
  Bow,
  Rosette,
  Hanko,
} from "@/components/ornament/Motifs";
import Enso from "@/components/ink/Enso";
import Gate from "@/components/ornament/Gate";
import { profile } from "@/data/profile";
import { epics } from "@/data/projects";

/* ------------------------------------------------------------- shared bits */

/** The eyebrow every page shares: rosette · English label · Telugu gloss. */
function Eyebrow({ en, te }: { en: string; te: string }) {
  return (
    <div className="pg-eyebrow">
      <Rosette size={16} />
      {en}
      <span className="te">{te}</span>
    </div>
  );
}

/**
 * A full-page wagara ground. `Patterns.tsx` emits the pattern once into a hidden
 * <defs>, so this is just a rect filled by id — which is why the pattern's colour
 * is set in CSS on `.pg-wash` (the fill is `currentColor` inside the pattern).
 */
function Wash({ id }: { id: "kikko" | "shippo" }) {
  return (
    <svg className="pg-wash" aria-hidden="true" preserveAspectRatio="none">
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Page title: Telugu over Latin, the locked pairing as one lockup. */
function PageTitle({ en, te }: { en: string; te?: string }) {
  return (
    <h2 className="pg-title">
      {te && <span className="te">{te}</span>}
      {en}
    </h2>
  );
}

/* ------------------------------------------------------------------- cover */

/**
 * Page 1 — full bleed (tachikiri). §03.2: "Bleed = a moment that stops time."
 * So this page has NO panel at all: the chakra behind the paper is the art, and
 * the type sits directly on the page. A framed panel here would put a border
 * between the reader and the first thing they see.
 */
export function CoverSpread() {
  return (
    <section className="pg pg--cover" id="cover" data-sec="cover">
      <div className="cv-top">
        <Hanko size={40} />
      </div>

      <div className="cv-lockup">
        <div className="cv-te">{profile.nameTe}</div>
        <h1 className="cv-en">{profile.nameEn}</h1>
        <div className="cv-rule">
          <BrushRule width={240} />
        </div>
        <p className="cv-role">{profile.role}</p>
      </div>

      <div className="cv-foot">
        <div className="cv-shloka">
          <span className="te">{profile.shlokaTe}</span>
          <em>{profile.shlokaGloss}</em>
        </div>
        {/* The one quiet affordance, per 06 §6.1: one instruction, then trust the
            reader. It says "turn", not "scroll" — scrolling is how you turn. */}
        <div className="cv-cue">
          <i />
          Turn the page
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- about */

const ACHIEVEMENTS: [string, string][] = [
  ["1st — ICDEC'24 Vehicle Detection", "International challenge, 2,000 teams"],
  ["2nd — TruthTell, WAVES Summit 2025", "Top 2 of 5,600+ global submissions"],
  ["2nd — MERNify, Synergy'24", "IIITB tech fest, 3,500+ participants"],
];

/**
 * Page 2 — the author's code. §03.2 asks for a kakemono scroll panel plus
 * irregular bio koma with TIGHT gutters, because tight gutters read as one
 * continuous thought rather than separate facts.
 *
 * The kakemono (掛物, a hanging scroll) is the left column: a tall narrow field
 * with the torana arch at its head, which is the fusion partner §02.7 pairs with
 * bushidō ↔ dharma. The right column carries the record.
 */
export function AboutSpread() {
  return (
    <section className="pg pg--about" id="about" data-sec="about">
      <Eyebrow en="Prologue" te="పరిచయం" />
      <PageTitle en="About" te="పరిచయం" />

      <div className="ab-body">
        <aside className="ab-kakemono">
          <Torana width={200} className="ab-torana" />
          <p className="ab-lede">
            Dual-degree student at IIIT Bangalore, researching multimodal EEG–ECG
            signals of stress and recovery at Samsung Lab. I move between deep
            research and fast building — the two epics ahead are how that work
            splits.
          </p>
          <div className="ab-seal" aria-hidden="true">
            <Hanko size={30} />
          </div>
        </aside>

        <div className="ab-record">
          <div className="ab-koma">
            <span className="ab-k-label">Education</span>
            <b className="ab-k-title">IIIT Bangalore</b>
            <p className="ab-k-text">
              Dual Degree (B.Tech + M.Tech), Computer Science &amp; Engineering.
              CGPA 3.51 / 4.0 · Jul 2023 – 2028. Dean&apos;s Merit List, 2023–24.
            </p>
          </div>

          <div className="ab-koma" data-accent="1">
            <span className="ab-k-label">Research</span>
            <b className="ab-k-title">Samsung Lab, IIITB</b>
            <p className="ab-k-text">
              Jan – May 2026, under Dr. Sakshi Arora. Multi-stressor protocol;
              8-channel EEG at 500 Hz plus single-lead ECG from 15 subjects across
              4,939 windows, with CNN-LSTM stress models.
            </p>
          </div>

          <ul className="ab-wins">
            {ACHIEVEMENTS.map(([t, d]) => (
              <li key={t}>
                <b>{t}</b>
                <i>{d}</i>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- fork */

/**
 * Page 3 — the fork. §03.2 asks for a two-panel spread split by a DIAGONAL gutter,
 * and §02.3 for the fused torii-torana gate at the moment an epic is entered. Those
 * are the same beat, so this page is where they meet: choosing a path IS passing
 * through its gate.
 *
 * So each half is a real gate rather than a card with a sigil on it — and the epic's
 * name sits on the GAKUZUKA, the tablet a real torii carries its shrine's name on.
 * That is the detail that makes it a gate and not an illustration of one.
 *
 * The diagonal stays: it is the one place in the volume where the reader chooses,
 * and a straight vertical gutter would read as two columns of a layout.
 */
export function ForkSpread() {
  const gates = [
    { epic: epics.ramayanam, tone: "gold" as const },
    { epic: epics.mahabharatam, tone: "kumkum" as const },
  ];

  return (
    <section className="pg pg--fork" data-sec="fork">
      <Eyebrow en="The two paths" te="రెండు మార్గాలు" />
      <PageTitle en="Choose a path" />

      <div className="fk-body">
        {gates.map(({ epic, tone }, i) => (
          // Anchors, not buttons: these are the volume's own pages and they have
          // real URLs. The book intercepts a plain click and turns instead (see
          // Grantha's onNav), so this is both a link and a page-turn.
          <a
            key={epic.key}
            className="fk-gate"
            href={`/${epic.key}`}
            data-tone={tone}
            data-side={i === 0 ? "l" : "r"}
          >
            <span className="fk-arch" aria-hidden="true">
              <Gate width={260} label={epic.name} labelTe={epic.te} />
            </span>
            <span className="fk-role">{epic.role}</span>
            <p className="fk-blurb">{epic.blurb}</p>
            <span className="fk-go">Enter ›</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/**
 * THE ENDPAPERS (§03.2, §02.6) — the one page where the two traditions touch.
 *
 * "Between arcs: a quiet interleaved kolam × asanoha pattern page shown for one
 * beat mid-flip (the §01 rhyme made visible)." The placement rule for ornament is
 * strict — wagara for the Japanese-format zones, kolam for the world background —
 * and §02.6 says they meet ONLY here. That is what makes this page worth a page: it
 * is the thesis of the whole site stated once, in pattern, with no words to explain
 * it.
 *
 * Bands rather than a blend: a real endpaper is printed, and two patterns
 * interleaved as alternating bands is what a press can actually do. A crossfade
 * would be a Photoshop gesture.
 */
export function EndpaperSpread() {
  const bands = [0, 1, 2, 3, 4, 5];
  return (
    <section className="pg pg--endpaper" data-sec="endpaper">
      <div className="ep-bands" aria-hidden="true">
        {bands.map((b) => (
          <svg key={b} className="ep-band" data-kind={b % 2 ? "kolam" : "asanoha"} preserveAspectRatio="none">
            <rect width="100%" height="100%" fill={`url(#${b % 2 ? "kolam" : "asanoha"})`} />
          </svg>
        ))}
      </div>

      {/* One line, centred, and nothing else. An endpaper that explains itself is
          not an endpaper. */}
      <div className="ep-mark">
        <Rosette size={22} />
        <span className="te">॥ రెండు దారులు, ఒకే గీత ॥</span>
        <em>Two traditions, one line</em>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ astras */

/**
 * Page 4 — the astras (skills). §03.2: "Kikkō-armour backdrop, weapons-rack koma
 * grid." A rack, not a tag cloud: each group is a rung, its items laid along it,
 * so the page reads as an armoury inventory. The kikkō (tortoiseshell hexagon)
 * ground is drawn in CSS — Patterns.tsx has no kikkō yet, and adding one is
 * Phase 4 work.
 */
const ASTRAS: [string, string, string[]][] = [
  [
    "Languages",
    "భాషలు",
    ["Python", "C++", "TypeScript", "JavaScript", "SQL", "Bash"],
  ],
  [
    "Machine learning",
    "యంత్ర అభ్యాసం",
    ["PyTorch", "scikit-learn", "TensorFlow", "Transformers", "OpenCV", "CNN-LSTM"],
  ],
  [
    "Systems & data",
    "వ్యవస్థలు",
    ["Docker", "Kubernetes", "FastAPI", "Postgres", "MongoDB", "Redis"],
  ],
  [
    "Signal & research",
    "సంకేతం",
    ["EEG / ECG", "HRV", "Bayesian methods", "Shannon entropy", "Wilcoxon"],
  ],
];

export function AstrasSpread() {
  return (
    <section className="pg pg--astras" id="astras" data-sec="astras">
      {/* Kikkō: longevity and protection, and literal samurai armour plating —
          which is why this page and no other gets it (02 §2.6). */}
      <Wash id="kikko" />
      <Eyebrow en="The armoury" te="అస్త్రాలు" />
      <PageTitle en="Astras" te="అస్త్రాలు" />

      <div className="as-rack">
        {ASTRAS.map(([group, te, items]) => (
          <div className="as-rung" key={group}>
            <div className="as-r-head">
              <b>{group}</b>
              <span className="te">{te}</span>
            </div>
            <ul className="as-r-items">
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- colophon */

/**
 * Page 10 — the colophon. §03.2: "Shippō backdrop, ensō closes around the hanko,
 * links as printer's marks. End-of-volume page."
 *
 * A colophon is the printer's page at the back of a book: who made it, where, how
 * to reach them. So the contacts are set as marks in a row rather than as buttons,
 * and the ensō — the single closing brush circle — is the last mark on the page.
 */
export function ColophonSpread() {
  const c = profile.contacts;
  const marks: [string, string, string][] = [
    ["GitHub", "github.com/melohub-xbit", c.github],
    ["LinkedIn", "krishna-sai-velidanda", c.linkedin],
    ["Email", "kvelidanda.1177@gmail.com", c.email],
    ...(c.resume
      ? ([["Résumé", "1-page, general", c.resume]] as [string, string, string][])
      : []),
  ];

  return (
    <section className="pg pg--colophon" id="contact" data-sec="contact">
      {/* Shippō: "seven treasures", harmony and endless connection. A page of ways
          to reach someone is exactly what that pattern is for (02 §2.6). */}
      <Wash id="shippo" />
      <Eyebrow en="Colophon" te="ముద్రణ" />
      <PageTitle en="Contact" te="సంప్రదింపు" />

      <div className="cl-body">
        <div className="cl-enso" aria-hidden="true">
          <Enso size={112} variant={2} />
          <span className="cl-enso-seal">
            <Hanko size={34} />
          </span>
        </div>

        <ul className="cl-marks">
          {marks.map(([label, value, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                <span className="cl-m-label">{label}</span>
                <span className="cl-m-value">{value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="cl-foot">
        <span className="te">॥ శుభమ్ ॥</span>
        <span>End of volume · {new Date().getFullYear()}</span>
      </footer>
    </section>
  );
}
