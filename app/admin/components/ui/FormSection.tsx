"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export type FormSectionProps = {
  title: string;
  description?: ReactNode;
  columns?: 1 | 2;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export default function FormSection({
  title,
  description,
  columns = 1,
  collapsible = false,
  defaultOpen = true,
  children,
  className = "",
}: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const body = (
    <div
      className={`grid gap-4 ${columns === 2 ? "sm:grid-cols-2" : ""} ${
        collapsible ? "mt-4" : ""
      }`}
    >
      {children}
    </div>
  );

  if (!collapsible) {
    return (
      <section
        className={`rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-5 ${className}`}
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-heading text-[15px] text-[var(--color-on-surface)]">
            {title}
          </h3>
        </div>
        {description ? (
          <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
            {description}
          </p>
        ) : null}
        <div className="mt-4">{body}</div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-5 ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="min-w-0">
          <span className="block font-heading text-[15px] text-[var(--color-on-surface)]">
            {title}
          </span>
          {description ? (
            <span className="mt-1 block text-xs text-[var(--color-on-surface-variant)]">
              {description}
            </span>
          ) : null}
        </span>
        <span
          className={`shrink-0 text-[var(--color-on-surface-variant)] transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
          aria-hidden
        >
          ›
        </span>
      </button>
      {open ? body : null}
    </section>
  );
}