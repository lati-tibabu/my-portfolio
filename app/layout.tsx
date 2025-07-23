import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./components/Header";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Lati Tibabu Portfolio",
  description: "A portfolio website for Lati Tibabu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        {/* header */}
        <Header />
        {/* {children} */}
        <main className="">{children}</main>
        {/* Footer */}
        <footer className="bg-gray-100 p-5 text-center">
          <p className="text-gray-600">
            ©{new Date().getFullYear()} Lati Tibabu. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
