"use client";

import type { ReactNode } from "react";

export type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] px-6 py-12 text-center">
      <div className="text-2xl text-[var(--color-on-surface-variant)]">
        {icon ?? "∅"}
      </div>
      <h3 className="mt-3 font-heading text-[18px] text-[var(--color-on-surface)]">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-[var(--color-on-surface-variant)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}