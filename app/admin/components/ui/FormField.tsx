"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactNode,
} from "react";
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
  const id = useId();
  return (
    <div className={`${labelClass} ${className}`}>
      <label htmlFor={id} className="block">
        {label}
      </label>
      {Children.map(children, (child) =>
        isValidElement<{ id?: string; "aria-describedby"?: string }>(child) &&
        typeof child.type === "string" &&
        ["input", "textarea", "select"].includes(child.type)
          ? cloneElement(child, {
              id,
              "aria-describedby": hint ? `${id}-hint` : undefined,
            })
          : child,
      )}
      {hint ? (
        <span
          id={`${id}-hint`}
          className="block text-xs font-normal text-[var(--color-on-surface-variant)]"
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}
