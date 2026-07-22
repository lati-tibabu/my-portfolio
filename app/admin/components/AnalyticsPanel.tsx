"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { sectionClass } from "../lib/constants";
import type { VisitorEvent } from "../lib/types";

const cardClass = "rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4";

export default function AnalyticsPanel() {
  const [events, setEvents] = useState<VisitorEvent[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const loadEvents = async () => {
    setBusy(true);
    const { data, error: queryError } = await supabaseBrowser
      .from("visitor_events")
      .select("id, visited_at, visitor_id, session_id, country, region, city, browser, browser_version, os, os_version, device, language, timezone, page, referrer")
      .order("visited_at", { ascending: false })
      .limit(500);
    setEvents((data as VisitorEvent[]) ?? []);
    setSelectedSessionId(null);
    setError(queryError?.message ?? "");
    setBusy(false);
  };

  useEffect(() => { void loadEvents(); }, []);

  const uniqueVisitors = useMemo(() => new Set(events.map((event) => event.visitor_id).filter(Boolean)).size, [events]);
  const sessions = useMemo(() => new Set(events.map((event) => event.session_id).filter(Boolean)).size, [events]);
  const topPages = useMemo(() => {
    const counts = new Map<string, number>();
    events.forEach((event) => counts.set(event.page, (counts.get(event.page) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [events]);
  const sessionEvents = useMemo(
    () => events
      .filter((event) => event.session_id === selectedSessionId)
      .sort((a, b) => new Date(a.visited_at).getTime() - new Date(b.visited_at).getTime()),
    [events, selectedSessionId],
  );
  const selectedEvent = sessionEvents[0];

  return (
    <div className="space-y-5">
      <section className={sectionClass}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">Self-hosted insights</p>
            <h2 className="mt-2 font-heading text-3xl">Visitor analytics</h2>
            <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">Latest 500 page views. IP addresses are stored only as one-way hashes.</p>
          </div>
          <button type="button" onClick={() => void loadEvents()} className="rounded-lg border border-[var(--color-on-surface)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-on-surface)] hover:text-white">Refresh</button>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">Could not load analytics: {error}</p>}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className={cardClass}><p className="text-xs text-[var(--color-on-surface-variant)]">Page views</p><p className="mt-1 text-3xl font-semibold">{events.length}</p></div>
          <div className={cardClass}><p className="text-xs text-[var(--color-on-surface-variant)]">Unique visitors</p><p className="mt-1 text-3xl font-semibold">{uniqueVisitors}</p></div>
          <div className={cardClass}><p className="text-xs text-[var(--color-on-surface-variant)]">Sessions</p><p className="mt-1 text-3xl font-semibold">{sessions}</p></div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="font-heading text-2xl">Top pages</h3>
        <div className="mt-4 space-y-3">
          {topPages.length === 0 && <p className="text-sm text-[var(--color-on-surface-variant)]">{busy ? "Loading analytics..." : "No visits recorded yet."}</p>}
          {topPages.map(([page, count]) => <div key={page} className="flex items-center justify-between border-b border-[var(--color-surface-border)] pb-2 text-sm"><span className="font-mono">{page}</span><span className="font-semibold">{count}</span></div>)}
        </div>
      </section>

      {selectedSessionId && selectedEvent && (
        <section className={sectionClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">Session detail</p>
              <h3 className="mt-2 font-heading text-2xl">{sessionEvents.length} visit{sessionEvents.length === 1 ? "" : "s"} in this session</h3>
              <p className="mt-1 break-all font-mono text-xs text-[var(--color-on-surface-variant)]">{selectedSessionId}</p>
            </div>
            <button type="button" onClick={() => setSelectedSessionId(null)} className="rounded-lg border border-[var(--color-surface-border)] px-3 py-2 text-sm hover:border-[var(--color-on-surface)]">Close</button>
          </div>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className={cardClass}><p className="text-xs text-[var(--color-on-surface-variant)]">Visitor</p><p className="mt-1 break-all font-mono text-xs">{selectedEvent.visitor_id ?? "Unknown"}</p></div>
            <div className={cardClass}><p className="text-xs text-[var(--color-on-surface-variant)]">Location</p><p className="mt-1">{[selectedEvent.city, selectedEvent.region, selectedEvent.country].filter(Boolean).join(", ") || "Unknown"}</p></div>
            <div className={cardClass}><p className="text-xs text-[var(--color-on-surface-variant)]">Browser / OS</p><p className="mt-1">{[selectedEvent.browser, selectedEvent.browser_version].filter(Boolean).join(" ") || "Unknown"} · {selectedEvent.os ?? "Unknown"}</p></div>
            <div className={cardClass}><p className="text-xs text-[var(--color-on-surface-variant)]">Device</p><p className="mt-1 capitalize">{selectedEvent.device} · {selectedEvent.language ?? "Unknown"}</p></div>
          </div>
          <div className="mt-5 border-l-2 border-[var(--color-on-surface)] pl-4">
            {sessionEvents.map((event) => (
              <div key={event.id} className="relative border-b border-[var(--color-surface-border)] py-3 last:border-b-0">
                <p className="font-mono text-xs text-[var(--color-on-surface-variant)]">{new Date(event.visited_at).toLocaleString()}</p>
                <p className="mt-1 font-mono text-sm">{event.page}</p>
                {event.referrer && <p className="mt-1 truncate text-xs text-[var(--color-on-surface-variant)]">From: {event.referrer}</p>}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--color-on-surface-variant)]">Timezone: {selectedEvent.timezone ?? "Unknown"}</p>
        </section>
      )}

      <section className={`${sectionClass} overflow-x-auto`}>
        <h3 className="font-heading text-2xl">Recent visits</h3>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Click a visit to inspect its session.</p>
        <table className="mt-4 min-w-[720px] w-full text-left text-sm">
          <thead><tr className="border-b border-[var(--color-surface-border)] text-xs uppercase tracking-wider text-[var(--color-on-surface-variant)]"><th className="py-3 pr-4">Time</th><th className="py-3 pr-4">Page</th><th className="py-3 pr-4">Location</th><th className="py-3 pr-4">Browser / OS</th><th className="py-3">Device</th></tr></thead>
          <tbody>{events.slice(0, 20).map((event) => <tr key={event.id} role="button" tabIndex={0} onClick={() => setSelectedSessionId(event.session_id)} onKeyDown={(keyboardEvent) => { if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") setSelectedSessionId(event.session_id); }} className={`cursor-pointer border-b border-[var(--color-surface-border)]/70 hover:bg-[var(--color-surface-container-low)] ${selectedSessionId === event.session_id ? "bg-[var(--color-surface-container-low)]" : ""}`}><td className="py-3 pr-4 whitespace-nowrap">{new Date(event.visited_at).toLocaleString()}</td><td className="py-3 pr-4 font-mono">{event.page}</td><td className="py-3 pr-4">{[event.city, event.region, event.country].filter(Boolean).join(", ") || "Unknown"}</td><td className="py-3 pr-4">{[event.browser, event.os].filter(Boolean).join(" · ") || "Unknown"}</td><td className="py-3 capitalize">{event.device}</td></tr>)}</tbody>
        </table>
      </section>
    </div>
  );
}
