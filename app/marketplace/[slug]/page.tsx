import type { Metadata } from "next";
import ProductImage from "../../components/ProductImage";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCheck,
  FiBox,
  FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichHtml from "../../components/RichHtml";
import { loadMarketplaceItems } from "../../lib/content";

// CMS content lives in Supabase; always render fresh so admin edits appear immediately.
export const revalidate = 0;

type PageProps = {
  params: Promise<{ slug: string }>;
};
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://latitibabu.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const marketplaceItems = await loadMarketplaceItems();
  const item = marketplaceItems.find((entry) => entry.slug === slug);

  if (!item) {
    return { title: "Product — Lati Tibabu" };
  }

  return {
    title: `${item.name} — Lati Tibabu`,
    description: item.description,
    alternates: {
      canonical: `/marketplace/${item.slug}`,
    },
    openGraph: {
      title: item.name,
      description: item.description,
      url: `/marketplace/${item.slug}`,
      type: "website",
      images: item.coverImage ? [{ url: item.coverImage, alt: item.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: item.name,
      description: item.description,
      images: item.coverImage ? [item.coverImage] : [],
    },
  };
}

export default async function MarketplaceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const marketplaceItems = await loadMarketplaceItems();
  const item = marketplaceItems.find((entry) => entry.slug === slug);

  if (!item) {
    notFound();
  }
  const productUrl = `${siteUrl}/marketplace/${item.slug}`;
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    image: item.coverImage ? [item.coverImage] : undefined,
    category: item.category,
    sku: item.technicalName,
    brand: {
      "@type": "Brand",
      name: item.authorName || "Lati Tibabu",
    },
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: item.link,
      priceCurrency: "USD",
      price:
        item.price === "Free" ? "0" : item.price.replace(/[^0-9.]/g, "") || "0",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="product-space min-h-screen bg-[var(--color-background)] px-5 py-10 text-[var(--color-on-surface)] sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/marketplace"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]"
        >
          <FiArrowLeft aria-hidden /> All products
        </Link>
        <header className="mb-8 max-w-3xl">
          <p className="product-eyebrow">
            <FiBox aria-hidden />
            {item.category}
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight tracking-tight sm:text-5xl">
            {item.name}
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--color-on-surface-variant)]">
            {item.description}
          </p>
          <p className="mt-4 text-xs text-[var(--color-on-surface-variant)]">
            Made by {item.authorName || "Lati Tibabu"}
            {item.version ? ` · Version ${item.version}` : ""}
          </p>
        </header>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="order-2 min-w-0 space-y-8 lg:order-1">
            <div className="product-image rounded-2xl border border-[var(--color-surface-border)]">
              <ProductImage
                src={item.coverImage}
                name={item.name}
                sizes="(min-width: 1024px) 760px, 90vw"
              />
            </div>
            {!!item.highlights?.length && (
              <section className="product-panel">
                <h2 className="font-heading text-xl">
                  Built to make a difference
                </h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {item.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm leading-6"
                    >
                      <FiCheck
                        className="mt-1 shrink-0 text-[var(--color-success-teal)]"
                        aria-hidden
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {item.detailsHtml && (
              <section className="product-panel">
                <h2 className="mb-6 font-heading text-2xl">A closer look</h2>
                <RichHtml html={item.detailsHtml} />
              </section>
            )}
            {!!item.screenshots?.length && (
              <section>
                <h2 className="mb-5 font-heading text-2xl">
                  Inside the product
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {item.screenshots.map((src, index) => (
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={`${src}-${index}`}
                      className="product-image block rounded-xl border border-[var(--color-surface-border)]"
                      aria-label={`Open ${item.name} screenshot ${index + 1}`}
                    >
                      <ProductImage
                        src={src}
                        name={`${item.name} screenshot ${index + 1}`}
                      />
                      <span className="absolute bottom-3 right-3 rounded-full bg-[var(--studio-card)] p-2">
                        <FiExternalLink size={14} aria-hidden />
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
          <aside className="product-panel order-1 space-y-6 lg:order-2 lg:sticky lg:top-28">
            <div>
              <p className="product-eyebrow">Make it yours</p>
              <p className="mt-3 font-heading text-4xl">{item.price}</p>
              <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
                {item.license || "View licensing on the product website"}
              </p>
            </div>
            <div className="space-y-3">
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="studio-primary flex items-center justify-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold"
                >
                  {item.price.toLowerCase() === "free"
                    ? "Get it for free"
                    : "Get product"}
                  <FiArrowUpRight aria-hidden />
                </a>
              )}
              {item.livePreview && (
                <a
                  href={item.livePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-surface-border)] px-5 py-3 text-sm"
                >
                  Live preview <FiArrowUpRight aria-hidden />
                </a>
              )}
            </div>
            <dl className="space-y-4 border-t border-[var(--color-surface-border)] pt-6 text-sm">
              {[
                ["Version", item.version],
                ["Works with", item.compatibility],
                ["License", item.license],
                ["Technical name", item.technicalName],
                [
                  "Created",
                  item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "",
                ],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-wrap justify-between gap-2"
                  >
                    <dt className="text-[var(--color-on-surface-variant)]">
                      {label}
                    </dt>
                    <dd className="max-w-full break-words font-medium">
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>
            {item.warning && (
              <p className="rounded-xl bg-[var(--studio-accent-soft)] p-4 text-sm leading-6 text-[var(--studio-accent-text)]">
                {item.warning}
              </p>
            )}
            <div className="space-y-3 border-t border-[var(--color-surface-border)] pt-5 text-sm">
              <p className="font-semibold">Have a question?</p>
              {item.contactEmail && (
                <a
                  href={`mailto:${item.contactEmail}`}
                  className="block break-all text-[var(--color-electric-blue)]"
                >
                  {item.contactEmail}
                </a>
              )}
              {[
                ["Product support", item.supportUrl],
                ["Website", item.website],
                ["Explore upgrade", item.upgradeUrl],
              ]
                .filter(([, url]) => url)
                .map(([label, url]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-[var(--color-on-surface-variant)]"
                  >
                    {label}
                    <FiArrowUpRight aria-hidden />
                  </a>
                ))}
              {!item.contactEmail && !item.supportUrl && (
                <Link
                  href="/#contact"
                  className="block text-[var(--color-electric-blue)]"
                >
                  Get in touch
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
