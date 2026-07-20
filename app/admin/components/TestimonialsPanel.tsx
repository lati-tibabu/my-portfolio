"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "../../lib/supabase/browser";
import {
  inputClass,
  labelClass,
  sectionClass,
} from "../lib/constants";
import { emptyTestimonialForm, textValue } from "../lib/forms";
import { uploadTestimonialPhoto } from "../lib/crud";
import type { TestimonialForm, TestimonialRecord } from "../lib/types";
import ImageUploader from "./ImageUploader";

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
  const [view, setView] = useState<"list" | "new" | "import">("list");
  const [page, setPage] = useState(1);
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState<{
    created: number;
    errors: string[];
  } | null>(null);

  const paged = useMemo(
    () => records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [records, page],
  );
  const pageCount = Math.max(1, Math.ceil(records.length / PAGE_SIZE));

  const resetForm = () => {
    setForm(emptyTestimonialForm());
    setFile(null);
    setView("list");
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

      setMessage(
        form.id
          ? "Testimonial updated."
          : "Testimonial created.",
      );
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

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) {
      return;
    }
    setBusy(true);
    const { error } = await supabaseBrowser
      .from("client_testimonials")
      .delete()
      .eq("id", id);
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Testimonial deleted.");
    await reload();
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
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
          Testimonials
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setView("list");
            }}
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
              setForm(emptyTestimonialForm());
              setFile(null);
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
          <button
            type="button"
            onClick={() => {
              setImportResult(null);
              setView("import");
            }}
            className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
              view === "import"
                ? "bg-[var(--color-electric-blue)] text-white hover:bg-[var(--color-electric-blue)]/90"
                : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"
            }`}
          >
            Import
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className={sectionClass}>
          <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
            Client feedback
          </h2>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Ordered by created date (newest first) on the public site.
          </p>
          <div className="mt-5 space-y-4">
            {paged.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[var(--color-surface-border)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.photo_url?.trim() ? (
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
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[var(--color-on-surface)]">
                        {item.name}
                      </h3>
                      {item.role ? (
                        <p className="text-xs text-[var(--color-on-surface-variant)]">
                          {item.role}
                        </p>
                      ) : null}
                      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                        {item.is_published ? "Published" : "Hidden"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--color-surface-border)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 hover:bg-[var(--color-surface-container-low)]"
                      onClick={() => {
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
                        setView("new");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--color-surface-border)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-error)] transition-all duration-200 hover:bg-[var(--color-error)]/10"
                      onClick={() => remove(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-[var(--color-on-surface-variant)]">
                  {item.quote_md}
                </p>
              </article>
            ))}
            {paged.length === 0 ? (
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                No testimonials yet. Click <strong>New</strong> to add one.
              </p>
            ) : null}
          </div>
          {pageCount > 1 ? (
            <div className="mt-5 flex items-center justify-between text-sm text-[var(--color-on-surface-variant)]">
              <span>
                Page {page} of {pageCount}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((c) => Math.max(1, c - 1))}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                  disabled={page >= pageCount}
                  onClick={() => setPage((c) => Math.min(pageCount, c + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
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
            <label className={labelClass}>
              Load from file
              <input
                className={inputClass}
                type="file"
                accept="application/json,.json"
                onChange={(event) =>
                  loadImportFile(event.target.files?.[0] ?? null)
                }
              />
            </label>
            <label className={labelClass}>
              JSON
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
            </label>
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
              <button
                type="button"
                className="rounded-lg bg-[var(--color-electric-blue)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[var(--color-electric-blue)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)]/20 focus:ring-offset-2 disabled:opacity-60"
                onClick={runImport}
                disabled={busy || !importText.trim()}
              >
                Import
              </button>
              <button
                type="button"
                className="rounded-lg border border-[var(--color-surface-border)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)] transition-all duration-200 hover:bg-[var(--color-surface-container-low)]"
                onClick={() => {
                  setImportText("");
                  setImportResult(null);
                  setView("list");
                }}
                disabled={busy}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={sectionClass}>
          <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
            {form.id ? "Update testimonial" : "Create testimonial"}
          </h2>
          <div className="mt-5 grid gap-4">
            <ImageUploader
              file={file}
              onFileChange={setFile}
              imageUrl={form.photoUrl}
              onImageUrlChange={(value) =>
                setForm({ ...form, photoUrl: value })
              }
              title={form.name}
              description={form.role}
            />
            <label className={labelClass}>
              Client name
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Role / company (optional)
              <input
                className={inputClass}
                value={form.role}
                placeholder="Operations Lead, Aurora Distributors"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Comment (Markdown)
              <textarea
                className={inputClass}
                rows={5}
                value={form.quoteMd}
                onChange={(e) =>
                  setForm({ ...form, quoteMd: e.target.value })
                }
              />
            </label>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Supports Markdown — e.g. **bold**, *italic*, and links.
            </p>
            <label className="flex items-center gap-3 text-sm font-medium text-[var(--color-on-surface)]">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm({ ...form, isPublished: e.target.checked })
                }
              />
              Published (visible on the home page)
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg bg-[var(--color-electric-blue)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[var(--color-electric-blue)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)]/20 focus:ring-offset-2 disabled:opacity-60"
                onClick={save}
                disabled={busy}
              >
                {form.id ? "Update" : "Create"}
              </button>
              <button
                type="button"
                className="rounded-lg border border-[var(--color-surface-border)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)] transition-all duration-200 hover:bg-[var(--color-surface-container-low)]"
                onClick={resetForm}
                disabled={busy}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}