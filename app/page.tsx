import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "./components/Icon";
import MarkdownText from "./components/MarkdownText";
import ProjectJourney from "./components/ProjectJourney";
import TestimonialsMarquee from "./components/TestimonialsMarquee";
import {
  devJourneyItems as defaultDevJourneyItems,
  heroContent as defaultHeroContent,
  stats as defaultStats,
} from "./data/cms";
import type {
  DevJourneyItem,
  HeroContent,
} from "./data/cms";
import {
  loadDevJourneyItems,
  loadHeroContent,
  loadMarketplaceItems,
  loadStats,
  loadTestimonials,
} from "./lib/content";

// CMS content lives in Supabase; always render fresh so admin edits appear immediately.
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Lati Tibabu — Full Stack & Odoo ERP Developer",
  description:
    "Lati Tibabu builds scalable web apps, Odoo ERP solutions, and digital products. Based in Ethiopia, available for freelance work globally.",
  keywords: [
    "Full Stack Developer",
    "Odoo ERP",
    "Digital Products",
    "Odoo Themes",
    "Next.js",
    "Python",
  ],
};

const solutions = [
  {
    title: "Odoo Solutions",
    description:
      "Custom ERP systems and workflow automation tailored to each business unit.",
  },
  {
    title: "Digital Products",
    description:
      "Modern tools and scalable SaaS platforms built for adoption and speed.",
  },
  {
    title: "AI & Automation",
    description:
      "Intelligent systems and productivity workflows that save teams time.",
  },
];

const services = [
  {
    title: "Odoo Customization",
    tag: "ERP",
    description:
      "Implementation, module development, migrations, and workflow automation for complex ERP operations.",
  },
  {
    title: "Odoo Theme Development",
    tag: "UI",
    description:
      "Modern backend and frontend experiences that improve usability, speed, and stakeholder adoption.",
  },
  {
    title: "Full-Stack Web Apps",
    tag: "Web",
    description:
      "React and Next.js applications built with resilient APIs, observability, and clean architecture.",
  },
  {
    title: "System Integration",
    tag: "IAM",
    description:
      "Secure IAM integrations with Keycloak, OIDC, OAuth2, and REST APIs for cross-platform workflows.",
  },
];

const graphicsPreview = [
  "/Images/Graphics/akkamitti_qophoofna_2025.png",
  "/Images/Graphics/duula_kadhannaa_2023.png",
  "/Images/Graphics/gc_night_2025.png",
  "/Images/Graphics/faith_success_2025.png",
];

