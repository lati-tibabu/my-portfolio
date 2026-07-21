"use client";

import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { inputClass } from "../lib/constants";
import { useConfirmDialog } from "../lib/useConfirmDialog";
import { useListState } from "../lib/useListState";
import { emptyStatsForm } from "../lib/forms";
import type { StatsForm, StatsRecord } from "../lib/types";
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

export type StatsPanelProps = {
  records: StatsRecord[];
  reload: () => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
};

export default function StatsPanel({
  records,
  reload,
  busy,
  setBusy,
  setMessage,
}: StatsPanelProps) {
  const [form, setForm] = useState<StatsForm>(emptyStatsForm);
  const [view, setView] = useState<"list" | "edit">("list");
  const { confirm, dialogProps } = useConfirmDialog();

  const list = useListState<StatsRecord>({
    records,
    getId: (item) => item.id,
    match: (item, query) =>
      item.label.toLowerCase().includes(query) ||
      item.value.toLowerCase().includes(query),
    pageSize: PAGE_SIZE,
  });

  const resetForm = () => {
    setForm(emptyStatsForm());
    setView("list");
  };

  const startNew = () => {
    setForm(emptyStatsForm());
    list.clearSelection();
    setView("edit");
  };

  const editRecord = (item: StatsRecord) => {
    setForm({
      id: item.id,
      label: item.label,
      value: item.value,
      sortOrder: String(item.sort_order),
    });
    list.clearSelection();
    setView("edit");
  };

  const duplicateRecord = (item: StatsRecord) => {
    setForm({
      id: null,
      label: `${item.label} (copy)`,
      value: item.value,
      sortOrder: String(item.sort_order),
    });
    list.clearSelection();
    setView("edit");
  };

  const save = async () => {
    if (!form.label.trim() || !form.value.trim()) {
      setMessage("Stats need a label and a value.");
      return;
    }
    setBusy(true);
    try {
      const sortOrder = Number.parseInt(form.sortOrder, 10);
      const payload = {
        label: form.label.trim(),
        value: form.value.trim(),
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
        updated_at: new Date().toISOString(),
      };

      const query = form.id
        ? supabaseBrowser.from("stats").update(payload).eq("id", form.id)
        : supabaseBrowser.from("stats").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(form.id ? "Stat updated." : "Stat created.");
      resetForm();
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save stat.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = (item: StatsRecord) => {
    confirm({
      title: "Delete stat?",
      message: `"${item.label}" will be removed from the home page.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("stats")
          .delete()
          .eq("id", item.id);
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage("Stat deleted.");
        await reload();
      },
    });
  };

  const removeSelected = () => {
    const ids = list.selectedIds;
    if (ids.length === 0) return;
    confirm({
      title: `Delete ${ids.length} stat${ids.length === 1 ? "" : "s"}?`,
      message: "The selected stats will be removed from the home page.",
      confirmLabel: "Delete selected",
      onConfirm: async () => {
        const { error } = await supabaseBrowser
          .from("stats")
          .delete()
          .in("id", ids);
        if (error) {
          setMessage(error.message);
          return;
        }
        list.clearSelection();
        setMessage(`${ids.length} stat${ids.length === 1 ? "" : "s"} deleted.`);
        await reload();
      },
    });
  };

  return (
    <div className="space-y-4">
      <PanelHeader
        title="Stats"
        subtitle="Home page cards"
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
            placeholder="Search stats..."
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
                title="No stats yet"
                description="Add stat cards to display on the home page."
                action={<Button variant="primary" onClick={startNew}>New stat</Button>}
              />
            ) : (
              <EmptyState
                title="No matches"
                description={`No stats match "${list.query}". Try a different search.`}
              />
            )
          ) : (
            <div className="space-y-3">
              {list.paged.map((item) => (
                <ListCard
                  key={item.id}
                  title={item.label}
                  meta={`${item.value} · #${item.sort_order}`}
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
        <FormSection
          title={form.id ? "Update stat" : "Create stat"}
          columns={2}
        >
          <FormField label="Label" className="sm:col-span-2">
            <input
              className={inputClass}
              value={form.label}
              placeholder="Odoo apps published"
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
          </FormField>
          <FormField label="Value" hint="Shown as the large number.">
            <input
              className={inputClass}
              value={form.value}
              placeholder="12+"
              onChange={(e) => setForm({ ...form, value: e.target.value })}
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
