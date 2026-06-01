import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { loadBlogPosts } from "../lib/content";

export const metadata: Metadata = {
  title: "Blog — Lati Tibabu",
  description: "Notes, project updates, and design thoughts from Lati Tibabu.",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

export default async function BlogPage() {
  const blogPosts = await loadBlogPosts();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
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
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_-28px_rgba(15,23,42,0.35)]"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="grid md:grid-cols-[260px_1fr]"
              >
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[230px]">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 260px, 90vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-label text-[10px] uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]">
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                    <span
                      className="h-1 w-1 rounded-full bg-[var(--color-electric-blue)]"
                      aria-hidden="true"
                    />
                    <span>{post.tags.join(" / ")}</span>
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
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
