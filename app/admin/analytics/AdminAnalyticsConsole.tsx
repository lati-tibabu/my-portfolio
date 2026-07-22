"use client";

import { useAdminAuth } from "../lib/useAdminAuth";
import { sectionClass } from "../lib/constants";
import AdminLoginScreen from "../components/AdminLoginScreen";
import AdminSidebar from "../components/AdminSidebar";
import AnalyticsPanel from "../components/AnalyticsPanel";

export default function AdminAnalyticsConsole() {
  const auth = useAdminAuth();

  if (auth.loadingSession || auth.loadingProfile) {
    return <div className={sectionClass}><p className="text-sm text-[var(--color-on-surface-variant)]">Loading admin session...</p></div>;
  }

  if (!auth.signedIn) {
    return <AdminLoginScreen authEmail={auth.authEmail} authPassword={auth.authPassword} authMessage={auth.authMessage} busy={auth.busy} setAuthEmail={auth.setAuthEmail} setAuthPassword={auth.setAuthPassword} signIn={auth.signIn} />;
  }

  if (auth.adminRole !== "admin") {
    return <div className={sectionClass}><p className="text-sm text-[var(--color-on-surface-variant)]">Only administrators can view analytics.</p></div>;
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[248px_1fr] lg:gap-8 lg:px-8 lg:py-8">
      <AdminSidebar activeTab="graphics" onChange={() => undefined} userEmail={auth.sessionUser?.email} userRole="admin" />
      <div className="min-w-0"><AnalyticsPanel /></div>
    </div>
  );
}
