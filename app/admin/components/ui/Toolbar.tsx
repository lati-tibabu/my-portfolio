"use client";

import type { ReactNode } from "react";
import { inputClass } from "../../lib/constants";

export type ToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount?: number;
  total?: number;
  children?: ReactNode;
  placeholder?: string;
};

export default function Toolbar({
  query,
  onQueryChange,
  resultCount,
  total,
  children,
  placeholder = "Search...",
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-on-surface-variant)]">
          ⌕
        </span>
        <input
          className={`${inputClass} pl-9 pr-9`}
          value={query}
          placeholder={placeholder}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-xs text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </div>
      {children}
      {resultCount !== undefined && total !== undefined ? (
        <span className="text-xs text-[var(--color-on-surface-variant)]">
          {query
            ? `${resultCount} of ${total} match`
            : `${total} total`}
        </span>
      ) : null}
    </div>
  );
}