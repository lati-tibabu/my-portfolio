"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { DEFAULT_PLACEHOLDER_IMAGE, inputClass, labelClass, sectionClass } from "../lib/constants";
import {
  emptyGraphicsForm,
  slugify,
  textValue,
} from "../lib/forms";
import { ensureUniqueSlug, uploadGraphicsImage } from "../lib/crud";
import type { GraphicsForm, GraphicsRecord } from "../lib/types";
import ImageUploader from "./ImageUploader";

const PAGE_SIZE = 8;

export type GraphicsPanelProps = {
  records: GraphicsRecord[];
  reload: () => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
};

export default function GraphicsPanel({
  records,
  reload,
  busy,
  setBusy,
  setMessage,
}: GraphicsPanelProps) {
  const [form, setForm] = useState<GraphicsForm>(emptyGraphicsForm);
  const [file, setFile] = useState<File | null>(null);
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
    setForm((current) => ({ ...current, slug: slugify(current.title) }));
  }, [form.title, slugManuallyEdited]);

  const save = async () => {
    const baseSlug = slugify(form.slug || form.title);
    if (!baseSlug || !form.title) {
      setMessage("Graphics items need a title.");
      return;
    }
    setBusy(true);
    try {
      let imageUrl = form.imageUrl;
      let imagePath = form.imagePath;

      if (file) {
        const uploaded = await uploadGraphicsImage(file);
        imageUrl = uploaded.imageUrl;
        imagePath = uploaded.imagePath;
      }
      const uniqueSlug = await ensureUniqueSlug(
        supabaseBrowser,
        "graphics_items",
        baseSlug,
        form.id ?? undefined,
      );

      const payload = {
        slug: uniqueSlug,
        title: form.title,
        description: form.description,
        category: form.category,
        image_url: imageUrl.trim() || DEFAULT_PLACEHOLDER_IMAGE,
        image_path: imagePath,
        published_at: form.publishedAt,
        details_html: form.detailsHtml,
        author_name: form.authorName.trim() || "latitibabu",
      };

      const query = form.id
        ? supabaseBrowser
            .from("graphics_items")
            .update(payload)
            .eq("id", form.id)
        : supabaseBrowser.from("graphics_items").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(
        form.id
          ? `Graphics item updated (${uniqueSlug}).`
          : `Graphics item created (${uniqueSlug}).`,
      );
      setForm(emptyGraphicsForm());
      setFile(null);
      setSlugManuallyEdited(false);
      setMetaExpanded(false);
      setView("list");
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save graphics item.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this graphics item?")) {
      return;
    }

    setBusy(true);
    const { error } = await supabaseBrowser
      .from("graphics_items")
      .delete()
      .eq("id", id);
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Graphics item deleted.");
    await reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
          Graphics
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
              setForm(emptyGraphicsForm());
              setFile(null);
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
            Graphics items
          </h2>
          <div className="mt-5 space-y-4">
            {paged.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[var(--color-surface-border)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.image_url?.trim() ? (
                      <Image
                        src={item.image_url.trim()}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-md border border-[var(--color-surface-border)] object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-md border border-[var(--color-surface-border)] text-[10px] uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                        No image
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-[var(--color-on-surface)]">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">
                        {item.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] border border-[var(--color-surface-border)] hover:bg-[var(--color-surface-container-low)] transition-all duration-200"
                      onClick={() => {
                        setForm({
                          id: item.id,
                          slug: item.slug,
                          title: item.title,
                          description: item.description,
                          category: item.category,
                          imageUrl: textValue(item.image_url),
                          imagePath: textValue(item.image_path),
                          publishedAt: item.published_at,
                            detailsHtml: item.details_html,
                            authorName: item.author_name ?? "latitibabu",
                        });
                        setFile(null);
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
            {form.id ? "Update graphics item" : "Create graphics item"}
          </h2>
          <div className="mt-5 grid gap-4">
            <ImageUploader
              file={file}
              onFileChange={setFile}
              imageUrl={form.imageUrl}
              onImageUrlChange={(value) => setForm({ ...form, imageUrl: value })}
              title={form.title}
              description={form.description}
            />
            <label className={labelClass}>
              Title
              <input
                className={inputClass}
                value={form.title}
                onChange={(event) =>
                  setForm({
                    ...form,
                    title: event.target.value,
                  })
                }
              />
            </label>
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
              Slug is auto-generated from title. On conflict, a suffix is added when saving.
            </p>
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
                  Author name
                  <input
                    className={inputClass}
                    value={form.authorName}
                    placeholder="latitibabu"
                    onChange={(event) =>
                      setForm({ ...form, authorName: event.target.value })
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
