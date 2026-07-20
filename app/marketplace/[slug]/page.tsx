import type { Metadata } from "next";
import Image from "next/image";
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
      name: "Aura",
    },
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: item.link,
      priceCurrency: "USD",
      price: item.price === "Free" ? "0" : item.price.replace(/[^0-9.]/g, "") || "0",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      <section className="px-6 pt-24 pb-10">
        <div className="mx-auto max-w-[1200px] space-y-4">
          <Link
            href="/marketplace"
            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-electric-blue)]"
          >
            Back to products
          </Link>
          <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
            {item.category}
          </p>
          <h1 className="font-heading text-[34px] text-[var(--color-on-surface)] md:text-[48px]">
            {item.name}
          </h1>
          <p className="max-w-[760px] text-[16px] text-[var(--color-on-surface-variant)]">
            {item.description}
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
          <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-[var(--color-surface-border)]">
              {item.coverImage?.trim() ? (
                <Image
                  src={item.coverImage}
                  alt={`${item.name} preview`}
                  fill
                  sizes="(min-width: 1024px) 720px, 90vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--color-surface-container-highest),var(--color-surface-container-low))] p-6 text-center">
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">
                      No preview image
                    </p>
                    <p className="mt-2 font-heading text-[18px] text-[var(--color-on-surface)]">
                      {item.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {item.highlights && item.highlights.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.highlights.map((highlight) => (
                  <span key={highlight} className="tag-chip">
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
            <h2 className="font-heading text-[18px] text-[var(--color-on-surface)]">
              Product details
            </h2>
            <div className="mt-4 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4">
              <RichHtml
                html={item.detailsHtml}
                className="text-[14px] leading-[1.8] text-[var(--color-on-surface-variant)]"
              />
            </div>
            <div className="mt-4 grid gap-2 break-words text-[13px] text-[var(--color-on-surface-variant)]">
              <p>Created by: {item.authorName || "latitibabu"}</p>
              {item.createdAt && (
                <p>Created: {new Date(item.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              )}
              <p>Version: {item.version}</p>
              <p>Price: {item.price}</p>
              <p>License: {item.license}</p>
              <p>Technical name: {item.technicalName}</p>
              <p>
                Website:{" "}
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-[var(--color-electric-blue)]"
                >
                  {item.website}
                </a>
              </p>
              {item.compatibility && <p>Compatibility: {item.compatibility}</p>}
              {item.warning && <p>Note: {item.warning}</p>}
              {item.contactEmail && (
                <p>
                  Support:{" "}
                  <a
                    href={`mailto:${item.contactEmail}`}
                    className="break-all text-[var(--color-electric-blue)]"
                  >
                    {item.contactEmail}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
            <h2 className="font-heading text-[18px] text-[var(--color-on-surface)]">
              Links
            </h2>
            <div className="mt-4 flex flex-wrap gap-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-electric-blue)]"
              >
                Odoo listing →
              </a>
              {item.livePreview && (
                <a
                  href={item.livePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-electric-blue)]"
                >
                  Live preview →
                </a>
              )}
              {item.supportUrl && (
                <a
                  href={item.supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-electric-blue)]"
                >
                  Support →
                </a>
              )}
              {item.upgradeUrl && (
                <a
                  href={item.upgradeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-electric-blue)]"
                >
                  Upgrade →
                </a>
              )}
            </div>
          </div>

          {item.screenshots && item.screenshots.length > 0 && (
            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
              <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">
                Screenshots
              </h3>
              <p className="mt-3 text-[13px] text-[var(--color-on-surface-variant)]">
                {item.screenshots.length} preview images are attached to the
                product record.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
