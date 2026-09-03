"use client";

import { useEffect, useState } from "react";
import { DEFAULT_MODE } from "@/lib/palette";

type Mode = "dark" | "light";

/**
 * Flips `data-mode` on <html>. Every colour on the site — CSS and canvas
 * alike — is a variable that changes with it, so nothing else has to know
 * this component exists.
 */
export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(DEFAULT_MODE);

  useEffect(() => {
    const current =
      (document.documentElement.dataset.mode as Mode | undefined) ??
      DEFAULT_MODE;
    setMode(current);
  }, []);

  const flip = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem("mode", next);
    } catch {
      /* private browsing — the choice just won't persist */
    }
    setMode(next);
  };

  return (
    <button
      type="button"
      onClick={flip}
      className="toggle"
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      data-on={mode === "light" ? "1" : undefined}
    />
  );
}
