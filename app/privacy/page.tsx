import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for latitibabu.com.",
};

const sectionClass = "rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6 md:p-8";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 pb-20 pt-28">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-8">
          <p className="font-label text-[10px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">Transparency</p>
          <h1 className="mt-3 font-heading text-4xl text-[var(--color-on-surface)] md:text-5xl">Privacy policy</h1>
          <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">Effective date: July 22, 2026</p>
        </header>

        <div className="space-y-5 text-sm leading-7 text-[var(--color-on-surface-variant)]">
          <section className={sectionClass}>
            <h2 className="font-heading text-2xl text-[var(--color-on-surface)]">What this site collects</h2>
            <p className="mt-4">When you browse this portfolio, the site collects limited technical analytics to understand which pages are visited and improve the experience. This may include visited pages, visit time, browser and browser version, operating system, device type, language, timezone, screen dimensions, referrer, and approximate location when it is provided by the hosting platform.</p>
            <p className="mt-3">The site also creates a visitor ID in local storage and a session ID in session storage. Your IP address is not stored directly; a one-way hash is stored instead.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="font-heading text-2xl text-[var(--color-on-surface)]">How the data is used</h2>
            <p className="mt-4">Analytics data is used only to understand traffic, identify popular content, monitor the site, and improve this portfolio. It is not sold or used for advertising, and no attempt is made to identify individual visitors.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="font-heading text-2xl text-[var(--color-on-surface)]">Storage and service providers</h2>
            <p className="mt-4">Analytics records are stored in the site&apos;s Supabase database. The site may receive approximate country, region, or city headers from its hosting platform. No third-party advertising or analytics platform is used by this implementation.</p>
            <p className="mt-3">Analytics records are currently retained in the database until they are manually deleted or a retention process is introduced.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="font-heading text-2xl text-[var(--color-on-surface)]">Your choices</h2>
            <p className="mt-4">You can remove this site&apos;s visitor ID from your browser&apos;s local storage and the session ID from session storage through your browser settings. Blocking storage or JavaScript may prevent analytics from being recorded, but it will not prevent you from viewing the public site.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="font-heading text-2xl text-[var(--color-on-surface)]">Contact</h2>
            <p className="mt-4">For privacy questions or requests about analytics data, contact <a className="text-[var(--color-on-surface)] underline underline-offset-4" href="mailto:latitibabu2018@gmail.com">latitibabu2018@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
