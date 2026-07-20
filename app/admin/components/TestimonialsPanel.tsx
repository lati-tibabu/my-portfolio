"use client";

import { useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { inputClass, sectionClass } from "../lib/constants";
import { useConfirmDialog } from "../lib/useConfirmDialog";
import { useListState } from "../lib/useListState";
import { emptyTestimonialForm, textValue } from "../lib/forms";
import { uploadTestimonialPhoto } from "../lib/crud";
import type { TestimonialForm, TestimonialRecord } from "../lib/types";
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

export type TestimonialsPanelProps = {
  records: TestimonialRecord[];
  reload: () => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
};

export default function TestimonialsPanel({
  records,
  reload,
  busy,
  setBusy,
  setMessage,
}: TestimonialsPanelProps) {
  const [form, setForm] = useState<TestimonialForm>(emptyTestimonialForm);
  const [file, setFile] = useState<File | null>(null);
  const [view, setView] = useState<"list" | "edit" | "import">("list");
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState<{
    created: number;
    errors: string[];
  } | null>(null);
  const { confirm, dialogProps } = useConfirmDialog();

  const list = useListState<TestimonialRecord>({
    records,
    getId: (item) => item.id,
    match: (item, query) =>
      item.name.toLowerCase().includes(query) ||
      (item.role ?? "").toLowerCase().includes(query),
    pageSize: PAGE_SIZE,
  });

  const resetForm = () => {
    setForm(emptyTestimonialForm());
    setFile(null);
    setView("list");
  };

  const startNew = () => {
    setForm(emptyTestimonialForm());
    setFile(null);
    list.clearSelection();
    setView("edit");
  };

  const editRecord = (item: TestimonialRecord) => {
    setForm({
      id: item.id,
      name: item.name,
      role: textValue(item.role),
      photoUrl: textValue(item.photo_url),
      photoPath: textValue(item.photo_path),
      quoteMd: item.quote_md,
      isPublished: item.is_published,
    });
    setFile(null);
    list.clearSelection();
    setView("edit");
  };

  const duplicateRecord = (item: TestimonialRecord) => {
    setForm({
      id: null,
      name: `${item.name} (copy)`,
      role: textValue(item.role),
      photoUrl: textValue(item.photo_url),
      photoPath: textValue(item.photo_path),
      quoteMd: item.quote_md,
      isPublished: item.is_published,
    });
    setFile(null);
    list.clearSelection();
    setView("edit");
  };

  const save = async () => {
    if (!form.name.trim() || !form.quoteMd.trim()) {
      setMessage("Testimonials need a name and a comment.");
      return;
    }
    setBusy(true);
    try {
      let photoUrl = form.photoUrl;
      let photoPath = form.photoPath;

      if (file) {
        const uploaded = await uploadTestimonialPhoto(file);
        photoUrl = uploaded.imageUrl;
        photoPath = uploaded.imagePath;
      }

      const payload = {
        name: form.name.trim(),
        role: form.role.trim() || null,
        photo_url: photoUrl.trim() || null,
        photo_path: photoPath || null,
        quote_md: form.quoteMd,
        is_published: form.isPublished,
      };

      const query = form.id
        ? supabaseBrowser
            .from("client_testimonials")
            .update(payload)
            .eq("id", form.id)
        : supabaseBrowser.from("client_testimonials").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(form.id ? "Testimonial updated." : "Testimonial created.");
      resetForm();
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save testimonial.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = (item: TestimonialRecord) => {
    confirm({
      title: "Delete testimonial?",
      message: `"${item.name}" will be removed from the public site.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("client_testimonials")
          .delete()
          .eq("id", item.id);
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage("Testimonial deleted.");
        await reload();
      },
    });
  };

  const removeSelected = () => {
    const ids = list.selectedIds;
    if (ids.length === 0) return;
    confirm({
      title: `Delete ${ids.length} testimonial${ids.length === 1 ? "" : "s"}?`,
      message: "The selected testimonials will be removed from the public site.",
      confirmLabel: "Delete selected",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("client_testimonials")
          .delete()
          .in("id", ids);
        if (error) {
          setMessage(error.message);
          return;
        }
        list.clearSelection();
        setMessage(`${ids.length} testimonial${ids.length === 1 ? "" : "s"} deleted.`);
        await reload();
      },
    });
  };

  const loadImportFile = (selected: File | null) => {
    if (!selected) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImportText(String(reader.result ?? ""));
      setImportResult(null);
    };
    reader.readAsText(selected);
  };

  const runImport = async () => {
    setImportResult(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(importText);
    } catch {
      setImportResult({ created: 0, errors: ["Invalid JSON."] });
      return;
    }

    if (!Array.isArray(parsed)) {
      setImportResult({
        created: 0,
        errors: ["Top-level JSON must be an array of testimonials."],
      });
      return;
    }

    const errors: string[] = [];
    const rows: {
      name: string;
      role: string | null;
      photo_url: string | null;
      quote_md: string;
      is_published: boolean;
    }[] = [];

    parsed.forEach((entry, index) => {
      const line = `Row ${index + 1}`;
      if (!entry || typeof entry !== "object") {
        errors.push(`${line}: not an object.`);
        return;
      }
      const e = entry as Record<string, unknown>;
      const name = String(e.name ?? "").trim();
      const quote = String(
        e.quote_md ?? e.quote ?? e.comment ?? "",
      ).trim();
      if (!name) {
        errors.push(`${line}: missing "name".`);
        return;
      }
      if (!quote) {
        errors.push(`${line}: missing "quote_md".`);
        return;
      }
      const role = String(e.role ?? "").trim() || null;
      const photo = String(e.photo_url ?? e.photo ?? "").trim() || null;
      const isPublished =
        e.is_published === undefined ? true : Boolean(e.is_published);
      rows.push({ name, role, photo_url: photo, quote_md: quote, is_published: isPublished });
    });

    if (rows.length === 0) {
      setImportResult({
        created: 0,
        errors:
          errors.length > 0
            ? errors
            : ["No valid testimonials to import."],
      });
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabaseBrowser
        .from("client_testimonials")
        .insert(rows);
      if (error) {
        throw error;
      }
      setImportResult({ created: rows.length, errors });
      setImportText("");
      setMessage(
        `Imported ${rows.length} testimonial${rows.length === 1 ? "" : "s"}.`,
      );
      await reload();
      setView("list");
    } catch (error) {
      setImportResult({
        created: 0,
        errors: [
          error instanceof Error ? error.message : "Import failed.",
        ],
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <PanelHeader
        title="Testimonials"
        subtitle="Client feedback"
        count={records.length}
        views={[
          { key: "list", label: "List" },
          { key: "edit", label: "New" },
          { key: "import", label: "Import" },
        ]}
        view={view}
        onViewChange={(next) => {
          if (next === "edit") startNew();
          else if (next === "import") {
            setImportResult(null);
            setView("import");
          } else setView("list");
        }}
      />

      {view === "list" ? (
        <div className="space-y-4">
          <Toolbar
            query={list.query}
            onQueryChange={list.setQuery}
            resultCount={list.filtered.length}
            total={records.length}
            placeholder="Search by name or role..."
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
                title="No testimonials yet"
                description="Collect client feedback and publish it on the home page."
                action={<Button variant="primary" onClick={startNew}>New testimonial</Button>}
              />
            ) : (
              <EmptyState
                title="No matches"
                description={`No testimonials match "${list.query}". Try a different search.`}
              />
            )
          ) : (
            <div className="space-y-3">
              {list.paged.map((item) => (
                <ListCard
                  key={item.id}
                  title={item.name}
                  meta={item.role || undefined}
                  pills={
                    <StatusPill tone={item.is_published ? "success" : "neutral"}>
                      {item.is_published ? "Published" : "Hidden"}
                    </StatusPill>
                  }
                  thumbnail={
                    item.photo_url?.trim() ? (
                      <Image
                        src={item.photo_url.trim()}
                        alt={item.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="h-12 w-12 rounded-full border border-[var(--color-surface-border)] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] text-xs font-semibold text-[var(--color-on-surface-variant)]">
                        {item.name.slice(0, 1).toUpperCase()}
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
      ) : view === "import" ? (
        <div className={sectionClass}>
          <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
            Import testimonials
          </h2>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Paste a JSON array of testimonials (or load a <code>.json</code>{" "}
            file). Each entry is inserted into Supabase directly.
          </p>
          <div className="mt-5 grid gap-4">
            <FormField label="Load from file">
              <input
                className={inputClass}
                type="file"
                accept="application/json,.json"
                onChange={(event) =>
                  loadImportFile(event.target.files?.[0] ?? null)
                }
              />
            </FormField>
            <FormField label="JSON">
              <textarea
                className={`${inputClass} font-mono text-xs`}
                rows={12}
                value={importText}
                placeholder={`[\n  {\n    "name": "Sara Bekele",\n    "role": "Operations Lead",\n    "quote_md": "Great work. **Highly recommended.**",\n    "photo_url": "",\n    "is_published": true\n  }\n]`}
                onChange={(event) => {
                  setImportText(event.target.value);
                  setImportResult(null);
                }}
              />
            </FormField>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Required: <code>name</code>, <code>quote_md</code> (Markdown).
              Optional: <code>role</code>, <code>photo_url</code> (or{" "}
              <code>photo</code>), <code>is_published</code> (defaults to true).
            </p>

            {importResult ? (
              <div className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4 text-sm">
                {importResult.created > 0 ? (
                  <p className="font-semibold text-[var(--color-success-teal)]">
                    Imported {importResult.created} testimonial
                    {importResult.created === 1 ? "" : "s"}.
                  </p>
                ) : null}
                {importResult.errors.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--color-error)]">
                    {importResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={runImport}
                disabled={busy || !importText.trim()}
              >
                Import
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setImportText("");
                  setImportResult(null);
                  setView("list");
                }}
                disabled={busy}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <FormSection title={form.id ? "Update testimonial" : "Create testimonial"}>
          <ImageUploader
            file={file}
            onFileChange={setFile}
            imageUrl={form.photoUrl}
            onImageUrlChange={(value) => setForm({ ...form, photoUrl: value })}
            title={form.name}
            description={form.role}
          />
          <FormField label="Client name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>
          <FormField label="Role / company (optional)">
            <input
              className={inputClass}
              value={form.role}
              placeholder="Operations Lead, Aurora Distributors"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </FormField>
          <FormField
            label="Comment (Markdown)"
            hint="Supports Markdown — e.g. **bold**, *italic*, and links."
          >
            <textarea
              className={inputClass}
              rows={5}
              value={form.quoteMd}
              onChange={(e) => setForm({ ...form, quoteMd: e.target.value })}
            />
          </FormField>
          <label className="flex items-center gap-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-3 text-sm font-medium text-[var(--color-on-surface)]">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            Published (visible on the home page)
          </label>
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
        </FormSection>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}