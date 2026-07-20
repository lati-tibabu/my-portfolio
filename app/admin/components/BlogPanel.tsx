"use client";

import { useEffect, useMemo, useState } from "react";
import BlogContent from "../../components/BlogContent";
import Icon from "../../components/Icon";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { DEFAULT_PLACEHOLDER_IMAGE, inputClass, labelClass, sectionClass } from "../lib/constants";
import {
  emptyBlogForm,
  joinList,
  slugify,
  splitList,
  textValue,
} from "../lib/forms";
import { ensureUniqueSlug, uploadContentImage } from "../lib/crud";
import type { BlogForm, BlogRecord } from "../lib/types";

const PAGE_SIZE = 8;

export type BlogPanelProps = {
  records: BlogRecord[];
  reload: () => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
};

export default function BlogPanel({
  records,
  reload,
  busy,
  setBusy,
  setMessage,
}: BlogPanelProps) {
  const [form, setForm] = useState<BlogForm>(emptyBlogForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
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
    setForm((current) => ({
      ...current,
      slug: slugify(current.title),
    }));
  }, [form.title, slugManuallyEdited]);

  const save = async (publishNow = false, unpublishNow = false) => {
    const baseSlug = slugify(form.slug || form.title);
    if (!baseSlug || !form.title) {
      setMessage("Blog posts need a title.");
      return;
    }
    setBusy(true);
    try {
      const uniqueSlug = await ensureUniqueSlug(
        supabaseBrowser,
        "blog_posts",
        baseSlug,
        form.id ?? undefined,
      );
      let coverImageUrl = form.coverImageUrl;
      if (imageFile) {
        const uploaded = await uploadContentImage(imageFile, "blog");
        coverImageUrl = uploaded.imageUrl;
      }
      const payload = {
        slug: uniqueSlug,
        title: form.title,
        excerpt: form.excerpt,
        cover_image_url:
          form.useCoverImage || imageFile
            ? coverImageUrl.trim() || DEFAULT_PLACEHOLDER_IMAGE
            : DEFAULT_PLACEHOLDER_IMAGE,
        published_at: form.publishedAt,
        tags: splitList(form.tagsText),
        details_html: form.detailsHtml,
        content_format: form.contentFormat,
        is_draft: publishNow ? false : unpublishNow ? true : form.isDraft,
        author_name: form.authorName.trim() || "latitibabu",
      };

      const query = form.id
        ? supabaseBrowser
            .from("blog_posts")
            .update(payload)
            .eq("id", form.id)
        : supabaseBrowser.from("blog_posts").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(
        publishNow
          ? `Blog post published (${uniqueSlug}).`
          : unpublishNow
            ? `Blog post unpublished (${uniqueSlug}).`
            : form.isDraft
              ? `Blog draft saved (${uniqueSlug}).`
              : form.id
                ? `Blog post updated and published (${uniqueSlug}).`
                : `Blog post published (${uniqueSlug}).`,
      );
      setForm(emptyBlogForm());
      setImageFile(null);
      setShowPreview(false);
      setSlugManuallyEdited(false);
      setView("list");
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save blog post.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this blog post?")) {
      return;
    }

    setBusy(true);
    const { error } = await supabaseBrowser
      .from("blog_posts")
      .delete()
      .eq("id", id);
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Blog post deleted.");
    await reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
          Blog
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
              setForm(emptyBlogForm());
              setImageFile(null);
              setShowPreview(false);
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
            Blog posts
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
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      {item.slug}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="tag-chip">
                        {item.content_format === "md" ? "Markdown" : "HTML"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                          item.is_draft
                            ? "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"
                            : "bg-[var(--color-success-teal)] text-white"
                        }`}
                      >
                        {item.is_draft ? "Draft" : "Published"}
                      </span>
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
                          excerpt: item.excerpt,
                          useCoverImage:
                            textValue(item.cover_image_url).trim() !==
                            DEFAULT_PLACEHOLDER_IMAGE,
                          coverImageUrl: textValue(item.cover_image_url),
                          publishedAt: item.published_at,
                          tagsText: joinList(item.tags),
                          detailsHtml: item.details_html,
                            contentFormat: item.content_format ?? "html",
                            isDraft: item.is_draft ?? false,
                            authorName: item.author_name ?? "latitibabu",
                        });
                        setImageFile(null);
                        setSlugManuallyEdited(true);
                        setShowPreview(false);
                        setMetaExpanded(false);
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
        <div
          className={`grid gap-4 ${showPreview ? "xl:grid-cols-[minmax(0,1fr)_520px]" : ""}`}
        >
          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              {form.id ? "Update blog post" : "Create blog post"}
            </h2>
            <div className="mt-5 grid gap-4">
              <label className={labelClass}>
                Title
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
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
                    setForm({ ...form, slug: slugify(event.target.value) });
                  }}
                />
              </label>
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                Slug is auto-generated from title. If the slug already exists, a numeric suffix is added when saving.
              </p>
              <div className={labelClass}>
                <p>Content format</p>
                <div className="flex gap-2">
                  {(["html", "md"] as const).map((format) => (
                    <button
                      key={format}
                      type="button"
                      className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                        form.contentFormat === format
                          ? "bg-[var(--color-electric-blue)] text-white"
                          : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)]"
                      }`}
                      onClick={() =>
                        setForm({
                          ...form,
                          contentFormat: format,
                        })
                      }
                    >
                      {format === "md" ? "Markdown" : "HTML"}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-3 text-sm text-[var(--color-on-surface-variant)]">
                <input
                  type="checkbox"
                  checked={form.useCoverImage}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      useCoverImage: event.target.checked,
                    })
                  }
                />
                Include cover image
              </label>
              <label className={labelClass}>
                {form.contentFormat === "md"
                  ? "Markdown content"
                  : "HTML content"}
                <textarea
                  className={inputClass}
                  rows={14}
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
                    Excerpt
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={form.excerpt}
                      onChange={(event) =>
                        setForm({ ...form, excerpt: event.target.value })
                      }
                    />
                  </label>
                  {form.useCoverImage && (
                    <>
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
                        Upload cover image
                        <input
                          className="block w-full cursor-pointer rounded-lg border border-dashed border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] px-4 py-3 text-sm text-[var(--color-on-surface-variant)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-on-surface)] file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.1em] file:text-white"
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            setImageFile(file);
                            if (file) {
                              setForm({ ...form, useCoverImage: true });
                            }
                          }}
                        />
                        <span className="text-xs font-normal text-[var(--color-on-surface-variant)]">
                          {imageFile
                            ? `Ready to upload: ${imageFile.name}`
                            : "PNG, JPG, WEBP, or GIF. Uploaded when you save."}
                        </span>
                      </label>
                    </>
                  )}
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
                  <label className={labelClass}>
                    Tags, comma separated
                    <input
                      className={inputClass}
                      value={form.tagsText}
                      onChange={(event) =>
                        setForm({ ...form, tagsText: event.target.value })
                      }
                    />
                  </label>
                  <label className="flex items-center gap-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-3 text-sm text-[var(--color-on-surface-variant)]">
                    <input
                      type="checkbox"
                      checked={form.isDraft}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          isDraft: event.target.checked,
                        })
                      }
                    />
                    Save as draft and keep this post off the public blog
                  </label>
                </div>
              </details>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-[var(--color-on-surface)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[3px_3px_0_var(--color-surface-border)] hover:bg-[var(--color-on-surface)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-on-surface)]/20 focus:ring-offset-2 transition-transform hover:-translate-y-0.5 disabled:opacity-60 transition-all duration-200"
                  onClick={() => save(true)}
                  disabled={busy}
                >
                  <>
                    <Icon name="rocket" size={14} />
                    Publish now
                  </>
                </button>
                {form.id && !form.isDraft && (
                  <button
                    type="button"
                    className="rounded-lg border-2 border-[var(--color-on-surface)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface)] transition-all duration-200 hover:bg-[var(--color-surface-container)] disabled:opacity-60"
                    onClick={() => save(false, true)}
                    disabled={busy}
                  >
                    ↩ Unpublish
                  </button>
                )}
                <button
                  type="button"
                  className="rounded-lg bg-[var(--color-electric-blue)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-[var(--color-electric-blue)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)]/20 focus:ring-offset-2 disabled:opacity-60 transition-all duration-200"
                  onClick={() => save()}
                  disabled={busy}
                >
                  {form.isDraft
                    ? "Save draft"
                    : form.id
                      ? "Update & publish"
                      : "Publish"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--color-electric-blue)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)]/20 focus:ring-offset-2 transition-all duration-200"
                  onClick={() => setShowPreview((current) => !current)}
                >
                  {showPreview ? "Close right preview" : "Open right preview"}
                </button>
              </div>
            </div>
          </div>
          {showPreview && (
            <aside className={`${sectionClass} h-fit xl:sticky xl:top-24`}>
              <article className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-background)] p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="tag-chip">
                    {form.contentFormat === "md" ? "Markdown" : "HTML"}
                  </span>
                  <span className="tag-chip">
                    {form.isDraft ? "Draft preview" : "Publish preview"}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-[30px] leading-[1.15] tracking-[-0.03em] text-[var(--color-on-surface)]">
                  {form.title || "Untitled blog post"}
                </h3>
                {form.excerpt && (
                  <p className="mt-3 text-[15px] leading-[1.7] text-[var(--color-on-surface-variant)]">
                    {form.excerpt}
                  </p>
                )}
                <div className="mt-6 border-t border-[var(--color-surface-border)] pt-6">
                  {form.detailsHtml ? (
                    <BlogContent
                      content={form.detailsHtml}
                      format={form.contentFormat}
                    />
                  ) : (
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      Start writing to preview the post content.
                    </p>
                  )}
                </div>
              </article>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
