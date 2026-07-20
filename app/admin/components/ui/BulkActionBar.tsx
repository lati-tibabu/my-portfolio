"use client";

import type { ReactNode } from "react";

export type BulkActionBarProps = {
  selectedCount: number;
  onClear: () => void;
  children?: ReactNode;
};

export default function BulkActionBar({
  selectedCount,
  onClear,
  children,
}: BulkActionBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="sticky top-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-electric-blue)] bg-[var(--color-electric-blue)]/10 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3 text-sm text-[var(--color-on-surface)]">
        <span className="font-semibold">{selectedCount} selected</span>
        <button
          type="button"
          onClick={onClear}
          className="text-xs uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
        >
          Clear
        </button>
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}