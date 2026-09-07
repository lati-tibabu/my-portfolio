"use client";
import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { inputClass } from "../lib/constants";

export default function ListInput({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}) {
  const [items, setItems] = useState(() => {
    const initial = value.split("\n").filter((item) => item.trim());
    return initial.length ? initial : [""];
  });
  useEffect(() => {
    setItems((current) =>
      current.filter((item) => item.trim()).join("\n") === value
        ? current
        : value
          ? value.split("\n")
          : [""],
    );
  }, [value]);
  const update = (next: string[]) => {
    setItems(next);
    onChange(next.filter((item) => item.trim()).join("\n"));
  };
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            aria-label={`${label} ${index + 1}`}
            className={inputClass}
            placeholder={placeholder}
            value={item}
            onChange={(event) =>
              update(
                items.map((entry, i) =>
                  i === index ? event.target.value : entry,
                ),
              )
            }
          />
          <button
            type="button"
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            className="rounded-lg border border-[var(--color-surface-border)] p-3"
            onClick={() => update(items.filter((_, i) => i !== index))}
          >
            <FiX aria-hidden />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="flex items-center gap-2 py-2 text-xs text-[var(--color-electric-blue)]"
        onClick={() => setItems([...items, ""])}
      >
        <FiPlus aria-hidden />
        Add {label.toLowerCase()}
      </button>
    </div>
  );
}
