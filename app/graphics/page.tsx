import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HandDrawnIcon from "../components/HandDrawnIcon";
import { loadGraphicsItems } from "../lib/content";

const PAGE_SIZE = 6;

export const metadata: Metadata = {
  title: "Graphics — Lati Tibabu",
  description:
    "A selection of posters, event banners, and brand visuals by Lati Tibabu.",
};

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function GraphicsPage({ searchParams }: PageProps) {
  const graphicsItems = await loadGraphicsItems();
  const { page } = await searchParams;
  const currentPage = Math.max(Number.parseInt(page ?? "1", 10) || 1, 1);
  const totalPages = Math.max(Math.ceil(graphicsItems.length / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageItems = graphicsItems.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <section className="px-6 pt-24 pb-12">
        <div className="max-w-[1100px] mx-auto space-y-4 text-center">
          <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
            Portfolio · Creative
          </p>
          <h1 className="font-heading text-[36px] md:text-[52px] text-[var(--color-on-surface)]">
            Graphics work
          </h1>
          <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[640px] mx-auto">
            A curated gallery of event banners, posters, and brand visuals
            designed for community initiatives.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-electric-blue)]"
          >
            <HandDrawnIcon name="arrow-left" size={16} /> Back to home
          </Link>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-[1100px] mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((item) => (
            <article
              key={item.slug}
              className="overflow-hidden rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] shadow-[0_20px_25px_-5px_rgba(15,23,42,0.05)]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
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
              </div>
            </article>
          ))}
        </div>

        <div className="max-w-[1100px] mx-auto mt-10 flex flex-wrap items-center justify-center gap-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Link
                key={pageNumber}
                href={`/graphics?page=${pageNumber}`}
                className={`rounded-full border px-4 py-2 transition ${
                  pageNumber === safePage
                    ? "border-[var(--color-electric-blue)] bg-[var(--color-electric-blue)] text-white"
                    : "border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-electric-blue)] hover:text-[var(--color-on-surface)]"
                }`}
              >
                {pageNumber}
              </Link>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
