import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HandDrawnIcon from "../../components/HandDrawnIcon";
import BlogContent from "../../components/BlogContent";
import { loadBlogPosts } from "../../lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const getReadingTime = (html: string) => {
  const wordCount = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 220));
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blogPosts = await loadBlogPosts();
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return { title: "Blog Post — Lati Tibabu" };
  }

  return {
    title: `${post.title} — Lati Tibabu`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blogPosts = await loadBlogPosts();
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    notFound();
  }

  const readingTime = getReadingTime(post.detailsHtml);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <article>
        <header className="px-6 pb-10 pt-16 md:pb-14 md:pt-24">
          <div className="mx-auto max-w-[820px]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-electric-blue)] transition hover:text-[var(--color-secondary)]"
            >
              <HandDrawnIcon name="arrow-left" size={15} />
              Back to blog
            </Link>

            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-label text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              <span
                className="h-1 w-1 rounded-full bg-[var(--color-electric-blue)]"
                aria-hidden="true"
              />
              <span>{readingTime} min read</span>
            </div>

            <h1 className="mt-5 max-w-[800px] font-heading text-[40px] leading-[1.08] tracking-[-0.045em] text-[var(--color-on-surface)] sm:text-[52px] md:text-[64px]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[720px] text-[17px] leading-[1.75] text-[var(--color-on-surface-variant)] md:text-[19px]">
              {post.excerpt}
            </p>

            {post.tags.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="px-4 sm:px-6">
          <div className="relative mx-auto aspect-[16/9] max-w-[1040px] overflow-hidden rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] shadow-[0_24px_60px_-32px_rgba(15,23,42,0.3)]">
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1100px) 1040px, 94vw"
              className="object-cover"
            />
          </div>
        </div>

        <section className="px-6 pb-20 pt-12 md:pb-28 md:pt-16">
          <div className="mx-auto max-w-[720px]">
            <BlogContent
              content={post.detailsHtml}
              format={post.contentFormat ?? "html"}
            />

            <footer className="mt-14 border-t border-[var(--color-surface-border)] pt-7">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                Thanks for reading
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-electric-blue)] transition hover:text-[var(--color-secondary)]"
              >
                <HandDrawnIcon name="arrow-left" size={16} />
                Browse more writing
              </Link>
            </footer>
          </div>
        </section>
      </article>
    </div>
  );
}
