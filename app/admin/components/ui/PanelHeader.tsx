"use client";

import type { ReactNode } from "react";

export type PanelHeaderView = { key: string; label: string };

export type PanelHeaderProps = {
  title: string;
  subtitle?: string;
  count?: number | null;
  views: PanelHeaderView[];
  view: string;
  onViewChange: (view: string) => void;
  actions?: ReactNode;
};

export default function PanelHeader({
  title,
  subtitle,
  count,
  views,
  view,
  onViewChange,
  actions,
}: PanelHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
          {title}
        </h2>
        {count !== undefined && count !== null ? (
          <span className="rounded-full bg-[var(--color-surface-container)] px-3 py-1 text-xs font-semibold text-[var(--color-on-surface-variant)]">
            {count}
          </span>
        ) : null}
        {subtitle ? (
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]">
            {subtitle}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {views.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onViewChange(item.key)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
              view === item.key
                ? "bg-[var(--color-electric-blue)] text-white hover:bg-[var(--color-electric-blue)]/90"
                : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"
            }`}
          >
            {item.label}
          </button>
        ))}
        {actions}
      </div>
    </div>
  );
}