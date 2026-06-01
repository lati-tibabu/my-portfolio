"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import HandDrawnIcon from "./HandDrawnIcon";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Blog", href: "/blog" },
    { name: "Admin", href: "/admin" },
    { name: "Services", href: "/#services" },
    { name: "Skills", href: "/#skills" },
    { name: "About", href: "/#about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[rgba(255,255,255,0.85)] backdrop-blur-md border-b border-[var(--color-surface-border)]">
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Logo size="medium" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-on-surface-variant)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-[var(--color-on-surface)] transition"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/graphics"
            className="hover:text-[var(--color-on-surface)] transition"
          >
            Graphics
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-electric-blue)] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition hover:scale-[1.02]"
          >
            Hire me
          </Link>
          <a
            href="https://linkedin.com/in/lati-tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            aria-label="LinkedIn"
          >
            <HandDrawnIcon name="linkedin" size={20} />
          </a>
          <a
            href="https://github.com/lati-tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            aria-label="GitHub"
          >
            <HandDrawnIcon name="github" size={20} />
          </a>
          <a
            href="https://t.me/latitibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            aria-label="Telegram"
          >
            <HandDrawnIcon name="telegram" size={20} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] text-2xl transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <HandDrawnIcon name="close" size={28} />
          ) : (
            <HandDrawnIcon name="menu" size={28} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-border)] px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/graphics"
            className="block text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
            onClick={() => setMobileOpen(false)}
          >
            Graphics
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-electric-blue)] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition"
            onClick={() => setMobileOpen(false)}
          >
            Hire me
          </Link>
          <div className="flex gap-4 pt-2">
            <a
              href="https://linkedin.com/in/lati-tibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            >
              <HandDrawnIcon name="linkedin" size={20} />
            </a>
            <a
              href="https://github.com/lati-tibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            >
              <HandDrawnIcon name="github" size={20} />
            </a>
            <a
              href="https://t.me/latitibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            >
              <HandDrawnIcon name="telegram" size={20} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
