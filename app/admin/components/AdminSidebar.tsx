"use client";

import Link from "next/link";
import {
  FiImage,
  FiBox,
  FiEdit3,
  FiMessageSquare,
  FiLayout,
  FiGitBranch,
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiBarChart2,
  FiArrowUpRight,
  FiGrid,
} from "react-icons/fi";
import { adminNavItems, isTabAllowedForRole } from "../lib/constants";
import type { AdminRole } from "../lib/constants";
import type { TabKey } from "../lib/types";

const icons = {
  graphics: FiImage,
  marketplace: FiBox,
  blog: FiEdit3,
  testimonials: FiMessageSquare,
  hero: FiLayout,
  "dev-journey": FiGitBranch,
  certifications: FiAward,
  stats: FiTrendingUp,
  users: FiUsers,
};

type AdminSidebarProps = {
  activeTab: TabKey | "analytics";
  onChange?: (tab: TabKey) => void;
  userEmail?: string | null;
  userRole?: AdminRole;
};

export default function AdminSidebar({
  activeTab,
  onChange,
  userEmail,
  userRole = "admin",
}: AdminSidebarProps) {
  return (
    <aside className="studio-sidebar h-fit lg:sticky lg:top-24">
      <div className="studio-brand">
        <span className="studio-brand-icon">
          <FiGrid size={22} aria-hidden />
        </span>
        <div>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            Your portfolio workspace
          </p>
          <h1 className="font-heading text-xl">Content studio</h1>
        </div>
      </div>
      <nav className="p-3" aria-label="Content collections">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
          Manage content
        </p>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
          {adminNavItems
            .filter((item) => isTabAllowedForRole(item.tab, userRole))
            .map((item) => {
              const MenuIcon = icons[item.tab];
              const content = (
                <>
                  <span className="studio-nav-icon">
                    <MenuIcon size={18} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">
                      {item.label}
                    </span>
                    <span className="mt-0.5 hidden text-[11px] opacity-70 xl:block">
                      {item.description}
                    </span>
                  </span>
                </>
              );
              return onChange ? (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => onChange(item.tab)}
                  aria-current={activeTab === item.tab ? "page" : undefined}
                  className="studio-nav-item"
                >
                  {content}
                </button>
              ) : (
                <Link
                  key={item.tab}
                  href={`/admin#${item.tab}`}
                  className="studio-nav-item"
                >
                  {content}
                </Link>
              );
            })}
        </div>
        {userRole === "admin" && (
          <Link
            href="/admin/analytics"
            aria-current={activeTab === "analytics" ? "page" : undefined}
            className="studio-nav-item mt-3"
          >
            <span className="studio-nav-icon">
              <FiBarChart2 size={18} aria-hidden />
            </span>
            <span className="text-sm font-medium">Analytics</span>
            <FiArrowUpRight className="ml-auto" aria-hidden />
          </Link>
        )}
      </nav>
      <div className="border-t border-[var(--color-surface-border)] p-4">
        <div className="flex items-center gap-3">
          <span className="studio-avatar">
            {(userEmail || "A").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs">
              {userEmail || "Authenticated editor"}
            </p>
            <p className="mt-1 text-[11px] capitalize text-[var(--color-on-surface-variant)]">
              {userRole}
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-4 flex items-center justify-between text-xs text-[var(--color-on-surface-variant)]"
        >
          View portfolio <FiArrowUpRight aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
