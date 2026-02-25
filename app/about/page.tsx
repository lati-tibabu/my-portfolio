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
    <div className="bg-white min-h-screen max-w-[1000px] mx-auto px-6 py-10 font-sans text-gray-800">
      {/* Header / Intro */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b pb-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-800 uppercase">LATI TIBABU GAMACHU</h1>
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">Full Stack & Odoo ERP Developer</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 mb-8">
            <span className="flex items-center gap-2"><FiMail className="text-blue-600" /> latitibabu2018@gmail.com</span>
            <span className="flex items-center gap-2"><FiPhone className="text-blue-600" /> 0979586697</span>
            <span className="flex items-center gap-2"><FiMapPin className="text-blue-600" /> Addis Ababa, Ethiopia</span>
          </div>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://linkedin.com/in/lati-tibabu" target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"><FiLinkedin size={20} /></a>
            <a href="https://github.com/lati-tibabu" target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"><FiGithub size={20} /></a>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => window.open("/LatiTibabu_CV.pdf", "_blank")}
            >
              <FiDownload /> Resume PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-12">
          {/* Skills */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3 uppercase">Technical Skills</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-sm mb-2 text-gray-500 uppercase">Programming</p>
                <div className="flex flex-wrap gap-2">
                  {["Node.js", "JavaScript", "Python", "Java", "React.js", "Next.js", "Flutter"].map(s => (
                    <span key={s} className="px-2 py-1 bg-gray-100 text-xs rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2 text-gray-500 uppercase">ERP & Backend</p>
                <div className="flex flex-wrap gap-2">
                  {["Odoo ORM", "XML/QWeb", "PostgreSQL", "REST APIs", "Keycloak", "OAuth2"].map(s => (
                    <span key={s} className="px-2 py-1 bg-gray-100 text-xs rounded">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3 uppercase">Education</h3>
            <div className="space-y-4">
              <div>
                <p className="font-bold">B.Sc. in Computer Science and Engineering</p>
                <p className="text-sm text-gray-600 italic">Adama Science and Technology University</p>
                <p className="text-xs text-blue-600 font-semibold mt-1">2021 – 2025 | CGPA: 3.72/4.0</p>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3 uppercase">Languages</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Afan Oromo:</strong> Native</p>
              <p><strong>English:</strong> Proficient</p>
              <p><strong>Amharic:</strong> Basic</p>
            </div>
          </section>
        </div>

        {/* Experience & Summary */}
        <div className="md:col-span-2 space-y-12">
          {/* Profile Summary */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3 uppercase">Profile</h3>
            <p className="text-gray-700 leading-relaxed">
              Full Stack Developer and Odoo ERP Developer with practical experience in Odoo customization, module development, and ERP implementation. Expert in Python, PostgreSQL, Odoo ORM, XML views, and workflow automation. Focused on delivering maintainable systems across the software development lifecycle.
            </p>
          </section>

          {/* Professional Experience */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3 uppercase">Experience</h3>
            <div className="space-y-8">
              <div className="relative pl-6 border-l-2 border-gray-100">
                <div className="absolute top-0 left-[-9px] w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="mb-1 flex justify-between items-start">
                  <h4 className="font-bold text-lg">Full Stack / Odoo ERP Developer</h4>
                  <span className="text-xs font-semibold text-blue-600">08/2025 – Present</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 font-medium">OTech Engineering and Technology Solutions</p>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                  <li>Implemented and deployed 3+ custom Odoo modules for HR, Planning, and Inventory workflows.</li>
                  <li>In charge of system integrations and REST APIs using Keycloak-based Identity Management (OIDC/OAuth2).</li>
                  <li>Spearheaded requirements analysis and maintenance within a collaborative ERP development team.</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l-2 border-gray-100">
                <div className="absolute top-0 left-[-9px] w-4 h-4 bg-blue-200 rounded-full"></div>
                <div className="mb-1 flex justify-between items-start">
                  <h4 className="font-bold text-lg">Software Development Intern</h4>
                  <span className="text-xs font-semibold text-gray-500">07/2024 – 10/2024</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 font-medium">Ministry of Innovation and Technology, Ethiopia</p>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                  <li>Co-led backend design and data modeling for SchoolStream, improving scalability and performance.</li>
                  <li>Developed RESTful APIs and optimized PostgreSQL queries for enhanced data accessibility.</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l-2 border-gray-100">
                <div className="absolute top-0 left-[-9px] w-4 h-4 bg-blue-200 rounded-full"></div>
                <div className="mb-1 flex justify-between items-start">
                  <h4 className="font-bold text-lg">Machine Learning Intern</h4>
                  <span className="text-xs font-semibold text-gray-500">06/2024 – 07/2024</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 font-medium">TechnoHacks EduTech (Remote)</p>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                  <li>Executed supervised learning tasks for classification and regression on real-world datasets.</li>
                  <li>Achieved 85%+ predictive accuracy in sample models.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Certifications */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3 uppercase">Certifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="p-3 bg-gray-50 rounded border-l-2 border-blue-400">
                A2SV 2024 AI for Impact Hackathon
              </div>
              <div className="p-3 bg-gray-50 rounded border-l-2 border-blue-400">
                Intro & Intermediate Machine Learning (Kaggle)
              </div>
              <div className="p-3 bg-gray-50 rounded border-l-2 border-blue-400">
                Responsive Web Design (freeCodeCamp)
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

