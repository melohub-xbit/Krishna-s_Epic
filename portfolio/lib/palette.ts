// Single festive palette. No day/night/cosmic switching.
// Gold + saffron + kumkum red: temple brass under lamplight, manga ink for line work.

export const PALETTE = {
  // --- Ground (background field) ---
  groundCore: "#7a2a12",   // saffron heart, behind the chakra
  groundMid: "#4a1414",    // kumkum
  groundEdge: "#25090e",   // deep kumkum shadow at the corners
  fog: "#3a1012",

  // --- Background field marks ---
  kolamLine: "#e8b25c",    // lattice loops
  kolamDot: "#f0c877",     // pulli (the dots kolam is drawn around)
  tone: "#ffd9a0",         // halftone screentone
  hatch: "#ffcf94",        // speed-line hatching

  // --- Chakra metal ---
  // Darkened from the first pass: the gold was uniformly bright and read as
  // freshly cast rather than antique. The spread between `gold` and `goldDark`
  // is now much wider so recesses genuinely sink.
  gold: "#8f6318",         // body
  goldLite: "#d59f42",     // highlight / raised faces
  goldPale: "#f3d089",     // brightest catch-light on flame tips
  goldDark: "#2b1c08",     // recesses, engraved grooves, cavity shading
  goldPlate: "#553a15",    // backing plate behind the medallion (recessed bronze)

  // --- Gems + accents ---
  kumkum: "#8f1f2e",       // hub recess
  ruby: "#c01a44",         // set stones
  saffron: "#e8a33d",      // inner glow

  // --- Ink (manga line work, for foreground later) ---
  ink: "#180a0c",
  inkSoft: "#2e1416",

  // Tint for the transmissive lens. Much lighter than `inkSoft` -- at ink
  // density the glass swallowed the chakra behind it entirely. This is a
  // smoky amber that darkens without extinguishing.
  inkGlass: "#9a6a45",
} as const;

// Background field intensities. Kept low on purpose: the field must sit BEHIND.
// Background field intensities.
// Pass 2: the lattice was far too large and too strong -- it read as bubble
// wallpaper competing with the chakra rather than as a field behind it.
// Cells roughly tripled in count and every opacity pulled down.
export const FIELD = {
  kolamOpacity: 0.085,
  dotOpacity: 0.16,
  toneOpacity: 0.075,
  hatchOpacity: 0.04,
  kolamScale: 21.0,  // lattice cells across the plane
  toneScale: 190.0,  // halftone frequency
  driftSpeed: 0.012,
} as const;
