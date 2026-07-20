"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { DEFAULT_PLACEHOLDER_IMAGE, inputClass } from "../lib/constants";
import { useConfirmDialog } from "../lib/useConfirmDialog";
import { useListState } from "../lib/useListState";
import {
  emptyMarketplaceForm,
  joinList,
  slugify,
  splitList,
  textValue,
} from "../lib/forms";
import { ensureUniqueSlug } from "../lib/crud";
import type { MarketplaceForm, MarketplaceRecord } from "../lib/types";
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
  const [view, setView] = useState<"list" | "edit">("list");
  const { confirm, dialogProps } = useConfirmDialog();

  const list = useListState<MarketplaceRecord>({
    records,
    getId: (item) => item.id,
    match: (item, query) =>
      item.name.toLowerCase().includes(query) ||
      item.slug.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query),
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    if (slugManuallyEdited) {
      return;
    }
    setForm((current) => ({ ...current, slug: slugify(current.name) }));
  }, [form.name, slugManuallyEdited]);

  const resetForm = () => {
    setForm(emptyMarketplaceForm());
    setSlugManuallyEdited(false);
    setView("list");
  };

  const startNew = () => {
    setForm(emptyMarketplaceForm());
    setSlugManuallyEdited(false);
    list.clearSelection();
    setView("edit");
  };

  const editRecord = (item: MarketplaceRecord) => {
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
      authorName: item.author_name ?? "latitibabu",
    });
    setSlugManuallyEdited(true);
    list.clearSelection();
    setView("edit");
  };

  const duplicateRecord = (item: MarketplaceRecord) => {
    const name = `${item.name} (copy)`;
    setForm({
      id: null,
      slug: slugify(name),
      name,
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
      authorName: item.author_name ?? "latitibabu",
    });
    setSlugManuallyEdited(false);
    list.clearSelection();
    setView("edit");
  };

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
        author_name: form.authorName.trim() || "latitibabu",
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
      resetForm();
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save product.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = (item: MarketplaceRecord) => {
    confirm({
      title: "Delete product?",
      message: `"${item.name}" will be removed from the marketplace.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("marketplace_items")
          .delete()
          .eq("id", item.id);
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage("Product deleted.");
        await reload();
      },
    });
  };

  const removeSelected = () => {
    const ids = list.selectedIds;
    if (ids.length === 0) return;
    confirm({
      title: `Delete ${ids.length} product${ids.length === 1 ? "" : "s"}?`,
      message: "The selected products will be removed from the marketplace.",
      confirmLabel: "Delete selected",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("marketplace_items")
          .delete()
          .in("id", ids);
        if (error) {
          setMessage(error.message);
          return;
        }
        list.clearSelection();
        setMessage(`${ids.length} product${ids.length === 1 ? "" : "s"} deleted.`);
        await reload();
      },
    });
  };

  return (
    <div className="space-y-4">
      <PanelHeader
        title="Products"
        subtitle="Apps and themes"
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
            placeholder="Search name, slug, or category..."
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
                title="No products yet"
                description="Add Odoo apps and themes to the marketplace."
                action={<Button variant="primary" onClick={startNew}>New product</Button>}
              />
            ) : (
              <EmptyState
                title="No matches"
                description={`No products match "${list.query}". Try a different search.`}
              />
            )
          ) : (
            <div className="space-y-3">
              {list.paged.map((item) => (
                <ListCard
                  key={item.id}
                  title={item.name}
                  meta={`${item.slug} · ${item.price}`}
                  pills={<StatusPill tone="info">{item.category}</StatusPill>}
                  thumbnail={
                    item.cover_image_url?.trim() &&
                    item.cover_image_url.trim() !== DEFAULT_PLACEHOLDER_IMAGE ? (
                      <Image
                        src={item.cover_image_url.trim()}
                        alt={item.name}
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
          <FormSection
            title={form.id ? "Update product" : "Create product"}
            description="Core listing content shown on the product page."
          >
            <FormField label="Name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </FormField>
            <FormField
              label="Slug"
              hint="Auto-generated from the name. A numeric suffix is added on conflict when saving."
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

          <FormSection
            title="Pricing & category"
            columns={2}
            description="How the product is classified and priced."
          >
            <FormField label="Price">
              <input
                className={inputClass}
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
              />
            </FormField>
            <FormField label="Category">
              <input
                className={inputClass}
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
              />
            </FormField>
            <FormField label="Cover image URL" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.coverImageUrl}
                onChange={(event) =>
                  setForm({ ...form, coverImageUrl: event.target.value })
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
          </FormSection>

          <FormSection
            title="Technical"
            columns={2}
            collapsible
            defaultOpen={false}
            description="Versioning and compatibility metadata."
          >
            <FormField label="Version">
              <input
                className={inputClass}
                value={form.version}
                onChange={(event) =>
                  setForm({ ...form, version: event.target.value })
                }
              />
            </FormField>
            <FormField label="License">
              <input
                className={inputClass}
                value={form.license}
                onChange={(event) =>
                  setForm({ ...form, license: event.target.value })
                }
              />
            </FormField>
            <FormField label="Technical name">
              <input
                className={inputClass}
                value={form.technicalName}
                onChange={(event) =>
                  setForm({ ...form, technicalName: event.target.value })
                }
              />
            </FormField>
            <FormField label="Website">
              <input
                className={inputClass}
                value={form.website}
                onChange={(event) =>
                  setForm({ ...form, website: event.target.value })
                }
              />
            </FormField>
            <FormField label="Compatibility">
              <input
                className={inputClass}
                value={form.compatibility}
                onChange={(event) =>
                  setForm({ ...form, compatibility: event.target.value })
                }
              />
            </FormField>
            <FormField label="Warning">
              <input
                className={inputClass}
                value={form.warning}
                onChange={(event) =>
                  setForm({ ...form, warning: event.target.value })
                }
              />
            </FormField>
          </FormSection>

          <FormSection
            title="Links & support"
            columns={2}
            collapsible
            defaultOpen={false}
            description="External links shown on the product page."
          >
            <FormField label="Live preview URL">
              <input
                className={inputClass}
                value={form.livePreview}
                onChange={(event) =>
                  setForm({ ...form, livePreview: event.target.value })
                }
              />
            </FormField>
            <FormField label="Support URL">
              <input
                className={inputClass}
                value={form.supportUrl}
                onChange={(event) =>
                  setForm({ ...form, supportUrl: event.target.value })
                }
              />
            </FormField>
            <FormField label="Contact email">
              <input
                className={inputClass}
                value={form.contactEmail}
                onChange={(event) =>
                  setForm({ ...form, contactEmail: event.target.value })
                }
              />
            </FormField>
            <FormField label="Listing URL">
              <input
                className={inputClass}
                value={form.link}
                onChange={(event) =>
                  setForm({ ...form, link: event.target.value })
                }
              />
            </FormField>
            <FormField label="Downloads">
              <input
                className={inputClass}
                value={form.downloads}
                onChange={(event) =>
                  setForm({ ...form, downloads: event.target.value })
                }
              />
            </FormField>
            <FormField label="Upgrade URL">
              <input
                className={inputClass}
                value={form.upgradeUrl}
                onChange={(event) =>
                  setForm({ ...form, upgradeUrl: event.target.value })
                }
              />
            </FormField>
          </FormSection>

          <FormSection
            title="Lists"
            collapsible
            defaultOpen={false}
            description="Comma-separated lists rendered as bullets on the product page."
          >
            <FormField label="Highlights" hint="Comma separated.">
              <textarea
                className={inputClass}
                rows={3}
                value={form.highlightsText}
                onChange={(event) =>
                  setForm({ ...form, highlightsText: event.target.value })
                }
              />
            </FormField>
            <FormField label="Screenshots" hint="Comma separated image URLs.">
              <textarea
                className={inputClass}
                rows={3}
                value={form.screenshotsText}
                onChange={(event) =>
                  setForm({ ...form, screenshotsText: event.target.value })
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