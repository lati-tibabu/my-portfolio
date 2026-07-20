import type { TabKey } from "./types";

export const STORAGE_BUCKET = "portfolio-media";
export const DEFAULT_PLACEHOLDER_IMAGE = "https://placehold.co/600x400@2x.png";

export const adminNavItems: Array<{
  tab: TabKey;
  label: string;
  description: string;
}> = [
  { tab: "graphics", label: "Graphics", description: "Visual work" },
  { tab: "marketplace", label: "Products", description: "Apps and themes" },
  { tab: "blog", label: "Blog", description: "Articles and updates" },
];

export const inputClass =
  "w-full rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm text-[var(--color-on-surface)] outline-none focus:border-[var(--color-electric-blue)] focus:ring-2 focus:ring-[var(--color-electric-blue)]/20 transition-all duration-200";

export const labelClass = "space-y-3 text-sm font-medium text-[var(--color-on-surface)]";

export const sectionClass =
  "rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300";