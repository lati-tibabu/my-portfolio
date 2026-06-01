import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HandDrawnIcon from "./components/HandDrawnIcon";
import { loadMarketplaceItems } from "./lib/content";

export const metadata: Metadata = {
  title: "Lati Tibabu — Full Stack & Odoo ERP Developer",
  description:
    "Lati Tibabu builds scalable web apps, Odoo ERP solutions, and Odoo Marketplace themes. Based in Ethiopia, available for freelance work globally.",
  keywords: [
    "Full Stack Developer",
    "Odoo ERP",
    "Odoo Marketplace",
    "Odoo Themes",
    "Next.js",
    "Python",
  ],
};

const createStats = (marketplaceCount: number) => [
  { label: "Odoo apps/themes published", value: `${marketplaceCount}` },
  { label: "Odoo app adopters", value: "110+" },
  { label: "Years of experience", value: "4+" },
  { label: "Stack size", value: "20+ tools" },
];

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
    description:
      "Implementation, module development, migrations, and workflow automation for complex ERP operations.",
  },
  {
    title: "Odoo Theme Development",
    description:
      "Modern backend and frontend experiences that improve usability, speed, and stakeholder adoption.",
  },
  {
    title: "Full-Stack Web Apps",
    description:
      "React and Next.js applications built with resilient APIs, observability, and clean architecture.",
  },
  {
    title: "System Integration",
    description:
      "Secure IAM integrations with Keycloak, OIDC, OAuth2, and REST APIs for cross-platform workflows.",
  },
];

const skills = [
  {
    title: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
  },
  {
    title: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "Redux Toolkit",
      "Tailwind CSS",
      "CSS Modules",
    ],
  },
  {
    title: "Odoo & Backend",
    items: [
      "Odoo (Python, XML, QWeb)",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "REST APIs",
    ],
  },
  {
    title: "Tools & Platforms",
    items: [
      "Git & GitHub",
      "Keycloak (SSO/OAuth2)",
      "Flutter",
      "Vercel",
      "Figma",
    ],
  },
];

const experience = [
  {
    role: "Full Stack / Odoo ERP Developer",
    period: "08/2025 – Present",
    org: "OTech Engineering and Technology Solutions",
    highlights: [
      "Implemented and deployed 3+ custom Odoo modules for HR, Planning, and Inventory workflows.",
      "Led system integrations and REST APIs using Keycloak-based IAM (OIDC/OAuth2).",
      "Managed requirements analysis and ongoing maintenance within ERP teams.",
    ],
  },
  {
    role: "Software Development Intern",
    period: "07/2024 – 10/2024",
    org: "Ministry of Innovation and Technology, Ethiopia",
    highlights: [
      "Co-led backend design and data modeling for SchoolStream.",
      "Developed RESTful APIs and optimized PostgreSQL queries for accessibility.",
    ],
  },
  {
    role: "Machine Learning Intern",
    period: "06/2024 – 07/2024",
    org: "TechnoHacks EduTech (Remote)",
    highlights: [
      "Executed supervised learning tasks for classification and regression datasets.",
      "Achieved 85%+ predictive accuracy in sample models.",
    ],
  },
];

const projects = [
  {
    title: "SchoolStream — Education Management System",
    description:
      "Full-stack education platform for school, user, and student management with dashboards and reporting.",
  },
  {
    title: "Student Productivity Hub (BeNote)",
    description:
      "Notes, tasks, Pomodoro tools, and AI-assisted study features for students.",
    link: "https://student-productivity-hub-mgis.vercel.app/",
  },
  {
    title: "Faarfannaa Galata Waaqayyoo",
    description:
      "Digital hymn platform with offline access, search, and synchronized web/mobile content.",
    link: "https://faarfannaa.vercel.app",
  },
  {
    title: "Otech ID Generator",
    description:
      "Professional ID generator with barcode/QR automation and PDF export.",
  },
  {
    title: "Benote SSO",
    description: "Auth layer for secure access across services via JWT flows.",
    link: "https://www.npmjs.com/package/@benote/sso-backend",
  },
  {
    title: "PostaDesk",
    description:
      "Configurable PostgreSQL management and app-building tool with drag-and-drop workflows.",
  },
];

const certifications = [
  "A2SV 2024 AI for Impact Hackathon",
  "Intro & Intermediate Machine Learning (Kaggle)",
  "Responsive Web Design (freeCodeCamp)",
];

// Client feedback temporarily removed — testimonials hidden
const testimonials: { name: string; text: string }[] = [];

