import type { Metadata } from "next";
import { Lexend, Playwrite_ID, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
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
    "Lati Tibabu builds scalable web apps, Odoo ERP solutions, and digital products. Based in Ethiopia, available for freelance work globally.",
  applicationName: "Lati Tibabu",
  keywords: [
    "Lati Tibabu",
    "Full Stack Developer",
    "Odoo ERP",
    "Odoo Themes",
    "Digital Products",
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
      "Lati Tibabu builds scalable web apps, Odoo ERP solutions, and digital products. Based in Ethiopia, available for freelance work globally.",
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
      "Lati Tibabu builds scalable web apps, Odoo ERP solutions, and digital products. Based in Ethiopia, available for freelance work globally.",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{const saved=localStorage.getItem("portfolio-theme");document.documentElement.dataset.theme=saved==="dark"||saved==="light"?saved:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{document.documentElement.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}` }} />
      </head>
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
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <VisitorTracker />
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
