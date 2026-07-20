"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MarkdownText from "./MarkdownText";
import type { Testimonial } from "../data/cms";

type TestimonialsMarqueeProps = {
  items: Testimonial[];
};

export default function TestimonialsMarquee({ items }: TestimonialsMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) {
      return;
    }

    // The track holds the items twice; measure the first half against the viewport.
    const measure = () => {
      const halfWidth = track.scrollWidth / 2;
      setAnimate(halfWidth > viewport.clientWidth + 1);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(track);
    return () => ro.disconnect();
  }, [items]);

  if (!items.length) {
    return null;
  }

  const cards = [...items, ...items];

  const Card = ({ item }: { item: Testimonial }) => (
    <article className="flex w-[320px] shrink-0 snap-start flex-col gap-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3">
        {item.photo ? (
          <Image
            src={item.photo}
            alt={item.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border border-[var(--color-surface-border)] object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] text-sm font-semibold text-[var(--color-on-surface-variant)]">
            {item.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-on-surface)]">
            {item.name}
          </p>
          {item.role ? (
            <p className="truncate text-[11px] uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
              {item.role}
            </p>
          ) : null}
        </div>
      </div>
      <MarkdownText
        content={item.quoteMd}
        className="text-[13px] leading-[1.6] text-[var(--color-on-surface-variant)]"
      />
    </article>
  );

  return (
    <div
      ref={viewportRef}
      className="testimonials-marquee overflow-hidden"
    >
      <div
        ref={trackRef}
        className={`flex w-max gap-6 ${animate ? "testimonials-track--animated" : "justify-center"}`}
      >
        {cards.map((item, index) => (
          <Card key={`${item.id ?? item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}