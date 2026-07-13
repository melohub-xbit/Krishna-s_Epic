import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        bg2: "var(--bg2)",
        panel: "var(--panel)",
        line: "var(--line)",
        fg: "var(--fg)",
        "fg-soft": "var(--fg-soft)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        secondary: "var(--secondary)",
        ram: "var(--ram)",
        mbh: "var(--mbh)",
        leaf: "var(--leaf)",
        marigold: "var(--marigold)",
      },
      fontFamily: {
        impact: "var(--font-anton)",
        telugu: "var(--font-telugu)",
        body: "var(--font-zilla)",
      },
      boxShadow: {
        panel: "8px 8px 0 var(--shadow)",
        "panel-sm": "4px 4px 0 var(--shadow)",
        "panel-lg": "10px 10px 0 var(--shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
