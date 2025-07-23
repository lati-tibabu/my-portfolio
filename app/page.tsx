"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMail,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiCode,
  FiPenTool,
  FiTerminal,
  FiTool,
  FiArrowRight,
} from "react-icons/fi";

export default function Home() {
  return (
    <div className="bg-white min-h-screen max-w-[1200px] mx-auto px-6 py-10 font-sans text-gray-800 relative overflow-hidden">
      {/* Background shape/gradient for subtle visual interest */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-500/5 opacity-50 blur-3xl rounded-b-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-blue-500/5 opacity-50 blur-3xl rounded-t-full -z-10"></div>

      {/* Hero */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight animate-fade-in-down">
            Hello, I&apos;m <span className="text-blue-600">Lati Tibabu</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-6 animate-fade-in-right">
            I’m learning to build things, one{" "}
            <span className="font-semibold text-blue-600">full-stack project</span> at a time.
          </h2>
          <div className="flex justify-center md:justify-start gap-4 mt-8 animate-fade-in-up">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
              onClick={() => window.open("/LatiTibabu_CV.pdf", "_blank")}
            >
              <FiDownload /> Download CV
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition transform hover:scale-105"
              onClick={() => window.open("mailto:latitibabu2018@gmail.com")}
            >
              <FiMail /> Get in Touch
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <Image
            src="/me3.png"
            alt="Lati Tibabu"
            width={384}
            height={384}
            className="bg-blue-500/10 w-80 h-80 md:w-96 md:h-96 object-cover rounded-full shadow-xl grayscale hover:grayscale-0 transition-all duration-500 transform hover:scale-105"
            priority
          />
        </div>
      </div>

      {/* About Me - More refined and possibly with a subtle graphic */}
      <section className="mb-20 animate-fade-in">
        <h2 className="text-4xl font-bold mb-12 text-center text-blue-800">My Journey So Far</h2>
        <div className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed text-center">
          <p className="mb-4">
            My name is <strong className="text-blue-600">Lati Tibabu</strong>. As a Computer Science and Engineering graduate based in Addis Ababa, my passion lies in bringing ideas to life through code.
          </p>
          <p className="mb-4">
            I&apos;ve primarily focused on the <strong>backend</strong>, designing robust APIs, optimizing databases, and ensuring seamless communication between system components. However, my journey is constantly evolving as I embrace the frontend, aiming to become a truly <strong>full-stack developer</strong>, one project at a time.
          </p>
          <p>
            I&apos;m driven by a simple philosophy: <strong>build things that work, and learn relentlessly through the process.</strong> Whether it&apos;s architecting systems for student productivity or contributing to internal tools, I&apos;m always asking: &quot;How can this be simpler? How can it be clearer?&quot; This portfolio is a reflection of that continuous cycle of building, debugging, and growing.
          </p>
        </div>
      </section>

      {/* Timeline Section for Projects & Experience */}
      <section className="mb-20 relative animate-fade-in-up">
        <h2 className="text-4xl font-bold mb-12 text-center text-blue-800">My Development Journey</h2>
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full rounded-full hidden md:block"></div>

          {/* Timeline Items */}
          <div className="space-y-16">
            {/* SchoolStream EMS Project */}
            <div className="flex flex-col md:flex-row items-center md:justify-between w-full relative">
              <div className="md:w-5/12 bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 md:order-1 animate-slide-in-left">
                <img
                  src="/schoolstream.png"
                  alt="SchoolStream EMS"
                  className="w-full h-56 object-cover rounded-lg mb-6 shadow-md"
                />
                <h3 className="font-bold text-2xl mb-3 text-blue-700">SchoolStream - Education Management System</h3>
                <p className="text-gray-600 mb-3 text-lg">
                  <strong>Status:</strong>{" "}
                  <span className="text-yellow-700 font-semibold">Partially Implemented</span> (Active Development)
                </p>
                <p className="text-gray-700 mb-4">
                  A comprehensive full-stack platform designed to revolutionize school, user, and student data management. Features include multi-role dashboards and robust analytics.
                </p>
                <details className="mb-2 text-gray-700">
                  <summary className="cursor-pointer text-blue-600 font-medium hover:underline">View Details</summary>
                  <div className="mt-4 text-sm space-y-2">
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Frontend:</strong> React.js, secure multi-role dashboards (Admin, Principal, Teacher), modern UI/UX.
                      </li>
                      <li>
                        <strong>Backend:</strong> Node.js, Express.js, MySQL, meticulously crafted RESTful APIs.
                      </li>
                      <li>
                        <strong>Key Features:</strong> School registration, user authentication, role-based access, student information management, insightful dashboard analytics.
                      </li>
                      <li>
                        <strong>Assessment:</strong> A substantial enterprise-grade application with a solid architectural foundation, demonstrating professional code organization and UI design, envisioned as a commercial SaaS product.
                      </li>
                    </ul>
                  </div>
                </details>
              </div>
              {/* Timeline dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 bg-blue-600 w-6 h-6 rounded-full shadow-lg z-10 animate-pulse-once"></div>
              <div className="md:w-5/12 md:order-2"></div> {/* Spacer */}
            </div>

            {/* Student Productivity Hub Project */}
            <div className="flex flex-col md:flex-row-reverse items-center md:justify-between w-full relative">
              <div className="md:w-5/12 bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 md:order-1 animate-slide-in-right">
                <img
                  src="sph.png"
                  alt="Student Productivity Hub"
                  className="w-full h-56 object-cover rounded-lg mb-6 shadow-md"
                />
                <h3 className="font-bold text-2xl mb-3 text-blue-700">Student Productivity Hub</h3>
                <p className="text-gray-600 mb-3 text-lg">
                  <strong>Live Demo:</strong>{" "}
                  <a
                    href="https://student-productivity-hub-mgis.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-700"
                  >
                    student-productivity-hub-mgis.vercel.app
                  </a>
                </p>
                <p className="text-gray-700 mb-4">
                  A dynamic productivity platform tailored for students, featuring robust workspace management, seamless team collaboration, and cutting-edge AI-powered study tools.
                </p>
                <details className="mb-2 text-gray-700">
                  <summary className="cursor-pointer text-blue-600 font-medium hover:underline">View Details</summary>
                  <div className="mt-4 text-sm space-y-2">
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Workspace Management:</strong> Individual & team workspaces, comprehensive note-taking, task management, study plans, and interactive roadmaps.
                      </li>
                      <li>
                        <strong>AI Integration:</strong> Leveraging Google Gemini AI for smart summaries, automated note generation, conversational chat, and personalized productivity recommendations.
                      </li>
                      <li>
                        <strong>Tech Stack:</strong> React 18, Redux Toolkit, Tailwind CSS, Node.js, Express, Sequelize ORM, PostgreSQL. Deployed with Vite and Vercel.
                      </li>
                      <li>
                        <strong>Notable Features:</strong> Real-time markdown editor (with LaTeX support), PDF export, dynamic notifications, and AI-generated study roadmaps.
                      </li>
                    </ul>
                  </div>
                </details>
              </div>
              {/* Timeline dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 bg-blue-600 w-6 h-6 rounded-full shadow-lg z-10 animate-pulse-once"></div>
              <div className="md:w-5/12 md:order-2"></div> {/* Spacer */}
            </div>

            {/* Experience - Software Development Intern */}
            <div className="flex flex-col md:flex-row items-center md:justify-between w-full relative">
              <div className="md:w-5/12 bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 md:order-1 animate-slide-in-left">
                <h3 className="font-bold text-2xl mb-3 text-blue-700">Software Development Intern</h3>
                <p className="text-gray-600 mb-2">Ministry of Innovation and Technology, Ethiopia</p>
                <p className="text-sm text-gray-500 mb-4">Jul 2024 – Oct 2024, Addis Ababa</p>
                <p className="text-gray-700">
                  Co-led backend design for the **SchoolStream** project, spearheading the development of robust RESTful APIs and optimizing PostgreSQL queries for enhanced performance.
                </p>
              </div>
              {/* Timeline dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 bg-blue-600 w-6 h-6 rounded-full shadow-lg z-10 animate-pulse-once"></div>
              <div className="md:w-5/12 md:order-2"></div> {/* Spacer */}
            </div>

            {/* Experience - Machine Learning Intern */}
            <div className="flex flex-col md:flex-row-reverse items-center md:justify-between w-full relative">
              <div className="md:w-5/12 bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 md:order-1 animate-slide-in-right">
                <h3 className="font-bold text-2xl mb-3 text-blue-700">Machine Learning Intern</h3>
                <p className="text-gray-600 mb-2">TechnoHacks EduTech</p>
                <p className="text-sm text-gray-500 mb-4">Jun 2024 – Jul 2024, Remote (India)</p>
                <p className="text-gray-700">
                  Applied supervised learning techniques for comprehensive data analysis and predictive modeling, gaining practical experience in machine learning workflows.
                </p>
              </div>
              {/* Timeline dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 bg-blue-600 w-6 h-6 rounded-full shadow-lg z-10 animate-pulse-once"></div>
              <div className="md:w-5/12 md:order-2"></div> {/* Spacer */}
            </div>

            {/* Experience - Software Engineering Intern (2023) */}
            <div className="flex flex-col md:flex-row items-center md:justify-between w-full relative">
              <div className="md:w-5/12 bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 md:order-1 animate-slide-in-left">
                <h3 className="font-bold text-2xl mb-3 text-blue-700">Software Engineering Intern</h3>
                <p className="text-gray-600 mb-2">Ministry of Innovation and Technology, Ethiopia</p>
                <p className="text-sm text-gray-500 mb-4">Jul 2023 – Oct 2023, Addis Ababa</p>
                <p className="text-gray-700">
                  Developed a company website with a custom CMS, and actively contributed to building robust solutions within an Agile development environment.
                </p>
              </div>
              {/* Timeline dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 bg-blue-600 w-6 h-6 rounded-full shadow-lg z-10 animate-pulse-once"></div>
              <div className="md:w-5/12 md:order-2"></div> {/* Spacer */}
            </div>

            {/* Education Entry */}
            <div className="flex flex-col md:flex-row-reverse items-center md:justify-between w-full relative">
              <div className="md:w-5/12 bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 md:order-1 animate-slide-in-right">
                <h3 className="font-bold text-2xl mb-3 text-blue-700">B.Sc. Computer Science & Engineering</h3>
                <p className="text-gray-600 mb-2">Adama Science and Technology University</p>
                <p className="text-sm text-gray-500 mb-4">2021 – 2025, Adama</p>
                <p className="text-gray-700">
                  Graduated with a <strong>Great Distinction</strong>.
                </p>
              </div>
              {/* Timeline dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 bg-blue-600 w-6 h-6 rounded-full shadow-lg z-10 animate-pulse-once"></div>
              <div className="md:w-5/12 md:order-2"></div> {/* Spacer */}
            </div>

            {/* Experience - Software Engineering Intern (2023) */}
            <div className="flex flex-col md:flex-row items-center md:justify-between w-full relative">
              <p>
                More experiences and projects are on the way! Stay tuned for updates.
              </p>
              {/* Timeline dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 bg-blue-600 w-6 h-6 rounded-full shadow-lg z-10 animate-pulse-once"></div>
              <div className="md:w-5/12 md:order-2"></div> {/* Spacer */}
            </div>
          </div>
        </div>
      </section>

      {/* Skills - More visual and interactive */}
      <section className="mb-20 animate-fade-in">
        <h2 className="text-4xl font-bold mb-12 text-center text-blue-800">My Toolkit & Expertise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Skill Category Card: Languages */}
          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <FiCode className="text-5xl text-blue-600 mb-4" />
            <h3 className="font-bold text-xl mb-4 text-blue-700">Languages</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">TypeScript</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">Java</span>
              <span className="skill-tag">SQL</span>
            </div>
          </div>
          {/* Skill Category Card: Frontend */}
          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <FiTerminal className="text-5xl text-blue-600 mb-4" />
            <h3 className="font-bold text-xl mb-4 text-blue-700">Frontend</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="skill-tag">React.js</span>
              <span className="skill-tag">Next.js</span>
              <span className="skill-tag">Redux Toolkit</span>
              <span className="skill-tag">Tailwind CSS</span>
              <span className="skill-tag">CSS Modules</span>
            </div>
          </div>
          {/* Skill Category Card: Backend */}
          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <FiTool className="text-5xl text-blue-600 mb-4" />
            <h3 className="font-bold text-xl mb-4 text-blue-700">Backend</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Express.js</span>
              <span className="skill-tag">Sequelize ORM</span>
              <span className="skill-tag">PostgreSQL</span>
              <span className="skill-tag">MySQL</span>
              <span className="skill-tag">REST API</span>
            </div>
          </div>
          {/* Skill Category Card: Tools & Platforms */}
          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <FiPenTool className="text-5xl text-blue-600 mb-4" />
            <h3 className="font-bold text-xl mb-4 text-blue-700">Tools & Platforms</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="skill-tag">Git & GitHub</span>
              {/* <span className="skill-tag">Docker</span> */}
              <span className="skill-tag">Vercel</span>
              <span className="skill-tag">Google Gemini AI API</span>
              <span className="skill-tag">Figma</span>
            </div>
          </div>
        </div>
      </section>

      {/* What I Do - Rephrased for impact, potentially with more visual flair */}
      <section className="mb-20 animate-fade-in-up">
        <h2 className="text-4xl font-bold mb-12 text-center text-blue-800">My Creative Offerings</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:scale-105 flex flex-col items-center text-center">
            <FiCode className="text-6xl text-blue-700 mb-4 animate-bounce-subtle" />
            <h3 className="font-bold text-2xl mb-3 text-blue-800">Full-Stack Web Development</h3>
            <p className="text-gray-700">
              Crafting robust, scalable, and user-centric web applications from concept to deployment. I specialize in bringing intricate ideas to life with clean code and modern frameworks.
            </p>
          </div>
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:scale-105 flex flex-col items-center text-center">
            <FiPenTool className="text-6xl text-blue-700 mb-4 animate-bounce-subtle" />
            <h3 className="font-bold text-2xl mb-3 text-blue-800">Compelling UI/UX & Graphic Design</h3>
            <p className="text-gray-700">
              Designing intuitive and visually captivating interfaces that prioritize user experience. My focus is on creating beautiful designs that are also highly functional and accessible.
            </p>

            <Link href="/projects/graphics" className="mt-4">
            <div className="flex items-center gap-2 p-3 group hover:underline cursor-pointer">
              
              See My Works
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform">
                <FiArrowRight />
              </div>
            </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="pb-10 animate-fade-in">
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-800">Let&apos;s Connect!</h2>
        <p className="text-center text-gray-700 mb-8 text-lg max-w-2xl mx-auto">
          I&apos;m always open to discussing new projects, interesting ideas, or just having a chat about tech. Feel free to reach out!
        </p>
        <div className="flex justify-center">
          <button
            type="button"
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-xl hover:bg-blue-700 transition transform hover:scale-105 animate-pulse-grow"
            onClick={() => window.open("mailto:latitibabu2018@gmail.com")}
          >
            <FiMail className="text-2xl" /> Send Me an Email
          </button>
        </div>
        {/* Social media links */}
        <div className="flex gap-6 justify-center mt-8">
          <a
            href="https://github.com/lati-tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 text-4xl transition transform hover:-translate-y-1"
          >
            <FiGithub />
          </a>
          <a
            href="https://linkedin.com/in/lati-tibabu" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 text-4xl transition transform hover:-translate-y-1"
          >
            <FiLinkedin />
          </a>
        </div>
      </section>
    </div>
  );
}