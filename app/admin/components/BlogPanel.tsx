"use client";

import { useEffect, useState } from "react";
import BlogContent from "../../components/BlogContent";
import Icon from "../../components/Icon";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { DEFAULT_PLACEHOLDER_IMAGE, inputClass, sectionClass } from "../lib/constants";
import { useConfirmDialog } from "../lib/useConfirmDialog";
import { useListState } from "../lib/useListState";
import {
  emptyBlogForm,
  joinList,
  slugify,
  splitList,
  textValue,
} from "../lib/forms";
import { ensureUniqueSlug, uploadContentImage } from "../lib/crud";
import type { BlogForm, BlogRecord } from "../lib/types";
import {
  Button,
  BulkActionBar,
  ConfirmDialog,
  EmptyState,
  FormField,
  FormSection,
  ListCard,
  PanelHeader,
  Pagination,
  StatusPill,
  Toolbar,
} from "./ui";

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
  const [view, setView] = useState<"list" | "edit">("list");
  const { confirm, dialogProps } = useConfirmDialog();

  const list = useListState<BlogRecord>({
    records,
    getId: (item) => item.id,
    match: (item, query) =>
      item.title.toLowerCase().includes(query) ||
      item.slug.toLowerCase().includes(query) ||
      (item.tags ?? []).some((tag) => tag.toLowerCase().includes(query)),
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    if (slugManuallyEdited) {
      return;
    }
    setForm((current) => ({ ...current, slug: slugify(current.title) }));
  }, [form.title, slugManuallyEdited]);

  const resetForm = () => {
    setForm(emptyBlogForm());
    setImageFile(null);
    setShowPreview(false);
    setSlugManuallyEdited(false);
    setView("list");
  };

  const startNew = () => {
    setForm(emptyBlogForm());
    setImageFile(null);
    setShowPreview(false);
    setSlugManuallyEdited(false);
    list.clearSelection();
    setView("edit");
  };

  const editRecord = (item: BlogRecord) => {
    setForm({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      useCoverImage:
        textValue(item.cover_image_url).trim() !== DEFAULT_PLACEHOLDER_IMAGE,
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
    list.clearSelection();
    setView("edit");
  };

  const duplicateRecord = (item: BlogRecord) => {
    const title = `${item.title} (copy)`;
    setForm({
      id: null,
      slug: slugify(title),
      title,
      excerpt: item.excerpt,
      useCoverImage:
        textValue(item.cover_image_url).trim() !== DEFAULT_PLACEHOLDER_IMAGE,
      coverImageUrl: textValue(item.cover_image_url),
      publishedAt: item.published_at,
      tagsText: joinList(item.tags),
      detailsHtml: item.details_html,
      contentFormat: item.content_format ?? "html",
      isDraft: true,
      authorName: item.author_name ?? "latitibabu",
    });
    setImageFile(null);
    setSlugManuallyEdited(false);
    setShowPreview(false);
    list.clearSelection();
    setView("edit");
  };

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
      resetForm();
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save blog post.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = (item: BlogRecord) => {
    confirm({
      title: "Delete blog post?",
      message: `"${item.title}" will be permanently removed.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("blog_posts")
          .delete()
          .eq("id", item.id);
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage("Blog post deleted.");
        await reload();
      },
    });
  };

  const removeSelected = () => {
    const ids = list.selectedIds;
    if (ids.length === 0) return;
    confirm({
      title: `Delete ${ids.length} blog post${ids.length === 1 ? "" : "s"}?`,
      message: "The selected posts will be permanently removed.",
      confirmLabel: "Delete selected",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("blog_posts")
          .delete()
          .in("id", ids);
        if (error) {
          setMessage(error.message);
          return;
        }
        list.clearSelection();
        setMessage(`${ids.length} post${ids.length === 1 ? "" : "s"} deleted.`);
        await reload();
      },
    });
  };

  return (
    <div className="space-y-4">
      <PanelHeader
        title="Blog"
        subtitle="Articles and updates"
        count={records.length}
        views={[
          { key: "list", label: "List" },
          { key: "edit", label: "New" },
        ]}
        view={view}
        onViewChange={(next) => (next === "edit" ? startNew() : setView("list"))}
      />

      {view === "list" ? (
        <div className="space-y-4">
          <Toolbar
            query={list.query}
            onQueryChange={list.setQuery}
            resultCount={list.filtered.length}
            total={records.length}
            placeholder="Search title, slug, or tags..."
          >
            <label className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--color-electric-blue)]"
                checked={list.allSelected}
                onChange={() =>
                  list.allSelected ? list.clearSelection() : list.selectAll()
                }
                disabled={list.filtered.length === 0}
              />
              Select all
            </label>
          </Toolbar>

          <BulkActionBar
            selectedCount={list.selectedCount}
            onClear={list.clearSelection}
          >
            <Button variant="danger" size="sm" onClick={removeSelected}>
              Delete selected
            </Button>
          </BulkActionBar>

          {list.filtered.length === 0 ? (
            records.length === 0 ? (
              <EmptyState
                title="No blog posts yet"
                description="Write articles and updates for the blog."
                action={<Button variant="primary" onClick={startNew}>New post</Button>}
              />
            ) : (
              <EmptyState
                title="No matches"
                description={`No posts match "${list.query}". Try a different search.`}
              />
            )
          ) : (
            <div className="space-y-3">
              {list.paged.map((item) => (
                <ListCard
                  key={item.id}
                  title={item.title}
                  meta={item.slug}
                  pills={
                    <>
                      <StatusPill tone="neutral">
                        {item.content_format === "md" ? "Markdown" : "HTML"}
                      </StatusPill>
                      <StatusPill tone={item.is_draft ? "neutral" : "success"}>
                        {item.is_draft ? "Draft" : "Published"}
                      </StatusPill>
                    </>
                  }
                  selectable
                  selected={list.selected.has(item.id)}
                  onSelectChange={(checked) => list.setSelected(item.id, checked)}
                  onOpen={() => editRecord(item)}
                  actions={
                    <>
                      <Button size="sm" onClick={() => duplicateRecord(item)}>
                        Duplicate
                      </Button>
                      <Button size="sm" onClick={() => editRecord(item)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => remove(item)}>
                        Delete
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          )}

          <Pagination
            page={list.page}
            pageCount={list.pageCount}
            onPageChange={list.setPage}
          />
        </div>
      ) : (
        <div
          className={`grid gap-4 ${showPreview ? "xl:grid-cols-[minmax(0,1fr)_520px]" : ""}`}
        >
          <div className="space-y-4">
            <FormSection
              title={form.id ? "Update blog post" : "Create blog post"}
              description="Title, slug, format, and body of the post."
            >
              <FormField label="Title">
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </FormField>
              <FormField
                label="Slug"
                hint="Auto-generated from the title. A numeric suffix is added on conflict when saving."
              >
                <input
                  className={inputClass}
                  value={form.slug}
                  onChange={(event) => {
                    setSlugManuallyEdited(true);
                    setForm({ ...form, slug: slugify(event.target.value) });
                  }}
                />
              </FormField>
              <FormField label="Content format">
                <div className="flex gap-2">
                  {(["html", "md"] as const).map((format) => (
                    <button
                      key={format}
                      type="button"
                      className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                        form.contentFormat === format
                          ? "bg-[var(--color-electric-blue)] text-white"
                          : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"
                      }`}
                      onClick={() =>
                        setForm({ ...form, contentFormat: format })
                      }
                    >
                      {format === "md" ? "Markdown" : "HTML"}
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField
                label={form.contentFormat === "md" ? "Markdown content" : "HTML content"}
              >
                <textarea
                  className={inputClass}
                  rows={14}
                  value={form.detailsHtml}
                  onChange={(event) =>
                    setForm({ ...form, detailsHtml: event.target.value })
                  }
                />
              </FormField>
              <label className="flex items-center gap-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-3 text-sm text-[var(--color-on-surface-variant)]">
                <input
                  type="checkbox"
                  checked={form.useCoverImage}
                  onChange={(event) =>
                    setForm({ ...form, useCoverImage: event.target.checked })
                  }
                />
                Include cover image
              </label>
              {form.useCoverImage && (
                <FormField label="Cover image URL">
                  <input
                    className={inputClass}
                    value={form.coverImageUrl}
                    onChange={(event) =>
                      setForm({ ...form, coverImageUrl: event.target.value })
                    }
                  />
                </FormField>
              )}
              {form.useCoverImage && (
                <FormField
                  label="Upload cover image"
                  hint={
                    imageFile
                      ? `Ready to upload: ${imageFile.name}`
                      : "PNG, JPG, WEBP, or GIF. Uploaded when you save."
                  }
                >
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
                </FormField>
              )}
            </FormSection>

            <FormSection
              title="Meta"
              columns={2}
              collapsible
              defaultOpen={false}
              description="Excerpt, taxonomy, authorship, and publish state."
            >
              <FormField label="Excerpt" className="sm:col-span-2">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.excerpt}
                  onChange={(event) =>
                    setForm({ ...form, excerpt: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Tags" hint="Comma separated.">
                <input
                  className={inputClass}
                  value={form.tagsText}
                  onChange={(event) =>
                    setForm({ ...form, tagsText: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Author name">
                <input
                  className={inputClass}
                  value={form.authorName}
                  placeholder="latitibabu"
                  onChange={(event) =>
                    setForm({ ...form, authorName: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Published date">
                <input
                  className={inputClass}
                  type="date"
                  value={form.publishedAt}
                  onChange={(event) =>
                    setForm({ ...form, publishedAt: event.target.value })
                  }
                />
              </FormField>
              <label className="flex items-center gap-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-3 text-sm text-[var(--color-on-surface-variant)] sm:col-span-1">
                <input
                  type="checkbox"
                  checked={form.isDraft}
                  onChange={(event) =>
                    setForm({ ...form, isDraft: event.target.checked })
                  }
                />
                Save as draft
              </label>
            </FormSection>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => save()}
                disabled={busy}
              >
                {form.isDraft
                  ? "Save draft"
                  : form.id
                    ? "Update & publish"
                    : "Publish"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => save(true)}
                disabled={busy}
              >
                <Icon name="rocket" size={14} />
                Publish now
              </Button>
              {form.id && !form.isDraft ? (
                <Button
                  variant="secondary"
                  onClick={() => save(false, true)}
                  disabled={busy}
                >
                  ↩ Unpublish
                </Button>
              ) : null}
              <Button
                variant="secondary"
                onClick={() => setShowPreview((current) => !current)}
              >
                {showPreview ? "Close preview" : "Open preview"}
              </Button>
              <Button variant="secondary" onClick={resetForm} disabled={busy}>
                Cancel
              </Button>
              {form.id ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    const editing = records.find((r) => r.id === form.id);
                    if (editing) duplicateRecord(editing);
                  }}
                  disabled={busy}
                >
                  Duplicate
                </Button>
              ) : null}
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

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}