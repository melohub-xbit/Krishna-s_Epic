/**
 * ─────────────────────────────────────────────────────────────
 *  THE PALETTE.  This is the only file you edit to change colour.
 * ─────────────────────────────────────────────────────────────
 *
 *  To swap the whole site's colour: change ACTIVE on the last line.
 *  To tweak a palette: edit its values below.
 *  To add your own: copy a block, rename it, add it to PALETTES.
 *
 *  Everything downstream reads from here — the CSS, every component,
 *  and the canvas that draws the dots. There is no second place where
 *  a colour is written down.
 */

export type Scheme = {
  /** page background */
  bg: string;
  /** raised surfaces: cards, demo panels */
  bg2: string;
  /** primary text */
  fg: string;
  /** secondary text */
  fg2: string;
  /** tertiary text, labels, disabled */
  fg3: string;
  /** strong hairline */
  rule: string;
  /** faint hairline */
  rule2: string;
  /** THE accent. Used sparingly — it marks the one thing you mean. */
  accent: string;
  /** the colour the dot matrix is drawn in */
  dot: string;
};

export type Palette = {
  /** shown in the palette switcher */
  label: string;
  dark: Scheme;
  light: Scheme;
};

/* ── the palettes ───────────────────────────────────────────── */

/**
 * DUSK — every value sampled from the Nothing OS astronaut wallpaper.
 * Ink is the sky, vermilion is the visor, cream is the dunes. The
 * neutrals are warm on purpose: a grey off a cream is a different
 * animal from a grey off a white, and using the second on the first is
 * what makes a warm palette look accidentally cold.
 */
const dusk: Palette = {
  label: "Dusk",
  dark: {
    bg: "#0B1220",
    bg2: "#151C2C",
    fg: "#F4EADA",
    fg2: "rgba(244, 234, 218, 0.62)",
    fg3: "rgba(244, 234, 218, 0.36)",
    rule: "rgba(244, 234, 218, 0.14)",
    rule2: "rgba(244, 234, 218, 0.07)",
    accent: "#C75340",
    dot: "rgba(244, 234, 218, 0.88)",
  },
  light: {
    bg: "#F4EADA",
    bg2: "#E8DCC7",
    fg: "#0B1220",
    fg2: "rgba(11, 18, 32, 0.66)",
    fg3: "rgba(11, 18, 32, 0.42)",
    rule: "rgba(11, 18, 32, 0.16)",
    rule2: "rgba(11, 18, 32, 0.08)",
    accent: "#B73B2A",
    dot: "rgba(11, 18, 32, 0.85)",
  },
};

const mono: Palette = {
  label: "Mono",
  dark: {
    bg: "#0a0a0b",
    bg2: "#101012",
    fg: "#f2efea",
    fg2: "rgba(242, 239, 234, 0.58)",
    fg3: "rgba(242, 239, 234, 0.34)",
    rule: "rgba(242, 239, 234, 0.12)",
    rule2: "rgba(242, 239, 234, 0.06)",
    accent: "#ff2d55",
    dot: "rgba(242, 239, 234, 0.85)",
  },
  light: {
    bg: "#f4f2ee",
    bg2: "#eceae5",
    fg: "#111112",
    fg2: "rgba(17, 17, 18, 0.62)",
    fg3: "rgba(17, 17, 18, 0.38)",
    rule: "rgba(17, 17, 18, 0.14)",
    rule2: "rgba(17, 17, 18, 0.07)",
    accent: "#e5102f",
    dot: "rgba(17, 17, 18, 0.85)",
  },
};

const kumkum: Palette = {
  label: "Kumkum",
  dark: {
    bg: "#0b0709",
    bg2: "#140c10",
    fg: "#fff1e6",
    fg2: "rgba(255, 241, 230, 0.58)",
    fg3: "rgba(255, 241, 230, 0.34)",
    rule: "rgba(255, 241, 230, 0.13)",
    rule2: "rgba(255, 241, 230, 0.06)",
    accent: "#ff2d6a",
    dot: "rgba(255, 241, 230, 0.85)",
  },
  light: {
    bg: "#faf4ec",
    bg2: "#f2eae0",
    fg: "#170d10",
    fg2: "rgba(23, 13, 16, 0.62)",
    fg3: "rgba(23, 13, 16, 0.38)",
    rule: "rgba(23, 13, 16, 0.14)",
    rule2: "rgba(23, 13, 16, 0.07)",
    accent: "#d4114b",
    dot: "rgba(23, 13, 16, 0.85)",
  },
};

