"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import Icon from "./Icon";
import { hasSupabaseBrowserConfig, supabaseBrowser } from "../lib/supabase/browser";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRoute = pathname?.startsWith("/admin");
  const adminName = useMemo(
    () => (adminEmail ? adminEmail.split("@")[0] : "Admin"),
    [adminEmail],
  );

  const navLinks = [
    { name: "Products", href: "/marketplace" },
    { name: "Blog", href: "/blog" },
    { name: "Services", href: "/#services" },
    { name: "Skills", href: "/#skills" },
    { name: "About", href: "/#about" },
  ];
  const visibleNavLinks = adminEmail
    ? [...navLinks.slice(0, 2), { name: "Admin", href: "/admin" }, ...navLinks.slice(2)]
    : navLinks;

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      if (!supabaseBrowser || !hasSupabaseBrowserConfig()) return;
      const { data } = await supabaseBrowser.auth.getSession();
      if (!mounted) return;
      setAdminEmail(data.session?.user?.email ?? null);
    };
    hydrate();

    if (!supabaseBrowser || !hasSupabaseBrowserConfig()) {
      return () => {
        mounted = false;
      };
    }

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setAdminEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAdminSignOut = async () => {
    if (supabaseBrowser) {
      await supabaseBrowser.auth.signOut();
    }
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-[9999] isolate bg-[rgba(255,255,255,0.85)] backdrop-blur-md border-b border-[var(--color-surface-border)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Logo size="medium" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-on-surface-variant)]">
          {visibleNavLinks.map((link) => (
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
          {isAdminRoute && adminEmail && (
            <div className="relative z-[100] flex items-center gap-2">
              <span className="hidden text-xs text-[var(--color-on-surface-variant)] sm:inline">
                {adminName}
              </span>
              <button
                type="button"
                onClick={handleAdminSignOut}
                aria-label="Sign out"
                title="Sign out"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-surface-border)] active:translate-y-0 active:shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-on-surface)]/30"
              >
                <Icon name="power" size={17} />
              </button>
            </div>
          )}
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
            <Icon name="linkedin" size={20} />
          </a>
          <a
            href="https://github.com/lati-tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            aria-label="GitHub"
          >
            <Icon name="github" size={20} />
          </a>
          <a
            href="https://t.me/latitibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            aria-label="Telegram"
          >
            <Icon name="telegram" size={20} />
          </a>
          <a
            href="https://wa.me/251979586697"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            aria-label="WhatsApp"
          >
            <Icon name="whatsapp" size={20} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] text-2xl transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <Icon name="close" size={28} />
          ) : (
            <Icon name="menu" size={28} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-border)] px-4 sm:px-6 py-4 space-y-4">
          {visibleNavLinks.map((link) => (
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
              <Icon name="linkedin" size={20} />
            </a>
            <a
              href="https://github.com/lati-tibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            >
              <Icon name="github" size={20} />
            </a>
            <a
              href="https://t.me/latitibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
            >
              <Icon name="telegram" size={20} />
            </a>
            <a
              href="https://wa.me/251979586697"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
              aria-label="WhatsApp"
            >
              <Icon name="whatsapp" size={20} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
