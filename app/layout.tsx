import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: {
    default: "Lati Tibabu",
    template: "%s | Lati Tibabu",
  },
  description: "Portfolio of Lati Tibabu, a Full Stack and Odoo ERP Developer based in Addis Ababa.",
  applicationName: "Lati Tibabu Portfolio",
  keywords: [
    "Lati Tibabu",
    "Full Stack Developer",
    "Odoo ERP Developer",
    "React",
    "Next.js",
    "Python",
    "Addis Ababa",
  ],
  authors: [{ name: "Lati Tibabu" }],
  creator: "Lati Tibabu",
  publisher: "Lati Tibabu",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.png",
  },
};

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lati Tibabu",
  jobTitle: "Full Stack and Odoo ERP Developer",
  url: "/",
  sameAs: [
    "https://github.com/lati-tibabu",
    "https://linkedin.com/in/lati-tibabu",
    "https://facebook.com/lati.tibabu",
  ],
};

const themeBootstrapScript = `
  (() => {
    try {
      const storageKey = "theme";
      const storedTheme = localStorage.getItem(storageKey);
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";

      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
    } catch {
      // Ignore storage and media query failures.
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[var(--background)] text-[var(--foreground)] font-sans antialiased transition-colors duration-200">
        <Script id="theme-bootstrap" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <Script
          id="person-structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        <Header />
        <main>{children}</main>
        <footer className="hand-drawn-border bg-gray-50 border-t border-gray-200 py-6 text-center transition-colors duration-200">
          <p className="text-gray-400 text-sm">
            &copy;{new Date().getFullYear()} Lati Tibabu. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
