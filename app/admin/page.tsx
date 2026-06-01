import type { Metadata } from "next";
import AdminConsole from "./AdminConsole";

export const metadata: Metadata = {
  title: "Admin — Lati Tibabu",
  description: "Login and manage the portfolio CMS content.",
};

export default function AdminPage() {
  return <AdminConsole />;
}