export default async function Home() {
  const marketplaceItems = await loadMarketplaceItems();
  const [heroFromCms, testimonials, devJourneyFromCms, statsFromCms] =
    await Promise.all([
      loadHeroContent(),
      loadTestimonials(),
      loadDevJourneyItems(),
      loadStats(),
    ]);
  const hero: HeroContent = heroFromCms ?? defaultHeroContent;
  const devJourney: DevJourneyItem[] =
    devJourneyFromCms.length > 0 ? devJourneyFromCms : defaultDevJourneyItems;
  const stats = statsFromCms.length > 0 ? statsFromCms : defaultStats;

  const heroCtas = [
    { label: hero.cta1Label, href: hero.cta1Href, primary: true },
    { label: hero.cta2Label, href: hero.cta2Href, primary: false },
    { label: hero.cta3Label, href: hero.cta3Href, primary: false },
  ].map((cta) => ({ ...cta, href: cta.href === "/#skills" || cta.href === "#skills" ? "/about#skills" : cta.href })).filter((cta) => cta.label?.trim() && cta.href?.trim()) as {
    label: string;
    href: string;
    primary: boolean;
  }[];

  const isCentered = hero.layout === "centered";
  const showHeroImage = hero.imageEnabled && !isCentered && !!hero.imageUrl;

  const heroText = (
    <div
      className={`space-y-8 animate-fade-up ${isCentered ? "mx-auto max-w-[720px] text-center" : ""}`}
    >
      <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
        {hero.eyebrow}
      </p>
      <h1 className="font-heading text-[40px] leading-[1.1] tracking-tight text-[var(--color-on-surface)] md:text-[64px]">
        {hero.headline}
      </h1>
      <MarkdownText
        content={hero.bodyMd}
        className="text-[17px] leading-[1.65] text-[var(--color-on-surface-variant)] [&_p]:max-w-[560px] [&_p+p]:mt-4"
      />
      {heroCtas.length > 0 && (
        <div
          className={`flex flex-wrap items-center gap-3 ${isCentered ? "justify-center" : ""}`}
        >
          {heroCtas.map((cta) => {
            const external = /^https?:\/\//i.test(cta.href);
            const className = cta.primary
              ? "inline-flex items-center gap-2 rounded-md bg-[var(--color-electric-blue)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition hover:scale-[1.02]"
              : "inline-flex items-center gap-2 rounded-md border border-[var(--color-surface-border)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface)] transition hover:border-[var(--color-electric-blue)]";
            return external ? (
              <a
                key={cta.href}
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {cta.label}
              </a>
            ) : (
              <Link key={cta.href} href={cta.href} className={className}>
                {cta.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  const heroImage = (
    <div className="relative">
      <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05)]">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={hero.imageUrl || "https://placehold.co/600x600@2x.png"}
            alt={hero.imageAlt || hero.headline}
            fill
            sizes="(min-width: 1024px) 420px, 80vw"
            className="object-cover"
            priority
          />
        </div>
        {(hero.availabilityLabel || hero.availabilityValue) && (
          <div className="mt-4 flex items-center justify-between text-sm text-[var(--color-on-surface-variant)]">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">
              {hero.availabilityLabel}
            </span>
            <span>{hero.availabilityValue}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <section className="relative overflow-hidden px-6 pt-14 pb-12 sm:pt-20 lg:pt-24 lg:pb-16">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-[var(--color-primary-fixed)] blur-3xl opacity-70" />
        <div className="absolute -bottom-40 left-[-5%] h-[420px] w-[420px] rounded-full bg-[var(--color-secondary-fixed)] blur-3xl opacity-50" />
        <div className="max-w-[1280px] mx-auto">
          {showHeroImage ? (
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
              {hero.layout === "image-left-text-right" ? (
                <>
                  {heroImage}
                  {heroText}
                </>
              ) : (
                <>
                  {heroText}
                  {heroImage}
                </>
              )}
            </div>
          ) : (
            <div className={isCentered ? "flex flex-col items-center" : ""}>
              {heroText}
            </div>
          )}
        </div>
      </section>

      <section aria-label="Work in numbers" className="px-6 py-8">
        <div className="impact-panel mx-auto max-w-[1280px]">
          <div className="impact-heading"><span className="section-kicker">The work, in numbers</span><span className="font-mono text-xs opacity-60">Small details. Real impact.</span></div>
          <dl className="impact-stats">
            {stats.map((stat, index) => (
              <div key={stat.id ?? stat.label} className="impact-stat">
                <span aria-hidden="true" className="font-mono text-xs opacity-40">/{String(index + 1).padStart(2, "0")}</span>
                <dt>{stat.label}</dt><dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="services"
        className="px-6 py-20 bg-[var(--color-surface-container-low)]"
      >
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div className="space-y-4">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
                01 / Services
              </p>
              <h2 className="font-heading text-[36px] leading-[1.05] tracking-[-0.02em] text-[var(--color-on-surface)] md:text-[44px]">
                Services built for measurable growth
              </h2>
              <p className="text-[16px] leading-[1.7] text-[var(--color-on-surface-variant)] max-w-[560px]">
                From ERP implementation to system integrations, LATI delivers
                robust systems that scale with your business.
              </p>
            </div>
            <Link
              href="/#contact"
              className="group inline-flex items-center justify-between gap-3 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-surface)] transition hover:border-[var(--color-on-surface)] lg:justify-self-start"
            >
              Start a project
              <Icon
                name="arrow-up-right"
                size={16}
                className="text-[var(--color-on-surface-variant)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-on-surface)]"
              />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)]">
            {services.map((service, index) => (
              <Link
                key={service.title}
                href="/#contact"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 px-5 py-7 transition-colors duration-300 hover:bg-[var(--color-on-surface)] sm:gap-8 sm:px-7 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-[var(--color-surface-border)] hover:[&:not(:first-child)]:border-[var(--color-on-surface)]"
              >
                <span className="font-label text-[12px] tracking-[0.2em] text-[var(--color-on-surface-variant)] transition-colors duration-300 group-hover:text-[var(--color-background)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-[22px] leading-tight text-[var(--color-on-surface)] transition-colors duration-300 group-hover:text-[var(--color-background)] sm:text-[24px]">
                    {service.title}
                  </h3>
                  <p className="mt-2 max-w-[560px] text-[14px] leading-[1.6] text-[var(--color-on-surface-variant)] transition-colors duration-300 group-hover:text-[var(--color-background)]">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-label hidden text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] transition-colors duration-300 group-hover:text-[var(--color-background)] sm:inline">
                    {service.tag}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] transition-all duration-300 group-hover:border-[var(--color-background)] group-hover:text-[var(--color-background)]">
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6 lg:col-span-2">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
                Delivery approach
              </p>
              <h3 className="mt-3 font-heading text-[24px] text-[var(--color-on-surface)]">
                Plan, build, launch, improve
              </h3>
              <p className="mt-2 max-w-[520px] text-[14px] leading-[1.65] text-[var(--color-on-surface-variant)]">
                Strategy-led engineering with transparent milestones,
                measurable outcomes, and long-term maintainability.
              </p>
              <ol className="mt-7 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
                {[
                  "Discovery & planning",
                  "Implementation sprints",
                  "Testing & deployment",
                  "Continuous improvement",
                ].map((step, index) => (
                  <li key={step} className="relative border-t border-[var(--color-surface-border)] pt-4">
                    <span className="font-heading text-[26px] leading-none text-[var(--color-on-surface)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-3 text-[12px] leading-[1.5] text-[var(--color-on-surface-variant)]">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
                Solutions
              </p>
              <ul className="mt-4">
                {solutions.map((solution, index) => (
                  <li
                    key={solution.title}
                    className="border-t border-[var(--color-surface-border)] pt-4 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-4"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-label text-[11px] tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-heading text-[17px] text-[var(--color-on-surface)]">
                        {solution.title}
                      </h4>
                    </div>
                    <p className="mt-1.5 pl-7 text-[13px] leading-[1.6] text-[var(--color-on-surface-variant)]">
                      {solution.description}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-border)] sm:grid-cols-3">
            {[
              "Enterprise-grade architecture and security",
              "Fast delivery with long-term maintainability",
              "Support from discovery to scale",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-[var(--color-surface-container-lowest)] px-5 py-4 text-[13px] text-[var(--color-on-surface-variant)]"
              >
                <Icon
                  name="arrow-right"
                  size={13}
                  className="text-[var(--color-on-surface)]"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="marketplace" className="lively-section px-6 py-24">
        <div className="relative z-[1] mx-auto max-w-[1280px] space-y-10">
          <div className="stagger-up space-y-3 [--stagger-delay:80ms]">
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              02 / Products
            </p>
            <h2 className="font-heading text-[32px] text-[var(--color-on-surface)]">
              Digital products for everyday possibilities
            </h2>
            <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[640px]">
              Apps, themes, templates, and tools built to help you work smarter.
              Discover the details, previews, and resources behind each product.
            </p>
          </div>
          <div className="lively-card group stagger-up rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between [--stagger-delay:180ms] md:p-8">
            <div className="relative z-[1]">
              <p className="font-heading text-[22px] text-[var(--color-on-surface)] transition-transform duration-300 group-hover:translate-x-1">
                The digital product catalog
              </p>
              <p className="mt-2 text-[14px] text-[var(--color-on-surface-variant)]">
                {marketplaceItems.length} products with full specs, pricing,
                screenshots, and support links.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="lively-arrow inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-on-surface)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface)] md:self-auto"
            >
              View products <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <ProjectJourney projects={devJourney} />

      <section id="about" className="px-6 py-12 border-y border-[var(--color-surface-border)]">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div><p className="section-kicker">Behind the work</p><h2 className="mt-3 text-2xl tracking-tight">A little more about the person building it.</h2></div>
          <Link href="/about" className="inline-flex shrink-0 items-center gap-4 self-start border-b border-current pb-2 text-sm sm:self-auto">Meet Lati <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section
          id="feedback"
          className="px-6 py-20 border-y border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)]"
        >
          <div className="max-w-[1280px] mx-auto space-y-10">
            <div className="space-y-3">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
                Client feedback
              </p>
              <h2 className="font-heading text-[32px] text-[var(--color-on-surface)]">
                What clients say
              </h2>
              <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[640px]">
                Trusted by growing businesses worldwide.
              </p>
            </div>
            <TestimonialsMarquee items={testimonials} />
          </div>
        </section>
      )}

      <section id="graphics" className="px-6 py-20">
        <div className="max-w-[1280px] mx-auto space-y-10">
          <div className="space-y-3">
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              04 / Graphics
            </p>
            <h2 className="font-heading text-[32px] text-[var(--color-on-surface)]">
              Graphics & creative work
            </h2>
            <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[640px]">
              A selection of posters, event banners, and brand visuals designed
              for community-driven initiatives.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {graphicsPreview.map((src) => (
              <div
                key={src}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-[var(--color-surface-border)]"
              >
                <Image
                  src={src}
                  alt="Graphics preview"
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="object-cover grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>
          <Link
            href="/graphics"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-electric-blue)]"
          >
            View full graphics gallery →
          </Link>
        </div>
      </section>

    </div>
  );
}
