import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Calcola Acconto Imposta Sostitutiva 2026 — Scadenza 30 Novembre | Bur0",
  description:
    "Calcola l'acconto dell'imposta sostitutiva del Regime Forfettario. Scopri quanto pagare entro il 30 giugno e il 30 novembre. Metodo storico e previsionale.",
  keywords:
    "acconto imposta sostitutiva forfettario, acconto irpef partita iva, scadenza 30 novembre acconto, f24 1791 forfettario, quanto pago acconto forfettario 2026",
  alternates: {
    canonical: "/calcolatori/acconto",
  },
  openGraph: {
    title: "Calcola Acconto Imposta Sostitutiva 2026 | Bur0",
    description:
      "Scopri quanto devi pagare di acconto sull'imposta sostitutiva e quando. Scadenza 30 novembre.",
    url: "https://www.bur0.click/calcolatori/acconto",
    type: "website",
  },
};

export default function AccontoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Calcolatore Acconto Imposta Sostitutiva Bur0",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description:
      "Calcola l'acconto dell'imposta sostitutiva del Regime Forfettario con metodo storico e previsionale.",
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
