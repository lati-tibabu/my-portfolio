import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marketplaceItems } from "../../data/odooMarketplace";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = marketplaceItems.find((entry) => entry.slug === slug);
  if (!item) {
    return { title: "Marketplace Item — Lati Tibabu" };
  }

  return {
    title: `${item.name} — Lati Tibabu`,
    description: item.description,
  };
}

export default async function MarketplaceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = marketplaceItems.find((entry) => entry.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <section className="px-6 pt-24 pb-10">
        <div className="max-w-[1200px] mx-auto space-y-4">
          <Link
            href="/marketplace"
            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-electric-blue)]"
          >
            Back to marketplace
          </Link>
          <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
            {item.type}
          </p>
          <h1 className="font-heading text-[34px] md:text-[48px] text-[var(--color-on-surface)]">
            {item.name}
          </h1>
          <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[760px]">
            {item.description}
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-[1200px] mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-[var(--color-surface-border)]">
              <Image
                src={item.image}
                alt={`${item.name} preview`}
                fill
                sizes="(min-width: 1024px) 720px, 90vw"
                className="object-cover"
                unoptimized
              />
            </div>
            {item.highlights && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.highlights.map((highlight) => (
                  <span key={highlight} className="tag-chip">
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
              <h2 className="font-heading text-[18px] text-[var(--color-on-surface)]">
                Overview
              </h2>
              <div className="mt-3 grid gap-2 text-[13px] text-[var(--color-on-surface-variant)]">
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
                    className="text-[var(--color-electric-blue)]"
                  >
                    {item.website}
                  </a>
                </p>
                {item.compatibility && (
                  <p>Compatibility: {item.compatibility}</p>
                )}
                {item.warning && <p>Note: {item.warning}</p>}
                {item.contactEmail && (
                  <p>
                    Support:{" "}
                    <a
                      href={`mailto:${item.contactEmail}`}
                      className="text-[var(--color-electric-blue)]"
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
          </div>
        </div>
      </section>

      {(item.keyFeatures ||
        item.widgetCoverage ||
        item.coverage ||
        item.dependencies ||
        item.comparison) && (
        <section className="px-6 pb-16">
          <div className="max-w-[1200px] mx-auto grid gap-6 lg:grid-cols-2">
            {item.keyFeatures && (
              <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
                <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">
                  Key features
                </h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-[13px] text-[var(--color-on-surface-variant)]">
                  {item.keyFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {item.widgetCoverage && (
              <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
                <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">
                  Widget coverage
                </h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-[13px] text-[var(--color-on-surface-variant)]">
                  {item.widgetCoverage.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {item.coverage && (
              <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
                <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">
                  Core coverage
                </h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-[13px] text-[var(--color-on-surface-variant)]">
                  {item.coverage.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {item.dependencies && (
              <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
                <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">
                  Dependencies
                </h3>
                <p className="mt-3 text-[13px] text-[var(--color-on-surface-variant)]">
                  {item.dependencies.join(", ")}
                </p>
              </div>
            )}
            {item.comparison && (
              <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5">
                <h3 className="font-heading text-[18px] text-[var(--color-on-surface)]">
                  Free vs premium
                </h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-[13px] text-[var(--color-on-surface-variant)]">
                  {item.comparison.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {item.screenshots && (
        <section className="px-6 pb-20">
          <div className="max-w-[1200px] mx-auto space-y-4">
            <h2 className="font-heading text-[22px] text-[var(--color-on-surface)]">
              Screenshots and media
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {item.screenshots.map((shot) => (
                <a
                  key={shot}
                  href={shot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[var(--color-surface-border)] p-2 bg-[var(--color-surface-container-lowest)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-md">
                    <Image
                      src={shot}
                      alt={`${item.name} screenshot`}
                      fill
                      sizes="(min-width: 1024px) 520px, 90vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
