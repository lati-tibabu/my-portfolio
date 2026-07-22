"use client";

import { useMemo } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { sectionClass } from "../lib/constants";
import type { VisitorEvent } from "../lib/types";
import { decodeAnalyticsValue } from "../lib/analytics";

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, LinearScale, LineElement, PointElement, Tooltip);

const ink = "#171717";
const gray = ["#171717", "#3f3f46", "#71717a", "#a1a1aa", "#d4d4d8", "#e4e4e7", "#52525b", "#27272a"];
const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: "#e4e4e7" }, ticks: { color: "#52525b" } }, y: { grid: { color: "#e4e4e7" }, ticks: { color: "#52525b" }, beginAtZero: true } } };

function countValues(events: VisitorEvent[], getValue: (event: VisitorEvent) => string | null, limit = 8) {
  const counts = new Map<string, number>();
  events.forEach((event) => {
    const value = getValue(event) || "Unknown";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function locationValue(event: VisitorEvent) {
  return [event.city, event.region, event.country].map(decodeAnalyticsValue).filter(Boolean).join(", ") || null;
}

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className={`${sectionClass} min-w-0`}><h3 className="font-heading text-2xl">{title}</h3><p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{subtitle}</p><div className="mt-5 h-64">{children}</div></section>;
}

type AnalyticsChartScope = "overview" | "audience" | "navigation" | "technical";

export default function AnalyticsCharts({ events, scope }: { events: VisitorEvent[]; scope: AnalyticsChartScope }) {
  const charts = useMemo(() => ({
    country: countValues(events, (event) => event.country),
    location: countValues(events, locationValue),
    browser: countValues(events, (event) => event.browser),
    os: countValues(events, (event) => event.os),
    device: countValues(events, (event) => event.device),
    language: countValues(events, (event) => event.language),
    timezone: countValues(events, (event) => event.timezone),
    pages: countValues(events, (event) => event.page),
  }), [events]);

  const barData = (values: Array<[string, number]>) => ({ labels: values.map(([label]) => label), datasets: [{ data: values.map(([, count]) => count), backgroundColor: ink, borderColor: ink, borderWidth: 1 }] });
  const ringData = (values: Array<[string, number]>) => ({ labels: values.map(([label]) => label), datasets: [{ data: values.map(([, count]) => count), backgroundColor: gray, borderColor: "#ffffff", borderWidth: 2 }] });
  const allParameters: Array<[string, number]> = [
    ["Country", events.filter((event) => Boolean(event.country)).length],
    ["Location", events.filter((event) => Boolean(locationValue(event))).length],
    ["Browser", events.filter((event) => Boolean(event.browser)).length],
    ["OS", events.filter((event) => Boolean(event.os)).length],
    ["Device", events.filter((event) => Boolean(event.device)).length],
    ["Language", events.filter((event) => Boolean(event.language)).length],
    ["Timezone", events.filter((event) => Boolean(event.timezone)).length],
    ["Color scheme", events.filter((event) => Boolean(event.color_scheme)).length],
    ["Screen size", events.filter((event) => Boolean(event.screen_width && event.screen_height)).length],
  ];
  const dailyViews = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (13 - index));
      return { key: localDateKey(date), label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count: 0 };
    });
    const byDay = new Map(days.map((day) => [day.key, day]));
    events.forEach((event) => {
      const day = byDay.get(localDateKey(new Date(event.visited_at)));
      if (day) day.count += 1;
    });
    return days;
  }, [events]);

  return <div className="grid gap-5 xl:grid-cols-2">
    {scope === "overview" && <div className="xl:col-span-2"><ChartCard title="Views over time" subtitle="Daily page views for the last 14 days."><Line data={{ labels: dailyViews.map((day) => day.label), datasets: [{ label: "Page views", data: dailyViews.map((day) => day.count), borderColor: ink, backgroundColor: "rgba(23,23,23,0.08)", pointBackgroundColor: ink, pointBorderColor: ink, pointRadius: 3, fill: true, tension: 0.3 }] }} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, tooltip: { enabled: true } } }} /></ChartCard></div>}
    {scope === "audience" && <>
      <ChartCard title="By country" subtitle="Visits grouped by country."><Doughnut data={ringData(charts.country)} options={chartOptions} /></ChartCard>
      <ChartCard title="By location" subtitle="Visits grouped by city, region, or country."><Bar data={barData(charts.location)} options={{ ...chartOptions, indexAxis: "y" as const }} /></ChartCard>
      <ChartCard title="By browser" subtitle="Browser families detected from user agents."><Bar data={barData(charts.browser)} options={chartOptions} /></ChartCard>
      <ChartCard title="By operating system" subtitle="Operating systems detected from user agents."><Pie data={ringData(charts.os)} options={chartOptions} /></ChartCard>
      <ChartCard title="By device" subtitle="Desktop, mobile, and tablet visits."><Doughnut data={ringData(charts.device)} options={chartOptions} /></ChartCard>
    </>}
    {scope === "navigation" && <ChartCard title="By page" subtitle="Most visited pages in the loaded dataset."><Bar data={barData(charts.pages)} options={{ ...chartOptions, indexAxis: "y" as const }} /></ChartCard>}
    {scope === "technical" && <>
      <ChartCard title="By language" subtitle="Browser language distribution."><Bar data={barData(charts.language)} options={chartOptions} /></ChartCard>
      <ChartCard title="All parameters" subtitle="How completely each analytics parameter is populated."><Line data={{ labels: allParameters.map(([label]) => label), datasets: [{ data: allParameters.map(([, count]) => count), borderColor: ink, backgroundColor: "rgba(23,23,23,0.08)", fill: true, tension: 0.3 }] }} options={chartOptions} /></ChartCard>
      <div className="xl:col-span-2"><ChartCard title="By timezone" subtitle="Visitor timezone distribution."><Bar data={barData(charts.timezone)} options={{ ...chartOptions, indexAxis: "y" as const }} /></ChartCard></div>
    </>}
  </div>;
}