const graphicsPreview = [
  "/Images/Graphics/akkamitti_qophoofna_2025.png",
  "/Images/Graphics/duula_kadhannaa_2023.png",
  "/Images/Graphics/gc_night_2025.png",
  "/Images/Graphics/faith_success_2025.png",
];

export default async function Home() {
  const marketplaceItems = await loadMarketplaceItems();
  const stats = createStats(marketplaceItems.length);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <section className="relative overflow-hidden px-6 pt-28 pb-16">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-[var(--color-primary-fixed)] blur-3xl opacity-70" />
        <div className="absolute -bottom-40 left-[-5%] h-[420px] w-[420px] rounded-full bg-[var(--color-secondary-fixed)] blur-3xl opacity-50" />
        <div className="max-w-[1280px] mx-auto grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8 animate-fade-up">
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              Full Stack & Odoo ERP Developer
            </p>
            <h1 className="font-heading text-[40px] leading-[1.1] tracking-tight text-[var(--color-on-surface)] md:text-[64px]">
              Lati Tibabu builds modern ERP systems and enterprise web
              platforms.
            </h1>
            <p className="text-[18px] leading-[1.65] text-[var(--color-on-surface-variant)] max-w-[560px]">
              Available for freelance engagements worldwide. I specialize in
              Odoo customization, theme development, and full-stack application
              delivery backed by secure IAM integrations.
            </p>
            <p className="text-[15px] leading-[1.7] text-[var(--color-on-surface-variant)] max-w-[560px]">
              LATI develops enterprise software, Odoo solutions, and modern
              digital products focused on usability, scalability, and
              performance.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-electric-blue)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition hover:scale-[1.02]"
              >
                Get in touch
              </Link>
              <a
                href="/LatiTibabu_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--color-surface-border)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface)] transition hover:border-[var(--color-electric-blue)]"
              >
                Download CV
              </a>
              <a
                href="https://www.upwork.com/freelancers/~0162435256404567a3?mp_source=share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--color-surface-border)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface)] transition hover:border-[var(--color-electric-blue)]"
              >
                <Image
                  src="/hand-drawn-icons/upwork.jpg"
                  alt="Upwork"
                  width={18}
                  height={18}
                  className="rounded-sm object-contain"
                />
                Hire me on Upwork
              </a>
              <div className="flex items-center gap-3">
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
                  href="https://linkedin.com/in/lati-tibabu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
                  aria-label="LinkedIn"
                >
                  <HandDrawnIcon name="linkedin" size={20} />
                </a>
                <a
                  href="https://x.com/TibabuLati"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition"
                  aria-label="X"
                >
                  <HandDrawnIcon name="x" size={20} />
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
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.05)]">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src="/me4.png"
                  alt="Lati Tibabu portrait"
                  fill
                  sizes="(min-width: 1024px) 420px, 80vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-[var(--color-on-surface-variant)]">
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">
                  Availability
                </span>
                <span>Open for freelance work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="max-w-[1280px] mx-auto rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] px-6 py-8 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.05)]">
          <div className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="font-heading text-[28px] text-[var(--color-on-surface)]">
                  {stat.value}
                </p>
                <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="marketplace" className="px-6 py-20">
        <div className="max-w-[1280px] mx-auto space-y-10">
          <div className="space-y-3">
            <a
              href="https://www.fiverr.com/latitibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--color-surface-border)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface)] transition hover:border-[var(--color-electric-blue)]"
            >
              Fiverr
            </a>
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              01 / Odoo Marketplace
            </p>
            <h2 className="font-heading text-[32px] text-[var(--color-on-surface)]">
              Published Odoo apps & themes
            </h2>
            <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[640px]">
              Explore all Aura apps and themes in a dedicated marketplace page
              with full details, screenshots, and support links.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-heading text-[22px] text-[var(--color-on-surface)]">
                Aura Odoo Marketplace
              </p>
              <p className="mt-2 text-[14px] text-[var(--color-on-surface-variant)]">
                {marketplaceItems.length} listings with full specs, pricing,
                screenshots, and support links.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--color-electric-blue)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
            >
              View marketplace
            </Link>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="px-6 py-20 bg-[var(--color-surface-container-low)]"
      >
        <div className="max-w-[1280px] mx-auto space-y-10">
          <div className="space-y-3">
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              02 / Services
            </p>
            <h2 className="font-heading text-[32px] text-[var(--color-on-surface)]">
              Services built for measurable growth
            </h2>
            <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[640px]">
              From ERP implementation to system integrations, LATI delivers
              robust systems that scale with your business.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6 transition hover:shadow-[0_20px_25px_-5px_rgba(15,23,42,0.05)]"
              >
                <h3 className="font-heading text-[20px] text-[var(--color-on-surface)]">
                  {service.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-[var(--color-on-surface-variant)]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Enterprise-grade architecture and security",
              "Fast delivery with long-term maintainability",
              "Support from discovery to scale",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] px-5 py-4 text-[13px] text-[var(--color-on-surface-variant)]"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {solutions.map((solution) => (
              <article
                key={solution.title}
                className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5"
              >
                <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">
                  {solution.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[var(--color-on-surface-variant)]">
                  {solution.description}
                </p>
              </article>
            ))}
          </div>
          <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-center">
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
                  Delivery approach
                </p>
                <h3 className="font-heading text-[24px] text-[var(--color-on-surface)] mt-3">
                  Plan, build, launch, improve
                </h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-[var(--color-on-surface-variant)]">
                  Strategy-led engineering with transparent milestones,
                  measurable outcomes, and long-term maintainability.
                </p>
              </div>
              <ul className="space-y-3 text-[14px] text-[var(--color-on-surface-variant)]">
                {[
                  "Discovery & planning",
                  "Implementation sprints",
                  "Testing & deployment",
                  "Continuous improvement",
                ].map((step) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-electric-blue)]" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="px-6 py-20">
        <div className="max-w-[1280px] mx-auto space-y-10">
          <div className="space-y-3">
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              03 / Skills
            </p>
            <h2 className="font-heading text-[32px] text-[var(--color-on-surface)]">
              Skills & tech stack
            </h2>
            <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[640px]">
              Full-stack delivery with deep ERP specialization and
              platform-level integrations.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {skills.map((skillGroup) => (
              <article
                key={skillGroup.title}
                className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6"
              >
                <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">
                  {skillGroup.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skillGroup.items.map((item) => (
                    <span key={item} className="tag-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="px-6 py-20 bg-[var(--color-surface-container-low)]"
      >
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="space-y-3">
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              04 / About
            </p>
            <h2 className="font-heading text-[32px] text-[var(--color-on-surface)]">
              Personal profile
            </h2>
            <p className="text-[16px] leading-[1.7] text-[var(--color-on-surface-variant)] max-w-[720px]">
              I am Lati Tibabu, a Full Stack and Odoo ERP Developer based in
              Addis Ababa, specializing in backend development, Odoo
              customization, and system integration using Python and the Odoo
              ORM. I work on REST APIs, workflow automation, and Identity &
              Access Management with Keycloak (OIDC, OAuth2, SSO). I hold a
              B.Sc. in Computer Science and Engineering from Adama Science and
              Technology University and focus on building scalable, maintainable
              ERP solutions.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[20px] text-[var(--color-on-surface)]">
                Profile
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-[var(--color-on-surface-variant)]">
                Full Stack Developer and Odoo ERP Developer with practical
                experience in Odoo customization, module development, and ERP
                implementation. Expert in Python, PostgreSQL, Odoo ORM, XML
                views, and workflow automation. Focused on delivering
                maintainable systems across the software development lifecycle.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-[var(--color-surface-border)]">
                  <Image
                    src="/static/about_image_pc.jpg"
                    alt="LATI team"
                    fill
                    sizes="(min-width: 1024px) 260px, 45vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-lg border border-[var(--color-surface-border)]">
                  <Image
                    src="/static/colleagues-reading-company-documents.jpg"
                    alt="Collaboration"
                    fill
                    sizes="(min-width: 1024px) 260px, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 text-[14px] text-[var(--color-on-surface-variant)]">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">
                    Location
                  </p>
                  <p className="mt-2">Addis Ababa, Ethiopia</p>
                </div>
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">
                    Education
                  </p>
                  <p className="mt-2">
                    B.Sc. Computer Science & Engineering — Adama Science and
                    Technology University
                  </p>
                </div>
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">
                    Email
                  </p>
                  <p className="mt-2">latitibabu2018@gmail.com</p>
                </div>
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">
                    Phone
                  </p>
                  <p className="mt-2">+251 979 586 697</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">
                  Languages
                </p>
                <p className="mt-2 text-[14px] text-[var(--color-on-surface-variant)]">
                  Afan Oromo (Native), English (Proficient), Amharic (Basic)
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[20px] text-[var(--color-on-surface)]">
                Experience
              </h3>
              <div className="mt-4 space-y-6">
                {experience.map((role) => (
                  <div key={role.role} className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[15px] font-semibold text-[var(--color-on-surface)]">
                          {role.role}
                        </p>
                        <p className="text-[13px] text-[var(--color-on-surface-variant)]">
                          {role.org}
                        </p>
                      </div>
                      <span className="tag-chip">{role.period}</span>
                    </div>
                    <ul className="space-y-2 text-[13px] text-[var(--color-on-surface-variant)]">
                      {role.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-electric-blue)]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4">
                <p className="font-heading text-[16px] text-[var(--color-on-surface)]">
                  Built for impact. Designed for you.
                </p>
                <p className="mt-2 text-[13px] text-[var(--color-on-surface-variant)]">
                  We deliver results that help businesses grow, scale, and stay
                  ahead.
                </p>
              </div>
              <div className="mt-4 grid gap-3 text-[13px] text-[var(--color-on-surface-variant)]">
                {[
                  "Proven expertise",
                  "Focused on outcomes",
                  "Long-term partnership",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-electric-blue)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[20px] text-[var(--color-on-surface)]">
                Development journey
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <article
                    key={project.title}
                    className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4"
                  >
                    <h4 className="font-heading text-[16px] text-[var(--color-on-surface)]">
                      {project.title}
                    </h4>
                    <p className="mt-2 text-[13px] text-[var(--color-on-surface-variant)]">
                      {project.description}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-electric-blue)]"
                      >
                        View project →
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[20px] text-[var(--color-on-surface)]">
                Certifications
              </h3>
              <ul className="mt-4 space-y-3 text-[13px] text-[var(--color-on-surface-variant)]">
                {certifications.map((cert) => (
                  <li key={cert} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-electric-blue)]" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
            <h3 className="font-heading text-[20px] text-[var(--color-on-surface)]">
              Client feedback
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4"
                >
                  <p className="text-[13px] leading-[1.6] text-[var(--color-on-surface-variant)]">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <p className="mt-3 text-[12px] font-semibold text-[var(--color-on-surface)]">
                    — {testimonial.name}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
              Trusted by growing businesses worldwide
            </p>
          </div>
        </div>
      </section>

      <section id="graphics" className="px-6 py-20">
        <div className="max-w-[1280px] mx-auto space-y-10">
          <div className="space-y-3">
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              05 / Graphics
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
                className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[var(--color-surface-border)]"
              >
                <Image
                  src={src}
                  alt="Graphics preview"
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="object-cover"
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

      <section
        id="contact"
        className="px-6 py-20 bg-[var(--color-deep-navy)] text-[var(--color-inverse-on-surface)]"
      >
        <div className="max-w-[1280px] mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-4">
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              06 / Contact
            </p>
            <h2 className="font-heading text-[32px] text-white">
              Let&apos;s build better systems together
            </h2>
            <p className="text-[16px] leading-[1.7] text-[var(--color-inverse-on-surface)] max-w-[520px]">
              Ready to build better systems? I&apos;m open to freelance work,
              ERP modernization, and long-term product partnerships. Reach out
              via email or Telegram and I will respond quickly.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:latitibabu2018@gmail.com"
                className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-deep-navy)]"
              >
                Email personal
              </a>
              <a
                href="mailto:hello@latitibabu.com"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                Email business
              </a>
              <a
                href="https://www.upwork.com/freelancers/~0162435256404567a3?mp_source=share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                <Image
                  src="/hand-drawn-icons/upwork.jpg"
                  alt="Upwork"
                  width={18}
                  height={18}
                  className="rounded-sm object-contain"
                />
                Hire me on Upwork
              </a>
              <a
                href="https://t.me/latitibabu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                Telegram
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-heading text-[20px] text-white">
              Contact details
            </h3>
            <div className="mt-4 space-y-4 text-[14px] text-[var(--color-inverse-on-surface)]">
              <div className="flex items-center gap-3">
                <HandDrawnIcon name="mail" size={18} />
                <span>latitibabu2018@gmail.com · hello@latitibabu.com</span>
              </div>
              <div className="flex items-center gap-3">
                <HandDrawnIcon name="fiverr" size={18} />
                <span>Fiverr: latitibabu</span>
              </div>
              <a
                href="https://www.upwork.com/freelancers/~0162435256404567a3?mp_source=share"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Image
                  src="/hand-drawn-icons/upwork.jpg"
                  alt="Upwork"
                  width={18}
                  height={18}
                  className="rounded-sm object-contain"
                />
                <span>Upwork: hire me for freelance work</span>
              </a>
              <div className="flex items-center gap-3">
                <HandDrawnIcon name="phone" size={18} />
                <span>+251 979 586 697</span>
              </div>
              <div className="flex items-center gap-3">
                <HandDrawnIcon name="location" size={18} />
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
