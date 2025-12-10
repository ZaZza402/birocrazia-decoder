import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Simulatore Regime Forfettario 2025 - Calcolo Tasse Partita IVA | Bur0",
  description:
    "Calcola esattamente quanto risparmi tra Regime Forfettario e Ordinario. Inserisci i tuoi dati, visualizza la Tax Cliff a €100k, scarica il report PDF gratuito per il commercialista.",
  keywords:
    "simulatore regime forfettario, calcolo tasse partita iva 2025, forfettario vs ordinario, tax cliff 100k, calcolo netto freelance, regime forfettario conviene, aliquota forfettario 2025, partita iva simulatore",
  alternates: {
    canonical: "/calcolatori/forfettario",
  },
  openGraph: {
    title: "Simulatore Regime Forfettario 2025 | Bur0",
    description:
      "Calcola esattamente quanto risparmi tra Regime Forfettario e Ordinario. Report PDF gratuito.",
    url: "https://bur0.click/calcolatori/forfettario",
    type: "website",
  },
};

export default function ForfettarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const calculatorSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Simulatore Regime Forfettario Bur0",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description:
      "Calcola la convenienza tra Regime Forfettario e Ordinario con visualizzazione Tax Cliff e report PDF dettagliato.",
    featureList: [
      "Calcolo IRPEF e INPS",
      "Confronto Forfettario vs Ordinario",
      "Visualizzazione Tax Cliff €100k",
      "Report PDF scaricabile",
      "Simulazione B2B e B2C",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      {children}
    </>
  );
}
