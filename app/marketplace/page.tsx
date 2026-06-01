import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { loadMarketplaceItems } from "../lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://latitibabu.com";
const canonicalUrl = `${siteUrl}/marketplace`;

export const metadata: Metadata = {
  title: "Odoo Marketplace — Lati Tibabu",
  description:
    "Explore all Aura Odoo apps and themes with full details, screenshots, pricing, and support links.",
  alternates: {
    canonical: "/marketplace",
  },
  openGraph: {
    title: "Odoo Marketplace — Lati Tibabu",
    description:
      "Explore all Aura Odoo apps and themes with full details, screenshots, pricing, and support links.",
    url: "/marketplace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Odoo Marketplace — Lati Tibabu",
    description:
      "Explore all Aura Odoo apps and themes with full details, screenshots, pricing, and support links.",
  },
};

export default async function MarketplacePage() {
  const marketplaceItems = await loadMarketplaceItems();
  const marketplaceStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Aura Odoo apps and themes",
    url: canonicalUrl,
    numberOfItems: marketplaceItems.length,
    itemListElement: marketplaceItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/marketplace/${item.slug}`,
      name: item.name,
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceStructuredData) }}
      />
      <section className="px-6 pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto space-y-4">
          <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
            Odoo Marketplace
          </p>
          <h1 className="font-heading text-[36px] md:text-[52px] text-[var(--color-on-surface)]">
            Aura apps and themes
          </h1>
          <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[700px]">
            All listings with pricing, compatibility notes, screenshots, and
            direct links to Odoo Apps and support.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-[1200px] mx-auto grid gap-6 md:grid-cols-2">
          {marketplaceItems.map((item) => (
            <article
              key={item.slug}
              className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.05)]"
            >
              <Link href={`/marketplace/${item.slug}`} className="block">
                <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-lg border border-[var(--color-surface-border)]">
                  {item.coverImage?.trim() ? (
                    <Image
                      src={item.coverImage}
                      alt={`${item.name} preview`}
                      fill
                      sizes="(min-width: 1024px) 520px, 90vw"
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-electric-blue)]">
                      {item.category}
                    </p>
                    <h2 className="font-heading text-[22px] text-[var(--color-on-surface)]">
                      {item.name}
                    </h2>
                  </div>
                  <span className="tag-chip">v {item.version}</span>
                </div>
                <p className="mt-3 text-[15px] leading-[1.65] text-[var(--color-on-surface-variant)]">
                  {item.description}
                </p>
              </Link>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="tag-chip">{item.price}</span>
                <span className="tag-chip">{item.category}</span>
                <span className="tag-chip">{item.license}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
                <Link
                  href={`/marketplace/${item.slug}`}
                  className="text-[var(--color-electric-blue)]"
                >
                  View details →
                </Link>
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
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
