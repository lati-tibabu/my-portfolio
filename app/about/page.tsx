import type { Metadata } from "next";
import Link from "next/link";
import Icon from "../components/Icon";
import {
  certifications as defaultCertifications,
} from "../data/cms";
import type { Certification } from "../data/cms";
import { loadCertifications } from "../lib/content";

export const metadata: Metadata = {
  title: "About Lati Tibabu",
  description:
    "Read about Lati Tibabu's background, experience, education, skills, and selected projects as a Full Stack and Odoo ERP Developer.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Lati Tibabu", description: "The background, experience, and education behind my work.", url: "/about" },
  keywords: [
    "About Lati Tibabu",
    "Odoo ERP Developer",
    "Portfolio",
    "Software Engineer",
    "Addis Ababa",
  ],
};

// CMS content lives in Supabase; always render fresh so admin edits appear immediately.
export const revalidate = 0;

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

export default async function About() {
  const certificationsFromCms = await loadCertifications();
  const certifications: Certification[] =
    certificationsFromCms.length > 0 ? certificationsFromCms : defaultCertifications;

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <section className="editorial-intro about-intro">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <p className="section-kicker text-[var(--color-on-surface-variant)]">About / Behind the work</p>
            <h1 className="editorial-title">Lati Tibabu<br /><span className="text-[var(--color-on-surface-variant)]">Gamachu.</span></h1>
            <p className="mt-6 text-lg leading-relaxed">Full Stack &amp; Odoo ERP Developer</p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-on-surface-variant)]">I build practical software that connects people, simplifies everyday workflows, and helps businesses grow.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/LatiTibabu_CV.pdf" target="_blank" rel="noopener noreferrer" className="portfolio-button portfolio-button-primary"><Icon name="download" size={16} /> Resume PDF</a>
              <a href="https://linkedin.com/in/lati-tibabu" target="_blank" rel="noopener noreferrer" className="portfolio-button"><Icon name="linkedin" size={16} /> LinkedIn</a>
              <a href="https://github.com/lati-tibabu" target="_blank" rel="noopener noreferrer" className="portfolio-button"><Icon name="github" size={16} /> GitHub</a>
            </div>
          </div>
          <div className="about-contact-card">
            <p className="section-kicker text-[var(--color-on-surface-variant)]">Based in Ethiopia · Building for the web</p>
            <div className="mt-6 flex items-center gap-3 text-sm"><Icon name="location" size={18} /> Addis Ababa, Ethiopia</div>
            <a href="mailto:latitibabu2018@gmail.com" className="mt-5 flex items-center gap-3 text-sm hover:underline"><Icon name="mail" size={18} /><span className="min-w-0 break-all">latitibabu2018@gmail.com</span></a>
            <a href="tel:+251979586697" className="mt-5 flex items-center gap-3 text-sm hover:underline"><Icon name="phone" size={18} /> +251 979 586 697</a>
          </div>
        </div>
      </section>

      <section className="about-content px-6 py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <aside className="space-y-6 order-2 lg:order-1">
            <div id="skills" className="scroll-mt-24 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h2 className="font-heading text-lg">Technical skills</h2>
              <div className="mt-5 space-y-6">
                {skills.map((group) => (
                  <div key={group.title}>
                    <h3 className="section-kicker">{group.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">{group.items.map((item) => <span key={item} className="tag-chip">{item}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">Education</h3>
              <p className="mt-3 text-[14px] text-[var(--color-on-surface)]">B.Sc. in Computer Science and Engineering</p>
              <p className="text-[13px] text-[var(--color-on-surface-variant)]">Adama Science and Technology University</p>
              <p className="mt-2 text-[12px] font-semibold text-[var(--color-electric-blue)]">2021 – 2025 · CGPA 3.72 / 4.0</p>
            </div>

            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">Languages</h3>
              <ul className="mt-3 space-y-2 text-[13px] text-[var(--color-on-surface-variant)]">
                <li><span className="font-semibold text-[var(--color-on-surface)]">Afan Oromo:</span> Native</li>
                <li><span className="font-semibold text-[var(--color-on-surface)]">English:</span> Proficient</li>
                <li><span className="font-semibold text-[var(--color-on-surface)]">Amharic:</span> Basic</li>
              </ul>
            </div>
          </aside>

          <div className="space-y-6 order-1 lg:order-2">
            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">Profile</h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-[var(--color-on-surface-variant)]">
                Full Stack Developer and Odoo ERP Developer with practical experience in Odoo customization, module development, and ERP implementation. Expert in Python, PostgreSQL, Odoo ORM, XML views, and workflow automation. Focused on delivering maintainable systems across the software development lifecycle.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">Experience</h3>
              <div className="experience-timeline mt-6">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-semibold text-[var(--color-on-surface)]">Full Stack / Odoo ERP Developer</h4>
                    <span className="tag-chip">08/2025 – Present</span>
                  </div>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)]">OTech Engineering and Technology Solutions</p>
                  <ul className="mt-3 space-y-2 text-[13px] text-[var(--color-on-surface-variant)]">
                    <li>Implemented and deployed 3+ custom Odoo modules for HR, Planning, and Inventory workflows.</li>
                    <li>In charge of system integrations and REST APIs using Keycloak-based Identity Management (OIDC/OAuth2).</li>
                    <li>Spearheaded requirements analysis and maintenance within a collaborative ERP development team.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-semibold text-[var(--color-on-surface)]">Software Development Intern</h4>
                    <span className="tag-chip">07/2024 – 10/2024</span>
                  </div>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)]">Ministry of Innovation and Technology, Ethiopia</p>
                  <ul className="mt-3 space-y-2 text-[13px] text-[var(--color-on-surface-variant)]">
                    <li>Co-led backend design and data modeling for SchoolStream, improving scalability and performance.</li>
                    <li>Developed RESTful APIs and optimized PostgreSQL queries for enhanced data accessibility.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-semibold text-[var(--color-on-surface)]">Machine Learning Intern</h4>
                    <span className="tag-chip">06/2024 – 07/2024</span>
                  </div>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)]">TechnoHacks EduTech (Remote)</p>
                  <ul className="mt-3 space-y-2 text-[13px] text-[var(--color-on-surface-variant)]">
                    <li>Executed supervised learning tasks for classification and regression on real-world datasets.</li>
                    <li>Achieved 85%+ predictive accuracy in sample models.</li>
                  </ul>
                </div>

                <Link href="/#work" className="inline-flex items-center gap-2 border-b border-current pb-2 text-sm">Explore my project journey <span aria-hidden="true">↗</span></Link>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">Certifications</h3>
              <div className="mt-4 grid gap-3 text-[13px] text-[var(--color-on-surface-variant)] sm:grid-cols-2">
                {certifications.map((cert) => (
                  <div key={cert.id ?? cert.title} className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-3">
                    {cert.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
