import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";
import TopLoader from "./components/top-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bur0 - Decodifica la Burocrazia",
  description:
    "Traduci la burocrazia in verità. Incolla documenti burocratici incomprensibili e ottieni spiegazioni in italiano brutale.",
  keywords: [
    "burocrazia",
    "documenti",
    "decodifica",
    "AI",
    "Italia",
    "semplificazione",
  ],
  authors: [{ name: "Bur0" }],
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
    title: "Bur0 - Decodifica la Burocrazia",
    description:
      "Traduci documenti burocratici incomprensibili in italiano brutale con l'AI.",
    url: "https://www.bur0.click",
    siteName: "Bur0",
    images: [
      {
        url: "/og-image.png", // Placeholder - add your OG image here
        width: 1200,
        height: 630,
        alt: "Bur0 - Decodifica la Burocrazia",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bur0 - Decodifica la Burocrazia",
    description:
      "Traduci documenti burocratici incomprensibili in italiano brutale con l'AI.",
    images: ["/og-image.png"], // Placeholder - add your OG image here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="it" className="overflow-x-hidden">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
        >
          <Suspense fallback={null}>
            <TopLoader />
          </Suspense>
          <header className="fixed top-0 right-0 p-4 z-50">
            <SignedOut>
              <div className="flex gap-2">
                <Link
                  href="/sign-in"
                  className="border-2 border-black bg-white text-black px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  ACCEDI
                </Link>
                <Link
                  href="/sign-up"
                  className="border-2 border-black bg-yellow-300 text-black px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  REGISTRATI
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="border-2 border-black bg-white text-black px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  DASHBOARD
                </Link>
                <div className="border-2 border-black bg-white p-1 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
