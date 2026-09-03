/** Tailwind v4 runs as a PostCSS plugin. No tailwind.config.js — the
    theme lives in globals.css via @theme, and colour lives in
    src/lib/palette.ts. */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
