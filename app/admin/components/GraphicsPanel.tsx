"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { DEFAULT_PLACEHOLDER_IMAGE, inputClass } from "../lib/constants";
import { useConfirmDialog } from "../lib/useConfirmDialog";
import { useListState } from "../lib/useListState";
import {
  emptyGraphicsForm,
  slugify,
  textValue,
} from "../lib/forms";
import { ensureUniqueSlug, uploadGraphicsImage } from "../lib/crud";
import type { GraphicsForm, GraphicsRecord } from "../lib/types";
import ImageUploader from "./ImageUploader";
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

export type GraphicsPanelProps = {
  records: GraphicsRecord[];
  reload: () => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
  adminName: string;
};

export default function GraphicsPanel({
  records,
  reload,
  busy,
  setBusy,
  setMessage,
  adminName,
}: GraphicsPanelProps) {
  const [form, setForm] = useState<GraphicsForm>(emptyGraphicsForm);
  const [file, setFile] = useState<File | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [view, setView] = useState<"list" | "edit">("list");
  const { confirm, dialogProps } = useConfirmDialog();

  const list = useListState<GraphicsRecord>({
    records,
    getId: (item) => item.id,
    match: (item, query) =>
      item.title.toLowerCase().includes(query) ||
      item.slug.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query),
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    if (slugManuallyEdited) {
      return;
    }
    setForm((current) => ({ ...current, slug: slugify(current.title) }));
  }, [form.title, slugManuallyEdited]);

  const resetForm = () => {
    setForm(emptyGraphicsForm());
    setFile(null);
    setSlugManuallyEdited(false);
    setView("list");
  };

  const startNew = () => {
    setForm(emptyGraphicsForm());
    setFile(null);
    setSlugManuallyEdited(false);
    list.clearSelection();
    setView("edit");
  };

  const editRecord = (item: GraphicsRecord) => {
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
    });
    setFile(null);
    setSlugManuallyEdited(true);
    list.clearSelection();
    setView("edit");
  };

  const duplicateRecord = (item: GraphicsRecord) => {
    const title = `${item.title} (copy)`;
    setForm({
      id: null,
      slug: slugify(title),
      title,
      description: item.description,
      category: item.category,
      imageUrl: textValue(item.image_url),
      imagePath: textValue(item.image_path),
      publishedAt: item.published_at,
      detailsHtml: item.details_html,
    });
    setFile(null);
    setSlugManuallyEdited(false);
    list.clearSelection();
    setView("edit");
  };

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
        author_name: adminName.trim() || "latitibabu",
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
      resetForm();
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save graphics item.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = (item: GraphicsRecord) => {
    confirm({
      title: "Delete graphics item?",
      message: `"${item.title}" will be removed from the gallery.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("graphics_items")
          .delete()
          .eq("id", item.id);
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage("Graphics item deleted.");
        await reload();
      },
    });
  };

  const removeSelected = () => {
    const ids = list.selectedIds;
    if (ids.length === 0) return;
    confirm({
      title: `Delete ${ids.length} graphics item${ids.length === 1 ? "" : "s"}?`,
      message: "The selected graphics items will be removed from the gallery.",
      confirmLabel: "Delete selected",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("graphics_items")
          .delete()
          .in("id", ids);
        if (error) {
          setMessage(error.message);
          return;
        }
        list.clearSelection();
        setMessage(`${ids.length} item${ids.length === 1 ? "" : "s"} deleted.`);
        await reload();
      },
    });
  };

  return (
    <div className="space-y-4">
      <PanelHeader
        title="Graphics"
        subtitle="Visual work"
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
            placeholder="Search title, slug, or category..."
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
                title="No graphics items yet"
                description="Upload visual work to populate the gallery."
                action={<Button variant="primary" onClick={startNew}>New item</Button>}
              />
            ) : (
              <EmptyState
                title="No matches"
                description={`No items match "${list.query}". Try a different search.`}
              />
            )
          ) : (
            <div className="space-y-3">
              {list.paged.map((item) => (
                <ListCard
                  key={item.id}
                  title={item.title}
                  meta={item.slug}
                  pills={<StatusPill tone="info">{item.category}</StatusPill>}
                  thumbnail={
                    item.image_url?.trim() ? (
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
                    )
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
        <div className="space-y-4">
          <FormSection title={form.id ? "Update graphics item" : "Create graphics item"}>
            <ImageUploader
              file={file}
              onFileChange={setFile}
              imageUrl={form.imageUrl}
              onImageUrlChange={(value) => setForm({ ...form, imageUrl: value })}
              title={form.title}
              description={form.description}
            />
            <FormField label="Title">
              <input
                className={inputClass}
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
              />
            </FormField>
            <FormField label="Slug" hint="Auto-generated from the title. A numeric suffix is added on conflict when saving.">
              <input
                className={inputClass}
                value={form.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(true);
                  setForm({ ...form, slug: slugify(event.target.value) });
                }}
              />
            </FormField>
            <FormField label="Description">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </FormField>
            <FormField label="HTML details">
              <textarea
                className={inputClass}
                rows={8}
                value={form.detailsHtml}
                onChange={(event) =>
                  setForm({ ...form, detailsHtml: event.target.value })
                }
              />
            </FormField>
          </FormSection>

          <FormSection title="Meta" columns={2} collapsible defaultOpen={false}>
            <FormField label="Category">
              <input
                className={inputClass}
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
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
          </FormSection>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={save} disabled={busy}>
              {form.id ? "Update" : "Create"}
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
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}