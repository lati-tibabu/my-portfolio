"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../lib/supabase/browser";
import { sectionClass } from "./lib/constants";
import { loadAll } from "./lib/crud";
import { useAdminAuth } from "./lib/useAdminAuth";
import { isTabAllowedForRole } from "./lib/constants";
import type { AdminRole } from "./lib/constants";
import type {
  BlogRecord,
  CertificationRecord,
  DevJourneyRecord,
  GraphicsRecord,
  HeroRecord,
  MarketplaceRecord,
  StatsRecord,
  TabKey,
  TestimonialRecord,
} from "./lib/types";
import AdminLoginScreen from "./components/AdminLoginScreen";
import AdminSidebar from "./components/AdminSidebar";
import WorkspaceHeader from "./components/WorkspaceHeader";
import GraphicsPanel from "./components/GraphicsPanel";
import MarketplacePanel from "./components/MarketplacePanel";
import BlogPanel from "./components/BlogPanel";
import TestimonialsPanel from "./components/TestimonialsPanel";
import HeroPanel from "./components/HeroPanel";
import DevJourneyPanel from "./components/DevJourneyPanel";
import CertificationsPanel from "./components/CertificationsPanel";
import StatsPanel from "./components/StatsPanel";
import UsersPanel from "./components/UsersPanel";
import AnalyticsPanel from "./components/AnalyticsPanel";

export default function AdminConsole() {
  const auth = useAdminAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("graphics");

  const handleTabChange = (tab: TabKey) => {
    if (isTabAllowedForRole(tab, auth.adminRole as AdminRole)) {
      setActiveTab(tab);
    }
  };
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    "Sign in to manage content.",
  );
  const [graphics, setGraphics] = useState<GraphicsRecord[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceRecord[]>([]);
  const [blog, setBlog] = useState<BlogRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [hero, setHero] = useState<HeroRecord | null>(null);
  const [devJourney, setDevJourney] = useState<DevJourneyRecord[]>([]);
  const [certifications, setCertifications] = useState<CertificationRecord[]>([]);
  const [stats, setStats] = useState<StatsRecord[]>([]);

  const reload = async () => {
    setBusy(true);
    setMessage("Loading content...");
    try {
      const result = await loadAll(supabaseBrowser);
      setGraphics(result.graphics);
      setMarketplace(result.marketplace);
      setBlog(result.blog);
      setTestimonials(result.testimonials);
      setHero(result.hero);
      setDevJourney(result.devJourney);
      setCertifications(result.certifications);
      setStats(result.stats);
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

  useEffect(() => {
    if (!isTabAllowedForRole(activeTab, auth.adminRole as AdminRole)) {
      setActiveTab("graphics");
    }
  }, [activeTab, auth.adminRole]);

  if (auth.loadingSession || auth.loadingProfile) {
    return (
      <div className={sectionClass}>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          {auth.loadingSession ? "Loading admin session..." : "Loading admin profile..."}
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
        onChange={handleTabChange}
        userEmail={auth.sessionUser?.email}
        userRole={auth.adminRole as AdminRole}
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
            adminName={auth.adminName}
          />
        )}

        {activeTab === "marketplace" && (
          <MarketplacePanel
            records={marketplace}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
            adminName={auth.adminName}
          />
        )}

        {activeTab === "blog" && (
          <BlogPanel
            records={blog}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
            adminName={auth.adminName}
          />
        )}

        {activeTab === "testimonials" && (
          <TestimonialsPanel
            records={testimonials}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
          />
        )}

        {activeTab === "hero" && auth.adminRole === "admin" && (
          <HeroPanel
            record={hero}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
          />
        )}

        {activeTab === "dev-journey" && auth.adminRole === "admin" && (
          <DevJourneyPanel
            records={devJourney}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
          />
        )}

        {activeTab === "certifications" && auth.adminRole === "admin" && (
          <CertificationsPanel
            records={certifications}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
          />
        )}

        {activeTab === "stats" && auth.adminRole === "admin" && (
          <StatsPanel
            records={stats}
            reload={reload}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
          />
        )}

        {activeTab === "users" && auth.adminRole === "admin" && (
          <UsersPanel
            currentUserId={auth.sessionUser?.id}
            currentUserEmail={auth.sessionUser?.email}
            adminName={auth.adminName}
            onAdminNameChange={auth.updateDisplayName}
            busy={busy}
            setBusy={setBusy}
            setMessage={setMessage}
          />
        )}

        {activeTab === "analytics" && auth.adminRole === "admin" && <AnalyticsPanel />}

        {!isTabAllowedForRole(activeTab, auth.adminRole as AdminRole) && (
          <div className={sectionClass}>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              You do not have access to this section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
