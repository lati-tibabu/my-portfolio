"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { DEFAULT_PLACEHOLDER_IMAGE, inputClass, labelClass, sectionClass } from "../lib/constants";
import {
  emptyMarketplaceForm,
  joinList,
  slugify,
  splitList,
  textValue,
} from "../lib/forms";
import { ensureUniqueSlug } from "../lib/crud";
import type { MarketplaceForm, MarketplaceRecord } from "../lib/types";

const PAGE_SIZE = 8;

export type MarketplacePanelProps = {
  records: MarketplaceRecord[];
  reload: () => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
};

export default function MarketplacePanel({
  records,
  reload,
  busy,
  setBusy,
  setMessage,
}: MarketplacePanelProps) {
  const [form, setForm] = useState<MarketplaceForm>(emptyMarketplaceForm);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [metaExpanded, setMetaExpanded] = useState(false);
  const [view, setView] = useState<"list" | "new">("list");
  const [page, setPage] = useState(1);

  const paged = useMemo(
    () => records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [records, page],
  );
  const pageCount = Math.max(1, Math.ceil(records.length / PAGE_SIZE));

  useEffect(() => {
    if (slugManuallyEdited) {
      return;
    }
    setForm((current) => ({ ...current, slug: slugify(current.name) }));
  }, [form.name, slugManuallyEdited]);

  const save = async () => {
    const baseSlug = slugify(form.slug || form.name);
    if (!baseSlug || !form.name) {
      setMessage("Products need a name.");
      return;
    }
    setBusy(true);
    try {
      const uniqueSlug = await ensureUniqueSlug(
        supabaseBrowser,
        "marketplace_items",
        baseSlug,
        form.id ?? undefined,
      );
      const payload = {
        slug: uniqueSlug,
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        cover_image_url:
          form.coverImageUrl.trim() || DEFAULT_PLACEHOLDER_IMAGE,
        published_at: form.publishedAt,
        details_html: form.detailsHtml,
        version: form.version,
        license: form.license,
        technical_name: form.technicalName,
        website: form.website,
        compatibility: form.compatibility,
        warning: form.warning,
        live_preview: form.livePreview,
        support_url: form.supportUrl,
        contact_email: form.contactEmail,
        link: form.link,
        downloads: form.downloads,
        upgrade_url: form.upgradeUrl,
        highlights: splitList(form.highlightsText),
        screenshots: splitList(form.screenshotsText),
      };

      const query = form.id
        ? supabaseBrowser
            .from("marketplace_items")
            .update(payload)
            .eq("id", form.id)
        : supabaseBrowser.from("marketplace_items").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(
        form.id
          ? `Product updated (${uniqueSlug}).`
          : `Product created (${uniqueSlug}).`,
      );
      setForm(emptyMarketplaceForm());
      setSlugManuallyEdited(false);
      setMetaExpanded(false);
      setView("list");
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save product.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) {
      return;
    }

    setBusy(true);
    const { error } = await supabaseBrowser
      .from("marketplace_items")
      .delete()
      .eq("id", id);
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Product deleted.");
    await reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
          Products
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
              view === "list"
                ? "bg-[var(--color-electric-blue)] text-white hover:bg-[var(--color-electric-blue)]/90"
                : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"
            }`}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(emptyMarketplaceForm());
              setSlugManuallyEdited(false);
              setMetaExpanded(false);
              setView("new");
            }}
            className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
              view === "new"
                ? "bg-[var(--color-electric-blue)] text-white hover:bg-[var(--color-electric-blue)]/90"
                : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"
            }`}
          >
            New
          </button>
        </div>
      </div>
      {view === "list" ? (
        <div className={sectionClass}>
          <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
            Products
          </h2>
          <div className="mt-5 space-y-4">
            {paged.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[var(--color-surface-border)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[var(--color-on-surface)]">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      {item.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] border border-[var(--color-surface-border)] hover:bg-[var(--color-surface-container-low)] transition-all duration-200"
                      onClick={() => {
                        setForm({
                          id: item.id,
                          slug: item.slug,
                          name: item.name,
                          description: item.description,
                          price: item.price,
                          category: item.category,
                          coverImageUrl: textValue(item.cover_image_url),
                          publishedAt: item.published_at,
                          detailsHtml: item.details_html,
                          version: item.version,
                          license: item.license,
                          technicalName: item.technical_name,
                          website: textValue(item.website),
                          compatibility: textValue(item.compatibility),
                          warning: textValue(item.warning),
                          livePreview: textValue(item.live_preview),
                          supportUrl: textValue(item.support_url),
                          contactEmail: textValue(item.contact_email),
                          link: item.link,
                          downloads: textValue(item.downloads),
                          upgradeUrl: textValue(item.upgrade_url),
                          highlightsText: joinList(item.highlights),
                          screenshotsText: joinList(item.screenshots),
                        });
                        setSlugManuallyEdited(true);
                        setView("new");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] border border-[var(--color-surface-border)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] transition-all duration-200"
                      onClick={() => remove(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between text-sm text-[var(--color-on-surface-variant)]">
            <span>
              Page {page} of {pageCount}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                disabled={page >= pageCount}
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={sectionClass}>
          <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
            {form.id ? "Update product" : "Create product"}
          </h2>
          <div className="mt-5 grid gap-4">
            <label className={labelClass}>
              Name
              <input
                className={inputClass}
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
              />
            </label>
            <label className={labelClass}>
              Slug
              <input
                className={inputClass}
                value={form.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(true);
                  setForm({
                    ...form,
                    slug: slugify(event.target.value),
                  });
                }}
              />
            </label>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Slug is auto-generated from name. On conflict, a suffix is added when saving.
            </p>
            <label className={labelClass}>
              Description
              <textarea
                className={inputClass}
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    description: event.target.value,
                  })
                }
              />
            </label>
            <label className={labelClass}>
              HTML details
              <textarea
                className={inputClass}
                rows={8}
                value={form.detailsHtml}
                onChange={(event) =>
                  setForm({
                    ...form,
                    detailsHtml: event.target.value,
                  })
                }
              />
            </label>
            <details
              className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4"
              open={metaExpanded}
              onToggle={(event) =>
                setMetaExpanded((event.target as HTMLDetailsElement).open)
              }
            >
              <summary className="cursor-pointer text-sm font-semibold text-[var(--color-on-surface)]">
                Other fields
              </summary>
              <div className="mt-4 grid gap-4">
                <label className={labelClass}>
                  Price
                  <input
                    className={inputClass}
                    value={form.price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        price: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Category
                  <input
                    className={inputClass}
                    value={form.category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Cover image URL
                  <input
                    className={inputClass}
                    value={form.coverImageUrl}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        coverImageUrl: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Published date
                  <input
                    className={inputClass}
                    type="date"
                    value={form.publishedAt}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        publishedAt: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Version
                  <input
                    className={inputClass}
                    value={form.version}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        version: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  License
                  <input
                    className={inputClass}
                    value={form.license}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        license: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Technical name
                  <input
                    className={inputClass}
                    value={form.technicalName}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        technicalName: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Website
                  <input
                    className={inputClass}
                    value={form.website}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        website: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Compatibility
                  <input
                    className={inputClass}
                    value={form.compatibility}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        compatibility: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Warning
                  <input
                    className={inputClass}
                    value={form.warning}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        warning: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Live preview URL
                  <input
                    className={inputClass}
                    value={form.livePreview}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        livePreview: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Support URL
                  <input
                    className={inputClass}
                    value={form.supportUrl}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        supportUrl: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Contact email
                  <input
                    className={inputClass}
                    value={form.contactEmail}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        contactEmail: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Listing URL
                  <input
                    className={inputClass}
                    value={form.link}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        link: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Downloads
                  <input
                    className={inputClass}
                    value={form.downloads}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        downloads: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Upgrade URL
                  <input
                    className={inputClass}
                    value={form.upgradeUrl}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        upgradeUrl: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Highlights, comma separated
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.highlightsText}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        highlightsText: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Screenshots, comma separated
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.screenshotsText}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        screenshotsText: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
            </details>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg bg-[var(--color-electric-blue)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-[var(--color-electric-blue)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)]/20 focus:ring-offset-2 disabled:opacity-60 transition-all duration-200"
                onClick={save}
                disabled={busy}
              >
                {form.id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}