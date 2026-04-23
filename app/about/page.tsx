"use client";
import React from "react";
import {
  FiMail,
  FiLinkedin,
  FiGithub,
  FiDownload,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

export default function About() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">

      {/* ─── Header / Intro ───────────────────────────────────── */}
      <div className="bg-gray-900 py-16 px-6">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-start gap-8">
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#a06a45] tracking-widest uppercase mb-3">
              Portfolio · CV
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-white">
              LATI TIBABU GAMACHU
            </h1>
            <h2 className="text-lg font-medium mb-6 text-gray-400">
              Full Stack &amp; Odoo ERP Developer
            </h2>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-8">
              <span className="flex items-center gap-2">
                <FiMail className="text-[#a06a45]" /> latitibabu2018@gmail.com
              </span>
              <span className="flex items-center gap-2">
                <FiPhone className="text-[#a06a45]" /> 0979586697
              </span>
              <span className="flex items-center gap-2">
                <FiMapPin className="text-[#a06a45]" /> Addis Ababa, Ethiopia
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://linkedin.com/in/lati-tibabu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:text-[#c08a5b] hover:border-[#c08a5b] transition"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={18} />
              </a>
              <a
                href="https://github.com/lati-tibabu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:text-[#c08a5b] hover:border-[#c08a5b] transition"
                aria-label="GitHub"
              >
                <FiGithub size={18} />
              </a>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#8b5e3c] text-white rounded-lg hover:bg-[#6f472d] transition text-sm font-medium"
                onClick={() => window.open("/LatiTibabu_CV.pdf", "_blank")}
              >
                <FiDownload size={16} /> Resume PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ──────────────────────────────────────── */}
      <div className="max-w-[1000px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside className="md:col-span-1 space-y-10">

            {/* Skills */}
            <section>
              <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4 border-b border-gray-100 pb-2">
                Technical Skills
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Programming</p>
                  <div className="flex flex-wrap gap-2">
                    {["Node.js", "JavaScript", "Python", "Java", "React.js", "Next.js", "Flutter"].map((s) => (
                      <span key={s} className="skill-tag">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">ERP &amp; Backend</p>
                  <div className="flex flex-wrap gap-2">
                    {["Odoo ORM", "XML/QWeb", "PostgreSQL", "REST APIs", "Keycloak", "OAuth2"].map((s) => (
                      <span key={s} className="skill-tag">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4 border-b border-gray-100 pb-2">
                Education
              </h3>
              <div>
                <p className="font-semibold text-sm text-gray-900">B.Sc. in Computer Science and Engineering</p>
                <p className="text-sm text-gray-500 italic mt-1">Adama Science and Technology University</p>
                <p className="text-xs text-[#8b5e3c] font-semibold mt-2">2021 – 2025 · CGPA 3.72 / 4.0</p>
              </div>
            </section>

            {/* Languages */}
            <section>
              <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4 border-b border-gray-100 pb-2">
                Languages
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-800">Afan Oromo:</span> Native</p>
                <p><span className="font-medium text-gray-800">English:</span> Proficient</p>
                <p><span className="font-medium text-gray-800">Amharic:</span> Basic</p>
              </div>
            </section>

          </aside>

          {/* ── Main Column ──────────────────────────────────── */}
          <div className="md:col-span-2 space-y-10">

            {/* Profile */}
            <section>
              <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4 border-b border-gray-100 pb-2">
                Profile
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Full Stack Developer and Odoo ERP Developer with practical experience in Odoo
                customization, module development, and ERP implementation. Expert in Python,
                PostgreSQL, Odoo ORM, XML views, and workflow automation. Focused on delivering
                maintainable systems across the software development lifecycle.
              </p>
            </section>

            {/* Experience */}
            <section>
              <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-6 border-b border-gray-100 pb-2">
                Experience
              </h3>
              <div className="space-y-8">

                <div className="relative pl-6 border-l-2 border-gray-100">
                  <div className="absolute top-1 left-[-9px] w-4 h-4 bg-gray-900 rounded-full ring-2 ring-white" />
                  <div className="mb-1 flex flex-wrap justify-between items-start gap-2">
                    <h4 className="font-semibold text-gray-900">Full Stack / Odoo ERP Developer</h4>
                    <span className="text-xs font-semibold text-[#8b5e3c]">08/2025 – Present</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-3 font-medium">OTech Engineering and Technology Solutions</p>
                  <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                    <li>Implemented and deployed 3+ custom Odoo modules for HR, Planning, and Inventory workflows.</li>
                    <li>In charge of system integrations and REST APIs using Keycloak-based Identity Management (OIDC/OAuth2).</li>
                    <li>Spearheaded requirements analysis and maintenance within a collaborative ERP development team.</li>
                  </ul>
                </div>

                <div className="relative pl-6 border-l-2 border-gray-100">
                  <div className="absolute top-1 left-[-9px] w-4 h-4 bg-gray-300 rounded-full ring-2 ring-white" />
                  <div className="mb-1 flex flex-wrap justify-between items-start gap-2">
                    <h4 className="font-semibold text-gray-900">Software Development Intern</h4>
                    <span className="text-xs font-medium text-gray-400">07/2024 – 10/2024</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-3 font-medium">Ministry of Innovation and Technology, Ethiopia</p>
                  <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                    <li>Co-led backend design and data modeling for SchoolStream, improving scalability and performance.</li>
                    <li>Developed RESTful APIs and optimized PostgreSQL queries for enhanced data accessibility.</li>
                  </ul>
                </div>

                <div className="relative pl-6 border-l-2 border-gray-100">
                  <div className="absolute top-1 left-[-9px] w-4 h-4 bg-gray-300 rounded-full ring-2 ring-white" />
                  <div className="mb-1 flex flex-wrap justify-between items-start gap-2">
                    <h4 className="font-semibold text-gray-900">Machine Learning Intern</h4>
                    <span className="text-xs font-medium text-gray-400">06/2024 – 07/2024</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-3 font-medium">TechnoHacks EduTech (Remote)</p>
                  <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                    <li>Executed supervised learning tasks for classification and regression on real-world datasets.</li>
                    <li>Achieved 85%+ predictive accuracy in sample models.</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4 border-b border-gray-100 pb-2">
                    Development Journey
                  </h4>
                  <div className="space-y-4">
                    <article className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h5 className="font-semibold text-sm text-gray-900">SchoolStream — Education Management System</h5>
                      <p className="mt-1 text-xs text-gray-600">
                        A full-stack education platform for school, user, and student data management, built with role-based dashboards and reporting.
                      </p>
                    </article>

                    <article className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h5 className="font-semibold text-sm text-gray-900">Student Productivity Hub (BeNote)</h5>
                      <p className="mt-1 text-xs text-gray-600">
                        A student productivity app with notes, tasks, Pomodoro tools, and AI-assisted study features.
                        <a href="https://student-productivity-hub-mgis.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#8b5e3c] hover:underline ml-1">Live Demo</a>
                      </p>
                    </article>

                    <article className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h5 className="font-semibold text-sm text-gray-900">Faarfannaa Galata Waaqayyoo</h5>
                      <p className="mt-1 text-xs text-gray-600">
                        A digital hymn platform with offline access, search, and synchronized content across web and mobile.
                        <a href="https://faarfannaa.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#8b5e3c] hover:underline ml-1">Live Demo</a>
                      </p>
                    </article>

                    <article className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h5 className="font-semibold text-sm text-gray-900">Otech ID Generator</h5>
                      <p className="mt-1 text-xs text-gray-600">
                        A professional ID card generator with dual-sided output, barcode/QR automation, and PDF export.
                        <a href="https://otechid.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#8b5e3c] hover:underline ml-1">Live Demo</a>
                      </p>
                    </article>

                    <article className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h5 className="font-semibold text-sm text-gray-900">Benote SSO</h5>
                      <p className="mt-1 text-xs text-gray-600 space-x-2">
                        <span className="block mb-1">An auth layer for secure access across Benote services and external platforms via JWT flows.</span>
                        <a href="https://www.npmjs.com/package/@benote/sso-backend" target="_blank" rel="noopener noreferrer" className="text-[#8b5e3c] hover:underline">Backend</a>
                        <a href="https://www.npmjs.com/package/@benote/sso-frontend" target="_blank" rel="noopener noreferrer" className="text-[#8b5e3c] hover:underline">Frontend</a>
                      </p>
                    </article>

                    <article className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h5 className="font-semibold text-sm text-gray-900">PostaDesk</h5>
                      <p className="mt-1 text-xs text-gray-600">
                        A configurable PostgreSQL management and app-building tool with drag-and-drop workflows.
                      </p>
                    </article>
                  </div>
                </div>

              </div>
            </section>

            {/* Certifications */}
            <section>
              <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4 border-b border-gray-100 pb-2">
                Certifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 border-l-2 border-l-[#8b5e3c]">
                  A2SV 2024 AI for Impact Hackathon
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 border-l-2 border-l-[#8b5e3c]">
                  Intro &amp; Intermediate Machine Learning (Kaggle)
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 border-l-2 border-l-[#8b5e3c]">
                  Responsive Web Design (freeCodeCamp)
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
