"use client";

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  pageCount,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="mt-5 flex items-center justify-between text-sm text-[var(--color-on-surface-variant)]">
      <span>
        Page {page} of {pageCount}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded border border-[var(--color-surface-border)] px-3 py-1 transition-colors hover:bg-[var(--color-surface-container-low)] disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Prev
        </button>
        <button
          type="button"
          className="rounded border border-[var(--color-surface-border)] px-3 py-1 transition-colors hover:bg-[var(--color-surface-container-low)] disabled:opacity-50"
          disabled={page >= pageCount}
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}