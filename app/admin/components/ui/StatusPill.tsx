"use client";

import type { ReactNode } from "react";

export type PillTone = "success" | "neutral" | "warning" | "info";

export type StatusPillProps = {
  tone?: PillTone;
  children: ReactNode;
  className?: string;
};

const toneClass: Record<PillTone, string> = {
  success: "bg-[var(--color-success-teal)] text-white",
  neutral:
    "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]",
  warning: "bg-amber-500/15 text-amber-600",
  info: "bg-[var(--color-electric-blue)]/15 text-[var(--color-electric-blue)]",
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