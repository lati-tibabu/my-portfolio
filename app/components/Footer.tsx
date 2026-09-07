"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;

  return (
    <footer id="contact" className="site-footer px-6 pb-6 pt-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="footer-contact">
          <div>
            <p className="section-kicker">Have something in mind?</p>
            <h2>Let&apos;s build better<br />systems together<span>.</span></h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--color-on-surface-variant)]">Open to freelance work, ERP modernization, and long-term product partnerships. Bring your idea. Let&apos;s make it happen.</p>
          </div>
          <div className="flex flex-col items-start gap-5">
            <a href="mailto:hello@latitibabu.com" className="header-contact inline-flex items-center gap-10 rounded-full px-6 py-4">Start a conversation <span aria-hidden="true">↗</span></a>
            <a href="mailto:latitibabu2018@gmail.com" className="text-sm hover:underline">Email personal ↗</a>
            <a href="https://www.upwork.com/freelancers/~0162435256404567a3?mp_source=share" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">Hire me on Upwork ↗</a>
            <a href="tel:+251979586697" className="text-sm hover:underline">+251 979 586 697</a>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Addis Ababa, Ethiopia · Fiverr: latitibabu</p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-10 pb-14 lg:flex-row">
          <div>
            <Link href="/" className="font-heading text-4xl tracking-tight sm:text-5xl">Lati Tibabu<span className="text-[var(--color-outline)]">.</span></Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--color-on-surface-variant)]">Thoughtful software.<br />Built in Addis Ababa. Used everywhere.</p>
          </div>
          <div className="flex flex-wrap gap-12 sm:gap-20">
            <nav aria-label="Explore" className="footer-column"><p className="section-kicker">Explore</p><Link href="/#work">Selected work</Link><Link href="/marketplace">Digital products</Link><Link href="/graphics">Graphics</Link><Link href="/blog">Writing</Link></nav>
            <nav aria-label="More about Lati" className="footer-column"><p className="section-kicker">More about me</p><Link href="/about">About</Link><Link href="/cv">Resume</Link><Link href="/#services">Services</Link></nav>
            <nav aria-label="Connect" className="footer-column"><p className="section-kicker">Elsewhere</p><a href="https://github.com/lati-tibabu" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://linkedin.com/in/lati-tibabu" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://t.me/latitibabu" target="_blank" rel="noopener noreferrer">Telegram ↗</a><a href="mailto:hello@latitibabu.com">Email ↗</a></nav>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-surface-border)] pt-6 text-xs text-[var(--color-on-surface-variant)]"><p>© {new Date().getFullYear()} Lati Tibabu</p><Link href="/privacy" className="hover:underline">Privacy policy</Link><a href="#main-content" className="hover:underline">Back to top ↑</a></div>
      </div>
    </footer>
  );
}
