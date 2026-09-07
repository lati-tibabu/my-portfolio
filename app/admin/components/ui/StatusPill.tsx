"use client";

import type { ReactNode } from "react";

export type PillTone = "success" | "neutral" | "warning" | "info";

export type StatusPillProps = {
  tone?: PillTone;
  children: ReactNode;
  className?: string;
};

const toneClass: Record<PillTone, string> = {
  success: "bg-[var(--color-success-teal)]/10 text-[var(--color-success-teal)]",
  neutral:
    "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  info: "bg-[var(--studio-accent-soft)] text-[var(--studio-accent-text)]",
};

export default function StatusPill({
  tone = "neutral",
  children,
  className = "",
}: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  );
}