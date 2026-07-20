import type { Metadata } from "next";
import Icon from "../components/Icon";
import {
  certifications as defaultCertifications,
  devJourneyItems as defaultDevJourneyItems,
} from "../data/cms";
import type { Certification, DevJourneyItem } from "../data/cms";
import { loadCertifications, loadDevJourneyItems } from "../lib/content";

export const metadata: Metadata = {
  title: "About Lati Tibabu",
  description:
    "Read about Lati Tibabu's background, experience, education, skills, and selected projects as a Full Stack and Odoo ERP Developer.",
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

export default async function About() {
  const [devJourneyFromCms, certificationsFromCms] = await Promise.all([
    loadDevJourneyItems(),
    loadCertifications(),
  ]);
  const devJourney: DevJourneyItem[] =
    devJourneyFromCms.length > 0 ? devJourneyFromCms : defaultDevJourneyItems;
  const certifications: Certification[] =
    certificationsFromCms.length > 0 ? certificationsFromCms : defaultCertifications;

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <section className="px-6 pt-24 pb-12 bg-[var(--color-deep-navy)] text-white">
        <div className="max-w-[1100px] mx-auto space-y-6">
          <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">Portfolio · CV</p>
          <h1 className="font-heading text-[36px] md:text-[48px]">LATI TIBABU GAMACHU</h1>
          <p className="text-[18px] text-white/80">Full Stack &amp; Odoo ERP Developer</p>
          <div className="flex flex-wrap gap-4 text-[14px] text-white/80">
            <span className="flex items-center gap-2">
              <Icon name="mail" size={16} /> latitibabu2018@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <Icon name="phone" size={16} /> 0979586697
            </span>
            <span className="flex items-center gap-2">
              <Icon name="location" size={16} /> Addis Ababa, Ethiopia
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://linkedin.com/in/lati-tibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em]"
              aria-label="LinkedIn"
            >
              <Icon name="linkedin" size={16} /> LinkedIn
            </a>
            <a
              href="https://github.com/lati-tibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em]"
              aria-label="GitHub"
            >
              <Icon name="github" size={16} /> GitHub
            </a>
            <a
              href="/LatiTibabu_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-deep-navy)]"
            >
              <Icon name="download" size={16} /> Resume PDF
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-[1100px] mx-auto grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-8">
            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">Technical skills</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">Programming</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Node.js", "JavaScript", "Python", "Java", "React.js", "Next.js", "Flutter"].map((s) => (
                      <span key={s} className="tag-chip">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">ERP & Backend</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Odoo ORM", "XML/QWeb", "PostgreSQL", "REST APIs", "Keycloak", "OAuth2"].map((s) => (
                      <span key={s} className="tag-chip">{s}</span>
                    ))}
                  </div>
                </div>
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

          <div className="space-y-8">
            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">Profile</h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-[var(--color-on-surface-variant)]">
                Full Stack Developer and Odoo ERP Developer with practical experience in Odoo customization, module development, and ERP implementation. Expert in Python, PostgreSQL, Odoo ORM, XML views, and workflow automation. Focused on delivering maintainable systems across the software development lifecycle.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6">
              <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">Experience</h3>
              <div className="mt-4 space-y-6">
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

                <div>
                  <h4 className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">Development Journey</h4>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {devJourney.map((project) => (
                      <article key={project.id ?? project.title} className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4">
                        <h5 className="font-heading text-[15px] text-[var(--color-on-surface)]">{project.title}</h5>
                        <p className="mt-2 text-[13px] text-[var(--color-on-surface-variant)]">
                          {project.description}
                          {project.links.map((link, index) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-[var(--color-electric-blue)] font-semibold ${index === 0 ? "ml-1" : "ml-2"}`}
                            >
                              {link.label ?? "View"}
                            </a>
                          ))}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
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
