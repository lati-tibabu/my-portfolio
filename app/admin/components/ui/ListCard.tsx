"use client";

import type { ReactNode } from "react";

export type ListCardProps = {
  title: ReactNode;
  meta?: ReactNode;
  pills?: ReactNode;
  thumbnail?: ReactNode;
  actions: ReactNode;
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  /** Clicking the card body opens the editor. */
  onOpen?: () => void;
};

export default function ListCard({
  title,
  meta,
  pills,
  thumbnail,
  actions,
  selectable,
  selected,
  onSelectChange,
  onOpen,
}: ListCardProps) {
  return (
    <article
      className={`rounded-xl border p-4 transition-colors ${
        selected
          ? "border-[var(--color-electric-blue)] bg-[var(--color-electric-blue)]/5"
          : "border-[var(--color-surface-border)] hover:bg-[var(--color-surface-container-low)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {selectable ? (
            <input
              type="checkbox"
              checked={!!selected}
              onChange={(event) => onSelectChange?.(event.target.checked)}
              onClick={(event) => event.stopPropagation()}
              className="h-4 w-4 shrink-0 accent-[var(--color-electric-blue)]"
              aria-label="Select row"
            />
          ) : null}
          {thumbnail ? <div className="shrink-0">{thumbnail}</div> : null}
          <button
            type="button"
            onClick={onOpen}
            disabled={!onOpen}
            className="min-w-0 text-left disabled:cursor-default"
          >
            <h3 className="truncate font-semibold text-[var(--color-on-surface)]">
              {title}
            </h3>
            {meta ? (
              <p className="truncate text-sm text-[var(--color-on-surface-variant)]">
                {meta}
              </p>
            ) : null}
            {pills ? (
              <div className="mt-2 flex flex-wrap gap-2">{pills}</div>
            ) : null}
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>
    </article>
  );
}