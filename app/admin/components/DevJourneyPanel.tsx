"use client";

import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { inputClass, sectionClass } from "../lib/constants";
import { useConfirmDialog } from "../lib/useConfirmDialog";
import { useListState } from "../lib/useListState";
import {
  emptyDevJourneyForm,
  linksToText,
  parseLinksText,
} from "../lib/forms";
import type { DevJourneyForm, DevJourneyRecord } from "../lib/types";
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

export type DevJourneyPanelProps = {
  records: DevJourneyRecord[];
  reload: () => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
};

export default function DevJourneyPanel({
  records,
  reload,
  busy,
  setBusy,
  setMessage,
}: DevJourneyPanelProps) {
  const [form, setForm] = useState<DevJourneyForm>(emptyDevJourneyForm);
  const [view, setView] = useState<"list" | "edit" | "import">("list");
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState<{
    created: number;
    errors: string[];
  } | null>(null);
  const { confirm, dialogProps } = useConfirmDialog();

  const list = useListState<DevJourneyRecord>({
    records,
    getId: (item) => item.id,
    match: (item, query) => item.title.toLowerCase().includes(query),
    pageSize: PAGE_SIZE,
  });

  const resetForm = () => {
    setForm(emptyDevJourneyForm());
    setView("list");
  };

  const startNew = () => {
    setForm(emptyDevJourneyForm());
    list.clearSelection();
    setView("edit");
  };

  const editRecord = (item: DevJourneyRecord) => {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      linksText: linksToText(item.links),
      sortOrder: String(item.sort_order),
    });
    list.clearSelection();
    setView("edit");
  };

  const duplicateRecord = (item: DevJourneyRecord) => {
    setForm({
      id: null,
      title: `${item.title} (copy)`,
      description: item.description,
      linksText: linksToText(item.links),
      sortOrder: String(item.sort_order),
    });
    list.clearSelection();
    setView("edit");
  };

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setMessage("Dev journey items need a title and description.");
      return;
    }
    setBusy(true);
    try {
      const sortOrder = Number.parseInt(form.sortOrder, 10);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        links: parseLinksText(form.linksText),
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
        updated_at: new Date().toISOString(),
      };

      const query = form.id
        ? supabaseBrowser
            .from("dev_journey_items")
            .update(payload)
            .eq("id", form.id)
        : supabaseBrowser.from("dev_journey_items").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(form.id ? "Dev journey item updated." : "Dev journey item created.");
      resetForm();
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save dev journey item.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = (item: DevJourneyRecord) => {
    confirm({
      title: "Delete dev journey item?",
      message: `"${item.title}" will be removed from the public site.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("dev_journey_items")
          .delete()
          .eq("id", item.id);
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage("Dev journey item deleted.");
        await reload();
      },
    });
  };

  const removeSelected = () => {
    const ids = list.selectedIds;
    if (ids.length === 0) return;
    confirm({
      title: `Delete ${ids.length} item${ids.length === 1 ? "" : "s"}?`,
      message: "The selected dev journey items will be removed from the public site.",
      confirmLabel: "Delete selected",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("dev_journey_items")
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

  const normalizeLinksEntry = (raw: unknown) => {
    if (!Array.isArray(raw)) return null;
    const links: { label: string; url: string }[] = [];
    raw.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        if (typeof entry === "string" && entry.trim()) {
          links.push({ label: "View project", url: entry.trim() });
        }
        return;
      }
      const e = entry as Record<string, unknown>;
      const url = String(e.url ?? e.href ?? "").trim();
      if (!url) return;
      const label = String(e.label ?? e.text ?? "").trim() || "View project";
      links.push({ label, url });
    });
    return links.length > 0 ? links : null;
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
        errors: ["Top-level JSON must be an array of dev journey items."],
      });
      return;
    }

    const errors: string[] = [];
    const rows: {
      title: string;
      description: string;
      links: { label: string; url: string }[] | null;
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
      const description = String(e.description ?? "").trim();
      if (!title) {
        errors.push(`${line}: missing "title".`);
        return;
      }
      if (!description) {
        errors.push(`${line}: missing "description".`);
        return;
      }
      const sortOrder = Number(e.sort_order);
      rows.push({
        title,
        description,
        links: normalizeLinksEntry(e.links),
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      });
    });

    if (rows.length === 0) {
      setImportResult({
        created: 0,
        errors:
          errors.length > 0 ? errors : ["No valid dev journey items to import."],
      });
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabaseBrowser
        .from("dev_journey_items")
        .insert(rows);
      if (error) {
        throw error;
      }
      setImportResult({ created: rows.length, errors });
      setImportText("");
      setMessage(
        `Imported ${rows.length} dev journey item${rows.length === 1 ? "" : "s"}.`,
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
        title="Dev Journey"
        subtitle="Project highlights"
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
            placeholder="Search project highlights..."
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
                title="No dev journey items yet"
                description="Add the projects you want to showcase on the home and about pages."
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
                  meta={`#${item.sort_order} · ${item.description.slice(0, 80)}${item.description.length > 80 ? "…" : ""}`}
                  pills={
                    (item.links ?? []).length > 0 ? (
                      <StatusPill tone="info">
                        {(item.links ?? []).length} link{(item.links ?? []).length === 1 ? "" : "s"}
                      </StatusPill>
                    ) : null
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
            Import dev journey items
          </h2>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Paste a JSON array of dev journey items (or load a{" "}
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
                placeholder={`[\n  {\n    "title": "Marketplace ERP App",\n    "description": "Built a multi-vendor Odoo marketplace.",\n    "links": [\n      { "label": "Live Demo", "url": "https://example.com" }\n    ],\n    "sort_order": 0\n  }\n]`}
                onChange={(event) => {
                  setImportText(event.target.value);
                  setImportResult(null);
                }}
              />
            </FormField>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Required: <code>title</code>, <code>description</code>. Optional:{" "}
              <code>links</code> (array of <code>{"{ label, url }"}</code> or{" "}
              <code>{"{ label, href }"}</code> objects or bare URL strings),{" "}
              <code>sort_order</code> (defaults to 0).
            </p>

            {importResult ? (
              <div className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4 text-sm">
                {importResult.created > 0 ? (
                  <p className="font-semibold text-[var(--color-success-teal)]">
                    Imported {importResult.created} dev journey item
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
        <FormSection title={form.id ? "Update dev journey item" : "Create dev journey item"}>
          <FormField label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormField>
          <FormField label="Description">
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </FormField>
          <FormField
            label="Links (optional)"
            hint={'One link per line as "Label | URL". A bare URL renders as "View project".'}
          >
            <textarea
              className={`${inputClass} font-mono text-xs`}
              rows={4}
              value={form.linksText}
              placeholder={"Live Demo | https://example.com\nhttps://bare-url.example"}
              onChange={(e) => setForm({ ...form, linksText: e.target.value })}
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