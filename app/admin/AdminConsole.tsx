"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../lib/supabase/browser";
import { sectionClass } from "./lib/constants";
import { loadAll } from "./lib/crud";
import { useAdminAuth } from "./lib/useAdminAuth";
import type {
  BlogRecord,
  GraphicsRecord,
  MarketplaceRecord,
  TabKey,
} from "./lib/types";
import AdminLoginScreen from "./components/AdminLoginScreen";
import AdminSidebar from "./components/AdminSidebar";
import WorkspaceHeader from "./components/WorkspaceHeader";
import GraphicsPanel from "./components/GraphicsPanel";
import MarketplacePanel from "./components/MarketplacePanel";
import BlogPanel from "./components/BlogPanel";

export default function AdminConsole() {
  const auth = useAdminAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("graphics");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    "Sign in to manage content.",
  );
  const [graphics, setGraphics] = useState<GraphicsRecord[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceRecord[]>([]);
  const [blog, setBlog] = useState<BlogRecord[]>([]);

  const reload = async () => {
    setBusy(true);
    setMessage("Loading content...");
    try {
      const result = await loadAll(supabaseBrowser);
      setGraphics(result.graphics);
      setMarketplace(result.marketplace);
      setBlog(result.blog);
      setMessage(result.message);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load CMS content.",
      );
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (auth.signedIn) {
      void reload();
    }
    // reload is a stable-enough closure over setState setters; only re-run on sign-in.
  }, [auth.signedIn]);

  if (auth.loadingSession) {
    return (
      <div className={sectionClass}>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          Loading admin session...
        </p>
      </div>
    );
  }

  if (!auth.signedIn) {
    return (
      <AdminLoginScreen
        authEmail={auth.authEmail}
        authPassword={auth.authPassword}
        authMessage={auth.authMessage}
        busy={auth.busy}
        setAuthEmail={auth.setAuthEmail}
        setAuthPassword={auth.setAuthPassword}
        signIn={auth.signIn}
      />
    );
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[248px_1fr] lg:gap-8 lg:px-8 lg:py-8">
      <AdminSidebar
        activeTab={activeTab}
        onChange={setActiveTab}
        userEmail={auth.sessionUser?.email}
      />

      <div className="min-w-0 space-y-5">
        <WorkspaceHeader activeTab={activeTab} message={message} busy={busy} />

        {activeTab === "graphics" && (
          <GraphicsPanel
            records={graphics}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
          />
        )}

        {activeTab === "marketplace" && (
          <MarketplacePanel
            records={marketplace}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
          />
        )}

        {activeTab === "blog" && (
          <BlogPanel
            records={blog}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
          />
        )}
      </div>
    </div>
  );
}
