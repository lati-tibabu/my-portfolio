import ProductCatalog from "../components/ProductCatalog";
import { FiBox, FiArrowUpRight } from "react-icons/fi";
import type { Metadata } from "next";
import Link from "next/link";
import { loadMarketplaceItems } from "../lib/content";

// CMS content lives in Supabase; always render fresh so admin edits appear immediately.
export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://latitibabu.com";
const canonicalUrl = `${siteUrl}/marketplace`;

export const metadata: Metadata = {
  title: "Products — Lati Tibabu",
  description:
    "Explore digital products, apps, themes, templates, and tools with details, previews, pricing, and support.",
  alternates: {
    canonical: "/marketplace",
  },
  openGraph: {
    title: "Products — Lati Tibabu",
    description:
      "Explore digital products, apps, themes, templates, and tools with details, previews, pricing, and support.",
    url: "/marketplace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products — Lati Tibabu",
    description:
      "Explore digital products, apps, themes, templates, and tools with details, previews, pricing, and support.",
  },
};

export default async function MarketplacePage() {
  const marketplaceItems = await loadMarketplaceItems();
  const marketplaceStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Digital product catalog",
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
    <div className="product-space min-h-screen bg-[var(--color-background)] px-5 pb-16 text-[var(--color-on-surface)] sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(marketplaceStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <div className="mx-auto max-w-[1200px]">
        <section className="product-hero">
          <p className="product-eyebrow">
            <FiBox aria-hidden /> The product collection
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
            <div>
              <h1 className="max-w-3xl font-heading text-4xl leading-[1.1] tracking-tight sm:text-6xl">
                Small tools.
                <br />
                <span className="text-[var(--color-electric-blue)]">
                  Better everyday work.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--color-on-surface-variant)]">
                Thoughtfully built apps, themes, and digital tools. Explore the
                details, find your fit, and make your workflow a little better.
              </p>
            </div>
            <Link
              href="/#contact"
              className="flex items-center gap-3 rounded-full border border-[var(--color-surface-border)] px-5 py-3 text-sm"
            >
              Need something custom? <FiArrowUpRight aria-hidden />
            </Link>
          </div>
        </section>
        <ProductCatalog items={marketplaceItems} />
      </div>
    </div>
  );
}
