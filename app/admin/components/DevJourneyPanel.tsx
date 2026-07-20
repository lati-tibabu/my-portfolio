"use client";

import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabase/browser";
import {
  inputClass,
  labelClass,
  sectionClass,
} from "../lib/constants";
import {
  emptyDevJourneyForm,
  linksToText,
  parseLinksText,
} from "../lib/forms";
import type { DevJourneyForm, DevJourneyRecord } from "../lib/types";

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
  const [view, setView] = useState<"list" | "edit">("list");

  const resetForm = () => {
    setForm(emptyDevJourneyForm());
    setView("list");
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

  const remove = async (id: string) => {
    if (!confirm("Delete this dev journey item?")) {
      return;
    }
    setBusy(true);
    const { error } = await supabaseBrowser
      .from("dev_journey_items")
      .delete()
      .eq("id", id);
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Dev journey item deleted.");
    await reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
          Dev Journey
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetForm}
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
              setForm(emptyDevJourneyForm());
              setView("edit");
            }}
            className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
              view === "edit"
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
            Project highlights
          </h2>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Ordered by sort order (lowest first) on the public site.
          </p>
          <div className="mt-5 space-y-4">
            {records.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[var(--color-surface-border)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                        #{item.sort_order}
                      </span>
                      <h3 className="font-semibold text-[var(--color-on-surface)]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--color-on-surface-variant)]">
                      {item.description}
                    </p>
                    {(item.links ?? []).length > 0 && (
                      <p className="mt-1 text-[11px] text-[var(--color-on-surface-variant)]">
                        {(item.links ?? [])
                          .map((link) => link.label ?? link.url)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--color-surface-border)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 hover:bg-[var(--color-surface-container-low)]"
                      onClick={() => {
                        setForm({
                          id: item.id,
                          title: item.title,
                          description: item.description,
                          linksText: linksToText(item.links),
                          sortOrder: String(item.sort_order),
                        });
                        setView("edit");
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
              </article>
            ))}
            {records.length === 0 ? (
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                No items yet. Click <strong>New</strong> to add one.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className={sectionClass}>
          <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
            {form.id ? "Update dev journey item" : "Create dev journey item"}
          </h2>
          <div className="mt-5 grid gap-4">
            <label className={labelClass}>
              Title
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Description
              <textarea
                className={inputClass}
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>
            <label className={labelClass}>
              Links (optional)
              <textarea
                className={`${inputClass} font-mono text-xs`}
                rows={4}
                value={form.linksText}
                placeholder={"Live Demo | https://example.com\nBackend | https://npmjs.com/...\nhttps://bare-url.example"}
                onChange={(e) =>
                  setForm({ ...form, linksText: e.target.value })
                }
              />
            </label>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              One link per line as <code>Label | URL</code>. The label is
              optional — a bare URL renders as &ldquo;View project&rdquo;.
            </p>
            <label className={labelClass}>
              Sort order
              <input
                className={inputClass}
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: e.target.value })
                }
              />
            </label>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Lower numbers appear first.
            </p>
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