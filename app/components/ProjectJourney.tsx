"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { DevJourneyItem } from "../data/cms";

export default function ProjectJourney({ projects }: { projects: DevJourneyItem[] }) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const root = section.current;
    if (!root || projects.length === 0) return;
    const media = window.matchMedia("(min-width: 768px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!media.matches) return;
      const distance = root.getBoundingClientRect().height - (window.innerHeight - 80);
      const progress = Math.max(0, Math.min(1, (80 - root.getBoundingClientRect().top) / Math.max(1, distance)));
      const rawPosition = progress * Math.max(0, projects.length - 1);
      const step = Math.floor(rawPosition);
      // Hold each project still briefly before crossfading to the next.
      const transition = Math.max(0, Math.min(1, (rawPosition - step - 0.1) / 0.8));
      const position = step + transition;
      setActive(Math.round(position));
      root.style.setProperty("--journey-progress", String(progress));
      root.querySelectorAll<HTMLElement>(".journey-slide").forEach((slide, index) => {
        const offset = index - position;
        const visibility = Math.max(0, 1 - Math.abs(offset));
        slide.style.opacity = String(visibility);
        slide.style.transform = `translateY(${offset * 65}px) scale(${1 - Math.min(Math.abs(offset), 1) * 0.06})`;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const configure = () => {
      setPinned(media.matches);
      root.dataset.pinned = String(media.matches);
      if (!media.matches) root.querySelectorAll<HTMLElement>(".journey-slide").forEach(slide => { slide.style.opacity = ""; slide.style.transform = ""; });
      schedule();
    };
    configure();
    media.addEventListener("change", configure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", configure);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [projects.length]);

  const goToProject = (index: number) => {
    const root = section.current;
    if (!root) return;
    const distance = root.getBoundingClientRect().height - (window.innerHeight - 80);
    window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top - 80 + distance * index / Math.max(1, projects.length - 1), behavior: "smooth" });
  };

  if (!projects.length) return null;

  return (
    <section id="work" ref={section} className="journey-section" aria-label="Project journey" style={{ "--project-count": projects.length } as CSSProperties}>
      <div className="journey-stage">
        <div className="journey-topline"><p className="section-kicker">03 / Project journey</p><Link href="/marketplace">Explore digital products ↗</Link></div>
        <div className="journey-slides">
          {projects.map((project, index) => (
            <article key={project.id ?? project.title} className="journey-slide" inert={pinned && active !== index} aria-hidden={pinned && active !== index ? true : undefined}>
              <div className="journey-art" aria-hidden="true"><div className="journey-orbit" /><div className="journey-orbit journey-orbit-inner" /><span>{String(index + 1).padStart(2, "0")}</span><p>IDEA → SYSTEM → IMPACT</p></div>
              <div className="journey-copy"><p className="section-kicker">Selected work / {String(index + 1).padStart(2, "0")}</p><h2>{project.title}</h2><p className="journey-description">{project.description}</p><div className="mt-7 flex flex-wrap gap-5">{project.links.map(link => <a className="project-link" key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label || "View project"} ↗<span className="sr-only"> (opens in a new tab)</span></a>)}</div></div>
            </article>
          ))}
        </div>
        <div className="journey-bottomline"><span className="section-kicker">One build. A new possibility.</span><div className="journey-progress" aria-hidden="true"><span /></div><div className="journey-controls">{pinned && <button type="button" aria-label="Previous project" disabled={active === 0} onClick={() => goToProject(active - 1)}>←</button>}<span className="font-mono text-xs">{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>{pinned && <button type="button" aria-label="Next project" disabled={active === projects.length - 1} onClick={() => goToProject(active + 1)}>→</button>}</div></div>
      </div>
    </section>
  );
}
