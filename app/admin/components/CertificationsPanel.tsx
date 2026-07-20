"use client";

import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabase/browser";
import {
  inputClass,
  labelClass,
  sectionClass,
} from "../lib/constants";
import { emptyCertificationForm, textValue } from "../lib/forms";
import type { CertificationForm, CertificationRecord } from "../lib/types";

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
  const [view, setView] = useState<"list" | "edit">("list");

  const resetForm = () => {
    setForm(emptyCertificationForm());
    setView("list");
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

  const remove = async (id: string) => {
    if (!confirm("Delete this certification?")) {
      return;
    }
    setBusy(true);
    const { error } = await supabaseBrowser
      .from("certifications")
      .delete()
      .eq("id", id);
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Certification deleted.");
    await reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
          Certifications
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
              setForm(emptyCertificationForm());
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
            Credentials
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
                    {(item.issuer || item.issued_at) && (
                      <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                        {[item.issuer, item.issued_at].filter(Boolean).join(" · ")}
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
                          issuer: textValue(item.issuer),
                          url: textValue(item.url),
                          issuedAt: textValue(item.issued_at),
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
                No certifications yet. Click <strong>New</strong> to add one.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className={sectionClass}>
          <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
            {form.id ? "Update certification" : "Create certification"}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Issuer (optional)
                <input
                  className={inputClass}
                  value={form.issuer}
                  placeholder="Kaggle, freeCodeCamp"
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                />
              </label>
              <label className={labelClass}>
                Date (optional)
                <input
                  className={inputClass}
                  type="date"
                  value={form.issuedAt}
                  onChange={(e) =>
                    setForm({ ...form, issuedAt: e.target.value })
                  }
                />
              </label>
            </div>
            <label className={labelClass}>
              URL (optional)
              <input
                className={inputClass}
                value={form.url}
                placeholder="https://..."
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </label>
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