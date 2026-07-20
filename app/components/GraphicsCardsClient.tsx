"use client";

import { useState } from "react";
import Image from "next/image";
import DialogModal from "./DialogModal";
import type { GraphicItem } from "../data/cms";

type GraphicsCardsClientProps = {
  items: GraphicItem[];
};

export default function GraphicsCardsClient({ items }: GraphicsCardsClientProps) {
  const [selected, setSelected] = useState<GraphicItem | null>(null);

  const blockDownloadActions = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="max-w-[1100px] mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.slug}
            className="overflow-hidden rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05)]"
          >
            <button
              type="button"
              className="group relative block aspect-[4/3] w-full"
              onClick={() => setSelected(item)}
              onContextMenu={blockDownloadActions}
              aria-label={`Preview ${item.title}`}
            >
              <Image
                src={item.image?.trim() || "https://placehold.co/600x400@2x.png"}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                className="object-cover grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0"
                draggable={false}
                onContextMenu={blockDownloadActions}
                onDragStart={blockDownloadActions}
              />
            </button>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] text-[var(--color-electric-blue)]">
                <span>{item.category}</span>
                <span>{item.publishedAt}</span>
              </div>
              <h2 className="font-heading text-[22px] text-[var(--color-on-surface)]">
                {item.title}
              </h2>
              <p className="text-[14px] leading-[1.7] text-[var(--color-on-surface-variant)]">
                {item.description}
              </p>
              <p className="text-[11px] text-[var(--color-on-surface-variant)]">
                By {item.authorName || "latitibabu"}
                {item.createdAt ? ` · Created ${new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
              </p>
            </div>
          </article>
        ))}
      </div>

      <DialogModal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3">
            <Image
              src={selected.image?.trim() || "https://placehold.co/600x400@2x.png"}
              alt={selected.title}
              width={1400}
              height={1000}
              className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain"
              draggable={false}
              onContextMenu={blockDownloadActions}
              onDragStart={blockDownloadActions}
            />
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Preview only.
            </p>
          </div>
        )}
      </DialogModal>
    </>
  );
}
