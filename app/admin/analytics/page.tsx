import type { Metadata } from "next";
import AdminAnalyticsConsole from "./AdminAnalyticsConsole";

export const metadata: Metadata = {
  title: "Analytics — Lati Tibabu",
  description: "Portfolio visitor analytics.",
};

export default function AdminAnalyticsPage() {
  return <AdminAnalyticsConsole />;
}
