"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem("portfolio-theme"); } catch { /* Storage can be disabled. */ }
      document.documentElement.dataset.theme = saved === "dark" || saved === "light" ? saved : media.matches ? "dark" : "light";
    };
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <button type="button" className="theme-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-surface-border)]" onClick={() => {
      const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem("portfolio-theme", theme); } catch { /* The toggle still works without persistence. */ }
    }}>
      <span className="theme-to-dark"><span aria-hidden="true">☾</span><span className="sr-only">Switch to dark mode</span></span>
      <span className="theme-to-light"><span aria-hidden="true">☀</span><span className="sr-only">Switch to light mode</span></span>
    </button>
  );
}