const peacock: Palette = {
  label: "Peacock",
  dark: {
    bg: "#07090c",
    bg2: "#0d1116",
    fg: "#eaf3f1",
    fg2: "rgba(234, 243, 241, 0.58)",
    fg3: "rgba(234, 243, 241, 0.34)",
    rule: "rgba(234, 243, 241, 0.12)",
    rule2: "rgba(234, 243, 241, 0.06)",
    accent: "#00e5c0",
    dot: "rgba(234, 243, 241, 0.85)",
  },
  light: {
    bg: "#f0f4f3",
    bg2: "#e5ecea",
    fg: "#0b1113",
    fg2: "rgba(11, 17, 19, 0.62)",
    fg3: "rgba(11, 17, 19, 0.38)",
    rule: "rgba(11, 17, 19, 0.14)",
    rule2: "rgba(11, 17, 19, 0.07)",
    accent: "#00806c",
    dot: "rgba(11, 17, 19, 0.85)",
  },
};

const turmeric: Palette = {
  label: "Turmeric",
  dark: {
    bg: "#0a0906",
    bg2: "#12100a",
    fg: "#f7f2e4",
    fg2: "rgba(247, 242, 228, 0.58)",
    fg3: "rgba(247, 242, 228, 0.34)",
    rule: "rgba(247, 242, 228, 0.12)",
    rule2: "rgba(247, 242, 228, 0.06)",
    accent: "#ffb020",
    dot: "rgba(247, 242, 228, 0.85)",
  },
  light: {
    bg: "#f7f3e8",
    bg2: "#efe9da",
    fg: "#12100a",
    fg2: "rgba(18, 16, 10, 0.62)",
    fg3: "rgba(18, 16, 10, 0.38)",
    rule: "rgba(18, 16, 10, 0.14)",
    rule2: "rgba(18, 16, 10, 0.07)",
    accent: "#b06d00",
    dot: "rgba(18, 16, 10, 0.85)",
  },
};

export const PALETTES = { dusk, mono, kumkum, peacock, turmeric } as const;

export type PaletteName = keyof typeof PALETTES;

/* ─────────────────────────────────────────────────────────────
 *  ⬇  CHANGE THIS LINE TO CHANGE THE WHOLE SITE
 * ───────────────────────────────────────────────────────────── */
export const ACTIVE: PaletteName = "dusk";

/**
 * The site is dark. There is no toggle any more, and no light mode is
 * emitted — the `light` scheme on each palette above is kept because it
 * is where the light values live if this is ever reversed, but nothing
 * reads it.
 */
export const DEFAULT_MODE: "dark" = "dark";

/* ── plumbing below; you shouldn't need to touch it ─────────── */

/** Maps a Scheme onto the CSS custom-property names used everywhere. */
export const VAR: Record<keyof Scheme, string> = {
  bg: "--bg",
  bg2: "--bg-2",
  fg: "--fg",
  fg2: "--fg-2",
  fg3: "--fg-3",
  rule: "--rule",
  rule2: "--rule-2",
  accent: "--accent",
  dot: "--dot",
};

function block(scheme: Scheme): string {
  return (Object.keys(VAR) as (keyof Scheme)[])
    .map((k) => `${VAR[k]}:${scheme[k]};`)
    .join("");
}

/**
 * The stylesheet for the active palette, generated from the objects above.
 * Emitted once in the root layout, so CSS and JS can never disagree.
 */
export function paletteCSS(name: PaletteName = ACTIVE): string {
  return `:root{${block(PALETTES[name].dark)}}`;
}

/**
 * Read a live palette value from the DOM. Canvas code uses this, so the
 * dots are always drawn in whatever the current palette and mode resolve to.
 */
export function readVar(name: keyof Scheme): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(VAR[name])
    .trim();
}
