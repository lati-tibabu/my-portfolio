import CollectionEmptyState from "../components/CollectionEmptyState";
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
      <section className="editorial-intro">
        <div className="mx-auto max-w-[1120px]">
          <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
            Portfolio · Writing
          </p>
          <h1 className="editorial-title">
            Notes from the work
          </h1>
          <p className="mt-5 max-w-[640px] text-[17px] leading-[1.75] text-[var(--color-on-surface-variant)]">
            Practical notes on building products, shaping interfaces, and the
            details that make digital work feel considered.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 pt-10">
        <div className="mx-auto mb-8 flex max-w-[1120px] items-center justify-between gap-4 border-b border-[var(--color-surface-border)] pb-5">
          <h2 className="section-kicker">The journal</h2>
          <span className="text-xs text-[var(--color-on-surface-variant)]">{blogPosts.length} {blogPosts.length === 1 ? "article" : "articles"}</span>
        </div>
        {blogPosts.length === 0 && <CollectionEmptyState title="New notes are on the way" description="Check back for articles on Odoo, web development, and the details behind the work." />}
        <div className="mx-auto grid max-w-[1120px] gap-6 md:grid-cols-2">
          {pagePosts.map((post) => {
            const hasCoverImage =
              !!post.coverImage?.trim() &&
              post.coverImage.trim() !== "https://placehold.co/600x400@2x.png";
            return (
            <article
              key={post.slug}
              className="writing-card group"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="flex h-full flex-col"
              >
                {hasCoverImage && (
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-[var(--color-surface-border)]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1200px) 548px, (min-width: 768px) 46vw, 90vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6 md:p-8">
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
                  <div className="mt-auto flex items-center justify-between gap-4 pt-8 text-xs">
                    <span className="text-[var(--color-on-surface-variant)]">By {post.authorName || "Lati Tibabu"}</span>
                    <span className="shrink-0 font-medium">Read article <span aria-hidden="true">↗</span></span>
                  </div>
                </div>
              </Link>
            </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <nav aria-label="Article pages" className="mx-auto mt-10 flex max-w-[1120px] flex-wrap items-center justify-center gap-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
            <Link
              href={safePage > 1 ? `/blog?page=${safePage - 1}` : "#"}
              aria-disabled={safePage <= 1}
              tabIndex={safePage <= 1 ? -1 : undefined}
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
                  aria-current={pageNumber === safePage ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 transition ${
                    pageNumber === safePage
                      ? "border-[var(--color-electric-blue)] bg-[var(--color-on-surface)] text-[var(--color-background)]"
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
              tabIndex={safePage >= totalPages ? -1 : undefined}
              className={`rounded-full border px-4 py-2 transition ${
                safePage >= totalPages
                  ? "pointer-events-none border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] opacity-40"
                  : "border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-electric-blue)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              Next →
            </Link>
          </nav>
        )}
      </section>
    </div>
  );
}
