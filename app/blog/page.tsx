import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { loadBlogPosts } from "../lib/content";

// CMS content lives in Supabase; always render fresh so admin edits appear immediately.
export const revalidate = 0;

const PAGE_SIZE = 6;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://latitibabu.com";
const canonicalUrl = `${siteUrl}/blog`;

export const metadata: Metadata = {
  title: "Blog — Lati Tibabu",
  description: "Notes, project updates, and design thoughts from Lati Tibabu.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog — Lati Tibabu",
    description: "Notes, project updates, and design thoughts from Lati Tibabu.",
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Lati Tibabu",
    description: "Notes, project updates, and design thoughts from Lati Tibabu.",
  },
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const formatCreatedDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const blogPosts = await loadBlogPosts();
  const { page } = await searchParams;
  const currentPage = Math.max(Number.parseInt(page ?? "1", 10) || 1, 1);
  const totalPages = Math.max(Math.ceil(blogPosts.length / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagePosts = blogPosts.slice(startIndex, startIndex + PAGE_SIZE);
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Lati Tibabu Blog",
    description: "Notes, project updates, and design thoughts from Lati Tibabu.",
    url: canonicalUrl,
    inLanguage: "en",
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <section className="px-6 pb-12 pt-20 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-[760px]">
          <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
            Portfolio · Writing
          </p>
          <h1 className="mt-4 font-heading text-[44px] tracking-[-0.04em] text-[var(--color-on-surface)] md:text-[64px]">
            Notes from the work
          </h1>
          <p className="mt-5 max-w-[640px] text-[17px] leading-[1.75] text-[var(--color-on-surface-variant)]">
            Practical notes on building products, shaping interfaces, and the
            details that make digital work feel considered.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-[980px] gap-6">
          {pagePosts.map((post) => {
            const hasCoverImage =
              !!post.coverImage?.trim() &&
              post.coverImage.trim() !== "https://placehold.co/600x400@2x.png";
            return (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_-28px_rgba(0,0,0,0.35)]"
            >
              <Link
                href={`/blog/${post.slug}`}
                className={hasCoverImage ? "grid md:grid-cols-[260px_1fr]" : "block"}
              >
                {hasCoverImage && (
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[230px]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 768px) 260px, 90vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-label text-[10px] uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]">
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                    <span
                      className="h-1 w-1 rounded-full bg-[var(--color-electric-blue)]"
                      aria-hidden="true"
                    />
                    <span className="break-words">{post.tags.join(" / ")}</span>
                  </div>
                  <h2 className="mt-4 font-heading text-[26px] leading-[1.2] tracking-[-0.025em] text-[var(--color-on-surface)] md:text-[30px]">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-[1.75] text-[var(--color-on-surface-variant)]">
                    {post.excerpt}
                  </p>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-electric-blue)]">
                    Read article →
                  </p>
                  <p className="mt-3 text-[11px] text-[var(--color-on-surface-variant)]">
                    By {post.authorName || "latitibabu"} · Created {formatCreatedDate(post.createdAt)}
                  </p>
                </div>
              </Link>
            </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mx-auto mt-10 flex max-w-[980px] flex-wrap items-center justify-center gap-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
            <Link
              href={safePage > 1 ? `/blog?page=${safePage - 1}` : "#"}
              aria-disabled={safePage <= 1}
              className={`rounded-full border px-4 py-2 transition ${
                safePage <= 1
                  ? "pointer-events-none border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] opacity-40"
                  : "border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-electric-blue)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              ← Prev
            </Link>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <Link
                  key={pageNumber}
                  href={`/blog?page=${pageNumber}`}
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
            <Link
              href={safePage < totalPages ? `/blog?page=${safePage + 1}` : "#"}
              aria-disabled={safePage >= totalPages}
              className={`rounded-full border px-4 py-2 transition ${
                safePage >= totalPages
                  ? "pointer-events-none border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] opacity-40"
                  : "border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-electric-blue)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              Next →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
