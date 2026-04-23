import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Lati Tibabu",
  description: "A personal website of Lati Tibabu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 font-sans antialiased">
        <Header />
        <main>{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy;{new Date().getFullYear()} Lati Tibabu. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
