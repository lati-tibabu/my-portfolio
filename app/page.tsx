import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HandDrawnIcon from "./components/HandDrawnIcon";

export const metadata: Metadata = {
  title: "Full Stack & Odoo ERP Developer",
  description:
    "Lati Tibabu builds scalable web applications, ERP integrations, and automation tools using React, Next.js, Python, and Odoo.",
  keywords: [
    "Full Stack Developer",
    "Odoo ERP",
    "React Developer",
    "Next.js Portfolio",
    "Python Developer",
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Subtle decorative blur spots */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#f7e9dc] rounded-full blur-3xl opacity-60 -z-10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-60 -z-10 translate-x-1/2 translate-y-1/2" />

        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-semibold text-[#8b5e3c] tracking-widest uppercase mb-4 animate-fade-in-down">
              Full Stack &amp; Odoo ERP Developer
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900 animate-fade-in-down">
              Hello, I&apos;m{" "}
              <span className="text-[#8b5e3c]">Lati Tibabu</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg mb-10 mx-auto md:mx-0 animate-fade-in-right">
              Specialized in building robust, automated business solutions and
              ERP systems that scale.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 animate-fade-in-up">
              <a
                href="/LatiTibabu_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hand-drawn-border flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition shadow-sm"
              >
                <HandDrawnIcon name="download" size={20} /> Download CV
              </a>
              <a
                href="mailto:latitibabu2018@gmail.com"
                className="hand-drawn-border flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                <HandDrawnIcon name="mail" size={20} /> Get in Touch
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex-shrink-0 flex justify-center md:justify-end">
            <div className="group relative w-64 h-64 md:w-80 md:h-80">
             <Image
                src="/me4.png"
                alt="Lati Tibabu line portrait"
                fill
                sizes="(min-width: 768px) 320px, 256px"
                className="object-cover rounded-2xl opacity-100"
                priority
              />
              {/*<Image
                src="/me-line-portrait.png"
                alt="Lati Tibabu line portrait"
                fill
                sizes="(min-width: 768px) 320px, 256px"
                className="object-cover rounded-2xl transition-opacity duration-70 ease-in-out opacity-100 group-hover:opacity-0"
                priority
              />
              <Image
                src="/me-photo-portrait.jpg"
                alt="Lati Tibabu photo portrait"
                fill
                sizes="(min-width: 768px) 320px, 256px"
                className="object-cover rounded-2xl transition-opacity duration-70 ease-in-out opacity-0 group-hover:opacity-100"
                priority
              />*/}
             
            </div>
          </div>
        </div>
      </section>

      {/* ─── About ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto animate-fade-in">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
            About Me
          </h2>
          <div className="max-w-4xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed text-center">
            <p>
              I am Lati Tibabu, a Full Stack and Odoo ERP Developer based in Addis Ababa, specializing in backend development, Odoo customization, and system integration using Python and the Odoo ORM. I work on REST APIs, workflow automation, and Identity &amp; Access Management with Keycloak (OIDC, OAuth2, SSO). I hold a B.Sc. in Computer Science and Engineering from Adama Science and Technology University and focus on building scalable, maintainable ERP solutions.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Timeline ────────────────────────────────────────────── */}

      {/* ─── Skills ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto animate-fade-in">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
            My Toolkit &amp; Expertise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="hand-drawn-border flex flex-col items-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <HandDrawnIcon name="languages" size={72} className="mb-4 h-14 w-14 object-contain" />
              <h3 className="font-bold text-base mb-4 text-gray-900">Languages</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">TypeScript</span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">Java</span>
                <span className="skill-tag">SQL</span>
              </div>
            </div>

            <div className="hand-drawn-border flex flex-col items-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <HandDrawnIcon name="frontend" size={72} className="mb-4 h-14 w-14 object-contain" />
              <h3 className="font-bold text-base mb-4 text-gray-900">Frontend</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="skill-tag">React.js</span>
                <span className="skill-tag">Next.js</span>
                <span className="skill-tag">Redux Toolkit</span>
                <span className="skill-tag">Tailwind CSS</span>
                <span className="skill-tag">CSS Modules</span>
              </div>
            </div>

            <div className="hand-drawn-border flex flex-col items-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <HandDrawnIcon name="backend" size={72} className="mb-4 h-14 w-14 object-contain" />
              <h3 className="font-bold text-base mb-4 text-gray-900">Backend &amp; Odoo</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">Odoo (Python, XML, QWeb)</span>
                <span className="skill-tag">Express.js</span>
                <span className="skill-tag">Sequelize ORM</span>
                <span className="skill-tag">PostgreSQL</span>
                <span className="skill-tag">REST API</span>
              </div>
            </div>

            <div className="hand-drawn-border flex flex-col items-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <HandDrawnIcon name="tools" size={72} className="mb-4 h-14 w-14 object-contain" />
              <h3 className="font-bold text-base mb-4 text-gray-900">Tools &amp; Platforms</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="skill-tag">Git &amp; GitHub</span>
                <span className="skill-tag">Keycloak (SSO/OAuth2)</span>
                <span className="skill-tag">Flutter</span>
                <span className="skill-tag">Vercel</span>
                <span className="skill-tag">Figma</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Expertise (dark section) ─────────────────────────── */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-[1200px] mx-auto animate-fade-in-up">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center text-white">
            My Expertise
          </h2>
          <div className="flex flex-col md:flex-row gap-6">

            <div className="hand-drawn-border flex-1 bg-gray-800 border border-gray-700 rounded-xl p-8 flex flex-col items-center text-center text-gray-100 hover:bg-gray-750 transition hover:-translate-y-1">
              <HandDrawnIcon name="languages" size={84} className="mb-4 h-16 w-16 object-contain" />
              <h3 className="font-bold text-xl mb-3 text-white">Full-Stack Development</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Crafting robust, scalable, and user-centric web applications. I specialize in
                React, Node.js, and Python-based solutions.
              </p>
            </div>

            <div className="hand-drawn-border flex-1 bg-gray-800 border border-gray-700 rounded-xl p-8 flex flex-col items-center text-center text-gray-100 hover:bg-gray-750 transition hover:-translate-y-1">
              <HandDrawnIcon name="backend" size={84} className="mb-4 h-16 w-16 object-contain" />
              <h3 className="font-bold text-xl mb-3 text-white">Odoo ERP &amp; Backend</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Customizing Odoo modules, automating business workflows, and integrating systems
                via REST APIs and Keycloak IAM.
              </p>
            </div>

            <div className="hand-drawn-border flex-1 bg-gray-800 border border-gray-700 rounded-xl p-8 flex flex-col items-center text-center text-gray-100 hover:bg-gray-750 transition hover:-translate-y-1">
              <HandDrawnIcon name="tools" size={84} className="mb-4 h-16 w-16 object-contain" />
              <h3 className="font-bold text-xl mb-3 text-white">UI/UX &amp; Graphic Design</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Designing intuitive and visually captivating interfaces that prioritize user
                experience and accessibility.
              </p>
              <Link href="/projects/graphics" className="mt-5">
                <div className="flex items-center gap-2 text-[#a06a45] hover:text-[#c08a5b] text-sm font-medium group cursor-pointer">
                  See My Works
                  <HandDrawnIcon name="arrow-left" size={18} className="opacity-0 group-hover:opacity-100 transition rotate-180" />
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Contact ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white animate-fade-in">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Let&apos;s Connect!
          </h2>
          <p className="text-gray-500 mb-10 text-base max-w-lg mx-auto leading-relaxed">
            I&apos;m always open to discussing new projects, interesting ideas, or just
            having a chat about tech. Feel free to reach out!
          </p>
          <a
            href="mailto:latitibabu2018@gmail.com"
            className="hand-drawn-border inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-gray-900 text-white font-semibold text-base hover:bg-gray-700 transition shadow-sm animate-pulse-grow"
          >
            <HandDrawnIcon name="mail" size={20} /> Send Me an Email
          </a>

          <div className="flex gap-6 justify-center mt-10">
            <a
              href="https://github.com/lati-tibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="hand-drawn-border inline-flex rounded-full border border-gray-200 p-2 text-gray-400 hover:text-[#8b5e3c] text-3xl transition hover:-translate-y-1"
            >
              <HandDrawnIcon name="github" size={28} />
            </a>
            <a
              href="https://linkedin.com/in/lati-tibabu"
              target="_blank"
              rel="noopener noreferrer"
              className="hand-drawn-border inline-flex rounded-full border border-gray-200 p-2 text-gray-400 hover:text-[#8b5e3c] text-3xl transition hover:-translate-y-1"
            >
              <HandDrawnIcon name="linkedin" size={28} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
