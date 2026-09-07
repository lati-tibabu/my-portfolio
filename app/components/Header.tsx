"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import Icon from "./Icon";
import { hasSupabaseBrowserConfig, supabaseBrowser } from "../lib/supabase/browser";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);
  const isAdminRoute = pathname?.startsWith("/admin");
  const adminName = useMemo(
    () => (adminEmail ? adminEmail.split("@")[0] : "Admin"),
    [adminEmail],
  );

  const navLinks = [
    { name: "Work", href: "/#work" },
    { name: "Products", href: "/marketplace" },
    { name: "About", href: "/about" },
    { name: "Writing", href: "/blog" },
  ];
  const visibleNavLinks = adminEmail
    ? [...navLinks, { name: "Admin", href: "/admin" }]
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
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-5 px-6">
        <Link href="/" aria-label="Lati Tibabu home" onClick={() => setMobileOpen(false)}><Logo size="medium" /></Link>
        <nav aria-label="Main navigation" className="header-links hidden items-center gap-1 lg:flex">
          {visibleNavLinks.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}>{link.name}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAdminRoute && adminEmail && <button type="button" onClick={handleAdminSignOut} className="hidden rounded-full border border-[var(--color-surface-border)] p-3 lg:inline-flex" aria-label={`Sign out ${adminName}`}><Icon name="power" size={17} /></button>}
          <Link href="/#contact" className="header-contact hidden items-center gap-5 rounded-full px-5 py-3 text-sm sm:inline-flex">Let’s talk <span aria-hidden="true">↗</span></Link>
          <button ref={menuButtonRef} type="button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-surface-border)] lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"}><Icon name={mobileOpen ? "close" : "menu"} size={22} /></button>
        </div>
      </div>
      {mobileOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-[var(--color-surface-border)] bg-[var(--color-background)] px-6 py-5 lg:hidden">
        {visibleNavLinks.map((link, index) => <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined} className="flex items-center gap-5 border-b border-[var(--color-surface-border)] py-4 text-2xl aria-[current=page]:underline"><span aria-hidden="true" className="font-mono text-xs text-[var(--color-on-surface-variant)]">0{index + 1}</span>{link.name}</Link>)}
        <Link href="/#contact" onClick={() => setMobileOpen(false)} className="header-contact mt-5 inline-flex gap-5 rounded-full px-5 py-3 text-sm">Let’s talk <span aria-hidden="true">↗</span></Link>
        {isAdminRoute && adminEmail && <button type="button" onClick={handleAdminSignOut} className="ml-4 p-3 text-sm">Sign out</button>}
      </nav>}
    </header>
  );
}
