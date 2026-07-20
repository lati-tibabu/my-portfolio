"use client";

import { adminNavItems } from "../lib/constants";
import type { TabKey } from "../lib/types";

type WorkspaceHeaderProps = {
  activeTab: TabKey;
  message: string;
  busy: boolean;
};

export default function WorkspaceHeader({
  activeTab,
  message,
  busy,
}: WorkspaceHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-surface-border)] pb-4">
      <div>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
          Workspace / {adminNavItems.find((item) => item.tab === activeTab)?.label}
        </p>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{message}</p>
      </div>
      <span className="rounded-sm border border-[var(--color-surface-border)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]">
        {busy ? "Saving" : "Ready"}
      </span>
    </div>
  );
}