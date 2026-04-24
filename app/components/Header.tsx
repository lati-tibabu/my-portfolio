"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import HandDrawnIcon from "./HandDrawnIcon";

const storageKey = "theme";

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  localStorage.setItem(storageKey, theme);
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey);
    const initialTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16 gap-4">

        {/* Logo */}
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Logo size="medium" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
            About
          </Link>
          <Link href="/projects/graphics" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
            Graphics
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="hand-drawn-border inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-[#8b5e3c] hover:text-[#8b5e3c]"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? <HandDrawnIcon name="sun" size={18} /> : <HandDrawnIcon name="moon" size={18} />}
          </button>

          <a
            href="https://facebook.com/lati.tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#8b5e3c] text-xl transition"
            aria-label="Facebook"
          >
            <HandDrawnIcon name="facebook" size={22} />
          </a>
          <a
            href="https://linkedin.com/in/lati-tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#8b5e3c] text-xl transition"
            aria-label="LinkedIn"
          >
            <HandDrawnIcon name="linkedin" size={22} />
          </a>
          <a
            href="https://github.com/lati-tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#8b5e3c] text-xl transition"
            aria-label="GitHub"
          >
            <HandDrawnIcon name="github" size={22} />
          </a>
          <a
            href="https://t.me/latitibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#8b5e3c] text-xl transition"
            aria-label="Telegram"
          >
            <HandDrawnIcon name="telegram" size={22} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-900 text-2xl transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HandDrawnIcon name="close" size={28} /> : <HandDrawnIcon name="menu" size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="hand-drawn-border inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#8b5e3c] hover:text-[#8b5e3c]"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? <HandDrawnIcon name="sun" size={18} /> : <HandDrawnIcon name="moon" size={18} />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          <Link
            href="/"
            className="block text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>
          <Link
            href="/projects/graphics"
            className="block text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Graphics
          </Link>
          <div className="flex gap-5 pt-2">
            <a href="https://facebook.com/lati.tibabu" target="_blank" rel="noopener noreferrer" className="hand-drawn-border inline-flex rounded-full border border-gray-200 p-2 text-gray-400 hover:text-[#8b5e3c] text-xl transition"><HandDrawnIcon name="facebook" size={22} /></a>
            <a href="https://linkedin.com/in/lati-tibabu" target="_blank" rel="noopener noreferrer" className="hand-drawn-border inline-flex rounded-full border border-gray-200 p-2 text-gray-400 hover:text-[#8b5e3c] text-xl transition"><HandDrawnIcon name="linkedin" size={22} /></a>
            <a href="https://github.com/lati-tibabu" target="_blank" rel="noopener noreferrer" className="hand-drawn-border inline-flex rounded-full border border-gray-200 p-2 text-gray-400 hover:text-[#8b5e3c] text-xl transition"><HandDrawnIcon name="github" size={22} /></a>
            <a href="https://t.me/latitibabu" target="_blank" rel="noopener noreferrer" className="hand-drawn-border inline-flex rounded-full border border-gray-200 p-2 text-gray-400 hover:text-[#8b5e3c] text-xl transition"><HandDrawnIcon name="telegram" size={22} /></a>
          </div>
        </div>
      )}
    </header>
  );
}
