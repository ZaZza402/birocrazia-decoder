import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax Cliff Monitor 2026 — Traccia il Fatturato Mensile | Bur0",
  description:
    "Monitora mese per mese quanto sei lontano dalla Tax Cliff di €100.000 del Regime Forfettario. Gratuito, dati solo nel browser, nessun account.",
  keywords:
    "tax cliff 100000 partita iva, monitoraggio fatturato forfettario, limite regime forfettario 2026, tracker fatturato annuale, quando esco dal forfettario",
  alternates: {
    canonical: "/calcolatori/cliff",
  },
  openGraph: {
    title: "Tax Cliff Monitor 2026 | Bur0",
    description:
      "Traccia il tuo fatturato mensile e scopri quando sei vicino alla Tax Cliff di €100.000.",
    url: "https://www.bur0.click/calcolatori/cliff",
    type: "website",
  },
};

export default function CliffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Tax Cliff Monitor Bur0",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description:
      "Traccia il fatturato mensile del Regime Forfettario e monitora la distanza dalla Tax Cliff di €100.000.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
