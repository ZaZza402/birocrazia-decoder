import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import TopLoader from "./components/top-loader";
import StickyNav from "./components/sticky-nav";
import GoogleAnalytics from "./components/google-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bur0.click"),
  title: {
    default:
      "BUR⓪ - Il Decodificatore di Burocrazia | Traduci Documenti Incomprensibili",
    template: "%s | BUR⓪",
  },
  description:
    "Decodifica gratis documenti burocratici italiani con AI. Traduci lettere dell'Agenzia delle Entrate, multe, notifiche e modulistica in italiano comprensibile. OCR automatico per immagini.",
  keywords: [
    "burocrazia italiana",
    "decodifica documenti",
    "agenzia delle entrate",
    "multa decodifica",
    "traduttore burocratese",
    "AI documenti",
    "OCR italiano",
    "semplificazione amministrativa",
    "linguaggio burocratico",
    "decoder burocrazia",
    "consulenza documenti gratis",
    "traduzione legalese",
  ],
  authors: [{ name: "BUR⓪ Team", url: "https://alecsdesign.xyz" }],
  creator: "BUR⓪",
  publisher: "BUR⓪",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://www.bur0.click",
    title: "BUR⓪ - Il Decodificatore di Burocrazia Italiana",
    description:
      "Decodifica gratis documenti burocratici con AI. Traduci lettere dell'Agenzia delle Entrate, multe e modulistica in italiano comprensibile.",
    siteName: "BUR⓪",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BUR⓪ - Il Decodificatore di Burocrazia Italiana",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bur0click",
    creator: "@alecsdesign",
    title: "BUR⓪ - Il Decodificatore di Burocrazia",
    description:
      "Decodifica gratis documenti burocratici con AI. Traduci in italiano comprensibile.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.bur0.click",
  },
  verification: {
    google: "AerZfH_YyZNanrrF6a9Z_lFkzGZxr7mYxTQ0FQ5GHak",
  },
  category: "technology",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="overflow-x-hidden">
      <head>
        <link rel="canonical" href="https://www.bur0.click" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "BUR⓪ - Il Decodificatore di Burocrazia",
              description:
                "Decodifica gratis documenti burocratici italiani con intelligenza artificiale. Traduci lettere dell'Agenzia delle Entrate, multe, notifiche in italiano comprensibile.",
              url: "https://www.bur0.click",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
              featureList: [
                "Decodifica documenti burocratici",
                "OCR automatico per immagini",
                "Tre modalità di analisi (Cinico, Solerte, Avvocato)",
                "Analisi del rischio",
                "Suggerimenti pratici",
              ],
              inLanguage: "it-IT",
              creator: {
                "@type": "Person",
                name: "Alecs Design",
                url: "https://alecsdesign.xyz",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                ratingCount: "1",
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        <StickyNav />
        {children}
      </body>
    </html>
  );
}
