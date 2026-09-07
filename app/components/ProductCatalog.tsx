"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiSearch, FiBox } from "react-icons/fi";
import type { MarketplaceItem } from "../data/cms";
import ProductImage from "./ProductImage";

export default function ProductCatalog({
  items,
}: {
  items: MarketplaceItem[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All products");
  const [sort, setSort] = useState("featured");
  const categories = [
    "All products",
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];
  const filtered = useMemo(() => {
    const results = items.filter(
      (item) =>
        (category === "All products" || category === item.category) &&
        `${item.name} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    );
    if (sort === "name") results.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price")
      results.sort(
        (a, b) =>
          (Number(a.price.replace(/[^\d.]/g, "")) || 0) -
          (Number(b.price.replace(/[^\d.]/g, "")) || 0),
      );
    return results;
  }, [items, category, query, sort]);
  return (
    <section className="py-8" aria-label="Product catalog">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              className="product-filter"
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <label className="relative min-w-0 flex-1 sm:max-w-72">
          <FiSearch
            className="absolute left-3 top-3.5 text-[var(--color-on-surface-variant)]"
            aria-hidden
          />
          <input
            aria-label="Search products"
            className="w-full rounded-full border border-[var(--color-surface-border)] bg-[var(--studio-card)] py-3 pl-10 pr-4 text-sm"
            placeholder="Find your next tool…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="my-6 flex items-center justify-between gap-4 text-xs text-[var(--color-on-surface-variant)]">
        <p role="status">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </p>
        <label className="flex items-center gap-2">
          Sort by{" "}
          <select
            className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--studio-card)] p-2"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="price">Price: low to high</option>
          </select>
        </label>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.slug} className="product-card flex flex-col">
            <Link
              href={`/marketplace/${item.slug}`}
              className="product-image block"
            >
              <ProductImage src={item.coverImage} name={item.name} />
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-electric-blue)]">
                  {item.category}
                </span>
                {item.version && (
                  <span className="text-xs text-[var(--color-on-surface-variant)]">
                    v{item.version}
                  </span>
                )}
              </div>
              <h2 className="font-heading text-xl leading-snug">
                <Link href={`/marketplace/${item.slug}`}>{item.name}</Link>
              </h2>
              <p className="mt-3 mb-6 line-clamp-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                {item.description}
              </p>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--color-surface-border)] pt-5">
                <span className="text-lg font-semibold">{item.price}</span>
                <Link
                  href={`/marketplace/${item.slug}`}
                  className="flex items-center gap-2 text-sm text-[var(--color-electric-blue)]"
                  aria-label={`Explore ${item.name}`}
                >
                  Explore product <FiArrowUpRight aria-hidden />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="product-panel py-16 text-center">
          <FiBox
            size={32}
            className="mx-auto mb-4 text-[var(--color-electric-blue)]"
            aria-hidden
          />
          <h2 className="font-heading text-2xl">
            {items.length
              ? "No products found"
              : "Something useful is on the way"}
          </h2>
          <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
            {items.length
              ? "Try another search or browse all categories."
              : "Apps, themes, and tools will appear here as they launch."}
          </p>
          {items.length ? (
            <button
              type="button"
              className="mt-5 text-sm underline"
              onClick={() => {
                setQuery("");
                setCategory("All products");
              }}
            >
              Clear filters
            </button>
          ) : (
            <Link
              className="mt-5 inline-block text-sm underline"
              href="/#contact"
            >
              Discuss a custom solution
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
