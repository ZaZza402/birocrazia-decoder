import type { Metadata } from "next";
import "./globals.css";
import "../LandingPage.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Conviene Forfettario o Ordinario? Simulatore 2025 | Bur0",
  description:
    "Scopri quanto risparmi con il Regime Forfettario vs Ordinario. Simulazione reale con i tuoi numeri, report PDF gratuito. Evita la trappola degli €85k.",
  keywords:
    "conviene forfettario o ordinario, regime forfettario simulatore, calcolo tasse partita iva, forfettario vs ordinario, limite 85k forfettario, regime forfettario 2025, calcolo netto partita iva, simulatore fiscale freelance, commercialista online",
  authors: [{ name: "Bur0" }],
  creator: "Bur0",
  publisher: "Bur0",
  metadataBase: new URL("https://bur0.click"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Conviene Forfettario o Ordinario? Simulatore 2025 | Bur0",
    description:
      "Scopri quanto risparmi con il Regime Forfettario vs Ordinario. Simulazione reale con i tuoi numeri, report PDF gratuito.",
    url: "https://bur0.click",
    siteName: "Bur0",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Bur0 - Simulatore Regime Forfettario",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conviene Forfettario o Ordinario? Simulatore 2025 | Bur0",
    description:
      "Scopri quanto risparmi con il Regime Forfettario vs Ordinario. Simulazione reale con i tuoi numeri.",
    images: ["/android-chrome-512x512.png"],
  },
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
  manifest: "/site.webmanifest",
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
  verification: {
    google: "G-9SZBH3PPKS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-9SZBH3PPKS`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9SZBH3PPKS');
            `,
          }}
        />
      </head>
      <body>
        <Navigation />
        <div className="pt-20 min-h-screen">{children}</div>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
