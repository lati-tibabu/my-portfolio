"use client";

import type { ReactNode } from "react";
import { labelClass } from "../../lib/constants";

export type FormFieldProps = {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function FormField({
  label,
  hint,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <label className={`${labelClass} ${className}`}>
      <span>{label}</span>
      {children}
      {hint ? (
        <span className="text-xs font-normal text-[var(--color-on-surface-variant)]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}