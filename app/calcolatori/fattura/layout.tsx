import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generatore Fattura Freelance 2025 - Crea e Scarica PDF | BurZero",
  description:
    "Crea fatture professionali in PDF gratis. Supporta Regime Forfettario (esenzione IVA), ritenuta d'acconto 20%, marca da bollo automatica. Logo drag & drop. Nessun account richiesto.",
  keywords:
    "generatore fattura freelance, fattura regime forfettario, fattura senza iva, ritenuta d'acconto 20%, marca da bollo, generatore fattura pdf, fattura partita iva, crea fattura gratis",
  alternates: {
    canonical: "/calcolatori/fattura",
  },
  openGraph: {
    title: "Generatore Fattura Freelance 2025 | BurZero",
    description:
      "Crea fatture professionali in PDF. Forfettario, ritenuta d'acconto, marca da bollo. Gratis, nessun account.",
    url: "https://bur0.click/calcolatori/fattura",
    type: "website",
  },
};

export default function FatturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Generatore Fattura BurZero",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description:
      "Genera fatture PDF professionali con supporto per Regime Forfettario, ritenuta d'acconto e marca da bollo automatica.",
    featureList: [
      "Fattura PDF scaricabile",
      "Supporto Regime Forfettario (esenzione IVA)",
      "Ritenuta d'acconto 20%",
      "Marca da bollo automatica >€77.47",
      "Upload logo drag & drop",
      "Nessun account richiesto",
    ],
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
