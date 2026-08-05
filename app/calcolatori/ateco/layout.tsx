import type { Metadata } from "next";
import { ATECO_CATALOG_NOMENCLATURE_YEAR } from "@/lib/ateco-data";
import { ATECO_RULESET_YEAR } from "@/lib/ateco-rules-2026";

export const metadata: Metadata = {
  title: `Trova il tuo Codice ATECO ${ATECO_RULESET_YEAR} - Ricerca per Attività | Bur0`,
  description: `Cerca il codice ATECO per la tua attività freelance o Partita IVA. Catalogo nomenclatura ${ATECO_CATALOG_NOMENCLATURE_YEAR}, coefficienti forfettario applicati ${ATECO_RULESET_YEAR}.`,
  keywords: `codice ateco ${ATECO_RULESET_YEAR}, trova codice ateco, ateco partita iva, coefficiente redditività forfettario, ateco freelance, ricerca codice ateco, ateco tabella`,
  alternates: {
    canonical: "/calcolatori/ateco",
  },
  openGraph: {
    title: `Trova il tuo Codice ATECO ${ATECO_RULESET_YEAR} | Bur0`,
    description: `Cerca per descrizione dell'attività e trova subito il codice ATECO e il coefficiente forfettario. Nomenclatura ${ATECO_CATALOG_NOMENCLATURE_YEAR}, regole ${ATECO_RULESET_YEAR}.`,
    url: "https://www.bur0.click/calcolatori/ateco",
    type: "website",
  },
};

export default function AtecoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Trova Codice ATECO ${ATECO_RULESET_YEAR} - Bur0`,
    description: `Strumento di ricerca codici ATECO per Partita IVA e Regime Forfettario. Catalogo ${ATECO_CATALOG_NOMENCLATURE_YEAR}, regole fiscali ${ATECO_RULESET_YEAR}.`,
    url: "https://www.bur0.click/calcolatori/ateco",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
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
