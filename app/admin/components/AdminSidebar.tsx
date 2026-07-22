"use client";

import { adminNavItems, isTabAllowedForRole } from "../lib/constants";
import Link from "next/link";
import type { AdminRole } from "../lib/constants";
import type { TabKey } from "../lib/types";

type AdminSidebarProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  userEmail?: string | null;
  userRole?: AdminRole;
};

export default function AdminSidebar({
  activeTab,
  onChange,
  userEmail,
  userRole = "admin",
}: AdminSidebarProps) {
  const visibleNavItems = adminNavItems.filter((item) =>
    isTabAllowedForRole(item.tab, userRole),
  );

  return (
    <aside className="h-fit overflow-hidden rounded-xl border-2 border-[var(--color-on-surface)] bg-[var(--color-surface-container-lowest)] shadow-[6px_6px_0_var(--color-on-surface)] lg:sticky lg:top-24">
      <div className="border-b-2 border-[var(--color-on-surface)] bg-[var(--color-on-surface)] p-5 text-white">
        <p className="font-label text-[10px] uppercase tracking-[0.24em] text-white/60">
          Content studio
        </p>
        <h1 className="mt-2 font-heading text-[24px]">CMS dashboard</h1>
        <p className="mt-2 truncate text-[12px] text-white/65">
          {userEmail ?? "Authenticated editor"}
        </p>
        <p className="mt-1 truncate text-[10px] text-white/50 uppercase tracking-[0.12em]">
          {userRole}
        </p>
      </div>
      <nav className="p-3" aria-label="Content collections">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
          Collections
        </p>
        <div className="space-y-1">
          {visibleNavItems.map((item, index) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => onChange(item.tab)}
              className={`group relative flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left transition-all duration-200 ${
                activeTab === item.tab
                  ? "border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-white shadow-[3px_3px_0_var(--color-surface-border)]"
                  : "border-transparent text-[var(--color-on-surface-variant)] hover:border-[var(--color-surface-border)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-current font-label text-[10px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className={`mt-0.5 block text-[11px] ${activeTab === item.tab ? "text-white/60" : "text-[var(--color-on-surface-variant)]"}`}>
                  {item.description}
                </span>
              </span>
              <span className="ml-auto text-lg leading-none opacity-50 transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          ))}
        </div>
      </nav>
      {userRole === "admin" && (
        <div className="border-t border-[var(--color-surface-border)] p-3">
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-md border border-transparent px-3 py-3 text-left text-[var(--color-on-surface-variant)] transition-all hover:border-[var(--color-surface-border)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-current font-label text-[10px]">↗</span>
            <span>
              <span className="block text-sm font-semibold">Analytics</span>
              <span className="mt-0.5 block text-[11px]">Visitor insights</span>
            </span>
          </Link>
        </div>
      )}
      <div className="border-t border-[var(--color-surface-border)] p-4">
        <p className="text-[11px] leading-[1.5] text-[var(--color-on-surface-variant)]">
          Changes publish to the portfolio after signing out.
        </p>
      </div>
    </aside>
  );
}
