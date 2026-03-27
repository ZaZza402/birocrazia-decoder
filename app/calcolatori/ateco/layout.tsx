import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trova il tuo Codice ATECO 2026 — Ricerca per Attività | Bur0",
  description:
    "Cerca il codice ATECO 2026 per la tua attività freelance o Partita IVA. Trova il coefficiente di redditività per il Regime Forfettario in pochi secondi.",
  keywords:
    "codice ateco 2026, trova codice ateco, ateco partita iva, coefficiente redditività forfettario, ateco freelance, ricerca codice ateco, ateco tabella 2026",
  alternates: {
    canonical: "/calcolatori/ateco",
  },
  openGraph: {
    title: "Trova il tuo Codice ATECO 2026 | Bur0",
    description:
      "Cerca per descrizione dell'attività e trova subito il codice ATECO e il coefficiente forfettario. Aggiornato ATECO 2026.",
    url: "https://bur0.click/calcolatori/ateco",
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
    name: "Trova Codice ATECO 2026 — Bur0",
    description:
      "Strumento di ricerca codici ATECO 2026 per Partita IVA e Regime Forfettario. Scrivi la tua attività e trova subito codice e coefficiente.",
    url: "https://bur0.click/calcolatori/ateco",
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
