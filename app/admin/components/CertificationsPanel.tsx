"use client";

import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { inputClass, sectionClass } from "../lib/constants";
import { useConfirmDialog } from "../lib/useConfirmDialog";
import { useListState } from "../lib/useListState";
import { emptyCertificationForm, textValue } from "../lib/forms";
import type { CertificationForm, CertificationRecord } from "../lib/types";
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
  Toolbar,
} from "./ui";

const PAGE_SIZE = 8;

export type CertificationsPanelProps = {
  records: CertificationRecord[];
  reload: () => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
};

export default function CertificationsPanel({
  records,
  reload,
  busy,
  setBusy,
  setMessage,
}: CertificationsPanelProps) {
  const [form, setForm] = useState<CertificationForm>(emptyCertificationForm);
  const [view, setView] = useState<"list" | "edit" | "import">("list");
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState<{
    created: number;
    errors: string[];
  } | null>(null);
  const { confirm, dialogProps } = useConfirmDialog();

  const list = useListState<CertificationRecord>({
    records,
    getId: (item) => item.id,
    match: (item, query) =>
      item.title.toLowerCase().includes(query) ||
      (item.issuer ?? "").toLowerCase().includes(query),
    pageSize: PAGE_SIZE,
  });

  const resetForm = () => {
    setForm(emptyCertificationForm());
    setView("list");
  };

  const startNew = () => {
    setForm(emptyCertificationForm());
    list.clearSelection();
    setView("edit");
  };

  const editRecord = (item: CertificationRecord) => {
    setForm({
      id: item.id,
      title: item.title,
      issuer: textValue(item.issuer),
      url: textValue(item.url),
      issuedAt: textValue(item.issued_at),
      sortOrder: String(item.sort_order),
    });
    list.clearSelection();
    setView("edit");
  };

  const duplicateRecord = (item: CertificationRecord) => {
    setForm({
      id: null,
      title: `${item.title} (copy)`,
      issuer: textValue(item.issuer),
      url: textValue(item.url),
      issuedAt: textValue(item.issued_at),
      sortOrder: String(item.sort_order),
    });
    list.clearSelection();
    setView("edit");
  };

  const save = async () => {
    if (!form.title.trim()) {
      setMessage("Certifications need a title.");
      return;
    }
    setBusy(true);
    try {
      const sortOrder = Number.parseInt(form.sortOrder, 10);
      const payload = {
        title: form.title.trim(),
        issuer: form.issuer.trim() || null,
        url: form.url.trim() || null,
        issued_at: form.issuedAt.trim() || null,
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
        updated_at: new Date().toISOString(),
      };

      const query = form.id
        ? supabaseBrowser
            .from("certifications")
            .update(payload)
            .eq("id", form.id)
        : supabaseBrowser.from("certifications").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(form.id ? "Certification updated." : "Certification created.");
      resetForm();
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save certification.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = (item: CertificationRecord) => {
    confirm({
      title: "Delete certification?",
      message: `"${item.title}" will be removed from the public site.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("certifications")
          .delete()
          .eq("id", item.id);
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage("Certification deleted.");
        await reload();
      },
    });
  };

  const removeSelected = () => {
    const ids = list.selectedIds;
    if (ids.length === 0) return;
    confirm({
      title: `Delete ${ids.length} certification${ids.length === 1 ? "" : "s"}?`,
      message: "The selected certifications will be removed from the public site.",
      confirmLabel: "Delete selected",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("certifications")
          .delete()
          .in("id", ids);
        if (error) {
          setMessage(error.message);
          return;
        }
        list.clearSelection();
        setMessage(`${ids.length} certification${ids.length === 1 ? "" : "s"} deleted.`);
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
        errors: ["Top-level JSON must be an array of certifications."],
      });
      return;
    }

    const errors: string[] = [];
    const rows: {
      title: string;
      issuer: string | null;
      url: string | null;
      issued_at: string | null;
      sort_order: number;
    }[] = [];

    parsed.forEach((entry, index) => {
      const line = `Row ${index + 1}`;
      if (!entry || typeof entry !== "object") {
        errors.push(`${line}: not an object.`);
        return;
      }
      const e = entry as Record<string, unknown>;
      const title = String(e.title ?? "").trim();
      if (!title) {
        errors.push(`${line}: missing "title".`);
        return;
      }
      const issuer = String(e.issuer ?? "").trim() || null;
      const url = String(e.url ?? e.href ?? "").trim() || null;
      const issuedAt = String(
        e.issued_at ?? e.date ?? e.issuedAt ?? "",
      ).trim() || null;
      const sortOrder = Number(e.sort_order);
      rows.push({
        title,
        issuer,
        url,
        issued_at: issuedAt,
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      });
    });

    if (rows.length === 0) {
      setImportResult({
        created: 0,
        errors:
          errors.length > 0 ? errors : ["No valid certifications to import."],
      });
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabaseBrowser
        .from("certifications")
        .insert(rows);
      if (error) {
        throw error;
      }
      setImportResult({ created: rows.length, errors });
      setImportText("");
      setMessage(
        `Imported ${rows.length} certification${rows.length === 1 ? "" : "s"}.`,
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
        title="Certifications"
        subtitle="Credentials"
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
            placeholder="Search certifications..."
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
                title="No certifications yet"
                description="Add credentials to list on the home and about pages."
                action={<Button variant="primary" onClick={startNew}>New certification</Button>}
              />
            ) : (
              <EmptyState
                title="No matches"
                description={`No certifications match "${list.query}". Try a different search.`}
              />
            )
          ) : (
            <div className="space-y-3">
              {list.paged.map((item) => (
                <ListCard
                  key={item.id}
                  title={item.title}
                  meta={
                    [item.issuer, item.issued_at, `#${item.sort_order}`]
                      .filter(Boolean)
                      .join(" · ") || `#${item.sort_order}`
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
            Import certifications
          </h2>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Paste a JSON array of certifications (or load a{" "}
            <code>.json</code> file). Each entry is inserted into Supabase
            directly.
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
                placeholder={`[\n  {\n    "title": "Odoo Functional Certification",\n    "issuer": "Odoo S.A.",\n    "url": "https://example.com/cert",\n    "issued_at": "2024-03-01",\n    "sort_order": 0\n  }\n]`}
                onChange={(event) => {
                  setImportText(event.target.value);
                  setImportResult(null);
                }}
              />
            </FormField>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Required: <code>title</code>. Optional: <code>issuer</code>,{" "}
              <code>url</code> (or <code>href</code>),{" "}
              <code>issued_at</code> (or <code>date</code>, e.g.{" "}
              <code>2024-03-01</code>), <code>sort_order</code> (defaults to 0).
            </p>

            {importResult ? (
              <div className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4 text-sm">
                {importResult.created > 0 ? (
                  <p className="font-semibold text-[var(--color-success-teal)]">
                    Imported {importResult.created} certification
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
        <FormSection
          title={form.id ? "Update certification" : "Create certification"}
          columns={2}
        >
          <FormField label="Title" className="sm:col-span-2">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormField>
          <FormField label="Issuer (optional)">
            <input
              className={inputClass}
              value={form.issuer}
              placeholder="Kaggle, freeCodeCamp"
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            />
          </FormField>
          <FormField label="Date (optional)">
            <input
              className={inputClass}
              type="date"
              value={form.issuedAt}
              onChange={(e) => setForm({ ...form, issuedAt: e.target.value })}
            />
          </FormField>
          <FormField label="URL (optional)" className="sm:col-span-2">
            <input
              className={inputClass}
              value={form.url}
              placeholder="https://..."
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </FormField>
          <FormField label="Sort order" hint="Lower numbers appear first.">
            <input
              className={inputClass}
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </FormField>

          <div className="flex flex-wrap gap-3 sm:col-span-2">
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