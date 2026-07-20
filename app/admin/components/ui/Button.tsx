"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold uppercase tracking-[0.12em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--color-electric-blue)] text-white hover:bg-[var(--color-electric-blue)]/90 focus:ring-[var(--color-electric-blue)]/20",
  secondary:
    "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] focus:ring-[var(--color-electric-blue)]/20",
  danger:
    "border border-[var(--color-surface-border)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10 focus:ring-[var(--color-error)]/20",
  ghost:
    "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] focus:ring-[var(--color-electric-blue)]/20",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

export default function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}