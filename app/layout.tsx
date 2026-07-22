import type { Metadata } from "next";
import { Lexend, Playwrite_ID, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";
import Header from "./components/Header";
import CustomCursor from "./components/CustomCursor";
import VisitorTracker from "./components/VisitorTracker";

const playwrite = Playwrite_ID({
  variable: "--font-logo",
});
const lexend = Lexend({ subsets: ["latin"], variable: "--font-body" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://latitibabu.com";

export const metadata: Metadata = {
  title: {
    default: "Lati Tibabu — Full Stack & Odoo ERP Developer",
    template: "%s | Lati Tibabu",
  },
  description:
    "Lati Tibabu builds scalable web apps, Odoo ERP solutions, and Odoo products. Based in Ethiopia, available for freelance work globally.",
  applicationName: "Lati Tibabu",
  keywords: [
    "Lati Tibabu",
    "Full Stack Developer",
    "Odoo ERP",
    "Odoo Themes",
    "Odoo Products",
    "Next.js",
    "Python",
    "Ethiopia",
  ],
  authors: [{ name: "Lati Tibabu" }],
  creator: "Lati Tibabu",
  publisher: "Lati Tibabu",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lati Tibabu — Full Stack & Odoo ERP Developer",
    description:
      "Lati Tibabu builds scalable web apps, Odoo ERP solutions, and Odoo products. Based in Ethiopia, available for freelance work globally.",
    url: "/",
    siteName: "Lati Tibabu",
    images: [
      {
        url: "/me4.png",
        width: 1200,
        height: 630,
        alt: "Lati Tibabu — Full Stack & Odoo ERP Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lati Tibabu — Full Stack & Odoo ERP Developer",
    description:
      "Lati Tibabu builds scalable web apps, Odoo ERP solutions, and Odoo products. Based in Ethiopia, available for freelance work globally.",
    images: ["/me4.png"],
  },
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
    icon: "/favicon2.svg",
    shortcut: "/favicon.svg",
    apple: "/icon.png",
  },
};

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lati Tibabu",
  jobTitle: "Full Stack and Odoo ERP Developer",
  url: siteUrl,
  sameAs: [
    "https://github.com/lati-tibabu",
    "https://linkedin.com/in/lati-tibabu",
    "https://x.com/TibabuLati",
    "https://facebook.com/lati.tibabu",
    "https://t.me/latitibabu",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${playwrite.variable} ${lexend.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-on-background)] antialiased transition-colors duration-200`}
      >
        <Script
          id="person-structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
        <Header />
        <VisitorTracker />
        <main className="flex-1">{children}</main>
        <CustomCursor />
        <footer className="border-t border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] py-6">
          <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[var(--color-on-surface-variant)]">
            <p>&copy;{new Date().getFullYear()} Lati Tibabu. All rights reserved.</p>
            <Link href="/privacy" className="underline-offset-4 hover:text-[var(--color-on-surface)] hover:underline">
              Privacy policy
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
